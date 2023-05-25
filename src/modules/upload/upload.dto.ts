import { Field, InputType } from '@nestjs/graphql'
import { EFileType, ETargetType } from '@/common/enum/upload.enum'

@InputType()
export class FileUploadInput {
  @Field(() => ETargetType)
  target: ETargetType

  @Field(() => EFileType)
  type: EFileType

  @Field(() => Boolean, { nullable: true })
  isTemp?: boolean
}
