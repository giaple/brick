import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, Schema as MongooseSchema } from 'mongoose'
import {
  EPromotionTargetCondition,
  EPromotionTargetType,
  EPromotionType
} from '@/common/enum/campaign.enum'
import type { IAppliedCampaignTarget } from '@/modules/job/job.interface'

@Schema({
  _id: false
})
export class AppliedCampaignTarget implements IAppliedCampaignTarget {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true
  })
  refId: Types.ObjectId

  @Prop({
    type: String,
    required: true
  })
  name: string

  @Prop({
    enum: EPromotionTargetType,
    required: true
  })
  targetType: EPromotionTargetType

  @Prop({
    enum: EPromotionType,
    required: true
  })
  promotionType: EPromotionType

  @Prop({
    type: Number,
    required: true
  })
  value: number

  @Prop({
    enum: EPromotionTargetCondition,
    required: true
  })
  condition: EPromotionTargetCondition
}

export const AppliedCampaignTargetSchema = SchemaFactory.createForClass(AppliedCampaignTarget)
