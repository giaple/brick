import { Injectable, Logger } from '@nestjs/common'
import { isEmpty } from 'lodash'
import type {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { getChangedFields } from '@/common/helper'
import type { SuccessRes } from '@/common/model'
import { CategoryRepository } from './category.repository'
import type {
  CategoryCreateInput,
  CategoryFindManyQueryInput,
  CategorySearchQueryInput,
  CategoryUpdateInput
} from './category.dto'
import type { Category } from './category.entity'
import type {
  CategoryModel,
  OffsetPaginatedCategories,
  PaginatedCategories
} from './category.model'
import type { Types } from 'mongoose'

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name)
  constructor(private readonly repository: CategoryRepository) {}

  async create(input: CategoryCreateInput): Promise<CategoryModel> {
    const newEntity = await this.repository.create(input)
    return newEntity
  }

  async updateById(id: Types.ObjectId, input: CategoryUpdateInput): Promise<CategoryModel> {
    const entity = await this.repository.findById(id)

    const updatedData = getChangedFields<Category>(entity, input)

    if (isEmpty(updatedData)) return entity

    if ('isActive' in updatedData && typeof updatedData.isActive === 'boolean') {
      updatedData.deactivatedAt = updatedData.isActive ? null : new Date()
    }

    const updatedEntity = await this.repository.updateById(id, updatedData)
    return updatedEntity
  }

  async deleteById(id: Types.ObjectId, isForce?: boolean): Promise<SuccessRes> {
    await this.repository.findById(id)

    if (isForce) {
      return await this.repository.deleteById(id)
    }

    return await this.repository.removeById(id)
  }

  async findById(id: Types.ObjectId): Promise<CategoryModel> {
    const entity = await this.repository.findById(id)
    return entity
  }

  async lazySearch(input: PaginationInput): Promise<PaginatedCategories> {
    const paginatedEntities = await this.repository.lazySearch(input)
    return paginatedEntities
  }

  async search(
    paginationInput: OffsetPaginationInput,
    queryInput?: CategorySearchQueryInput,
    optionInput?: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedCategories> {
    const paginatedEntities = await this.repository.search(paginationInput, queryInput, optionInput)
    return paginatedEntities
  }

  async findMany(input: CategoryFindManyQueryInput) {
    return await this.repository.findMany(input)
  }
}
