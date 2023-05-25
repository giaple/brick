import { Injectable, Logger } from '@nestjs/common'
import { isEmpty } from 'lodash'
import type {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { getChangedFields } from '@/common/helper'
import type { SuccessRes } from '@/common/model'
import { AdminRepository } from './admin.repository'
import type { AdminCreateInput, AdminSearchQueryInput, AdminUpdateInput } from './admin.dto'
import type { Admin } from './admin.entity'
import type { AdminModel, OffsetPaginatedAdmins, PaginatedAdmins } from './admin.model'
import type { Types } from 'mongoose'

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name)
  constructor(private readonly repository: AdminRepository) {}

  async create(input: AdminCreateInput): Promise<AdminModel> {
    const newEntity = await this.repository.create(input)
    return newEntity
  }

  async updateById(id: Types.ObjectId, input: AdminUpdateInput): Promise<AdminModel> {
    const entity = await this.repository.findById(id)

    const updatedData = getChangedFields<Admin>(entity, input)

    if (isEmpty(updatedData)) return entity

    if ('isActive' in updatedData && typeof updatedData.isActive === 'boolean') {
      updatedData.deactivatedAt = updatedData.isActive ? null : new Date()
    }

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

  async findById(id: Types.ObjectId): Promise<AdminModel> {
    const entity = await this.repository.findById(id)
    return entity
  }

  async findByPhoneNumber(phoneNumber: string): Promise<AdminModel> {
    const entity = await this.repository.findByPhoneNumber(phoneNumber)
    return entity
  }

  async lazySearch(input: PaginationInput): Promise<PaginatedAdmins> {
    const paginatedEntities = await this.repository.lazySearch(input)
    return paginatedEntities
  }

  async search(
    paginationInput: OffsetPaginationInput,
    queryInput?: AdminSearchQueryInput,
    optionInput?: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedAdmins> {
    const paginatedEntities = await this.repository.search(paginationInput, queryInput, optionInput)
    return paginatedEntities
  }
}
