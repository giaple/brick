import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { EScheduleDay } from '@/common/enum/user.enum'
import type { IWorkerSchedule, IWorkerTimeSlot } from '@/modules/worker/worker.interface'
import { WorkerTimeSlotSchema } from './workerTimeSlot'
import type { WorkerTimeSlot } from './workerTimeSlot'

const defaultWorkerTimeSlot: IWorkerTimeSlot[] = [{ startTime: 420, endTime: 1260, isActive: true }]

@Schema({
  _id: false
})
export class WorkerSchedule implements IWorkerSchedule {
  @Prop({
    type: [WorkerTimeSlotSchema],
    default: defaultWorkerTimeSlot
  })
  [EScheduleDay.SUNDAY]: WorkerTimeSlot[];

  @Prop({
    type: [WorkerTimeSlotSchema],
    default: defaultWorkerTimeSlot
  })
  [EScheduleDay.MONDAY]: WorkerTimeSlot[];

  @Prop({
    type: [WorkerTimeSlotSchema],
    default: defaultWorkerTimeSlot
  })
  [EScheduleDay.TUESDAY]: WorkerTimeSlot[];

  @Prop({
    type: [WorkerTimeSlotSchema],
    default: defaultWorkerTimeSlot
  })
  [EScheduleDay.WEDNESDAY]: WorkerTimeSlot[];

  @Prop({
    type: [WorkerTimeSlotSchema],
    default: defaultWorkerTimeSlot
  })
  [EScheduleDay.THURSDAY]: WorkerTimeSlot[];

  @Prop({
    type: [WorkerTimeSlotSchema],
    default: defaultWorkerTimeSlot
  })
  [EScheduleDay.FRIDAY]: WorkerTimeSlot[];

  @Prop({
    type: [WorkerTimeSlotSchema],
    default: defaultWorkerTimeSlot
  })
  [EScheduleDay.SATURDAY]: WorkerTimeSlot[]
}

export const WorkerScheduleSchema = SchemaFactory.createForClass(WorkerSchedule)
