'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Search, Book, Video, Edit, Trash2, Plus, Eye, Check, X, 
  Clock, CheckCircle, XCircle, Upload, Library, UserPlus, RefreshCw
} from 'lucide-react';
import { 
  documentManagementApi, 
  LearningDocument, 
  DocumentFilter,
  DocumentStatus,
  DocumentStatistics,
  CreateDocumentData,
  UpdateDocumentData,
  DocumentCategory,
  DocumentType,
} from '@/services/admin.service';
import { mediaService } from '@/services/mediaService';
import { toast } from 'sonner';

type ClassCategory = 'textbook' | 'media';
type TabMode = 'library' | 'contributions';

// Form data interface
interface ClassMaterialFormData {
  title: string;
  description: string;
  category: DocumentCategory;
  level: string;
  type: DocumentType;
  visibility: 'public' | 'student' | 'teacher';
}

const initialFormData: ClassMaterialFormData = {
  title: '',
  description: '',
  category: 'general',
  level: 'B1',
  type: 'pdf',
  visibility: 'student',
};

export function AdminClassMaterialsTab() {
  const t = useTranslations('admin.documents');
  const tCommon = useTranslations('common');

  // State
  const [documents, setDocuments] = useState<LearningDocument[]>([]);
  const [statistics, setStatistics] = useState<DocumentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabMode, setTabMode] = useState<TabMode>('library');
  const [classCategory, setClassCategory] = useState<ClassCategory>('textbook');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<LearningDocument | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<LearningDocument | null>(null);

  // Form state
  const [formData, setFormData] = useState<ClassMaterialFormData>(initialFormData);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedMediaId, setUploadedMediaId] = useState<string | null>(null);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{ size?: string; mimeType?: string; fileName?: string } | null>(null);

  // Course options
  const courses = [
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
  ];

  // Fetch documents - filter by file type for class materials
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const filter: DocumentFilter = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        status: tabMode === 'contributions' ? 'pending' : (filterStatus !== 'all' ? filterStatus as DocumentStatus : undefined),
        sortOrder: 'DESC',
      };
      const result = await documentManagementApi.getDocuments(filter);
      // Filter by category type (textbook = pdf/doc, media = video/audio)
      const filtered = result.items.filter(item => {
        if (classCategory === 'textbook') {
          return ['pdf', 'doc', 'ppt'].includes(item.type);
        } else {
          return ['video', 'audio'].includes(item.type);
        }
      });
      setDocuments(filtered);
    } catch (err) {
      console.error('Error fetching documents:', err);
      toast.error(t('fetchError'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterStatus, classCategory, tabMode, t]);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      const stats = await documentManagementApi.getStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, classCategory, tabMode]);

  // Helper functions
  const getFileIcon = (type: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      doc: '📝',
      ppt: '📊',
      video: '🎥',
      audio: '🎵',
    };
    return icons[type] || '📁';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      pdf: 'bg-red-100 text-red-700 border-red-200',
      doc: 'bg-blue-100 text-blue-700 border-blue-200',
      ppt: 'bg-orange-100 text-orange-700 border-orange-200',
      video: 'bg-purple-100 text-purple-700 border-purple-200',
      audio: 'bg-pink-100 text-pink-700 border-pink-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'published':
        return <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs"><CheckCircle className="size-3" />{t('status.published')}</span>;
      case 'pending':
        return <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"><Clock className="size-3" />{t('status.pending')}</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs"><XCircle className="size-3" />{t('status.rejected')}</span>;
      default:
        return <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{t('status.draft')}</span>;
    }
  };

  // Actions
  const handleEdit = (material: LearningDocument) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description || '',
      category: material.category as DocumentCategory,
      level: material.level || 'B1',
      type: material.type as DocumentType,
      visibility: (material.visibility as 'public' | 'student' | 'teacher') || 'student',
    });
    setUploadedFileUrl(material.url || null);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await documentManagementApi.deleteDocument(deletingId);
      toast.success(t('deleteSuccess'));
      fetchDocuments();
      fetchStatistics();
    } catch {
      toast.error(t('deleteError'));
    } finally {
      setShowDeleteConfirm(false);
      setDeletingId(null);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await documentManagementApi.updateDocumentStatus(id, 'published');
      toast.success(t('statusUpdated'));
      fetchDocuments();
      fetchStatistics();
    } catch {
      toast.error(t('statusUpdateError'));
    }
  };

  const handleReject = async (id: string) => {
    try {
      await documentManagementApi.updateDocumentStatus(id, 'rejected');
      toast.success(t('statusUpdated'));
      fetchDocuments();
      fetchStatistics();
    } catch {
      toast.error(t('statusUpdateError'));
    }
  };

  const handleViewDetail = (material: LearningDocument) => {
    setSelectedMaterial(material);
    setShowDetailModal(true);
  };

  // Form handlers
  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedFile(null);
    setUploadedFileUrl(null);
    setUploadedMediaId(null);
    setUploadedFileInfo(null);
    setUploadProgress(0);
  };

  const handleCreateDocument = async () => {
    if (!formData.title.trim()) {
      toast.error(t('form.titleRequired'));
      return;
    }
    if (!uploadedFileUrl) {
      toast.error(t('form.fileRequired'));
      return;
    }

    setFormSubmitting(true);
    try {
      const createData: CreateDocumentData = {
        title: formData.title,
        description: formData.description || undefined,
        category: formData.category,
        level: formData.level || undefined,
        type: formData.type,
        url: uploadedFileUrl,
        mediaId: uploadedMediaId || undefined,
        fileName: uploadedFileInfo?.fileName,
        size: uploadedFileInfo?.size,
        mimeType: uploadedFileInfo?.mimeType,
        status: 'published',
        visibility: formData.visibility,
      };

      await documentManagementApi.createDocument(createData);
      toast.success(t('createSuccess'));
      setShowAddModal(false);
      resetForm();
      fetchDocuments();
      fetchStatistics();
    } catch (err) {
      console.error('Error creating document:', err);
      toast.error(t('createError'));
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdateDocument = async () => {
    if (!editingMaterial) return;
    if (!formData.title.trim()) {
      toast.error(t('form.titleRequired'));
      return;
    }

    setFormSubmitting(true);
    try {
      const updateData: UpdateDocumentData = {
        title: formData.title,
        description: formData.description || undefined,
        category: formData.category,
        level: formData.level || undefined,
        type: formData.type,
        visibility: formData.visibility,
      };

      if (uploadedFileUrl && uploadedFileUrl !== editingMaterial.url) {
        updateData.url = uploadedFileUrl;
        updateData.mediaId = uploadedMediaId || undefined;
        updateData.fileName = uploadedFileInfo?.fileName;
        updateData.size = uploadedFileInfo?.size;
        updateData.mimeType = uploadedFileInfo?.mimeType;
      }

      await documentManagementApi.updateDocument(editingMaterial.id, updateData);
      toast.success(t('updateSuccess'));
      setShowEditModal(false);
      setEditingMaterial(null);
      resetForm();
      fetchDocuments();
    } catch (err) {
      console.error('Error updating document:', err);
      toast.error(t('updateError'));
    } finally {
      setFormSubmitting(false);
    }
  };

  // File upload
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const category = classCategory === 'media' ? 'audio' : 'document';
      const result = await mediaService.upload({ file, category });
      clearInterval(progressInterval);
      
      if (result.success && result.data) {
        setUploadProgress(100);
        setUploadedFileUrl(result.data.url);
        setUploadedMediaId(result.data.id);
        setUploadedFileInfo({
          size: result.data.sizeHuman,
          mimeType: result.data.mimeType,
          fileName: result.data.originalName || file.name,
        });
        
        // Auto-detect file type from extension
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext) {
          const typeMap: Record<string, DocumentType> = {
            pdf: 'pdf',
            doc: 'doc',
            docx: 'doc',
            ppt: 'ppt',
            pptx: 'ppt',
            mp4: 'video',
            avi: 'video',
            mov: 'video',
            mp3: 'audio',
            wav: 'audio',
          };
          if (typeMap[ext]) {
            setFormData(prev => ({ ...prev, type: typeMap[ext] }));
          }
        }
        
        toast.success(t('form.uploadComplete'));
      } else {
        throw new Error('Upload failed');
      }
    } catch {
      toast.error(t('form.uploadFailed'));
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  // Stats
  const textbookCount = statistics?.byCategory?.find(c => ['pdf', 'doc', 'ppt'].includes(c.category))?.count || 
                        documents.filter(d => ['pdf', 'doc', 'ppt'].includes(d.type)).length;
  const mediaCount = statistics?.byCategory?.find(c => ['video', 'audio'].includes(c.category))?.count || 
                     documents.filter(d => ['video', 'audio'].includes(d.type)).length;
  const pendingCount = statistics?.pendingDocuments || documents.filter(d => d.status === 'pending').length;
  const approvedCount = statistics?.publishedDocuments || documents.filter(d => d.status === 'published').length;

  // Filter documents for display
  const filteredDocuments = documents.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = filterStatus === 'all' || material.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
            {t('tabs.library')}
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              tabMode === 'library' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {documents.length}
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
            {t('tabs.contributions')}
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              tabMode === 'contributions' ? 'bg-red-500 text-white' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {pendingCount}
            </span>
          </button>
        </div>
      </div>

      {tabMode === 'contributions' ? (
        // Teacher Contributions Tab - Shows pending documents
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12 bg-white rounded-xl border-2 border-gray-200">
              <RefreshCw className="size-8 animate-spin text-red-600" />
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-8 text-center">
              <UserPlus className="size-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('tabs.contributions')}</h3>
              <p className="text-gray-600">{t('noContributions')}</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
              <div className="p-4 bg-yellow-50 border-b border-yellow-200">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Clock className="size-5" />
                  <span className="font-medium">{t('pendingApproval')}: {documents.length} {t('materials')}</span>
                </div>
              </div>
              <div className="divide-y-2 divide-gray-200">
                {documents.map((material) => (
                  <div key={material.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl flex-shrink-0">
                        {getFileIcon(material.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{material.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{material.description}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor(material.type)}`}>
                            {material.type.toUpperCase()}
                          </span>
                          {material.uploadedBy && (
                            <span className="px-2 py-1 rounded-md text-xs text-gray-600">
                              {t('uploadedBy')}: {material.uploadedBy}
                            </span>
                          )}
                          <span className="px-2 py-1 rounded-md text-xs text-gray-600">
                            {new Date(material.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleApprove(material.id)}
                          className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          title={t('actions.approve')}
                        >
                          <Check className="size-4" />
                          {t('actions.approve')}
                        </button>
                        <button
                          onClick={() => handleReject(material.id)}
                          className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          title={t('actions.reject')}
                        >
                          <X className="size-4" />
                          {t('actions.reject')}
                        </button>
                        <button
                          onClick={() => handleViewDetail(material)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title={t('actions.view')}
                        >
                          <Eye className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{textbookCount}</h3>
              <p className="text-sm text-gray-600">{t('classCategories.textbook')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Video className="size-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{mediaCount}</h3>
              <p className="text-sm text-gray-600">{t('classCategories.media')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="size-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{pendingCount}</h3>
              <p className="text-sm text-gray-600">{t('status.pending')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="size-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{approvedCount}</h3>
              <p className="text-sm text-gray-600">{t('status.published')}</p>
            </div>
          </div>

          {/* Add Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Plus className="size-5" />
              {t('addNew')}
            </button>
          </div>

          {/* Category Tabs */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
            <div className="flex border-b-2 border-gray-200">
              <button
                onClick={() => {
                  setClassCategory('textbook');
                  setSearchTerm('');
                }}
                className={`flex-1 px-6 py-4 font-medium transition-colors border-b-4 ${
                  classCategory === 'textbook'
                    ? 'border-blue-600 text-blue-600 bg-blue-50 -mb-0.5'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Book className="size-5" />
                  <span>{t('classCategories.textbook')}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    classCategory === 'textbook' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {textbookCount}
                  </span>
                </div>
              </button>
              <button
                onClick={() => {
                  setClassCategory('media');
                  setSearchTerm('');
                }}
                className={`flex-1 px-6 py-4 font-medium transition-colors border-b-4 ${
                  classCategory === 'media'
                    ? 'border-purple-600 text-purple-600 bg-purple-50 -mb-0.5'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Video className="size-5" />
                  <span>{t('classCategories.media')}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    classCategory === 'media' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {mediaCount}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Course Tabs */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">{t('filterByCourse')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <button
                  onClick={() => setFilterCourse('all')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    filterCourse === 'all'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div>📋 {t('filter.all')}</div>
                </button>
                {courses.map((course) => (
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
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">{t('filter.allStatus')}</option>
                  <option value="published">{t('status.published')}</option>
                  <option value="pending">{t('status.pending')}</option>
                  <option value="rejected">{t('status.rejected')}</option>
                </select>
              </div>

              {/* Reset */}
              <div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                    setFilterCourse('all');
                  }}
                  className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  {t('filter.reset')}
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {t('found')} <span className="font-semibold text-red-600">{filteredDocuments.length}</span> {t('materials')}
            </p>
          </div>

          {/* Materials List */}
          {loading ? (
            <div className="flex items-center justify-center py-12 bg-white rounded-xl border-2 border-gray-200">
              <RefreshCw className="size-8 animate-spin text-red-600" />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
              <div className="divide-y-2 divide-gray-200">
                {filteredDocuments.map((material) => (
                  <div key={material.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="text-4xl flex-shrink-0">
                        {getFileIcon(material.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{material.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{material.description}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor(material.type)}`}>
                            {material.type.toUpperCase()}
                          </span>

                          {material.uploadedBy && (
                            <span className="px-2 py-1 rounded-md text-xs text-gray-600">
                              {t('uploadedBy')}: {material.uploadedBy}
                            </span>
                          )}

                          <span className="px-2 py-1 rounded-md text-xs text-gray-600">
                            {new Date(material.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>

                      {/* Stats & Actions */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        {/* Status */}
                        <div className="min-w-[100px]">
                          {getStatusBadge(material.status)}
                        </div>

                        {/* Downloads */}
                        <div className="text-center min-w-[80px]">
                          <div className="text-xs text-gray-500 mb-1">{t('stats.downloads')}</div>
                          <div className="text-sm font-medium text-gray-900">{material.downloads?.toLocaleString() || 0}</div>
                        </div>

                        {/* Views */}
                        <div className="text-center min-w-[80px]">
                          <div className="text-xs text-gray-500 mb-1">{t('stats.views')}</div>
                          <div className="text-sm font-medium text-gray-900">{material.views?.toLocaleString() || 0}</div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {material.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(material.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title={t('actions.approve')}
                              >
                                <Check className="size-4" />
                              </button>
                              <button
                                onClick={() => handleReject(material.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title={t('actions.reject')}
                              >
                                <X className="size-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleEdit(material)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={t('actions.edit')}
                          >
                            <Edit className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(material.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title={t('actions.delete')}
                          >
                            <Trash2 className="size-4" />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title={t('actions.view')}
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
          )}

          {/* Empty State */}
          {!loading && filteredDocuments.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border-2 border-gray-200">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="size-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('noDocuments')}</h3>
              <p className="text-gray-600">{t('noDocumentsDesc')}</p>
            </div>
          )}

          {/* Add Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">{t('addNew')}</h2>
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="size-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.title')} *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      placeholder={t('form.titlePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.description')}</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      placeholder={t('form.descriptionPlaceholder')}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.level')}</label>
                      <select 
                        value={formData.level}
                        onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      >
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.visibility')}</label>
                      <select 
                        value={formData.visibility}
                        onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as 'public' | 'student' | 'teacher' }))}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      >
                        <option value="public">{t('visibility.public')}</option>
                        <option value="student">{t('visibility.student')}</option>
                        <option value="teacher">{t('visibility.teacher')}</option>
                      </select>
                    </div>
                  </div>

                  {/* Upload File Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.uploadFile')} *</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept={classCategory === 'media' ? '.mp3,.mp4,.wav,.m4a,.webm' : '.pdf,.doc,.docx,.ppt,.pptx'}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                    
                    {!selectedFile ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-red-500 transition-colors cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="mb-3 p-4 bg-red-50 rounded-full">
                            <Upload className="size-8 text-red-600" />
                          </div>
                          <span className="text-red-600 hover:text-red-700 font-medium">
                            {t('form.clickToSelect')}
                          </span>
                          <span className="text-gray-600"> {t('form.orDragDrop')}</span>
                          <p className="text-xs text-gray-500 mt-2">
                            {classCategory === 'media' ? t('form.supportedMedia') : t('form.supportedFormats')}
                          </p>
                        </div>
                      </div>
                    ) : uploading ? (
                      <div className="border-2 border-blue-300 rounded-lg p-6 bg-blue-50">
                        <div className="flex items-center gap-3 mb-3">
                          <RefreshCw className="size-6 text-blue-600 animate-spin" />
                          <span className="font-medium text-blue-900">{selectedFile.name}</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-blue-600 mt-2">{t('form.uploading')} {uploadProgress}%</p>
                      </div>
                    ) : uploadedFileUrl ? (
                      <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="size-6 text-green-600" />
                          <span className="font-medium text-green-900">{selectedFile.name}</span>
                          <button
                            onClick={() => {
                              setSelectedFile(null);
                              setUploadedFileUrl(null);
                            }}
                            className="ml-auto p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {tCommon('cancel')}
                    </button>
                    <button
                      disabled={!uploadedFileUrl || !formData.title.trim() || formSubmitting}
                      onClick={handleCreateDocument}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {formSubmitting && <RefreshCw className="size-4 animate-spin" />}
                      {t('addNew')}
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
                    <h2 className="text-2xl font-bold text-gray-900">{t('actions.edit')}</h2>
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingMaterial(null);
                        resetForm();
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="size-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.title')} *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      placeholder={t('form.titlePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.description')}</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      placeholder={t('form.descriptionPlaceholder')}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.level')}</label>
                      <select 
                        value={formData.level}
                        onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      >
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.visibility')}</label>
                      <select 
                        value={formData.visibility}
                        onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as 'public' | 'student' | 'teacher' }))}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      >
                        <option value="public">{t('visibility.public')}</option>
                        <option value="student">{t('visibility.student')}</option>
                        <option value="teacher">{t('visibility.teacher')}</option>
                      </select>
                    </div>
                  </div>

                  {/* Current File Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.currentFile')}</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getFileIcon(editingMaterial.type)}</span>
                        <span className="text-sm text-gray-700">{editingMaterial.fileName || editingMaterial.url || 'No file'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingMaterial(null);
                        resetForm();
                      }}
                      className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {tCommon('cancel')}
                    </button>
                    <button
                      disabled={!formData.title.trim() || formSubmitting}
                      onClick={handleUpdateDocument}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {formSubmitting && <RefreshCw className="size-4 animate-spin" />}
                      {tCommon('save')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detail Modal */}
          {showDetailModal && selectedMaterial && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">{t('viewDetail')}</h2>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        setSelectedMaterial(null);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="size-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-5xl">{getFileIcon(selectedMaterial.type)}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedMaterial.title}</h3>
                      <p className="text-gray-600">{selectedMaterial.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 mb-1">{t('form.level')}</p>
                      <p className="font-semibold">{selectedMaterial.level || '-'}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">{t('filter.status')}</p>
                      <div>{getStatusBadge(selectedMaterial.status)}</div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        setSelectedMaterial(null);
                      }}
                      className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {tCommon('close')}
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('confirmDeleteTitle')}</h3>
                  <p className="text-gray-600 mb-6">{t('confirmDeleteDesc')}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletingId(null);
                      }}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {tCommon('cancel')}
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {t('actions.delete')}
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
