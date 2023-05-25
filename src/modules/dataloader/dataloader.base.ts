import DataLoader from 'dataloader'
import type { Types } from 'mongoose'

/**
 * Provides common functionality to load entities with a data loader.
 *
 * Enables the use of an "Args" object to set filters and others when calling "loadMany()".
 *
 * ATTENTION: Make sure to create a new instance of BaseLoader for each request,
 * so the instance can be garbage collected. This will help to avoid memory lead.
 */
export abstract class BaseLoader<
  T extends { _id: Types.ObjectId },
  U extends { ids: Types.ObjectId[] }
> {
  // This map is never cleared - to prevent a memory leak,
  // set the injection scope of this class to Scope.Request!
  private readonly loaders: Record<string, DataLoader<Types.ObjectId, T | null>>

  constructor() {
    this.loaders = {}
  }

  protected abstract findMany(queries?: U): Promise<T[]>

  private _getLoader(queries: U = Object.create(null)) {
    const key = JSON.stringify(queries)

    if (!(key in this.loaders)) {
      this.loaders[key] = new DataLoader(this._createBatchFunc(queries), {
        cache: false
      })
    }
    return this.loaders[key]
  }

  private _createBatchFunc(queries?: U) {
    return async (keys: readonly Types.ObjectId[]) => {
      const entities = await this.findMany(queries)
      return keys.map(
        (key) => entities.find((entity) => entity._id.toString() === key.toString()) ?? null
      )
    }
  }

  public async loadMany(ids: Types.ObjectId[], queries?: U) {
    return await this._getLoader(queries).loadMany(ids)
  }

  public async load(id: Types.ObjectId) {
    return await this._getLoader().load(id)
  }
}
