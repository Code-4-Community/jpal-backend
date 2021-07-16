import { Provider } from '@nestjs/common';

export const USER_POOL = 'USER_POOL';

export const userPoolFactory: Provider = {
  provide: USER_POOL,
  useFactory: () => {
    const poolData = {
      UserPoolId: process.env.AWS_USER_POOL_ID,
      ClientId: process.env.AWS_CLIENT_ID,
    };
    // return new Cognito.CognitoUserPool(poolData);
    // revert once we have credentials
    return null;
  },
};
