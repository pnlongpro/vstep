import { useState } from 'react';
import { ArrowLeft, Users, GraduationCap, FileText, HelpCircle, BookOpen, CreditCard, Brain, Settings, Search, Plus, Filter, Download, MoreVertical, TrendingUp, TrendingDown, BarChart3, Bell, Clock, Award, Target, MessageSquare, Upload, Edit, Trash2, Eye, UserCheck, BookMarked, ClipboardList, Calendar, Mail, Shield, Database, Activity, Zap, CheckCircle, ChevronRight, Home } from 'lucide-react';
import { TeacherSidebar } from './teacher/TeacherSidebar';
import { StudentSidebar } from './student/StudentSidebar';
import { SwitchRoleButton } from './SwitchRoleButton';
import { ClassManagementTeacherPage } from './teacher/ClassManagementTeacherPage';

interface DashboardProps {
  onBack: () => void;
  initialRole?: UserRole;
}

type UserRole = 'student' | 'teacher' | 'admin';
type AdminTab = 'dashboard' | 'students' | 'teachers' | 'courses' | 'question-bank' | 'exam-bank' | 'ai-grading' | 'classes' | 'analytics' | 'settings';
type TeacherTab = 'dashboard' | 'my-classes' | 'student-progress' | 'grade-writing' | 'grade-speaking' | 'materials' | 'assignments' | 'messages' | 'profile';
type StudentTab = 'dashboard' | 'my-courses' | 'practice' | 'mock-tests' | 'results' | 'learning-path' | 'achievements' | 'schedule';

export function Dashboard({ onBack, initialRole = 'student' }: DashboardProps) {
  const [userRole, setUserRole] = useState<UserRole>(initialRole);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');
  const [activeTeacherTab, setActiveTeacherTab] = useState<TeacherTab>('dashboard');
  const [activeStudentTab, setActiveStudentTab] = useState<StudentTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Tabs
  const adminTabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, desc: 'Tổng quan hệ thống' },
    { id: 'students', name: 'Quản lý học viên', icon: Users, desc: 'Danh sách & tiến độ học viên' },
    { id: 'teachers', name: 'Quản lý giáo viên', icon: GraduationCap, desc: 'Giáo viên & năng suất' },
    { id: 'courses', name: 'Quản lý khóa học', icon: BookOpen, desc: 'Khóa học & lộ trình' },
    { id: 'question-bank', name: 'Ngân hàng câu hỏi', icon: HelpCircle, desc: '4 kỹ năng VSTEP' },
    { id: 'exam-bank', name: 'Ngân hàng đề thi', icon: FileText, desc: 'Mock Tests & Đề thi' },
    { id: 'ai-grading', name: 'Chấm điểm & Kiểm duyệt AI', icon: Brain, desc: 'Kiểm tra bài AI chấm' },
    { id: 'classes', name: 'Quản lý lớp học', icon: Users, desc: 'Lớp học & phân quyền' },
    { id: 'analytics', name: 'Báo cáo – Analytics', icon: Activity, desc: 'Thống kê & biểu đồ' },
    { id: 'settings', name: 'Cài đặt hệ thống', icon: Settings, desc: 'Phân quyền & cấu hình' },
  ];

  // Teacher Tabs
  const teacherTabs = [
    { id: 'dashboard', name: 'Dashboard giáo viên', icon: BarChart3, desc: 'Tổng quan giảng dạy' },
    { id: 'my-classes', name: 'Lớp học của tôi', icon: Users, desc: 'Danh sách lớp đang dạy' },
    { id: 'student-progress', name: 'Theo dõi tiến độ học viên', icon: TrendingUp, desc: 'Xem tiến bộ học viên' },
    { id: 'grade-writing', name: 'Chấm Writing', icon: Edit, desc: 'Chấm bài viết VSTEP' },
    { id: 'grade-speaking', name: 'Chấm Speaking', icon: Mic, desc: 'Chấm nói theo rubric' },
    { id: 'materials', name: 'Tài liệu – Bài học', icon: BookMarked, desc: 'Quản lý tài liệu' },
    { id: 'assignments', name: 'Đề thi – Bài tập', icon: ClipboardList, desc: 'Tạo đề & bài tập' },
    { id: 'messages', name: 'Tin nhắn – Giao tiếp', icon: MessageSquare, desc: 'Nhắn tin học viên' },
    { id: 'profile', name: 'Hồ sơ – Cài đặt', icon: Settings, desc: 'Cài đặt cá nhân' },
  ];

  // Student Tabs
  const studentTabs = [
    { id: 'dashboard', name: 'Dashboard học viên', icon: BarChart3, desc: 'Tổng quan học tập' },
    { id: 'my-courses', name: 'Khóa học của tôi', icon: BookOpen, desc: 'Danh sách khóa học' },
    { id: 'practice', name: 'Luyện tập', icon: Zap, desc: 'Bài tập luyện tập' },
    { id: 'mock-tests', name: 'Đề thi thử', icon: FileText, desc: 'Thực hành đề thi' },
    { id: 'results', name: 'Kết quả', icon: CheckCircle, desc: 'Xem kết quả' },
    { id: 'learning-path', name: 'Đường lối học tập', icon: Activity, desc: 'Lộ trình học tập' },
    { id: 'achievements', name: 'Thành tựu', icon: Award, desc: 'Xem thành tựu' },
    { id: 'schedule', name: 'Lịch học', icon: Calendar, desc: 'Xem lịch học' },
  ];

  const activeTab = userRole === 'admin' ? activeAdminTab : userRole === 'teacher' ? activeTeacherTab : activeStudentTab;
  const currentTabs = userRole === 'admin' ? adminTabs : userRole === 'teacher' ? teacherTabs : studentTabs;

  // Mock data for dashboard stats
  const adminStats = {
    students: 15234,
    teachers: 156,
    courses: 45,
    exams: 342,
    todayVisits: 1249,
    completionRate: 78.5,
  };

  const teacherStats = {
    classes: 4,
    students: 89,
    pendingWriting: 12,
    pendingSpeaking: 8,
    avgScore: 7.2,
  };

  const studentStats = {
    courses: 5,
    completedLessons: 20,
    practiceSessions: 15,
    mockTests: 3,
    achievements: 2,
  };

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Users className="size-10 opacity-80" />
            <TrendingUp className="size-5" />
          </div>
          <h3 className="text-3xl mb-1">{adminStats.students.toLocaleString()}</h3>
          <p className="text-blue-100 text-sm">Tổng học viên</p>
          <p className="text-xs text-blue-100 mt-2">+12.5% vs tháng trước</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <GraduationCap className="size-10 opacity-80" />
            <TrendingUp className="size-5" />
          </div>
          <h3 className="text-3xl mb-1">{adminStats.teachers}</h3>
          <p className="text-purple-100 text-sm">Giáo viên</p>
          <p className="text-xs text-purple-100 mt-2">+8.2% vs tháng trước</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Activity className="size-10 opacity-80" />
            <TrendingUp className="size-5" />
          </div>
          <h3 className="text-3xl mb-1">{adminStats.todayVisits.toLocaleString()}</h3>
          <p className="text-green-100 text-sm">Truy cập hôm nay</p>
          <p className="text-xs text-green-100 mt-2">+18.3% vs hôm qua</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Award className="size-10 opacity-80" />
            <TrendingUp className="size-5" />
          </div>
          <h3 className="text-3xl mb-1">{adminStats.completionRate}%</h3>
          <p className="text-orange-100 text-sm">Tỉ lệ hoàn thành</p>
          <p className="text-xs text-orange-100 mt-2">+5.1% vs tuần trước</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top học viên nổi bật */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">🏆 Top học viên nổi bật</h3>
            <button className="text-sm text-blue-600 hover:underline">Xem tất cả</button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Nguyễn Văn A', score: 8.5, badge: '🥇' },
              { name: 'Trần Thị B', score: 8.2, badge: '🥈' },
              { name: 'Lê Văn C', score: 8.0, badge: '🥉' },
              { name: 'Phạm Thị D', score: 7.8, badge: '⭐' },
              { name: 'Hoàng Văn E', score: 7.5, badge: '⭐' },
            ].map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{student.badge}</span>
                  <div>
                    <p className="text-sm">{student.name}</p>
                    <p className="text-xs text-gray-500">Điểm trung bình</p>
                  </div>
                </div>
                <div className="text-xl font-semibold text-blue-600">{student.score}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Thông báo hệ thống */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">🔔 Thông báo hệ thống</h3>
            <button className="text-sm text-blue-600 hover:underline">Quản lý</button>
          </div>
          <div className="space-y-3">
            {[
              { type: 'info', message: '12 bài Writing mới cần kiểm duyệt AI', time: '5 phút trước' },
              { type: 'success', message: '89 học viên hoàn thành bài thi hôm nay', time: '1 giờ trước' },
              { type: 'warning', message: 'Server backup lúc 2:00 AM ngày mai', time: '2 giờ trước' },
              { type: 'info', message: '3 giáo viên mới đăng ký chờ duyệt', time: '3 giờ trước' },
            ].map((notif, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                notif.type === 'info' ? 'bg-blue-50 border-blue-500' :
                notif.type === 'success' ? 'bg-green-50 border-green-500' :
                'bg-yellow-50 border-yellow-500'
              }`}>
                <p className="text-sm mb-1">{notif.message}</p>
                <p className="text-xs text-gray-500">{notif.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg mb-4">📊 Lượng truy cập theo ngày (7 ngày gần nhất)</h3>
        <div className="h-64 flex items-end justify-around gap-2">
          {[920, 1050, 880, 1200, 1100, 1350, 1249].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg hover:from-blue-600 hover:to-blue-400 transition-all cursor-pointer" style={{ height: `${(value / 1400) * 100}%` }}></div>
              <div className="text-xs text-gray-600">T{index + 2}</div>
              <div className="text-xs text-gray-500">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTeacherDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <Users className="size-8 opacity-80 mb-3" />
          <h3 className="text-3xl mb-1">{teacherStats.classes}</h3>
          <p className="text-blue-100 text-sm">Lớp đang dạy</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <GraduationCap className="size-8 opacity-80 mb-3" />
          <h3 className="text-3xl mb-1">{teacherStats.students}</h3>
          <p className="text-purple-100 text-sm">Học viên</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <Edit className="size-8 opacity-80 mb-3" />
          <h3 className="text-3xl mb-1">{teacherStats.pendingWriting}</h3>
          <p className="text-orange-100 text-sm">Writing cần chấm</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <Mic className="size-8 opacity-80 mb-3" />
          <h3 className="text-3xl mb-1">{teacherStats.pendingSpeaking}</h3>
          <p className="text-green-100 text-sm">Speaking cần chấm</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <Award className="size-8 opacity-80 mb-3" />
          <h3 className="text-3xl mb-1">{teacherStats.avgScore}</h3>
          <p className="text-indigo-100 text-sm">Điểm TB lớp</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lịch buổi dạy */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">📅 Lịch buổi dạy hôm nay</h3>
            <button className="text-sm text-blue-600 hover:underline">Xem tuần</button>
          </div>
          <div className="space-y-3">
            {[
              { time: '08:00 - 09:30', class: 'Lớp B1-01', topic: 'Speaking Part 3', students: 25 },
              { time: '10:00 - 11:30', class: 'Lớp B2-03', topic: 'Writing Task 2', students: 20 },
              { time: '14:00 - 15:30', class: 'Lớp C1-01', topic: 'Reading Skills', students: 15 },
            ].map((schedule, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-lg shadow-sm">
                  <Clock className="size-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-1">{schedule.time}</p>
                  <p className="mb-1">{schedule.class}</p>
                  <p className="text-sm text-gray-600">{schedule.topic} • {schedule.students} học viên</p>
                </div>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  Vào lớp
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bài cần chấm */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">✍️ Bài cần chấm gấp</h3>
            <button className="text-sm text-blue-600 hover:underline">Xem tất cả</button>
          </div>
          <div className="space-y-3">
            {[
              { student: 'Nguyễn Văn A', type: 'Writing Task 2', time: '30 phút trước', priority: 'high' },
              { student: 'Trần Thị B', type: 'Speaking Part 3', time: '1 giờ trước', priority: 'high' },
              { student: 'Lê Văn C', type: 'Writing Task 1', time: '2 giờ trước', priority: 'medium' },
              { student: 'Phạm Thị D', type: 'Speaking Part 2', time: '3 giờ trước', priority: 'medium' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="text-sm mb-1">{item.student}</p>
                  <p className="text-xs text-gray-600">{item.type}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    item.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.priority === 'high' ? 'Gấp' : 'Bình thường'}
                  </span>
                  <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Edit className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <BookOpen className="size-8 opacity-80 mb-3" />
          <h3 className="text-3xl mb-1">{studentStats.courses}</h3>
          <p className="text-blue-100 text-sm">Khóa học</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Activity className="size-8 opacity-80 mb-3" />
          <h3 className="text-3xl mb-1">{studentStats.completedLessons}</h3>
          <p className="text-purple-100 text-sm">Bài học hoàn thành</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <Zap className="size-8 opacity-80 mb-3" />
          <h3 className="text-3xl mb-1">{studentStats.practiceSessions}</h3>
          <p className="text-orange-100 text-sm">Luyện tập</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <FileText className="size-8 opacity-80 mb-3" />
          <h3 className="text-3xl mb-1">{studentStats.mockTests}</h3>
          <p className="text-green-100 text-sm">Đề thi thử</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <Award className="size-8 opacity-80 mb-3" />
          <h3 className="text-3xl mb-1">{studentStats.achievements}</h3>
          <p className="text-indigo-100 text-sm">Thành tựu</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lịch học */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">📅 Lịch học hôm nay</h3>
            <button className="text-sm text-blue-600 hover:underline">Xem tuần</button>
          </div>
          <div className="space-y-3">
            {[
              { time: '08:00 - 09:30', class: 'Lớp B1-01', topic: 'Speaking Part 3', students: 25 },
              { time: '10:00 - 11:30', class: 'Lớp B2-03', topic: 'Writing Task 2', students: 20 },
              { time: '14:00 - 15:30', class: 'Lớp C1-01', topic: 'Reading Skills', students: 15 },
            ].map((schedule, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-lg shadow-sm">
                  <Clock className="size-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-1">{schedule.time}</p>
                  <p className="mb-1">{schedule.class}</p>
                  <p className="text-sm text-gray-600">{schedule.topic} • {schedule.students} học viên</p>
                </div>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  Vào lớp
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bài tập cần làm */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">✍️ Bài tập cần làm</h3>
            <button className="text-sm text-blue-600 hover:underline">Xem tất cả</button>
          </div>
          <div className="space-y-3">
            {[
              { student: 'Nguyễn Văn A', type: 'Writing Task 2', time: '30 phút trước', priority: 'high' },
              { student: 'Trần Thị B', type: 'Speaking Part 3', time: '1 giờ trước', priority: 'high' },
              { student: 'Lê Văn C', type: 'Writing Task 1', time: '2 giờ trước', priority: 'medium' },
              { student: 'Phạm Thị D', type: 'Speaking Part 2', time: '3 giờ trước', priority: 'medium' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="text-sm mb-1">{item.student}</p>
                  <p className="text-xs text-gray-600">{item.type}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    item.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.priority === 'high' ? 'Gấp' : 'Bình thường'}
                  </span>
                  <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Edit className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (userRole === 'admin') {
      switch (activeAdminTab) {
        case 'dashboard':
          return renderAdminDashboard();
        case 'students':
          return (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl">Danh sách học viên</h3>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Upload className="size-4" />
                    <span className="text-sm">Import</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="size-4" />
                    <span className="text-sm">Thêm học viên</span>
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">ID</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Họ tên</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Email</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Lớp</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Trình độ</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Tiến độ</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', class: 'B1-01', level: 'B1', progress: 75 },
                      { id: 2, name: 'Trần Thị B', email: 'tranthib@gmail.com', class: 'B2-03', level: 'B2', progress: 82 },
                      { id: 3, name: 'Lê Văn C', email: 'levanc@gmail.com', class: 'A2-02', level: 'A2', progress: 60 },
                    ].map((student) => (
                      <tr key={student.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">#{student.id}</td>
                        <td className="py-3 px-4 text-sm">{student.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{student.email}</td>
                        <td className="py-3 px-4 text-sm">{student.class}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{student.level}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600" style={{ width: `${student.progress}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-600">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button className="p-1 hover:bg-gray-200 rounded" title="Xem chi tiết">
                              <Eye className="size-4 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded" title="Chỉnh sửa">
                              <Edit className="size-4 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded" title="Xóa">
                              <Trash2 className="size-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        default:
          return (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="size-12 text-gray-400" />
              </div>
              <h3 className="text-xl text-gray-900 mb-2">Chức năng đang phát triển</h3>
              <p className="text-gray-600">Module "{currentTabs.find(t => t.id === activeAdminTab)?.name}" đang được xây dựng.</p>
            </div>
          );
      }
    } else if (userRole === 'teacher') {
      switch (activeTeacherTab) {
        case 'dashboard':
          return renderTeacherDashboard();
        case 'my-classes':
          return <ClassManagementTeacherPage />;
        default:
          return (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="size-12 text-gray-400" />
              </div>
              <h3 className="text-xl text-gray-900 mb-2">Chức năng đang phát triển</h3>
              <p className="text-gray-600">Module "{currentTabs.find(t => t.id === activeTeacherTab)?.name}" đang được xây dựng.</p>
            </div>
          );
      }
    } else {
      switch (activeStudentTab) {
        case 'dashboard':
          return renderStudentDashboard();
        default:
          return (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="size-12 text-gray-400" />
              </div>
              <h3 className="text-xl text-gray-900 mb-2">Chức năng đang phát triển</h3>
              <p className="text-gray-600">Module "{currentTabs.find(t => t.id === activeStudentTab)?.name}" đang được xây dựng.</p>
            </div>
          );
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="size-6" />
          </button>
          <div>
            <h2 className="text-2xl">
              {userRole === 'admin' ? 'Admin Dashboard' : userRole === 'teacher' ? 'Dashboard Giáo Viên' : 'Dashboard Học Viên'}
            </h2>
            <p className="text-gray-600">
              {userRole === 'admin' 
                ? 'Quản lý và giám sát hệ thống VSTEPRO' 
                : userRole === 'teacher'
                ? 'Quản lý lớp học và chấm điểm'
                : 'Quản lý khóa học và tiến trình học tập'}
            </p>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-3">
          <SwitchRoleButton
            currentRole={userRole}
            onRoleChange={setUserRole}
          />
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md px-8 py-5 border border-blue-100">
        <div className="flex items-center gap-3">
          <Home className="size-5 text-blue-500" />
          <ChevronRight className="size-5 text-gray-400" />
          <span className="text-gray-700">
            {userRole === 'admin' ? 'Admin Panel' : userRole === 'teacher' ? 'Teacher Panel' : 'Student Panel'}
          </span>
          <ChevronRight className="size-5 text-gray-400" />
          <span className="text-blue-600 font-medium">
            {currentTabs.find(t => {
              if (userRole === 'admin') return t.id === activeAdminTab;
              if (userRole === 'teacher') return t.id === activeTeacherTab;
              return t.id === activeStudentTab;
            })?.name || 'Dashboard'}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-3 bg-gray-50">
          {currentTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = userRole === 'admin' 
              ? activeAdminTab === tab.id 
              : userRole === 'teacher'
              ? activeTeacherTab === tab.id
              : activeStudentTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (userRole === 'admin') {
                    setActiveAdminTab(tab.id as AdminTab);
                  } else if (userRole === 'teacher') {
                    setActiveTeacherTab(tab.id as TeacherTab);
                  } else {
                    setActiveStudentTab(tab.id as StudentTab);
                  }
                }}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon className="size-6" />
                <span className="text-xs text-center leading-tight">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        {(activeAdminTab !== 'dashboard' || activeTeacherTab !== 'dashboard' || activeStudentTab !== 'dashboard') && (
          <div className="flex items-center gap-3 p-4 border-t border-gray-200">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter className="size-4" />
              <span className="text-sm">Lọc</span>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Missing Mic icon import workaround
function Mic({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}