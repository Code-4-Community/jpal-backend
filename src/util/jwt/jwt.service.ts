import { Injectable } from '@nestjs/common';
import { JwtPayload } from './types/jwt-payload';
import { JwtWrapper } from './jwt.wrapper';

@Injectable()
export class JwtService {
  constructor(private jwtWrapper: JwtWrapper) {}

  verify(jwt: string): number {
    if (!jwt) throw new Error();
    const payload = this.jwtWrapper.verify(jwt);
    return payload.userId;
  }

  sign(userId: number): string {
    if (!userId) throw new Error();
    const payload: JwtPayload = {
      userId,
    };
    return this.jwtWrapper.sign(payload, {
      expiresIn: '1h',
    });
  }
}
