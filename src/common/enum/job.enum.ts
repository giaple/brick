import { registerEnumType } from '@nestjs/graphql'

export enum EJobStatus {
  POSTED = 'POSTED',
  CONTACTED = 'CONTACTED',
  RESCHEDULED = 'RESCHEDULED',
  IN_PROCESS = 'IN_PROCESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED'
}

registerEnumType(EJobStatus, {
  name: 'EJobStatus'
})
