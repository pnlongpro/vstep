# BE-049: Class Analytics & Reporting

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-049 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 11-12 |
| **Priority** | P2 (Medium) |
| **Estimated Hours** | 4h |
| **Dependencies** | BE-044, BE-045, BE-046 |

---

## 🎯 Objective

Implement analytics and reporting for classes:
- Class performance overview
- Student progress tracking
- Skill breakdown analysis
- Time-series data for charts
- Export reports

---

## 📝 Implementation

### 1. class-analytics.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ClassEntity } from '../classes/entities/class.entity';
import { ClassStudentEntity } from '../classes/entities/class-student.entity';
import { ExamAttemptEntity } from '../exams/entities/exam-attempt.entity';
import { AiWritingResultEntity } from '../ai-scoring/entities/ai-writing-result.entity';
import { AiSpeakingResultEntity } from '../ai-scoring/entities/ai-speaking-result.entity';

export interface ClassOverview {
  totalStudents: number;
  activeStudents: number;
  averageScore: number;
  averageProgress: number;
  totalPracticeHours: number;
  skillBreakdown: {
    reading: number;
    listening: number;
    writing: number;
    speaking: number;
  };
}

export interface StudentProgressItem {
  studentId: string;
  studentName: string;
  avatar?: string;
  overallProgress: number;
  currentScore: number;
  scoreChange: number;
  practiceCount: number;
  lastActiveAt: Date;
}

export interface TimeSeriesData {
  date: string;
  averageScore: number;
  practiceCount: number;
  activeStudents: number;
}

@Injectable()
export class ClassAnalyticsService {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly classRepo: Repository<ClassEntity>,
    @InjectRepository(ClassStudentEntity)
    private readonly classStudentRepo: Repository<ClassStudentEntity>,
    @InjectRepository(ExamAttemptEntity)
    private readonly attemptRepo: Repository<ExamAttemptEntity>,
    @InjectRepository(AiWritingResultEntity)
    private readonly writingRepo: Repository<AiWritingResultEntity>,
    @InjectRepository(AiSpeakingResultEntity)
    private readonly speakingRepo: Repository<AiSpeakingResultEntity>,
  ) {}

  async getClassOverview(classId: string): Promise<ClassOverview> {
    // Get student counts
    const [totalStudents, activeStudents] = await Promise.all([
      this.classStudentRepo.count({ where: { classId } }),
      this.classStudentRepo.count({ where: { classId, status: 'active' } }),
    ]);

    // Get student IDs
    const students = await this.classStudentRepo.find({
      where: { classId, status: 'active' },
      select: ['studentId'],
    });
    const studentIds = students.map((s) => s.studentId);

    if (studentIds.length === 0) {
      return {
        totalStudents,
        activeStudents,
        averageScore: 0,
        averageProgress: 0,
        totalPracticeHours: 0,
        skillBreakdown: { reading: 0, listening: 0, writing: 0, speaking: 0 },
      };
    }

    // Get average scores by skill
    const [readingAvg, listeningAvg, writingAvg, speakingAvg] = await Promise.all([
      this.getAverageScore(studentIds, 'reading'),
      this.getAverageScore(studentIds, 'listening'),
      this.getAverageScore(studentIds, 'writing'),
      this.getAverageScore(studentIds, 'speaking'),
    ]);

    // Calculate overall average
    const scores = [readingAvg, listeningAvg, writingAvg, speakingAvg].filter((s) => s > 0);
    const averageScore = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;

    // Get total practice time
    const practiceResult = await this.attemptRepo
      .createQueryBuilder('attempt')
      .select('SUM(TIMESTAMPDIFF(MINUTE, attempt.startTime, attempt.endTime))', 'totalMinutes')
      .whereInIds(studentIds.map((id) => ({ userId: id })))
      .getRawOne();

    const totalPracticeHours = (parseFloat(practiceResult?.totalMinutes) || 0) / 60;

    return {
      totalStudents,
      activeStudents,
      averageScore,
      averageProgress: 0, // TODO: Calculate based on target level
      totalPracticeHours,
      skillBreakdown: {
        reading: readingAvg,
        listening: listeningAvg,
        writing: writingAvg,
        speaking: speakingAvg,
      },
    };
  }

  async getStudentProgress(classId: string): Promise<StudentProgressItem[]> {
    const students = await this.classStudentRepo.find({
      where: { classId },
      relations: ['student'],
    });

    const progressItems: StudentProgressItem[] = [];

    for (const enrollment of students) {
      const student = enrollment.student;
      
      // Get current score
      const currentScore = await this.calculateStudentScore(student.id);
      
      // Get score from 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const previousScore = await this.calculateStudentScore(student.id, thirtyDaysAgo);
      
      // Get practice count
      const practiceCount = await this.attemptRepo.count({
        where: { userId: student.id, status: 'completed' },
      });

      // Get last activity
      const lastAttempt = await this.attemptRepo.findOne({
        where: { userId: student.id },
        order: { endTime: 'DESC' },
      });

      progressItems.push({
        studentId: student.id,
        studentName: student.name,
        avatar: student.avatar,
        overallProgress: 0, // TODO
        currentScore,
        scoreChange: currentScore - previousScore,
        practiceCount,
        lastActiveAt: lastAttempt?.endTime || enrollment.enrolledAt,
      });
    }

    return progressItems.sort((a, b) => b.currentScore - a.currentScore);
  }

  async getTimeSeriesData(
    classId: string,
    startDate: Date,
    endDate: Date,
    granularity: 'day' | 'week' | 'month' = 'day',
  ): Promise<TimeSeriesData[]> {
    // Get student IDs
    const students = await this.classStudentRepo.find({
      where: { classId },
      select: ['studentId'],
    });
    const studentIds = students.map((s) => s.studentId);

    if (studentIds.length === 0) return [];

    // Group format based on granularity
    let dateFormat: string;
    switch (granularity) {
      case 'week':
        dateFormat = '%Y-%u'; // Year-Week
        break;
      case 'month':
        dateFormat = '%Y-%m';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }

    const result = await this.attemptRepo
      .createQueryBuilder('attempt')
      .select(`DATE_FORMAT(attempt.endTime, '${dateFormat}')`, 'date')
      .addSelect('AVG(attempt.score)', 'averageScore')
      .addSelect('COUNT(*)', 'practiceCount')
      .addSelect('COUNT(DISTINCT attempt.userId)', 'activeStudents')
      .where('attempt.userId IN (:...studentIds)', { studentIds })
      .andWhere('attempt.endTime BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('attempt.status = :status', { status: 'completed' })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    return result.map((row) => ({
      date: row.date,
      averageScore: parseFloat(row.averageScore) || 0,
      practiceCount: parseInt(row.practiceCount) || 0,
      activeStudents: parseInt(row.activeStudents) || 0,
    }));
  }

  async getSkillDistribution(classId: string): Promise<{
    reading: { level: string; count: number }[];
    listening: { level: string; count: number }[];
    writing: { level: string; count: number }[];
    speaking: { level: string; count: number }[];
  }> {
    // TODO: Implement skill level distribution
    return {
      reading: [],
      listening: [],
      writing: [],
      speaking: [],
    };
  }

  private async getAverageScore(studentIds: string[], skill: string): Promise<number> {
    if (skill === 'writing') {
      const result = await this.writingRepo
        .createQueryBuilder('result')
        .select('AVG(result.overallScore)', 'avg')
        .where('result.userId IN (:...studentIds)', { studentIds })
        .getRawOne();
      return parseFloat(result?.avg) || 0;
    }

    if (skill === 'speaking') {
      const result = await this.speakingRepo
        .createQueryBuilder('result')
        .select('AVG(result.overallScore)', 'avg')
        .where('result.userId IN (:...studentIds)', { studentIds })
        .getRawOne();
      return parseFloat(result?.avg) || 0;
    }

    // Reading & Listening from attempts
    const result = await this.attemptRepo
      .createQueryBuilder('attempt')
      .leftJoin('attempt.examSection', 'section')
      .select('AVG(attempt.score)', 'avg')
      .where('attempt.userId IN (:...studentIds)', { studentIds })
      .andWhere('section.skill = :skill', { skill })
      .getRawOne();

    return parseFloat(result?.avg) || 0;
  }

  private async calculateStudentScore(studentId: string, beforeDate?: Date): Promise<number> {
    // Calculate weighted average across all skills
    // TODO: Implement proper calculation
    return 7.0;
  }
}
```

### 2. class-analytics.controller.ts

```typescript
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { ClassAnalyticsService } from './class-analytics.service';

@ApiTags('Class Analytics')
@Controller('classes/:classId/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('teacher', 'admin')
@ApiBearerAuth()
export class ClassAnalyticsController {
  constructor(private readonly analyticsService: ClassAnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get class overview statistics' })
  async getOverview(@Param('classId') classId: string) {
    return this.analyticsService.getClassOverview(classId);
  }

  @Get('students')
  @ApiOperation({ summary: 'Get student progress list' })
  async getStudentProgress(@Param('classId') classId: string) {
    return this.analyticsService.getStudentProgress(classId);
  }

  @Get('timeseries')
  @ApiOperation({ summary: 'Get time series data for charts' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  @ApiQuery({ name: 'granularity', enum: ['day', 'week', 'month'], required: false })
  async getTimeSeries(
    @Param('classId') classId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('granularity') granularity?: 'day' | 'week' | 'month',
  ) {
    return this.analyticsService.getTimeSeriesData(
      classId,
      new Date(startDate),
      new Date(endDate),
      granularity || 'day',
    );
  }

  @Get('skills')
  @ApiOperation({ summary: 'Get skill level distribution' })
  async getSkillDistribution(@Param('classId') classId: string) {
    return this.analyticsService.getSkillDistribution(classId);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Class overview returns stats
- [ ] Student progress list with scores
- [ ] Time series data for charts
- [ ] Skill breakdown by level
- [ ] Performance optimized queries
- [ ] Date range filtering works

---

## 📊 Response Examples

### GET /classes/:id/analytics/overview
```json
{
  "totalStudents": 30,
  "activeStudents": 28,
  "averageScore": 7.2,
  "averageProgress": 65,
  "totalPracticeHours": 156.5,
  "skillBreakdown": {
    "reading": 7.5,
    "listening": 7.0,
    "writing": 6.8,
    "speaking": 7.4
  }
}
```

### GET /classes/:id/analytics/students
```json
[
  {
    "studentId": "uuid",
    "studentName": "Nguyen Van A",
    "avatar": "https://...",
    "overallProgress": 72,
    "currentScore": 7.8,
    "scoreChange": 0.5,
    "practiceCount": 45,
    "lastActiveAt": "2024-01-15T10:30:00Z"
  }
]
```
