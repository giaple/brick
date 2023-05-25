import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Schema as MongooseSchema } from 'mongoose'
import {
  EPromotionTargetCondition,
  EPromotionTargetType,
  EPromotionType
} from '@/common/enum/campaign.enum'
import type { IPromotionTarget } from '@/modules/campaign/campaign.interface'
import type { Types } from 'mongoose'

@Schema({
  _id: false
})
export class PromotionTarget implements IPromotionTarget {
  @Prop({
    required: true,
    enum: EPromotionTargetType
  })
  type: EPromotionTargetType

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
    default: EPromotionTargetCondition.ANY
  })
  condition: EPromotionTargetCondition

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    required: true,
    default: []
  })
  ids: Types.ObjectId[]
}

export const PromotionTargetSchema = SchemaFactory.createForClass(PromotionTarget)
