import { registerEnumType } from '@nestjs/graphql'

export enum ESuccessMessage {
  DELETE_SUCCESS = 'delete successfully',
  LOGIN_SUCCESS = 'login successfully',
  LOGOUT_SUCCESS = 'logout successfully'
}

registerEnumType(ESuccessMessage, {
  name: 'ESuccessMessage'
})
