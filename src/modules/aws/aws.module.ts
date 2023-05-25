import { Module } from '@nestjs/common'
import { AWSS3Service } from './awsS3.service'

@Module({
  providers: [AWSS3Service],
  exports: [AWSS3Service]
})
export class AWSModule {}
