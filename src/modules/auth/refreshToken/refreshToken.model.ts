import { Field, ObjectType } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { EUserType } from '@/common/enum/user.enum'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import type { IRefreshToken } from './refreshToken.interface'

@ObjectType()
export class RefreshTokenModel implements IRefreshToken {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId

  @Field(() => EUserType)
  userType: EUserType

  @Field(() => ObjectIdScalar)
  userId: Types.ObjectId

  @Field(() => String)
  token: string

  @Field(() => Date)
  expiredAt: Date

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
