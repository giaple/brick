import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { ICategorySchedule } from '@/modules/category/category.interface'

@Schema({
  _id: false
})
export class CategorySchedule implements ICategorySchedule {
  @Prop({
    type: Number,
    default: 420
  })
  startTime: number

  @Prop({
    type: Number,
    default: 1260
  })
  endTime: number

  @Prop({
    type: Number,
    default: 30
  })
  gap: number
}

export const CategoryScheduleSchema = SchemaFactory.createForClass(CategorySchedule)
