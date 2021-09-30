import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './types/user.entity';
import { UtilModule } from '../util/util.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UtilModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
