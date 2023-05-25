import type { EAppointmentStatus } from '@/common/enum/appointment.enum'
import type { IObjectId } from '@/common/interface'
import type { Types } from 'mongoose'

export interface IAppointment extends IObjectId {
  customerId: Types.ObjectId
  workerId?: Types.ObjectId
  startDate: Date
  endDate: Date
  status: EAppointmentStatus
  adminNote?: string
  createdAt: Date
  updatedAt: Date
}

export interface IAppointmentAvailableSlot {
  slots: number[]
  date: string
}
