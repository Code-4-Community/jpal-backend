import { Inject, Injectable } from '@nestjs/common';
import { SES as AmazonSESClient } from 'aws-sdk';
import { AMAZON_SES_CLIENT } from './amazon-ses-client.factory';

@Injectable()
export class AmazonSESWrapper {
  private client: AmazonSESClient;

  constructor(@Inject(AMAZON_SES_CLIENT) client: AmazonSESClient) {
    this.client = client;
  }

  /**
   * Sends an email via Amazon SES.
   *
   * @param recipientEmails the email addresses of the recipients
   * @param subject the subject of the email
   * @param bodyHtml the HTML body of the email
   * @resolves if the email was sent successfully
   * @rejects if the email was not sent successfully
   */
  async sendEmails(recipientEmails: string[], subject: string, bodyHtml: string): Promise<unknown> {
    const params = {
      Source: '<email address you verified>',
      Destination: {
        ToAddresses: recipientEmails,
      },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: bodyHtml,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
    };

    return await this.client.sendEmail(params).promise();
  }
}
