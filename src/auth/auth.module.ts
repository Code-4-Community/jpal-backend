import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/types/user.entity';
import { AuthMiddleware } from './middleware/auth.middleware';
import { UtilModule } from '../util/util.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UtilModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
