import { Injectable, Logger } from '@nestjs/common'
import { AWSS3Service } from '@/modules/aws/awsS3.service'
import type { FileUploadInput } from './upload.dto'
import type { FilePresignedUrlModel } from './upload.model'

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name)
  constructor(private readonly awsS3Service: AWSS3Service) {}

  async uploadImage(input: FileUploadInput): Promise<FilePresignedUrlModel> {
    const presignedUrl = await this.awsS3Service.generatePresignedUrl({
      target: input.target,
      type: input.type,
      isTemp: input.isTemp
    })

    return {
      url: presignedUrl.url,
      cdnUrl: presignedUrl.cdnUrl,
      fields: {
        ...presignedUrl.fields,
        policy: presignedUrl.fields.Policy,
        contentType: presignedUrl.fields['Content-Type'],
        algorithm: presignedUrl.fields['X-Amz-Algorithm'],
        credential: presignedUrl.fields['X-Amz-Credential'],
        date: presignedUrl.fields['X-Amz-Date'],
        signature: presignedUrl.fields['X-Amz-Signature']
      }
    }
  }
}
