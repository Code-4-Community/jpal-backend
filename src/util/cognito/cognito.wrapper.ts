import { Injectable } from '@nestjs/common';
import { Validator } from 'cognito-jwt-token-validator';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class CognitoWrapper {
  private validator: Validator;
  constructor() {
    this.validator = new Validator(
      'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_zG2SfHpXC',
      '9v01t6v5p685510n0q5b6i9co',
    );
  }

  async validate(jwt: string) {
    return await this.validator.validate(jwt);
  }
}
