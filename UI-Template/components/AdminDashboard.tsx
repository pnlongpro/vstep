import { useState } from 'react';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminDashboardPage } from './admin/AdminDashboardPage';
import { UserManagementPage } from './admin/UserManagementPage';
import { FreeAccountManagementPage } from './admin/FreeAccountManagementPage';
import { TeachersPage } from './admin/TeachersPage';
import { ClassManagementPage } from './admin/ClassManagementPage';
import { ExamManagementPage } from './admin/ExamManagementPage';
// import { QuestionsPage } from './admin/QuestionsPage'; // REMOVED - Not needed
import { CoursesPage } from './admin/CoursesPage';
import { TransactionsPage } from './admin/TransactionsPage';
import { AILogsPage } from './admin/AILogsPage';
import { SettingsPage } from './admin/SettingsPage';
import { AssignmentManagementAdmin } from './admin/AssignmentManagementAdmin';
import { AdminMessagesPage } from './admin/AdminMessagesPage';
import { AdminMaterialsPage } from './admin/AdminMaterialsPage';
import { DocumentsManagementPage } from './admin/DocumentsManagementPage';
import { ConfigManagementPage } from './admin/ConfigManagementPage';
import { BackupManagementPage } from './admin/BackupManagementPage';
import { SwitchRoleButton } from './SwitchRoleButton';

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<'student' | 'teacher' | 'admin' | 'uploader'>('admin');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleRoleChange = (role: 'student' | 'teacher' | 'admin' | 'uploader') => {
    setCurrentRole(role);
    // You can add navigation logic here based on role
    if (role === 'student') {
      onBack();
    } else if (role === 'teacher') {
      // Navigate to teacher dashboard
      onBack();
    } else if (role === 'uploader') {
      // Navigate to uploader dashboard
      onBack();
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <AdminDashboardPage />;
      case 'users':
        return <UserManagementPage />;
      case 'free-accounts':
        return <FreeAccountManagementPage />;
      case 'teachers':
        return <TeachersPage />;
      case 'classes':
        return <ClassManagementPage />;
      case 'exams':
        return <ExamManagementPage />;
      // case 'questions':
      //   return <QuestionsPage />;
      case 'courses':
        return <CoursesPage />;
      case 'documents':
        return <DocumentsManagementPage />;
      case 'messages':
        return <AdminMessagesPage />;
      case 'pricing':
        return <TransactionsPage />;
      case 'ai-logs':
        return <AILogsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'assignments':
        return <AssignmentManagementAdmin onBack={() => setActivePage('dashboard')} />;
      case 'config':
        return <ConfigManagementPage />;
      case 'backup':
        return <BackupManagementPage />;
      default:
        return <AdminDashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        activePage={activePage}
        onPageChange={setActivePage}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
      />

      {/* Main Content */}
      <div className="lg:ml-80 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl">
                  {activePage === 'dashboard' && 'Tổng quan quản trị'}
                  {activePage === 'users' && 'Quản lý người dùng'}
                  {activePage === 'free-accounts' && 'Quản lý tài khoản miễn phí'}
                  {activePage === 'teachers' && 'Quản lý giáo viên'}
                  {activePage === 'classes' && 'Quản lý lớp học'}
                  {activePage === 'exams' && 'Ngân hàng đề thi'}
                  {activePage === 'courses' && 'Quản lý khóa học'}
                  {activePage === 'documents' && 'Quản lý tài liệu'}
                  {activePage === 'messages' && 'Quản lý tin nhắn'}
                  {activePage === 'pricing' && 'Quản lý giao dịch'}
                  {activePage === 'ai-logs' && 'Nhật ký chấm AI'}
                  {activePage === 'settings' && 'Cài đặt hệ thống'}
                  {activePage === 'assignments' && 'Quản lý bài tập'}
                  {activePage === 'config' && 'Quản lý cấu hình'}
                  {activePage === 'backup' && 'Quản lý sao lưu'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {activePage === 'dashboard' && 'Quản trị hệ thống VSTEPRO'}
                  {activePage === 'users' && 'Quản lý và giám sát tất cả người dùng'}
                  {activePage === 'free-accounts' && 'Quản lý và giám sát tất cả tài khoản miễn phí'}
                  {activePage === 'teachers' && 'Quản lý và giám sát tất cả giáo viên'}
                  {activePage === 'classes' && 'Quản lý và giám sát tất cả lớp học'}
                  {activePage === 'exams' && 'Kho đề thi theo từng kỹ năng'}
                  {activePage === 'courses' && 'Quản lý và giám sát tất cả khóa học'}
                  {activePage === 'documents' && 'Quản lý và giám sát tất cả tài liệu'}
                  {activePage === 'messages' && 'Quản lý và giám sát tất cả tin nhắn'}
                  {activePage === 'pricing' && 'Theo dõi tất cả giao dịch tài chính'}
                  {activePage === 'ai-logs' && 'Giám sát hệ thống chấm điểm AI'}
                  {activePage === 'settings' && 'Cấu hình các thiết lập hệ thống'}
                  {activePage === 'assignments' && 'Quản lý và giám sát tất cả bài tập'}
                  {activePage === 'config' && 'Cấu hình các thiết lập hệ thống'}
                  {activePage === 'backup' && 'Quản lý và giám sát tất cả bản sao lưu'}
                </p>
              </div>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Về trang chính
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Switch Role Button */}
      <SwitchRoleButton currentRole={currentRole} onRoleChange={handleRoleChange} />
    </div>
  );
}