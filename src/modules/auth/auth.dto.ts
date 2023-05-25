import { Field, InputType } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { Matches } from 'class-validator'
import { VI_PHONE_REGEX } from '@/common/constant'
import { EErrorMessage } from '@/common/enum/error.enum'
import { EUserType } from '@/common/enum/user.enum'
import { formatPhoneNumber } from '@/common/helper'
import type { Types } from 'mongoose'

@InputType()
export class UserPhoneLoginInput {
  @Field(() => String)
  @Transform(({ value }) => formatPhoneNumber(value))
  @Matches(VI_PHONE_REGEX, { message: EErrorMessage.PHONE_NUMBER_INVALID })
  phoneNumber: string

  @Field(() => EUserType)
  type: EUserType
}

@InputType()
export class UserVerifyPhoneOTPInput {
  @Field(() => String)
  code: string

  @Field(() => EUserType)
  type: EUserType

  @Field(() => String)
  @Transform(({ value }) => formatPhoneNumber(value))
  @Matches(VI_PHONE_REGEX, { message: EErrorMessage.PHONE_NUMBER_INVALID })
  phoneNumber: string
}

@InputType()
export class UserLogoutInput {
  @Field(() => String)
  refreshToken: string
}

@InputType()
export class UserRegenerateRefreshTokenInput {
  @Field(() => String)
  refreshToken: string
}

/* Internal DTOs */
export class GenerateUserTokenInput {
  id: Types.ObjectId
  userType: EUserType
}
