import { Injectable, Logger } from '@nestjs/common'
import { isEmpty } from 'lodash'
import type {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { getChangedFields } from '@/common/helper'
import type { SuccessRes } from '@/common/model'
import { WorkerRepository } from './worker.repository'
import type {
  WorkerCreateInput,
  WorkerFindManyQueryInput,
  WorkerSearchQueryInput,
  WorkerUpdateInput
} from './worker.dto'
import type { Worker } from './worker.entity'
import type { WorkerModel, OffsetPaginatedWorkers, PaginatedWorkers } from './worker.model'
import type { Types } from 'mongoose'

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name)
  constructor(private readonly repository: WorkerRepository) {}

  async create(input: WorkerCreateInput): Promise<WorkerModel> {
    const newEntity = await this.repository.create(input)
    return newEntity
  }

  async updateById(id: Types.ObjectId, input: WorkerUpdateInput): Promise<WorkerModel> {
    const entity = await this.repository.findById(id)

    const updatedData = getChangedFields<Worker>(entity, input)

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

  async findById(id: Types.ObjectId): Promise<WorkerModel> {
    const entity = await this.repository.findById(id)
    return entity
  }

  async findByPhoneNumber(phoneNumber: string): Promise<WorkerModel> {
    const entity = await this.repository.findByPhoneNumber(phoneNumber)
    return entity
  }

  async lazySearch(input: PaginationInput): Promise<PaginatedWorkers> {
    const paginatedEntities = await this.repository.lazySearch(input)
    return paginatedEntities
  }

  async search(
    paginationInput: OffsetPaginationInput,
    queryInput?: WorkerSearchQueryInput,
    optionInput?: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedWorkers> {
    const paginatedEntities = await this.repository.search(paginationInput, queryInput, optionInput)
    return paginatedEntities
  }

  async findMany(input: WorkerFindManyQueryInput) {
    return await this.repository.findMany(input)
  }
}
