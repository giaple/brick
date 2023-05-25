import { Field, InputType } from '@nestjs/graphql'
import { Types } from 'mongoose'
import {
  EBooleanFilterCondition,
  EDateFilterCondition,
  EIDFilterCondition,
  ENumberFilterCondition,
  EStringFilterCondition
} from '@/common/enum/queryCondition.enum'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'

@InputType()
export class StringFilterOptions {
  @Field(() => Boolean, { nullable: true })
  caseSensitive?: boolean
}

@InputType()
export class NumberFilterOptions {
  @Field(() => Number, { nullable: true })
  from?: number

  @Field(() => Number, { nullable: true })
  to?: number
}

@InputType()
export class DateFilterOptions {
  @Field(() => Date, { nullable: true })
  from?: Date

  @Field(() => Date, { nullable: true })
  to?: Date
}

/**
 * If a value but no condition is defined, EQUALS will be chosen as the default condition.
 */

@InputType()
export class BooleanFilterInput {
  @Field(() => Boolean)
  value: boolean

  @Field(() => EBooleanFilterCondition, { nullable: true })
  condition?: EBooleanFilterCondition
}

@InputType()
export class StringFilterInput {
  @Field(() => String)
  value: string

  @Field(() => EStringFilterCondition, { nullable: true })
  condition?: EStringFilterCondition

  @Field(() => StringFilterOptions, { nullable: true })
  options?: StringFilterOptions
}

@InputType()
export class IDFilterInput {
  @Field(() => ObjectIdScalar)
  value: Types.ObjectId

  @Field(() => EIDFilterCondition, { nullable: true })
  condition?: EIDFilterCondition
}

@InputType()
export class DateFilterInput {
  @Field(() => Date)
  value: Date

  @Field(() => EDateFilterCondition, { nullable: true })
  condition?: EDateFilterCondition

  @Field(() => DateFilterOptions, { nullable: true })
  options?: DateFilterOptions
}

@InputType()
export class NumberFilterInput {
  @Field(() => Number)
  value: number

  @Field(() => ENumberFilterCondition, { nullable: true })
  condition?: ENumberFilterCondition

  @Field(() => NumberFilterOptions, { nullable: true })
  options?: NumberFilterOptions
}
