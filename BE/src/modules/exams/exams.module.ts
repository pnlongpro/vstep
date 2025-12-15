import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { Exam } from './entities/exam.entity';
import { ExamSection } from './entities/exam-section.entity';
import { Submission } from './entities/submission.entity';
import { Assignment } from './entities/assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exam, ExamSection, Submission, Assignment]),
  ],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}
