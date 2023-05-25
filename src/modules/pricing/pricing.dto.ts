import { Field, InputType, Int } from '@nestjs/graphql'
import { Types } from 'mongoose'
import type { EPromotionType } from '@/common/enum/campaign.enum'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import type { AppliedCampaignModel } from '@/modules/job/job.model'

@InputType()
export class CartItemOptionInput {
  @Field(() => ObjectIdScalar)
  id: Types.ObjectId

  @Field(() => Int)
  quantity: number
}

@InputType()
export class CartItemInput {
  @Field(() => ObjectIdScalar)
  id: Types.ObjectId

  @Field(() => Int)
  quantity: number

  @Field(() => [CartItemOptionInput], { nullable: true })
  options?: CartItemOptionInput[]
}

@InputType()
export class PreBookingJobInput {
  @Field(() => ObjectIdScalar)
  categoryId: Types.ObjectId

  @Field(() => [CartItemInput])
  items: CartItemInput[]

  @Field(() => String, { nullable: true })
  campaignCode?: string
}

/* Internal Model */
export class PreBookingCartItemOptionModel {
  _id: Types.ObjectId
  name: string
  quantity: number
  price: number
  finalPrice: number
  estTime: number
}

export class PreBookingCartItemModel {
  _id: Types.ObjectId
  name: string
  quantity: number
  price: number
  finalPrice: number
  estTime: number
  options: PreBookingCartItemOptionModel[]
}

export class PreBookingAppliedCampaignJobModel {
  appliedCampaigns: AppliedCampaignModel[]
  totalDiscountType?: EPromotionType
  totalDiscountValue?: number
  items: PreBookingCartItemModel[]
}
