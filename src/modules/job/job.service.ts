import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import type {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { EAppointmentStatus } from '@/common/enum/appointment.enum'
import { EErrorMessage } from '@/common/enum/error.enum'
import { EJobStatus } from '@/common/enum/job.enum'
import { ETransactionStatus } from '@/common/enum/transaction.enum'
import { getChangedFields } from '@/common/helper'
import { AppointmentService } from '@/modules/appointment/appointment.service'
import { CustomerService } from '@/modules/customer/customer.service'
import { TransactionService } from '@/modules/transaction/transaction.service'
import { WorkerService } from '@/modules/worker/worker.service'
import { JobRepository } from './job.repository'
import type {
  JobAssignWorkerInput,
  JobCreateInput,
  JobItemsUpdateInput,
  JobSearchQueryInput,
  JobUpdateInput,
  JobUpdateStatusInput
} from './job.dto'
import type { Job } from './job.entity'
import type { JobModel, OffsetPaginatedJobs, PaginatedJobs } from './job.model'
import type { Types } from 'mongoose'

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name)
  constructor(
    private readonly repository: JobRepository,
    private readonly customerService: CustomerService,
    private readonly workerService: WorkerService,
    private readonly transactionService: TransactionService,
    private readonly appointmentService: AppointmentService
  ) {}

  async create(input: JobCreateInput): Promise<JobModel> {
    if (!input.customerId) {
      input.customerId = (
        await this.customerService.findOrCreateNew({
          phoneNumber: input.phoneNumber,
          firstName: input.customerName,
          address: input.address
        })
      )._id
    }

    const newTransaction = await this.transactionService.create({
      amount: input.finalTotalPrice,
      userId: input.customerId
    })

    const newAppointment = await this.appointmentService.create({
      customerId: input.customerId,
      startDate: input.startDate,
      endDate: input.endDate
    })

    const newEntity = await this.repository.create({
      ...input,
      transactionId: newTransaction._id,
      appointmentId: newAppointment._id
    })

    // Todo send calendar event
    return newEntity
  }

  async updateById(id: Types.ObjectId, input: JobUpdateInput): Promise<JobModel> {
    const entity = await this.repository.findById(id)

    const updatedData = getChangedFields<Job>(entity, input)

    if (isEmpty(updatedData)) return entity

    const updatedEntity = await this.repository.updateById(id, updatedData)
    return updatedEntity
  }

  async findById(id: Types.ObjectId): Promise<JobModel> {
    const entity = await this.repository.findById(id)
    return entity
  }

  async lazySearch(input: PaginationInput): Promise<PaginatedJobs> {
    const paginatedEntities = await this.repository.lazySearch(input)
    return paginatedEntities
  }

  async search(
    paginationInput: OffsetPaginationInput,
    queryInput?: JobSearchQueryInput,
    optionInput?: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedJobs> {
    const paginatedEntities = await this.repository.search(paginationInput, queryInput, optionInput)
    return paginatedEntities
  }

  async updateStatusById(id: Types.ObjectId, input: JobUpdateStatusInput): Promise<JobModel> {
    const { isPaid, ...rest } = input
    const entity = await this.repository.findById(id)

    const updatedData = getChangedFields<Job>(entity, rest)

    // Allow to re update schedule date
    if (entity.status === EJobStatus.RESCHEDULED && entity.status === rest.status) {
      updatedData.status = rest.status
    }

    if (isEmpty(updatedData)) return entity

    this._validateJobStatus(entity.status, updatedData.status)

    switch (updatedData.status) {
      case EJobStatus.CONTACTED:
        updatedData.contactedAt = new Date()
        break

      case EJobStatus.IN_PROCESS:
        updatedData.inProgressAt = new Date()
        break

      case EJobStatus.RESCHEDULED:
        updatedData.rescheduledAt = new Date()
        if (!updatedData.startDate)
          throw new BadRequestException(EErrorMessage.JOB_RESCHEDULED_DATE_INVALID)

        // eslint-disable-next-line no-case-declarations
        const duration = dayjs(entity.endDate).diff(entity.startDate, 'minutes')
        updatedData.endDate = dayjs(updatedData.startDate).add(duration, 'minutes').toDate()

        await this.appointmentService.updateById(entity.appointmentId, {
          status: EAppointmentStatus.RESCHEDULED,
          startDate: updatedData.startDate,
          endDate: updatedData.endDate
        })
        break

      case EJobStatus.CANCELLED:
        updatedData.cancelledAt = new Date()
        await this.transactionService.updateById(entity.transactionId, {
          status: ETransactionStatus.CANCELLED
        })
        await this.appointmentService.updateById(entity.appointmentId, {
          status: EAppointmentStatus.CANCELLED
        })
        break

      case EJobStatus.DONE:
        updatedData.doneAt = new Date()
        if (isPaid)
          await this.transactionService.updateById(entity.transactionId, {
            status: ETransactionStatus.DONE
          })
        await this.appointmentService.updateById(entity.appointmentId, {
          status: EAppointmentStatus.DONE
        })
        break

      default:
        break
    }

    const updatedEntity = await this.repository.updateById(id, updatedData)

    return updatedEntity
  }

  async assignWorkerById(id: Types.ObjectId, input: JobAssignWorkerInput): Promise<JobModel> {
    const entity = await this.repository.findById(id)

    const worker = await this.workerService.findById(input.workerId)

    if (!worker.isAvailable || !worker.isActive || worker.isDeleted) {
      throw new BadRequestException(EErrorMessage.WORKER_NOT_AVAILABLE)
    }

    const updatedData = getChangedFields<Job>(entity, input)

    if (isEmpty(updatedData)) return entity

    // Todo add Transaction atom
    const updatedEntity = await this.repository.updateById(id, updatedData)

    await this.appointmentService.updateById(updatedEntity.appointmentId, {
      workerId: input.workerId
    })
    return updatedEntity
  }

  async updateItemsById(id: Types.ObjectId, input: JobItemsUpdateInput): Promise<JobModel> {
    const entity = await this.repository.findById(id)

    const updatedData = getChangedFields<Job>(entity, input)

    if (isEmpty(updatedData)) return entity

    updatedData.endDate = dayjs(entity.startDate).add(input.totalEstTime, 'minutes').toDate()

    const updatedEntity = await this.repository.updateById(id, updatedData)

    await this.transactionService.updateById(entity.transactionId, {
      amount: input.finalTotalPrice
    })

    await this.appointmentService.updateById(entity.appointmentId, { endDate: updatedData.endDate })

    return updatedEntity
  }

  /* Private Methods */

  private _validateJobStatus(oldStatus: EJobStatus, newStatus: EJobStatus) {
    if (
      oldStatus === EJobStatus.CANCELLED ||
      oldStatus === EJobStatus.DONE ||
      newStatus === EJobStatus.POSTED ||
      (newStatus === EJobStatus.CONTACTED &&
        [EJobStatus.IN_PROCESS, EJobStatus.RESCHEDULED].includes(oldStatus)) ||
      (oldStatus === EJobStatus.POSTED &&
        [EJobStatus.DONE, EJobStatus.IN_PROCESS, EJobStatus.RESCHEDULED].includes(newStatus)) ||
      ([EJobStatus.CONTACTED, EJobStatus.RESCHEDULED].includes(oldStatus) &&
        newStatus === EJobStatus.DONE)
    ) {
      throw new BadRequestException(EErrorMessage.JOB_STATUS_NOT_ALLOWED_TO_CHANGE)
    }
  }
}
