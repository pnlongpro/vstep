import { useState } from 'react';
import { Calendar, Plus, Info, X } from 'lucide-react';

interface AccountExpiryModalProps {
  isOpen: boolean;
  userName: string;
  currentExpiry: string;
  daysRemaining: number;
  planDays: number;
  onClose: () => void;
  onSave: (mode: 'extend' | 'set', value: number | string) => void;
}

export function AccountExpiryModal({ 
  isOpen, 
  userName, 
  currentExpiry,
  daysRemaining,
  planDays,
  onClose, 
  onSave 
}: AccountExpiryModalProps) {
  const [mode, setMode] = useState<'extend' | 'set'>('extend');
  const [extendDays, setExtendDays] = useState('');
  const [customDate, setCustomDate] = useState('');

  if (!isOpen) return null;

  const getStatusBadge = () => {
    if (daysRemaining <= 3) {
      return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md">Sắp hết hạn ({daysRemaining} ngày còn lại)</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">Còn hiệu lực</span>;
  };

  const handleSave = () => {
    if (mode === 'extend') {
      onSave('extend', parseInt(extendDays) || 0);
    } else {
      onSave('set', customDate);
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-xl">Quản lý hạn tài khoản - {userName}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="size-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div>
            <h4 className="text-sm mb-4">Trạng thái hiện tại</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trạng thái</span>
                {getStatusBadge()}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Số ngày gói</span>
                <span className="text-sm">{planDays} ngày</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ngày hết hạn hiện tại</span>
                <span className="text-sm">{currentExpiry}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Số ngày còn lại</span>
                <span className="text-sm">{daysRemaining} ngày</span>
              </div>
            </div>
          </div>

          {/* Management Mode */}
          <div>
            <h4 className="text-sm mb-4">Chế độ quản lý</h4>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMode('extend')}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors flex-1 ${
                  mode === 'extend'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Plus className="size-4" />
                Gia hạn thêm ngày
              </button>
              <button
                onClick={() => setMode('set')}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors flex-1 ${
                  mode === 'set'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Calendar className="size-4" />
                Đặt ngày cụ thể
              </button>
            </div>
          </div>

          {/* Input Section */}
          {mode === 'extend' ? (
            <div>
              <label className="block text-sm mb-2">
                <span className="text-red-600">*</span> Số ngày gia hạn
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={extendDays}
                  onChange={(e) => setExtendDays(e.target.value)}
                  placeholder="Nhập số ngày gia hạn"
                  className="w-full px-4 py-2.5 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  ngày
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm mb-2">
                <span className="text-red-600">*</span> Ngày hết hạn mới
              </label>
              <input
                type="datetime-local"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 space-y-1">
                <p>
                  <strong>Lưu ý:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Gia hạn thêm ngày sẽ cộng vào thời hạn hiện tại nếu tài khoản vẫn còn hiệu lực</li>
                  <li>Nếu tài khoản đã hết hạn, thời gian gia hạn sẽ được tính từ ngày hiện tại</li>
                  <li>Đặt ngày cụ thể sẽ ghi đè lên thời hạn hiện tại</li>
                  <li>Người dùng sẽ tự động bị đăng xuất khi tài khoản hết hạn</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={mode === 'extend' ? !extendDays : !customDate}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Gia hạn
          </button>
        </div>
      </div>
    </>
  );
}
