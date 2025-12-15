interface SkillTransitionModalProps {
  currentSkill: string;
  nextSkill: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const skillNames: Record<string, string> = {
  listening: 'LISTENING',
  reading: 'READING',
  writing: 'WRITING',
  speaking: 'SPEAKING'
};

export function SkillTransitionModal({
  currentSkill,
  nextSkill,
  onConfirm,
  onCancel
}: SkillTransitionModalProps) {
  const currentSkillName = skillNames[currentSkill] || currentSkill.toUpperCase();
  const nextSkillName = skillNames[nextSkill] || nextSkill.toUpperCase();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="bg-white px-5 py-3 rounded-t-xl border-b-2 border-gray-200">
          <p className="text-sm leading-relaxed">
            <span className="mr-2">❖</span>
            ĐỂ CHUYỂN SANG KỸ NĂNG {nextSkillName}, THÍ SINH CŨNG CHỌN NÚT{' '}
            <span className="text-cyan-500">&quot;TIẾP TỤC&quot;</span>, HỆ THỐNG SẼ HIỆN THÔNG BÁO:
          </p>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Main Message Box */}
          <div className="border-3 border-cyan-400 rounded-lg p-5 mb-4 bg-gray-50">
            <div className="text-center space-y-3">
              <p className="text-base">
                BẠN ĐÃ LƯU BÀI VÀ HOÀN THÀNH KỸ NĂNG <span className="text-red-600">&quot;{currentSkillName}&quot;</span>
              </p>
              <p className="text-base">
                BẠN MUỐN CHUYỂN SANG KỸ NĂNG TIẾP THEO ?
              </p>
              <p className="text-sm text-gray-700">
                SAU KHI CHUYỂN BẠN KHÔNG THỂ QUAY VỀ KỸ NĂNG TRƯỚC ĐÓ
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={onConfirm}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                >
                  ĐỒNG Ý
                </button>
                <button
                  onClick={onCancel}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors text-sm"
                >
                  HỦY BỎ
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Notes */}
          <div className="space-y-2 text-xs">
            <p className="leading-relaxed">
              <span className="mr-2">-</span>
              THÍ SINH ĐỌC KỸ THÔNG TIN TRƯỚC KHI CHỌN{' '}
              <span className="text-cyan-500">&quot;ĐỒNG Ý&quot;</span>{' '}
              ĐỂ CHUYỂN SANG KỸ NĂNG TIẾP THEO.
            </p>
            <p className="leading-relaxed">
              <span className="mr-2">-</span>
              KHI ĐÃ CHẮC CHẮN CÁC ĐÁP ÁN VÀ BÀI LÀM CỦA MÌNH THÍ SINH CHỌN{' '}
              <span className="text-cyan-500">&quot;ĐỒNG Ý&quot;</span>{' '}
              ĐỂ CHUYỂN KỸ NĂNG TIẾP THEO.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}