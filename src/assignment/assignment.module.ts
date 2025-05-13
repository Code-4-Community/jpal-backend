import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { Assignment } from './types/assignment.entity';
import { Response } from '../response/types/response.entity';
import { Question } from '../question/types/question.entity';
import { Option } from '../option/types/option.entity';
import { EmailService } from '../util/email/email.service';
import { AmazonSESWrapper } from '../util/email/amazon-ses.wrapper';
import { amazonSESClientFactory } from '../util/email/amazon-ses-client.factory';
import { Youth } from '../youth/types/youth.entity';
import { AWSS3Module } from 'src/aws/aws-s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, Option, Question, Response, Youth]), AWSS3Module],
  providers: [AssignmentService, EmailService, AmazonSESWrapper, amazonSESClientFactory],
  controllers: [AssignmentController],
})
export class AssignmentModule {}
