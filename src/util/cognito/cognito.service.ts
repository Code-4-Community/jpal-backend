import { Injectable } from '@nestjs/common';
import 'cross-fetch/polyfill';
import { CognitoWrapper } from './cognito.wrapper';
import { Validator } from 'cognito-jwt-token-validator';

@Injectable()
export class CognitoService {
  constructor(private cognitoWrapper: CognitoWrapper) {}

  async validateToken(token: string): Promise<
    | {
        payload: {
          [key: string]: string;
        };
        failed?: undefined;
      }
    | {
        failed: boolean;
        payload?: undefined;
      }
  > {
    // Authorize function

    const validator = new Validator(
      'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_zG2SfHpXC',
      '9v01t6v5p685510n0q5b6i9co',
    );
    const authorize = async (token) => {
      try {
        const payload = await validator.validate(token);
        return {
          payload,
        };
      } catch (err) {
        console.log('Failed to validate the token');
        throw new Error('Failed to validate the token');
      }
    };
    return await authorize(token);
    // const jwks = {
    //   keys: [
    //     {
    //       alg: "RS256",
    //       e: "AQAB",
    //       kid: "/RcdmilwpeN/VNxFoMJwGBuQBXLOVxin5QsVlYJaRKw=",
    //       kty: "RSA",
    //       n: "xTGw66cm92gfvDpQRxWIG01QrrS7V9NGzn0BmRxt6n9d2BufEUfitd9I89noYn5QPG0tQclZcLoEF8UZHCzq_2ZeUjg70LpL1KZT_ooqzW-vagcA4BRkO1Hqw-X7_YdU1CKJltDCKZOBa3JioCA2k-S_e_dd1TxTB0pOzNVydEqyDN3PfLLQw1bwLKEiF8P-sKS1TnSYOCDbcGLufRpvR81-1DErLFFkmmOO0yl548ZSXIGimVIe6U03YqgQUlegrlg2YDn_5HFF6S1-2Ag52qVvW6S-BTUMKwQ7-dv33F-Ak34RauFZiyYhL4Gi8gh7akG-hY7MFg1drul1OPwX4w",
    //       use: "sig",
    //     },
    //     {
    //       alg: "RS256",
    //       e: "AQAB",
    //       kid: "ctbkrJpEmEBWmbBXNJFy9x722e4buWPf3wvItj3Rrio=",
    //       kty: "RSA",
    //       n: "r_wxWcdFbxrfWHYy_aQSHYLJVnmhDYIak9mGJbzsCz6aQcqw34Gl_FTuIkghLCtGd3ioUYcv1vF6tU629A58QkpNpZ1m-UOalN4Dzz86HZncwnU8ejX_4hTnQ4pYKLNt41SpKjYmAvj54AER3H4NPFE3S8hhpEWb9i4adBbLarJVf2YQl6im3MdTDlUa7BHmusrJWdxG9l1L5578atO-yuWP9bVkv6zSVlXhkMuR3mmkVDKBbkrdMWtQPY0rEUB7oNmVNoDROayybHzVXjjSy4CtUQoYd4ADkNsIgMSvKnSowowwiQg0l-10OXoPQSxjBBGq1wfiaTZiRELrWeKdLw",
    //       use: "sig",
    //     },
    //   ],
    // };

    // var jwt = require("jsonwebtoken");

    // const jwtToken = `eyJraWQiOiJjdGJrckpwRW1FQldtYkJYTkpGeTl4NzIyZTRidVdQZjN3dkl0ajNScmlvPSIsImFsZyI6IlJTMjU2In0.eyJvcmlnaW5fanRpIjoiYmJkZTM4NmYtZDZhZS00ODk4LWIxYjctNDMwOWZkNTMyNDFhIiwic3ViIjoiODE1ZTgxYTAtZWYwZi00ZTFiLTk5ZGUtMDhhNWFiMjA0OGU0IiwiZXZlbnRfaWQiOiI4OTNkMDY0My1lZGVhLTQ4MzAtOTNlOC0yOGQ0ZDIzM2FmMGIiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjI4NzMwODMzLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9JVlJnM1BXU0giLCJleHAiOjE2Mjg3MzQ0MzMsImlhdCI6MTYyODczMDgzMywianRpIjoiZTQ0ZTQzODEtMmQ3OC00MmIzLWIzNGYtMzYwNThjOTkzZjMzIiwiY2xpZW50X2lkIjoiMTUzczBzaTc0MnB0NG40YnU0Mmh0MjZjNm4iLCJ1c2VybmFtZSI6InZlZGFudHJhdXRlbGEifQ.OB2CX-HIcnDqhhwVcqmB6TRw_haazZwRyJnUNbqrg9dwtm92TIRbjOXG6ogATfaRwN6OXDQ-yD_Hiz_oxBBkPxLEdDarXSlC2jBmn7POxCK8qA_a-ia4bJ-rfghaukrYSyKcqX8GHTI_H-GY4pnBtAAKy7qeR5YMTEHJGUp_IJ34f1AAs14oKUEfQosS8lQT6BcyTmMoOhZzBYEPPiQced65ENSk3xHVgSJ_j5oqJHgFLCQ5gRXxuXnDMPqmE8meAjPb8ynIqbvX4w5k5mxTYKqcMApqlSaCw9hJKboxKdofvptRsoSPqXwvp3ICelqLwdIgZHDUi42dwYjpr_pYWQ`;

    // const decodedJwt = jwt.decode(jwtToken, { complete: true });
    // // Fail if the token is not jwt
    // if (!decodedJwt) {
    //   throw new Error('Not a valid JWT Token');
    // }

    // const kid = decodedJwt.header.kid;

    // let matchingJwk = null;
    // for (const jwk of jwks.keys) {
    //   console.log(jwk);
    //   if (jwk.kid === kid) {
    //     matchingJwk = jwk;
    //     break;
    //   }
    // }

    // if (!matchingJwk) {
    //   throw new Error('Not a valid JWT Token');
    // }

    // var jwkToPem = require('jwk-to-pem');
    // var pem = jwkToPem(matchingJwk);
    // jwt.verify(
    //   jwtToken,
    //   pem,
    //   { algorithms: ['RS256'] },
    //   function (err, decodedToken) {
    //     console.log(decodedToken);
    //     console.log(err);
    //   },
    // );
  }
}
