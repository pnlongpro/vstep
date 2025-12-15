import { ArrowLeft, BookOpen, FileText, Download, Eye, Clock, User, Star, Search, Filter, ChevronDown, GraduationCap, List, Grid, BookMarked, FileQuestion, Lightbulb, Languages, PenTool, Headphones, Mic, BookA, Users } from 'lucide-react';
import { useState } from 'react';
import { ClassMaterialsModal } from './ClassMaterialsModal';

interface DocumentsPageProps {
  onBack: () => void;
}

interface Document {
  id: number;
  title: string;
  category: string;
  type: 'pdf' | 'doc' | 'video' | 'quiz';
  author: string;
  level: 'A2' | 'B1' | 'B2' | 'C1';
  downloads: number;
  views: number;
  rating: number;
  description: string;
  pages?: number;
  duration?: string;
  size: string;
  updatedAt: string;
  tags: string[];
  thumbnail?: string;
}

export function DocumentsPage({ onBack }: DocumentsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent');
  const [showClassMaterials, setShowClassMaterials] = useState(false);

  const categories = [
    { id: 'all', name: 'Tất cả', icon: BookOpen, color: 'text-gray-600', badge: 12 },
    { id: 'grammar', name: 'Ngữ pháp', icon: BookA, color: 'text-blue-600' },
    { id: 'vocabulary', name: 'Từ vựng', icon: Languages, color: 'text-emerald-600' },
    { id: 'reading', name: 'Đọc hiểu', icon: BookMarked, color: 'text-purple-600' },
    { id: 'listening', name: 'Nghe hiểu', icon: Headphones, color: 'text-amber-600' },
    { id: 'writing', name: 'Viết', icon: PenTool, color: 'text-rose-600' },
    { id: 'speaking', name: 'Nói', icon: Mic, color: 'text-indigo-600' },
    { id: 'tips', name: 'Mẹo thi', icon: Lightbulb, color: 'text-yellow-600' },
    { id: 'exams', name: 'Đề thi mẫu', icon: FileQuestion, color: 'text-orange-600' },
  ];

  const documents: Document[] = [
    {
      id: 1,
      title: 'Tổng hợp ngữ pháp VSTEP từ A2-C1',
      category: 'grammar',
      type: 'pdf',
      author: 'TS. Nguyễn Văn A',
      level: 'B2',
      downloads: 1523,
      views: 4521,
      rating: 4.8,
      description: 'Tài liệu tổng hợp đầy đủ các cấu trúc ngữ pháp cần thiết cho kỳ thi VSTEP, bao gồm lý thuyết và bài tập thực hành.',
      pages: 156,
      size: '5.2 MB',
      updatedAt: '2 ngày trước',
      tags: ['Ngữ pháp', 'Tổng hợp', 'B2', 'Lý thuyết'],
    },
    {
      id: 2,
      title: '3000 từ vựng thiết yếu VSTEP theo chủ đề',
      category: 'vocabulary',
      type: 'pdf',
      author: 'ThS. Trần Thị B',
      level: 'B1',
      downloads: 2341,
      views: 6234,
      rating: 4.9,
      description: 'Bộ từ vựng được phân loại theo 30 chủ đề thường gặp trong kỳ thi VSTEP, kèm ví dụ và bài tập.',
      pages: 203,
      size: '8.7 MB',
      updatedAt: '1 tuần trước',
      tags: ['Từ vựng', 'Chủ đề', 'B1', 'Essential'],
    },
    {
      id: 3,
      title: 'Chiến lược làm bài Reading VSTEP hiệu quả',
      category: 'reading',
      type: 'pdf',
      author: 'PGS.TS. Lê Văn C',
      level: 'C1',
      downloads: 987,
      views: 3456,
      rating: 4.7,
      description: 'Hướng dẫn chi tiết các kỹ thuật đọc hiểu, phân tích đề bài và quản lý thời gian cho phần thi Reading.',
      pages: 89,
      size: '3.4 MB',
      updatedAt: '3 ngày trước',
      tags: ['Reading', 'Chiến lược', 'C1', 'Tips'],
    },
    {
      id: 4,
      title: 'Video hướng dẫn Listening Skills - Part 1',
      category: 'listening',
      type: 'video',
      author: 'Giảng viên Phạm Minh D',
      level: 'B1',
      downloads: 1654,
      views: 8932,
      rating: 4.6,
      description: 'Series video chi tiết về kỹ năng nghe hiểu, bao gồm cách ghi chú, nhận diện từ khóa và dự đoán nội dung.',
      duration: '45 phút',
      size: '250 MB',
      updatedAt: '5 ngày trước',
      tags: ['Listening', 'Video', 'B1', 'Part 1'],
    },
    {
      id: 5,
      title: 'Mẫu bài Writing Task 2 band 8.0+',
      category: 'writing',
      type: 'pdf',
      author: 'ThS. Hoàng Thị E',
      level: 'C1',
      downloads: 2156,
      views: 5678,
      rating: 5.0,
      description: '20 bài luận mẫu đạt điểm cao, phân tích cấu trúc, từ vựng và cách triển khai ý tưởng.',
      pages: 124,
      size: '6.1 MB',
      updatedAt: '4 ngày trước',
      tags: ['Writing', 'Mẫu bài', 'C1', 'Band 8.0'],
    },
    {
      id: 6,
      title: '50 chủ đề Speaking phổ biến nhất',
      category: 'speaking',
      type: 'pdf',
      author: 'Native Speaker John Smith',
      level: 'B2',
      downloads: 1832,
      views: 4892,
      rating: 4.8,
      description: 'Tổng hợp câu trả lời mẫu cho 50 chủ đề thường gặp, kèm phiên âm và từ vựng nâng cao.',
      pages: 178,
      size: '7.3 MB',
      updatedAt: '1 tuần trước',
      tags: ['Speaking', 'Chủ đề', 'B2', 'Native'],
    },
    {
      id: 7,
      title: '10 mẹo vàng đạt điểm cao VSTEP',
      category: 'tips',
      type: 'pdf',
      author: 'Ban biên tập VSTEPRO',
      level: 'B1',
      downloads: 3421,
      views: 9876,
      rating: 4.9,
      description: 'Những bí quyết, chiến thuật và lưu ý quan trọng giúp tối ưu hóa điểm số trong kỳ thi VSTEP.',
      pages: 45,
      size: '2.8 MB',
      updatedAt: '2 ngày trước',
      tags: ['Tips', 'Chiến lược', 'Tổng hợp', 'Must-read'],
    },
    {
      id: 8,
      title: 'Bộ đề thi VSTEP chính thức 2024',
      category: 'exams',
      type: 'pdf',
      author: 'Bộ Giáo dục và Đào tạo',
      level: 'B2',
      downloads: 4521,
      views: 12345,
      rating: 5.0,
      description: '10 đề thi VSTEP chính thức năm 2024, đầy đủ 4 kỹ năng, kèm đáp án và hướng dẫn chi tiết.',
      pages: 289,
      size: '15.6 MB',
      updatedAt: '1 ngày trước',
      tags: ['Đề thi', 'Chính thức', '2024', 'Full test'],
    },
    {
      id: 9,
      title: 'Collocation và Phrasal Verbs VSTEP',
      category: 'vocabulary',
      type: 'pdf',
      author: 'TS. Vũ Thị F',
      level: 'C1',
      downloads: 1245,
      views: 3678,
      rating: 4.7,
      description: 'Tập hợp các cụm từ cố định và động từ nhiều từ thường gặp trong VSTEP, kèm bài tập.',
      pages: 134,
      size: '5.9 MB',
      updatedAt: '6 ngày trước',
      tags: ['Collocation', 'Phrasal Verbs', 'C1', 'Advanced'],
    },
    {
      id: 10,
      title: 'Quiz ngữ pháp tương tác - 500 câu hỏi',
      category: 'grammar',
      type: 'quiz',
      author: 'VSTEPRO Team',
      level: 'B1',
      downloads: 2876,
      views: 7654,
      rating: 4.8,
      description: 'Bộ câu hỏi trắc nghiệm tương tác giúp ôn luyện và kiểm tra kiến thức ngữ pháp một cách hiệu quả.',
      size: '0.5 MB',
      updatedAt: '3 ngày trước',
      tags: ['Quiz', 'Ngữ pháp', 'Interactive', '500 câu'],
    },
    {
      id: 11,
      title: 'Template cho Writing Task 1 & Task 2',
      category: 'writing',
      type: 'doc',
      author: 'ThS. Đỗ Văn G',
      level: 'B2',
      downloads: 1987,
      views: 5234,
      rating: 4.6,
      description: 'Các mẫu câu và cấu trúc viết chuẩn cho cả 2 phần thi Writing, dễ áp dụng và ghi nhớ.',
      pages: 67,
      size: '3.2 MB',
      updatedAt: '1 tuần trước',
      tags: ['Writing', 'Template', 'B2', 'Structure'],
    },
    {
      id: 12,
      title: 'Pronunciation Guide - Phát âm chuẩn',
      category: 'speaking',
      type: 'video',
      author: 'Native Teacher Emma',
      level: 'A2',
      downloads: 1456,
      views: 6543,
      rating: 4.9,
      description: 'Video hướng dẫn phát âm các âm tiết khó, ngữ điệu và nhấn nhá trong tiếng Anh.',
      duration: '60 phút',
      size: '320 MB',
      updatedAt: '4 ngày trước',
      tags: ['Speaking', 'Pronunciation', 'A2', 'Native'],
    },
  ];

  // Filter and sort documents
  const filteredDocs = documents
    .filter(doc => {
      const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      const matchLevel = selectedLevel === 'all' || doc.level === selectedLevel;
      return matchSearch && matchCategory && matchLevel;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.downloads - a.downloads;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // recent is default
    });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'doc': return '📝';
      case 'video': return '🎥';
      case 'quiz': return '❓';
      default: return '📁';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A2': return 'bg-green-100 text-green-700';
      case 'B1': return 'bg-blue-100 text-blue-700';
      case 'B2': return 'bg-purple-100 text-purple-700';
      case 'C1': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="size-5" />
                <span>Quay lại</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-xl">
                  <BookOpen className="size-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl">Tài liệu học tập</h1>
                  <p className="text-sm text-gray-600">
                    {filteredDocs.length} tài liệu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Level Filter */}
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="appearance-none w-full lg:w-40 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              >
                <option value="all">Tất cả cấp độ</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none w-full lg:w-40 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              >
                <option value="recent">Mới nhất</option>
                <option value="popular">Phổ biến</option>
                <option value="rating">Đánh giá cao</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 border border-gray-300 rounded-xl p-1 bg-gray-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="size-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {/* Tài liệu lớp học button - Special */}
            <button
              onClick={() => setShowClassMaterials(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl whitespace-nowrap transition-all bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105"
            >
              <Users className="size-4" />
              <span>Tài liệu lớp học</span>
              <span className="bg-white/30 text-xs px-2 py-0.5 rounded-full font-medium">
                26
              </span>
            </button>

            {/* Regular categories */}
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{cat.name}</span>
                  {isActive && (
                    <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                      {documents.filter(d => cat.id === 'all' || d.category === cat.id).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Documents Grid/List */}
        {filteredDocs.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="size-10 text-gray-400" />
            </div>
            <h3 className="text-xl text-gray-600 mb-2">Không tìm thấy tài liệu</h3>
            <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className={`bg-white rounded-2xl border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden group ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Thumbnail/Icon */}
                <div className={`bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center ${
                  viewMode === 'grid' ? 'h-32' : 'w-32 flex-shrink-0'
                }`}>
                  <div className="text-5xl">{getTypeIcon(doc.type)}</div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {doc.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-lg text-xs whitespace-nowrap ${getLevelColor(doc.level)}`}>
                      {doc.level}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {doc.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {doc.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="size-4" />
                      <span className="text-xs truncate">{doc.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-4" />
                      <span className="text-xs">{doc.updatedAt}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Eye className="size-4" />
                        <span>{doc.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Download className="size-4" />
                        <span>{doc.downloads.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{doc.rating}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">
                      <Download className="size-4" />
                      <span>Tải xuống</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl transition-colors">
                      <Eye className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Class Materials Modal */}
      <ClassMaterialsModal
        isOpen={showClassMaterials}
        onClose={() => setShowClassMaterials(false)}
      />
    </div>
  );
}