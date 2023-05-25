import escapeStringRegexp from 'escape-string-regexp'
import { Types } from 'mongoose'
import type {
  BooleanFilterInput,
  DateFilterInput,
  IDFilterInput,
  NumberFilterInput,
  StringFilterInput
} from '@/common/dto/queryCondition.dto'
import {
  EBooleanFilterCondition,
  EDateFilterCondition,
  EIDFilterCondition,
  ENumberFilterCondition,
  EStringFilterCondition
} from '@/common/enum/queryCondition.enum'

export type FilterTypes =
  | BooleanFilterInput
  | NumberFilterInput
  | DateFilterInput
  | StringFilterInput
  | IDFilterInput

export const isBooleanFilter = (filter: FilterTypes): filter is BooleanFilterInput =>
  typeof filter.value === 'boolean'

export const isNumberFilter = (filter: FilterTypes): filter is NumberFilterInput => {
  switch (filter.condition) {
    case ENumberFilterCondition.BETWEEN_EQUALS_FROM:
      return typeof filter.options?.from === 'number' && typeof filter.value === 'number'

    default:
      return typeof filter.value === 'number'
  }
}

export const isDateFilter = (filter: FilterTypes): filter is DateFilterInput => {
  const dateFilter = filter as DateFilterInput
  switch (dateFilter.condition) {
    case EDateFilterCondition.BETWEEN_EQUALS_FROM:
      return (
        typeof dateFilter.options?.from === 'object' &&
        typeof dateFilter.value?.getTime === 'function' &&
        typeof dateFilter.value === 'object' &&
        typeof dateFilter.value?.getTime === 'function'
      )

    default:
      return typeof dateFilter.value === 'object' && typeof dateFilter.value?.getTime === 'function'
  }
}

export const isStringFilter = (filter: FilterTypes): filter is StringFilterInput =>
  typeof filter.value === 'string'

export const isObjectIdFilter = (filter: FilterTypes): filter is IDFilterInput =>
  (typeof filter.value === 'string' || filter.value instanceof Types.ObjectId) &&
  Types.ObjectId.isValid(filter.value)

/**
 * If a value but no condition is defined, EQUALS will be chosen as the default condition.
 */

export const buildBooleanQueryCondition = (filter: BooleanFilterInput) => {
  switch (filter.condition) {
    case EBooleanFilterCondition.NOT_EQUALS:
      return { $ne: filter.value }

    default:
      return { $eq: filter.value }
  }
}

export const buildNumberQueryCondition = (filter: NumberFilterInput) => {
  switch (filter.condition) {
    case ENumberFilterCondition.NOT_EQUALS:
      return { $ne: filter.value }

    case ENumberFilterCondition.LESS_THAN:
      return { $lt: filter.value }

    case ENumberFilterCondition.LESS_THAN_OR_EQUAL:
      return { $lte: filter.value }

    case ENumberFilterCondition.GREATER_THAN:
      return { $gt: filter.value }

    case ENumberFilterCondition.GREATER_THAN_OR_EQUAL:
      return { $gte: filter.value }

    case ENumberFilterCondition.BETWEEN_EQUALS_FROM:
      return { $gte: filter.options!.from, $lte: filter.value }

    default:
      return { $eq: filter.value }
  }
}

export const buildDateQueryCondition = (filter: DateFilterInput) => {
  switch (filter.condition) {
    case EDateFilterCondition.NOT_EQUALS:
      return { $ne: filter.value }

    case EDateFilterCondition.LESS_THAN:
      return { $lt: filter.value }

    case EDateFilterCondition.LESS_THAN_OR_EQUAL:
      return { $lte: filter.value }

    case EDateFilterCondition.GREATER_THAN:
      return { $gt: filter.value }

    case EDateFilterCondition.GREATER_THAN_OR_EQUAL:
      return { $gte: filter.value }

    case EDateFilterCondition.BETWEEN_EQUALS_FROM:
      return { $gte: filter.options!.from?.toISOString() }

    default:
      return { $eq: filter.value }
  }
}

export const buildStringQueryCondition = (filter: StringFilterInput) => {
  let regex: string
  const stringSearch = escapeStringRegexp(filter.value)

  switch (filter.condition) {
    case EStringFilterCondition.NOT_EQUALS:
      regex = `^(?!${stringSearch}$).+`
      break

    case EStringFilterCondition.CONTAINS: {
      regex = stringSearch
      break
    }

    case EStringFilterCondition.NOT_CONTAINS: {
      regex = `^((?!${stringSearch}).)*$`
      break
    }

    case EStringFilterCondition.STARTS_WITH: {
      regex = `^${stringSearch}`
      break
    }

    case EStringFilterCondition.ENDS_WITH: {
      regex = `${stringSearch}$`
      break
    }

    default:
      regex = `^${stringSearch}$`
      break
  }

  if (filter.options?.caseSensitive) {
    return { $regex: regex, $options: '' }
  }

  return { $regex: regex, $options: 'i' }
}

export function buildIdFilterCondition(filter: IDFilterInput) {
  const value = new Types.ObjectId(filter.value)
  switch (filter.condition) {
    case EIDFilterCondition.NOT_EQUALS:
      return {
        $ne: value
      }

    default:
      return {
        $eq: value
      }
  }
}

export const buildQueryCondition = (filter: FilterTypes) => {
  if (typeof filter !== 'object' || !filter) {
    return undefined
  }

  if (isObjectIdFilter(filter)) {
    return buildIdFilterCondition(filter)
  }

  if (isBooleanFilter(filter)) {
    return buildBooleanQueryCondition(filter)
  }

  if (isNumberFilter(filter)) {
    return buildNumberQueryCondition(filter)
  }

  if (isDateFilter(filter)) {
    return buildDateQueryCondition(filter)
  }

  if (isStringFilter(filter)) {
    return buildStringQueryCondition(filter)
  }
}
