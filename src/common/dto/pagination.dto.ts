import { Field, InputType, Int } from '@nestjs/graphql'
import { Min } from 'class-validator'
import { ESortOrder } from '@/common/enum'

@InputType()
export class PaginationInput {
  @Field(() => String, { nullable: true })
  after?: string

  @Field(() => String, { nullable: true })
  before?: string

  @Field(() => Int)
  limit: number = 10

  @Field(() => ESortOrder)
  sortOrder: ESortOrder = ESortOrder.DESC
}

@InputType()
export class OffsetPaginationInput {
  @Field(() => Int)
  @Min(1)
  limit: number = 10

  @Field(() => Int)
  @Min(1)
  pageNumber: number = 1

  @Field(() => ESortOrder)
  sortOrder: ESortOrder = ESortOrder.DESC
}

@InputType()
export class OffsetPaginationOptionInput {
  @Field(() => Boolean, { nullable: true })
  isGetAll?: boolean
}
