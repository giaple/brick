import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CategoryModule } from '@/modules/category/category.module'
import { Campaign, CampaignSchema } from './campaign.entity'
import { CampaignRepository } from './campaign.repository'
import { CampaignResolver } from './campaign.resolver'
import { CampaignService } from './campaign.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Campaign.name, schema: CampaignSchema }]),
    CategoryModule
  ],
  providers: [CampaignResolver, CampaignService, CampaignRepository],
  exports: [CampaignService]
})
export class CampaignModule {}
