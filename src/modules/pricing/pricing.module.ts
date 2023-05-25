import { Module } from '@nestjs/common'
import { CampaignModule } from '@/modules/campaign/campaign.module'
import { ItemModule } from '@/modules/item/item.module'
import { OptionModule } from '@/modules/option/option.module'
import { PricingResolver } from './pricing.resolver'
import { PricingService } from './pricing.service'

@Module({
  imports: [ItemModule, OptionModule, CampaignModule],
  providers: [PricingService, PricingResolver]
})
export class PricingModule {}
