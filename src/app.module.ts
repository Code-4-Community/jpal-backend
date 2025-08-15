import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfig from '../ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthenticationMiddleware } from './auth/middleware/authentication.middleware';
import { HealthModule } from './health/health.module';
import { SentryInterceptor } from './sentry.interceptor';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UtilModule } from './util/util.module';
import { SurveyTemplateModule } from './surveyTemplate/surveyTemplate.module';
import { SurveyModule } from './survey/survey.module';
import { AssignmentModule } from './assignment/assignment.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReviewerModule } from './reviewer/reviewer.module';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(TypeOrmConfig),
    UserModule,
    AuthModule,
    UtilModule,
    HealthModule,
    SurveyTemplateModule,
    SurveyModule,
    AssignmentModule,
    ReviewerModule,
    QuestionModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: SentryInterceptor,
    // },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
