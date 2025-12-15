import { useState } from 'react';
import { CheckCircle, XCircle, Eye, Clock, User, Upload as UploadIcon, MessageSquare, AlertTriangle, ThumbsUp, ThumbsDown, Book, Headphones, PenTool, Mic } from 'lucide-react';

interface PendingExam {
  id: string;
  title: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  level: string;
  uploadedBy: string;
  uploaderRole: 'teacher' | 'uploader';
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  duration: number;
  questionsCount?: number;
  parts?: number[];
}

export function PendingApprovalsTab() {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedExam, setSelectedExam] = useState<PendingExam | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Mock data - Đề thi chờ duyệt
  const [pendingExams, setPendingExams] = useState<PendingExam[]>([
    {
      id: 'PE001',
      title: 'Reading Test - Climate Change Solutions',
      skill: 'reading',
      level: 'B2',
      uploadedBy: 'Nguyễn Văn A',
      uploaderRole: 'teacher',
      uploadDate: '2024-12-13 09:30',
      status: 'pending',
      duration: 60,
      questionsCount: 40,
      parts: [1, 2, 3],
    },
    {
      id: 'PE002',
      title: 'Listening Test - Business Meetings',
      skill: 'listening',
      level: 'B1',
      uploadedBy: 'Trần Thị B',
      uploaderRole: 'uploader',
      uploadDate: '2024-12-13 08:15',
      status: 'pending',
      duration: 40,
      questionsCount: 35,
      parts: [1, 2, 3],
    },
    {
      id: 'PE003',
      title: 'Writing Test - Environmental Issues',
      skill: 'writing',
      level: 'C1',
      uploadedBy: 'Lê Văn C',
      uploaderRole: 'teacher',
      uploadDate: '2024-12-12 16:45',
      status: 'pending',
      duration: 60,
      questionsCount: 2,
    },
    {
      id: 'PE004',
      title: 'Speaking Test - Daily Routines',
      skill: 'speaking',
      level: 'A2',
      uploadedBy: 'Phạm Thị D',
      uploaderRole: 'uploader',
      uploadDate: '2024-12-12 14:20',
      status: 'pending',
      duration: 12,
      parts: [1, 2, 3],
    },
    {
      id: 'PE005',
      title: 'Reading Test - Technology Advances',
      skill: 'reading',
      level: 'B1',
      uploadedBy: 'Hoàng Văn E',
      uploaderRole: 'teacher',
      uploadDate: '2024-12-12 10:00',
      status: 'pending',
      duration: 60,
      questionsCount: 40,
      parts: [1, 2, 3],
    },
  ]);

  const [approvedExams, setApprovedExams] = useState<PendingExam[]>([
    {
      id: 'AE001',
      title: 'Listening Test - Academic Discussions',
      skill: 'listening',
      level: 'B2',
      uploadedBy: 'Nguyễn Văn F',
      uploaderRole: 'teacher',
      uploadDate: '2024-12-11 15:30',
      status: 'approved',
      duration: 40,
      questionsCount: 35,
      parts: [1, 2, 3],
    },
    {
      id: 'AE002',
      title: 'Writing Test - Social Media Impact',
      skill: 'writing',
      level: 'B2',
      uploadedBy: 'Trần Thị G',
      uploaderRole: 'uploader',
      uploadDate: '2024-12-11 11:00',
      status: 'approved',
      duration: 60,
      questionsCount: 2,
    },
  ]);

  const [rejectedExams, setRejectedExams] = useState<PendingExam[]>([
    {
      id: 'RE001',
      title: 'Reading Test - Incomplete Content',
      skill: 'reading',
      level: 'B1',
      uploadedBy: 'Lê Văn H',
      uploaderRole: 'teacher',
      uploadDate: '2024-12-10 14:00',
      status: 'rejected',
      rejectionReason: 'Thiếu đáp án cho Part 3. Vui lòng bổ sung đầy đủ đáp án và gửi lại.',
      duration: 60,
      questionsCount: 40,
      parts: [1, 2],
    },
    {
      id: 'RE002',
      title: 'Speaking Test - Poor Audio Quality',
      skill: 'speaking',
      level: 'B2',
      uploadedBy: 'Phạm Thị I',
      uploaderRole: 'uploader',
      uploadDate: '2024-12-10 09:30',
      status: 'rejected',
      rejectionReason: 'Chất lượng audio không đạt yêu cầu. Vui lòng ghi âm lại với thiết bị tốt hơn.',
      duration: 12,
      parts: [1, 2, 3],
    },
  ]);

  const getCurrentExams = () => {
    switch (selectedTab) {
      case 'pending':
        return pendingExams;
      case 'approved':
        return approvedExams;
      case 'rejected':
        return rejectedExams;
      default:
        return [];
    }
  };

  const handleApprove = (exam: PendingExam) => {
    setSelectedExam(exam);
    setShowApproveModal(true);
  };

  const confirmApprove = () => {
    if (selectedExam) {
      // Move from pending to approved
      setPendingExams(pendingExams.filter(e => e.id !== selectedExam.id));
      setApprovedExams([...approvedExams, { ...selectedExam, status: 'approved' }]);
      setShowApproveModal(false);
      setSelectedExam(null);
      alert(`✅ Đã duyệt đề thi: ${selectedExam.title}`);
    }
  };

  const handleReject = (exam: PendingExam) => {
    setSelectedExam(exam);
    setShowRejectModal(true);
    setRejectionReason('');
  };

  const confirmReject = () => {
    if (selectedExam && rejectionReason.trim()) {
      // Move from pending to rejected
      setPendingExams(pendingExams.filter(e => e.id !== selectedExam.id));
      setRejectedExams([
        ...rejectedExams,
        { ...selectedExam, status: 'rejected', rejectionReason },
      ]);
      setShowRejectModal(false);
      setSelectedExam(null);
      setRejectionReason('');
      alert(`❌ Đã từ chối đề thi: ${selectedExam.title}`);
    } else {
      alert('Vui lòng nhập lý do từ chối!');
    }
  };

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'reading':
        return <Book className="size-4 text-blue-600" />;
      case 'listening':
        return <Headphones className="size-4 text-emerald-600" />;
      case 'writing':
        return <PenTool className="size-4 text-violet-600" />;
      case 'speaking':
        return <Mic className="size-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'reading':
        return 'bg-blue-100 text-blue-700';
      case 'listening':
        return 'bg-emerald-100 text-emerald-700';
      case 'writing':
        return 'bg-violet-100 text-violet-700';
      case 'speaking':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {pendingExams.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
          <div className="flex items-start gap-4">
            <AlertTriangle className="size-6 text-orange-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">⚠️ CÓ {pendingExams.length} ĐỀ THI CHỜ DUYỆT</h3>
              <p className="text-sm text-orange-800 leading-relaxed">
                Có <strong>{pendingExams.length} đề thi</strong> đang chờ phê duyệt từ Teacher và Content Uploader. 
                Vui lòng kiểm tra và duyệt hoặc từ chối các đề thi để hoàn tất quy trình.
              </p>
              <div className="flex gap-4 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-purple-600" />
                  <span className="text-gray-700">
                    {pendingExams.filter(e => e.uploaderRole === 'teacher').length} từ Teacher
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <UploadIcon className="size-4 text-blue-600" />
                  <span className="text-gray-700">
                    {pendingExams.filter(e => e.uploaderRole === 'uploader').length} từ Content Uploader
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <Clock className="size-8 opacity-80 mb-3" />
          <p className="text-sm opacity-90 mb-2">Chờ duyệt</p>
          <p className="text-3xl font-bold">{pendingExams.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <CheckCircle className="size-8 opacity-80 mb-3" />
          <p className="text-sm opacity-90 mb-2">Đã duyệt</p>
          <p className="text-3xl font-bold">{approvedExams.length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <XCircle className="size-8 opacity-80 mb-3" />
          <p className="text-sm opacity-90 mb-2">Đã từ chối</p>
          <p className="text-3xl font-bold">{rejectedExams.length}</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setSelectedTab('pending')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              selectedTab === 'pending'
                ? 'border-b-2 border-orange-500 bg-orange-50 text-orange-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="size-5" />
              Chờ duyệt ({pendingExams.length})
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('approved')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              selectedTab === 'approved'
                ? 'border-b-2 border-green-500 bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="size-5" />
              Đã duyệt ({approvedExams.length})
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('rejected')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              selectedTab === 'rejected'
                ? 'border-b-2 border-red-500 bg-red-50 text-red-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <XCircle className="size-5" />
              Đã từ chối ({rejectedExams.length})
            </div>
          </button>
        </div>

        {/* Exams Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Đề thi</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Kỹ năng</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Cấp độ</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Upload bởi</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Vai trò</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Ngày upload</th>
                {selectedTab === 'rejected' && (
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Lý do từ chối</th>
                )}
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentExams().length > 0 ? (
                getCurrentExams().map((exam) => (
                  <tr key={exam.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    {/* Exam Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {getSkillIcon(exam.skill)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{exam.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            ID: {exam.id} • {exam.duration} phút
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Skill */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getSkillColor(exam.skill)}`}>
                        {getSkillIcon(exam.skill)}
                        {exam.skill.charAt(0).toUpperCase() + exam.skill.slice(1)}
                      </span>
                    </td>

                    {/* Level */}
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                        {exam.level}
                      </span>
                    </td>

                    {/* Uploaded By */}
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-gray-900">{exam.uploadedBy}</p>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        exam.uploaderRole === 'teacher'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {exam.uploaderRole === 'teacher' ? (
                          <>
                            <User className="size-3" />
                            Teacher
                          </>
                        ) : (
                          <>
                            <UploadIcon className="size-3" />
                            Uploader
                          </>
                        )}
                      </span>
                    </td>

                    {/* Upload Date */}
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-700">{exam.uploadDate}</p>
                    </td>

                    {/* Rejection Reason (only for rejected tab) */}
                    {selectedTab === 'rejected' && (
                      <td className="py-4 px-6">
                        <div className="max-w-xs">
                          <p className="text-sm text-red-700 line-clamp-2">{exam.rejectionReason}</p>
                        </div>
                      </td>
                    )}

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedExam(exam)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="size-4" />
                        </button>
                        {selectedTab === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(exam)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Duyệt"
                            >
                              <ThumbsUp className="size-4" />
                            </button>
                            <button
                              onClick={() => handleReject(exam)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Từ chối"
                            >
                              <ThumbsDown className="size-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={selectedTab === 'rejected' ? 8 : 7} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      {selectedTab === 'pending' && <Clock className="size-12 text-gray-300" />}
                      {selectedTab === 'approved' && <CheckCircle className="size-12 text-gray-300" />}
                      {selectedTab === 'rejected' && <XCircle className="size-12 text-gray-300" />}
                      <p className="text-gray-500">
                        {selectedTab === 'pending' && 'Không có đề thi nào chờ duyệt'}
                        {selectedTab === 'approved' && 'Chưa có đề thi nào được duyệt'}
                        {selectedTab === 'rejected' && 'Chưa có đề thi nào bị từ chối'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedExam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="size-6 text-green-600" />
                Duyệt đề thi
              </h3>
              <button
                onClick={() => setShowApproveModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <p className="font-medium text-gray-900 mb-2">{selectedExam.title}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Kỹ năng:</span>
                    <span className="font-medium ml-2">{selectedExam.skill}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cấp độ:</span>
                    <span className="font-medium ml-2">{selectedExam.level}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Upload bởi:</span>
                    <span className="font-medium ml-2">{selectedExam.uploadedBy}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Vai trò:</span>
                    <span className="font-medium ml-2">
                      {selectedExam.uploaderRole === 'teacher' ? 'Teacher' : 'Uploader'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>✅ Xác nhận duyệt đề thi này?</strong>
                  <br />
                  Đề thi sẽ được xuất bản và có thể sử dụng trong hệ thống.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmApprove}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ThumbsUp className="size-4" />
                  Duyệt ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedExam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <XCircle className="size-6 text-red-600" />
                Từ chối đề thi
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                <p className="font-medium text-gray-900 mb-2">{selectedExam.title}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Upload bởi:</span>
                    <span className="font-medium ml-2">{selectedExam.uploadedBy}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Vai trò:</span>
                    <span className="font-medium ml-2">
                      {selectedExam.uploaderRole === 'teacher' ? 'Teacher' : 'Uploader'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do từ chối *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  placeholder="Nhập lý do cụ thể để người upload có thể chỉnh sửa và gửi lại..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Lưu ý:</strong> Lý do từ chối sẽ được gửi cho người upload để họ có thể chỉnh sửa và gửi lại.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmReject}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ThumbsDown className="size-4" />
                  Từ chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedExam && !showApproveModal && !showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Chi tiết đề thi</h3>
              <button
                onClick={() => setSelectedExam(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="size-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Badge */}
              <div className={`p-4 rounded-xl border-2 ${
                selectedExam.status === 'pending'
                  ? 'bg-orange-50 border-orange-200'
                  : selectedExam.status === 'approved'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {selectedExam.status === 'pending' && <Clock className="size-6 text-orange-600" />}
                  {selectedExam.status === 'approved' && <CheckCircle className="size-6 text-green-600" />}
                  {selectedExam.status === 'rejected' && <XCircle className="size-6 text-red-600" />}
                  <div>
                    <p className="font-semibold text-gray-900">{selectedExam.title}</p>
                    <p className="text-sm text-gray-600">ID: {selectedExam.id}</p>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Kỹ năng</p>
                  <p className="font-medium text-gray-900 capitalize">{selectedExam.skill}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Cấp độ</p>
                  <p className="font-medium text-gray-900">{selectedExam.level}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Thời gian</p>
                  <p className="font-medium text-gray-900">{selectedExam.duration} phút</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">
                    {selectedExam.skill === 'writing' ? 'Tasks' : 'Câu hỏi'}
                  </p>
                  <p className="font-medium text-gray-900">{selectedExam.questionsCount}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Upload bởi</p>
                  <p className="font-medium text-gray-900">{selectedExam.uploadedBy}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Vai trò</p>
                  <p className="font-medium text-gray-900">
                    {selectedExam.uploaderRole === 'teacher' ? '👨‍🏫 Teacher' : '📤 Content Uploader'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                  <p className="text-xs text-gray-600 mb-1">Ngày upload</p>
                  <p className="font-medium text-gray-900">{selectedExam.uploadDate}</p>
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedExam.status === 'rejected' && selectedExam.rejectionReason && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <h4 className="font-semibold text-red-900">Lý do từ chối:</h4>
                  </div>
                  <p className="text-sm text-red-800 leading-relaxed pl-7">
                    {selectedExam.rejectionReason}
                  </p>
                </div>
              )}

              {/* Actions */}
              {selectedExam.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(selectedExam)}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ThumbsUp className="size-4" />
                    Duyệt
                  </button>
                  <button
                    onClick={() => handleReject(selectedExam)}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ThumbsDown className="size-4" />
                    Từ chối
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
