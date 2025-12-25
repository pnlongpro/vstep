import { useState } from 'react';
import { FileText, Download, Eye, Search, Filter, BookOpen, Users, Calendar, File, FileImage, FileVideo, Archive, ChevronDown, Star, Clock, TrendingUp } from 'lucide-react';

type MaterialCategory = 'all' | 'learning' | 'class';
type FileType = 'all' | 'pdf' | 'doc' | 'video' | 'image' | 'zip';

interface Material {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'video' | 'image' | 'zip';
  size: string;
  uploadDate: string;
  category: 'learning' | 'class';
  description: string;
  downloads: number;
  uploader?: string;
  subject?: string;
  level?: string;
  isFavorite?: boolean;
}

export function MaterialsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory>('all');
  const [selectedFileType, setSelectedFileType] = useState<FileType>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - Tài liệu học tập (từ hệ thống)
  const learningMaterials: Material[] = [
    {
      id: 'lm1',
      name: 'VSTEP B2 - Reading Strategies Complete Guide',
      type: 'pdf',
      size: '3.2 MB',
      uploadDate: '15/12/2024',
      category: 'learning',
      description: 'Hướng dẫn đầy đủ các chiến lược làm bài Reading cho VSTEP B2',
      downloads: 1234,
      subject: 'Reading',
      level: 'B2',
      isFavorite: true
    },
    {
      id: 'lm2',
      name: 'VSTEP Listening Practice - 50 Audio Tests',
      type: 'zip',
      size: '156 MB',
      uploadDate: '14/12/2024',
      category: 'learning',
      description: '50 bài test Listening đầy đủ với audio và transcript',
      downloads: 2341,
      subject: 'Listening',
      level: 'B1-C1',
      isFavorite: false
    },
    {
      id: 'lm3',
      name: 'Writing Task 2 - Sample Essays Collection',
      type: 'pdf',
      size: '4.5 MB',
      uploadDate: '13/12/2024',
      category: 'learning',
      description: '100+ bài mẫu Writing Task 2 với nhiều chủ đề khác nhau',
      downloads: 3421,
      subject: 'Writing',
      level: 'B2-C1',
      isFavorite: true
    },
    {
      id: 'lm4',
      name: 'Speaking Part 3 - Video Tutorial Series',
      type: 'video',
      size: '850 MB',
      uploadDate: '12/12/2024',
      category: 'learning',
      description: 'Series video hướng dẫn chi tiết Speaking Part 3',
      downloads: 987,
      subject: 'Speaking',
      level: 'B2',
      isFavorite: false
    },
    {
      id: 'lm5',
      name: 'VSTEP Vocabulary 3000 - Illustrated',
      type: 'pdf',
      size: '12.3 MB',
      uploadDate: '11/12/2024',
      category: 'learning',
      description: '3000 từ vựng thiết yếu với hình ảnh minh họa',
      downloads: 4532,
      subject: 'Vocabulary',
      level: 'A2-C1',
      isFavorite: true
    },
    {
      id: 'lm6',
      name: 'Grammar Foundation - Interactive Exercises',
      type: 'pdf',
      size: '5.8 MB',
      uploadDate: '10/12/2024',
      category: 'learning',
      description: 'Bài tập ngữ pháp nền tảng với đáp án chi tiết',
      downloads: 2198,
      subject: 'Grammar',
      level: 'B1-B2',
      isFavorite: false
    },
    {
      id: 'lm7',
      name: 'VSTEP C1 - Full Mock Tests (10 đề)',
      type: 'zip',
      size: '245 MB',
      uploadDate: '09/12/2024',
      category: 'learning',
      description: '10 đề thi thử VSTEP C1 hoàn chỉnh với audio',
      downloads: 1876,
      subject: 'Full Test',
      level: 'C1',
      isFavorite: false
    },
    {
      id: 'lm8',
      name: 'Pronunciation Mastery - Audio Guide',
      type: 'zip',
      size: '89 MB',
      uploadDate: '08/12/2024',
      category: 'learning',
      description: 'Hướng dẫn phát âm chuẩn với file audio mẫu',
      downloads: 1543,
      subject: 'Pronunciation',
      level: 'A2-B2',
      isFavorite: false
    }
  ];

  // Mock data - Tài liệu lớp học (từ giáo viên)
  const classMaterials: Material[] = [
    {
      id: 'cm1',
      name: 'Week 12 - Reading Comprehension Exercises',
      type: 'pdf',
      size: '2.1 MB',
      uploadDate: '16/12/2024',
      category: 'class',
      description: 'Bài tập Reading tuần 12 - Deadline: 20/12/2024',
      downloads: 45,
      uploader: 'GV Nguyễn Thị Mai',
      subject: 'Reading',
      isFavorite: false
    },
    {
      id: 'cm2',
      name: 'Listening Assignment - Part 1 & 2',
      type: 'zip',
      size: '67 MB',
      uploadDate: '15/12/2024',
      category: 'class',
      description: 'Bài nghe về nhà - Audio files + worksheet',
      downloads: 38,
      uploader: 'GV Nguyễn Thị Mai',
      subject: 'Listening',
      isFavorite: true
    },
    {
      id: 'cm3',
      name: 'Writing Homework - Opinion Essay',
      type: 'doc',
      size: '0.8 MB',
      uploadDate: '14/12/2024',
      category: 'class',
      description: 'Đề bài Writing tuần này - Nộp trước 18/12',
      downloads: 42,
      uploader: 'GV Nguyễn Thị Mai',
      subject: 'Writing',
      isFavorite: false
    },
    {
      id: 'cm4',
      name: 'Class Presentation - Speaking Topics',
      type: 'pdf',
      size: '1.5 MB',
      uploadDate: '13/12/2024',
      category: 'class',
      description: 'Slide bài giảng Speaking - Chủ đề Education',
      downloads: 48,
      uploader: 'GV Nguyễn Thị Mai',
      subject: 'Speaking',
      isFavorite: true
    },
    {
      id: 'cm5',
      name: 'Midterm Review Materials',
      type: 'zip',
      size: '45 MB',
      uploadDate: '12/12/2024',
      category: 'class',
      description: 'Tài liệu ôn tập giữa kỳ - Toàn bộ 4 kỹ năng',
      downloads: 50,
      uploader: 'GV Nguyễn Thị Mai',
      subject: 'Review',
      isFavorite: true
    },
    {
      id: 'cm6',
      name: 'Vocabulary Quiz - Unit 5-6',
      type: 'pdf',
      size: '1.2 MB',
      uploadDate: '11/12/2024',
      category: 'class',
      description: 'Đề kiểm tra từ vựng Unit 5-6',
      downloads: 44,
      uploader: 'GV Nguyễn Thị Mai',
      subject: 'Vocabulary',
      isFavorite: false
    },
    {
      id: 'cm7',
      name: 'Group Project Guidelines',
      type: 'pdf',
      size: '0.9 MB',
      uploadDate: '10/12/2024',
      category: 'class',
      description: 'Hướng dẫn làm project nhóm cuối khóa',
      downloads: 47,
      uploader: 'GV Nguyễn Thị Mai',
      subject: 'Project',
      isFavorite: false
    }
  ];

  const allMaterials = [...learningMaterials, ...classMaterials];

  // Filter materials
  const filteredMaterials = allMaterials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    const matchesFileType = selectedFileType === 'all' || material.type === selectedFileType;
    
    return matchesSearch && matchesCategory && matchesFileType;
  });

  const learningCount = learningMaterials.length;
  const classCount = classMaterials.length;
  const favoriteCount = allMaterials.filter(m => m.isFavorite).length;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <File className="size-5 text-red-500" />;
      case 'doc':
        return <FileText className="size-5 text-blue-500" />;
      case 'video':
        return <FileVideo className="size-5 text-purple-500" />;
      case 'image':
        return <FileImage className="size-5 text-green-500" />;
      case 'zip':
        return <Archive className="size-5 text-orange-500" />;
      default:
        return <File className="size-5 text-gray-500" />;
    }
  };

  const formatFileSize = (size: string) => size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">📚 Tài liệu học tập</h1>
        <p className="text-blue-100">Quản lý và tải xuống tài liệu học tập & lớp học</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="size-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{learningCount}</p>
              <p className="text-sm text-gray-600">Tài liệu học tập</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="size-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{classCount}</p>
              <p className="text-sm text-gray-600">Tài liệu lớp học</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border-2 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="size-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{favoriteCount}</p>
              <p className="text-sm text-gray-600">Yêu thích</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Download className="size-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{allMaterials.reduce((sum, m) => sum + m.downloads, 0)}</p>
              <p className="text-sm text-gray-600">Lượt tải</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedCategory('learning')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                selectedCategory === 'learning'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BookOpen className="size-4" />
              Học tập
            </button>
            <button
              onClick={() => setSelectedCategory('class')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                selectedCategory === 'class'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users className="size-4" />
              Lớp học
            </button>
          </div>

          {/* File Type Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <Filter className="size-5" />
              Loại file
              <ChevronDown className={`size-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-48 z-10">
                {[
                  { value: 'all' as FileType, label: 'Tất cả' },
                  { value: 'pdf' as FileType, label: 'PDF' },
                  { value: 'doc' as FileType, label: 'Word' },
                  { value: 'video' as FileType, label: 'Video' },
                  { value: 'zip' as FileType, label: 'ZIP' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setSelectedFileType(type.value);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                      selectedFileType === type.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategory !== 'all' || selectedFileType !== 'all') && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">Bộ lọc:</span>
            {selectedCategory !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                {selectedCategory === 'learning' ? 'Học tập' : 'Lớp học'}
              </span>
            )}
            {selectedFileType !== 'all' && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                {selectedFileType.toUpperCase()}
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedFileType('all');
              }}
              className="ml-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section: Tài liệu học tập */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="size-6 text-blue-600" />
            Tài liệu học tập
            <span className="text-sm font-normal text-gray-500">
              ({filteredMaterials.filter(m => m.category === 'learning').length})
            </span>
          </h2>
          
          {filteredMaterials.filter(m => m.category === 'learning').length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <FileText className="size-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Không có tài liệu học tập</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMaterials.filter(m => m.category === 'learning').map((material) => (
                <div
                  key={material.id}
                  className="bg-white rounded-xl p-4 border-2 border-blue-100 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    {/* File Icon */}
                    <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                      {getFileIcon(material.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            {material.name}
                            {material.isFavorite && <Star className="size-3 text-yellow-500 fill-yellow-500" />}
                          </h3>
                          <p className="text-xs text-gray-600 mb-2">{material.description}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <FileText className="size-3" />
                              {material.type.toUpperCase()}
                            </span>
                            <span className="flex items-center gap-1">
                              <File className="size-3" />
                              {formatFileSize(material.size)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="size-3" />
                              {material.downloads}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {material.subject && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {material.subject}
                              </span>
                            )}
                            {material.level && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {material.level}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1 flex-shrink-0">
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Xem trước">
                            <Eye className="size-4 text-gray-600" />
                          </button>
                          <button className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors" title="Tải xuống">
                            <Download className="size-4 text-blue-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Tài liệu lớp học */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="size-6 text-purple-600" />
            Tài liệu lớp học
            <span className="text-sm font-normal text-gray-500">
              ({filteredMaterials.filter(m => m.category === 'class').length})
            </span>
          </h2>

          {filteredMaterials.filter(m => m.category === 'class').length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <FileText className="size-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Không có tài liệu lớp học</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMaterials.filter(m => m.category === 'class').map((material) => (
                <div
                  key={material.id}
                  className="bg-white rounded-xl p-4 border-2 border-purple-100 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    {/* File Icon */}
                    <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                      {getFileIcon(material.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            {material.name}
                            {material.isFavorite && <Star className="size-3 text-yellow-500 fill-yellow-500" />}
                          </h3>
                          <p className="text-xs text-gray-600 mb-2">{material.description}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <FileText className="size-3" />
                              {material.type.toUpperCase()}
                            </span>
                            <span className="flex items-center gap-1">
                              <File className="size-3" />
                              {formatFileSize(material.size)}
                            </span>
                            {material.uploader && (
                              <span className="flex items-center gap-1">
                                <Users className="size-3" />
                                {material.uploader}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {material.subject && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {material.subject}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1 flex-shrink-0">
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Xem trước">
                            <Eye className="size-4 text-gray-600" />
                          </button>
                          <button className="p-1.5 hover:bg-purple-100 rounded-lg transition-colors" title="Tải xuống">
                            <Download className="size-4 text-purple-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}