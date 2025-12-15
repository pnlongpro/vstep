import { AlertCircle } from 'lucide-react';

interface IncompletePartModalProps {
  answeredCount: number;
  totalCount: number;
  onContinue: () => void;
  onStay: () => void;
}

export function IncompletePartModal({
  answeredCount,
  totalCount,
  onContinue,
  onStay
}: IncompletePartModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="bg-blue-500 text-white px-4 py-2.5 rounded-t-xl flex items-center gap-2">
          <AlertCircle className="size-5" />
          <span className="text-sm">THÍ SINH CHỌN NÚT <span className="text-cyan-300">&quot;TIẾP TỤC&quot;</span> ĐỂ CHUYỂN TIẾP SANG LÀM CÁC PART CÒN LẠI</span>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Important Note */}
          <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600 italic text-xs leading-relaxed">
              CHÚ Ý: NẾU THÍ SINH CHƯA TRẢ LỜI HẾT CÁC CÂU HỎI HỆ THỐNG SẼ HIỆN MỘT THÔNG BÁO, HIỂN THỊ SỐ CÂU HỎI ĐÃ LÀM VÀ CÒN THIẾU ĐỂ THÍ SINH BIẾT.
            </p>
          </div>

          {/* Main Warning Box */}
          <div className="border-3 border-cyan-400 rounded-lg p-5 mb-4">
            <div className="text-center space-y-3">
              <p className="text-base">
                BẠN MỚI TRẢ LỜI ĐƯỢC{' '}
                <span className="inline-block bg-red-500 text-white px-2 py-0.5 rounded mx-1 text-sm">
                  {answeredCount}/{totalCount}
                </span>{' '}
                CÂU HỎI TRONG PART NÀY
              </p>
              <p className="text-base">
                BẠN VẪN MUỐN CHUYỂN SANG PART TIẾP THEO ?
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={onContinue}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                >
                  TIẾP TỤC
                </button>
                <button
                  onClick={onStay}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors text-sm"
                >
                  Ở LẠI
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Warning */}
          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <p className="text-red-600 text-xs leading-relaxed">
              LƯU Ý: THÍ SINH CHỈ ĐƯỢC DÙNG CHUỘT ĐỂ THAO TÁC CHỌN ĐÁP ÁN, KHÔNG DÙNG BÀN PHÍM, VÀ CLICK VÀO NHỮNG CHỖ KHÔNG THUỘC PHẠM VI BÀI LÀM. NẾU VI PHẠT SẼ BỊ HỦY BÀI THI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}