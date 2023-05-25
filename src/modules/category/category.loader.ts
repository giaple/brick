import { Injectable } from '@nestjs/common'
import { BaseLoader } from '@/modules/dataloader/dataloader.base'
import { CategoryService } from './category.service'
import type { CategoryFindManyQueryInput } from './category.dto'
import type { CategoryModel } from './category.model'

@Injectable()
export class CategoryLoader extends BaseLoader<CategoryModel, CategoryFindManyQueryInput> {
  constructor(private readonly categoryService: CategoryService) {
    super()
  }

  protected async findMany(input: CategoryFindManyQueryInput): Promise<CategoryModel[]> {
    return await this.categoryService.findMany(input)
  }
}
