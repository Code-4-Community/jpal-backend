import * as JWT from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { JwtType } from './jwt.type';

dotenv.config();

const secret = process.env.JWT_SECRET;

const verify = (jwt: string): number => {
  const payload = JWT.verify(jwt, secret) as JwtType;
  if (!payload.userId) throw new Error();
  return payload.userId;
};

const sign = (userId: number): string => {
  const payload: JwtType = {
    userId,
  };
  return JWT.sign(payload, secret, {
    expiresIn: '1h',
  });
};

export const JwtUtils = {
  verify,
  sign,
};
