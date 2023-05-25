import { Scalar } from '@nestjs/graphql'
import { Kind } from 'graphql'
import type { ASTNode } from 'graphql'
import type { Types } from 'mongoose'

@Scalar('ObjectId')
export class ObjectIdScalar {
  description = 'MongoDB ObjectId scalar type, sent as 24 byte Hex String'

  parseValue(value: string) {
    return value // value from the client
  }

  serialize(value: Types.ObjectId) {
    return value.toString() // value sent to the client
  }

  parseLiteral(ast: ASTNode) {
    if (ast.kind === Kind.STRING) {
      return ast.value // ast value is always in string format
      // return new Types.ObjectId(ast.value)
    }
    return null
  }
}
