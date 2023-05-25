import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import type {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { EErrorMessage } from '@/common/enum/error.enum'
import { buildOffsetSearch } from '@/common/helper/offsetPagination.helper'
import { buildLazySearch } from '@/common/helper/pagination.helper'
import { buildQueryCondition } from '@/common/helper/queryCondition.helper'
import { Appointment } from './appointment.entity'
import type {
  AppointmentCreateInput,
  AppointmentFindManyQueryInput,
  AppointmentSearchQueryInput,
  AppointmentUpdateInput
} from './appointment.dto'
import type { OffsetPaginatedAppointments, PaginatedAppointments } from './appointment.model'
import type { FilterQuery } from 'mongoose'

@Injectable()
export class AppointmentRepository {
  lazySearch: (input: PaginationInput) => Promise<PaginatedAppointments>
  search: (
    paginationArgs: OffsetPaginationInput,
    queryArgs?: AppointmentSearchQueryInput,
    optionArgs?: OffsetPaginationOptionInput
  ) => Promise<OffsetPaginatedAppointments>

  constructor(@InjectModel(Appointment.name) private readonly model: Model<Appointment>) {
    this.lazySearch = buildLazySearch<Appointment>(model)
    this.search = buildOffsetSearch<Appointment, AppointmentSearchQueryInput>(
      model,
      this._buildQuerySearchCondition
    )
  }

  async create(input: AppointmentCreateInput) {
    const entity = await this.model.create(input)
    return entity
  }

  async updateById(id: Types.ObjectId, input: AppointmentUpdateInput) {
    const entity = await this.model.findByIdAndUpdate(
      id,
      { $set: input },
      {
        new: true
      }
    )
    if (!entity) throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND)

    return entity
  }

  async findById(id: Types.ObjectId) {
    const entity = await this.model.findById(id)
    if (!entity) throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND)
    return entity
  }

  async findMany(input: AppointmentFindManyQueryInput) {
    const queryCondition = this._buildQueryFindManyCondition(input)

    const entities = await this.model.find(queryCondition)

    return entities
  }

  private _buildQueryFindManyCondition(input: AppointmentFindManyQueryInput) {
    const queryCondition: FilterQuery<AppointmentFindManyQueryInput> = {}

    if (input.ids) {
      queryCondition._id = { $in: input.ids.map((id) => new Types.ObjectId(id)) }
    }

    if (input.workerId) {
      queryCondition.workerId = buildQueryCondition(input.workerId)
    }

    if (input.startDate) {
      queryCondition.startDate = buildQueryCondition(input.startDate)
    }

    return queryCondition
  }

  private _buildQuerySearchCondition(input: AppointmentSearchQueryInput) {
    const queryCondition: FilterQuery<AppointmentSearchQueryInput> = {}

    return queryCondition
  }
}
