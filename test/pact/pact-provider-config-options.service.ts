import { Injectable } from '@nestjs/common';
import { versionFromGitTag } from '@pact-foundation/absolute-version';
import { PactProviderOptions, PactProviderOptionsFactory } from 'nestjs-pact';
@Injectable()
export class PactProviderConfigOptionsService
  implements PactProviderOptionsFactory
{
  //public constructor() {}

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
        'Has no animals': async () => {
          //this.animalRepository.clear();
          token = '1234';

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
