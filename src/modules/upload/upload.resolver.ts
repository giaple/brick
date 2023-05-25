import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { FileUploadInput } from './upload.dto'
import { FilePresignedUrlModel } from './upload.model'
import { UploadService } from './upload.service'

@Resolver()
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}

  @Mutation(() => FilePresignedUrlModel, { name: 'uploadImage', nullable: true })
  async uploadImage(@Args('input', { type: () => FileUploadInput }) input: FileUploadInput) {
    return await this.uploadService.uploadImage(input)
  }
}
