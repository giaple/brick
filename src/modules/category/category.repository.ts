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
import { Category } from './category.entity'
import type {
  CategoryCreateInput,
  CategoryFindManyQueryInput,
  CategorySearchQueryInput,
  CategoryUpdateInput
} from './category.dto'
import type { OffsetPaginatedCategories, PaginatedCategories } from './category.model'
import type { FilterQuery } from 'mongoose'

@Injectable()
export class CategoryRepository {
  lazySearch: (input: PaginationInput) => Promise<PaginatedCategories>
  search: (
    paginationArgs: OffsetPaginationInput,
    queryArgs?: CategorySearchQueryInput,
    optionArgs?: OffsetPaginationOptionInput
  ) => Promise<OffsetPaginatedCategories>

  constructor(@InjectModel(Category.name) private readonly model: Model<Category>) {
    this.lazySearch = buildLazySearch<Category>(model)
    this.search = buildOffsetSearch<Category, CategorySearchQueryInput>(
      model,
      this._buildQuerySearchCondition
    )
  }

  async create(input: CategoryCreateInput) {
    const entity = await this.model.create(input)
    return entity
  }

  async updateById(id: Types.ObjectId, input: CategoryUpdateInput) {
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

  async findMany(input: CategoryFindManyQueryInput) {
    const queryCondition = this._buildQueryFindManyCondition(input)

    const entities = await this.model.find(queryCondition)

    return entities
  }

  private _buildQueryFindManyCondition(input: CategoryFindManyQueryInput) {
    const queryCondition: FilterQuery<CategoryFindManyQueryInput> = {}

    if (input.ids) {
      queryCondition._id = { $in: input.ids.map((id) => new Types.ObjectId(id)) }
    }

    return queryCondition
  }

  private _buildQuerySearchCondition(input: CategorySearchQueryInput) {
    const queryCondition: FilterQuery<CategorySearchQueryInput> = {}

    if (input.isDeleted) {
      queryCondition.isDeleted = buildQueryCondition(input.isDeleted)
    } else {
      queryCondition.isDeleted = { $ne: true }
    }

    return queryCondition
  }
}
