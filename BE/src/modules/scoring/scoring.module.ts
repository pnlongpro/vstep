import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeSession } from '../practice/entities/practice-session.entity';
import { PracticeAnswer } from '../practice/entities/practice-answer.entity';
import { Question } from '../questions/entities/question.entity';
import { ScoringService } from './services/scoring.service';
import { ScoringController } from './controllers/scoring.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PracticeSession, PracticeAnswer, Question])],
  controllers: [ScoringController],
  providers: [ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {}
