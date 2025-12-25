import { useState } from 'react';
import { Search, Check, XCircle, Edit, Eye, Clock, CheckCircle, User, Calendar, Download, Book, Video, File } from 'lucide-react';

type ClassCategory = 'textbook' | 'media';
type ContributionStatus = 'pending' | 'approved' | 'rejected';

interface ContributedClassMaterial {
  id: string;
  name: string;
  description: string;
  category: ClassCategory;
  type: string;
  fileSize: string;
  contributorName: string;
  contributorEmail: string;
  contributedDate: string;
  status: ContributionStatus;
  reviewNote?: string;
  course: string;
  author?: string;
  pages?: number;
  skill?: string;
  duration?: string;
  downloads: number;
}

// Mock data
const mockContributions: ContributedClassMaterial[] = [
  {
    id: 'class-contrib-1',
    name: 'VSTEP Builder Complete Textbook',
    description: 'Giáo trình đầy đủ cho khóa học VSTEP Builder với bài tập thực hành và đáp án chi tiết.',
    category: 'textbook',
    type: 'pdf',
    fileSize: '52.3 MB',
    contributorName: 'Nguyễn Văn An',
    contributorEmail: 'annv@example.com',
    contributedDate: '2024-01-18',
    status: 'pending',
    course: 'VSTEP Builder',
    author: 'Nguyễn Văn An',
    pages: 380,
    downloads: 0
  },
  {
    id: 'class-contrib-2',
    name: 'Speaking Master Guide',
    description: 'Tài liệu hướng dẫn Speaking toàn diện với chiến lược và mẫu câu trả lời.',
    category: 'textbook',
    type: 'docx',
    fileSize: '18.7 MB',
    contributorName: 'Trần Thị Bình',
    contributorEmail: 'binhtt@example.com',
    contributedDate: '2024-01-17',
    status: 'pending',
    course: 'VSTEP Master',
    author: 'Trần Thị Bình',
    pages: 220,
    downloads: 0
  },
  {
    id: 'class-contrib-3',
    name: 'Complete Listening Audio Pack',
    description: 'Bộ 50 bài nghe theo format VSTEP với transcript đầy đủ.',
    category: 'media',
    type: 'audio',
    fileSize: '680 MB',
    contributorName: 'Lê Hoàng Cường',
    contributorEmail: 'cuonglh@example.com',
    contributedDate: '2024-01-15',
    status: 'approved',
    course: 'VSTEP Premium',
    skill: 'Listening',
    duration: '5h 30m',
    downloads: 156
  },
  {
    id: 'class-contrib-4',
    name: 'Reading Comprehension Videos',
    description: 'Series video hướng dẫn kỹ thuật đọc hiểu và làm bài Reading.',
    category: 'media',
    type: 'video',
    fileSize: '2.1 GB',
    contributorName: 'Phạm Thu Dung',
    contributorEmail: 'dungpt@example.com',
    contributedDate: '2024-01-14',
    status: 'approved',
    course: 'VSTEP Intensive',
    skill: 'Reading',
    duration: '8h 15m',
    downloads: 234
  },
  {
    id: 'class-contrib-5',
    name: 'VSTEP Foundation Textbook 2024',
    description: 'Giáo trình Foundation phiên bản mới nhất năm 2024.',
    category: 'textbook',
    type: 'pdf',
    fileSize: '48.5 MB',
    contributorName: 'Vũ Minh Hiếu',
    contributorEmail: 'hieuvm@example.com',
    contributedDate: '2024-01-12',
    status: 'rejected',
    reviewNote: 'Nội dung chưa được biên tập kỹ, có nhiều lỗi chính tả. Vui lòng kiểm tra lại và gửi lại.',
    course: 'VSTEP Foundation',
    author: 'Vũ Minh Hiếu',
    pages: 295,
    downloads: 0
  },
  {
    id: 'class-contrib-6',
    name: 'Writing Task Practice Videos',
    description: 'Video hướng dẫn viết Task 1 và Task 2 với ví dụ cụ thể.',
    category: 'media',
    type: 'video',
    fileSize: '1.8 GB',
    contributorName: 'Đỗ Thị Lan',
    contributorEmail: 'landt@example.com',
    contributedDate: '2024-01-19',
    status: 'pending',
    course: 'VSTEP Complete',
    skill: 'Writing',
    duration: '6h 45m',
    downloads: 0
  },
  {
    id: 'class-contrib-7',
    name: 'Grammar in Context Workbook',
    description: 'Sách bài tập ngữ pháp trong ngữ cảnh giao tiếp thực tế.',
    category: 'textbook',
    type: 'pdf',
    fileSize: '31.2 MB',
    contributorName: 'Hoàng Văn Nam',
    contributorEmail: 'namhv@example.com',
    contributedDate: '2024-01-16',
    status: 'approved',
    course: 'VSTEP Starter',
    author: 'Hoàng Văn Nam',
    pages: 185,
    downloads: 89
  },
];

export function TeacherClassMaterialContributionsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContributionStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ClassCategory | 'all'>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingContribution, setReviewingContribution] = useState<ContributedClassMaterial | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<ContributedClassMaterial | null>(null);

  // Filter contributions
  const filteredContributions = mockContributions.filter(contrib => {
    const matchesSearch = searchTerm === '' ||
      contrib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrib.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrib.contributorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contrib.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || contrib.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Count by status
  const pendingCount = mockContributions.filter(c => c.status === 'pending').length;
  const approvedCount = mockContributions.filter(c => c.status === 'approved').length;
  const rejectedCount = mockContributions.filter(c => c.status === 'rejected').length;

  const getCategoryIcon = (category: ClassCategory) => {
    return category === 'textbook' ? <Book className="size-5" /> : <Video className="size-5" />;
  };

  const getCategoryColor = (category: ClassCategory) => {
    return category === 'textbook' 
      ? 'bg-blue-100 text-blue-700 border-blue-200'
      : 'bg-purple-100 text-purple-700 border-purple-200';
  };

  const getCategoryLabel = (category: ClassCategory) => {
    return category === 'textbook' ? 'Giáo trình' : 'Media';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      docx: '📝',
      audio: '🎵',
      video: '🎥',
    };
    return icons[type] || '📁';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      pdf: 'bg-red-100 text-red-700 border-red-200',
      docx: 'bg-blue-100 text-blue-700 border-blue-200',
      audio: 'bg-pink-100 text-pink-700 border-pink-200',
      video: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusBadge = (status: ContributionStatus) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"><Clock className="size-4" />Chờ duyệt</span>;
      case 'approved':
        return <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"><CheckCircle className="size-4" />Đã duyệt</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"><XCircle className="size-4" />Từ chối</span>;
    }
  };

  const handleApprove = (contribution: ContributedClassMaterial) => {
    console.log('Approving class material:', contribution.id);
    alert(`Đã duyệt tài liệu: ${contribution.name}`);
  };

  const handleReject = (contribution: ContributedClassMaterial) => {
    setReviewingContribution(contribution);
    setShowReviewModal(true);
  };

  const handleRejectSubmit = (reviewNote: string) => {
    console.log('Rejecting class material:', reviewingContribution?.id, 'Note:', reviewNote);
    alert(`Đã từ chối tài liệu: ${reviewingContribution?.name}`);
    setShowReviewModal(false);
    setReviewingContribution(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <File className="size-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{mockContributions.length}</h3>
          <p className="text-sm text-gray-600">Tổng đóng góp</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="size-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{pendingCount}</h3>
          <p className="text-sm text-gray-600">Chờ duyệt</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="size-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{approvedCount}</h3>
          <p className="text-sm text-gray-600">Đã duyệt</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="size-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{rejectedCount}</h3>
          <p className="text-sm text-gray-600">Từ chối</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu hoặc giáo viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ContributionStatus | 'all')}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ClassCategory | 'all')}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="textbook">📚 Giáo trình</option>
              <option value="media">🎬 Media</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold text-red-600">{filteredContributions.length}</span> tài liệu đóng góp
        </p>
      </div>

      {/* Contributions List */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="divide-y-2 divide-gray-200">
          {filteredContributions.map((contribution) => (
            <div key={contribution.id} className="p-5 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-4xl">
                  {getTypeIcon(contribution.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{contribution.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{contribution.description}</p>
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(contribution.status)}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getCategoryColor(contribution.category)}`}>
                      {getCategoryIcon(contribution.category)}
                      {getCategoryLabel(contribution.category)}
                    </span>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor(contribution.type)}`}>
                      {getTypeIcon(contribution.type)}
                      {contribution.type.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                      {contribution.course}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                      {contribution.fileSize}
                    </span>
                    {contribution.category === 'textbook' && contribution.pages && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                        {contribution.pages} trang
                      </span>
                    )}
                    {contribution.category === 'media' && contribution.duration && (
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs">
                        ⏱️ {contribution.duration}
                      </span>
                    )}
                    {contribution.category === 'media' && contribution.skill && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs">
                        {contribution.skill}
                      </span>
                    )}
                    {contribution.status === 'approved' && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs">
                        <Download className="size-3" />
                        {contribution.downloads} lượt tải
                      </span>
                    )}
                  </div>

                  {/* Contributor Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="size-4" />
                      {contribution.contributorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      {new Date(contribution.contributedDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  {/* Review Note (if rejected) */}
                  {contribution.status === 'rejected' && contribution.reviewNote && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Lý do từ chối:</strong> {contribution.reviewNote}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setSelectedContribution(contribution);
                      setShowDetailModal(true);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="size-5" />
                  </button>

                  {contribution.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(contribution)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        <Check className="size-4" />
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(contribution)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        <XCircle className="size-4" />
                        Từ chối
                      </button>
                    </>
                  )}

                  {contribution.status === 'approved' && (
                    <button
                      onClick={() => alert('Chức năng chỉnh sửa đang phát triển')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="size-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredContributions.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-16 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="size-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy tài liệu đóng góp</h3>
          <p className="text-gray-600">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}

      {/* Reject Review Modal */}
      {showReviewModal && reviewingContribution && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Từ chối tài liệu đóng góp
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {reviewingContribution.name}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const reviewNote = formData.get('reviewNote') as string;
                handleRejectSubmit(reviewNote);
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do từ chối *
                </label>
                <textarea
                  name="reviewNote"
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập lý do từ chối để giáo viên có thể cải thiện..."
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Lưu ý:</strong> Lý do từ chối sẽ được gửi đến giáo viên để họ có thể điều chỉnh và gửi lại.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewingContribution(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xác nhận từ chối
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedContribution && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Chi tiết tài liệu đóng góp
              </h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedContribution(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="size-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Trạng thái</span>
                {getStatusBadge(selectedContribution.status)}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên tài liệu</label>
                <p className="text-gray-900">{selectedContribution.name}</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <p className="text-gray-900">{selectedContribution.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                  <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium border ${getCategoryColor(selectedContribution.category)}`}>
                    {getCategoryIcon(selectedContribution.category)}
                    {getCategoryLabel(selectedContribution.category)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại file</label>
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium border ${getTypeColor(selectedContribution.type)}`}>
                    {getTypeIcon(selectedContribution.type)}
                    {selectedContribution.type.toUpperCase()}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kích thước</label>
                  <p className="text-gray-900">{selectedContribution.fileSize}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Khóa học</label>
                  <p className="text-gray-900">{selectedContribution.course}</p>
                </div>

                {selectedContribution.category === 'textbook' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tác giả</label>
                      <p className="text-gray-900">{selectedContribution.author}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số trang</label>
                      <p className="text-gray-900">{selectedContribution.pages} trang</p>
                    </div>
                  </>
                )}

                {selectedContribution.category === 'media' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
                      <p className="text-gray-900">{selectedContribution.skill}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Thời lượng</label>
                      <p className="text-gray-900">{selectedContribution.duration}</p>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày đóng góp</label>
                  <p className="text-gray-900">{new Date(selectedContribution.contributedDate).toLocaleDateString('vi-VN')}</p>
                </div>

                {selectedContribution.status === 'approved' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lượt tải</label>
                    <p className="text-gray-900">{selectedContribution.downloads} lượt</p>
                  </div>
                )}
              </div>

              {/* Contributor Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="block text-sm font-medium text-blue-900 mb-2">Thông tin giáo viên</label>
                <div className="space-y-1">
                  <p className="text-sm text-blue-800">
                    <strong>Tên:</strong> {selectedContribution.contributorName}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Email:</strong> {selectedContribution.contributorEmail}
                  </p>
                </div>
              </div>

              {/* Review Note (if rejected) */}
              {selectedContribution.status === 'rejected' && selectedContribution.reviewNote && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <label className="block text-sm font-medium text-red-900 mb-2">Lý do từ chối</label>
                  <p className="text-sm text-red-800">{selectedContribution.reviewNote}</p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedContribution.status === 'pending' && (
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleApprove(selectedContribution);
                      setShowDetailModal(false);
                      setSelectedContribution(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check className="size-5" />
                    Duyệt tài liệu
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleReject(selectedContribution);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="size-5" />
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
