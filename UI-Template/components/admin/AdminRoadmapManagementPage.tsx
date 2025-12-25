import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, Edit2, Trash2, GripVertical, Eye, Check, X, Clock, BookOpen, Users, Target, Calendar, FileText, Copy } from 'lucide-react';
import { type CourseType } from '../../data/assignmentLibraryData';

type SkillType = 'reading' | 'listening' | 'writing' | 'speaking';

interface SessionAssignment {
  id: string;
  title: string;
  skill: SkillType;
  duration: string;
  questions: number;
}

interface RoadmapSession {
  id: string;
  sessionNumber: number;
  title: string;
  description: string;
  assignments: SessionAssignment[];
  createdBy?: string;
  createdAt?: string;
  status?: 'active' | 'draft' | 'archived';
}

// Mock data for 10 courses
const mockRoadmapsData: Record<CourseType, RoadmapSession[]> = {
  'VSTEP Complete': [
    {
      id: 'vc1',
      sessionNumber: 1,
      title: 'Giới thiệu & Từ vựng cơ bản',
      description: 'Làm quen với format VSTEP và xây dựng vốn từ vựng nền tảng',
      assignments: [
        { id: 'vca1', title: 'Reading Practice - Basic Comprehension', skill: 'reading', duration: '45 phút', questions: 20 },
        { id: 'vca2', title: 'Listening Practice - Part 1', skill: 'listening', duration: '30 phút', questions: 15 }
      ],
      createdBy: 'Admin System',
      createdAt: '2024-01-15',
      status: 'active'
    },
    {
      id: 'vc2',
      sessionNumber: 2,
      title: 'Grammar & Writing Skills',
      description: 'Củng cố ngữ pháp và luyện kỹ năng viết',
      assignments: [
        { id: 'vca3', title: 'Writing Task 1 - Email Writing', skill: 'writing', duration: '60 phút', questions: 1 },
        { id: 'vca4', title: 'Speaking Part 1 - Self Introduction', skill: 'speaking', duration: '20 phút', questions: 5 }
      ],
      createdBy: 'TS. Nguyễn Văn A',
      createdAt: '2024-01-20',
      status: 'active'
    },
    {
      id: 'vc3',
      sessionNumber: 3,
      title: 'Reading Comprehension Advanced',
      description: 'Luyện đọc hiểu nâng cao với các bài báo học thuật',
      assignments: [
        { id: 'vca5', title: 'Reading - Academic Articles', skill: 'reading', duration: '60 phút', questions: 25 },
        { id: 'vca6', title: 'Vocabulary Building - Academic Words', skill: 'reading', duration: '30 phút', questions: 50 }
      ],
      createdBy: 'ThS. Trần Thị B',
      createdAt: '2024-01-25',
      status: 'active'
    },
    {
      id: 'vc4',
      sessionNumber: 4,
      title: 'Listening & Note-taking',
      description: 'Kỹ thuật nghe và ghi chép hiệu quả',
      assignments: [
        { id: 'vca7', title: 'Listening - Lectures & Discussions', skill: 'listening', duration: '45 phút', questions: 20 },
        { id: 'vca8', title: 'Note-taking Practice', skill: 'listening', duration: '30 phút', questions: 10 }
      ],
      createdBy: 'GV. Lê Văn C',
      createdAt: '2024-02-01',
      status: 'active'
    },
    {
      id: 'vc5',
      sessionNumber: 5,
      title: 'Writing Task 2 - Essay',
      description: 'Viết luận văn học thuật',
      assignments: [
        { id: 'vca9', title: 'Essay Structure & Planning', skill: 'writing', duration: '45 phút', questions: 1 },
        { id: 'vca10', title: 'Argumentative Essay Practice', skill: 'writing', duration: '60 phút', questions: 1 }
      ],
      createdBy: 'TS. Phạm Thị D',
      createdAt: '2024-02-05',
      status: 'active'
    },
    {
      id: 'vc6',
      sessionNumber: 6,
      title: 'Speaking Fluency & Pronunciation',
      description: 'Luyện nói trôi chảy và phát âm chuẩn',
      assignments: [
        { id: 'vca11', title: 'Speaking Part 2 - Personal Topics', skill: 'speaking', duration: '25 phút', questions: 3 },
        { id: 'vca12', title: 'Speaking Part 3 - Discussion', skill: 'speaking', duration: '30 phút', questions: 5 }
      ],
      createdBy: 'ThS. Hoàng Văn E',
      createdAt: '2024-02-10',
      status: 'active'
    }
  ],
  
  'VSTEP Foundation': [
    {
      id: 'vf1',
      sessionNumber: 1,
      title: 'Alphabet & Basic Phonics',
      description: 'Làm quen với bảng chữ cái và phát âm cơ bản',
      assignments: [
        { id: 'vfa1', title: 'Alphabet Recognition', skill: 'reading', duration: '30 phút', questions: 26 },
        { id: 'vfa2', title: 'Basic Phonics Practice', skill: 'listening', duration: '25 phút', questions: 15 }
      ],
      createdBy: 'Admin System',
      createdAt: '2024-01-10',
      status: 'active'
    },
    {
      id: 'vf2',
      sessionNumber: 2,
      title: 'Simple Sentences',
      description: 'Học cách đọc và viết câu đơn giản',
      assignments: [
        { id: 'vfa3', title: 'Reading Simple Sentences', skill: 'reading', duration: '35 phút', questions: 20 },
        { id: 'vfa4', title: 'Writing Basic Sentences', skill: 'writing', duration: '40 phút', questions: 10 }
      ],
      createdBy: 'GV. Ngô Thị F',
      createdAt: '2024-01-15',
      status: 'active'
    },
    {
      id: 'vf3',
      sessionNumber: 3,
      title: 'Basic Greetings & Introductions',
      description: 'Chào hỏi và giới thiệu bản thân',
      assignments: [
        { id: 'vfa5', title: 'Listening - Greetings', skill: 'listening', duration: '30 phút', questions: 12 },
        { id: 'vfa6', title: 'Speaking - Self Introduction', skill: 'speaking', duration: '15 phút', questions: 5 }
      ],
      createdBy: 'ThS. Đỗ Văn G',
      createdAt: '2024-01-20',
      status: 'active'
    },
    {
      id: 'vf4',
      sessionNumber: 4,
      title: 'Numbers & Colors',
      description: 'Học số đếm và màu sắc',
      assignments: [
        { id: 'vfa7', title: 'Number Practice 1-100', skill: 'reading', duration: '25 phút', questions: 30 },
        { id: 'vfa8', title: 'Colors & Shapes', skill: 'listening', duration: '20 phút', questions: 15 }
      ],
      createdBy: 'GV. Mai Thị H',
      createdAt: '2024-01-25',
      status: 'active'
    }
  ],

  'VSTEP Starter': [
    {
      id: 'vs1',
      sessionNumber: 1,
      title: 'Basic Grammar - Present Simple',
      description: 'Thì hiện tại đơn và cách sử dụng',
      assignments: [
        { id: 'vsa1', title: 'Present Simple - Reading', skill: 'reading', duration: '40 phút', questions: 20 },
        { id: 'vsa2', title: 'Present Simple - Listening', skill: 'listening', duration: '30 phút', questions: 15 }
      ],
      createdBy: 'Admin System',
      createdAt: '2024-01-12',
      status: 'active'
    },
    {
      id: 'vs2',
      sessionNumber: 2,
      title: 'Daily Routines Vocabulary',
      description: 'Từ vựng về hoạt động hàng ngày',
      assignments: [
        { id: 'vsa3', title: 'Daily Activities - Reading', skill: 'reading', duration: '35 phút', questions: 18 },
        { id: 'vsa4', title: 'Writing About Your Day', skill: 'writing', duration: '45 phút', questions: 1 }
      ],
      createdBy: 'ThS. Lý Văn I',
      createdAt: '2024-01-18',
      status: 'active'
    },
    {
      id: 'vs3',
      sessionNumber: 3,
      title: 'Question Forms',
      description: 'Các dạng câu hỏi cơ bản',
      assignments: [
        { id: 'vsa5', title: 'Listening - Questions & Answers', skill: 'listening', duration: '35 phút', questions: 20 },
        { id: 'vsa6', title: 'Speaking - Asking Questions', skill: 'speaking', duration: '20 phút', questions: 8 }
      ],
      createdBy: 'GV. Trương Thị K',
      createdAt: '2024-01-24',
      status: 'active'
    },
    {
      id: 'vs4',
      sessionNumber: 4,
      title: 'Family & Friends',
      description: 'Nói về gia đình và bạn bè',
      assignments: [
        { id: 'vsa7', title: 'Reading - Family Stories', skill: 'reading', duration: '40 phút', questions: 22 },
        { id: 'vsa8', title: 'Writing - My Family', skill: 'writing', duration: '50 phút', questions: 1 }
      ],
      createdBy: 'TS. Võ Văn L',
      createdAt: '2024-02-01',
      status: 'active'
    },
    {
      id: 'vs5',
      sessionNumber: 5,
      title: 'Present Continuous Tense',
      description: 'Thì hiện tại tiếp diễn',
      assignments: [
        { id: 'vsa9', title: 'Present Continuous - Practice', skill: 'reading', duration: '45 phút', questions: 25 },
        { id: 'vsa10', title: 'Speaking - What Are You Doing?', skill: 'speaking', duration: '25 phút', questions: 6 }
      ],
      createdBy: 'ThS. Hồ Thị M',
      createdAt: '2024-02-08',
      status: 'active'
    }
  ],

  'VSTEP Builder': [
    {
      id: 'vb1',
      sessionNumber: 1,
      title: 'Past Tenses Review',
      description: 'Ôn tập các thì quá khứ',
      assignments: [
        { id: 'vba1', title: 'Past Simple vs Past Continuous', skill: 'reading', duration: '50 phút', questions: 30 },
        { id: 'vba2', title: 'Listening - Past Events', skill: 'listening', duration: '40 phút', questions: 20 }
      ],
      createdBy: 'Admin System',
      createdAt: '2024-01-14',
      status: 'active'
    },
    {
      id: 'vb2',
      sessionNumber: 2,
      title: 'Storytelling Skills',
      description: 'Kỹ năng kể chuyện',
      assignments: [
        { id: 'vba3', title: 'Reading - Short Stories', skill: 'reading', duration: '45 phút', questions: 25 },
        { id: 'vba4', title: 'Writing - Your Story', skill: 'writing', duration: '60 phút', questions: 1 }
      ],
      createdBy: 'GV. Phan Văn N',
      createdAt: '2024-01-22',
      status: 'active'
    },
    {
      id: 'vb3',
      sessionNumber: 3,
      title: 'Describing People & Places',
      description: 'Mô tả người và địa điểm',
      assignments: [
        { id: 'vba5', title: 'Listening - Descriptions', skill: 'listening', duration: '40 phút', questions: 18 },
        { id: 'vba6', title: 'Speaking - Describe Someone', skill: 'speaking', duration: '30 phút', questions: 4 }
      ],
      createdBy: 'ThS. Bùi Thị O',
      createdAt: '2024-01-28',
      status: 'active'
    },
    {
      id: 'vb4',
      sessionNumber: 4,
      title: 'Future Tenses',
      description: 'Các thì tương lai',
      assignments: [
        { id: 'vba7', title: 'Will vs Going to', skill: 'reading', duration: '50 phút', questions: 28 },
        { id: 'vba8', title: 'Writing - Future Plans', skill: 'writing', duration: '55 phút', questions: 1 }
      ],
      createdBy: 'TS. Đinh Văn P',
      createdAt: '2024-02-05',
      status: 'active'
    }
  ],

  'VSTEP Developer': [
    {
      id: 'vd1',
      sessionNumber: 1,
      title: 'Modal Verbs',
      description: 'Động từ khuyết thiếu',
      assignments: [
        { id: 'vda1', title: 'Modal Verbs - Reading Practice', skill: 'reading', duration: '55 phút', questions: 32 },
        { id: 'vda2', title: 'Listening - Modal Usage', skill: 'listening', duration: '45 phút', questions: 22 }
      ],
      createdBy: 'Admin System',
      createdAt: '2024-01-16',
      status: 'active'
    },
    {
      id: 'vd2',
      sessionNumber: 2,
      title: 'Conditional Sentences',
      description: 'Câu điều kiện',
      assignments: [
        { id: 'vda3', title: 'First & Second Conditionals', skill: 'reading', duration: '50 phút', questions: 30 },
        { id: 'vda4', title: 'Writing - If I Were You', skill: 'writing', duration: '60 phút', questions: 1 }
      ],
      createdBy: 'ThS. Dương Thị Q',
      createdAt: '2024-01-24',
      status: 'active'
    },
    {
      id: 'vd3',
      sessionNumber: 3,
      title: 'Passive Voice',
      description: 'Câu bị động',
      assignments: [
        { id: 'vda5', title: 'Passive Voice - All Tenses', skill: 'reading', duration: '60 phút', questions: 35 },
        { id: 'vda6', title: 'Listening - Passive Structures', skill: 'listening', duration: '50 phút', questions: 25 }
      ],
      createdBy: 'GV. Lưu Văn R',
      createdAt: '2024-02-02',
      status: 'active'
    },
    {
      id: 'vd4',
      sessionNumber: 4,
      title: 'Academic Discussion',
      description: 'Thảo luận học thuật',
      assignments: [
        { id: 'vda7', title: 'Speaking - Express Opinions', skill: 'speaking', duration: '35 phút', questions: 6 },
        { id: 'vda8', title: 'Writing - Opinion Essay', skill: 'writing', duration: '65 phút', questions: 1 }
      ],
      createdBy: 'TS. Tô Thị S',
      createdAt: '2024-02-10',
      status: 'active'
    }
  ],

  'VSTEP Booster': [
    {
      id: 'vbo1',
      sessionNumber: 1,
      title: 'Advanced Reading Strategies',
      description: 'Chiến lược đọc nâng cao',
      assignments: [
        { id: 'vboa1', title: 'Skimming & Scanning Techniques', skill: 'reading', duration: '60 phút', questions: 35 },
        { id: 'vboa2', title: 'Reading - Complex Texts', skill: 'reading', duration: '55 phút', questions: 30 }
      ],
      createdBy: 'Admin System',
      createdAt: '2024-01-18',
      status: 'active'
    },
    {
      id: 'vbo2',
      sessionNumber: 2,
      title: 'Advanced Listening Skills',
      description: 'Kỹ năng nghe nâng cao',
      assignments: [
        { id: 'vboa3', title: 'Listening - Academic Lectures', skill: 'listening', duration: '55 phút', questions: 28 },
        { id: 'vboa4', title: 'Listening - Accent Recognition', skill: 'listening', duration: '45 phút', questions: 20 }
      ],
      createdBy: 'ThS. Cao Văn T',
      createdAt: '2024-01-26',
      status: 'active'
    },
    {
      id: 'vbo3',
      sessionNumber: 3,
      title: 'Essay Writing Mastery',
      description: 'Viết luận thành thạo',
      assignments: [
        { id: 'vboa5', title: 'Writing - Problem-Solution Essays', skill: 'writing', duration: '70 phút', questions: 1 },
        { id: 'vboa6', title: 'Writing - Cause-Effect Essays', skill: 'writing', duration: '70 phút', questions: 1 }
      ],
      createdBy: 'GV. Lâm Thị U',
      createdAt: '2024-02-04',
      status: 'active'
    },
    {
      id: 'vbo4',
      sessionNumber: 4,
      title: 'Fluency & Coherence',
      description: 'Nói trôi chảy và mạch lạc',
      assignments: [
        { id: 'vboa7', title: 'Speaking - Extended Discourse', skill: 'speaking', duration: '40 phút', questions: 5 },
        { id: 'vboa8', title: 'Speaking - Debate Practice', skill: 'speaking', duration: '45 phút', questions: 3 }
      ],
      createdBy: 'TS. Khương Văn V',
      createdAt: '2024-02-12',
      status: 'active'
    }
  ],

  'VSTEP Intensive': [
    {
      id: 'vi1',
      sessionNumber: 1,
      title: 'Complex Grammar Structures',
      description: 'Cấu trúc ngữ pháp phức tạp',
      assignments: [
        { id: 'via1', title: 'Advanced Grammar - Reading', skill: 'reading', duration: '65 phút', questions: 40 },
        { id: 'via2', title: 'Grammar in Context', skill: 'listening', duration: '55 phút', questions: 30 }
      ],
      createdBy: 'Admin System',
      createdAt: '2024-01-20',
      status: 'active'
    },
    {
      id: 'vi2',
      sessionNumber: 2,
      title: 'Critical Reading',
      description: 'Đọc phê phán',
      assignments: [
        { id: 'via3', title: 'Reading - Analyze Arguments', skill: 'reading', duration: '70 phút', questions: 38 },
        { id: 'via4', title: 'Reading - Inference Skills', skill: 'reading', duration: '65 phút', questions: 35 }
      ],
      createdBy: 'ThS. Quách Thị W',
      createdAt: '2024-01-28',
      status: 'active'
    },
    {
      id: 'vi3',
      sessionNumber: 3,
      title: 'Academic Writing Excellence',
      description: 'Viết học thuật xuất sắc',
      assignments: [
        { id: 'via5', title: 'Writing - Research Essays', skill: 'writing', duration: '80 phút', questions: 1 },
        { id: 'via6', title: 'Writing - Critical Analysis', skill: 'writing', duration: '75 phút', questions: 1 }
      ],
      createdBy: 'GV. Ứng Văn X',
      createdAt: '2024-02-06',
      status: 'active'
    },
    {
      id: 'vi4',
      sessionNumber: 4,
      title: 'Professional Speaking',
      description: 'Nói chuyên nghiệp',
      assignments: [
        { id: 'via7', title: 'Speaking - Presentations', skill: 'speaking', duration: '50 phút', questions: 2 },
        { id: 'via8', title: 'Speaking - Q&A Sessions', skill: 'speaking', duration: '45 phút', questions: 8 }
      ],
      createdBy: 'TS. Hạ Thị Y',
      createdAt: '2024-02-14',
      status: 'active'
    }
  ],

  'VSTEP Practice': [
    {
      id: 'vp1',
      sessionNumber: 1,
      title: 'Full Practice Test 1',
      description: 'Đề thi thử hoàn chỉnh lần 1',
      assignments: [
        { id: 'vpa1', title: 'Reading - Full Test', skill: 'reading', duration: '60 phút', questions: 40 },
        { id: 'vpa2', title: 'Listening - Full Test', skill: 'listening', duration: '40 phút', questions: 35 },
        { id: 'vpa3', title: 'Writing - Full Test', skill: 'writing', duration: '60 phút', questions: 2 },
        { id: 'vpa4', title: 'Speaking - Full Test', skill: 'speaking', duration: '12 phút', questions: 3 }
      ],
      createdBy: 'Admin System',
      createdAt: '2024-01-22',
      status: 'active'
    },
    {
      id: 'vp2',
      sessionNumber: 2,
      title: 'Full Practice Test 2',
      description: 'Đề thi thử hoàn chỉnh lần 2',
      assignments: [
        { id: 'vpa5', title: 'Reading - Full Test 2', skill: 'reading', duration: '60 phút', questions: 40 },
        { id: 'vpa6', title: 'Listening - Full Test 2', skill: 'listening', duration: '40 phút', questions: 35 },
        { id: 'vpa7', title: 'Writing - Full Test 2', skill: 'writing', duration: '60 phút', questions: 2 },
        { id: 'vpa8', title: 'Speaking - Full Test 2', skill: 'speaking', duration: '12 phút', questions: 3 }
      ],
      createdBy: 'ThS. Từ Văn Z',
      createdAt: '2024-02-01',
      status: 'active'
    },
    {
      id: 'vp3',
      sessionNumber: 3,
      title: 'Full Practice Test 3',
      description: 'Đề thi thử hoàn chỉnh lần 3',
      assignments: [
        { id: 'vpa9', title: 'Reading - Full Test 3', skill: 'reading', duration: '60 phút', questions: 40 },
        { id: 'vpa10', title: 'Listening - Full Test 3', skill: 'listening', duration: '40 phút', questions: 35 },
        { id: 'vpa11', title: 'Writing - Full Test 3', skill: 'writing', duration: '60 phút', questions: 2 },
        { id: 'vpa12', title: 'Speaking - Full Test 3', skill: 'speaking', duration: '12 phút', questions: 3 }
      ],
      createdBy: 'GV. An Thị AA',
      createdAt: '2024-02-10',
      status: 'active'
    }
  ],

  'VSTEP Premium': [
    {
      id: 'vpr1',
      sessionNumber: 1,
      title: 'Personalized Learning Path',
      description: 'Lộ trình học cá nhân hóa',
      assignments: [
        { id: 'vpra1', title: 'Diagnostic Test - Reading', skill: 'reading', duration: '60 phút', questions: 40 },
        { id: 'vpra2', title: 'Diagnostic Test - Listening', skill: 'listening', duration: '40 phút', questions: 35 }
      ],
      createdBy: 'Admin System',
      createdAt: '2024-01-25',
      status: 'active'
    },
    {
      id: 'vpr2',
      sessionNumber: 2,
      title: 'One-on-One Coaching Session 1',
      description: 'Buổi coaching cá nhân lần 1',
      assignments: [
        { id: 'vpra3', title: 'Speaking - Personal Coaching', skill: 'speaking', duration: '60 phút', questions: 10 },
        { id: 'vpra4', title: 'Writing - Personalized Feedback', skill: 'writing', duration: '90 phút', questions: 2 }
      ],
      createdBy: 'TS. Bình Văn BB',
      createdAt: '2024-02-03',
      status: 'active'
    },
    {
      id: 'vpr3',
      sessionNumber: 3,
      title: 'Advanced Techniques Workshop',
      description: 'Workshop kỹ thuật nâng cao',
      assignments: [
        { id: 'vpra5', title: 'Reading - Speed Reading', skill: 'reading', duration: '50 phút', questions: 45 },
        { id: 'vpra6', title: 'Listening - Prediction Skills', skill: 'listening', duration: '45 phút', questions: 30 }
      ],
      createdBy: 'ThS. Châu Thị CC',
      createdAt: '2024-02-12',
      status: 'active'
    },
    {
      id: 'vpr4',
      sessionNumber: 4,
      title: 'Mock Interview Practice',
      description: 'Luyện phỏng vấn thử',
      assignments: [
        { id: 'vpra7', title: 'Speaking - Mock Interview', skill: 'speaking', duration: '30 phút', questions: 15 },
        { id: 'vpra8', title: 'Writing - Professional Email', skill: 'writing', duration: '45 phút', questions: 2 }
      ],
      createdBy: 'GV. Danh Văn DD',
      createdAt: '2024-02-20',
      status: 'active'
    }
  ],

  'VSTEP Master': [
    {
      id: 'vm1',
      sessionNumber: 1,
      title: 'Expert Reading Analysis',
      description: 'Phân tích đọc chuyên gia',
      assignments: [
        { id: 'vma1', title: 'Reading - Research Papers', skill: 'reading', duration: '75 phút', questions: 45 },
        { id: 'vma2', title: 'Reading - Critical Reviews', skill: 'reading', duration: '70 phút', questions: 42 }
      ],
      createdBy: 'Admin System',
      createdAt: '2024-01-28',
      status: 'active'
    },
    {
      id: 'vm2',
      sessionNumber: 2,
      title: 'Advanced Listening Comprehension',
      description: 'Nghe hiểu nâng cao',
      assignments: [
        { id: 'vma3', title: 'Listening - Conference Talks', skill: 'listening', duration: '60 phút', questions: 40 },
        { id: 'vma4', title: 'Listening - Interviews', skill: 'listening', duration: '55 phút', questions: 35 }
      ],
      createdBy: 'TS. Đức Thị EE',
      createdAt: '2024-02-05',
      status: 'active'
    },
    {
      id: 'vm3',
      sessionNumber: 3,
      title: 'Master Writing Skills',
      description: 'Kỹ năng viết bậc thầy',
      assignments: [
        { id: 'vma5', title: 'Writing - Thesis Statements', skill: 'writing', duration: '90 phút', questions: 1 },
        { id: 'vma6', title: 'Writing - Literature Review', skill: 'writing', duration: '85 phút', questions: 1 }
      ],
      createdBy: 'ThS. Giang Văn FF',
      createdAt: '2024-02-13',
      status: 'active'
    },
    {
      id: 'vm4',
      sessionNumber: 4,
      title: 'Expert Speaking Performance',
      description: 'Trình bày chuyên gia',
      assignments: [
        { id: 'vma7', title: 'Speaking - Academic Presentation', skill: 'speaking', duration: '60 phút', questions: 1 },
        { id: 'vma8', title: 'Speaking - Panel Discussion', skill: 'speaking', duration: '45 phút', questions: 10 }
      ],
      createdBy: 'GV. Hải Thị GG',
      createdAt: '2024-02-21',
      status: 'active'
    },
    {
      id: 'vm5',
      sessionNumber: 5,
      title: 'Final Mastery Assessment',
      description: 'Đánh giá thành thạo cuối cùng',
      assignments: [
        { id: 'vma9', title: 'Comprehensive Reading Test', skill: 'reading', duration: '90 phút', questions: 50 },
        { id: 'vma10', title: 'Comprehensive Listening Test', skill: 'listening', duration: '60 phút', questions: 45 },
        { id: 'vma11', title: 'Comprehensive Writing Test', skill: 'writing', duration: '120 phút', questions: 3 },
        { id: 'vma12', title: 'Comprehensive Speaking Test', skill: 'speaking', duration: '20 phút', questions: 12 }
      ],
      createdBy: 'Admin System',
      createdAt: '2024-02-28',
      status: 'active'
    }
  ]
};

export function AdminRoadmapManagementPage() {
  const [activeLevel, setActiveLevel] = useState<CourseType>('VSTEP Complete');
  const [sessions, setSessions] = useState<RoadmapSession[]>(mockRoadmapsData['VSTEP Complete']);
  const [expandedSessions, setExpandedSessions] = useState<string[]>([]);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicatingSessionId, setDuplicatingSessionId] = useState<string | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<{ sessionId: string; assignment: SessionAssignment } | null>(null);
  const [showEditAssignmentModal, setShowEditAssignmentModal] = useState(false);

  const toggleSession = (sessionId: string) => {
    setExpandedSessions(prev =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const handleLevelChange = (level: CourseType) => {
    setActiveLevel(level);
    setSessions(mockRoadmapsData[level]);
    setExpandedSessions([]);
    setEditingSession(null);
  };

  const handleAddSession = () => {
    const newSession: RoadmapSession = {
      id: `s${Date.now()}`,
      sessionNumber: sessions.length + 1,
      title: 'Buổi học mới',
      description: 'Mô tả buổi học',
      assignments: [],
      createdBy: 'Admin',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft'
    };
    setSessions([...sessions, newSession]);
    setShowAddSessionModal(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    setDeletingSessionId(sessionId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deletingSessionId) {
      setSessions(sessions.filter(s => s.id !== deletingSessionId));
      setShowDeleteConfirm(false);
      setDeletingSessionId(null);
    }
  };

  const handleDuplicateSession = (sessionId: string) => {
    setDuplicatingSessionId(sessionId);
    setShowDuplicateModal(true);
  };

  const confirmDuplicate = () => {
    if (duplicatingSessionId) {
      const sessionToDuplicate = sessions.find(s => s.id === duplicatingSessionId);
      if (sessionToDuplicate) {
        const newSession: RoadmapSession = {
          ...sessionToDuplicate,
          id: `s${Date.now()}`,
          sessionNumber: sessions.length + 1,
          title: `${sessionToDuplicate.title} (Copy)`,
          createdAt: new Date().toISOString().split('T')[0],
          status: 'draft'
        };
        setSessions([...sessions, newSession]);
      }
      setShowDuplicateModal(false);
      setDuplicatingSessionId(null);
    }
  };

  const updateSessionStatus = (sessionId: string, status: 'active' | 'draft' | 'archived') => {
    setSessions(sessions.map(s => s.id === sessionId ? { ...s, status } : s));
  };

  const handleEditAssignment = (sessionId: string, assignment: SessionAssignment) => {
    setEditingAssignment({ sessionId, assignment });
    setShowEditAssignmentModal(true);
  };

  const handleUpdateAssignment = (updatedAssignment: SessionAssignment) => {
    if (editingAssignment) {
      setSessions(sessions.map(session => 
        session.id === editingAssignment.sessionId
          ? {
              ...session,
              assignments: session.assignments.map(a => 
                a.id === editingAssignment.assignment.id ? updatedAssignment : a
              )
            }
          : session
      ));
      setShowEditAssignmentModal(false);
      setEditingAssignment(null);
    }
  };

  const handleDeleteAssignment = (sessionId: string, assignmentId: string) => {
    setSessions(sessions.map(session => 
      session.id === sessionId
        ? {
            ...session,
            assignments: session.assignments.filter(a => a.id !== assignmentId)
          }
        : session
    ));
  };

  const getSkillIcon = (skill: SkillType) => {
    const icons = {
      reading: '📖',
      listening: '👂',
      writing: '✍️',
      speaking: '🗣️'
    };
    return icons[skill];
  };

  const getSkillColor = (skill: SkillType) => {
    const colors = {
      reading: 'bg-blue-100 text-blue-700 border-blue-200',
      listening: 'bg-green-100 text-green-700 border-green-200',
      writing: 'bg-orange-100 text-orange-700 border-orange-200',
      speaking: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[skill];
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs"><Check className="size-3" />Đang hoạt động</span>;
      case 'draft':
        return <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"><Clock className="size-3" />Nháp</span>;
      case 'archived':
        return <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"><X className="size-3" />Đã lưu trữ</span>;
      default:
        return null;
    }
  };

  // Count stats
  const totalSessions = sessions.length;
  const activeSessions = sessions.filter(s => s.status === 'active').length;
  const draftSessions = sessions.filter(s => s.status === 'draft').length;
  const totalAssignments = sessions.reduce((sum, s) => sum + s.assignments.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🗺️ Quản lý lộ trình học tập</h1>
            <p className="text-red-100">
              Thiết kế và quản lý lộ trình học tập cho 10 khóa học VSTEP
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddSessionModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              <Plus className="size-5" />
              Thêm buổi học
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="size-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalSessions}</h3>
          <p className="text-sm text-gray-600">Tổng số buổi</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Check className="size-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{activeSessions}</h3>
          <p className="text-sm text-gray-600">Đang hoạt động</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="size-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{draftSessions}</h3>
          <p className="text-sm text-gray-600">Bản nháp</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="size-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalAssignments}</h3>
          <p className="text-sm text-gray-600">Tổng bài tập</p>
        </div>
      </div>

      {/* Level/Course Tabs */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Chọn khóa học</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { name: 'VSTEP Complete', icon: '🎯', color: 'red' },
            { name: 'VSTEP Foundation', icon: '📚', color: 'red' },
            { name: 'VSTEP Starter', icon: '🚀', color: 'red' },
            { name: 'VSTEP Builder', icon: '🏗️', color: 'red' },
            { name: 'VSTEP Developer', icon: '💻', color: 'red' },
            { name: 'VSTEP Booster', icon: '⚡', color: 'red' },
            { name: 'VSTEP Intensive', icon: '🔥', color: 'red' },
            { name: 'VSTEP Practice', icon: '📝', color: 'red' },
            { name: 'VSTEP Premium', icon: '👑', color: 'red' },
            { name: 'VSTEP Master', icon: '🏆', color: 'red' },
          ].map((course) => {
            const courseData = mockRoadmapsData[course.name as CourseType];
            const sessionCount = courseData?.length || 0;
            const assignmentCount = courseData?.reduce((sum, s) => sum + s.assignments.length, 0) || 0;
            
            return (
              <button
                key={course.name}
                onClick={() => handleLevelChange(course.name as CourseType)}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  activeLevel === course.name
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="text-sm font-bold">{course.icon} {course.name}</div>
                <div className="text-xs opacity-80 mt-1">{sessionCount} buổi • {assignmentCount} bài</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border-2 border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="size-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có buổi học nào</h3>
            <p className="text-gray-600 mb-6">
              Bắt đầu tạo lộ trình học tập cho khóa học {activeLevel}
            </p>
            <button
              onClick={() => setShowAddSessionModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Plus className="size-5" />
              Thêm buổi học đầu tiên
            </button>
          </div>
        ) : (
          sessions.map((session) => {
            const isExpanded = expandedSessions.includes(session.id);
            const isEditing = editingSession === session.id;

            return (
              <div key={session.id} className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
                {/* Session Header */}
                <div className="px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="cursor-move">
                      <GripVertical className="size-5 text-gray-400" />
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-lg">
                      {session.sessionNumber}
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={session.title}
                            onChange={(e) => {
                              const updated = sessions.map(s => 
                                s.id === session.id ? { ...s, title: e.target.value } : s
                              );
                              setSessions(updated);
                            }}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Tiêu đề buổi học"
                          />
                          <input
                            type="text"
                            value={session.description}
                            onChange={(e) => {
                              const updated = sessions.map(s => 
                                s.id === session.id ? { ...s, description: e.target.value } : s
                              );
                              setSessions(updated);
                            }}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Mô tả buổi học"
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold text-gray-900 text-lg">{session.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{session.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            {getStatusBadge(session.status)}
                            <span className="text-xs text-gray-500">
                              Tạo bởi: {session.createdBy} • {session.createdAt}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500">Bài tập</div>
                      <div className="text-lg font-bold text-gray-900">{session.assignments.length}</div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setEditingSession(null)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Lưu"
                        >
                          <Check className="size-5" />
                        </button>
                        <button
                          onClick={() => setEditingSession(null)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Hủy"
                        >
                          <X className="size-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        {session.status === 'draft' && (
                          <button
                            onClick={() => updateSessionStatus(session.id, 'active')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Kích hoạt"
                          >
                            <Check className="size-5" />
                          </button>
                        )}
                        {session.status === 'active' && (
                          <button
                            onClick={() => updateSessionStatus(session.id, 'archived')}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Lưu trữ"
                          >
                            <Clock className="size-5" />
                          </button>
                        )}
                        <button
                          onClick={() => setEditingSession(session.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="size-5" />
                        </button>
                        <button
                          onClick={() => handleDuplicateSession(session.id)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Nhân bản"
                        >
                          <Copy className="size-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="size-5" />
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => toggleSession(session.id)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors ml-2"
                    >
                      {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Content - Assignments */}
                {isExpanded && (
                  <div className="border-t-2 border-gray-200 bg-gray-50 p-6">
                    <div className="space-y-3">
                      {session.assignments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <BookOpen className="size-12 mx-auto mb-2 text-gray-400" />
                          <p>Chưa có bài tập nào</p>
                        </div>
                      ) : (
                        session.assignments.map((assignment) => (
                          <div key={assignment.id} className="bg-white p-4 rounded-lg border-2 border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{getSkillIcon(assignment.skill)}</span>
                              <div>
                                <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getSkillColor(assignment.skill)}`}>
                                    {assignment.skill.toUpperCase()}
                                  </span>
                                  <span className="text-xs text-gray-500">⏱️ {assignment.duration}</span>
                                  <span className="text-xs text-gray-500">❓ {assignment.questions} câu</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditAssignment(session.id, assignment)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit2 className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAssignment(session.id, assignment.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Session Modal */}
      {showAddSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="border-b-2 border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Thêm buổi học mới</h2>
                <button
                  onClick={() => setShowAddSessionModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="size-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề buổi học</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                  placeholder="Nhập tiêu đề..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                  placeholder="Nhập mô tả..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none">
                  <option value="draft">Nháp</option>
                  <option value="active">Đang hoạt động</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddSessionModal(false)}
                  className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddSession}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Thêm buổi học
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="size-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa buổi học này? Tất cả bài tập trong buổi học cũng sẽ bị xóa.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingSessionId(null);
                  }}
                  className="flex-1 px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Confirmation Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Copy className="size-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nhân bản buổi học</h3>
              <p className="text-gray-600 mb-6">
                Tạo một bản sao của buổi học này với tất cả bài tập?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDuplicateModal(false);
                    setDuplicatingSessionId(null);
                  }}
                  className="flex-1 px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDuplicate}
                  className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Nhân bản
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {showEditAssignmentModal && editingAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="border-b-2 border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài tập</h2>
                <button
                  onClick={() => setShowEditAssignmentModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="size-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề bài tập</label>
                <input
                  type="text"
                  value={editingAssignment.assignment.title}
                  onChange={(e) => {
                    const updatedAssignment = { ...editingAssignment.assignment, title: e.target.value };
                    setEditingAssignment({ ...editingAssignment, assignment: updatedAssignment });
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
                <select
                  value={editingAssignment.assignment.skill}
                  onChange={(e) => {
                    const updatedAssignment = { ...editingAssignment.assignment, skill: e.target.value as SkillType };
                    setEditingAssignment({ ...editingAssignment, assignment: updatedAssignment });
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                >
                  <option value="reading">Đọc</option>
                  <option value="listening">Nghe</option>
                  <option value="writing">Viết</option>
                  <option value="speaking">Nói</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thời lượng</label>
                <input
                  type="text"
                  value={editingAssignment.assignment.duration}
                  onChange={(e) => {
                    const updatedAssignment = { ...editingAssignment.assignment, duration: e.target.value };
                    setEditingAssignment({ ...editingAssignment, assignment: updatedAssignment });
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số câu hỏi</label>
                <input
                  type="number"
                  value={editingAssignment.assignment.questions}
                  onChange={(e) => {
                    const updatedAssignment = { ...editingAssignment.assignment, questions: parseInt(e.target.value, 10) };
                    setEditingAssignment({ ...editingAssignment, assignment: updatedAssignment });
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowEditAssignmentModal(false)}
                  className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleUpdateAssignment(editingAssignment.assignment)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}