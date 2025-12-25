import { useState } from 'react';
import { Calendar, BookOpen, Users, Clock, ChevronDown, Filter, TrendingUp, CheckCircle, XCircle, AlertCircle, FileText, ArrowLeft, GraduationCap } from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  description: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking' | 'mixed';
  dueDate: string;
  sessionNumber: number;
  level: 'B1' | 'B2' | 'C1';
  classNames: string[];
  totalStudents: number;
  submitted: number;
  pending: number;
  status: 'active' | 'completed' | 'overdue';
}

interface AssignmentBySessionPageProps {
  sharedLevel: 'B1' | 'B2' | 'C1' | null;
  onLevelChange: (level: 'B1' | 'B2' | 'C1' | null) => void;
}

export function AssignmentBySessionPage({ sharedLevel, onLevelChange }: AssignmentBySessionPageProps) {
  // Use shared level state directly
  const selectedLevel = sharedLevel;
  const [selectedSession, setSelectedSession] = useState<number | 'all'>('all');
  const [selectedSkill, setSelectedSkill] = useState<'all' | 'reading' | 'listening' | 'writing' | 'speaking' | 'mixed'>('all');

  // Mock data - Bài tập được phân theo buổi
  const mockAssignments: Assignment[] = [
    {
      id: 1,
      title: 'Reading Practice - Technology',
      description: 'Bài đọc hiểu về công nghệ',
      skill: 'reading',
      dueDate: '2024-12-25',
      sessionNumber: 1,
      level: 'B2',
      classNames: ['VSTEP B2 - Lớp chiều'],
      totalStudents: 30,
      submitted: 28,
      pending: 2,
      status: 'active'
    },
    {
      id: 2,
      title: 'Listening - Daily Conversations',
      description: 'Nghe hội thoại hàng ngày',
      skill: 'listening',
      dueDate: '2024-12-26',
      sessionNumber: 1,
      level: 'B1',
      classNames: ['VSTEP B1 - Lớp sáng'],
      totalStudents: 25,
      submitted: 25,
      pending: 0,
      status: 'completed'
    },
    {
      id: 3,
      title: 'Writing Task 2 - Opinion Essay',
      description: 'Viết bài luận về môi trường',
      skill: 'writing',
      dueDate: '2024-12-20',
      sessionNumber: 2,
      level: 'C1',
      classNames: ['VSTEP C1 - Lớp tối', 'VSTEP B2 - Lớp chiều'],
      totalStudents: 50,
      submitted: 42,
      pending: 8,
      status: 'overdue'
    },
    {
      id: 4,
      title: 'Speaking Practice - Part 3',
      description: 'Thảo luận về chủ đề xã hội',
      skill: 'speaking',
      dueDate: '2024-12-28',
      sessionNumber: 2,
      level: 'C1',
      classNames: ['VSTEP C1 - Lớp tối'],
      totalStudents: 20,
      submitted: 15,
      pending: 5,
      status: 'active'
    },
    {
      id: 5,
      title: 'Full Test Practice',
      description: 'Đề thi đầy đủ 4 kỹ năng',
      skill: 'mixed',
      dueDate: '2024-12-30',
      sessionNumber: 3,
      level: 'B2',
      classNames: ['VSTEP B2 - Lớp chiều'],
      totalStudents: 30,
      submitted: 10,
      pending: 20,
      status: 'active'
    },
    {
      id: 6,
      title: 'Reading - Academic Texts',
      description: 'Đọc hiểu văn bản học thuật',
      skill: 'reading',
      dueDate: '2024-12-22',
      sessionNumber: 3,
      level: 'B1',
      classNames: ['VSTEP B1 - Lớp sáng'],
      totalStudents: 25,
      submitted: 25,
      pending: 0,
      status: 'completed'
    },
    {
      id: 7,
      title: 'Listening - Lectures',
      description: 'Nghe bài giảng học thuật',
      skill: 'listening',
      dueDate: '2024-12-27',
      sessionNumber: 4,
      level: 'C1',
      classNames: ['VSTEP C1 - Lớp tối'],
      totalStudents: 20,
      submitted: 18,
      pending: 2,
      status: 'active'
    },
    {
      id: 8,
      title: 'Writing Task 1 - Graphs',
      description: 'Mô tả biểu đồ và số liệu',
      skill: 'writing',
      dueDate: '2024-12-29',
      sessionNumber: 5,
      level: 'B2',
      classNames: ['VSTEP B2 - Lớp chiều', 'VSTEP B1 - Lớp sáng'],
      totalStudents: 55,
      submitted: 30,
      pending: 25,
      status: 'active'
    },
  ];

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'reading': return 'from-blue-500 to-cyan-500';
      case 'listening': return 'from-purple-500 to-pink-500';
      case 'writing': return 'from-emerald-500 to-teal-500';
      case 'speaking': return 'from-orange-500 to-red-500';
      case 'mixed': return 'from-gray-700 to-gray-900';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSkillLabel = (skill: string) => {
    switch (skill) {
      case 'reading': return 'Đọc';
      case 'listening': return 'Nghe';
      case 'writing': return 'Viết';
      case 'speaking': return 'Nói';
      case 'mixed': return 'Tổng hợp';
      default: return skill;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đang diễn ra' };
      case 'completed': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Hoàn thành' };
      case 'overdue': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Quá hạn' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Không xác định' };
    }
  };

  // Filter assignments
  const filteredAssignments = mockAssignments.filter(assignment => {
    const matchesLevel = selectedLevel === null || assignment.level === selectedLevel;
    const matchesSession = selectedSession === 'all' || assignment.sessionNumber === selectedSession;
    const matchesSkill = selectedSkill === 'all' || assignment.skill === selectedSkill;
    return matchesLevel && matchesSession && matchesSkill;
  });

  // Group by session
  const assignmentsBySession: Record<number, Assignment[]> = {};
  filteredAssignments.forEach(assignment => {
    if (!assignmentsBySession[assignment.sessionNumber]) {
      assignmentsBySession[assignment.sessionNumber] = [];
    }
    assignmentsBySession[assignment.sessionNumber].push(assignment);
  });

  const sessions = Object.keys(assignmentsBySession).map(Number).sort((a, b) => a - b);

  // Calculate stats
  const totalAssignments = filteredAssignments.length;
  const activeAssignments = filteredAssignments.filter(a => a.status === 'active').length;
  const completedAssignments = filteredAssignments.filter(a => a.status === 'completed').length;
  const totalStudents = filteredAssignments.reduce((sum, a) => sum + a.totalStudents, 0);
  const totalSubmitted = filteredAssignments.reduce((sum, a) => sum + a.submitted, 0);
  const submissionRate = totalStudents > 0 ? Math.round((totalSubmitted / totalStudents) * 100) : 0;

  // Calculate stats per level for level selection screen
  const getLevelStats = (level: 'B1' | 'B2' | 'C1') => {
    const levelAssignments = mockAssignments.filter(a => a.level === level);
    return {
      total: levelAssignments.length,
      active: levelAssignments.filter(a => a.status === 'active').length,
      completed: levelAssignments.filter(a => a.status === 'completed').length,
      students: levelAssignments.reduce((sum, a) => sum + a.totalStudents, 0),
    };
  };

  const getLevelColor = (level: 'B1' | 'B2' | 'C1') => {
    switch (level) {
      case 'B1': return { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500' };
      case 'B2': return { gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-500' };
      case 'C1': return { gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-500' };
    }
  };

  // If no level selected, show level selection screen
  if (selectedLevel === null) {
    const levels: Array<'B1' | 'B2' | 'C1'> = ['B1', 'B2', 'C1'];
    
    return (
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="size-8" />
            <h1 className="text-3xl font-bold">Chọn cấp độ lớp học</h1>
          </div>
          <p className="text-emerald-100">Xem bài tập theo buổi học của từng cấp độ</p>
        </div>

        {/* Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels.map(level => {
            const stats = getLevelStats(level);
            const colors = getLevelColor(level);
            
            return (
              <button
                key={level}
                onClick={() => onLevelChange(level)}
                className={`bg-white rounded-2xl border-2 ${colors.border} hover:shadow-2xl transition-all p-8 text-left group hover:scale-105`}
              >
                {/* Header */}
                <div className={`w-20 h-20 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <GraduationCap className="size-10 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Cấp độ {level}</h2>
                <p className="text-gray-600 mb-6">Xem bài tập theo buổi học</p>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tổng bài tập</span>
                    <span className="text-lg font-bold text-gray-900">{stats.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Đang diễn ra</span>
                    <span className={`text-lg font-bold ${colors.text}`}>{stats.active}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Hoàn thành</span>
                    <span className="text-lg font-bold text-green-600">{stats.completed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tổng học sinh</span>
                    <span className="text-lg font-bold text-gray-900">{stats.students}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className={`mt-6 flex items-center justify-center gap-2 py-3 ${colors.bg} ${colors.text} rounded-lg font-medium group-hover:shadow-md transition-all`}>
                  <span>Xem chi tiết</span>
                  <ArrowLeft className="size-5 rotate-180" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Overall Stats Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng quan toàn bộ</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{mockAssignments.length}</p>
              <p className="text-sm text-gray-600">Tổng bài tập</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">
                {mockAssignments.filter(a => a.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Đang diễn ra</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {mockAssignments.filter(a => a.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Hoàn thành</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If level selected, show assignments by session
  return (
    <div className="space-y-6 p-6">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
        <button
          onClick={() => onLevelChange(null)}
          className="flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        >
          <ArrowLeft className="size-5" />
          <span>Quay lại chọn cấp độ</span>
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="size-8" />
          <h1 className="text-3xl font-bold">Bài tập theo buổi học - Cấp độ {selectedLevel}</h1>
        </div>
        <p className="text-emerald-100">Quản lý bài tập được phân loại theo từng buổi học</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="size-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng bài tập</p>
              <p className="text-2xl font-bold text-gray-900">{totalAssignments}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="size-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Hoàn thành</p>
              <p className="text-2xl font-bold text-green-600">{completedAssignments}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle className="size-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đang diễn ra</p>
              <p className="text-2xl font-bold text-orange-600">{activeAssignments}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="size-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tỷ lệ nộp bài</p>
              <p className="text-2xl font-bold text-purple-600">{submissionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Lọc:</span>
          </div>
          <select
            value={selectedLevel || 'all'}
            onChange={(e) => onLevelChange(e.target.value === 'all' ? null : e.target.value as 'B1' | 'B2' | 'C1')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">Tất cả trình độ</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">Tất cả buổi học</option>
            {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>Buổi {num}</option>
            ))}
          </select>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">Tất cả kỹ năng</option>
            <option value="reading">Đọc</option>
            <option value="listening">Nghe</option>
            <option value="writing">Viết</option>
            <option value="speaking">Nói</option>
            <option value="mixed">Tổng hợp</option>
          </select>
        </div>
      </div>

      {/* Assignments by Session */}
      {sessions.length > 0 ? (
        <div className="space-y-6">
          {sessions.map(sessionNumber => (
            <div key={sessionNumber} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Session Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Calendar className="size-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Buổi {sessionNumber}</h2>
                      <p className="text-sm text-emerald-100">
                        {assignmentsBySession[sessionNumber].length} bài tập
                      </p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-medium">
                    {assignmentsBySession[sessionNumber].filter(a => a.status === 'completed').length}/
                    {assignmentsBySession[sessionNumber].length} hoàn thành
                  </span>
                </div>
              </div>

              {/* Assignment Cards */}
              <div className="p-6 space-y-4">
                {assignmentsBySession[sessionNumber].map(assignment => {
                  const statusInfo = getStatusColor(assignment.status);
                  const progress = assignment.totalStudents > 0 
                    ? (assignment.submitted / assignment.totalStudents) * 100 
                    : 0;

                  return (
                    <div
                      key={assignment.id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer hover:border-emerald-500"
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-14 h-14 bg-gradient-to-br ${getSkillColor(assignment.skill)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <BookOpen className="size-7 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                                <span className={`px-3 py-1 ${statusInfo.bg} ${statusInfo.text} text-xs rounded-full font-medium`}>
                                  {statusInfo.label}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex items-center gap-6 text-sm mb-4">
                            <span className={`px-3 py-1 bg-gradient-to-r ${getSkillColor(assignment.skill)} text-white rounded-lg font-medium`}>
                              {getSkillLabel(assignment.skill)}
                            </span>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="size-4" />
                              <span>Hạn: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="size-4" />
                              <span>{assignment.totalStudents} học sinh</span>
                            </div>
                          </div>

                          {/* Classes */}
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm text-gray-500">Lớp:</span>
                            {assignment.classNames.map((className, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                              >
                                {className}
                              </span>
                            ))}
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Tiến độ nộp bài</span>
                              <span className="font-medium text-gray-900">
                                {assignment.submitted}/{assignment.totalStudents} ({Math.round(progress)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  progress === 100
                                    ? 'bg-green-600'
                                    : progress >= 75
                                    ? 'bg-blue-600'
                                    : progress >= 50
                                    ? 'bg-yellow-600'
                                    : 'bg-red-600'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
          <AlertCircle className="size-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có bài tập</h3>
          <p className="text-gray-600">
            {selectedSession !== 'all'
              ? `Chưa có bài tập nào cho Buổi ${selectedSession}`
              : 'Chưa có bài tập nào với bộ lọc này'}
          </p>
        </div>
      )}
    </div>
  );
}