import { useState } from 'react';
import { ArrowLeft, Users, Calendar, Clock, CheckCircle2, AlertCircle, XCircle, Send, Bell, Filter, Search, Download, BarChart3, Eye, MessageSquare } from 'lucide-react';

interface ClassAssignmentDetailViewProps {
  assignmentId: number;
  classId: number;
  onBack: () => void;
}

interface StudentProgress {
  id: number;
  name: string;
  email: string;
  avatar: string;
  status: 'completed' | 'in-progress' | 'not-started';
  submittedAt?: string;
  grade?: number;
  timeSpent?: number; // minutes
  lastAccess?: string;
}

const mockStudents: StudentProgress[] = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    avatar: 'NA',
    status: 'completed',
    submittedAt: '2025-12-10 14:30',
    grade: 8.5,
    timeSpent: 45
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    avatar: 'TB',
    status: 'completed',
    submittedAt: '2025-12-11 09:15',
    grade: 9.0,
    timeSpent: 50
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@email.com',
    avatar: 'LC',
    status: 'in-progress',
    lastAccess: '2025-12-11 16:20',
    timeSpent: 25
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    email: 'phamthid@email.com',
    avatar: 'PD',
    status: 'completed',
    submittedAt: '2025-12-09 18:45',
    grade: 7.5,
    timeSpent: 40
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    email: 'hoangvane@email.com',
    avatar: 'HE',
    status: 'in-progress',
    lastAccess: '2025-12-12 10:00',
    timeSpent: 15
  },
  {
    id: 6,
    name: 'Đỗ Thị F',
    email: 'dothif@email.com',
    avatar: 'DF',
    status: 'not-started'
  },
  {
    id: 7,
    name: 'Vũ Văn G',
    email: 'vuvang@email.com',
    avatar: 'VG',
    status: 'not-started'
  },
  {
    id: 8,
    name: 'Bùi Thị H',
    email: 'buithih@email.com',
    avatar: 'BH',
    status: 'in-progress',
    lastAccess: '2025-12-11 20:30',
    timeSpent: 30
  },
];

export function ClassAssignmentDetailView({ assignmentId, classId, onBack }: ClassAssignmentDetailViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Mock assignment data
  const assignment = {
    id: assignmentId,
    title: 'Reading Comprehension - Unit 5',
    skill: 'reading',
    dueDate: '2025-12-20',
    className: 'VSTEP B1 - Lớp sáng',
    totalStudents: 25,
    instructions: 'Hoàn thành bài đọc hiểu và trả lời tất cả câu hỏi. Lưu ý thời gian làm bài.'
  };

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            <CheckCircle2 className="size-4" />
            Hoàn thành
          </span>
        );
      case 'in-progress':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            <Clock className="size-4" />
            Đang làm
          </span>
        );
      case 'not-started':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            <XCircle className="size-4" />
            Chưa làm
          </span>
        );
    }
  };

  const getStats = () => {
    const completed = mockStudents.filter(s => s.status === 'completed').length;
    const inProgress = mockStudents.filter(s => s.status === 'in-progress').length;
    const notStarted = mockStudents.filter(s => s.status === 'not-started').length;
    const avgGrade = mockStudents
      .filter(s => s.grade)
      .reduce((sum, s) => sum + (s.grade || 0), 0) / mockStudents.filter(s => s.grade).length;

    return { completed, inProgress, notStarted, avgGrade };
  };

  const stats = getStats();

  const handleToggleStudent = (studentId: number) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectNotStarted = () => {
    const notStartedIds = mockStudents
      .filter(s => s.status === 'not-started')
      .map(s => s.id);
    setSelectedStudents(notStartedIds);
  };

  const handleSelectInProgress = () => {
    const inProgressIds = mockStudents
      .filter(s => s.status === 'in-progress')
      .map(s => s.id);
    setSelectedStudents(inProgressIds);
  };

  const handleSendNotification = () => {
    console.log('Sending notification to:', selectedStudents);
    console.log('Message:', notificationMessage);
    alert(`Đã gửi thông báo cho ${selectedStudents.length} học sinh!`);
    setShowNotificationModal(false);
    setSelectedStudents([]);
    setNotificationMessage('');
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
                <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
                <p className="text-sm text-gray-600">
                  {assignment.className} • Hạn nộp: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="size-4" />
                Xuất báo cáo
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <BarChart3 className="size-4" />
                Thống kê
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border-2 border-green-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-700">Hoàn thành</span>
              <CheckCircle2 className="size-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-gray-600 mt-1">
              {Math.round((stats.completed / mockStudents.length) * 100)}% tổng số
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-700">Đang làm</span>
              <Clock className="size-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-xs text-gray-600 mt-1">
              {Math.round((stats.inProgress / mockStudents.length) * 100)}% tổng số
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Chưa làm</span>
              <AlertCircle className="size-5 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-gray-600">{stats.notStarted}</div>
            <div className="text-xs text-gray-600 mt-1">
              {Math.round((stats.notStarted / mockStudents.length) * 100)}% tổng số
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-700">Điểm TB</span>
              <BarChart3 className="size-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {stats.avgGrade ? stats.avgGrade.toFixed(1) : '--'}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {stats.completed} bài đã chấm
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        {selectedStudents.length > 0 && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-emerald-600" />
                <span className="font-medium text-gray-900">
                  Đã chọn {selectedStudents.length} học sinh
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNotificationModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Bell className="size-4" />
                  Gửi thông báo nhắc nhở
                </button>
                <button
                  onClick={() => setSelectedStudents([])}
                  className="px-4 py-2 text-gray-600 hover:bg-white rounded-lg transition-colors"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white rounded-xl border shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="size-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="completed">Hoàn thành</option>
                <option value="in-progress">Đang làm</option>
                <option value="not-started">Chưa làm</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectNotStarted}
                className="text-sm px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Chọn "Chưa làm"
              </button>
              <button
                onClick={handleSelectInProgress}
                className="text-sm px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Chọn "Đang làm"
              </button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === filteredStudents.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents(filteredStudents.map(s => s.id));
                        } else {
                          setSelectedStudents([]);
                        }
                      }}
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Học sinh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nộp bài
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Điểm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleToggleStudent(student.id)}
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {student.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.submittedAt ? (
                        <span>{new Date(student.submittedAt).toLocaleString('vi-VN')}</span>
                      ) : student.lastAccess ? (
                        <span className="text-blue-600">Truy cập: {new Date(student.lastAccess).toLocaleString('vi-VN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {student.grade ? (
                        <span className="font-semibold text-purple-600">{student.grade}/10</span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.timeSpent ? (
                        <span className="flex items-center gap-1">
                          <Clock className="size-4" />
                          {student.timeSpent} phút
                        </span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {student.status === 'completed' && (
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem bài làm"
                          >
                            <Eye className="size-4" />
                          </button>
                        )}
                        <button
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Nhắn tin"
                          onClick={() => {
                            setSelectedStudents([student.id]);
                            setShowNotificationModal(true);
                          }}
                        >
                          <MessageSquare className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="size-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Không tìm thấy học sinh nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Gửi thông báo nhắc nhở</h3>
              <button
                onClick={() => {
                  setShowNotificationModal(false);
                  setNotificationMessage('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="size-5 text-gray-400" />
              </button>
            </div>

            <div className="mb-4">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900">
                  <strong>Người nhận:</strong> {selectedStudents.length} học sinh
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedStudents.map(id => {
                    const student = mockStudents.find(s => s.id === id);
                    return student ? (
                      <span key={id} className="px-2 py-1 bg-white rounded text-xs text-gray-700">
                        {student.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung thông báo
              </label>
              <textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="VD: Nhắc nhở các em hoàn thành bài tập Reading Unit 5 trước hạn nộp 20/12..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />

              <div className="mt-3 space-y-2">
                <button
                  onClick={() => setNotificationMessage('Nhắc nhở: Bạn chưa hoàn thành bài tập "' + assignment.title + '". Vui lòng hoàn thành trước hạn nộp ' + new Date(assignment.dueDate).toLocaleDateString('vi-VN') + '.')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  💡 Sử dụng mẫu: Nhắc nhở chung
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNotificationModal(false);
                  setNotificationMessage('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSendNotification}
                disabled={!notificationMessage.trim()}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  notificationMessage.trim()
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="size-4" />
                Gửi thông báo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
