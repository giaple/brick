import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import type {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { EErrorMessage } from '@/common/enum/error.enum'
import { ESuccessMessage } from '@/common/enum/response.enum'
import { buildOffsetSearch } from '@/common/helper/offsetPagination.helper'
import { buildLazySearch } from '@/common/helper/pagination.helper'
import { buildQueryCondition } from '@/common/helper/queryCondition.helper'
import { Customer } from './customer.entity'
import type {
  CustomerCreateInput,
  CustomerSearchQueryInput,
  CustomerUpdateInput
} from './customer.dto'
import type { OffsetPaginatedCustomers, PaginatedCustomers } from './customer.model'
import type { Types, FilterQuery } from 'mongoose'

@Injectable()
export class CustomerRepository {
  lazySearch: (input: PaginationInput) => Promise<PaginatedCustomers>
  search: (
    paginationArgs: OffsetPaginationInput,
    queryArgs?: CustomerSearchQueryInput,
    optionArgs?: OffsetPaginationOptionInput
  ) => Promise<OffsetPaginatedCustomers>

  constructor(@InjectModel(Customer.name) private readonly model: Model<Customer>) {
    this.lazySearch = buildLazySearch<Customer>(model)
    this.search = buildOffsetSearch<Customer, CustomerSearchQueryInput>(
      model,
      this._buildQuerySearchCondition
    )
  }

  async create(input: CustomerCreateInput) {
    const entity = await this.model.create(input)
    return entity
  }

  async updateById(id: Types.ObjectId, input: CustomerUpdateInput) {
    const entity = await this.model.findByIdAndUpdate(
      id,
      { $set: input },
      {
        new: true
      }
    )
    if (!entity) throw new NotFoundException(EErrorMessage.USER_NOT_FOUND)

    return entity
  }

  async deleteById(id: Types.ObjectId) {
    await this.model.findByIdAndDelete(id)

    return {
      success: true,
      message: ESuccessMessage.DELETE_SUCCESS
    }
  }

  async removeById(id: Types.ObjectId) {
    await this.model.findByIdAndUpdate(id, {
      $set: {
        isDeleted: true,
        deletedAt: new Date()
      }
    })

    return {
      success: true,
      message: ESuccessMessage.DELETE_SUCCESS
    }
  }

  async findById(id: Types.ObjectId) {
    const entity = await this.model.findById(id)
    if (!entity) throw new NotFoundException(EErrorMessage.USER_NOT_FOUND)
    return entity
  }

  async findByPhoneNumber(phoneNumber: string) {
    const entity = await this.model.findOne({
      phoneNumber
    })
    if (!entity) throw new NotFoundException(EErrorMessage.USER_NOT_FOUND)
    return entity
  }

  private _buildQuerySearchCondition(input: CustomerSearchQueryInput) {
    const queryCondition: FilterQuery<CustomerSearchQueryInput> = {}

    if (input.isDeleted) {
      queryCondition.isDeleted = buildQueryCondition(input.isDeleted)
    } else {
      queryCondition.isDeleted = { $ne: true }
    }

    return queryCondition
  }
}
