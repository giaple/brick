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
import { OptionLoader } from '@/modules/option/option.loader'
import { OptionModel } from '@/modules/option/option.model'
import { ItemCreateInput, ItemDeleteInput, ItemSearchQueryInput, ItemUpdateInput } from './item.dto'
import { OffsetPaginatedItems, PaginatedItems, ItemModel } from './item.model'
import { ItemService } from './item.service'

@Resolver(() => ItemModel)
export class ItemResolver {
  constructor(private readonly service: ItemService) {}

  @Mutation(() => ItemModel, { name: 'createItem' })
  async create(@Args('input', { type: () => ItemCreateInput }) input: ItemCreateInput) {
    return await this.service.create(input)
  }

  @Mutation(() => ItemModel, { name: 'updateItemById' })
  async updateById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => ItemUpdateInput }) input: ItemUpdateInput
  ) {
    return await this.service.updateById(id, input)
  }

  @Mutation(() => SuccessRes, { name: 'deleteItemById' })
  async deleteById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => ItemDeleteInput, nullable: true }) input: ItemDeleteInput
  ) {
    return await this.service.deleteById(id, input.isForce)
  }

  @Query(() => ItemModel, { name: 'findItemById' })
  async findById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId
  ): Promise<ItemModel> {
    return await this.service.findById(id)
  }

  @Query(() => PaginatedItems, { name: 'lazyItemSearch' })
  async lazySearch(
    @Args('input', { type: () => PaginationInput }) input: PaginationInput
  ): Promise<PaginatedItems> {
    return await this.service.lazySearch(input)
  }

  @Query(() => OffsetPaginatedItems, { name: 'itemSearch' })
  async search(
    @Args('paginationInput', { type: () => OffsetPaginationInput })
    paginationInput: OffsetPaginationInput,
    @Args('queryInput', { type: () => ItemSearchQueryInput, nullable: true })
    queryInput: ItemSearchQueryInput,
    @Args('optionInput', { type: () => OffsetPaginationOptionInput, nullable: true })
    optionInput: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedItems> {
    return await this.service.search(paginationInput, queryInput, optionInput)
  }

  /* Resolve Fields */
  @ResolveField('category', () => CategoryModel, { nullable: true })
  async category(@Parent() item: ItemModel, @DataLoader('categoryLoader') loader: CategoryLoader) {
    const entity = await loader.load(item.categoryId)
    return entity
  }

  @ResolveField('options', () => [OptionModel])
  async options(@Parent() item: ItemModel, @DataLoader('optionLoader') loader: OptionLoader) {
    if (!item.optionIds.length) return []
    const entities = await loader.loadMany(item.optionIds)
    return entities
  }
}
