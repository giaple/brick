import { Field, InputType } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { IsEmail, IsOptional, Matches } from 'class-validator'
import { VI_PHONE_REGEX } from '@/common/constant'
import { BooleanFilterInput } from '@/common/dto/queryCondition.dto'
import { EErrorMessage } from '@/common/enum/error.enum'
import { EGender, EAdminRoleType } from '@/common/enum/user.enum'
import { formatPhoneNumber } from '@/common/helper'

@InputType()
export class AdminCreateInput {
  @Field(() => String)
  @Transform(({ value }) => formatPhoneNumber(value))
  @Matches(VI_PHONE_REGEX, { message: EErrorMessage.PHONE_NUMBER_INVALID })
  phoneNumber: string

  @Field(() => String, { nullable: true })
  firstName?: string

  @Field(() => String, { nullable: true })
  lastName?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string

  @Field(() => EGender, { nullable: true })
  gender?: EGender

  @Field(() => String, { nullable: true })
  dob?: string

  @Field(() => String, { nullable: true })
  imageUrl?: string

  @Field(() => String, { nullable: true })
  city?: string

  @Field(() => String, { nullable: true })
  district?: string

  @Field(() => String, { nullable: true })
  ward?: string

  @Field(() => String, { nullable: true })
  address?: string

  @Field(() => EAdminRoleType, { nullable: true })
  role?: EAdminRoleType

  @Field(() => String, { nullable: true })
  adminNote?: string
}

@InputType()
export class AdminUpdateInput {
  @Field(() => String, { nullable: true })
  firstName?: string

  @Field(() => String, { nullable: true })
  lastName?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string

  @Field(() => EGender, { nullable: true })
  gender?: EGender

  @Field(() => String, { nullable: true })
  dob?: string

  @Field(() => String, { nullable: true })
  imageUrl?: string

  @Field(() => String, { nullable: true })
  city?: string

  @Field(() => String, { nullable: true })
  district?: string

  @Field(() => String, { nullable: true })
  ward?: string

  @Field(() => String, { nullable: true })
  address?: string

  @Field(() => EAdminRoleType, { nullable: true })
  role?: EAdminRoleType

  @Field(() => String, { nullable: true })
  adminNote?: string
}

@InputType()
export class AdminDeleteInput {
  @Field(() => Boolean, { nullable: true })
  isForce?: boolean
}

@InputType()
export class AdminSearchQueryInput {
  @Field(() => BooleanFilterInput, { nullable: true })
  isDeleted?: BooleanFilterInput
}
