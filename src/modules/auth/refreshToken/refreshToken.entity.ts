import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { EUserType } from '@/common/enum/user.enum'
import type { IRefreshToken } from './refreshToken.interface'

@Schema({
  autoIndex: true,
  timestamps: true
})
export class RefreshToken extends Document implements IRefreshToken {
  declare _id: Types.ObjectId

  @Prop({
    enum: EUserType,
    required: true
  })
  userType: EUserType

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true
  })
  userId: Types.ObjectId

  @Prop({
    type: String,
    required: true
  })
  token: string

  @Prop({
    type: Date,
    required: true
  })
  expiredAt: Date

  @Prop({
    type: Date
  })
  createdAt: Date

  @Prop({
    type: Date
  })
  updatedAt: Date
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)

// Create indexes
RefreshTokenSchema.index({ token: 1, userType: 1, userId: 1 })

// Plugins
