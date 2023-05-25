import { join } from 'path'
import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GraphQLModule as NestGraphQL } from '@nestjs/graphql'
import { DateScalar } from '@/common/scalar/date.scalar'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import { gqlErrorFormat } from '@/errors'
import type { IDefaultConfig } from '@/modules/config/defaultConfig'
import type { ApolloDriverConfig } from '@nestjs/apollo'

@Module({
  imports: [
    NestGraphQL.forRootAsync<ApolloDriverConfig>({
      useFactory: (configService: ConfigService) => {
        const defaultConfig = configService.get<IDefaultConfig>('default')!
        return {
          playground: defaultConfig.env !== 'production',
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          formatError: gqlErrorFormat
        }
      },
      driver: ApolloDriver,
      inject: [ConfigService]
    })
  ],
  providers: [ObjectIdScalar, DateScalar]
})
export class GraphQLModule {}
