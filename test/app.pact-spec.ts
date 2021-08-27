import { Test } from '@nestjs/testing';
import { PactVerifierService } from 'nestjs-pact';
import { INestApplication, Logger, LoggerService } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PactModule } from './pact/pact.module';
import { overrideExternalDependencies } from './mockProviders';

jest.setTimeout(30000);

describe('Pact Verification', () => {
  let verifier: PactVerifierService;
  let logger: LoggerService;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await overrideExternalDependencies(
      Test.createTestingModule({
        imports: [AppModule, PactModule],
        providers: [Logger], //If you need a repository pass it here
      }),
    ).compile();

    verifier = moduleFixture.get(PactVerifierService);
    logger = moduleFixture.get(Logger);

    app = moduleFixture.createNestApplication();

    await app.init();
    logger.log('App initialized');
  });

  it("Validates the expectations of 'Matching Service'", async () => {
    const output = await verifier.verify(app);

    logger.log('Pact Verification Complete!');
    logger.log(output);
  });

  afterAll(async () => await app.close());
});
