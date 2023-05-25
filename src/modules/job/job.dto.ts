import { Field, Float, InputType, Int } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { Matches } from 'class-validator'
import { Types } from 'mongoose'
import { VI_PHONE_REGEX } from '@/common/constant'
import { BooleanFilterInput, IDFilterInput } from '@/common/dto/queryCondition.dto'
import {
  ECampaignType,
  EPromotionTargetCondition,
  EPromotionTargetType,
  EPromotionType
} from '@/common/enum/campaign.enum'
import { EErrorMessage } from '@/common/enum/error.enum'
import { EJobStatus } from '@/common/enum/job.enum'
import { formatPhoneNumber } from '@/common/helper'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'

@InputType()
export class JobMetadataInput {
  @Field(() => String, { nullable: true })
  utmSource?: string

  @Field(() => String, { nullable: true })
  utmCampaign?: string

  @Field(() => String, { nullable: true })
  utmMedium?: string

  @Field(() => String, { nullable: true })
  referralName?: string
}

@InputType()
export class JobItemOptionInput {
  @Field(() => ObjectIdScalar)
  refId: Types.ObjectId

  @Field(() => String)
  name: string

  @Field(() => Int)
  quantity: number

  @Field(() => Float)
  price: number

  @Field(() => Float)
  finalPrice: number
}

@InputType()
export class AppliedCampaignTargetInput {
  @Field(() => ObjectIdScalar)
  refId: Types.ObjectId

  @Field(() => String)
  name: string

  @Field(() => EPromotionTargetType)
  targetType: EPromotionTargetType

  @Field(() => EPromotionType)
  promotionType: EPromotionType

  @Field(() => Float)
  value: number

  @Field(() => EPromotionTargetCondition)
  condition: EPromotionTargetCondition
}

@InputType()
export class AppliedCampaignInput {
  @Field(() => ObjectIdScalar)
  refId: Types.ObjectId

  @Field(() => String)
  code: string

  @Field(() => ECampaignType)
  type: ECampaignType

  @Field(() => [AppliedCampaignTargetInput], { nullable: true })
  appliedTargets?: AppliedCampaignTargetInput[]
}

@InputType()
export class JobItemInput {
  @Field(() => ObjectIdScalar)
  refId: Types.ObjectId

  @Field(() => String)
  name: string

  @Field(() => Int)
  quantity: number

  @Field(() => Float)
  price: number

  @Field(() => Float)
  finalPrice: number

  @Field(() => [JobItemOptionInput], { nullable: true })
  options?: JobItemOptionInput[]

  @Field(() => String, { nullable: true })
  note?: string
}

@InputType()
export class JobCreateInput {
  @Field(() => ObjectIdScalar)
  categoryId: Types.ObjectId

  transactionId: Types.ObjectId

  appointmentId: Types.ObjectId

  @Field(() => ObjectIdScalar, { nullable: true })
  customerId?: Types.ObjectId

  @Field(() => String)
  @Transform(({ value }) => formatPhoneNumber(value))
  @Matches(VI_PHONE_REGEX, { message: EErrorMessage.PHONE_NUMBER_INVALID })
  phoneNumber: string

  @Field(() => String)
  customerName: string

  @Field(() => String)
  address: string

  @Field(() => JobMetadataInput, { nullable: true })
  metadata?: JobMetadataInput

  @Field(() => [String], { nullable: true })
  imageUrls?: string[]

  @Field(() => String, { nullable: true })
  note?: string

  @Field(() => Date)
  startDate: Date

  @Field(() => Date)
  endDate: Date

  @Field(() => Float)
  totalPrice: number

  @Field(() => [AppliedCampaignInput], { nullable: true })
  appliedCampaigns?: AppliedCampaignInput[]

  @Field(() => Float)
  finalTotalPrice: number

  @Field(() => Float, { nullable: true })
  totalDiscountPrice: number

  @Field(() => [JobItemInput])
  items: JobItemInput[]
}

@InputType()
export class JobUpdateInput {
  @Field(() => String, { nullable: true })
  address?: string

  @Field(() => [String], { nullable: true })
  imageUrls?: string[]

  @Field(() => [String], { nullable: true })
  workImageUrls?: string[]

  @Field(() => String, { nullable: true })
  adminNote?: string
}

@InputType()
export class JobUpdateStatusInput {
  @Field(() => EJobStatus)
  status: EJobStatus

  @Field(() => Date, { nullable: true })
  startDate?: Date

  @Field(() => Boolean, { nullable: true })
  isPaid?: boolean
}

@InputType()
export class JobAssignWorkerInput {
  @Field(() => ObjectIdScalar)
  workerId: Types.ObjectId
}

@InputType()
export class JobItemsUpdateInput {
  @Field(() => Int)
  totalEstTime: number

  @Field(() => [AppliedCampaignInput], { nullable: true })
  appliedCampaigns?: AppliedCampaignInput[]

  @Field(() => Float)
  totalPrice: number

  @Field(() => Float)
  finalTotalPrice: number

  @Field(() => Float, { nullable: true })
  totalDiscountPrice: number

  @Field(() => [JobItemInput])
  items: JobItemInput[]
}

@InputType()
export class JobSearchQueryInput {
  @Field(() => BooleanFilterInput, { nullable: true })
  isDeleted?: BooleanFilterInput

  @Field(() => IDFilterInput, { nullable: true })
  categoryId?: IDFilterInput
}
