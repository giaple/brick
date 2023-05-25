import { BadRequestException } from '@nestjs/common'
import { Scalar } from '@nestjs/graphql'
import { Kind } from 'graphql'
import { EErrorMessage } from '@/common/enum/error.enum'
import type { CustomScalar } from '@nestjs/graphql'
import type { ASTNode } from 'graphql'

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<number, Date> {
  description: string = 'Date custom scalar type'

  parseValue(value: unknown): Date {
    return new Date(value as number) // value from the client
  }

  serialize(value: unknown): number {
    return (value as Date).getTime() // value sent to the client
  }

  parseLiteral(ast: ASTNode): Date {
    if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }

    throw new BadRequestException(EErrorMessage.DATE_FORMAT_INVALID)
  }
}
