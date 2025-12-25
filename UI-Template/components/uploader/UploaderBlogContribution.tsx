import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Clock, CheckCircle, XCircle, Send, AlertCircle } from 'lucide-react';

type BlogStatus = 'draft' | 'pending' | 'published' | 'rejected';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  status: BlogStatus;
  author: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  adminFeedback?: string;
  publishedAt?: string;
}

const CATEGORIES = [
  'Tổng quan VSTEP',
  'Kỹ năng Reading',
  'Kỹ năng Listening',
  'Kỹ năng Writing',
  'Kỹ năng Speaking',
  'Mẹo luyện thi',
  'Kinh nghiệm thi thật',
  'Tài liệu luyện thi',
  'Phương pháp học',
  'Tin tức VSTEP',
];

export function UploaderBlogContribution() {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Cách phân biệt các thì trong tiếng Anh',
      excerpt: 'Hướng dẫn chi tiết phân biệt 12 thì cơ bản trong tiếng Anh...',
      content: '',
      category: 'Phương pháp học',
      status: 'published',
      author: 'Content Uploader',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
      views: 850,
      publishedAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Từ vựng VSTEP theo chủ đề',
      excerpt: 'Tổng hợp từ vựng quan trọng chia theo 20 chủ đề phổ biến...',
      content: '',
      category: 'Tài liệu luyện thi',
      status: 'pending',
      author: 'Content Uploader',
      createdAt: '2024-02-05',
      updatedAt: '2024-02-05',
      views: 0,
    },
    {
      id: '3',
      title: 'Mẹo làm bài Reading nhanh',
      excerpt: 'Kỹ thuật scanning và skimming hiệu quả...',
      content: '',
      category: 'Kỹ năng Reading',
      status: 'draft',
      author: 'Content Uploader',
      createdAt: '2024-02-08',
      updatedAt: '2024-02-08',
      views: 0,
    },
    {
      id: '4',
      title: 'Cấu trúc câu trong Writing Task 2',
      excerpt: 'Các mẫu câu thường dùng trong Writing...',
      content: '',
      category: 'Kỹ năng Writing',
      status: 'rejected',
      author: 'Content Uploader',
      createdAt: '2024-02-01',
      updatedAt: '2024-02-01',
      views: 0,
      adminFeedback: 'Cần bổ sung thêm ví dụ minh họa cụ thể cho mỗi cấu trúc câu. Vui lòng chỉnh sửa và gửi lại.',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<BlogStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: BlogStatus) => {
    const badges = {
      draft: { label: 'Bản nháp', color: 'bg-gray-100 text-gray-700', icon: <Clock className="size-3" /> },
      pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700', icon: <AlertCircle className="size-3" /> },
      published: { label: 'Đã xuất bản', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="size-3" /> },
      rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-700', icon: <XCircle className="size-3" /> },
    };
    const badge = badges[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${badge.color}`}>
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const stats = [
    { label: 'Tổng bài viết', value: posts.length, color: 'bg-blue-500' },
    { label: 'Đã xuất bản', value: posts.filter(p => p.status === 'published').length, color: 'bg-green-500' },
    { label: 'Chờ duyệt', value: posts.filter(p => p.status === 'pending').length, color: 'bg-yellow-500' },
    { label: 'Bản nháp', value: posts.filter(p => p.status === 'draft').length, color: 'bg-gray-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Đóng góp Blog Website</h2>
          <p className="text-sm text-gray-600 mt-1">Quản lý các bài viết blog của bạn về VSTEP</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          <Plus className="size-5" />
          Tạo bài viết mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <div className="text-white text-xl">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as BlogStatus | 'all')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="draft">Bản nháp</option>
              <option value="pending">Chờ duyệt</option>
              <option value="published">Đã xuất bản</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none"
            >
              <option value="all">Tất cả chuyên mục</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Tiêu đề</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Chuyên mục</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Lượt xem</th>
                <th className="px-6 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{post.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{post.excerpt}</p>
                      {post.adminFeedback && post.status === 'rejected' && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700 flex items-start gap-2">
                          <AlertCircle className="size-4 flex-shrink-0 mt-0.5" />
                          <span><strong>Phản hồi:</strong> {post.adminFeedback}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{post.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(post.status)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{post.createdAt}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Eye className="size-4" />
                      {post.views}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === 'draft' && (
                        <button
                          onClick={() => {
                            const updatedPosts = posts.map(p =>
                              p.id === post.id ? { ...p, status: 'pending' as BlogStatus } : p
                            );
                            setPosts(updatedPosts);
                          }}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Gửi duyệt"
                        >
                          <Send className="size-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setEditingPost(post)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
                            setPosts(posts.filter(p => p.id !== post.id));
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">Không tìm thấy bài viết nào</div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-yellow-600 hover:text-yellow-700"
            >
              Tạo bài viết đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingPost) && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowCreateModal(false);
            setEditingPost(null);
          }}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl">
                {editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Tiêu đề</label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  defaultValue={editingPost?.title}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Chuyên mục</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  defaultValue={editingPost?.category}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Mô tả ngắn</label>
                <textarea
                  placeholder="Nhập mô tả ngắn về bài viết..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                  defaultValue={editingPost?.excerpt}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Nội dung</label>
                <textarea
                  placeholder="Nhập nội dung bài viết..."
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                  defaultValue={editingPost?.content}
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingPost(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Save as draft
                  setShowCreateModal(false);
                  setEditingPost(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Lưu nháp
              </button>
              <button
                onClick={() => {
                  // Submit for review
                  setShowCreateModal(false);
                  setEditingPost(null);
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Gửi duyệt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}