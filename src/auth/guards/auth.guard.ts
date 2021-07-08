import {
  CanActivate,
  ExecutionContext,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Roles } from '../../users/types/roles';
import { AuthorizedRequest } from '../types/authorized-request';

// TODO: fix return type
export const RoleGuard = (roles: Roles[]): any => {
  class RoleGuardMixin implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const req = context.switchToHttp().getRequest() as AuthorizedRequest;
      if (!req.user) throw new UnauthorizedException();
      return roles.includes(req.user.role);
    }
  }

  const guard = mixin(RoleGuardMixin);
  return guard;
};
