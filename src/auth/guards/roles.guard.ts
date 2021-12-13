import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '../../user/types/role';
import { PossiblyAuthorizedRequest } from '../types/authorized-request';

/**
 * Returns a Guard that only allows Users with the given roles to access the route.
 * @param roles user roles that can access the route
 * @constructor
 */
const RolesGuard = (roles: Role[]): any => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const req = context.switchToHttp().getRequest<PossiblyAuthorizedRequest>();
      if (!req.user) return false;
      return roles.includes(req.user.role);
    }
  }

  const guard = mixin(RoleGuardMixin);
  return guard;
};

export default RolesGuard;
