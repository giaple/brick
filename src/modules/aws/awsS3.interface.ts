import type { EFileType, ETargetType } from '@/common/enum/upload.enum'

export interface IPresignedUrlParams {
  target: ETargetType
  type: EFileType
  isTemp?: boolean
}

export interface IPresignedUrlFields {
  bucket: string
  key: string
  acl: string
  Policy: string
  'Content-Type': string
  'X-Amz-Algorithm': string
  'X-Amz-Credential': string
  'X-Amz-Date': string
  'X-Amz-Signature': string
}

export interface IPresignedUrlResponse {
  url: string
  cdnUrl: string
  fields: IPresignedUrlFields
}
