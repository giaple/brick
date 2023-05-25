import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import type { IItem } from './item.interface'

@Schema({
  autoIndex: true,
  timestamps: true
})
export class Item extends Document implements IItem {
  declare _id: Types.ObjectId

  @Prop({
    type: String,
    required: true
  })
  name: string

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true
  })
  categoryId: Types.ObjectId

  @Prop({
    type: Number,
    required: true
  })
  price: number

  @Prop({
    type: Number,
    required: true
  })
  minQuantity: number

  @Prop({
    type: Number
  })
  maxQuantity?: number

  @Prop({
    type: Number,
    required: true
  })
  estTime: number

  @Prop({
    type: [String],
    default: []
  })
  imageUrls: string[]

  @Prop({
    type: [String],
    default: []
  })
  tags: string[]

  @Prop({
    type: Number,
    default: 0
  })
  orderCount: number

  @Prop({
    type: String
  })
  subName?: string

  @Prop({
    type: String
  })
  content?: string

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    default: []
  })
  optionIds: Types.ObjectId[]

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

export const ItemSchema = SchemaFactory.createForClass(Item)

// Create indexes
ItemSchema.index({ categoryId: 1, isActive: 1 })

// Plugins
