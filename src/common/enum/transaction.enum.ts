import { registerEnumType } from '@nestjs/graphql'

export enum EPaymentMethod {
  CASH = 'CASH',
  MOMO = 'MOMO',
  BANK = 'BANK'
}

export enum ETransactionStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

registerEnumType(EPaymentMethod, {
  name: 'EPaymentMethod'
})

registerEnumType(ETransactionStatus, {
  name: 'ETransactionStatus'
})
