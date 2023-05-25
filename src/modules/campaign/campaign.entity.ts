import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { Document } from 'mongoose'
import { ECampaignStatus, ECampaignType } from '@/common/enum/campaign.enum'
import { PromotionTargetSchema } from './nestedSchema/promotionTarget'
import type { ICampaign } from './campaign.interface'
import type { PromotionTarget } from './nestedSchema/promotionTarget'
import type { Types } from 'mongoose'

dayjs.extend(isBetween)

@Schema({
  autoIndex: true,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Campaign extends Document implements ICampaign {
  declare _id: Types.ObjectId

  @Prop({
    type: String,
    required: true
  })
  name: string

  @Prop({
    type: String,
    required: true
  })
  code: string

  @Prop({
    type: String
  })
  partnerCode?: string

  @Prop({
    type: String
  })
  description?: string

  @Prop({
    enum: ECampaignType,
    required: true
  })
  type: ECampaignType

  @Prop({
    type: [PromotionTargetSchema],
    required: true
  })
  targets: PromotionTarget[]

  @Prop({
    type: Date,
    required: true
  })
  startDate: Date

  @Prop({
    type: Date,
    required: true
  })
  endDate: Date

  @Prop({
    type: Number
  })
  redemptionAmountLimit: number

  @Prop({
    type: Number
  })
  redemptionCountLimit: number

  @Prop({
    type: Number,
    default: 0
  })
  usedAmount: number

  @Prop({
    type: Number,
    default: 0
  })
  usedCount: number

  @Prop({
    type: Boolean,
    default: true
  })
  isActive: boolean

  @Prop({
    type: Date
  })
  deactivatedAt?: Date

  @Prop({
    type: Date
  })
  createdAt: Date

  @Prop({
    type: Date
  })
  updatedAt: Date

  @Prop({
    type: Boolean
  })
  isDeleted?: boolean

  @Prop({
    type: Date
  })
  deletedAt?: Date
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign)

// Create indexes
CampaignSchema.index({ code: 1, isActive: 1, startDate: 1, endDate: 1 })
CampaignSchema.index({ code: 1, type: 1 })

// Plugins

// Virtual fields
CampaignSchema.virtual('status').get(function (this) {
  if (!this.isActive || this.isDeleted) return ECampaignStatus.DEACTIVATED
  const currentDate = dayjs()

  if (this.redemptionAmountLimit && this.usedAmount >= this.redemptionAmountLimit)
    return ECampaignStatus.OVER_AMOUNT_LIMIT

  if (this.redemptionCountLimit && this.usedCount >= this.redemptionCountLimit)
    return ECampaignStatus.OVER_COUNT_LIMIT

  if (!currentDate.isBetween(this.startDate, this.endDate, undefined, '[]'))
    return ECampaignStatus.NOT_APPLICABLE

  return ECampaignStatus.APPLICABLE
})
