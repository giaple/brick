import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { Types } from 'mongoose'
import { JWT_KEY_NAME } from '@/common/constant'
import type { EUserType } from '@/common/enum/user.enum'
import { USER_TYPE_KEY } from '@/decorators/userTypes.decorator'
import type { IRequestedUser } from '@/modules/auth/auth.interface'
import { AuthService } from '@/modules/auth/auth.service'
import type { ExecutionContext } from '@nestjs/common'
import type { Observable } from 'rxjs'

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService, private readonly reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const userTypes = this.reflector.get<EUserType[]>(USER_TYPE_KEY, context.getHandler())
    let request
    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest()
    } else {
      const ctx = GqlExecutionContext.create(context)
      request = ctx.getContext().req
    }

    const token = this.extractTokenFromHeader(request)

    if (!token) {
      return false
    }

    try {
      const payload = this.authService.verify(token)

      if (userTypes && !userTypes.includes(payload.userType)) {
        return false
      }

      const user: IRequestedUser = {
        id: new Types.ObjectId(payload.sub),
        userType: payload.userType
      }

      request.user = user
    } catch (err) {
      return false
    }

    return true
  }

  private extractTokenFromHeader(request: any): string | undefined {
    if (!request.headers?.authorization) return

    const [type, token] = request.headers.authorization.split(' ') ?? []
    return type === JWT_KEY_NAME ? token : undefined
  }
}
