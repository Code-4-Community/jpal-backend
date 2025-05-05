import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as process from 'process';

@Injectable()
export class AWSS3Service {
  private client: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-2';
    this.bucket = process.env.AWS_BUCKET_NAME;
    if (!this.bucket) {
      throw new Error('AWS_BUCKET_NAME is not defined');
    }
    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
  }

  createLink(youthId: number, assignmentId: number, bucketName: string): string {
    const fileName = `${youthId}-${assignmentId}LOR.pdf`;
    return `https://${bucketName}.s3.us-east-2.amazonaws.com/${fileName}`;
  }

  async upload(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await this.client.send(command);

      return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileName}`;
    } catch (error) {
      throw new Error('File upload to AWS failed: ' + error);
    }
  }
}
