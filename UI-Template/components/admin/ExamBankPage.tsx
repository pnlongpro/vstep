import { useState } from 'react';
import { Search, Plus, Book, Headphones, PenTool, Mic, FileText, CheckCircle, Clock, Users, Filter, ChevronDown, Edit, Trash2, Eye, Copy, Download, Upload, Star } from 'lucide-react';
import { CreateExamAdvanced } from './CreateExamAdvanced';
import { CreateReadingExam } from './CreateReadingExam';
import { ExamDetailView } from './ExamDetailView';

export function ExamBankPage() {
  const [activeSkill, setActiveSkill] = useState<'all' | 'reading' | 'listening' | 'writing' | 'speaking'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSkillForCreate, setSelectedSkillForCreate] = useState<'reading' | 'listening' | 'writing' | 'speaking' | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);

  // Mock data - Ngân hàng đề thi
  const examBank = [
    // Reading Exams
    {
      id: 'R001',
      code: 'VSTEP-R-B2-2024-001',
      title: 'Reading Test 01 - Climate Change & Solutions',
      skill: 'reading',
      level: 'B2',
      parts: 4,
      totalQuestions: 40,
      duration: 60,
      status: 'published',
      createdBy: 'TS. Nguyễn Văn A',
      createdAt: '2024-12-10',
      attempts: 245,
      averageScore: 3.2,
      passRate: 68,
      featured: true,
    },
    {
      id: 'R002',
      code: 'VSTEP-R-B1-2024-002',
      title: 'Reading Test 02 - Technology in Education',
      skill: 'reading',
      level: 'B1',
      parts: 4,
      totalQuestions: 40,
      duration: 60,
      status: 'published',
      createdBy: 'ThS. Trần Thị B',
      createdAt: '2024-12-09',
      attempts: 198,
      averageScore: 2.8,
      passRate: 72,
      featured: false,
    },
    {
      id: 'R003',
      code: 'VSTEP-R-C1-2024-003',
      title: 'Reading Test 03 - Economic Development',
      skill: 'reading',
      level: 'C1',
      parts: 4,
      totalQuestions: 40,
      duration: 60,
      status: 'draft',
      createdBy: 'TS. Lê Văn C',
      createdAt: '2024-12-08',
      attempts: 0,
      averageScore: 0,
      passRate: 0,
      featured: false,
    },

    // Listening Exams
    {
      id: 'L001',
      code: 'VSTEP-L-B2-2024-001',
      title: 'Listening Test 01 - Daily Conversations',
      skill: 'listening',
      level: 'B2',
      parts: 3,
      totalQuestions: 35,
      duration: 40,
      status: 'published',
      createdBy: 'TS. Nguyễn Văn A',
      createdAt: '2024-12-10',
      attempts: 312,
      averageScore: 3.0,
      passRate: 65,
      featured: true,
    },
    {
      id: 'L002',
      code: 'VSTEP-L-B1-2024-002',
      title: 'Listening Test 02 - Academic Lectures',
      skill: 'listening',
      level: 'B1',
      parts: 3,
      totalQuestions: 35,
      duration: 40,
      status: 'published',
      createdBy: 'ThS. Trần Thị B',
      createdAt: '2024-12-09',
      attempts: 267,
      averageScore: 2.7,
      passRate: 70,
      featured: false,
    },

    // Writing Exams
    {
      id: 'W001',
      code: 'VSTEP-W-B2-2024-001',
      title: 'Writing Test 01 - Email & Essay',
      skill: 'writing',
      level: 'B2',
      parts: 2,
      totalQuestions: 2,
      duration: 60,
      status: 'published',
      createdBy: 'TS. Nguyễn Văn A',
      createdAt: '2024-12-10',
      attempts: 156,
      averageScore: 2.9,
      passRate: 62,
      featured: true,
    },
    {
      id: 'W002',
      code: 'VSTEP-W-B1-2024-002',
      title: 'Writing Test 02 - Letter & Discussion',
      skill: 'writing',
      level: 'B1',
      parts: 2,
      totalQuestions: 2,
      duration: 60,
      status: 'published',
      createdBy: 'ThS. Trần Thị B',
      createdAt: '2024-12-09',
      attempts: 134,
      averageScore: 2.6,
      passRate: 68,
      featured: false,
    },

    // Speaking Exams
    {
      id: 'S001',
      code: 'VSTEP-S-B2-2024-001',
      title: 'Speaking Test 01 - Personal & Social Topics',
      skill: 'speaking',
      level: 'B2',
      parts: 3,
      totalQuestions: 9,
      duration: 12,
      status: 'published',
      createdBy: 'TS. Nguyễn Văn A',
      createdAt: '2024-12-10',
      attempts: 189,
      averageScore: 3.1,
      passRate: 66,
      featured: true,
    },
    {
      id: 'S002',
      code: 'VSTEP-S-B1-2024-002',
      title: 'Speaking Test 02 - Everyday Situations',
      skill: 'speaking',
      level: 'B1',
      parts: 3,
      totalQuestions: 9,
      duration: 12,
      status: 'published',
      createdBy: 'ThS. Trần Thị B',
      createdAt: '2024-12-09',
      attempts: 167,
      averageScore: 2.8,
      passRate: 71,
      featured: false,
    },
  ];

  // Skill tabs
  const skillTabs = [
    { id: 'all' as const, name: 'Tất cả', icon: FileText, color: 'text-gray-600', count: examBank.length },
    { id: 'reading' as const, name: 'Reading', icon: Book, color: 'text-blue-600', count: examBank.filter(e => e.skill === 'reading').length },
    { id: 'listening' as const, name: 'Listening', icon: Headphones, color: 'text-emerald-600', count: examBank.filter(e => e.skill === 'listening').length },
    { id: 'writing' as const, name: 'Writing', icon: PenTool, color: 'text-violet-600', count: examBank.filter(e => e.skill === 'writing').length },
    { id: 'speaking' as const, name: 'Speaking', icon: Mic, color: 'text-orange-600', count: examBank.filter(e => e.skill === 'speaking').length },
  ];

  // Stats
  const stats = [
    { title: 'Tổng đề thi', value: examBank.length.toString(), icon: FileText, color: 'from-blue-500 to-blue-600' },
    { title: 'Đã xuất bản', value: examBank.filter(e => e.status === 'published').length.toString(), icon: CheckCircle, color: 'from-green-500 to-green-600' },
    { title: 'Bản nháp', value: examBank.filter(e => e.status === 'draft').length.toString(), icon: Clock, color: 'from-orange-500 to-orange-600' },
    { title: 'Lượt làm bài', value: examBank.reduce((sum, e) => sum + e.attempts, 0).toString(), icon: Users, color: 'from-purple-500 to-purple-600' },
  ];

  // Filter exams
  const filteredExams = examBank.filter(exam => {
    const matchesSkill = activeSkill === 'all' || exam.skill === activeSkill;
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exam.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || exam.level === filterLevel;
    const matchesStatus = filterStatus === 'all' || exam.status === filterStatus;
    return matchesSkill && matchesSearch && matchesLevel && matchesStatus;
  });

  const handleCreateExam = (skill: 'reading' | 'listening' | 'writing' | 'speaking') => {
    setSelectedSkillForCreate(skill);
    setShowCreateModal(true);
  };

  const handleViewExam = (exam: any) => {
    setSelectedExam(exam);
    setShowDetailModal(true);
  };

  const getSkillColor = (skill: string) => {
    const colors = {
      reading: 'bg-blue-50 text-blue-700 border-blue-200',
      listening: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      writing: 'bg-violet-50 text-violet-700 border-violet-200',
      speaking: 'bg-orange-50 text-orange-700 border-orange-200',
    };
    return colors[skill as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getLevelColor = (level: string) => {
    const colors = {
      A2: 'bg-green-50 text-green-700 border-green-200',
      B1: 'bg-blue-50 text-blue-700 border-blue-200',
      B2: 'bg-purple-50 text-purple-700 border-purple-200',
      C1: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="flex-1 ml-64">
      <div className="max-w-[1360px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ngân hàng Đề thi</h1>
            <p className="text-gray-600 mt-1">Quản lý toàn bộ đề thi VSTEP theo 4 kỹ năng</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
              <Download className="size-5" />
              <span>Xuất Excel</span>
            </button>
            <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
              <Upload className="size-5" />
              <span>Import</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="size-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Skill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {skillTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSkill(tab.id)}
              className={`px-4 py-2.5 rounded-lg border-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeSkill === tab.id
                  ? `${tab.color} bg-white border-current font-medium`
                  : 'text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              <tab.icon className="size-5" />
              <span>{tab.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeSkill === tab.id ? 'bg-current/10' : 'bg-gray-100'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            {/* Search */}
            <div className="col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, mã đề, người tạo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Filter Level */}
            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none appearance-none bg-white"
                >
                  <option value="all">Tất cả cấp độ</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Filter Status */}
            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none appearance-none bg-white"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="draft">Bản nháp</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Create Buttons by Skill */}
        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={() => handleCreateExam('reading')}
            className="p-6 bg-white rounded-xl border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <Book className="size-6 text-blue-600" />
              </div>
              <Plus className="size-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Tạo đề Reading</h3>
            <p className="text-sm text-gray-600 mt-1">40 câu hỏi - 60 phút</p>
          </button>

          <button
            onClick={() => handleCreateExam('listening')}
            className="p-6 bg-white rounded-xl border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                <Headphones className="size-6 text-emerald-600" />
              </div>
              <Plus className="size-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Tạo đề Listening</h3>
            <p className="text-sm text-gray-600 mt-1">35 câu hỏi - 40 phút</p>
          </button>

          <button
            onClick={() => handleCreateExam('writing')}
            className="p-6 bg-white rounded-xl border-2 border-violet-200 hover:border-violet-500 hover:bg-violet-50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-violet-100 group-hover:bg-violet-200 transition-colors">
                <PenTool className="size-6 text-violet-600" />
              </div>
              <Plus className="size-5 text-violet-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Tạo đề Writing</h3>
            <p className="text-sm text-gray-600 mt-1">2 tasks - 60 phút</p>
          </button>

          <button
            onClick={() => handleCreateExam('speaking')}
            className="p-6 bg-white rounded-xl border-2 border-orange-200 hover:border-orange-500 hover:bg-orange-50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">
                <Mic className="size-6 text-orange-600" />
              </div>
              <Plus className="size-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Tạo đề Speaking</h3>
            <p className="text-sm text-gray-600 mt-1">3 parts - 12 phút</p>
          </button>
        </div>

        {/* Exam List */}
        <div className="bg-white rounded-xl border-2 border-gray-200">
          {/* Header */}
          <div className="p-6 border-b-2 border-gray-200">
            <h2 className="font-semibold text-gray-900">
              Danh sách đề thi ({filteredExams.length})
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mã đề</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tên đề thi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kỹ năng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cấp độ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Câu hỏi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Thời gian</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Lượt thi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Điểm TB</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {exam.featured && <Star className="size-4 text-yellow-500 fill-yellow-500" />}
                        <code className="text-sm font-mono text-gray-900">{exam.code}</code>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{exam.title}</div>
                      <div className="text-sm text-gray-600 mt-0.5">
                        Tạo bởi {exam.createdBy} • {exam.createdAt}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getSkillColor(exam.skill)}`}>
                        {exam.skill === 'reading' ? 'Reading' : exam.skill === 'listening' ? 'Listening' : exam.skill === 'writing' ? 'Writing' : 'Speaking'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getLevelColor(exam.level)}`}>
                        {exam.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{exam.totalQuestions} câu</div>
                      <div className="text-xs text-gray-600">{exam.parts} phần</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{exam.duration} phút</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{exam.attempts}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{exam.averageScore.toFixed(1)}/4.0</span>
                        {exam.averageScore > 0 && (
                          <span className="text-xs text-gray-600">({exam.passRate}%)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        exam.status === 'published'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-orange-50 text-orange-700'
                      }`}>
                        {exam.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewExam(exam)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                          title="Xem chi tiết"
                        >
                          <Eye className="size-5 text-gray-600 group-hover:text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group" title="Chỉnh sửa">
                          <Edit className="size-5 text-gray-600 group-hover:text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group" title="Sao chép">
                          <Copy className="size-5 text-gray-600 group-hover:text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group" title="Xóa">
                          <Trash2 className="size-5 text-gray-600 group-hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredExams.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="size-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Không tìm thấy đề thi</h3>
              <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Exam Modal */}
      {showCreateModal && selectedSkillForCreate && (
        selectedSkillForCreate === 'reading' ? (
          <CreateReadingExam
            onClose={() => {
              setShowCreateModal(false);
              setSelectedSkillForCreate(null);
            }}
            onSave={(data) => {
              console.log('Save exam:', data);
              setShowCreateModal(false);
              setSelectedSkillForCreate(null);
            }}
          />
        ) : (
          <CreateExamAdvanced
            skill={selectedSkillForCreate}
            onClose={() => {
              setShowCreateModal(false);
              setSelectedSkillForCreate(null);
            }}
            onSave={(data) => {
              console.log('Save exam:', data);
              setShowCreateModal(false);
              setSelectedSkillForCreate(null);
            }}
          />
        )
      )}

      {/* Exam Detail Modal */}
      {showDetailModal && selectedExam && (
        <ExamDetailView
          exam={selectedExam}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedExam(null);
          }}
        />
      )}
    </div>
  );
}