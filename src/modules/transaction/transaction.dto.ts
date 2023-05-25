import { Field, InputType } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { EPaymentMethod, ETransactionStatus } from '@/common/enum/transaction.enum'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'

@InputType()
export class TransactionUpdateInput {
  @Field(() => Number, { nullable: true })
  amount?: number

  @Field(() => ETransactionStatus, { nullable: true })
  status?: ETransactionStatus

  @Field(() => EPaymentMethod, { nullable: true })
  paymentMethod?: EPaymentMethod

  @Field(() => String, { nullable: true })
  note?: string
}

@InputType()
export class TransactionSearchQueryInput {
  @Field(() => ObjectIdScalar, { nullable: true })
  userId?: Types.ObjectId
}

@InputType()
export class TransactionFindManyQueryInput {
  @Field(() => [ObjectIdScalar])
  ids: Types.ObjectId[]
}

/* Internal DTOs */
export class TransactionCreateInput {
  userId: Types.ObjectId
  amount: number
  paymentMethod?: EPaymentMethod
  note?: string
}
