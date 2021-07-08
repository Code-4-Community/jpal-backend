import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import TypeOrmConfig from '../ormconfig';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { UtilModule } from './util/util.module';

dotenv.config();

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig), UsersModule, AuthModule, UtilModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
