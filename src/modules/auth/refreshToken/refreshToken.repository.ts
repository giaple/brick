import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import { Model } from 'mongoose'
import { EErrorMessage } from '@/common/enum/error.enum'
import type { IAuthConfig } from '@/modules/config/authConfig'
import { RefreshToken } from './refreshToken.entity'
import type {
  DeleteRefreshTokenByTokenInput,
  FindRefreshTokenByTokenInput,
  RefreshTokenCreateInput
} from './refreshToken.dto'

@Injectable()
export class RefreshTokenRepository {
  private readonly _config: IAuthConfig
  constructor(
    @InjectModel(RefreshToken.name) private readonly model: Model<RefreshToken>,
    private readonly configService: ConfigService
  ) {
    this._config = this.configService.get<IAuthConfig>('auth')!
  }

  async create(input: RefreshTokenCreateInput) {
    const expiredAt = dayjs().add(this._config.refreshTokenExpiresIn, 'second').toDate()
    const entity = await this.model.create({ ...input, expiredAt })
    return entity
  }

  async findByToken(input: FindRefreshTokenByTokenInput) {
    const entity = await this.model.findOne(input)
    if (!entity) throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND)
    return entity
  }

  async deleteByToken(input: DeleteRefreshTokenByTokenInput) {
    const entity = await this.model.findOneAndDelete(input)
    if (!entity) throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND)
    return entity
  }
}
