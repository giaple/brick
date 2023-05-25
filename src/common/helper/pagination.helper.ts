import { Types } from 'mongoose'
import type { PaginationInput } from '@/common/dto/pagination.dto'
import { ESortOrder } from '@/common/enum'
import type { INode, IPaginatedType } from '@/common/interface/pagination.interface'
import type { FilterQuery, Model } from 'mongoose'

export const idToCursor = (id: Types.ObjectId) =>
  Buffer.from(id.toString(), 'hex').toString('base64')

export const cursorToId = (cursor: string) =>
  new Types.ObjectId(Buffer.from(cursor, 'base64').toString('hex'))

export const buildLazySearch =
  <T extends INode>(model: Model<T>) =>
  async (paginationArgs: PaginationInput): Promise<IPaginatedType<T>> => {
    let paginationQuery: FilterQuery<INode> = {}
    if (paginationArgs.after) {
      const ops = paginationArgs.sortOrder === ESortOrder.ASC ? '$gt' : '$lt'
      paginationQuery = { _id: { [ops]: cursorToId(paginationArgs.after) } }
    } else if (paginationArgs.before) {
      const ops = paginationArgs.sortOrder === ESortOrder.ASC ? '$lt' : '$gt'
      paginationQuery = { _id: { [ops]: cursorToId(paginationArgs.before) } }
    }

    const sortOrder = paginationArgs.sortOrder

    const cursor = model
      .find(paginationQuery)
      .sort({ _id: sortOrder })
      .limit(paginationArgs.limit + 1)
      .cursor()

    const entries: T[] = []
    let entry = await cursor.next()
    while (entry) {
      entries.push(entry)
      entry = await cursor.next()
    }

    let hasNextPage = false

    if (entries.length > paginationArgs.limit) {
      hasNextPage = true
      paginationArgs.before ? entries.shift() : entries.pop()
    }

    const edges = entries.map((entry: T) => ({
      cursor: idToCursor(entry._id),
      node: entry
    }))

    return {
      edges,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      hasNextPage
    }
  }
