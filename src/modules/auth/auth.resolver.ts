import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { SuccessRes } from '@/common/model'
import { User } from '@/decorators/user.decorator'
import {
  UserLogoutInput,
  UserPhoneLoginInput,
  UserRegenerateRefreshTokenInput,
  UserVerifyPhoneOTPInput
} from './auth.dto'
import { IRequestedUser } from './auth.interface'
import { UserLoginModel, UserTokensModel } from './auth.model'
import { AuthService } from './auth.service'

// Just Description
// @UserTypes(EUserType.ADMIN, EUserType.WORKER)
// @UseGuards(JwtGuard)
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SuccessRes, { name: 'phoneLogin' })
  async phoneLogin(@Args('input', { type: () => UserPhoneLoginInput }) input: UserPhoneLoginInput) {
    return await this.authService.phoneLogin(input)
  }

  @Mutation(() => UserLoginModel, { name: 'verifyOtpCode' })
  async verifyOtpCode(
    @Args('input', { type: () => UserVerifyPhoneOTPInput }) input: UserVerifyPhoneOTPInput
  ) {
    return await this.authService.verifyOtpCode(input)
  }

  @Mutation(() => SuccessRes, { name: 'logout' })
  async logout(
    @User() user: IRequestedUser,
    @Args('input', { type: () => UserLogoutInput }) input: UserLogoutInput
  ) {
    return await this.authService.logout(user, input)
  }

  @Mutation(() => UserTokensModel, { name: 'regenerateRefreshToken' })
  async regenerateRefreshToken(
    @User() user: IRequestedUser,
    @Args('input', { type: () => UserRegenerateRefreshTokenInput })
    input: UserRegenerateRefreshTokenInput
  ) {
    return await this.authService.regenerateRefreshToken(user, input)
  }
}
