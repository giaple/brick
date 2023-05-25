import { Field, Float, InputType, Int } from '@nestjs/graphql'
import { Max, Min, ValidateIf } from 'class-validator'
import { BooleanFilterInput, StringFilterInput } from '@/common/dto/queryCondition.dto'
import {
  ECampaignType,
  EPromotionType,
  EPromotionTargetType,
  EPromotionTargetCondition
} from '@/common/enum/campaign.enum'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import type { PreBookingCartItemModel } from '@/modules/pricing/pricing.dto'
import type { Types } from 'mongoose'

@InputType()
export class PromotionTargetInput {
  @Field(() => EPromotionTargetType)
  type: EPromotionTargetType

  @Field(() => EPromotionType)
  promotionType: EPromotionType

  @Field(() => Float)
  @Min(1)
  @ValidateIf((input: PromotionTargetInput) => input.promotionType === EPromotionType.PERCENT)
  @Max(100)
  value: number

  @Field(() => EPromotionTargetCondition, { nullable: true })
  condition?: EPromotionTargetCondition

  @Field(() => [ObjectIdScalar])
  ids: Types.ObjectId[]
}

@InputType()
export class CampaignCreateInput {
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

  @Field(() => [PromotionTargetInput])
  targets: PromotionTargetInput[]

  @Field(() => Date)
  startDate: Date

  @Field(() => Date)
  endDate: Date

  @Field(() => Float, { nullable: true })
  redemptionAmountLimit?: number

  @Field(() => Int, { nullable: true })
  redemptionCountLimit?: number
}

@InputType()
export class CampaignUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => [PromotionTargetInput], { nullable: true })
  targets?: PromotionTargetInput[]

  @Field(() => String, { nullable: true })
  partnerCode?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean
}

@InputType()
export class CampaignDeleteInput {
  @Field(() => Boolean, { nullable: true })
  isForce?: boolean
}

@InputType()
export class CampaignSearchQueryInput {
  @Field(() => BooleanFilterInput, { nullable: true })
  isDeleted?: BooleanFilterInput
}

@InputType()
export class CampaignFindManyQueryInput {
  @Field(() => [ObjectIdScalar])
  ids: Types.ObjectId[]
}

@InputType()
export class CampaignFindOneQueryInput {
  @Field(() => StringFilterInput, { nullable: true })
  code?: StringFilterInput

  @Field(() => StringFilterInput, { nullable: true })
  type?: StringFilterInput

  @Field(() => BooleanFilterInput, { nullable: true })
  isActive?: BooleanFilterInput

  @Field(() => Boolean, { nullable: true })
  isRunning?: boolean
}

/* Internal DTOs */
export class CampaignFindExistingQueryInput {
  code: string
  startDate: Date
  endDate: Date
}

export class CampaignApplyInput {
  categoryId: Types.ObjectId
  campaignCode?: string
  items: PreBookingCartItemModel[]
}
