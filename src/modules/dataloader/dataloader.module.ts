import { Module } from '@nestjs/common'
import { CampaignModule } from '@/modules/campaign/campaign.module'
import { CategoryModule } from '@/modules/category/category.module'
import { OptionModule } from '@/modules/option/option.module'
import { TransactionModule } from '@/modules/transaction/transactiob.module'
import { DataLoaderService } from './dataloader.service'

@Module({
  imports: [CategoryModule, OptionModule, TransactionModule, CampaignModule],
  providers: [DataLoaderService],
  exports: [DataLoaderService]
})
export class DataLoaderModule {}
