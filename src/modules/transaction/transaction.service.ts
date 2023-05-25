import { Injectable, Logger } from '@nestjs/common'
import { isEmpty } from 'lodash'
import type {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { getChangedFields } from '@/common/helper'
import { TransactionRepository } from './transaction.repository'
import type {
  TransactionCreateInput,
  TransactionFindManyQueryInput,
  TransactionSearchQueryInput,
  TransactionUpdateInput
} from './transaction.dto'
import type { Transaction } from './transaction.entity'
import type {
  TransactionModel,
  OffsetPaginatedTransactions,
  PaginatedTransactions
} from './transaction.model'
import type { Types } from 'mongoose'

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name)
  constructor(private readonly repository: TransactionRepository) {}

  async create(input: TransactionCreateInput): Promise<TransactionModel> {
    const newEntity = await this.repository.create(input)
    return newEntity
  }

  async updateById(id: Types.ObjectId, input: TransactionUpdateInput): Promise<TransactionModel> {
    const entity = await this.repository.findById(id)

    const updatedData = getChangedFields<Transaction>(entity, input)

    if (isEmpty(updatedData)) return entity

    const updatedEntity = await this.repository.updateById(id, updatedData)
    return updatedEntity
  }

  async findById(id: Types.ObjectId): Promise<TransactionModel> {
    const entity = await this.repository.findById(id)
    return entity
  }

  async lazySearch(input: PaginationInput): Promise<PaginatedTransactions> {
    const paginatedEntities = await this.repository.lazySearch(input)
    return paginatedEntities
  }

  async search(
    paginationInput: OffsetPaginationInput,
    queryInput?: TransactionSearchQueryInput,
    optionInput?: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedTransactions> {
    const paginatedEntities = await this.repository.search(paginationInput, queryInput, optionInput)
    return paginatedEntities
  }

  async findMany(input: TransactionFindManyQueryInput) {
    return await this.repository.findMany(input)
  }
}
