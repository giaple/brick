import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Types } from 'mongoose'
import {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { SuccessRes } from '@/common/model'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import {
  CampaignCreateInput,
  CampaignDeleteInput,
  CampaignSearchQueryInput,
  CampaignUpdateInput
} from './campaign.dto'
import { OffsetPaginatedCampaigns, PaginatedCampaigns, CampaignModel } from './campaign.model'
import { CampaignService } from './campaign.service'

@Resolver(() => CampaignModel)
export class CampaignResolver {
  constructor(private readonly service: CampaignService) {}

  @Mutation(() => CampaignModel, { name: 'createCampaign' })
  async create(@Args('input', { type: () => CampaignCreateInput }) input: CampaignCreateInput) {
    return await this.service.create(input)
  }

  @Mutation(() => CampaignModel, { name: 'updateCampaignById' })
  async updateById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => CampaignUpdateInput }) input: CampaignUpdateInput
  ) {
    return await this.service.updateById(id, input)
  }

  @Mutation(() => SuccessRes, { name: 'deleteCampaignById' })
  async deleteById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => CampaignDeleteInput, nullable: true }) input: CampaignDeleteInput
  ) {
    return await this.service.deleteById(id, input.isForce)
  }

  @Query(() => CampaignModel, { name: 'findCampaignById' })
  async findById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId
  ): Promise<CampaignModel> {
    return await this.service.findById(id)
  }

  @Query(() => PaginatedCampaigns, { name: 'lazyCampaignSearch' })
  async lazySearch(
    @Args('input', { type: () => PaginationInput }) input: PaginationInput
  ): Promise<PaginatedCampaigns> {
    return await this.service.lazySearch(input)
  }

  @Query(() => OffsetPaginatedCampaigns, { name: 'campaignSearch' })
  async search(
    @Args('paginationInput', { type: () => OffsetPaginationInput })
    paginationInput: OffsetPaginationInput,
    @Args('queryInput', { type: () => CampaignSearchQueryInput, nullable: true })
    queryInput: CampaignSearchQueryInput,
    @Args('optionInput', { type: () => OffsetPaginationOptionInput, nullable: true })
    optionInput: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedCampaigns> {
    return await this.service.search(paginationInput, queryInput, optionInput)
  }
}
