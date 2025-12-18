import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionOption } from './entities/question-option.entity';
import { QuestionTag } from './entities/question-tag.entity';
import { QuestionRepository } from './repositories/question.repository';
import { QuestionService } from './services/question.service';
import { QuestionController } from './controllers/question.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionOption, QuestionTag])],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionRepository],
  exports: [QuestionService, QuestionRepository, TypeOrmModule],
})
export class QuestionsModule {}
