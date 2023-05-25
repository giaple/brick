import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { EGender, EPhoneCountryCode, EAdminRoleType } from '@/common/enum/user.enum'
import type { IAdmin } from './admin.interface'
import type { Types } from 'mongoose'

@Schema({
  autoIndex: true,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Admin extends Document implements IAdmin {
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
    enum: EAdminRoleType,
    default: EAdminRoleType.STAFF
  })
  role: EAdminRoleType

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
}

export const AdminSchema = SchemaFactory.createForClass(Admin)

// Create indexes
AdminSchema.index({ phoneNumber: 1 }, { unique: true })
AdminSchema.index({ email: 1 }, { unique: true, sparse: true })

// Virtuals
AdminSchema.virtual('fullName').get(function (this) {
  return `${this.firstName ? `${this.firstName} ` : ''}${this.lastName ?? ''}`
})
