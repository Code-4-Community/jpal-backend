import { Provider } from '@nestjs/common';
import * as Cognito from 'amazon-cognito-identity-js';
import * as dotenv from 'dotenv';
export const USER_POOL = 'USER_POOL';

dotenv.config();

export const userPoolFactory: Provider = {
  provide: USER_POOL,
  useFactory: () => {
    const poolData = {
      UserPoolId: process.env.AWS_USER_POOL_ID,
      ClientId: process.env.AWS_CLIENT_ID,
    };
    return new Cognito.CognitoUserPool(poolData);
  },
};
