import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Types } from 'mongoose'
import {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { SuccessRes } from '@/common/model'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import {
  WorkerCreateInput,
  WorkerDeleteInput,
  WorkerSearchQueryInput,
  WorkerUpdateInput
} from './worker.dto'
import { OffsetPaginatedWorkers, PaginatedWorkers, WorkerModel } from './worker.model'
import { WorkerService } from './worker.service'

@Resolver(() => WorkerModel)
export class WorkerResolver {
  constructor(private readonly service: WorkerService) {}

  @Mutation(() => WorkerModel, { name: 'createWorker' })
  async create(@Args('input', { type: () => WorkerCreateInput }) input: WorkerCreateInput) {
    return await this.service.create(input)
  }

  @Mutation(() => WorkerModel, { name: 'updateWorkerById' })
  async updateById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => WorkerUpdateInput }) input: WorkerUpdateInput
  ) {
    return await this.service.updateById(id, input)
  }

  @Mutation(() => SuccessRes, { name: 'deleteWorkerById' })
  async deleteById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => WorkerDeleteInput, nullable: true }) input: WorkerDeleteInput
  ) {
    return await this.service.deleteById(id, input.isForce)
  }

  @Query(() => WorkerModel, { name: 'findWorkerById' })
  async findById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId
  ): Promise<WorkerModel> {
    return await this.service.findById(id)
  }

  @Query(() => PaginatedWorkers, { name: 'lazyWorkerSearch' })
  async lazySearch(
    @Args('input', { type: () => PaginationInput }) input: PaginationInput
  ): Promise<PaginatedWorkers> {
    return await this.service.lazySearch(input)
  }

  @Query(() => OffsetPaginatedWorkers, { name: 'workerSearch' })
  async search(
    @Args('paginationInput', { type: () => OffsetPaginationInput })
    paginationInput: OffsetPaginationInput,
    @Args('queryInput', { type: () => WorkerSearchQueryInput, nullable: true })
    queryInput: WorkerSearchQueryInput,
    @Args('optionInput', { type: () => OffsetPaginationOptionInput, nullable: true })
    optionInput: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedWorkers> {
    return await this.service.search(paginationInput, queryInput, optionInput)
  }
}
