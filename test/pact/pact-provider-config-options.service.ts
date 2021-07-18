import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { versionFromGitTag } from '@pact-foundation/absolute-version';
import { PactProviderOptions, PactProviderOptionsFactory } from 'nestjs-pact';
import { Roles } from '../../src/users/types/roles';
import { User } from '../../src/users/types/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class PactProviderConfigOptionsService
  implements PactProviderOptionsFactory
{
  public constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public createPactProviderOptions(): PactProviderOptions {
    // For builds triggered by a 'contract content changed' webhook,
    // just verify the changed pact. The URL will bave been passed in
    // from the webhook to the CI job.

    const pactChangedOpts = {
      pactUrls: [process.env.PACT_URL],
    };

    const GIT_BRANCH = process.env.GITHUB_REF
      ? process.env.GITHUB_REF.substring(11)
      : undefined;

    const fetchPactsDynamicallyOpts = {
      provider: 'jpal-backend',
      consumerVersionSelectors: [{ tag: 'prod', latest: true }], // the new way of specifying which pacts to verify
      pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
      enablePending: false,
      publishVerificationResult: process.env.CI ? true : false,
    };

    let token;

    return {
      requestFilter: (req, res, next) => {
        req.headers.MY_SPECIAL_HEADER = 'my special value';

        // e.g. ADD Bearer token
        req.headers.authorization = `Bearer ${token}`;
        next();
      },

      stateHandlers: {
        nothing: async () => {
          //this.animalRepository.clear();
          token = '1234';
          await this.userRepository.clear();
          await this.userRepository.save({
            email: 'test@test.com',
            role: Roles.ADMIN,
            password: 'Hello, World!',
          });
          return 'Animals removed to the db';
        },
        'Has some animals': async () => {
          token = '1234';
          //this.animalRepository.importData();

          return 'Animals added to the db';
        },
        'Has an animal with ID 1': async () => {
          token = '1234';
          //this.animalRepository.importData();

          return 'Animals added to the db';
        },
        'is not authenticated': async () => {
          token = '';

          return 'Invalid bearer token generated';
        },
      },

      logLevel: 'debug',
      providerVersion: process.env.GIT_COMMIT ?? versionFromGitTag(),
      providerVersionTags: GIT_BRANCH ? [GIT_BRANCH] : [],
      verbose: process.env.VERBOSE === 'true',
      pactBrokerToken: process.env.PACT_BROKER_TOKEN,

      ...(process.env.PACT_URL ? pactChangedOpts : fetchPactsDynamicallyOpts),
    };
  }
}
