import { Field, Float, InputType, Int } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { BooleanFilterInput, IDFilterInput } from '@/common/dto/queryCondition.dto'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'

@InputType()
export class ItemCreateInput {
  @Field(() => String)
  name: string

  @Field(() => ObjectIdScalar)
  categoryId: Types.ObjectId

  @Field(() => Float)
  price: number

  @Field(() => Int)
  minQuantity: number

  @Field(() => Int, { nullable: true })
  maxQuantity?: number

  @Field(() => Int)
  estTime: number

  @Field(() => [String], { nullable: true })
  imageUrls?: string[]

  @Field(() => [String], { nullable: true })
  tags?: string[]

  @Field(() => String, { nullable: true })
  subName?: string

  @Field(() => String, { nullable: true })
  content?: string

  @Field(() => [ObjectIdScalar], { nullable: true })
  optionIds?: Types.ObjectId[]
}

@InputType()
export class ItemUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => ObjectIdScalar, { nullable: true })
  categoryId?: Types.ObjectId

  @Field(() => Float, { nullable: true })
  price?: number

  @Field(() => Int, { nullable: true })
  minQuantity?: number

  @Field(() => Int, { nullable: true })
  maxQuantity?: number

  @Field(() => Int, { nullable: true })
  estTime?: number

  @Field(() => [String], { nullable: true })
  imageUrls?: string[]

  @Field(() => [String], { nullable: true })
  tags?: string[]

  @Field(() => String, { nullable: true })
  subName?: string

  @Field(() => String, { nullable: true })
  content?: string

  @Field(() => [ObjectIdScalar], { nullable: true })
  optionIds?: Types.ObjectId[]

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean
}

@InputType()
export class ItemDeleteInput {
  @Field(() => Boolean, { nullable: true })
  isForce?: boolean
}

@InputType()
export class ItemSearchQueryInput {
  @Field(() => BooleanFilterInput, { nullable: true })
  isDeleted?: BooleanFilterInput

  @Field(() => IDFilterInput, { nullable: true })
  categoryId?: IDFilterInput
}

@InputType()
export class ItemFindManyQueryInput {
  @Field(() => [ObjectIdScalar])
  ids: Types.ObjectId[]
}
