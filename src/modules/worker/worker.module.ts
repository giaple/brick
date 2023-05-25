import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CategoryModule } from '@/modules/category/category.module'
import { Worker, WorkerSchema } from './worker.entity'
import { WorkerRepository } from './worker.repository'
import { WorkerResolver } from './worker.resolver'
import { WorkerService } from './worker.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Worker.name, schema: WorkerSchema }]),
    CategoryModule
  ],
  providers: [WorkerResolver, WorkerService, WorkerRepository],
  exports: [WorkerService]
})
export class WorkerModule {}
