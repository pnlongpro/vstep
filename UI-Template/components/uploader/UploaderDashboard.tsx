import { useState } from 'react';
import { Upload, FileText, CheckCircle, Clock, XCircle, Eye, Trash2, Edit, BookOpen, Headphones, PenTool, Mic, Home } from 'lucide-react';
import { UploaderExamUploadModal } from './UploaderExamUploadModal';

interface Exam {
  id: string;
  title: string;
  skill: 'Reading' | 'Listening' | 'Writing' | 'Speaking';
  level: 'A2' | 'B1' | 'B2' | 'C1';
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
}

interface UploaderDashboardProps {
  onBack?: () => void;
}

export function UploaderDashboard({ onBack }: UploaderDashboardProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock data
  const myExams: Exam[] = [
    {
      id: 'UP001',
      title: 'VSTEP Reading B2 - Test 45',
      skill: 'Reading',
      level: 'B2',
      uploadDate: '2024-12-12 14:30',
      status: 'approved'
    },
    {
      id: 'UP002',
      title: 'VSTEP Listening B1 - Test 28',
      skill: 'Listening',
      level: 'B1',
      uploadDate: '2024-12-12 13:15',
      status: 'pending'
    },
    {
      id: 'UP003',
      title: 'VSTEP Writing C1 - Test 12',
      skill: 'Writing',
      level: 'C1',
      uploadDate: '2024-12-12 10:45',
      status: 'rejected',
      feedback: 'Đề thi thiếu phần hướng dẫn. Vui lòng bổ sung và upload lại.'
    },
    {
      id: 'UP004',
      title: 'VSTEP Speaking B2 - Test 56',
      skill: 'Speaking',
      level: 'B2',
      uploadDate: '2024-12-11 16:20',
      status: 'approved'
    },
  ];

  const stats = [
    { label: 'Tổng đề đã tải', value: myExams.length, icon: FileText, color: 'blue' },
    { label: 'Đã duyệt', value: myExams.filter(e => e.status === 'approved').length, icon: CheckCircle, color: 'green' },
    { label: 'Chờ duyệt', value: myExams.filter(e => e.status === 'pending').length, icon: Clock, color: 'yellow' },
    { label: 'Bị từ chối', value: myExams.filter(e => e.status === 'rejected').length, icon: XCircle, color: 'red' },
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tải đề thi</h1>
              <p className="text-sm text-gray-600 mt-1">Hệ thống upload đề thi VSTEP</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <Home className="size-4" />
                Về trang chủ
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                <Upload className="size-5" />
                Tải đề thi mới
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
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

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="flex items-center gap-2 text-blue-900 mb-3">
            <FileText className="size-5" />
            Hướng dẫn tải đề thi
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Mỗi đề thi phải có đầy đủ: nội dung câu hỏi, đáp án, hướng dẫn chấm điểm</li>
            <li>• Chọn đúng kỹ năng (Reading/Listening/Writing/Speaking) và cấp độ (A2/B1/B2/C1)</li>
            <li>• Đề thi sẽ được Admin kiểm duyệt trước khi xuất hiện trên web</li>
            <li>• Nếu bị từ chối, vui lòng xem feedback và upload lại</li>
          </ul>
        </div>

        {/* Exam List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Danh sách đề thi của tôi</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm text-gray-600">Tên đề thi</th>
                  <th className="text-left py-3 px-6 text-sm text-gray-600">Kỹ năng</th>
                  <th className="text-left py-3 px-6 text-sm text-gray-600">Cấp độ</th>
                  <th className="text-left py-3 px-6 text-sm text-gray-600">Ngày tải</th>
                  <th className="text-left py-3 px-6 text-sm text-gray-600">Trạng thái</th>
                  <th className="text-left py-3 px-6 text-sm text-gray-600">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {myExams.map((exam) => {
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
                              className="p-1.5 hover:bg-gray-200 rounded"
                              title="Chỉnh sửa"
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
        </div>

        {/* Feedback Section - Show rejected exams */}
        {myExams.filter(e => e.status === 'rejected').length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="flex items-center gap-2 text-red-900 mb-4">
              <XCircle className="size-5" />
              Đề thi cần chỉnh sửa
            </h3>
            <div className="space-y-3">
              {myExams.filter(e => e.status === 'rejected').map(exam => (
                <div key={exam.id} className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900">{exam.title}</p>
                    <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                      <Edit className="size-3" />
                      Sửa và tải lại
                    </button>
                  </div>
                  <p className="text-sm text-red-700">
                    <strong>Lý do từ chối:</strong> {exam.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploaderExamUploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}