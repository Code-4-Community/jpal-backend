import { Provider } from '@nestjs/common';
import * as AWS from 'aws-sdk';

export const AMAZON_SES_CLIENT = 'AMAZON_SES_CLIENT';

/**
 * Factory that produces a new instance of the Amazon SES client.
 * Used to send emails via Amazon SES.
 */
export const amazonSESClientFactory: Provider = {
  provide: AMAZON_SES_CLIENT,
  useFactory: () => {
    const SES_CONFIG = {
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
      region: process.env.AWS_SES_REGION,
    };

    return new AWS.SES(SES_CONFIG);
  },
};
