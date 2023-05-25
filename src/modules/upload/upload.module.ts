import { Module } from '@nestjs/common'
import { AWSModule } from '@/modules/aws/aws.module'
import { UploadResolver } from './upload.resolver'
import { UploadService } from './upload.service'

@Module({
  imports: [AWSModule],
  providers: [UploadResolver, UploadService]
})
export class UploadModule {}
