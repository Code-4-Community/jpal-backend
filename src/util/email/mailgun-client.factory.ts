import { Provider } from '@nestjs/common';
import * as mailgun from 'mailgun-js';

export const MAILGUN_CLIENT = 'MAILGUN_CLIENT';

export const mailgunClientFactory: Provider = {
  provide: MAILGUN_CLIENT,
  useFactory: () => {
    return mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    });
  },
};
