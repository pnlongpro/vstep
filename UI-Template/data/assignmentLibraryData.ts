// Shared data source for Assignment Library and Session Assignment Modal
// Complete sessions organized by courses

export type CourseType = 'VSTEP Complete' | 'VSTEP Foundation' | 'VSTEP Starter' | 'VSTEP Builder' | 'VSTEP Developer' | 'VSTEP Booster' | 'VSTEP Intensive' | 'VSTEP Practice' | 'VSTEP Premium' | 'VSTEP Master';

export interface Assignment {
  id: number;
  title: string;
  description: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  difficulty: 'easy' | 'medium' | 'hard';
  questions: number;
  estimatedTime: number;
  rating: number;
  usageCount: number;
  tags: string[];
  course: CourseType;
}

export interface SessionData {
  id: string;
  sessionNumber: number;
  title: string;
  description: string;
  course: CourseType;
  assignments: Assignment[];
}

// Helper function to generate session ID
const getSessionId = (course: string, sessionNum: number) => `${course.toLowerCase().replace(/\s+/g, '-')}-${sessionNum}`;

// Session configurations for each course
const courseSessionConfigs: Record<CourseType, { count: number; titlePrefix: string; sessions: Array<{ title: string; desc: string }> }> = {
  'VSTEP Complete': {
    count: 10,
    titlePrefix: 'VSTEP Complete',
    sessions: [
      { title: 'Giới thiệu tổng quan VSTEP', desc: 'Làm quen với format và cấu trúc bài thi VSTEP đầy đủ 4 kỹ năng' },
      { title: 'Chiến lược làm bài thi', desc: 'Học các chiến lược và kỹ thuật làm bài hiệu quả' },
      { title: 'Quản lý thời gian trong thi', desc: 'Kỹ năng phân bổ thời gian cho từng phần thi' },
      { title: 'Luyện tập tổng hợp 4 kỹ năng', desc: 'Thực hành đồng thời cả 4 kỹ năng Reading, Listening, Writing, Speaking' },
      { title: 'Phân tích đề thi mẫu', desc: 'Phân tích chi tiết cấu trúc và yêu cầu của đề thi thật' },
      { title: 'Mock Test Practice 1', desc: 'Bài thi thử đầy đủ lần 1 với điều kiện thi thật' },
      { title: 'Mock Test Practice 2', desc: 'Bài thi thử đầy đủ lần 2 với độ khó tăng dần' },
      { title: 'Chữa bài và feedback', desc: 'Phân tích sai sót và cách cải thiện cho bài thi' },
      { title: 'Luyện tập intensive', desc: 'Luyện tập chuyên sâu các dạng bài khó' },
      { title: 'Final Mock Test', desc: 'Bài thi thử cuối cùng trước kỳ thi chính thức' },
    ]
  },
  'VSTEP Foundation': {
    count: 4,
    titlePrefix: 'VSTEP Foundation',
    sessions: [
      { title: 'Skimming & Scanning Techniques', desc: 'Kỹ thuật đọc lướt và đọc tìm thông tin cụ thể' },
      { title: 'Understanding Main Ideas', desc: 'Xác định ý chính và chi tiết hỗ trợ trong đoạn văn' },
      { title: 'Vocabulary in Context', desc: 'Đoán nghĩa từ vựng qua ngữ cảnh' },
      { title: 'Critical Reading & Inference', desc: 'Đọc phê phán và suy luận thông tin ẩn' },
    ]
  },
  'VSTEP Starter': {
    count: 4,
    titlePrefix: 'VSTEP Starter',
    sessions: [
      { title: 'Note-taking Skills', desc: 'Kỹ năng ghi chú hiệu quả khi nghe' },
      { title: 'Listening for Details', desc: 'Nghe và nắm bắt thông tin chi tiết' },
      { title: 'Understanding Speaker Intent', desc: 'Hiểu ý định và thái độ của người nói' },
      { title: 'Academic Listening', desc: 'Nghe hiểu bài giảng và hội thoại học thuật' },
    ]
  },
  'VSTEP Builder': {
    count: 4,
    titlePrefix: 'VSTEP Builder',
    sessions: [
      { title: 'Writing Task 1 - Email/Letter', desc: 'Viết email và thư trang trọng/không trang trọng' },
      { title: 'Writing Task 2 - Essay Structure', desc: 'Cấu trúc bài luận và cách triển khai ý tưởng' },
      { title: 'Opinion & Argument Essays', desc: 'Viết bài luận bày tỏ quan điểm và lập luận' },
      { title: 'Problem-Solution Essays', desc: 'Viết bài phân tích vấn đề và đưa ra giải pháp' },
    ]
  },
  'VSTEP Developer': {
    count: 4,
    titlePrefix: 'VSTEP Developer',
    sessions: [
      { title: 'Speaking Part 1 - Introduction', desc: 'Giới thiệu bản thân và trả lời câu hỏi cơ bản' },
      { title: 'Speaking Part 2 - Long Turn', desc: 'Nói dài về một chủ đề được cho' },
      { title: 'Speaking Part 3 - Discussion', desc: 'Thảo luận chuyên sâu về các vấn đề xã hội' },
      { title: 'Pronunciation & Fluency', desc: 'Cải thiện phát âm và độ trôi chảy' },
    ]
  },
  'VSTEP Booster': {
    count: 3,
    titlePrefix: 'VSTEP Booster',
    sessions: [
      { title: 'Tenses & Time Expressions', desc: 'Các thì và cách diễn đạt thời gian' },
      { title: 'Complex Sentences', desc: 'Cấu trúc câu phức và mệnh đề' },
      { title: 'Common Grammar Mistakes', desc: 'Các lỗi ngữ pháp thường gặp và cách tránh' },
    ]
  },
  'VSTEP Intensive': {
    count: 2,
    titlePrefix: 'VSTEP Intensive',
    sessions: [
      { title: 'Academic Word List', desc: 'Học từ vựng học thuật thiết yếu' },
      { title: 'Collocations & Idioms', desc: 'Cụm từ cố định và thành ngữ thường gặp' },
    ]
  },
  'VSTEP Practice': {
    count: 2,
    titlePrefix: 'VSTEP Practice',
    sessions: [
      { title: 'Practice Test 1', desc: 'Bài thi thử đầy đủ 4 kỹ năng - Set 1' },
      { title: 'Practice Test 2', desc: 'Bài thi thử đầy đủ 4 kỹ năng - Set 2' },
    ]
  },
  'VSTEP Premium': {
    count: 2,
    titlePrefix: 'VSTEP Premium',
    sessions: [
      { title: 'From B1 to B2 Strategies', desc: 'Chiến lược nâng cấp từ B1 lên B2' },
      { title: 'From B2 to C1 Mastery', desc: 'Làm chủ kỹ năng để đạt C1' },
    ]
  },
  'VSTEP Master': {
    count: 1,
    titlePrefix: 'VSTEP Master',
    sessions: [
      { title: 'C1 Advanced Preparation', desc: 'Chuẩn bị chuyên sâu cho trình độ C1' },
    ]
  },
};

// Generate sessions for each course
const generateCourseSessions = (course: CourseType): SessionData[] => {
  const config = courseSessionConfigs[course];
  const sessions: SessionData[] = [];
  
  for (let i = 0; i < config.count; i++) {
    const sessionNum = i + 1;
    const sessionInfo = config.sessions[i];
    const assignments: Assignment[] = [];
    
    // Base ID for each course
    const courseBaseId: Record<CourseType, number> = {
      'VSTEP Complete': 1000,
      'VSTEP Foundation': 2000,
      'VSTEP Starter': 3000,
      'VSTEP Builder': 4000,
      'VSTEP Developer': 5000,
      'VSTEP Booster': 6000,
      'VSTEP Intensive': 7000,
      'VSTEP Practice': 8000,
      'VSTEP Premium': 9000,
      'VSTEP Master': 10000,
    };
    
    let assignmentId = courseBaseId[course] + sessionNum * 10;
    
    // Add assignments based on course type
    if (course === 'VSTEP Complete' || course === 'VSTEP Practice') {
      // Full Course and Practice include all 4 skills
      assignments.push(
        {
          id: assignmentId++,
          title: `${sessionInfo.title} - Reading`,
          description: `Bài đọc hiểu trong ${sessionInfo.title}`,
          skill: 'reading',
          difficulty: sessionNum <= config.count / 2 ? 'medium' : 'hard',
          questions: 10 + sessionNum,
          estimatedTime: 25 + sessionNum * 2,
          rating: 4.3 + Math.random() * 0.6,
          usageCount: 100 + Math.floor(Math.random() * 200),
          tags: [course, 'Reading', 'Comprehensive'],
          course,
        },
        {
          id: assignmentId++,
          title: `${sessionInfo.title} - Listening`,
          description: `Bài nghe trong ${sessionInfo.title}`,
          skill: 'listening',
          difficulty: sessionNum <= config.count / 2 ? 'medium' : 'hard',
          questions: 8 + sessionNum,
          estimatedTime: 20 + sessionNum * 2,
          rating: 4.2 + Math.random() * 0.7,
          usageCount: 90 + Math.floor(Math.random() * 180),
          tags: [course, 'Listening', 'Comprehensive'],
          course,
        },
        {
          id: assignmentId++,
          title: `${sessionInfo.title} - Writing`,
          description: `Bài viết trong ${sessionInfo.title}`,
          skill: 'writing',
          difficulty: sessionNum <= config.count / 2 ? 'medium' : 'hard',
          questions: 2,
          estimatedTime: 35 + sessionNum * 2,
          rating: 4.1 + Math.random() * 0.7,
          usageCount: 80 + Math.floor(Math.random() * 150),
          tags: [course, 'Writing', 'Comprehensive'],
          course,
        },
        {
          id: assignmentId++,
          title: `${sessionInfo.title} - Speaking`,
          description: `Bài nói trong ${sessionInfo.title}`,
          skill: 'speaking',
          difficulty: sessionNum <= config.count / 2 ? 'medium' : 'hard',
          questions: 4,
          estimatedTime: 15 + sessionNum,
          rating: 4.4 + Math.random() * 0.5,
          usageCount: 120 + Math.floor(Math.random() * 200),
          tags: [course, 'Speaking', 'Comprehensive'],
          course,
        }
      );
    } else if (course === 'VSTEP Foundation') {
      assignments.push({
        id: assignmentId++,
        title: sessionInfo.title,
        description: sessionInfo.desc,
        skill: 'reading',
        difficulty: sessionNum <= 2 ? 'medium' : 'hard',
        questions: 10 + sessionNum * 2,
        estimatedTime: 25 + sessionNum * 3,
        rating: 4.4 + Math.random() * 0.5,
        usageCount: 150 + Math.floor(Math.random() * 200),
        tags: [course, 'Reading Comprehension'],
        course,
      });
    } else if (course === 'VSTEP Starter') {
      assignments.push({
        id: assignmentId++,
        title: sessionInfo.title,
        description: sessionInfo.desc,
        skill: 'listening',
        difficulty: sessionNum <= 2 ? 'medium' : 'hard',
        questions: 8 + sessionNum * 2,
        estimatedTime: 20 + sessionNum * 3,
        rating: 4.3 + Math.random() * 0.6,
        usageCount: 140 + Math.floor(Math.random() * 180),
        tags: [course, 'Listening Skills'],
        course,
      });
    } else if (course === 'VSTEP Builder') {
      assignments.push({
        id: assignmentId++,
        title: sessionInfo.title,
        description: sessionInfo.desc,
        skill: 'writing',
        difficulty: sessionNum <= 2 ? 'medium' : 'hard',
        questions: 2,
        estimatedTime: 35 + sessionNum * 3,
        rating: 4.2 + Math.random() * 0.7,
        usageCount: 130 + Math.floor(Math.random() * 170),
        tags: [course, 'Writing Skills'],
        course,
      });
    } else if (course === 'VSTEP Developer') {
      assignments.push({
        id: assignmentId++,
        title: sessionInfo.title,
        description: sessionInfo.desc,
        skill: 'speaking',
        difficulty: sessionNum <= 2 ? 'medium' : 'hard',
        questions: 4 + sessionNum,
        estimatedTime: 15 + sessionNum * 2,
        rating: 4.5 + Math.random() * 0.4,
        usageCount: 160 + Math.floor(Math.random() * 190),
        tags: [course, 'Speaking Practice'],
        course,
      });
    } else if (course === 'VSTEP Booster') {
      // Grammar includes reading and writing
      assignments.push(
        {
          id: assignmentId++,
          title: `${sessionInfo.title} - Reading Practice`,
          description: `Bài đọc áp dụng ${sessionInfo.title}`,
          skill: 'reading',
          difficulty: sessionNum === 1 ? 'easy' : sessionNum === 2 ? 'medium' : 'hard',
          questions: 8 + sessionNum * 2,
          estimatedTime: 20 + sessionNum * 3,
          rating: 4.3 + Math.random() * 0.6,
          usageCount: 110 + Math.floor(Math.random() * 160),
          tags: [course, 'Grammar in Context'],
          course,
        },
        {
          id: assignmentId++,
          title: `${sessionInfo.title} - Writing Exercise`,
          description: `Bài tập viết về ${sessionInfo.title}`,
          skill: 'writing',
          difficulty: sessionNum === 1 ? 'easy' : sessionNum === 2 ? 'medium' : 'hard',
          questions: 1,
          estimatedTime: 25 + sessionNum * 3,
          rating: 4.2 + Math.random() * 0.7,
          usageCount: 100 + Math.floor(Math.random() * 150),
          tags: [course, 'Grammar Application'],
          course,
        }
      );
    } else if (course === 'VSTEP Intensive') {
      // Vocabulary includes all 4 skills
      assignments.push(
        {
          id: assignmentId++,
          title: `${sessionInfo.title} - Reading`,
          description: `Học từ vựng qua đoạn văn đọc`,
          skill: 'reading',
          difficulty: 'medium',
          questions: 10,
          estimatedTime: 20,
          rating: 4.4 + Math.random() * 0.5,
          usageCount: 140 + Math.floor(Math.random() * 160),
          tags: [course, 'Vocabulary Building'],
          course,
        },
        {
          id: assignmentId++,
          title: `${sessionInfo.title} - Listening`,
          description: `Học từ vựng qua bài nghe`,
          skill: 'listening',
          difficulty: 'medium',
          questions: 8,
          estimatedTime: 15,
          rating: 4.3 + Math.random() * 0.6,
          usageCount: 130 + Math.floor(Math.random() * 150),
          tags: [course, 'Vocabulary Building'],
          course,
        }
      );
    } else if (course === 'VSTEP Premium') {
      // Level Up includes comprehensive practice
      assignments.push(
        {
          id: assignmentId++,
          title: `${sessionInfo.title} - Reading & Listening`,
          description: `Luyện tập nâng cấp kỹ năng đọc và nghe`,
          skill: 'reading',
          difficulty: 'hard',
          questions: 12,
          estimatedTime: 30,
          rating: 4.5 + Math.random() * 0.4,
          usageCount: 120 + Math.floor(Math.random() * 140),
          tags: [course, 'Level Advancement'],
          course,
        },
        {
          id: assignmentId++,
          title: `${sessionInfo.title} - Writing & Speaking`,
          description: `Luyện tập nâng cấp kỹ năng viết và nói`,
          skill: 'writing',
          difficulty: 'hard',
          questions: 2,
          estimatedTime: 35,
          rating: 4.4 + Math.random() * 0.5,
          usageCount: 110 + Math.floor(Math.random() * 130),
          tags: [course, 'Level Advancement'],
          course,
        }
      );
    } else if (course === 'VSTEP Master') {
      // Advanced includes all skills at hard level
      assignments.push(
        {
          id: assignmentId++,
          title: `${sessionInfo.title} - Advanced Reading`,
          description: `Đọc hiểu nâng cao C1`,
          skill: 'reading',
          difficulty: 'hard',
          questions: 15,
          estimatedTime: 40,
          rating: 4.7 + Math.random() * 0.2,
          usageCount: 100 + Math.floor(Math.random() * 120),
          tags: [course, 'C1 Level', 'Advanced'],
          course,
        },
        {
          id: assignmentId++,
          title: `${sessionInfo.title} - Advanced Listening`,
          description: `Nghe hiểu nâng cao C1`,
          skill: 'listening',
          difficulty: 'hard',
          questions: 12,
          estimatedTime: 35,
          rating: 4.6 + Math.random() * 0.3,
          usageCount: 95 + Math.floor(Math.random() * 115),
          tags: [course, 'C1 Level', 'Advanced'],
          course,
        },
        {
          id: assignmentId++,
          title: `${sessionInfo.title} - Advanced Writing`,
          description: `Viết luận nâng cao C1`,
          skill: 'writing',
          difficulty: 'hard',
          questions: 2,
          estimatedTime: 45,
          rating: 4.5 + Math.random() * 0.4,
          usageCount: 90 + Math.floor(Math.random() * 110),
          tags: [course, 'C1 Level', 'Advanced'],
          course,
        },
        {
          id: assignmentId++,
          title: `${sessionInfo.title} - Advanced Speaking`,
          description: `Nói chuyên sâu C1`,
          skill: 'speaking',
          difficulty: 'hard',
          questions: 5,
          estimatedTime: 20,
          rating: 4.6 + Math.random() * 0.3,
          usageCount: 105 + Math.floor(Math.random() * 125),
          tags: [course, 'C1 Level', 'Advanced'],
          course,
        }
      );
    }
    
    sessions.push({
      id: getSessionId(course, sessionNum),
      sessionNumber: sessionNum,
      title: sessionInfo.title,
      description: sessionInfo.desc,
      course,
      assignments,
    });
  }
  
  return sessions;
};

// Generate all sessions
const fullCourseSessions = generateCourseSessions('VSTEP Complete');
const readingSessions = generateCourseSessions('VSTEP Foundation');
const listeningSessions = generateCourseSessions('VSTEP Starter');
const writingSessions = generateCourseSessions('VSTEP Builder');
const speakingSessions = generateCourseSessions('VSTEP Developer');
const grammarSessions = generateCourseSessions('VSTEP Booster');
const vocabularySessions = generateCourseSessions('VSTEP Intensive');
const practiceSessions = generateCourseSessions('VSTEP Practice');
const levelUpSessions = generateCourseSessions('VSTEP Premium');
const advancedSessions = generateCourseSessions('VSTEP Master');

// Export all data
export const assignmentLibraryData: Record<CourseType, SessionData[]> = {
  'VSTEP Complete': fullCourseSessions,
  'VSTEP Foundation': readingSessions,
  'VSTEP Starter': listeningSessions,
  'VSTEP Builder': writingSessions,
  'VSTEP Developer': speakingSessions,
  'VSTEP Booster': grammarSessions,
  'VSTEP Intensive': vocabularySessions,
  'VSTEP Practice': practiceSessions,
  'VSTEP Premium': levelUpSessions,
  'VSTEP Master': advancedSessions,
};

// Helper functions
export const getAllAssignmentsByCourse = (course: CourseType): Assignment[] => {
  return assignmentLibraryData[course].flatMap(session => session.assignments);
};

export const getSessionsByCourse = (course: CourseType): SessionData[] => {
  return assignmentLibraryData[course];
};

export const getAssignmentById = (id: number): Assignment | undefined => {
  const allSessions = Object.values(assignmentLibraryData).flat();
  for (const session of allSessions) {
    const assignment = session.assignments.find(a => a.id === id);
    if (assignment) return assignment;
  }
  return undefined;
};

export const getAssignmentsBySkill = (
  course: CourseType,
  skill: 'reading' | 'listening' | 'writing' | 'speaking'
): Assignment[] => {
  return getAllAssignmentsByCourse(course).filter(a => a.skill === skill);
};

export const getAllSessions = (): SessionData[] => {
  return Object.values(assignmentLibraryData).flat();
};

export const getAllAssignments = (): Assignment[] => {
  return getAllSessions().flatMap(session => session.assignments);
};