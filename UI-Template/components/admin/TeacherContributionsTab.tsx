import { useState } from 'react';
import { Search, BookOpen, Headphones, PenTool, Mic, Check, XCircle, Edit, Eye, Clock, CheckCircle, User, Calendar } from 'lucide-react';

type SkillType = 'reading' | 'listening' | 'writing' | 'speaking';
type ContributionStatus = 'pending' | 'approved' | 'rejected';

interface ContributedAssignment {
  id: string;
  title: string;
  description: string;
  skill: SkillType;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: number;
  estimatedTime: number;
  contributorName: string;
  contributorEmail: string;
  contributedDate: string;
  status: ContributionStatus;
  reviewNote?: string;
  course: string;
}

// Mock data
const mockContributions: ContributedAssignment[] = [
  {
    id: 'contrib-1',
    title: 'Reading Comprehension - Technology in Education',
    description: 'Bài đọc hiểu về vai trò của công nghệ trong giáo dục, bao gồm 3 đoạn văn với 15 câu hỏi multiple choice.',
    skill: 'reading',
    difficulty: 'medium',
    questions: 15,
    estimatedTime: 30,
    contributorName: 'Nguyễn Thị Lan',
    contributorEmail: 'lantnt@example.com',
    contributedDate: '2024-01-15',
    status: 'pending',
    course: 'VSTEP Complete'
  },
  {
    id: 'contrib-2',
    title: 'Listening Practice - Environmental Issues',
    description: 'Bài nghe về các vấn đề môi trường, bao gồm 2 đoạn hội thoại và 1 bài thuyết trình.',
    skill: 'listening',
    difficulty: 'hard',
    questions: 20,
    estimatedTime: 40,
    contributorName: 'Trần Văn Minh',
    contributorEmail: 'minhtv@example.com',
    contributedDate: '2024-01-14',
    status: 'pending',
    course: 'VSTEP Foundation'
  },
  {
    id: 'contrib-3',
    title: 'Writing Task 2 - Social Media Impact',
    description: 'Bài viết Essay về tác động của mạng xã hội đến đời sống xã hội.',
    skill: 'writing',
    difficulty: 'medium',
    questions: 1,
    estimatedTime: 45,
    contributorName: 'Phạm Thu Hà',
    contributorEmail: 'hapt@example.com',
    contributedDate: '2024-01-13',
    status: 'approved',
    course: 'VSTEP Builder'
  },
  {
    id: 'contrib-4',
    title: 'Speaking Part 3 - Travel and Tourism',
    description: 'Câu hỏi nói về chủ đề du lịch, phù hợp cho part 3 của VSTEP Speaking.',
    skill: 'speaking',
    difficulty: 'easy',
    questions: 5,
    estimatedTime: 10,
    contributorName: 'Lê Hoàng Nam',
    contributorEmail: 'namlh@example.com',
    contributedDate: '2024-01-12',
    status: 'approved',
    course: 'VSTEP Starter'
  },
  {
    id: 'contrib-5',
    title: 'Reading Practice - Climate Change',
    description: 'Bài đọc về biến đổi khí hậu với độ khó cao.',
    skill: 'reading',
    difficulty: 'hard',
    questions: 10,
    estimatedTime: 25,
    contributorName: 'Vũ Thị Mai',
    contributorEmail: 'maivt@example.com',
    contributedDate: '2024-01-10',
    status: 'rejected',
    reviewNote: 'Nội dung chưa đủ chuẩn theo format VSTEP. Vui lòng điều chỉnh format câu hỏi.',
    course: 'VSTEP Premium'
  },
  {
    id: 'contrib-6',
    title: 'Listening - Daily Conversations',
    description: 'Các hội thoại hàng ngày trong cuộc sống.',
    skill: 'listening',
    difficulty: 'easy',
    questions: 12,
    estimatedTime: 20,
    contributorName: 'Đỗ Văn Tùng',
    contributorEmail: 'tungdv@example.com',
    contributedDate: '2024-01-16',
    status: 'pending',
    course: 'VSTEP Starter'
  },
];

export function TeacherContributionsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContributionStatus | 'all'>('all');
  const [skillFilter, setSkillFilter] = useState<SkillType | 'all'>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingContribution, setReviewingContribution] = useState<ContributedAssignment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<ContributedAssignment | null>(null);

  // Filter contributions
  const filteredContributions = mockContributions.filter(contrib => {
    const matchesSearch = searchTerm === '' ||
      contrib.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrib.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrib.contributorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contrib.status === statusFilter;
    const matchesSkill = skillFilter === 'all' || contrib.skill === skillFilter;
    
    return matchesSearch && matchesStatus && matchesSkill;
  });

  // Count by status
  const pendingCount = mockContributions.filter(c => c.status === 'pending').length;
  const approvedCount = mockContributions.filter(c => c.status === 'approved').length;
  const rejectedCount = mockContributions.filter(c => c.status === 'rejected').length;

  const getSkillIcon = (skill: SkillType) => {
    switch (skill) {
      case 'reading': return <BookOpen className="size-4" />;
      case 'listening': return <Headphones className="size-4" />;
      case 'writing': return <PenTool className="size-4" />;
      case 'speaking': return <Mic className="size-4" />;
    }
  };

  const getSkillColor = (skill: SkillType) => {
    switch (skill) {
      case 'reading': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'listening': return 'bg-green-100 text-green-700 border-green-200';
      case 'writing': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'speaking': return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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

  const handleApprove = (contribution: ContributedAssignment) => {
    console.log('Approving contribution:', contribution.id);
    alert(`Đã duyệt bài tập: ${contribution.title}`);
  };

  const handleReject = (contribution: ContributedAssignment) => {
    setReviewingContribution(contribution);
    setShowReviewModal(true);
  };

  const handleRejectSubmit = (reviewNote: string) => {
    console.log('Rejecting contribution:', reviewingContribution?.id, 'Note:', reviewNote);
    alert(`Đã từ chối bài tập: ${reviewingContribution?.title}`);
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
              <BookOpen className="size-6 text-blue-600" />
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
              placeholder="Tìm kiếm bài tập hoặc giáo viên..."
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

          {/* Skill Filter */}
          <div>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value as SkillType | 'all')}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Tất cả kỹ năng</option>
              <option value="reading">Reading</option>
              <option value="listening">Listening</option>
              <option value="writing">Writing</option>
              <option value="speaking">Speaking</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold text-red-600">{filteredContributions.length}</span> bài đóng góp
        </p>
      </div>

      {/* Contributions List */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="divide-y-2 divide-gray-200">
          {filteredContributions.map((contribution) => (
            <div key={contribution.id} className="p-5 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                {/* Skill Icon */}
                <div className={`p-3 rounded-lg ${getSkillColor(contribution.skill).replace('text-', 'bg-').replace('-700', '-100')}`}>
                  {getSkillIcon(contribution.skill)}
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
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getSkillColor(contribution.skill)}`}>
                      {getSkillIcon(contribution.skill)}
                      {contribution.skill.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(contribution.difficulty)}`}>
                      {contribution.difficulty === 'easy' ? 'Dễ' : contribution.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                      {contribution.course}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                      {contribution.questions} câu hỏi
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                      {contribution.estimatedTime} phút
                    </span>
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài đóng góp</h3>
          <p className="text-gray-600">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}

      {/* Reject Review Modal */}
      {showReviewModal && reviewingContribution && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Từ chối bài đóng góp
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
                Chi tiết bài đóng góp
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
                  <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium border ${getSkillColor(selectedContribution.skill)}`}>
                    {getSkillIcon(selectedContribution.skill)}
                    {selectedContribution.skill.toUpperCase()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Độ khó</label>
                  <span className={`inline-block px-3 py-1.5 rounded-md text-sm font-medium ${getDifficultyColor(selectedContribution.difficulty)}`}>
                    {selectedContribution.difficulty === 'easy' ? 'Dễ' : selectedContribution.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số câu hỏi</label>
                  <p className="text-gray-900">{selectedContribution.questions} câu</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                  <p className="text-gray-900">{selectedContribution.estimatedTime} phút</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Khóa học</label>
                  <p className="text-gray-900">{selectedContribution.course}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày đóng góp</label>
                  <p className="text-gray-900">{new Date(selectedContribution.contributedDate).toLocaleDateString('vi-VN')}</p>
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
                    Duyệt bài tập
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
