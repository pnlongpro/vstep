import { DataSource } from 'typeorm';
import { Class, VstepLevel, ClassStatus } from '../../../modules/classes/entities/class.entity';
import { ClassStudent, EnrollmentStatus } from '../../../modules/classes/entities/class-student.entity';
import { ClassMaterial, MaterialType } from '../../../modules/classes/entities/class-material.entity';
import { ClassSchedule, ScheduleStatus } from '../../../modules/classes/entities/class-schedule.entity';
import { ClassAnnouncement } from '../../../modules/classes/entities/class-announcement.entity';
import { ClassAssignment, AssignmentSkill, AssignmentStatus } from '../../../modules/classes/entities/class-assignment.entity';
import { ClassAssignmentSubmission, SubmissionStatus } from '../../../modules/classes/entities/class-assignment-submission.entity';
import { USER_IDS } from './user.seed';

// Fixed UUIDs for classes
export const CLASS_IDS = {
  CLASS_01: '55555555-5555-5555-5555-555555555001',
  CLASS_02: '55555555-5555-5555-5555-555555555002',
  CLASS_03: '55555555-5555-5555-5555-555555555003',
  CLASS_04: '55555555-5555-5555-5555-555555555004',
  CLASS_05: '55555555-5555-5555-5555-555555555005',
  CLASS_06: '55555555-5555-5555-5555-555555555006',
  CLASS_07: '55555555-5555-5555-5555-555555555007',
  CLASS_08: '55555555-5555-5555-5555-555555555008',
  CLASS_09: '55555555-5555-5555-5555-555555555009',
  CLASS_10: '55555555-5555-5555-5555-555555555010',
};

// Fixed UUIDs for class materials
export const MATERIAL_IDS = {
  MATERIAL_01: '66666666-6666-6666-6666-666666666001',
  MATERIAL_02: '66666666-6666-6666-6666-666666666002',
  MATERIAL_03: '66666666-6666-6666-6666-666666666003',
  MATERIAL_04: '66666666-6666-6666-6666-666666666004',
  MATERIAL_05: '66666666-6666-6666-6666-666666666005',
  MATERIAL_06: '66666666-6666-6666-6666-666666666006',
};

// Fixed UUIDs for schedules
export const SCHEDULE_IDS = {
  SCHEDULE_01: '77777777-7777-7777-7777-777777777001',
  SCHEDULE_02: '77777777-7777-7777-7777-777777777002',
  SCHEDULE_03: '77777777-7777-7777-7777-777777777003',
  SCHEDULE_04: '77777777-7777-7777-7777-777777777004',
  SCHEDULE_05: '77777777-7777-7777-7777-777777777005',
  SCHEDULE_06: '77777777-7777-7777-7777-777777777006',
};

// Fixed UUIDs for announcements
export const ANNOUNCEMENT_IDS = {
  ANNOUNCEMENT_01: '88888888-8888-8888-8888-888888888001',
  ANNOUNCEMENT_02: '88888888-8888-8888-8888-888888888002',
  ANNOUNCEMENT_03: '88888888-8888-8888-8888-888888888003',
  ANNOUNCEMENT_04: '88888888-8888-8888-8888-888888888004',
};

// Fixed UUIDs for assignments
export const ASSIGNMENT_IDS = {
  ASSIGNMENT_01: '99999999-9999-9999-9999-999999999001',
  ASSIGNMENT_02: '99999999-9999-9999-9999-999999999002',
  ASSIGNMENT_03: '99999999-9999-9999-9999-999999999003',
  ASSIGNMENT_04: '99999999-9999-9999-9999-999999999004',
  ASSIGNMENT_05: '99999999-9999-9999-9999-999999999005',
};

// Fixed UUIDs for submissions
export const SUBMISSION_IDS = {
  SUBMISSION_01: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001',
  SUBMISSION_02: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa002',
  SUBMISSION_03: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003',
  SUBMISSION_04: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa004',
  SUBMISSION_05: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa005',
  SUBMISSION_06: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa006',
  SUBMISSION_07: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa007',
  SUBMISSION_08: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa008',
};

// Generate random invite code
function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Classes data based on UI-Template mock data
const classesData: Partial<Class>[] = [
  {
    id: CLASS_IDS.CLASS_01,
    name: 'VSTEP Foundation - Lop sang',
    description: 'Lop hoc nen tang VSTEP danh cho hoc vien moi bat dau. Tap trung vao cac ky nang co ban Reading, Listening.',
    teacherId: USER_IDS.TEACHER_NGUYEN,
    level: VstepLevel.A2,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-04-15'),
    maxStudents: 35,
    inviteCode: 'FOUN2401',
    status: ClassStatus.ACTIVE,
    schedule: [
      { day: 'T2', startTime: '08:00', endTime: '10:00' },
      { day: 'T4', startTime: '08:00', endTime: '10:00' },
      { day: 'T6', startTime: '08:00', endTime: '10:00' },
    ],
  },
  {
    id: CLASS_IDS.CLASS_02,
    name: 'VSTEP Starter - Lop chieu',
    description: 'Lop khoi dong VSTEP, phu hop cho nguoi moi hoc tieng Anh. Phuong phap hoc tap nhe nhang, de tiep can.',
    teacherId: USER_IDS.TEACHER_TRAN,
    level: VstepLevel.A2,
    startDate: new Date('2024-02-20'),
    endDate: new Date('2024-05-20'),
    maxStudents: 30,
    inviteCode: 'STAR2402',
    status: ClassStatus.ACTIVE,
    schedule: [
      { day: 'T3', startTime: '14:00', endTime: '16:00' },
      { day: 'T5', startTime: '14:00', endTime: '16:00' },
    ],
  },
  {
    id: CLASS_IDS.CLASS_03,
    name: 'VSTEP Builder - Lop toi',
    description: 'Lop xay dung nen tang vung chac cho VSTEP B1. Tap trung ren luyen ca 4 ky nang.',
    teacherId: USER_IDS.TEACHER_LE,
    level: VstepLevel.B1,
    startDate: new Date('2024-03-10'),
    endDate: new Date('2024-06-10'),
    maxStudents: 30,
    inviteCode: 'BULD2403',
    status: ClassStatus.ACTIVE,
    schedule: [
      { day: 'T2', startTime: '19:00', endTime: '21:00' },
      { day: 'T4', startTime: '19:00', endTime: '21:00' },
    ],
  },
  {
    id: CLASS_IDS.CLASS_04,
    name: 'VSTEP Complete - Lop cuoi tuan',
    description: 'Khoa hoc toan dien VSTEP B1-B2, phu hop cho nguoi di lam. Hoc vao cuoi tuan, thoi gian linh hoat.',
    teacherId: USER_IDS.TEACHER_NGUYEN,
    level: VstepLevel.B1,
    startDate: new Date('2024-04-05'),
    endDate: new Date('2024-07-05'),
    maxStudents: 40,
    inviteCode: 'COMP2404',
    status: ClassStatus.ACTIVE,
    schedule: [
      { day: 'T7', startTime: '09:00', endTime: '12:00' },
      { day: 'CN', startTime: '09:00', endTime: '12:00' },
    ],
  },
  {
    id: CLASS_IDS.CLASS_05,
    name: 'VSTEP Developer - Lop online',
    description: 'Khoa hoc online VSTEP B2 danh cho lap trinh vien va ky su. Giao trinh chuyen biet voi tu vung IT.',
    teacherId: USER_IDS.TEACHER_TRAN,
    level: VstepLevel.B2,
    startDate: new Date('2024-05-12'),
    endDate: new Date('2024-08-12'),
    maxStudents: 25,
    inviteCode: 'DEVL2405',
    status: ClassStatus.ACTIVE,
    schedule: [
      { day: 'T3', startTime: '20:00', endTime: '22:00' },
      { day: 'T5', startTime: '20:00', endTime: '22:00' },
    ],
  },
  {
    id: CLASS_IDS.CLASS_06,
    name: 'VSTEP Practice - Lop sang T2-T4-T6',
    description: 'Lop luyen de VSTEP B1-B2 chuyen sau. Giai de thuc te, phan tich loi sai, cai thien diem yeu.',
    teacherId: USER_IDS.TEACHER_LE,
    level: VstepLevel.B1,
    startDate: new Date('2024-06-25'),
    endDate: new Date('2024-09-25'),
    maxStudents: 35,
    inviteCode: 'PRAC2406',
    status: ClassStatus.ACTIVE,
    schedule: [
      { day: 'T2', startTime: '08:30', endTime: '10:30' },
      { day: 'T4', startTime: '08:30', endTime: '10:30' },
      { day: 'T6', startTime: '08:30', endTime: '10:30' },
    ],
  },
  {
    id: CLASS_IDS.CLASS_07,
    name: 'VSTEP Intensive - Lop toi T3-T5-T7',
    description: 'Khoa hoc VSTEP B2-C1 cuong do cao. Cam ket dau ra, lo trinh ro rang, ho tro 1-1.',
    teacherId: USER_IDS.TEACHER_NGUYEN,
    level: VstepLevel.B2,
    startDate: new Date('2024-07-15'),
    endDate: new Date('2024-10-15'),
    maxStudents: 30,
    inviteCode: 'INTS2407',
    status: ClassStatus.ACTIVE,
    schedule: [
      { day: 'T3', startTime: '19:00', endTime: '21:00' },
      { day: 'T5', startTime: '19:00', endTime: '21:00' },
      { day: 'T7', startTime: '19:00', endTime: '21:00' },
    ],
  },
  {
    id: CLASS_IDS.CLASS_08,
    name: 'VSTEP Booster - Lop tang toc',
    description: 'Khoa luyen thi nuoc rut VSTEP B2. Danh cho hoc vien can thi gap trong 1-2 thang.',
    teacherId: USER_IDS.TEACHER_TRAN,
    level: VstepLevel.B2,
    startDate: new Date('2024-08-20'),
    endDate: new Date('2024-10-20'),
    maxStudents: 25,
    inviteCode: 'BOOS2408',
    status: ClassStatus.ACTIVE,
    schedule: [
      { day: 'T2', startTime: '18:00', endTime: '20:00' },
      { day: 'T3', startTime: '18:00', endTime: '20:00' },
      { day: 'T4', startTime: '18:00', endTime: '20:00' },
      { day: 'T5', startTime: '18:00', endTime: '20:00' },
    ],
  },
  {
    id: CLASS_IDS.CLASS_09,
    name: 'VSTEP Premium - Lop VIP',
    description: 'Khoa hoc VSTEP B2-C1 cao cap voi lop nho (toi da 15 nguoi). Giao vien hang dau, tai lieu doc quyen.',
    teacherId: USER_IDS.TEACHER_LE,
    level: VstepLevel.C1,
    startDate: new Date('2024-09-18'),
    endDate: new Date('2024-12-18'),
    maxStudents: 15,
    inviteCode: 'PREM2409',
    status: ClassStatus.ACTIVE,
    schedule: [
      { day: 'T2', startTime: '19:30', endTime: '21:30' },
      { day: 'T4', startTime: '19:30', endTime: '21:30' },
      { day: 'T6', startTime: '19:30', endTime: '21:30' },
    ],
  },
  {
    id: CLASS_IDS.CLASS_10,
    name: 'VSTEP Master - Lop cao cap',
    description: 'Khoa hoc da hoan thanh. Tat ca hoc vien dat muc tieu C1 voi diem trung binh 8.0+',
    teacherId: USER_IDS.TEACHER_NGUYEN,
    level: VstepLevel.C1,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
    maxStudents: 30,
    inviteCode: 'MAST2401',
    status: ClassStatus.COMPLETED,
    schedule: [
      { day: 'T3', startTime: '19:00', endTime: '21:00' },
      { day: 'T5', startTime: '19:00', endTime: '21:00' },
    ],
  },
];

// Class students enrollment data
interface ClassStudentSeedData {
  classId: string;
  studentId: string;
  status: EnrollmentStatus;
  progress: number;
  lastActivityAt?: Date;
}

const classStudentsData: ClassStudentSeedData[] = [
  // Class 01 - Foundation (5 students)
  { classId: CLASS_IDS.CLASS_01, studentId: USER_IDS.STUDENT_01, status: EnrollmentStatus.ACTIVE, progress: 75, lastActivityAt: new Date('2024-12-20T10:00:00') },
  { classId: CLASS_IDS.CLASS_01, studentId: USER_IDS.STUDENT_02, status: EnrollmentStatus.ACTIVE, progress: 82, lastActivityAt: new Date('2024-12-20T08:00:00') },
  { classId: CLASS_IDS.CLASS_01, studentId: USER_IDS.STUDENT_03, status: EnrollmentStatus.ACTIVE, progress: 68, lastActivityAt: new Date('2024-12-19T15:00:00') },
  { classId: CLASS_IDS.CLASS_01, studentId: USER_IDS.STUDENT_04, status: EnrollmentStatus.ACTIVE, progress: 90, lastActivityAt: new Date('2024-12-20T12:00:00') },
  { classId: CLASS_IDS.CLASS_01, studentId: USER_IDS.STUDENT_05, status: EnrollmentStatus.DROPPED, progress: 35, lastActivityAt: new Date('2024-11-15T09:00:00') },

  // Class 02 - Starter (4 students)
  { classId: CLASS_IDS.CLASS_02, studentId: USER_IDS.STUDENT_06, status: EnrollmentStatus.ACTIVE, progress: 45, lastActivityAt: new Date('2024-12-20T14:00:00') },
  { classId: CLASS_IDS.CLASS_02, studentId: USER_IDS.STUDENT_07, status: EnrollmentStatus.ACTIVE, progress: 52, lastActivityAt: new Date('2024-12-19T16:00:00') },
  { classId: CLASS_IDS.CLASS_02, studentId: USER_IDS.STUDENT_08, status: EnrollmentStatus.ACTIVE, progress: 38, lastActivityAt: new Date('2024-12-18T10:00:00') },
  { classId: CLASS_IDS.CLASS_02, studentId: USER_IDS.STUDENT_01, status: EnrollmentStatus.ACTIVE, progress: 60, lastActivityAt: new Date('2024-12-20T09:00:00') },

  // Class 03 - Builder (5 students)
  { classId: CLASS_IDS.CLASS_03, studentId: USER_IDS.STUDENT_09, status: EnrollmentStatus.ACTIVE, progress: 80, lastActivityAt: new Date('2024-12-20T19:00:00') },
  { classId: CLASS_IDS.CLASS_03, studentId: USER_IDS.STUDENT_10, status: EnrollmentStatus.ACTIVE, progress: 72, lastActivityAt: new Date('2024-12-20T20:00:00') },
  { classId: CLASS_IDS.CLASS_03, studentId: USER_IDS.STUDENT_02, status: EnrollmentStatus.ACTIVE, progress: 85, lastActivityAt: new Date('2024-12-20T21:00:00') },
  { classId: CLASS_IDS.CLASS_03, studentId: USER_IDS.STUDENT_03, status: EnrollmentStatus.ACTIVE, progress: 65, lastActivityAt: new Date('2024-12-19T20:00:00') },
  { classId: CLASS_IDS.CLASS_03, studentId: USER_IDS.STUDENT_04, status: EnrollmentStatus.INACTIVE, progress: 55, lastActivityAt: new Date('2024-12-01T19:00:00') },

  // Class 04 - Complete (3 students)
  { classId: CLASS_IDS.CLASS_04, studentId: USER_IDS.STUDENT_05, status: EnrollmentStatus.ACTIVE, progress: 55, lastActivityAt: new Date('2024-12-21T10:00:00') },
  { classId: CLASS_IDS.CLASS_04, studentId: USER_IDS.STUDENT_06, status: EnrollmentStatus.ACTIVE, progress: 48, lastActivityAt: new Date('2024-12-21T11:00:00') },
  { classId: CLASS_IDS.CLASS_04, studentId: USER_IDS.STUDENT_07, status: EnrollmentStatus.ACTIVE, progress: 62, lastActivityAt: new Date('2024-12-21T09:00:00') },

  // Class 05 - Developer (4 students)
  { classId: CLASS_IDS.CLASS_05, studentId: USER_IDS.STUDENT_08, status: EnrollmentStatus.ACTIVE, progress: 70, lastActivityAt: new Date('2024-12-20T22:00:00') },
  { classId: CLASS_IDS.CLASS_05, studentId: USER_IDS.STUDENT_09, status: EnrollmentStatus.ACTIVE, progress: 75, lastActivityAt: new Date('2024-12-20T21:30:00') },
  { classId: CLASS_IDS.CLASS_05, studentId: USER_IDS.STUDENT_10, status: EnrollmentStatus.ACTIVE, progress: 68, lastActivityAt: new Date('2024-12-19T22:00:00') },
  { classId: CLASS_IDS.CLASS_05, studentId: USER_IDS.STUDENT_01, status: EnrollmentStatus.ACTIVE, progress: 82, lastActivityAt: new Date('2024-12-20T20:00:00') },

  // Class 07 - Intensive (3 students)
  { classId: CLASS_IDS.CLASS_07, studentId: USER_IDS.STUDENT_02, status: EnrollmentStatus.ACTIVE, progress: 90, lastActivityAt: new Date('2024-12-20T21:00:00') },
  { classId: CLASS_IDS.CLASS_07, studentId: USER_IDS.STUDENT_03, status: EnrollmentStatus.ACTIVE, progress: 88, lastActivityAt: new Date('2024-12-20T20:30:00') },
  { classId: CLASS_IDS.CLASS_07, studentId: USER_IDS.STUDENT_04, status: EnrollmentStatus.ACTIVE, progress: 92, lastActivityAt: new Date('2024-12-20T21:30:00') },

  // Class 09 - Premium (2 students)
  { classId: CLASS_IDS.CLASS_09, studentId: USER_IDS.STUDENT_05, status: EnrollmentStatus.ACTIVE, progress: 75, lastActivityAt: new Date('2024-12-20T21:30:00') },
  { classId: CLASS_IDS.CLASS_09, studentId: USER_IDS.STUDENT_06, status: EnrollmentStatus.ACTIVE, progress: 78, lastActivityAt: new Date('2024-12-20T21:00:00') },

  // Class 10 - Master (Completed - 4 students)
  { classId: CLASS_IDS.CLASS_10, studentId: USER_IDS.STUDENT_07, status: EnrollmentStatus.COMPLETED, progress: 100, lastActivityAt: new Date('2024-06-30T21:00:00') },
  { classId: CLASS_IDS.CLASS_10, studentId: USER_IDS.STUDENT_08, status: EnrollmentStatus.COMPLETED, progress: 100, lastActivityAt: new Date('2024-06-30T21:00:00') },
  { classId: CLASS_IDS.CLASS_10, studentId: USER_IDS.STUDENT_09, status: EnrollmentStatus.COMPLETED, progress: 100, lastActivityAt: new Date('2024-06-30T21:00:00') },
  { classId: CLASS_IDS.CLASS_10, studentId: USER_IDS.STUDENT_10, status: EnrollmentStatus.COMPLETED, progress: 100, lastActivityAt: new Date('2024-06-30T21:00:00') },
];

// Class materials data
const classMaterialsData: Partial<ClassMaterial>[] = [
  // Class 01 materials
  {
    id: MATERIAL_IDS.MATERIAL_01,
    classId: CLASS_IDS.CLASS_01,
    title: 'Slide bài giảng - Reading Strategies',
    description: 'Các chiến lược đọc hiểu: Skimming, Scanning, Intensive Reading',
    type: MaterialType.DOCUMENT,
    fileName: 'reading-strategies.pdf',
    fileSize: 2621440, // 2.5 MB
    mimeType: 'application/pdf',
    uploadedBy: USER_IDS.TEACHER_NGUYEN,
    isVisible: true,
    downloadCount: 23,
  },
  {
    id: MATERIAL_IDS.MATERIAL_02,
    classId: CLASS_IDS.CLASS_01,
    title: 'Audio - Listening Practice Unit 5',
    description: 'Bài nghe thực hành Unit 5: University Life',
    type: MaterialType.AUDIO,
    fileName: 'listening-unit5.mp3',
    fileSize: 15728640, // 15 MB
    mimeType: 'audio/mpeg',
    uploadedBy: USER_IDS.TEACHER_NGUYEN,
    isVisible: true,
    downloadCount: 20,
  },
  {
    id: MATERIAL_IDS.MATERIAL_03,
    classId: CLASS_IDS.CLASS_01,
    title: 'Video - Speaking Tips & Tricks',
    description: 'Các mẹo và kỹ thuật cho phần thi Speaking VSTEP',
    type: MaterialType.VIDEO,
    fileName: 'speaking-tips.mp4',
    fileSize: 47185920, // 45 MB
    mimeType: 'video/mp4',
    uploadedBy: USER_IDS.TEACHER_NGUYEN,
    isVisible: true,
    downloadCount: 18,
  },

  // Class 03 materials  
  {
    id: MATERIAL_IDS.MATERIAL_04,
    classId: CLASS_IDS.CLASS_03,
    title: 'Writing Task 2 - Essay Templates',
    description: 'Các mẫu bài luận Task 2 với cấu trúc và từ vựng nâng cao',
    type: MaterialType.DOCUMENT,
    fileName: 'essay-templates.pdf',
    fileSize: 3145728, // 3 MB
    mimeType: 'application/pdf',
    uploadedBy: USER_IDS.TEACHER_LE,
    isVisible: true,
    downloadCount: 15,
  },
  {
    id: MATERIAL_IDS.MATERIAL_05,
    classId: CLASS_IDS.CLASS_03,
    title: 'Grammar Reference - B1 Level',
    description: 'Tài liệu tham khảo ngữ pháp trình độ B1',
    type: MaterialType.DOCUMENT,
    fileName: 'grammar-b1.pdf',
    fileSize: 1572864, // 1.5 MB
    mimeType: 'application/pdf',
    uploadedBy: USER_IDS.TEACHER_LE,
    isVisible: true,
    downloadCount: 28,
  },

  // Class 07 materials
  {
    id: MATERIAL_IDS.MATERIAL_06,
    classId: CLASS_IDS.CLASS_07,
    title: 'VSTEP B2 Practice Tests - Full Set',
    description: 'Bộ đề thi thử VSTEP B2 đầy đủ 4 kỹ năng với đáp án chi tiết',
    type: MaterialType.DOCUMENT,
    fileName: 'b2-practice-tests.pdf',
    fileSize: 10485760, // 10 MB
    mimeType: 'application/pdf',
    uploadedBy: USER_IDS.TEACHER_NGUYEN,
    isVisible: true,
    downloadCount: 45,
  },
];

// Class schedules data
const classSchedulesData: Partial<ClassSchedule>[] = [
  // Class 01 schedules
  {
    id: SCHEDULE_IDS.SCHEDULE_01,
    classId: CLASS_IDS.CLASS_01,
    title: 'Reading Strategies & Techniques',
    description: 'Học các kỹ thuật đọc hiểu: skimming, scanning',
    date: new Date('2024-12-20'),
    startTime: '08:00',
    endTime: '10:00',
    status: ScheduleStatus.COMPLETED,
    zoomLink: 'https://zoom.us/j/123456789',
    attendanceCount: 22,
  },
  {
    id: SCHEDULE_IDS.SCHEDULE_02,
    classId: CLASS_IDS.CLASS_01,
    title: 'Listening Practice - Unit 5',
    description: 'Luyện nghe với các bài tập về University Life',
    date: new Date('2024-12-22'),
    startTime: '08:00',
    endTime: '10:00',
    status: ScheduleStatus.COMPLETED,
    zoomLink: 'https://zoom.us/j/123456789',
    attendanceCount: 20,
  },
  {
    id: SCHEDULE_IDS.SCHEDULE_03,
    classId: CLASS_IDS.CLASS_01,
    title: 'Writing Task 2 - Essay Structure',
    description: 'Cấu trúc bài luận Task 2 và cách triển khai ý',
    date: new Date('2024-12-24'),
    startTime: '08:00',
    endTime: '10:00',
    status: ScheduleStatus.UPCOMING,
    zoomLink: 'https://zoom.us/j/123456789',
    attendanceCount: 0,
  },
  // Class 03 schedules
  {
    id: SCHEDULE_IDS.SCHEDULE_04,
    classId: CLASS_IDS.CLASS_03,
    title: 'Speaking Part 1 & 2 Practice',
    description: 'Luyện tập Speaking Part 1 và Part 2 với feedback',
    date: new Date('2024-12-23'),
    startTime: '19:00',
    endTime: '21:00',
    status: ScheduleStatus.COMPLETED,
    zoomLink: 'https://zoom.us/j/987654321',
    attendanceCount: 18,
  },
  {
    id: SCHEDULE_IDS.SCHEDULE_05,
    classId: CLASS_IDS.CLASS_03,
    title: 'Grammar Review - Conditionals',
    description: 'Ôn tập ngữ pháp: Câu điều kiện loại 1, 2, 3',
    date: new Date('2024-12-25'),
    startTime: '19:00',
    endTime: '21:00',
    status: ScheduleStatus.UPCOMING,
    zoomLink: 'https://zoom.us/j/987654321',
    attendanceCount: 0,
  },
  {
    id: SCHEDULE_IDS.SCHEDULE_06,
    classId: CLASS_IDS.CLASS_03,
    title: 'Mock Test Review',
    description: 'Chữa đề thi thử và phân tích lỗi sai',
    date: new Date('2024-12-27'),
    startTime: '19:00',
    endTime: '21:00',
    status: ScheduleStatus.UPCOMING,
    zoomLink: 'https://zoom.us/j/987654321',
    attendanceCount: 0,
  },
];

// Class announcements data
const classAnnouncementsData: Partial<ClassAnnouncement>[] = [
  {
    id: ANNOUNCEMENT_IDS.ANNOUNCEMENT_01,
    classId: CLASS_IDS.CLASS_01,
    title: 'Thay đổi lịch học ngày 26/12',
    content: 'Lớp học ngày 26/12 sẽ chuyển sang 19:30-21:30 do giáo viên có việc đột xuất. Mong các bạn thông cảm và sắp xếp thời gian.',
    authorId: USER_IDS.TEACHER_NGUYEN,
    isPinned: true,
  },
  {
    id: ANNOUNCEMENT_IDS.ANNOUNCEMENT_02,
    classId: CLASS_IDS.CLASS_01,
    title: 'Bài tập mới đã được giao',
    content: 'Các bạn vào tab Bài tập để xem 3 bài mới được giao hôm nay. Deadline: 28/12/2024.',
    authorId: USER_IDS.TEACHER_NGUYEN,
    isPinned: false,
  },
  {
    id: ANNOUNCEMENT_IDS.ANNOUNCEMENT_03,
    classId: CLASS_IDS.CLASS_03,
    title: 'Lịch thi Mock Test',
    content: 'Mock Test VSTEP B1 sẽ được tổ chức vào ngày 30/12/2024 từ 9:00 đến 12:00. Các bạn chuẩn bị tinh thần nhé!',
    authorId: USER_IDS.TEACHER_LE,
    isPinned: true,
  },
  {
    id: ANNOUNCEMENT_IDS.ANNOUNCEMENT_04,
    classId: CLASS_IDS.CLASS_03,
    title: 'Tài liệu Writing mới',
    content: 'Đã upload tài liệu Writing Task 2 - Essay Templates trong phần Tài liệu. Các bạn download về học nhé.',
    authorId: USER_IDS.TEACHER_LE,
    isPinned: false,
  },
];

// Class assignments data
const classAssignmentsData: Partial<ClassAssignment>[] = [
  {
    id: ASSIGNMENT_IDS.ASSIGNMENT_01,
    classId: CLASS_IDS.CLASS_01,
    title: 'Reading Practice - Academic Texts',
    description: 'Đọc và trả lời câu hỏi về 3 đoạn văn học thuật',
    skill: AssignmentSkill.READING,
    dueDate: new Date('2024-12-28'),
    status: AssignmentStatus.PUBLISHED,
    totalPoints: 100,
    createdBy: USER_IDS.TEACHER_NGUYEN,
    submissionCount: 3,
    gradedCount: 1,
  },
  {
    id: ASSIGNMENT_IDS.ASSIGNMENT_02,
    classId: CLASS_IDS.CLASS_01,
    title: 'Essay Writing - Technology Impact',
    description: 'Viết một bài luận 250-300 từ về tác động của công nghệ đến cuộc sống',
    skill: AssignmentSkill.WRITING,
    dueDate: new Date('2024-12-30'),
    status: AssignmentStatus.PUBLISHED,
    totalPoints: 100,
    createdBy: USER_IDS.TEACHER_NGUYEN,
    submissionCount: 4,
    gradedCount: 2,
  },
  {
    id: ASSIGNMENT_IDS.ASSIGNMENT_03,
    classId: CLASS_IDS.CLASS_01,
    title: 'Listening - University Life',
    description: 'Nghe và hoàn thành các câu hỏi về chủ đề University Life',
    skill: AssignmentSkill.LISTENING,
    dueDate: new Date('2024-12-25'),
    status: AssignmentStatus.PUBLISHED,
    totalPoints: 100,
    createdBy: USER_IDS.TEACHER_NGUYEN,
    submissionCount: 4,
    gradedCount: 4,
  },
  {
    id: ASSIGNMENT_IDS.ASSIGNMENT_04,
    classId: CLASS_IDS.CLASS_03,
    title: 'Speaking Part 2 - Describe a place',
    description: 'Ghi âm bài nói Part 2 về chủ đề "Describe a place you have visited"',
    skill: AssignmentSkill.SPEAKING,
    dueDate: new Date('2024-12-27'),
    status: AssignmentStatus.PUBLISHED,
    totalPoints: 100,
    createdBy: USER_IDS.TEACHER_LE,
    submissionCount: 5,
    gradedCount: 2,
  },
  {
    id: ASSIGNMENT_IDS.ASSIGNMENT_05,
    classId: CLASS_IDS.CLASS_03,
    title: 'Grammar Quiz - Conditionals',
    description: 'Bài kiểm tra ngữ pháp về câu điều kiện',
    skill: AssignmentSkill.MIXED,
    dueDate: new Date('2024-12-26'),
    status: AssignmentStatus.PUBLISHED,
    totalPoints: 50,
    createdBy: USER_IDS.TEACHER_LE,
    submissionCount: 4,
    gradedCount: 4,
  },
];

// Assignment submissions data
const assignmentSubmissionsData: Partial<ClassAssignmentSubmission>[] = [
  // Writing submissions - Pending
  {
    id: SUBMISSION_IDS.SUBMISSION_01,
    assignmentId: ASSIGNMENT_IDS.ASSIGNMENT_02,
    studentId: USER_IDS.STUDENT_01,
    status: SubmissionStatus.PENDING,
    submittedAt: new Date('2024-12-20T14:30:00'),
    wordCount: 285,
  },
  {
    id: SUBMISSION_IDS.SUBMISSION_02,
    assignmentId: ASSIGNMENT_IDS.ASSIGNMENT_02,
    studentId: USER_IDS.STUDENT_02,
    status: SubmissionStatus.GRADING,
    submittedAt: new Date('2024-12-19T18:20:00'),
    wordCount: 312,
    graderId: USER_IDS.TEACHER_NGUYEN,
  },
  // Writing submissions - Graded
  {
    id: SUBMISSION_IDS.SUBMISSION_03,
    assignmentId: ASSIGNMENT_IDS.ASSIGNMENT_02,
    studentId: USER_IDS.STUDENT_03,
    status: SubmissionStatus.GRADED,
    submittedAt: new Date('2024-12-18T21:00:00'),
    wordCount: 178,
    score: 8.0,
    feedback: 'Bài viết có cấu trúc tốt, ý rõ ràng. Cần cải thiện từ vựng chuyên ngành.',
    graderId: USER_IDS.TEACHER_NGUYEN,
    gradedAt: new Date('2024-12-19T15:30:00'),
  },
  {
    id: SUBMISSION_IDS.SUBMISSION_04,
    assignmentId: ASSIGNMENT_IDS.ASSIGNMENT_02,
    studentId: USER_IDS.STUDENT_04,
    status: SubmissionStatus.GRADED,
    submittedAt: new Date('2024-12-18T14:30:00'),
    wordCount: 295,
    score: 7.5,
    feedback: 'Nội dung đầy đủ nhưng cần chú ý lỗi ngữ pháp.',
    graderId: USER_IDS.TEACHER_NGUYEN,
    gradedAt: new Date('2024-12-19T10:00:00'),
  },
  // Speaking submissions
  {
    id: SUBMISSION_IDS.SUBMISSION_05,
    assignmentId: ASSIGNMENT_IDS.ASSIGNMENT_04,
    studentId: USER_IDS.STUDENT_09,
    status: SubmissionStatus.PENDING,
    submittedAt: new Date('2024-12-20T10:15:00'),
    duration: '2:45',
  },
  {
    id: SUBMISSION_IDS.SUBMISSION_06,
    assignmentId: ASSIGNMENT_IDS.ASSIGNMENT_04,
    studentId: USER_IDS.STUDENT_10,
    status: SubmissionStatus.GRADING,
    submittedAt: new Date('2024-12-19T16:45:00'),
    duration: '4:20',
    graderId: USER_IDS.TEACHER_LE,
  },
  {
    id: SUBMISSION_IDS.SUBMISSION_07,
    assignmentId: ASSIGNMENT_IDS.ASSIGNMENT_04,
    studentId: USER_IDS.STUDENT_02,
    status: SubmissionStatus.GRADED,
    submittedAt: new Date('2024-12-18T14:30:00'),
    duration: '3:15',
    score: 7.0,
    feedback: 'Phát âm tốt, cần mở rộng ý và sử dụng từ nối nhiều hơn.',
    graderId: USER_IDS.TEACHER_LE,
    gradedAt: new Date('2024-12-19T10:00:00'),
  },
  {
    id: SUBMISSION_IDS.SUBMISSION_08,
    assignmentId: ASSIGNMENT_IDS.ASSIGNMENT_04,
    studentId: USER_IDS.STUDENT_03,
    status: SubmissionStatus.GRADED,
    submittedAt: new Date('2024-12-18T09:45:00'),
    duration: '4:50',
    score: 6.5,
    feedback: 'Cần cải thiện fluency và intonation.',
    graderId: USER_IDS.TEACHER_LE,
    gradedAt: new Date('2024-12-19T08:30:00'),
  },
];

export async function seedClasses(dataSource: DataSource): Promise<void> {
  const classRepository = dataSource.getRepository(Class);
  const classStudentRepository = dataSource.getRepository(ClassStudent);
  const classMaterialRepository = dataSource.getRepository(ClassMaterial);
  const classScheduleRepository = dataSource.getRepository(ClassSchedule);
  const classAnnouncementRepository = dataSource.getRepository(ClassAnnouncement);
  const classAssignmentRepository = dataSource.getRepository(ClassAssignment);
  const assignmentSubmissionRepository = dataSource.getRepository(ClassAssignmentSubmission);

  console.log('📦 Seeding classes...');

  try {
    // Clear existing data using queryBuilder for empty table support
    await assignmentSubmissionRepository.createQueryBuilder().delete().from(ClassAssignmentSubmission).execute();
    await classAssignmentRepository.createQueryBuilder().delete().from(ClassAssignment).execute();
    await classAnnouncementRepository.createQueryBuilder().delete().from(ClassAnnouncement).execute();
    await classScheduleRepository.createQueryBuilder().delete().from(ClassSchedule).execute();
    await classMaterialRepository.createQueryBuilder().delete().from(ClassMaterial).execute();
    await classStudentRepository.createQueryBuilder().delete().from(ClassStudent).execute();
    await classRepository.createQueryBuilder().delete().from(Class).execute();

    // Seed classes
    let classesCreated = 0;
    for (const classData of classesData) {
      await classRepository.save(classData);
      classesCreated++;
      console.log(`  ✅ Created class: ${classData.name}`);
    }

    // Seed class students
    let studentsEnrolled = 0;
    for (const studentData of classStudentsData) {
      try {
        const classStudent = classStudentRepository.create({
          classId: studentData.classId,
          studentId: studentData.studentId,
          status: studentData.status,
          progress: studentData.progress,
          lastActivityAt: studentData.lastActivityAt,
        });
        await classStudentRepository.save(classStudent);
        studentsEnrolled++;
      } catch (error) {
        // Skip duplicate entries
        console.log(`  ⚠️ Skipped duplicate enrollment`);
      }
    }

    // Seed class materials
    let materialsCreated = 0;
    for (const materialData of classMaterialsData) {
      const existingMaterial = await classMaterialRepository.findOne({ where: { id: materialData.id } });
      if (!existingMaterial) {
        await classMaterialRepository.save(materialData);
        materialsCreated++;
        console.log(`  ✅ Created material: ${materialData.title}`);
      }
    }

    // Seed class schedules
    let schedulesCreated = 0;
    for (const scheduleData of classSchedulesData) {
      const existingSchedule = await classScheduleRepository.findOne({ where: { id: scheduleData.id } });
      if (!existingSchedule) {
        await classScheduleRepository.save(scheduleData);
        schedulesCreated++;
        console.log(`  ✅ Created schedule: ${scheduleData.title}`);
      }
    }

    // Seed class announcements
    let announcementsCreated = 0;
    for (const announcementData of classAnnouncementsData) {
      const existingAnnouncement = await classAnnouncementRepository.findOne({ where: { id: announcementData.id } });
      if (!existingAnnouncement) {
        await classAnnouncementRepository.save(announcementData);
        announcementsCreated++;
        console.log(`  ✅ Created announcement: ${announcementData.title}`);
      }
    }

    // Seed class assignments
    let assignmentsCreated = 0;
    for (const assignmentData of classAssignmentsData) {
      const existingAssignment = await classAssignmentRepository.findOne({ where: { id: assignmentData.id } });
      if (!existingAssignment) {
        await classAssignmentRepository.save(assignmentData);
        assignmentsCreated++;
        console.log(`  ✅ Created assignment: ${assignmentData.title}`);
      }
    }

    // Seed assignment submissions
    let submissionsCreated = 0;
    for (const submissionData of assignmentSubmissionsData) {
      const existingSubmission = await assignmentSubmissionRepository.findOne({ where: { id: submissionData.id } });
      if (!existingSubmission) {
        await assignmentSubmissionRepository.save(submissionData);
        submissionsCreated++;
      }
    }

    console.log(`\n📊 Classes seeding completed!`);
    console.log(`  - Classes created: ${classesCreated}`);
    console.log(`  - Student enrollments: ${studentsEnrolled}`);
    console.log(`  - Materials created: ${materialsCreated}`);
    console.log(`  - Schedules created: ${schedulesCreated}`);
    console.log(`  - Announcements created: ${announcementsCreated}`);
    console.log(`  - Assignments created: ${assignmentsCreated}`);
    console.log(`  - Submissions created: ${submissionsCreated}`);

  } catch (error) {
    console.error('❌ Error seeding classes:', error);
    throw error;
  }
}
