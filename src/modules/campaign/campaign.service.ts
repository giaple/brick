import { Injectable, Logger } from '@nestjs/common'
import { BadRequestException } from '@nestjs/common/exceptions'
import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import type {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import {
  ECampaignStatus,
  ECampaignType,
  EPromotionTargetCondition,
  EPromotionTargetType,
  EPromotionType
} from '@/common/enum/campaign.enum'
import { EErrorMessage } from '@/common/enum/error.enum'
import { ObjectKeys, getChangedFields } from '@/common/helper'
import type { SuccessRes } from '@/common/model'
import type { AppliedCampaignTarget } from '@/modules/job/nestedSchema/appliedCampaignTarget'
import type {
  PreBookingAppliedCampaignJobModel,
  PreBookingCartItemModel
} from '@/modules/pricing/pricing.dto'
import { CampaignRepository } from './campaign.repository'
import type {
  CampaignApplyInput,
  CampaignCreateInput,
  CampaignFindManyQueryInput,
  CampaignFindOneQueryInput,
  CampaignSearchQueryInput,
  CampaignUpdateInput,
  PromotionTargetInput
} from './campaign.dto'
import type { Campaign } from './campaign.entity'
import type {
  CampaignAppliedModel,
  CampaignModel,
  OffsetPaginatedCampaigns,
  PaginatedCampaigns,
  PromotionTargetModel
} from './campaign.model'
import type { Types } from 'mongoose'

type PromotionTargetByTypes = Partial<
  Record<keyof typeof EPromotionTargetType, PromotionTargetModel[]>
>

@Injectable()
export class CampaignService {
  private readonly logger = new Logger(CampaignService.name)
  constructor(private readonly repository: CampaignRepository) {}

  async create(input: CampaignCreateInput): Promise<CampaignModel> {
    if (dayjs(input.startDate).isAfter(input.endDate)) {
      throw new BadRequestException(EErrorMessage.CAMPAIGN_DATES_INVALID)
    }
    this._validateCampaign(input.type, input.targets)
    const existedCampaign = await this.repository.findExistingCampaign({
      code: input.code,
      startDate: input.startDate,
      endDate: input.endDate
    })

    if (existedCampaign) {
      throw new BadRequestException(EErrorMessage.CAMPAIGN_EXISTED)
    }

    const newEntity = await this.repository.create(input)
    return newEntity
  }

  async updateById(id: Types.ObjectId, input: CampaignUpdateInput): Promise<CampaignModel> {
    const entity = await this.repository.findById(id)

    const updatedData = getChangedFields<Campaign>(entity, input)

    if (isEmpty(updatedData)) return entity

    if (updatedData.targets) {
      this._validateCampaign(entity.type, updatedData.targets)
      this._checkDuplicateTarget(updatedData.targets)
    }

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

  async findById(id: Types.ObjectId): Promise<CampaignModel> {
    const entity = await this.repository.findById(id)
    return entity
  }

  async lazySearch(input: PaginationInput): Promise<PaginatedCampaigns> {
    const paginatedEntities = await this.repository.lazySearch(input)
    return paginatedEntities
  }

  async search(
    paginationInput: OffsetPaginationInput,
    queryInput?: CampaignSearchQueryInput,
    optionInput?: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedCampaigns> {
    const paginatedEntities = await this.repository.search(paginationInput, queryInput, optionInput)
    return paginatedEntities
  }

  async findOne(input: CampaignFindOneQueryInput, nullable = false) {
    return await this.repository.findOne(input, nullable)
  }

  async findMany(input: CampaignFindManyQueryInput) {
    return await this.repository.findMany(input)
  }

  async apply(input: CampaignApplyInput): Promise<PreBookingAppliedCampaignJobModel> {
    const result: PreBookingAppliedCampaignJobModel = {
      appliedCampaigns: [],
      items: input.items
    }

    const exisingCatCampaign: CampaignModel | null = await this.findOne(
      {
        code: { value: input.categoryId.toString() },
        isActive: { value: true },
        isRunning: true
      },
      true
    )

    const { appliedCampaign } = this._applyCampaign(input, exisingCatCampaign)

    appliedCampaign && result.appliedCampaigns.push(appliedCampaign)

    if (input.campaignCode) {
      const exisingCodeCampaign: CampaignModel | null = await this.findOne(
        {
          code: { value: input.campaignCode },
          isActive: { value: true },
          isRunning: true
        },
        true
      )

      const { appliedCampaign, totalDiscountType, totalDiscountValue } = this._applyCampaign(
        input,
        exisingCodeCampaign
      )
      appliedCampaign && result.appliedCampaigns.push(appliedCampaign)
      result.totalDiscountType = totalDiscountType
      result.totalDiscountValue = totalDiscountValue
    }

    return result
  }

  calculatePromotionPrice(promotionType: EPromotionType, discountValue: number, price: number) {
    switch (promotionType) {
      case EPromotionType.DISCOUNT:
        return price - discountValue < 0 ? 0 : price - discountValue

      case EPromotionType.PERCENT:
        return (price * (100 - discountValue)) / 100

      default:
        throw new BadRequestException(EErrorMessage.CAMPAIGN_PROMOTION_TYPE_INVALID)
    }
  }

  /* Private method */
  private _validateCampaign(campaignType: ECampaignType, targets: PromotionTargetInput[]) {
    this._checkValidCampaignType(campaignType, targets)
    this._checkDuplicateTarget(targets)
  }

  private _checkDuplicateTarget(input: PromotionTargetInput[]) {
    const targetKeys = ObjectKeys(EPromotionTargetType)
    targetKeys.forEach((key) => {
      const targetIds = input
        .filter((item) => item.type === key)
        .map((item) => item.ids)
        .flat()
      const isDuplicate = targetIds.some((id, index) => targetIds.indexOf(id) !== index)
      if (isDuplicate)
        throw new BadRequestException(
          `${EErrorMessage.CAMPAIGN_PROMOTION_TARGET_DUPLICATED}: ${key}`
        )
    })
  }

  private _checkValidCampaignType(campaignType: ECampaignType, targets: PromotionTargetInput[]) {
    if (
      campaignType === ECampaignType.BILL &&
      (targets.length !== 1 || targets[0].type !== EPromotionTargetType.TOTAL)
    ) {
      throw new BadRequestException(EErrorMessage.CAMPAIGN_TARGET_INVALID)
    }
  }

  private _applyCampaign(
    input: CampaignApplyInput,
    campaign: CampaignModel | null
  ): CampaignAppliedModel {
    if (
      !campaign ||
      campaign.status !== ECampaignStatus.APPLICABLE ||
      // TODO enhance campaign limit validation
      !!(campaign.redemptionAmountLimit && campaign.usedAmount >= campaign.redemptionAmountLimit) ||
      !!(campaign.redemptionCountLimit && campaign.usedCount >= campaign.redemptionCountLimit)
    )
      return {
        items: input.items
      }

    switch (campaign.type) {
      case ECampaignType.CATEGORY:
      case ECampaignType.CODE:
        return this._applyStandardCampaign(input.items, campaign)

      case ECampaignType.BILL:
        return this._applyBillCampaign(input.items, campaign)

      default:
        throw new BadRequestException(EErrorMessage.CAMPAIGN_TYPE_INVALID)
    }
  }

  private _applyStandardCampaign(
    input: PreBookingCartItemModel[],
    campaign: CampaignModel
  ): CampaignAppliedModel {
    const appliedTargets: AppliedCampaignTarget[] = []
    const { targets } = campaign
    const targetTypes = ObjectKeys(EPromotionTargetType)
    const promotionTargetByTypes: PromotionTargetByTypes = {}

    targetTypes.forEach((type) => {
      promotionTargetByTypes[type] = targets.filter((item) => item.type === type)
    })

    if (isEmpty(promotionTargetByTypes.ITEM) && isEmpty(promotionTargetByTypes.OPTION)) {
      return {
        items: input
      }
    }

    const items = input.map((item) => {
      if (!isEmpty(promotionTargetByTypes.ITEM)) {
        this._applyTarget(item, promotionTargetByTypes.ITEM!, appliedTargets)
      }

      if (!isEmpty(promotionTargetByTypes.OPTION)) {
        item.options.forEach((option) =>
          this._applyTarget(option, promotionTargetByTypes.OPTION!, appliedTargets)
        )
      }
      return item
    })

    return {
      items,
      appliedCampaign: appliedTargets.length
        ? {
            refId: campaign._id,
            type: campaign.type,
            code: campaign.code,
            appliedTargets
          }
        : undefined
    }
  }

  private _applyBillCampaign(
    input: PreBookingCartItemModel[],
    campaign: CampaignModel
  ): CampaignAppliedModel {
    return {
      items: input,
      totalDiscountType: campaign.targets[0].promotionType,
      totalDiscountValue: campaign.targets[0].value,
      appliedCampaign: {
        refId: campaign._id,
        type: campaign.type,
        code: campaign.code
      }
    }
  }

  private _applyTarget<
    T extends { _id: Types.ObjectId; name: string; price: number; finalPrice: number }
  >(input: T, targets: PromotionTargetModel[], appliedTargets: AppliedCampaignTarget[]) {
    const appliedTarget = targets.find((target) => target.ids.includes(input._id))
    if (!appliedTarget) return input

    if (appliedTarget.condition === EPromotionTargetCondition.OR) {
      targets.splice(targets.indexOf(appliedTarget), 1)
    }

    input.finalPrice = this.calculatePromotionPrice(
      appliedTarget.promotionType,
      appliedTarget.value,
      input.price
    )

    appliedTargets.push({
      refId: input._id,
      name: input.name,
      targetType: appliedTarget.type,
      promotionType: appliedTarget.promotionType,
      condition: appliedTarget.condition,
      value: appliedTarget.value
    })
  }
}
