import { useState } from 'react';
import { Monitor, Smartphone, Tablet, Globe, MapPin, Clock, Trash2, AlertCircle, X, Settings } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
  loginTime: string;
  isCurrentDevice: boolean;
}

interface DeviceLimitModalProps {
  isOpen: boolean;
  userName: string;
  userEmail: string;
  devices: Device[];
  maxDevices: number;
  onClose: () => void;
  onLogoutDevice: (deviceId: string) => void;
  onLogoutAll: () => void;
  onUpdateLimit: (newLimit: number) => void;
}

export function DeviceLimitModal({ 
  isOpen, 
  userName,
  userEmail,
  devices,
  maxDevices,
  onClose,
  onLogoutDevice,
  onLogoutAll,
  onUpdateLimit
}: DeviceLimitModalProps) {
  const [editingLimit, setEditingLimit] = useState(false);
  const [newLimit, setNewLimit] = useState(maxDevices.toString());

  if (!isOpen) return null;

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Monitor;
    }
  };

  const getDeviceTypeColor = (type: string) => {
    switch (type) {
      case 'mobile':
        return 'text-blue-600';
      case 'tablet':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleSaveLimit = () => {
    const limit = parseInt(newLimit);
    if (limit >= 1 && limit <= 10) {
      onUpdateLimit(limit);
      setEditingLimit(false);
    }
  };

  const activeDevices = devices.filter(d => true); // In real app, filter by active status
  const isOverLimit = activeDevices.length > maxDevices;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h3 className="text-xl mb-1">Quản lý thiết bị đăng nhập</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{userName}</span>
              <span>•</span>
              <span>{userEmail}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors">
            <X className="size-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Device Limit Settings */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Settings className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm">Giới hạn số thiết bị</h4>
                  {!editingLimit && (
                    <button
                      onClick={() => setEditingLimit(true)}
                      className="text-xs text-blue-600 hover:text-blue-700 underline"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>
                
                {editingLimit ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
                      min="1"
                      max="10"
                      className="w-24 px-3 py-1.5 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <span className="text-sm text-gray-600">thiết bị</span>
                    <button
                      onClick={handleSaveLimit}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => {
                        setNewLimit(maxDevices.toString());
                        setEditingLimit(false);
                      }}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl text-blue-600">{maxDevices}</span>
                    <span className="text-sm text-gray-600">thiết bị tối đa</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className={`rounded-xl p-4 border ${
            isOverLimit 
              ? 'bg-red-50 border-red-200' 
              : activeDevices.length === maxDevices
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start gap-3">
              <AlertCircle className={`size-5 flex-shrink-0 mt-0.5 ${
                isOverLimit 
                  ? 'text-red-600' 
                  : activeDevices.length === maxDevices
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-2xl ${
                    isOverLimit 
                      ? 'text-red-600' 
                      : activeDevices.length === maxDevices
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}>
                    {activeDevices.length} / {maxDevices}
                  </span>
                  <span className="text-sm text-gray-600">thiết bị đang đăng nhập</span>
                </div>
                {isOverLimit && (
                  <p className="text-sm text-red-700">
                    ⚠️ <strong>Vượt quá giới hạn!</strong> Người dùng đang đăng nhập trên {activeDevices.length - maxDevices} thiết bị thừa.
                  </p>
                )}
                {!isOverLimit && activeDevices.length === maxDevices && (
                  <p className="text-sm text-yellow-700">
                    Đã đạt giới hạn tối đa. Người dùng cần đăng xuất một thiết bị để đăng nhập thiết bị mới.
                  </p>
                )}
                {!isOverLimit && activeDevices.length < maxDevices && (
                  <p className="text-sm text-green-700">
                    Còn {maxDevices - activeDevices.length} slot trống.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Devices List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm">Danh sách thiết bị ({activeDevices.length})</h4>
              {activeDevices.length > 0 && (
                <button
                  onClick={onLogoutAll}
                  className="text-xs text-red-600 hover:text-red-700 underline flex items-center gap-1"
                >
                  <Trash2 className="size-3" />
                  Đăng xuất tất cả
                </button>
              )}
            </div>

            {activeDevices.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Monitor className="size-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Không có thiết bị nào đang đăng nhập</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeDevices.map((device, index) => {
                  const DeviceIcon = getDeviceIcon(device.type);
                  const deviceColor = getDeviceTypeColor(device.type);
                  
                  return (
                    <div
                      key={device.id}
                      className={`bg-white border rounded-xl p-4 transition-all ${
                        device.isCurrentDevice
                          ? 'border-blue-300 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Device Icon */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          device.isCurrentDevice ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <DeviceIcon className={`size-6 ${deviceColor}`} />
                        </div>

                        {/* Device Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="text-sm">
                              {device.name}
                            </h5>
                            {device.isCurrentDevice && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Thiết bị này
                              </span>
                            )}
                            {index === 0 && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                Gần nhất
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-1.5 text-xs text-gray-600">
                            <div className="flex items-center gap-2">
                              <Globe className="size-3.5" />
                              <span>{device.browser} • {device.os}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="size-3.5" />
                              <span>{device.location} • IP: {device.ip}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="size-3.5" />
                              <span>Đăng nhập: {device.loginTime} • Hoạt động: {device.lastActive}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <button
                          onClick={() => onLogoutDevice(device.id)}
                          disabled={device.isCurrentDevice}
                          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                            device.isCurrentDevice
                              ? 'opacity-30 cursor-not-allowed'
                              : 'hover:bg-red-50 text-red-600'
                          }`}
                          title={device.isCurrentDevice ? 'Không thể đăng xuất thiết bị hiện tại' : 'Đăng xuất thiết bị này'}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-4 text-gray-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Lưu ý:</strong></p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Mỗi người dùng chỉ được đăng nhập trên tối đa <strong>{maxDevices} thiết bị</strong> cùng lúc</li>
                  <li>Khi đạt giới hạn, người dùng phải đăng xuất một thiết bị cũ để đăng nhập thiết bị mới</li>
                  <li>Admin có thể force logout từng thiết bị hoặc tất cả thiết bị</li>
                  <li>Thiết bị không hoạt động quá 30 ngày sẽ tự động bị đăng xuất</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </>
  );
}
