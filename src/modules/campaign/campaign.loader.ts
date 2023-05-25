import { Injectable } from '@nestjs/common'
import { BaseLoader } from '@/modules/dataloader/dataloader.base'
import { CampaignService } from './campaign.service'
import type { CampaignFindManyQueryInput } from './campaign.dto'
import type { CampaignModel } from './campaign.model'

@Injectable()
export class CampaignLoader extends BaseLoader<CampaignModel, CampaignFindManyQueryInput> {
  constructor(private readonly campaignService: CampaignService) {
    super()
  }

  protected async findMany(input: CampaignFindManyQueryInput): Promise<CampaignModel[]> {
    return await this.campaignService.findMany(input)
  }
}
