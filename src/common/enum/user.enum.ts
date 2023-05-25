import { registerEnumType } from '@nestjs/graphql'

export enum EGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum EPhoneCountryCode {
  VI = '84'
}

export enum EUserType {
  WORKER = 'WORKER',
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

export enum EWorkerRoleType {
  SUPER_WORKER = 'SUPER_WORKER',
  COLLABORATOR = 'COLLABORATOR'
}

export enum EAdminRoleType {
  STAFF = 'STAFF'
}

export enum EScheduleDay {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY'
}

registerEnumType(EGender, {
  name: 'EGender'
})

registerEnumType(EPhoneCountryCode, {
  name: 'EPhoneCountryCode'
})

registerEnumType(EUserType, {
  name: 'EUserType'
})

registerEnumType(EWorkerRoleType, {
  name: 'EWorkerRoleType'
})

registerEnumType(EAdminRoleType, {
  name: 'EAdminRoleType'
})

registerEnumType(EScheduleDay, {
  name: 'EScheduleDay'
})
