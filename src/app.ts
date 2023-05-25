import fastifyCsrf from '@fastify/csrf-protection'
import helmet from '@fastify/helmet'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'
import { AppModule } from '@/modules/app/app.module'
import type { IDefaultConfig } from './modules/config/defaultConfig'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    cors: true,
    bufferLogs: true
  })

  const configService = app.get(ConfigService)
  const defaultConfig = configService.get<IDefaultConfig>('default')

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`, 'unpkg.com'],
        styleSrc: [
          `'self'`,
          `'unsafe-inline'`,
          'cdn.jsdelivr.net',
          'fonts.googleapis.com',
          'unpkg.com'
        ],
        fontSrc: [`'self'`, 'fonts.gstatic.com', 'data:'],
        imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`, `cdn.jsdelivr.net`, `'unsafe-eval'`]
      }
    }
  })
  await app.register(fastifyCsrf)
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useLogger(app.get(Logger))
  app.useGlobalInterceptors(new LoggerErrorInterceptor())

  await app.listen(defaultConfig ? defaultConfig.port : 3000, '0.0.0.0')
}

export default bootstrap
