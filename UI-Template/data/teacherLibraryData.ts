// Comprehensive library data for teachers including assignments, parts, and full exams
// Synced with admin document library structure

import { readingPartsConfig, listeningPartsConfig, writingPartsConfig, speakingPartsConfig } from './partsConfig';
import { readingQuestions } from './readingData';
import { listeningFullTestData } from './listeningFullTestData';

export type LibraryItemType = 'assignment' | 'part' | 'exam';
export type SkillType = 'reading' | 'listening' | 'writing' | 'speaking';
export type DifficultyLevel = 'A2' | 'B1' | 'B2' | 'C1';

export interface LibraryItem {
  id: string;
  type: LibraryItemType;
  title: string;
  description: string;
  skill: SkillType;
  level?: DifficultyLevel;
  questions: number;
  estimatedTime: number;
  partNumber?: number; // For parts: 1, 2, 3, 4
  tags: string[];
  rating?: number;
  usageCount?: number;
  createdBy?: string;
  createdDate?: string;
}

// READING PARTS - Synced with Exam Bank IDs
const readingParts: LibraryItem[] = readingPartsConfig.map(part => ({
  id: `R-PART-${part.id}`, // R-PART-1, R-PART-2, R-PART-3, R-PART-4
  type: 'part' as LibraryItemType,
  title: `Reading ${part.label}: ${part.title}`,
  description: part.description,
  skill: 'reading' as SkillType,
  level: 'B1',
  questions: part.questions,
  estimatedTime: 15,
  partNumber: part.id,
  tags: ['Reading', part.label, part.title],
  rating: 4.5 + Math.random() * 0.5,
  usageCount: 150 + Math.floor(Math.random() * 200),
  createdBy: 'Admin',
  createdDate: '2024-11-15'
}));

// LISTENING PARTS - Synced with Exam Bank IDs
const listeningParts: LibraryItem[] = listeningPartsConfig.map(part => ({
  id: `L-PART-${part.id}`, // L-PART-1, L-PART-2, L-PART-3
  type: 'part' as LibraryItemType,
  title: `Listening ${part.label}: ${part.title}`,
  description: part.description,
  skill: 'listening' as SkillType,
  level: 'B1',
  questions: part.questions,
  estimatedTime: 20,
  partNumber: part.id,
  tags: ['Listening', part.label, part.title],
  rating: 4.4 + Math.random() * 0.6,
  usageCount: 140 + Math.floor(Math.random() * 180),
  createdBy: 'Admin',
  createdDate: '2024-11-15'
}));

// WRITING PARTS - Synced with Exam Bank IDs
const writingParts: LibraryItem[] = writingPartsConfig.map(part => ({
  id: `W-PART-${part.id}`, // W-PART-1, W-PART-2
  type: 'part' as LibraryItemType,
  title: `Writing ${part.label}: ${part.title}`,
  description: part.description,
  skill: 'writing' as SkillType,
  level: 'B1',
  questions: part.questions,
  estimatedTime: part.timeLimit,
  partNumber: part.id,
  tags: ['Writing', part.label, part.title],
  rating: 4.3 + Math.random() * 0.7,
  usageCount: 120 + Math.floor(Math.random() * 160),
  createdBy: 'Admin',
  createdDate: '2024-11-15'
}));

// SPEAKING PARTS - Synced with Exam Bank IDs
const speakingParts: LibraryItem[] = speakingPartsConfig.map(part => ({
  id: `S-PART-${part.id}`, // S-PART-1, S-PART-2, S-PART-3
  type: 'part' as LibraryItemType,
  title: `Speaking ${part.label}: ${part.title}`,
  description: part.description,
  skill: 'speaking' as SkillType,
  level: 'B1',
  questions: part.questions,
  estimatedTime: part.timeLimit,
  partNumber: part.id,
  tags: ['Speaking', part.label, part.title],
  rating: 4.6 + Math.random() * 0.4,
  usageCount: 160 + Math.floor(Math.random() * 190),
  createdBy: 'Admin',
  createdDate: '2024-11-15'
}));

// FULL EXAMS - Generate mock exam sets
const generateFullExams = (): LibraryItem[] => {
  const exams: LibraryItem[] = [];
  const levels: DifficultyLevel[] = ['A2', 'B1', 'B2', 'C1'];
  
  // Generate 20 exam sets (5 per level)
  levels.forEach((level, levelIndex) => {
    for (let i = 1; i <= 5; i++) {
      const examNumber = levelIndex * 5 + i;
      exams.push({
        id: `exam-full-${examNumber}`,
        type: 'exam',
        title: `Đề thi ${level} - Đề số ${String(examNumber).padStart(2, '0')}`,
        description: `Bộ đề thi đầy đủ 4 kỹ năng trình độ ${level} - Reading (40 câu) + Listening (35 câu) + Writing (2 bài) + Speaking (3 phần)`,
        skill: 'reading', // Default skill for display, but includes all 4
        level: level,
        questions: 77, // 40 reading + 35 listening + 2 writing
        estimatedTime: 150, // 2.5 hours
        tags: ['Full Test', level, 'All Skills', '4 kỹ năng'],
        rating: 4.7 + Math.random() * 0.3,
        usageCount: 200 + Math.floor(Math.random() * 300),
        createdBy: 'Admin',
        createdDate: `2024-${10 + Math.floor(i / 3)}-${String((i * 3) % 28 + 1).padStart(2, '0')}`
      });
    }
  });
  
  return exams;
};

const fullExams = generateFullExams();

// INDIVIDUAL ASSIGNMENTS (synced with Exam Bank - using exam IDs as assignments)
const individualAssignments: LibraryItem[] = [
  // Reading exams from ExamManagementPage - synced IDs
  {
    id: 'R001',
    type: 'assignment',
    title: 'Reading Test 01 - Climate Change',
    description: 'Đề thi Reading về biến đổi khí hậu với 40 câu hỏi',
    skill: 'reading',
    level: 'B1',
    questions: 40,
    estimatedTime: 60,
    tags: ['Reading', 'Climate', 'Full Test'],
    rating: 4.5,
    usageCount: 145,
    createdBy: 'TS. Nguyễn Văn A',
    createdDate: '2024-12-10'
  },
  {
    id: 'R002',
    type: 'assignment',
    title: 'Reading Test 02 - Technology Impact',
    description: 'Đề thi Reading về tác động công nghệ với 40 câu hỏi',
    skill: 'reading',
    level: 'B2',
    questions: 40,
    estimatedTime: 60,
    tags: ['Reading', 'Technology', 'Full Test'],
    rating: 4.6,
    usageCount: 128,
    createdBy: 'ThS. Trần Thị B',
    createdDate: '2024-12-09'
  },
  {
    id: 'R003',
    type: 'assignment',
    title: 'Reading Test 03 - Education System',
    description: 'Đề thi Reading về hệ thống giáo dục với 40 câu hỏi',
    skill: 'reading',
    level: 'B1',
    questions: 40,
    estimatedTime: 60,
    tags: ['Reading', 'Education', 'Full Test'],
    rating: 4.4,
    usageCount: 89,
    createdBy: 'TS. Lê Văn C',
    createdDate: '2024-12-08'
  },
  // Listening exams from ExamManagementPage - synced IDs
  {
    id: 'L001',
    type: 'assignment',
    title: 'Listening Test 01 - Daily Conversations',
    description: 'Đề thi Listening về hội thoại hàng ngày với 35 câu hỏi',
    skill: 'listening',
    level: 'B1',
    questions: 35,
    estimatedTime: 40,
    tags: ['Listening', 'Daily Life', 'Full Test'],
    rating: 4.7,
    usageCount: 167,
    createdBy: 'TS. Nguyễn Văn A',
    createdDate: '2024-12-10'
  },
  {
    id: 'L002',
    type: 'assignment',
    title: 'Listening Test 02 - Academic Lectures',
    description: 'Đề thi Listening về bài giảng học thuật với 35 câu hỏi',
    skill: 'listening',
    level: 'B2',
    questions: 35,
    estimatedTime: 40,
    tags: ['Listening', 'Academic', 'Full Test'],
    rating: 4.8,
    usageCount: 143,
    createdBy: 'ThS. Trần Thị B',
    createdDate: '2024-12-09'
  },
  {
    id: 'L003',
    type: 'assignment',
    title: 'Listening Test 03 - News & Media',
    description: 'Đề thi Listening về tin tức và truyền thông với 35 câu hỏi',
    skill: 'listening',
    level: 'C1',
    questions: 35,
    estimatedTime: 40,
    tags: ['Listening', 'News', 'Full Test'],
    rating: 4.6,
    usageCount: 112,
    createdBy: 'TS. Lê Văn C',
    createdDate: '2024-12-08'
  },
  // Writing exams from ExamManagementPage - synced IDs
  {
    id: 'W001',
    type: 'assignment',
    title: 'Writing Test 01 - Email + Essay',
    description: 'Đề thi Writing gồm viết email chính thức và bài luận',
    skill: 'writing',
    level: 'B2',
    questions: 2,
    estimatedTime: 60,
    tags: ['Writing', 'Email', 'Essay'],
    rating: 4.5,
    usageCount: 98,
    createdBy: 'TS. Nguyễn Văn A',
    createdDate: '2024-12-10'
  },
  {
    id: 'W002',
    type: 'assignment',
    title: 'Writing Test 02 - Letter + Essay',
    description: 'Đề thi Writing gồm viết thư khiếu nại và bài luận thảo luận',
    skill: 'writing',
    level: 'B1',
    questions: 2,
    estimatedTime: 60,
    tags: ['Writing', 'Letter', 'Essay'],
    rating: 4.4,
    usageCount: 87,
    createdBy: 'ThS. Trần Thị B',
    createdDate: '2024-12-09'
  },
  // Speaking exams from ExamManagementPage - synced IDs
  {
    id: 'S001',
    type: 'assignment',
    title: 'Speaking Test 01 - Personal + Topic',
    description: 'Đề thi Speaking gồm phần giới thiệu cá nhân và chủ đề',
    skill: 'speaking',
    level: 'B1',
    questions: 3,
    estimatedTime: 12,
    tags: ['Speaking', 'Travel', 'Education'],
    rating: 4.6,
    usageCount: 134,
    createdBy: 'TS. Nguyễn Văn A',
    createdDate: '2024-12-10'
  },
  {
    id: 'S002',
    type: 'assignment',
    title: 'Speaking Test 02 - Interview + Discussion',
    description: 'Đề thi Speaking gồm phần phỏng vấn và thảo luận',
    skill: 'speaking',
    level: 'B2',
    questions: 3,
    estimatedTime: 12,
    tags: ['Speaking', 'Technology', 'Society'],
    rating: 4.7,
    usageCount: 109,
    createdBy: 'ThS. Trần Thị B',
    createdDate: '2024-12-09'
  },
];

// COMBINE ALL LIBRARY ITEMS
export const allLibraryItems: LibraryItem[] = [
  ...individualAssignments,
  ...readingParts,
  ...listeningParts,
  ...writingParts,
  ...speakingParts,
  ...fullExams,
];

// HELPER FUNCTIONS
export const getLibraryItemsByType = (type: LibraryItemType): LibraryItem[] => {
  return allLibraryItems.filter(item => item.type === type);
};

export const getLibraryItemsBySkill = (skill: SkillType): LibraryItem[] => {
  return allLibraryItems.filter(item => item.skill === skill);
};

export const getLibraryItemsByTypeAndSkill = (type: LibraryItemType, skill: SkillType): LibraryItem[] => {
  return allLibraryItems.filter(item => item.type === type && item.skill === skill);
};

export const getLibraryItemsByLevel = (level: DifficultyLevel): LibraryItem[] => {
  return allLibraryItems.filter(item => item.level === level);
};

export const searchLibraryItems = (
  searchTerm: string,
  type?: LibraryItemType,
  skill?: SkillType,
  level?: DifficultyLevel
): LibraryItem[] => {
  return allLibraryItems.filter(item => {
    const matchesSearch = searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = !type || item.type === type;
    const matchesSkill = !skill || item.skill === skill;
    const matchesLevel = !level || item.level === level;
    
    return matchesSearch && matchesType && matchesSkill && matchesLevel;
  });
};

export const getPartsBySkill = (skill: SkillType): LibraryItem[] => {
  return allLibraryItems.filter(item => item.type === 'part' && item.skill === skill);
};

export const getAllFullExams = (): LibraryItem[] => {
  return allLibraryItems.filter(item => item.type === 'exam');
};

export const getFullExamsByLevel = (level: DifficultyLevel): LibraryItem[] => {
  return allLibraryItems.filter(item => item.type === 'exam' && item.level === level);
};