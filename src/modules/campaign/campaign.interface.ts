import type {
  ECampaignStatus,
  ECampaignType,
  EPromotionTargetCondition,
  EPromotionTargetType,
  EPromotionType
} from '@/common/enum/campaign.enum'
import type { IObjectId } from '@/common/interface'
import type { Types } from 'mongoose'

export interface IPromotionTarget {
  type: EPromotionTargetType
  promotionType: EPromotionType
  value: number
  condition: EPromotionTargetCondition
  ids: Types.ObjectId[]
}

export interface ICampaign extends IObjectId {
  name: string
  code: string
  partnerCode?: string
  description?: string
  type: ECampaignType
  targets: IPromotionTarget[]
  startDate: Date
  endDate: Date
  redemptionAmountLimit?: number
  redemptionCountLimit?: number
  usedAmount: number
  usedCount: number
  isActive: boolean
  deactivatedAt?: Date
  createdAt: Date
  updatedAt: Date
  isDeleted?: boolean
  deletedAt?: Date
  // virtual fields
  status?: ECampaignStatus
}
