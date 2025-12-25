import { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Clock, Eye, Download, Video, Music, Book, AlertCircle, Send, Plus, Search, Filter, Calendar, User, File, Layers } from 'lucide-react';
import { TeacherClassMaterialsView } from './TeacherClassMaterialsView';
import { textbookMaterialsData, mediaMaterialsData } from '../../data/classMaterialsData';

type MaterialTab = 'study' | 'class' | 'history';
type ClassCategory = 'textbook' | 'media';
type MaterialStatus = 'pending' | 'approved' | 'rejected';

interface Course {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const availableCourses: Course[] = [
  { id: 'complete', name: 'VSTEP Complete', icon: '🎓', color: 'from-purple-500 to-blue-500' },
  { id: 'foundation', name: 'VSTEP Foundation', icon: '📚', color: 'from-blue-500 to-cyan-500' },
  { id: 'starter', name: 'VSTEP Starter', icon: '🚀', color: 'from-orange-500 to-red-500' },
  { id: 'builder', name: 'VSTEP Builder', icon: '📖', color: 'from-teal-500 to-green-500' },
  { id: 'developer', name: 'VSTEP Developer', icon: '⬛', color: 'from-gray-600 to-gray-800' },
  { id: 'booster', name: 'VSTEP Booster', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
  { id: 'intensive', name: 'VSTEP Intensive', icon: '🔥', color: 'from-red-500 to-pink-500' },
  { id: 'practice', name: 'VSTEP Practice', icon: '📝', color: 'from-green-500 to-teal-500' },
  { id: 'premium', name: 'VSTEP Premium', icon: '👑', color: 'from-amber-500 to-yellow-500' },
  { id: 'master', name: 'VSTEP Master', icon: '🏆', color: 'from-purple-600 to-pink-600' },
];

// Mock data - Study Materials
const studyMaterialsData = [
  {
    id: 'SM001',
    name: 'Giáo trình VSTEP Speaking Advanced',
    description: 'Tài liệu Speaking nâng cao cho VSTEP Master với 50 chủ đề thực tế',
    skill: 'Speaking',
    course: 'VSTEP Master',
    type: 'pdf',
    size: '25.4 MB',
    uploadDate: '15/12/2024',
    status: 'approved' as MaterialStatus,
    downloads: 234,
    views: 567,
  },
  {
    id: 'SM002',
    name: 'Bộ đề Reading Foundation - 100 câu',
    description: 'Bộ đề Reading Foundation với 100 câu hỏi đa dạng',
    skill: 'Reading',
    course: 'VSTEP Foundation',
    type: 'pdf',
    size: '18.7 MB',
    uploadDate: '10/12/2024',
    status: 'rejected' as MaterialStatus,
    downloads: 0,
    views: 12,
    rejectReason: 'Nội dung chưa đầy đủ, thiếu đáp án chi tiết. Vui lòng bổ sung và gửi lại.'
  },
  {
    id: 'SM003',
    name: 'Listening Practice B2 Audio Pack',
    description: 'Bộ 30 bài nghe B2 với transcript và đáp án',
    skill: 'Listening',
    course: 'VSTEP Complete',
    type: 'audio',
    size: '180 MB',
    uploadDate: '18/12/2024',
    status: 'pending' as MaterialStatus,
    downloads: 0,
    views: 5,
  },
  {
    id: 'SM004',
    name: 'Writing Task 2 - Sample Essays',
    description: '50 bài luận mẫu Writing Task 2 với band 7.0+',
    skill: 'Writing',
    course: 'VSTEP Premium',
    type: 'docx',
    size: '12.3 MB',
    uploadDate: '20/12/2024',
    status: 'approved' as MaterialStatus,
    downloads: 156,
    views: 389,
  },
];

export function ContributeMaterialsPage() {
  const [activeTab, setActiveTab] = useState<MaterialTab>('study');
  const [classCategory, setClassCategory] = useState<ClassCategory>('textbook');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Form states
  const [materialName, setMaterialName] = useState('');
  const [materialType, setMaterialType] = useState<string>('pdf');
  const [skill, setSkill] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [description, setDescription] = useState('');

  // Get current materials based on active tab
  const getCurrentMaterials = () => {
    if (activeTab === 'study') return studyMaterialsData;
    if (activeTab === 'class') {
      return classCategory === 'textbook' ? textbookMaterialsData : mediaMaterialsData;
    }
    // History shows all materials
    return [...studyMaterialsData, ...textbookMaterialsData, ...mediaMaterialsData];
  };

  const currentMaterials = getCurrentMaterials();

  // Filter materials
  const filteredMaterials = currentMaterials.filter(material => {
    const matchesSearch = searchTerm === '' ||
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = filterSkill === 'all' || 
      ('skill' in material && material.skill === filterSkill);
    
    const matchesCourse = filterCourse === 'all' || material.course === filterCourse;
    
    const matchesStatus = filterStatus === 'all' || material.status === filterStatus;
    
    return matchesSearch && matchesSkill && matchesCourse && matchesStatus;
  });

  // Count by status
  const allMaterials = [...studyMaterialsData, ...textbookMaterialsData, ...mediaMaterialsData];
  const pendingCount = allMaterials.filter(m => m.status === 'pending').length;
  const approvedCount = allMaterials.filter(m => m.status === 'approved').length;
  const rejectedCount = allMaterials.filter(m => m.status === 'rejected').length;

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setShowUploadModal(false);
          alert('Tài liệu đã được gửi thành công! Admin sẽ xem xét trong vòng 24-48 giờ.');
          // Reset form
          setMaterialName('');
          setDescription('');
          setSkill('');
          setCourse('');
          setMaterialType('pdf');
        }, 500);
      }
    }, 300);
  };

  const getStatusBadge = (status: MaterialStatus) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"><Clock className="size-4" />Chờ duyệt</span>;
      case 'approved':
        return <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"><CheckCircle className="size-4" />Đã duyệt</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"><XCircle className="size-4" />Từ chối</span>;
    }
  };

  const getFileIcon = (type: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      docx: '📝',
      pptx: '📊',
      video: '🎥',
      audio: '🎵'
    };
    return icons[type] || '📁';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      pdf: 'bg-red-100 text-red-700 border-red-200',
      docx: 'bg-blue-100 text-blue-700 border-blue-200',
      pptx: 'bg-orange-100 text-orange-700 border-orange-200',
      video: 'bg-purple-100 text-purple-700 border-purple-200',
      audio: 'bg-pink-100 text-pink-700 border-pink-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Upload className="size-10" />
              <h1 className="text-3xl font-bold">Đóng góp tài liệu chung</h1>
            </div>
            <p className="text-purple-100 text-lg">
              Chia sẻ tài liệu chất lượng của bạn với cộng đồng giáo viên VSTEPRO
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <File className="size-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{allMaterials.length}</h3>
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

      {/* Main Tabs */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('study')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'study'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="size-5" />
            Tài liệu học tập
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              activeTab === 'study' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {studyMaterialsData.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('class')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'class'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Layers className="size-5" />
            Tài liệu lớp học
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              activeTab === 'class' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {textbookMaterialsData.length + mediaMaterialsData.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Clock className="size-5" />
            Lịch sử đóng góp
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              activeTab === 'history' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {allMaterials.length}
            </span>
          </button>
        </div>
      </div>

      {/* Class Material Sub-tabs (for textbook/media) */}
      {activeTab === 'class' && (
        <>
          {/* Show library view with data from classMaterialsData.ts */}
          <TeacherClassMaterialsView />
        </>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Skill Filter (only for study materials) */}
          {activeTab === 'study' && (
            <div>
              <select
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">Tất cả kỹ năng</option>
                <option value="Grammar">Grammar</option>
                <option value="Vocabulary">Vocabulary</option>
                <option value="Reading">Reading</option>
                <option value="Listening">Listening</option>
                <option value="Writing">Writing</option>
                <option value="Speaking">Speaking</option>
              </select>
            </div>
          )}

          {/* Course Filter */}
          <div>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Tất cả khóa học</option>
              {availableCourses.map(c => (
                <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter (only for history) */}
          {activeTab === 'history' && (
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Upload Button */}
      {activeTab !== 'history' && (
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold text-purple-600">{filteredMaterials.length}</span> tài liệu
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-lg"
          >
            <Plus className="size-5" />
            Đóng góp tài liệu mới
          </button>
        </div>
      )}

      {/* Materials Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMaterials.map((material) => (
          <div key={material.id} className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="text-4xl">
                {getFileIcon(material.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{material.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{material.description}</p>
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(material.status)}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor(material.type)}`}>
                    {getFileIcon(material.type)}
                    {material.type.toUpperCase()}
                  </span>
                  {'skill' in material && material.skill && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium border border-green-200">
                      {material.skill}
                    </span>
                  )}
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                    {material.course}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                    {material.size}
                  </span>
                  {'pages' in material && material.pages && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                      {material.pages} trang
                    </span>
                  )}
                  {'duration' in material && material.duration && (
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs">
                      ⏱️ {material.duration}
                    </span>
                  )}
                  {material.status === 'approved' && (
                    <>
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs">
                        <Download className="size-3" />
                        {material.downloads} lượt tải
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                        <Eye className="size-3" />
                        {material.views} lượt xem
                      </span>
                    </>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    {material.uploadDate}
                  </span>
                </div>

                {/* Reject Reason */}
                {material.status === 'rejected' && 'rejectReason' in material && material.rejectReason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Lý do từ chối:</strong> {material.rejectReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-16 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="size-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có tài liệu</h3>
          <p className="text-gray-600 mb-6">Bạn chưa đóng góp tài liệu nào hoặc không tìm thấy kết quả phù hợp</p>
          {activeTab !== 'history' && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Plus className="size-5" />
              Đóng góp tài liệu đầu tiên
            </button>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Đóng góp tài liệu {activeTab === 'study' ? 'học tập' : 'lớp học'}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="size-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-6">
              {/* Material Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Định dạng tệp <span className="text-red-500">*</span>
                </label>
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="pdf">📄 PDF</option>
                  <option value="docx">📝 DOCX (Word)</option>
                  <option value="pptx">📊 PPTX (PowerPoint)</option>
                  <option value="video">🎥 Video (MP4)</option>
                  <option value="audio">🎵 Audio (MP3/WAV)</option>
                </select>
              </div>

              {/* Material Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên tài liệu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  placeholder="VD: Giáo trình VSTEP Reading B2 - Complete Guide"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khóa học <span className="text-red-500">*</span>
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">-- Chọn khóa học --</option>
                  {availableCourses.map(c => (
                    <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Skill (only for study materials) */}
              {activeTab === 'study' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kỹ năng <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">-- Chọn kỹ năng --</option>
                    <option value="Grammar">Grammar</option>
                    <option value="Vocabulary">Vocabulary</option>
                    <option value="Reading">Reading</option>
                    <option value="Listening">Listening</option>
                    <option value="Writing">Writing</option>
                    <option value="Speaking">Speaking</option>
                  </select>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả tài liệu <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả chi tiết về nội dung, số lượng bài tập, thời lượng..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tệp tài liệu <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <Upload className="size-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium mb-1">Kéo thả tệp vào đây hoặc click để chọn</p>
                  <p className="text-sm text-gray-500">
                    Hỗ trợ: PDF, DOCX, PPTX, MP4, MP3 • Tối đa 500MB
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.pptx,.mp4,.mp3,.wav"
                    required
                  />
                  <button
                    type="button"
                    className="mt-4 px-6 py-2.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors font-medium"
                  >
                    Chọn tệp
                  </button>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Đang tải lên...</span>
                    <span className="text-sm font-bold text-blue-700">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Info Notice */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-900 mb-1">Lưu ý quan trọng</h4>
                    <ul className="text-sm text-purple-700 space-y-1 list-disc list-inside">
                      <li>Tài liệu phải là nội dung tự biên soạn hoặc có quyền chia sẻ</li>
                      <li>Không upload tài liệu vi phạm bản quyền</li>
                      <li>Admin sẽ xem xét trong vòng 24-48 giờ</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="size-5" />
                  {isUploading ? 'Đang gửi...' : 'Gửi tài liệu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}