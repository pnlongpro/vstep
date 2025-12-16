import { useState } from 'react';
import { FileText, Upload, Search, Filter, Download, Eye, Edit, Trash2, Folder, File, Plus, MoreVertical, X, Share2, BookOpen, Headphones, Mic, PenTool, Users, CheckCircle, Clock, Globe, Lock, Star, Ban, Check, AlertCircle, TrendingUp, BarChart3 } from 'lucide-react';

interface Material {
  id: number;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'video' | 'audio' | 'xlsx' | 'zip';
  skill: 'Reading' | 'Listening' | 'Writing' | 'Speaking' | 'Grammar' | 'Vocabulary';
  level: 'A2' | 'B1' | 'B2' | 'C1';
  documentType: 'Bài giảng' | 'Đề thi' | 'Bài tập' | 'Tài liệu tham khảo';
  size: string;
  uploadDate: string;
  views: number;
  downloads: number;
  uploadedBy: string;
  uploaderId: number;
  visibility: 'public' | 'private' | 'class';
  status: 'active' | 'pending' | 'rejected';
  description?: string;
  approvedBy?: string;
}

export function AdminMaterialsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'rejected'>('all');

  const materials: Material[] = [
    {
      id: 1,
      name: 'VSTEP B2 Reading - Complete Guide 2024',
      type: 'pdf',
      skill: 'Reading',
      level: 'B2',
      documentType: 'Bài giảng',
      size: '12.5 MB',
      uploadDate: '2024-12-10',
      views: 1245,
      downloads: 789,
      uploadedBy: 'GV Minh',
      uploaderId: 101,
      visibility: 'public',
      status: 'active',
      approvedBy: 'Admin VSTEPRO',
      description: 'Tài liệu hướng dẫn đầy đủ về Reading B2'
    },
    {
      id: 2,
      name: 'Listening Full Test Collection - B1 Level',
      type: 'zip',
      skill: 'Listening',
      level: 'B1',
      documentType: 'Đề thi',
      size: '145.8 MB',
      uploadDate: '2024-12-09',
      views: 2134,
      downloads: 1456,
      uploadedBy: 'GV Hương',
      uploaderId: 102,
      visibility: 'public',
      status: 'active',
      approvedBy: 'Admin VSTEPRO',
      description: 'Bộ 20 đề thi Listening B1 đầy đủ'
    },
    {
      id: 3,
      name: 'Writing Task 2 - Advanced Techniques',
      type: 'pptx',
      skill: 'Writing',
      level: 'C1',
      documentType: 'Bài giảng',
      size: '8.9 MB',
      uploadDate: '2024-12-08',
      views: 0,
      downloads: 0,
      uploadedBy: 'GV Thanh',
      uploaderId: 103,
      visibility: 'class',
      status: 'pending',
      description: 'Kỹ thuật viết nâng cao cho C1'
    },
    {
      id: 4,
      name: 'Speaking Part 3 - Discussion Topics',
      type: 'docx',
      skill: 'Speaking',
      level: 'B2',
      documentType: 'Bài tập',
      size: '2.1 MB',
      uploadDate: '2024-12-07',
      views: 567,
      downloads: 345,
      uploadedBy: 'GV Nam',
      uploaderId: 104,
      visibility: 'public',
      status: 'active',
      approvedBy: 'Admin VSTEPRO',
      description: '50 chủ đề thảo luận Speaking Part 3'
    },
    {
      id: 5,
      name: 'Grammar Exercises - Conditional Sentences',
      type: 'pdf',
      skill: 'Grammar',
      level: 'B1',
      documentType: 'Bài tập',
      size: '3.2 MB',
      uploadDate: '2024-12-06',
      views: 0,
      downloads: 0,
      uploadedBy: 'GV Lan',
      uploaderId: 105,
      visibility: 'class',
      status: 'pending',
      description: 'Bài tập về câu điều kiện các loại'
    },
    {
      id: 6,
      name: 'Vocabulary 5000 - Academic Words',
      type: 'xlsx',
      skill: 'Vocabulary',
      level: 'C1',
      documentType: 'Tài liệu tham khảo',
      size: '4.5 MB',
      uploadDate: '2024-12-05',
      views: 3456,
      downloads: 2789,
      uploadedBy: 'GV Minh',
      uploaderId: 101,
      visibility: 'public',
      status: 'active',
      approvedBy: 'Admin VSTEPRO',
      description: '5000 từ vựng học thuật quan trọng'
    },
    {
      id: 7,
      name: 'Pronunciation Guide - Vietnamese Speakers',
      type: 'video',
      skill: 'Speaking',
      level: 'A2',
      documentType: 'Bài giảng',
      size: '256.4 MB',
      uploadDate: '2024-12-04',
      views: 1890,
      downloads: 1234,
      uploadedBy: 'GV Hương',
      uploaderId: 102,
      visibility: 'public',
      status: 'active',
      approvedBy: 'Admin VSTEPRO',
      description: 'Hướng dẫn phát âm cho người Việt'
    },
    {
      id: 8,
      name: 'Reading Strategies - Speed Reading',
      type: 'pdf',
      skill: 'Reading',
      level: 'B2',
      documentType: 'Tài liệu tham khảo',
      size: '1.8 MB',
      uploadDate: '2024-12-03',
      views: 0,
      downloads: 0,
      uploadedBy: 'GV Tú',
      uploaderId: 106,
      visibility: 'public',
      status: 'rejected',
      description: 'Kỹ thuật đọc nhanh (nội dung chưa đạt yêu cầu)'
    },
  ];

  const skills = ['all', 'Reading', 'Listening', 'Writing', 'Speaking', 'Grammar', 'Vocabulary'];
  const levels = ['all', 'A2', 'B1', 'B2', 'C1'];
  const statuses = ['all', 'active', 'pending', 'rejected'];

  const filteredMaterials = materials.filter(mat => {
    const matchesSearch = mat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         mat.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = filterSkill === 'all' || mat.skill === filterSkill;
    const matchesLevel = filterLevel === 'all' || mat.level === filterLevel;
    const matchesStatus = filterStatus === 'all' || mat.status === filterStatus;
    const matchesTab = activeTab === 'all' || mat.status === activeTab;
    return matchesSearch && matchesSkill && matchesLevel && matchesStatus && matchesTab;
  });

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

  const stats = [
    { 
      label: 'Tổng tài liệu', 
      value: materials.length, 
      icon: FileText, 
      color: 'blue',
      subtext: `${materials.filter(m => m.status === 'active').length} đang hoạt động`
    },
    { 
      label: 'Chờ duyệt', 
      value: materials.filter(m => m.status === 'pending').length, 
      icon: Clock, 
      color: 'yellow',
      subtext: 'Cần xem xét'
    },
    { 
      label: 'Tổng lượt xem', 
      value: materials.reduce((sum, m) => sum + m.views, 0).toLocaleString(), 
      icon: Eye, 
      color: 'purple',
      subtext: '+12% so với tháng trước'
    },
    { 
      label: 'Tổng lượt tải', 
      value: materials.reduce((sum, m) => sum + m.downloads, 0).toLocaleString(), 
      icon: Download, 
      color: 'green',
      subtext: '+18% so với tháng trước'
    }
  ];

  const handleApproveMaterial = (id: number) => {
    console.log('Approving material:', id);
    setShowApproveModal(false);
  };

  const handleRejectMaterial = (id: number) => {
    console.log('Rejecting material:', id);
    setShowRejectModal(false);
  };

  const handleDeleteMaterial = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa vĩnh viễn tài liệu này? Hành động này không thể hoàn tác.')) {
      console.log('Deleting material:', id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                  <Icon className={`size-6 text-${stat.color}-600`} />
                </div>
                {stat.label === 'Chờ duyệt' && typeof stat.value === 'number' && stat.value > 0 && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full animate-pulse">
                    Mới
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-700 mb-1">{stat.label}</p>
              <p className="text-xs text-gray-500">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200">
        <div className="flex border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-purple-600 border-b-4 border-purple-600 -mb-0.5'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="size-5" />
              <span>Tất cả ({materials.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'pending'
                ? 'text-yellow-600 border-b-4 border-yellow-600 -mb-0.5'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="size-5" />
              <span>Chờ duyệt ({materials.filter(m => m.status === 'pending').length})</span>
              {materials.filter(m => m.status === 'pending').length > 0 && (
                <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full animate-pulse">
                  {materials.filter(m => m.status === 'pending').length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'active'
                ? 'text-green-600 border-b-4 border-green-600 -mb-0.5'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="size-5" />
              <span>Đã duyệt ({materials.filter(m => m.status === 'active').length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'rejected'
                ? 'text-red-600 border-b-4 border-red-600 -mb-0.5'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Ban className="size-5" />
              <span>Từ chối ({materials.filter(m => m.status === 'rejected').length})</span>
            </div>
          </button>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên tài liệu hoặc giáo viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Upload className="size-5" />
              <span>Tải lên tài liệu</span>
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Skill Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
              <select 
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">Tất cả kỹ năng</option>
                {skills.filter(s => s !== 'all').map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trình độ</label>
              <select 
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">Tất cả trình độ</option>
                {levels.filter(l => l !== 'all').map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đã duyệt</option>
                <option value="pending">Chờ duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold text-purple-600">{filteredMaterials.length}</span> tài liệu
        </p>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => {
          const SkillIcon = getSkillIcon(material.skill);
          return (
            <div key={material.id} className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden hover:shadow-lg transition-all ${
              material.status === 'pending' ? 'border-yellow-300' : 
              material.status === 'rejected' ? 'border-red-300' : 
              'border-gray-200 hover:border-purple-300'
            }`}>
              {/* Preview Header */}
              <div className="h-40 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col items-center justify-center relative">
                <div className="text-7xl mb-2">{getFileIcon(material.type)}</div>
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {material.status === 'pending' && (
                    <div className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Clock className="size-3" />
                      CHỜ DUYỆT
                    </div>
                  )}
                  {material.status === 'active' && (
                    <div className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <CheckCircle className="size-3" />
                      ĐÃ DUYỆT
                    </div>
                  )}
                  {material.status === 'rejected' && (
                    <div className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Ban className="size-3" />
                      TỪ CHỐI
                    </div>
                  )}
                </div>

                {/* Visibility Badge */}
                <div className="absolute top-3 left-3">
                  {material.visibility === 'public' ? (
                    <div className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Globe className="size-3" />
                      Public
                    </div>
                  ) : material.visibility === 'class' ? (
                    <div className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Users className="size-3" />
                      Class
                    </div>
                  ) : (
                    <div className="px-2 py-1 bg-gray-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Lock className="size-3" />
                      Private
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">{material.name}</h3>
                  
                  {/* Uploaded By */}
                  <div className="text-xs text-gray-600 mb-3 bg-gray-50 px-2 py-1 rounded flex items-center gap-1">
                    <Users className="size-3" />
                    Tải lên bởi: <span className="font-medium">{material.uploadedBy}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor(material.type)}`}>
                      {material.type.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                      <SkillIcon className="size-3" />
                      {material.skill}
                    </span>
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                      {material.level}
                    </span>
                  </div>

                  {/* Document Type */}
                  <div className="text-xs text-gray-600 mb-3 bg-purple-50 px-2 py-1 rounded">
                    📑 {material.documentType}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-3 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-1">
                      <Eye className="size-3" />
                      <span>{material.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="size-3" />
                      <span>{material.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>{material.size}</span>
                    </div>
                  </div>

                  {/* Approved By (if active) */}
                  {material.status === 'active' && material.approvedBy && (
                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded mb-3 flex items-center gap-1">
                      <CheckCircle className="size-3" />
                      Đã duyệt bởi: {material.approvedBy}
                    </div>
                  )}
                </div>

                {/* Actions */}
                {material.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedMaterial(material);
                        setShowApproveModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium border-2 border-green-200"
                    >
                      <Check className="size-4" />
                      Duyệt
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedMaterial(material);
                        setShowRejectModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border-2 border-red-200"
                    >
                      <X className="size-4" />
                      Từ chối
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                      <Eye className="size-4" />
                      Xem
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                      <Download className="size-4" />
                      Tải
                    </button>
                    <button 
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border-2 border-gray-200">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="size-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy tài liệu</h3>
          <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tab khác</p>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b-2 border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="size-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Duyệt tài liệu</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Bạn có chắc muốn duyệt tài liệu này? Tài liệu sẽ được công khai cho tất cả người dùng.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="font-semibold text-gray-900 mb-2">{selectedMaterial.name}</p>
                <p className="text-sm text-gray-600">Tải lên bởi: {selectedMaterial.uploadedBy}</p>
                <p className="text-sm text-gray-600">Ngày: {selectedMaterial.uploadDate}</p>
              </div>
            </div>
            <div className="p-6 border-t-2 border-gray-200 flex gap-3 justify-end bg-gray-50">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={() => handleApproveMaterial(selectedMaterial.id)}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Xác nhận duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b-2 border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-red-100 rounded-full">
                  <Ban className="size-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Từ chối tài liệu</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Vui lòng nhập lý do từ chối để giáo viên có thể cải thiện tài liệu.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="font-semibold text-gray-900 mb-2">{selectedMaterial.name}</p>
                <p className="text-sm text-gray-600">Tải lên bởi: {selectedMaterial.uploadedBy}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lý do từ chối *</label>
                <textarea
                  rows={4}
                  placeholder="VD: Nội dung chưa rõ ràng, thiếu tài liệu tham khảo..."
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t-2 border-gray-200 flex gap-3 justify-end bg-gray-50">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={() => handleRejectMaterial(selectedMaterial.id)}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
