import { Injectable } from '@nestjs/common'
import { BaseLoader } from '@/modules/dataloader/dataloader.base'
import { TransactionService } from './transaction.service'
import type { TransactionFindManyQueryInput } from './transaction.dto'
import type { TransactionModel } from './transaction.model'

@Injectable()
export class TransactionLoader extends BaseLoader<TransactionModel, TransactionFindManyQueryInput> {
  constructor(private readonly transactionService: TransactionService) {
    super()
  }

  protected async findMany(input: TransactionFindManyQueryInput): Promise<TransactionModel[]> {
    return await this.transactionService.findMany(input)
  }
}
