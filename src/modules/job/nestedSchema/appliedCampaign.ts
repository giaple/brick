import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, Schema as MongooseSchema } from 'mongoose'
import { ECampaignType } from '@/common/enum/campaign.enum'
import type { IAppliedCampaign } from '@/modules/job/job.interface'
import { AppliedCampaignTargetSchema } from './appliedCampaignTarget'
import type { AppliedCampaignTarget } from './appliedCampaignTarget'

@Schema({
  _id: false
})
export class AppliedCampaign implements IAppliedCampaign {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true
  })
  refId: Types.ObjectId

  @Prop({
    type: String,
    required: true
  })
  code: string

  @Prop({
    enum: ECampaignType,
    required: true
  })
  type: ECampaignType

  @Prop({
    type: [AppliedCampaignTargetSchema],
    default: []
  })
  appliedTargets: AppliedCampaignTarget[]
}

export const AppliedCampaignSchema = SchemaFactory.createForClass(AppliedCampaign)
