export interface IFPTSMSConfig {
  smsUrl: string
  authUrl: string
  clientId: string
  secret: string
  scope: string
  brandName: string
}

const fptSMS: IFPTSMSConfig = {
  smsUrl: process.env.FPT_SMS_URL ?? 'http://sandbox.sms.fpt.net/api/push-brandname-otp',
  authUrl: process.env.FPT_AUTH_URL ?? 'http://sandbox.sms.fpt.net/oauth2/token',
  clientId: process.env.FPT_CLIENT_ID ?? 'F1608cd306b99059c193D72294bcb4a7e7854360',
  secret:
    process.env.FPT_SECRET ??
    'e267e47Fd9412d896c61fAa52809fc0c08F99fee7512ab8b1bfc3c6b14d77be39de709b4',
  scope: process.env.FPT_SCOPE ?? 'send_brandname_otp send_brandname',
  brandName: process.env.FPT_BRAND_NAME ?? 'FTI'
}

export default () => ({ fptSMS })
