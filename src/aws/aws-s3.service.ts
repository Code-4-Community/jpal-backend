import { Injectable, Logger } from '@nestjs/common';
import {
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import * as process from 'process';
import { s3Buckets } from './types/s3Buckets';

@Injectable()
export class AWSS3Service {
  private readonly logger = new Logger(AWSS3Service.name);

  private client: S3Client;
  private readonly lettersBucket: string;
  private readonly imagesBucket: string;
  private readonly region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-2';
    this.lettersBucket = process.env.AWS_LETTERS_BUCKET_NAME;
    this.imagesBucket = process.env.AWS_IMAGES_BUCKET_NAME;

    if (!this.lettersBucket) {
      throw new Error('AWS_LETTERS_BUCKET_NAME is not defined');
    }

    if (!this.imagesBucket) {
      throw new Error('AWS_IMAGES_BUCKET_NAME is not defined');
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

  async upload(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    bucket: s3Buckets,
  ): Promise<string> {
    try {
      const s3Bucket = this.mapBucket(bucket);

      const command = new PutObjectCommand({
        Bucket: s3Bucket,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await this.client.send(command);

      return `https://${s3Bucket}.s3.${this.region}.amazonaws.com/${fileName}`;
    } catch (error) {
      throw new Error('File upload to AWS failed: ' + error);
    }
  }

  mapBucket(bucketEnum: s3Buckets): string {
    if (bucketEnum === s3Buckets.LETTERS) {
      return process.env.AWS_LETTERS_BUCKET_NAME;
    } else if (bucketEnum === s3Buckets.IMAGES) {
      return process.env.AWS_IMAGES_BUCKET_NAME;
    }
  }

  async getImageData(objectKey: string): Promise<Uint8Array | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.imagesBucket,
        Key: objectKey,
      });

      const response = await this.client.send(command);
      return response.Body.transformToByteArray();
    } catch (error) {
      if (error instanceof NoSuchKey) {
        this.logger.error(`Failed to get image ${objectKey} - key does not exist`);
      } else if (error instanceof S3ServiceException) {
        this.logger.error(
          `Failed to get image ${objectKey} - S3 service error (${error.name}: ${error.message})`,
        );
      }

      return null;
    }
  }
}
