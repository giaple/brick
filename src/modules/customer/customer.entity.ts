import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { EGender, EPhoneCountryCode } from '@/common/enum/user.enum'
import type { ICustomer } from './customer.interface'
import type { Types } from 'mongoose'

@Schema({
  autoIndex: true,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Customer extends Document implements ICustomer {
  declare _id: Types.ObjectId

  @Prop({
    type: String,
    default: EPhoneCountryCode.VI
  })
  phoneCountryCode: string

  @Prop({
    type: String,
    required: true
  })
  phoneNumber: string

  @Prop({
    type: String
  })
  firstName?: string

  @Prop({
    type: String
  })
  lastName?: string

  @Prop({
    type: String
  })
  dob?: string

  @Prop({
    type: String,
    enum: EGender
  })
  gender?: EGender

  @Prop({
    type: String
  })
  city?: string

  @Prop({
    type: String
  })
  district?: string

  @Prop({
    type: String
  })
  ward?: string

  @Prop({
    type: String
  })
  address?: string

  @Prop({
    type: String
  })
  email?: string

  @Prop({
    type: Boolean
  })
  isEmailVerified?: boolean

  @Prop({
    type: String
  })
  imageUrl?: string

  @Prop({
    type: String
  })
  adminNote?: string

  @Prop({
    type: Boolean
  })
  isDeleted?: boolean

  @Prop({
    type: Date
  })
  deletedAt?: Date

  @Prop({
    type: Date
  })
  createdAt: Date

  @Prop({
    type: Date
  })
  updatedAt: Date
}

export const CustomerSchema = SchemaFactory.createForClass(Customer)

// Create indexes
CustomerSchema.index({ phoneNumber: 1 }, { unique: true })
CustomerSchema.index({ email: 1 }, { unique: true, sparse: true })

CustomerSchema.virtual('fullName').get(function (this) {
  return `${this.firstName ? `${this.firstName} ` : ''}${this.lastName ?? ''}`
})
