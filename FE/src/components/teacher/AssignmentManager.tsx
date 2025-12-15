import { useState } from 'react';
import { ArrowLeft, Plus, Search, Filter, Eye, Edit, Trash2, Users, Calendar, CheckCircle2, Clock, AlertCircle, BarChart3 } from 'lucide-react';

interface AssignmentManagerProps {
  onBack: () => void;
  onCreateNew: () => void;
  onViewDetail?: (assignmentId: number) => void;
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  level: 'A2' | 'B1' | 'B2' | 'C1';
  createdDate: string;
  dueDate: string;
  totalStudents: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  overdue: number;
  status: 'active' | 'expired' | 'draft';
}

const mockAssignments: Assignment[] = [
  {
    id: 1,
    title: 'Reading Practice - Academic Texts',
    description: 'Hoàn thành 3 bài đọc hiểu về chủ đề học thuật',
    skill: 'reading',
    level: 'B2',
    createdDate: '2025-12-10',
    dueDate: '2025-12-15',
    totalStudents: 25,
    completed: 10,
    inProgress: 8,
    notStarted: 5,
    overdue: 2,
    status: 'active',
  },
  {
    id: 2,
    title: 'Writing Task 2 - Opinion Essay',
    description: 'Viết một bài luận về chủ đề "Technology in Education"',
    skill: 'writing',
    level: 'B2',
    createdDate: '2025-12-08',
    dueDate: '2025-12-14',
    totalStudents: 30,
    completed: 15,
    inProgress: 12,
    notStarted: 3,
    overdue: 0,
    status: 'active',
  },
  {
    id: 3,
    title: 'Listening Part 3 - Conversations',
    description: 'Luyện nghe hội thoại dài với 5 bài tập',
    skill: 'listening',
    level: 'C1',
    createdDate: '2025-12-05',
    dueDate: '2025-12-13',
    totalStudents: 20,
    completed: 18,
    inProgress: 2,
    notStarted: 0,
    overdue: 0,
    status: 'active',
  },
  {
    id: 4,
    title: 'Speaking Part 2 - Long Turn',
    description: 'Ghi âm 3 đoạn nói về các chủ đề khác nhau',
    skill: 'speaking',
    level: 'B1',
    createdDate: '2025-12-01',
    dueDate: '2025-12-11',
    totalStudents: 18,
    completed: 12,
    inProgress: 0,
    notStarted: 0,
    overdue: 6,
    status: 'expired',
  },
];

export function AssignmentManager({ onBack, onCreateNew, onViewDetail }: AssignmentManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<'all' | 'reading' | 'listening' | 'writing' | 'speaking'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'expired' | 'draft'>('all');

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'reading': return 'from-blue-500 to-cyan-500';
      case 'listening': return 'from-purple-500 to-pink-500';
      case 'writing': return 'from-emerald-500 to-teal-500';
      case 'speaking': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSkillLabel = (skill: string) => {
    switch (skill) {
      case 'reading': return 'Đọc';
      case 'listening': return 'Nghe';
      case 'writing': return 'Viết';
      case 'speaking': return 'Nói';
      default: return skill;
    }
  };

  const filteredAssignments = mockAssignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = selectedSkill === 'all' || assignment.skill === selectedSkill;
    const matchesStatus = selectedStatus === 'all' || assignment.status === selectedStatus;
    return matchesSearch && matchesSkill && matchesStatus;
  });

  const stats = {
    total: mockAssignments.length,
    active: mockAssignments.filter(a => a.status === 'active').length,
    totalStudents: mockAssignments.reduce((sum, a) => sum + a.totalStudents, 0),
    avgCompletion: Math.round(
      mockAssignments.reduce((sum, a) => sum + (a.completed / a.totalStudents * 100), 0) / mockAssignments.length
    ),
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Create Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý bài tập đã giao</h2>
            <p className="text-sm text-gray-600">Theo dõi và quản lý bài tập của học sinh</p>
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="size-5" />
            Giao bài mới
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng bài tập</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="size-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Đang hoạt động</p>
                <p className="text-3xl font-bold text-emerald-700 mt-1">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="size-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Tổng học sinh</p>
                <p className="text-3xl font-bold text-purple-700 mt-1">{stats.totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="size-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Hoàn thành TB</p>
                <p className="text-3xl font-bold text-orange-700 mt-1">{stats.avgCompletion}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="size-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border-2 border-gray-200 mb-6">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài tập..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Skill Filter */}
            <div className="flex items-center gap-2">
              <Filter className="size-5 text-gray-500" />
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">Tất cả kỹ năng</option>
                <option value="reading">Đọc</option>
                <option value="listening">Nghe</option>
                <option value="writing">Viết</option>
                <option value="speaking">Nói</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="expired">Đã hết hạn</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border-2 border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="size-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy bài tập
              </h3>
              <p className="text-gray-600">
                Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
              </p>
            </div>
          ) : (
            filteredAssignments.map(assignment => {
              const completionRate = Math.round((assignment.completed / assignment.totalStudents) * 100);
              
              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-emerald-400 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Skill Icon */}
                      <div className={`w-14 h-14 bg-gradient-to-br ${getSkillColor(assignment.skill)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <BarChart3 className="size-7 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {assignment.title}
                          </h3>
                          {assignment.status === 'active' && (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                              Đang hoạt động
                            </span>
                          )}
                          {assignment.status === 'expired' && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              Đã hết hạn
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 mb-3">{assignment.description}</p>

                        <div className="flex items-center gap-6 text-sm mb-4">
                          <span className={`px-2 py-1 bg-gradient-to-r ${getSkillColor(assignment.skill)} text-white rounded text-xs`}>
                            {getSkillLabel(assignment.skill)}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                            {assignment.level}
                          </span>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Users className="size-4" />
                            <span>{assignment.totalStudents} học sinh</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="size-4" />
                            <span>Hạn: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>

                        {/* Progress Stats */}
                        <div className="grid grid-cols-4 gap-3">
                          <div className="bg-green-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle2 className="size-4 text-green-600" />
                              <span className="text-xs text-green-600">Hoàn thành</span>
                            </div>
                            <p className="text-lg font-bold text-green-700">{assignment.completed}</p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="size-4 text-blue-600" />
                              <span className="text-xs text-blue-600">Đang làm</span>
                            </div>
                            <p className="text-lg font-bold text-blue-700">{assignment.inProgress}</p>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertCircle className="size-4 text-yellow-600" />
                              <span className="text-xs text-yellow-600">Chưa làm</span>
                            </div>
                            <p className="text-lg font-bold text-yellow-700">{assignment.notStarted}</p>
                          </div>
                          <div className="bg-red-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertCircle className="size-4 text-red-600" />
                              <span className="text-xs text-red-600">Quá hạn</span>
                            </div>
                            <p className="text-lg font-bold text-red-700">{assignment.overdue}</p>
                          </div>
                        </div>

                        {/* Completion Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Tỷ lệ hoàn thành</span>
                            <span className="text-sm font-bold text-gray-900">{completionRate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                              style={{ width: `${completionRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Xem chi tiết"
                        onClick={() => onViewDetail?.(assignment.id)}
                      >
                        <Eye className="size-5" />
                      </button>
                      <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors" title="Chỉnh sửa">
                        <Edit className="size-5" />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Xóa">
                        <Trash2 className="size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}