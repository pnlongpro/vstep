// Class Materials Data - 100 tài liệu lớp học

export type ClassCategory = 'textbook' | 'media';

export interface TextbookMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'pptx';
  category: 'textbook';
  size: string;
  uploadDate: string;
  views: number;
  downloads: number;
  description: string;
  course?: string;
  author?: string;
}

export interface MediaMaterial {
  id: string;
  name: string;
  type: 'video' | 'audio';
  category: 'media';
  skill?: 'Reading' | 'Listening' | 'Writing' | 'Speaking';
  course?: string;
  size: string;
  uploadDate: string;
  views: number;
  downloads: number;
  description: string;
  duration: string;
}

export type ClassMaterial = TextbookMaterial | MediaMaterial;

// TEXTBOOK MATERIALS - Giáo trình (50 items)
export const textbookMaterials: TextbookMaterial[] = [
  // VSTEP Complete - 10 items
  { id: 'TB001', name: 'VSTEP Complete Preparation', type: 'pdf', category: 'textbook', size: '45.8 MB', uploadDate: '2024-12-01', views: 2345, downloads: 1876, description: 'Giáo trình VSTEP đầy đủ 4 kỹ năng với lý thuyết và bài tập', course: 'VSTEP Complete', author: 'TS. Nguyễn Văn A' },
  { id: 'TB001B', name: 'VSTEP Complete - Reading Section', type: 'pdf', category: 'textbook', size: '32.4 MB', uploadDate: '2024-12-01', views: 1987, downloads: 1543, description: 'Giáo trình Reading chuyên sâu với chiến lược làm bài', course: 'VSTEP Complete', author: 'TS. Nguyễn Văn A' },
  { id: 'TB001C', name: 'VSTEP Complete - Listening Section', type: 'pdf', category: 'textbook', size: '28.9 MB', uploadDate: '2024-12-01', views: 2134, downloads: 1678, description: 'Giáo trình Listening với kỹ thuật nghe hiệu quả', course: 'VSTEP Complete', author: 'ThS. Trần Thị B' },
  { id: 'TB001D', name: 'VSTEP Complete - Writing Section', type: 'pdf', category: 'textbook', size: '35.2 MB', uploadDate: '2024-12-01', views: 1876, downloads: 1432, description: 'Giáo trình Writing với templates và samples', course: 'VSTEP Complete', author: 'ThS. Lê Văn C' },
  { id: 'TB001E', name: 'VSTEP Complete - Speaking Section', type: 'pdf', category: 'textbook', size: '29.7 MB', uploadDate: '2024-12-01', views: 2045, downloads: 1654, description: 'Giáo trình Speaking với chiến thuật 3 parts', course: 'VSTEP Complete', author: 'TS. Phạm Văn D' },
  { id: 'TB001F', name: 'VSTEP Complete - Grammar Guide', type: 'pdf', category: 'textbook', size: '41.3 MB', uploadDate: '2024-12-02', views: 2234, downloads: 1765, description: 'Ngữ pháp toàn diện cho VSTEP', course: 'VSTEP Complete', author: 'GV. Ngô Thị E' },
  { id: 'TB001G', name: 'VSTEP Complete - Vocabulary 3000', type: 'pdf', category: 'textbook', size: '38.6 MB', uploadDate: '2024-12-02', views: 1987, downloads: 1543, description: '3000 từ vựng thiết yếu cho VSTEP', course: 'VSTEP Complete', author: 'ThS. Hoàng Thị F' },
  { id: 'TB001H', name: 'VSTEP Complete - Practice Tests', type: 'pdf', category: 'textbook', size: '52.4 MB', uploadDate: '2024-12-03', views: 2345, downloads: 1876, description: 'Bộ đề thi thử VSTEP hoàn chỉnh', course: 'VSTEP Complete', author: 'TS. Đỗ Văn G' },
  { id: 'TB001I', name: 'VSTEP Complete - Answer Keys', type: 'pdf', category: 'textbook', size: '22.8 MB', uploadDate: '2024-12-03', views: 1765, downloads: 1432, description: 'Đáp án và giải thích chi tiết', course: 'VSTEP Complete', author: 'GV. Mai Thị H' },
  { id: 'TB001J', name: 'VSTEP Complete - Study Planner', type: 'pdf', category: 'textbook', size: '15.3 MB', uploadDate: '2024-12-04', views: 1543, downloads: 1234, description: 'Lộ trình học tập chi tiết 10 tuần', course: 'VSTEP Complete', author: 'ThS. Lý Văn I' },

  // VSTEP Foundation - 5 items
  { id: 'TB002', name: 'VSTEP Foundation Coursebook', type: 'pdf', category: 'textbook', size: '38.3 MB', uploadDate: '2024-12-05', views: 1987, downloads: 1543, description: 'Giáo trình nền tảng VSTEP', course: 'VSTEP Foundation', author: 'ThS. Trần Thị B' },
  { id: 'TB002B', name: 'VSTEP Foundation - Workbook', type: 'pdf', category: 'textbook', size: '29.7 MB', uploadDate: '2024-12-05', views: 1765, downloads: 1345, description: 'Sách bài tập nền tảng', course: 'VSTEP Foundation', author: 'GV. Lê Văn K' },
  { id: 'TB002C', name: 'VSTEP Foundation - Teacher Guide', type: 'pdf', category: 'textbook', size: '24.5 MB', uploadDate: '2024-12-06', views: 1543, downloads: 1234, description: 'Hướng dẫn giảng viên', course: 'VSTEP Foundation', author: 'TS. Phạm Thị L' },
  { id: 'TB002D', name: 'VSTEP Foundation - Assessment Pack', type: 'pdf', category: 'textbook', size: '31.2 MB', uploadDate: '2024-12-06', views: 1876, downloads: 1456, description: 'Bộ đề kiểm tra đánh giá', course: 'VSTEP Foundation', author: 'ThS. Ngô Văn M' },
  { id: 'TB002E', name: 'VSTEP Foundation - Digital Resources', type: 'pdf', category: 'textbook', size: '18.9 MB', uploadDate: '2024-12-07', views: 1654, downloads: 1323, description: 'Tài liệu số hỗ trợ', course: 'VSTEP Foundation', author: 'GV. Hoàng Thị N' },

  // VSTEP Starter - 5 items
  { id: 'TB003', name: 'VSTEP Starter Level A2', type: 'pdf', category: 'textbook', size: '32.5 MB', uploadDate: '2024-12-08', views: 2156, downloads: 1687, description: 'Giáo trình khởi đầu A2', course: 'VSTEP Starter', author: 'GV. Lê Văn C' },
  { id: 'TB003B', name: 'VSTEP Starter - Listening A2', type: 'pdf', category: 'textbook', size: '27.8 MB', uploadDate: '2024-12-08', views: 1987, downloads: 1543, description: 'Luyện nghe cơ bản A2', course: 'VSTEP Starter', author: 'ThS. Đỗ Thị O' },
  { id: 'TB003C', name: 'VSTEP Starter - Speaking A2', type: 'pdf', category: 'textbook', size: '23.4 MB', uploadDate: '2024-12-09', views: 2045, downloads: 1654, description: 'Luyện nói cơ bản A2', course: 'VSTEP Starter', author: 'TS. Mai Văn P' },
  { id: 'TB003D', name: 'VSTEP Starter - Reading A2', type: 'pdf', category: 'textbook', size: '29.1 MB', uploadDate: '2024-12-09', views: 1876, downloads: 1456, description: 'Luyện đọc cơ bản A2', course: 'VSTEP Starter', author: 'GV. Lý Thị Q' },
  { id: 'TB003E', name: 'VSTEP Starter - Writing A2', type: 'pdf', category: 'textbook', size: '25.7 MB', uploadDate: '2024-12-10', views: 1765, downloads: 1345, description: 'Luyện viết cơ bản A2', course: 'VSTEP Starter', author: 'ThS. Trương Văn R' },

  // VSTEP Builder - 5 items
  { id: 'TB004', name: 'VSTEP Builder Level B1', type: 'pptx', category: 'textbook', size: '18.7 MB', uploadDate: '2024-12-11', views: 1765, downloads: 1432, description: 'Giáo trình xây dựng B1', course: 'VSTEP Builder', author: 'ThS. Hoàng Thị D' },
  { id: 'TB004B', name: 'VSTEP Builder - Grammar B1', type: 'pdf', category: 'textbook', size: '33.6 MB', uploadDate: '2024-12-11', views: 1987, downloads: 1543, description: 'Ngữ pháp B1 thực hành', course: 'VSTEP Builder', author: 'TS. Võ Thị S' },
  { id: 'TB004C', name: 'VSTEP Builder - Vocabulary B1', type: 'pdf', category: 'textbook', size: '28.9 MB', uploadDate: '2024-12-12', views: 2045, downloads: 1654, description: 'Từ vựng B1 chủ đề', course: 'VSTEP Builder', author: 'GV. Hồ Văn T' },
  { id: 'TB004D', name: 'VSTEP Builder - Skills Integration', type: 'pdf', category: 'textbook', size: '35.2 MB', uploadDate: '2024-12-12', views: 1876, downloads: 1456, description: 'Tích hợp 4 kỹ năng B1', course: 'VSTEP Builder', author: 'ThS. Phan Thị U' },
  { id: 'TB004E', name: 'VSTEP Builder - Practice Book', type: 'pdf', category: 'textbook', size: '30.5 MB', uploadDate: '2024-12-13', views: 1765, downloads: 1345, description: 'Sách thực hành B1', course: 'VSTEP Builder', author: 'TS. Bùi Văn V' },

  // VSTEP Developer - 5 items
  { id: 'TB005', name: 'VSTEP Developer Level B1+', type: 'pdf', category: 'textbook', size: '24.6 MB', uploadDate: '2024-12-14', views: 1543, downloads: 1234, description: 'Giáo trình phát triển B1+', course: 'VSTEP Developer', author: 'TS. Phạm Văn E' },
  { id: 'TB005B', name: 'VSTEP Developer - Advanced Reading', type: 'pdf', category: 'textbook', size: '31.8 MB', uploadDate: '2024-12-14', views: 1876, downloads: 1456, description: 'Đọc hiểu nâng cao', course: 'VSTEP Developer', author: 'GV. Đinh Thị W' },
  { id: 'TB005C', name: 'VSTEP Developer - Advanced Listening', type: 'pdf', category: 'textbook', size: '28.4 MB', uploadDate: '2024-12-15', views: 1765, downloads: 1345, description: 'Nghe hiểu nâng cao', course: 'VSTEP Developer', author: 'ThS. Dương Văn X' },
  { id: 'TB005D', name: 'VSTEP Developer - Writing Excellence', type: 'pdf', category: 'textbook', size: '26.9 MB', uploadDate: '2024-12-15', views: 1987, downloads: 1543, description: 'Viết xuất sắc', course: 'VSTEP Developer', author: 'TS. Lưu Thị Y' },
  { id: 'TB005E', name: 'VSTEP Developer - Speaking Fluency', type: 'pdf', category: 'textbook', size: '24.2 MB', uploadDate: '2024-12-16', views: 1654, downloads: 1323, description: 'Nói trôi chảy', course: 'VSTEP Developer', author: 'GV. Tô Văn Z' },

  // VSTEP Booster - 5 items
  { id: 'TB006', name: 'VSTEP Booster Level B2', type: 'docx', category: 'textbook', size: '15.4 MB', uploadDate: '2024-12-17', views: 2234, downloads: 1765, description: 'Giáo trình tăng tốc B2', course: 'VSTEP Booster', author: 'GV. Ngô Thị F' },
  { id: 'TB006B', name: 'VSTEP Booster - Quick Review', type: 'pdf', category: 'textbook', size: '22.7 MB', uploadDate: '2024-12-17', views: 1987, downloads: 1543, description: 'Ôn tập nhanh B2', course: 'VSTEP Booster', author: 'ThS. Cao Thị AA' },
  { id: 'TB006C', name: 'VSTEP Booster - Skills Focus', type: 'pdf', category: 'textbook', size: '27.3 MB', uploadDate: '2024-12-18', views: 2045, downloads: 1654, description: 'Tập trung kỹ năng B2', course: 'VSTEP Booster', author: 'TS. Lâm Văn BB' },
  { id: 'TB006D', name: 'VSTEP Booster - Test Tactics', type: 'pdf', category: 'textbook', size: '25.8 MB', uploadDate: '2024-12-18', views: 1876, downloads: 1456, description: 'Chiến thuật thi B2', course: 'VSTEP Booster', author: 'GV. Khương Thị CC' },
  { id: 'TB006E', name: 'VSTEP Booster - Mock Tests', type: 'pdf', category: 'textbook', size: '32.4 MB', uploadDate: '2024-12-19', views: 1765, downloads: 1345, description: 'Đề thi thử B2', course: 'VSTEP Booster', author: 'ThS. Quách Văn DD' },

  // VSTEP Intensive - 5 items
  { id: 'TB007', name: 'VSTEP Intensive B2-C1', type: 'pdf', category: 'textbook', size: '52.3 MB', uploadDate: '2024-12-20', views: 1234, downloads: 987, description: 'Giáo trình chuyên sâu B2-C1', course: 'VSTEP Intensive', author: 'TS. Trần Văn G' },
  { id: 'TB007B', name: 'VSTEP Intensive - Reading Mastery', type: 'pdf', category: 'textbook', size: '36.5 MB', uploadDate: '2024-12-20', views: 1543, downloads: 1234, description: 'Đọc thành thạo', course: 'VSTEP Intensive', author: 'ThS. Ứng Thị EE' },
  { id: 'TB007C', name: 'VSTEP Intensive - Listening Expert', type: 'pdf', category: 'textbook', size: '33.7 MB', uploadDate: '2024-12-21', views: 1654, downloads: 1323, description: 'Nghe chuyên gia', course: 'VSTEP Intensive', author: 'GV. Hạ Văn FF' },
  { id: 'TB007D', name: 'VSTEP Intensive - Writing Perfection', type: 'pdf', category: 'textbook', size: '29.8 MB', uploadDate: '2024-12-21', views: 1765, downloads: 1432, description: 'Viết hoàn hảo', course: 'VSTEP Intensive', author: 'TS. Từ Thị GG' },
  { id: 'TB007E', name: 'VSTEP Intensive - Speaking Excellence', type: 'pdf', category: 'textbook', size: '26.4 MB', uploadDate: '2024-12-22', views: 1543, downloads: 1234, description: 'Nói xuất sắc', course: 'VSTEP Intensive', author: 'ThS. An Văn HH' },

  // VSTEP Practice - 5 items
  { id: 'TB008', name: 'VSTEP Practice Mock Test Series', type: 'pdf', category: 'textbook', size: '38.9 MB', uploadDate: '2024-12-23', views: 1876, downloads: 1543, description: 'Bộ đề thi thử đầy đủ', course: 'VSTEP Practice', author: 'GV. Đỗ Thị H' },
  { id: 'TB008B', name: 'VSTEP Practice - Test 1-5', type: 'pdf', category: 'textbook', size: '42.3 MB', uploadDate: '2024-12-23', views: 1987, downloads: 1654, description: 'Đề thi thử 1-5', course: 'VSTEP Practice', author: 'TS. Bình Thị II' },
  { id: 'TB008C', name: 'VSTEP Practice - Test 6-10', type: 'pdf', category: 'textbook', size: '44.7 MB', uploadDate: '2024-12-24', views: 2045, downloads: 1765, description: 'Đề thi thử 6-10', course: 'VSTEP Practice', author: 'ThS. Châu Văn JJ' },
  { id: 'TB008D', name: 'VSTEP Practice - Answer Keys', type: 'pdf', category: 'textbook', size: '28.5 MB', uploadDate: '2024-12-24', views: 1654, downloads: 1323, description: 'Đáp án chi tiết', course: 'VSTEP Practice', author: 'GV. Danh Thị KK' },
  { id: 'TB008E', name: 'VSTEP Practice - Audio Scripts', type: 'pdf', category: 'textbook', size: '19.8 MB', uploadDate: '2024-12-25', views: 1543, downloads: 1234, description: 'Bản scripts audio', course: 'VSTEP Practice', author: 'TS. Đức Văn LL' },

  // VSTEP Premium - 5 items
  { id: 'TB009', name: 'VSTEP Premium B1 to B2 Guide', type: 'pdf', category: 'textbook', size: '29.5 MB', uploadDate: '2024-12-26', views: 1654, downloads: 1321, description: 'Hướng dẫn nâng cấp B1-B2', course: 'VSTEP Premium', author: 'ThS. Lý Văn I' },
  { id: 'TB009B', name: 'VSTEP Premium - Exclusive Materials', type: 'pdf', category: 'textbook', size: '35.7 MB', uploadDate: '2024-12-26', views: 1765, downloads: 1432, description: 'Tài liệu độc quyền', course: 'VSTEP Premium', author: 'GV. Giang Thị MM' },
  { id: 'TB009C', name: 'VSTEP Premium - VIP Resources', type: 'pdf', category: 'textbook', size: '31.4 MB', uploadDate: '2024-12-27', views: 1876, downloads: 1543, description: 'Tài nguyên VIP', course: 'VSTEP Premium', author: 'TS. Hải Văn NN' },
  { id: 'TB009D', name: 'VSTEP Premium - Advanced Strategies', type: 'pdf', category: 'textbook', size: '27.9 MB', uploadDate: '2024-12-27', views: 1543, downloads: 1234, description: 'Chiến lược nâng cao', course: 'VSTEP Premium', author: 'ThS. Khoa Thị OO' },
  { id: 'TB009E', name: 'VSTEP Premium - Success Blueprint', type: 'pdf', category: 'textbook', size: '24.6 MB', uploadDate: '2024-12-28', views: 1654, downloads: 1323, description: 'Bản đồ thành công', course: 'VSTEP Premium', author: 'GV. Loan Văn PP' },

  // VSTEP Master - 5 items
  { id: 'TB010', name: 'VSTEP Master Level C1', type: 'pdf', category: 'textbook', size: '21.8 MB', uploadDate: '2024-12-29', views: 1987, downloads: 1654, description: 'Giáo trình thạc sĩ C1', course: 'VSTEP Master', author: 'GV. Mai Thị K' },
  { id: 'TB010B', name: 'VSTEP Master - C1 Reading', type: 'pdf', category: 'textbook', size: '33.5 MB', uploadDate: '2024-12-29', views: 1765, downloads: 1432, description: 'Đọc C1 chuyên sâu', course: 'VSTEP Master', author: 'TS. Minh Thị QQ' },
  { id: 'TB010C', name: 'VSTEP Master - C1 Listening', type: 'pdf', category: 'textbook', size: '30.8 MB', uploadDate: '2024-12-30', views: 1876, downloads: 1543, description: 'Nghe C1 thành thạo', course: 'VSTEP Master', author: 'ThS. Nam Văn RR' },
  { id: 'TB010D', name: 'VSTEP Master - C1 Writing', type: 'pdf', category: 'textbook', size: '28.3 MB', uploadDate: '2024-12-30', views: 1654, downloads: 1323, description: 'Viết C1 hoàn hảo', course: 'VSTEP Master', author: 'GV. Oanh Thị SS' },
  { id: 'TB010E', name: 'VSTEP Master - C1 Speaking', type: 'pdf', category: 'textbook', size: '25.7 MB', uploadDate: '2024-12-31', views: 1543, downloads: 1234, description: 'Nói C1 xuất sắc', course: 'VSTEP Master', author: 'TS. Phúc Văn TT' },
];

// MEDIA MATERIALS - Audio/Video (50 items)
export const mediaMaterials: MediaMaterial[] = [
  // VSTEP Complete - 20 items
  { id: 'MD_COM01', name: 'VSTEP Complete - Reading Strategy Video', type: 'video', category: 'media', skill: 'Reading', course: 'VSTEP Complete', size: '245 MB', uploadDate: '2024-12-01', views: 1987, downloads: 1234, description: 'Video hướng dẫn chiến lược Reading toàn diện', duration: '45 phút' },
  { id: 'MD_COM02', name: 'VSTEP Complete - Listening Part 1 Audio', type: 'audio', category: 'media', skill: 'Listening', course: 'VSTEP Complete', size: '125 MB', uploadDate: '2024-12-01', views: 2134, downloads: 1543, description: 'Audio luyện nghe Part 1', duration: '30 phút' },
  { id: 'MD_COM03', name: 'VSTEP Complete - Writing Task 1 Video', type: 'video', category: 'media', skill: 'Writing', course: 'VSTEP Complete', size: '312 MB', uploadDate: '2024-12-01', views: 1876, downloads: 1432, description: 'Video hướng dẫn Writing Task 1', duration: '52 phút' },
  { id: 'MD_COM04', name: 'VSTEP Complete - Speaking Part 1 Video', type: 'video', category: 'media', skill: 'Speaking', course: 'VSTEP Complete', size: '298 MB', uploadDate: '2024-12-02', views: 2045, downloads: 1654, description: 'Video luyện Speaking Part 1', duration: '48 phút' },
  { id: 'MD_COM05', name: 'VSTEP Complete - Listening Part 2 Audio', type: 'audio', category: 'media', skill: 'Listening', course: 'VSTEP Complete', size: '156 MB', uploadDate: '2024-12-02', views: 1765, downloads: 1345, description: 'Audio luyện nghe Part 2', duration: '35 phút' },
  { id: 'MD_COM06', name: 'VSTEP Complete - Grammar Video Series', type: 'video', category: 'media', course: 'VSTEP Complete', size: '378 MB', uploadDate: '2024-12-02', views: 2234, downloads: 1765, description: 'Video bài giảng ngữ pháp', duration: '62 phút' },
  { id: 'MD_COM07', name: 'VSTEP Complete - Vocabulary Audio', type: 'audio', category: 'media', course: 'VSTEP Complete', size: '98 MB', uploadDate: '2024-12-03', views: 1987, downloads: 1543, description: 'Audio học từ vựng', duration: '25 phút' },
  { id: 'MD_COM08', name: 'VSTEP Complete - Writing Task 2 Video', type: 'video', category: 'media', skill: 'Writing', course: 'VSTEP Complete', size: '345 MB', uploadDate: '2024-12-03', views: 2134, downloads: 1678, description: 'Video hướng dẫn Writing Task 2', duration: '58 phút' },
  { id: 'MD_COM09', name: 'VSTEP Complete - Speaking Part 2 Video', type: 'video', category: 'media', skill: 'Speaking', course: 'VSTEP Complete', size: '312 MB', uploadDate: '2024-12-03', views: 1876, downloads: 1456, description: 'Video luyện Speaking Part 2', duration: '51 phút' },
  { id: 'MD_COM10', name: 'VSTEP Complete - Listening Part 3 Audio', type: 'audio', category: 'media', skill: 'Listening', course: 'VSTEP Complete', size: '187 MB', uploadDate: '2024-12-04', views: 2045, downloads: 1654, description: 'Audio luyện nghe Part 3', duration: '40 phút' },
  { id: 'MD_COM11', name: 'VSTEP Complete - Reading Practice Video', type: 'video', category: 'media', skill: 'Reading', course: 'VSTEP Complete', size: '289 MB', uploadDate: '2024-12-04', views: 1765, downloads: 1345, description: 'Video luyện tập Reading', duration: '47 phút' },
  { id: 'MD_COM12', name: 'VSTEP Complete - Pronunciation Audio', type: 'audio', category: 'media', course: 'VSTEP Complete', size: '112 MB', uploadDate: '2024-12-04', views: 1543, downloads: 1234, description: 'Audio luyện phát âm', duration: '28 phút' },
  { id: 'MD_COM13', name: 'VSTEP Complete - Speaking Part 3 Video', type: 'video', category: 'media', skill: 'Speaking', course: 'VSTEP Complete', size: '398 MB', uploadDate: '2024-12-05', views: 2234, downloads: 1765, description: 'Video luyện Speaking Part 3', duration: '65 phút' },
  { id: 'MD_COM14', name: 'VSTEP Complete - Mock Test Audio', type: 'audio', category: 'media', skill: 'Listening', course: 'VSTEP Complete', size: '234 MB', uploadDate: '2024-12-05', views: 1987, downloads: 1543, description: 'Audio đề thi thử', duration: '50 phút' },
  { id: 'MD_COM15', name: 'VSTEP Complete - Essay Writing Video', type: 'video', category: 'media', skill: 'Writing', course: 'VSTEP Complete', size: '356 MB', uploadDate: '2024-12-05', views: 2134, downloads: 1678, description: 'Video hướng dẫn viết essay', duration: '60 phút' },
  { id: 'MD_COM16', name: 'VSTEP Complete - Advanced Listening Audio', type: 'audio', category: 'media', skill: 'Listening', course: 'VSTEP Complete', size: '198 MB', uploadDate: '2024-12-06', views: 1876, downloads: 1456, description: 'Audio luyện nghe nâng cao', duration: '42 phút' },
  { id: 'MD_COM17', name: 'VSTEP Complete - Reading Skills Video', type: 'video', category: 'media', skill: 'Reading', course: 'VSTEP Complete', size: '267 MB', uploadDate: '2024-12-06', views: 2045, downloads: 1654, description: 'Video kỹ năng Reading', duration: '44 phút' },
  { id: 'MD_COM18', name: 'VSTEP Complete - Interview Practice Video', type: 'video', category: 'media', skill: 'Speaking', course: 'VSTEP Complete', size: '334 MB', uploadDate: '2024-12-06', views: 1765, downloads: 1345, description: 'Video luyện phỏng vấn', duration: '56 phút' },
  { id: 'MD_COM19', name: 'VSTEP Complete - Conversation Audio', type: 'audio', category: 'media', skill: 'Listening', course: 'VSTEP Complete', size: '145 MB', uploadDate: '2024-12-07', views: 1543, downloads: 1234, description: 'Audio hội thoại', duration: '32 phút' },
  { id: 'MD_COM20', name: 'VSTEP Complete - Final Review Video', type: 'video', category: 'media', course: 'VSTEP Complete', size: '412 MB', uploadDate: '2024-12-07', views: 2234, downloads: 1765, description: 'Video ôn tập tổng hợp', duration: '68 phút' },

  // VSTEP Foundation - 5 items
  { id: 'MD_FOU01', name: 'VSTEP Foundation - Introduction Video', type: 'video', category: 'media', course: 'VSTEP Foundation', size: '189 MB', uploadDate: '2024-12-08', views: 1765, downloads: 1432, description: 'Video giới thiệu khóa học', duration: '38 phút' },
  { id: 'MD_FOU02', name: 'VSTEP Foundation - Skills Overview Audio', type: 'audio', category: 'media', course: 'VSTEP Foundation', size: '87 MB', uploadDate: '2024-12-08', views: 1543, downloads: 1234, description: 'Audio tổng quan kỹ năng', duration: '22 phút' },
  { id: 'MD_FOU03', name: 'VSTEP Foundation - Practice Session Video', type: 'video', category: 'media', course: 'VSTEP Foundation', size: '256 MB', uploadDate: '2024-12-09', views: 1876, downloads: 1543, description: 'Video buổi thực hành', duration: '42 phút' },
  { id: 'MD_FOU04', name: 'VSTEP Foundation - Assessment Audio', type: 'audio', category: 'media', course: 'VSTEP Foundation', size: '134 MB', uploadDate: '2024-12-09', views: 1654, downloads: 1323, description: 'Audio đánh giá', duration: '30 phút' },
  { id: 'MD_FOU05', name: 'VSTEP Foundation - Summary Video', type: 'video', category: 'media', course: 'VSTEP Foundation', size: '298 MB', uploadDate: '2024-12-10', views: 1765, downloads: 1432, description: 'Video tổng kết', duration: '48 phút' },

  // VSTEP Starter - 5 items
  { id: 'MD_STA01', name: 'VSTEP Starter - A2 Listening Audio', type: 'audio', category: 'media', skill: 'Listening', course: 'VSTEP Starter', size: '145 MB', uploadDate: '2024-12-11', views: 1987, downloads: 1654, description: 'Audio luyện nghe A2', duration: '33 phút' },
  { id: 'MD_STA02', name: 'VSTEP Starter - A2 Speaking Video', type: 'video', category: 'media', skill: 'Speaking', course: 'VSTEP Starter', size: '267 MB', uploadDate: '2024-12-11', views: 1765, downloads: 1432, description: 'Video luyện nói A2', duration: '44 phút' },
  { id: 'MD_STA03', name: 'VSTEP Starter - A2 Reading Video', type: 'video', category: 'media', skill: 'Reading', course: 'VSTEP Starter', size: '234 MB', uploadDate: '2024-12-12', views: 1876, downloads: 1543, description: 'Video luyện đọc A2', duration: '40 phút' },
  { id: 'MD_STA04', name: 'VSTEP Starter - A2 Writing Video', type: 'video', category: 'media', skill: 'Writing', course: 'VSTEP Starter', size: '289 MB', uploadDate: '2024-12-12', views: 1654, downloads: 1323, description: 'Video luyện viết A2', duration: '46 phút' },
  { id: 'MD_STA05', name: 'VSTEP Starter - A2 Review Audio', type: 'audio', category: 'media', course: 'VSTEP Starter', size: '98 MB', uploadDate: '2024-12-13', views: 1543, downloads: 1234, description: 'Audio ôn tập A2', duration: '24 phút' },

  // VSTEP Builder - 5 items
  { id: 'MD_BUI01', name: 'VSTEP Builder - B1 Grammar Video', type: 'video', category: 'media', course: 'VSTEP Builder', size: '312 MB', uploadDate: '2024-12-14', views: 1987, downloads: 1654, description: 'Video ngữ pháp B1', duration: '52 phút' },
  { id: 'MD_BUI02', name: 'VSTEP Builder - B1 Vocabulary Audio', type: 'audio', category: 'media', course: 'VSTEP Builder', size: '123 MB', uploadDate: '2024-12-14', views: 1765, downloads: 1432, description: 'Audio từ vựng B1', duration: '28 phút' },
  { id: 'MD_BUI03', name: 'VSTEP Builder - B1 Skills Video', type: 'video', category: 'media', course: 'VSTEP Builder', size: '345 MB', uploadDate: '2024-12-15', views: 1876, downloads: 1543, description: 'Video kỹ năng B1', duration: '58 phút' },
  { id: 'MD_BUI04', name: 'VSTEP Builder - B1 Practice Audio', type: 'audio', category: 'media', course: 'VSTEP Builder', size: '167 MB', uploadDate: '2024-12-15', views: 1654, downloads: 1323, description: 'Audio thực hành B1', duration: '36 phút' },
  { id: 'MD_BUI05', name: 'VSTEP Builder - B1 Mock Test Video', type: 'video', category: 'media', course: 'VSTEP Builder', size: '289 MB', uploadDate: '2024-12-16', views: 1543, downloads: 1234, description: 'Video thi thử B1', duration: '47 phút' },

  // VSTEP Developer - 5 items
  { id: 'MD_DEV01', name: 'VSTEP Developer - Advanced Reading Video', type: 'video', category: 'media', skill: 'Reading', course: 'VSTEP Developer', size: '298 MB', uploadDate: '2024-12-17', views: 1876, downloads: 1543, description: 'Video đọc nâng cao', duration: '49 phút' },
  { id: 'MD_DEV02', name: 'VSTEP Developer - Advanced Listening Audio', type: 'audio', category: 'media', skill: 'Listening', course: 'VSTEP Developer', size: '178 MB', uploadDate: '2024-12-17', views: 1765, downloads: 1432, description: 'Audio nghe nâng cao', duration: '38 phút' },
  { id: 'MD_DEV03', name: 'VSTEP Developer - Writing Excellence Video', type: 'video', category: 'media', skill: 'Writing', course: 'VSTEP Developer', size: '334 MB', uploadDate: '2024-12-18', views: 1987, downloads: 1654, description: 'Video viết xuất sắc', duration: '55 phút' },
  { id: 'MD_DEV04', name: 'VSTEP Developer - Speaking Fluency Video', type: 'video', category: 'media', skill: 'Speaking', course: 'VSTEP Developer', size: '312 MB', uploadDate: '2024-12-18', views: 1654, downloads: 1323, description: 'Video nói trôi chảy', duration: '51 phút' },
  { id: 'MD_DEV05', name: 'VSTEP Developer - Comprehensive Audio', type: 'audio', category: 'media', course: 'VSTEP Developer', size: '198 MB', uploadDate: '2024-12-19', views: 1543, downloads: 1234, description: 'Audio toàn diện', duration: '42 phút' },

  // VSTEP Booster - 3 items
  { id: 'MD_BOO01', name: 'VSTEP Booster - Quick Review Video', type: 'video', category: 'media', course: 'VSTEP Booster', size: '267 MB', uploadDate: '2024-12-20', views: 1765, downloads: 1432, description: 'Video ôn tập nhanh', duration: '44 phút' },
  { id: 'MD_BOO02', name: 'VSTEP Booster - Test Tactics Audio', type: 'audio', category: 'media', course: 'VSTEP Booster', size: '134 MB', uploadDate: '2024-12-20', views: 1543, downloads: 1234, description: 'Audio chiến thuật thi', duration: '29 phút' },
  { id: 'MD_BOO03', name: 'VSTEP Booster - Mock Test Video', type: 'video', category: 'media', course: 'VSTEP Booster', size: '356 MB', uploadDate: '2024-12-21', views: 1876, downloads: 1543, description: 'Video đề thi thử', duration: '60 phút' },

  // VSTEP Intensive - 2 items
  { id: 'MD_INT01', name: 'VSTEP Intensive - Expert Training Video', type: 'video', category: 'media', course: 'VSTEP Intensive', size: '389 MB', uploadDate: '2024-12-22', views: 1654, downloads: 1323, description: 'Video đào tạo chuyên gia', duration: '64 phút' },
  { id: 'MD_INT02', name: 'VSTEP Intensive - Advanced Practice Audio', type: 'audio', category: 'media', course: 'VSTEP Intensive', size: '212 MB', uploadDate: '2024-12-22', views: 1543, downloads: 1234, description: 'Audio thực hành nâng cao', duration: '45 phút' },

  // VSTEP Practice - 3 items
  { id: 'MD_PRA01', name: 'VSTEP Practice - Mock Test 1-3 Audio', type: 'audio', category: 'media', skill: 'Listening', course: 'VSTEP Practice', size: '267 MB', uploadDate: '2024-12-23', views: 1987, downloads: 1654, description: 'Audio đề thi thử 1-3', duration: '56 phút' },
  { id: 'MD_PRA02', name: 'VSTEP Practice - Mock Test 4-6 Audio', type: 'audio', category: 'media', skill: 'Listening', course: 'VSTEP Practice', size: '289 MB', uploadDate: '2024-12-23', views: 1765, downloads: 1432, description: 'Audio đề thi thử 4-6', duration: '60 phút' },
  { id: 'MD_PRA03', name: 'VSTEP Practice - Review Video', type: 'video', category: 'media', course: 'VSTEP Practice', size: '312 MB', uploadDate: '2024-12-24', views: 1876, downloads: 1543, description: 'Video chữa đề', duration: '52 phút' },

  // VSTEP Premium - 1 item
  { id: 'MD_PRE01', name: 'VSTEP Premium - VIP Masterclass Video', type: 'video', category: 'media', course: 'VSTEP Premium', size: '445 MB', uploadDate: '2024-12-25', views: 2045, downloads: 1765, description: 'Video masterclass VIP', duration: '73 phút' },

  // VSTEP Master - 1 item
  { id: 'MD_MAS01', name: 'VSTEP Master - C1 Expert Training Video', type: 'video', category: 'media', course: 'VSTEP Master', size: '423 MB', uploadDate: '2024-12-26', views: 1987, downloads: 1654, description: 'Video đào tạo chuyên gia C1', duration: '70 phút' },
];

// Combine all class materials
export const allClassMaterials: ClassMaterial[] = [
  ...textbookMaterials,
  ...mediaMaterials,
];

// Helper function to get materials by filters
export function getClassMaterials(
  category: ClassCategory,
  course?: string,
  skill?: string,
  searchTerm?: string
): ClassMaterial[] {
  let materials: ClassMaterial[] = category === 'textbook' ? textbookMaterials : mediaMaterials;

  if (course && course !== 'all' && course !== 'VSTEP Complete') {
    materials = materials.filter(m => m.course === course);
  } else if (course === 'VSTEP Complete') {
    materials = materials.filter(m => m.course === 'VSTEP Complete');
  }

  if (skill && skill !== 'all' && category === 'media') {
    materials = materials.filter(m => {
      if (m.category === 'media' && 'skill' in m) {
        return m.skill === skill;
      }
      return false;
    });
  }

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    materials = materials.filter(m => 
      m.name.toLowerCase().includes(term) || 
      m.description.toLowerCase().includes(term)
    );
  }

  return materials;
}
