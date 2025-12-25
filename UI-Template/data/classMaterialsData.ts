// Shared data for Class Materials (Textbook & Media) between Admin and Teacher

export type ClassCategory = 'textbook' | 'media';
export type MaterialStatus = 'approved' | 'pending' | 'rejected';

export interface BaseMaterial {
  id: number;
  name: string;
  description: string;
  type: string;
  size: string;
  downloads: number;
  views: number;
  course: string;
  category: ClassCategory;
  uploadedBy: string;
  uploadedAt: string;
  status: MaterialStatus;
}

export interface TextbookMaterial extends BaseMaterial {
  category: 'textbook';
  author?: string;
  pages?: number;
}

export interface MediaMaterial extends BaseMaterial {
  category: 'media';
  skill?: string;
  duration?: string;
}

export type Material = TextbookMaterial | MediaMaterial;

// Mock data - Textbook Materials (Giáo trình) - 10 khóa học
export const textbookMaterialsData: TextbookMaterial[] = [
  // VSTEP Complete
  {
    id: 1,
    name: 'VSTEP Complete Guide Book',
    description: 'Giáo trình toàn diện cho khóa học VSTEP Complete',
    type: 'pdf',
    size: '45.2 MB',
    downloads: 2340,
    views: 5678,
    course: 'VSTEP Complete',
    category: 'textbook',
    author: 'Cambridge University Press',
    pages: 320,
    uploadedBy: 'Admin System',
    uploadedAt: '2024-01-10',
    status: 'approved'
  },
  {
    id: 2,
    name: 'VSTEP Complete Workbook',
    description: 'Sách bài tập thực hành toàn diện',
    type: 'pdf',
    size: '38.4 MB',
    downloads: 1890,
    views: 4321,
    course: 'VSTEP Complete',
    category: 'textbook',
    author: 'Oxford University Press',
    pages: 280,
    uploadedBy: 'Admin System',
    uploadedAt: '2024-01-11',
    status: 'approved'
  },

  // VSTEP Foundation
  {
    id: 3,
    name: 'VSTEP Foundation Student Book',
    description: 'Sách học sinh VSTEP Foundation với bài tập cơ bản',
    type: 'pdf',
    size: '28.5 MB',
    downloads: 1850,
    views: 3421,
    course: 'VSTEP Foundation',
    category: 'textbook',
    author: 'Pearson Education',
    pages: 250,
    uploadedBy: 'Teacher Nguyen',
    uploadedAt: '2024-01-15',
    status: 'approved'
  },
  {
    id: 4,
    name: 'VSTEP Foundation Practice Tests',
    description: 'Bộ đề kiểm tra Foundation với đáp án chi tiết',
    type: 'pdf',
    size: '22.1 MB',
    downloads: 1456,
    views: 2987,
    course: 'VSTEP Foundation',
    category: 'textbook',
    author: 'McGraw-Hill',
    pages: 180,
    uploadedBy: 'Teacher Le',
    uploadedAt: '2024-01-16',
    status: 'approved'
  },

  // VSTEP Starter
  {
    id: 5,
    name: 'VSTEP Starter Essential Book',
    description: 'Giáo trình căn bản cho người mới bắt đầu',
    type: 'pdf',
    size: '32.8 MB',
    downloads: 1234,
    views: 2890,
    course: 'VSTEP Starter',
    category: 'textbook',
    author: 'National Geographic Learning',
    pages: 180,
    uploadedBy: 'Teacher Tran',
    uploadedAt: '2024-01-20',
    status: 'approved'
  },

  // VSTEP Builder
  {
    id: 6,
    name: 'VSTEP Builder Complete Textbook',
    description: 'Giáo trình đầy đủ cho khóa học Builder',
    type: 'pdf',
    size: '41.3 MB',
    downloads: 998,
    views: 2156,
    course: 'VSTEP Builder',
    category: 'textbook',
    author: 'Cengage Learning',
    pages: 295,
    uploadedBy: 'Admin System',
    uploadedAt: '2024-01-22',
    status: 'approved'
  },

  // VSTEP Developer
  {
    id: 7,
    name: 'VSTEP Developer Advanced Guide',
    description: 'Hướng dẫn nâng cao cho khóa Developer',
    type: 'pdf',
    size: '36.7 MB',
    downloads: 876,
    views: 1923,
    course: 'VSTEP Developer',
    category: 'textbook',
    author: 'Macmillan Education',
    pages: 265,
    uploadedBy: 'Teacher Pham',
    uploadedAt: '2024-01-25',
    status: 'approved'
  },

  // VSTEP Booster
  {
    id: 8,
    name: 'VSTEP Booster Intensive Textbook',
    description: 'Giáo trình tăng tốc cho khóa Booster',
    type: 'pdf',
    size: '29.8 MB',
    downloads: 1123,
    views: 2456,
    course: 'VSTEP Booster',
    category: 'textbook',
    author: 'Express Publishing',
    pages: 220,
    uploadedBy: 'Admin System',
    uploadedAt: '2024-01-28',
    status: 'approved'
  },

  // VSTEP Intensive
  {
    id: 9,
    name: 'VSTEP Intensive Course Book',
    description: 'Sách giáo trình cho khóa học tập trung',
    type: 'pdf',
    size: '33.5 MB',
    downloads: 765,
    views: 1678,
    course: 'VSTEP Intensive',
    category: 'textbook',
    author: 'Longman',
    pages: 240,
    uploadedBy: 'Teacher Hoang',
    uploadedAt: '2024-02-01',
    status: 'approved'
  },

  // VSTEP Practice
  {
    id: 10,
    name: 'VSTEP Practice Test Collection',
    description: 'Bộ sưu tập đề thi thực hành VSTEP',
    type: 'pdf',
    size: '44.2 MB',
    downloads: 2145,
    views: 4891,
    course: 'VSTEP Practice',
    category: 'textbook',
    author: 'Cambridge Assessment',
    pages: 350,
    uploadedBy: 'Admin System',
    uploadedAt: '2024-02-05',
    status: 'approved'
  },

  // VSTEP Premium
  {
    id: 11,
    name: 'VSTEP Premium Master Guide',
    description: 'Hướng dẫn toàn diện cho khóa Premium',
    type: 'pdf',
    size: '39.6 MB',
    downloads: 1567,
    views: 3421,
    course: 'VSTEP Premium',
    category: 'textbook',
    author: 'Collins English',
    pages: 290,
    uploadedBy: 'Teacher Minh',
    uploadedAt: '2024-02-08',
    status: 'approved'
  },

  // VSTEP Master
  {
    id: 12,
    name: 'VSTEP Master Expert Textbook',
    description: 'Giáo trình chuyên gia cho khóa Master',
    type: 'pdf',
    size: '48.9 MB',
    downloads: 1789,
    views: 3987,
    course: 'VSTEP Master',
    category: 'textbook',
    author: 'IELTS Official',
    pages: 380,
    uploadedBy: 'Admin System',
    uploadedAt: '2024-02-10',
    status: 'approved'
  },
];

// Mock data - Media Materials (Audio/Video) - 10 khóa học
export const mediaMaterialsData: MediaMaterial[] = [
  // VSTEP Complete
  {
    id: 101,
    name: 'Complete Listening Collection',
    description: 'Bộ tài liệu Audio Listening cho VSTEP Complete',
    type: 'audio',
    size: '520 MB',
    downloads: 3200,
    views: 8900,
    course: 'VSTEP Complete',
    category: 'media',
    skill: 'Listening',
    duration: '4h 30m',
    uploadedBy: 'Admin System',
    uploadedAt: '2024-01-08',
    status: 'approved'
  },
  {
    id: 102,
    name: 'Complete Speaking Video Tutorials',
    description: 'Video hướng dẫn Speaking toàn diện',
    type: 'video',
    size: '1.8 GB',
    downloads: 2890,
    views: 7654,
    course: 'VSTEP Complete',
    category: 'media',
    skill: 'Speaking',
    duration: '7h 15m',
    uploadedBy: 'Admin System',
    uploadedAt: '2024-01-09',
    status: 'approved'
  },

  // VSTEP Foundation
  {
    id: 103,
    name: 'Foundation Listening Practice',
    description: 'Audio luyện nghe Foundation cơ bản',
    type: 'audio',
    size: '380 MB',
    downloads: 2450,
    views: 5432,
    course: 'VSTEP Foundation',
    category: 'media',
    skill: 'Listening',
    duration: '3h 20m',
    uploadedBy: 'Teacher Le',
    uploadedAt: '2024-01-12',
    status: 'approved'
  },
  {
    id: 104,
    name: 'Foundation Speaking Tutorial Videos',
    description: 'Video hướng dẫn Speaking Foundation chi tiết',
    type: 'video',
    size: '1.2 GB',
    downloads: 2780,
    views: 6543,
    course: 'VSTEP Foundation',
    category: 'media',
    skill: 'Speaking',
    duration: '6h 15m',
    uploadedBy: 'Teacher Le',
    uploadedAt: '2024-01-13',
    status: 'approved'
  },

  // VSTEP Starter
  {
    id: 105,
    name: 'Starter Pronunciation Audio Pack',
    description: 'Tài liệu Audio luyện phát âm cơ bản',
    type: 'audio',
    size: '280 MB',
    downloads: 1567,
    views: 3890,
    course: 'VSTEP Starter',
    category: 'media',
    skill: 'Speaking',
    duration: '2h 45m',
    uploadedBy: 'Teacher Pham',
    uploadedAt: '2024-01-18',
    status: 'approved'
  },
  {
    id: 106,
    name: 'Starter Listening Basics',
    description: 'Audio nghe cơ bản cho người mới',
    type: 'audio',
    size: '195 MB',
    downloads: 1234,
    views: 2876,
    course: 'VSTEP Starter',
    category: 'media',
    skill: 'Listening',
    duration: '2h 10m',
    uploadedBy: 'Teacher Tran',
    uploadedAt: '2024-01-19',
    status: 'approved'
  },

  // VSTEP Builder
  {
    id: 107,
    name: 'Builder Advanced Listening',
    description: 'Audio nghe nâng cao Builder',
    type: 'audio',
    size: '445 MB',
    downloads: 987,
    views: 2134,
    course: 'VSTEP Builder',
    category: 'media',
    skill: 'Listening',
    duration: '3h 45m',
    uploadedBy: 'Admin System',
    uploadedAt: '2024-01-21',
    status: 'approved'
  },
  {
    id: 108,
    name: 'Builder Writing Video Lessons',
    description: 'Video hướng dẫn Writing Builder',
    type: 'video',
    size: '1.5 GB',
    downloads: 876,
    views: 1987,
    course: 'VSTEP Builder',
    category: 'media',
    skill: 'Writing',
    duration: '5h 30m',
    uploadedBy: 'Teacher Nguyen',
    uploadedAt: '2024-01-23',
    status: 'approved'
  },

  // VSTEP Developer
  {
    id: 109,
    name: 'Developer Reading Strategies',
    description: 'Video chiến lược đọc hiểu Developer',
    type: 'video',
    size: '980 MB',
    downloads: 765,
    views: 1765,
    course: 'VSTEP Developer',
    category: 'media',
    skill: 'Reading',
    duration: '4h 20m',
    uploadedBy: 'Teacher Pham',
    uploadedAt: '2024-01-26',
    status: 'approved'
  },
  {
    id: 110,
    name: 'Developer Listening Advanced',
    description: 'Audio nghe nâng cao Developer',
    type: 'audio',
    size: '390 MB',
    downloads: 698,
    views: 1543,
    course: 'VSTEP Developer',
    category: 'media',
    skill: 'Listening',
    duration: '3h 15m',
    uploadedBy: 'Admin System',
    uploadedAt: '2024-01-27',
    status: 'approved'
  },

  // VSTEP Booster
  {
    id: 111,
    name: 'Booster Speed Listening',
    description: 'Audio nghe tốc độ cao Booster',
    type: 'audio',
    size: '475 MB',
    downloads: 1089,
    views: 2345,
    course: 'VSTEP Booster',
    category: 'media',
    skill: 'Listening',
    duration: '4h 00m',
    uploadedBy: 'Teacher Hoang',
    uploadedAt: '2024-01-29',
    status: 'approved'
  },
  {
    id: 112,
    name: 'Booster Speaking Express',
    description: 'Video Speaking tăng tốc',
    type: 'video',
    size: '1.3 GB',
    downloads: 945,
    views: 2098,
    course: 'VSTEP Booster',
    category: 'media',
    skill: 'Speaking',
    duration: '5h 45m',
    uploadedBy: 'Admin System',
    uploadedAt: '2024-01-30',
    status: 'approved'
  },

  // VSTEP Intensive
  {
    id: 113,
    name: 'Intensive Listening Marathon',
    description: 'Audio nghe tập trung Intensive',
    type: 'audio',
    size: '560 MB',
    downloads: 723,
    views: 1623,
    course: 'VSTEP Intensive',
    category: 'media',
    skill: 'Listening',
    duration: '4h 40m',
    uploadedBy: 'Teacher Minh',
    uploadedAt: '2024-02-02',
    status: 'approved'
  },
  {
    id: 114,
    name: 'Intensive Writing Masterclass',
    description: 'Video Writing chuyên sâu',
    type: 'video',
    size: '1.6 GB',
    downloads: 654,
    views: 1478,
    course: 'VSTEP Intensive',
    category: 'media',
    skill: 'Writing',
    duration: '6h 30m',
    uploadedBy: 'Teacher Hoang',
    uploadedAt: '2024-02-03',
    status: 'approved'
  },

  // VSTEP Practice
  {
    id: 115,
    name: 'Practice Test Audio Collection',
    description: 'Bộ audio đề thi thực hành',
    type: 'audio',
    size: '680 MB',
    downloads: 2034,
    views: 4567,
    course: 'VSTEP Practice',
    category: 'media',
    skill: 'Listening',
    duration: '5h 20m',
    uploadedBy: 'Admin System',
    uploadedAt: '2024-02-06',
    status: 'approved'
  },
  {
    id: 116,
    name: 'Practice Speaking Mock Tests',
    description: 'Video thi thử Speaking thực tế',
    type: 'video',
    size: '2.1 GB',
    downloads: 1876,
    views: 4123,
    course: 'VSTEP Practice',
    category: 'media',
    skill: 'Speaking',
    duration: '8h 00m',
    uploadedBy: 'Teacher Le',
    uploadedAt: '2024-02-07',
    status: 'approved'
  },

  // VSTEP Premium
  {
    id: 117,
    name: 'Premium Advanced Listening',
    description: 'Audio nghe nâng cao Premium',
    type: 'audio',
    size: '595 MB',
    downloads: 1456,
    views: 3234,
    course: 'VSTEP Premium',
    category: 'media',
    skill: 'Listening',
    duration: '4h 50m',
    uploadedBy: 'Teacher Minh',
    uploadedAt: '2024-02-09',
    status: 'approved'
  },
  {
    id: 118,
    name: 'Premium Speaking Excellence',
    description: 'Video Speaking xuất sắc Premium',
    type: 'video',
    size: '1.9 GB',
    downloads: 1234,
    views: 2987,
    course: 'VSTEP Premium',
    category: 'media',
    skill: 'Speaking',
    duration: '7h 30m',
    uploadedBy: 'Admin System',
    uploadedAt: '2024-02-10',
    status: 'approved'
  },

  // VSTEP Master
  {
    id: 119,
    name: 'Master Expert Listening',
    description: 'Audio nghe chuyên gia Master',
    type: 'audio',
    size: '720 MB',
    downloads: 1678,
    views: 3765,
    course: 'VSTEP Master',
    category: 'media',
    skill: 'Listening',
    duration: '5h 45m',
    uploadedBy: 'Admin System',
    uploadedAt: '2024-02-11',
    status: 'approved'
  },
  {
    id: 120,
    name: 'Master Speaking Professional',
    description: 'Video Speaking chuyên nghiệp Master',
    type: 'video',
    size: '2.3 GB',
    downloads: 1543,
    views: 3456,
    course: 'VSTEP Master',
    category: 'media',
    skill: 'Speaking',
    duration: '8h 45m',
    uploadedBy: 'Teacher Nguyen',
    uploadedAt: '2024-02-12',
    status: 'approved'
  },
];
