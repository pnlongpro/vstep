import { useState } from 'react';
import { Home, Book, Headphones, PenTool, Mic, GraduationCap, Monitor, ChevronDown, ChevronRight, Menu, X, Facebook, FileText, Users, Heart, Mail, Bot, Sparkles, Target, LayoutDashboard, Bell, ClipboardList, User, MessageCircle } from 'lucide-react';
import logoImage from 'figma:asset/0a20b2e75c15f09d98fc24bd0f6b028b4eeb4661.png';

type Page = 'home' | 'reading' | 'listening' | 'writing' | 'speaking' | 'exam' | 'virtual-exam' | 'statistics' | 'history' | 'profile' | 'ai-assistant' | 'goals' | 'dashboard' | 'ai-grading' | 'notifications' | 'documents' | 'assignments';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onShowPartModal?: (skill: 'reading' | 'listening' | 'writing' | 'speaking') => void;
  onShowFullTestModal?: (skill: 'reading' | 'listening' | 'writing' | 'speaking') => void;
}

interface SkillSubmenuState {
  reading: boolean;
  listening: boolean;
  writing: boolean;
  speaking: boolean;
}

export function Sidebar({ currentPage, onNavigate, onShowPartModal, onShowFullTestModal }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false); // Ẩn mặc định
  const [expandedSkills, setExpandedSkills] = useState<SkillSubmenuState>({
    reading: false,
    listening: false,
    writing: false,
    speaking: false,
  });

  const toggleSkill = (skill: keyof SkillSubmenuState) => {
    setExpandedSkills(prev => ({
      ...prev,
      [skill]: !prev[skill]
    }));
  };

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleShowPartModal = (skill: 'reading' | 'listening' | 'writing' | 'speaking') => {
    if (onShowPartModal) {
      onShowPartModal(skill);
    }
  };

  const handleShowFullTestModal = (skill: 'reading' | 'listening' | 'writing' | 'speaking') => {
    if (onShowFullTestModal) {
      onShowFullTestModal(skill);
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
      >
        <Menu className="size-5" />
      </button>

      {/* Overlay - hiện trên tất cả kích thước màn hình */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`w-56 bg-gray-800 text-gray-100 h-screen flex flex-col fixed left-0 top-0 z-50 overflow-y-auto transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo Section */}
        <div className="p-4 bg-gray-900 border-b border-gray-700 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <img src={logoImage} alt="VSTEPRO" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <h2 className="text-white text-sm">VSTEPRO</h2>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-2">
          {/* Trang chủ */}
          <button
            onClick={() => handleNavigate('home')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
              currentPage === 'home'
                ? 'bg-gray-700 text-white border-l-4 border-blue-500'
                : 'text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-l-4 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20'
            }`}
          >
            <Home className="size-4 flex-shrink-0" />
            <span className="text-sm">Trang chủ</span>
          </button>

          {/* Học Reading */}
          <div>
            <button
              onClick={() => toggleSkill('reading')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                currentPage === 'reading'
                  ? 'bg-gray-700 text-white border-l-4 border-green-500'
                  : 'text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-l-4 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-500/20'
              }`}
            >
              <Book className="size-4 flex-shrink-0" />
              <span className="flex-1 text-left text-sm">Luyện tập Reading</span>
              {expandedSkills.reading ? (
                <ChevronDown className="size-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="size-4 flex-shrink-0" />
              )}
            </button>
            
            {/* Reading Submenu */}
            {expandedSkills.reading && (
              <div className="bg-gray-750">
                <button
                  onClick={() => handleShowPartModal('reading')}
                  className="w-full text-left px-10 py-2 text-sm text-gray-300 hover:bg-gray-700/80 hover:text-white hover:pl-11 transition-all duration-200"
                >
                  Luyện theo phần
                </button>
                <button
                  onClick={() => handleShowFullTestModal('reading')}
                  className="w-full text-left px-10 py-2 text-sm text-gray-300 hover:bg-gray-700/80 hover:text-white hover:pl-11 transition-all duration-200"
                >
                  Làm bộ đề đầy đủ
                </button>
                <button
                  onClick={() => handleNavigate('reading')}
                  className="w-full text-left px-10 py-2 text-sm text-gray-300 hover:bg-gray-700/80 hover:text-white hover:pl-11 transition-all duration-200"
                >
                  Mẹo học tập
                </button>
              </div>
            )}
          </div>

          {/* Học Listening */}
          <div>
            <button
              onClick={() => toggleSkill('listening')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                currentPage === 'listening'
                  ? 'bg-gray-700 text-white border-l-4 border-purple-500'
                  : 'text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-l-4 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20'
              }`}
            >
              <Headphones className="size-4 flex-shrink-0" />
              <span className="flex-1 text-left text-sm">Luyện tập Listening</span>
              {expandedSkills.listening ? (
                <ChevronDown className="size-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="size-4 flex-shrink-0" />
              )}
            </button>
            
            {/* Listening Submenu */}
            {expandedSkills.listening && (
              <div className="bg-gray-750">
                <button
                  onClick={() => handleShowPartModal('listening')}
                  className="w-full text-left px-10 py-2 text-sm text-gray-300 hover:bg-gray-700/80 hover:text-white hover:pl-11 transition-all duration-200"
                >
                  Luyện theo phần
                </button>
                <button
                  onClick={() => handleShowFullTestModal('listening')}
                  className="w-full text-left px-10 py-2 text-sm text-gray-300 hover:bg-gray-700/80 hover:text-white hover:pl-11 transition-all duration-200"
                >
                  Làm bộ đề đầy đủ
                </button>
                <button
                  onClick={() => handleNavigate('listening')}
                  className="w-full text-left px-10 py-2 text-sm text-gray-300 hover:bg-gray-700/80 hover:text-white hover:pl-11 transition-all duration-200"
                >
                  Mẹo học tập
                </button>
              </div>
            )}
          </div>

          {/* Học Writing */}
          <div>
            <button
              onClick={() => toggleSkill('writing')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                currentPage === 'writing'
                  ? 'bg-gray-700 text-white border-l-4 border-orange-500'
                  : 'text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-l-4 hover:border-orange-400/50 hover:shadow-lg hover:shadow-orange-500/20'
              }`}
            >
              <PenTool className="size-4 flex-shrink-0" />
              <span className="flex-1 text-left text-sm">Luyện tập Writing</span>
              {expandedSkills.writing ? (
                <ChevronDown className="size-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="size-4 flex-shrink-0" />
              )}
            </button>
            
            {/* Writing Submenu */}
            {expandedSkills.writing && (
              <div className="bg-gray-750">
                <button
                  onClick={() => handleShowPartModal('writing')}
                  className="w-full text-left px-10 py-2 text-sm text-gray-300 hover:bg-gray-700/80 hover:text-white hover:pl-11 transition-all duration-200"
                >
                  Luyện theo phần
                </button>
                <button
                  onClick={() => handleShowFullTestModal('writing')}
                  className="w-full text-left px-10 py-2 text-sm text-gray-300 hover:bg-gray-700/80 hover:text-white hover:pl-11 transition-all duration-200"
                >
                  Làm bộ đề đầy đủ
                </button>
              </div>
            )}
          </div>

          {/* Học Speaking */}
          <div>
            <button
              onClick={() => toggleSkill('speaking')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                currentPage === 'speaking'
                  ? 'bg-gray-700 text-white border-l-4 border-pink-500'
                  : 'text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-l-4 hover:border-pink-400/50 hover:shadow-lg hover:shadow-pink-500/20'
              }`}
            >
              <Mic className="size-4 flex-shrink-0" />
              <span className="flex-1 text-left text-sm">Luyện tập Speaking</span>
              {expandedSkills.speaking ? (
                <ChevronDown className="size-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="size-4 flex-shrink-0" />
              )}
            </button>
            
            {/* Speaking Submenu */}
            {expandedSkills.speaking && (
              <div className="bg-gray-750">
                <button
                  onClick={() => handleShowPartModal('speaking')}
                  className="w-full text-left px-10 py-2 text-sm text-gray-300 hover:bg-gray-700/80 hover:text-white hover:pl-11 transition-all duration-200"
                >
                  Luyện theo phần
                </button>
                <button
                  onClick={() => handleShowFullTestModal('speaking')}
                  className="w-full text-left px-10 py-2 text-sm text-gray-300 hover:bg-gray-700/80 hover:text-white hover:pl-11 transition-all duration-200"
                >
                  Làm bộ đề đầy đủ
                </button>
                <button
                  onClick={() => handleNavigate('speaking')}
                  className="w-full text-left px-10 py-2 text-sm text-gray-300 hover:bg-gray-700/80 hover:text-white hover:pl-11 transition-all duration-200"
                >
                  Mẹo học tập
                </button>
              </div>
            )}
          </div>

          {/* Section: Nhóm và trang */}
          <div className="mt-4">
            <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
              Thêm tính năng
            </div>
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-700/80 hover:text-white hover:pl-5 transition-all duration-200"
            >
              <Facebook className="size-4 flex-shrink-0" />
              <span className="text-sm">Cộng đồng Facebook</span>
            </button>
            <button
              onClick={() => handleNavigate('exam')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                currentPage === 'exam'
                  ? 'bg-gray-700 text-white border-l-4 border-yellow-500'
                  : 'text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-l-4 hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-500/20'
              }`}
            >
              <FileText className="size-4 flex-shrink-0" />
              <span className="text-sm">Thi thử trực tuyến</span>
            </button>
            <button
              onClick={() => handleNavigate('virtual-exam')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                currentPage === 'virtual-exam'
                  ? 'bg-gray-700 text-white border-l-4 border-indigo-500'
                  : 'text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-l-4 hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/20'
              }`}
            >
              <Monitor className="size-4 flex-shrink-0" />
              <span className="text-sm">Phòng thi ảo</span>
            </button>
          </div>

          {/* Section: Chức năng khác */}
          <div className="mt-4">
            <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
              Hỗ trợ & Tiện ích
            </div>
            
            {/* Tài liệu */}
            <button
              onClick={() => handleNavigate('documents')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                currentPage === 'documents'
                  ? 'bg-gray-700 text-white border-l-4 border-cyan-500'
                  : 'text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-l-4 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20'
              }`}
            >
              <FileText className="size-4 flex-shrink-0" />
              <span className="text-sm">Tài liệu học tập</span>
            </button>
            
            {/* Chấm AI */}
            <button
              onClick={() => handleNavigate('ai-grading')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                currentPage === 'ai-grading'
                  ? 'bg-gray-700 text-white border-l-4 border-violet-500'
                  : 'text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-l-4 hover:border-violet-400/50 hover:shadow-lg hover:shadow-violet-500/20'
              }`}
            >
              <Sparkles className="size-4 flex-shrink-0" />
              <span className="text-sm">Chấm AI</span>
            </button>
            
            {/* Thông báo */}
            <button
              onClick={() => handleNavigate('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                currentPage === 'notifications'
                  ? 'bg-gray-700 text-white border-l-4 border-rose-500'
                  : 'text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-l-4 hover:border-rose-400/50 hover:shadow-lg hover:shadow-rose-500/20'
              }`}
            >
              <Bell className="size-4 flex-shrink-0" />
              <span className="text-sm">Thông báo</span>
            </button>
            
            {/* Bài tập đã giao */}
            <button
              onClick={() => handleNavigate('assignments')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                currentPage === 'assignments'
                  ? 'bg-gray-700 text-white border-l-4 border-amber-500'
                  : 'text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-l-4 hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-500/20'
              }`}
            >
              <ClipboardList className="size-4 flex-shrink-0" />
              <span className="text-sm">Bài tập đã giao</span>
            </button>
            
            {/* Hồ sơ */}
            <button
              onClick={() => handleNavigate('profile')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                currentPage === 'profile'
                  ? 'bg-gray-700 text-white border-l-4 border-teal-500'
                  : 'text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-l-4 hover:border-teal-400/50 hover:shadow-lg hover:shadow-teal-500/20'
              }`}
            >
              <User className="size-4 flex-shrink-0" />
              <span className="text-sm">Hồ sơ cá nhân</span>
            </button>
            
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-700/80 hover:text-white hover:pl-5 transition-all duration-200"
            >
              <Heart className="size-4 flex-shrink-0" />
              <span className="text-sm">Ủng hộ dự án</span>
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-700/80 hover:text-white hover:pl-5 transition-all duration-200"
            >
              <Mail className="size-4 flex-shrink-0" />
              <span className="text-sm">Liên hệ hỗ trợ</span>
            </button>
            <button
              onClick={() => handleNavigate('ai-assistant')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                currentPage === 'ai-assistant'
                  ? 'bg-gray-700 text-white border-l-4 border-indigo-500'
                  : 'text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-l-4 hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/20'
              }`}
            >
              <Bot className="size-4 flex-shrink-0" />
              <span className="text-sm">Trợ lý AI</span>
            </button>
            <button
              onClick={() => handleNavigate('goals')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                currentPage === 'goals'
                  ? 'bg-gray-700 text-white border-l-4 border-red-500'
                  : 'text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-l-4 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-500/20'
              }`}
            >
              <Target className="size-4 flex-shrink-0" />
              <span className="text-sm">Mục tiêu học tập</span>
            </button>
            <button
              onClick={() => handleNavigate('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                currentPage === 'dashboard'
                  ? 'bg-gray-700 text-white border-l-4 border-gray-500'
                  : 'text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-l-4 hover:border-gray-400/50 hover:shadow-lg hover:shadow-gray-500/20'
              }`}
            >
              <LayoutDashboard className="size-4 flex-shrink-0" />
              <span className="text-sm">Bảng điều khiển</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}