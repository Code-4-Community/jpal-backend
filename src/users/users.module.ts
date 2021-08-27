import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './types/user.entity';
import { UtilModule } from '../util/util.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UtilModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
