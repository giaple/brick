import { CacheModule as NestJsCacheModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { redisStore } from 'cache-manager-redis-yet'
import type { ICacheConfig } from '@/modules/config/cacheConfig'
import type { RedisClientOptions } from 'redis'

@Module({
  imports: [
    NestJsCacheModule.registerAsync<RedisClientOptions>({
      useFactory: (configService: ConfigService) => {
        const config = configService.get<ICacheConfig>('cache')!
        return {
          store: redisStore,
          host: config.host,
          port: config.port,
          isGlobal: true
        }
      },
      inject: [ConfigService]
    })
  ]
})
export class CacheModule {}
