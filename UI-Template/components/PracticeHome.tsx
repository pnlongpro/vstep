import { Book, Headphones, PenTool, Mic, ChevronRight, TrendingUp, Clock, Award, GraduationCap, FileText, ListChecks, X, Monitor, Bot, Sparkles, Search, History, TrendingUpIcon, BookOpen, ClipboardList } from 'lucide-react';
import { useState, useEffect } from 'react';
import { NotificationsPanel } from './NotificationsPanel';
import { LearningRoadmap } from './student/LearningRoadmap';

interface PracticeHomeProps {
  onSelectSkill: (skill: 'reading' | 'listening' | 'writing' | 'speaking' | 'exam' | 'virtual-exam' | 'mock-exam' | 'ai-assistant' | 'documents' | 'exam-registration') => void;
  onSelectMode: (mode: 'part' | 'fulltest') => void;
  onSelectFullTest: (skill: 'reading' | 'listening' | 'writing' | 'speaking') => void;
  onSelectPartMode: (skill: 'reading' | 'listening' | 'writing' | 'speaking') => void;
}

export function PracticeHome({ onSelectSkill, onSelectMode, onSelectFullTest, onSelectPartMode }: PracticeHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('vstep_recent_searches');
    return saved ? JSON.parse(saved) : [];
  });

  // Handler to continue last lesson
  const handleContinueLearning = () => {
    // Get last incomplete exercise from localStorage
    const lastExercise = localStorage.getItem('vstep_last_exercise');
    if (lastExercise) {
      const { skill, part } = JSON.parse(lastExercise);
      onSelectSkill(skill);
    } else {
      // Default to reading if no last exercise
      onSelectSkill('reading');
    }
  };

  // Handler to navigate to statistics
  const handleViewStats = () => {
    // This should navigate to statistics page
    // We'll need to add this navigation in App.tsx
    window.dispatchEvent(new CustomEvent('navigate-to-statistics'));
  };

  // Handler to view learning roadmap
  const handleViewGoal = () => {
    // Navigate to learning roadmap
    setShowRoadmapModal(true);
  };

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Remove Vietnamese diacritics for better search
  const removeDiacritics = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  const handleSkillClick = (skill: any) => {
    console.log('PracticeHome - handleSkillClick:', skill.id);
    // Gọi callback với skill id
    onSelectSkill(skill.id);
  };

  const handlePartModeClick = (skill: any) => {
    console.log('PracticeHome - handlePartModeClick:', skill.id);
    // Gọi callback onSelectPartMode để mở PartSelectionModal luôn
    onSelectPartMode(skill.id);
  };

  // Mock exercises data for global search
  const allExercises = [
    // Reading
    { id: 1, title: 'Bài tập 1: Môi trường và biến đổi khí hậu', level: 'B1', skill: 'reading', skillName: 'Đọc hiểu', part: 1 },
    { id: 2, title: 'Bài tập 2: Công nghệ và xã hội hiện đại', level: 'B2', skill: 'reading', skillName: 'Đọc hiểu', part: 1 },
    { id: 3, title: 'Bài tập 3: Giáo dục và phát triển', level: 'B1', skill: 'reading', skillName: 'Đọc hiểu', part: 1 },
    { id: 4, title: 'Bài tập 4: Văn hóa và truyền thống', level: 'C1', skill: 'reading', skillName: 'Đọc hiểu', part: 2 },
    { id: 5, title: 'Bài tập 5: Kinh tế và thương mại', level: 'B2', skill: 'reading', skillName: 'Đọc hiểu', part: 2 },
    { id: 6, title: 'Bài tập 6: Sức khỏe và lối sống', level: 'A2', skill: 'reading', skillName: 'Đọc hiểu', part: 3 },
    { id: 7, title: 'Bài tập 7: Du lịch và khám phá', level: 'B1', skill: 'reading', skillName: 'Đọc hiểu', part: 3 },
    { id: 8, title: 'Bài tập 8: Nghệ thuật và giải trí', level: 'B2', skill: 'reading', skillName: 'Đọc hiểu', part: 4 },
    // Listening
    { id: 11, title: 'Bài tập 1: Hội thoại gia đình', level: 'B1', skill: 'listening', skillName: 'Nghe hiểu', part: 1 },
    { id: 12, title: 'Bài tập 2: Hội thoại mua sắm', level: 'A2', skill: 'listening', skillName: 'Nghe hiểu', part: 1 },
    { id: 13, title: 'Bài tập 3: Hội thoại công việc', level: 'B2', skill: 'listening', skillName: 'Nghe hiểu', part: 2 },
    { id: 14, title: 'Bài tập 4: Hội thoại học tập', level: 'B1', skill: 'listening', skillName: 'Nghe hiểu', part: 2 },
    { id: 15, title: 'Bài tập 5: Bài giảng khoa học', level: 'C1', skill: 'listening', skillName: 'Nghe hiểu', part: 3 },
    { id: 16, title: 'Bài tập 6: Bài giảng lịch sử', level: 'B2', skill: 'listening', skillName: 'Nghe hiểu', part: 3 },
    // Writing
    { id: 21, title: 'Bài tập 1: Viết email xin việc', level: 'B1', skill: 'writing', skillName: 'Viết', part: 1 },
    { id: 22, title: 'Bài tập 2: Viết thư phàn nàn', level: 'B2', skill: 'writing', skillName: 'Viết', part: 1 },
    { id: 23, title: 'Bài tập 3: Luận về giáo dục', level: 'B2', skill: 'writing', skillName: 'Viết', part: 2 },
    { id: 24, title: 'Bài tập 4: Luận về công nghệ', level: 'C1', skill: 'writing', skillName: 'Viết', part: 2 },
    // Speaking
    { id: 31, title: 'Bài tập 1: Giới thiệu bản thân', level: 'B1', skill: 'speaking', skillName: 'Nói', part: 1 },
    { id: 32, title: 'Bài tập 2: Nói về sở thích', level: 'A2', skill: 'speaking', skillName: 'Nói', part: 1 },
    { id: 33, title: 'Bài tập 3: Diễn thuyết về môi trường', level: 'B2', skill: 'speaking', skillName: 'Nói', part: 2 },
    { id: 34, title: 'Bài tập 4: Diễn thuyết về du lịch', level: 'B1', skill: 'speaking', skillName: 'Nói', part: 2 },
    { id: 35, title: 'Bài tập 5: Thảo luận văn hóa', level: 'C1', skill: 'speaking', skillName: 'Nói', part: 3 },
    { id: 36, title: 'Bài tập 6: Thảo luận xã hội', level: 'B2', skill: 'speaking', skillName: 'Nói', part: 3 },
  ];

  const skills = [
    {
      id: 'reading' as const,
      name: 'Đọc hiểu',
      nameVi: 'Đọc hiểu',
      icon: Book,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      description: 'Luyện kỹ năng đọc hiểu với các dạng bài đa dạng',
      tasks: [
        { name: 'Trắc nghiệm', icon: '📝' },
        { name: 'Điền từ', icon: '✍️' },
        { name: 'Nối câu', icon: '🔗' },
      ],
      completed: 45,
      total: 120,
    },
    {
      id: 'listening' as const,
      name: 'Nghe hiểu',
      nameVi: 'Nghe hiểu',
      icon: Headphones,
      color: 'from-emerald-400 to-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      description: 'Rèn luyện khả năng nghe và hiểu tiếng Anh',
      tasks: [
        { name: 'Hội thoại', icon: '💬' },
        { name: 'Bài giảng', icon: '🎓' },
        { name: 'Thuyết trình', icon: '🎤' },
      ],
      completed: 32,
      total: 100,
    },
    {
      id: 'writing' as const,
      name: 'Viết',
      nameVi: 'Viết',
      icon: PenTool,
      color: 'from-violet-400 to-violet-500',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
      borderColor: 'border-violet-200',
      description: 'Phát triển kỹ năng viết học thuật và thực hành',
      tasks: [
        { name: 'Email/Thư', icon: '✉️' },
        { name: 'Bài luận', icon: '📄' },
        { name: 'Biểu đồ', icon: '📊' },
      ],
      completed: 18,
      total: 60,
    },
    {
      id: 'speaking' as const,
      name: 'Nói',
      nameVi: 'Nói',
      icon: Mic,
      color: 'from-amber-400 to-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      description: 'Luyện phát âm và giao tiếp tự tin',
      tasks: [
        { name: 'Câu hỏi cá nhân', icon: '👤' },
        { name: 'Nói dài', icon: '🗣️' },
        { name: 'Thảo luận', icon: '💭' },
      ],
      completed: 12,
      total: 80,
    },
    {
      id: 'exam' as const,
      name: 'Thi thử',
      nameVi: 'Thi thử',
      icon: GraduationCap,
      color: 'from-rose-400 to-rose-500',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
      borderColor: 'border-rose-200',
      description: 'Mô phỏng đề thi VSTEP chính thức',
      tasks: [{ name: 'Bài thi đầy đủ', icon: '📋' }],
      completed: 0,
      total: 1,
    },
    {
      id: 'virtual-exam' as const,
      name: 'Virtual Exam',
      nameVi: 'Hướng dẫn thi VSTEP',
      icon: Monitor,
      color: 'from-indigo-400 to-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-200',
      description: 'Làm quen với quy trình thi thực tế',
      tasks: [
        { name: 'Kiểm tra thiết bị', icon: '🖥️' },
        { name: 'Giám sát webcam', icon: '📹' },
      ],
      completed: 0,
      total: 1,
    },
    {
      id: 'mock-exam' as const,
      name: 'Mock Exam',
      nameVi: 'Thi thử Random',
      icon: FileText,
      color: 'from-gray-400 to-gray-500',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-200',
      description: 'Random đề từ từng kỹ năng riêng biệt',
      tasks: [
        { name: 'Thi thử với đề random', icon: '🎲' },
      ],
      completed: 0,
      total: 1,
    },
    {
      id: 'ai-assistant' as const,
      name: 'Trợ lý VSTEP AI',
      nameVi: 'Trợ lý VSTEP AI',
      icon: Bot,
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-gradient-to-r from-blue-50 to-purple-50',
      textColor: 'text-blue-600',
      borderColor: 'border-purple-200',
      description: 'Trợ lý AI hỗ trợ học tập 24/7',
      tasks: [
        { name: 'Chấm bài', icon: '✅' },
        { name: 'Tạo đề', icon: '📝' },
        { name: 'Giải thích', icon: '💡' },
        { name: 'Tư vấn', icon: '🎯' },
      ],
      completed: 0,
      total: 1,
    },
    {
      id: 'documents' as const,
      name: 'Documents',
      nameVi: 'Tài liệu học tập',
      icon: BookOpen,
      color: 'from-gray-400 to-gray-500',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-200',
      description: 'Truy cập tài liệu học tập và tài liệu tham khảo',
      tasks: [
        { name: 'Tài liệu học tập', icon: '📚' },
        { name: 'Tài liệu tham khảo', icon: '🔍' },
      ],
      completed: 0,
      total: 1,
    },
    {
      id: 'exam-registration' as const,
      name: 'Registration Guide',
      nameVi: 'Hướng dẫn đăng kí thi',
      icon: ClipboardList,
      color: 'from-teal-400 to-cyan-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      borderColor: 'border-teal-200',
      description: 'Hướng dẫn chi tiết quy trình đăng kí thi VSTEP',
      tasks: [
        { name: 'Chuẩn bị hồ sơ', icon: '📋' },
        { name: 'Đăng kí online', icon: '💻' },
        { name: 'Nộp lệ phí', icon: '💳' },
      ],
      completed: 0,
      total: 1,
    },
  ];

  const stats = [
    { label: 'Bài đã làm', value: '107', subtext: 'bài', icon: Award, color: 'text-blue-500', bg: 'bg-blue-500' },
    { label: 'Thời gian', value: '24', subtext: 'giờ', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { label: 'Điểm TB', value: '7.5', subtext: '/10', icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-500' },
    { label: 'Mục tiêu tháng', value: '85', subtext: '%', icon: TrendingUpIcon, color: 'text-amber-500', bg: 'bg-amber-500' },
  ];

  // Filter skills based on search query
  const filteredSkills = skills.filter((skill) => {
    if (!debouncedSearch.trim()) return true; // Nếu không có search query, hiển thị tất cả
    
    const searchNormalized = removeDiacritics(debouncedSearch.toLowerCase());
    const nameMatch = removeDiacritics(skill.nameVi.toLowerCase()).includes(searchNormalized);
    const nameEnMatch = removeDiacritics(skill.name.toLowerCase()).includes(searchNormalized);
    const descMatch = removeDiacritics(skill.description.toLowerCase()).includes(searchNormalized);
    const tasksMatch = skill.tasks.some(task => removeDiacritics(task.name.toLowerCase()).includes(searchNormalized));
    const idMatch = skill.id.toLowerCase().includes(searchNormalized);
    
    return nameMatch || nameEnMatch || descMatch || tasksMatch || idMatch;
  });

  // Separate practice skills and support tools
  const practiceSkills = filteredSkills.filter(s => 
    s.id === 'reading' || s.id === 'listening' || s.id === 'writing' || s.id === 'speaking'
  );
  
  const supportTools = filteredSkills.filter(s => 
    s.id === 'ai-assistant' || s.id === 'exam' || s.id === 'virtual-exam' || s.id === 'mock-exam' || s.id === 'documents' || s.id === 'exam-registration'
  );
  
  // Reorder support tools: AI Assistant first
  const sortedSupportTools = supportTools.sort((a, b) => {
    if (a.id === 'ai-assistant') return -1;
    if (b.id === 'ai-assistant') return 1;
    return 0;
  });

  // Filter exercises based on search query (for global search)
  const filteredExercises = allExercises.filter((exercise) => {
    if (!debouncedSearch.trim()) return false; // Chỉ hiển thị exercises khi có search query
    
    const searchNormalized = removeDiacritics(debouncedSearch.toLowerCase());
    const titleMatch = removeDiacritics(exercise.title.toLowerCase()).includes(searchNormalized);
    const levelMatch = exercise.level.toLowerCase().includes(searchNormalized);
    const skillMatch = removeDiacritics(exercise.skillName.toLowerCase()).includes(searchNormalized);
    
    return titleMatch || levelMatch || skillMatch;
  });

  // Update recent searches
  useEffect(() => {
    if (debouncedSearch.trim() && !recentSearches.includes(debouncedSearch)) {
      const newSearches = [debouncedSearch, ...recentSearches].slice(0, 5);
      setRecentSearches(newSearches);
      localStorage.setItem('vstep_recent_searches', JSON.stringify(newSearches));
    }
  }, [debouncedSearch, recentSearches]);

  // Popular searches (based on common topics)
  const popularSearches = [
    'Môi trường',
    'Công nghệ',
    'Giáo dục',
    'Du lịch',
    'Sức khỏe',
    'B1',
    'B2',
    'Reading',
  ];

  // Get autocomplete suggestions
  const getSuggestions = () => {
    if (!searchQuery.trim()) {
      // Hiển thị popular + recent khi chưa gõ gì
      const suggestions = [];
      if (recentSearches.length > 0) {
        suggestions.push({ type: 'recent', items: recentSearches });
      }
      suggestions.push({ type: 'popular', items: popularSearches.slice(0, 5) });
      return suggestions;
    }

    // Autocomplete từ exercises
    const searchNormalized = removeDiacritics(searchQuery.toLowerCase());
    const matchedTopics = new Set<string>();
    
    allExercises.forEach(ex => {
      const title = ex.title.toLowerCase();
      const words = title.split(':')[1]?.split(/\s+/) || [];
      words.forEach(word => {
        const normalized = removeDiacritics(word);
        if (normalized.includes(searchNormalized) && word.length > 2) {
          matchedTopics.add(word.charAt(0).toUpperCase() + word.slice(1));
        }
      });
    });

    const suggestions = [];
    const matchedArray = Array.from(matchedTopics).slice(0, 5);
    if (matchedArray.length > 0) {
      suggestions.push({ type: 'autocomplete', items: matchedArray });
    }

    return suggestions;
  };

  const suggestions = getSuggestions();

  // Helper function to highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return <span>{text}</span>;
    
    const searchNormalized = removeDiacritics(query.toLowerCase());
    const textNormalized = removeDiacritics(text.toLowerCase());
    const index = textNormalized.indexOf(searchNormalized);
    
    if (index === -1) return <span>{text}</span>;
    
    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);
    
    return (
      <span>
        {before}
        <span className="bg-yellow-200 text-gray-900 px-0.5 rounded">{match}</span>
        {after}
      </span>
    );
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Header - ONLY ON HOME PAGE - DO NOT REMOVE THIS COMMENT */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <h1 className="text-2xl md:text-3xl mb-2">🏠 Trang chủ - Chào mừng bạn quay lại!</h1>
        <p className="text-sm md:text-base text-white/90">Hãy chọn kỹ năng bạn muốn luyện tập hôm nay</p>
      </div>

      {/* Stats Section - Optimized for Mobile */}
      <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl p-4 md:p-8 text-white shadow-xl">
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 md:p-3 relative">
                {/* Debug marker - red dot */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex flex-col items-center text-center">
                  <div className="text-[18px] md:text-[20px] font-bold mb-[2px] text-white leading-tight">{stat.value}</div>
                  <div className="text-[11px] md:text-[12px] opacity-90 text-white leading-tight">{stat.subtext}</div>
                  <div className="text-[11px] md:text-[12px] opacity-75 mt-[2px] text-white leading-tight">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Learning Button */}
        <button className="w-full md:w-auto bg-white text-blue-600 px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-lg text-sm md:text-base" onClick={handleContinueLearning}>
          <ChevronRight className="size-4 md:size-5" />
          Tiếp tục bài đang học
        </button>
      </div>

      {/* Goal Progress */}
      <div 
        onClick={handleViewGoal}
        className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
              <TrendingUp className="size-5 md:size-6 text-white" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Mục tiêu: B1</h3>
              <p className="text-xs md:text-sm text-gray-600">45% hoàn thành</p>
            </div>
          </div>
          <ChevronRight className="size-4 md:size-5 text-gray-400" />
        </div>
        <div className="h-2.5 md:h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
            style={{ width: '45%' }}
          ></div>
        </div>
      </div>

      {/* Sticky Search Bar - Modern UI */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm -mx-4 md:-mx-6 px-4 md:px-6 py-3 md:py-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="size-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm kỹ năng, đề thi theo tên, cấp độ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#F5F7FA] border border-transparent rounded-2xl text-sm focus:outline-none focus:bg-white focus:border-[#3B82F6] focus:shadow-lg focus:shadow-blue-100 transition-all duration-200 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-6 right-6 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-30 overflow-hidden max-w-4xl mx-auto">
              {suggestions.map((suggestion, sectionIdx) => (
                <div key={sectionIdx} className={sectionIdx > 0 ? 'border-t border-gray-100' : ''}>
                  {/* Section Header */}
                  <div className="px-4 pt-3 pb-1">
                    <div className="flex items-center gap-2">
                      {suggestion.type === 'recent' && (
                        <>
                          <History className="size-4 text-gray-400" />
                          <span className="text-xs text-gray-500">Tìm kiếm gần đây</span>
                        </>
                      )}
                      {suggestion.type === 'popular' && (
                        <>
                          <TrendingUp className="size-4 text-blue-500" />
                          <span className="text-xs text-gray-500">Tìm kiếm phổ biến</span>
                        </>
                      )}
                      {suggestion.type === 'autocomplete' && (
                        <>
                          <Search className="size-4 text-green-500" />
                          <span className="text-xs text-gray-500">Gợi ý từ khóa</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Suggestion Items */}
                  <div className="pb-2">
                    {suggestion.items.map((item, itemIdx) => (
                      <button
                        key={itemIdx}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                        onClick={() => {
                          setSearchQuery(item);
                          setShowSuggestions(false);
                        }}
                      >
                        {suggestion.type === 'recent' && <History className="size-3.5 text-gray-400" />}
                        {suggestion.type === 'popular' && <TrendingUp className="size-3.5 text-blue-400" />}
                        {suggestion.type === 'autocomplete' && <Search className="size-3.5 text-green-400" />}
                        <span className="text-gray-700">
                          {suggestion.type === 'autocomplete' && searchQuery ? highlightText(item, searchQuery) : item}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Skills Grid - Practice Skills */}
      {practiceSkills.length > 0 && (
        <div>
          <h3 className="text-xl md:text-2xl mb-4 md:mb-6">Chọn kỹ năng luyện tập</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {practiceSkills.map((skill) => {
              const Icon = skill.icon;
              const progress = (skill.completed / skill.total) * 100;
              
              return (
                <div
                  key={skill.id}
                  className="group bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4 md:mb-5">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`bg-gradient-to-br ${skill.color} p-3 md:p-4 rounded-xl md:rounded-2xl text-white shadow-lg`}>
                        <Icon className="size-6 md:size-7" />
                      </div>
                      <div>
                        <h4 className="text-lg md:text-2xl mb-0.5 md:mb-1">{skill.nameVi}</h4>
                        <p className="text-xs md:text-sm text-gray-500">{skill.name}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-5">{skill.description}</p>

                  {/* Task Types with Icons */}
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-5">
                    {skill.tasks.map((task, index) => (
                      <span
                        key={index}
                        className={`text-[11px] md:text-xs px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl ${skill.bgColor} ${skill.textColor} flex items-center gap-1 md:gap-1.5`}
                      >
                        <span className="text-sm md:text-base">{task.icon}</span>
                        {task.name}
                      </span>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="space-y-1.5 md:space-y-2 mb-4 md:mb-5">
                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <span className="text-gray-600">Tiến độ</span>
                      <span className={skill.textColor}>
                        {skill.completed}/{skill.total} bài
                      </span>
                    </div>
                    <div className="h-2 md:h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${skill.color} transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 md:gap-3 pt-4 md:pt-5 border-t-2 border-gray-100">
                    <button
                      onClick={() => handlePartModeClick(skill)}
                      className={`px-3 md:px-5 py-2.5 md:py-3 rounded-lg md:rounded-xl border-2 ${skill.textColor} border-current hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2 group/btn`}
                    >
                      <ListChecks className="size-3.5 md:size-4 group-hover/btn:scale-110 transition-transform" />
                      <span className="hidden sm:inline">Làm theo phần</span>
                      <span className="sm:hidden">Theo phần</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFullTest(skill.id);
                      }}
                      className={`px-3 md:px-5 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r ${skill.color} text-white hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2 group/btn`}
                    >
                      <FileText className="size-3.5 md:size-4 group-hover/btn:scale-110 transition-transform" />
                      <span className="hidden sm:inline">Bộ đề đầy đủ</span>
                      <span className="sm:hidden">Đề đầy đủ</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Support Tools Section */}
      {sortedSupportTools.length > 0 && (
        <div>
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <Sparkles className="size-5 md:size-6 text-purple-600" />
            <h3 className="text-xl md:text-2xl">Công cụ hỗ trợ học tập</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {sortedSupportTools.map((skill) => {
              const Icon = skill.icon;
              const progress = (skill.completed / skill.total) * 100;
              
              // Special styling for AI Assistant
              const isAI = skill.id === 'ai-assistant';
              
              return (
                <button
                  key={skill.id}
                  onClick={() => handleSkillClick(skill)}
                  className={`group bg-white rounded-2xl md:rounded-3xl p-5 md:p-7 shadow-md hover:shadow-2xl transition-all duration-300 text-left border-2 ${
                    isAI ? 'border-purple-200 hover:border-purple-300 bg-gradient-to-br from-white to-purple-50' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex flex-col items-center text-center mb-4 md:mb-5">
                    <div className={`bg-gradient-to-br ${skill.color} p-4 md:p-5 rounded-xl md:rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform mb-3 md:mb-4`}>
                      <Icon className="size-7 md:size-8" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl mb-1.5 md:mb-2">{skill.nameVi}</h4>
                      {isAI && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-0.5 md:py-1 bg-purple-100 text-purple-700 text-[11px] md:text-xs rounded-full mb-2 md:mb-3">
                          <Sparkles className="size-3" />
                          Được đề xuất
                        </span>
                      )}
                      <p className="text-xs md:text-sm text-gray-500">{skill.name}</p>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-5 text-center">{skill.description}</p>

                  {/* Task Types with Icons */}
                  <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center">
                    {skill.tasks.map((task, index) => (
                      <span
                        key={index}
                        className={`text-[11px] md:text-xs px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl ${skill.bgColor} ${skill.textColor} flex items-center gap-1 md:gap-1.5`}
                      >
                        <span className="text-sm md:text-base">{task.icon}</span>
                        {task.name}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* No Results Message - Only show when searching and no results at all */}
      {debouncedSearch.trim() && filteredSkills.length === 0 && filteredExercises.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <Search className="size-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2 text-lg">Không tìm thấy kết quả nào</p>
          <p className="text-sm text-gray-400 mb-4">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xóa tìm kiếm
          </button>
        </div>
      )}

      {/* Search Results - Bài tập liên quan */}
      {filteredExercises.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Search className="size-5 text-blue-600" />
            <h3 className="text-xl">Bài tập liên quan ({filteredExercises.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((exercise) => {
              const skillStyles = {
                reading: { bg: 'bg-blue-50', border: 'border-blue-100', hoverBorder: 'hover:border-blue-200', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700', icon: Book },
                listening: { bg: 'bg-green-50', border: 'border-green-100', hoverBorder: 'hover:border-green-200', text: 'text-green-600', badge: 'bg-green-100 text-green-700', icon: Headphones },
                writing: { bg: 'bg-purple-50', border: 'border-purple-100', hoverBorder: 'hover:border-purple-200', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700', icon: PenTool },
                speaking: { bg: 'bg-orange-50', border: 'border-orange-100', hoverBorder: 'hover:border-orange-200', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700', icon: Mic },
              };
              
              const style = skillStyles[exercise.skill as keyof typeof skillStyles];
              const SkillIcon = style.icon;

              return (
                <div
                  key={exercise.id}
                  className={`p-4 rounded-xl border-2 hover:shadow-md transition-all cursor-pointer ${style.bg} ${style.border} ${style.hoverBorder}`}
                  onClick={() => {
                    // Navigate to skill page with part selection
                    onSelectSkill(exercise.skill as any);
                  }}
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <SkillIcon className={`size-4 ${style.text}`} />
                    <span className={`text-xs px-2 py-1 rounded ${style.badge}`}>
                      {exercise.skillName} • Part {exercise.part}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                      {exercise.level}
                    </span>
                  </div>
                  <p className="text-sm">{highlightText(exercise.title, debouncedSearch)}</p>
                  <p className="text-xs text-gray-500 mt-2">Click để vào kỹ năng này</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Learning Roadmap Modal */}
      {showRoadmapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
              <h3 className="text-2xl font-semibold text-gray-900">Lộ trình học tập</h3>
              <button
                onClick={() => setShowRoadmapModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>
            <div className="p-8">
              <LearningRoadmap />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}