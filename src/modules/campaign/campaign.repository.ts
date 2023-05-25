import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
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
import { Campaign } from './campaign.entity'
import type {
  CampaignCreateInput,
  CampaignFindExistingQueryInput,
  CampaignFindManyQueryInput,
  CampaignFindOneQueryInput,
  CampaignSearchQueryInput,
  CampaignUpdateInput
} from './campaign.dto'
import type { OffsetPaginatedCampaigns, PaginatedCampaigns } from './campaign.model'
import type { FilterQuery } from 'mongoose'

@Injectable()
export class CampaignRepository {
  lazySearch: (input: PaginationInput) => Promise<PaginatedCampaigns>
  search: (
    paginationArgs: OffsetPaginationInput,
    queryArgs?: CampaignSearchQueryInput,
    optionArgs?: OffsetPaginationOptionInput
  ) => Promise<OffsetPaginatedCampaigns>

  constructor(@InjectModel(Campaign.name) private readonly model: Model<Campaign>) {
    this.lazySearch = buildLazySearch<Campaign>(model)
    this.search = buildOffsetSearch<Campaign, CampaignSearchQueryInput>(
      model,
      this._buildQuerySearchCondition
    )
  }

  async create(input: CampaignCreateInput) {
    const entity = await this.model.create(input)
    return entity
  }

  async updateById(id: Types.ObjectId, input: CampaignUpdateInput) {
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
    if (!entity) throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND)
    return entity
  }

  async findOne(input: CampaignFindOneQueryInput, nullable = false) {
    const queryCondition = this._buildQueryFindOneCondition(input)

    const entity = await this.model.findOne(queryCondition)

    if (!nullable && !entity) throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND)

    return entity
  }

  async findMany(input: CampaignFindManyQueryInput) {
    const queryCondition = this._buildQueryFindManyCondition(input)

    const entities = await this.model.find(queryCondition)

    return entities
  }

  /* Private Methods */

  private _buildQueryFindOneCondition(input: CampaignFindOneQueryInput) {
    const queryCondition: FilterQuery<CampaignFindOneQueryInput> = {}

    if (input.code) {
      queryCondition.code = buildQueryCondition(input.code)
    }

    if (input.type) {
      queryCondition.type = buildQueryCondition(input.type)
    }

    if (input.isActive) {
      queryCondition.isActive = buildQueryCondition(input.isActive)
    }

    if (input.isRunning) {
      const today = new Date()
      queryCondition.startDate = { $lte: today }
      queryCondition.endDate = { $gte: today }
    }

    return queryCondition
  }

  private _buildQueryFindManyCondition(input: CampaignFindManyQueryInput) {
    const queryCondition: FilterQuery<CampaignFindManyQueryInput> = {}

    if (input.ids) {
      queryCondition._id = { $in: input.ids.map((id) => new Types.ObjectId(id)) }
    }

    return queryCondition
  }

  private _buildQuerySearchCondition(input: CampaignSearchQueryInput) {
    const queryCondition: FilterQuery<CampaignSearchQueryInput> = {}

    if (input.isDeleted) {
      queryCondition.isDeleted = buildQueryCondition(input.isDeleted)
    } else {
      queryCondition.isDeleted = { $ne: true }
    }

    return queryCondition
  }

  async findExistingCampaign(input: CampaignFindExistingQueryInput) {
    const queryCondition: FilterQuery<CampaignFindExistingQueryInput> = {
      code: input.code,
      isActive: true,
      $or: [
        { startDate: { $gte: input.startDate } },
        { endDate: { $gte: input.endDate } },
        { endDate: { $gte: input.startDate } }
      ]
    }

    const entity = await this.model.findOne(queryCondition)
    return entity
  }
}
