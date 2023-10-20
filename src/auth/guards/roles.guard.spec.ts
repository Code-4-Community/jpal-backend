import { ExecutionContext, Type } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { User } from '../../user/types/user.entity';
import RolesGuard from './roles.guard';
import { Role } from '../../user/types/role';

const mockUser = (role: Role): User => ({
  id: 1,
  email: 'test@test.com',
  firstName: 'first',
  lastName: 'last',
  role,
  createdDate: new Date('2023-09-28'),
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
    const Guard: Type = RolesGuard([Role.ADMIN]);
    const context = mockContext(undefined);
    expect(new Guard().canActivate(context as ExecutionContext)).toBe(false);
  });

  it('should reject if role not included', () => {
    const Guard: Type = RolesGuard([Role.RESEARCHER]);
    const context = mockContext(mockUser(Role.ADMIN));
    expect(new Guard().canActivate(context as ExecutionContext)).toBe(false);
  });

  it('should accept if role is included', () => {
    const Guard: Type = RolesGuard([Role.RESEARCHER]);
    const context = mockContext(mockUser(Role.RESEARCHER));
    expect(new Guard().canActivate(context as ExecutionContext)).toBe(true);
  });
});
