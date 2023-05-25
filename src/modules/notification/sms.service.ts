import { randomUUID } from 'crypto'
import { HttpService } from '@nestjs/axios'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { catchError, firstValueFrom } from 'rxjs'
import { EPhoneCountryCode } from '@/common/enum/user.enum'
import type { IFPTSMSConfig } from '@/modules/config/fptSMSConfig'
import type { SendSmsDto } from './sms.dto'
import type { IGetFPTAccessTokenReq, IGetFPTAccessTokenRes, ISendFPTSMSReq } from './sms.interface'
import type { AxiosError } from 'axios'

@Injectable()
export class SmsService {
  private readonly _config: IFPTSMSConfig
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this._config = this.configService.get<IFPTSMSConfig>('fptSMS')!
  }

  async sendSms(input: SendSmsDto) {
    const data = await this._getAccessToken()
    const body: ISendFPTSMSReq = {
      access_token: data.access_token,
      session_id: randomUUID(),
      BrandName: this._config.brandName,
      Phone: this._standardizePhone(input.phone),
      Message: this._encodeMessage(input.message),
      RequestId: input.phone
    }

    await firstValueFrom(
      this.httpService.post<IGetFPTAccessTokenRes>(this._config.smsUrl, body).pipe(
        catchError((err: AxiosError) => {
          throw new InternalServerErrorException((err.response?.data as any).error_description)
        })
      )
    )
  }

  generateOTPCode() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  private async _getAccessToken() {
    const body: IGetFPTAccessTokenReq = {
      client_id: this._config.clientId,
      client_secret: this._config.secret,
      scope: this._config.scope,
      session_id: randomUUID(),
      grant_type: 'client_credentials'
    }

    const res = await firstValueFrom(
      this.httpService.post<IGetFPTAccessTokenRes>(this._config.authUrl, body).pipe(
        catchError((err: AxiosError) => {
          throw new InternalServerErrorException((err.response?.data as any).error_description)
        })
      )
    )

    return res.data
  }

  private _encodeMessage(message: string) {
    return Buffer.from(message).toString('base64')
  }

  private _standardizePhone(phone: string) {
    return EPhoneCountryCode.VI + phone
  }
}
