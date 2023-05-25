import type { EUserType } from '@/common/enum/user.enum'
import type { Types } from 'mongoose'

export type IDone = (error: Error | null, next: any) => void

export interface IJwtData {
  userType: EUserType
}

export interface IJwtPayload {
  issuer?: string
  subject: string
  data: IJwtData
}

export interface IJwtDecodedPayload {
  iss: string
  sub: string
  userType: EUserType
  iat: number
  exp: number
}

export interface IRequestedUser {
  id: Types.ObjectId
  userType: EUserType
}
