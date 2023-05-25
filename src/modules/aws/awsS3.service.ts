import { randomUUID } from 'crypto'
import { promisify } from 'util'
import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3 } from 'aws-sdk'
import dayjs from 'dayjs'
import { FILE_PATH } from '@/common/constant'
import { EErrorMessage } from '@/common/enum/error.enum'
import type { ETargetType } from '@/common/enum/upload.enum'
import { EFileContentType, EFileType } from '@/common/enum/upload.enum'
import type { IAWSS3Config } from '@/modules/config/awsS3Config'
import type { IPresignedUrlParams, IPresignedUrlResponse } from './awsS3.interface'
import type { CopyObjectRequest } from 'aws-sdk/clients/s3'

@Injectable()
export class AWSS3Service {
  private readonly config: IAWSS3Config
  private readonly s3: S3
  private readonly logger = new Logger(AWSS3Service.name)
  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.get<IAWSS3Config>('awsS3')!
    this.s3 = new S3({
      region: this.config.bucketRegion,
      params: {
        Bucket: this.config.bucketName
      }
    })
  }

  private _generateKey(target: ETargetType, type: EFileType, isTemp: boolean = false) {
    const tempPrefix = isTemp ? FILE_PATH.TEMP.path : ''
    const pathInfo = FILE_PATH[target] ? FILE_PATH[target] : FILE_PATH.TEMP
    return `${tempPrefix}${pathInfo.path}${dayjs().format('DD-MM-YYYY')}/${randomUUID()}.${type}`
  }

  private _generateContentType(type: EFileType) {
    switch (type) {
      case EFileType.JPEG:
      case EFileType.JPG:
        return EFileContentType.JPEG

      case EFileType.PNG:
        return EFileContentType.PNG

      case EFileType.WEBP:
        return EFileContentType.WEBP

      case EFileType.GIF:
        return EFileContentType.GIF

      default:
        return type
    }
  }

  async generatePresignedUrl(payload: IPresignedUrlParams): Promise<IPresignedUrlResponse> {
    const key = this._generateKey(payload.target, payload.type, payload.isTemp)
    const params: S3.PresignedPost.Params = {
      Bucket: this.config.bucketName,
      Fields: {
        key
      },
      Expires: this.config.presignedUrlExpireTime,
      Conditions: [
        { acl: 'public-read' },
        { 'Content-Type': this._generateContentType(payload.type) },
        ['content-length-range', 1, this.config.imageSizeLimit]
      ]
    }

    try {
      const createPresignedPostPromise = promisify(this.s3.createPresignedPost).bind(this.s3)
      const result = await createPresignedPostPromise(params)
      if (result.fields) {
        result.fields.acl = result.fields.acl || 'public-read'
        result.fields['Content-Type'] =
          result.fields['Content-Type'] || this._generateContentType(payload.type)
      }
      return {
        cdnUrl: `${this.config.cdnDomain}/${key}`,
        ...result
      }
    } catch (err) {
      this.logger.error(err, this.generatePresignedUrl.name)
      throw new BadRequestException(EErrorMessage.FILE_UPLOAD_FAILED)
    }
  }

  async copyFile(srcKey: string, desKey: string): Promise<string> {
    const params: CopyObjectRequest = {
      Bucket: this.config.bucketName,
      Key: desKey,
      CopySource: encodeURI(`${this.config.bucketName}/${srcKey}`),
      ACL: 'public-read'
    }
    await this.s3.copyObject(params).promise()
    return `${this.config.cdnDomain}/${desKey}`
  }

  async moveFileFromTemp(fileUrl: string): Promise<string> {
    try {
      const tempKey = fileUrl.split(`${this.config.cdnDomain}/`)[1]
      const mainKey = tempKey.split(FILE_PATH.TEMP.path)[1]
      if (!tempKey || !mainKey) {
        throw new BadRequestException(EErrorMessage.FILE_KEY_FORMAT_INVALID)
      }
      return await this.copyFile(tempKey, mainKey)
    } catch (err) {
      throw new BadRequestException(EErrorMessage.FILE_MOVE_FAILED)
    }
  }
}
