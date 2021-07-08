import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * Middleware to determine if the request is associated with a User.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return next();
    const token = authHeader.split(' ')[1];
    if (!token) return next();
    try {
      const user = await this.authService.verifyJwt(token);
      req.user = user;
    } catch (e) {
      return next();
    }
    next();
  }
}
