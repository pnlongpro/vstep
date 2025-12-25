import { useState } from 'react';
import { X, Search, FileText, List, BookOpen, Plus, Star, Headphones, PenTool, Mic, BookOpen as Reading, Upload, Link as LinkIcon, Download } from 'lucide-react';
import { allLibraryItems, searchLibraryItems, type LibraryItem } from '../../data/teacherLibraryData';

type SkillType = 'reading' | 'listening' | 'writing' | 'speaking';
type ModalTab = 'assignment' | 'part' | 'exam' | 'upload';

interface AdminAddAssignmentModalProps {
  isOpen: boolean;
  sessionId: string;
  onClose: () => void;
  onSelect: (item: LibraryItem | { type: 'file'; name: string; url: string }) => void;
}

export function AdminAddAssignmentModal({ isOpen, sessionId, onClose, onSelect }: AdminAddAssignmentModalProps) {
  const [currentTab, setCurrentTab] = useState<ModalTab>('assignment');
  const [searchTerm, setSearchTerm] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const getSkillIcon = (skill: SkillType) => {
    switch (skill) {
      case 'reading': return Reading;
      case 'listening': return Headphones;
      case 'writing': return PenTool;
      case 'speaking': return Mic;
    }
  };

  const getSkillColor = (skill: SkillType) => {
    switch (skill) {
      case 'reading': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'listening': return 'bg-green-100 text-green-700 border-green-200';
      case 'writing': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'speaking': return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  const filteredItems = searchLibraryItems(searchTerm, currentTab === 'upload' ? 'assignment' : currentTab, undefined, undefined);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      // Simulate upload
      alert(`File "${file.name}" đã được chọn. Trong hệ thống thực tế, file sẽ được upload lên server.`);
      onSelect({ type: 'file', name: file.name, url: URL.createObjectURL(file) });
      onClose();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText.startsWith('http://') || pastedText.startsWith('https://')) {
      setFileUrl(pastedText);
    }
  };

  const handleFileUrlSubmit = () => {
    if (fileUrl.trim()) {
      onSelect({ type: 'file', name: fileUrl.split('/').pop() || 'File từ link', url: fileUrl });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">➕ Thêm bài tập vào buổi học</h3>
            <p className="text-sm text-gray-600 mt-1">Chọn từ thư viện hoặc upload file mới</p>
          </div>
          <button
            onClick={() => {
              onClose();
              setSearchTerm('');
              setFileUrl('');
              setCurrentTab('assignment');
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="size-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col p-6">
          {/* Tabs */}
          <div className="flex gap-2 border-b-2 border-gray-200 pb-3 mb-4">
            <button
              onClick={() => setCurrentTab('assignment')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition-all ${
                currentTab === 'assignment'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="size-5" />
              Bài tập đơn
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                currentTab === 'assignment' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'
              }`}>
                {allLibraryItems.filter(i => i.type === 'assignment').length}
              </span>
            </button>
            <button
              onClick={() => setCurrentTab('part')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition-all ${
                currentTab === 'part'
                  ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="size-5" />
              Parts kỹ năng
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                currentTab === 'part' ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-700'
              }`}>
                {allLibraryItems.filter(i => i.type === 'part').length}
              </span>
            </button>
            <button
              onClick={() => setCurrentTab('exam')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition-all ${
                currentTab === 'exam'
                  ? 'bg-emerald-100 text-emerald-700 border-b-2 border-emerald-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="size-5" />
              Bộ đề 4 kỹ năng
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                currentTab === 'exam' ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-200 text-gray-700'
              }`}>
                {allLibraryItems.filter(i => i.type === 'exam').length}
              </span>
            </button>
            <button
              onClick={() => setCurrentTab('upload')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition-all ${
                currentTab === 'upload'
                  ? 'bg-orange-100 text-orange-700 border-b-2 border-orange-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Upload className="size-5" />
              Upload File
            </button>
          </div>

          {/* Tab Content */}
          {currentTab === 'upload' ? (
            // Upload Tab
            <div className="flex-1 space-y-4">
              {/* Drag & Drop Area */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                className={`border-3 border-dashed rounded-xl p-12 text-center transition-all ${
                  isDragging 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
                }`}
              >
                <Upload className={`size-16 mx-auto mb-4 ${isDragging ? 'text-red-600' : 'text-gray-400'}`} />
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {isDragging ? 'Thả file vào đây' : 'Kéo thả file vào đây'}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Hỗ trợ: PDF, DOCX, DOC (tối đa 50MB)
                </p>
                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.pdf,.docx,.doc';
                    input.onchange = (e: any) => {
                      const file = e.target.files[0];
                      if (file) {
                        alert(`File "${file.name}" đã được chọn. Trong hệ thống thực tế, file sẽ được upload lên server.`);
                        onSelect({ type: 'file', name: file.name, url: URL.createObjectURL(file) });
                        onClose();
                      }
                    };
                    input.click();
                  }}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Chọn file từ máy
                </button>
              </div>

              {/* URL Input */}
              <div className="relative">
                <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <LinkIcon className="size-4" />
                  Hoặc dán link file
                </p>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  onPaste={handlePaste}
                  placeholder="https://example.com/file.pdf"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={handleFileUrlSubmit}
                  disabled={!fileUrl.trim()}
                  className="absolute right-2 top-9 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Thêm
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h5 className="font-bold text-blue-900 mb-2">💡 Hướng dẫn:</h5>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Kéo thả file trực tiếp vào khung bên trên</li>
                  <li>Hoặc nhấn "Chọn file từ máy" để chọn file</li>
                  <li>Có thể dán link file từ Google Drive, Dropbox, OneDrive...</li>
                  <li>File nên có định dạng PDF hoặc DOCX để dễ dàng xem và in</li>
                </ul>
              </div>
            </div>
          ) : (
            // Library Tabs
            <>
              {/* Search */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Library Items List */}
              <div className="flex-1 overflow-y-auto space-y-3">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-16">
                    <Search className="size-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Không tìm thấy kết quả</p>
                  </div>
                ) : (
                  filteredItems.map(item => {
                    const SkillIcon = getSkillIcon(item.skill);
                    
                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all group"
                      >
                        <div className={`p-3 rounded-lg ${getSkillColor(item.skill)} border-2 group-hover:scale-110 transition-transform`}>
                          <SkillIcon className="size-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-1">
                            <h4 className="font-bold text-gray-900 flex-1">{item.title}</h4>
                            {item.level && (
                              <span className={`px-2.5 py-1 text-xs font-bold rounded ${
                                item.level === 'C1' ? 'bg-red-100 text-red-700' :
                                item.level === 'B2' ? 'bg-orange-100 text-orange-700' :
                                item.level === 'B1' ? 'bg-green-100 text-green-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {item.level}
                              </span>
                            )}
                            {item.type === 'part' && item.partNumber && (
                              <span className="px-2.5 py-1 text-xs font-bold rounded bg-purple-100 text-purple-700">
                                Part {item.partNumber}
                              </span>
                            )}
                            {item.type === 'exam' && (
                              <span className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-100 text-emerald-700">
                                Full Test
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="font-semibold text-gray-700">{item.id}</span>
                            <span>•</span>
                            <span>{item.questions} câu</span>
                            <span>•</span>
                            <span>⏱️ {item.estimatedTime} phút</span>
                            {item.rating && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                  {item.rating.toFixed(1)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="size-6" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-200 p-6 bg-gray-50">
          <button
            onClick={() => {
              onClose();
              setSearchTerm('');
              setFileUrl('');
              setCurrentTab('assignment');
            }}
            className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
