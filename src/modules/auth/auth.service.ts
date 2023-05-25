import { randomUUID } from 'crypto'
import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { EVerifyTokenType } from '@/common/enum/auth.enum'
import { EErrorMessage } from '@/common/enum/error.enum'
import { ESuccessMessage } from '@/common/enum/response.enum'
import { EUserType } from '@/common/enum/user.enum'
import type { SuccessRes } from '@/common/model'
import { AdminService } from '@/modules/admin/admin.service'
import type { IAuthConfig } from '@/modules/config/authConfig'
import { CustomerService } from '@/modules/customer/customer.service'
import { SmsService } from '@/modules/notification/sms.service'
import { WorkerService } from '@/modules/worker/worker.service'
import { RefreshTokenService } from './refreshToken/refreshToken.service'
import { VerifyTokenService } from './verifyToken/verifyToken.service'
import type {
  GenerateUserTokenInput,
  UserLogoutInput,
  UserPhoneLoginInput,
  UserRegenerateRefreshTokenInput,
  UserVerifyPhoneOTPInput
} from './auth.dto'
import type { IJwtDecodedPayload, IJwtPayload, IRequestedUser } from './auth.interface'
import type { UserLoginModel, UserTokensModel } from './auth.model'
import type { VerifyTokenInput } from './verifyToken/verifyToken.dto'
import type { Types } from 'mongoose'

@Injectable()
export class AuthService {
  private readonly _config: IAuthConfig
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
    private readonly verifyTokenService: VerifyTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly customerService: CustomerService,
    private readonly workerService: WorkerService,
    private readonly adminService: AdminService
  ) {
    this._config = this.configService.get<IAuthConfig>('auth')!
  }

  validateApiKey(apiKey: string) {
    const apiKeys: string[] = [this._config.apiKey]
    return apiKeys.find((key) => key === apiKey)
  }

  sign(payload: IJwtPayload) {
    return this.jwtService.sign(payload.data, {
      issuer: payload.issuer ?? this._config.jwt.signOptions.issuer,
      subject: payload.subject.toString()
    })
  }

  verify(token: string): IJwtDecodedPayload {
    return this.jwtService.verify(token)
  }

  async generateUserTokens(input: GenerateUserTokenInput): Promise<UserTokensModel> {
    const payload: IJwtPayload = {
      subject: input.id.toString(),
      data: {
        userType: input.userType
      }
    }
    const accessToken = this.sign(payload)
    const refreshToken = await this.refreshTokenService.create({
      token: randomUUID(),
      userId: input.id,
      userType: input.userType
    })

    return {
      accessToken,
      refreshToken: refreshToken.token
    }
  }

  async phoneLogin(input: UserPhoneLoginInput): Promise<SuccessRes> {
    switch (input.type) {
      case EUserType.CUSTOMER:
        break

      case EUserType.WORKER:
        await this.workerService.findByPhoneNumber(input.phoneNumber)
        break

      case EUserType.ADMIN:
        await this.adminService.findByPhoneNumber(input.phoneNumber)
        break

      default:
        throw new BadRequestException(EErrorMessage.USER_TYPE_INVALID)
    }

    const otpCode = this.smsService.generateOTPCode()
    // const message = `Nook: Mã xác thực của bạn là: ${otpCode}`
    // await this.smsService.sendSms({
    //   phone: input.phoneNumber,
    //   message
    // })

    await this.verifyTokenService.create({
      token: otpCode,
      userType: input.type,
      userIdentity: input.phoneNumber,
      verifyType: EVerifyTokenType.OTP
    })

    return {
      message: ESuccessMessage.LOGIN_SUCCESS,
      success: true
    }
  }

  async verifyOtpCode(input: UserVerifyPhoneOTPInput): Promise<UserLoginModel> {
    const query: VerifyTokenInput = {
      token: input.code,
      userIdentity: input.phoneNumber,
      userType: input.type,
      verifyType: EVerifyTokenType.OTP
    }
    await this.verifyTokenService.verifyToken(query)

    let id: Types.ObjectId
    switch (input.type) {
      case EUserType.CUSTOMER:
        id = (
          await this.customerService.findOrCreateNew({
            phoneNumber: input.phoneNumber
          })
        )._id
        break

      case EUserType.WORKER:
        id = (await this.workerService.findByPhoneNumber(input.phoneNumber))._id
        break

      case EUserType.ADMIN:
        id = (await this.adminService.findByPhoneNumber(input.phoneNumber))._id
        break

      default:
        throw new BadRequestException(EErrorMessage.USER_TYPE_INVALID)
    }

    const tokens = await this.generateUserTokens({
      id,
      userType: input.type
    })

    return {
      ...tokens,
      userInfo: {
        _id: id,
        type: input.type
      }
    }
  }

  async logout(user: IRequestedUser, input: UserLogoutInput) {
    await this.refreshTokenService.deleteByToken({
      token: input.refreshToken,
      userId: user.id,
      userType: user.userType
    })
    return {
      message: ESuccessMessage.LOGOUT_SUCCESS,
      success: true
    }
  }

  async regenerateRefreshToken(user: IRequestedUser, input: UserRegenerateRefreshTokenInput) {
    const existingEntity = await this.refreshTokenService.findByToken({
      userId: user.id,
      userType: user.userType,
      token: input.refreshToken
    })

    return await this.generateUserTokens({
      id: existingEntity.userId,
      userType: existingEntity.userType
    })
  }
}
