import { useState } from 'react';
import { ClipboardList, Calendar, Clock, CheckCircle2, AlertCircle, BookOpen, Play, Eye, ArrowLeft } from 'lucide-react';

interface AssignmentsPageProps {
  onBack: () => void;
}

interface Assignment {
  id: number;
  title: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  teacher: string;
  dueDate: string;
  assignedDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  progress?: number;
  score?: number;
  description: string;
  level: 'A2' | 'B1' | 'B2' | 'C1';
}

const mockAssignments: Assignment[] = [
  {
    id: 1,
    title: 'Reading Practice - Academic Texts',
    skill: 'reading',
    teacher: 'Giáo viên Minh',
    dueDate: '2025-12-15',
    assignedDate: '2025-12-10',
    status: 'pending',
    description: 'Hoàn thành 3 bài đọc hiểu về chủ đề học thuật',
    level: 'B2',
  },
  {
    id: 2,
    title: 'Writing Task 2 - Opinion Essay',
    skill: 'writing',
    teacher: 'Giáo viên Hương',
    dueDate: '2025-12-14',
    assignedDate: '2025-12-08',
    status: 'in-progress',
    progress: 60,
    description: 'Viết một bài luận về chủ đề "Technology in Education"',
    level: 'B2',
  },
  {
    id: 3,
    title: 'Listening Part 3 - Conversations',
    skill: 'listening',
    teacher: 'Giáo viên Minh',
    dueDate: '2025-12-13',
    assignedDate: '2025-12-05',
    status: 'completed',
    score: 8.5,
    description: 'Luyện nghe hội thoại dài với 5 bài tập',
    level: 'C1',
  },
  {
    id: 4,
    title: 'Speaking Part 2 - Long Turn',
    skill: 'speaking',
    teacher: 'Giáo viên Hương',
    dueDate: '2025-12-11',
    assignedDate: '2025-12-01',
    status: 'overdue',
    description: 'Ghi âm 3 đoạn nói về các chủ đề khác nhau',
    level: 'B1',
  },
  {
    id: 5,
    title: 'Full Reading Test - Level B2',
    skill: 'reading',
    teacher: 'Giáo viên Minh',
    dueDate: '2025-12-20',
    assignedDate: '2025-12-12',
    status: 'pending',
    description: 'Làm bộ đề đọc hiểu đầy đủ trong 60 phút',
    level: 'B2',
  },
];

export function AssignmentsPage({ onBack }: AssignmentsPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed' | 'overdue'>('all');

  const filteredAssignments = selectedFilter === 'all' 
    ? mockAssignments 
    : mockAssignments.filter(a => a.status === selectedFilter);

  const getStatusBadge = (status: Assignment['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <Clock className="size-3" />
            Chưa làm
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <Play className="size-3" />
            Đang làm
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle2 className="size-3" />
            Hoàn thành
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <AlertCircle className="size-3" />
            Quá hạn
          </span>
        );
    }
  };

  const getSkillColor = (skill: Assignment['skill']) => {
    switch (skill) {
      case 'reading':
        return 'from-blue-500 to-cyan-500';
      case 'listening':
        return 'from-purple-500 to-pink-500';
      case 'writing':
        return 'from-emerald-500 to-teal-500';
      case 'speaking':
        return 'from-orange-500 to-red-500';
    }
  };

  const getSkillLabel = (skill: Assignment['skill']) => {
    switch (skill) {
      case 'reading':
        return 'Đọc';
      case 'listening':
        return 'Nghe';
      case 'writing':
        return 'Viết';
      case 'speaking':
        return 'Nói';
    }
  };

  const stats = {
    total: mockAssignments.length,
    pending: mockAssignments.filter(a => a.status === 'pending').length,
    inProgress: mockAssignments.filter(a => a.status === 'in-progress').length,
    completed: mockAssignments.filter(a => a.status === 'completed').length,
    overdue: mockAssignments.filter(a => a.status === 'overdue').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <ClipboardList className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bài tập đã giao</h1>
            <p className="text-gray-600">Quản lý và theo dõi tiến độ bài tập từ giáo viên</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="size-4" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => setSelectedFilter('all')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng số</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <ClipboardList className="size-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => setSelectedFilter('pending')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Chưa làm</p>
              <p className="text-2xl font-bold text-blue-700">{stats.pending}</p>
            </div>
            <Clock className="size-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-yellow-200 hover:border-yellow-400 transition-colors cursor-pointer"
          onClick={() => setSelectedFilter('in-progress')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Đang làm</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.inProgress}</p>
            </div>
            <Play className="size-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer"
          onClick={() => setSelectedFilter('completed')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Hoàn thành</p>
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            </div>
            <CheckCircle2 className="size-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-red-200 hover:border-red-400 transition-colors cursor-pointer"
          onClick={() => setSelectedFilter('overdue')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Quá hạn</p>
              <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
            </div>
            <AlertCircle className="size-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedFilter === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Tất cả ({stats.total})
        </button>
        <button
          onClick={() => setSelectedFilter('pending')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedFilter === 'pending'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Chưa làm ({stats.pending})
        </button>
        <button
          onClick={() => setSelectedFilter('in-progress')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedFilter === 'in-progress'
              ? 'bg-yellow-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Đang làm ({stats.inProgress})
        </button>
        <button
          onClick={() => setSelectedFilter('completed')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedFilter === 'completed'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Hoàn thành ({stats.completed})
        </button>
        <button
          onClick={() => setSelectedFilter('overdue')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedFilter === 'overdue'
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Quá hạn ({stats.overdue})
        </button>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <ClipboardList className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không có bài tập nào
            </h3>
            <p className="text-gray-600">
              {selectedFilter === 'all' 
                ? 'Chưa có bài tập nào được giao'
                : `Không có bài tập nào ở trạng thái này`}
            </p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Skill Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${getSkillColor(assignment.skill)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <BookOpen className="size-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {assignment.title}
                      </h3>
                      {getStatusBadge(assignment.status)}
                    </div>

                    <p className="text-gray-600 mb-3">{assignment.description}</p>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 bg-gradient-to-r ${getSkillColor(assignment.skill)} text-white rounded text-xs font-medium`}>
                          {getSkillLabel(assignment.skill)}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                          {assignment.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="size-4" />
                        <span>Hạn: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="text-gray-600">
                        <span>Giáo viên: {assignment.teacher}</span>
                      </div>
                    </div>

                    {/* Progress Bar for In-Progress */}
                    {assignment.status === 'in-progress' && assignment.progress !== undefined && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Tiến độ</span>
                          <span className="text-xs font-medium text-gray-900">{assignment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${assignment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Score for Completed */}
                    {assignment.status === 'completed' && assignment.score !== undefined && (
                      <div className="mt-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle2 className="size-4 text-green-600" />
                          <span className="text-sm text-green-700">
                            Điểm: <span className="font-bold">{assignment.score}/10</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {assignment.status === 'completed' ? (
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                      <Eye className="size-4" />
                      <span>Xem kết quả</span>
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                      <Play className="size-4" />
                      <span>{assignment.status === 'in-progress' ? 'Tiếp tục' : 'Bắt đầu'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}