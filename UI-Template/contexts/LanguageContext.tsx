import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('vstep_language');
    return (saved === 'en' ? 'en' : 'vi') as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vstep_language', lang);
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('vstep-language-changed', { detail: lang }));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

// Translations
const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Top Bar
    'topbar.support': 'Hỗ trợ',
    'topbar.community': 'Cộng đồng',
    'topbar.app': 'Ứng dụng',
    'topbar.vietnamese': 'Tiếng Việt',
    'topbar.english': 'English',
    
    // Header
    'header.home': 'Trang chủ',
    'header.aiGrading': 'Chấm AI',
    'header.assignments': 'Bài tập đã giao',
    'header.documents': 'Tài liệu',
    'header.statistics': 'Thống kê',
    'header.history': 'Lịch sử',
    'header.blog': 'Blog',
    'header.messages': 'Tin nhắn',
    'header.notifications': 'Thông báo',
    'header.profile': 'Hồ sơ',
    'header.fullscreen': 'Chế độ toàn màn hình',
    'header.exitFullscreen': 'Thoát chế độ toàn màn hình',
    
    // Sidebar
    'sidebar.practice': 'Luyện tập',
    'sidebar.reading': 'Reading',
    'sidebar.listening': 'Listening',
    'sidebar.writing': 'Writing',
    'sidebar.speaking': 'Speaking',
    'sidebar.exam': 'Thi thử',
    'sidebar.virtualExam': 'Phòng thi ảo',
    'sidebar.mockExam': 'Thi thử nhanh',
    'sidebar.tools': 'Công cụ',
    'sidebar.aiAssistant': 'Trợ lý AI',
    'sidebar.aiGrading': 'Chấm AI',
    'sidebar.documents': 'Tài liệu',
    'sidebar.goals': 'Mục tiêu',
    'sidebar.progress': 'Tiến độ',
    'sidebar.statistics': 'Thống kê',
    'sidebar.history': 'Lịch sử',
    'sidebar.resources': 'Tài nguyên',
    'sidebar.blog': 'Blog',
    'sidebar.examGuide': 'Hướng dẫn thi',
    'sidebar.account': 'Tài khoản',
    'sidebar.profile': 'Hồ sơ',
    'sidebar.settings': 'Cài đặt',
    'sidebar.logout': 'Đăng xuất',
    
    // Practice Home
    'practice.title': 'Luyện thi VSTEP',
    'practice.subtitle': 'Chọn kỹ năng để bắt đầu luyện tập',
    'practice.greeting.morning': 'Chào buổi sáng',
    'practice.greeting.afternoon': 'Chào buổi chiều',
    'practice.greeting.evening': 'Chào buổi tối',
    'practice.continue': 'Tiếp tục học',
    'practice.viewStats': 'Xem thống kê',
    'practice.skillsTitle': 'Chọn kỹ năng luyện tập',
    'practice.examTitle': 'Thi thử',
    'practice.toolsTitle': 'Công cụ hỗ trợ',
    'practice.resourcesTitle': 'Tài nguyên học tập',
    'practice.searchPlaceholder': 'Tìm kiếm bài tập, chủ đề...',
    'practice.recentSearches': 'Tìm kiếm gần đây',
    'practice.popularTopics': 'Chủ đề phổ biến',
    'practice.progress': 'Tiến độ',
    'practice.completed': 'đã hoàn thành',
    'practice.exercises': 'bài tập',
    'practice.learningGoal': 'Mục tiêu học tập',
    'practice.weeksRemaining': 'tuần còn lại',
    'practice.onTrack': 'Đang đúng tiến độ',
    'practice.needsAttention': 'Cần chú ý',
    'practice.excellent': 'Xuất sắc',
    'practice.viewRoadmap': 'Xem lộ trình',
    'practice.setGoal': 'Đặt mục tiêu',
    'practice.quickAccess': 'Truy cập nhanh',
    'practice.recentActivity': 'Hoạt động gần đây',
    'practice.streak': 'chuỗi ngày học',
    'practice.days': 'ngày',
    'practice.keepItUp': 'Tiếp tục phát huy!',
    'practice.blogTitle': 'Bài viết mới nhất',
    'practice.views': 'lượt xem',
    'practice.likes': 'thích',
    'practice.readMore': 'Đọc tiếp',
    'practice.minutes': 'phút đọc',
    'practice.allPosts': 'Xem tất cả bài viết',
    
    // Skills
    'skill.reading': 'Reading',
    'skill.listening': 'Listening',
    'skill.writing': 'Writing',
    'skill.speaking': 'Speaking',
    'skill.readingDesc': 'Luyện đọc hiểu',
    'skill.listeningDesc': 'Luyện nghe hiểu',
    'skill.writingDesc': 'Luyện viết',
    'skill.speakingDesc': 'Luyện nói',
    
    // Exam types
    'exam.fullTest': 'Thi thử 4 kỹ năng',
    'exam.fullTestDesc': 'Môi trường thi thật',
    'exam.virtualExam': 'Phòng thi ảo',
    'exam.virtualExamDesc': 'Thi thử có giám sát',
    'exam.mockExam': 'Thi thử Random',
    'exam.mockExamDesc': 'Bắt đầu ngay',
    
    // Tools
    'tools.aiAssistant': 'Trợ lý AI',
    'tools.aiAssistantDesc': 'Hỏi đáp với AI',
    'tools.aiGrading': 'Chấm AI',
    'tools.aiGradingDesc': 'Chấm Writing/Speaking',
    
    // Resources
    'resources.documents': 'Tài liệu học tập',
    'resources.documentsDesc': 'Tài liệu và bài giảng',
    'resources.assignments': 'Bài tập đã giao',
    'resources.assignmentsDesc': 'Từ giáo viên',
    'resources.examGuide': 'Hướng dẫn đăng ký thi',
    'resources.examGuideDesc': 'Chi tiết từng bước',
    
    // Mode Selection
    'mode.title': 'Chọn chế độ luyện tập',
    'mode.part': 'Làm theo phần',
    'mode.partDesc': 'Luyện từng Part riêng biệt',
    'mode.fullTest': 'Làm bộ đề đầy đủ',
    'mode.fullTestDesc': 'Làm tất cả các Part',
    'mode.cancel': 'Hủy',
    
    // Part Selection
    'part.title': 'Chọn phần luyện tập',
    'part.cancel': 'Hủy',
    'part.reading1': 'Part 1: Gap-fill',
    'part.reading2': 'Part 2: Matching',
    'part.reading3': 'Part 3: Multiple Choice',
    'part.listening1': 'Part 1: Short Conversations',
    'part.listening2': 'Part 2: Longer Conversations',
    'part.listening3': 'Part 3: Talks/Lectures',
    'part.writing1': 'Part 1: Email/Letter (150+ words)',
    'part.writing2': 'Part 2: Essay (250+ words)',
    'part.speaking1': 'Part 1: Social Interaction',
    'part.speaking2': 'Part 2: Solution Discussion',
    'part.speaking3': 'Part 3: Topic Development',
    
    // Statistics
    'stats.title': 'Thống kê học tập',
    'stats.overview': 'Tổng quan',
    'stats.totalTime': 'Tổng thời gian học',
    'stats.completed': 'Bài hoàn thành',
    'stats.avgScore': 'Điểm trung bình',
    'stats.streak': 'Chuỗi ngày học',
    'stats.back': 'Quay lại',
    
    // History
    'history.title': 'Lịch sử luyện tập',
    'history.recent': 'Gần đây',
    'history.all': 'Tất cả',
    'history.reading': 'Reading',
    'history.listening': 'Listening',
    'history.writing': 'Writing',
    'history.speaking': 'Speaking',
    'history.back': 'Quay lại',
    
    // Profile
    'profile.title': 'Hồ sơ cá nhân',
    'profile.info': 'Thông tin',
    'profile.settings': 'Cài đặt',
    'profile.achievements': 'Thành tích',
    'profile.logout': 'Đăng xuất',
    'profile.back': 'Quay lại',
    
    // Common
    'common.save': 'Lưu',
    'common.cancel': 'Hủy',
    'common.edit': 'Sửa',
    'common.delete': 'Xóa',
    'common.close': 'Đóng',
    'common.back': 'Quay lại',
    'common.next': 'Tiếp theo',
    'common.previous': 'Trước',
    'common.submit': 'Nộp bài',
    'common.start': 'Bắt đầu',
    'common.continue': 'Tiếp tục',
    'common.pause': 'Tạm dừng',
    'common.resume': 'Tiếp tục',
    'common.finish': 'Hoàn thành',
    'common.loading': 'Đang tải...',
    'common.error': 'Có lỗi xảy ra',
    'common.success': 'Thành công',
    'common.confirm': 'Xác nhận',
    'common.search': 'Tìm kiếm',
    'common.filter': 'Lọc',
    'common.sort': 'Sắp xếp',
    'common.download': 'Tải xuống',
    'common.upload': 'Tải lên',
    'common.share': 'Chia sẻ',
    'common.copy': 'Sao chép',
    'common.print': 'In',
  },
  en: {
    // Top Bar
    'topbar.support': 'Support',
    'topbar.community': 'Community',
    'topbar.app': 'App',
    'topbar.vietnamese': 'Tiếng Việt',
    'topbar.english': 'English',
    
    // Header
    'header.home': 'Home',
    'header.aiGrading': 'AI Grading',
    'header.assignments': 'Assignments',
    'header.documents': 'Documents',
    'header.statistics': 'Statistics',
    'header.history': 'History',
    'header.blog': 'Blog',
    'header.messages': 'Messages',
    'header.notifications': 'Notifications',
    'header.profile': 'Profile',
    'header.fullscreen': 'Fullscreen mode',
    'header.exitFullscreen': 'Exit fullscreen',
    
    // Sidebar
    'sidebar.practice': 'Practice',
    'sidebar.reading': 'Reading',
    'sidebar.listening': 'Listening',
    'sidebar.writing': 'Writing',
    'sidebar.speaking': 'Speaking',
    'sidebar.exam': 'Mock Exam',
    'sidebar.virtualExam': 'Virtual Exam',
    'sidebar.mockExam': 'Quick Test',
    'sidebar.tools': 'Tools',
    'sidebar.aiAssistant': 'AI Assistant',
    'sidebar.aiGrading': 'AI Grading',
    'sidebar.documents': 'Documents',
    'sidebar.goals': 'Goals',
    'sidebar.progress': 'Progress',
    'sidebar.statistics': 'Statistics',
    'sidebar.history': 'History',
    'sidebar.resources': 'Resources',
    'sidebar.blog': 'Blog',
    'sidebar.examGuide': 'Exam Guide',
    'sidebar.account': 'Account',
    'sidebar.profile': 'Profile',
    'sidebar.settings': 'Settings',
    'sidebar.logout': 'Logout',
    
    // Practice Home
    'practice.title': 'VSTEP Practice',
    'practice.subtitle': 'Choose a skill to start practicing',
    'practice.greeting.morning': 'Good morning',
    'practice.greeting.afternoon': 'Good afternoon',
    'practice.greeting.evening': 'Good evening',
    'practice.continue': 'Continue learning',
    'practice.viewStats': 'View statistics',
    'practice.skillsTitle': 'Choose a skill to practice',
    'practice.examTitle': 'Mock Exam',
    'practice.toolsTitle': 'Supporting Tools',
    'practice.resourcesTitle': 'Learning Resources',
    'practice.searchPlaceholder': 'Search for exercises, topics...',
    'practice.recentSearches': 'Recent searches',
    'practice.popularTopics': 'Popular topics',
    'practice.progress': 'Progress',
    'practice.completed': 'completed',
    'practice.exercises': 'exercises',
    'practice.learningGoal': 'Learning goal',
    'practice.weeksRemaining': 'weeks remaining',
    'practice.onTrack': 'On track',
    'practice.needsAttention': 'Needs attention',
    'practice.excellent': 'Excellent',
    'practice.viewRoadmap': 'View roadmap',
    'practice.setGoal': 'Set goal',
    'practice.quickAccess': 'Quick access',
    'practice.recentActivity': 'Recent activity',
    'practice.streak': 'day streak',
    'practice.days': 'days',
    'practice.keepItUp': 'Keep it up!',
    'practice.blogTitle': 'Latest posts',
    'practice.views': 'views',
    'practice.likes': 'likes',
    'practice.readMore': 'Read more',
    'practice.minutes': 'reading minutes',
    'practice.allPosts': 'View all posts',
    
    // Skills
    'skill.reading': 'Reading',
    'skill.listening': 'Listening',
    'skill.writing': 'Writing',
    'skill.speaking': 'Speaking',
    'skill.readingDesc': 'Practice reading comprehension',
    'skill.listeningDesc': 'Practice listening comprehension',
    'skill.writingDesc': 'Practice writing',
    'skill.speakingDesc': 'Practice speaking',
    
    // Exam types
    'exam.fullTest': 'Full 4-skill test',
    'exam.fullTestDesc': 'Real exam environment',
    'exam.virtualExam': 'Virtual Exam',
    'exam.virtualExamDesc': 'Supervised test',
    'exam.mockExam': 'Quick Test',
    'exam.mockExamDesc': 'Start now',
    
    // Tools
    'tools.aiAssistant': 'AI Assistant',
    'tools.aiAssistantDesc': 'Q&A with AI',
    'tools.aiGrading': 'AI Grading',
    'tools.aiGradingDesc': 'Grade Writing/Speaking',
    
    // Resources
    'resources.documents': 'Learning Materials',
    'resources.documentsDesc': 'Documents and lectures',
    'resources.assignments': 'Assignments',
    'resources.assignmentsDesc': 'Tasks from teacher',
    'resources.examGuide': 'Exam Registration Guide',
    'resources.examGuideDesc': 'Detailed instructions',
    
    // Mode Selection
    'mode.title': 'Choose practice mode',
    'mode.part': 'Practice by Part',
    'mode.partDesc': 'Practice each Part separately',
    'mode.fullTest': 'Full Test',
    'mode.fullTestDesc': 'Practice all Parts',
    'mode.cancel': 'Cancel',
    
    // Part Selection
    'part.title': 'Choose practice part',
    'part.cancel': 'Cancel',
    'part.reading1': 'Part 1: Gap-fill',
    'part.reading2': 'Part 2: Matching',
    'part.reading3': 'Part 3: Multiple Choice',
    'part.listening1': 'Part 1: Short Conversations',
    'part.listening2': 'Part 2: Longer Conversations',
    'part.listening3': 'Part 3: Talks/Lectures',
    'part.writing1': 'Part 1: Email/Letter (150+ words)',
    'part.writing2': 'Part 2: Essay (250+ words)',
    'part.speaking1': 'Part 1: Social Interaction',
    'part.speaking2': 'Part 2: Solution Discussion',
    'part.speaking3': 'Part 3: Topic Development',
    
    // Statistics
    'stats.title': 'Learning Statistics',
    'stats.overview': 'Overview',
    'stats.totalTime': 'Total study time',
    'stats.completed': 'Completed',
    'stats.avgScore': 'Average score',
    'stats.streak': 'Day streak',
    'stats.back': 'Back',
    
    // History
    'history.title': 'Practice History',
    'history.recent': 'Recent',
    'history.all': 'All',
    'history.reading': 'Reading',
    'history.listening': 'Listening',
    'history.writing': 'Writing',
    'history.speaking': 'Speaking',
    'history.back': 'Back',
    
    // Profile
    'profile.title': 'Profile',
    'profile.info': 'Information',
    'profile.settings': 'Settings',
    'profile.achievements': 'Achievements',
    'profile.logout': 'Logout',
    'profile.back': 'Back',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.start': 'Start',
    'common.continue': 'Continue',
    'common.pause': 'Pause',
    'common.resume': 'Resume',
    'common.finish': 'Finish',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.share': 'Share',
    'common.copy': 'Copy',
    'common.print': 'Print',
  }
};