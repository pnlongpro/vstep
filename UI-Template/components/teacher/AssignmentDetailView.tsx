import { useState } from 'react';
import { ArrowLeft, Users, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Eye, MessageSquare, Download, Upload, Star, TrendingUp, BarChart3, FileText, Send } from 'lucide-react';

interface AssignmentDetailViewProps {
  assignmentId: number;
  onBack: () => void;
}

interface StudentSubmission {
  id: number;
  studentName: string;
  studentEmail: string;
  status: 'completed' | 'in-progress' | 'not-started' | 'overdue';
  submittedDate?: string;
  score?: number;
  maxScore: number;
  feedback?: string;
  files?: string[];
  timeSpent?: number;
}

const mockSubmissions: StudentSubmission[] = [
  {
    id: 1,
    studentName: 'Nguyễn Văn A',
    studentEmail: 'nguyenvana@email.com',
    status: 'completed',
    submittedDate: '2025-12-13 14:30',
    score: 8.5,
    maxScore: 10,
    feedback: 'Bài làm tốt, cần cải thiện phần ngữ pháp.',
    files: ['essay.docx', 'audio.mp3'],
    timeSpent: 45,
  },
  {
    id: 2,
    studentName: 'Trần Thị B',
    studentEmail: 'tranthib@email.com',
    status: 'completed',
    submittedDate: '2025-12-14 09:15',
    score: 9.0,
    maxScore: 10,
    feedback: 'Xuất sắc! Giữ vững phong độ.',
    files: ['submission.pdf'],
    timeSpent: 52,
  },
  {
    id: 3,
    studentName: 'Lê Văn C',
    studentEmail: 'levanc@email.com',
    status: 'in-progress',
    maxScore: 10,
    timeSpent: 20,
  },
  {
    id: 4,
    studentName: 'Phạm Thị D',
    studentEmail: 'phamthid@email.com',
    status: 'overdue',
    maxScore: 10,
  },
  {
    id: 5,
    studentName: 'Hoàng Văn E',
    studentEmail: 'hoangvane@email.com',
    status: 'not-started',
    maxScore: 10,
  },
];

const assignmentData = {
  id: 1,
  title: 'Reading Practice - Academic Texts',
  description: 'Hoàn thành 3 bài đọc hiểu về chủ đề học thuật. Tập trung vào kỹ năng skimming và scanning.',
  skill: 'reading',
  level: 'B2',
  className: 'Lớp B2.1',
  createdDate: '2025-12-10',
  dueDate: '2025-12-15',
  duration: 60,
  totalStudents: 25,
  completed: 10,
  inProgress: 8,
  notStarted: 5,
  overdue: 2,
  avgScore: 8.75,
  maxScore: 10,
};

export function AssignmentDetailView({ assignmentId, onBack }: AssignmentDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'statistics'>('overview');
  const [selectedStudent, setSelectedStudent] = useState<StudentSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress' | 'not-started' | 'overdue'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'not-started': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Đã nộp';
      case 'in-progress': return 'Đang làm';
      case 'not-started': return 'Chưa bắt đầu';
      case 'overdue': return 'Quá hạn';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="size-4" />;
      case 'in-progress': return <Clock className="size-4" />;
      case 'not-started': return <AlertCircle className="size-4" />;
      case 'overdue': return <XCircle className="size-4" />;
      default: return null;
    }
  };

  const filteredSubmissions = filterStatus === 'all' 
    ? mockSubmissions 
    : mockSubmissions.filter(s => s.status === filterStatus);

  const handleGradeSubmit = () => {
    if (selectedStudent && gradeInput && feedbackInput) {
      console.log('Submitting grade:', {
        studentId: selectedStudent.id,
        score: gradeInput,
        feedback: feedbackInput,
      });
      setSelectedStudent(null);
      setGradeInput('');
      setFeedbackInput('');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{assignmentData.title}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Users className="size-4" />
                    {assignmentData.className}
                  </span>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="size-4" />
                    Hạn: {new Date(assignmentData.dueDate).toLocaleDateString('vi-VN')}
                  </span>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="size-4" />
                    {assignmentData.duration} phút
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{assignmentData.completed}/{assignmentData.totalStudents}</div>
                <div className="text-xs text-gray-600">Đã nộp</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{assignmentData.avgScore}</div>
                <div className="text-xs text-gray-600">Điểm TB</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'submissions'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Bài nộp ({assignmentData.completed})
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'statistics'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Thống kê
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Mô tả bài tập</h2>
              <p className="text-gray-700">{assignmentData.description}</p>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Đã hoàn thành</span>
                  <CheckCircle2 className="size-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600">{assignmentData.completed}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((assignmentData.completed / assignmentData.totalStudents) * 100)}% tổng số
                </div>
              </div>

              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Đang làm</span>
                  <Clock className="size-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600">{assignmentData.inProgress}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((assignmentData.inProgress / assignmentData.totalStudents) * 100)}% tổng số
                </div>
              </div>

              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Chưa bắt đầu</span>
                  <AlertCircle className="size-5 text-gray-600" />
                </div>
                <div className="text-3xl font-bold text-gray-600">{assignmentData.notStarted}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((assignmentData.notStarted / assignmentData.totalStudents) * 100)}% tổng số
                </div>
              </div>

              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Quá hạn</span>
                  <XCircle className="size-5 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-red-600">{assignmentData.overdue}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((assignmentData.overdue / assignmentData.totalStudents) * 100)}% tổng số
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            {/* Filter */}
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Lọc:</span>
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    filterStatus === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tất cả ({mockSubmissions.length})
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    filterStatus === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Đã nộp ({mockSubmissions.filter(s => s.status === 'completed').length})
                </button>
                <button
                  onClick={() => setFilterStatus('in-progress')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    filterStatus === 'in-progress' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Đang làm ({mockSubmissions.filter(s => s.status === 'in-progress').length})
                </button>
                <button
                  onClick={() => setFilterStatus('overdue')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    filterStatus === 'overdue' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Quá hạn ({mockSubmissions.filter(s => s.status === 'overdue').length})
                </button>
              </div>
            </div>

            {/* Submissions List */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Học sinh</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian nộp</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian làm</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{submission.studentName}</div>
                          <div className="text-sm text-gray-500">{submission.studentEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          {getStatusLabel(submission.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {submission.submittedDate || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {submission.score !== undefined ? (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-emerald-600">{submission.score}</span>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-600">{submission.maxScore}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {submission.timeSpent ? `${submission.timeSpent} phút` : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {submission.status === 'completed' && (
                            <>
                              <button
                                onClick={() => setSelectedStudent(submission)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Xem chi tiết"
                              >
                                <Eye className="size-4" />
                              </button>
                              <button
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Chấm điểm"
                              >
                                <Star className="size-4" />
                              </button>
                            </>
                          )}
                          {submission.status === 'overdue' && (
                            <button
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Nhắc nhở"
                            >
                              <MessageSquare className="size-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Score Distribution */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="size-5 text-emerald-600" />
                  Phân bố điểm
                </h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">9.0 - 10.0</span>
                      <span className="text-sm font-medium text-gray-900">3 học sinh</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">8.0 - 8.9</span>
                      <span className="text-sm font-medium text-gray-900">4 học sinh</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">7.0 - 7.9</span>
                      <span className="text-sm font-medium text-gray-900">2 học sinh</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">6.0 - 6.9</span>
                      <span className="text-sm font-medium text-gray-900">1 học sinh</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Completion Timeline */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="size-5 text-emerald-600" />
                  Tiến độ nộp bài
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">3 ngày trước hạn</span>
                    <span className="text-sm font-medium text-emerald-600">2 bài</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">2 ngày trước hạn</span>
                    <span className="text-sm font-medium text-emerald-600">3 bài</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">1 ngày trước hạn</span>
                    <span className="text-sm font-medium text-blue-600">4 bài</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Đúng hạn</span>
                    <span className="text-sm font-medium text-yellow-600">1 bài</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quá hạn</span>
                    <span className="text-sm font-medium text-red-600">2 bài</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Nhận xét chung</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-900">Tỷ lệ hoàn thành cao</div>
                    <div className="text-sm text-green-700">40% học sinh đã hoàn thành bài tập đúng hạn</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="size-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900">Điểm trung bình tốt</div>
                    <div className="text-sm text-blue-700">Điểm TB 8.75/10 cao hơn 0.5 điểm so với bài tập trước</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle className="size-5 text-orange-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-orange-900">Cần nhắc nhở</div>
                    <div className="text-sm text-orange-700">5 học sinh chưa bắt đầu làm bài, 2 học sinh quá hạn</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedStudent.studentName}</h2>
                  <p className="text-sm text-gray-600">{selectedStudent.studentEmail}</p>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="size-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Submission Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trạng thái:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedStudent.status)}`}>
                    {getStatusLabel(selectedStudent.status)}
                  </span>
                </div>
                {selectedStudent.submittedDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Thời gian nộp:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedStudent.submittedDate}</span>
                  </div>
                )}
                {selectedStudent.timeSpent && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Thời gian làm bài:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedStudent.timeSpent} phút</span>
                  </div>
                )}
              </div>

              {/* Files */}
              {selectedStudent.files && selectedStudent.files.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">File đính kèm</h3>
                  <div className="space-y-2">
                    {selectedStudent.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <FileText className="size-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">{file}</span>
                        </div>
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <Download className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Score */}
              {selectedStudent.score !== undefined && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-emerald-900">Điểm hiện tại</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-emerald-600">{selectedStudent.score}</span>
                      <span className="text-gray-400">/</span>
                      <span className="text-xl text-gray-600">{selectedStudent.maxScore}</span>
                    </div>
                  </div>
                  {selectedStudent.feedback && (
                    <div className="text-sm text-emerald-700 mt-2">
                      <strong>Nhận xét:</strong> {selectedStudent.feedback}
                    </div>
                  )}
                </div>
              )}

              {/* Grading Form */}
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Chấm điểm / Cập nhật</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Điểm số <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={selectedStudent.maxScore}
                      step="0.5"
                      value={gradeInput}
                      onChange={(e) => setGradeInput(e.target.value)}
                      placeholder={`0 - ${selectedStudent.maxScore}`}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nhận xét <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      placeholder="Nhập nhận xét chi tiết cho học sinh..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <button
                    onClick={handleGradeSubmit}
                    disabled={!gradeInput || !feedbackInput}
                    className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="size-4" />
                    Lưu và gửi kết quả
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}