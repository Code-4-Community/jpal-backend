import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from '../../users/types/roles';
import RolesGuard from '../guards/roles.guard';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

/**
 * Applies all necessary decorators to protect a route, including guards and OpenAPI metadata.
 * @param roles the user roles that should be able to access the route
 * @constructor
 */
export function Auth(...roles: Roles[]) {
  return applyDecorators(
    UseGuards(RolesGuard(roles)),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Unauthorized (not authenticated or role' + ' insufficient)',
    }),
  );
}
