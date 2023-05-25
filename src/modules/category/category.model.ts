import { Field, ObjectType } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { OffsetPaginated } from '@/common/interface/offsetPagination.interface'
import { Paginated } from '@/common/interface/pagination.interface'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import type { ICategory } from './category.interface'

@ObjectType()
export class CategoryScheduleModel {
  @Field(() => Number)
  startTime: number

  @Field(() => Number)
  endTime: number

  @Field(() => Number)
  gap: number
}

@ObjectType()
export class CategoryModel implements ICategory {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId

  @Field(() => String)
  name: string

  @Field(() => ObjectIdScalar, { nullable: true })
  parentId?: Types.ObjectId

  @Field(() => [ObjectIdScalar])
  ancestorIds: Types.ObjectId[]

  @Field(() => String)
  description: string

  @Field(() => String)
  code: string

  @Field(() => [String])
  imageUrls: string[]

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

  @Field(() => CategoryScheduleModel)
  schedule: CategoryScheduleModel
}

@ObjectType()
export class PaginatedCategories extends Paginated(CategoryModel) {}

@ObjectType()
export class OffsetPaginatedCategories extends OffsetPaginated(CategoryModel) {}
