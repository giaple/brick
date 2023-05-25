import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { EGender, EScheduleDay, EWorkerRoleType } from '@/common/enum/user.enum'
import { OffsetPaginated } from '@/common/interface/offsetPagination.interface'
import { Paginated } from '@/common/interface/pagination.interface'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import type { IWorker, IWorkerSchedule, IWorkerTimeSlot } from './worker.interface'

@ObjectType()
export class WorkerTimeSlotModel implements IWorkerTimeSlot {
  @Field(() => Int)
  startTime: number

  @Field(() => Int)
  endTime: number

  @Field(() => Boolean)
  isActive: boolean
}

@ObjectType()
export class WorkerScheduleModel implements IWorkerSchedule {
  @Field(() => [WorkerTimeSlotModel])
  [EScheduleDay.SUNDAY]: WorkerTimeSlotModel[];

  @Field(() => [WorkerTimeSlotModel])
  [EScheduleDay.MONDAY]: WorkerTimeSlotModel[];

  @Field(() => [WorkerTimeSlotModel])
  [EScheduleDay.TUESDAY]: WorkerTimeSlotModel[];

  @Field(() => [WorkerTimeSlotModel])
  [EScheduleDay.WEDNESDAY]: WorkerTimeSlotModel[];

  @Field(() => [WorkerTimeSlotModel])
  [EScheduleDay.THURSDAY]: WorkerTimeSlotModel[];

  @Field(() => [WorkerTimeSlotModel])
  [EScheduleDay.FRIDAY]: WorkerTimeSlotModel[];

  @Field(() => [WorkerTimeSlotModel])
  [EScheduleDay.SATURDAY]: WorkerTimeSlotModel[]
}

@ObjectType()
export class WorkerModel implements IWorker {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId

  @Field(() => ObjectIdScalar)
  categoryId: Types.ObjectId

  @Field(() => String)
  phoneCountryCode: string

  @Field(() => String)
  phoneNumber: string

  @Field(() => String, { nullable: true })
  firstName?: string

  @Field(() => String, { nullable: true })
  lastName?: string

  @Field(() => String, { nullable: true })
  dob?: string

  @Field(() => EGender, { nullable: true })
  gender?: EGender

  @Field(() => String, { nullable: true })
  city?: string

  @Field(() => String, { nullable: true })
  district?: string

  @Field(() => String, { nullable: true })
  ward?: string

  @Field(() => String, { nullable: true })
  address?: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => Boolean, { nullable: true })
  isEmailVerified?: boolean

  @Field(() => String, { nullable: true })
  imageUrl?: string

  @Field(() => String, { nullable: true })
  adminNote?: string

  @Field(() => EWorkerRoleType)
  role: EWorkerRoleType

  @Field(() => WorkerScheduleModel)
  schedule: WorkerScheduleModel

  @Field(() => Boolean)
  isAvailable: boolean

  @Field(() => Boolean)
  isActive: boolean

  @Field(() => Date, { nullable: true })
  deactivatedAt?: Date

  @Field(() => Boolean, { nullable: true })
  isDeleted?: boolean

  @Field(() => Date, { nullable: true })
  deletedAt?: Date

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  /* Virtual fields */
  @Field(() => String, { nullable: true })
  fullName?: string
}

@ObjectType()
export class PaginatedWorkers extends Paginated(WorkerModel) {}

@ObjectType()
export class OffsetPaginatedWorkers extends OffsetPaginated(WorkerModel) {}
