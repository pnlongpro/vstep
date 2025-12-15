import { useState } from 'react';
import { Eye, CheckCircle, XCircle, Clock, User, Upload, BookOpen, Headphones, PenTool, Mic, MessageSquare, ThumbsUp, ThumbsDown, AlertCircle, FileText, X } from 'lucide-react';

interface PendingExam {
  id: string;
  title: string;
  skill: 'Reading' | 'Listening' | 'Writing' | 'Speaking';
  level: 'A2' | 'B1' | 'B2' | 'C1';
  uploadedBy: string;
  uploaderType: 'teacher' | 'uploader';
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  fileUrl?: string;
  answerKey?: string;
  description?: string;
}

export function ExamApprovalTab() {
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [selectedExam, setSelectedExam] = useState<PendingExam | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Mock pending exams
  const pendingExams: PendingExam[] = [
    {
      id: 'PE001',
      title: 'VSTEP Reading B2 - Advanced Comprehension',
      skill: 'Reading',
      level: 'B2',
      uploadedBy: 'ThS. Nguyễn Văn A (Teacher)',
      uploaderType: 'teacher',
      uploadDate: '2024-12-12 14:30',
      status: 'pending',
      description: 'Đề thi đọc hiểu nâng cao cho level B2 với 3 đoạn văn học thuật'
    },
    {
      id: 'PE002',
      title: 'VSTEP Listening C1 - Academic Lectures',
      skill: 'Listening',
      level: 'C1',
      uploadedBy: 'Content Uploader #05',
      uploaderType: 'uploader',
      uploadDate: '2024-12-12 10:15',
      status: 'pending',
      description: 'Bài nghe về các bài giảng học thuật'
    },
    {
      id: 'PE003',
      title: 'VSTEP Writing B1 - Essay Practice',
      skill: 'Writing',
      level: 'B1',
      uploadedBy: 'GV. Trần Thị B (Teacher)',
      uploaderType: 'teacher',
      uploadDate: '2024-12-11 16:45',
      status: 'pending',
      description: 'Đề luyện viết essay cơ bản'
    },
    {
      id: 'PE004',
      title: 'VSTEP Speaking B2 - Daily Topics',
      skill: 'Speaking',
      level: 'B2',
      uploadedBy: 'Content Uploader #12',
      uploaderType: 'uploader',
      uploadDate: '2024-12-11 09:20',
      status: 'pending',
      description: 'Các chủ đề nói hàng ngày'
    },
    {
      id: 'PE005',
      title: 'VSTEP Reading B1 - Short Passages',
      skill: 'Reading',
      level: 'B1',
      uploadedBy: 'Content Uploader #08',
      uploaderType: 'uploader',
      uploadDate: '2024-12-10 15:30',
      status: 'pending',
      description: 'Đoạn văn ngắn dễ hiểu'
    },
  ];

  const filteredExams = pendingExams.filter(exam => {
    const matchesSkill = filterSkill === 'all' || exam.skill === filterSkill;
    const matchesLevel = filterLevel === 'all' || exam.level === filterLevel;
    return matchesSkill && matchesLevel;
  });

  const stats = [
    { label: 'Chờ duyệt', value: pendingExams.filter(e => e.status === 'pending').length, icon: Clock, color: 'yellow' },
    { label: 'Từ Teacher', value: pendingExams.filter(e => e.uploaderType === 'teacher').length, icon: User, color: 'blue' },
    { label: 'Từ Uploader', value: pendingExams.filter(e => e.uploaderType === 'uploader').length, icon: Upload, color: 'purple' },
    { label: 'Tổng đề mới', value: pendingExams.length, icon: FileText, color: 'green' },
  ];

  const getSkillIcon = (skill: string) => {
    const icons = {
      Reading: BookOpen,
      Listening: Headphones,
      Writing: PenTool,
      Speaking: Mic
    };
    return icons[skill as keyof typeof icons];
  };

  const getSkillColor = (skill: string) => {
    const colors = {
      Reading: 'text-blue-600 bg-blue-50 border-blue-200',
      Listening: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      Writing: 'text-violet-600 bg-violet-50 border-violet-200',
      Speaking: 'text-amber-600 bg-amber-50 border-amber-200'
    };
    return colors[skill as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                  <Icon className={`size-6 text-${stat.color}-600`} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="size-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">⏳ Quy trình duyệt đề thi</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              <strong>1. Kiểm tra nội dung:</strong> Đảm bảo đề thi tuân thủ format VSTEP, có đầy đủ câu hỏi và đáp án
              <br />
              <strong>2. Đánh giá chất lượng:</strong> Xem xét độ khó, tính phù hợp với cấp độ
              <br />
              <strong>3. Quyết định:</strong> Phê duyệt hoặc từ chối (kèm feedback chi tiết)
              <br />
              <span className="text-yellow-200">⚡ Thời gian duyệt: 24-48 giờ từ khi nhận được đề</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Lọc theo kỹ năng</label>
            <select 
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả kỹ năng</option>
              <option value="Reading">Reading</option>
              <option value="Listening">Listening</option>
              <option value="Writing">Writing</option>
              <option value="Speaking">Speaking</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Lọc theo cấp độ</label>
            <select 
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả cấp độ</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold text-blue-600">{filteredExams.length}</span> đề thi chờ duyệt
        </p>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => {
          const SkillIcon = getSkillIcon(exam.skill);
          const skillColor = getSkillColor(exam.skill);
          
          return (
            <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
              {/* Header */}
              <div className={`p-4 ${skillColor} border-b`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <SkillIcon className="size-5" />
                    <span className="font-medium">{exam.skill}</span>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-white border border-current">
                    {exam.level}
                  </span>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-500 text-white inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  Chờ duyệt
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[3rem]">{exam.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <User className="size-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{exam.uploadedBy}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Upload className="size-4 flex-shrink-0" />
                    <span>{exam.uploadDate}</span>
                  </div>
                </div>

                {exam.description && (
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2 bg-gray-50 p-2 rounded">
                    {exam.description}
                  </p>
                )}

                {/* Uploader Type Badge */}
                <div className="mb-4">
                  {exam.uploaderType === 'teacher' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                      👨‍🏫 Đóng góp từ Teacher
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                      📤 Upload bởi Content Uploader
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedExam(exam);
                      setShowReviewModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <Eye className="size-4" />
                    Xem & Duyệt
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredExams.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="size-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có đề thi chờ duyệt</h3>
          <p className="text-gray-600">Tất cả đề thi đã được xử lý</p>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedExam && (
        <ReviewExamModal 
          exam={selectedExam}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedExam(null);
          }}
          onApprove={() => {
            alert(`Đã phê duyệt đề thi "${selectedExam.title}"!`);
            setShowReviewModal(false);
            setSelectedExam(null);
          }}
          onReject={() => {
            alert(`Đã từ chối đề thi "${selectedExam.title}"!`);
            setShowReviewModal(false);
            setSelectedExam(null);
          }}
        />
      )}
    </div>
  );
}

// Review Exam Modal
function ReviewExamModal({ 
  exam, 
  onClose, 
  onApprove, 
  onReject 
}: { 
  exam: PendingExam; 
  onClose: () => void; 
  onApprove: () => void; 
  onReject: () => void;
}) {
  const [feedback, setFeedback] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const SkillIcon = {
    Reading: BookOpen,
    Listening: Headphones,
    Writing: PenTool,
    Speaking: Mic
  }[exam.skill];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 text-white sticky top-0">
          <div>
            <h3 className="text-xl font-bold">Duyệt đề thi</h3>
            <p className="text-sm opacity-90 mt-1">Kiểm tra và quyết định phê duyệt</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Exam Info */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <SkillIcon className="size-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                    {exam.skill}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                    {exam.level}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                    ID: {exam.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Tải lên bởi</p>
                <p className="font-medium text-gray-900">{exam.uploadedBy}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Ngày tải lên</p>
                <p className="font-medium text-gray-900">{exam.uploadDate}</p>
              </div>
              {exam.description && (
                <div className="col-span-2">
                  <p className="text-gray-600 mb-1">Mô tả</p>
                  <p className="font-medium text-gray-900">{exam.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="flex items-center gap-2 text-gray-900 mb-4">
              <FileText className="size-5" />
              Xem trước đề thi
            </h4>
            <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
              <Eye className="size-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">Preview đề thi tại đây</p>
              <div className="flex gap-3 justify-center">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Xem file đề thi
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  Xem đáp án
                </button>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="flex items-center gap-2 text-blue-900 mb-4">
              <CheckCircle className="size-5" />
              Checklist kiểm tra
            </h4>
            <div className="space-y-3">
              {[
                'Đề thi tuân thủ format VSTEP chuẩn',
                'Có đầy đủ câu hỏi và đáp án',
                'Độ khó phù hợp với cấp độ',
                'Nội dung không vi phạm bản quyền',
                'File đề thi và đáp án rõ ràng'
              ].map((item, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer hover:bg-blue-100 p-2 rounded">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                  <span className="text-sm text-blue-900">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reject Form */}
          {showRejectForm && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h4 className="flex items-center gap-2 text-red-900 mb-4">
                <MessageSquare className="size-5" />
                Lý do từ chối *
              </h4>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                placeholder="Nhập lý do từ chối để người upload có thể chỉnh sửa và tải lại..."
                className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              />
              <p className="text-xs text-red-700 mt-2">
                Feedback này sẽ được gửi đến người upload để họ có thể cải thiện và tải lại đề thi.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
          {!showRejectForm ? (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <ThumbsDown className="size-4" />
                Từ chối
              </button>
              <button
                onClick={onApprove}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <ThumbsUp className="size-4" />
                Phê duyệt
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowRejectForm(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (!feedback.trim()) {
                    alert('Vui lòng nhập lý do từ chối!');
                    return;
                  }
                  onReject();
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle className="size-4" />
                Xác nhận từ chối
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
