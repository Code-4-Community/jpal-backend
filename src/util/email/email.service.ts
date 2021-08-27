import { Injectable } from '@nestjs/common';
import { MailgunWrapper } from './mailgun.wrapper';

@Injectable()
export class EmailService {
  constructor(private mailgunWrapper: MailgunWrapper) {}

  private sendEmails(to: string[], subject: string, text: string) {
    return this.mailgunWrapper.sendEmails({
      from: '',
      to,
      subject,
      text,
    });
  }
}
