import { registerEnumType } from '@nestjs/graphql'

export enum ESortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export enum EDateFormat {
  AVAILABLE_SLOT = 'YYYY-MM-DD'
}

registerEnumType(ESortOrder, {
  name: 'ESortOrder'
})
