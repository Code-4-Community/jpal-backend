import { ExecutionContext, Type } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { User } from '../../users/types/user.entity';
import RolesGuard from './roles.guard';
import { Roles } from '../../users/types/roles';

const mockUser = (role: Roles): User => ({
  id: 1,
  email: 'test@test.com',
  role,
  isClaimed: true,
});

const mockContext = (user?: User): Partial<ExecutionContext> => ({
  switchToHttp(): HttpArgumentsHost {
    return {
      getRequest(): any {
        return {
          user,
        };
      },
      getNext<T = any>(): T {
        return null;
      },
      getResponse<T = any>(): T {
        return null;
      },
    };
  },
});

describe('RolesGuard', () => {
  it('should reject if no user', () => {
    const Guard: Type = RolesGuard([Roles.ADMIN]);
    const context = mockContext(undefined);
    expect(new Guard().canActivate(context as ExecutionContext)).toBe(false);
  });

  it('should reject if role not included', () => {
    const Guard: Type = RolesGuard([Roles.RESEARCHER]);
    const context = mockContext(mockUser(Roles.ADMIN));
    expect(new Guard().canActivate(context as ExecutionContext)).toBe(false);
  });

  it('should accept if role is included', () => {
    const Guard: Type = RolesGuard([Roles.RESEARCHER]);
    const context = mockContext(mockUser(Roles.RESEARCHER));
    expect(new Guard().canActivate(context as ExecutionContext)).toBe(true);
  });
});
