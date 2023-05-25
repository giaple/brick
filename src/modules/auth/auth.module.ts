import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { AdminModule } from '@/modules/admin/admin.module'
import type { IAuthConfig } from '@/modules/config/authConfig'
import { CustomerModule } from '@/modules/customer/customer.module'
import { NotificationModule } from '@/modules/notification/notification.module'
import { WorkerModule } from '@/modules/worker/worker.module'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { RefreshToken, RefreshTokenSchema } from './refreshToken/refreshToken.entity'
import { RefreshTokenRepository } from './refreshToken/refreshToken.repository'
import { RefreshTokenService } from './refreshToken/refreshToken.service'
import { ApiKeyStragety } from './strategy/apiKey.strategy'
import { JwtStrategy } from './strategy/jwt.strategy'
import { VerifyToken, VerifyTokenSchema } from './verifyToken/verifyToken.entity'
import { VerifyTokenRepository } from './verifyToken/verifyToken.repository'
import { VerifyTokenService } from './verifyToken/verifyToken.service'

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const authConfig = configService.get<IAuthConfig>('auth')!
        return {
          secret: authConfig.jwt.secret,
          signOptions: { expiresIn: authConfig.jwt.signOptions.expiresIn }
        }
      },
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([
      { name: VerifyToken.name, schema: VerifyTokenSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema }
    ]),
    NotificationModule,
    CustomerModule,
    WorkerModule,
    AdminModule
  ],
  providers: [
    AuthService,
    ApiKeyStragety,
    JwtStrategy,
    AuthResolver,
    VerifyTokenService,
    VerifyTokenRepository,
    RefreshTokenService,
    RefreshTokenRepository
  ],
  exports: [AuthService]
})
export class AuthModule {}
