import { Field, ObjectType } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { EUserType } from '@/common/enum/user.enum'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'

@ObjectType()
export class UserInfoModel {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId

  @Field(() => EUserType)
  type: EUserType
}

@ObjectType()
export class UserTokensModel {
  @Field(() => String)
  accessToken: string

  @Field(() => String)
  refreshToken: string
}

@ObjectType()
export class UserLoginModel {
  @Field(() => String)
  accessToken: string

  @Field(() => String)
  refreshToken: string

  @Field(() => UserInfoModel)
  userInfo: UserInfoModel
}
