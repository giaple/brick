import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { PreBookingJobInput } from './pricing.dto'
import { PreBookingJobModel } from './pricing.model'
import { PricingService } from './pricing.service'

@Resolver(() => PreBookingJobModel)
export class PricingResolver {
  constructor(private readonly service: PricingService) {}

  @Mutation(() => PreBookingJobModel, { name: 'preBookingJob' })
  async preBookingJob(
    @Args('input', { type: () => PreBookingJobInput }) input: PreBookingJobInput
  ) {
    return await this.service.preBookingJob(input)
  }
}
