import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { EGender, EPhoneCountryCode, EWorkerRoleType } from '@/common/enum/user.enum'
import { WorkerScheduleSchema, WorkerSchedule } from './nestedSchema/workerSchedule'
import type { IWorker } from './worker.interface'

@Schema({
  autoIndex: true,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Worker extends Document implements IWorker {
  declare _id: Types.ObjectId

  @Prop({
    type: String,
    default: EPhoneCountryCode.VI
  })
  phoneCountryCode: string

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true
  })
  categoryId: Types.ObjectId

  @Prop({
    type: String,
    required: true
  })
  phoneNumber: string

  @Prop({
    type: String
  })
  firstName?: string

  @Prop({
    type: String
  })
  lastName?: string

  @Prop({
    type: String
  })
  dob?: string

  @Prop({
    type: String,
    enum: EGender
  })
  gender?: EGender

  @Prop({
    type: String
  })
  city?: string

  @Prop({
    type: String
  })
  district?: string

  @Prop({
    type: String
  })
  ward?: string

  @Prop({
    type: String
  })
  address?: string

  @Prop({
    type: String
  })
  email?: string

  @Prop({
    type: Boolean
  })
  isEmailVerified?: boolean

  @Prop({
    type: String
  })
  imageUrl?: string

  @Prop({
    type: String
  })
  adminNote?: string

  @Prop({
    type: Boolean
  })
  isDeleted?: boolean

  @Prop({
    type: Date
  })
  deletedAt?: Date

  @Prop({
    enum: EWorkerRoleType,
    default: EWorkerRoleType.SUPER_WORKER
  })
  role: EWorkerRoleType

  @Prop({
    type: WorkerScheduleSchema,
    default: {}
  })
  schedule: WorkerSchedule

  @Prop({
    type: Boolean,
    default: true
  })
  isAvailable: boolean

  @Prop({
    type: Boolean,
    default: true
  })
  isActive: boolean

  @Prop({
    type: Date
  })
  deactivatedAt?: Date

  @Prop({
    type: Date
  })
  createdAt: Date

  @Prop({
    type: Date
  })
  updatedAt: Date
}

export const WorkerSchema = SchemaFactory.createForClass(Worker)

// Create indexes
WorkerSchema.index({ phoneNumber: 1 }, { unique: true })
WorkerSchema.index({ categoryId: 1 })
WorkerSchema.index({ email: 1 }, { unique: true, sparse: true })

// Virtuals
WorkerSchema.virtual('fullName').get(function (this) {
  return `${this.firstName ? `${this.firstName} ` : ''}${this.lastName ?? ''}`
})
