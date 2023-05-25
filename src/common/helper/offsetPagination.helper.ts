import { isEmpty } from 'lodash'
import type {
  OffsetPaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import type { IOffsetPaginatedType } from '@/common/interface/offsetPagination.interface'
import type { FilterQuery, Model } from 'mongoose'

export const buildOffsetSearch =
  <T, U extends Record<string, any> | undefined = undefined>(
    model: Model<T>,
    queryBuildFunc?: (queryArgs: U) => FilterQuery<U>
  ) =>
  async (
    paginationArgs: OffsetPaginationInput,
    queryArgs?: U,
    optionArgs?: OffsetPaginationOptionInput
  ): Promise<IOffsetPaginatedType<T>> => {
    const query = queryBuildFunc && !isEmpty(queryArgs) ? queryBuildFunc(queryArgs) : {}

    let results: T[] = []

    if (optionArgs?.isGetAll) {
      results = await model.find(query).sort({ createdAt: paginationArgs.sortOrder })
      return {
        nodes: results,
        totalCount: await model.countDocuments()
      }
    }

    results = await model
      .find(query)
      .skip((paginationArgs.pageNumber - 1) * paginationArgs.limit)
      .limit(paginationArgs.limit)
      .sort({ createdAt: paginationArgs.sortOrder })

    return {
      nodes: results,
      totalCount: await model.countDocuments(),
      pageNumber: paginationArgs.pageNumber,
      pageSize: paginationArgs.limit
    }
  }
