export interface IDefaultConfig {
  env: string
  port: number
}

const config: IDefaultConfig = {
  env: process.env.NODE_ENV ?? 'local',
  port: parseInt(process.env.PORT ?? '3000', 10)
}

export default () => ({ default: config })
