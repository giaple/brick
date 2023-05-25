import { registerEnumType } from '@nestjs/graphql'

export enum EAppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  RESCHEDULED = 'RESCHEDULED',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED'
}

registerEnumType(EAppointmentStatus, {
  name: 'EAppointmentStatus'
})
