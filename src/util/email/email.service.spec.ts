import { Test, TestingModule } from '@nestjs/testing';
import { AmazonSESWrapper } from './amazon-ses.wrapper';
import { EmailService } from './email.service';
import { mock } from 'jest-mock-extended';

const mockAmazonSESWrapper = mock<AmazonSESWrapper>();

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

  it('should send an email by calling SES', async () => {
    mockAmazonSESWrapper.sendEmails.mockResolvedValue('success!');
    await service.queueEmail('recipient@email.com', 'Subject', '<h1>body</h1>');
    expect(mockAmazonSESWrapper.sendEmails).toHaveBeenCalled();
  });

  // Real time test, expected to finish in 2000ms, may be flaky
  it('should handle rate limiting large batches of emails', async () => {
    const startTime = new Date().getTime();
    mockAmazonSESWrapper.sendEmails.mockResolvedValue('success!');
    const EMAILS = 28;
    const tasks = [];
    for (let i = 0; i < EMAILS; i++) {
      tasks.push(service.queueEmail('recipient@email.com', 'Subject', '<h1>body</h1>'));
    }
    await Promise.all(tasks);
    // Expect that email tasks clear at approx. 14 emails per second.
    // We allow that the queue finishs at most 100ms early.
    expect(new Date().getTime() - startTime).toBeGreaterThan((EMAILS / 14) * 1000 - 100);
  });
});
