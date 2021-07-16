import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptWrapper {
  hashSync(data: string | Buffer, saltOrRounds: string | number): string {
    return bcrypt.hashSync(data, saltOrRounds);
  }

  compareSync(data: string | Buffer, encrypted: string): boolean {
    return bcrypt.compareSync(data, encrypted);
  }
}
