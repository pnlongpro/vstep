import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Calendar, User, Tag, ArrowLeft, X, BookOpen, FileText, Filter, Clock, CheckCircle, XCircle, AlertCircle, Settings } from 'lucide-react';
import { BlogDetailModal } from './BlogDetailModal';
import { BlogEditModal } from './BlogEditModal';
import { CategoryManagementModal } from './CategoryManagementModal';

interface BlogManagementProps {
  onBack?: () => void;
}

type Category = 'all' | 'introduction' | 'structure' | 'reading' | 'listening' | 'writing' | 'speaking' | 'sample-tests' | 'study-materials' | 'news';
type BlogStatus = 'published' | 'draft' | 'pending' | 'rejected';

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

const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Giới thiệu về chứng chỉ VSTEP - Tất cả những gì bạn cần biết',
    description: 'Tìm hiểu chi tiết về chứng chỉ VSTEP, các cấp độ B1-B2-C1 và đối tượng thi phù hợp',
    content: 'Nội dung chi tiết về VSTEP...',
    category: 'introduction',
    author: 'Admin VSTEPRO',
    authorRole: 'admin',
    createdDate: '2025-01-15',
    updatedDate: '2025-01-15',
    status: 'published',
    views: 1234,
    tags: ['VSTEP', 'Giới thiệu', 'Chứng chỉ'],
  },
  {
    id: 2,
    title: 'Cấu trúc chi tiết bài thi VSTEP 2025',
    description: 'Phân tích từng phần thi: Listening, Reading, Writing, Speaking với thời gian và số câu hỏi cụ thể',
    content: 'Nội dung chi tiết về cấu trúc...',
    category: 'structure',
    author: 'Giáo viên Minh',
    authorRole: 'teacher',
    createdDate: '2025-01-14',
    updatedDate: '2025-01-14',
    status: 'published',
    views: 987,
    tags: ['Cấu trúc', 'Hình thức thi'],
  },
  {
    id: 3,
    title: '10 Chiến thuật làm bài Reading VSTEP hiệu quả',
    description: 'Hướng dẫn chi tiết các kỹ thuật skimming, scanning và time management cho Reading',
    content: 'Nội dung chi tiết về Reading...',
    category: 'reading',
    author: 'Giáo viên Hương',
    authorRole: 'teacher',
    createdDate: '2025-01-13',
    updatedDate: '2025-01-13',
    status: 'published',
    views: 2156,
    tags: ['Reading', 'Tips', 'Chiến thuật'],
  },
  {
    id: 10,
    title: 'Phương pháp luyện Speaking hiệu quả cho người mới bắt đầu',
    description: 'Chia sẻ kinh nghiệm và phương pháp luyện Speaking từ cơ bản đến nâng cao',
    content: 'Nội dung chi tiết về Speaking...',
    category: 'speaking',
    author: 'Giáo viên Thanh',
    authorRole: 'teacher',
    createdDate: '2025-02-10',
    updatedDate: '2025-02-10',
    status: 'pending',
    views: 0,
    tags: ['Speaking', 'Beginner', 'Tips'],
  },
  {
    id: 11,
    title: 'Lộ trình học Writing Task 2 từ 0',
    description: 'Hướng dẫn chi tiết cách học Writing Task 2 từ cơ bản với các bước cụ thể',
    content: 'Nội dung chi tiết về Writing...',
    category: 'writing',
    author: 'Giáo viên Lan',
    authorRole: 'teacher',
    createdDate: '2025-02-08',
    updatedDate: '2025-02-08',
    status: 'pending',
    views: 0,
    tags: ['Writing', 'Task 2', 'Beginner'],
  },
  {
    id: 12,
    title: 'Những cách học từ vựng VSTEP hiệu quả nhất',
    description: 'Phương pháp học từ vựng với flashcard, context và spaced repetition',
    content: 'Nội dung chi tiết về từ vựng...',
    category: 'reading',
    author: 'Giáo viên Nam',
    authorRole: 'teacher',
    createdDate: '2025-02-05',
    updatedDate: '2025-02-05',
    status: 'rejected',
    views: 0,
    tags: ['Vocabulary', 'Tips'],
    adminFeedback: 'Nội dung cần bổ sung thêm ví dụ cụ thể và phương pháp thực hành. Vui lòng thêm ít nhất 5 ví dụ minh họa.',
  },
];

const initialCategories = [
  { id: 'all', name: 'Tất cả', icon: BookOpen, color: 'gray' },
  { id: 'introduction', name: 'Giới thiệu VSTEP', icon: FileText, color: 'blue' },
  { id: 'structure', name: 'Cấu trúc thi', icon: FileText, color: 'purple' },
  { id: 'reading', name: 'Reading Tips', icon: BookOpen, color: 'green' },
  { id: 'listening', name: 'Listening Tips', icon: BookOpen, color: 'orange' },
  { id: 'writing', name: 'Writing Tips', icon: FileText, color: 'pink' },
  { id: 'speaking', name: 'Speaking Tips', icon: FileText, color: 'indigo' },
  { id: 'sample-tests', name: 'Đề thi mẫu', icon: FileText, color: 'red' },
  { id: 'study-materials', name: 'Tài liệu ôn tập', icon: BookOpen, color: 'teal' },
  { id: 'news', name: 'Tin tức & Lịch thi', icon: Calendar, color: 'amber' },
];

export function BlogManagement({ onBack }: BlogManagementProps) {
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | BlogStatus>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'views'>('newest');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeView, setActiveView] = useState<'posts' | 'contributions'>('posts');
  const [contributionPeriod, setContributionPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('all');
  const [expandedContributor, setExpandedContributor] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  // Form states for create/edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'introduction' as Category,
    tags: '',
    status: 'published' as BlogStatus,
  });

  // Filter posts
  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      if (sortBy === 'oldest') return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      return b.views - a.views;
    });

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || 'gray';
  };

  const handleApprove = (postId: number) => {
    if (confirm('Bạn có chắc chắn muốn duyệt bài viết này?')) {
      setPosts(posts.map(p =>
        p.id === postId ? { ...p, status: 'published' as BlogStatus, updatedDate: new Date().toISOString().split('T')[0] } : p
      ));
    }
  };

  const handleReject = (post: BlogPost) => {
    setSelectedPost(post);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (!rejectFeedback.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    if (selectedPost) {
      setPosts(posts.map(p =>
        p.id === selectedPost.id
          ? { ...p, status: 'rejected' as BlogStatus, adminFeedback: rejectFeedback, updatedDate: new Date().toISOString().split('T')[0] }
          : p
      ));
      setShowRejectModal(false);
      setRejectFeedback('');
      setSelectedPost(null);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setShowEditModal(true);
  };

  const handleDelete = (postId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  const handleView = (post: BlogPost) => {
    setSelectedPost(post);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status: BlogStatus) => {
    const badges = {
      published: { label: 'Đã xuất bản', color: 'bg-green-50 text-green-700', icon: <CheckCircle className="size-3" />, dot: 'bg-green-600' },
      draft: { label: 'Bản nháp', color: 'bg-gray-50 text-gray-700', icon: <Clock className="size-3" />, dot: 'bg-gray-600' },
      pending: { label: 'Chờ duyệt', color: 'bg-yellow-50 text-yellow-700', icon: <AlertCircle className="size-3" />, dot: 'bg-yellow-600' },
      rejected: { label: 'Từ chối', color: 'bg-red-50 text-red-700', icon: <XCircle className="size-3" />, dot: 'bg-red-600' },
    };
    const badge = badges[status];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full ${badge.color}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
        {badge.label}
      </span>
    );
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      category: 'introduction',
      tags: '',
      status: 'published',
    });
  };

  const handleCreatePost = (asDraft: boolean = false) => {
    // Validation
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

    const newPost: BlogPost = {
      id: Math.max(...posts.map(p => p.id)) + 1,
      title: formData.title,
      description: formData.description,
      content: formData.content,
      category: formData.category,
      author: 'Admin VSTEPRO',
      authorRole: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      status: asDraft ? 'draft' : 'published',
      views: 0,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
    };

    setPosts([newPost, ...posts]);
    setShowCreateModal(false);
    resetForm();
    alert(`Bài viết đã được ${asDraft ? 'lưu nháp' : 'xuất bản'} thành công!`);
  };

  // Get contributors data
  const getContributorsData = () => {
    const contributors = new Map<string, {
      name: string;
      role: 'admin' | 'teacher';
      total: number;
      published: number;
      pending: number;
      rejected: number;
      draft: number;
      posts: BlogPost[];
    }>();

    posts.forEach(post => {
      if (!contributors.has(post.author)) {
        contributors.set(post.author, {
          name: post.author,
          role: post.authorRole || 'teacher',
          total: 0,
          published: 0,
          pending: 0,
          rejected: 0,
          draft: 0,
          posts: [],
        });
      }
      const contributor = contributors.get(post.author)!;
      contributor.total++;
      contributor.posts.push(post);
      if (post.status === 'published') contributor.published++;
      else if (post.status === 'pending') contributor.pending++;
      else if (post.status === 'rejected') contributor.rejected++;
      else if (post.status === 'draft') contributor.draft++;
    });

    return Array.from(contributors.values()).sort((a, b) => b.total - a.total);
  };

  const contributorsData = getContributorsData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="size-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl text-gray-900">Quản lý Blog VSTEP</h1>
            <p className="text-sm text-gray-600">Quản lý bài viết, duyệt bài đóng góp từ giáo viên</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Settings className="size-5" />
            <span>Quản lý chuyên mục</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="size-5" />
            <span>Tạo bài viết mới</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng bài viết</p>
              <p className="text-3xl mt-1">{posts.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <BookOpen className="size-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã xuất bản</p>
              <p className="text-3xl mt-1">
                {posts.filter(p => p.status === 'published').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="size-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Chờ duyệt</p>
              <p className="text-3xl mt-1">
                {posts.filter(p => p.status === 'pending').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="size-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Bản nháp</p>
              <p className="text-3xl mt-1">
                {posts.filter(p => p.status === 'draft').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
              <Clock className="size-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng lượt xem</p>
              <p className="text-3xl mt-1">
                {posts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Eye className="size-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle Tabs */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveView('posts')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeView === 'posts'
                ? 'border-b-2 border-blue-600 bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="size-5" />
              Danh sách bài viết
            </div>
          </button>
          <button
            onClick={() => setActiveView('contributions')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeView === 'contributions'
                ? 'border-b-2 border-purple-600 bg-purple-50 text-purple-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="size-5" />
              Lịch sử đóng góp ({contributorsData.length})
            </div>
          </button>
        </div>
      </div>

      {/* Content based on active view */}
      {activeView === 'posts' ? (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="space-y-4">
              {/* Search and Sort */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài viết theo tiêu đề, mô tả hoặc tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="views">Lượt xem</option>
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="published">Đã xuất bản</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="draft">Bản nháp</option>
                    <option value="rejected">Từ chối</option>
                  </select>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id as Category)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        isActive
                          ? `border-${cat.color}-600 bg-${cat.color}-50 text-${cat.color}-700`
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="size-4" />
                      <span>{cat.name}</span>
                      {cat.id !== 'all' && (
                        <span className="ml-1 text-xs opacity-70">
                          ({posts.filter(p => p.category === cat.id).length})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Blog Posts List */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Bài viết
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Chuyên mục
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Tác giả
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Lượt xem
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <BookOpen className="size-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">Không tìm thấy bài viết nào</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="max-w-md">
                            <p className="text-gray-900 mb-1">{post.title}</p>
                            <p className="text-sm text-gray-500 line-clamp-2">{post.description}</p>
                            {post.adminFeedback && post.status === 'rejected' && (
                              <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700 flex items-start gap-2">
                                <XCircle className="size-4 flex-shrink-0 mt-0.5" />
                                <div>
                                  <strong>Lý do từ chối:</strong> {post.adminFeedback}
                                </div>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {post.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                                >
                                  <Tag className="size-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-${getCategoryColor(post.category)}-50 text-${getCategoryColor(post.category)}-700 text-xs rounded-full`}>
                            {categories.find(c => c.id === post.category)?.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              post.authorRole === 'admin' 
                                ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                                : 'bg-gradient-to-br from-green-500 to-teal-500'
                            }`}>
                              <User className="size-4 text-white" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-900 block">{post.author}</span>
                              <span className={`text-xs ${post.authorRole === 'admin' ? 'text-blue-600' : 'text-green-600'}`}>
                                {post.authorRole === 'admin' ? 'Admin' : 'Giáo viên'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Calendar className="size-4" />
                            {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-700">
                            <Eye className="size-4" />
                            {post.views.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(post.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {post.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(post.id)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Duyệt bài"
                                >
                                  <CheckCircle className="size-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(post)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Từ chối"
                                >
                                  <XCircle className="size-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleView(post)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xem"
                            >
                              <Eye className="size-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(post)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit className="size-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-center text-sm text-gray-600">
            Hiển thị <span className="font-semibold">{filteredPosts.length}</span> / {posts.length} bài viết
          </div>
        </>
      ) : (
        <>
          {/* Contribution Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="size-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{posts.length}</h3>
              <p className="text-sm text-gray-600">Tổng đóng góp</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="size-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{posts.filter(p => p.status === 'pending').length}</h3>
              <p className="text-sm text-gray-600">Chờ duyệt</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="size-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{posts.filter(p => p.status === 'published').length}</h3>
              <p className="text-sm text-gray-600">Đã duyệt</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="size-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{posts.filter(p => p.status === 'rejected').length}</h3>
              <p className="text-sm text-gray-600">Từ chối</p>
            </div>
          </div>

          {/* Contribution Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết hoặc tác giả..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="draft">Bản nháp</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Category)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">Tất cả chuyên mục</option>
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold text-purple-600">{filteredPosts.length}</span> bài đóng góp
            </p>
          </div>

          {/* Contributions List (Card Style like Teacher) */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
            <div className="divide-y-2 divide-gray-200">
              {filteredPosts.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="size-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài đóng góp</h3>
                  <p className="text-gray-600">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Category Icon */}
                      <div className={`p-3 rounded-lg bg-${getCategoryColor(post.category)}-100`}>
                        <FileText className="size-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.description}</p>
                          </div>
                          <div className="ml-4">
                            {getStatusBadge(post.status)}
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-${getCategoryColor(post.category)}-50 text-${getCategoryColor(post.category)}-700 text-xs rounded-full font-medium`}>
                            {categories.find(c => c.id === post.category)?.name}
                          </span>
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                            >
                              <Tag className="size-3" />
                              {tag}
                            </span>
                          ))}
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs">
                            {post.views} lượt xem
                          </span>
                        </div>

                        {/* Author Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="size-4" />
                            {post.author}
                          </span>
                          <span className={`text-xs ${post.authorRole === 'admin' ? 'text-blue-600' : 'text-green-600'}`}>
                            ({post.authorRole === 'admin' ? 'Admin' : 'Giáo viên'})
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>

                        {/* Review Note (if rejected) */}
                        {post.status === 'rejected' && post.adminFeedback && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">
                              <strong>Lý do từ chối:</strong> {post.adminFeedback}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleView(post)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="size-5" />
                        </button>

                        {post.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(post.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                              <CheckCircle className="size-4" />
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleReject(post)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                              <XCircle className="size-4" />
                              Từ chối
                            </button>
                          </>
                        )}

                        {post.status === 'published' && (
                          <button
                            onClick={() => handleEdit(post)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit className="size-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl flex items-center gap-2">
                <XCircle className="size-6 text-red-600" />
                Từ chối bài viết
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Bài viết:</strong> {selectedPost.title}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Tác giả:</strong> {selectedPost.author}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Lý do từ chối <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={rejectFeedback}
                  onChange={(e) => setRejectFeedback(e.target.value)}
                  placeholder="Nhập lý do từ chối bài viết (giáo viên sẽ nhận được phản hồi này)..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectFeedback('');
                  setSelectedPost(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl flex items-center gap-2">
                  <Plus className="size-6 text-blue-600" />
                  Tạo bài viết mới
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Tiêu đề bài viết <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Chuyên mục <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.filter(c => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Mô tả ngắn <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập mô tả ngắn về bài viết (hiển thị trong danh sách)..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Nội dung bài viết <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nhập nội dung chi tiết của bài viết..."
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Gợi ý: Sử dụng markdown hoặc định dạng văn bản phù hợp
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Tags (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="VD: VSTEP, Reading, Tips, Chiến thuật"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Nhập các từ khóa liên quan, cách nhau bởi dấu phẩy
                </p>
              </div>

              {/* Preview Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-blue-900 mb-1">
                      <strong>Thông tin bài viết:</strong>
                    </p>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Tác giả: Admin VSTEPRO</li>
                      <li>• Ngày tạo: {new Date().toLocaleDateString('vi-VN')}</li>
                      <li>• Chuyên mục: {categories.find(c => c.id === formData.category)?.name}</li>
                      <li>• Số lượng tags: {formData.tags.split(',').filter(t => t.trim()).length}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-white transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handleCreatePost(true)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Lưu nháp
              </button>
              <button
                onClick={() => handleCreatePost(false)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="size-5" />
                Xuất bản ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedPost && (
        <BlogDetailModal
          blog={selectedPost}
          onClose={() => setShowDetailModal(false)}
          onApprove={(blog) => {
            setPosts(posts.map(p =>
              p.id === blog.id ? { ...p, status: 'published' as BlogStatus, updatedDate: new Date().toISOString().split('T')[0] } : p
            ));
            setShowDetailModal(false);
          }}
          onReject={(blog, feedback) => {
            setPosts(posts.map(p =>
              p.id === blog.id
                ? { ...p, status: 'rejected' as BlogStatus, adminFeedback: feedback, updatedDate: new Date().toISOString().split('T')[0] }
                : p
            ));
            setShowDetailModal(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPost && (
        <BlogEditModal
          blog={selectedPost}
          onClose={() => setShowEditModal(false)}
          onUpdate={(blog) => {
            setPosts(posts.map(p =>
              p.id === blog.id ? { ...p, ...blog, updatedDate: new Date().toISOString().split('T')[0] } : p
            ));
            setShowEditModal(false);
          }}
        />
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <CategoryManagementModal
          categories={categories}
          onClose={() => setShowCategoryModal(false)}
          onAddCategory={(category) => setCategories([...categories, category])}
          onDeleteCategory={(categoryId) => setCategories(categories.filter(c => c.id !== categoryId))}
        />
      )}
    </div>
  );
}