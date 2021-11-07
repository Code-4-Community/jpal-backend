import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { versionFromGitTag } from '@pact-foundation/absolute-version';
import { PactProviderOptions, PactProviderOptionsFactory } from 'nestjs-pact';
import { Role } from '../../src/user/types/role';
import { User } from '../../src/user/types/user.entity';
import { Repository } from 'typeorm';
import { clearDb } from '../e2e.utils';
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
        // e.g. ADD Bearer token
        if (token) req.headers.authorization = `Bearer ${token}`;
        next();
      },

      stateHandlers: {
        nothing: async () => {
          token = '1234';
          await clearDb();
          await this.userRepository.save({
            email: 'test@test.com',
            role: Role.ADMIN,
            firstName: 'admin',
            lastName: 'user',
          });
          return 'Animals removed to the db';
        },
        'signed in as an researcher': async () => {
          await clearDb();
          await this.userRepository.save({
            email: 'c4cneu.jpal+researcher@gmail.com',
            role: Role.RESEARCHER,
            firstName: 'researcher',
            lastName: 'user',
          });
          token = JSON.stringify({ email: 'c4cneu.jpal+researcher@gmail.com' });
          return 'Request sent as a user authorized as a researcher';
        },
        'signed in as an admin': async () => {
          await clearDb();
          await this.userRepository.save({
            email: 'c4cneu.jpal+admin@gmail.com',
            role: Role.ADMIN,
            firstName: 'admin',
            lastName: 'user',
          });
          token = JSON.stringify({ email: 'c4cneu.jpal+admin@gmail.com' });
          return 'Request sent as a user authorized as an admin';
        },
        'is not authenticated': async () => {
          token = undefined;
          return 'No authorization token sent';
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
