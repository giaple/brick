import { Injectable, Logger } from '@nestjs/common'
import { isEmpty } from 'lodash'
import type {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { getChangedFields } from '@/common/helper'
import type { SuccessRes } from '@/common/model'
import { CustomerRepository } from './customer.repository'
import type {
  CustomerCreateInput,
  CustomerSearchQueryInput,
  CustomerUpdateInput
} from './customer.dto'
import type { Customer } from './customer.entity'
import type { CustomerModel, OffsetPaginatedCustomers, PaginatedCustomers } from './customer.model'
import type { Types } from 'mongoose'

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name)
  constructor(private readonly repository: CustomerRepository) {}

  async create(input: CustomerCreateInput): Promise<CustomerModel> {
    const newEntity = await this.repository.create(input)
    return newEntity
  }

  async updateById(id: Types.ObjectId, input: CustomerUpdateInput): Promise<CustomerModel> {
    const entity = await this.repository.findById(id)

    const updatedData = getChangedFields<Customer>(entity, input)

    if (isEmpty(updatedData)) return entity

    const updatedEntity = await this.repository.updateById(id, updatedData)
    return updatedEntity
  }

  async deleteById(id: Types.ObjectId, isForce?: boolean): Promise<SuccessRes> {
    await this.repository.findById(id)

    if (isForce) {
      return await this.repository.deleteById(id)
    }

    return await this.repository.removeById(id)
  }

  async findById(id: Types.ObjectId): Promise<CustomerModel> {
    const entity = await this.repository.findById(id)
    return entity
  }

  async findByPhoneNumber(phoneNumber: string): Promise<CustomerModel> {
    const entity = await this.repository.findByPhoneNumber(phoneNumber)
    return entity
  }

  async lazySearch(input: PaginationInput): Promise<PaginatedCustomers> {
    const paginatedEntities = await this.repository.lazySearch(input)
    return paginatedEntities
  }

  async search(
    paginationInput: OffsetPaginationInput,
    queryInput?: CustomerSearchQueryInput,
    optionInput?: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedCustomers> {
    const paginatedEntities = await this.repository.search(paginationInput, queryInput, optionInput)
    return paginatedEntities
  }

  async findOrCreateNew(input: CustomerCreateInput): Promise<CustomerModel> {
    try {
      return await this.repository.findByPhoneNumber(input.phoneNumber)
    } catch (err) {
      return await this.repository.create(input)
    }
  }
}
