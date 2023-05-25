import type { CampaignLoader } from '@/modules/campaign/campaign.loader'
import type { CategoryLoader } from '@/modules/category/category.loader'
import type { OptionLoader } from '@/modules/option/option.loader'
import type { TransactionLoader } from '@/modules/transaction/transaction.loader'

export interface IDataLoaders {
  categoryLoader?: CategoryLoader
  optionLoader?: OptionLoader
  transactionLoader?: TransactionLoader
  campaignLoader?: CampaignLoader
}
