import { EErrorCode } from '@/common/enum/error.enum'
import type { GraphQLFormattedError } from 'graphql'

interface IFormattedOriginalError {
  statusCode: number
  message: string | string[]
  error: string
}

interface IGQLFormattedExtensions {
  code?: string
  originalError?: IFormattedOriginalError
}

interface IHttpReponse {
  status: number
}

interface IGQLExtensions {
  code: string
  http: IHttpReponse
}

interface IGraphQLError {
  extensions: IGQLExtensions
}

export const gqlErrorFormat = (
  formattedError: GraphQLFormattedError,
  error: unknown | IGraphQLError
) => {
  console.log(JSON.stringify(formattedError.extensions))
  const extensions = formattedError.extensions as IGQLFormattedExtensions
  // Todo log error
  let statusCode = 500
  const code = extensions.code ?? EErrorCode.INTERNAL_SERVER_ERROR
  let message: any = formattedError.message

  if (extensions?.originalError) {
    statusCode = extensions.originalError.statusCode
    message =
      typeof extensions.originalError.message === 'string'
        ? extensions.originalError.message
        : extensions.originalError.message[0]
  } else {
    const { extensions } = error as IGraphQLError
    statusCode = extensions?.http?.status ?? statusCode
  }

  return {
    code,
    statusCode,
    message
  }
}
