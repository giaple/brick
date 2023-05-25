import { Field, ObjectType } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { EVerifyTokenType } from '@/common/enum/auth.enum'
import { EUserType } from '@/common/enum/user.enum'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import type { IVerifyToken } from './verifyToken.interface'

@ObjectType()
export class VerifyTokenModel implements IVerifyToken {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId

  @Field(() => EUserType)
  userType: EUserType

  @Field(() => String)
  userIdentity: string

  @Field(() => String)
  token: string

  @Field(() => Boolean)
  isUsed: boolean

  @Field(() => EVerifyTokenType)
  verifyType: EVerifyTokenType

  @Field(() => Date)
  expiredAt: Date

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
