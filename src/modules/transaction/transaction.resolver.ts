import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Types } from 'mongoose'
import {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import { TransactionSearchQueryInput, TransactionUpdateInput } from './transaction.dto'
import {
  OffsetPaginatedTransactions,
  PaginatedTransactions,
  TransactionModel
} from './transaction.model'
import { TransactionService } from './transaction.service'

@Resolver(() => TransactionModel)
export class TransactionResolver {
  constructor(private readonly service: TransactionService) {}

  @Mutation(() => TransactionModel, { name: 'updateTransactionById' })
  async updateById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => TransactionUpdateInput }) input: TransactionUpdateInput
  ) {
    return await this.service.updateById(id, input)
  }

  @Query(() => TransactionModel, { name: 'findTransactionById' })
  async findById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId
  ): Promise<TransactionModel> {
    return await this.service.findById(id)
  }

  @Query(() => PaginatedTransactions, { name: 'lazyTransactionSearch' })
  async lazySearch(
    @Args('input', { type: () => PaginationInput }) input: PaginationInput
  ): Promise<PaginatedTransactions> {
    return await this.service.lazySearch(input)
  }

  @Query(() => OffsetPaginatedTransactions, { name: 'transactionSearch' })
  async search(
    @Args('paginationInput', { type: () => OffsetPaginationInput })
    paginationInput: OffsetPaginationInput,
    @Args('queryInput', { type: () => TransactionSearchQueryInput, nullable: true })
    queryInput: TransactionSearchQueryInput,
    @Args('optionInput', { type: () => OffsetPaginationOptionInput, nullable: true })
    optionInput: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedTransactions> {
    return await this.service.search(paginationInput, queryInput, optionInput)
  }
}
