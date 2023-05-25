import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import type { IWorkerTimeSlot } from '@/modules/worker/worker.interface'

@Schema({
  _id: false
})
export class WorkerTimeSlot extends Document implements IWorkerTimeSlot {
  @Prop({
    type: Number,
    required: true
  })
  startTime: number

  @Prop({
    type: Number,
    required: true
  })
  endTime: number

  @Prop({
    type: Boolean,
    required: true
  })
  isActive: boolean

  @Prop({
    type: Number
  })
  jobLimit?: number
}

export const WorkerTimeSlotSchema = SchemaFactory.createForClass(WorkerTimeSlot)
