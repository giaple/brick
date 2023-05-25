import { Injectable, Logger } from '@nestjs/common'
import { isEmpty } from 'lodash'
import type {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { getChangedFields } from '@/common/helper'
import type { SuccessRes } from '@/common/model'
import { ItemRepository } from './item.repository'
import type {
  ItemCreateInput,
  ItemFindManyQueryInput,
  ItemSearchQueryInput,
  ItemUpdateInput
} from './item.dto'
import type { Item } from './item.entity'
import type { ItemModel, OffsetPaginatedItems, PaginatedItems } from './item.model'
import type { Types } from 'mongoose'

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name)
  constructor(private readonly repository: ItemRepository) {}

  async create(input: ItemCreateInput): Promise<ItemModel> {
    const newEntity = await this.repository.create(input)
    return newEntity
  }

  async updateById(id: Types.ObjectId, input: ItemUpdateInput): Promise<ItemModel> {
    const entity = await this.repository.findById(id)

    const updatedData = getChangedFields<Item>(entity, input)

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

  async findById(id: Types.ObjectId): Promise<ItemModel> {
    const entity = await this.repository.findById(id)
    return entity
  }

  async findMany(input: ItemFindManyQueryInput) {
    return await this.repository.findMany(input)
  }

  async lazySearch(input: PaginationInput): Promise<PaginatedItems> {
    const paginatedEntities = await this.repository.lazySearch(input)
    return paginatedEntities
  }

  async search(
    paginationInput: OffsetPaginationInput,
    queryInput?: ItemSearchQueryInput,
    optionInput?: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedItems> {
    const paginatedEntities = await this.repository.search(paginationInput, queryInput, optionInput)
    return paginatedEntities
  }
}
