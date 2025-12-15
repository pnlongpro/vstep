export interface Exam {
  id: string;
  title: string;
  code: string;
  level: "A2" | "B1" | "B2" | "C1";
  skills: string[];
  totalQuestions: number;
  totalDuration: number; // in minutes
  status: "draft" | "published" | "archived";
}

export interface ExamDetail extends Exam {
  description: string;
  sections: ExamSection[];
}

export interface ExamSection {
  id: string;
  skill: "reading" | "listening" | "writing" | "speaking";
  title: string;
  duration: number;
  questions: Question[];
}

export interface Question {
  id: string;
  type: "multiple_choice" | "true_false" | "fill_blank" | "essay" | "speaking_task";
  questionText: string;
  options?: { label: string; text: string }[];
  passage?: string;
  audioUrl?: string;
}

export interface ExamListResponse {
  success: boolean;
  data: Exam[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface StartExamResponse {
  success: boolean;
  data: {
    attemptId: string;
    examDetail: ExamDetail;
    startedAt: string;
  };
}

export interface SubmitExamRequest {
  answers: Record<string, any>;
  timeSpent: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  overallScore: number;
  skillScores: {
    reading?: number;
    listening?: number;
    writing?: number;
    speaking?: number;
  };
  feedback: string;
  submittedAt: string;
}
