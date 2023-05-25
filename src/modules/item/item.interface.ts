import type { IObjectId } from '@/common/interface'
import type { Types } from 'mongoose'

export interface IItem extends IObjectId {
  name: string
  categoryId: Types.ObjectId
  price: number
  minQuantity: number
  maxQuantity?: number
  estTime: number
  imageUrls: string[]
  tags: string[]
  orderCount: number
  subName?: string
  content?: string
  optionIds: Types.ObjectId[]
  isActive: boolean
  deactivatedAt?: Date
  createdAt: Date
  updatedAt: Date
  isDeleted?: boolean
  deletedAt?: Date
}
