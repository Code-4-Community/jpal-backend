import { AuthenticationMiddleware } from './authentication-middleware.service';
import { AuthService } from '../auth.service';
import { User } from '../../users/types/user.entity';
import { Roles } from '../../users/types/roles';

const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  role: Roles.ADMIN,
  password: 'password123',
};

const mockAuthService: Partial<AuthService> = {
  async verifyJwt(jwt: string): Promise<User> {
    if (isNaN(Number(jwt))) throw new Error();
    if (Number(jwt) !== mockUser.id) throw new Error();
    return mockUser;
  },
};

describe('AuthMiddleware', () => {
  const middleware = new AuthenticationMiddleware(
    mockAuthService as AuthService,
  );

  it('authenticates if valid token is given', async () => {
    const req = {
      headers: {
        authorization: 'Bearer 1',
      },
    };
    await middleware.use(req, {}, () => null);
    expect(req['user']).toEqual(mockUser);
  });

  it('fails otherwise', async () => {
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
