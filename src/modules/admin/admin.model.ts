import { Field, ObjectType } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { EAdminRoleType, EGender } from '@/common/enum/user.enum'
import { OffsetPaginated } from '@/common/interface/offsetPagination.interface'
import { Paginated } from '@/common/interface/pagination.interface'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import type { IAdmin } from './admin.interface'

@ObjectType()
export class AdminModel implements IAdmin {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId

  @Field(() => String)
  phoneCountryCode: string

  @Field(() => String)
  phoneNumber: string

  @Field(() => String, { nullable: true })
  firstName?: string

  @Field(() => String, { nullable: true })
  lastName?: string

  @Field(() => String, { nullable: true })
  dob?: string

  @Field(() => EGender, { nullable: true })
  gender?: EGender

  @Field(() => String, { nullable: true })
  city?: string

  @Field(() => String, { nullable: true })
  district?: string

  @Field(() => String, { nullable: true })
  ward?: string

  @Field(() => String, { nullable: true })
  address?: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => Boolean, { nullable: true })
  isEmailVerified?: boolean

  @Field(() => String, { nullable: true })
  imageUrl?: string

  @Field(() => EAdminRoleType)
  role: EAdminRoleType

  @Field(() => String, { nullable: true })
  adminNote?: string

  @Field(() => Boolean)
  isActive: boolean

  @Field(() => Date, { nullable: true })
  deactivatedAt?: Date

  @Field(() => Boolean, { nullable: true })
  isDeleted?: boolean

  @Field(() => Date, { nullable: true })
  deletedAt?: Date

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  /* Virtual fields */
  @Field(() => String, { nullable: true })
  fullName?: string
}

@ObjectType()
export class PaginatedAdmins extends Paginated(AdminModel) {}

@ObjectType()
export class OffsetPaginatedAdmins extends OffsetPaginated(AdminModel) {}
