import { X } from 'lucide-react';

interface PartSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  onSelectPart: (part: number) => void;
}

const skillConfig = {
  reading: {
    title: 'Học Reading',
    subtitle: 'Chọn phần bạn muốn luyện tập',
    icon: '📖',
    parts: [
      { number: 1, name: 'Part 1', desc: 'Điền từ', questions: '10 câu hỏi', time: '10 phút', color: 'bg-green-500' },
      { number: 2, name: 'Part 2', desc: 'Đọc hiểu ngắn', questions: '10 câu hỏi', time: '15 phút', color: 'bg-blue-500' },
      { number: 3, name: 'Part 3', desc: 'Nối đoạn', questions: '10 câu hỏi', time: '15 phút', color: 'bg-purple-500' },
      { number: 4, name: 'Part 4', desc: 'Đọc hiểu dài', questions: '10 câu hỏi', time: '20 phút', color: 'bg-pink-500' },
    ]
  },
  listening: {
    title: 'Học Listening',
    subtitle: 'Chọn phần bạn muốn luyện tập',
    icon: '🎧',
    parts: [
      { number: 1, name: 'Part 1', desc: 'Hội thoại ngắn', questions: '8 câu hỏi', time: '10 phút', color: 'bg-green-500' },
      { number: 2, name: 'Part 2', desc: 'Hội thoại dài', questions: '12 câu hỏi', time: '15 phút', color: 'bg-blue-500' },
      { number: 3, name: 'Part 3', desc: 'Bài giảng', questions: '15 câu hỏi', time: '15 phút', color: 'bg-purple-500' },
    ]
  },
  writing: {
    title: 'Học Writing',
    subtitle: 'Chọn phần bạn muốn luyện tập',
    icon: '✍️',
    parts: [
      { number: 1, name: 'Part 1', desc: 'Viết thư/Email', questions: '1 bài viết', time: '20 phút', color: 'bg-green-500' },
      { number: 2, name: 'Part 2', desc: 'Viết luận', questions: '1 bài viết', time: '40 phút', color: 'bg-blue-500' },
    ]
  },
  speaking: {
    title: 'Học Speaking',
    subtitle: 'Chọn phần bạn muốn luyện tập',
    icon: '🎤',
    parts: [
      { number: 1, name: 'Part 1', desc: 'Phỏng vấn', questions: '6 câu hỏi', time: '3 phút', color: 'bg-green-500' },
      { number: 2, name: 'Part 2', desc: 'Diễn thuyết', questions: '1 chủ đề', time: '2 phút', color: 'bg-blue-500' },
      { number: 3, name: 'Part 3', desc: 'Thảo luận', questions: '5 câu hỏi', time: '5 phút', color: 'bg-purple-500' },
    ]
  }
};

export function PartSelectionModal({ isOpen, onClose, skill, onSelectPart }: PartSelectionModalProps) {
  if (!isOpen) return null;

  const config = skillConfig[skill];
  
  // Safety check: if config doesn't exist, don't render
  if (!config) {
    console.error(`Invalid skill passed to PartSelectionModal: ${skill}`);
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div>
              <h2 className="text-xl">{config.title}</h2>
              <p className="text-sm text-gray-600">{config.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Parts Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {config.parts.map((part) => (
            <button
              key={part.number}
              onClick={() => {
                if (!part.disabled) {
                  onSelectPart(part.number);
                  onClose();
                }
              }}
              disabled={part.disabled}
              className={`group relative bg-gradient-to-br from-white to-gray-50 border-2 rounded-xl p-6 transition-all duration-300 text-left ${
                part.disabled 
                  ? 'border-gray-200 opacity-60 cursor-not-allowed' 
                  : 'border-gray-200 hover:border-blue-500 hover:shadow-lg cursor-pointer'
              }`}
            >
              {/* Part Number Circle */}
              <div className="flex flex-col items-center mb-4">
                <div className={`w-16 h-16 ${part.color} rounded-full flex items-center justify-center text-white text-2xl mb-3 ${!part.disabled && 'group-hover:scale-110'} transition-transform ${part.disabled && 'opacity-50'}`}>
                  {part.number}
                </div>
                <h3 className="text-lg">{part.name}</h3>
                <p className="text-sm text-gray-600">{part.desc}</p>
              </div>

              {/* Info */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{part.questions}</span>
                  <span className="text-gray-600">{part.time}</span>
                </div>
              </div>

              {/* Hover effect (only for enabled parts) */}
              {!part.disabled && (
                <div className="absolute inset-0 bg-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              )}

              {/* Disabled overlay */}
              {part.disabled && (
                <div className="absolute inset-0 bg-gray-100/90 rounded-xl flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔒</div>
                    <p className="text-sm text-gray-700">{part.disabledMessage}</p>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}