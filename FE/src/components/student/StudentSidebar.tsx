import { Home, BookOpen, Target, Award, Calendar, Settings, Menu, X, MessageSquare, TrendingUp } from 'lucide-react';
// import logoImage from 'figma:asset/0a20b2e75c15f09d98fc24bd0f6b028b4eeb4661.png';

interface StudentSidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export function StudentSidebar({ activePage, onPageChange, isMobileMenuOpen, onToggleMobileMenu }: StudentSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'learning-roadmap', label: 'Lộ trình học tập', icon: TrendingUp },
    { id: 'my-courses', label: 'Khóa học của tôi', icon: BookOpen },
    { id: 'practice', label: 'Luyện tập', icon: Target },
    { id: 'achievements', label: 'Thành tích', icon: Award },
    { id: 'schedule', label: 'Lịch học', icon: Calendar },
    { id: 'messages', label: 'Tin nhắn lớp học', icon: MessageSquare },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={onToggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg"
      >
        {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-80 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-transform duration-300 z-40 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div>
                <h2 className="text-xl">VstepPro</h2>
                <p className="text-sm text-gray-400">Student Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      if (isMobileMenuOpen) onToggleMobileMenu();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="size-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Quick Stats */}
          <div className="p-4 border-t border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Quick Stats</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Progress</span>
                <span className="text-blue-400">65%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Courses</span>
                <span className="text-white">4</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}