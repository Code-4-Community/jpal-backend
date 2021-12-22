import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { List } from 'immutable';
import { AmazonSESWrapper } from './amazon-ses.wrapper';

@Injectable()
export class EmailService {
  private readonly EMAILS_SENT_PER_SECOND = 14;
  private readonly logger = new Logger(EmailService.name);

  /**
   * Emails are placed in a queue and only processed `EMAILS_SENT_PER_SECOND` emails per second
   * in order to avoid rate-limiting.
   *
   * Immutable.js Lists implement an efficient Queue data structure.
   */
  private emailsToSend: List<SendEmailTask>; // Generic Data (Parameterized Types, Dependent Types)

  constructor(private amazonSESWrapper: AmazonSESWrapper) {
    this.emailsToSend = List(); // Array(150_000).fill(sendEmailTaskExample)
  }

  /**
   *
   * @param recipientEmail the email address of the recipient
   * @param subject the subject of the email
   * @param bodyHTML the HTML body of the email
   */
  public queueEmail(recipientEmail: string, subject: string, bodyHTML: string): void {
    this.emailsToSend = this.emailsToSend.push({ recipientEmail, subject, bodyHTML });
  }

  /**
   * Runs every second.
   * Processes the first `this.EMAILS_SENT_PER_SECOND` emails in the queue in order to avoid sending too many emails at once.
   * If the queue is empty, does nothing.
   */
  @Cron(CronExpression.EVERY_SECOND)
  processEmailQueue(): void {
    if (this.emailsToSend.size > 0) {
      this.logger.log(`Processing emails. Queue size: ${this.emailsToSend.size}`);
      this.emailsToSend
        .take(this.EMAILS_SENT_PER_SECOND)
        .forEach((task) => this.processSendEmailTask(task));
      this.emailsToSend = this.emailsToSend.slice(this.EMAILS_SENT_PER_SECOND);
    }
    return;
  }

  /**
   * Processes a single `SendEmailTask` from the task queue. Logs the result of sending the email.
   * If unsuccessful, re-queues the email task to be sent later.
   */
  private async processSendEmailTask({
    recipientEmail,
    subject,
    bodyHTML,
  }: SendEmailTask): Promise<void> {
    try {
      const result = await this.sendEmail(recipientEmail, subject, bodyHTML);
      this.logger.log(`Sent email to ${recipientEmail} with result: ${result}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${recipientEmail}`, error);
      this.queueEmail(recipientEmail, subject, bodyHTML);
    }
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

interface SendEmailTask {
  recipientEmail: string;
  subject: string;
  bodyHTML: string;
}
