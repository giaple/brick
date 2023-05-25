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
import { Transaction } from './transaction.entity'
import type {
  TransactionCreateInput,
  TransactionFindManyQueryInput,
  TransactionSearchQueryInput,
  TransactionUpdateInput
} from './transaction.dto'
import type { OffsetPaginatedTransactions, PaginatedTransactions } from './transaction.model'
import type { FilterQuery } from 'mongoose'

@Injectable()
export class TransactionRepository {
  lazySearch: (input: PaginationInput) => Promise<PaginatedTransactions>
  search: (
    paginationArgs: OffsetPaginationInput,
    queryArgs?: TransactionSearchQueryInput,
    optionArgs?: OffsetPaginationOptionInput
  ) => Promise<OffsetPaginatedTransactions>

  constructor(@InjectModel(Transaction.name) private readonly model: Model<Transaction>) {
    this.lazySearch = buildLazySearch<Transaction>(model)
    this.search = buildOffsetSearch<Transaction, TransactionSearchQueryInput>(
      model,
      this._buildQuerySearchCondition
    )
  }

  async create(input: TransactionCreateInput) {
    const entity = await this.model.create(input)
    return entity
  }

  async updateById(id: Types.ObjectId, input: TransactionUpdateInput) {
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

  async findMany(input: TransactionFindManyQueryInput) {
    const queryCondition = this._buildQueryFindManyCondition(input)

    const entities = await this.model.find(queryCondition)

    return entities
  }

  private _buildQueryFindManyCondition(input: TransactionFindManyQueryInput) {
    const queryCondition: FilterQuery<TransactionFindManyQueryInput> = {}

    if (input.ids) {
      queryCondition._id = { $in: input.ids.map((id) => new Types.ObjectId(id)) }
    }

    return queryCondition
  }

  private _buildQuerySearchCondition(input: TransactionSearchQueryInput) {
    const queryCondition: FilterQuery<TransactionSearchQueryInput> = {}

    return queryCondition
  }
}
