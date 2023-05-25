import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { OffsetPaginated } from '@/common/interface/offsetPagination.interface'
import { Paginated } from '@/common/interface/pagination.interface'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import { CategoryModel } from '@/modules/category/category.model'
import { OptionModel } from '@/modules/option/option.model'
import type { IItem } from './item.interface'

@ObjectType()
export class ItemModel implements IItem {
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

  @Field(() => String, { nullable: true })
  subName?: string

  @Field(() => String, { nullable: true })
  content?: string

  @Field(() => [ObjectIdScalar])
  optionIds: Types.ObjectId[]

  @Field(() => [OptionModel], { nullable: true })
  options?: OptionModel[]

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
export class PaginatedItems extends Paginated(ItemModel) {}

@ObjectType()
export class OffsetPaginatedItems extends OffsetPaginated(ItemModel) {}
