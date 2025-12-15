import { useState } from 'react';
import { FileText, Upload, Search, Download, Eye, Edit, Trash2, Plus, X, Share2, BookOpen, Headphones, Mic, PenTool, Users, CheckCircle, Clock, Globe, Lock, Star, Filter, Book, FolderOpen, Layers } from 'lucide-react';

type MaterialTab = 'class' | 'system';

interface Material {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'video' | 'audio' | 'xlsx' | 'zip';
  skill: 'Reading' | 'Listening' | 'Writing' | 'Speaking' | 'Grammar' | 'Vocabulary';
  level: 'A2' | 'B1' | 'B2' | 'C1';
  documentType: 'Bài giảng' | 'Đề thi' | 'Bài tập' | 'Tài liệu tham khảo';
  size: string;
  uploadDate: string;
  views: number;
  downloads: number;
  sharedWith: string[];
  visibility: 'public' | 'private' | 'class';
  status: 'active' | 'draft';
  description?: string;
  uploadedBy?: string; // For system materials
  source?: 'teacher' | 'admin'; // Source of material
}

export function TeacherMaterialsPage() {
  const [activeTab, setActiveTab] = useState<MaterialTab>('class');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Teacher's class materials
  const classMaterials: Material[] = [
    {
      id: 'TCM001',
      name: 'VSTEP B2 Reading - Part 1 Practice',
      type: 'pdf',
      skill: 'Reading',
      level: 'B2',
      documentType: 'Bài tập',
      size: '2.5 MB',
      uploadDate: '2024-12-10',
      views: 145,
      downloads: 89,
      sharedWith: ['Lớp B2.1', 'Lớp B2.2'],
      visibility: 'class',
      status: 'active',
      description: '50 câu hỏi luyện tập Reading Part 1 với đáp án chi tiết',
      source: 'teacher'
    },
    {
      id: 'TCM002',
      name: 'Listening Comprehension - Full Test',
      type: 'audio',
      skill: 'Listening',
      level: 'B1',
      documentType: 'Đề thi',
      size: '45.8 MB',
      uploadDate: '2024-12-08',
      views: 234,
      downloads: 156,
      sharedWith: ['Lớp B1.1'],
      visibility: 'class',
      status: 'active',
      description: 'Đề thi thử VSTEP Listening đầy đủ 3 parts',
      source: 'teacher'
    },
    {
      id: 'TCM003',
      name: 'Writing Task 2 - Sample Essays',
      type: 'docx',
      skill: 'Writing',
      level: 'B2',
      documentType: 'Tài liệu tham khảo',
      size: '1.8 MB',
      uploadDate: '2024-12-05',
      views: 321,
      downloads: 234,
      sharedWith: ['Lớp B2.1'],
      visibility: 'class',
      status: 'active',
      description: '20 bài mẫu Writing Task 2 đạt điểm cao',
      source: 'teacher'
    },
    {
      id: 'TCM004',
      name: 'Speaking Part 3 - Video Guidelines',
      type: 'video',
      skill: 'Speaking',
      level: 'C1',
      documentType: 'Bài giảng',
      size: '125.6 MB',
      uploadDate: '2024-12-01',
      views: 98,
      downloads: 45,
      sharedWith: ['Lớp C1.1'],
      visibility: 'class',
      status: 'active',
      description: 'Hướng dẫn chi tiết về Speaking Part 3',
      source: 'teacher'
    },
    {
      id: 'TCM005',
      name: 'Grammar Practice - Conditionals',
      type: 'pdf',
      skill: 'Grammar',
      level: 'B1',
      documentType: 'Bài tập',
      size: '3.2 MB',
      uploadDate: '2024-11-28',
      views: 167,
      downloads: 112,
      sharedWith: ['Lớp B1.1', 'Lớp B1.2'],
      visibility: 'class',
      status: 'draft',
      description: 'Bài tập câu điều kiện (đang soạn)',
      source: 'teacher'
    },
  ];

  // System/Admin materials (shared across platform)
  const systemMaterials: Material[] = [
    {
      id: 'SYS001',
      name: 'VSTEP Reading Strategies - Complete Guide',
      type: 'pdf',
      skill: 'Reading',
      level: 'B2',
      documentType: 'Tài liệu tham khảo',
      size: '8.5 MB',
      uploadDate: '2024-12-10',
      views: 2345,
      downloads: 1234,
      sharedWith: [],
      visibility: 'public',
      status: 'active',
      description: 'Hướng dẫn chi tiết về các chiến lược làm bài Reading VSTEP',
      uploadedBy: 'TS. Nguyễn Văn A',
      source: 'admin'
    },
    {
      id: 'SYS002',
      name: 'English Grammar in Use - Advanced',
      type: 'pdf',
      skill: 'Grammar',
      level: 'C1',
      documentType: 'Tài liệu tham khảo',
      size: '25.3 MB',
      uploadDate: '2024-12-09',
      views: 3456,
      downloads: 2345,
      sharedWith: [],
      visibility: 'public',
      status: 'active',
      description: 'Sách ngữ pháp tiếng Anh nâng cao với bài tập',
      uploadedBy: 'Admin',
      source: 'admin'
    },
    {
      id: 'SYS003',
      name: 'VSTEP Listening Practice Audio Collection',
      type: 'audio',
      skill: 'Listening',
      level: 'B1',
      documentType: 'Bài tập',
      size: '156 MB',
      uploadDate: '2024-12-08',
      views: 1890,
      downloads: 987,
      sharedWith: [],
      visibility: 'public',
      status: 'active',
      description: 'Bộ sưu tập audio luyện tập listening',
      uploadedBy: 'TS. Lê Văn C',
      source: 'admin'
    },
    {
      id: 'SYS004',
      name: 'Academic Writing - VSTEP B2/C1',
      type: 'pptx',
      skill: 'Writing',
      level: 'B2',
      documentType: 'Bài giảng',
      size: '12.4 MB',
      uploadDate: '2024-12-07',
      views: 2134,
      downloads: 1456,
      sharedWith: [],
      visibility: 'public',
      status: 'active',
      description: 'Slide bài giảng về Academic Writing',
      uploadedBy: 'ThS. Trần Thị B',
      source: 'admin'
    },
    {
      id: 'SYS005',
      name: 'Essential Vocabulary 3000 Words',
      type: 'xlsx',
      skill: 'Vocabulary',
      level: 'B2',
      documentType: 'Tài liệu tham khảo',
      size: '4.2 MB',
      uploadDate: '2024-12-05',
      views: 4567,
      downloads: 3456,
      sharedWith: [],
      visibility: 'public',
      status: 'active',
      description: '3000 từ vựng thiết yếu với ví dụ',
      uploadedBy: 'Admin',
      source: 'admin'
    },
    {
      id: 'SYS006',
      name: 'Speaking Part 1-3 Question Bank',
      type: 'pdf',
      skill: 'Speaking',
      level: 'B2',
      documentType: 'Tài liệu tham khảo',
      size: '5.6 MB',
      uploadDate: '2024-12-03',
      views: 1987,
      downloads: 1234,
      sharedWith: [],
      visibility: 'public',
      status: 'active',
      description: 'Ngân hàng câu hỏi Speaking tất cả parts',
      uploadedBy: 'GV. Hoàng Văn D',
      source: 'admin'
    },
  ];

  const myClasses = ['Tất cả lớp', 'Lớp B2.1', 'Lớp B2.2', 'Lớp B1.1', 'Lớp C1.1'];

  // Get current materials based on active tab
  const getCurrentMaterials = () => {
    return activeTab === 'class' ? classMaterials : systemMaterials;
  };

  const currentMaterials = getCurrentMaterials();

  // Filter materials
  const filteredMaterials = currentMaterials.filter(mat => {
    const matchesSearch = mat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = filterSkill === 'all' || mat.skill === filterSkill;
    const matchesLevel = filterLevel === 'all' || mat.level === filterLevel;
    const matchesClass = filterClass === 'all' || filterClass === 'Tất cả lớp' || mat.sharedWith.includes(filterClass);
    
    // For class materials, apply class filter
    // For system materials, ignore class filter
    if (activeTab === 'class') {
      return matchesSearch && matchesSkill && matchesLevel && matchesClass;
    } else {
      return matchesSearch && matchesSkill && matchesLevel;
    }
  });

  // Stats
  const getStats = () => {
    if (activeTab === 'class') {
      return [
        { label: 'Tài liệu của tôi', value: classMaterials.length, icon: FolderOpen, color: 'blue' },
        { label: 'Đã chia sẻ', value: classMaterials.filter(m => m.sharedWith.length > 0).length, icon: Users, color: 'green' },
        { label: 'Lượt xem', value: classMaterials.reduce((sum, m) => sum + m.views, 0).toLocaleString(), icon: Eye, color: 'purple' },
        { label: 'Lượt tải', value: classMaterials.reduce((sum, m) => sum + m.downloads, 0).toLocaleString(), icon: Download, color: 'orange' }
      ];
    } else {
      return [
        { label: 'Tài liệu hệ thống', value: systemMaterials.length, icon: Layers, color: 'blue' },
        { label: 'Công khai', value: systemMaterials.filter(m => m.visibility === 'public').length, icon: Globe, color: 'green' },
        { label: 'Lượt xem', value: systemMaterials.reduce((sum, m) => sum + m.views, 0).toLocaleString(), icon: Eye, color: 'purple' },
        { label: 'Lượt tải', value: systemMaterials.reduce((sum, m) => sum + m.downloads, 0).toLocaleString(), icon: Download, color: 'orange' }
      ];
    }
  };

  const stats = getStats();

  const getFileIcon = (type: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      docx: '📝',
      pptx: '📊',
      xlsx: '📗',
      video: '🎥',
      audio: '🎵',
      zip: '📦'
    };
    return icons[type] || '📁';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      pdf: 'bg-red-100 text-red-700 border-red-200',
      docx: 'bg-blue-100 text-blue-700 border-blue-200',
      pptx: 'bg-orange-100 text-orange-700 border-orange-200',
      xlsx: 'bg-green-100 text-green-700 border-green-200',
      video: 'bg-purple-100 text-purple-700 border-purple-200',
      audio: 'bg-pink-100 text-pink-700 border-pink-200',
      zip: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getSkillIcon = (skill: string) => {
    const icons: Record<string, any> = {
      Reading: BookOpen,
      Listening: Headphones,
      Writing: PenTool,
      Speaking: Mic,
      Grammar: FileText,
      Vocabulary: Star
    };
    return icons[skill] || FileText;
  };

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('class');
              setFilterClass('all');
              setSearchTerm('');
            }}
            className={`flex-1 px-6 py-4 font-medium transition-colors border-b-2 ${
              activeTab === 'class'
                ? 'border-emerald-600 text-emerald-600 bg-emerald-50'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FolderOpen className="size-5" />
              <span>Tài liệu lớp học</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                activeTab === 'class' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {classMaterials.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('system');
              setFilterClass('all');
              setSearchTerm('');
            }}
            className={`flex-1 px-6 py-4 font-medium transition-colors border-b-2 ${
              activeTab === 'system'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Layers className="size-5" />
              <span>Tài liệu chung ở web</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                activeTab === 'system' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {systemMaterials.length}
              </span>
            </div>
          </button>
        </div>

        {/* Tab Description */}
        <div className={`p-4 ${activeTab === 'class' ? 'bg-emerald-50' : 'bg-blue-50'}`}>
          <p className="text-sm text-gray-700">
            {activeTab === 'class' ? (
              <>
                <strong>📚 Tài liệu lớp học:</strong> Tài liệu bạn tự tạo và quản lý cho các lớp của mình. Bạn có thể upload, chỉnh sửa, xóa và chia sẻ với các lớp học.
              </>
            ) : (
              <>
                <strong>🌐 Tài liệu chung:</strong> Tài liệu được chia sẻ toàn hệ thống từ Admin và các giáo viên khác. Bạn có thể xem, tải xuống và gán vào lớp học của mình.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                  <Icon className={`size-6 text-${stat.color}-600`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            {activeTab === 'class' && (
              <button 
                onClick={() => setShowUploadModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                <Upload className="size-5" />
                <span>Tải lên tài liệu</span>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className={`grid grid-cols-1 ${activeTab === 'class' ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4`}>
            {/* Skill Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
              <select 
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">Tất cả kỹ năng</option>
                <option value="Reading">Reading</option>
                <option value="Listening">Listening</option>
                <option value="Writing">Writing</option>
                <option value="Speaking">Speaking</option>
                <option value="Grammar">Grammar</option>
                <option value="Vocabulary">Vocabulary</option>
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trình độ</label>
              <select 
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">Tất cả trình độ</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
            </div>

            {/* Class Filter - Only for class materials */}
            {activeTab === 'class' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lớp học</label>
                <select 
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {myClasses.map(cls => (
                    <option key={cls} value={cls === 'Tất cả lớp' ? 'all' : cls}>{cls}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold text-emerald-600">{filteredMaterials.length}</span> tài liệu
        </p>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => {
          const SkillIcon = getSkillIcon(material.skill);
          return (
            <div key={material.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:border-emerald-300">
              {/* Preview Header */}
              <div className="h-40 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center relative">
                <div className="text-7xl mb-2">{getFileIcon(material.type)}</div>
                
                {/* Status Badge */}
                {material.status === 'draft' && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                    Nháp
                  </div>
                )}
                
                {/* Source Badge */}
                <div className="absolute top-3 left-3">
                  {material.source === 'admin' ? (
                    <div className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Globe className="size-3" />
                      Hệ thống
                    </div>
                  ) : material.sharedWith.length > 0 ? (
                    <div className="px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Users className="size-3" />
                      Đã chia sẻ
                    </div>
                  ) : (
                    <div className="px-2 py-1 bg-gray-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Lock className="size-3" />
                      Riêng tư
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">{material.name}</h3>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor(material.type)}`}>
                      {material.type.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                      <SkillIcon className="size-3" />
                      {material.skill}
                    </span>
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                      {material.level}
                    </span>
                  </div>

                  {/* Document Type */}
                  <div className="text-xs text-gray-600 mb-3 bg-gray-50 px-2 py-1 rounded">
                    📑 {material.documentType}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Eye className="size-3" />
                      <span>{material.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="size-3" />
                      <span>{material.downloads}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>{material.size}</span>
                    </div>
                  </div>

                  {/* Uploaded By (for system materials) */}
                  {material.source === 'admin' && material.uploadedBy && (
                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mb-3">
                      👤 Tải lên bởi: {material.uploadedBy}
                    </div>
                  )}

                  {/* Shared With (for class materials) */}
                  {material.source === 'teacher' && material.sharedWith.length > 0 && (
                    <div className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded mb-3">
                      <Users className="size-3 inline mr-1" />
                      Chia sẻ: {material.sharedWith.join(', ')}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setSelectedMaterial(material);
                      setShowDetailModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
                  >
                    <Eye className="size-4" />
                    Xem
                  </button>
                  
                  {material.source === 'admin' ? (
                    <button 
                      onClick={() => alert(`Gán "${material.name}" vào lớp học của bạn`)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      <Plus className="size-4" />
                      Gán vào lớp
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => alert(`Chỉnh sửa "${material.name}"`)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Xóa "${material.name}"?`)) {
                            alert('Đã xóa!');
                          }
                        }}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="size-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy tài liệu</h3>
          <p className="text-gray-600 mb-4">
            {activeTab === 'class' 
              ? 'Chưa có tài liệu nào. Hãy tải lên tài liệu đầu tiên!'
              : 'Không tìm thấy tài liệu nào phù hợp với bộ lọc'
            }
          </p>
          {activeTab === 'class' && (
            <button 
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Upload className="size-5" />
              Tải lên tài liệu mới
            </button>
          )}
        </div>
      )}

      {/* Upload Modal (only for class materials) */}
      {showUploadModal && (
        <UploadMaterialModal 
          onClose={() => setShowUploadModal(false)} 
          myClasses={myClasses.filter(c => c !== 'Tất cả lớp')}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedMaterial && (
        <MaterialDetailModal 
          material={selectedMaterial}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedMaterial(null);
          }}
          isSystemMaterial={selectedMaterial.source === 'admin'}
          myClasses={myClasses.filter(c => c !== 'Tất cả lớp')}
        />
      )}
    </div>
  );
}

// Upload Material Modal
function UploadMaterialModal({ onClose, myClasses }: { onClose: () => void; myClasses: string[] }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Tải lên tài liệu mới</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="size-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Drag and Drop Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-gray-50">
            <Upload className="size-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-2">Kéo thả file vào đây hoặc click để chọn</p>
            <p className="text-sm text-gray-500">Hỗ trợ: PDF, DOCX, PPTX, XLSX, Video, Audio, ZIP</p>
            <p className="text-xs text-gray-400 mt-1">(Tối đa 200MB)</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên tài liệu *</label>
              <input
                type="text"
                placeholder="VD: VSTEP B2 Reading Practice Part 1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng *</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="">Chọn kỹ năng</option>
                  <option>Reading</option>
                  <option>Listening</option>
                  <option>Writing</option>
                  <option>Speaking</option>
                  <option>Grammar</option>
                  <option>Vocabulary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trình độ *</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="">Chọn trình độ</option>
                  <option>A2</option>
                  <option>B1</option>
                  <option>B2</option>
                  <option>C1</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại tài liệu *</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option value="">Chọn loại</option>
                <option>Bài giảng</option>
                <option>Đề thi</option>
                <option>Bài tập</option>
                <option>Tài liệu tham khảo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chia sẻ với lớp học</label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50">
                {myClasses.map(className => (
                  <label key={className} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                    <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                    <span className="text-sm text-gray-700">{className}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
              <textarea
                rows={3}
                placeholder="Mô tả ngắn về tài liệu..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              alert('Đã tải lên tài liệu thành công!');
              onClose();
            }}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Tải lên và chia sẻ
          </button>
        </div>
      </div>
    </div>
  );
}

// Material Detail Modal
function MaterialDetailModal({ 
  material, 
  onClose, 
  isSystemMaterial,
  myClasses 
}: { 
  material: Material; 
  onClose: () => void; 
  isSystemMaterial: boolean;
  myClasses: string[];
}) {
  const [showAssignModal, setShowAssignModal] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold text-gray-900">Chi tiết tài liệu</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="size-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Header */}
            <div className={`${isSystemMaterial ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-emerald-500 to-emerald-600'} rounded-xl p-6 text-white`}>
              <div className="flex items-start gap-4 mb-4">
                <div className="text-6xl">{getFileIcon(material.type)}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{material.name}</h3>
                  <p className="text-sm opacity-90">{material.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="opacity-75 mb-1">Kỹ năng</p>
                  <p className="font-semibold">{material.skill}</p>
                </div>
                <div>
                  <p className="opacity-75 mb-1">Trình độ</p>
                  <p className="font-semibold">{material.level}</p>
                </div>
                <div>
                  <p className="opacity-75 mb-1">Kích thước</p>
                  <p className="font-semibold">{material.size}</p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Loại tài liệu</p>
                  <p className="font-medium">{material.documentType}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Ngày tải lên</p>
                  <p className="font-medium">{material.uploadDate}</p>
                </div>
                {isSystemMaterial && material.uploadedBy && (
                  <div className="col-span-2">
                    <p className="text-gray-600 mb-1">Tải lên bởi</p>
                    <p className="font-medium">{material.uploadedBy}</p>
                  </div>
                )}
                {!isSystemMaterial && material.sharedWith.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-gray-600 mb-1">Đã chia sẻ với</p>
                    <p className="font-medium">{material.sharedWith.join(', ')}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Eye className="size-4" />
                  <span>{material.views} lượt xem</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Download className="size-4" />
                  <span>{material.downloads} lượt tải</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {isSystemMaterial ? (
                <>
                  <button 
                    onClick={() => setShowAssignModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    <Plus className="size-4" />
                    Gán vào lớp học của tôi
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
                    <Download className="size-4" />
                    Tải xuống
                  </button>
                </>
              ) : (
                <>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    <Edit className="size-4" />
                    Chỉnh sửa
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
                    <Share2 className="size-4" />
                    Chia sẻ với lớp
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">
                    <Download className="size-4" />
                    Tải xuống
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm(`Xóa tài liệu "${material.name}"?`)) {
                        alert('Đã xóa!');
                        onClose();
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-medium"
                  >
                    <Trash2 className="size-4" />
                    Xóa tài liệu
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assign to Class Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Gán vào lớp học</h3>
              <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">Chọn lớp học để gán tài liệu này:</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {myClasses.map(className => (
                  <label key={className} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                    <span className="text-sm text-gray-700 font-medium">{className}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  alert('Đã gán tài liệu vào lớp học!');
                  setShowAssignModal(false);
                  onClose();
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Gán vào lớp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function getFileIcon(type: string) {
  const icons: Record<string, string> = {
    pdf: '📄',
    docx: '📝',
    pptx: '📊',
    xlsx: '📗',
    video: '🎥',
    audio: '🎵',
    zip: '📦'
  };
  return icons[type] || '📁';
}
