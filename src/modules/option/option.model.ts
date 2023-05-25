import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { OffsetPaginated } from '@/common/interface/offsetPagination.interface'
import { Paginated } from '@/common/interface/pagination.interface'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import { CategoryModel } from '@/modules/category/category.model'
import type { IOption } from './option.interface'

@ObjectType()
export class OptionModel implements IOption {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId

  @Field(() => String)
  name: string

  @Field(() => ObjectIdScalar)
  categoryId: Types.ObjectId

  @Field(() => CategoryModel, { nullable: true })
  category?: CategoryModel

  @Field(() => Float)
  price: number

  @Field(() => Int)
  minQuantity: number

  @Field(() => Int, { nullable: true })
  maxQuantity?: number

  @Field(() => Int)
  estTime: number

  @Field(() => [String])
  imageUrls: string[]

  @Field(() => [String])
  tags: string[]

  @Field(() => Int)
  orderCount: number

  @Field(() => Boolean)
  isActive: boolean

  @Field(() => Date, { nullable: true })
  deactivatedAt?: Date

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => Boolean, { nullable: true })
  isDeleted?: boolean

  @Field(() => Date, { nullable: true })
  deletedAt?: Date
}

@ObjectType()
export class PaginatedOptions extends Paginated(OptionModel) {}

@ObjectType()
export class OffsetPaginatedOptions extends OffsetPaginated(OptionModel) {}
