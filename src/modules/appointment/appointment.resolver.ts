import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Types } from 'mongoose'
import {
  OffsetPaginationInput,
  PaginationInput,
  OffsetPaginationOptionInput
} from '@/common/dto/pagination.dto'
import { ObjectIdScalar } from '@/common/scalar/objectId.scalar'
import {
  AppointmentGetAvailableSlotsByDateInput,
  AppointmentSearchQueryInput,
  AppointmentUpdateInput
} from './appointment.dto'
import {
  OffsetPaginatedAppointments,
  PaginatedAppointments,
  AppointmentModel
} from './appointment.model'
import { AppointmentService } from './appointment.service'

@Resolver(() => AppointmentModel)
export class AppointmentResolver {
  constructor(private readonly service: AppointmentService) {}

  @Mutation(() => AppointmentModel, { name: 'updateAppointmentById' })
  async updateById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId,
    @Args('input', { type: () => AppointmentUpdateInput }) input: AppointmentUpdateInput
  ) {
    return await this.service.updateById(id, input)
  }

  @Query(() => AppointmentModel, { name: 'findAppointmentById' })
  async findById(
    @Args('id', { type: () => ObjectIdScalar }) id: Types.ObjectId
  ): Promise<AppointmentModel> {
    return await this.service.findById(id)
  }

  @Query(() => PaginatedAppointments, { name: 'lazyAppointmentSearch' })
  async lazySearch(
    @Args('input', { type: () => PaginationInput }) input: PaginationInput
  ): Promise<PaginatedAppointments> {
    return await this.service.lazySearch(input)
  }

  @Query(() => OffsetPaginatedAppointments, { name: 'appointmentSearch' })
  async search(
    @Args('paginationInput', { type: () => OffsetPaginationInput })
    paginationInput: OffsetPaginationInput,
    @Args('queryInput', { type: () => AppointmentSearchQueryInput, nullable: true })
    queryInput: AppointmentSearchQueryInput,
    @Args('optionInput', { type: () => OffsetPaginationOptionInput, nullable: true })
    optionInput: OffsetPaginationOptionInput
  ): Promise<OffsetPaginatedAppointments> {
    return await this.service.search(paginationInput, queryInput, optionInput)
  }

  @Query(() => [Int], { name: 'getAppointmentAvailableSlots' })
  async getAvailableSlots(
    @Args('input', { type: () => AppointmentGetAvailableSlotsByDateInput })
    input: AppointmentGetAvailableSlotsByDateInput
  ) {
    return await this.service.getAvailableSlots(input)
  }
}
