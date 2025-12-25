import { useState } from 'react';
import { ArrowLeft, BookOpen, Search, Calendar, User, Tag, Eye, Clock, Star, TrendingUp, BookMarked, Sparkles, FileText, Headphones, Mic, PenTool, Target, Award, Filter } from 'lucide-react';

interface BlogVSTEPProps {
  onBack: () => void;
}

type Category = 'all' | 'vstep-overview' | 'exam-structure' | 'reading-tips' | 'listening-tips' | 'writing-tips' | 'speaking-tips' | 'mock-tests' | 'study-materials' | 'news';
type RoleFilter = 'all' | 'student' | 'teacher' | 'admin' | 'uploader' | 'about-us';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  category: Category;
  slug: string;
  author: string;
  date: string;
  views: number;
  tags: string[];
  readTime: string;
  isFeatured?: boolean;
  level?: 'A2' | 'B1' | 'B2' | 'C1' | 'All';
  roleVisibility: RoleFilter[];
  image?: string;
}

export function BlogVSTEP({ onBack }: BlogVSTEPProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedRole, setSelectedRole] = useState<RoleFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Tất cả', slug: '/blog', color: 'gray', icon: BookOpen, description: 'Tất cả bài viết' },
    { id: 'vstep-overview', name: 'Giới thiệu VSTEP', slug: '/blog/vstep-overview', color: 'blue', icon: BookMarked, description: 'Hiểu về kỳ thi VSTEP' },
    { id: 'exam-structure', name: 'Cấu trúc & Hình thức thi', slug: '/blog/vstep-exam-structure', color: 'purple', icon: Target, description: 'Trang trụ cột - SEO quan trọng', isCritical: true },
    { id: 'reading-tips', name: 'Reading Tips', slug: '/blog/reading-tips', color: 'green', icon: FileText, description: 'Chiến thuật Reading' },
    { id: 'listening-tips', name: 'Listening Tips', slug: '/blog/listening-tips', color: 'orange', icon: Headphones, description: 'Kỹ năng Listening' },
    { id: 'writing-tips', name: 'Writing Tips', slug: '/blog/writing-tips', color: 'pink', icon: PenTool, description: 'Tips Writing hiệu quả', isCritical: true },
    { id: 'speaking-tips', name: 'Speaking Tips', slug: '/blog/speaking-tips', color: 'indigo', icon: Mic, description: 'Nâng cao Speaking', isCritical: true },
    { id: 'mock-tests', name: 'Đề thi mẫu & Mock Test', slug: '/blog/mock-tests', color: 'red', icon: Award, description: 'Đề thi & luyện tập' },
    { id: 'study-materials', name: 'Tài liệu ôn tập', slug: '/blog/study-materials', color: 'teal', icon: BookOpen, description: 'Tài liệu học tập' },
    { id: 'news', name: 'Tin tức & Lịch thi', slug: '/blog/news', color: 'amber', icon: TrendingUp, description: 'Cập nhật mới nhất' },
  ];

  const roleFilters = [
    { id: 'all', name: 'Tất cả', color: 'gray' },
    { id: 'student', name: 'Student', color: 'blue' },
    { id: 'teacher', name: 'Teacher', color: 'purple' },
    { id: 'admin', name: 'Admin', color: 'red' },
    { id: 'uploader', name: 'Upload', color: 'yellow' },
    { id: 'about-us', name: 'About Us', color: 'green' },
  ];

  const blogPosts: BlogPost[] = [
    // Featured Posts
    {
      id: 1,
      title: 'VSTEP là gì? Tất cả những gì bạn cần biết về chứng chỉ VSTEP',
      description: 'Hướng dẫn toàn diện về chứng chỉ VSTEP: định nghĩa, mục đích, đối tượng thi, các cấp độ từ A2 đến C1, và lợi ích của việc có chứng chỉ VSTEP trong học tập và công việc.',
      category: 'vstep-overview',
      slug: '/blog/vstep-overview/vstep-la-gi',
      author: 'Admin VSTEPRO',
      date: '2024-01-15',
      views: 15420,
      tags: ['VSTEP', 'Chứng chỉ', 'Tiếng Anh'],
      readTime: '8 phút',
      isFeatured: true,
      level: 'All',
      roleVisibility: ['all', 'student', 'teacher', 'admin', 'about-us'],
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80'
    },
    {
      id: 2,
      title: 'Cấu trúc đề thi VSTEP chi tiết: 4 kỹ năng Reading, Listening, Writing, Speaking',
      description: 'Phân tích chi tiết cấu trúc đề thi VSTEP theo từng kỹ năng: số lượng câu hỏi, thời gian làm bài, dạng bài tập, và tiêu chí chấm điểm cho mỗi phần thi.',
      category: 'exam-structure',
      slug: '/blog/exam-structure/cau-truc-de-thi-vstep',
      author: 'Giảng viên VSTEPRO',
      date: '2024-01-20',
      views: 12890,
      tags: ['Cấu trúc thi', 'VSTEP', 'Đề thi'],
      readTime: '12 phút',
      isFeatured: true,
      level: 'All',
      roleVisibility: ['all', 'student', 'teacher', 'about-us'],
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80'
    },
    {
      id: 3,
      title: '10 Chiến lược Reading VSTEP giúp bạn đạt điểm cao',
      description: 'Chia sẻ 10 kỹ thuật đọc hiểu hiệu quả: skimming, scanning, đoán nghĩa từ vựng qua ngữ cảnh, phân tích cấu trúc câu phức, và quản lý thời gian tối ưu.',
      category: 'reading-tips',
      slug: '/blog/reading-tips/10-chien-luoc-reading',
      author: 'Thầy Minh Tuấn',
      date: '2024-02-01',
      views: 9850,
      tags: ['Reading', 'Tips', 'Chiến lược'],
      readTime: '15 phút',
      isFeatured: true,
      level: 'B1',
      roleVisibility: ['all', 'student', 'teacher'],
      image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80'
    },
    // Student Posts
    {
      id: 4,
      title: 'Cách học từ vựng VSTEP hiệu quả cho người mới bắt đầu',
      description: 'Phương pháp học từ vựng thông minh với flashcard, spaced repetition, và ứng dụng công nghệ AI.',
      category: 'study-materials',
      slug: '/blog/study-materials/hoc-tu-vung-vstep',
      author: 'Cô Hương Giang',
      date: '2024-02-05',
      views: 8200,
      tags: ['Từ vựng', 'Học tập', 'Phương pháp'],
      readTime: '10 phút',
      level: 'A2',
      roleVisibility: ['all', 'student'],
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'
    },
    {
      id: 5,
      title: 'Listening VSTEP: Bí quyết nghe hiểu giọng Anh - Mỹ - Úc',
      description: 'Làm quen với các giọng điệu khác nhau trong bài thi VSTEP Listening và cách luyện tập hiệu quả.',
      category: 'listening-tips',
      slug: '/blog/listening-tips/bi-quyet-nghe-hieu',
      author: 'Thầy John Smith',
      date: '2024-02-10',
      views: 7650,
      tags: ['Listening', 'Giọng nói', 'Luyện nghe'],
      readTime: '12 phút',
      level: 'B2',
      roleVisibility: ['all', 'student', 'teacher'],
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80'
    },
    {
      id: 6,
      title: 'Writing Task 1 VSTEP: Cách viết biểu đồ, bảng số liệu chuyên nghiệp',
      description: 'Hướng dẫn chi tiết cách mô tả biểu đồ, bảng số liệu với từ vựng và cấu trúc câu học thuật.',
      category: 'writing-tips',
      slug: '/blog/writing-tips/writing-task-1-bieu-do',
      author: 'Cô Mai Anh',
      date: '2024-02-15',
      views: 11200,
      tags: ['Writing', 'Task 1', 'Biểu đồ'],
      readTime: '18 phút',
      level: 'B2',
      roleVisibility: ['all', 'student', 'teacher', 'about-us'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
    },
    {
      id: 7,
      title: 'Speaking Part 3 VSTEP: Cách trả lời câu hỏi Discussion hiệu quả',
      description: 'Kỹ thuật phát triển ý tưởng, sử dụng linking words, và tạo ấn tượng với examiner trong phần Speaking Part 3.',
      category: 'speaking-tips',
      slug: '/blog/speaking-tips/speaking-part-3-discussion',
      author: 'Thầy David Lee',
      date: '2024-02-20',
      views: 6890,
      tags: ['Speaking', 'Part 3', 'Discussion'],
      readTime: '14 phút',
      level: 'C1',
      roleVisibility: ['all', 'student', 'teacher'],
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80'
    },
    // Teacher Posts
    {
      id: 8,
      title: 'Đề thi VSTEP mẫu B1 - Full test kèm đáp án chi tiết',
      description: 'Bộ đề thi VSTEP B1 hoàn chỉnh với 4 kỹ năng, đáp án, transcript, và hướng dẫn giải thích.',
      category: 'mock-tests',
      slug: '/blog/mock-tests/de-thi-vstep-b1-mau',
      author: 'Ban Biên Soạn VSTEPRO',
      date: '2024-02-25',
      views: 18900,
      tags: ['Đề thi', 'B1', 'Mock test'],
      readTime: '120 phút',
      level: 'B1',
      roleVisibility: ['all', 'student', 'teacher', 'admin', 'uploader'],
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80'
    },
    {
      id: 9,
      title: 'Lịch thi VSTEP 2024: Đăng ký, địa điểm thi, lệ phí',
      description: 'Cập nhật lịch thi VSTEP mới nhất tại các trường đại học, cách đăng ký online, và thông tin lệ phí.',
      category: 'news',
      slug: '/blog/news/lich-thi-vstep-2024',
      author: 'Admin VSTEPRO',
      date: '2024-03-01',
      views: 21500,
      tags: ['Lịch thi', 'Đăng ký', '2024'],
      readTime: '7 phút',
      level: 'All',
      roleVisibility: ['all', 'student', 'teacher', 'admin', 'about-us'],
      image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80'
    },
    {
      id: 10,
      title: 'Phương pháp dạy VSTEP hiệu quả cho giáo viên',
      description: 'Chia sẻ kinh nghiệm giảng dạy VSTEP: cách tổ chức lớp học, sử dụng công nghệ, và đánh giá học viên.',
      category: 'study-materials',
      slug: '/blog/study-materials/phuong-phap-day-vstep',
      author: 'TS. Nguyễn Thị Lan',
      date: '2024-03-05',
      views: 5400,
      tags: ['Giảng dạy', 'Phương pháp', 'Giáo viên'],
      readTime: '20 phút',
      level: 'All',
      roleVisibility: ['all', 'teacher', 'admin'],
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80'
    },
    // Admin Posts
    {
      id: 11,
      title: 'Tiêu chí chấm điểm VSTEP Speaking chính thức từ Bộ GD&ĐT',
      description: 'Rubric chấm điểm VSTEP Speaking chi tiết theo 4 tiêu chí: Fluency, Vocabulary, Grammar, Pronunciation.',
      category: 'exam-structure',
      slug: '/blog/exam-structure/tieu-chi-cham-speaking',
      author: 'Ban Quản Trị',
      date: '2024-03-10',
      views: 13200,
      tags: ['Chấm điểm', 'Speaking', 'Tiêu chí'],
      readTime: '15 phút',
      level: 'All',
      roleVisibility: ['all', 'teacher', 'admin'],
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80'
    },
    {
      id: 12,
      title: 'So sánh VSTEP với IELTS, TOEFL, TOEIC: Nên chọn chứng chỉ nào?',
      description: 'Phân tích ưu nhược điểm của VSTEP so với các chứng chỉ quốc tế khác về độ khó, chi phí, và giá trị.',
      category: 'vstep-overview',
      slug: '/blog/vstep-overview/so-sanh-vstep-ielts-toefl',
      author: 'Chuyên Gia VSTEPRO',
      date: '2024-03-15',
      views: 16700,
      tags: ['So sánh', 'VSTEP', 'IELTS', 'TOEFL'],
      readTime: '10 phút',
      level: 'All',
      roleVisibility: ['all', 'student', 'teacher', 'admin', 'about-us'],
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80'
    },
    // Uploader Posts
    {
      id: 13,
      title: 'Tải về: 500+ câu hỏi Reading VSTEP có đáp án (PDF)',
      description: 'Bộ sưu tập 500 câu hỏi Reading VSTEP từ A2-C1, phân loại theo dạng bài, kèm đáp án và giải thích chi tiết.',
      category: 'study-materials',
      slug: '/blog/study-materials/500-cau-hoi-reading',
      author: 'Upload Team',
      date: '2024-03-20',
      views: 24300,
      tags: ['Tài liệu', 'Reading', 'PDF', 'Download'],
      readTime: '5 phút',
      level: 'All',
      roleVisibility: ['all', 'student', 'uploader'],
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80'
    },
    {
      id: 14,
      title: 'Tải về: Audio files VSTEP Listening Practice (MP3)',
      description: 'Bộ audio luyện nghe VSTEP chuẩn 3 giọng Anh-Mỹ-Úc, 100+ bài nghe từ cơ bản đến nâng cao.',
      category: 'study-materials',
      slug: '/blog/study-materials/audio-listening-practice',
      author: 'Upload Team',
      date: '2024-03-25',
      views: 19800,
      tags: ['Audio', 'Listening', 'MP3', 'Download'],
      readTime: '5 phút',
      level: 'All',
      roleVisibility: ['all', 'student', 'uploader'],
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
    },
    // About Us Posts
    {
      id: 15,
      title: 'Giới thiệu VSTEPRO: Nền tảng luyện thi VSTEP hàng đầu Việt Nam',
      description: 'Câu chuyện thành lập VSTEPRO, sứ mệnh, tầm nhìn, và những thành tựu đã đạt được sau 3 năm hoạt động.',
      category: 'vstep-overview',
      slug: '/blog/vstep-overview/gioi-thieu-vstepro',
      author: 'Ban Sáng Lập VSTEPRO',
      date: '2024-03-30',
      views: 8900,
      tags: ['VSTEPRO', 'Giới thiệu', 'About'],
      readTime: '8 phút',
      level: 'All',
      roleVisibility: ['all', 'about-us'],
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80'
    },
    // More posts to reach 42 total
    {
      id: 16,
      title: 'Reading Part 1 VSTEP: Chiến thuật làm bài Sentence Completion',
      description: 'Hướng dẫn chi tiết cách làm dạng bài Sentence Completion trong Reading Part 1 VSTEP.',
      category: 'reading-tips',
      slug: '/blog/reading-tips/reading-part-1-sentence-completion',
      author: 'Thầy Minh Tuấn',
      date: '2024-04-01',
      views: 7200,
      tags: ['Reading', 'Part 1', 'Tips'],
      readTime: '10 phút',
      level: 'B1',
      roleVisibility: ['all', 'student'],
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80'
    },
    {
      id: 17,
      title: 'Writing Task 2 VSTEP: Cách viết bài luận Opinion Essay',
      description: 'Cấu trúc, ý tưởng, và từ vựng cho dạng bài Opinion Essay trong Writing Task 2.',
      category: 'writing-tips',
      slug: '/blog/writing-tips/writing-task-2-opinion-essay',
      author: 'Cô Mai Anh',
      date: '2024-04-05',
      views: 9500,
      tags: ['Writing', 'Task 2', 'Essay'],
      readTime: '16 phút',
      level: 'B2',
      roleVisibility: ['all', 'student', 'teacher'],
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80'
    },
    {
      id: 18,
      title: 'Speaking Part 1 VSTEP: Cách tự giới thiệu bản thân ấn tượng',
      description: 'Mẫu câu và tips tự giới thiệu tự nhiên, tạo ấn tượng tốt với examiner ngay từ đầu.',
      category: 'speaking-tips',
      slug: '/blog/speaking-tips/speaking-part-1-gioi-thieu',
      author: 'Thầy David Lee',
      date: '2024-04-10',
      views: 6100,
      tags: ['Speaking', 'Part 1', 'Introduction'],
      readTime: '8 phút',
      level: 'A2',
      roleVisibility: ['all', 'student'],
      image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80'
    },
    {
      id: 19,
      title: 'Listening Part 2 VSTEP: Kỹ thuật bắt từ khóa và paraphrasing',
      description: 'Cách nhận diện từ khóa và hiểu paraphrasing trong bài nghe VSTEP Listening Part 2.',
      category: 'listening-tips',
      slug: '/blog/listening-tips/listening-part-2-tu-khoa',
      author: 'Thầy John Smith',
      date: '2024-04-15',
      views: 5800,
      tags: ['Listening', 'Part 2', 'Keywords'],
      readTime: '11 phút',
      level: 'B1',
      roleVisibility: ['all', 'student'],
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
    },
    {
      id: 20,
      title: 'Đề thi VSTEP mẫu B2 - Full test kèm đáp án chi tiết',
      description: 'Bộ đề thi VSTEP B2 hoàn chỉnh với 4 kỹ năng, đáp án, transcript, và hướng dẫn giải thích.',
      category: 'mock-tests',
      slug: '/blog/mock-tests/de-thi-vstep-b2-mau',
      author: 'Ban Biên Soạn VSTEPRO',
      date: '2024-04-20',
      views: 22100,
      tags: ['Đề thi', 'B2', 'Mock test'],
      readTime: '120 phút',
      level: 'B2',
      roleVisibility: ['all', 'student', 'teacher', 'uploader'],
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80'
    },
    {
      id: 21,
      title: 'Ngữ pháp VSTEP cần thiết: Tenses và Conditionals',
      description: 'Tổng hợp kiến thức ngữ pháp về thì và câu điều kiện thường gặp trong VSTEP.',
      category: 'study-materials',
      slug: '/blog/study-materials/ngu-phap-tenses-conditionals',
      author: 'Cô Hương Giang',
      date: '2024-04-25',
      views: 10200,
      tags: ['Ngữ pháp', 'Tenses', 'Grammar'],
      readTime: '25 phút',
      level: 'B1',
      roleVisibility: ['all', 'student', 'teacher'],
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'
    },
    {
      id: 22,
      title: 'Collocations và Phrasal Verbs thường gặp trong VSTEP',
      description: 'Danh sách collocations và phrasal verbs quan trọng giúp nâng điểm VSTEP.',
      category: 'study-materials',
      slug: '/blog/study-materials/collocations-phrasal-verbs',
      author: 'Thầy Minh Tuấn',
      date: '2024-05-01',
      views: 8700,
      tags: ['Vocabulary', 'Collocations', 'Phrasal Verbs'],
      readTime: '18 phút',
      level: 'B2',
      roleVisibility: ['all', 'student'],
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80'
    },
    {
      id: 23,
      title: 'Cách cải thiện phát âm tiếng Anh cho VSTEP Speaking',
      description: 'Kỹ thuật luyện phát âm, intonation, và stress patterns chuẩn quốc tế.',
      category: 'speaking-tips',
      slug: '/blog/speaking-tips/cai-thien-phat-am',
      author: 'Thầy David Lee',
      date: '2024-05-05',
      views: 7400,
      tags: ['Speaking', 'Pronunciation', 'Accent'],
      readTime: '14 phút',
      level: 'B1',
      roleVisibility: ['all', 'student', 'teacher'],
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80'
    },
    {
      id: 24,
      title: 'Reading Part 3 VSTEP: Cách đọc nhanh và hiểu sâu',
      description: 'Kỹ thuật skimming và scanning hiệu quả cho Reading Part 3 dài và phức tạp.',
      category: 'reading-tips',
      slug: '/blog/reading-tips/reading-part-3-doc-nhanh',
      author: 'Cô Mai Anh',
      date: '2024-05-10',
      views: 6900,
      tags: ['Reading', 'Part 3', 'Speed Reading'],
      readTime: '12 phút',
      level: 'C1',
      roleVisibility: ['all', 'student'],
      image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80'
    },
    {
      id: 25,
      title: 'Listening Part 3 VSTEP: Chiến lược nghe academic lectures',
      description: 'Cách nghe hiểu bài giảng học thuật và ghi chú hiệu quả trong Listening Part 3.',
      category: 'listening-tips',
      slug: '/blog/listening-tips/listening-part-3-lectures',
      author: 'Thầy John Smith',
      date: '2024-05-15',
      views: 5300,
      tags: ['Listening', 'Part 3', 'Academic'],
      readTime: '13 phút',
      level: 'C1',
      roleVisibility: ['all', 'student', 'teacher'],
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80'
    },
    {
      id: 26,
      title: 'Đề thi VSTEP mẫu C1 - Full test kèm đáp án chi tiết',
      description: 'Bộ đề thi VSTEP C1 hoàn chỉnh với 4 kỹ năng, đáp án, transcript, và hướng dẫn giải thích.',
      category: 'mock-tests',
      slug: '/blog/mock-tests/de-thi-vstep-c1-mau',
      author: 'Ban Biên Soạn VSTEPRO',
      date: '2024-05-20',
      views: 17600,
      tags: ['Đề thi', 'C1', 'Mock test'],
      readTime: '120 phút',
      level: 'C1',
      roleVisibility: ['all', 'student', 'teacher', 'uploader'],
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80'
    },
    {
      id: 27,
      title: 'Lộ trình tự học VSTEP từ A2 lên B2 trong 6 tháng',
      description: 'Kế hoạch học tập chi tiết theo tuần, tài liệu cần thiết, và cách tự đánh giá tiến độ.',
      category: 'study-materials',
      slug: '/blog/study-materials/lo-trinh-tu-hoc-vstep',
      author: 'Cô Hương Giang',
      date: '2024-05-25',
      views: 14500,
      tags: ['Lộ trình', 'Tự học', 'Study Plan'],
      readTime: '22 phút',
      level: 'All',
      roleVisibility: ['all', 'student', 'about-us'],
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'
    },
    {
      id: 28,
      title: 'Top 10 sai lầm phổ biến trong VSTEP Writing',
      description: 'Phân tích 10 lỗi thường gặp trong Writing VSTEP và cách khắc phục hiệu quả.',
      category: 'writing-tips',
      slug: '/blog/writing-tips/top-10-sai-lam-writing',
      author: 'Cô Mai Anh',
      date: '2024-06-01',
      views: 11800,
      tags: ['Writing', 'Common Mistakes', 'Tips'],
      readTime: '16 phút',
      level: 'B2',
      roleVisibility: ['all', 'student', 'teacher'],
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80'
    },
    {
      id: 29,
      title: 'Cách sử dụng linking words trong VSTEP Writing & Speaking',
      description: 'Danh sách linking words quan trọng và cách sử dụng tự nhiên trong bài thi.',
      category: 'study-materials',
      slug: '/blog/study-materials/linking-words-vstep',
      author: 'Thầy Minh Tuấn',
      date: '2024-06-05',
      views: 9200,
      tags: ['Linking Words', 'Writing', 'Speaking'],
      readTime: '15 phút',
      level: 'B1',
      roleVisibility: ['all', 'student'],
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80'
    },
    {
      id: 30,
      title: 'VSTEP Speaking: Cách mở rộng câu trả lời hiệu quả',
      description: 'Kỹ thuật PREP (Point - Reason - Example - Point) và các phương pháp mở rộng ý tưởng.',
      category: 'speaking-tips',
      slug: '/blog/speaking-tips/mo-rong-cau-tra-loi',
      author: 'Thầy David Lee',
      date: '2024-06-10',
      views: 6700,
      tags: ['Speaking', 'Techniques', 'PREP'],
      readTime: '11 phút',
      level: 'B2',
      roleVisibility: ['all', 'student'],
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80'
    },
    {
      id: 31,
      title: 'Tải về: Bộ đề VSTEP Writing mẫu (200+ topics)',
      description: 'Tổng hợp 200+ đề Writing Task 1 & 2 từ các kỳ thi VSTEP trước, có bài mẫu band 4.5-5.0.',
      category: 'study-materials',
      slug: '/blog/study-materials/bo-de-writing-mau',
      author: 'Upload Team',
      date: '2024-06-15',
      views: 20500,
      tags: ['Writing', 'Topics', 'Download'],
      readTime: '5 phút',
      level: 'All',
      roleVisibility: ['all', 'student', 'uploader'],
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80'
    },
    {
      id: 32,
      title: 'Cách tính điểm VSTEP: Thang điểm và quy đổi chuẩn CEFR',
      description: 'Hướng dẫn chi tiết cách tính điểm từng kỹ năng và điểm tổng VSTEP theo thang CEFR.',
      category: 'exam-structure',
      slug: '/blog/exam-structure/cach-tinh-diem-vstep',
      author: 'Admin VSTEPRO',
      date: '2024-06-20',
      views: 15300,
      tags: ['Chấm điểm', 'CEFR', 'Thang điểm'],
      readTime: '10 phút',
      level: 'All',
      roleVisibility: ['all', 'student', 'teacher', 'admin', 'about-us'],
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80'
    },
    {
      id: 33,
      title: 'Listening: Cách luyện nghe shadowing cho VSTEP',
      description: 'Phương pháp shadowing hiệu quả giúp cải thiện khả năng nghe hiểu và phát âm.',
      category: 'listening-tips',
      slug: '/blog/listening-tips/luyen-nghe-shadowing',
      author: 'Thầy John Smith',
      date: '2024-06-25',
      views: 7100,
      tags: ['Listening', 'Shadowing', 'Practice'],
      readTime: '12 phút',
      level: 'B1',
      roleVisibility: ['all', 'student', 'teacher'],
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80'
    },
    {
      id: 34,
      title: 'Reading: Kỹ thuật đọc lướt nhanh trong 2 phút',
      description: 'Bài tập và kỹ thuật đọc lướt để nắm ý chính bài văn trong thời gian ngắn.',
      category: 'reading-tips',
      slug: '/blog/reading-tips/ky-thuat-doc-luot',
      author: 'Thầy Minh Tuấn',
      date: '2024-07-01',
      views: 8400,
      tags: ['Reading', 'Skimming', 'Speed'],
      readTime: '10 phút',
      level: 'B2',
      roleVisibility: ['all', 'student'],
      image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80'
    },
    {
      id: 35,
      title: 'Đề thi VSTEP mẫu A2 - Full test kèm đáp án chi tiết',
      description: 'Bộ đề thi VSTEP A2 hoàn chỉnh với 4 kỹ năng, đáp án, transcript, và hướng dẫn giải thích.',
      category: 'mock-tests',
      slug: '/blog/mock-tests/de-thi-vstep-a2-mau',
      author: 'Ban Biên Soạn VSTEPRO',
      date: '2024-07-05',
      views: 12400,
      tags: ['Đề thi', 'A2', 'Mock test'],
      readTime: '90 phút',
      level: 'A2',
      roleVisibility: ['all', 'student', 'uploader'],
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80'
    },
    {
      id: 36,
      title: 'Chứng chỉ VSTEP có giá trị bao lâu? Cách gia hạn',
      description: 'Thông tin về thời hạn hiệu lực của chứng chỉ VSTEP và quy trình gia hạn (nếu có).',
      category: 'vstep-overview',
      slug: '/blog/vstep-overview/gia-tri-chung-chi-vstep',
      author: 'Admin VSTEPRO',
      date: '2024-07-10',
      views: 10800,
      tags: ['Chứng chỉ', 'Hiệu lực', 'FAQ'],
      readTime: '6 phút',
      level: 'All',
      roleVisibility: ['all', 'student', 'about-us'],
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80'
    },
    {
      id: 37,
      title: 'Kinh nghiệm thi VSTEP đạt 4.5/5.0 từ học viên',
      description: 'Chia sẻ kinh nghiệm thực tế, lộ trình ôn tập, và tips thi từ học viên đã đạt điểm cao.',
      category: 'news',
      slug: '/blog/news/kinh-nghiem-thi-vstep-45',
      author: 'Nguyễn Văn A',
      date: '2024-07-15',
      views: 18200,
      tags: ['Kinh nghiệm', 'Success Story', 'Tips'],
      readTime: '14 phút',
      level: 'All',
      roleVisibility: ['all', 'student', 'about-us'],
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80'
    },
    {
      id: 38,
      title: 'Tải về: Vocabulary list VSTEP theo chủ đề (3000+ từ)',
      description: 'Bộ từ vựng VSTEP đầy đủ phân loại theo 50 chủ đề thường gặp, có audio phát âm chuẩn.',
      category: 'study-materials',
      slug: '/blog/study-materials/vocabulary-list-3000-tu',
      author: 'Upload Team',
      date: '2024-07-20',
      views: 26700,
      tags: ['Vocabulary', 'List', 'Download', 'Audio'],
      readTime: '5 phút',
      level: 'All',
      roleVisibility: ['all', 'student', 'uploader'],
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80'
    },
    {
      id: 39,
      title: 'VSTEP vs Cambridge: Sự khác biệt và lựa chọn phù hợp',
      description: 'So sánh chi tiết giữa VSTEP và các chứng chỉ Cambridge (KET, PET, FCE, CAE) về cấu trúc và độ khó.',
      category: 'vstep-overview',
      slug: '/blog/vstep-overview/vstep-vs-cambridge',
      author: 'Chuyên Gia VSTEPRO',
      date: '2024-07-25',
      views: 9600,
      tags: ['So sánh', 'VSTEP', 'Cambridge'],
      readTime: '12 phút',
      level: 'All',
      roleVisibility: ['all', 'student', 'teacher', 'about-us'],
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80'
    },
    {
      id: 40,
      title: 'Cách sử dụng VSTEPRO Platform hiệu quả cho học viên',
      description: 'Hướng dẫn sử dụng đầy đủ các tính năng của VSTEPRO: Practice, Mock Test, AI Grading, Dashboard.',
      category: 'news',
      slug: '/blog/news/huong-dan-su-dung-vstepro',
      author: 'Admin VSTEPRO',
      date: '2024-08-01',
      views: 7800,
      tags: ['Hướng dẫn', 'Platform', 'Tutorial'],
      readTime: '18 phút',
      level: 'All',
      roleVisibility: ['all', 'student', 'about-us'],
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80'
    },
    {
      id: 41,
      title: 'Tâm lý thi VSTEP: Cách giữ bình tĩnh và tự tin trong phòng thi',
      description: 'Kỹ thuật quản lý căng thẳng, mindset tích cực, và cách chuẩn bị tinh thần cho kỳ thi VSTEP.',
      category: 'study-materials',
      slug: '/blog/study-materials/tam-ly-thi-vstep',
      author: 'Cô Hương Giang',
      date: '2024-08-05',
      views: 6500,
      tags: ['Tâm lý', 'Mindset', 'Preparation'],
      readTime: '10 phút',
      level: 'All',
      roleVisibility: ['all', 'student'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
    },
    {
      id: 42,
      title: 'Cập nhật: Thay đổi mới nhất trong format thi VSTEP 2024',
      description: 'Những thay đổi chính thức trong cấu trúc đề thi VSTEP năm 2024 từ Bộ Giáo dục.',
      category: 'news',
      slug: '/blog/news/thay-doi-format-vstep-2024',
      author: 'Ban Quản Trị',
      date: '2024-08-10',
      views: 23400,
      tags: ['Tin tức', 'Update', '2024', 'Format'],
      readTime: '8 phút',
      level: 'All',
      roleVisibility: ['all', 'student', 'teacher', 'admin', 'about-us'],
      image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80'
    }
  ];

  // Filter posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesRole = selectedRole === 'all' || post.roleVisibility.includes(selectedRole);
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesRole && matchesSearch;
  });

  // Get featured posts (top 3)
  const featuredPosts = blogPosts.filter(post => post.isFeatured).slice(0, 3);

  const handleBlogClick = (post: BlogPost) => {
    alert(`Chức năng xem chi tiết blog sẽ được phát triển.\n\nBài viết: ${post.title}\nURL: ${post.slug}`);
  };

  const getRoleColor = (roleId: string) => {
    const role = roleFilters.find(r => r.id === roleId);
    return role?.color || 'gray';
  };

  const getRoleButtonClass = (roleId: string) => {
    const isActive = selectedRole === roleId;
    const baseClass = 'px-4 py-2 rounded-lg transition-all';
    
    if (roleId === 'all') {
      return `${baseClass} ${isActive ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`;
    } else if (roleId === 'student') {
      return `${baseClass} ${isActive ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`;
    } else if (roleId === 'teacher') {
      return `${baseClass} ${isActive ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`;
    } else if (roleId === 'admin') {
      return `${baseClass} ${isActive ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'}`;
    } else if (roleId === 'uploader') {
      return `${baseClass} ${isActive ? 'bg-yellow-600 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'}`;
    } else if (roleId === 'about-us') {
      return `${baseClass} ${isActive ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`;
    }
    return baseClass;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-[1360px] mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="size-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-gray-900">Blog VSTEP</h1>
              <p className="text-gray-600 mt-1">Kiến thức, Kinh nghiệm & Tài liệu luyện thi VSTEP</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="size-8 text-blue-600" />
            <div className="text-right">
              <div className="text-blue-600">Tổng số</div>
              <div className="text-gray-900">{blogPosts.length} bài viết</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1360px] mx-auto px-8 py-8">
        {/* Featured Posts */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="size-6 text-orange-500" />
            <h2 className="text-gray-900">Bài viết nổi bật</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => handleBlogClick(post)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Star className="size-3" fill="white" />
                    Nổi bật
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="size-4" />
                    <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
                    <span>•</span>
                    <Eye className="size-4" />
                    <span>{post.views.toLocaleString()}</span>
                  </div>
                  <h3 className="text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="size-4" />
                      {post.readTime}
                    </span>
                    {post.level && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {post.level}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết theo tiêu đề, nội dung, hoặc tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="size-5 text-gray-600" />
            <h3 className="text-gray-900">Lọc theo vai trò</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {roleFilters.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id as RoleFilter)}
                className={getRoleButtonClass(role.id)}
              >
                {role.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="size-5 text-gray-600" />
            <h3 className="text-gray-900">Danh mục</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as Category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="size-4" />
                  {category.name}
                  {category.isCritical && !isActive && (
                    <span className="ml-1 text-orange-500">★</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">
              {selectedCategory === 'all' ? 'Tất cả bài viết' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <div className="text-gray-600">
              {filteredPosts.length} bài viết
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="size-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Không tìm thấy bài viết nào</p>
              <p className="text-gray-400 mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handleBlogClick(post)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    {post.level && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                        {post.level}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="size-4" />
                      <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
                      <span>•</span>
                      <Eye className="size-4" />
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                    <h3 className="text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {post.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="size-4" />
                        {post.readTime}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <User className="size-4" />
                        {post.author}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
