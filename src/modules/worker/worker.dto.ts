import { Field, InputType, Int } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { IsEmail, IsOptional, Matches } from 'class-validator'
import { Types } from 'mongoose'
import { VI_PHONE_REGEX } from '@/common/constant'
import { BooleanFilterInput, IDFilterInput } from '@/common/dto/queryCondition.dto'
import { EErrorMessage } from '@/common/enum/error.enum'
import { EGender, EScheduleDay, EWorkerRoleType } from '@/common/enum/user.enum'
import { formatPhoneNumber } from '@/common/helper'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'

@InputType()
export class WorkerTimeSlotInput {
  @Field(() => Int)
  startTime: number

  @Field(() => Int)
  endTime: number

  @Field(() => Boolean)
  isActive: boolean
}

@InputType()
export class WorkerScheduleInput {
  @Field(() => WorkerTimeSlotInput)
  [EScheduleDay.SUNDAY]: WorkerTimeSlotInput[];

  @Field(() => WorkerTimeSlotInput)
  [EScheduleDay.MONDAY]: WorkerTimeSlotInput[];

  @Field(() => WorkerTimeSlotInput)
  [EScheduleDay.TUESDAY]: WorkerTimeSlotInput[];

  @Field(() => WorkerTimeSlotInput)
  [EScheduleDay.WEDNESDAY]: WorkerTimeSlotInput[];

  @Field(() => WorkerTimeSlotInput)
  [EScheduleDay.THURSDAY]: WorkerTimeSlotInput[];

  @Field(() => WorkerTimeSlotInput)
  [EScheduleDay.FRIDAY]: WorkerTimeSlotInput[];

  @Field(() => WorkerTimeSlotInput)
  [EScheduleDay.SATURDAY]: WorkerTimeSlotInput[]
}

@InputType()
export class WorkerCreateInput {
  @Field(() => String)
  @Transform(({ value }) => formatPhoneNumber(value))
  @Matches(VI_PHONE_REGEX, { message: EErrorMessage.PHONE_NUMBER_INVALID })
  phoneNumber: string

  @Field(() => ObjectIdScalar)
  categoryId: Types.ObjectId

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

  @Field(() => EWorkerRoleType, { nullable: true })
  role?: EWorkerRoleType

  @Field(() => String, { nullable: true })
  adminNote?: string

  @Field(() => WorkerScheduleInput, { nullable: true })
  schedule?: WorkerScheduleInput
}

@InputType()
export class WorkerUpdateInput {
  @Field(() => ObjectIdScalar, { nullable: true })
  categoryId?: Types.ObjectId

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

  @Field(() => EWorkerRoleType, { nullable: true })
  role?: EWorkerRoleType

  @Field(() => String, { nullable: true })
  adminNote?: string

  @Field(() => WorkerScheduleInput, { nullable: true })
  schedule?: WorkerScheduleInput
}

@InputType()
export class WorkerDeleteInput {
  @Field(() => Boolean, { nullable: true })
  isForce?: boolean
}

@InputType()
export class WorkerSearchQueryInput {
  @Field(() => BooleanFilterInput, { nullable: true })
  isDeleted?: BooleanFilterInput
}

@InputType()
export class WorkerFindManyQueryInput {
  @Field(() => [ObjectIdScalar], { nullable: true })
  ids?: Types.ObjectId[]

  @Field(() => IDFilterInput, { nullable: true })
  categoryId?: IDFilterInput
}
