export interface IDBConfig {
  host: string
  port: string
  username: string
  pwd: string
  dbName: string
  dbScheme: string
  usePort: boolean
}

const db: IDBConfig = {
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT ?? '27017',
  username: process.env.DB_USERNAME ?? 'brick',
  pwd: process.env.DB_PWD ?? 'brick',
  dbName: process.env.DB_NAME ?? 'brick',
  dbScheme: process.env.DB_SCHEME ?? 'mongodb://',
  usePort: Boolean(process.env.DB_USE_PORT) ?? true
}

export default () => ({ db })
