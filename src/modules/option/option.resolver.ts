import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Types } from 'mongoose'
import {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { SuccessRes } from '@/common/model'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import { DataLoader } from '@/decorators/dataloader.decorator'
import { CategoryLoader } from '@/modules/category/category.loader'
import { CategoryModel } from '@/modules/category/category.model'
import {
  OptionCreateInput,
  OptionDeleteInput,
  OptionSearchQueryInput,
  OptionUpdateInput
} from './option.dto'
import { OffsetPaginatedOptions, PaginatedOptions, OptionModel } from './option.model'
import { OptionService } from './option.service'

@Resolver(() => OptionModel)
export class OptionResolver {
  constructor(private readonly service: OptionService) {}

  @Mutation(() => OptionModel, { name: 'createOption' })
  async create(@Args('input', { type: () => OptionCreateInput }) input: OptionCreateInput) {
    return await this.service.create(input)
  }

  @Mutation(() => OptionModel, { name: 'updateOptionById' })
  async updateById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => OptionUpdateInput }) input: OptionUpdateInput
  ) {
    return await this.service.updateById(id, input)
  }

  @Mutation(() => SuccessRes, { name: 'deleteOptionById' })
  async deleteById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => OptionDeleteInput, nullable: true }) input: OptionDeleteInput
  ) {
    return await this.service.deleteById(id, input.isForce)
  }

  @Query(() => OptionModel, { name: 'findOptionById' })
  async findById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId
  ): Promise<OptionModel> {
    return await this.service.findById(id)
  }

  @Query(() => PaginatedOptions, { name: 'lazyOptionSearch' })
  async lazySearch(
    @Args('input', { type: () => PaginationInput }) input: PaginationInput
  ): Promise<PaginatedOptions> {
    return await this.service.lazySearch(input)
  }

  @Query(() => OffsetPaginatedOptions, { name: 'optionSearch' })
  async search(
    @Args('paginationInput', { type: () => OffsetPaginationInput })
    paginationInput: OffsetPaginationInput,
    @Args('queryInput', { type: () => OptionSearchQueryInput, nullable: true })
    queryInput: OptionSearchQueryInput,
    @Args('optionInput', { type: () => OffsetPaginationOptionInput, nullable: true })
    optionInput: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedOptions> {
    return await this.service.search(paginationInput, queryInput, optionInput)
  }

  /* Resolve Fields */
  @ResolveField('category', () => CategoryModel, { nullable: true })
  async category(
    @Parent() option: OptionModel,
    @DataLoader('categoryLoader') loader: CategoryLoader
  ) {
    const entity = await loader.load(option.categoryId)
    return entity
  }
}
