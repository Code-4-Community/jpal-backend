import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * Authenticates a request if it provides an auth token.
 */
@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return next();
    const token = authHeader.split(' ')[1]; // get part of string after space
    if (!token) return next();
    try {
      const user = await this.authService.verifyJwt(token);
      req.user = user;
    } catch (e) {
      console.log(e);
      return next();
    }
    next();
  }
}
