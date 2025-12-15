import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, FileText, Download, Upload, X, Check, Clock, CheckCircle, XCircle, Filter, Book, Headphones, PenTool, Mic, BookOpen, Globe, Users, User as UserIcon } from 'lucide-react';

type DocumentStatus = 'published' | 'pending' | 'rejected' | 'draft';
type DocumentVisibility = 'public' | 'student' | 'teacher';
type DocumentCategory = 'reading' | 'listening' | 'writing' | 'speaking' | 'grammar' | 'vocabulary' | 'general';

interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  level: string;
  type: 'pdf' | 'doc' | 'video' | 'audio' | 'ppt';
  size: string;
  uploadedBy: string;
  uploadDate: string;
  status: DocumentStatus;
  visibility: DocumentVisibility;
  downloads: number;
  views: number;
  description: string;
}

export function DocumentsManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVisibility, setFilterVisibility] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data
  const documents: Document[] = [
    {
      id: 'DOC001',
      title: 'VSTEP Reading Strategies - Complete Guide',
      category: 'reading',
      level: 'B2',
      type: 'pdf',
      size: '2.5 MB',
      uploadedBy: 'TS. Nguyễn Văn A',
      uploadDate: '2024-12-10',
      status: 'published',
      visibility: 'public',
      downloads: 245,
      views: 512,
      description: 'Hướng dẫn chi tiết về các chiến lược làm bài Reading VSTEP'
    },
    {
      id: 'DOC002',
      title: 'English Grammar in Use - Advanced',
      category: 'grammar',
      level: 'C1',
      type: 'pdf',
      size: '15.3 MB',
      uploadedBy: 'ThS. Trần Thị B',
      uploadDate: '2024-12-09',
      status: 'published',
      visibility: 'student',
      downloads: 189,
      views: 401,
      description: 'Sách ngữ pháp tiếng Anh nâng cao với bài tập'
    },
    {
      id: 'DOC003',
      title: 'VSTEP Listening Practice Audio Files',
      category: 'listening',
      level: 'B1',
      type: 'audio',
      size: '45.2 MB',
      uploadedBy: 'GV. Lê Văn C',
      uploadDate: '2024-12-08',
      status: 'pending',
      visibility: 'public',
      downloads: 0,
      views: 23,
      description: 'Bộ file audio luyện tập listening cho VSTEP B1'
    },
    {
      id: 'DOC004',
      title: 'Writing Task 2 Sample Essays',
      category: 'writing',
      level: 'B2',
      type: 'doc',
      size: '1.2 MB',
      uploadedBy: 'ThS. Phạm Thị D',
      uploadDate: '2024-12-07',
      status: 'published',
      visibility: 'student',
      downloads: 312,
      views: 678,
      description: 'Tuyển tập bài mẫu Writing Task 2 đạt điểm cao'
    },
    {
      id: 'DOC005',
      title: 'Speaking Part 3 Discussion Topics',
      category: 'speaking',
      level: 'B2',
      type: 'ppt',
      size: '8.7 MB',
      uploadedBy: 'TS. Hoàng Văn E',
      uploadDate: '2024-12-06',
      status: 'draft',
      visibility: 'teacher',
      downloads: 45,
      views: 89,
      description: 'PowerPoint các chủ đề thảo luận Speaking Part 3'
    },
    {
      id: 'DOC006',
      title: 'Essential Vocabulary for VSTEP',
      category: 'vocabulary',
      level: 'B1',
      type: 'pdf',
      size: '3.4 MB',
      uploadedBy: 'GV. Nguyễn Thị F',
      uploadDate: '2024-12-05',
      status: 'published',
      visibility: 'public',
      downloads: 567,
      views: 1024,
      description: '1000+ từ vựng thiết yếu cho VSTEP theo chủ đề'
    },
    {
      id: 'DOC007',
      title: 'VSTEP Video Tutorial Series',
      category: 'general',
      level: 'B2',
      type: 'video',
      size: '250 MB',
      uploadedBy: 'TS. Lê Thị G',
      uploadDate: '2024-12-04',
      status: 'rejected',
      visibility: 'public',
      downloads: 0,
      views: 12,
      description: 'Series video hướng dẫn làm bài VSTEP (bị từ chối vì dung lượng lớn)'
    },
  ];

  // Stats
  const stats = [
    { 
      title: 'Tổng tài liệu', 
      value: documents.length.toString(), 
      icon: FileText, 
      color: 'from-blue-500 to-blue-600',
      subtext: 'documents'
    },
    { 
      title: 'Đã duyệt', 
      value: documents.filter(d => d.status === 'published').length.toString(), 
      icon: CheckCircle, 
      color: 'from-green-500 to-green-600',
      subtext: 'published'
    },
    { 
      title: 'Chờ duyệt', 
      value: documents.filter(d => d.status === 'pending').length.toString(), 
      icon: Clock, 
      color: 'from-orange-500 to-orange-600',
      subtext: 'pending'
    },
    { 
      title: 'Tổng lượt tải', 
      value: documents.reduce((sum, d) => sum + d.downloads, 0).toString(), 
      icon: Download, 
      color: 'from-purple-500 to-purple-600',
      subtext: 'downloads'
    },
  ];

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesVisibility = filterVisibility === 'all' || doc.visibility === filterVisibility;
    return matchesSearch && matchesCategory && matchesStatus && matchesVisibility;
  });

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Category config
  const categories = [
    { id: 'reading', name: 'Reading', icon: Book, color: 'text-blue-600' },
    { id: 'listening', name: 'Listening', icon: Headphones, color: 'text-emerald-600' },
    { id: 'writing', name: 'Writing', icon: PenTool, color: 'text-violet-600' },
    { id: 'speaking', name: 'Speaking', icon: Mic, color: 'text-amber-600' },
    { id: 'grammar', name: 'Grammar', icon: BookOpen, color: 'text-rose-600' },
    { id: 'vocabulary', name: 'Vocabulary', icon: BookOpen, color: 'text-indigo-600' },
    { id: 'general', name: 'General', icon: Globe, color: 'text-gray-600' },
  ];

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">✅ Đã duyệt</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">⏳ Chờ duyệt</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">❌ Từ chối</span>;
      case 'draft':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">📝 Nháp</span>;
    }
  };

  const getVisibilityBadge = (visibility: DocumentVisibility) => {
    switch (visibility) {
      case 'public':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 flex items-center gap-1"><Globe className="size-3" /> Public</span>;
      case 'student':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 flex items-center gap-1"><Users className="size-3" /> Students</span>;
      case 'teacher':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700 flex items-center gap-1"><UserIcon className="size-3" /> Teachers</span>;
    }
  };

  const getCategoryIcon = (category: DocumentCategory) => {
    const cat = categories.find(c => c.id === category);
    if (!cat) return null;
    const Icon = cat.icon;
    return <Icon className={`size-4 ${cat.color}`} />;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'doc':
        return '📝';
      case 'video':
        return '🎥';
      case 'audio':
        return '🎵';
      case 'ppt':
        return '📊';
      default:
        return '📁';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Quản lý tài liệu học tập</h2>
          <p className="text-sm text-gray-600 mt-1">Quản lý, duyệt và phân phối tài liệu học tập</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="size-4" />
          Tải tài liệu lên
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-3">
                <Icon className="size-10 opacity-80" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm opacity-90">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã duyệt</option>
            <option value="pending">Chờ duyệt</option>
            <option value="rejected">Từ chối</option>
            <option value="draft">Nháp</option>
          </select>

          {/* Visibility Filter */}
          <select
            value={filterVisibility}
            onChange={(e) => setFilterVisibility(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả phạm vi</option>
            <option value="public">Public</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Mã</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tài liệu</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Danh mục</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Loại</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Kích thước</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tải lên bởi</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Lượt tải</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Phạm vi</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Trạng thái</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDocs.length > 0 ? (
                paginatedDocs.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-gray-700">{doc.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getFileIcon(doc.type)}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                          <p className="text-xs text-gray-500">{doc.uploadDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(doc.category)}
                        <span className="text-sm text-gray-700 capitalize">{doc.category}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 uppercase">
                        {doc.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{doc.size}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{doc.uploadedBy}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-700">↓ {doc.downloads}</span>
                        <span className="text-xs text-gray-500">👁 {doc.views}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getVisibilityBadge(doc.visibility)}</td>
                    <td className="py-3 px-4">{getStatusBadge(doc.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setSelectedDoc(doc)}
                          className="p-1.5 hover:bg-gray-200 rounded" 
                          title="Xem chi tiết"
                        >
                          <Eye className="size-4 text-gray-600" />
                        </button>
                        {doc.status === 'pending' && (
                          <>
                            <button 
                              className="p-1.5 hover:bg-gray-200 rounded" 
                              title="Duyệt"
                              onClick={() => alert(`Đã duyệt tài liệu "${doc.title}"`)}
                            >
                              <Check className="size-4 text-green-600" />
                            </button>
                            <button 
                              className="p-1.5 hover:bg-gray-200 rounded" 
                              title="Từ chối"
                              onClick={() => alert(`Đã từ chối tài liệu "${doc.title}"`)}
                            >
                              <XCircle className="size-4 text-red-600" />
                            </button>
                          </>
                        )}
                        <button className="p-1.5 hover:bg-gray-200 rounded" title="Chỉnh sửa">
                          <Edit className="size-4 text-blue-600" />
                        </button>
                        <button 
                          className="p-1.5 hover:bg-gray-200 rounded" 
                          title="Xóa"
                          onClick={() => {
                            if (confirm(`Xóa tài liệu "${doc.title}"?`)) {
                              alert('Đã xóa tài liệu!');
                            }
                          }}
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-200 rounded" title="Tải xuống">
                          <Download className="size-4 text-green-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-gray-500">
                    <FileText className="size-12 mx-auto mb-2 text-gray-300" />
                    <p>Không tìm thấy tài liệu nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredDocs.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, filteredDocs.length)} trong tổng số {filteredDocs.length} tài liệu
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Trước
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadDocumentModal onClose={() => setShowUploadModal(false)} />
      )}

      {/* Document Detail Modal */}
      {selectedDoc && (
        <DocumentDetailModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
      )}
    </div>
  );
}

// Upload Document Modal
function UploadDocumentModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold">Tải tài liệu mới lên</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload file *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 cursor-pointer transition-colors">
              <Upload className="size-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">Kéo thả file hoặc click để chọn</p>
              <p className="text-xs text-gray-500">PDF, DOC, PPT, MP3, MP4 (tối đa 100MB)</p>
            </div>
          </div>

          {/* Document Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Tên tài liệu *</label>
              <input
                type="text"
                placeholder="VD: VSTEP Reading Strategies"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Danh mục *</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Chọn danh mục</option>
                <option value="reading">Reading</option>
                <option value="listening">Listening</option>
                <option value="writing">Writing</option>
                <option value="speaking">Speaking</option>
                <option value="grammar">Grammar</option>
                <option value="vocabulary">Vocabulary</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cấp độ *</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Chọn cấp độ</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="all">Tất cả</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Mô tả</label>
              <textarea
                rows={3}
                placeholder="Mô tả ngắn về tài liệu..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phạm vi hiển thị *</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="public">Public (Tất cả)</option>
                <option value="student">Students only</option>
                <option value="teacher">Teachers only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái *</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="draft">Lưu nháp</option>
                <option value="pending">Gửi duyệt</option>
                <option value="published">Xuất bản ngay</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button 
              onClick={() => {
                alert('Đã tải tài liệu lên!');
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload className="size-4" />
              Tải lên
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Document Detail Modal
function DocumentDetailModal({ doc, onClose }: { doc: Document; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full lg:w-[600px] bg-white z-50 overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold">Chi tiết tài liệu</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Document Header */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{getFileIcon(doc.type)}</span>
                <div>
                  <h2 className="text-xl font-semibold mb-1">{doc.title}</h2>
                  <p className="text-sm opacity-90">{doc.id}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="opacity-75 mb-1">Kích thước</p>
                <p className="font-semibold">{doc.size}</p>
              </div>
              <div>
                <p className="opacity-75 mb-1">Loại file</p>
                <p className="font-semibold uppercase">{doc.type}</p>
              </div>
              <div>
                <p className="opacity-75 mb-1">Lượt tải</p>
                <p className="font-semibold">↓ {doc.downloads}</p>
              </div>
              <div>
                <p className="opacity-75 mb-1">Lượt xem</p>
                <p className="font-semibold">👁 {doc.views}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Danh mục</p>
                <p className="font-medium capitalize">{doc.category}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Cấp độ</p>
                <p className="font-medium">{doc.level}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Tải lên bởi</p>
                <p className="font-medium">{doc.uploadedBy}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Ngày tải lên</p>
                <p className="font-medium">{doc.uploadDate}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Phạm vi</p>
                <div className="mt-1">{getVisibilityBadge(doc.visibility)}</div>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Trạng thái</p>
                <div className="mt-1">{getStatusBadge(doc.status)}</div>
              </div>
            </div>
            <div>
              <p className="text-gray-600 mb-1 text-sm">Mô tả</p>
              <p className="text-sm">{doc.description}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {doc.status === 'pending' && (
              <>
                <button 
                  onClick={() => {
                    alert(`Đã duyệt tài liệu "${doc.title}"`);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  <Check className="size-4" />
                  Duyệt tài liệu
                </button>
                <button 
                  onClick={() => {
                    const reason = prompt('Lý do từ chối:');
                    if (reason) {
                      alert(`Đã từ chối tài liệu "${doc.title}". Lý do: ${reason}`);
                      onClose();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  <XCircle className="size-4" />
                  Từ chối
                </button>
              </>
            )}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              <Download className="size-4" />
              Tải xuống
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">
              <Edit className="size-4" />
              Chỉnh sửa
            </button>
            <button 
              onClick={() => {
                if (confirm(`Xóa tài liệu "${doc.title}"?`)) {
                  alert('Đã xóa tài liệu!');
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-medium"
            >
              <Trash2 className="size-4" />
              Xóa tài liệu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function getFileIcon(type: string) {
  switch (type) {
    case 'pdf': return '📄';
    case 'doc': return '📝';
    case 'video': return '🎥';
    case 'audio': return '🎵';
    case 'ppt': return '📊';
    default: return '📁';
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'published':
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">✅ Đã duyệt</span>;
    case 'pending':
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">⏳ Chờ duyệt</span>;
    case 'rejected':
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">❌ Từ chối</span>;
    case 'draft':
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">📝 Nháp</span>;
    default:
      return null;
  }
}

function getVisibilityBadge(visibility: string) {
  switch (visibility) {
    case 'public':
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 flex items-center gap-1 w-fit"><Globe className="size-3" /> Public</span>;
    case 'student':
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 flex items-center gap-1 w-fit"><Users className="size-3" /> Students</span>;
    case 'teacher':
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700 flex items-center gap-1 w-fit"><UserIcon className="size-3" /> Teachers</span>;
    default:
      return null;
  }
}
