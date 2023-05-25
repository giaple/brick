import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { IJobMetadata } from '@/modules/job/job.interface'

@Schema({
  _id: false
})
export class JobMetadata implements IJobMetadata {
  @Prop({
    type: String
  })
  utmSource?: string

  @Prop({
    type: String
  })
  utmCampaign?: string

  @Prop({
    type: String
  })
  utmMedium?: string

  @Prop({
    type: String
  })
  referralName?: string
}

export const JobMetadataSchema = SchemaFactory.createForClass(JobMetadata)
