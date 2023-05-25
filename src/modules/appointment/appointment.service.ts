import { Injectable, Logger } from '@nestjs/common'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import IsSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import utc from 'dayjs/plugin/utc'
import { difference, isEmpty, sortBy, uniq } from 'lodash'
import type {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { EAppointmentStatus } from '@/common/enum/appointment.enum'
import { EDateFilterCondition, EStringFilterCondition } from '@/common/enum/queryCondition.enum'
import { convertDayOfWeekToName, getChangedFields } from '@/common/helper'
import type { CategoryScheduleModel } from '@/modules/category/category.model'
import { CategoryService } from '@/modules/category/category.service'
import type { WorkerModel } from '@/modules/worker/worker.model'
import { WorkerService } from '@/modules/worker/worker.service'
import { convertAppointmentToSchedule, convertscheduleToSlots } from './appointment.helper'
import { AppointmentRepository } from './appointment.repository'
import type {
  AppointmentCreateInput,
  AppointmentFindManyQueryInput,
  AppointmentGetAvailableSlotsByDateInput,
  AppointmentSearchQueryInput,
  AppointmentUpdateInput
} from './appointment.dto'
import type { Appointment } from './appointment.entity'
import type {
  AppointmentModel,
  OffsetPaginatedAppointments,
  PaginatedAppointments
} from './appointment.model'
import type { Types } from 'mongoose'
dayjs.extend(IsSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(utc)

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name)
  constructor(
    private readonly repository: AppointmentRepository,
    private readonly categoryService: CategoryService,
    private readonly workerService: WorkerService
  ) {}

  async create(input: AppointmentCreateInput): Promise<AppointmentModel> {
    const newEntity = await this.repository.create(input)
    return newEntity
  }

  async updateById(id: Types.ObjectId, input: AppointmentUpdateInput): Promise<AppointmentModel> {
    const entity = await this.repository.findById(id)

    const updatedData = getChangedFields<Appointment>(entity, input)

    if (isEmpty(updatedData)) return entity

    const updatedEntity = await this.repository.updateById(id, updatedData)
    return updatedEntity
  }

  async findById(id: Types.ObjectId): Promise<AppointmentModel> {
    const entity = await this.repository.findById(id)
    return entity
  }

  async findMany(input: AppointmentFindManyQueryInput) {
    return await this.repository.findMany(input)
  }

  async lazySearch(input: PaginationInput): Promise<PaginatedAppointments> {
    const paginatedEntities = await this.repository.lazySearch(input)
    return paginatedEntities
  }

  async search(
    paginationInput: OffsetPaginationInput,
    queryInput?: AppointmentSearchQueryInput,
    optionInput?: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedAppointments> {
    const paginatedEntities = await this.repository.search(paginationInput, queryInput, optionInput)
    return paginatedEntities
  }

  async getAvailableSlots(input: AppointmentGetAvailableSlotsByDateInput): Promise<number[]> {
    const category = await this.categoryService.findById(input.categoryId)

    const date = dayjs(input.date).startOf('day').toDate()

    const workers = await this.workerService.findMany({
      categoryId: { value: input.categoryId }
    })

    if (isEmpty(workers)) return []

    const availableSlotByDate: number[] = await this._getAvailableSlotsByDate(
      category.schedule,
      workers,
      date
    )

    return availableSlotByDate
  }

  /* Private methods */
  private async _getAvailableSlotsByDate(
    categorySchedule: CategoryScheduleModel,
    workers: WorkerModel[],
    date: Date
  ): Promise<number[]> {
    const availableSlots: number[] = []
    for (const worker of workers) {
      const workerAvailableSlots = await this._getWorkerAvailableSlotsByDate(
        categorySchedule,
        worker,
        date
      )
      availableSlots.push(...workerAvailableSlots)
    }
    return sortBy(uniq(availableSlots))
  }

  private async _getWorkerAvailableSlotsByDate(
    categorySchedule: CategoryScheduleModel,
    worker: WorkerModel,
    date: Date
  ): Promise<number[]> {
    const currentDate = dayjs(date)
    const workerAppointments = await this.repository.findMany({
      workerId: { value: worker._id },
      startDate: {
        value: currentDate.endOf('day').toDate(),
        condition: EDateFilterCondition.BETWEEN_EQUALS_FROM,
        options: {
          from: currentDate.toDate()
        }
      },
      status: { value: EAppointmentStatus.CANCELLED, condition: EStringFilterCondition.NOT_EQUALS }
    })

    let availableSlots: number[] = []
    const dayOfWeek = convertDayOfWeekToName(currentDate.day())
    availableSlots = uniq(
      worker.schedule[dayOfWeek].map(convertscheduleToSlots(categorySchedule)).flat()
    )

    if (!isEmpty(workerAppointments)) {
      const notAvailableSlots = workerAppointments
        .map(convertAppointmentToSchedule)
        .map(convertscheduleToSlots(categorySchedule))
        .flat()
      availableSlots = difference(availableSlots, notAvailableSlots)
    }

    return availableSlots
  }
}
