import { ETargetType } from './enum/upload.enum'

export const VI_PHONE_REGEX =
  /^0?((3([2-9]))|(5([1-9]))|(7([0-9]))|(8([1-689]))|(9([0-9])))([0-9]{7})$/

export const FILE_PATH = {
  TEMP: {
    path: 'Temp/'
  },
  [ETargetType.CATEGORY]: {
    path: 'CategoryList/'
  },
  [ETargetType.ITEM]: {
    path: 'ItemList/'
  },
  [ETargetType.OPTION]: {
    path: 'OptionList/'
  },
  [ETargetType.JOB]: {
    path: 'JobList/'
  },
  [ETargetType.WORKER]: {
    path: 'WorkerList/'
  },
  [ETargetType.CUSTOMER]: {
    path: 'CustomerList/'
  }
}

export const API_KEY_NAME = process.env.API_KEY_NAME ?? 'nook-key'
export const JWT_KEY_NAME = process.env.JWT_KEY_NAME ?? 'Nook'
