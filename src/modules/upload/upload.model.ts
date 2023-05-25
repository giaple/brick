import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PresignedFieldModel {
  @Field(() => String)
  bucket: string

  @Field(() => String)
  key: string

  @Field(() => String)
  acl: string

  @Field(() => String)
  policy: string

  @Field(() => String)
  contentType: string

  @Field(() => String)
  algorithm: string

  @Field(() => String)
  credential: string

  @Field(() => String)
  date: string

  @Field(() => String)
  signature: string
}

@ObjectType()
export class FilePresignedUrlModel {
  @Field(() => String)
  url: string

  @Field(() => String)
  cdnUrl: string

  @Field(() => PresignedFieldModel)
  fields: PresignedFieldModel
}
