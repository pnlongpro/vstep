import { useState } from 'react';
import { FileEdit, Search, Filter, CheckCircle, Clock, AlertCircle, Eye, MessageSquare, Award, TrendingUp } from 'lucide-react';

interface Assignment {
  id: number;
  studentName: string;
  studentAvatar: string;
  className: string;
  skill: string;
  testName: string;
  submittedAt: string;
  status: 'pending' | 'graded' | 'reviewing';
  score?: number;
  totalScore: number;
  aiScore?: number;
}

export function GradingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'graded' | 'reviewing'>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const assignments: Assignment[] = [
    {
      id: 1,
      studentName: 'Nguyễn Văn A',
      studentAvatar: '👨‍🎓',
      className: 'VSTEP B1 - Lớp sáng',
      skill: 'Writing',
      testName: 'Writing Task 2 - Environment',
      submittedAt: '2024-02-15 14:30',
      status: 'pending',
      totalScore: 10,
      aiScore: 7.5
    },
    {
      id: 2,
      studentName: 'Trần Thị B',
      studentAvatar: '👩‍🎓',
      className: 'VSTEP B2 - Lớp chiều',
      skill: 'Speaking',
      testName: 'Speaking Part 3 - Technology',
      submittedAt: '2024-02-15 10:15',
      status: 'reviewing',
      totalScore: 10,
      aiScore: 8.0
    },
    {
      id: 3,
      studentName: 'Lê Văn C',
      studentAvatar: '👨‍🎓',
      className: 'VSTEP B1 - Lớp sáng',
      skill: 'Writing',
      testName: 'Writing Task 1 - Letter',
      submittedAt: '2024-02-14 16:45',
      status: 'graded',
      score: 8.5,
      totalScore: 10
    },
    {
      id: 4,
      studentName: 'Phạm Thị D',
      studentAvatar: '👩‍🎓',
      className: 'VSTEP C1 - Lớp tối',
      skill: 'Speaking',
      testName: 'Speaking Full Test',
      submittedAt: '2024-02-14 15:20',
      status: 'graded',
      score: 9.0,
      totalScore: 10
    },
    {
      id: 5,
      studentName: 'Hoàng Văn E',
      studentAvatar: '👨‍🎓',
      className: 'VSTEP B2 - Lớp chiều',
      skill: 'Writing',
      testName: 'Writing Task 2 - Education',
      submittedAt: '2024-02-14 12:00',
      status: 'pending',
      totalScore: 10,
      aiScore: 6.5
    }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.testName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { 
      label: 'Chờ chấm', 
      value: assignments.filter(a => a.status === 'pending').length.toString(),
      icon: Clock,
      color: 'orange'
    },
    { 
      label: 'Đang xem xét', 
      value: assignments.filter(a => a.status === 'reviewing').length.toString(),
      icon: AlertCircle,
      color: 'blue'
    },
    { 
      label: 'Đã chấm', 
      value: assignments.filter(a => a.status === 'graded').length.toString(),
      icon: CheckCircle,
      color: 'green'
    },
    { 
      label: 'Điểm TB', 
      value: '8.2',
      icon: Award,
      color: 'purple'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'reviewing': return 'bg-blue-100 text-blue-700';
      case 'graded': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ chấm';
      case 'reviewing': return 'Đang xem xét';
      case 'graded': return 'Đã chấm';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                  <Icon className={`size-6 text-${stat.color}-600`} />
                </div>
              </div>
              <h3 className="text-2xl mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài nộp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2.5 rounded-lg transition-colors ${
                filterStatus === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2.5 rounded-lg transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Chờ chấm
            </button>
            <button
              onClick={() => setFilterStatus('graded')}
              className={`px-4 py-2.5 rounded-lg transition-colors ${
                filterStatus === 'graded'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Đã chấm
            </button>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Student Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                  {assignment.studentAvatar}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="mb-1">{assignment.studentName}</h3>
                      <p className="text-sm text-gray-600">{assignment.className}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(assignment.status)}`}>
                      {getStatusText(assignment.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Kỹ năng</p>
                      <p className="text-sm">{assignment.skill}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Bài kiểm tra</p>
                      <p className="text-sm">{assignment.testName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Thời gian nộp</p>
                      <p className="text-sm">{assignment.submittedAt}</p>
                    </div>
                  </div>

                  {/* AI Score / Final Score */}
                  <div className="flex items-center gap-4 mb-4">
                    {assignment.aiScore && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                        <span className="text-xs text-blue-600">AI Scoring:</span>
                        <span className="text-blue-700">{assignment.aiScore}/{assignment.totalScore}</span>
                      </div>
                    )}
                    {assignment.score && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                        <Award className="size-4 text-green-600" />
                        <span className="text-green-700">{assignment.score}/{assignment.totalScore}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedAssignment(assignment)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                    >
                      <Eye className="size-4" />
                      {assignment.status === 'graded' ? 'Xem chi tiết' : 'Chấm điểm'}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      <MessageSquare className="size-4" />
                      Phản hồi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAssignments.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileEdit className="size-12 text-gray-400" />
          </div>
          <h3 className="text-xl text-gray-900 mb-2">Không có bài nộp</h3>
          <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
        </div>
      )}

      {/* Grading Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full my-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl mb-1">Chấm điểm bài làm</h2>
                  <p className="text-sm text-gray-600">{selectedAssignment.studentName} - {selectedAssignment.testName}</p>
                </div>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* AI Suggestion */}
              {selectedAssignment.aiScore && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-blue-700">🤖 AI Scoring Suggestion</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      {selectedAssignment.aiScore}/{selectedAssignment.totalScore}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-blue-900">
                    <p><strong>Strengths:</strong> Good vocabulary usage, clear structure</p>
                    <p><strong>Areas for improvement:</strong> Grammar accuracy, cohesion</p>
                  </div>
                </div>
              )}

              {/* Student Work */}
              <div>
                <h3 className="mb-3">Bài làm của học viên</h3>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 min-h-[200px]">
                  <p className="text-gray-700 leading-relaxed">
                    [Nội dung bài làm của học viên sẽ hiển thị ở đây. Có thể là văn bản cho Writing hoặc audio player cho Speaking.]
                  </p>
                </div>
              </div>

              {/* Grading Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Điểm số</label>
                  <input
                    type="number"
                    min="0"
                    max={selectedAssignment.totalScore}
                    step="0.5"
                    defaultValue={selectedAssignment.score || selectedAssignment.aiScore || ''}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={`0 - ${selectedAssignment.totalScore}`}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Nhận xét chi tiết</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nhập nhận xét chi tiết cho học viên..."
                  ></textarea>
                </div>

                {/* Criteria Scores */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Task Achievement</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Coherence & Cohesion</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Lexical Resource</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Grammar Accuracy</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setSelectedAssignment(null)}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Lưu điểm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
