import { useState } from 'react';
import { Search, Download, Plus, Edit, Trash2, Eye, FileText, CheckCircle, Clock, XCircle, Upload, Save, X, PlusCircle, Book, Headphones, PenTool, Mic, Filter, AlertCircle, ThumbsUp, ThumbsDown, MessageSquare, ClipboardCheck } from 'lucide-react';
import { PendingApprovalsTab } from './PendingApprovalsTab';
import { CreateExamModalAdvanced } from './CreateExamModalAdvanced';

export function ExamManagementPage() {
  const [activeTab, setActiveTab] = useState<'approvals' | 'reading' | 'listening' | 'writing' | 'speaking'>('approvals');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - Đề thi theo từng kỹ năng riêng biệt
  const readingExams = [
    { id: 'R001', title: 'Reading Test 01 - Climate Change', level: 'B1', questions: 40, duration: 60, createdBy: 'TS. Nguyễn Văn A', updated: '2024-12-10', status: 'published', parts: [1, 2, 3], attempts: 145 },
    { id: 'R002', title: 'Reading Test 02 - Technology Impact', level: 'B2', questions: 40, duration: 60, createdBy: 'ThS. Trần Thị B', updated: '2024-12-09', status: 'published', parts: [1, 2, 3], attempts: 128 },
    { id: 'R003', title: 'Reading Test 03 - Education System', level: 'B1', questions: 40, duration: 60, createdBy: 'TS. Lê Văn C', updated: '2024-12-08', status: 'draft', parts: [1, 2, 3], attempts: 0 },
    { id: 'R004', title: 'Reading Test 04 - Cultural Heritage', level: 'C1', questions: 40, duration: 60, createdBy: 'GV. Hoàng Văn D', updated: '2024-12-07', status: 'published', parts: [1, 2, 3], attempts: 89 },
    { id: 'R005', title: 'Reading Test 05 - Health & Lifestyle', level: 'A2', questions: 35, duration: 50, createdBy: 'ThS. Phạm Thị E', updated: '2024-12-06', status: 'published', parts: [1, 2], attempts: 201 },
  ];

  const listeningExams = [
    { id: 'L001', title: 'Listening Test 01 - Daily Conversations', level: 'B1', questions: 35, duration: 40, createdBy: 'TS. Nguyễn Văn A', updated: '2024-12-10', status: 'published', parts: [1, 2, 3], audioUrl: '/audio/l001.mp3', attempts: 167 },
    { id: 'L002', title: 'Listening Test 02 - Academic Lectures', level: 'B2', questions: 35, duration: 40, createdBy: 'ThS. Trần Thị B', updated: '2024-12-09', status: 'published', parts: [1, 2, 3], audioUrl: '/audio/l002.mp3', attempts: 143 },
    { id: 'L003', title: 'Listening Test 03 - News & Media', level: 'C1', questions: 35, duration: 40, createdBy: 'TS. Lê Văn C', updated: '2024-12-08', status: 'draft', parts: [1, 2, 3], audioUrl: '/audio/l003.mp3', attempts: 0 },
    { id: 'L004', title: 'Listening Test 04 - Workplace Communication', level: 'B1', questions: 35, duration: 40, createdBy: 'GV. Hoàng Văn D', updated: '2024-12-07', status: 'published', parts: [1, 2, 3], audioUrl: '/audio/l004.mp3', attempts: 112 },
  ];

  const writingExams = [
    { id: 'W001', title: 'Writing Test 01 - Email + Essay', level: 'B2', tasks: 2, duration: 60, createdBy: 'TS. Nguyễn Văn A', updated: '2024-12-10', status: 'published', task1: 'Formal email', task2: 'Opinion essay', attempts: 98 },
    { id: 'W002', title: 'Writing Test 02 - Letter + Essay', level: 'B1', tasks: 2, duration: 60, createdBy: 'ThS. Trần Thị B', updated: '2024-12-09', status: 'published', task1: 'Complaint letter', task2: 'Discussion essay', attempts: 87 },
    { id: 'W003', title: 'Writing Test 03 - Email + Essay', level: 'C1', tasks: 2, duration: 60, createdBy: 'TS. Lê Văn C', updated: '2024-12-08', status: 'draft', task1: 'Business email', task2: 'Argumentative essay', attempts: 0 },
  ];

  const speakingExams = [
    { id: 'S001', title: 'Speaking Test 01 - Personal + Topic', level: 'B1', parts: 3, duration: 12, createdBy: 'TS. Nguyễn Văn A', updated: '2024-12-10', status: 'published', topics: ['Travel', 'Education'], attempts: 134 },
    { id: 'S002', title: 'Speaking Test 02 - Interview + Discussion', level: 'B2', parts: 3, duration: 12, createdBy: 'ThS. Trần Thị B', updated: '2024-12-09', status: 'published', topics: ['Technology', 'Society'], attempts: 109 },
    { id: 'S003', title: 'Speaking Test 03 - Professional Topics', level: 'C1', parts: 3, duration: 15, createdBy: 'TS. Lê Văn C', updated: '2024-12-08', status: 'draft', topics: ['Business', 'Global Issues'], attempts: 0 },
  ];

  // Get current skill's exams
  const getCurrentExams = () => {
    switch (activeTab) {
      case 'approvals': return [];
      case 'reading': return readingExams;
      case 'listening': return listeningExams;
      case 'writing': return writingExams;
      case 'speaking': return speakingExams;
      default: return [];
    }
  };

  const currentExams = getCurrentExams();

  // Calculate stats for current skill
  const getStatsForSkill = () => {
    const total = currentExams.length;
    const published = currentExams.filter(e => e.status === 'published').length;
    const draft = currentExams.filter(e => e.status === 'draft').length;
    const totalAttempts = currentExams.reduce((sum, e) => sum + e.attempts, 0);

    return [
      { title: 'Tổng đề thi', value: total.toString(), icon: FileText, color: 'from-blue-500 to-blue-600' },
      { title: 'Đã xuất bản', value: published.toString(), icon: CheckCircle, color: 'from-green-500 to-green-600' },
      { title: 'Bản nháp', value: draft.toString(), icon: Clock, color: 'from-orange-500 to-orange-600' },
      { title: 'Lượt làm bài', value: totalAttempts.toString(), icon: XCircle, color: 'from-purple-500 to-purple-600' },
    ];
  };

  const stats = getStatsForSkill();

  // Filter exams
  const filteredExams = currentExams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exam.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || exam.level === filterLevel;
    const matchesStatus = filterStatus === 'all' || exam.status === filterStatus;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Skill tabs configuration
  const skillTabs = [
    { id: 'approvals' as const, name: 'Đợi Duyệt', icon: ClipboardCheck, color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-600' },
    { id: 'reading' as const, name: 'Reading', icon: Book, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-600' },
    { id: 'listening' as const, name: 'Listening', icon: Headphones, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-600' },
    { id: 'writing' as const, name: 'Writing', icon: PenTool, color: 'text-violet-600', bgColor: 'bg-violet-50', borderColor: 'border-violet-600' },
    { id: 'speaking' as const, name: 'Speaking', icon: Mic, color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Ngân hàng đề thi</h2>
          <p className="text-sm text-gray-600 mt-1">Quản lý kho đề thi theo từng kỹ năng riêng biệt</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="size-4" />
          Tạo đề thi mới
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="size-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">📋 Cơ chế Random Đề Thi</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Bài thi thử sẽ <strong>tự động random</strong> đề từ từng kỹ năng riêng biệt. Mỗi lần thi, hệ thống sẽ chọn ngẫu nhiên:
              <span className="block mt-2">
                🔹 <strong>1 đề Reading</strong> từ kho đề Reading
                <br />
                🔹 <strong>1 đề Listening</strong> từ kho đề Listening
                <br />
                🔹 <strong>1 đề Writing</strong> từ kho đề Writing
                <br />
                🔹 <strong>1 đề Speaking</strong> từ kho đề Speaking
              </span>
              <span className="block mt-2 text-yellow-200">
                ⚡ Không theo bộ 4 kỹ năng cố định → Đảm bảo đa dạng và công bằng!
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Skill Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {skillTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                  setSearchQuery('');
                }}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? `${tab.borderColor} ${tab.bgColor} ${tab.color}`
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="size-5" />
                <span className="font-medium">{tab.name}</span>
                {tab.id !== 'approvals' && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    isActive ? 'bg-white/50' : 'bg-gray-100'
                  }`}>
                    {getCurrentExams().length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Show Pending Approvals Tab OR Skill Tabs Content */}
        {activeTab === 'approvals' ? (
          <PendingApprovalsTab />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white shadow-md`}>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="size-8 opacity-80" />
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                      <p className="text-sm opacity-90">{stat.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filters & Search */}
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Tìm kiếm đề ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Level Filter */}
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả cấp độ</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>
            </div>

            {/* Exam List Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Mã đề</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tên đề thi</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cấp độ</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      {activeTab === 'writing' ? 'Số tasks' : activeTab === 'speaking' ? 'Parts' : 'Số câu hỏi'}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Thời gian</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Lượt làm</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tạo bởi</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Trạng thái</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedExams.length > 0 ? (
                    paginatedExams.map((exam) => (
                      <tr key={exam.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm text-gray-700">{exam.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium text-gray-900">{exam.title}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                            {exam.level}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {activeTab === 'writing' ? `${exam.tasks} tasks` : 
                           activeTab === 'speaking' ? `${exam.parts} parts` : 
                           `${exam.questions} câu`}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{exam.duration} phút</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                            {exam.attempts}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{exam.createdBy}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            exam.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {exam.status === 'published' ? '✅ Đã xuất bản' : '⏳ Bản nháp'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => setSelectedExam(exam)}
                              className="p-1.5 hover:bg-gray-200 rounded" 
                              title="Xem chi tiết"
                            >
                              <Eye className="size-4 text-gray-600" />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedExam(exam);
                                setShowEditModal(true);
                              }}
                              className="p-1.5 hover:bg-gray-200 rounded" 
                              title="Chỉnh sửa"
                            >
                              <Edit className="size-4 text-blue-600" />
                            </button>
                            <button 
                              className="p-1.5 hover:bg-gray-200 rounded" 
                              title="Xóa"
                              onClick={() => {
                                if (confirm(`Xóa đề thi "${exam.title}"?`)) {
                                  alert('Đã xóa đề thi!');
                                }
                              }}
                            >
                              <Trash2 className="size-4 text-red-600" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-200 rounded" title="Tải xuống">
                              <Download className="size-4 text-green-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-gray-500">
                        <FileText className="size-12 mx-auto mb-2 text-gray-300" />
                        <p>Không tìm thấy đề thi nào</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredExams.length > 0 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, filteredExams.length)} trong tổng số {filteredExams.length} đề thi
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Trước
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Exam Modal */}
      {showCreateModal && (
        <CreateExamModalAdvanced
          skill={activeTab}
          onClose={() => setShowCreateModal(false)}
          onSave={() => {
            alert('Đã tạo đề thi mới!');
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Exam Detail Modal */}
      {selectedExam && !showEditModal && (
        <ExamDetailModal
          exam={selectedExam}
          skill={activeTab}
          onClose={() => setSelectedExam(null)}
          onEdit={() => setShowEditModal(true)}
        />
      )}
    </div>
  );
}

// Exam Detail Modal Component
function ExamDetailModal({ exam, skill, onClose, onEdit }: { exam: any; skill: string; onClose: () => void; onEdit: () => void }) {
  const getSkillColor = () => {
    switch (skill) {
      case 'reading': return 'from-blue-500 to-blue-600';
      case 'listening': return 'from-emerald-500 to-emerald-600';
      case 'writing': return 'from-violet-500 to-violet-600';
      case 'speaking': return 'from-amber-500 to-amber-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full lg:w-[700px] bg-white z-50 overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold">Chi tiết đề thi</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Exam Header */}
          <div className={`bg-gradient-to-br ${getSkillColor()} rounded-xl p-6 text-white`}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-semibold">{exam.title}</h2>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">{exam.id}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="opacity-75 mb-1">Cấp độ</p>
                <p className="text-lg font-semibold">{exam.level}</p>
              </div>
              <div>
                <p className="opacity-75 mb-1">
                  {skill === 'writing' ? 'Số tasks' : skill === 'speaking' ? 'Parts' : 'Số câu hỏi'}
                </p>
                <p className="text-lg font-semibold">
                  {skill === 'writing' ? `${exam.tasks} tasks` : 
                   skill === 'speaking' ? `${exam.parts} parts` : 
                   `${exam.questions} câu`}
                </p>
              </div>
              <div>
                <p className="opacity-75 mb-1">Thời gian</p>
                <p className="text-lg font-semibold">{exam.duration} phút</p>
              </div>
              <div>
                <p className="opacity-75 mb-1">Lượt làm bài</p>
                <p className="text-lg font-semibold">{exam.attempts}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Tạo bởi</p>
                <p className="font-medium">{exam.createdBy}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Cập nhật lần cuối</p>
                <p className="font-medium">{exam.updated}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Trạng thái</p>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  exam.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {exam.status === 'published' ? '✅ Đã xuất bản' : '⏳ Bản nháp'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button 
              onClick={onEdit}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Edit className="size-4" />
              Chỉnh sửa đề thi
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
              <CheckCircle className="size-4" />
              {exam.status === 'published' ? 'Hủy xuất bản' : 'Xuất bản'}
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">
              <Download className="size-4" />
              Tải xuống
            </button>
            <button 
              onClick={() => {
                if (confirm(`Xóa đề thi "${exam.title}"?`)) {
                  alert('Đã xóa đề thi!');
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              <Trash2 className="size-4" />
              Xóa đề thi
            </button>
          </div>
        </div>
      </div>
    </>
  );
}