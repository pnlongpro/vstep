// Study Materials Data - Tài liệu học tập theo 6 danh mục

export type StudyCategory = 'all' | 'grammar' | 'vocabulary' | 'reading' | 'writing' | 'listening' | 'speaking';

export interface StudyMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'xlsx';
  category: StudyCategory;
  skill?: 'Reading' | 'Listening' | 'Writing' | 'Speaking' | 'Grammar' | 'Vocabulary';
  level?: 'A2' | 'B1' | 'B2' | 'C1';
  size: string;
  uploadDate: string;
  views: number;
  downloads: number;
  description: string;
  author?: string;
  course?: string;
}

// GRAMMAR - Ngữ pháp (17 items)
const grammarMaterials: StudyMaterial[] = [
  { id: 'GR001', name: 'VSTEP A2 Grammar Foundation', type: 'pdf', category: 'grammar', level: 'A2', skill: 'Grammar', size: '31.2 MB', uploadDate: '2024-12-03', views: 3567, downloads: 2456, description: 'Ngữ pháp nền tảng A2', author: 'TS. Phạm Văn E', course: 'VSTEP Starter' },
  { id: 'GR002', name: 'VSTEP B1 Grammar Intermediate', type: 'pdf', category: 'grammar', level: 'B1', skill: 'Grammar', size: '38.9 MB', uploadDate: '2024-12-07', views: 4567, downloads: 3456, description: 'Ngữ pháp trung cấp B1', author: 'GV. Hồ Thị M', course: 'VSTEP Developer' },
  { id: 'GR003', name: 'VSTEP B2 Grammar Advanced', type: 'pdf', category: 'grammar', level: 'B2', skill: 'Grammar', size: '44.6 MB', uploadDate: '2024-12-11', views: 5789, downloads: 4567, description: 'Ngữ pháp nâng cao B2', author: 'TS. Cao Văn T', course: 'VSTEP Practice' },
  { id: 'GR004', name: 'VSTEP C1 Grammar Expert', type: 'pdf', category: 'grammar', level: 'C1', skill: 'Grammar', size: '48.3 MB', uploadDate: '2024-12-15', views: 4678, downloads: 3567, description: 'Ngữ pháp chuyên gia C1', author: 'ThS. An Thị AA', course: 'VSTEP Complete' },
  { id: 'GR005', name: 'Grammar Complete A2-C1', type: 'pdf', category: 'grammar', skill: 'Grammar', size: '55.7 MB', uploadDate: '2024-12-17', views: 6789, downloads: 5456, description: 'Ngữ pháp hoàn chỉnh các cấp', author: 'ThS. Danh Văn DD', course: 'VSTEP Complete' },
  { id: 'GR006', name: 'Grammar Basic Tenses', type: 'pptx', category: 'grammar', skill: 'Grammar', level: 'A2', size: '13.4 MB', uploadDate: '2024-12-22', views: 3123, downloads: 2456, description: 'Thì cơ bản', author: 'GV. Sơn Văn FFF', course: 'VSTEP Starter' },
  { id: 'GR007', name: 'Grammar Intermediate Structures', type: 'pptx', category: 'grammar', skill: 'Grammar', level: 'B1', size: '15.1 MB', uploadDate: '2024-12-23', views: 3345, downloads: 2654, description: 'Cấu trúc trung cấp', author: 'TS. Thảo Thị GGG', course: 'VSTEP Builder' },
  { id: 'GR008', name: 'Grammar Advanced Patterns', type: 'pptx', category: 'grammar', skill: 'Grammar', level: 'B2', size: '16.8 MB', uploadDate: '2024-12-24', views: 3567, downloads: 2843, description: 'Mẫu câu nâng cao', author: 'ThS. Uyên Văn HHH', course: 'VSTEP Booster' },
  { id: 'GR009', name: 'Grammar Complex Sentences', type: 'pptx', category: 'grammar', skill: 'Grammar', level: 'C1', size: '18.3 MB', uploadDate: '2024-12-25', views: 2987, downloads: 2345, description: 'Câu phức hợp', author: 'GV. Vũ Thị III', course: 'VSTEP Master' },
  { id: 'GR010', name: 'Grammar All Tenses Review', type: 'pptx', category: 'grammar', skill: 'Grammar', size: '19.7 MB', uploadDate: '2024-12-26', views: 4123, downloads: 3234, description: 'Ôn tập tất cả các thì', author: 'TS. Xuân Văn JJJ', course: 'VSTEP Complete' },
  { id: 'GR011', name: 'Grammar Exercises A2', type: 'pdf', category: 'grammar', skill: 'Grammar', level: 'A2', size: '8.3 MB', uploadDate: '2024-12-22', views: 3456, downloads: 2765, description: 'Bài tập ngữ pháp A2', author: 'GV. Phương Văn OOOO', course: 'VSTEP Starter' },
  { id: 'GR012', name: 'Grammar Exercises B1', type: 'pdf', category: 'grammar', skill: 'Grammar', level: 'B1', size: '9.1 MB', uploadDate: '2024-12-23', views: 3678, downloads: 2876, description: 'Bài tập ngữ pháp B1', author: 'TS. Quang Thị PPPP', course: 'VSTEP Builder' },
  { id: 'GR013', name: 'Grammar Exercises B2', type: 'pdf', category: 'grammar', skill: 'Grammar', level: 'B2', size: '9.8 MB', uploadDate: '2024-12-24', views: 3876, downloads: 2987, description: 'Bài tập ngữ pháp B2', author: 'ThS. Rạng Văn QQQQ', course: 'VSTEP Booster' },
  { id: 'GR014', name: 'Grammar Exercises C1', type: 'pdf', category: 'grammar', skill: 'Grammar', level: 'C1', size: '10.5 MB', uploadDate: '2024-12-25', views: 3234, downloads: 2543, description: 'Bài tập ngữ pháp C1', author: 'GV. Sơn Thị RRRR', course: 'VSTEP Master' },
  { id: 'GR015', name: 'Grammar Practice 500 Questions', type: 'docx', category: 'grammar', skill: 'Grammar', size: '5.2 MB', uploadDate: '2024-12-26', views: 4123, downloads: 3345, description: '500 câu hỏi ngữ pháp', author: 'ThS. Uyên Thị TTTT', course: 'VSTEP Complete' },
  { id: 'GR016', name: 'Grammar Rules & Examples', type: 'pdf', category: 'grammar', skill: 'Grammar', size: '22.4 MB', uploadDate: '2024-12-27', views: 3987, downloads: 3123, description: 'Quy tắc và ví dụ ngữ pháp', author: 'GV. Vũ Văn UUUU', course: 'VSTEP Foundation' },
  { id: 'GR017', name: 'Grammar Test Series', type: 'pdf', category: 'grammar', skill: 'Grammar', size: '12.7 MB', uploadDate: '2024-12-28', views: 3456, downloads: 2876, description: 'Bộ đề kiểm tra ngữ pháp', author: 'TS. Xuân Thị VVVV', course: 'VSTEP Practice' },
];

// VOCABULARY - Từ vựng (17 items)
const vocabularyMaterials: StudyMaterial[] = [
  { id: 'VC001', name: 'VSTEP A2 Vocabulary Builder', type: 'pdf', category: 'vocabulary', level: 'A2', skill: 'Vocabulary', size: '27.8 MB', uploadDate: '2024-12-03', views: 3345, downloads: 2298, description: '1000 từ vựng A2', author: 'GV. Ngô Thị F', course: 'VSTEP Starter' },
  { id: 'VC002', name: 'VSTEP B1 Vocabulary 2000', type: 'pdf', category: 'vocabulary', level: 'B1', skill: 'Vocabulary', size: '34.2 MB', uploadDate: '2024-12-07', views: 4234, downloads: 3298, description: '2000 từ vựng B1', author: 'TS. Phan Văn N', course: 'VSTEP Developer' },
  { id: 'VC003', name: 'VSTEP B2 Vocabulary 3000', type: 'pdf', category: 'vocabulary', level: 'B2', skill: 'Vocabulary', size: '39.7 MB', uploadDate: '2024-12-11', views: 5456, downloads: 4298, description: '3000 từ vựng B2', author: 'ThS. Lâm Thị U', course: 'VSTEP Practice' },
  { id: 'VC004', name: 'VSTEP C1 Vocabulary 5000', type: 'pdf', category: 'vocabulary', level: 'C1', skill: 'Vocabulary', size: '43.9 MB', uploadDate: '2024-12-15', views: 4567, downloads: 3456, description: '5000 từ vựng C1', author: 'GV. Bình Văn BB', course: 'VSTEP Complete' },
  { id: 'VC005', name: 'Vocabulary Master 10000', type: 'pdf', category: 'vocabulary', skill: 'Vocabulary', size: '58.2 MB', uploadDate: '2024-12-17', views: 6567, downloads: 5298, description: '10000 từ vựng tổng hợp', author: 'GV. Đức Thị EE', course: 'VSTEP Complete' },
  { id: 'VC006', name: 'Vocabulary Learning Strategies', type: 'pptx', category: 'vocabulary', skill: 'Vocabulary', level: 'A2', size: '12.6 MB', uploadDate: '2024-12-27', views: 2876, downloads: 2234, description: 'Chiến lược học từ vựng', author: 'ThS. Yến Thị KKK', course: 'VSTEP Starter' },
  { id: 'VC007', name: 'Academic Vocabulary Lecture', type: 'pptx', category: 'vocabulary', skill: 'Vocabulary', level: 'B1', size: '14.2 MB', uploadDate: '2024-12-28', views: 3123, downloads: 2456, description: 'Từ vựng học thuật', author: 'GV. Anh Văn LLL', course: 'VSTEP Builder' },
  { id: 'VC008', name: 'Topic-based Vocabulary', type: 'pptx', category: 'vocabulary', skill: 'Vocabulary', level: 'B2', size: '15.8 MB', uploadDate: '2024-12-29', views: 3345, downloads: 2643, description: 'Từ vựng theo chủ đề', author: 'TS. Bảo Thị MMM', course: 'VSTEP Booster' },
  { id: 'VC009', name: 'Collocations & Idioms', type: 'pptx', category: 'vocabulary', skill: 'Vocabulary', level: 'C1', size: '17.4 MB', uploadDate: '2024-12-30', views: 2987, downloads: 2298, description: 'Cụm từ & thành ngữ', author: 'ThS. Cường Văn NNN', course: 'VSTEP Master' },
  { id: 'VC010', name: 'Vocabulary Exercises 500 Words', type: 'xlsx', category: 'vocabulary', skill: 'Vocabulary', level: 'A2', size: '4.2 MB', uploadDate: '2024-12-26', views: 3987, downloads: 3234, description: 'Bài tập 500 từ vựng', author: 'TS. Thảo Văn SSSS', course: 'VSTEP Starter' },
  { id: 'VC011', name: 'Vocabulary Exercises 1000 Words', type: 'xlsx', category: 'vocabulary', skill: 'Vocabulary', level: 'B1', size: '5.8 MB', uploadDate: '2024-12-27', views: 4123, downloads: 3345, description: 'Bài tập 1000 từ vựng', author: 'ThS. Uyên Thị TTTT', course: 'VSTEP Builder' },
  { id: 'VC012', name: 'Vocabulary Exercises 2000 Words', type: 'xlsx', category: 'vocabulary', skill: 'Vocabulary', level: 'B2', size: '7.3 MB', uploadDate: '2024-12-28', views: 4345, downloads: 3567, description: 'Bài tập 2000 từ vựng', author: 'GV. Vũ Văn UUUU', course: 'VSTEP Booster' },
  { id: 'VC013', name: 'Vocabulary Exercises 3000 Words', type: 'xlsx', category: 'vocabulary', skill: 'Vocabulary', level: 'C1', size: '8.9 MB', uploadDate: '2024-12-29', views: 3876, downloads: 2987, description: 'Bài tập 3000 từ vựng', author: 'TS. Xuân Thị VVVV', course: 'VSTEP Master' },
  { id: 'VC014', name: 'Vocabulary Flashcards A2-B1', type: 'pdf', category: 'vocabulary', skill: 'Vocabulary', size: '18.5 MB', uploadDate: '2024-12-30', views: 3567, downloads: 2876, description: 'Flashcards từ vựng cơ bản', author: 'GV. Minh Văn TTT', course: 'VSTEP Foundation' },
  { id: 'VC015', name: 'Vocabulary Thematic Lists', type: 'docx', category: 'vocabulary', skill: 'Vocabulary', size: '6.7 MB', uploadDate: '2024-12-31', views: 3234, downloads: 2654, description: 'Danh sách từ theo chủ đề', author: 'ThS. Nhung Thị UUU', course: 'VSTEP Complete' },
  { id: 'VC016', name: 'Business Vocabulary for VSTEP', type: 'pdf', category: 'vocabulary', skill: 'Vocabulary', level: 'B2', size: '14.3 MB', uploadDate: '2025-01-01', views: 2987, downloads: 2345, description: 'Từ vựng business', author: 'TS. Oanh Văn VVV', course: 'VSTEP Intensive' },
  { id: 'VC017', name: 'Scientific Vocabulary', type: 'pdf', category: 'vocabulary', skill: 'Vocabulary', level: 'C1', size: '16.8 MB', uploadDate: '2025-01-02', views: 2765, downloads: 2156, description: 'Từ vựng khoa học', author: 'GV. Phong Thị WWW', course: 'VSTEP Master' },
];

// READING - Đọc hiểu (17 items)
const readingMaterials: StudyMaterial[] = [
  { id: 'RD001', name: 'VSTEP A2 Reading Complete Guide', type: 'pdf', category: 'reading', level: 'A2', skill: 'Reading', size: '25.8 MB', uploadDate: '2024-12-01', views: 3456, downloads: 2345, description: 'Giáo trình Reading A2 toàn diện', author: 'TS. Nguyễn Văn A', course: 'VSTEP Starter' },
  { id: 'RD002', name: 'VSTEP B1 Reading Strategies', type: 'pdf', category: 'reading', level: 'B1', skill: 'Reading', size: '32.4 MB', uploadDate: '2024-12-05', views: 4567, downloads: 3456, description: 'Chiến lược Reading B1', author: 'ThS. Mai Thị H', course: 'VSTEP Builder' },
  { id: 'RD003', name: 'VSTEP B2 Reading Comprehension', type: 'pdf', category: 'reading', level: 'B2', skill: 'Reading', size: '38.5 MB', uploadDate: '2024-12-09', views: 5678, downloads: 4456, description: 'Đọc hiểu B2', author: 'GV. Đinh Văn P', course: 'VSTEP Booster' },
  { id: 'RD004', name: 'VSTEP C1 Reading Mastery', type: 'pdf', category: 'reading', level: 'C1', skill: 'Reading', size: '42.8 MB', uploadDate: '2024-12-13', views: 4567, downloads: 3456, description: 'Đọc thông thạo C1', author: 'TS. Quách Thị W', course: 'VSTEP Master' },
  { id: 'RD005', name: 'Reading All Levels', type: 'pdf', category: 'reading', skill: 'Reading', size: '52.8 MB', uploadDate: '2024-12-18', views: 6234, downloads: 4987, description: 'Reading tất cả cấp độ', author: 'TS. Giang Văn FF', course: 'VSTEP Foundation' },
  { id: 'RD006', name: 'Reading Strategies Lecture 01', type: 'pptx', category: 'reading', skill: 'Reading', level: 'A2', size: '15.2 MB', uploadDate: '2024-12-01', views: 2345, downloads: 1876, description: 'Chiến lược Reading cơ bản', author: 'GV. Nam Thị KK', course: 'VSTEP Starter' },
  { id: 'RD007', name: 'Reading Strategies Lecture 02', type: 'pptx', category: 'reading', skill: 'Reading', level: 'B1', size: '16.8 MB', uploadDate: '2024-12-02', views: 2567, downloads: 2012, description: 'Chiến lược Reading trung cấp', author: 'TS. Oanh Văn LL', course: 'VSTEP Builder' },
  { id: 'RD008', name: 'Reading Strategies Lecture 03', type: 'pptx', category: 'reading', skill: 'Reading', level: 'B2', size: '18.4 MB', uploadDate: '2024-12-03', views: 2789, downloads: 2145, description: 'Chiến lược Reading nâng cao', author: 'ThS. Phúc Thị MM', course: 'VSTEP Booster' },
  { id: 'RD009', name: 'Reading Strategies Lecture 04', type: 'pptx', category: 'reading', skill: 'Reading', level: 'C1', size: '19.7 MB', uploadDate: '2024-12-04', views: 2456, downloads: 1987, description: 'Chiến lược Reading chuyên gia', author: 'GV. Quân Văn NN', course: 'VSTEP Master' },
  { id: 'RD010', name: 'Reading Comprehension Techniques', type: 'pptx', category: 'reading', skill: 'Reading', size: '20.3 MB', uploadDate: '2024-12-05', views: 3123, downloads: 2456, description: 'Kỹ thuật đọc hiểu', author: 'TS. Rộng Thị OO', course: 'VSTEP Complete' },
  { id: 'RD011', name: 'Reading Practice Set 01 - A2', type: 'pdf', category: 'reading', skill: 'Reading', level: 'A2', size: '8.5 MB', uploadDate: '2024-12-01', views: 3456, downloads: 2876, description: 'Bộ bài tập Reading A2', author: 'GV. Minh Văn TTT', course: 'VSTEP Starter' },
  { id: 'RD012', name: 'Reading Practice Set 02 - B1', type: 'pdf', category: 'reading', skill: 'Reading', level: 'B1', size: '9.7 MB', uploadDate: '2024-12-02', views: 3678, downloads: 2987, description: 'Bộ bài tập Reading B1', author: 'TS. Nhung Thị UUU', course: 'VSTEP Builder' },
  { id: 'RD013', name: 'Reading Practice Set 03 - B2', type: 'pdf', category: 'reading', skill: 'Reading', level: 'B2', size: '10.8 MB', uploadDate: '2024-12-03', views: 3987, downloads: 3123, description: 'Bộ bài tập Reading B2', author: 'ThS. Oanh Văn VVV', course: 'VSTEP Booster' },
  { id: 'RD014', name: 'Reading Practice Set 04 - C1', type: 'pdf', category: 'reading', skill: 'Reading', level: 'C1', size: '11.5 MB', uploadDate: '2024-12-04', views: 3345, downloads: 2654, description: 'Bộ bài tập Reading C1', author: 'GV. Phong Thị WWW', course: 'VSTEP Master' },
  { id: 'RD015', name: 'Reading Comprehension 100 Questions', type: 'pdf', category: 'reading', skill: 'Reading', size: '14.3 MB', uploadDate: '2024-12-05', views: 4567, downloads: 3654, description: '100 câu hỏi đọc hiểu', author: 'TS. Quyên Văn XXX', course: 'VSTEP Complete' },
  { id: 'RD016', name: 'Academic Reading Skills', type: 'pdf', category: 'reading', skill: 'Reading', level: 'B2', size: '26.4 MB', uploadDate: '2024-12-06', views: 3876, downloads: 3012, description: 'Kỹ năng đọc học thuật', author: 'GV. Sáng Văn ZZZ', course: 'VSTEP Intensive' },
  { id: 'RD017', name: 'Speed Reading Techniques', type: 'pptx', category: 'reading', skill: 'Reading', level: 'C1', size: '17.9 MB', uploadDate: '2024-12-07', views: 2987, downloads: 2345, description: 'Kỹ thuật đọc nhanh', author: 'TS. Thắng Thị AAAA', course: 'VSTEP Premium' },
];

// WRITING - Viết (17 items)
const writingMaterials: StudyMaterial[] = [
  { id: 'WR001', name: 'VSTEP A2 Writing Essentials', type: 'pdf', category: 'writing', level: 'A2', skill: 'Writing', size: '22.5 MB', uploadDate: '2024-12-02', views: 2987, downloads: 1987, description: 'Viết luận cơ bản A2', author: 'GV. Lê Văn C', course: 'VSTEP Starter' },
  { id: 'WR002', name: 'VSTEP B1 Writing Mastery', type: 'pdf', category: 'writing', level: 'B1', skill: 'Writing', size: '29.8 MB', uploadDate: '2024-12-06', views: 3987, downloads: 2987, description: 'Viết luận thành thạo B1', author: 'TS. Trương Thị K', course: 'VSTEP Builder' },
  { id: 'WR003', name: 'VSTEP B2 Writing Excellence', type: 'pdf', category: 'writing', level: 'B2', skill: 'Writing', size: '36.8 MB', uploadDate: '2024-12-10', views: 5234, downloads: 3987, description: 'Viết xuất sắc B2', author: 'ThS. Lưu Văn R', course: 'VSTEP Intensive' },
  { id: 'WR004', name: 'VSTEP C1 Writing Perfection', type: 'pdf', category: 'writing', level: 'C1', skill: 'Writing', size: '40.5 MB', uploadDate: '2024-12-14', views: 4234, downloads: 3156, description: 'Viết hoàn hảo C1', author: 'GV. Hạ Thị Y', course: 'VSTEP Master' },
  { id: 'WR005', name: 'Writing All Levels', type: 'pdf', category: 'writing', skill: 'Writing', size: '46.9 MB', uploadDate: '2024-12-19', views: 5987, downloads: 4756, description: 'Writing tất cả cấp độ', author: 'GV. Khoa Văn HH', course: 'VSTEP Foundation' },
  { id: 'WR006', name: 'Writing Task 1 Lecture 01', type: 'pptx', category: 'writing', skill: 'Writing', level: 'A2', size: '13.5 MB', uploadDate: '2024-12-11', views: 2123, downloads: 1654, description: 'Writing Task 1 cơ bản', author: 'TS. Yến Thị UU', course: 'VSTEP Starter' },
  { id: 'WR007', name: 'Writing Task 1 Lecture 02', type: 'pptx', category: 'writing', skill: 'Writing', level: 'B1', size: '15.1 MB', uploadDate: '2024-12-12', views: 2345, downloads: 1823, description: 'Writing Task 1 trung cấp', author: 'ThS. Ánh Văn VV', course: 'VSTEP Builder' },
  { id: 'WR008', name: 'Writing Task 1 Lecture 03', type: 'pptx', category: 'writing', skill: 'Writing', level: 'B2', size: '16.8 MB', uploadDate: '2024-12-13', views: 2567, downloads: 1998, description: 'Writing Task 1 nâng cao', author: 'GV. Đào Thị WW', course: 'VSTEP Booster' },
  { id: 'WR009', name: 'Writing Task 2 Lecture 01', type: 'pptx', category: 'writing', skill: 'Writing', level: 'A2', size: '14.2 MB', uploadDate: '2024-12-14', views: 2234, downloads: 1765, description: 'Writing Task 2 cơ bản', author: 'TS. Hoài Văn XX', course: 'VSTEP Starter' },
  { id: 'WR010', name: 'Writing Task 2 Lecture 02', type: 'pptx', category: 'writing', skill: 'Writing', level: 'B1', size: '15.9 MB', uploadDate: '2024-12-15', views: 2456, downloads: 1912, description: 'Writing Task 2 trung cấp', author: 'ThS. Khánh Thị YY', course: 'VSTEP Builder' },
  { id: 'WR011', name: 'Writing Essay Structure', type: 'pptx', category: 'writing', skill: 'Writing', size: '16.6 MB', uploadDate: '2024-12-17', views: 2987, downloads: 2298, description: 'Cấu trúc bài luận', author: 'TS. Mai Thị AAA', course: 'VSTEP Complete' },
  { id: 'WR012', name: 'Writing Practice Task 1 - A2', type: 'pdf', category: 'writing', skill: 'Writing', level: 'A2', size: '6.4 MB', uploadDate: '2024-12-11', views: 2987, downloads: 2345, description: 'Bài tập Writing Task 1 A2', author: 'TS. Xuân Thị DDDD', course: 'VSTEP Starter' },
  { id: 'WR013', name: 'Writing Practice Task 1 - B1', type: 'pdf', category: 'writing', skill: 'Writing', level: 'B1', size: '7.2 MB', uploadDate: '2024-12-12', views: 3123, downloads: 2476, description: 'Bài tập Writing Task 1 B1', author: 'ThS. Ánh Văn EEEE', course: 'VSTEP Builder' },
  { id: 'WR014', name: 'Writing Practice Task 2 - B2', type: 'pdf', category: 'writing', skill: 'Writing', level: 'B2', size: '8.2 MB', uploadDate: '2024-12-16', views: 3234, downloads: 2567, description: 'Bài tập Writing Task 2 B2', author: 'GV. Giang Văn IIII', course: 'VSTEP Booster' },
  { id: 'WR015', name: 'Writing 50 Sample Essays', type: 'pdf', category: 'writing', skill: 'Writing', size: '11.6 MB', uploadDate: '2024-12-17', views: 4234, downloads: 3456, description: '50 bài luận mẫu', author: 'TS. Hòa Thị JJJJ', course: 'VSTEP Complete' },
  { id: 'WR016', name: 'Email Writing Guide', type: 'docx', category: 'writing', skill: 'Writing', level: 'B1', size: '4.8 MB', uploadDate: '2024-12-18', views: 2876, downloads: 2234, description: 'Hướng dẫn viết email', author: 'GV. Long Thị LLLL', course: 'VSTEP Builder' },
  { id: 'WR017', name: 'Essay Types & Structures', type: 'pdf', category: 'writing', skill: 'Writing', level: 'B2', size: '18.9 MB', uploadDate: '2024-12-19', views: 3567, downloads: 2876, description: 'Các loại bài luận', author: 'TS. Minh Văn MMMM', course: 'VSTEP Intensive' },
];

// LISTENING - Nghe (17 items)
const listeningMaterials: StudyMaterial[] = [
  { id: 'LS001', name: 'VSTEP A2 Listening Skills', type: 'pdf', category: 'listening', level: 'A2', skill: 'Listening', size: '28.3 MB', uploadDate: '2024-12-01', views: 3123, downloads: 2156, description: 'Kỹ năng Listening cơ bản A2', author: 'ThS. Trần Thị B', course: 'VSTEP Starter' },
  { id: 'LS002', name: 'VSTEP B1 Listening Advanced', type: 'pdf', category: 'listening', level: 'B1', skill: 'Listening', size: '35.7 MB', uploadDate: '2024-12-05', views: 4234, downloads: 3167, description: 'Nghe hiểu nâng cao B1', author: 'GV. Lý Văn I', course: 'VSTEP Builder' },
  { id: 'LS003', name: 'VSTEP B2 Listening Expert', type: 'pdf', category: 'listening', level: 'B2', skill: 'Listening', size: '41.3 MB', uploadDate: '2024-12-09', views: 5456, downloads: 4234, description: 'Nghe chuyên sâu B2', author: 'TS. Dương Thị Q', course: 'VSTEP Booster' },
  { id: 'LS004', name: 'VSTEP C1 Listening Proficiency', type: 'pdf', category: 'listening', level: 'C1', skill: 'Listening', size: '46.2 MB', uploadDate: '2024-12-13', views: 4345, downloads: 3298, description: 'Nghe thông thạo C1', author: 'ThS. Ứng Văn X', course: 'VSTEP Master' },
  { id: 'LS005', name: 'Listening All Levels', type: 'pdf', category: 'listening', skill: 'Listening', size: '49.5 MB', uploadDate: '2024-12-18', views: 6123, downloads: 4876, description: 'Listening tất cả cấp độ', author: 'ThS. Hải Thị GG', course: 'VSTEP Foundation' },
  { id: 'LS006', name: 'Listening Skills Lecture 01', type: 'pptx', category: 'listening', skill: 'Listening', level: 'A2', size: '14.8 MB', uploadDate: '2024-12-06', views: 2234, downloads: 1765, description: 'Kỹ năng Listening cơ bản', author: 'ThS. Sang Văn PP', course: 'VSTEP Starter' },
  { id: 'LS007', name: 'Listening Skills Lecture 02', type: 'pptx', category: 'listening', skill: 'Listening', level: 'B1', size: '16.3 MB', uploadDate: '2024-12-07', views: 2456, downloads: 1923, description: 'Kỹ năng Listening trung cấp', author: 'GV. Tâm Thị QQ', course: 'VSTEP Builder' },
  { id: 'LS008', name: 'Listening Skills Lecture 03', type: 'pptx', category: 'listening', skill: 'Listening', level: 'B2', size: '17.9 MB', uploadDate: '2024-12-08', views: 2678, downloads: 2087, description: 'Kỹ năng Listening nâng cao', author: 'TS. Uyên Văn RR', course: 'VSTEP Booster' },
  { id: 'LS009', name: 'Listening Skills Lecture 04', type: 'pptx', category: 'listening', skill: 'Listening', level: 'C1', size: '19.2 MB', uploadDate: '2024-12-09', views: 2345, downloads: 1876, description: 'Kỹ năng Listening chuyên gia', author: 'ThS. Vân Thị SS', course: 'VSTEP Master' },
  { id: 'LS010', name: 'Listening Note-taking Methods', type: 'pptx', category: 'listening', skill: 'Listening', size: '18.7 MB', uploadDate: '2024-12-10', views: 2987, downloads: 2345, description: 'Phương pháp ghi chép khi nghe', author: 'GV. Xuân Văn TT', course: 'VSTEP Complete' },
  { id: 'LS011', name: 'Listening Practice Set 01 - A2', type: 'pdf', category: 'listening', skill: 'Listening', level: 'A2', size: '7.8 MB', uploadDate: '2024-12-06', views: 3234, downloads: 2567, description: 'Bộ bài tập Listening A2', author: 'ThS. Rồng Thị YYY', course: 'VSTEP Starter' },
  { id: 'LS012', name: 'Listening Practice Set 02 - B1', type: 'pdf', category: 'listening', skill: 'Listening', level: 'B1', size: '8.9 MB', uploadDate: '2024-12-07', views: 3456, downloads: 2765, description: 'Bộ bài tập Listening B1', author: 'GV. Sáng Văn ZZZ', course: 'VSTEP Builder' },
  { id: 'LS013', name: 'Listening Practice Set 03 - B2', type: 'pdf', category: 'listening', skill: 'Listening', level: 'B2', size: '9.6 MB', uploadDate: '2024-12-08', views: 3678, downloads: 2876, description: 'Bộ bài tập Listening B2', author: 'TS. Thắng Thị AAAA', course: 'VSTEP Booster' },
  { id: 'LS014', name: 'Listening Practice Set 04 - C1', type: 'pdf', category: 'listening', skill: 'Listening', level: 'C1', size: '10.3 MB', uploadDate: '2024-12-09', views: 3123, downloads: 2456, description: 'Bộ bài tập Listening C1', author: 'ThS. Uyên Văn BBBB', course: 'VSTEP Master' },
  { id: 'LS015', name: 'Listening Dictation Exercises', type: 'pdf', category: 'listening', skill: 'Listening', size: '12.7 MB', uploadDate: '2024-12-10', views: 4123, downloads: 3298, description: 'Bài tập nghe chép chính tả', author: 'GV. Vân Thị CCCC', course: 'VSTEP Complete' },
  { id: 'LS016', name: 'Academic Listening Skills', type: 'pdf', category: 'listening', skill: 'Listening', level: 'B2', size: '24.6 MB', uploadDate: '2024-12-11', views: 3876, downloads: 3012, description: 'Kỹ năng nghe học thuật', author: 'TS. Xuân Thị DDDD', course: 'VSTEP Intensive' },
  { id: 'LS017', name: 'Accent Recognition Training', type: 'pptx', category: 'listening', skill: 'Listening', level: 'C1', size: '16.4 MB', uploadDate: '2024-12-12', views: 2765, downloads: 2156, description: 'Nhận diện giọng nói', author: 'GV. Ánh Văn EEEE', course: 'VSTEP Premium' },
];

// SPEAKING - Nói (17 items)
const speakingMaterials: StudyMaterial[] = [
  { id: 'SP001', name: 'VSTEP A2 Speaking Practice', type: 'pdf', category: 'speaking', level: 'A2', skill: 'Speaking', size: '19.7 MB', uploadDate: '2024-12-02', views: 3234, downloads: 2234, description: 'Luyện Speaking A2', author: 'ThS. Hoàng Thị D', course: 'VSTEP Starter' },
  { id: 'SP002', name: 'VSTEP B1 Speaking Fluency', type: 'pdf', category: 'speaking', level: 'B1', skill: 'Speaking', size: '26.3 MB', uploadDate: '2024-12-06', views: 4345, downloads: 3234, description: 'Nói trôi chảy B1', author: 'ThS. Võ Văn L', course: 'VSTEP Builder' },
  { id: 'SP003', name: 'VSTEP B2 Speaking Confidence', type: 'pdf', category: 'speaking', level: 'B2', skill: 'Speaking', size: '32.4 MB', uploadDate: '2024-12-10', views: 5567, downloads: 4345, description: 'Nói tự tin B2', author: 'GV. Tô Thị S', course: 'VSTEP Intensive' },
  { id: 'SP004', name: 'VSTEP C1 Speaking Excellence', type: 'pdf', category: 'speaking', level: 'C1', skill: 'Speaking', size: '37.6 MB', uploadDate: '2024-12-14', views: 4456, downloads: 3398, description: 'Nói xuất sắc C1', author: 'TS. Từ Văn Z', course: 'VSTEP Master' },
  { id: 'SP005', name: 'Speaking All Levels', type: 'pdf', category: 'speaking', skill: 'Speaking', size: '44.2 MB', uploadDate: '2024-12-19', views: 6045, downloads: 4823, description: 'Speaking tất cả cấp độ', author: 'TS. Loan Thị II', course: 'VSTEP Foundation' },
  { id: 'SP006', name: 'Speaking Part 1 Lecture', type: 'pptx', category: 'speaking', skill: 'Speaking', level: 'A2', size: '12.8 MB', uploadDate: '2024-12-18', views: 2123, downloads: 1654, description: 'Speaking Part 1 cơ bản', author: 'ThS. Ngọc Văn BBB', course: 'VSTEP Starter' },
  { id: 'SP007', name: 'Speaking Part 2 Lecture', type: 'pptx', category: 'speaking', skill: 'Speaking', level: 'B1', size: '14.3 MB', uploadDate: '2024-12-19', views: 2345, downloads: 1823, description: 'Speaking Part 2 trung cấp', author: 'GV. Phương Thị CCC', course: 'VSTEP Builder' },
  { id: 'SP008', name: 'Speaking Part 3 Lecture', type: 'pptx', category: 'speaking', skill: 'Speaking', level: 'B2', size: '15.7 MB', uploadDate: '2024-12-20', views: 2567, downloads: 1987, description: 'Speaking Part 3 nâng cao', author: 'TS. Quang Văn DDD', course: 'VSTEP Booster' },
  { id: 'SP009', name: 'Speaking Fluency Techniques', type: 'pptx', category: 'speaking', skill: 'Speaking', size: '17.2 MB', uploadDate: '2024-12-21', views: 2987, downloads: 2298, description: 'Kỹ thuật nói trôi chảy', author: 'ThS. Rạng Thị EEE', course: 'VSTEP Complete' },
  { id: 'SP010', name: 'Speaking Practice Part 1', type: 'pdf', category: 'speaking', skill: 'Speaking', level: 'A2', size: '5.7 MB', uploadDate: '2024-12-18', views: 2765, downloads: 2156, description: 'Bài tập Speaking Part 1', author: 'ThS. Khánh Văn KKKK', course: 'VSTEP Starter' },
  { id: 'SP011', name: 'Speaking Practice Part 2', type: 'pdf', category: 'speaking', skill: 'Speaking', level: 'B1', size: '6.3 MB', uploadDate: '2024-12-19', views: 2987, downloads: 2345, description: 'Bài tập Speaking Part 2', author: 'GV. Long Thị LLLL', course: 'VSTEP Builder' },
  { id: 'SP012', name: 'Speaking Practice Part 3', type: 'pdf', category: 'speaking', skill: 'Speaking', level: 'B2', size: '6.9 MB', uploadDate: '2024-12-20', views: 3156, downloads: 2487, description: 'Bài tập Speaking Part 3', author: 'TS. Minh Văn MMMM', course: 'VSTEP Booster' },
  { id: 'SP013', name: 'Speaking 100 Common Topics', type: 'pdf', category: 'speaking', skill: 'Speaking', size: '9.4 MB', uploadDate: '2024-12-21', views: 3876, downloads: 3012, description: '100 chủ đề thường gặp', author: 'ThS. Ngọc Thị NNNN', course: 'VSTEP Complete' },
  { id: 'SP014', name: 'Pronunciation Guide', type: 'pdf', category: 'speaking', skill: 'Speaking', level: 'A2', size: '15.3 MB', uploadDate: '2024-12-22', views: 3234, downloads: 2654, description: 'Hướng dẫn phát âm', author: 'GV. Phương Văn OOOO', course: 'VSTEP Foundation' },
  { id: 'SP015', name: 'Fluency Building Exercises', type: 'docx', category: 'speaking', skill: 'Speaking', level: 'B1', size: '7.8 MB', uploadDate: '2024-12-23', views: 2987, downloads: 2345, description: 'Bài tập xây dựng độ trôi chảy', author: 'TS. Quang Thị PPPP', course: 'VSTEP Builder' },
  { id: 'SP016', name: 'Interview Skills for VSTEP', type: 'pdf', category: 'speaking', skill: 'Speaking', level: 'B2', size: '12.6 MB', uploadDate: '2024-12-24', views: 3456, downloads: 2765, description: 'Kỹ năng phỏng vấn', author: 'ThS. Rạng Văn QQQQ', course: 'VSTEP Intensive' },
  { id: 'SP017', name: 'Advanced Discussion Strategies', type: 'pptx', category: 'speaking', skill: 'Speaking', level: 'C1', size: '18.4 MB', uploadDate: '2024-12-25', views: 2876, downloads: 2234, description: 'Chiến lược thảo luận nâng cao', author: 'GV. Sơn Thị RRRR', course: 'VSTEP Master' },
];

// Combine all study materials
export const allStudyMaterials: StudyMaterial[] = [
  ...grammarMaterials,
  ...vocabularyMaterials,
  ...readingMaterials,
  ...writingMaterials,
  ...listeningMaterials,
  ...speakingMaterials,
];

// Export by category
export const studyMaterialsByCategory = {
  all: allStudyMaterials,
  grammar: grammarMaterials,
  vocabulary: vocabularyMaterials,
  reading: readingMaterials,
  writing: writingMaterials,
  listening: listeningMaterials,
  speaking: speakingMaterials,
};

// Helper function to get materials by filters
export function getStudyMaterials(
  category: StudyCategory = 'all',
  level?: 'A2' | 'B1' | 'B2' | 'C1',
  skill?: string,
  searchTerm?: string
): StudyMaterial[] {
  let materials = category === 'all' ? allStudyMaterials : studyMaterialsByCategory[category];

  if (level) {
    materials = materials.filter(m => m.level === level);
  }

  if (skill && skill !== 'all') {
    materials = materials.filter(m => m.skill === skill);
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
