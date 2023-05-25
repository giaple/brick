import { Injectable, Scope } from '@nestjs/common'
import { CampaignLoader } from '@/modules/campaign/campaign.loader'
import { CampaignService } from '@/modules/campaign/campaign.service'
import { CategoryLoader } from '@/modules/category/category.loader'
import { CategoryService } from '@/modules/category/category.service'
import { OptionLoader } from '@/modules/option/option.loader'
import { OptionService } from '@/modules/option/option.service'
import { TransactionLoader } from '@/modules/transaction/transaction.loader'
import { TransactionService } from '@/modules/transaction/transaction.service'
import type { IDataLoaders } from './dataloader.interface'

@Injectable({ scope: Scope.REQUEST })
export class DataLoaderService {
  private readonly _loaders: IDataLoaders
  readonly createdAt: Date

  constructor(
    private readonly categoryService: CategoryService,
    private readonly optionService: OptionService,
    private readonly transactionService: TransactionService,
    private readonly campaignService: CampaignService
  ) {
    this._loaders = {}
    this.createdAt = new Date()
  }

  getDataLoader<T extends keyof DataLoaderService['_loaders']>(
    type: T
  ): DataLoaderService['_loaders'][T] {
    if (!this._loaders[type]) {
      switch (type) {
        case 'categoryLoader':
          this._loaders.categoryLoader = new CategoryLoader(this.categoryService)
          break

        case 'optionLoader':
          this._loaders.optionLoader = new OptionLoader(this.optionService)
          break

        case 'transactionLoader':
          this._loaders.transactionLoader = new TransactionLoader(this.transactionService)
          break

        case 'campaignLoader':
          this._loaders.campaignLoader = new CampaignLoader(this.campaignService)
          break
      }
    }
    return this._loaders[type]
  }
}
