import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionOption } from './entities/question-option.entity';
import { QuestionTag } from './entities/question-tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, QuestionOption, QuestionTag]),
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class QuestionsModule {}
