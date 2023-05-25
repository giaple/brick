import { Field, ObjectType } from '@nestjs/graphql'
import type { Type } from '@nestjs/common'
import type { Types } from 'mongoose'

export interface INode {
  _id: Types.ObjectId
}

interface IEdgeType<T> {
  cursor: string
  node: T
}

export interface IPaginatedType<T> {
  edges: Array<IEdgeType<T>>
  hasNextPage?: boolean
  startCursor?: string
  endCursor?: string
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor: string

    @Field(() => classRef)
    node: T
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(() => [EdgeType])
    edges: EdgeType[]

    @Field(() => Boolean, { nullable: true })
    hasNextPage?: boolean

    @Field(() => String, { nullable: true })
    startCursor?: string

    @Field(() => String, { nullable: true })
    endCursor?: string
  }

  return PaginatedType as Type<IPaginatedType<T>>
}
