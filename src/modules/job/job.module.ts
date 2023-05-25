import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppointmentModule } from '@/modules/appointment/appointment.module'
import { CategoryModule } from '@/modules/category/category.module'
import { CustomerModule } from '@/modules/customer/customer.module'
import { TransactionModule } from '@/modules/transaction/transactiob.module'
import { WorkerModule } from '@/modules/worker/worker.module'
import { Job, JobSchema } from './job.entity'
import { JobRepository } from './job.repository'
import { JobResolver } from './job.resolver'
import { JobService } from './job.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    CategoryModule,
    CustomerModule,
    WorkerModule,
    TransactionModule,
    AppointmentModule
  ],
  providers: [JobResolver, JobService, JobRepository]
})
export class JobModule {}
