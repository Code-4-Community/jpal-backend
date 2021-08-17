import { Injectable } from '@nestjs/common';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import 'cross-fetch/polyfill';
import { CognitoWrapper } from './cognito.wrapper';

@Injectable()
export class CognitoService {
  constructor(private cognitoWrapper: CognitoWrapper) {}

  register(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      return this.cognitoWrapper.register(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: 'email',
            Value: email,
          }),
        ],
        null,
        (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        },
      );
    });
  }

  verifyToken(token: string): string {
    // TODO: Sunday: use verification logic from Wednesday
    return '';
  }
}

// export const MockCognitoService: Partial<CognitoService> = {
//   adminCreateUser: async () : Promise<void> => {
//     return;
//   },
//   verifyToken: async (token: string): Promise<string> => {
//     return 'idk';
//   }
// }
