import { Injectable } from '@nestjs/common';
import { BcryptWrapper } from './bcrypt.wrapper';

@Injectable()
export class BcryptService {
  constructor(private bcryptWrapper: BcryptWrapper) {}

  hash(raw: string): string {
    if (!raw) throw new Error();
    return this.bcryptWrapper.hashSync(raw, 10);
  }

  compare(raw: string, hashed: string): boolean {
    if (!raw || !hashed) throw new Error();
    return this.bcryptWrapper.compareSync(raw, hashed);
  }
}
