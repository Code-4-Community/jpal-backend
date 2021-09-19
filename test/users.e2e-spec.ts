// import { INestApplication } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from 'src/users/users.service';
// import { AppModule } from '../src/app.module';
// import { Role } from '../src/users/types/role';
// import { User } from '../src/users/types/user.entity';
// import { overrideExternalDependencies } from './mockProviders';
// import * as request from 'supertest';

// const initialUser: Omit<User, 'id'> = {
//   email: 'test@test.com',
//   role: Role.ADMIN,
//   isClaimed: false,
// };

// describe('Example e2e', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await overrideExternalDependencies(
//       Test.createTestingModule({
//         imports: [AppModule],
//       }),
//     ).compile();

//     const users = moduleFixture.get('UserRepository');

//     app = moduleFixture.createNestApplication();

//     await app.init();

//     await users.clear();
//     await users.save(initialUser);
//   });
//   it('should save a user when creating a user', async () => 
//   {return request(app.getHttpServer())
//     .post('/users')
//     .send({email: "test@test.com", role: Role.RESEARCHER})
//     .expect(201)
//     .expect({
//       data: UsersService.findAll(),
//     });});

//   afterAll(async () => await app.close());
// });
