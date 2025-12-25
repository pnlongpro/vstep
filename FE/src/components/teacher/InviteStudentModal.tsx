// Teacher Invite Student Modal - PURPLE theme with API integration
'use client';

import { useState } from 'react';
import { X, Mail, Send, Loader2, AlertCircle } from 'lucide-react';
import { useInviteStudents } from '@/hooks/useClasses';
import { useApiError } from '@/hooks/useApiError';
import { toast } from 'sonner';

interface InviteStudentModalProps {
  classId: string;
  className: string;
  inviteCode?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function InviteStudentModal({ 
  classId, 
  className, 
  inviteCode, 
  onClose,
  onSuccess 
}: InviteStudentModalProps) {
  const { handleError } = useApiError();
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const inviteMutation = useInviteStudents();

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  };

  const handleAddEmail = () => {
    const trimmedEmail = emailInput.trim();
    if (!trimmedEmail) return;

    if (!validateEmail(trimmedEmail)) {
      setError('Email không hợp lệ');
      return;
    }

    if (emails.includes(trimmedEmail)) {
      setError('Email đã được thêm');
      return;
    }

    setEmails([...emails, trimmedEmail]);
    setEmailInput('');
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const handlePasteEmails = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const pastedEmails = pastedText.split(/[\s,;]+/).filter(email => {
      const trimmed = email.trim();
      return trimmed && validateEmail(trimmed) && !emails.includes(trimmed);
    });

    if (pastedEmails.length > 0) {
      setEmails([...emails, ...pastedEmails]);
      setEmailInput('');
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (emails.length === 0) {
      setError('Vui lòng thêm ít nhất 1 email');
      return;
    }

    try {
      await inviteMutation.mutateAsync({
        classId,
        data: { emails }
      });

      toast.success(`Đã gửi lời mời đến ${emails.length} học viên`);
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
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div>
            <h3 className="text-xl font-semibold">Mời học viên</h3>
            <p className="text-purple-100 text-sm">{className}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Invite Code Section */}
          {inviteCode && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <h4 className="text-sm font-medium text-purple-700 mb-2">Mã mời lớp học</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white border border-purple-300 rounded-lg p-3 font-mono text-xl text-center tracking-wider">
                  {inviteCode}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(inviteCode);
                    toast.success('Đã sao chép mã mời');
                  }}
                  className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Sao chép
                </button>
              </div>
              <p className="text-sm text-purple-600 mt-2">
                Học viên có thể dùng mã này để tự tham gia lớp học
              </p>
            </div>
          )}

          {/* Divider */}
          {inviteCode && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">hoặc mời qua email</span>
              </div>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline size-4 mr-2" />
              Thêm email học viên
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setError(null);
                }}
                onKeyDown={handleKeyDown}
                onPaste={handlePasteEmails}
                placeholder="nhap@email.com (Enter để thêm)"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddEmail}
                className="px-4 py-2.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                Thêm
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Có thể dán nhiều email cùng lúc (phân cách bằng dấu phẩy hoặc xuống dòng)
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="size-4" />
              {error}
            </div>
          )}

          {/* Email Tags */}
          {emails.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">
                  Danh sách email ({emails.length})
                </h4>
                <button
                  onClick={() => setEmails([])}
                  className="text-sm text-red-600 hover:underline"
                >
                  Xóa tất cả
                </button>
              </div>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 bg-gray-50 rounded-lg border border-gray-200">
                {emails.map((email, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    <span>{email}</span>
                    <button
                      onClick={() => handleRemoveEmail(email)}
                      className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                      title="Xóa email"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={emails.length === 0 || inviteMutation.isPending}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {inviteMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="size-4" />
                Gửi lời mời ({emails.length})
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
