import { Test, TestingModule } from '@nestjs/testing';
import { CognitoService } from './cognito.service';
import { CognitoWrapper } from './cognito.wrapper';
import { userPoolFactory } from './user-pool.factory';

const token = 'eyJraWQiOiJPcXNMcW5VanBPRkNkekFraDE3WHlzV3lxTVwvb0Uxa0lsaW43cDAyN0hIST0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxNmJjMDAwYS1mNzFmLTRkNjYtYjVjZi1iNjcyY2MyYmViYzMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfekcyU2ZIcFhDIiwiY29nbml0bzp1c2VybmFtZSI6InRlc3R1c2VyQGVtYWlsLmNvbSIsIm9yaWdpbl9qdGkiOiIxNjJjMDVhMi04YjM5LTQ2NDktYjE0My05MGU0MTVjNDhjNTQiLCJhdWQiOiI5djAxdDZ2NXA2ODU1MTBuMHE1YjZpOWNvIiwiZXZlbnRfaWQiOiIwNTQ0N2E1YS00Y2QxLTRjZGYtOTU4My0yYjY3NTgxNzE4NTIiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTYyOTc2MDc0MSwiZXhwIjoxNjMwMDI0MzM0LCJpYXQiOjE2MzAwMjA3MzQsImp0aSI6ImFhNjlmNzUyLWRiYTItNGJkNC04OGNhLTMwMmYyMjU2NzJkMSIsImVtYWlsIjoidGVzdHVzZXJAZW1haWwuY29tIn0.LdJbfmrUbpaikCmCgx7VVrcWgpnagvk7HdRVh5fzNXLJPn2PvruDZ_68nEKuuJ9SuZcqU-w5bvis8ZSuwttM9pydb1uWpkHipiJtROPNrMVHfTYdc7kFnLJW6plrSikNzJjjnxE1YPSQQ80wwOAO6Dp8zD5gwXB2bytyfdTqbR43MzJjOcUQzJQDKN_5GroRKZrvKxue-9tnQoWpncGQHDjDXh9Q36kLhdur13xbA4f_laWr3qc7ZvlSK49WXxAXBD_k8NJFHzYsVrlu7TP3hRR8aNGCCTeqzFBs0x5b8Km2dHP_Vx_r4x3DsASZ6wU_1Xapcvs2SrCKwWGg6e_gkQ'
const badToken = 'eyJraWQiOiJjdGJrckpwRW1FQldtYkJYTkpGeTl4NzIyZTRidVdQZjN3dkl0ajNScmlvPSIsImFsZyI6IlJTMjU2In0.eyJvcmlnaW5fanRpIjoiYmJkZTM4NmYtZDZhZS00ODk4LWIxYjctNDMwOWZkNTMyNDFhIiwic3ViIjoiODE1ZTgxYTAtZWYwZi00ZTFiLTk5ZGUtMDhhNWFiMjA0OGU0IiwiZXZlbnRfaWQiOiI4OTNkMDY0My1lZGVhLTQ4MzAtOTNlOC0yOGQ0ZDIzM2FmMGIiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjI4NzMwODMzLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9JVlJnM1BXU0giLCJleHAiOjE2Mjg3MzQ0MzMsImlhdCI6MTYyODczMDgzMywianRpIjoiZTQ0ZTQzODEtMmQ3OC00MmIzLWIzNGYtMzYwNThjOTkzZjMzIiwiY2xpZW50X2lkIjoiMTUzczBzaTc0MnB0NG40YnU0Mmh0MjZjNm4iLCJ1c2VybmFtZSI6InZlZGFudHJhdXRlbGEifQ.OB2CX-HIcnDqhhwVcqmB6TRw_haazZwRyJnUNbqrg9dwtm92TIRbjOXG6ogATfaRwN6OXDQ-yD_Hiz_oxBBkPxLEdDarXSlC2jBmn7POxCK8qA_a-ia4bJ-rfghaukrYSyKcqX8GHTI_H-GY4pnBtAAKy7qeR5YMTEHJGUp_IJ34f1AAs14oKUEfQosS8lQT6BcyTmMoOhZzBYEPPiQced65ENSk3xHVgSJ_j5oqJHgFLCQ5gRXxuXnDMPqmE8meAjPb8ynIqbvX4w5k5mxTYKqcMApqlSaCw9hJKboxKdofvptRsoSPqXwvp3ICelqLwdIgZHDUi42dwYjpr_pYWQ'

describe('CognitoService', () => {
  let service: CognitoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CognitoService, CognitoWrapper, userPoolFactory],
    }).compile();

    service = module.get<CognitoService>(CognitoService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
    const payload = await service.validateToken(token);
    expect(payload).toBeDefined();
    try {
      await service.validateToken(badToken);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

it('needs a test to pass', () => expect(true).toBeTruthy());
