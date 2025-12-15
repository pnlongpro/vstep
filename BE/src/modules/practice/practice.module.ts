import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';
import { PracticeSession } from './entities/practice-session.entity';
import { PracticeAnswer } from './entities/practice-answer.entity';
import { DraftAnswer } from './entities/draft-answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PracticeSession, PracticeAnswer, DraftAnswer]),
  ],
  controllers: [PracticeController],
  providers: [PracticeService],
  exports: [PracticeService],
})
export class PracticeModule {}
