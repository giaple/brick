import type { EScheduleDay, EWorkerRoleType } from '@/common/enum/user.enum'
import type { IUser } from '@/common/interface/user.interface'
import type { Types } from 'mongoose'

export interface IWorker extends IUser {
  isActive: boolean
  deactivatedAt?: Date
  role: EWorkerRoleType
  isAvailable: boolean
  categoryId: Types.ObjectId
  schedule: IWorkerSchedule
}

export interface IWorkerSchedule {
  [EScheduleDay.SUNDAY]: IWorkerTimeSlot[]
  [EScheduleDay.MONDAY]: IWorkerTimeSlot[]
  [EScheduleDay.TUESDAY]: IWorkerTimeSlot[]
  [EScheduleDay.WEDNESDAY]: IWorkerTimeSlot[]
  [EScheduleDay.THURSDAY]: IWorkerTimeSlot[]
  [EScheduleDay.FRIDAY]: IWorkerTimeSlot[]
  [EScheduleDay.SATURDAY]: IWorkerTimeSlot[]
}

export interface IWorkerTimeSlot {
  startTime: number
  endTime: number
  isActive: boolean
}
