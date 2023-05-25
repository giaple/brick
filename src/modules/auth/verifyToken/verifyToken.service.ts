import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import dayjs from 'dayjs'
import { EErrorMessage } from '@/common/enum/error.enum'
import { VerifyTokenRepository } from './verifyToken.repository'
import type { VerifyTokenCreateInput, VerifyTokenInput } from './verifyToken.dto'
import type { VerifyTokenModel } from './verifyToken.model'

@Injectable()
export class VerifyTokenService {
  private readonly logger = new Logger(VerifyTokenService.name)
  constructor(private readonly repository: VerifyTokenRepository) {}

  async create(input: VerifyTokenCreateInput): Promise<VerifyTokenModel> {
    const newEntity = await this.repository.create(input)
    return newEntity
  }

  async verifyToken(input: VerifyTokenInput) {
    const entity = await this.repository.findByToken(input)

    if (entity.isUsed) throw new BadRequestException(EErrorMessage.TOKEN_USED)

    if (dayjs().isAfter(entity.expiredAt))
      throw new BadRequestException(EErrorMessage.TOKEN_EXPIRED)

    await this.repository.verifyToken(entity._id)
  }
}
