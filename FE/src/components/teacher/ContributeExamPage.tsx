import { useState } from 'react';
import { Upload, FileText, CheckCircle, Clock, XCircle, Eye, Trash2, Edit, BookOpen, Headphones, PenTool, Mic, AlertCircle, Award } from 'lucide-react';
import { TeacherExamUploadModal } from './TeacherExamUploadModal';

interface Exam {
  id: string;
  title: string;
  skill: 'Reading' | 'Listening' | 'Writing' | 'Speaking';
  level: 'A2' | 'B1' | 'B2' | 'C1';
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
}

export function ContributeExamPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock data
  const myContributions: Exam[] = [
    {
      id: 'TC001',
      title: 'VSTEP Reading B2 - Advanced Comprehension',
      skill: 'Reading',
      level: 'B2',
      uploadDate: '2024-12-10 09:30',
      status: 'approved'
    },
    {
      id: 'TC002',
      title: 'VSTEP Listening C1 - Academic Lectures',
      skill: 'Listening',
      level: 'C1',
      uploadDate: '2024-12-11 14:20',
      status: 'pending'
    },
    {
      id: 'TC003',
      title: 'VSTEP Writing B1 - Essay Practice',
      skill: 'Writing',
      level: 'B1',
      uploadDate: '2024-12-08 16:45',
      status: 'rejected',
      feedback: 'Rubric chấm điểm chưa rõ ràng. Vui lòng bổ sung thêm tiêu chí đánh giá chi tiết.'
    },
  ];

  const stats = [
    { label: 'Tổng đề đóng góp', value: myContributions.length, icon: Upload, color: 'blue' },
    { label: 'Đã được duyệt', value: myContributions.filter(e => e.status === 'approved').length, icon: CheckCircle, color: 'green' },
    { label: 'Chờ duyệt', value: myContributions.filter(e => e.status === 'pending').length, icon: Clock, color: 'yellow' },
    { label: 'Điểm đóng góp', value: myContributions.filter(e => e.status === 'approved').length * 10, icon: Award, color: 'purple' },
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-700 border-green-200' },
      rejected: { label: 'Bị từ chối', color: 'bg-red-100 text-red-700 border-red-200' }
    };
    return badges[status as keyof typeof badges];
  };

  const getSkillIcon = (skill: string) => {
    const icons = {
      Reading: BookOpen,
      Listening: Headphones,
      Writing: PenTool,
      Speaking: Mic
    };
    return icons[skill as keyof typeof icons];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đóng góp đề thi</h1>
          <p className="text-sm text-gray-600 mt-1">Chia sẻ đề thi chất lượng với cộng đồng VSTEPRO</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
        >
          <Upload className="size-5" />
          Đóng góp đề thi
        </button>
      </div>

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

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Benefits */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="flex items-center gap-2 text-emerald-900 mb-4">
            <Award className="size-5" />
            Lợi ích khi đóng góp
          </h3>
          <ul className="space-y-2 text-sm text-emerald-800">
            <li>✅ Chia sẻ kinh nghiệm với cộng đồng giáo viên</li>
            <li>✅ Đề thi được sử dụng rộng rãi trên nền tảng</li>
            <li>✅ Tích lũy điểm đóng góp (10 điểm/đề được duyệt)</li>
            <li>✅ Nâng cao uy tín nghề nghiệp</li>
          </ul>
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="flex items-center gap-2 text-blue-900 mb-4">
            <FileText className="size-5" />
            Yêu cầu đề thi
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Đề thi phải tuân thủ chuẩn format VSTEP</li>
            <li>• Đầy đủ câu hỏi, đáp án, hướng dẫn chấm</li>
            <li>• Chọn đúng kỹ năng và cấp độ</li>
            <li>• Admin sẽ kiểm duyệt trong vòng 24-48h</li>
          </ul>
        </div>
      </div>

      {/* Exam List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Lịch sử đóng góp</h2>
        </div>
        
        {myContributions.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="size-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có đề thi đóng góp</h3>
            <p className="text-gray-600 mb-6">Hãy bắt đầu chia sẻ đề thi chất lượng với cộng đồng!</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Upload className="size-5" />
              Đóng góp đề thi đầu tiên
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm text-gray-600">Tên đề thi</th>
                  <th className="text-left py-3 px-6 text-sm text-gray-600">Kỹ năng</th>
                  <th className="text-left py-3 px-6 text-sm text-gray-600">Cấp độ</th>
                  <th className="text-left py-3 px-6 text-sm text-gray-600">Ngày gửi</th>
                  <th className="text-left py-3 px-6 text-sm text-gray-600">Trạng thái</th>
                  <th className="text-left py-3 px-6 text-sm text-gray-600">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {myContributions.map((exam) => {
                  const SkillIcon = getSkillIcon(exam.skill);
                  const statusBadge = getStatusBadge(exam.status);
                  
                  return (
                    <tr key={exam.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-900">{exam.title}</p>
                        <p className="text-xs text-gray-500 mt-1">ID: {exam.id}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <SkillIcon className="size-4 text-gray-600" />
                          <span className="text-sm text-gray-700">{exam.skill}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                          {exam.level}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{exam.uploadDate}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 text-xs rounded-full border ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-1.5 hover:bg-gray-200 rounded"
                            title="Xem chi tiết"
                          >
                            <Eye className="size-4 text-gray-600" />
                          </button>
                          {exam.status === 'rejected' && (
                            <button 
                              onClick={() => setShowUploadModal(true)}
                              className="p-1.5 hover:bg-gray-200 rounded"
                              title="Chỉnh sửa và gửi lại"
                            >
                              <Edit className="size-4 text-blue-600" />
                            </button>
                          )}
                          {exam.status === 'pending' && (
                            <button 
                              className="p-1.5 hover:bg-gray-200 rounded"
                              title="Xóa"
                            >
                              <Trash2 className="size-4 text-red-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Feedback Section */}
      {myContributions.filter(e => e.status === 'rejected').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="flex items-center gap-2 text-red-900 mb-4">
            <AlertCircle className="size-5" />
            Đề thi cần chỉnh sửa
          </h3>
          <div className="space-y-3">
            {myContributions.filter(e => e.status === 'rejected').map(exam => (
              <div key={exam.id} className="bg-white rounded-lg p-4 border border-red-200">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900">{exam.title}</p>
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="size-3" />
                    Sửa và gửi lại
                  </button>
                </div>
                <p className="text-sm text-red-700">
                  <strong>Feedback từ Admin:</strong> {exam.feedback}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <TeacherExamUploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}