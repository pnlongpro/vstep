import { X, BookOpen, Tag, Save } from 'lucide-react';
import { useState } from 'react';

type BlogStatus = 'published' | 'draft' | 'pending' | 'rejected';
type Category = 'all' | 'introduction' | 'structure' | 'reading' | 'listening' | 'writing' | 'speaking' | 'sample-tests' | 'study-materials' | 'news';

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

interface BlogEditModalProps {
  blog: BlogPost;
  onClose: () => void;
  onUpdate: (updatedBlog: BlogPost) => void;
}

const categoryOptions = [
  { value: 'introduction', label: 'Giới thiệu VSTEP' },
  { value: 'structure', label: 'Cấu trúc đề thi' },
  { value: 'reading', label: 'Reading' },
  { value: 'listening', label: 'Listening' },
  { value: 'writing', label: 'Writing' },
  { value: 'speaking', label: 'Speaking' },
  { value: 'sample-tests', label: 'Đề thi mẫu' },
  { value: 'study-materials', label: 'Tài liệu học tập' },
  { value: 'news', label: 'Tin tức & Sự kiện' },
];

export function BlogEditModal({ blog, onClose, onUpdate }: BlogEditModalProps) {
  const [formData, setFormData] = useState({
    title: blog.title,
    description: blog.description,
    content: blog.content,
    category: blog.category,
    tags: blog.tags.join(', '),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    if (!formData.description.trim()) {
      alert('Vui lòng nhập mô tả bài viết');
      return;
    }
    if (!formData.content.trim()) {
      alert('Vui lòng nhập nội dung bài viết');
      return;
    }

    const updatedBlog: BlogPost = {
      ...blog,
      title: formData.title,
      description: formData.description,
      content: formData.content,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      updatedDate: new Date().toISOString().split('T')[0],
    };

    onUpdate(updatedBlog);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl mb-1 flex items-center gap-2">
                <BookOpen className="size-6 text-red-600" />
                Chỉnh sửa bài viết
              </h3>
              <p className="text-sm text-gray-600">ID: #{blog.id} • {blog.author}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X className="size-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề bài viết <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề bài viết"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả ngắn <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả ngắn về bài viết (hiển thị trong danh sách)"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung bài viết <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Nhập nội dung chi tiết bài viết..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">
              {formData.content.length} ký tự
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="VD: VSTEP, Reading, Tips (phân cách bằng dấu phẩy)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <div className="flex flex-wrap gap-2">
                {formData.tags.split(',').map((tag, index) => {
                  const trimmedTag = tag.trim();
                  if (!trimmedTag) return null;
                  return (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                      <Tag className="size-3" />
                      {trimmedTag}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Tạo: {blog.createdDate} • Cập nhật: {blog.updatedDate}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Save className="size-5" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}