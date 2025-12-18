import { VstepLevel, Skill } from '../../../shared/enums/exam.enum';

/**
 * VSTEP Score Mapping Tables
 * Based on official VSTEP scoring guidelines
 */
export const VSTEP_SCORE_TABLES: Record<
  string,
  Record<VstepLevel, { minCorrect: number; maxCorrect: number; score: number }[]>
> = {
  // Reading: 40 questions total
  reading: {
    A2: [
      { minCorrect: 0, maxCorrect: 10, score: 1 },
      { minCorrect: 11, maxCorrect: 15, score: 2 },
      { minCorrect: 16, maxCorrect: 20, score: 3 },
      { minCorrect: 21, maxCorrect: 25, score: 4 },
      { minCorrect: 26, maxCorrect: 30, score: 5 },
      { minCorrect: 31, maxCorrect: 35, score: 6 },
      { minCorrect: 36, maxCorrect: 40, score: 7 },
    ],
    B1: [
      { minCorrect: 0, maxCorrect: 12, score: 2 },
      { minCorrect: 13, maxCorrect: 18, score: 3 },
      { minCorrect: 19, maxCorrect: 24, score: 4 },
      { minCorrect: 25, maxCorrect: 30, score: 5 },
      { minCorrect: 31, maxCorrect: 35, score: 6 },
      { minCorrect: 36, maxCorrect: 38, score: 7 },
      { minCorrect: 39, maxCorrect: 40, score: 8 },
    ],
    B2: [
      { minCorrect: 0, maxCorrect: 15, score: 3 },
      { minCorrect: 16, maxCorrect: 22, score: 4 },
      { minCorrect: 23, maxCorrect: 28, score: 5 },
      { minCorrect: 29, maxCorrect: 33, score: 6 },
      { minCorrect: 34, maxCorrect: 37, score: 7 },
      { minCorrect: 38, maxCorrect: 39, score: 8 },
      { minCorrect: 40, maxCorrect: 40, score: 9 },
    ],
    C1: [
      { minCorrect: 0, maxCorrect: 18, score: 4 },
      { minCorrect: 19, maxCorrect: 25, score: 5 },
      { minCorrect: 26, maxCorrect: 31, score: 6 },
      { minCorrect: 32, maxCorrect: 36, score: 7 },
      { minCorrect: 37, maxCorrect: 39, score: 8 },
      { minCorrect: 40, maxCorrect: 40, score: 9 },
    ],
  },
  // Listening: 35 questions total
  listening: {
    A2: [
      { minCorrect: 0, maxCorrect: 8, score: 1 },
      { minCorrect: 9, maxCorrect: 12, score: 2 },
      { minCorrect: 13, maxCorrect: 17, score: 3 },
      { minCorrect: 18, maxCorrect: 22, score: 4 },
      { minCorrect: 23, maxCorrect: 27, score: 5 },
      { minCorrect: 28, maxCorrect: 32, score: 6 },
      { minCorrect: 33, maxCorrect: 35, score: 7 },
    ],
    B1: [
      { minCorrect: 0, maxCorrect: 10, score: 2 },
      { minCorrect: 11, maxCorrect: 15, score: 3 },
      { minCorrect: 16, maxCorrect: 20, score: 4 },
      { minCorrect: 21, maxCorrect: 25, score: 5 },
      { minCorrect: 26, maxCorrect: 30, score: 6 },
      { minCorrect: 31, maxCorrect: 33, score: 7 },
      { minCorrect: 34, maxCorrect: 35, score: 8 },
    ],
    B2: [
      { minCorrect: 0, maxCorrect: 12, score: 3 },
      { minCorrect: 13, maxCorrect: 18, score: 4 },
      { minCorrect: 19, maxCorrect: 23, score: 5 },
      { minCorrect: 24, maxCorrect: 28, score: 6 },
      { minCorrect: 29, maxCorrect: 32, score: 7 },
      { minCorrect: 33, maxCorrect: 34, score: 8 },
      { minCorrect: 35, maxCorrect: 35, score: 9 },
    ],
    C1: [
      { minCorrect: 0, maxCorrect: 15, score: 4 },
      { minCorrect: 16, maxCorrect: 21, score: 5 },
      { minCorrect: 22, maxCorrect: 26, score: 6 },
      { minCorrect: 27, maxCorrect: 31, score: 7 },
      { minCorrect: 32, maxCorrect: 34, score: 8 },
      { minCorrect: 35, maxCorrect: 35, score: 9 },
    ],
  },
};

export class VstepScoreCalculator {
  /**
   * Calculate VSTEP score from correct answers
   */
  static calculateVstepScore(skill: Skill, level: VstepLevel, correctCount: number): number {
    const skillKey = skill.toLowerCase();
    const scoreTable = VSTEP_SCORE_TABLES[skillKey]?.[level];

    if (!scoreTable) {
      // For writing/speaking, return 0 - handled by AI scoring
      return 0;
    }

    for (const range of scoreTable) {
      if (correctCount >= range.minCorrect && correctCount <= range.maxCorrect) {
        return range.score;
      }
    }

    // Default to lowest score if no match
    return scoreTable[0]?.score || 0;
  }

  /**
   * Calculate percentage score
   */
  static calculatePercentage(correct: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  }

  /**
   * Convert percentage to 10-point scale
   */
  static percentageToScore(percentage: number): number {
    return Math.round((percentage / 10) * 10) / 10; // Round to 1 decimal
  }

  /**
   * Get performance level based on percentage
   */
  static getPerformanceLevel(percentage: number): string {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 70) return 'average';
    if (percentage >= 60) return 'below_average';
    return 'needs_improvement';
  }

  /**
   * Generate suggestions based on results
   */
  static generateSuggestions(
    skill: Skill,
    level: VstepLevel,
    percentage: number,
    sectionResults: { partNumber?: number; percentage: number }[],
  ): string[] {
    const suggestions: string[] = [];
    const perfLevel = this.getPerformanceLevel(percentage);

    // Overall suggestions
    if (perfLevel === 'needs_improvement') {
      suggestions.push(`Bạn cần luyện tập thêm kỹ năng ${skill}. Hãy bắt đầu với các bài tập cơ bản.`);
    } else if (perfLevel === 'below_average') {
      suggestions.push(`Kết quả của bạn ở mức dưới trung bình. Hãy tập trung vào các dạng câu hỏi hay sai.`);
    } else if (perfLevel === 'average') {
      suggestions.push(`Bạn đang tiến bộ tốt! Tiếp tục luyện tập để cải thiện thêm.`);
    } else if (perfLevel === 'good') {
      suggestions.push(`Kết quả tốt! Hãy thử thách bản thân với các bài tập khó hơn.`);
    } else {
      suggestions.push(`Xuất sắc! Bạn đã sẵn sàng cho bài thi thật.`);
    }

    // Part-specific suggestions
    const weakParts = sectionResults
      .filter((s) => s.percentage < 60 && s.partNumber)
      .sort((a, b) => a.percentage - b.percentage);

    for (const part of weakParts.slice(0, 2)) {
      suggestions.push(`Part ${part.partNumber} cần cải thiện (${part.percentage}%). Hãy luyện tập thêm dạng bài này.`);
    }

    // Level-specific suggestions
    if (percentage >= 80 && level !== VstepLevel.C1) {
      const nextLevel = this.getNextLevel(level);
      suggestions.push(`Bạn có thể thử thách bản thân với cấp độ ${nextLevel}.`);
    }

    return suggestions;
  }

  private static getNextLevel(current: VstepLevel): VstepLevel {
    const levels: VstepLevel[] = [VstepLevel.A2, VstepLevel.B1, VstepLevel.B2, VstepLevel.C1];
    const index = levels.indexOf(current);
    return levels[Math.min(index + 1, levels.length - 1)];
  }
}
