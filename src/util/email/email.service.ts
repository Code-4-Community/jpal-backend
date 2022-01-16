import { Injectable, Logger } from '@nestjs/common';
import Bottleneck from 'bottleneck';
import { AmazonSESWrapper } from './amazon-ses.wrapper';

@Injectable()
export class EmailService {
  private readonly EMAILS_SENT_PER_SECOND = 14;
  private readonly logger = new Logger(EmailService.name);
  private readonly limiter: Bottleneck;

  constructor(private amazonSESWrapper: AmazonSESWrapper) {
    this.limiter = new Bottleneck({
      minTime: Math.ceil(1000 / this.EMAILS_SENT_PER_SECOND),
      maxConcurrent: 1,
    });
  }

  /**
   * Queues the email to be sent. Emails are rate limit and sent at a rate of approximately 14 per second.
   * Emails are never guaranteed to be delivered. Failures are logged.
   *
   * @param recipientEmail the email address of the recipient
   * @param subject the subject of the email
   * @param bodyHTML the HTML body of the email
   */
  public async queueEmail(
    recipientEmail: string,
    subject: string,
    bodyHTML: string,
  ): Promise<void> {
    await this.limiter
      .schedule(() => this.sendEmail(recipientEmail, subject, bodyHTML))
      .catch((err) => this.logger.error(err));
  }

  /**
   * Sends an email.
   *
   * @param recipientEmail the email address of the recipients
   * @param subject the subject of the email
   * @param bodyHtml the HTML body of the email
   * @resolves if the email was sent successfully
   * @rejects if the email was not sent successfully
   */
  private async sendEmail(
    recipientEmail: string,
    subject: string,
    bodyHTML: string,
  ): Promise<unknown> {
    return this.amazonSESWrapper.sendEmails([recipientEmail], subject, bodyHTML);
  }
}
