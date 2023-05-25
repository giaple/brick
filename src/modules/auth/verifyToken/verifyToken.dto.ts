import type { EVerifyTokenType } from '@/common/enum/auth.enum'
import type { EUserType } from '@/common/enum/user.enum'

/* Internal DTOs */
export class VerifyTokenCreateInput {
  token: string
  userType: EUserType
  verifyType: EVerifyTokenType
  userIdentity: string
}

export class VerifyTokenInput {
  token: string
  userType: EUserType
  verifyType: EVerifyTokenType
  userIdentity: string
}
