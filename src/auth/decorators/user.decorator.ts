import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DefinitelyAuthorizedRequest } from '../types/authorized-request';
import { User } from 'src/user/types/user.entity';

/**
 * Pulls the user object from the request, assuming that it exists.
 */
export const ReqUser = createParamDecorator((data: unknown, ctx: ExecutionContext): User => {
  const request = ctx.switchToHttp().getRequest() as DefinitelyAuthorizedRequest;
  return request.user;
});
