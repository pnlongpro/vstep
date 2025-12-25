import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, X, BookOpen, FileText, Headphones, PenTool, Mic, Book, Library, UserPlus, Clock, CheckCircle, Check, Upload, Target, XCircle } from 'lucide-react';
import { allStudyMaterials, type StudyMaterial, type StudyCategory } from '../teacher/studyMaterialsData';
import { TeacherStudyMaterialContributionsTab } from './TeacherStudyMaterialContributionsTab';

type MaterialStatus = 'pending' | 'approved' | 'rejected';

interface ExtendedStudyMaterial extends StudyMaterial {
  status?: MaterialStatus;
}

type TabMode = 'library' | 'contributions';

export function AdminStudyMaterialsTab() {
  const [activeTab, setActiveTab] = useState<TabMode>('library');
  const [studyCategory, setStudyCategory] = useState<StudyCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<ExtendedStudyMaterial | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addModalCategory, setAddModalCategory] = useState<StudyCategory>('grammar');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<ExtendedStudyMaterial | null>(null);

  // Add status to materials (mock data)
  const extendedMaterials: ExtendedStudyMaterial[] = allStudyMaterials.map((material, index) => ({
    ...material,
    status: (index % 5 === 0 ? 'pending' : index % 7 === 0 ? 'rejected' : 'approved') as MaterialStatus
  }));

  // Filter materials
  const filteredStudyMaterials = extendedMaterials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = studyCategory === 'all' || material.category === studyCategory;
    const matchesSkill = filterSkill === 'all' || material.skill === filterSkill;
    const matchesStatus = filterStatus === 'all' || material.status === filterStatus;
    return matchesSearch && matchesCategory && matchesSkill && matchesStatus;
  });

  // Count materials
  const studyMaterialCounts = {
    all: extendedMaterials.length,
    grammar: extendedMaterials.filter(m => m.category === 'grammar').length,
    vocabulary: extendedMaterials.filter(m => m.category === 'vocabulary').length,
    reading: extendedMaterials.filter(m => m.category === 'reading').length,
    writing: extendedMaterials.filter(m => m.category === 'writing').length,
    listening: extendedMaterials.filter(m => m.category === 'listening').length,
    speaking: extendedMaterials.filter(m => m.category === 'speaking').length,
  };

  const pendingCount = extendedMaterials.filter(m => m.status === 'pending').length;
  const approvedCount = extendedMaterials.filter(m => m.status === 'approved').length;

  const getFileIcon = (type: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      docx: '📝',
      pptx: '📊',
      xlsx: '📗',
    };
    return icons[type] || '📁';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      pdf: 'bg-red-100 text-red-700 border-red-200',
      docx: 'bg-blue-100 text-blue-700 border-blue-200',
      pptx: 'bg-orange-100 text-orange-700 border-orange-200',
      xlsx: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getCategoryLabel = (category: StudyCategory) => {
    const labels: Record<string, string> = {
      all: 'Tất cả',
      grammar: 'Ngữ pháp',
      vocabulary: 'Từ vựng',
      reading: 'Đọc hiểu',
      writing: 'Viết',
      listening: 'Nghe',
      speaking: 'Nói',
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category: StudyCategory) => {
    if (category === 'grammar') return <FileText className="size-5" />;
    if (category === 'vocabulary') return <Book className="size-5" />;
    if (category === 'reading') return <Book className="size-5" />;
    if (category === 'writing') return <PenTool className="size-5" />;
    if (category === 'listening') return <FileText className="size-5" />;
    if (category === 'speaking') return <FileText className="size-5" />;
    return <Target className="size-5" />;
  };

  const getCategoryColor = (category: StudyCategory, isActive: boolean) => {
    const colors: Record<string, string> = {
      all: isActive ? 'border-red-600 text-red-600 bg-red-50' : '',
      grammar: isActive ? 'border-blue-600 text-blue-600 bg-blue-50' : '',
      vocabulary: isActive ? 'border-green-600 text-green-600 bg-green-50' : '',
      reading: isActive ? 'border-purple-600 text-purple-600 bg-purple-50' : '',
      writing: isActive ? 'border-orange-600 text-orange-600 bg-orange-50' : '',
      listening: isActive ? 'border-yellow-600 text-yellow-600 bg-yellow-50' : '',
      speaking: isActive ? 'border-pink-600 text-pink-600 bg-pink-50' : '',
    };
    return isActive ? colors[category] : 'border-transparent text-gray-600 hover:bg-gray-50';
  };

  const getBadgeColor = (category: StudyCategory, isActive: boolean) => {
    const colors: Record<string, string> = {
      all: isActive ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700',
      grammar: isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700',
      vocabulary: isActive ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700',
      reading: isActive ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700',
      writing: isActive ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700',
      listening: isActive ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700',
      speaking: isActive ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-700',
    };
    return colors[category];
  };

  const getStatusBadge = (status?: MaterialStatus) => {
    switch (status) {
      case 'approved':
        return <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs"><CheckCircle className="size-3" />Đã duyệt</span>;
      case 'pending':
        return <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"><Clock className="size-3" />Chờ duyệt</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs"><XCircle className="size-3" />Đã từ chối</span>;
      default:
        return <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Không xác định</span>;
    }
  };

  const handleEdit = (material: ExtendedStudyMaterial) => {
    setEditingMaterial(material);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    console.log('Deleting material:', deletingId);
    setShowDeleteConfirm(false);
    setDeletingId(null);
  };

  const handleApprove = (id: string) => {
    console.log('Approving material:', id);
  };

  const handleReject = (id: string) => {
    console.log('Rejecting material:', id);
  };

  const handleViewDetail = (material: ExtendedStudyMaterial) => {
    setSelectedMaterial(material);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Main Tabs - Library vs Contributions */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'library'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Library className="size-5" />
            Thư viện tài liệu
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              activeTab === 'library' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {studyMaterialCounts.all}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('contributions')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'contributions'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserPlus className="size-5" />
            Đóng góp từ GV
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              activeTab === 'contributions' ? 'bg-red-500 text-white' : 'bg-yellow-100 text-yellow-700'
            }`}>
              7
            </span>
          </button>
        </div>
      </div>

      {/* Conditional Content Based on Active Tab */}
      {activeTab === 'contributions' ? (
        <TeacherStudyMaterialContributionsTab />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="size-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{studyMaterialCounts.grammar}</h3>
              <p className="text-sm text-gray-600">Ngữ pháp</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Book className="size-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{studyMaterialCounts.vocabulary}</h3>
              <p className="text-sm text-gray-600">Từ vựng</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Book className="size-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{studyMaterialCounts.reading}</h3>
              <p className="text-sm text-gray-600">Đọc hiểu</p>
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
          </div>

          {/* Add Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Plus className="size-5" />
              Thêm tài liệu mới
            </button>
          </div>

          {/* Category Tabs */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
            <div className="grid grid-cols-7 border-b-2 border-gray-200">
              {(['all', 'grammar', 'vocabulary', 'reading', 'writing', 'listening', 'speaking'] as StudyCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setStudyCategory(cat);
                    setSearchTerm('');
                    setFilterSkill('all');
                  }}
                  className={`px-4 py-4 font-medium transition-colors border-b-4 ${getCategoryColor(cat, studyCategory === cat)} -mb-0.5`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {getCategoryIcon(cat)}
                    <span className="text-sm">{getCategoryLabel(cat)}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getBadgeColor(cat, studyCategory === cat)}`}>
                      {cat === 'all' ? studyMaterialCounts.all : studyMaterialCounts[cat]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Bar */}
              <div className="relative md:col-span-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tài liệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Skill Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
                <select 
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="rejected">Đã từ chối</option>
                </select>
              </div>

              {/* Quick Reset */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterSkill('all');
                    setFilterStatus('all');
                  }}
                  className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold text-red-600">{filteredStudyMaterials.length}</span> tài liệu
            </p>
          </div>

          {/* Materials List */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
            <div className="divide-y-2 divide-gray-200">
              {filteredStudyMaterials.map((material) => (
                <div key={material.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="text-4xl flex-shrink-0">
                      {getFileIcon(material.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{material.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">{material.description}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor(material.type)}`}>
                          {material.type.toUpperCase()}
                        </span>
                        
                        {material.skill && (
                          <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                            {material.skill}
                          </span>
                        )}

                        {material.course && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {material.course}
                          </span>
                        )}

                        {material.author && (
                          <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                            👤 {material.author}
                          </span>
                        )}

                        <span className="px-2 py-1 rounded-md text-xs text-gray-600">
                          Tải lên bởi: {material.uploadedBy}
                        </span>

                        <span className="px-2 py-1 rounded-md text-xs text-gray-600">
                          {material.uploadDate}
                        </span>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {/* Status */}
                      <div className="min-w-[100px]">
                        {getStatusBadge(material.status)}
                      </div>

                      {/* Size */}
                      <div className="text-center min-w-[80px]">
                        <div className="text-xs text-gray-500 mb-1">Kích thước</div>
                        <div className="text-sm font-medium text-gray-900">{material.size}</div>
                      </div>

                      {/* Downloads */}
                      <div className="text-center min-w-[80px]">
                        <div className="text-xs text-gray-500 mb-1">Tải xuống</div>
                        <div className="text-sm font-medium text-gray-900">{material.downloads.toLocaleString()}</div>
                      </div>

                      {/* Views */}
                      <div className="text-center min-w-[80px]">
                        <div className="text-xs text-gray-500 mb-1">Lượt xem</div>
                        <div className="text-sm font-medium text-gray-900">{material.views.toLocaleString()}</div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {material.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(material.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Duyệt"
                            >
                              <Check className="size-4" />
                            </button>
                            <button
                              onClick={() => handleReject(material.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Từ chối"
                            >
                              <X className="size-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleEdit(material)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(material.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="size-4" />
                        </button>
                        <button
                          onClick={() => handleViewDetail(material)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {filteredStudyMaterials.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border-2 border-gray-200">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="size-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy tài liệu</h3>
              <p className="text-gray-600">
                Không tìm thấy tài liệu nào phù hợp với bộ lọc
              </p>
            </div>
          )}

          {/* Add Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Thêm tài liệu học tập mới</h2>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="size-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên tài liệu</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      placeholder="Nhập tên tài liệu..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      placeholder="Nhập mô tả..."
                    />
                  </div>
                  
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại tài liệu</label>
                    <select 
                      value={addModalCategory}
                      onChange={(e) => setAddModalCategory(e.target.value as StudyCategory)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                    >
                      <option value="grammar">📝 Ngữ pháp</option>
                      <option value="vocabulary">📚 Từ vựng</option>
                      <option value="reading">📖 Đọc hiểu</option>
                      <option value="writing">✍️ Viết</option>
                      <option value="listening">👂 Nghe</option>
                      <option value="speaking">🗣️ Nói</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Định dạng file</label>
                      <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none">
                        <option value="">Chọn định dạng...</option>
                        <option value="pdf">📄 PDF</option>
                        <option value="docx">📝 DOCX</option>
                        <option value="pptx">📊 PPTX</option>
                        <option value="xlsx">📗 XLSX</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
                      <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none">
                        <option value="">Chọn kỹ năng...</option>
                        <option value="Reading">📖 Reading</option>
                        <option value="Listening">👂 Listening</option>
                        <option value="Writing">✍️ Writing</option>
                        <option value="Speaking">🗣️ Speaking</option>
                        <option value="Grammar">📝 Grammar</option>
                        <option value="Vocabulary">📚 Vocabulary</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Khóa học</label>
                      <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none">
                        <option value="">Chọn khóa học...</option>
                        <option value="all">📚 Tất cả</option>
                        <option value="VSTEP Complete">🎯 VSTEP Complete</option>
                        <option value="VSTEP Foundation">📚 VSTEP Foundation</option>
                        <option value="VSTEP Starter">🚀 VSTEP Starter</option>
                        <option value="VSTEP Builder">🏗️ VSTEP Builder</option>
                        <option value="VSTEP Developer">💻 VSTEP Developer</option>
                        <option value="VSTEP Booster">⚡ VSTEP Booster</option>
                        <option value="VSTEP Intensive">🔥 VSTEP Intensive</option>
                        <option value="VSTEP Practice">📝 VSTEP Practice</option>
                        <option value="VSTEP Premium">👑 VSTEP Premium</option>
                        <option value="VSTEP Master">🏆 VSTEP Master</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tác giả</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                        placeholder="Nhập tên tác giả..."
                      />
                    </div>
                  </div>

                  {/* Upload File Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload tài liệu *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-red-500 transition-colors">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-3 p-4 bg-red-50 rounded-full">
                          <Upload className="size-8 text-red-600" />
                        </div>
                        <label className="cursor-pointer">
                          <span className="text-red-600 hover:text-red-700 font-medium">
                            Click để chọn file
                          </span>
                          <span className="text-gray-600"> hoặc kéo thả file vào đây</span>
                          <input type="file" className="hidden" accept=".pdf,.docx,.pptx,.xlsx" />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          Hỗ trợ: PDF, DOCX, PPTX, XLSX - Tối đa 50MB
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      💡 Hoặc có thể nhập đường link URL trực tiếp:
                    </div>
                    <input
                      type="url"
                      className="mt-2 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      placeholder="https://drive.google.com/file/..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => {
                        console.log('Adding material...');
                        setShowAddModal(false);
                      }}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Thêm tài liệu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && editingMaterial && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa tài liệu</h2>
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingMaterial(null);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="size-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên tài liệu</label>
                    <input
                      type="text"
                      defaultValue={editingMaterial.name}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                    <textarea
                      rows={3}
                      defaultValue={editingMaterial.description}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  {/* Current File Display */}
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
                    <label className="block text-sm font-medium text-blue-900 mb-3">📄 File hiện tại</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-blue-200">
                      <span className="text-2xl">{getFileIcon(editingMaterial.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{editingMaterial.name}.{editingMaterial.type}</p>
                        <p className="text-xs text-gray-500">{editingMaterial.size}</p>
                      </div>
                      <button
                        onClick={() => window.open(`https://example.com/files/${editingMaterial.id}.${editingMaterial.type}`, '_blank')}
                        className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Xem
                      </button>
                    </div>
                  </div>

                  {/* Upload New File Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thay đổi file tài liệu (tùy chọn)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-2 p-3 bg-blue-50 rounded-full">
                          <Upload className="size-6 text-blue-600" />
                        </div>
                        <label className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                            Click để chọn file mới
                          </span>
                          <span className="text-gray-600 text-sm"> hoặc kéo thả vào đây</span>
                          <input type="file" className="hidden" accept=".pdf,.docx,.pptx,.xlsx" />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, DOCX, PPTX, XLSX - Tối đa 50MB
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                        placeholder="Hoặc nhập URL: https://drive.google.com/file/..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <select 
                      defaultValue={editingMaterial.status}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                    >
                      <option value="approved">Đã duyệt</option>
                      <option value="pending">Chờ duyệt</option>
                      <option value="rejected">Đã từ chối</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingMaterial(null);
                      }}
                      className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => {
                        console.log('Saving changes...');
                        setShowEditModal(false);
                        setEditingMaterial(null);
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-md w-full p-6">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <Trash2 className="size-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
                  <p className="text-gray-600 mb-6">
                    Bạn có chắc chắn muốn xóa tài liệu này? Hành động này không thể hoàn tác.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletingId(null);
                      }}
                      className="flex-1 px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detail Modal */}
          {showDetailModal && selectedMaterial && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Chi tiết tài liệu</h3>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedMaterial(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="size-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Status */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Trạng thái</span>
                    {getStatusBadge(selectedMaterial.status)}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên tài liệu</label>
                    <p className="text-gray-900">{selectedMaterial.name}</p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                    <p className="text-gray-900">{selectedMaterial.description}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Loại file</label>
                      <span className={`inline-block px-3 py-1.5 rounded-md text-sm font-medium border ${getTypeColor(selectedMaterial.type)}`}>
                        {selectedMaterial.type.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kích thước</label>
                      <p className="text-gray-900">{selectedMaterial.size}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
                      <p className="text-gray-900">{selectedMaterial.skill || 'N/A'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Khóa học</label>
                      <p className="text-gray-900">{selectedMaterial.course || 'N/A'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tác giả</label>
                      <p className="text-gray-900">{selectedMaterial.author || 'N/A'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ngày tải lên</label>
                      <p className="text-gray-900">{selectedMaterial.uploadDate}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lượt xem</label>
                      <p className="text-gray-900">{selectedMaterial.views.toLocaleString()}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lượt tải</label>
                      <p className="text-gray-900">{selectedMaterial.downloads.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Uploaded By */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <label className="block text-sm font-medium text-blue-900 mb-2">Người tải lên</label>
                    <p className="text-sm text-blue-800">{selectedMaterial.uploadedBy}</p>
                  </div>

                  {/* File Preview/Download Section */}
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                    <label className="block text-sm font-medium text-green-900 mb-3">📄 Tài liệu</label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-green-200">
                        <span className="text-2xl">{getFileIcon(selectedMaterial.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{selectedMaterial.name}.{selectedMaterial.type}</p>
                          <p className="text-xs text-gray-500">{selectedMaterial.size}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <button
                        onClick={() => {
                          // Mock: Open file in new tab
                          window.open(`https://example.com/files/${selectedMaterial.id}.${selectedMaterial.type}`, '_blank');
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <Eye className="size-4" />
                        Xem tài liệu
                      </button>
                      <button
                        onClick={() => {
                          // Mock: Download file
                          alert(`Đang tải xuống: ${selectedMaterial.name}.${selectedMaterial.type}`);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        <Upload className="size-4 rotate-180" />
                        Tải xuống
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedMaterial.status === 'pending' && (
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          handleApprove(selectedMaterial.id);
                          setShowDetailModal(false);
                          setSelectedMaterial(null);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check className="size-5" />
                        Duyệt tài liệu
                      </button>
                      <button
                        onClick={() => {
                          handleReject(selectedMaterial.id);
                          setShowDetailModal(false);
                          setSelectedMaterial(null);
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
        </>
      )}
    </div>
  );
}