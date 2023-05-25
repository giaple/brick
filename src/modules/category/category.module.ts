import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Category, CategorySchema } from './category.entity'
import { CategoryRepository } from './category.repository'
import { CategoryResolver } from './category.resolver'
import { CategoryService } from './category.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  providers: [CategoryResolver, CategoryService, CategoryRepository],
  exports: [CategoryService]
})
export class CategoryModule {}
