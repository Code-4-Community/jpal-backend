import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  hash(raw: string): string {
    return bcrypt.hashSync(raw, 10);
  }

  compare(raw: string, hashed: string): boolean {
    return bcrypt.compareSync(raw, hashed);
  }
}
