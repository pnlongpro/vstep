import { X, FileText, Download, Eye, Calendar, User, Tag, BookOpen, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface MaterialDetailModalProps {
  material: {
    id: string;
    name: string;
    type: 'pdf' | 'docx' | 'pptx' | 'xlsx';
    category: string;
    skill?: string;
    level?: string;
    size: string;
    uploadDate: string;
    views: number;
    downloads: number;
    description: string;
    author?: string;
    uploadedBy?: string;
    status?: 'approved' | 'pending' | 'rejected';
  };
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export function MaterialDetailModal({ material, onClose, onApprove, onReject }: MaterialDetailModalProps) {
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

  const getStatusBadge = () => {
    switch (material.status) {
      case 'approved':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg">
            <CheckCircle className="size-4" />
            Đã duyệt
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg">
            <Clock className="size-4" />
            Chờ duyệt
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg">
            <AlertCircle className="size-4" />
            Đã từ chối
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-14 h-14 rounded-xl border-2 ${getTypeColor(material.type)} flex items-center justify-center text-2xl`}>
                  {getFileIcon(material.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-1">{material.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded text-xs border ${getTypeColor(material.type)}`}>
                      {material.type.toUpperCase()}
                    </span>
                    {material.level && (
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                        {material.level}
                      </span>
                    )}
                    {material.skill && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        {material.skill}
                      </span>
                    )}
                    {getStatusBadge()}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">ID: {material.id}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors">
              <X className="size-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="flex items-center gap-2 mb-3">
              <FileText className="size-5 text-gray-700" />
              Mô tả tài liệu
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{material.description}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <User className="size-4" />
                <span className="text-xs font-medium">Tác giả</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{material.author || 'Không rõ'}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <User className="size-4" />
                <span className="text-xs font-medium">Upload bởi</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{material.uploadedBy || 'Admin'}</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <Calendar className="size-4" />
                <span className="text-xs font-medium">Ngày upload</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{material.uploadDate}</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-orange-700 mb-2">
                <Tag className="size-4" />
                <span className="text-xs font-medium">Danh mục</span>
              </div>
              <p className="text-sm font-medium text-gray-900 capitalize">{material.category}</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4">
            <h4 className="mb-3">📊 Thống kê sử dụng</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
                  <Eye className="size-4" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{material.views.toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-1">Lượt xem</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-green-600 mb-1">
                  <Download className="size-4" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{material.downloads.toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-1">Lượt tải</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-purple-600 mb-1">
                  <FileText className="size-4" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{material.size}</p>
                <p className="text-xs text-gray-600 mt-1">Kích thước</p>
              </div>
            </div>
          </div>

          {/* Preview Placeholder */}
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <FileText className="size-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-2">Xem trước tài liệu</p>
            <p className="text-xs text-gray-500">Chức năng preview sẽ được thêm trong phiên bản tiếp theo</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Đóng
            </button>
            <div className="flex gap-3">
              {material.status === 'pending' && onReject && (
                <button
                  onClick={onReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <X className="size-4" />
                  Từ chối
                </button>
              )}
              {material.status === 'pending' && onApprove && (
                <button
                  onClick={onApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="size-4" />
                  Duyệt tài liệu
                </button>
              )}
              {material.status === 'approved' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Download className="size-4" />
                  Tải xuống
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
