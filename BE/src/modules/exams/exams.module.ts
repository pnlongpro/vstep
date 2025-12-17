import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamSet } from './entities/exam-set.entity';
import { ExamSection } from './entities/exam-section.entity';
import { SectionPassage } from './entities/section-passage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamSet, ExamSection, SectionPassage]),
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ExamsModule {}
