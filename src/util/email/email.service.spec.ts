import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MailgunWrapper } from './mailgun.wrapper';

const mockMailgunWrapper = {
  sendEmails: () => Promise.resolve(null),
};

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailgunWrapper,
          useValue: mockMailgunWrapper,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
