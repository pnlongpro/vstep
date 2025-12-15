import { X, Layers, BookOpen } from 'lucide-react';

interface ModeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  onSelectMode: (mode: 'part' | 'fulltest') => void;
}

const skillNames = {
  reading: 'Reading',
  listening: 'Listening',
  writing: 'Writing',
  speaking: 'Speaking'
};

const skillIcons = {
  reading: '📖',
  listening: '🎧',
  writing: '✍️',
  speaking: '🎤'
};

export function ModeSelectionModal({ isOpen, onClose, skill, onSelectMode }: ModeSelectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{skillIcons[skill]}</span>
            <div>
              <h2 className="text-xl">Chọn chế độ luyện tập</h2>
              <p className="text-sm text-gray-600">Học {skillNames[skill]}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Mode Options */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Luyện theo phần */}
          <button
            onClick={() => {
              onSelectMode('part');
            }}
            className="group relative bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Layers className="size-8" />
              </div>
              <div>
                <h3 className="text-lg mb-1">Luyện theo phần</h3>
                <p className="text-sm text-gray-600">
                  Luyện tập từng phần riêng biệt, tập trung vào kỹ năng cụ thể
                </p>
              </div>
              <div className="pt-2 border-t border-blue-300 w-full">
                <p className="text-xs text-blue-700">Linh hoạt • Có trọng tâm • Dễ quản lý</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </button>

          {/* Làm bộ đề đầy đủ */}
          <button
            onClick={() => {
              onSelectMode('fulltest');
              onClose();
            }}
            className="group relative bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <BookOpen className="size-8" />
              </div>
              <div>
                <h3 className="text-lg mb-1">Làm bộ đề đầy đủ</h3>
                <p className="text-sm text-gray-600">
                  Làm bài thi đầy đủ, mô phỏng thi thật với đầy đủ các phần
                </p>
              </div>
              <div className="pt-2 border-t border-purple-300 w-full">
                <p className="text-xs text-purple-700">Thực chiến • Đo lường • Chuẩn thi</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
