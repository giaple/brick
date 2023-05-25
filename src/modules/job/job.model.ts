import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { Types } from 'mongoose'
import {
  ECampaignType,
  EPromotionTargetCondition,
  EPromotionTargetType,
  EPromotionType
} from '@/common/enum/campaign.enum'
import { EJobStatus } from '@/common/enum/job.enum'
import { OffsetPaginated } from '@/common/interface/offsetPagination.interface'
import { Paginated } from '@/common/interface/pagination.interface'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import { CategoryModel } from '@/modules/category/category.model'
import { TransactionModel } from '@/modules/transaction/transaction.model'
import type {
  IAppliedCampaign,
  IAppliedCampaignTarget,
  IJob,
  IJobItem,
  IJobItemOption,
  IJobMetadata
} from './job.interface'

@ObjectType()
export class JobMetadataModel implements IJobMetadata {
  @Field(() => String, { nullable: true })
  utmSource?: string

  @Field(() => String, { nullable: true })
  utmMedium?: string

  @Field(() => String, { nullable: true })
  utmCampaign?: string
}

@ObjectType()
export class JobItemOptionModel implements IJobItemOption {
  @Field(() => ObjectIdScalar)
  refId: Types.ObjectId

  @Field(() => String)
  name: string

  @Field(() => Int)
  quantity: number

  @Field(() => Float)
  price: number

  @Field(() => Float)
  finalPrice: number
}

@ObjectType()
export class JobItemModel implements IJobItem {
  @Field(() => ObjectIdScalar)
  refId: Types.ObjectId

  @Field(() => String)
  name: string

  @Field(() => Int)
  quantity: number

  @Field(() => Float)
  price: number

  @Field(() => Float)
  finalPrice: number

  @Field(() => [JobItemOptionModel], { nullable: true })
  options?: JobItemOptionModel[]
}

@ObjectType()
export class AppliedCampaignTargetModel implements IAppliedCampaignTarget {
  @Field(() => ObjectIdScalar)
  refId: Types.ObjectId

  @Field(() => String)
  name: string

  @Field(() => EPromotionTargetType)
  targetType: EPromotionTargetType

  @Field(() => EPromotionType)
  promotionType: EPromotionType

  @Field(() => Float)
  value: number

  @Field(() => EPromotionTargetCondition)
  condition: EPromotionTargetCondition
}

@ObjectType()
export class AppliedCampaignModel implements IAppliedCampaign {
  @Field(() => ObjectIdScalar, { nullable: true })
  refId: Types.ObjectId

  @Field(() => String)
  code: string

  @Field(() => ECampaignType)
  type: ECampaignType

  @Field(() => [AppliedCampaignTargetModel], { nullable: true })
  appliedTargets?: AppliedCampaignTargetModel[]
}

@ObjectType()
export class JobModel implements IJob {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId

  @Field(() => String)
  csId: string

  @Field(() => ObjectIdScalar)
  categoryId: Types.ObjectId

  @Field(() => CategoryModel, { nullable: true })
  category?: CategoryModel

  @Field(() => ObjectIdScalar)
  transactionId: Types.ObjectId

  @Field(() => ObjectIdScalar)
  appointmentId: Types.ObjectId

  @Field(() => TransactionModel, { nullable: true })
  transaction?: TransactionModel

  @Field(() => String)
  phoneNumber: string

  @Field(() => String)
  customerName: string

  @Field(() => ObjectIdScalar)
  customerId: Types.ObjectId

  @Field(() => ObjectIdScalar, { nullable: true })
  workerId?: Types.ObjectId

  @Field(() => String)
  address: string

  @Field(() => JobMetadataModel, { nullable: true })
  metadata?: JobMetadataModel

  @Field(() => [String])
  imageUrls: string[]

  @Field(() => [String])
  workImageUrls: string[]

  @Field(() => EJobStatus)
  status: EJobStatus

  @Field(() => String, { nullable: true })
  note?: string

  @Field(() => String, { nullable: true })
  adminNote?: string

  @Field(() => Date)
  startDate: Date

  @Field(() => Date)
  endDate: Date

  @Field(() => [AppliedCampaignModel], { nullable: true })
  appliedCampaigns?: AppliedCampaignModel[]

  @Field(() => Float)
  totalPrice: number

  @Field(() => Float)
  finalTotalPrice: number

  @Field(() => Float)
  totalDiscountPrice: number

  @Field(() => [JobItemModel])
  items: JobItemModel[]

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => Date, { nullable: true })
  contactedAt?: Date

  @Field(() => Date, { nullable: true })
  rescheduledAt?: Date

  @Field(() => Date, { nullable: true })
  inProgressAt?: Date

  @Field(() => Date, { nullable: true })
  doneAt?: Date

  @Field(() => Date, { nullable: true })
  cancelledAt?: Date
}

@ObjectType()
export class PaginatedJobs extends Paginated(JobModel) {}

@ObjectType()
export class OffsetPaginatedJobs extends OffsetPaginated(JobModel) {}
