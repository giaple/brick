import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CategoryModule } from '@/modules/category/category.module'
import { WorkerModule } from '@/modules/worker/worker.module'
import { Appointment, AppointmentSchema } from './appointment.entity'
import { AppointmentRepository } from './appointment.repository'
import { AppointmentResolver } from './appointment.resolver'
import { AppointmentService } from './appointment.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }]),
    CategoryModule,
    WorkerModule
  ],
  providers: [AppointmentResolver, AppointmentService, AppointmentRepository],
  exports: [AppointmentService]
})
export class AppointmentModule {}
