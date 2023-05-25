import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { CategorySchedule, CategoryScheduleSchema } from './nestedSchema/categorySchedule'
import type { ICategory } from './category.interface'

@Schema({
  autoIndex: true,
  timestamps: true
})
export class Category extends Document implements ICategory {
  declare _id: Types.ObjectId

  @Prop({
    type: String,
    required: true
  })
  name: string

  @Prop({
    type: MongooseSchema.Types.ObjectId
  })
  parentId?: Types.ObjectId

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    default: []
  })
  ancestorIds: Types.ObjectId[]

  @Prop({
    type: String,
    required: true
  })
  description: string

  @Prop({
    type: String,
    required: true
  })
  code: string

  @Prop({
    type: [String],
    default: []
  })
  imageUrls: string[]

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

  @Prop({
    type: CategoryScheduleSchema,
    default: {}
  })
  schedule: CategorySchedule
}

export const CategorySchema = SchemaFactory.createForClass(Category)

// Create indexes
CategorySchema.index({ parentId: 1 })
CategorySchema.index({ code: 1 })

// Plugins
