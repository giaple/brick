import { Field, Int, ObjectType } from '@nestjs/graphql'
import type { Type } from '@nestjs/common'

export interface IOffsetPaginatedType<T> {
  nodes: T[]
  totalCount: number
  pageSize?: number
  pageNumber?: number
}

export function OffsetPaginated<T>(classRef: Type<T>): Type<IOffsetPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class OffsetPaginatedType implements IOffsetPaginatedType<T> {
    @Field(() => [classRef])
    nodes: T[]

    @Field(() => Int)
    totalCount: number

    @Field(() => Int, { nullable: true })
    pageSize?: number

    @Field(() => Int, { nullable: true })
    pageNumber?: number
  }

  return OffsetPaginatedType as Type<IOffsetPaginatedType<T>>
}
