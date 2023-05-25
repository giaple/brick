import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import dayjs from 'dayjs'
import { EErrorMessage } from '@/common/enum/error.enum'
import { RefreshTokenRepository } from './refreshToken.repository'
import type {
  RefreshTokenCreateInput,
  FindRefreshTokenByTokenInput,
  DeleteRefreshTokenByTokenInput
} from './refreshToken.dto'
import type { RefreshTokenModel } from './refreshToken.model'

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name)
  constructor(private readonly repository: RefreshTokenRepository) {}

  async create(input: RefreshTokenCreateInput): Promise<RefreshTokenModel> {
    const newEntity = await this.repository.create(input)
    return newEntity
  }

  async findByToken(input: FindRefreshTokenByTokenInput) {
    const entity = await this.repository.findByToken(input)

    if (dayjs().isAfter(entity.expiredAt))
      throw new BadRequestException(EErrorMessage.TOKEN_EXPIRED)

    return entity
  }

  async deleteByToken(input: DeleteRefreshTokenByTokenInput) {
    return await this.repository.deleteByToken(input)
  }
}
