import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { API_KEY_NAME } from '@/common/constant'

@Injectable()
export class ApiKeyGuard extends AuthGuard(API_KEY_NAME) {}
