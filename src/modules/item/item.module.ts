import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CategoryModule } from '@/modules/category/category.module'
import { Item, ItemSchema } from './item.entity'
import { ItemRepository } from './item.repository'
import { ItemResolver } from './item.resolver'
import { ItemService } from './item.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]), CategoryModule],
  providers: [ItemResolver, ItemService, ItemRepository],
  exports: [ItemService]
})
export class ItemModule {}
