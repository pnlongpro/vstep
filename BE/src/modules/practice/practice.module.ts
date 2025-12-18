import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeSession } from './entities/practice-session.entity';
import { PracticeAnswer } from './entities/practice-answer.entity';
import { Question } from '../questions/entities/question.entity';
import { PracticeSessionService } from './services/practice-session.service';
import { PracticeSessionController } from './controllers/practice-session.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PracticeSession, PracticeAnswer, Question])],
  controllers: [PracticeSessionController],
  providers: [PracticeSessionService],
  exports: [PracticeSessionService, TypeOrmModule],
})
export class PracticeModule {}
