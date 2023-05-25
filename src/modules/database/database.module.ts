import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import type { IDBConfig } from '@/modules/config/dbConfig'
import type { IDefaultConfig } from '@/modules/config/defaultConfig'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const defaultConfig = configService.get<IDefaultConfig>('default')!
        if (defaultConfig.env === 'local') {
          mongoose.set('debug', true)
        }

        const db = configService.get<IDBConfig>('db')!

        return {
          uri: `${db.dbScheme}${db.username}:${db.pwd}@${db.host}${
            db.usePort ? '' : ':' + db.port
          }/${db.dbName}`
        }
      },
      inject: [ConfigService]
    })
  ]
})
export class DatabaseModule {}
