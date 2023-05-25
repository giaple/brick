import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'
import { DataLoaderInterceptor } from '@/interceptors/dataloader.interceptor'
import { AdminModule } from '@/modules/admin/admin.module'
import { AppointmentModule } from '@/modules/appointment/appointment.module'
import { AuthModule } from '@/modules/auth/auth.module'
// import { CacheModule } from '@/modules/cache/cache.module'
import { CampaignModule } from '@/modules/campaign/campaign.module'
import { CategoryModule } from '@/modules/category/category.module'
import { ConfigModule } from '@/modules/config/config.module'
import { CustomerModule } from '@/modules/customer/customer.module'
import { DatabaseModule } from '@/modules/database/database.module'
import { DataLoaderModule } from '@/modules/dataloader/dataloader.module'
import { GraphQLModule } from '@/modules/graphql/graphql.module'
import { ItemModule } from '@/modules/item/item.module'
import { JobModule } from '@/modules/job/job.module'
import { LoggerModule } from '@/modules/logger/logger.module'
import { NotificationModule } from '@/modules/notification/notification.module'
import { OptionModule } from '@/modules/option/option.module'
import { PricingModule } from '@/modules/pricing/pricing.module'
import { TransactionModule } from '@/modules/transaction/transactiob.module'
import { UploadModule } from '@/modules/upload/upload.module'
import { WorkerModule } from '@/modules/worker/worker.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRoot({
      ttl: 20,
      limit: 10
    }),
    LoggerModule,
    DatabaseModule,
    // CacheModule,
    GraphQLModule,
    DataLoaderModule,
    UploadModule,
    NotificationModule,
    AuthModule,
    CategoryModule,
    ItemModule,
    OptionModule,
    CampaignModule,
    CustomerModule,
    WorkerModule,
    AdminModule,
    JobModule,
    TransactionModule,
    PricingModule,
    AppointmentModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor
    }
  ]
})
export class AppModule {}
