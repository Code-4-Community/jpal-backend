import { Module } from '@nestjs/common';
import { PactProviderModule } from 'nestjs-pact';
import { PactProviderConfigOptionsService } from './pact-provider-config-options.service';
import { AppModule } from '../../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../src/user/types/user.entity';

@Module({
  imports: [
    PactProviderModule.registerAsync({
      imports: [AppModule, TypeOrmModule.forFeature([User])],
      useClass: PactProviderConfigOptionsService,
      inject: [TypeOrmModule.forFeature([User])],
    }),
  ],
})
export class PactModule {}
