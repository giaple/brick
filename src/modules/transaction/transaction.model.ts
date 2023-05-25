import { Field, Float, ObjectType } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { EPaymentMethod, ETransactionStatus } from '@/common/enum/transaction.enum'
import { OffsetPaginated } from '@/common/interface/offsetPagination.interface'
import { Paginated } from '@/common/interface/pagination.interface'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import type { ITransaction } from './transaction.interface'

@ObjectType()
export class TransactionModel implements ITransaction {
  @Field(() => ObjectIdScalar)
  _id: Types.ObjectId

  @Field(() => ObjectIdScalar)
  userId: Types.ObjectId

  @Field(() => EPaymentMethod)
  paymentMethod: EPaymentMethod

  @Field(() => ETransactionStatus)
  status: ETransactionStatus

  @Field(() => Float)
  amount: number

  @Field(() => String, { nullable: true })
  note?: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}

@ObjectType()
export class PaginatedTransactions extends Paginated(TransactionModel) {}

@ObjectType()
export class OffsetPaginatedTransactions extends OffsetPaginated(TransactionModel) {}
