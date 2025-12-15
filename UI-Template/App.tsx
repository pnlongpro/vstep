import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DashboardNew } from './components/DashboardNew';
import { OnboardingModal } from './components/OnboardingModal';
import { PracticeHome } from './components/PracticeHome';
import { PracticeList } from './components/PracticeList';
import { ReadingPractice } from './components/ReadingPractice';
import { ListeningPractice } from './components/ListeningPractice';
import { WritingPractice } from './components/WritingPractice';
import { SpeakingPractice } from './components/SpeakingPractice';
import { ExamRoom } from './components/ExamRoom';
import { VirtualExamRoom } from './components/VirtualExamRoom';
import { MockExam } from './components/student/MockExam';
import { Statistics } from './components/Statistics';
import { History } from './components/History-new';
import { NotificationsPage } from './components/NotificationsPage';
import { Sidebar } from './components/Sidebar';
import { Profile } from './components/Profile';
import { ModeSelectionModal } from './components/ModeSelectionModal';
import { PartSelectionModal } from './components/PartSelectionModal';
import { BadgeUnlockModal } from './components/BadgeUnlockModal';
import { AIAssistant } from './components/AIAssistant';
import { AIGrading } from './components/AIGrading';
import { FloatingChatButton } from './components/FloatingChatButton';
import { ChatPanel } from './components/ChatPanel';
import { AssignmentsPage } from './components/AssignmentsPage';
import { Goals } from './components/Goals';
import { Blog } from './components/Blog';
import { DocumentsPage } from './components/DocumentsPage';
import { ExamRegistrationGuide } from './components/ExamRegistrationGuide';
import { BadgeDefinition } from './data/badgeDefinitions';
import { Home, BarChart3, History as HistoryIcon, Bell, User, Maximize, Minimize, Sparkles, BookOpen, MessageCircle, ClipboardList, FileText, Menu, X } from 'lucide-react';
import logoImage from 'figma:asset/0a20b2e75c15f09d98fc24bd0f6b028b4eeb4661.png';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'reading' | 'listening' | 'writing' | 'speaking' | 'exam' | 'virtual-exam' | 'mock-exam' | 'statistics' | 'history' | 'profile' | 'ai-assistant' | 'ai-grading' | 'practice-list' | 'exam-interface' | 'notifications' | 'goals' | 'blog' | 'dashboard' | 'admin-dashboard' | 'documents' | 'assignments' | 'exam-registration'>('home');
  const [selectedSkill, setSelectedSkill] = useState<'reading' | 'listening' | 'writing' | 'speaking'>('reading');
  const [currentMode, setCurrentMode] = useState<'part' | 'fulltest'>('part');
  const [selectedPart, setSelectedPart] = useState<number | undefined>(undefined);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | undefined>(undefined);
  const [showModeModal, setShowModeModal] = useState(false);
  const [showPartModal, setShowPartModal] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'admin' | 'uploader'>('student');
  const [showFloatingChat, setShowFloatingChat] = useState(() => {
    // Đọc từ vstep_settings thay vì show_floating_chat riêng
    const settingsData = localStorage.getItem('vstep_settings');
    if (settingsData) {
      try {
        const settings = JSON.parse(settingsData);
        return settings.ai?.enabled ?? true;
      } catch {
        return true;
      }
    }
    return true;
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const hasSeenOnboarding = localStorage.getItem('has_seen_onboarding');
    return hasSeenOnboarding !== 'true';
  });
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<BadgeDefinition | null>(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Update unread notifications count
  useEffect(() => {
    const updateUnreadCount = () => {
      const saved = localStorage.getItem('vstep_notifications');
      if (saved) {
        try {
          const notifications = JSON.parse(saved);
          const unreadCount = notifications.filter((n: any) => !n.isRead).length;
          setUnreadNotificationsCount(unreadCount);
        } catch {
          setUnreadNotificationsCount(0);
        }
      }
    };

    // Initial count
    updateUnreadCount();

    // Listen for storage changes
    window.addEventListener('storage', updateUnreadCount);
    // Listen for custom event when notifications update
    window.addEventListener('vstep-notifications-updated', updateUnreadCount);

    return () => {
      window.removeEventListener('storage', updateUnreadCount);
      window.removeEventListener('vstep-notifications-updated', updateUnreadCount);
    };
  }, []);

  // Handler riêng cho "Làm bộ đề đầy đủ" - đi thẳng vào practice-list
  const handleSelectFullTest = (skill: 'reading' | 'listening' | 'writing' | 'speaking') => {
    console.log('handleSelectFullTest called with:', skill);
    setSelectedSkill(skill);
    setCurrentMode('fulltest');
    setSelectedPart(undefined);
    setSelectedExerciseId(undefined);
    setCurrentPage('practice-list');
  };

  // Handler riêng cho "Làm theo phần" - mở PartSelectionModal
  const handleSelectPartMode = (skill: 'reading' | 'listening' | 'writing' | 'speaking') => {
    console.log('handleSelectPartMode called with:', skill);
    setSelectedSkill(skill);
    setCurrentMode('part');
    setShowPartModal(true);
  };

  // Handler for badge unlock
  const handleBadgeUnlock = (badge: BadgeDefinition) => {
    setUnlockedBadge(badge);
    setShowBadgeModal(true);
  };

  // Listen for settings changes from Profile
  useEffect(() => {
    const handleSettingsChange = () => {
      const settingsData = localStorage.getItem('vstep_settings');
      if (settingsData) {
        try {
          const settings = JSON.parse(settingsData);
          const aiEnabled = settings.ai?.enabled ?? true;
          console.log('Settings changed! AI enabled:', aiEnabled);
          setShowFloatingChat(aiEnabled);
        } catch (error) {
          console.error('Error parsing settings:', error);
        }
      }
    };

    // Listen for custom event
    window.addEventListener('vstep-settings-changed', handleSettingsChange);
    
    return () => {
      window.removeEventListener('vstep-settings-changed', handleSettingsChange);
    };
  }, []);

  // Listen for navigation events from PracticeHome
  useEffect(() => {
    const handleNavigateToStats = () => {
      setCurrentPage('statistics');
    };

    const handleNavigateToRoadmap = () => {
      setCurrentPage('dashboard');
      setUserRole('student');
    };

    window.addEventListener('navigate-to-statistics', handleNavigateToStats);
    window.addEventListener('navigate-to-roadmap', handleNavigateToRoadmap);

    return () => {
      window.removeEventListener('navigate-to-statistics', handleNavigateToStats);
      window.removeEventListener('navigate-to-roadmap', handleNavigateToRoadmap);
    };
  }, []);

  // Debug logs
  console.log('App State:', {
    currentPage,
    selectedSkill,
    currentMode,
    selectedPart,
    showModeModal,
    showPartModal
  });

  // Khi click vào skill từ PracticeHome
  const handleSelectSkill = (skill: 'reading' | 'listening' | 'writing' | 'speaking' | 'exam' | 'virtual-exam' | 'mock-exam' | 'ai-assistant' | 'documents' | 'assignments' | 'exam-registration') => {
    console.log('handleSelectSkill called with:', skill);
    
    // Nếu là exam, virtual-exam, mock-exam, ai-assistant, documents, assignments, hoặc exam-registration → đi thẳng
    if (skill === 'exam' || skill === 'virtual-exam' || skill === 'mock-exam' || skill === 'ai-assistant' || skill === 'documents' || skill === 'assignments' || skill === 'exam-registration') {
      setCurrentPage(skill);
      return;
    }
    
    // Nếu là skill thông thường → hiện modal chọn mode
    setSelectedSkill(skill);
    setShowModeModal(true);
    console.log('showModeModal set to true');
  };

  // Khi chọn mode từ ModeSelectionModal
  const handleSelectMode = (mode: 'part' | 'fulltest') => {
    console.log('handleSelectMode called with:', mode);
    setCurrentMode(mode);
    
    if (mode === 'part') {
      // Đóng modal mode, mở modal chọn part
      setShowModeModal(false);
      setShowPartModal(true);
      console.log('showPartModal set to true');
    } else {
      // mode === 'fulltest' → Chuyển vào practice-list để hiển thị danh sách đề fulltest
      setShowModeModal(false);
      setSelectedPart(undefined);
      setCurrentPage('practice-list'); // Chuyển vào practice-list với mode fulltest
    }
  };

  // Khi chọn part từ PartSelectionModal
  const handleSelectPart = (part: number) => {
    console.log(`Selected ${selectedSkill} Part ${part}`);
    setSelectedPart(part);
    setCurrentMode('part'); // Đảm bảo mode là 'part'
    setShowPartModal(false);
    
    // Tất cả skills đều chuyển về practice-list để hiển thị danh sách đề theo Part
    setCurrentPage('practice-list');
  };

  const handleShowPartModal = (skill: 'reading' | 'listening' | 'writing' | 'speaking') => {
    setSelectedSkill(skill);
    setShowPartModal(true);
  };

  // Khi click vào card kỹ năng từ History → đi thẳng vào danh sách bộ đề đầy đủ
  const handleGoToPracticeList = (skill: 'reading' | 'listening' | 'writing' | 'speaking') => {
    console.log('handleGoToPracticeList called with:', skill);
    setSelectedSkill(skill);
    setCurrentMode('fulltest'); // Làm b đề đầy đủ
    setSelectedPart(undefined);
    setCurrentPage('practice-list'); // Đi thẳng vào danh sách đề
  };

  const handleStartPractice = (exerciseId: number) => {
    console.log(`Starting practice ${exerciseId} for ${selectedSkill}`);
    // Navigate to actual practice page
    setCurrentPage(selectedSkill);
    setSelectedExerciseId(exerciseId);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Hide sidebar and header for: admin dashboard, AI assistant, dashboard, and all exam pages
  const shouldHideSidebar = currentPage === 'admin-dashboard' 
    || currentPage === 'ai-assistant' 
    || currentPage === 'dashboard'
    || currentPage === 'exam'
    || currentPage === 'virtual-exam'
    || currentPage === 'mock-exam'
    || currentPage === 'reading'
    || currentPage === 'listening'
    || currentPage === 'writing'
    || currentPage === 'speaking';

  // If on admin dashboard, render it directly without the main layout
  if (currentPage === 'admin-dashboard') {
    return <AdminDashboard onBack={() => setCurrentPage('home')} />;
  }

  // If on teacher/student dashboard, render DashboardNew without the main layout
  if (currentPage === 'dashboard') {
    return <DashboardNew onBack={() => setCurrentPage('home')} initialRole={userRole} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex ${isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''}`}>
      {/* Sidebar - Hidden on Mobile */}
      {!shouldHideSidebar && (
        <div className="hidden lg:block">
          <Sidebar 
            currentPage={currentPage} 
            onNavigate={setCurrentPage}
            onShowPartModal={handleSelectPartMode}
            onShowFullTestModal={handleSelectFullTest}
          />
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {!shouldHideSidebar && showMobileSidebar && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileSidebar(false)}
          />
          
          {/* Sidebar Drawer */}
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-2xl animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setShowMobileSidebar(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="size-6 text-gray-700" />
            </button>
            
            {/* Sidebar Content */}
            <Sidebar 
              currentPage={currentPage} 
              onNavigate={(page) => {
                setCurrentPage(page);
                setShowMobileSidebar(false);
              }}
              onShowPartModal={(skill) => {
                handleSelectPartMode(skill);
                setShowMobileSidebar(false);
              }}
              onShowFullTestModal={(skill) => {
                handleSelectFullTest(skill);
                setShowMobileSidebar(false);
              }}
            />
          </div>
        </div>
      )}
      
      {/* Mode Selection Modal */}
      {showModeModal && (
        <ModeSelectionModal
          isOpen={showModeModal}
          onClose={() => setShowModeModal(false)}
          skill={selectedSkill}
          onSelectMode={handleSelectMode}
        />
      )}

      {/* Part Selection Modal */}
      {showPartModal && (
        <PartSelectionModal
          isOpen={showPartModal}
          onClose={() => setShowPartModal(false)}
          skill={selectedSkill}
          onSelectPart={handleSelectPart}
        />
      )}
      
      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header */}
        {!shouldHideSidebar && (
          <header className="bg-white shadow-sm border-b sticky top-0 z-30">
            <div className="flex items-center h-16 px-2 gap-2">
              {/* Hamburger Menu Button - Mobile Only */}
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                aria-label="Open menu"
              >
                <Menu className="size-6 text-gray-700" />
              </button>

              {/* Spacer to maintain position when hamburger is hidden */}
              <div className="hidden md:block p-2 flex-shrink-0">
                <div className="size-6" />
              </div>

              {/* Navigation - Full width with even spacing */}
              <nav className="flex items-center flex-1 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setCurrentPage('home')}
                  className={`flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-1 ${
                    currentPage === 'home'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Home className="size-4" />
                  <span className="text-sm hidden sm:inline">Trang chủ</span>
                </button>
                <button
                  onClick={() => setCurrentPage('statistics')}
                  className={`flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-1 ${
                    currentPage === 'statistics'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="size-4" />
                  <span className="text-sm hidden sm:inline">Thống kê</span>
                </button>
                <button
                  onClick={() => setCurrentPage('history')}
                  className={`flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-1 ${
                    currentPage === 'history'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <HistoryIcon className="size-4" />
                  <span className="text-sm hidden sm:inline">Lịch sử</span>
                </button>

                {/* Documents Button */}
                <button
                  onClick={() => setCurrentPage('documents')}
                  className={`flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-1 ${
                    currentPage === 'documents'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="size-4" />
                  <span className="text-sm hidden sm:inline">Tài liệu</span>
                </button>

                {/* AI Assistant Button */}
                <button
                  onClick={() => setCurrentPage('ai-grading')}
                  className={`flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-1 ${
                    currentPage === 'ai-grading'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Sparkles className="size-4" />
                  <span className="text-sm hidden sm:inline">Chấm AI</span>
                </button>

                {/* Notifications Button with Badge */}
                <button
                  onClick={() => setCurrentPage('notifications')}
                  className={`relative flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-1 ${
                    currentPage === 'notifications'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="size-4" />
                  <span className="text-sm hidden sm:inline">Thông báo</span>
                  {/* Badge for unread count */}
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 animate-pulse">
                      {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Chat Button */}
                <button
                  onClick={() => setShowChatPanel(true)}
                  className="relative flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 whitespace-nowrap flex-1"
                >
                  <MessageCircle className="size-4" />
                  <span className="text-sm hidden sm:inline">Tin nhắn</span>
                  {/* Badge for unread messages - mock data */}
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 animate-pulse">
                    2
                  </span>
                </button>

                {/* Assignments Button */}
                <button
                  onClick={() => setCurrentPage('assignments')}
                  className={`relative flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-1 ${
                    currentPage === 'assignments'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ClipboardList className="size-4" />
                  <span className="text-sm hidden sm:inline">Bài tập đã giao</span>
                  {/* Badge for pending assignments */}
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                    3
                  </span>
                </button>
              </nav>
                
              {/* Right Side: Fullscreen, Profile */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={isFullscreen ? 'Thoát chế độ toàn màn hình' : 'Chế độ toàn màn hình'}
                >
                  {isFullscreen ? (
                    <Minimize className="size-5 text-gray-700" />
                  ) : (
                    <Maximize className="size-5 text-gray-700" />
                  )}
                </button>
                
                {/* Profile */}
                <button
                  onClick={() => setCurrentPage('profile')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    currentPage === 'profile'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center ${
                    currentPage === 'profile' ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                  }`}>
                    <User className="size-4 text-white" />
                  </div>
                  <span className="text-sm hidden lg:inline">Hồ sơ</span>
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className={shouldHideSidebar ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
          {currentPage === 'home' && (
            <PracticeHome 
              onSelectSkill={handleSelectSkill}
              onSelectMode={handleSelectMode}
              onSelectFullTest={handleSelectFullTest}
              onSelectPartMode={handleSelectPartMode}
            />
          )}
          {currentPage === 'practice-list' && (
            <PracticeList
              skill={selectedSkill}
              mode={currentMode}
              part={selectedPart}
              onBack={() => setCurrentPage('home')}
              onStartPractice={handleStartPractice}
            />
          )}
          {currentPage === 'reading' && (
            <ReadingPractice 
              onBack={() => setCurrentPage('practice-list')} 
              autoStart={!!selectedExerciseId}
              fullTestMode={currentMode === 'fulltest'}
              exerciseId={selectedExerciseId}
            />
          )}
          {currentPage === 'listening' && (
            <ListeningPractice 
              onBack={() => setCurrentPage('practice-list')} 
              autoStart={!!selectedExerciseId}
              fullTestMode={currentMode === 'fulltest'}
              exerciseId={selectedExerciseId}
              partMode={currentMode === 'part' && selectedSkill === 'listening'}
              selectedPart={selectedPart as 1 | 2 | 3 | undefined}
            />
          )}
          {currentPage === 'writing' && (
            <WritingPractice 
              onBack={() => setCurrentPage('practice-list')} 
              autoStart={!!selectedExerciseId}
              fullTestMode={currentMode === 'fulltest'}
              exerciseId={selectedExerciseId}
              partMode={currentMode === 'part' && selectedSkill === 'writing'}
              selectedPart={selectedPart as 1 | 2 | undefined}
            />
          )}
          {currentPage === 'speaking' && (
            <SpeakingPractice 
              onBack={() => setCurrentPage('practice-list')} 
              autoStart={!!selectedExerciseId}
              fullTestMode={currentMode === 'fulltest'}
              exerciseId={selectedExerciseId}
              partMode={currentMode === 'part' && selectedSkill === 'speaking'}
              selectedPart={selectedPart as 1 | 2 | 3 | undefined}
            />
          )}
          {currentPage === 'exam' && (
            <ExamRoom onBack={() => setCurrentPage('home')} />
          )}
          {currentPage === 'virtual-exam' && (
            <VirtualExamRoom onBack={() => setCurrentPage('home')} />
          )}
          {currentPage === 'mock-exam' && (
            <MockExam onBack={() => setCurrentPage('home')} />
          )}
          {currentPage === 'statistics' && (
            <Statistics onBack={() => setCurrentPage('home')} />
          )}
          {currentPage === 'history' && (
            <History 
              onBack={() => setCurrentPage('home')} 
              onSelectSkill={handleGoToPracticeList}
            />
          )}
          {currentPage === 'notifications' && (
            <NotificationsPage />
          )}
          {currentPage === 'profile' && <Profile onBack={() => setCurrentPage('home')} />}
          {currentPage === 'ai-assistant' && <AIAssistant onBack={() => setCurrentPage('home')} />}
          {currentPage === 'ai-grading' && <AIGrading onBack={() => setCurrentPage('home')} />}
          {currentPage === 'goals' && <Goals onBack={() => setCurrentPage('home')} />}
          {currentPage === 'blog' && <Blog onBack={() => setCurrentPage('home')} />}
          {currentPage === 'documents' && <DocumentsPage onBack={() => setCurrentPage('home')} />}
          {currentPage === 'assignments' && <AssignmentsPage onBack={() => setCurrentPage('home')} />}
          {currentPage === 'exam-registration' && <ExamRegistrationGuide onBack={() => setCurrentPage('home')} />}
        </main>
      </div>
      {/* Floating Chat Button - Show on all pages except AI Assistant */}
      {currentPage !== 'ai-assistant' && showFloatingChat && (
        <FloatingChatButton 
          onClick={() => setCurrentPage('ai-assistant')}
          onHide={() => {
            setShowFloatingChat(false);
            // Update vstep_settings instead of separate key
            const settingsData = localStorage.getItem('vstep_settings');
            if (settingsData) {
              try {
                const settings = JSON.parse(settingsData);
                settings.ai.enabled = false;
                localStorage.setItem('vstep_settings', JSON.stringify(settings));
                // Dispatch event
                window.dispatchEvent(new Event('vstep-settings-changed'));
              } catch (error) {
                console.error('Error updating settings:', error);
              }
            }
          }}
        />
      )}
      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal
          onComplete={() => {
            setShowOnboarding(false);
            localStorage.setItem('has_seen_onboarding', 'true');
          }}
        />
      )}
      {/* Badge Unlocked Modal */}
      {showBadgeModal && unlockedBadge && (
        <BadgeUnlockModal
          isOpen={showBadgeModal}
          badge={unlockedBadge}
          onClose={() => setShowBadgeModal(false)}
        />
      )}
      
      {/* Chat Panel */}
      {showChatPanel && (
        <ChatPanel
          onClose={() => setShowChatPanel(false)}
          userRole={userRole}
        />
      )}
      
      {/* Role Switcher - Floating at bottom */}
      {!shouldHideSidebar && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200 shadow-lg">
            <button
              onClick={() => {
                setUserRole('student');
                setCurrentPage('dashboard');
              }}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                userRole === 'student'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => {
                setUserRole('teacher');
                setCurrentPage('dashboard');
              }}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                userRole === 'teacher'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Teacher
            </button>
            <button
              onClick={() => {
                setUserRole('admin');
                setCurrentPage('admin-dashboard');
              }}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                userRole === 'admin'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => {
                setUserRole('uploader');
                setCurrentPage('dashboard');
              }}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                userRole === 'uploader'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📤 Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}