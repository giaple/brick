interface IJwtSignOptions {
  expiresIn: string | number | undefined
  issuer: string
}

interface IJwtConfig {
  secret: string
  signOptions: IJwtSignOptions
}

export interface IAuthConfig {
  apiKey: string
  jwt: IJwtConfig
  verifyTokenExpiresIn: number
  refreshTokenExpiresIn: number
}

const auth: IAuthConfig = {
  apiKey:
    process.env.API_KEY ??
    'i4pujn40eXBjZteS6uInLPU4cOwoVCJTwqtc88hW6YeKeMznOtPvQj34R4xCtJdpPW2R04UVakp4upHqFwvg2Ta8IyglALJ8fb6c4vXIVkQzwt7M3O1u9RObJt0rVu66',
  jwt: {
    secret:
      process.env.JWT_SECRET_KEY ??
      'i4pujn40eXBjZteS6uInLPU4cOwoVCJTwqtc88hW6YeKeMznOtPvQj34R4xCtJdpPW2R04UVakp4upHqFwvg2Ta8IyglALJ8fb6c4vXIVkQzwt7M3O1u9RObJt0rVu66',
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN ?? '30d',
      issuer: process.env.JWT_ISSUER ?? 'NOOK'
    }
  },
  verifyTokenExpiresIn: parseInt(process.env.VERIFY_TOKEN_EXPIRES_IN ?? '180', 10),
  refreshTokenExpiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN ?? '2592000', 10)
}

export default () => ({ auth })
