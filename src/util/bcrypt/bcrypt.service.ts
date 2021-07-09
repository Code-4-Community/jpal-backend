import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  hash(raw: string): string {
    if (!raw) throw new Error();
    return bcrypt.hashSync(raw, 10);
  }

  compare(raw: string, hashed: string): boolean {
    if (!raw || !hashed) throw new Error();
    return bcrypt.compareSync(raw, hashed);
  }
}
