import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { EAppointmentStatus } from '@/common/enum/appointment.enum'
import type { IAppointment } from './appointment.interface'

@Schema({
  autoIndex: true,
  timestamps: true
})
export class Appointment extends Document implements IAppointment {
  declare _id: Types.ObjectId

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true
  })
  customerId: Types.ObjectId

  @Prop({
    type: MongooseSchema.Types.ObjectId
  })
  workerId?: Types.ObjectId

  @Prop({
    enum: EAppointmentStatus,
    default: EAppointmentStatus.SCHEDULED
  })
  status: EAppointmentStatus

  @Prop({
    type: String
  })
  adminNote?: string

  @Prop({
    type: Date
  })
  startDate: Date

  @Prop({
    type: Date
  })
  endDate: Date

  @Prop({
    type: Date
  })
  createdAt: Date

  @Prop({
    type: Date
  })
  updatedAt: Date
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment)

// Create indexes
AppointmentSchema.index({ workerId: 1, status: 1, startDate: 1, endDate: 1 })

AppointmentSchema.pre('find', function () {
  const query = this.getQuery()
  console.log(query)
})
