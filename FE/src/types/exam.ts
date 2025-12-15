export interface Exam {
  id: string;
  title: string;
  code: string;
  level: "A2" | "B1" | "B2" | "C1";
  skills: string[];
  totalQuestions: number;
  totalDuration: number;
  status: "draft" | "published" | "archived";
}

export interface ExamSection {
  id: string;
  examId: string;
  skill: "reading" | "listening" | "writing" | "speaking";
  title: string;
  duration: number;
  orderNumber: number;
}

export interface Question {
  id: string;
  skill: string;
  questionType: string;
  questionText: string;
  options?: Record<string, any>;
  correctAnswer?: string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  status: "in_progress" | "completed" | "abandoned";
  startTime: Date;
  endTime?: Date;
  currentSection?: number;
}

export interface ExamResult {
  id: string;
  attemptId: string;
  overallScore: number;
  skillScores: Record<string, number>;
  feedback: string;
  submittedAt: Date;
}
