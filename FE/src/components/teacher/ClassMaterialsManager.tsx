// Teacher Class Materials Manager - PURPLE theme with API integration
'use client';

import { useState, useRef } from 'react';
import { 
  Upload, FileText, Download, Trash2, Loader2, 
  File, FileImage, FileVideo, FileAudio, AlertCircle,
  Search
} from 'lucide-react';
import { useClassMaterials, useUploadMaterial, useDeleteMaterial } from '@/hooks/useClasses';
import { useApiError } from '@/hooks/useApiError';
import { toast } from 'sonner';
import type { ClassMaterial } from '@/types/class.types';

interface ClassMaterialsManagerProps {
  classId: string;
  className: string;
}

export function ClassMaterialsManager({ classId, className }: ClassMaterialsManagerProps) {
  const { handleError } = useApiError();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<ClassMaterial | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { data: materialsData, isLoading } = useClassMaterials(classId);
  const uploadMutation = useUploadMaterial();
  const deleteMutation = useDeleteMaterial();

  const materials = materialsData?.data || [];

  // Filter materials by search
  const filteredMaterials = materials.filter((m: ClassMaterial) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage className="size-5 text-blue-500" />;
    if (fileType.startsWith('video/')) return <FileVideo className="size-5 text-purple-500" />;
    if (fileType.startsWith('audio/')) return <FileAudio className="size-5 text-green-500" />;
    if (fileType.includes('pdf')) return <FileText className="size-5 text-red-500" />;
    return <File className="size-5 text-gray-500" />;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, '')); // Remove extension for title
      setShowUploadModal(true);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile || !uploadTitle.trim()) {
      toast.error('Vui lòng nhập tiêu đề tài liệu');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', uploadTitle.trim());
      if (uploadDescription.trim()) {
        formData.append('description', uploadDescription.trim());
      }

      await uploadMutation.mutateAsync({ classId, formData });
      toast.success('Đã tải lên tài liệu thành công');
      resetUploadForm();
    } catch (err) {
      handleError(err);
    }
  };

  // Reset upload form
  const resetUploadForm = () => {
    setSelectedFile(null);
    setUploadTitle('');
    setUploadDescription('');
    setShowUploadModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!materialToDelete) return;

    try {
      await deleteMutation.mutateAsync({ classId, materialId: materialToDelete.id });
      toast.success('Đã xóa tài liệu');
      setShowDeleteModal(false);
      setMaterialToDelete(null);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Tài liệu lớp học</h3>
          <p className="text-sm text-gray-500">Quản lý tài liệu và bài giảng cho lớp {className}</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Upload className="size-4" />
          Tải lên tài liệu
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp3,.mp4,.zip"
          title="Chọn file tài liệu"
          aria-label="Chọn file tài liệu"
        />
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tài liệu..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Materials List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Đang tải tài liệu...</span>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="size-12 mx-auto mb-4 text-gray-300" />
          {searchQuery ? (
            <>
              <p>Không tìm thấy tài liệu phù hợp</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-purple-600 hover:underline mt-2"
              >
                Xóa bộ lọc
              </button>
            </>
          ) : (
            <>
              <p>Chưa có tài liệu nào</p>
              <p className="text-sm mt-1">Tải lên tài liệu đầu tiên cho lớp học</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMaterials.map((material: ClassMaterial) => (
            <div
              key={material.id}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
            >
              {/* Icon */}
              <div className="p-3 bg-gray-100 rounded-lg">
                {getFileIcon(material.fileType)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{material.title}</h4>
                {material.description && (
                  <p className="text-sm text-gray-600 truncate">{material.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  <span>{formatFileSize(material.fileSize)}</span>
                  <span>•</span>
                  <span>{new Date(material.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                  title="Tải xuống"
                >
                  <Download className="size-5 text-purple-600" />
                </a>
                <button
                  onClick={() => {
                    setMaterialToDelete(material);
                    setShowDeleteModal(true);
                  }}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  title="Xóa tài liệu"
                >
                  <Trash2 className="size-5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && selectedFile && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={resetUploadForm} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Tải lên tài liệu</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* File info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getFileIcon(selectedFile.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập tiêu đề tài liệu"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Mô tả ngắn về tài liệu"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={resetUploadForm}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadTitle.trim() || uploadMutation.isPending}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Đang tải lên...
                  </>
                ) : (
                  <>
                    <Upload className="size-4" />
                    Tải lên
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && materialToDelete && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowDeleteModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="size-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Xác nhận xóa tài liệu</h3>
                <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Bạn có chắc chắn muốn xóa tài liệu <strong>{materialToDelete.title}</strong>?
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setMaterialToDelete(null);
                }}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  'Xóa tài liệu'
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
