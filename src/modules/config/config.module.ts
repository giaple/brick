import { Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import authConfig from './authConfig'
import awsS3Config from './awsS3Config'
import cacheConfig from './cacheConfig'
import dbConfig from './dbConfig'
import defaultConfig from './defaultConfig'
import fptSmsConfig from './fptSMSConfig'

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: '.local.env',
      isGlobal: true,
      load: [defaultConfig, dbConfig, authConfig, awsS3Config, fptSmsConfig, cacheConfig]
    })
  ]
})
export class ConfigModule {}
