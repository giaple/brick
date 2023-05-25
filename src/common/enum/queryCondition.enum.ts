import { registerEnumType } from '@nestjs/graphql'

export enum EBooleanFilterCondition {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS'
}

export enum EStringFilterCondition {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH'
}

export enum EDateFilterCondition {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  LESS_THAN = 'LT',
  LESS_THAN_OR_EQUAL = 'LTE',
  GREATER_THAN_OR_EQUAL = 'GTE',
  GREATER_THAN = 'GT',
  BETWEEN_EQUALS_FROM = 'BETWEEN_EQUALS_FROM'
}

export enum ENumberFilterCondition {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  LESS_THAN = 'LT',
  LESS_THAN_OR_EQUAL = 'LTE',
  GREATER_THAN_OR_EQUAL = 'GTE',
  GREATER_THAN = 'GT',
  BETWEEN_EQUALS_FROM = 'BETWEEN_EQUALS_FROM'
}

export enum EIDFilterCondition {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS'
}

registerEnumType(EBooleanFilterCondition, {
  name: 'EBooleanFilterCondition'
})

registerEnumType(EStringFilterCondition, {
  name: 'EStringFilterCondition'
})

registerEnumType(EDateFilterCondition, {
  name: 'EDateFilterCondition'
})

registerEnumType(ENumberFilterCondition, {
  name: 'ENumberFilterCondition'
})

registerEnumType(EIDFilterCondition, {
  name: 'EIDFilterCondition'
})
