import type {
  ECampaignType,
  EPromotionTargetCondition,
  EPromotionTargetType,
  EPromotionType
} from '@/common/enum/campaign.enum'
import type { EJobStatus } from '@/common/enum/job.enum'
import type { IObjectId } from '@/common/interface'
import type { Types } from 'mongoose'

export interface IJobMetadata {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  referralName?: string
}

export interface IJobItemOption {
  refId: Types.ObjectId
  name: string
  quantity: number
  price: number
  finalPrice: number
}

export interface IJobItem {
  refId: Types.ObjectId
  name: string
  quantity: number
  price: number
  finalPrice: number
  options?: IJobItemOption[]
}

export interface IAppliedCampaignTarget {
  refId: Types.ObjectId
  name: string
  targetType: EPromotionTargetType
  promotionType: EPromotionType
  value: number
  condition: EPromotionTargetCondition
}
export interface IAppliedCampaign {
  refId: Types.ObjectId
  code: string
  type: ECampaignType
  appliedTargets?: IAppliedCampaignTarget[]
}

export interface IJob extends IObjectId {
  csId: string
  categoryId: Types.ObjectId
  transactionId: Types.ObjectId
  appointmentId: Types.ObjectId
  phoneNumber: string
  customerName: string
  customerId: Types.ObjectId
  workerId?: Types.ObjectId
  address: string
  metadata?: IJobMetadata
  imageUrls: string[]
  workImageUrls: string[]
  status: EJobStatus
  note?: string
  adminNote?: string
  startDate: Date
  endDate: Date
  appliedCampaigns?: IAppliedCampaign[]
  totalPrice: number
  finalTotalPrice: number
  totalDiscountPrice: number
  items: IJobItem[]
  createdAt: Date
  updatedAt: Date
  contactedAt?: Date
  rescheduledAt?: Date
  inProgressAt?: Date
  doneAt?: Date
  cancelledAt?: Date
}
