import { Injectable } from '@nestjs/common';
import { Validator } from 'cognito-jwt-token-validator';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class CognitoWrapper {
  private validator: Validator;
  constructor() {
    this.validator = new Validator(
      'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_yoBfrxLnu',
      'j4lc6c2p5s0n09i5kbojfsnlg',
    );
  }

  async validate(jwt: string) {
    return await this.validator.validate(jwt);
  }
}
