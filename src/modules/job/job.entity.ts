import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { EJobStatus } from '@/common/enum/job.enum'
import { generateCSID } from './job.helper'
import { AppliedCampaignSchema } from './nestedSchema/appliedCampaign'
import { JobItemSchema } from './nestedSchema/jobItem'
import { JobMetadata, JobMetadataSchema } from './nestedSchema/jobMetadata'
import type { IJob } from './job.interface'
import type { AppliedCampaign } from './nestedSchema/appliedCampaign'
import type { JobItem } from './nestedSchema/jobItem'

@Schema({
  autoIndex: true,
  timestamps: true
})
export class Job extends Document implements IJob {
  declare _id: Types.ObjectId

  @Prop({
    type: String,
    default: generateCSID
  })
  csId: string

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true
  })
  categoryId: Types.ObjectId

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true
  })
  transactionId: Types.ObjectId

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true
  })
  appointmentId: Types.ObjectId

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true
  })
  customerId: Types.ObjectId

  @Prop({
    type: [AppliedCampaignSchema]
  })
  appliedCampaigns?: AppliedCampaign[]

  @Prop({
    type: MongooseSchema.Types.ObjectId
  })
  workerId?: Types.ObjectId

  @Prop({
    type: String,
    required: true
  })
  phoneNumber: string

  @Prop({
    type: String,
    required: true
  })
  customerName: string

  @Prop({
    type: String,
    required: true
  })
  address: string

  @Prop({
    type: JobMetadataSchema
  })
  metadata?: JobMetadata

  @Prop({
    type: [String],
    default: []
  })
  imageUrls: string[]

  @Prop({
    type: [String],
    default: []
  })
  workImageUrls: string[]

  @Prop({
    enum: EJobStatus,
    default: EJobStatus.POSTED
  })
  status: EJobStatus

  @Prop({
    type: String
  })
  note?: string

  @Prop({
    type: String
  })
  adminNote?: string

  @Prop({
    tpye: Number,
    required: true
  })
  totalPrice: number

  @Prop({
    tpye: Number,
    required: true
  })
  finalTotalPrice: number

  @Prop({
    tpye: Number,
    default: 0
  })
  totalDiscountPrice: number

  @Prop({
    type: [JobItemSchema],
    required: true
  })
  items: JobItem[]

  @Prop({
    type: Date
  })
  startDate: Date

  @Prop({
    type: Date
  })
  endDate: Date

  @Prop({
    type: Date
  })
  createdAt: Date

  @Prop({
    type: Date
  })
  updatedAt: Date

  @Prop({
    type: Date
  })
  contactedAt?: Date

  @Prop({
    type: Date
  })
  rescheduledAt?: Date

  @Prop({
    type: Date
  })
  inProgressAt?: Date

  @Prop({
    type: Date
  })
  doneAt?: Date

  @Prop({
    type: Date
  })
  cancelledAt?: Date
}

export const JobSchema = SchemaFactory.createForClass(Job)

// Create indexes
JobSchema.index({ categoryId: 1 })
JobSchema.index({ csId: 1 })
