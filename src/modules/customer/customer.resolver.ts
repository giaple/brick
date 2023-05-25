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
  CustomerCreateInput,
  CustomerDeleteInput,
  CustomerSearchQueryInput,
  CustomerUpdateInput
} from './customer.dto'
import { OffsetPaginatedCustomers, PaginatedCustomers, CustomerModel } from './customer.model'
import { CustomerService } from './customer.service'

@Resolver(() => CustomerModel)
export class CustomerResolver {
  constructor(private readonly service: CustomerService) {}

  @Mutation(() => CustomerModel, { name: 'createCustomer' })
  async create(@Args('input', { type: () => CustomerCreateInput }) input: CustomerCreateInput) {
    return await this.service.create(input)
  }

  @Mutation(() => CustomerModel, { name: 'updateCustomerById' })
  async updateById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => CustomerUpdateInput }) input: CustomerUpdateInput
  ) {
    return await this.service.updateById(id, input)
  }

  @Mutation(() => SuccessRes, { name: 'deleteCustomerById' })
  async deleteById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => CustomerDeleteInput, nullable: true }) input: CustomerDeleteInput
  ) {
    return await this.service.deleteById(id, input.isForce)
  }

  @Query(() => CustomerModel, { name: 'findCustomerById' })
  async findById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId
  ): Promise<CustomerModel> {
    return await this.service.findById(id)
  }

  @Query(() => PaginatedCustomers, { name: 'lazyCustomerSearch' })
  async lazySearch(
    @Args('input', { type: () => PaginationInput }) input: PaginationInput
  ): Promise<PaginatedCustomers> {
    return await this.service.lazySearch(input)
  }

  @Query(() => OffsetPaginatedCustomers, { name: 'customerSearch' })
  async search(
    @Args('paginationInput', { type: () => OffsetPaginationInput })
    paginationInput: OffsetPaginationInput,
    @Args('queryInput', { type: () => CustomerSearchQueryInput, nullable: true })
    queryInput: CustomerSearchQueryInput,
    @Args('optionInput', { type: () => OffsetPaginationOptionInput, nullable: true })
    optionInput: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedCustomers> {
    return await this.service.search(paginationInput, queryInput, optionInput)
  }
}
