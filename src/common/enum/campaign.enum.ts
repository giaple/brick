import { registerEnumType } from '@nestjs/graphql'

export enum ECampaignType {
  CATEGORY = 'CATEGORY',
  CODE = 'CODE',
  BILL = 'BILL'
}

export enum EPromotionType {
  DISCOUNT = 'DISCOUNT',
  PERCENT = 'PERCENT'
}

export enum ECampaignStatus {
  APPLICABLE = 'APPLICABLE',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  DEACTIVATED = 'DEACTIVATED',
  OVER_AMOUNT_LIMIT = 'OVER_AMOUNT_LIMIT',
  OVER_COUNT_LIMIT = 'OVER_COUNT_LIMIT'
}

export enum EPromotionTargetType {
  TOTAL = 'TOTAL',
  ITEM = 'ITEM',
  OPTION = 'OPTION'
}

export enum EPromotionTargetCondition {
  ANY = 'ANY',
  OR = 'OR'
}

registerEnumType(ECampaignType, {
  name: 'ECampaignType'
})

registerEnumType(EPromotionType, {
  name: 'EPromotionType'
})

registerEnumType(EPromotionTargetType, {
  name: 'EPromotionTargetType'
})

registerEnumType(ECampaignStatus, {
  name: 'ECampaignStatus'
})

registerEnumType(EPromotionTargetCondition, {
  name: 'EPromotionTargetCondition'
})
