import { Clock } from 'lucide-react';

interface PreparationTimerProps {
  countdown: number;
}

export function PreparationTimer({ countdown }: PreparationTimerProps) {
  // Calculate progress percentage (60s = 100%, 0s = 0%)
  const progress = (countdown / 60) * 100;
  
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl shadow-2xl border-4 border-blue-600 p-4 animate-pulse">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-blue-600">
          <Clock className="size-5" />
          <span className="text-xs">Thời gian chuẩn bị</span>
        </div>
        
        {/* Circular Progress */}
        <div className="relative w-20 h-20">
          <svg className="transform -rotate-90 w-20 h-20">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#2563eb"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl text-blue-600">{countdown}</span>
          </div>
        </div>
        
        <span className="text-xs text-gray-600">giây</span>
      </div>
    </div>
  );
}