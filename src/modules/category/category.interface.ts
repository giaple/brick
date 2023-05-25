import type { IObjectId } from '@/common/interface'
import type { Types } from 'mongoose'

export interface ICategorySchedule {
  startTime: number
  endTime: number
  gap: number
}
export interface ICategory extends IObjectId {
  name: string
  parentId?: Types.ObjectId
  ancestorIds: Types.ObjectId[]
  description: string
  code: string
  imageUrls: string[]
  isActive: boolean
  deactivatedAt?: Date
  createdAt: Date
  updatedAt: Date
  isDeleted?: boolean
  deletedAt?: Date
  schedule: ICategorySchedule
}
