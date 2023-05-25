import { BadRequestException } from '@nestjs/common'
import dayjs from 'dayjs'
import IsSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { isEqual } from 'lodash'
import { EScheduleDay } from '@/common/enum/user.enum'
dayjs.extend(IsSameOrBefore)

export const getChangedFields = <T>(
  oldRecord: Partial<Record<keyof T, T[keyof T]>>,
  newRecord: Partial<Record<keyof T, T[keyof T]>>
) => {
  const changedFields: Partial<Record<keyof T, T[keyof T]>> = {}

  for (const key in newRecord) {
    if (!(key in oldRecord)) {
      changedFields[key] = newRecord[key]
    }

    const oldValue = oldRecord[key]
    const newValue = newRecord[key]

    if (!isEqual(oldValue, newValue)) {
      changedFields[key] = newValue
    }
  }

  return changedFields
}

export const formatPhoneNumber = (phoneNumber: string) =>
  phoneNumber.trim().replace(/^(?:\+?84|0)?/, '')

export const ObjectKeys = <T extends object>(obj: T) => Object.keys(obj) as Array<keyof T>

export const ObjectValues = <T extends object>(obj: T) => Object.values(obj) as Array<T[keyof T]>

export const ObjectEntries = <T extends object>(obj: T) =>
  Object.entries(obj) as Array<[keyof T, T[keyof T]]>

export const getDates = (startDate: Date, endDate: Date, keepOriginTime = false): Date[] => {
  const dates: Date[] = []
  let currentDate = keepOriginTime ? dayjs(startDate) : dayjs(startDate).startOf('day')

  while (currentDate.isSameOrBefore(endDate, 'day')) {
    dates.push(currentDate.toDate())
    currentDate = currentDate.add(1, 'day')
  }

  return dates
}

export const convertDayOfWeekToName = (value: number) => {
  switch (value) {
    case 0:
      return EScheduleDay.SUNDAY

    case 1:
      return EScheduleDay.MONDAY

    case 2:
      return EScheduleDay.TUESDAY

    case 3:
      return EScheduleDay.WEDNESDAY

    case 4:
      return EScheduleDay.THURSDAY

    case 5:
      return EScheduleDay.FRIDAY

    case 6:
      return EScheduleDay.SATURDAY

    default:
      throw new BadRequestException('')
  }
}
