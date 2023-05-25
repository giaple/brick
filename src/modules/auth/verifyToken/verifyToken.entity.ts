import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { EVerifyTokenType } from '@/common/enum/auth.enum'
import { EUserType } from '@/common/enum/user.enum'
import type { IVerifyToken } from './verifyToken.interface'
import type { Types } from 'mongoose'

@Schema({
  autoIndex: true,
  timestamps: true
})
export class VerifyToken extends Document implements IVerifyToken {
  declare _id: Types.ObjectId

  @Prop({
    enum: EUserType,
    required: true
  })
  userType: EUserType

  @Prop({
    type: String,
    required: true
  })
  userIdentity: string

  @Prop({
    type: String,
    required: true
  })
  token: string

  @Prop({
    type: Boolean,
    default: false
  })
  isUsed: boolean

  @Prop({
    enum: EVerifyTokenType,
    required: true
  })
  verifyType: EVerifyTokenType

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

export const VerifyTokenSchema = SchemaFactory.createForClass(VerifyToken)

// Create indexes
VerifyTokenSchema.index({ token: 1, userType: 1, userIdentity: 1, verifyType: 1, isUsed: 1 })

// Plugins
