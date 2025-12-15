// Export all services from a single entry point
export { examsService } from './exams.service';
export { classesService } from './classes.service';
export { gamificationService } from './gamification.service';
export { notificationsService } from './notifications.service';

export type {
  RandomMockExamRequest,
  RandomMockExamResponse,
  CreateMockExamRequest,
  CreateMockExamResponse,
  SaveExamProgressRequest,
  SubmitExamRequest,
  ExamResult,
  Exercise,
  ExerciseListResponse,
} from './exams.service';

export type {
  CreateClassRequest,
  Class,
  InviteStudentsRequest,
  JoinClassRequest,
  CreateScheduleRequest,
  AttendanceRecord,
  MarkAttendanceRequest,
} from './classes.service';

export type {
  Badge,
  Goal,
  CreateGoalRequest,
  LeaderboardEntry,
} from './gamification.service';

export type {
  Notification,
} from './notifications.service';
