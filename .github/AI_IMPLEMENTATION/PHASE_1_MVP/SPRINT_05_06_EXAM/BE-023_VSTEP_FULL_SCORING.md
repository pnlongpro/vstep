# BE-023: VSTEP Full Scoring System

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-023 |
| **Phase** | 1 - MVP |
| **Sprint** | 5-6 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 8h |
| **Dependencies** | BE-022 |

---

## 🎯 Objective

Implement VSTEP Full Scoring System với:
- Score calculation theo chuẩn VSTEP (0-10 scale)
- 4 skill scoring với weights
- Level determination (A2/B1/B2/C1)
- Band descriptors và feedback

---

## 💻 Implementation

### Step 1: VSTEP Scoring Constants

```typescript
// src/modules/exams/constants/vstep-scoring.constants.ts

/**
 * VSTEP Score Bands
 * Level thresholds based on official VSTEP criteria
 */
export const VSTEP_BANDS = {
  C1: { min: 8.5, max: 10, label: 'Advanced' },
  B2: { min: 6.5, max: 8.4, label: 'Upper Intermediate' },
  B1: { min: 4.5, max: 6.4, label: 'Intermediate' },
  A2: { min: 3.0, max: 4.4, label: 'Elementary' },
  A1: { min: 0, max: 2.9, label: 'Beginner' },
} as const;

/**
 * Skill weights for overall score calculation
 * All skills are weighted equally in VSTEP
 */
export const SKILL_WEIGHTS = {
  reading: 0.25,
  listening: 0.25,
  writing: 0.25,
  speaking: 0.25,
} as const;

/**
 * Score conversion tables
 * Maps percentage scores to VSTEP 0-10 scale
 */
export const SCORE_CONVERSION = {
  // Reading/Listening: percentage to VSTEP score
  objective: [
    { min: 95, max: 100, score: 10 },
    { min: 90, max: 94, score: 9.5 },
    { min: 85, max: 89, score: 9 },
    { min: 80, max: 84, score: 8.5 },
    { min: 75, max: 79, score: 8 },
    { min: 70, max: 74, score: 7.5 },
    { min: 65, max: 69, score: 7 },
    { min: 60, max: 64, score: 6.5 },
    { min: 55, max: 59, score: 6 },
    { min: 50, max: 54, score: 5.5 },
    { min: 45, max: 49, score: 5 },
    { min: 40, max: 44, score: 4.5 },
    { min: 35, max: 39, score: 4 },
    { min: 30, max: 34, score: 3.5 },
    { min: 25, max: 29, score: 3 },
    { min: 20, max: 24, score: 2.5 },
    { min: 15, max: 19, score: 2 },
    { min: 10, max: 14, score: 1.5 },
    { min: 5, max: 9, score: 1 },
    { min: 0, max: 4, score: 0.5 },
  ],
};

/**
 * Writing criteria weights
 */
export const WRITING_CRITERIA_WEIGHTS = {
  taskAchievement: 0.25,
  coherenceCohesion: 0.25,
  lexicalResource: 0.25,
  grammaticalRange: 0.25,
} as const;

/**
 * Speaking criteria weights
 */
export const SPEAKING_CRITERIA_WEIGHTS = {
  pronunciation: 0.25,
  fluency: 0.25,
  grammar: 0.25,
  vocabulary: 0.25,
} as const;

/**
 * Band descriptors for feedback
 */
export const BAND_DESCRIPTORS = {
  reading: {
    10: 'Expert reader. Understands virtually everything read with ease.',
    9: 'Very skilled reader. Understands complex texts with nuanced meaning.',
    8: 'Good reader. Handles complex texts well with minor difficulties.',
    7: 'Competent reader. Good understanding of most texts.',
    6: 'Adequate reader. Can understand main ideas in moderately complex texts.',
    5: 'Modest reader. Can handle straightforward texts.',
    4: 'Limited reader. Struggles with complex vocabulary and structures.',
    3: 'Extremely limited reader. Only understands simple texts.',
  },
  listening: {
    10: 'Expert listener. Understands any spoken English with ease.',
    9: 'Very skilled listener. Understands complex speech including lectures.',
    8: 'Good listener. Understands most standard speech with minor difficulties.',
    7: 'Competent listener. Good comprehension of clear standard speech.',
    6: 'Adequate listener. Understands main points of clear standard input.',
    5: 'Modest listener. Can understand slowly and clearly articulated speech.',
    4: 'Limited listener. Often misunderstands in normal conditions.',
    3: 'Extremely limited listener. Only understands in optimal conditions.',
  },
  writing: {
    10: 'Expert writer. Writes with style, flexibility, and precision.',
    9: 'Very skilled writer. Writes well-structured, detailed texts.',
    8: 'Good writer. Produces clear, well-organised writing on complex subjects.',
    7: 'Competent writer. Writes clear, detailed texts on various subjects.',
    6: 'Adequate writer. Can write straightforward connected texts.',
    5: 'Modest writer. Can write simple connected texts on familiar topics.',
    4: 'Limited writer. Can write simple phrases and sentences.',
    3: 'Extremely limited writer. Only writes isolated phrases.',
  },
  speaking: {
    10: 'Expert speaker. Speaks with complete fluency and precision.',
    9: 'Very skilled speaker. Expresses ideas fluently with precision.',
    8: 'Good speaker. Speaks fluently on complex topics with minor errors.',
    7: 'Competent speaker. Can participate actively in discussions.',
    6: 'Adequate speaker. Can handle most situations while traveling.',
    5: 'Modest speaker. Can deal with familiar situations.',
    4: 'Limited speaker. Communicates basic needs in simple ways.',
    3: 'Extremely limited speaker. Uses isolated words and phrases.',
  },
};
```

### Step 2: VSTEP Scoring DTOs

```typescript
// src/modules/exams/dto/vstep-scoring.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SkillScoreDto {
  @ApiProperty({ description: 'Skill name' })
  skill: 'reading' | 'listening' | 'writing' | 'speaking';

  @ApiProperty({ description: 'Raw percentage score' })
  rawScore: number;

  @ApiProperty({ description: 'VSTEP score (0-10)' })
  vstepScore: number;

  @ApiProperty({ description: 'Band level' })
  band: string;

  @ApiProperty({ description: 'Band descriptor' })
  descriptor: string;

  @ApiPropertyOptional({ description: 'Sub-criteria scores' })
  criteria?: {
    [criterion: string]: {
      score: number;
      feedback?: string;
    };
  };

  @ApiProperty({ description: 'Number of correct answers' })
  correctCount?: number;

  @ApiProperty({ description: 'Total questions' })
  totalCount?: number;
}

export class VstepOverallScoreDto {
  @ApiProperty({ description: 'Overall VSTEP score (0-10)' })
  overallScore: number;

  @ApiProperty({ description: 'Overall band level' })
  overallBand: string;

  @ApiProperty({ description: 'Overall band label' })
  overallBandLabel: string;

  @ApiProperty({ description: 'Individual skill scores', type: [SkillScoreDto] })
  skillScores: SkillScoreDto[];

  @ApiProperty({ description: 'Strongest skill' })
  strongestSkill: string;

  @ApiProperty({ description: 'Weakest skill' })
  weakestSkill: string;

  @ApiPropertyOptional({ description: 'Personalized recommendations' })
  recommendations?: string[];

  @ApiProperty({ description: 'Score breakdown by section' })
  sectionBreakdown: {
    sectionId: string;
    sectionName: string;
    skill: string;
    score: number;
    vstepScore: number;
  }[];
}

export class ScoreComparisonDto {
  @ApiProperty({ description: 'Current attempt score' })
  current: VstepOverallScoreDto;

  @ApiPropertyOptional({ description: 'Previous attempt score' })
  previous?: VstepOverallScoreDto;

  @ApiProperty({ description: 'Improvement details' })
  improvement: {
    overallChange: number;
    skillChanges: { [skill: string]: number };
    trend: 'improving' | 'stable' | 'declining';
  };

  @ApiProperty({ description: 'Target score progress' })
  targetProgress?: {
    targetScore: number;
    currentScore: number;
    percentComplete: number;
    estimatedSessionsRemaining: number;
  };
}
```

### Step 3: VSTEP Scoring Service

```typescript
// src/modules/exams/services/vstep-scoring.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ExamAttempt } from '../entities/exam-attempt.entity';
import { ExamAnswer } from '../entities/exam-answer.entity';
import { ExamSection } from '../entities/exam-section.entity';
import { UserProfile } from '@/modules/users/entities/user-profile.entity';
import {
  VSTEP_BANDS,
  SKILL_WEIGHTS,
  SCORE_CONVERSION,
  WRITING_CRITERIA_WEIGHTS,
  SPEAKING_CRITERIA_WEIGHTS,
  BAND_DESCRIPTORS,
} from '../constants/vstep-scoring.constants';
import {
  SkillScoreDto,
  VstepOverallScoreDto,
  ScoreComparisonDto,
} from '../dto/vstep-scoring.dto';

@Injectable()
export class VstepScoringService {
  private readonly logger = new Logger(VstepScoringService.name);

  constructor(
    @InjectRepository(ExamAttempt)
    private readonly attemptRepository: Repository<ExamAttempt>,
    @InjectRepository(ExamAnswer)
    private readonly answerRepository: Repository<ExamAnswer>,
    @InjectRepository(ExamSection)
    private readonly sectionRepository: Repository<ExamSection>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
  ) {}

  /**
   * Calculate full VSTEP score for an attempt
   */
  async calculateFullScore(attemptId: string): Promise<VstepOverallScoreDto> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId },
      relations: ['examSet', 'examSet.sections'],
    });

    if (!attempt) {
      throw new Error('Attempt not found');
    }

    const answers = await this.answerRepository.find({
      where: { attemptId },
      relations: ['question'],
    });

    // Calculate scores for each skill
    const skillScores: SkillScoreDto[] = [];
    const sectionBreakdown: VstepOverallScoreDto['sectionBreakdown'] = [];

    for (const section of attempt.examSet.sections) {
      const sectionAnswers = answers.filter(a => a.sectionId === section.id);
      const skillScore = await this.calculateSkillScore(section, sectionAnswers);
      
      skillScores.push(skillScore);
      
      sectionBreakdown.push({
        sectionId: section.id,
        sectionName: section.title,
        skill: section.skill,
        score: skillScore.rawScore,
        vstepScore: skillScore.vstepScore,
      });
    }

    // Merge same skill sections (if multiple reading sections, etc.)
    const mergedSkillScores = this.mergeSkillScores(skillScores);

    // Calculate overall score
    const overallScore = this.calculateOverallScore(mergedSkillScores);
    const overallBand = this.determineBand(overallScore);

    // Find strongest and weakest skills
    const sortedSkills = [...mergedSkillScores].sort((a, b) => b.vstepScore - a.vstepScore);
    const strongestSkill = sortedSkills[0]?.skill || 'unknown';
    const weakestSkill = sortedSkills[sortedSkills.length - 1]?.skill || 'unknown';

    // Generate recommendations
    const recommendations = this.generateRecommendations(mergedSkillScores, overallBand);

    // Update attempt with final scores
    await this.attemptRepository.update(attemptId, {
      vstepScore: overallScore,
      score: overallScore * 10, // Store as percentage for consistency
      sectionScores: this.buildSectionScoresObject(mergedSkillScores),
    });

    return {
      overallScore,
      overallBand,
      overallBandLabel: VSTEP_BANDS[overallBand]?.label || 'Unknown',
      skillScores: mergedSkillScores,
      strongestSkill,
      weakestSkill,
      recommendations,
      sectionBreakdown,
    };
  }

  /**
   * Calculate score for a single skill/section
   */
  private async calculateSkillScore(
    section: ExamSection,
    answers: ExamAnswer[],
  ): Promise<SkillScoreDto> {
    const skill = section.skill.toLowerCase() as 'reading' | 'listening' | 'writing' | 'speaking';

    if (skill === 'reading' || skill === 'listening') {
      return this.calculateObjectiveSkillScore(skill, answers);
    } else {
      return this.calculateSubjectiveSkillScore(skill, answers);
    }
  }

  /**
   * Calculate Reading/Listening score (objective)
   */
  private calculateObjectiveSkillScore(
    skill: 'reading' | 'listening',
    answers: ExamAnswer[],
  ): SkillScoreDto {
    const scoredAnswers = answers.filter(a => a.isCorrect !== null);
    const correctCount = scoredAnswers.filter(a => a.isCorrect).length;
    const totalCount = scoredAnswers.length;

    // Calculate raw percentage
    const rawScore = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

    // Convert to VSTEP score
    const vstepScore = this.convertToVstepScore(rawScore);

    // Determine band
    const band = this.determineBand(vstepScore);

    // Get descriptor
    const descriptorIndex = Math.round(vstepScore);
    const descriptor = BAND_DESCRIPTORS[skill]?.[descriptorIndex] || 
      BAND_DESCRIPTORS[skill]?.[Math.floor(vstepScore)] ||
      'Performance at this level.';

    return {
      skill,
      rawScore,
      vstepScore,
      band,
      descriptor,
      correctCount,
      totalCount,
    };
  }

  /**
   * Calculate Writing/Speaking score (subjective, from AI)
   */
  private calculateSubjectiveSkillScore(
    skill: 'writing' | 'speaking',
    answers: ExamAnswer[],
  ): SkillScoreDto {
    const aiScoredAnswers = answers.filter(a => a.aiScore !== null);

    if (aiScoredAnswers.length === 0) {
      return {
        skill,
        rawScore: 0,
        vstepScore: 0,
        band: 'Pending',
        descriptor: 'Awaiting AI scoring...',
      };
    }

    // Aggregate AI scores
    const weights = skill === 'writing' ? WRITING_CRITERIA_WEIGHTS : SPEAKING_CRITERIA_WEIGHTS;
    
    let totalWeightedScore = 0;
    const criteriaScores: SkillScoreDto['criteria'] = {};

    // Collect all criteria scores from all answers
    const criteriaAggregates: { [key: string]: number[] } = {};

    for (const answer of aiScoredAnswers) {
      if (answer.aiScore?.criteria) {
        for (const [criterion, score] of Object.entries(answer.aiScore.criteria)) {
          if (!criteriaAggregates[criterion]) {
            criteriaAggregates[criterion] = [];
          }
          criteriaAggregates[criterion].push(score as number);
        }
      }
    }

    // Average each criterion and calculate weighted score
    for (const [criterion, scores] of Object.entries(criteriaAggregates)) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const weight = weights[criterion] || 0.25;
      
      totalWeightedScore += avgScore * weight;
      
      criteriaScores[criterion] = {
        score: avgScore,
        feedback: this.getCriterionFeedback(skill, criterion, avgScore),
      };
    }

    // If no criteria, use overall scores
    if (Object.keys(criteriaScores).length === 0) {
      const overallScores = aiScoredAnswers.map(a => a.aiScore?.overall || 0);
      totalWeightedScore = overallScores.reduce((a, b) => a + b, 0) / overallScores.length;
    }

    const vstepScore = totalWeightedScore;
    const rawScore = vstepScore * 10; // Convert to percentage-like scale
    const band = this.determineBand(vstepScore);

    const descriptorIndex = Math.round(vstepScore);
    const descriptor = BAND_DESCRIPTORS[skill]?.[descriptorIndex] || 
      BAND_DESCRIPTORS[skill]?.[Math.floor(vstepScore)] ||
      'Performance at this level.';

    return {
      skill,
      rawScore,
      vstepScore,
      band,
      descriptor,
      criteria: criteriaScores,
    };
  }

  /**
   * Convert percentage to VSTEP 0-10 score
   */
  private convertToVstepScore(percentage: number): number {
    for (const range of SCORE_CONVERSION.objective) {
      if (percentage >= range.min && percentage <= range.max) {
        return range.score;
      }
    }
    return 0;
  }

  /**
   * Determine CEFR/VSTEP band from score
   */
  private determineBand(score: number): string {
    for (const [band, range] of Object.entries(VSTEP_BANDS)) {
      if (score >= range.min && score <= range.max) {
        return band;
      }
    }
    return 'A1';
  }

  /**
   * Calculate overall weighted score
   */
  private calculateOverallScore(skillScores: SkillScoreDto[]): number {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const score of skillScores) {
      const weight = SKILL_WEIGHTS[score.skill] || 0.25;
      totalWeightedScore += score.vstepScore * weight;
      totalWeight += weight;
    }

    // Round to nearest 0.5
    const overallScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    return Math.round(overallScore * 2) / 2;
  }

  /**
   * Merge scores for same skills (if multiple sections)
   */
  private mergeSkillScores(skillScores: SkillScoreDto[]): SkillScoreDto[] {
    const merged: { [skill: string]: SkillScoreDto[] } = {};

    for (const score of skillScores) {
      if (!merged[score.skill]) {
        merged[score.skill] = [];
      }
      merged[score.skill].push(score);
    }

    return Object.entries(merged).map(([skill, scores]) => {
      if (scores.length === 1) return scores[0];

      // Average multiple sections of same skill
      const avgVstep = scores.reduce((sum, s) => sum + s.vstepScore, 0) / scores.length;
      const avgRaw = scores.reduce((sum, s) => sum + s.rawScore, 0) / scores.length;
      const totalCorrect = scores.reduce((sum, s) => sum + (s.correctCount || 0), 0);
      const totalQuestions = scores.reduce((sum, s) => sum + (s.totalCount || 0), 0);

      return {
        skill: skill as any,
        rawScore: avgRaw,
        vstepScore: avgVstep,
        band: this.determineBand(avgVstep),
        descriptor: scores[0].descriptor,
        correctCount: totalCorrect,
        totalCount: totalQuestions,
        criteria: scores[0].criteria,
      };
    });
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(
    skillScores: SkillScoreDto[],
    overallBand: string,
  ): string[] {
    const recommendations: string[] = [];

    // Find weak areas
    const weakSkills = skillScores
      .filter(s => s.vstepScore < 5)
      .sort((a, b) => a.vstepScore - b.vstepScore);

    for (const skill of weakSkills.slice(0, 2)) {
      recommendations.push(
        `Focus on improving ${skill.skill} skills. ${this.getSkillImprovement(skill.skill, skill.vstepScore)}`
      );
    }

    // Band-specific recommendations
    if (overallBand === 'A1' || overallBand === 'A2') {
      recommendations.push('Build foundational vocabulary and grammar through daily practice.');
      recommendations.push('Start with simple texts and gradually increase difficulty.');
    } else if (overallBand === 'B1') {
      recommendations.push('Expand vocabulary with intermediate-level reading materials.');
      recommendations.push('Practice timed exercises to improve speed and accuracy.');
    } else if (overallBand === 'B2') {
      recommendations.push('Focus on academic and professional English contexts.');
      recommendations.push('Practice complex sentence structures in writing.');
    } else if (overallBand === 'C1') {
      recommendations.push('Refine nuanced language use and idiomatic expressions.');
      recommendations.push('Challenge yourself with authentic native-speaker materials.');
    }

    return recommendations.slice(0, 5);
  }

  /**
   * Get skill-specific improvement suggestion
   */
  private getSkillImprovement(skill: string, score: number): string {
    const improvements = {
      reading: score < 4
        ? 'Start with graded readers and focus on building vocabulary.'
        : 'Practice scanning and skimming techniques for efficiency.',
      listening: score < 4
        ? 'Listen to slow, clear speech with transcripts available.'
        : 'Challenge yourself with various accents and faster speech.',
      writing: score < 4
        ? 'Focus on paragraph structure and basic connectors.'
        : 'Work on argument development and sophisticated vocabulary.',
      speaking: score < 4
        ? 'Practice pronunciation with shadowing exercises.'
        : 'Focus on fluency and spontaneous speech production.',
    };

    return improvements[skill] || 'Continue regular practice.';
  }

  /**
   * Get feedback for a specific criterion
   */
  private getCriterionFeedback(skill: string, criterion: string, score: number): string {
    const feedbackMap = {
      taskAchievement: {
        high: 'Fully addresses all parts of the task with relevant, well-developed ideas.',
        mid: 'Addresses the task adequately but may lack full development.',
        low: 'Does not fully address the task requirements.',
      },
      coherenceCohesion: {
        high: 'Ideas are logically organized with appropriate cohesive devices.',
        mid: 'Generally coherent but may lack smooth transitions.',
        low: 'Ideas are not clearly organized; lacks coherence.',
      },
      lexicalResource: {
        high: 'Uses a wide range of vocabulary with natural, precise word choice.',
        mid: 'Adequate vocabulary but may have occasional errors.',
        low: 'Limited vocabulary range affecting communication.',
      },
      grammaticalRange: {
        high: 'Uses a wide range of structures accurately and appropriately.',
        mid: 'Good control of grammar with minor errors.',
        low: 'Limited grammatical range with frequent errors.',
      },
      pronunciation: {
        high: 'Clear, accurate pronunciation with natural intonation.',
        mid: 'Generally clear with occasional pronunciation issues.',
        low: 'Pronunciation issues affect understanding.',
      },
      fluency: {
        high: 'Speaks at length with minimal hesitation.',
        mid: 'Generally fluent but with some pauses.',
        low: 'Noticeable pauses and hesitation affect communication.',
      },
    };

    const level = score >= 7 ? 'high' : score >= 5 ? 'mid' : 'low';
    return feedbackMap[criterion]?.[level] || 'Performance at expected level.';
  }

  /**
   * Build section scores object for database storage
   */
  private buildSectionScoresObject(skillScores: SkillScoreDto[]): ExamAttempt['sectionScores'] {
    const result: ExamAttempt['sectionScores'] = {};

    for (const score of skillScores) {
      result[score.skill] = {
        score: score.rawScore,
        correctCount: score.correctCount || 0,
        totalCount: score.totalCount || 0,
        skill: score.skill,
      };
    }

    return result;
  }

  /**
   * Compare current attempt with previous attempts
   */
  async compareWithPrevious(
    attemptId: string,
    userId: string,
  ): Promise<ScoreComparisonDto> {
    const currentScore = await this.calculateFullScore(attemptId);

    // Get previous attempt
    const previousAttempt = await this.attemptRepository.findOne({
      where: {
        userId,
        status: 'completed',
      },
      order: { createdAt: 'DESC' },
      skip: 1,
    });

    let previousScore: VstepOverallScoreDto | undefined;
    if (previousAttempt) {
      previousScore = await this.calculateFullScore(previousAttempt.id);
    }

    // Calculate improvement
    const overallChange = previousScore
      ? currentScore.overallScore - previousScore.overallScore
      : 0;

    const skillChanges: { [skill: string]: number } = {};
    for (const current of currentScore.skillScores) {
      const prev = previousScore?.skillScores.find(s => s.skill === current.skill);
      skillChanges[current.skill] = prev ? current.vstepScore - prev.vstepScore : 0;
    }

    const trend = overallChange > 0.5 ? 'improving' : overallChange < -0.5 ? 'declining' : 'stable';

    // Get user target
    const profile = await this.profileRepository.findOne({
      where: { userId },
    });

    let targetProgress;
    if (profile?.targetLevel) {
      const targetScore = VSTEP_BANDS[profile.targetLevel]?.min || 6;
      targetProgress = {
        targetScore,
        currentScore: currentScore.overallScore,
        percentComplete: Math.min(100, (currentScore.overallScore / targetScore) * 100),
        estimatedSessionsRemaining: Math.max(0, Math.ceil((targetScore - currentScore.overallScore) / 0.5)),
      };
    }

    return {
      current: currentScore,
      previous: previousScore,
      improvement: {
        overallChange,
        skillChanges,
        trend,
      },
      targetProgress,
    };
  }
}
```

### Step 4: Scoring Controller

```typescript
// src/modules/exams/controllers/vstep-scoring.controller.ts
import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { VstepScoringService } from '../services/vstep-scoring.service';
import { VstepOverallScoreDto, ScoreComparisonDto } from '../dto/vstep-scoring.dto';

@ApiTags('VSTEP Scoring')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exams/scoring')
export class VstepScoringController {
  constructor(private readonly scoringService: VstepScoringService) {}

  @Get(':attemptId')
  @ApiOperation({ summary: 'Get full VSTEP score for attempt' })
  async getFullScore(
    @Param('attemptId') attemptId: string,
  ): Promise<VstepOverallScoreDto> {
    return this.scoringService.calculateFullScore(attemptId);
  }

  @Get(':attemptId/comparison')
  @ApiOperation({ summary: 'Compare with previous attempts' })
  async getComparison(
    @Request() req,
    @Param('attemptId') attemptId: string,
  ): Promise<ScoreComparisonDto> {
    return this.scoringService.compareWithPrevious(attemptId, req.user.id);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] VSTEP 0-10 scale scoring works correctly
- [ ] All 4 skills scored with proper weights
- [ ] Band determination matches VSTEP criteria
- [ ] Reading/Listening convert % to VSTEP score
- [ ] Writing/Speaking aggregate AI criteria scores
- [ ] Recommendations are personalized
- [ ] Score comparison with previous attempts

---

## ⏭️ Next Task

→ `BE-024_EXAM_ANALYTICS.md` - Exam Analytics Service
