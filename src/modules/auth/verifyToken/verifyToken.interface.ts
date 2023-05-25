import type { EVerifyTokenType } from '@/common/enum/auth.enum'
import type { EUserType } from '@/common/enum/user.enum'
import type { IObjectId } from '@/common/interface'

export interface IVerifyToken extends IObjectId {
  userType: EUserType
  userIdentity: string
  token: string
  isUsed: boolean
  verifyType: EVerifyTokenType
  expiredAt: Date
  createdAt: Date
  updatedAt: Date
}
