import { useState } from 'react';
import { Search, Download, Book, Video, Layers, Edit, Trash2, Plus, Eye, Check, X, Clock, CheckCircle, XCircle, Upload, File, Library, UserPlus } from 'lucide-react';
import { TeacherClassMaterialContributionsTab } from './TeacherClassMaterialContributionsTab';
import { textbookMaterialsData, mediaMaterialsData, type Material, type ClassCategory, type MaterialStatus, type TextbookMaterial, type MediaMaterial } from '../../data/classMaterialsData';

// Types
type TabMode = 'library' | 'contributions';

export function AdminClassMaterialsTab() {
  const [classCategory, setClassCategory] = useState<ClassCategory>('textbook');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('VSTEP Complete');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [addModalCategory, setAddModalCategory] = useState<ClassCategory>('textbook');
  const [editModalCategory, setEditModalCategory] = useState<ClassCategory>('textbook');
  const [tabMode, setTabMode] = useState<TabMode>('library');

  // Get current materials based on category
  const currentMaterials = classCategory === 'textbook' ? textbookMaterialsData : mediaMaterialsData;

  // Filter materials
  const filteredClassMaterials = currentMaterials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = material.course === filterCourse;
    const matchesSkill = filterSkill === 'all' || 
                        (classCategory === 'media' && 'skill' in material && material.skill === filterSkill);
    const matchesStatus = filterStatus === 'all' || material.status === filterStatus;
    return matchesSearch && matchesCourse && matchesSkill && matchesStatus;
  });

  // Count materials by course
  const allMaterials = classCategory === 'textbook' ? textbookMaterialsData : mediaMaterialsData;
  const countByCourse = {
    'VSTEP Complete': allMaterials.filter(m => m.course === 'VSTEP Complete').length,
    'VSTEP Foundation': allMaterials.filter(m => m.course === 'VSTEP Foundation').length,
    'VSTEP Starter': allMaterials.filter(m => m.course === 'VSTEP Starter').length,
    'VSTEP Builder': allMaterials.filter(m => m.course === 'VSTEP Builder').length,
    'VSTEP Developer': allMaterials.filter(m => m.course === 'VSTEP Developer').length,
    'VSTEP Booster': allMaterials.filter(m => m.course === 'VSTEP Booster').length,
    'VSTEP Intensive': allMaterials.filter(m => m.course === 'VSTEP Intensive').length,
    'VSTEP Practice': allMaterials.filter(m => m.course === 'VSTEP Practice').length,
    'VSTEP Premium': allMaterials.filter(m => m.course === 'VSTEP Premium').length,
    'VSTEP Master': allMaterials.filter(m => m.course === 'VSTEP Master').length,
  };

  const getFileIcon = (type: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      docx: '📝',
      pptx: '📊',
      xlsx: '📗',
      video: '🎥',
      audio: '🎵',
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
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusBadge = (status: MaterialStatus) => {
    switch (status) {
      case 'approved':
        return <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs"><CheckCircle className="size-3" />Đã duyệt</span>;
      case 'pending':
        return <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"><Clock className="size-3" />Chờ duyệt</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs"><XCircle className="size-3" />Đã từ chối</span>;
    }
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setEditModalCategory(material.category);
    setShowEditModal(true);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    console.log('Deleting material:', deletingId);
    setShowDeleteConfirm(false);
    setDeletingId(null);
  };

  const handleApprove = (id: number) => {
    console.log('Approving material:', id);
  };

  const handleReject = (id: number) => {
    console.log('Rejecting material:', id);
  };

  // Stats
  const totalMaterials = currentMaterials.length;
  const pendingCount = currentMaterials.filter(m => m.status === 'pending').length;
  const approvedCount = currentMaterials.filter(m => m.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Main Tabs - Library vs Contributions */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setTabMode('library')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              tabMode === 'library'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Library className="size-5" />
            Thư viện tài liệu
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              tabMode === 'library' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {textbookMaterialsData.length + mediaMaterialsData.length}
            </span>
          </button>
          <button
            onClick={() => setTabMode('contributions')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              tabMode === 'contributions'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserPlus className="size-5" />
            Đóng góp từ GV
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              tabMode === 'contributions' ? 'bg-red-500 text-white' : 'bg-yellow-100 text-yellow-700'
            }`}>
              7
            </span>
          </button>
        </div>
      </div>

      {/* Conditional Content Based on Active Tab */}
      {tabMode === 'contributions' ? (
        <TeacherClassMaterialContributionsTab />
      ) : (
        <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Book className="size-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{textbookMaterialsData.length}</h3>
          <p className="text-sm text-gray-600">Giáo trình</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Video className="size-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{mediaMaterialsData.length}</h3>
          <p className="text-sm text-gray-600">Audio/Video</p>
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
        <div className="flex border-b-2 border-gray-200">
          <button
            onClick={() => {
              setClassCategory('textbook');
              setSearchTerm('');
              setFilterSkill('all');
              setFilterCourse('VSTEP Complete');
            }}
            className={`flex-1 px-6 py-4 font-medium transition-colors border-b-4 ${
              classCategory === 'textbook'
                ? 'border-blue-600 text-blue-600 bg-blue-50 -mb-0.5'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Book className="size-5" />
              <span>Giáo trình</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                classCategory === 'textbook' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {textbookMaterialsData.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => {
              setClassCategory('media');
              setSearchTerm('');
              setFilterSkill('all');
              setFilterCourse('VSTEP Complete');
            }}
            className={`flex-1 px-6 py-4 font-medium transition-colors border-b-4 ${
              classCategory === 'media'
                ? 'border-purple-600 text-purple-600 bg-purple-50 -mb-0.5'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Video className="size-5" />
              <span>Audio/Video</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                classCategory === 'media' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {mediaMaterialsData.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Course Tabs */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Lọc theo khóa học</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { name: 'VSTEP Complete', icon: '🎯' },
              { name: 'VSTEP Foundation', icon: '📚' },
              { name: 'VSTEP Starter', icon: '🚀' },
              { name: 'VSTEP Builder', icon: '🏗️' },
              { name: 'VSTEP Developer', icon: '💻' },
              { name: 'VSTEP Booster', icon: '⚡' },
              { name: 'VSTEP Intensive', icon: '🔥' },
              { name: 'VSTEP Practice', icon: '📝' },
              { name: 'VSTEP Premium', icon: '👑' },
              { name: 'VSTEP Master', icon: '🏆' },
            ].map((course) => (
              <button
                key={course.name}
                onClick={() => setFilterCourse(course.name)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  filterCourse === course.name
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div>{course.icon} {course.name}</div>
                <div className="text-xs opacity-80 mt-1">{countByCourse[course.name]} tài liệu</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Skill Filter - Only for media */}
          {classCategory === 'media' && (
            <div>
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
              </select>
            </div>
          )}

          {/* Status Filter */}
          <div>
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
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold text-red-600">{filteredClassMaterials.length}</span> tài liệu
        </p>
      </div>

      {/* Materials List */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="divide-y-2 divide-gray-200">
          {filteredClassMaterials.map((material) => (
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
                    
                    {material.course && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {material.course}
                      </span>
                    )}
                    
                    {material.category === 'media' && 'skill' in material && material.skill && (
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        {material.skill}
                      </span>
                    )}

                    {material.category === 'media' && 'duration' in material && (
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-pink-100 text-pink-700 border border-pink-200">
                        ⏱️ {material.duration}
                      </span>
                    )}

                    {material.category === 'textbook' && 'author' in material && material.author && (
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        👤 {material.author}
                      </span>
                    )}

                    <span className="px-2 py-1 rounded-md text-xs text-gray-600">
                      Tải lên bởi: {material.uploadedBy}
                    </span>

                    <span className="px-2 py-1 rounded-md text-xs text-gray-600">
                      {material.uploadedAt}
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
      {filteredClassMaterials.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border-2 border-gray-200">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Book className="size-12 text-gray-400" />
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
                <h2 className="text-2xl font-bold text-gray-900">Thêm tài liệu mới</h2>
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
                  onChange={(e) => setAddModalCategory(e.target.value as ClassCategory)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                >
                  <option value="textbook">📚 Giáo trình</option>
                  <option value="media">🎬 Audio/Video</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Định dạng file</label>
                  <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none">
                    <option value="">Chọn định dạng...</option>
                    {addModalCategory === 'textbook' ? (
                      <>
                        <option value="pdf">📄 PDF</option>
                        <option value="docx">📝 DOCX</option>
                        <option value="pptx">📊 PPTX</option>
                      </>
                    ) : (
                      <>
                        <option value="video">🎥 Video</option>
                        <option value="audio">🎵 Audio</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Khóa học</label>
                  <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none">
                    <option value="">Chọn khóa học...</option>
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
              </div>
              {addModalCategory === 'media' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
                  <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none">
                    <option value="">Chọn kỹ năng...</option>
                    <option value="Reading">📖 Reading</option>
                    <option value="Listening">👂 Listening</option>
                    <option value="Writing">✍️ Writing</option>
                    <option value="Speaking">🗣️ Speaking</option>
                  </select>
                </div>
              )}
              {addModalCategory === 'textbook' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tác giả</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      placeholder="Nhập tên tác giả..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số trang</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      placeholder="Số trang..."
                    />
                  </div>
                </div>
              )}
              {addModalCategory === 'media' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời lượng</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                    placeholder="Ví dụ: 2h 30m"
                  />
                </div>
              )}

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
                      <input 
                        type="file" 
                        className="hidden" 
                        accept={addModalCategory === 'textbook' ? '.pdf,.docx,.pptx' : 'video/*,audio/*'}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      {addModalCategory === 'textbook' 
                        ? 'Hỗ trợ: PDF, DOCX, PPTX - Tối đa 50MB'
                        : 'Hỗ trợ: MP4, MP3, WAV - Tối đa 500MB'
                      }
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  💡 Hoặc có thể nhập đường link URL trực tiếp:
                </div>
                <input
                  type="url"
                  className="mt-2 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                  placeholder={addModalCategory === 'textbook' 
                    ? 'https://drive.google.com/file/...'
                    : 'https://youtube.com/watch?v=... hoặc https://drive.google.com/...'
                  }
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
        </>
      )}
    </div>
  );
}