import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CategoryModule } from '@/modules/category/category.module'
import { Option, OptionSchema } from './option.entity'
import { OptionRepository } from './option.repository'
import { OptionResolver } from './option.resolver'
import { OptionService } from './option.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Option.name, schema: OptionSchema }]),
    CategoryModule
  ],
  providers: [OptionResolver, OptionService, OptionRepository],
  exports: [OptionService]
})
export class OptionModule {}
