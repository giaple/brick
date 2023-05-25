export interface IGetFPTAccessTokenReq {
  client_id: string
  client_secret: string
  scope: string
  session_id: string
  grant_type: string
}

export interface IGetFPTAccessTokenRes {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
}

export interface ISendFPTSMSReq {
  access_token: string
  session_id: string
  BrandName: string
  Phone: string
  Message: string
  RequestId: string
}

export interface ISendFPTSMSRes {
  MessageId: string
  Phone: string
  BrandName: string
  Message: string
  PartnerId: string
  Telco: string
  IsSent: number
}
