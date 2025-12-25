import { X, BookOpen, Headphones, PenTool, Mic } from 'lucide-react';

interface SkillSelectionModalProps {
  onClose: () => void;
  onSelectSkill: (skill: 'reading' | 'listening' | 'writing' | 'speaking') => void;
}

export function SkillSelectionModal({ onClose, onSelectSkill }: SkillSelectionModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-4xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Tạo đề thi mới</h3>
              <p className="text-sm opacity-90 mt-1">Chọn kỹ năng bạn muốn tạo đề thi</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="size-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-6">
            {/* Reading */}
            <button
              onClick={() => onSelectSkill('reading')}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-500 hover:to-blue-600 border-2 border-blue-200 hover:border-blue-600 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-500 group-hover:bg-white rounded-2xl flex items-center justify-center mb-4 transition-colors shadow-lg">
                  <BookOpen className="size-10 text-white group-hover:text-blue-600 transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-blue-900 group-hover:text-white transition-colors">Reading</h4>
                <p className="text-sm text-blue-700 group-hover:text-blue-100 mt-2 transition-colors">
                  Đề thi đọc hiểu
                </p>
                <div className="mt-4 px-4 py-2 bg-blue-500 group-hover:bg-white text-white group-hover:text-blue-600 rounded-lg text-sm font-medium transition-colors">
                  Chọn kỹ năng này
                </div>
              </div>
            </button>

            {/* Listening */}
            <button
              onClick={() => onSelectSkill('listening')}
              className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-500 hover:to-emerald-600 border-2 border-emerald-200 hover:border-emerald-600 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-emerald-500 group-hover:bg-white rounded-2xl flex items-center justify-center mb-4 transition-colors shadow-lg">
                  <Headphones className="size-10 text-white group-hover:text-emerald-600 transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-emerald-900 group-hover:text-white transition-colors">Listening</h4>
                <p className="text-sm text-emerald-700 group-hover:text-emerald-100 mt-2 transition-colors">
                  Đề thi nghe hiểu
                </p>
                <div className="mt-4 px-4 py-2 bg-emerald-500 group-hover:bg-white text-white group-hover:text-emerald-600 rounded-lg text-sm font-medium transition-colors">
                  Chọn kỹ năng này
                </div>
              </div>
            </button>

            {/* Writing */}
            <button
              onClick={() => onSelectSkill('writing')}
              className="group relative overflow-hidden bg-gradient-to-br from-violet-50 to-violet-100 hover:from-violet-500 hover:to-violet-600 border-2 border-violet-200 hover:border-violet-600 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-violet-500 group-hover:bg-white rounded-2xl flex items-center justify-center mb-4 transition-colors shadow-lg">
                  <PenTool className="size-10 text-white group-hover:text-violet-600 transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-violet-900 group-hover:text-white transition-colors">Writing</h4>
                <p className="text-sm text-violet-700 group-hover:text-violet-100 mt-2 transition-colors">
                  Đề thi viết luận
                </p>
                <div className="mt-4 px-4 py-2 bg-violet-500 group-hover:bg-white text-white group-hover:text-violet-600 rounded-lg text-sm font-medium transition-colors">
                  Chọn kỹ năng này
                </div>
              </div>
            </button>

            {/* Speaking */}
            <button
              onClick={() => onSelectSkill('speaking')}
              className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-500 hover:to-amber-600 border-2 border-amber-200 hover:border-amber-600 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-amber-500 group-hover:bg-white rounded-2xl flex items-center justify-center mb-4 transition-colors shadow-lg">
                  <Mic className="size-10 text-white group-hover:text-amber-600 transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-amber-900 group-hover:text-white transition-colors">Speaking</h4>
                <p className="text-sm text-amber-700 group-hover:text-amber-100 mt-2 transition-colors">
                  Đề thi nói
                </p>
                <div className="mt-4 px-4 py-2 bg-amber-500 group-hover:bg-white text-white group-hover:text-amber-600 rounded-lg text-sm font-medium transition-colors">
                  Chọn kỹ năng này
                </div>
              </div>
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Sau khi chọn kỹ năng, bạn sẽ được chuyển đến form nhập liệu chi tiết với định dạng chuẩn VSTEP.
              Đề thi sẽ được lưu vào ngân hàng đề thi theo kỹ năng tương ứng.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
