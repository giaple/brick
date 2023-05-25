import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { IJwtDecodedPayload } from '@/modules/auth/auth.interface'
import type { IAuthConfig } from '@/modules/config/authConfig'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const authConfig = configService.get<IAuthConfig>('auth')!
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwt.secret
    })
  }

  async validate(payload: IJwtDecodedPayload) {
    return { id: payload.sub, userType: payload.userType }
  }
}
