import { Injectable } from '@nestjs/common';
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
        [],
        null,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve();
        },
      );
    });
  }

  login(email: string, password: string): Promise<string> {
    const authDetails = this.cognitoWrapper.createAuthenticationDetails({
      Username: email,
      Password: password,
    });
    const cognitoUser = this.cognitoWrapper.newCognitoUser({
      Username: email,
    });
    return new Promise((resolve, reject) => {
      this.cognitoWrapper.authenticateUser(cognitoUser, authDetails, {
        onSuccess: (session) => {
          resolve('');
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  verifyToken(token: string): string {
    return '';
  }
}
