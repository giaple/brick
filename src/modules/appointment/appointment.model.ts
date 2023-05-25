import { Field, ObjectType } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { EAppointmentStatus } from '@/common/enum/appointment.enum'
import { OffsetPaginated } from '@/common/interface/offsetPagination.interface'
import { Paginated } from '@/common/interface/pagination.interface'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import type { IAppointment, IAppointmentAvailableSlot } from './appointment.interface'

@ObjectType()
export class AppointmentModel implements IAppointment {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId

  @Field(() => ObjectIdScalar)
  customerId: Types.ObjectId

  @Field(() => ObjectIdScalar, { nullable: true })
  workerId?: Types.ObjectId

  @Field(() => EAppointmentStatus)
  status: EAppointmentStatus

  @Field(() => String, { nullable: true })
  adminNote?: string

  @Field(() => Date)
  startDate: Date

  @Field(() => Date)
  endDate: Date

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}

@ObjectType()
export class PaginatedAppointments extends Paginated(AppointmentModel) {}

@ObjectType()
export class OffsetPaginatedAppointments extends OffsetPaginated(AppointmentModel) {}

@ObjectType()
export class AppointmentAvailableSlotModel implements IAppointmentAvailableSlot {
  @Field(() => [Number])
  slots: number[]

  @Field(() => String)
  date: string
}
