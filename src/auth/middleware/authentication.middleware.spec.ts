import { AuthService } from '../auth.service';
import { User } from '../../user/types/user.entity';
import { Role } from '../../user/types/role';
import { AuthenticationMiddleware } from './authentication.middleware';

const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  firstName: 'first',
  lastName: 'last',
  role: Role.ADMIN,
  createdDate: new Date('2023-09-28'),
};

const mockAuthService: Partial<AuthService> = {
  async verifyJwt(jwt: string): Promise<User> {
    if (isNaN(Number(jwt))) throw new Error();
    if (Number(jwt) !== mockUser.id) throw new Error();
    return mockUser;
  },
};

describe('AuthMiddleware', () => {
  const middleware = new AuthenticationMiddleware(mockAuthService as AuthService);

  it('should authenticate if valid token is given', async () => {
    const req = {
      headers: {
        authorization: 'Bearer 1',
      },
    };
    await middleware.use(req, {}, () => null);
    expect(req['user']).toEqual(mockUser);
  });

  it('should fail otherwise', async () => {
    const noAuthToken = {
      headers: {},
    };
    await middleware.use(noAuthToken, {}, () => null);
    expect(noAuthToken).toEqual({
      headers: {},
    });

    const malformedToken = {
      headers: {
        authorization: '1',
      },
    };
    await middleware.use(malformedToken, {}, () => null);
    expect(malformedToken).toEqual({
      headers: {
        authorization: '1',
      },
    });

    const badToken = {
      headers: {
        authorization: 'Bearer 5',
      },
    };
    await middleware.use(badToken, {}, () => null);
    expect(badToken).toEqual({
      headers: {
        authorization: 'Bearer 5',
      },
    });
  });
});
