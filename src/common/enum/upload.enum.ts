import { registerEnumType } from '@nestjs/graphql'
export enum ETargetType {
  CUSTOMER = 'CUSTOMER',
  WORKER = 'WORKER',
  JOB = 'JOB',
  ITEM = 'ITEM',
  CATEGORY = 'CATEGORY',
  OPTION = 'OPTION'
}

export enum EFileType {
  PNG = 'png',
  JPG = 'jpg',
  JPEG = 'jpeg',
  WEBP = 'webp',
  GIF = 'gif'
}

export enum EFileContentType {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
  GIF = 'image/gif',
  JPG = 'image/jpg'
}

registerEnumType(ETargetType, {
  name: 'ETargetType'
})

registerEnumType(EFileType, {
  name: 'EFileType'
})
