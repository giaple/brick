import type { EUserType } from '@/common/enum/user.enum'
import type { IObjectId } from '@/common/interface'
import type { Types } from 'mongoose'

export interface IRefreshToken extends IObjectId {
  userType: EUserType
  userId: Types.ObjectId
  token: string
  expiredAt: Date
  createdAt: Date
  updatedAt: Date
}
