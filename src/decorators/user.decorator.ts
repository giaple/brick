import { createParamDecorator } from '@nestjs/common'
import type { IRequestedUser } from '@/modules/auth/auth.interface'
import type { ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext): IRequestedUser => {
  const request = ctx.switchToHttp().getRequest()
  return request.user
})
