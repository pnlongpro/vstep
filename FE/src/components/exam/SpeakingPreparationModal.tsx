import { useEffect } from 'react';
import { Headphones } from 'lucide-react';

interface SpeakingPreparationModalProps {
  timeLeft: number;
  onComplete: () => void;
}

export function SpeakingPreparationModal({ timeLeft, onComplete }: SpeakingPreparationModalProps) {
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
    }
  }, [timeLeft, onComplete]);

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.86)] bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg border-4 border-blue-400 p-8 max-w-lg w-full mx-4">
        <div className="flex flex-col items-center text-center space-y-5">
          {/* Headset Icon */}
          <div className="relative w-40 h-40 flex items-center justify-center bg-blue-50 rounded-full">
            <Headphones className="w-24 h-24 text-blue-600" />
          </div>

          {/* Main Text */}
          <div className="space-y-2">
            <h2 className="text-xl uppercase tracking-wide text-gray-800">
              BẠN ĐEO TAI NGHE ĐỂ LÀM BÀI THI NÓI
            </h2>
            <p className="text-lg text-gray-700">
              BẠN CÓ 60s ĐỂ CHUẨN BỊ.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="text-5xl text-red-600 tabular-nums my-2">
            {timeLeft}s
          </div>

          {/* Warning Text */}
          <div className="text-sm text-gray-600 leading-relaxed space-y-1">
            <p>BÀI LÀM SẼ ĐƯỢC THU ÂM TRỰC TIẾP</p>
            <p>TRONG LÚC THU ÂM KHÔNG TƯƠNG TÁC VỚI HỆ THỐNG</p>
          </div>
        </div>
      </div>
    </div>
  );
}