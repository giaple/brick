import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { EPaymentMethod, ETransactionStatus } from '@/common/enum/transaction.enum'
import type { ITransaction } from './transaction.interface'

@Schema({
  autoIndex: true,
  timestamps: true
})
export class Transaction extends Document implements ITransaction {
  declare _id: Types.ObjectId

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true
  })
  userId: Types.ObjectId

  @Prop({
    enum: EPaymentMethod,
    default: EPaymentMethod.CASH
  })
  paymentMethod: EPaymentMethod

  @Prop({
    enum: ETransactionStatus,
    default: ETransactionStatus.PENDING
  })
  status: ETransactionStatus

  @Prop({
    type: Number,
    required: true
  })
  amount: number

  @Prop({
    type: String
  })
  note?: string

  @Prop({
    type: Date
  })
  createdAt: Date

  @Prop({
    type: Date
  })
  updatedAt: Date
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction)

// Create indexes
TransactionSchema.index({ userId: 1 })

// Plugins
