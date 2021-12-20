import { Injectable } from '@nestjs/common';
import { AmazonSESWrapper } from './amazon-ses.wrapper';

@Injectable()
export class EmailService {
  constructor(private amazonSESWrapper: AmazonSESWrapper) {}

  /**
   * Sends an email.
   *
   * @param recipientEmails the email addresses of the recipients
   * @param subject the subject of the email
   * @param bodyHtml the HTML body of the email
   * @resolves if the email was sent successfully
   * @rejects if the email was not sent successfully
   */
  public async sendEmails(
    recipientEmails: string[],
    subject: string,
    bodyHTML: string,
  ): Promise<unknown> {
    return this.amazonSESWrapper.sendEmails(recipientEmails, subject, bodyHTML);
  }
}
