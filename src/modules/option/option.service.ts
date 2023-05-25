import { Injectable, Logger } from '@nestjs/common'
import { isEmpty } from 'lodash'
import type {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { getChangedFields } from '@/common/helper'
import type { SuccessRes } from '@/common/model'
import { OptionRepository } from './option.repository'
import type {
  OptionCreateInput,
  OptionFindManyQueryInput,
  OptionSearchQueryInput,
  OptionUpdateInput
} from './option.dto'
import type { Option } from './option.entity'
import type { OptionModel, OffsetPaginatedOptions, PaginatedOptions } from './option.model'
import type { Types } from 'mongoose'

@Injectable()
export class OptionService {
  private readonly logger = new Logger(OptionService.name)
  constructor(private readonly repository: OptionRepository) {}

  async create(input: OptionCreateInput): Promise<OptionModel> {
    const newEntity = await this.repository.create(input)
    return newEntity
  }

  async updateById(id: Types.ObjectId, input: OptionUpdateInput): Promise<OptionModel> {
    const entity = await this.repository.findById(id)

    const updatedData = getChangedFields<Option>(entity, input)

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

  async findById(id: Types.ObjectId): Promise<OptionModel> {
    const entity = await this.repository.findById(id)
    return entity
  }

  async lazySearch(input: PaginationInput): Promise<PaginatedOptions> {
    const paginatedEntities = await this.repository.lazySearch(input)
    return paginatedEntities
  }

  async search(
    paginationInput: OffsetPaginationInput,
    queryInput?: OptionSearchQueryInput,
    optionInput?: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedOptions> {
    const paginatedEntities = await this.repository.search(paginationInput, queryInput, optionInput)
    return paginatedEntities
  }

  async findMany(input: OptionFindManyQueryInput) {
    return await this.repository.findMany(input)
  }
}
