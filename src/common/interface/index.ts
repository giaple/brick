import type { Types } from 'mongoose'

export interface IObjectId {
  _id: Types.ObjectId
}

export interface IScheduleSlot {
  startTime: number
  endTime: number
}
