import { X, BookOpen, Calendar, User, Tag, Eye, CheckCircle, XCircle, AlertCircle, Clock, FileText } from 'lucide-react';
import { useState } from 'react';

type BlogStatus = 'published' | 'draft' | 'pending' | 'rejected';
type Category = 'introduction' | 'structure' | 'reading' | 'listening' | 'writing' | 'speaking' | 'sample-tests' | 'study-materials' | 'news';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  category: Category;
  author: string;
  authorRole?: 'admin' | 'teacher';
  createdDate: string;
  updatedDate: string;
  status: BlogStatus;
  views: number;
  tags: string[];
  adminFeedback?: string;
}

interface BlogDetailModalProps {
  blog: BlogPost;
  onClose: () => void;
  onApprove?: (blog: BlogPost) => void;
  onReject?: (blog: BlogPost, feedback: string) => void;
}

export function BlogDetailModal({ blog, onClose, onApprove, onReject }: BlogDetailModalProps) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState('');

  const getStatusBadge = (status: BlogStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg">
            <CheckCircle className="size-4" />
            Đã xuất bản
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg">
            <Clock className="size-4" />
            Chờ duyệt
          </span>
        );
      case 'draft':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg">
            <FileText className="size-4" />
            Nháp
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg">
            <XCircle className="size-4" />
            Đã từ chối
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: Category) => {
    const labels: Record<Category, string> = {
      introduction: 'Giới thiệu VSTEP',
      structure: 'Cấu trúc thi',
      reading: 'Reading Tips',
      listening: 'Listening Tips',
      writing: 'Writing Tips',
      speaking: 'Speaking Tips',
      'sample-tests': 'Đề thi mẫu',
      'study-materials': 'Tài liệu ôn tập',
      news: 'Tin tức & Lịch thi',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: Category) => {
    const colors: Record<Category, string> = {
      introduction: 'bg-blue-100 text-blue-700',
      structure: 'bg-purple-100 text-purple-700',
      reading: 'bg-green-100 text-green-700',
      listening: 'bg-orange-100 text-orange-700',
      writing: 'bg-pink-100 text-pink-700',
      speaking: 'bg-indigo-100 text-indigo-700',
      'sample-tests': 'bg-red-100 text-red-700',
      'study-materials': 'bg-teal-100 text-teal-700',
      news: 'bg-amber-100 text-amber-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove(blog);
      onClose();
    }
  };

  const handleReject = () => {
    if (onReject && rejectFeedback.trim()) {
      onReject(blog, rejectFeedback);
      onClose();
    } else {
      alert('Vui lòng nhập lý do từ chối!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="size-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-2">📝 Chi tiết bài viết Blog</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getCategoryColor(blog.category)}`}>
                      {getCategoryLabel(blog.category)}
                    </span>
                    {getStatusBadge(blog.status)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">ID: #{blog.id} • Tạo: {blog.createdDate}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors">
              <X className="size-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
            <h4 className="flex items-center gap-2 text-indigo-700 mb-2">
              <FileText className="size-5" />
              Tiêu đề bài viết
            </h4>
            <h2 className="text-2xl font-bold text-gray-900">{blog.title}</h2>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="flex items-center gap-2 mb-3">
              <BookOpen className="size-5 text-gray-700" />
              Mô tả ngắn
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{blog.description}</p>
          </div>

          {/* Author & Meta Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <User className="size-4" />
                <span className="text-xs font-medium">Tác giả</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{blog.author}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${
                blog.authorRole === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {blog.authorRole === 'admin' ? 'Admin' : 'Giáo viên'}
              </span>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <Eye className="size-4" />
                <span className="text-xs font-medium">Lượt xem</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{blog.views.toLocaleString()}</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-orange-700 mb-2">
                <Calendar className="size-4" />
                <span className="text-xs font-medium">Ngày tạo</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{blog.createdDate}</p>
            </div>

            <div className="bg-pink-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-pink-700 mb-2">
                <Calendar className="size-4" />
                <span className="text-xs font-medium">Cập nhật lần cuối</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{blog.updatedDate}</p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="flex items-center gap-2 mb-3">
              <Tag className="size-5 text-gray-700" />
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <h4 className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <FileText className="size-5 text-gray-700" />
              Nội dung bài viết
            </h4>
            <div className="prose max-w-none">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{blog.content}</p>
            </div>
          </div>

          {/* Admin Feedback (if rejected) */}
          {blog.status === 'rejected' && blog.adminFeedback && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <h4 className="flex items-center gap-2 text-red-700 mb-2">
                <AlertCircle className="size-5" />
                Phản hồi từ Admin
              </h4>
              <p className="text-sm text-red-700">{blog.adminFeedback}</p>
            </div>
          )}

          {/* Reject Form (when clicking Reject button) */}
          {showRejectForm && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <h4 className="flex items-center gap-2 text-red-700 mb-3">
                <AlertCircle className="size-5" />
                Lý do từ chối
              </h4>
              <textarea
                value={rejectFeedback}
                onChange={(e) => setRejectFeedback(e.target.value)}
                placeholder="Nhập lý do từ chối bài viết (bắt buộc)..."
                className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                rows={4}
              />
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <XCircle className="size-4" />
                  Xác nhận từ chối
                </button>
                <button
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectFeedback('');
                  }}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Đóng
            </button>
            <div className="flex gap-3">
              {blog.status === 'pending' && !showRejectForm && (
                <>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="size-4" />
                    Từ chối bài viết
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="size-4" />
                    Duyệt bài viết
                  </button>
                </>
              )}
              {blog.status === 'published' && (
                <div className="flex items-center gap-2 text-green-700 bg-green-100 px-4 py-2 rounded-lg">
                  <CheckCircle className="size-4" />
                  <span className="text-sm font-medium">Bài viết đã được xuất bản</span>
                </div>
              )}
              {blog.status === 'rejected' && (
                <div className="flex items-center gap-2 text-red-700 bg-red-100 px-4 py-2 rounded-lg">
                  <XCircle className="size-4" />
                  <span className="text-sm font-medium">Bài viết đã bị từ chối</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
