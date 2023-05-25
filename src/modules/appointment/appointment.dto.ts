import { Field, InputType } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { DateFilterInput, IDFilterInput, StringFilterInput } from '@/common/dto/queryCondition.dto'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'

@InputType()
export class AppointmentUpdateInput {
  @Field(() => ObjectIdScalar, { nullable: true })
  workerId?: Types.ObjectId

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => Date, { nullable: true })
  startDate?: Date

  @Field(() => Date, { nullable: true })
  endDate?: Date

  @Field(() => String, { nullable: true })
  adminNote?: string
}

@InputType()
export class AppointmentSearchQueryInput {
  @Field(() => ObjectIdScalar, { nullable: true })
  customerId?: Types.ObjectId

  @Field(() => ObjectIdScalar, { nullable: true })
  workerId?: Types.ObjectId

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => Date, { nullable: true })
  startDate?: Date

  @Field(() => Date, { nullable: true })
  endDate?: Date
}

@InputType()
export class AppointmentFindManyQueryInput {
  @Field(() => [ObjectIdScalar], { nullable: true })
  ids?: Types.ObjectId[]

  @Field(() => IDFilterInput, { nullable: true })
  workerId?: IDFilterInput

  @Field(() => DateFilterInput, { nullable: true })
  startDate?: DateFilterInput

  @Field(() => StringFilterInput, { nullable: true })
  status?: StringFilterInput
}

@InputType()
export class AppointmentGetAvailableSlotsByDateInput {
  @Field(() => ObjectIdScalar)
  categoryId: Types.ObjectId

  @Field(() => Date)
  date: Date
}

/* Internal DTOs */
export class AppointmentCreateInput {
  customerId: Types.ObjectId
  workerId?: Types.ObjectId
  startDate: Date
  endDate: Date
}
