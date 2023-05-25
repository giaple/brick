import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Transaction, TransactionSchema } from './transaction.entity'
import { TransactionRepository } from './transaction.repository'
import { TransactionResolver } from './transaction.resolver'
import { TransactionService } from './transaction.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }])],
  providers: [TransactionResolver, TransactionService, TransactionRepository],
  exports: [TransactionService]
})
export class TransactionModule {}
