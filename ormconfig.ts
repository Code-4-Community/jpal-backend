import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Post } from './src/posts/entities/post.entity';
import { User } from './src/users/types/user.entity';

dotenv.config();

const config: TypeOrmModuleOptions & { seeds: string[] } = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [User, Post],
  migrationsTableName: 'migrations',
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
  seeds: ['src/seeds/**/*{.ts,.js}'],
};

export default config;
