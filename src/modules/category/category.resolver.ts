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
  CategoryCreateInput,
  CategoryDeleteInput,
  CategorySearchQueryInput,
  CategoryUpdateInput
} from './category.dto'
import { OffsetPaginatedCategories, PaginatedCategories, CategoryModel } from './category.model'
import { CategoryService } from './category.service'

@Resolver(() => CategoryModel)
export class CategoryResolver {
  constructor(private readonly service: CategoryService) {}

  @Mutation(() => CategoryModel, { name: 'createCategory' })
  async create(@Args('input', { type: () => CategoryCreateInput }) input: CategoryCreateInput) {
    return await this.service.create(input)
  }

  @Mutation(() => CategoryModel, { name: 'updateCategoryById' })
  async updateById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => CategoryUpdateInput }) input: CategoryUpdateInput
  ) {
    return await this.service.updateById(id, input)
  }

  @Mutation(() => SuccessRes, { name: 'deleteCategoryById' })
  async deleteById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => CategoryDeleteInput, nullable: true }) input: CategoryDeleteInput
  ) {
    return await this.service.deleteById(id, input.isForce)
  }

  @Query(() => CategoryModel, { name: 'findCategoryById' })
  async findById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId
  ): Promise<CategoryModel> {
    return await this.service.findById(id)
  }

  @Query(() => PaginatedCategories, { name: 'lazyCategorySearch' })
  async lazySearch(
    @Args('input', { type: () => PaginationInput }) input: PaginationInput
  ): Promise<PaginatedCategories> {
    return await this.service.lazySearch(input)
  }

  @Query(() => OffsetPaginatedCategories, { name: 'categorySearch' })
  async search(
    @Args('paginationInput', { type: () => OffsetPaginationInput })
    paginationInput: OffsetPaginationInput,
    @Args('queryInput', { type: () => CategorySearchQueryInput, nullable: true })
    queryInput: CategorySearchQueryInput,
    @Args('optionInput', { type: () => OffsetPaginationOptionInput, nullable: true })
    optionInput: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedCategories> {
    return await this.service.search(paginationInput, queryInput, optionInput)
  }
}
