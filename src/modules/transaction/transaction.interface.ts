import type { EPaymentMethod, ETransactionStatus } from '@/common/enum/transaction.enum'
import type { IObjectId } from '@/common/interface'
import type { Types } from 'mongoose'

export interface ITransaction extends IObjectId {
  userId: Types.ObjectId
  paymentMethod: EPaymentMethod
  status: ETransactionStatus
  amount: number
  note?: string
  createdAt: Date
  updatedAt: Date
}
