// Teacher ClassDetailPage - PURPLE theme, NO add/import student buttons
import { useState } from 'react';
import { ArrowLeft, BookOpen, Calendar, Clock, Users, Bell, FileText, TrendingUp, CheckCircle, AlertCircle, Eye, Download, Award, Target, Brain, Zap, User, Video, Headphones, Mic, PenTool } from 'lucide-react';
import { StudentHistoryModalAdvanced } from './StudentHistoryModalAdvanced';
import { ScheduleManager } from './ScheduleManager';

interface ClassDetailPageTeacherProps {
  onBack: () => void;
  classData?: any;
}

export function ClassDetailPageTeacher({ onBack, classData }: ClassDetailPageTeacherProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const classInfo = {
    name: 'VSTEP B2 Intensive – Khóa 12',
    level: 'B2',
    teacher: { name: 'Nguyễn Thị Mai', avatar: '👩‍🏫' },
    startDate: '01/09/2024',
    endDate: '30/12/2024',
    schedule: 'Thứ 3 – Thứ 5 | 19:00–21:00',
    status: 'Đang học',
    progress: 68,
    totalSessions: 36,
    completedSessions: 24,
    totalAssignments: 45,
    completedAssignments: 32,
    pendingAssignments: 8,
    averageGPA: 7.5,
    totalStudents: 25,
    activeStudents: 23
  };

  const pendingAssignments = [
    { id: 1, title: 'Reading Comprehension - Climate Change', skill: 'reading', level: 'B2', deadline: '20/12/2024', status: 'pending', questions: 10, assignedCount: 25, completedCount: 17 },
    { id: 2, title: 'Listening Practice - University Life', skill: 'listening', level: 'B2', deadline: '22/12/2024', status: 'in-progress', questions: 15, progress: 40, assignedCount: 25, completedCount: 10 },
    { id: 3, title: 'Essay Writing - Technology Impact', skill: 'writing', level: 'B2', deadline: '25/12/2024', status: 'pending', questions: 1, assignedCount: 25, completedCount: 5 }
  ];

  const completedAssignments = [
    { id: 4, title: 'Reading Multiple Choice - Education', skill: 'reading', level: 'B2', completedDate: '15/12/2024', avgScore: 8.2, assignedCount: 25, completedCount: 25 },
    { id: 5, title: 'Speaking Part 2 - Daily Routine', skill: 'speaking', level: 'B2', completedDate: '14/12/2024', avgScore: 7.6, assignedCount: 25, completedCount: 24 }
  ];

  const scheduleData = [
    { id: 1, date: '17/12/2024', day: 'Thứ 3', time: '19:00-21:00', topic: 'Reading Strategies - Skimming & Scanning', status: 'completed', attendance: 23, total: 25, zoomLink: 'https://zoom.us/j/123456' },
    { id: 2, date: '19/12/2024', day: 'Thứ 5', time: '19:00-21:00', topic: 'Listening Practice - Note-taking Skills', status: 'completed', attendance: 24, total: 25, zoomLink: 'https://zoom.us/j/123456' },
    { id: 3, date: '24/12/2024', day: 'Thứ 3', time: '19:00-21:00', topic: 'Writing Task 2 - Essay Structure', status: 'upcoming', attendance: 0, total: 25, zoomLink: 'https://zoom.us/j/123456' }
  ];

  const members = [
    { id: 1, name: 'Nguyễn Thị Mai', role: 'teacher', avatar: '👩‍🏫', online: true, email: 'mai.nguyen@vstep.edu.vn' },
    { id: 2, name: 'Trần Văn An', role: 'assistant', avatar: '👨‍💼', online: false, email: 'an.tran@vstep.edu.vn' },
    { id: 3, name: 'Lê Thị Hoa', role: 'student', avatar: '👩‍🎓', online: true, email: 'hoa.le@student.vstep.edu.vn', progress: 72, gpa: 7.8 },
    { id: 4, name: 'Phạm Minh Tuấn', role: 'student', avatar: '👨‍🎓', online: true, email: 'tuan.pham@student.vstep.edu.vn', progress: 65, gpa: 7.2 },
    { id: 5, name: 'Võ Thị Lan', role: 'student', avatar: '👩‍🎓', online: false, email: 'lan.vo@student.vstep.edu.vn', progress: 80, gpa: 8.5 }
  ];

  const announcements = [
    { id: 1, title: 'Thay đổi lịch học ngày 26/12', content: 'Lớp học ngày 26/12 sẽ chuyển sang 19:30-21:30 do giáo viên có việc đột xuất.', author: 'Nguyễn Thị Mai', date: '15/12/2024', pinned: true },
    { id: 2, title: 'Bài tập mới đã được giao', content: 'Các bạn vào tab Bài tập để xem 3 bài mới được giao hôm nay.', author: 'Nguyễn Thị Mai', date: '14/12/2024', pinned: false }
  ];

  const materials = [
    { id: 1, title: 'Slide bài giảng - Reading Strategies', type: 'pdf', uploadDate: '17/12/2024', uploadBy: 'Nguyễn Thị Mai', size: '2.5 MB', downloads: 23 },
    { id: 2, title: 'Audio - Listening Practice Unit 5', type: 'audio', uploadDate: '16/12/2024', uploadBy: 'Nguyễn Thị Mai', size: '15 MB', downloads: 20 },
    { id: 3, title: 'Video - Speaking Tips & Tricks', type: 'video', uploadDate: '15/12/2024', uploadBy: 'Nguyễn Thị Mai', size: '45 MB', downloads: 18 }
  ];

  const gradingSubmissions = [
    { id: 1, student: 'Lê Thị Hoa', skill: 'writing', assignment: 'Essay Writing - Technology Impact', submittedDate: '20/12/2024 14:30', status: 'pending', taskType: 'Task 2', wordCount: 285 },
    { id: 2, student: 'Phạm Minh Tuấn', skill: 'speaking', assignment: 'Speaking Part 2 - Describe a place', submittedDate: '20/12/2024 10:15', status: 'pending', taskType: 'Part 2', duration: '2:45' },
    { id: 3, student: 'Võ Thị Lan', skill: 'writing', assignment: 'Essay Writing - Technology Impact', submittedDate: '19/12/2024 18:20', status: 'grading', taskType: 'Task 2', wordCount: 312, grader: 'Nguyễn Thị Mai' },
    { id: 4, student: 'Nguyễn Văn A', skill: 'speaking', assignment: 'Speaking Part 3 - Discussion', submittedDate: '19/12/2024 16:45', status: 'graded', taskType: 'Part 3', duration: '4:20', score: 7.5, grader: 'Nguyễn Thị Mai', gradedDate: '20/12/2024 09:00' },
    { id: 5, student: 'Trần Thị B', skill: 'writing', assignment: 'Letter Writing - Formal Complaint', submittedDate: '18/12/2024 21:00', status: 'graded', taskType: 'Task 1', wordCount: 178, score: 8.0, grader: 'Nguyễn Thị Mai', gradedDate: '19/12/2024 15:30' }
  ];

  const getSkillIcon = (skill: string) => {
    switch(skill) {
      case 'reading': return <BookOpen className="size-4 text-blue-600" />;
      case 'listening': return <Headphones className="size-4 text-green-600" />;
      case 'writing': return <PenTool className="size-4 text-purple-600" />;
      case 'speaking': return <Mic className="size-4 text-orange-600" />;
      default: return <FileText className="size-4 text-gray-600" />;
    }
  };

  const getSkillColor = (skill: string) => {
    switch(skill) {
      case 'reading': return 'bg-blue-100 text-blue-700';
      case 'listening': return 'bg-green-100 text-green-700';
      case 'writing': return 'bg-purple-100 text-purple-700';
      case 'speaking': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Chưa làm</span>;
      case 'in-progress': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Đang làm</span>;
      case 'completed': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Hoàn thành</span>;
      case 'overdue': return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Quá hạn</span>;
      default: return null;
    }
  };

  const handleViewStudentHistory = (student: any) => {
    setSelectedStudent(student);
    setShowHistoryModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4">
            <ArrowLeft className="size-5" /><span>Quay lại danh sách lớp</span>
          </button>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{classInfo.name}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2"><Award className="size-5 text-purple-600" /><span>Trình độ: <strong className="text-purple-600">{classInfo.level}</strong></span></div>
                <div className="flex items-center gap-2"><User className="size-5 text-purple-600" /><span>{classInfo.teacher.avatar} {classInfo.teacher.name}</span></div>
                <div className="flex items-center gap-2"><Calendar className="size-5 text-purple-600" /><span>{classInfo.startDate} - {classInfo.endDate}</span></div>
                <div className="flex items-center gap-2"><Clock className="size-5 text-purple-600" /><span>{classInfo.schedule}</span></div>
                <div className="flex items-center gap-2"><Users className="size-5 text-purple-600" /><span>{classInfo.activeStudents}/{classInfo.totalStudents} học viên</span></div>
              </div>
            </div>
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">{classInfo.status}</span>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Tiến độ chung của lớp</span>
              <span className="text-sm font-medium text-purple-600">{classInfo.progress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${classInfo.progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            {['overview', 'assignments', 'history', 'schedule', 'members', 'announcements', 'materials', 'grading', 'results'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-purple-600'}`}>
                {tab === 'overview' && 'Tổng quan'}
                {tab === 'assignments' && <>Bài tập {pendingAssignments.length > 0 && <span className="px-2 py-0.5 bg-purple-500 text-white rounded-full text-xs">{pendingAssignments.length}</span>}</>}
                {tab === 'history' && 'Lịch sử làm bài'}
                {tab === 'schedule' && 'Lịch học'}
                {tab === 'members' && 'Thành viên'}
                {tab === 'announcements' && <>Thông báo {announcements.filter(a => a.pinned).length > 0 && <span className="px-2 py-0.5 bg-purple-500 text-white rounded-full text-xs">{announcements.filter(a => a.pinned).length}</span>}</>}
                {tab === 'materials' && 'Tài liệu'}
                {tab === 'grading' && <>Chấm chữa Nói Viết <span className="px-2 py-0.5 bg-orange-500 text-white rounded-full text-xs">{gradingSubmissions.filter(s => s.status === 'pending').length}</span></>}
                {tab === 'results' && 'Kết quả & Thống kê'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg"><Calendar className="size-5 text-purple-600" /></div>
                  <div><p className="text-sm text-gray-600">Buổi học</p><p className="text-2xl font-bold">{classInfo.completedSessions}/{classInfo.totalSessions}</p></div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${(classInfo.completedSessions / classInfo.totalSessions) * 100}%` }} />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="size-5 text-green-600" /></div>
                  <div><p className="text-sm text-gray-600">Bài tập hoàn thành</p><p className="text-2xl font-bold">{classInfo.completedAssignments}/{classInfo.totalAssignments}</p></div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: `${(classInfo.completedAssignments / classInfo.totalAssignments) * 100}%` }} />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-100 rounded-lg"><AlertCircle className="size-5 text-yellow-600" /></div>
                  <div><p className="text-sm text-gray-600">Bài tập chưa làm</p><p className="text-2xl font-bold text-yellow-600">{classInfo.pendingAssignments}</p></div>
                </div>
                <p className="text-xs text-gray-500 mt-3">Cần theo dõi</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg"><TrendingUp className="size-5 text-purple-600" /></div>
                  <div><p className="text-sm text-gray-600">GPA Trung bình</p><p className="text-2xl font-bold text-purple-600">{classInfo.averageGPA}</p></div>
                </div>
                <p className="text-xs text-gray-500 mt-3">Kết quả tốt</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Thông báo mới nhất</h3>
              <div className="space-y-3">
                {announcements.slice(0, 3).map(announcement => (
                  <div key={announcement.id} className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Bell className="size-5 text-purple-600 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{announcement.title}</h4>
                          {announcement.pinned && <span className="px-2 py-0.5 bg-purple-500 text-white rounded text-xs">Quan trọng</span>}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{announcement.content}</p>
                        <p className="text-xs text-gray-500">{announcement.author} • {announcement.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Thành viên lớp ({members.length})</h3>
              <p className="text-sm text-gray-500 mt-1">Chỉ Admin mới có quyền thêm/xóa học viên</p>
            </div>
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Giáo viên & Trợ giảng</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.filter(m => m.role !== 'student').map(member => (
                  <div key={member.id} className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="text-3xl">{member.avatar}</div>
                        {member.online && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{member.role === 'teacher' ? 'Giáo viên' : 'Trợ giảng'}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">Học viên ({members.filter(m => m.role === 'student').length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.filter(m => m.role === 'student').map(member => (
                  <div key={member.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className="text-3xl">{member.avatar}</div>
                        {member.online && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{member.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{member.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-center p-2 bg-gray-50 rounded"><p className="text-xs text-gray-600">Tiến độ</p><p className="font-medium text-purple-600">{member.progress}%</p></div>
                      <div className="text-center p-2 bg-gray-50 rounded"><p className="text-xs text-gray-600">GPA</p><p className="font-medium text-green-600">{member.gpa}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && <ScheduleManager classInfo={classInfo} scheduleData={scheduleData} />}

        {/* Other tabs would continue here with full implementation */}
        {activeTab !== 'overview' && activeTab !== 'members' && activeTab !== 'schedule' && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Tab "{activeTab}"</h3>
            <p className="text-gray-600">Nội dung tab đang được phát triển...</p>
          </div>
        )}
      </div>

      {showHistoryModal && selectedStudent && (
        <StudentHistoryModalAdvanced 
          onClose={() => { setShowHistoryModal(false); setSelectedStudent(null); }} 
          student={selectedStudent} 
        />
      )}
    </div>
  );
}