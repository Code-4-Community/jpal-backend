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
import { SurveyTemplateController } from './survey-template/survey-template.controller';
import { SurveyTemplateService } from './survey-template/survey-template.service';
import { SurveyTemplateModule } from './survey-template/survey-template.module';

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
  ],
  controllers: [AppController, UserController, SurveyTemplateController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
    SurveyTemplateService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
