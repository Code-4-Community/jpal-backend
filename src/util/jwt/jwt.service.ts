import { Injectable } from '@nestjs/common';
import * as JWT from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { JwtPayload } from './types/jwt-payload';

dotenv.config();

const secret = process.env.JWT_SECRET;

@Injectable()
export class JwtService {
  verify(jwt: string): number {
    if (!jwt) throw new Error();
    const payload = JWT.verify(jwt, secret) as JwtPayload;
    return payload.userId;
  }

  sign(userId: number): string {
    if (!userId) throw new Error();
    const payload: JwtPayload = {
      userId,
    };
    return JWT.sign(payload, secret, {
      expiresIn: '1h',
    });
  }
}
