import { Module } from '@nestjs/common'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: {
          targets: [
            {
              level: 'info',
              target: 'pino-pretty',
              options: {
                singleLine: true
              }
            },
            {
              level: 'trace',
              target: 'pino/file',
              options: { destination: './logs/app.log' }
            }
          ]
        }
      }
    })
  ]
})
export class LoggerModule {}
