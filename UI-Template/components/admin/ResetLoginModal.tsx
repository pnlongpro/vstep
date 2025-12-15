import { AlertTriangle } from 'lucide-react';

interface ResetLoginModalProps {
  isOpen: boolean;
  userName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetLoginModal({ isOpen, userName, onClose, onConfirm }: ResetLoginModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-md p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="size-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl mb-2">Reset Login Sessions</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to reset all login sessions for <strong>{userName}</strong>? This will log them out from all devices.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Yes, Reset
          </button>
        </div>
      </div>
    </>
  );
}
