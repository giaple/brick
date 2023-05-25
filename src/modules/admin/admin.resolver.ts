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
  AdminCreateInput,
  AdminDeleteInput,
  AdminSearchQueryInput,
  AdminUpdateInput
} from './admin.dto'
import { OffsetPaginatedAdmins, PaginatedAdmins, AdminModel } from './admin.model'
import { AdminService } from './admin.service'

@Resolver(() => AdminModel)
export class AdminResolver {
  constructor(private readonly service: AdminService) {}

  @Mutation(() => AdminModel, { name: 'createAdmin' })
  async create(@Args('input', { type: () => AdminCreateInput }) input: AdminCreateInput) {
    return await this.service.create(input)
  }

  @Mutation(() => AdminModel, { name: 'updateAdminById' })
  async updateById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => AdminUpdateInput }) input: AdminUpdateInput
  ) {
    return await this.service.updateById(id, input)
  }

  @Mutation(() => SuccessRes, { name: 'deleteAdminById' })
  async deleteById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => AdminDeleteInput, nullable: true }) input: AdminDeleteInput
  ) {
    return await this.service.deleteById(id, input.isForce)
  }

  @Query(() => AdminModel, { name: 'findAdminById' })
  async findById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId
  ): Promise<AdminModel> {
    return await this.service.findById(id)
  }

  @Query(() => PaginatedAdmins, { name: 'lazyAdminSearch' })
  async lazySearch(
    @Args('input', { type: () => PaginationInput }) input: PaginationInput
  ): Promise<PaginatedAdmins> {
    return await this.service.lazySearch(input)
  }

  @Query(() => OffsetPaginatedAdmins, { name: 'adminSearch' })
  async search(
    @Args('paginationInput', { type: () => OffsetPaginationInput })
    paginationInput: OffsetPaginationInput,
    @Args('queryInput', { type: () => AdminSearchQueryInput, nullable: true })
    queryInput: AdminSearchQueryInput,
    @Args('optionInput', { type: () => OffsetPaginationOptionInput, nullable: true })
    optionInput: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedAdmins> {
    return await this.service.search(paginationInput, queryInput, optionInput)
  }
}
