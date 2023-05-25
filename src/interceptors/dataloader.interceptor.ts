import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ContextIdFactory, ModuleRef } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { DATA_LOADER_CONTEXT_KEY } from '@/decorators/dataloader.decorator'
import { DataLoaderService } from '@/modules/dataloader/dataloader.service'
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { Observable } from 'rxjs'

@Injectable()
export class DataLoaderInterceptor implements NestInterceptor {
  constructor(private readonly moduleRef: ModuleRef) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const graphqlExecutionContext = GqlExecutionContext.create(context)
    const ctx = graphqlExecutionContext.getContext()

    if (ctx[DATA_LOADER_CONTEXT_KEY] === undefined) {
      ctx[DATA_LOADER_CONTEXT_KEY] = {
        contextId: ContextIdFactory.create(),
        getLoaderFactory: async (): Promise<DataLoaderService> => {
          if (ctx.myLoaderFactory === undefined) {
            try {
              ctx.myLoaderFactory = (async () =>
                await this.moduleRef.resolve<DataLoaderService>(
                  DataLoaderService,
                  ctx[DATA_LOADER_CONTEXT_KEY].contextId,
                  { strict: false }
                ))()
            } catch (e) {
              throw new InternalServerErrorException(e, 'Failed to resolve loader')
            }
          }
          return ctx.myLoaderFactory
        }
      }
    }
    return next.handle()
  }
}
