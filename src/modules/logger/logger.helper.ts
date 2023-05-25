import type { Logger } from '@nestjs/common'

export const logInfo = (logger: Logger, message: string, data?: unknown) => {
  if (data) {
    logger.log({ body: data }, message)
  } else logger.log(message)
}
