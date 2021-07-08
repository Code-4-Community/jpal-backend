import { Injectable } from '@nestjs/common';
import * as mailgun from 'mailgun-js';
import * as dotenv from 'dotenv';

dotenv.config();

const client = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

@Injectable()
export class EmailService {
  private sendEmail(to: string[], subject: string, text: string) {
    return client.messages().send({
      from: '',
      to,
      subject,
      text,
    });
  }
}
