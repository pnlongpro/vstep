import { useState } from 'react';
import { ArrowLeft, BookOpen, Calendar, Clock, Users, Bell, FileText, TrendingUp, CheckCircle, AlertCircle, PlayCircle, Eye, Download, Send, Award, Target, Brain, Zap, User, Video, Link as LinkIcon, Headphones, Mic, PenTool } from 'lucide-react';
import { StudentHistoryModalAdvanced } from './StudentHistoryModalAdvanced';

interface ClassDetailPageProps {
  onBack: () => void;
}

export function ClassDetailPage({ onBack }: ClassDetailPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Mock class data
  const classInfo = {
    name: 'VSTEP B2 Intensive – Khóa 12',
    level: 'B2',
    teacher: {
      name: 'Nguyễn Thị Mai',
      avatar: '👩‍🏫'
    },
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
    averageGPA: 7.5
  };

  // Mock assignments data
  const pendingAssignments = [
    {
      id: 1,
      title: 'Reading Comprehension - Climate Change',
      skill: 'reading',
      level: 'B2',
      deadline: '20/12/2024',
      status: 'pending',
      questions: 10
    },
    {
      id: 2,
      title: 'Listening Practice - University Life',
      skill: 'listening',
      level: 'B2',
      deadline: '22/12/2024',
      status: 'in-progress',
      questions: 15,
      progress: 40
    },
    {
      id: 3,
      title: 'Essay Writing - Technology Impact',
      skill: 'writing',
      level: 'B2',
      deadline: '25/12/2024',
      status: 'pending',
      questions: 1
    }
  ];

  const completedAssignments = [
    {
      id: 4,
      title: 'Reading Multiple Choice - Education',
      skill: 'reading',
      level: 'B2',
      completedDate: '15/12/2024',
      score: 8.5,
      feedback: 'Tốt'
    },
    {
      id: 5,
      title: 'Speaking Part 2 - Daily Routine',
      skill: 'speaking',
      level: 'B2',
      completedDate: '14/12/2024',
      score: 7.8,
      feedback: 'Phát âm tốt'
    }
  ];

  // Mock schedule data
  const scheduleData = [
    {
      id: 1,
      date: '17/12/2024',
      day: 'Thứ 3',
      time: '19:00-21:00',
      topic: 'Reading Strategies - Skimming & Scanning',
      status: 'completed',
      zoomLink: 'https://zoom.us/j/123456'
    },
    {
      id: 2,
      date: '19/12/2024',
      day: 'Thứ 5',
      time: '19:00-21:00',
      topic: 'Listening Practice - Note-taking Skills',
      status: 'completed',
      zoomLink: 'https://zoom.us/j/123456'
    },
    {
      id: 3,
      date: '24/12/2024',
      day: 'Thứ 3',
      time: '19:00-21:00',
      topic: 'Writing Task 2 - Essay Structure',
      status: 'upcoming',
      zoomLink: 'https://zoom.us/j/123456'
    }
  ];

  // Mock members data
  const members = [
    {
      id: 1,
      name: 'Nguyễn Thị Mai',
      role: 'teacher',
      avatar: '👩‍🏫',
      online: true
    },
    {
      id: 2,
      name: 'Trần Văn An',
      role: 'assistant',
      avatar: '👨‍💼',
      online: false
    },
    {
      id: 3,
      name: 'Lê Thị Hoa',
      role: 'student',
      avatar: '👩‍🎓',
      online: true
    },
    {
      id: 4,
      name: 'Phạm Minh Tuấn',
      role: 'student',
      avatar: '👨‍🎓',
      online: true
    }
  ];

  // Mock announcements
  const announcements = [
    {
      id: 1,
      title: 'Thay đổi lịch học ngày 26/12',
      content: 'Lớp học ngày 26/12 sẽ chuyển sang 19:30-21:30 do giáo viên có việc đột xuất.',
      author: 'Nguyễn Thị Mai',
      date: '15/12/2024',
      pinned: true
    },
    {
      id: 2,
      title: 'Bài tập mới đã được giao',
      content: 'Các bạn vào tab Bài tập để xem 3 bài mới được giao hôm nay.',
      author: 'Nguyễn Thị Mai',
      date: '14/12/2024',
      pinned: false
    }
  ];

  // Mock materials
  const materials = [
    {
      id: 1,
      title: 'Slide bài giảng - Reading Strategies',
      type: 'pdf',
      uploadDate: '17/12/2024',
      uploadBy: 'Nguyễn Thị Mai',
      size: '2.5 MB'
    },
    {
      id: 2,
      title: 'Audio - Listening Practice Unit 5',
      type: 'audio',
      uploadDate: '16/12/2024',
      uploadBy: 'Nguyễn Thị Mai',
      size: '15 MB'
    },
    {
      id: 3,
      title: 'Video - Speaking Tips & Tricks',
      type: 'video',
      uploadDate: '15/12/2024',
      uploadBy: 'Nguyễn Thị Mai',
      size: '45 MB'
    }
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
      case 'overdue': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Quá hạn</span>;
      default: return null;
    }
  };

  const mockStudent = {
    name: 'Lê Thị Hoa',
    id: 'SV001'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Thông tin lớp học */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Back button */}
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4"
          >
            <ArrowLeft className="size-5" />
            <span>Quay lại danh sách lớp</span>
          </button>

          {/* Class Info */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{classInfo.name}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Award className="size-5 text-blue-600" />
                  <span>Trình độ: <strong className="text-blue-600">{classInfo.level}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="size-5 text-blue-600" />
                  <span>{classInfo.teacher.avatar} {classInfo.teacher.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-5 text-blue-600" />
                  <span>{classInfo.startDate} - {classInfo.endDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-blue-600" />
                  <span>{classInfo.schedule}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                {classInfo.status}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Tiến độ học tập</span>
              <span className="text-sm font-medium text-blue-600">{classInfo.progress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${classInfo.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'assignments'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              Bài tập
              {pendingAssignments.length > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">
                  {pendingAssignments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              Lịch sử làm bài
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'schedule'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              Lịch học
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'members'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              Thành viên
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'announcements'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              Thông báo
              {announcements.filter(a => a.pinned).length > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">
                  {announcements.filter(a => a.pinned).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'materials'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              Tài liệu
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'results'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              Kết quả & Đánh giá
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* TAB 1: Tổng quan */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Buổi học</p>
                    <p className="text-2xl font-bold">{classInfo.completedSessions}/{classInfo.totalSessions}</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(classInfo.completedSessions / classInfo.totalSessions) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bài tập hoàn thành</p>
                    <p className="text-2xl font-bold">{classInfo.completedAssignments}/{classInfo.totalAssignments}</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                  <div 
                    className="h-full bg-green-600 rounded-full"
                    style={{ width: `${(classInfo.completedAssignments / classInfo.totalAssignments) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertCircle className="size-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bài tập chưa làm</p>
                    <p className="text-2xl font-bold text-yellow-600">{classInfo.pendingAssignments}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">Cần hoàn thành sớm</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">GPA Trung bình</p>
                    <p className="text-2xl font-bold text-purple-600">{classInfo.averageGPA}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">Tốt! Tiếp tục phát huy</p>
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Thông báo mới nhất</h3>
              <div className="space-y-3">
                {announcements.slice(0, 3).map(announcement => (
                  <div key={announcement.id} className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Bell className="size-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{announcement.title}</h4>
                          {announcement.pinned && (
                            <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs">Quan trọng</span>
                          )}
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

        {/* TAB 2: Bài tập */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            {/* Bài tập chưa làm */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="size-5 text-yellow-600" />
                Bài tập chưa làm ({pendingAssignments.length})
              </h3>
              <div className="space-y-3">
                {pendingAssignments.map(assignment => (
                  <div key={assignment.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getSkillIcon(assignment.skill)}
                          <h4 className="font-medium">{assignment.title}</h4>
                          <span className={`px-2 py-0.5 text-xs rounded ${getSkillColor(assignment.skill)}`}>
                            {assignment.skill.toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            {assignment.level}
                          </span>
                          {getStatusBadge(assignment.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>📝 {assignment.questions} câu hỏi</span>
                          <span>⏰ Hạn: {assignment.deadline}</span>
                          {assignment.progress && (
                            <span className="text-blue-600">Đã làm {assignment.progress}%</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {assignment.status === 'pending' ? (
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <PlayCircle className="size-4" />
                            Bắt đầu
                          </button>
                        ) : (
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                            <PlayCircle className="size-4" />
                            Làm tiếp
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bài tập đã làm */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="size-5 text-green-600" />
                Bài tập đã làm ({completedAssignments.length})
              </h3>
              <div className="space-y-3">
                {completedAssignments.map(assignment => (
                  <div key={assignment.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getSkillIcon(assignment.skill)}
                          <h4 className="font-medium">{assignment.title}</h4>
                          <span className={`px-2 py-0.5 text-xs rounded ${getSkillColor(assignment.skill)}`}>
                            {assignment.skill.toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            {assignment.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>✅ Hoàn thành: {assignment.completedDate}</span>
                          <span className="text-green-600 font-medium">Điểm: {assignment.score}</span>
                          <span>💬 {assignment.feedback}</span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                        <Eye className="size-4" />
                        Xem lại
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Lịch sử làm bài */}
        {activeTab === 'history' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Lịch sử làm bài của bạn</h3>
                <p className="text-sm text-gray-500">Xem lại tất cả bài luyện đã hoàn thành trong lớp</p>
              </div>
              <button 
                onClick={() => setShowHistoryModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Xem chi tiết
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tổng số bài</p>
                <p className="text-2xl font-bold text-blue-600">32</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Điểm TB</p>
                <p className="text-2xl font-bold text-green-600">7.5</p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Kỹ năng mạnh</p>
                <p className="text-lg font-medium text-purple-600">Reading</p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Cần cải thiện</p>
                <p className="text-lg font-medium text-orange-600">Writing</p>
              </div>
            </div>

            {/* Recent Practice */}
            <div>
              <h4 className="font-medium mb-3">Bài luyện gần đây</h4>
              <div className="space-y-2">
                {completedAssignments.map(assignment => (
                  <div key={assignment.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getSkillIcon(assignment.skill)}
                      <div>
                        <p className="font-medium text-sm">{assignment.title}</p>
                        <p className="text-xs text-gray-500">{assignment.completedDate}</p>
                      </div>
                    </div>
                    <span className="text-lg font-medium text-green-600">{assignment.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Lịch học */}
        {activeTab === 'schedule' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Lịch học lớp {classInfo.name}</h3>
            <div className="space-y-3">
              {scheduleData.map(session => (
                <div key={session.id} className={`p-4 border rounded-lg ${
                  session.status === 'completed' ? 'border-gray-200 bg-gray-50' : 'border-blue-200 bg-blue-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {session.status === 'completed' ? (
                        <CheckCircle className="size-6 text-green-600" />
                      ) : (
                        <Clock className="size-6 text-blue-600" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{session.topic}</h4>
                          {session.status === 'upcoming' && (
                            <span className="px-2 py-0.5 bg-blue-500 text-white rounded text-xs">Sắp tới</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>📅 {session.day}, {session.date}</span>
                          <span>🕐 {session.time}</span>
                        </div>
                      </div>
                    </div>
                    {session.status === 'upcoming' && (
                      <a 
                        href={session.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      >
                        <Video className="size-4" />
                        Tham gia Zoom
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Thành viên */}
        {activeTab === 'members' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Thành viên lớp ({members.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map(member => (
                <div key={member.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="text-3xl">{member.avatar}</div>
                      {member.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">
                        {member.role === 'teacher' ? 'Giáo viên' : 
                         member.role === 'assistant' ? 'Trợ giảng' : 'Học viên'}
                      </p>
                    </div>
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                      <Send className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Thông báo */}
        {activeTab === 'announcements' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Thông báo lớp học</h3>
            <div className="space-y-4">
              {announcements.map(announcement => (
                <div key={announcement.id} className={`p-5 rounded-lg border ${
                  announcement.pinned 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-start gap-3">
                    <Bell className={`size-5 mt-1 ${announcement.pinned ? 'text-red-600' : 'text-blue-600'}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{announcement.title}</h4>
                        {announcement.pinned && (
                          <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs">📌 Ghim</span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{announcement.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>👤 {announcement.author}</span>
                        <span>📅 {announcement.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: Tài liệu */}
        {activeTab === 'materials' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Tài liệu học tập</h3>
            <div className="space-y-3">
              {materials.map(material => (
                <div key={material.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {material.type === 'pdf' && <FileText className="size-6 text-red-600" />}
                      {material.type === 'audio' && <Headphones className="size-6 text-green-600" />}
                      {material.type === 'video' && <Video className="size-6 text-purple-600" />}
                      <div>
                        <h4 className="font-medium">{material.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>📤 {material.uploadBy}</span>
                          <span>📅 {material.uploadDate}</span>
                          <span>📦 {material.size}</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <Download className="size-4" />
                      Tải xuống
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: Kết quả & Đánh giá */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Điểm tổng hợp trong lớp</p>
                  <p className="text-5xl font-bold">{classInfo.averageGPA}</p>
                  <p className="text-sm opacity-90 mt-2">Xếp loại: <strong>Giỏi</strong></p>
                </div>
                <Award className="size-20 opacity-20" />
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Phân tích theo kỹ năng</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="size-5 text-blue-600" />
                      <span className="font-medium">Reading</span>
                    </div>
                    <span className="font-bold text-blue-600">7.8</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Headphones className="size-5 text-green-600" />
                      <span className="font-medium">Listening</span>
                    </div>
                    <span className="font-bold text-green-600">7.3</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: '73%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <PenTool className="size-5 text-purple-600" />
                      <span className="font-medium">Writing</span>
                    </div>
                    <span className="font-bold text-purple-600">7.0</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Mic className="size-5 text-orange-600" />
                      <span className="font-medium">Speaking</span>
                    </div>
                    <span className="font-bold text-orange-600">7.5</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full">
                    <div className="h-full bg-orange-600 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Feedback */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Nhận xét của giáo viên</h3>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-gray-700 mb-3">
                  Hoa có sự tiến bộ rõ rệt trong kỹ năng Reading và Speaking. Tuy nhiên, cần tập trung nhiều hơn vào Writing, đặc biệt là phát triển ý và sử dụng từ vựng học thuật. Tiếp tục phát huy!
                </p>
                <p className="text-sm text-gray-500">— {classInfo.teacher.name} • 15/12/2024</p>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="size-5 text-purple-600" />
                Đề xuất cải thiện từ AI
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg flex items-start gap-3">
                  <Target className="size-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Tăng cường Writing</h4>
                    <p className="text-sm text-gray-700">Luyện viết Essay 3 lần/tuần với các chủ đề VSTEP phổ biến</p>
                  </div>
                </div>
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-start gap-3">
                  <Zap className="size-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Luyện Listening nâng cao</h4>
                    <p className="text-sm text-gray-700">Thực hành với audio tốc độ nhanh và giọng đa dạng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student History Modal */}
      {showHistoryModal && (
        <StudentHistoryModalAdvanced 
          onClose={() => setShowHistoryModal(false)}
          student={mockStudent}
        />
      )}
    </div>
  );
}
