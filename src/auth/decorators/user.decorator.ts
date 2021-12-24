import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DefinitelyAuthorizedRequest } from '../types/authorized-request';

/**
 * Pulls the user object from the request, assuming that it exists.
 */
export const ReqUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as DefinitelyAuthorizedRequest;
  return request.user;
});
