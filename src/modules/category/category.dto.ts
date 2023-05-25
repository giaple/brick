import { Field, InputType } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { BooleanFilterInput } from '@/common/dto/queryCondition.dto'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'

@InputType()
export class CategoryScheduleInput {
  @Field(() => Number)
  startTime: number

  @Field(() => Number)
  endTime: number

  @Field(() => Number)
  gap: number
}

@InputType()
export class CategoryCreateInput {
  @Field(() => String)
  name: string

  @Field(() => ObjectIdScalar, { nullable: true })
  parentId?: Types.ObjectId

  @Field(() => [String], { nullable: true })
  imageUrls?: string[]

  @Field(() => String)
  description: string

  @Field(() => String)
  code: string

  @Field(() => CategoryScheduleInput, { nullable: true })
  schedule?: CategoryScheduleInput
}

@InputType()
export class CategoryUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => ObjectIdScalar, { nullable: true })
  parentId?: Types.ObjectId

  @Field(() => [String], { nullable: true })
  imageUrls?: string[]

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  code?: string

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean

  @Field(() => CategoryScheduleInput, { nullable: true })
  schedule?: CategoryScheduleInput
}

@InputType()
export class CategoryDeleteInput {
  @Field(() => Boolean, { nullable: true })
  isForce?: boolean
}

@InputType()
export class CategorySearchQueryInput {
  @Field(() => BooleanFilterInput, { nullable: true })
  isDeleted?: BooleanFilterInput
}

@InputType()
export class CategoryFindManyQueryInput {
  @Field(() => [ObjectIdScalar])
  ids: Types.ObjectId[]
}
