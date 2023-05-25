import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { Types } from 'mongoose'
import {
  ECampaignStatus,
  ECampaignType,
  EPromotionTargetCondition,
  EPromotionTargetType,
  EPromotionType
} from '@/common/enum/campaign.enum'
import { OffsetPaginated } from '@/common/interface/offsetPagination.interface'
import { Paginated } from '@/common/interface/pagination.interface'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import type { AppliedCampaignModel } from '@/modules/job/job.model'
import type { PreBookingCartItemModel } from '@/modules/pricing/pricing.dto'
import type { ICampaign, IPromotionTarget } from './campaign.interface'

@ObjectType()
export class PromotionTargetModel implements IPromotionTarget {
  @Field(() => EPromotionTargetType)
  type: EPromotionTargetType

  @Field(() => EPromotionType)
  promotionType: EPromotionType

  @Field(() => Float)
  value: number

  @Field(() => EPromotionTargetCondition)
  condition: EPromotionTargetCondition

  @Field(() => [ObjectIdScalar])
  ids: Types.ObjectId[]
}

@ObjectType()
export class CampaignModel implements ICampaign {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId

  @Field(() => String)
  name: string

  @Field(() => String)
  code: string

  @Field(() => String, { nullable: true })
  partnerCode?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => ECampaignType)
  type: ECampaignType

  @Field(() => [PromotionTargetModel])
  targets: PromotionTargetModel[]

  @Field(() => Date)
  startDate: Date

  @Field(() => Date)
  endDate: Date

  @Field(() => Float, { nullable: true })
  redemptionAmountLimit?: number

  @Field(() => Int, { nullable: true })
  redemptionCountLimit?: number

  @Field(() => Float)
  usedAmount: number

  @Field(() => Int)
  usedCount: number

  @Field(() => Boolean)
  isActive: boolean

  @Field(() => Date, { nullable: true })
  deactivatedAt?: Date

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => Boolean, { nullable: true })
  isDeleted?: boolean

  @Field(() => Date, { nullable: true })
  deletedAt?: Date

  /* Virtual Fields */
  @Field(() => ECampaignStatus, { nullable: true })
  status?: ECampaignStatus
}

@ObjectType()
export class PaginatedCampaigns extends Paginated(CampaignModel) {}

@ObjectType()
export class OffsetPaginatedCampaigns extends OffsetPaginated(CampaignModel) {}

/* Internal Models */
export class CampaignAppliedModel {
  appliedCampaign?: AppliedCampaignModel
  totalDiscountType?: EPromotionType
  totalDiscountValue?: number
  items: PreBookingCartItemModel[]
}
