import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { HeaderAPIKeyStrategy } from 'passport-headerapikey'
import { API_KEY_NAME } from '@/common/constant'
import { EErrorMessage } from '@/common/enum/error.enum'
import type { IDone } from '@/modules/auth/auth.interface'
import { AuthService } from '@/modules/auth/auth.service'

@Injectable()
export class ApiKeyStragety extends PassportStrategy(HeaderAPIKeyStrategy, API_KEY_NAME) {
  constructor(private readonly authService: AuthService) {
    super({ header: API_KEY_NAME, prefix: '' }, true, async (apiKey: string, done: IDone) => {
      this.authService.validateApiKey(apiKey)
        ? done(null, true)
        : done(new UnauthorizedException(EErrorMessage.USER_UNAUTHORIZED), null)
    })
  }
}
