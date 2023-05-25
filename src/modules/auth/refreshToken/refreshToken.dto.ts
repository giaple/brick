import type { EUserType } from '@/common/enum/user.enum'
import type { Types } from 'mongoose'

/* Internal DTOs */
export class RefreshTokenCreateInput {
  token: string
  userType: EUserType
  userId: Types.ObjectId
}

export class FindRefreshTokenByTokenInput {
  token: string
  userType: EUserType
  userId: Types.ObjectId
}

export class DeleteRefreshTokenByTokenInput {
  token: string
  userType: EUserType
  userId: Types.ObjectId
}
