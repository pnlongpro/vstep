import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamSet } from './entities/exam-set.entity';
import { ExamSection } from './entities/exam-section.entity';
import { SectionPassage } from './entities/section-passage.entity';
import { ExamSetRepository } from './repositories/exam-set.repository';
import { ExamSetService } from './services/exam-set.service';
import { ExamSetController } from './controllers/exam-set.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ExamSet, ExamSection, SectionPassage])],
  controllers: [ExamSetController],
  providers: [ExamSetService, ExamSetRepository],
  exports: [ExamSetService, ExamSetRepository, TypeOrmModule],
})
export class ExamsModule {}
