import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Post } from 'src/posts/entities/post.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { overrideExternalDependencies } from './mockProviders';

const examplePostData = {
  title: 'title',
  body: 'body',
  userId: 1,
};

describe('Example e2e', () => {
  let app: INestApplication;
  let posts: Repository<Post>;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await overrideExternalDependencies(
      Test.createTestingModule({
        imports: [AppModule],
      }),
    ).compile();

    posts = moduleFixture.get('PostRepository');

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  beforeEach(async () => {
    await posts.clear();
  });

  it('should be able to GET all Posts', async () => {
    const post = await posts.save(examplePostData);

    await request(app.getHttpServer()).get('/posts').expect(200).expect([post]);
  });

  it('should be able to GET a Post by id', async () => {
    const post = await posts.save(examplePostData);

    await request(app.getHttpServer())
      .get(`/posts/${post.id}`)
      .expect(200)
      .expect(examplePostData);
  });

  it('should be able to POST a Post', async () => {
    const result = await request(app.getHttpServer())
      .post('/posts')
      .send(examplePostData)
      .expect(201);
    expect(result.body).toBeDefined();
    expect(result.body.id).toBeDefined();
    expect(result.body).toEqual({ ...examplePostData, id: result.body.id });
    expect(await posts.findOne(result.body.id)).toEqual(result.body);
  });

  it('should be able to PATCH a Post', async () => {
    const post = await posts.save(examplePostData);
    await request(app.getHttpServer())
      .patch(`/posts/${post.id}`)
      .send({ title: 'updated title' })
      .expect(200);
    const postInDb = await posts.findOne(post.id);
    expect(postInDb.title).toEqual('updated title');
    expect(postInDb.id).toEqual(post.id);
    expect(postInDb.body).toEqual(post.body);
    expect(postInDb.userId).toEqual(post.userId);
  });

  it('should be able to DELETE a Post', async () => {
    const post = await posts.save(examplePostData);
    expect(await posts.findOne(post.id)).toBeDefined();

    await request(app.getHttpServer())
      .delete(`/posts/${post.id}`)
      .send(examplePostData)
      .expect(200);

    expect(await posts.findOne(post.id)).toBeUndefined();
  });

  afterAll(async () => await app.close());
});
