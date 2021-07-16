import { Inject, Injectable } from '@nestjs/common';
import { MAILGUN_CLIENT } from './mailgun-client.factory';
import Mailgun, { Mailgun as MailgunClient } from 'mailgun-js';
import SendTemplateData = Mailgun.messages.SendTemplateData;

@Injectable()
export class MailgunWrapper {
  private client: MailgunClient;

  constructor(@Inject(MAILGUN_CLIENT) client: MailgunClient) {
    this.client = client;
  }

  sendEmails(
    data:
      | Mailgun.messages.SendData
      | SendTemplateData
      | Mailgun.messages.BatchData,
  ) {
    return this.client.messages().send(data);
  }
}
