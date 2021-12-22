import { Test, TestingModule } from '@nestjs/testing';
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
