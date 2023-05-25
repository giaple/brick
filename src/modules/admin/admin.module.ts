import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CategoryModule } from '@/modules/category/category.module'
import { Admin, AdminSchema } from './admin.entity'
import { AdminRepository } from './admin.repository'
import { AdminResolver } from './admin.resolver'
import { AdminService } from './admin.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]), CategoryModule],
  providers: [AdminResolver, AdminService, AdminRepository],
  exports: [AdminService]
})
export class AdminModule {}
