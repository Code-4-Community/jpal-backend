import { Inject, Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  IAuthenticationCallback,
  IAuthenticationDetailsData,
  ICognitoUserData,
  ISignUpResult,
  NodeCallback,
} from 'amazon-cognito-identity-js';
import * as Cognito from 'amazon-cognito-identity-js';
import { USER_POOL } from './user-pool.factory';

@Injectable()
export class CognitoWrapper {
  private readonly userPool: CognitoUserPool;

  constructor(@Inject(USER_POOL) userPool: CognitoUserPool) {
    this.userPool = userPool;
  }

  register(
    username: string,
    password: string,
    userAttributes: CognitoUserAttribute[],
    validationData: CognitoUserAttribute[],
    callback: NodeCallback<Error, ISignUpResult>,
  ): void {
    return this.userPool.signUp(
      username,
      password,
      userAttributes,
      validationData,
      callback,
    );
  }

  createAuthenticationDetails(
    details: IAuthenticationDetailsData,
  ): AuthenticationDetails {
    return new AuthenticationDetails(details);
  }

  newCognitoUser(data: Omit<ICognitoUserData, 'Pool'>): CognitoUser {
    return new CognitoUser({
      ...data,
      Pool: this.userPool,
    });
  }

  authenticateUser(
    user: CognitoUser,
    authDetails: AuthenticationDetails,
    callbacks: IAuthenticationCallback,
  ): void {
    return user.authenticateUser(authDetails, callbacks);
  }
}
