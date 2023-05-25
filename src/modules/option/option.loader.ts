import { Injectable } from '@nestjs/common'
import { BaseLoader } from '@/modules/dataloader/dataloader.base'
import { OptionService } from './option.service'
import type { OptionFindManyQueryInput } from './option.dto'
import type { OptionModel } from './option.model'

@Injectable()
export class OptionLoader extends BaseLoader<OptionModel, OptionFindManyQueryInput> {
  constructor(private readonly optionService: OptionService) {
    super()
  }

  protected async findMany(input: OptionFindManyQueryInput): Promise<OptionModel[]> {
    return await this.optionService.findMany(input)
  }
}
