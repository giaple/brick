import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import type {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { EErrorMessage } from '@/common/enum/error.enum'
import { buildOffsetSearch } from '@/common/helper/offsetPagination.helper'
import { buildLazySearch } from '@/common/helper/pagination.helper'
import { buildQueryCondition } from '@/common/helper/queryCondition.helper'
import { Job } from './job.entity'
import type { JobCreateInput, JobSearchQueryInput, JobUpdateInput } from './job.dto'
import type { OffsetPaginatedJobs, PaginatedJobs } from './job.model'
import type { Types, FilterQuery } from 'mongoose'

@Injectable()
export class JobRepository {
  lazySearch: (input: PaginationInput) => Promise<PaginatedJobs>
  search: (
    paginationArgs: OffsetPaginationInput,
    queryArgs?: JobSearchQueryInput,
    optionArgs?: OffsetPaginationOptionInput
  ) => Promise<OffsetPaginatedJobs>

  constructor(@InjectModel(Job.name) private readonly model: Model<Job>) {
    this.lazySearch = buildLazySearch<Job>(model)
    this.search = buildOffsetSearch<Job, JobSearchQueryInput>(
      model,
      this._buildQuerySearchCondition
    )
  }

  async create(input: JobCreateInput) {
    const entity = await this.model.create(input)
    return entity
  }

  async updateById(id: Types.ObjectId, input: JobUpdateInput) {
    const entity = await this.model.findByIdAndUpdate(
      id,
      { $set: input },
      {
        new: true
      }
    )
    if (!entity) throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND)

    return entity
  }

  async findById(id: Types.ObjectId) {
    const entity = await this.model.findById(id)
    if (!entity) throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND)
    return entity
  }

  private _buildQuerySearchCondition(input: JobSearchQueryInput) {
    const queryCondition: FilterQuery<JobSearchQueryInput> = {}

    if (input.isDeleted) {
      queryCondition.isDeleted = buildQueryCondition(input.isDeleted)
    } else {
      queryCondition.isDeleted = { $ne: true }
    }

    if (input.categoryId) {
      queryCondition.categoryId = buildQueryCondition(input.categoryId)
    }

    return queryCondition
  }
}
