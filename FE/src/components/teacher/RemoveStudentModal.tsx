// Teacher Remove Student Confirmation Modal - PURPLE theme
'use client';

import { AlertTriangle, Loader2, X } from 'lucide-react';
import { useRemoveStudent } from '@/hooks/useClasses';
import { useApiError } from '@/hooks/useApiError';
import { toast } from 'sonner';

interface RemoveStudentModalProps {
  classId: string;
  studentId: string;
  studentName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RemoveStudentModal({
  classId,
  studentId,
  studentName,
  onClose,
  onSuccess,
}: RemoveStudentModalProps) {
  const { handleError } = useApiError();
  const removeMutation = useRemoveStudent();

  const handleConfirm = async () => {
    try {
      await removeMutation.mutateAsync({ classId, studentId });
      toast.success(`Đã xóa ${studentName} khỏi lớp`);
      onSuccess?.();
      onClose();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="size-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa học viên</h3>
            <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="size-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600">
            Bạn có chắc chắn muốn xóa <strong className="text-gray-900">{studentName}</strong> khỏi lớp học này?
          </p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            <strong>Lưu ý:</strong> Học viên sẽ mất quyền truy cập vào:
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Tài liệu lớp học</li>
              <li>Bài tập đã được giao</li>
              <li>Lịch học và thông báo</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={removeMutation.isPending}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {removeMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              'Xóa học viên'
            )}
          </button>
        </div>
      </div>
    </>
  );
}
