import { Injectable } from '@nestjs/common';
import { JwtPayload } from './types/jwt-payload';
import * as JWT from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

@Injectable()
export class JwtWrapper {
  verify(token: string, options?: JWT.VerifyOptions): JwtPayload {
    return JWT.verify(token, secret, options) as JwtPayload;
  }

  sign(payload: JwtPayload, options?: JWT.SignOptions): string {
    return JWT.sign(payload, secret, options);
  }
}
