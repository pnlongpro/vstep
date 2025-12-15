import { Mic } from 'lucide-react';

interface RecordingCountdownModalProps {
  countdown: number;
}

export function RecordingCountdownModal({ countdown }: RecordingCountdownModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
        <div className="mb-4">
          <div className="inline-block bg-yellow-400 rounded-full p-6 relative">
            <Mic className="size-12 text-gray-800" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-lg">GHI ÂM SAU</p>
          <p className="text-5xl text-red-600">{countdown}s</p>
        </div>
      </div>
    </div>
  );
}
