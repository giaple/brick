import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { compact, uniq } from 'lodash'
import { EErrorMessage } from '@/common/enum/error.enum'
import { CampaignService } from '@/modules/campaign/campaign.service'
import { ItemService } from '@/modules/item/item.service'
import { OptionService } from '@/modules/option/option.service'
import type {
  PreBookingAppliedCampaignJobModel,
  CartItemInput,
  PreBookingCartItemModel,
  PreBookingCartItemOptionModel,
  PreBookingJobInput
} from './pricing.dto'
import type { PreBookingJobModel } from './pricing.model'

@Injectable()
export class PricingService {
  private readonly logger = new Logger(PricingService.name)
  constructor(
    private readonly itemService: ItemService,
    private readonly optionService: OptionService,
    private readonly campaignService: CampaignService
  ) {}

  async preBookingJob(input: PreBookingJobInput): Promise<PreBookingJobModel> {
    const jobItems = await this._getPrebookingItems(input.items)

    const preBookingAppliedCampaignJob = await this.campaignService.apply({
      categoryId: input.categoryId,
      campaignCode: input.campaignCode,
      items: jobItems
    })

    return this._calculateTotalPreBookingJob(preBookingAppliedCampaignJob)
  }

  private async _getPrebookingItems(input: CartItemInput[]): Promise<PreBookingCartItemModel[]> {
    const itemIds = uniq(input.map((item) => item.id))
    const optionIds = uniq(
      compact(input.map((item) => item.options?.map((option) => option.id)).flat())
    )
    const [itemEntities, optionEntities] = await Promise.all([
      this.itemService.findMany({ ids: itemIds }),
      this.optionService.findMany({ ids: optionIds })
    ])

    if (itemIds.length !== itemEntities.length) {
      throw new BadRequestException(EErrorMessage.PRICING_SOME_ITEMS_NOT_FOUND)
    }

    if (optionIds.length !== optionEntities.length) {
      throw new BadRequestException(EErrorMessage.PRICING_SOME_OPTIONS_NOT_FOUND)
    }

    const jobItems: PreBookingCartItemModel[] = input.map((itemInput) => {
      const item = itemEntities.find((i) => i._id.equals(itemInput.id))!
      let optionList: PreBookingCartItemOptionModel[] = []
      if (itemInput.options?.length) {
        optionList = itemInput.options.map((optionInput) => {
          const option = optionEntities.find((o) => o._id.equals(optionInput.id))!
          return {
            _id: option._id,
            name: option.name,
            price: option.price,
            finalPrice: option.price,
            quantity: optionInput.quantity,
            estTime: option.estTime
          }
        })
      }

      return {
        _id: item._id,
        name: item.name,
        quantity: itemInput.quantity,
        price: item.price,
        finalPrice: item.price,
        estTime: item.estTime,
        options: optionList
      }
    })

    return jobItems
  }

  private _calculateTotalPreBookingJob(
    input: PreBookingAppliedCampaignJobModel
  ): PreBookingJobModel {
    let totalEstTime = 0
    const totalPrices = input.items.reduce(
      (acc, item) => {
        const optionTotalPrices = item.options.reduce(
          (acc, option) => {
            const optionTotalPrice = option.price * option.quantity
            const optionFinalPrice = option.finalPrice * option.quantity
            totalEstTime += option.estTime * option.quantity
            return {
              totalPrice: acc.totalPrice + optionTotalPrice,
              finalTotalPrice: acc.finalTotalPrice + optionFinalPrice
            }
          },
          {
            totalPrice: 0,
            finalTotalPrice: 0
          }
        )
        const itemTotalPrice =
          item.price * item.quantity + optionTotalPrices.totalPrice * item.quantity
        const itemFinalPrice =
          item.finalPrice * item.quantity + optionTotalPrices.finalTotalPrice * item.quantity
        totalEstTime = item.estTime * item.quantity + totalEstTime * item.quantity
        return {
          totalPrice: acc.totalPrice + itemTotalPrice,
          finalTotalPrice: acc.finalTotalPrice + itemFinalPrice
        }
      },
      {
        totalPrice: 0,
        finalTotalPrice: 0
      }
    )

    const finalTotalPrice =
      input.totalDiscountType && input.totalDiscountValue
        ? this.campaignService.calculatePromotionPrice(
            input.totalDiscountType,
            input.totalDiscountValue,
            totalPrices.finalTotalPrice
          )
        : totalPrices.finalTotalPrice

    const finalItems = input.items.map((item) => {
      const optionList = item.options.map((option) => ({
        ...option,
        refId: option._id
      }))

      return {
        ...item,
        refId: item._id,
        options: optionList
      }
    })

    return {
      appliedCampaigns: input.appliedCampaigns,
      items: finalItems,
      totalPrice: totalPrices.totalPrice,
      finalTotalPrice,
      totalDiscountPrice: totalPrices.totalPrice - finalTotalPrice,
      totalEstTime
    }
  }
}
