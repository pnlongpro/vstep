import { useState } from 'react';
import { Search, FileText, Check, XCircle, Edit, Eye, Clock, CheckCircle, User, Calendar, Download, Link as LinkIcon } from 'lucide-react';

type MaterialType = 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'video' | 'audio';
type StudyCategory = 'grammar' | 'vocabulary' | 'reading' | 'writing' | 'listening' | 'speaking';
type ContributionStatus = 'pending' | 'approved' | 'rejected';

interface ContributedMaterial {
  id: string;
  title: string;
  description: string;
  category: StudyCategory;
  type: MaterialType;
  fileSize: string;
  fileUrl: string;
  contributorName: string;
  contributorEmail: string;
  contributedDate: string;
  status: ContributionStatus;
  reviewNote?: string;
  skill?: string;
  course?: string;
  author?: string;
  downloads: number;
}

// Mock data
const mockContributions: ContributedMaterial[] = [
  {
    id: 'mat-contrib-1',
    title: 'Bài tập Ngữ pháp nâng cao - Câu điều kiện',
    description: 'Tài liệu bao gồm lý thuyết đầy đủ về các loại câu điều kiện và 50 bài tập thực hành có đáp án chi tiết.',
    category: 'grammar',
    type: 'pdf',
    fileSize: '2.5 MB',
    fileUrl: 'https://example.com/conditional-sentences.pdf',
    contributorName: 'Nguyễn Thị Lan',
    contributorEmail: 'lantnt@example.com',
    contributedDate: '2024-01-15',
    status: 'pending',
    skill: 'Grammar',
    course: 'VSTEP Complete',
    author: 'Nguyễn Thị Lan',
    downloads: 0
  },
  {
    id: 'mat-contrib-2',
    title: 'Từ vựng theo chủ đề Environment',
    description: 'Bộ từ vựng về môi trường với hơn 300 từ, cụm từ, và ví dụ thực tế kèm bài tập ứng dụng.',
    category: 'vocabulary',
    type: 'docx',
    fileSize: '1.8 MB',
    fileUrl: 'https://example.com/environment-vocab.docx',
    contributorName: 'Trần Văn Minh',
    contributorEmail: 'minhtv@example.com',
    contributedDate: '2024-01-14',
    status: 'pending',
    skill: 'Vocabulary',
    course: 'VSTEP Foundation',
    author: 'Trần Văn Minh',
    downloads: 0
  },
  {
    id: 'mat-contrib-3',
    title: 'Reading Strategies - Skimming & Scanning',
    description: 'Tài liệu hướng dẫn kỹ thuật đọc lướt và đọc tìm thông tin cụ thể với 10 bài đọc mẫu.',
    category: 'reading',
    type: 'pdf',
    fileSize: '3.2 MB',
    fileUrl: 'https://example.com/reading-strategies.pdf',
    contributorName: 'Phạm Thu Hà',
    contributorEmail: 'hapt@example.com',
    contributedDate: '2024-01-13',
    status: 'approved',
    skill: 'Reading',
    course: 'VSTEP Builder',
    author: 'Phạm Thu Hà',
    downloads: 125
  },
  {
    id: 'mat-contrib-4',
    title: 'Writing Task 1 - Describing Graphs',
    description: 'Hướng dẫn chi tiết cách mô tả biểu đồ, từ vựng chuyên dụng và 20 mẫu bài viết đạt điểm cao.',
    category: 'writing',
    type: 'pptx',
    fileSize: '5.1 MB',
    fileUrl: 'https://example.com/writing-task1.pptx',
    contributorName: 'Lê Hoàng Nam',
    contributorEmail: 'namlh@example.com',
    contributedDate: '2024-01-12',
    status: 'approved',
    skill: 'Writing',
    course: 'VSTEP Starter',
    author: 'Lê Hoàng Nam',
    downloads: 98
  },
  {
    id: 'mat-contrib-5',
    title: 'Listening Practice Audio Files',
    description: 'Bộ 30 file audio luyện nghe theo format VSTEP với transcript và câu hỏi.',
    category: 'listening',
    type: 'audio',
    fileSize: '45 MB',
    fileUrl: 'https://example.com/listening-pack.zip',
    contributorName: 'Vũ Thị Mai',
    contributorEmail: 'maivt@example.com',
    contributedDate: '2024-01-10',
    status: 'rejected',
    reviewNote: 'Chất lượng audio chưa đạt chuẩn (có nhiễu). Vui lòng thu lại với thiết bị tốt hơn.',
    skill: 'Listening',
    course: 'VSTEP Premium',
    author: 'Vũ Thị Mai',
    downloads: 0
  },
  {
    id: 'mat-contrib-6',
    title: 'Speaking Part 2 - Personal Questions',
    description: 'Tổng hợp 100 câu hỏi Speaking Part 2 với gợi ý trả lời và từ vựng hữu ích.',
    category: 'speaking',
    type: 'pdf',
    fileSize: '1.5 MB',
    fileUrl: 'https://example.com/speaking-part2.pdf',
    contributorName: 'Đỗ Văn Tùng',
    contributorEmail: 'tungdv@example.com',
    contributedDate: '2024-01-16',
    status: 'pending',
    skill: 'Speaking',
    course: 'VSTEP Starter',
    author: 'Đỗ Văn Tùng',
    downloads: 0
  },
  {
    id: 'mat-contrib-7',
    title: 'Collocations for Academic Writing',
    description: 'Bộ tài liệu về các cụm từ kết hợp thường dùng trong viết học thuật.',
    category: 'vocabulary',
    type: 'xlsx',
    fileSize: '800 KB',
    fileUrl: 'https://example.com/collocations.xlsx',
    contributorName: 'Hoàng Thị Như',
    contributorEmail: 'nhuht@example.com',
    contributedDate: '2024-01-11',
    status: 'approved',
    skill: 'Vocabulary',
    course: 'VSTEP Master',
    author: 'Hoàng Thị Như',
    downloads: 156
  },
];

export function TeacherStudyMaterialContributionsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContributionStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<StudyCategory | 'all'>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingContribution, setReviewingContribution] = useState<ContributedMaterial | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<ContributedMaterial | null>(null);

  // Filter contributions
  const filteredContributions = mockContributions.filter(contrib => {
    const matchesSearch = searchTerm === '' ||
      contrib.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const getCategoryIcon = (category: StudyCategory) => {
    const icons: Record<StudyCategory, string> = {
      grammar: '📝',
      vocabulary: '📚',
      reading: '📖',
      writing: '✍️',
      listening: '👂',
      speaking: '🗣️'
    };
    return icons[category];
  };

  const getCategoryColor = (category: StudyCategory) => {
    const colors: Record<StudyCategory, string> = {
      grammar: 'bg-blue-100 text-blue-700 border-blue-200',
      vocabulary: 'bg-green-100 text-green-700 border-green-200',
      reading: 'bg-purple-100 text-purple-700 border-purple-200',
      writing: 'bg-orange-100 text-orange-700 border-orange-200',
      listening: 'bg-pink-100 text-pink-700 border-pink-200',
      speaking: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };
    return colors[category];
  };

  const getTypeIcon = (type: MaterialType) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'pptx': return '📊';
      case 'xlsx': return '📗';
      case 'video': return '🎥';
      case 'audio': return '🎵';
    }
  };

  const getTypeColor = (type: MaterialType) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-700 border-red-200';
      case 'docx': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pptx': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'xlsx': return 'bg-green-100 text-green-700 border-green-200';
      case 'video': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'audio': return 'bg-pink-100 text-pink-700 border-pink-200';
    }
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

  const handleApprove = (contribution: ContributedMaterial) => {
    console.log('Approving material:', contribution.id);
    alert(`Đã duyệt tài liệu: ${contribution.title}`);
  };

  const handleReject = (contribution: ContributedMaterial) => {
    setReviewingContribution(contribution);
    setShowReviewModal(true);
  };

  const handleRejectSubmit = (reviewNote: string) => {
    console.log('Rejecting material:', reviewingContribution?.id, 'Note:', reviewNote);
    alert(`Đã từ chối tài liệu: ${reviewingContribution?.title}`);
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
              <FileText className="size-6 text-blue-600" />
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
              onChange={(e) => setCategoryFilter(e.target.value as StudyCategory | 'all')}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="grammar">📝 Ngữ pháp</option>
              <option value="vocabulary">📚 Từ vựng</option>
              <option value="reading">📖 Đọc hiểu</option>
              <option value="writing">✍️ Viết</option>
              <option value="listening">👂 Nghe</option>
              <option value="speaking">🗣️ Nói</option>
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
                {/* File Icon */}
                <div className="text-4xl">
                  {getTypeIcon(contribution.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{contribution.title}</h3>
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
                      {contribution.category.charAt(0).toUpperCase() + contribution.category.slice(1)}
                    </span>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor(contribution.type)}`}>
                      {getTypeIcon(contribution.type)}
                      {contribution.type.toUpperCase()}
                    </span>
                    {contribution.course && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                        {contribution.course}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                      {contribution.fileSize}
                    </span>
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
                {reviewingContribution.title}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                <p className="text-gray-900">{selectedContribution.title}</p>
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
                    {selectedContribution.category.charAt(0).toUpperCase() + selectedContribution.category.slice(1)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tác giả</label>
                  <p className="text-gray-900">{selectedContribution.author}</p>
                </div>

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

              {/* File URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đường dẫn file</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <LinkIcon className="size-4 text-gray-500 flex-shrink-0" />
                  <p className="text-sm text-gray-700 truncate flex-1">{selectedContribution.fileUrl}</p>
                  <button
                    onClick={() => window.open(selectedContribution.fileUrl, '_blank')}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors flex-shrink-0"
                  >
                    Mở
                  </button>
                </div>
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
