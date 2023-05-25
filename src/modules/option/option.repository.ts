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
import { Option } from './option.entity'
import type {
  OptionCreateInput,
  OptionFindManyQueryInput,
  OptionSearchQueryInput,
  OptionUpdateInput
} from './option.dto'
import type { OffsetPaginatedOptions, PaginatedOptions } from './option.model'
import type { FilterQuery } from 'mongoose'

@Injectable()
export class OptionRepository {
  lazySearch: (input: PaginationInput) => Promise<PaginatedOptions>
  search: (
    paginationArgs: OffsetPaginationInput,
    queryArgs?: OptionSearchQueryInput,
    optionArgs?: OffsetPaginationOptionInput
  ) => Promise<OffsetPaginatedOptions>

  constructor(@InjectModel(Option.name) private readonly model: Model<Option>) {
    this.lazySearch = buildLazySearch<Option>(model)
    this.search = buildOffsetSearch<Option, OptionSearchQueryInput>(
      model,
      this._buildQuerySearchCondition
    )
  }

  async create(input: OptionCreateInput) {
    const entity = await this.model.create(input)
    return entity
  }

  async updateById(id: Types.ObjectId, input: OptionUpdateInput) {
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
    if (!entity) throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND)
    return entity
  }

  async findMany(input: OptionFindManyQueryInput) {
    const queryCondition = this._buildQueryFindManyCondition(input)

    const entities = await this.model.find(queryCondition)

    return entities
  }

  private _buildQueryFindManyCondition(input: OptionFindManyQueryInput) {
    const queryCondition: FilterQuery<OptionFindManyQueryInput> = {}

    if (input.ids) {
      queryCondition._id = { $in: input.ids.map((id) => new Types.ObjectId(id)) }
    }

    return queryCondition
  }

  private _buildQuerySearchCondition(input: OptionSearchQueryInput) {
    const queryCondition: FilterQuery<OptionSearchQueryInput> = {}

    if (input.isDeleted) {
      queryCondition.isDeleted = buildQueryCondition(input.isDeleted)
    } else {
      queryCondition.isDeleted = { $ne: true }
    }

    if (input.categoryId) {
      queryCondition.categoryId = buildQueryCondition(input.categoryId)
    }

    return queryCondition
  }
}
