import { registerEnumType } from '@nestjs/graphql'

export enum EVerifyTokenType {
  OTP = 'OTP',
  EMAIL = 'EMAIL'
}

registerEnumType(EVerifyTokenType, {
  name: 'EVerifyTokenType'
})
