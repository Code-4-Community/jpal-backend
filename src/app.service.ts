import { Injectable } from '@nestjs/common';

// Keeping this for now because its a good example for swagger and contract testing
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello, World!';
  }
}
