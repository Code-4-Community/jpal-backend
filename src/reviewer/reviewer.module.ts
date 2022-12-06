import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewerController } from './reviewer.controller';
import { ReviewerService } from './reviewer.service';
import { Reviewer } from './types/reviewer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reviewer])],
  providers: [ReviewerService],
  controllers: [ReviewerController],
})
export class ReviewerModule {}
