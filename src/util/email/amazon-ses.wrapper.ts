import { Inject, Injectable } from '@nestjs/common';
import { SES as AmazonSESClient } from 'aws-sdk';
import * as dotenv from 'dotenv';
import * as mimemessage from 'mimemessage'; // No Typescript definitions, see docs
import * as pdf from 'pdfjs';
import * as TimesNewRoman from 'pdfjs/font/Times-Roman';
import { AMAZON_SES_CLIENT } from './amazon-ses-client.factory';
dotenv.config();

const test = new pdf.Document({
  font: TimesNewRoman,
  padding: 10,
});
test.text('Hello World!');

@Injectable()
export class AmazonSESWrapper {
  private client: AmazonSESClient;

  /**
   * @param client injected from `amazon-ses-client.factory.ts`
   */
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
    const params: AmazonSESClient.SendEmailRequest = {
      Source: process.env.AWS_SES_SENDER_EMAIL,
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

  async sendEmailWithPdfAttachment(
    recipientEmail: string,
    subject: string,
    bodyHtml: string,
    pdfAttachment: pdf.Document = test,
  ): Promise<unknown> {
    const FILE_NAME = 'Letter_of_Recommendation'; //.pdf
    const base64EncodedPdfAttachment = await pdfAttachment
      .asBuffer()
      .then((b) => b.toString('base64'));
    const mailContent = mimemessage.factory({ contentType: 'multipart/mixed', body: [] });

    mailContent.header('From', process.env.AWS_SES_SENDER_EMAIL);
    mailContent.header('To', recipientEmail);
    mailContent.header('Subject', subject);

    const htmlEntity = mimemessage.factory({
      contentType: 'text/html;charset=utf-8',
      body: bodyHtml,
    });

    mailContent.body.push(htmlEntity);

    const attachmentEntity = mimemessage.factory({
      contentType: 'application/pdf',
      contentTransferEncoding: 'base64',
      body: base64EncodedPdfAttachment,
    });
    attachmentEntity.header('Content-Disposition', `attachment ;filename="${FILE_NAME}.pdf"`);

    mailContent.body.push(attachmentEntity);

    return await this.client
      .sendRawEmail({
        RawMessage: { Data: mailContent.toString() },
      })
      .promise();
  }
}
