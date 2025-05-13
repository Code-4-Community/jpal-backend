import { Injectable } from '@nestjs/common';
import { Validator } from 'cognito-jwt-token-validator';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class CognitoWrapper {
  private validator: Validator;
  constructor() {
    this.validator = new Validator(
      'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_tngpF4rcu',
      '4evkovhojuusc3nrim7ivulec7',
    );
  }

  async validate(jwt: string) {
    return await this.validator.validate(jwt);
  }
}
