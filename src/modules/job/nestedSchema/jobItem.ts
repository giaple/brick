import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, Schema as MongooseSchema } from 'mongoose'
import type { IJobItem } from '@/modules/job/job.interface'
import { JobItemOptionSchema } from './jobItemOption'
import type { JobItemOption } from './jobItemOption'

@Schema({
  _id: false
})
export class JobItem implements IJobItem {
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
    type: Number,
    required: true
  })
  quantity: number

  @Prop({
    type: Number,
    required: true
  })
  price: number

  @Prop({
    type: Number,
    required: true
  })
  finalPrice: number

  @Prop({
    type: [JobItemOptionSchema]
  })
  options?: JobItemOption[]
}

export const JobItemSchema = SchemaFactory.createForClass(JobItem)
