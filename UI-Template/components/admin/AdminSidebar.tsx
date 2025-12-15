import { Home, Users, CreditCard, FileText, Brain, Settings, ChevronRight, Menu, X, TrendingUp, Activity, ClipboardList, MessageSquare, Sliders, Gift, Database } from 'lucide-react';

interface AdminSidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export function AdminSidebar({ activePage, onPageChange, isMobileMenuOpen, onToggleMobileMenu }: AdminSidebarProps) {
  const menuItems = [
    // === NHÓM 1: TỔNG QUAN & NGƯỜI DÙNG ===
    { id: 'dashboard', name: 'Tổng quan', icon: Home },
    { id: 'users', name: 'Quản lý người dùng', icon: Users },
    { id: 'free-accounts', name: 'Tài khoản miễn phí', icon: Gift },
    { id: 'teachers', name: 'Quản lý giáo viên', icon: Users },
    
    // === NHÓM 2: NỘI DUNG HỌC TẬP ===
    { id: 'exams', name: 'Ngân hàng đề thi', icon: FileText },
    { id: 'assignments', name: 'Quản lý bài tập', icon: ClipboardList },
    // { id: 'questions', name: 'Ngân hàng câu hỏi', icon: Brain }, // HIDDEN - Not needed
    { id: 'documents', name: 'Tài liệu học tập', icon: FileText },
    { id: 'courses', name: 'Khóa học', icon: Brain },
    
    // === NHÓM 3: VẬN HÀNH ===
    { id: 'classes', name: 'Quản lý lớp học', icon: Brain },
    { id: 'messages', name: 'Tin nhắn hệ thống', icon: MessageSquare },
    
    // === NHÓM 4: TÀI CHÍNH & LOGS ===
    { id: 'pricing', name: 'Giao dịch', icon: CreditCard },
    { id: 'ai-logs', name: 'Nhật ký chấm AI', icon: Activity },
    
    // === NHÓM 5: CÀI ĐẶT HỆ THỐNG ===
    { id: 'backup', name: 'Quản lý sao lưu', icon: Database },
    { id: 'config', name: 'Quản lý cấu hình', icon: Sliders },
    { id: 'settings', name: 'Cài đặt hệ thống', icon: Settings },
  ];

  const quickStats = [
    { label: 'Thời gian hoạt động', value: '99.9%', trend: '', color: 'text-green-400' },
    { label: 'Người dùng online', value: '1,234', trend: '', color: 'text-blue-400' },
  ];

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-white text-lg">Admin Panel</h2>
            <p className="text-gray-400 text-xs">VSTEPRO System</p>
          </div>
        </div>
      </div>

      {/* Quick Stats - Hidden for space optimization */}
      {/* <div className="p-4 border-b border-gray-700">
        <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3">Thống kê nhanh</h3>
        <div className="space-y-3">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
              <div className="flex items-center justify-between">
                <span className="text-white">{stat.value}</span>
                <span className={`text-xs flex items-center gap-1 ${stat.color}`}>
                  <TrendingUp className="size-3" />
                  {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Navigation */}
      <nav className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3">Điều hướng</h3>
        <div className="space-y-1">
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className={`size-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                <span className="text-sm">{item.name}</span>
                {isActive && <ChevronRight className="size-4 ml-auto" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4">
          <p className="text-white text-sm mb-1">Trạng thái hệ thống</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-100">Tất cả hệ thống hoạt động tốt</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-80 bg-gray-900 z-40">
        <SidebarContent />
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={onToggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 w-80 bg-gray-900 z-40 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}