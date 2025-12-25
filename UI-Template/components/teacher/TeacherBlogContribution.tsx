import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Clock, CheckCircle, XCircle, Send, AlertCircle, X, Calendar } from 'lucide-react';

type BlogStatus = 'draft' | 'pending' | 'published' | 'rejected';
type ViewMode = 'list' | 'create' | 'history';

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

export function TeacherBlogContribution() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Phương pháp luyện Reading VSTEP hiệu quả',
      excerpt: 'Chia sẻ kinh nghiệm giảng dạy kỹ năng đọc hiểu cho học viên VSTEP...',
      content: 'Nội dung đầy đủ bài viết...',
      category: 'Kỹ năng Reading',
      status: 'published',
      author: 'Nguyễn Văn A',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      views: 1250,
      publishedAt: '2024-01-20',
    },
    {
      id: '2',
      title: 'Cách cải thiện Speaking trong 30 ngày',
      excerpt: 'Lộ trình học tập chi tiết giúp học viên tự tin hơn khi thi Speaking...',
      content: 'Nội dung đầy đủ bài viết...',
      category: 'Kỹ năng Speaking',
      status: 'pending',
      author: 'Nguyễn Văn A',
      createdAt: '2024-02-10',
      updatedAt: '2024-02-10',
      views: 0,
    },
    {
      id: '3',
      title: 'Những lỗi thường gặp trong bài thi Writing',
      excerpt: 'Phân tích các lỗi phổ biến và cách khắc phục hiệu quả...',
      content: 'Nội dung đầy đủ bài viết...',
      category: 'Kỹ năng Writing',
      status: 'draft',
      author: 'Nguyễn Văn A',
      createdAt: '2024-02-12',
      updatedAt: '2024-02-12',
      views: 0,
    },
    {
      id: '4',
      title: 'Chiến lược làm bài Listening Part 3',
      excerpt: 'Kỹ thuật ghi chú và dự đoán đáp án cho Part 3...',
      content: 'Nội dung đầy đủ bài viết...',
      category: 'Kỹ năng Listening',
      status: 'rejected',
      author: 'Nguyễn Văn A',
      createdAt: '2024-02-08',
      updatedAt: '2024-02-08',
      views: 0,
      adminFeedback: 'Nội dung cần bổ sung thêm ví dụ cụ thể và hình ảnh minh họa.',
    },
    {
      id: '5',
      title: '10 Mẹo làm bài thi VSTEP hiệu quả',
      excerpt: 'Tổng hợp các mẹo hay giúp tăng điểm VSTEP...',
      content: 'Nội dung đầy đủ bài viết...',
      category: 'Mẹo luyện thi',
      status: 'published',
      author: 'Nguyễn Văn A',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
      views: 2340,
      publishedAt: '2024-01-20',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<BlogStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
  // Create/Edit form states
  const [formTitle, setFormTitle] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);

  // History tab states
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyFilterStatus, setHistoryFilterStatus] = useState<BlogStatus | 'all'>('all');
  const [historyFilterCategory, setHistoryFilterCategory] = useState<string>('all');

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const filteredHistoryPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(historySearchTerm.toLowerCase());
    const matchesStatus = historyFilterStatus === 'all' || post.status === historyFilterStatus;
    const matchesCategory = historyFilterCategory === 'all' || post.category === historyFilterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: posts.length,
    draft: posts.filter(p => p.status === 'draft').length,
    pending: posts.filter(p => p.status === 'pending').length,
    published: posts.filter(p => p.status === 'published').length,
    rejected: posts.filter(p => p.status === 'rejected').length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0)
  };

  const handleCreatePost = (status: BlogStatus) => {
    if (!formTitle.trim() || !formExcerpt.trim() || !formContent.trim()) {
      alert('Vui lòng điền đầy đủ thông tin bài viết');
      return;
    }

    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: formTitle,
      excerpt: formExcerpt,
      content: formContent,
      category: formCategory,
      status: status,
      author: 'Nguyễn Văn A',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      views: 0,
    };

    setPosts([...posts, newPost]);
    
    // Reset form
    setFormTitle('');
    setFormExcerpt('');
    setFormContent('');
    setFormCategory(CATEGORIES[0]);
    setViewMode('list');
    
    const statusText = status === 'draft' ? 'lưu nháp' : 'gửi duyệt';
    alert(`Đã ${statusText} bài viết thành công!`);
  };

  const handleEditPost = () => {
    if (!editingPost) return;
    
    if (!formTitle.trim() || !formExcerpt.trim() || !formContent.trim()) {
      alert('Vui lòng điền đầy đủ thông tin bài viết');
      return;
    }

    const updatedPosts = posts.map(p => 
      p.id === editingPost.id 
        ? {
            ...p,
            title: formTitle,
            excerpt: formExcerpt,
            content: formContent,
            category: formCategory,
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : p
    );

    setPosts(updatedPosts);
    setEditingPost(null);
    setFormTitle('');
    setFormExcerpt('');
    setFormContent('');
    setFormCategory(CATEGORIES[0]);
    setViewMode('list');
    alert('Đã cập nhật bài viết thành công!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
      setPosts(posts.filter(p => p.id !== id));
      alert('Đã xóa bài viết!');
    }
  };

  const handleSubmitForReview = (id: string) => {
    const updatedPosts = posts.map(p => 
      p.id === id ? { ...p, status: 'pending' as BlogStatus } : p
    );
    setPosts(updatedPosts);
    alert('Đã gửi bài viết để Admin duyệt!');
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormExcerpt(post.excerpt);
    setFormContent(post.content);
    setFormCategory(post.category);
    setViewMode('create');
  };

  const getStatusBadge = (status: BlogStatus) => {
    const badges = {
      draft: { label: 'Nháp', icon: Edit, color: 'bg-gray-100 text-gray-700' },
      pending: { label: 'Chờ duyệt', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
      published: { label: 'Đã xuất bản', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
      rejected: { label: 'Từ chối', icon: XCircle, color: 'bg-red-100 text-red-700' }
    };
    const badge = badges[status];
    const Icon = badge.icon;
    return (
      <span className={`flex items-center gap-1 px-3 py-1 ${badge.color} rounded-full text-sm font-medium`}>
        <Icon className="size-4" />
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đóng góp Blog Website</h1>
          <p className="text-sm text-gray-600 mt-1">Chia sẻ kiến thức và kinh nghiệm giảng dạy VSTEP</p>
        </div>
        {viewMode === 'list' && (
          <button
            onClick={() => {
              setEditingPost(null);
              setFormTitle('');
              setFormExcerpt('');
              setFormContent('');
              setFormCategory(CATEGORIES[0]);
              setViewMode('create');
            }}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
          >
            <Plus className="size-5" />
            Viết bài mới
          </button>
        )}
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Filter className="size-5" />
            Tất cả bài viết
          </button>
          <button
            onClick={() => {
              setEditingPost(null);
              setFormTitle('');
              setFormExcerpt('');
              setFormContent('');
              setFormCategory(CATEGORIES[0]);
              setViewMode('create');
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'create'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Plus className="size-5" />
            {editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết'}
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'history'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Clock className="size-5" />
            Lịch sử đóng góp
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              viewMode === 'history' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {posts.length}
            </span>
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Filter className="size-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</h3>
              <p className="text-sm text-gray-600">Tổng bài viết</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Edit className="size-6 text-gray-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.draft}</h3>
              <p className="text-sm text-gray-600">Bản nháp</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="size-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.pending}</h3>
              <p className="text-sm text-gray-600">Chờ duyệt</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="size-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.published}</h3>
              <p className="text-sm text-gray-600">Đã xuất bản</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Eye className="size-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalViews}</h3>
              <p className="text-sm text-gray-600">Lượt xem</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả danh mục</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as BlogStatus | 'all')}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="draft">Nháp</option>
                <option value="pending">Chờ duyệt</option>
                <option value="published">Đã xuất bản</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-3">{post.excerpt}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                        {post.category}
                      </span>
                      {getStatusBadge(post.status)}
                      <span className="text-sm text-gray-500">
                        {formatDate(post.createdAt)}
                      </span>
                      {post.status === 'published' && (
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <Eye className="size-4" />
                          {post.views} lượt xem
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {post.status === 'rejected' && post.adminFeedback && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Phản hồi:</strong> {post.adminFeedback}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {(post.status === 'draft' || post.status === 'rejected') && (
                    <>
                      <button
                        onClick={() => startEdit(post)}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
                      >
                        <Edit className="size-4" />
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => handleSubmitForReview(post.id)}
                        className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium"
                      >
                        <Send className="size-4" />
                        Gửi duyệt
                      </button>
                    </>
                  )}
                  {post.status === 'published' && (
                    <button className="flex items-center gap-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium">
                      <Eye className="size-4" />
                      Xem bài viết
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                  >
                    <Trash2 className="size-4" />
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-16 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="size-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài viết</h3>
              <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tạo bài viết mới</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit View */}
      {viewMode === 'create' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề bài viết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tóm tắt <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Nội dung chi tiết bài viết..."
                  rows={12}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="mt-2 text-sm text-gray-500">Tối thiểu 500 từ</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => setViewMode('list')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={() => editingPost ? handleEditPost() : handleCreatePost('draft')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
              >
                Lưu nháp
              </button>
              <button
                onClick={() => editingPost ? handleEditPost() : handleCreatePost('pending')}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center gap-2"
              >
                <Send className="size-5" />
                {editingPost ? 'Cập nhật & Gửi duyệt' : 'Gửi duyệt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History View */}
      {viewMode === 'history' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Filter className="size-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</h3>
              <p className="text-sm text-gray-600">Tổng bài viết</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Edit className="size-6 text-gray-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.draft}</h3>
              <p className="text-sm text-gray-600">Nháp</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="size-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.pending}</h3>
              <p className="text-sm text-gray-600">Chờ duyệt</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="size-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.published}</h3>
              <p className="text-sm text-gray-600">Đã xuất bản</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="size-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.rejected}</h3>
              <p className="text-sm text-gray-600">Từ chối</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Eye className="size-6 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalViews}</h3>
              <p className="text-sm text-gray-600">Lượt xem</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={historySearchTerm}
                  onChange={(e) => setHistorySearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={historyFilterCategory}
                  onChange={(e) => setHistoryFilterCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">Tất cả danh mục</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={historyFilterStatus}
                  onChange={(e) => setHistoryFilterStatus(e.target.value as BlogStatus | 'all')}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="draft">Nháp</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold text-purple-600">{filteredHistoryPosts.length}</span> bài viết
            </p>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredHistoryPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(post.status)}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="size-4" />
                    {formatDate(post.createdAt)}
                  </span>
                  {post.status === 'published' && (
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Eye className="size-4 text-blue-600" />
                      <span className="font-medium">{post.views}</span> lượt xem
                    </span>
                  )}
                </div>

                {/* Feedback for rejected */}
                {post.status === 'rejected' && post.adminFeedback && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong className="font-semibold">Lý do từ chối:</strong> {post.adminFeedback}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredHistoryPosts.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-16 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="size-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài viết</h3>
              <p className="text-gray-600">
                Không có bài viết nào phù hợp với bộ lọc hiện tại
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
