import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SuccessRes {
  @Field(() => String)
  message: string

  @Field(() => Boolean)
  success: boolean
}
