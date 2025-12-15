import { useState } from 'react';
import { FileText, Upload, Search, Filter, Download, Eye, Edit, Trash2, Folder, File, Plus, MoreVertical } from 'lucide-react';

interface Material {
  id: number;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'video' | 'audio';
  category: string;
  size: string;
  uploadDate: string;
  downloads: number;
  level: string;
}

export function MaterialsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const materials: Material[] = [
    {
      id: 1,
      name: 'VSTEP B1 Reading Practice Part 1',
      type: 'pdf',
      category: 'Reading',
      size: '2.5 MB',
      uploadDate: '2024-02-15',
      downloads: 145,
      level: 'B1'
    },
    {
      id: 2,
      name: 'Listening Comprehension Exercises',
      type: 'audio',
      category: 'Listening',
      size: '15.8 MB',
      uploadDate: '2024-02-10',
      downloads: 98,
      level: 'B2'
    },
    {
      id: 3,
      name: 'Writing Task 2 - Sample Essays',
      type: 'docx',
      category: 'Writing',
      size: '1.2 MB',
      uploadDate: '2024-02-05',
      downloads: 210,
      level: 'B1'
    },
    {
      id: 4,
      name: 'Speaking Part 3 - Video Examples',
      type: 'video',
      category: 'Speaking',
      size: '45.6 MB',
      uploadDate: '2024-01-28',
      downloads: 76,
      level: 'C1'
    },
    {
      id: 5,
      name: 'Grammar Review - Presentation',
      type: 'pptx',
      category: 'Grammar',
      size: '8.3 MB',
      uploadDate: '2024-01-20',
      downloads: 134,
      level: 'B2'
    },
    {
      id: 6,
      name: 'Vocabulary Builder - Advanced',
      type: 'pdf',
      category: 'Vocabulary',
      size: '3.1 MB',
      uploadDate: '2024-01-15',
      downloads: 189,
      level: 'C1'
    }
  ];

  const categories = ['all', 'Reading', 'Listening', 'Writing', 'Speaking', 'Grammar', 'Vocabulary'];

  const filteredMaterials = materials.filter(mat => {
    const matchesSearch = mat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || mat.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
      pdf: 'bg-red-100 text-red-700',
      docx: 'bg-blue-100 text-blue-700',
      pptx: 'bg-orange-100 text-orange-700',
      video: 'bg-purple-100 text-purple-700',
      audio: 'bg-green-100 text-green-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const stats = [
    { label: 'Tổng tài liệu', value: '156' },
    { label: 'Tải lên tháng này', value: '24' },
    { label: 'Lượt tải xuống', value: '2,345' },
    { label: 'Dung lượng', value: '2.8 GB' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
            <h3 className="text-2xl">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  filterCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>

          {/* Upload Button */}
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors w-full lg:w-auto justify-center"
          >
            <Upload className="size-5" />
            <span>Tải lên</span>
          </button>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <div key={material.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Preview */}
            <div className="h-32 bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
              <div className="text-6xl">{getFileIcon(material.type)}</div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm mb-2 line-clamp-2">{material.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${getTypeColor(material.type)}`}>
                      {material.type.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                      {material.level}
                    </span>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <MoreVertical className="size-4 text-gray-400" />
                </button>
              </div>

              <div className="text-xs text-gray-600 space-y-1 mb-4">
                <p>Kích thước: {material.size}</p>
                <p>Lượt tải: {material.downloads}</p>
                <p>Ngày tải lên: {material.uploadDate}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-sm">
                  <Eye className="size-4" />
                  Xem
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                  <Download className="size-4" />
                  Tải
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="size-12 text-gray-400" />
          </div>
          <h3 className="text-xl text-gray-900 mb-2">Không tìm thấy tài liệu</h3>
          <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl">Tải lên tài liệu mới</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Drag and Drop Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                <Upload className="size-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 mb-2">Kéo thả file vào đây hoặc click để chọn</p>
                <p className="text-sm text-gray-500">Hỗ trợ: PDF, DOCX, PPTX, Video, Audio (Tối đa 100MB)</p>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Tên tài liệu</label>
                <input
                  type="text"
                  placeholder="Nhập tên tài liệu"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Danh mục</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Reading</option>
                    <option>Listening</option>
                    <option>Writing</option>
                    <option>Speaking</option>
                    <option>Grammar</option>
                    <option>Vocabulary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Trình độ</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>A2</option>
                    <option>B1</option>
                    <option>B2</option>
                    <option>C1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Mô tả</label>
                <textarea
                  rows={3}
                  placeholder="Nhập mô tả tài liệu"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Tải lên
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
