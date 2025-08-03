import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Assignment } from './src/assignment/types/assignment.entity';
import { Question } from './src/question/types/question.entity';
import { SurveyTemplate } from './src/surveyTemplate/types/surveyTemplate.entity';
import { User } from './src/user/types/user.entity';
import { Youth } from './src/youth/types/youth.entity';
import { Reviewer } from './src/reviewer/types/reviewer.entity';
import { Option } from './src/option/types/option.entity';
import { Response } from './src/response/types/response.entity';
import { Survey } from './src/survey/types/survey.entity';
import { Sentence } from './src/sentence/types/sentence.entity'
import { Paragraph } from './src/paragraph/types/paragraph.entity';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const config: TypeOrmModuleOptions & { seeds: string[] } = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [
    User,
    Survey,
    SurveyTemplate,
    Question,
    Option,
    Assignment,
    Response,
    Youth,
    Reviewer,
    Sentence,
    Paragraph
  ],
  migrationsTableName: 'migrations',
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
  seeds: ['src/seeds/**/*{.ts,.js}'],
  ssl: isProduction ? { rejectUnauthorized: false } : false,
};

export default config;
