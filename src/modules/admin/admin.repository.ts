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
import { Admin } from './admin.entity'
import type { AdminCreateInput, AdminSearchQueryInput, AdminUpdateInput } from './admin.dto'
import type { OffsetPaginatedAdmins, PaginatedAdmins } from './admin.model'
import type { Types, FilterQuery } from 'mongoose'

@Injectable()
export class AdminRepository {
  lazySearch: (input: PaginationInput) => Promise<PaginatedAdmins>
  search: (
    paginationArgs: OffsetPaginationInput,
    queryArgs?: AdminSearchQueryInput,
    optionArgs?: OffsetPaginationOptionInput
  ) => Promise<OffsetPaginatedAdmins>

  constructor(@InjectModel(Admin.name) private readonly model: Model<Admin>) {
    this.lazySearch = buildLazySearch<Admin>(model)
    this.search = buildOffsetSearch<Admin, AdminSearchQueryInput>(
      model,
      this._buildQuerySearchCondition
    )
  }

  async create(input: AdminCreateInput) {
    const entity = await this.model.create(input)
    return entity
  }

  async updateById(id: Types.ObjectId, input: AdminUpdateInput) {
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

  private _buildQuerySearchCondition(input: AdminSearchQueryInput) {
    const queryCondition: FilterQuery<AdminSearchQueryInput> = {}

    if (input.isDeleted) {
      queryCondition.isDeleted = buildQueryCondition(input.isDeleted)
    } else {
      queryCondition.isDeleted = { $ne: true }
    }

    return queryCondition
  }
}
