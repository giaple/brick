import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, Schema as MongooseSchema } from 'mongoose'
import type { IJobItemOption } from '@/modules/job/job.interface'

@Schema({
  _id: false
})
export class JobItemOption implements IJobItemOption {
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
}

export const JobItemOptionSchema = SchemaFactory.createForClass(JobItemOption)
