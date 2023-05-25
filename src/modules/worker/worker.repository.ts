import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import type {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { EErrorMessage } from '@/common/enum/error.enum'
import { ESuccessMessage } from '@/common/enum/response.enum'
import { buildOffsetSearch } from '@/common/helper/offsetPagination.helper'
import { buildLazySearch } from '@/common/helper/pagination.helper'
import { buildQueryCondition } from '@/common/helper/queryCondition.helper'
import { Worker } from './worker.entity'
import type {
  WorkerCreateInput,
  WorkerFindManyQueryInput,
  WorkerSearchQueryInput,
  WorkerUpdateInput
} from './worker.dto'
import type { OffsetPaginatedWorkers, PaginatedWorkers } from './worker.model'
import type { FilterQuery } from 'mongoose'

@Injectable()
export class WorkerRepository {
  lazySearch: (input: PaginationInput) => Promise<PaginatedWorkers>
  search: (
    paginationArgs: OffsetPaginationInput,
    queryArgs?: WorkerSearchQueryInput,
    optionArgs?: OffsetPaginationOptionInput
  ) => Promise<OffsetPaginatedWorkers>

  constructor(@InjectModel(Worker.name) private readonly model: Model<Worker>) {
    this.lazySearch = buildLazySearch<Worker>(model)
    this.search = buildOffsetSearch<Worker, WorkerSearchQueryInput>(
      model,
      this._buildQuerySearchCondition
    )
  }

  async create(input: WorkerCreateInput) {
    const entity = await this.model.create(input)
    return entity
  }

  async updateById(id: Types.ObjectId, input: WorkerUpdateInput) {
    const entity = await this.model.findByIdAndUpdate(
      id,
      { $set: input },
      {
        new: true
      }
    )
    if (!entity) throw new NotFoundException(EErrorMessage.USER_NOT_FOUND)

    return entity
  }

  async deleteById(id: Types.ObjectId) {
    await this.model.findByIdAndDelete(id)

    return {
      success: true,
      message: ESuccessMessage.DELETE_SUCCESS
    }
  }

  async removeById(id: Types.ObjectId) {
    await this.model.findByIdAndUpdate(id, {
      $set: {
        isDeleted: true,
        deletedAt: new Date()
      }
    })

    return {
      success: true,
      message: ESuccessMessage.DELETE_SUCCESS
    }
  }

  async findById(id: Types.ObjectId) {
    const entity = await this.model.findById(id)
    if (!entity) throw new NotFoundException(EErrorMessage.USER_NOT_FOUND)
    return entity
  }

  async findByPhoneNumber(phoneNumber: string) {
    const entity = await this.model.findOne({
      phoneNumber
    })
    if (!entity) throw new NotFoundException(EErrorMessage.USER_NOT_FOUND)
    return entity
  }

  async findMany(input: WorkerFindManyQueryInput) {
    const queryCondition = this._buildQueryFindManyCondition(input)

    const entities = await this.model.find(queryCondition)

    return entities
  }

  /* Private methods */
  private _buildQueryFindManyCondition(input: WorkerFindManyQueryInput) {
    const queryCondition: FilterQuery<WorkerFindManyQueryInput> = {}

    if (input.ids) {
      queryCondition._id = { $in: input.ids.map((id) => new Types.ObjectId(id)) }
    }

    if (input.categoryId) {
      queryCondition.categoryId = buildQueryCondition(input.categoryId)
    }

    return queryCondition
  }

  private _buildQuerySearchCondition(input: WorkerSearchQueryInput) {
    const queryCondition: FilterQuery<WorkerSearchQueryInput> = {}

    if (input.isDeleted) {
      queryCondition.isDeleted = buildQueryCondition(input.isDeleted)
    } else {
      queryCondition.isDeleted = { $ne: true }
    }

    return queryCondition
  }
}
