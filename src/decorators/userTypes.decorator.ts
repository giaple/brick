import { SetMetadata } from '@nestjs/common'
import type { EUserType } from '@/common/enum/user.enum'

export const USER_TYPE_KEY = 'userTypes'
export const UserTypes = (...userTypes: EUserType[]) => SetMetadata(USER_TYPE_KEY, userTypes)
