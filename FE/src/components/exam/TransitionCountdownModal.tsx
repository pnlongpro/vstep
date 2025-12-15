interface TransitionCountdownModalProps {
  countdown: number;
}

export function TransitionCountdownModal({ countdown }: TransitionCountdownModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-2xl text-center max-w-sm">
        <p className="text-sm text-gray-700 mb-2">Thời gian chuẩn bị còn lại</p>
        <p className="text-4xl text-blue-600">{countdown}s</p>
        <p className="text-xs text-gray-500 mt-2">Tự động chuyển Part 2...</p>
      </div>
    </div>
  );
}
