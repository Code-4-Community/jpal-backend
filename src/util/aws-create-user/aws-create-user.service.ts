import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import 'cross-fetch/polyfill';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AwsCreateUserService {
  private cognitoClient: AWS.CognitoIdentityServiceProvider;
  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_USER_POOL_REGION,
    });

    this.cognitoClient = new AWS.CognitoIdentityServiceProvider({
      apiVersion: '2016-04-19',
      region: process.env.AWS_USER_POOL_REGION,
    });
  }

  public async adminCreateUser(
    email: string,
  ): Promise<AWS.CognitoIdentityServiceProvider.UserType> {
    const poolData = {
      UserPoolId: process.env.AWS_USER_POOL_ID,
      Username: email,
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
    };
    return new Promise((resolve, reject) => {
      this.cognitoClient.adminCreateUser(poolData, (error, data) => {
        if (error) {
          reject(error);
        } else {
          console.log(data);
          resolve(data.User);
        }
      });
    });
  }
}
