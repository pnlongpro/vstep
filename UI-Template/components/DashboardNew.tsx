import { useState } from 'react';
import { Users, Activity, TrendingUp, DollarSign } from 'lucide-react';
import { TeacherSidebar } from './teacher/TeacherSidebar';
import { StudentSidebar } from './student/StudentSidebar';
import { SwitchRoleButton } from './SwitchRoleButton';
import { ClassManagementTeacherPage } from './teacher/ClassManagementTeacherPage';
import { TeacherMaterialsPage } from './teacher/TeacherMaterialsPage';
import { GradingPage } from './teacher/GradingPage';
import { TeacherMessagesPage } from './teacher/TeacherMessagesPage';
import { SettingsPage } from './teacher/SettingsPage';
import { AssignmentCreator } from './teacher/AssignmentCreator';
import { AssignmentManager } from './teacher/AssignmentManager';
import { TeacherAssignmentsPage } from './teacher/TeacherAssignmentsPage';
import { ClassMessagesPage } from './student/ClassMessagesPage';
import { LearningRoadmap } from './student/LearningRoadmap';
import { MyCoursesPage } from './student/MyCoursesPage';
import { UploaderDashboard } from './uploader/UploaderDashboard';
import { ContributeExamPage } from './teacher/ContributeExamPage';
import { AttendancePage } from './teacher/AttendancePage';

interface DashboardNewProps {
  onBack: () => void;
  initialRole?: 'student' | 'teacher';
}

export function DashboardNew({ onBack, initialRole = 'student' }: DashboardNewProps) {
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'admin' | 'uploader'>(initialRole);
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleRoleChange = (role: 'student' | 'teacher' | 'admin' | 'uploader') => {
    setUserRole(role);
    if (role === 'admin') {
      // Navigate back to trigger Admin Dashboard
      onBack();
    } else if (role === 'uploader') {
      setActivePage('dashboard');
    }
  };

  const renderDashboardContent = () => {
    if (userRole === 'teacher') {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl text-gray-900 mb-2">Teacher Dashboard</h1>
            <p className="text-gray-600">Quản trị hệ thống VstepPro</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Users className="size-6 text-blue-600" />
                </div>
                <span className="text-green-600 text-sm flex items-center gap-1">
                  <TrendingUp className="size-4" />
                  +12%
                </span>
              </div>
              <h3 className="text-2xl mb-1">2,890</h3>
              <p className="text-sm text-gray-600">Tổng người dùng</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Activity className="size-6 text-purple-600" />
                </div>
                <span className="text-green-600 text-sm flex items-center gap-1">
                  <TrendingUp className="size-4" />
                  +8%
                </span>
              </div>
              <h3 className="text-2xl mb-1">12,456</h3>
              <p className="text-sm text-gray-600">Bài thi đã làm</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Activity className="size-6 text-orange-600" />
                </div>
                <span className="text-green-600 text-sm flex items-center gap-1">
                  <TrendingUp className="size-4" />
                  +15%
                </span>
              </div>
              <h3 className="text-2xl mb-1">3,245</h3>
              <p className="text-sm text-gray-600">AI Scoring sử dụng</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <DollarSign className="size-6 text-green-600" />
                </div>
                <span className="text-green-600 text-sm flex items-center gap-1">
                  <TrendingUp className="size-4" />
                  +18%
                </span>
              </div>
              <h3 className="text-2xl mb-1">85M</h3>
              <p className="text-sm text-gray-600">Doanh thu tháng này</p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart Placeholder */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg mb-4">Doanh thu 6 tháng</h3>
              <div className="h-64 flex items-end justify-around gap-2 border-l border-b border-gray-200">
                {[3000000, 3200000, 2900000, 3600000, 3500000, 3800000].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-lg hover:from-emerald-600 hover:to-emerald-400 transition-all cursor-pointer" 
                      style={{ height: `${(value / 4000000) * 100}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie Chart Placeholder */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg mb-4">Phân bổ gói học</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#60A5FA" strokeWidth="20" strokeDasharray="75.4 251.2" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="20" strokeDasharray="62.8 251.2" strokeDashoffset="-75.4" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="20" strokeDasharray="113 251.2" strokeDashoffset="-138.2" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Free: 30%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-600">Pro: 25%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Premium: 45%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Student Dashboard
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl text-gray-900 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Theo dõi tiến độ học tập của bạn</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="size-6 text-blue-600" />
              </div>
              <span className="text-green-600 text-sm flex items-center gap-1">
                <TrendingUp className="size-4" />
                +12%
              </span>
            </div>
            <h3 className="text-2xl mb-1">15</h3>
            <p className="text-sm text-gray-600">Bài học hoàn thành</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Activity className="size-6 text-purple-600" />
              </div>
              <span className="text-green-600 text-sm flex items-center gap-1">
                <TrendingUp className="size-4" />
                +8%
              </span>
            </div>
            <h3 className="text-2xl mb-1">8</h3>
            <p className="text-sm text-gray-600">Đề thi đã làm</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <Activity className="size-6 text-orange-600" />
              </div>
              <span className="text-green-600 text-sm flex items-center gap-1">
                <TrendingUp className="size-4" />
                +15%
              </span>
            </div>
            <h3 className="text-2xl mb-1">7.5</h3>
            <p className="text-sm text-gray-600">Điểm trung bình</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="size-6 text-green-600" />
              </div>
              <span className="text-green-600 text-sm flex items-center gap-1">
                <TrendingUp className="size-4" />
                +18%
              </span>
            </div>
            <h3 className="text-2xl mb-1">65%</h3>
            <p className="text-sm text-gray-600">Tiến độ hoàn thành</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg mb-4">Khóa học đang theo học</h3>
          <div className="space-y-4">
            {[
              { name: 'VSTEP B1 Foundation', progress: 75, color: 'blue' },
              { name: 'VSTEP B2 Intermediate', progress: 45, color: 'purple' },
              { name: 'VSTEP C1 Advanced', progress: 20, color: 'green' },
            ].map((course, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{course.name}</span>
                    <span className="text-sm text-gray-600">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-${course.color}-600`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Hide for uploader (they have their own full-screen dashboard) */}
      {userRole !== 'uploader' && (
        <>
          {userRole === 'teacher' ? (
            <TeacherSidebar
              activePage={activePage}
              onPageChange={setActivePage}
              isMobileMenuOpen={isMobileMenuOpen}
              onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          ) : (
            <StudentSidebar
              activePage={activePage}
              onPageChange={setActivePage}
              isMobileMenuOpen={isMobileMenuOpen}
              onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          )}
        </>
      )}

      {/* Main Content */}
      {userRole === 'uploader' ? (
        // Uploader has full-screen dashboard
        <UploaderDashboard onBack={onBack} />
      ) : (
        <div className="lg:ml-80 min-h-screen">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl">
                    {activePage === 'dashboard' && (userRole === 'teacher' ? 'Teacher Dashboard' : 'Student Dashboard')}
                    {activePage === 'learning-roadmap' && 'Lộ trình học tập'}
                    {activePage === 'my-classes' && 'Lớp học của tôi'}
                    {activePage === 'assignments' && 'Giao bài tập'}
                    {activePage === 'materials' && 'Tài liệu'}
                    {activePage === 'grading' && 'Chấm bài'}
                    {activePage === 'messages' && (userRole === 'teacher' ? 'Tin nhắn' : 'Tin nhắn lớp học')}
                    {activePage === 'my-courses' && 'Khóa học của tôi'}
                    {activePage === 'practice' && 'Luyện tập'}
                    {activePage === 'achievements' && 'Thành tích'}
                    {activePage === 'schedule' && 'Lịch học'}
                    {activePage === 'settings' && 'Cài đặt'}
                    {activePage === 'contribute-exam' && 'Đóng góp đề thi'}
                    {activePage === 'attendance' && 'Điểm danh'}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {userRole === 'teacher' ? 'Quản lý lớp học và chấm điểm' : 'Theo dõi tiến độ học tập'}
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
            {activePage === 'dashboard' && renderDashboardContent()}
            {activePage === 'learning-roadmap' && userRole === 'student' && <LearningRoadmap />}
            {activePage === 'my-classes' && userRole === 'teacher' && <ClassManagementTeacherPage />}
            {activePage === 'my-courses' && userRole === 'student' && <MyCoursesPage />}
            {activePage === 'assignments' && userRole === 'teacher' && <TeacherAssignmentsPage />}
            {activePage === 'materials' && userRole === 'teacher' && <TeacherMaterialsPage />}
            {activePage === 'attendance' && userRole === 'teacher' && <AttendancePage onBack={() => setActivePage('dashboard')} />}
            {activePage === 'grading' && userRole === 'teacher' && <GradingPage />}
            {activePage === 'messages' && userRole === 'teacher' && <TeacherMessagesPage />}
            {activePage === 'messages' && userRole === 'student' && <ClassMessagesPage />}
            {activePage === 'settings' && <SettingsPage />}
            {activePage === 'contribute-exam' && userRole === 'teacher' && <ContributeExamPage />}
          </main>
        </div>
      )}

      {/* Switch Role Button */}
      <SwitchRoleButton currentRole={userRole} onRoleChange={handleRoleChange} />
    </div>
  );
}