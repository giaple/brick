export enum EErrorCode {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}

export enum EErrorMessage {
  // Entity errors
  ENTITY_NOT_FOUND = 'entity not found',

  // Token errors
  TOKEN_USED = 'code is used',
  TOKEN_EXPIRED = 'code is expired',

  // User errors
  USER_NOT_FOUND = 'user not found',
  USER_UNAUTHORIZED = 'user is not authorized',
  USER_TYPE_INVALID = 'user type is invalid',

  // Worker errors
  WORKER_NOT_AVAILABLE = 'worker is not available',

  // File errors
  FILE_UPLOAD_FAILED = 'error when uploading file',
  FILE_MOVE_FAILED = 'error when moving file',
  FILE_KEY_FORMAT_INVALID = 'key format is invalid',

  // Campaign errors
  CAMPAIGN_EXISTED = 'campaign existed',
  CAMPAIGN_TYPE_INVALID = 'campaign type is invalid',
  CAMPAIGN_TARGET_INVALID = 'campaign target is invalid',
  CAMPAIGN_DATES_INVALID = 'campaign start and end dates are invalid',
  CAMPAIGN_PROMOTION_TARGET_DUPLICATED = 'campaign promotion target is duplicated',
  CAMPAIGN_PROMOTION_TYPE_INVALID = 'promotion type is invalid',

  // Job errors
  JOB_STATUS_NOT_ALLOWED_TO_CHANGE = 'status is not allowed to change',
  JOB_RESCHEDULED_DATE_INVALID = 'rescheduled date is invalid',

  // Pricing errors
  PRICING_SOME_ITEMS_NOT_FOUND = 'some items are not found',
  PRICING_SOME_OPTIONS_NOT_FOUND = 'some options are not found',

  // Validation errors
  PHONE_NUMBER_INVALID = 'phone number is invalid format',
  DATE_FORMAT_INVALID = 'date format is invalid',
  DATE_INVALID = 'date is invalid'
}
