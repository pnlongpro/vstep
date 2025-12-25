import { useState } from 'react';
import { X, Search, FileText, List, BookOpen, Plus, Star, Headphones, PenTool, Mic, BookOpen as Reading } from 'lucide-react';
import { allLibraryItems, searchLibraryItems, type LibraryItem, type LibraryItemType } from '../../data/teacherLibraryData';

type SkillType = 'reading' | 'listening' | 'writing' | 'speaking';
type LibraryModalTab = 'assignment' | 'part' | 'exam';

interface AdminLibrarySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: LibraryItem) => void;
}

export function AdminLibrarySelectionModal({ isOpen, onClose, onSelect }: AdminLibrarySelectionModalProps) {
  const [currentTab, setCurrentTab] = useState<LibraryModalTab>('assignment');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredItems = searchLibraryItems(searchTerm, currentTab, undefined, undefined);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">📚 Chọn từ thư viện</h3>
            <p className="text-sm text-gray-600 mt-1">Chọn bài tập, parts hoặc bộ đề đã được duyệt</p>
          </div>
          <button
            onClick={() => {
              onClose();
              setSearchTerm('');
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
          </div>

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
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-200 p-6 bg-gray-50">
          <button
            onClick={() => {
              onClose();
              setSearchTerm('');
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
