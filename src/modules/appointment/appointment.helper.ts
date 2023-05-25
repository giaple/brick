import dayjs from 'dayjs'
import type { IScheduleSlot } from '@/common/interface'
import type { CategoryScheduleModel } from '@/modules/category/category.model'
import type { AppointmentModel } from './appointment.model'

export const convertscheduleToSlots =
  (categorySchedule: CategoryScheduleModel) => (slot: IScheduleSlot) => {
    const { startTime: catStartTime, endTime: catEndTime, gap } = categorySchedule
    const { startTime: slotStartTime, endTime: slotEndTime } = slot

    const startTime = catStartTime > slotStartTime ? catStartTime : slotStartTime
    const endTime = catEndTime < slotEndTime ? catEndTime : slotEndTime

    const startSlot = startTime % gap === 0 ? startTime : startTime + (gap - (startTime % gap))
    const endSlot = endTime % gap === 0 ? endTime : endTime - (endTime % gap)

    const availableSlots: number[] = [startSlot]

    let nextSlot = startSlot
    while (nextSlot < endSlot) {
      nextSlot = nextSlot + gap
      availableSlots.push(nextSlot)
    }

    return availableSlots
  }

export const convertAppointmentToSchedule = (appointment: AppointmentModel): IScheduleSlot => {
  const startDate = dayjs(appointment.startDate)
  const endDate = dayjs(appointment.endDate)
  return {
    startTime: startDate.hour() * 60 + startDate.minute(),
    endTime: endDate.hour() * 60 + endDate.minute()
  }
}
