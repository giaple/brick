import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { AppliedCampaignModel, JobItemModel } from '@/modules/job/job.model'

@ObjectType()
export class PreBookingJobModel {
  @Field(() => [AppliedCampaignModel], { nullable: true })
  appliedCampaigns?: AppliedCampaignModel[]

  @Field(() => [JobItemModel])
  items: JobItemModel[]

  @Field(() => Float)
  totalPrice: number

  @Field(() => Float)
  finalTotalPrice: number

  @Field(() => Float)
  totalDiscountPrice: number

  @Field(() => Int)
  totalEstTime: number
}
