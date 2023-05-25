import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Types } from 'mongoose'
import {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import { DataLoader } from '@/decorators/dataloader.decorator'
import { CategoryLoader } from '@/modules/category/category.loader'
import { CategoryModel } from '@/modules/category/category.model'
import { TransactionLoader } from '@/modules/transaction/transaction.loader'
import { TransactionModel } from '@/modules/transaction/transaction.model'
import {
  JobAssignWorkerInput,
  JobCreateInput,
  JobItemsUpdateInput,
  JobSearchQueryInput,
  JobUpdateInput,
  JobUpdateStatusInput
} from './job.dto'
import { OffsetPaginatedJobs, PaginatedJobs, JobModel } from './job.model'
import { JobService } from './job.service'

@Resolver(() => JobModel)
export class JobResolver {
  constructor(private readonly service: JobService) {}

  @Mutation(() => JobModel, { name: 'createJob' })
  async create(@Args('input', { type: () => JobCreateInput }) input: JobCreateInput) {
    return await this.service.create(input)
  }

  @Mutation(() => JobModel, { name: 'updateJobById' })
  async updateById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => JobUpdateInput }) input: JobUpdateInput
  ) {
    return await this.service.updateById(id, input)
  }

  @Query(() => JobModel, { name: 'findJobById' })
  async findById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId
  ): Promise<JobModel> {
    return await this.service.findById(id)
  }

  @Query(() => PaginatedJobs, { name: 'lazyJobSearch' })
  async lazySearch(
    @Args('input', { type: () => PaginationInput }) input: PaginationInput
  ): Promise<PaginatedJobs> {
    return await this.service.lazySearch(input)
  }

  @Query(() => OffsetPaginatedJobs, { name: 'jobSearch' })
  async search(
    @Args('paginationInput', { type: () => OffsetPaginationInput })
    paginationInput: OffsetPaginationInput,
    @Args('queryInput', { type: () => JobSearchQueryInput, nullable: true })
    queryInput: JobSearchQueryInput,
    @Args('optionInput', { type: () => OffsetPaginationOptionInput, nullable: true })
    optionInput: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedJobs> {
    return await this.service.search(paginationInput, queryInput, optionInput)
  }

  @Mutation(() => JobModel, { name: 'updateJobStatusById' })
  async updateStatusById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => JobUpdateStatusInput }) input: JobUpdateStatusInput
  ) {
    return await this.service.updateStatusById(id, input)
  }

  @Mutation(() => JobModel, { name: 'assignJobWorkerById' })
  async assignWorkerById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => JobAssignWorkerInput }) input: JobAssignWorkerInput
  ) {
    return await this.service.assignWorkerById(id, input)
  }

  @Mutation(() => JobModel, { name: 'updateJobItemsById' })
  async updateItemsById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => JobItemsUpdateInput }) input: JobItemsUpdateInput
  ) {
    return await this.service.updateItemsById(id, input)
  }

  /* Resolve Fields */
  @ResolveField('category', () => CategoryModel, { nullable: true })
  async category(@Parent() job: JobModel, @DataLoader('categoryLoader') loader: CategoryLoader) {
    const entity = await loader.load(job.categoryId)
    return entity
  }

  @ResolveField('transaction', () => TransactionModel, { nullable: true })
  async transaction(
    @Parent() job: JobModel,
    @DataLoader('transactionLoader') loader: TransactionLoader
  ) {
    const entity = await loader.load(job.transactionId)
    return entity
  }
}
