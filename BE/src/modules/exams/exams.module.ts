import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamSet } from './entities/exam-set.entity';
import { ExamSection } from './entities/exam-section.entity';
import { SectionPassage } from './entities/section-passage.entity';
import { ExamSetRepository } from './repositories/exam-set.repository';
import { ExamSetService } from './services/exam-set.service';
import { SectionPassageService } from './services/section-passage.service';
import { ExamSetController } from './controllers/exam-set.controller';
import { SectionPassageController } from './controllers/section-passage.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ExamSet, ExamSection, SectionPassage])],
  controllers: [ExamSetController, SectionPassageController],
  providers: [ExamSetService, SectionPassageService, ExamSetRepository],
  exports: [ExamSetService, SectionPassageService, ExamSetRepository, TypeOrmModule],
})
export class ExamsModule {}
