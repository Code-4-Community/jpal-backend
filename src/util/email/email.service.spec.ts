import { Test, TestingModule } from '@nestjs/testing';
import { amazonSESClientFactory } from './amazon-ses-client.factory';
import { AmazonSESWrapper } from './amazon-ses.wrapper';
import { EmailService } from './email.service';

const mockAmazonSESWrapper = {
  sendEmails: () => Promise.resolve(null),
};

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: AmazonSESWrapper,
          useValue: mockAmazonSESWrapper,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService, AmazonSESWrapper, amazonSESClientFactory],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    // service.sendEmailWithPdfAttachment('jung.ry@northeastern.edu', 'Test sending an email with a PDF attachment', '<h1>Hello World!</h1>');
  });
});
