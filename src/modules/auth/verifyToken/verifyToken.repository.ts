import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import { Model } from 'mongoose'
import { EErrorMessage } from '@/common/enum/error.enum'
import type { IAuthConfig } from '@/modules/config/authConfig'
import { VerifyToken } from './verifyToken.entity'
import type { VerifyTokenCreateInput, VerifyTokenInput } from './verifyToken.dto'
import type { Types } from 'mongoose'

@Injectable()
export class VerifyTokenRepository {
  private readonly _config: IAuthConfig
  constructor(
    @InjectModel(VerifyToken.name) private readonly model: Model<VerifyToken>,
    private readonly configService: ConfigService
  ) {
    this._config = this.configService.get<IAuthConfig>('auth')!
  }

  async create(input: VerifyTokenCreateInput) {
    const expiredAt = dayjs().add(this._config.verifyTokenExpiresIn, 'second').toDate()
    const entity = await this.model.create({ ...input, expiredAt })
    return entity
  }

  async verifyToken(id: Types.ObjectId) {
    const entity = await this.model.findByIdAndUpdate(id, { $set: { isUsed: true } }, { new: true })
    return entity
  }

  async findByToken(input: VerifyTokenInput) {
    const entity = await this.model.findOne(input)
    if (!entity) throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND)
    return entity
  }
}
