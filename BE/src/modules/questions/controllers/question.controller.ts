import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { QuestionService } from '../services/question.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { QuestionFilterDto } from '../dto/question-filter.dto';
import { PaginationDto } from '../../../shared/dto/pagination.dto';

@ApiTags('Questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new question' })
  @ApiResponse({ status: 201, description: 'Question created successfully' })
  async create(@Body() dto: CreateQuestionDto) {
    return this.questionService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get questions with filters' })
  @ApiResponse({ status: 200, description: 'List of questions' })
  async findAll(@Query() filters: QuestionFilterDto, @Query() pagination: PaginationDto) {
    return this.questionService.findAll(filters, pagination);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get question statistics' })
  async getStats() {
    return this.questionService.getStats();
  }

  @Get('random')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get random questions for practice' })
  async getRandomQuestions(@Query() filters: QuestionFilterDto, @Query('count') count: number = 10) {
    return this.questionService.getRandomQuestions(filters, count);
  }

  @Get('passage/:passageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get questions by passage' })
  async findByPassage(@Param('passageId', ParseUUIDPipe) passageId: string) {
    return this.questionService.findByPassage(passageId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get question by ID' })
  @ApiResponse({ status: 200, description: 'Question details' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a question' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateQuestionDto) {
    return this.questionService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a question' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionService.delete(id);
  }

  @Post(':id/validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate an answer' })
  async validateAnswer(@Param('id', ParseUUIDPipe) id: string, @Body('answer') answer: string | string[]) {
    return this.questionService.validateAnswer(id, answer);
  }
}
