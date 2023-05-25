export interface IAWSS3Config {
  bucketName: string
  bucketRegion: string
  cdnDomain: string
  presignedUrlExpireTime: number
  imageSizeLimit: number
}

const awsS3: IAWSS3Config = {
  bucketName: process.env.AWS_S3_BUCKET_NAME ?? 'assets.dev.workwithnook.com',
  bucketRegion: process.env.AWS_S3_BUCKET_REGION ?? 'ap-southeast-1',
  cdnDomain:
    process.env.AWS_S3_CDN_DOMAIN ??
    'https://s3.ap-southeast-1.amazonaws.com/assets.dev.workwithnook.com',
  presignedUrlExpireTime: parseInt(process.env.AWS_S3_PRESIGNED_URL_EXPIRE_TIME ?? '300', 10),
  imageSizeLimit: parseInt(process.env.AWS_S3_IMAGE_SIZE_LIMIT ?? '5242880', 10)
}

export default () => ({ awsS3 })
