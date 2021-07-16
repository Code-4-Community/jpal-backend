import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import TypeOrmConfig from '../../ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig), TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
