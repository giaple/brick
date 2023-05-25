import type { EGender } from '@/common/enum/user.enum'
import type { IObjectId } from '.'

export interface IUser extends IObjectId {
  firstName?: string
  lastName?: string
  gender?: EGender
  dob?: string
  email?: string
  isEmailVerified?: boolean
  city?: string
  district?: string
  ward?: string
  address?: string
  phoneCountryCode: string
  phoneNumber: string
  adminNote?: string
  imageUrl?: string
  isDeleted?: boolean
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
  // virtual fields
  fullName?: string
}
