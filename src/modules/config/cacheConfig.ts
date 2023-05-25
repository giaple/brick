export interface ICacheConfig {
  host: string
  port: string
  username: string
  pwd: string
}

const cache: ICacheConfig = {
  host: process.env.CACHE_HOST ?? 'localhost',
  port: process.env.CACHE_PORT ?? '6379',
  username: process.env.CACHE_USERNAME ?? 'brick',
  pwd: process.env.CACHE_PWD ?? 'brick'
}

export default () => ({ cache })
