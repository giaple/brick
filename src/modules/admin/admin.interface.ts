import type { EAdminRoleType } from '@/common/enum/user.enum'
import type { IUser } from '@/common/interface/user.interface'

export interface IAdmin extends IUser {
  isActive: boolean
  deactivatedAt?: Date
  role: EAdminRoleType
}
