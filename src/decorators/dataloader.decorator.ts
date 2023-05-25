import { InternalServerErrorException, createParamDecorator } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { DataLoaderService } from '@/modules/dataloader/dataloader.service'
import type { ExecutionContext } from '@nestjs/common'

export const DATA_LOADER_CONTEXT_KEY: string = 'DATA_LOADER_CONTEXT'

export const DataLoader = createParamDecorator(
  async (type: keyof DataLoaderService['_loaders'], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext()

    if (ctx[DATA_LOADER_CONTEXT_KEY] === undefined) {
      throw new InternalServerErrorException(
        `You should provide interceptor DataLoaderInterceptor globaly with ${APP_INTERCEPTOR}`
      )
    }

    const DataLoaderService = (await ctx[
      DATA_LOADER_CONTEXT_KEY
    ].getLoaderFactory()) as DataLoaderService

    return DataLoaderService.getDataLoader(type)
  }
)
