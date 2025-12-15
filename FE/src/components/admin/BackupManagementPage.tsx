import { useState } from 'react';
import { Database, Download, Trash2, RefreshCw, Clock, HardDrive, Calendar, CheckCircle, XCircle, AlertCircle, FolderArchive, Settings, PlayCircle, Plus } from 'lucide-react';

interface Backup {
  id: number;
  name: string;
  type: 'auto' | 'manual';
  size: string;
  date: string;
  time: string;
  status: 'success' | 'failed' | 'in-progress';
  description: string;
  includes: string[];
}

export function BackupManagementPage() {
  const [backups, setBackups] = useState<Backup[]>([
    {
      id: 1,
      name: 'backup_2024_12_13_full',
      type: 'auto',
      size: '2.4 GB',
      date: '13/12/2024',
      time: '03:00 AM',
      status: 'success',
      description: 'Sao lưu tự động hàng ngày',
      includes: ['Database', 'User Data', 'Exam Files', 'AI Logs'],
    },
    {
      id: 2,
      name: 'backup_2024_12_12_full',
      type: 'auto',
      size: '2.3 GB',
      date: '12/12/2024',
      time: '03:00 AM',
      status: 'success',
      description: 'Sao lưu tự động hàng ngày',
      includes: ['Database', 'User Data', 'Exam Files', 'AI Logs'],
    },
    {
      id: 3,
      name: 'backup_2024_12_11_full',
      type: 'auto',
      size: '2.3 GB',
      date: '11/12/2024',
      time: '03:00 AM',
      status: 'success',
      description: 'Sao lưu tự động hàng ngày',
      includes: ['Database', 'User Data', 'Exam Files', 'AI Logs'],
    },
    {
      id: 4,
      name: 'backup_2024_12_10_manual',
      type: 'manual',
      size: '2.2 GB',
      date: '10/12/2024',
      time: '02:30 PM',
      status: 'success',
      description: 'Sao lưu thủ công trước khi cập nhật hệ thống',
      includes: ['Database', 'User Data', 'System Config'],
    },
    {
      id: 5,
      name: 'backup_2024_12_09_full',
      type: 'auto',
      size: '2.2 GB',
      date: '09/12/2024',
      time: '03:00 AM',
      status: 'failed',
      description: 'Lỗi: Không đủ dung lượng lưu trữ',
      includes: ['Database', 'User Data'],
    },
  ]);

  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const storageInfo = {
    used: 48.5,
    total: 100,
    backupCount: backups.length,
    lastBackup: backups[0],
  };

  const backupConfig = {
    autoBackup: true,
    frequency: 'daily',
    time: '03:00',
    retention: 30,
    includes: ['Database', 'User Data', 'Exam Files', 'AI Logs', 'System Config'],
  };

  const handleCreateBackup = () => {
    const newBackup: Backup = {
      id: backups.length + 1,
      name: `backup_${new Date().toISOString().split('T')[0].replace(/-/g, '_')}_manual`,
      type: 'manual',
      size: '2.5 GB',
      date: new Date().toLocaleDateString('vi-VN'),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'in-progress',
      description: 'Đang tạo bản sao lưu thủ công...',
      includes: backupConfig.includes,
    };
    
    setBackups([newBackup, ...backups]);
    setShowCreateModal(false);
    
    // Simulate backup completion
    setTimeout(() => {
      setBackups(prev => prev.map(b => 
        b.id === newBackup.id 
          ? { ...b, status: 'success' as const, description: 'Sao lưu thủ công hoàn tất' }
          : b
      ));
    }, 3000);
  };

  const handleDownload = (backup: Backup) => {
    alert(`Đang tải xuống: ${backup.name}\nDung lượng: ${backup.size}`);
  };

  const handleRestore = (backup: Backup) => {
    if (confirm(`Bạn có chắc chắn muốn khôi phục từ bản sao lưu:\n${backup.name}\nNgày: ${backup.date} ${backup.time}\n\n⚠️ Hành động này sẽ ghi đè dữ liệu hiện tại!`)) {
      alert(`Đang khôi phục từ: ${backup.name}\nQuá trình này có thể mất vài phút...`);
    }
  };

  const handleDelete = (backupId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa bản sao lưu này?\n\n⚠️ Hành động này không thể hoàn tác!')) {
      setBackups(backups.filter(b => b.id !== backupId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Database className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý sao lưu</h2>
            <p className="text-sm text-gray-600">Sao lưu và khôi phục dữ liệu hệ thống</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Settings className="size-4" />
            Cấu hình
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="size-4" />
            Tạo bản sao lưu
          </button>
        </div>
      </div>

      {/* Storage Info & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Storage Usage */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <HardDrive className="size-8 opacity-80 mb-3" />
          <p className="text-sm opacity-90 mb-2">Dung lượng sử dụng</p>
          <p className="text-3xl font-bold mb-3">{storageInfo.used} GB</p>
          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
            <div
              className="bg-white h-2 rounded-full transition-all"
              style={{ width: `${(storageInfo.used / storageInfo.total) * 100}%` }}
            />
          </div>
          <p className="text-xs opacity-75">{storageInfo.used}/{storageInfo.total} GB ({((storageInfo.used / storageInfo.total) * 100).toFixed(1)}%)</p>
        </div>

        {/* Total Backups */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <FolderArchive className="size-8 opacity-80 mb-3" />
          <p className="text-sm opacity-90 mb-2">Tổng số bản sao lưu</p>
          <p className="text-3xl font-bold mb-1">{storageInfo.backupCount}</p>
          <p className="text-xs opacity-75">
            {backups.filter(b => b.status === 'success').length} thành công
          </p>
        </div>

        {/* Last Backup */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <Clock className="size-8 opacity-80 mb-3" />
          <p className="text-sm opacity-90 mb-2">Sao lưu gần nhất</p>
          <p className="text-xl font-bold mb-1">{storageInfo.lastBackup.date}</p>
          <p className="text-sm opacity-90">{storageInfo.lastBackup.time}</p>
          <p className="text-xs opacity-75 mt-1">
            {storageInfo.lastBackup.type === 'auto' ? '🤖 Tự động' : '👤 Thủ công'}
          </p>
        </div>

        {/* Backup Status */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <CheckCircle className="size-8 opacity-80 mb-3" />
          <p className="text-sm opacity-90 mb-2">Tỷ lệ thành công</p>
          <p className="text-3xl font-bold mb-1">
            {((backups.filter(b => b.status === 'success').length / backups.length) * 100).toFixed(1)}%
          </p>
          <p className="text-xs opacity-75">
            {backups.filter(b => b.status === 'failed').length} lỗi / {backups.length} tổng
          </p>
        </div>
      </div>

      {/* Backup Config Info */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Settings className="size-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-3">⚙️ Cấu hình sao lưu tự động</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Trạng thái</p>
                <p className="text-sm font-bold text-green-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {backupConfig.autoBackup ? 'Đang bật' : 'Đã tắt'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Tần suất</p>
                <p className="text-sm font-bold text-gray-900">
                  {backupConfig.frequency === 'daily' ? 'Hàng ngày' : 'Tuần 1 lần'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Thời gian</p>
                <p className="text-sm font-bold text-gray-900">{backupConfig.time} AM</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Lưu giữ</p>
                <p className="text-sm font-bold text-gray-900">{backupConfig.retention} ngày</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>📦 Bao gồm:</strong> {backupConfig.includes.join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Backups List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">📋 Danh sách bản sao lưu</h3>
          <p className="text-sm text-gray-600">Quản lý và khôi phục từ các bản sao lưu</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Tên bản sao lưu</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Loại</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Ngày tạo</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Dung lượng</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Trạng thái</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr key={backup.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  {/* Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Database className={`size-5 ${
                        backup.status === 'success' ? 'text-green-600' :
                        backup.status === 'failed' ? 'text-red-600' :
                        'text-blue-600'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{backup.name}</p>
                        <p className="text-xs text-gray-500">{backup.description}</p>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      backup.type === 'auto'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {backup.type === 'auto' ? (
                        <>
                          <RefreshCw className="size-3" />
                          Tự động
                        </>
                      ) : (
                        <>
                          <PlayCircle className="size-3" />
                          Thủ công
                        </>
                      )}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="size-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{backup.date}</p>
                        <p className="text-xs text-gray-500">{backup.time}</p>
                      </div>
                    </div>
                  </td>

                  {/* Size */}
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-gray-900">{backup.size}</span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      backup.status === 'success'
                        ? 'bg-green-100 text-green-700'
                        : backup.status === 'failed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {backup.status === 'success' && (
                        <>
                          <CheckCircle className="size-3" />
                          Thành công
                        </>
                      )}
                      {backup.status === 'failed' && (
                        <>
                          <XCircle className="size-3" />
                          Thất bại
                        </>
                      )}
                      {backup.status === 'in-progress' && (
                        <>
                          <AlertCircle className="size-3" />
                          Đang xử lý
                        </>
                      )}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBackup(backup)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Database className="size-4" />
                      </button>
                      {backup.status === 'success' && (
                        <>
                          <button
                            onClick={() => handleDownload(backup)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Tải xuống"
                          >
                            <Download className="size-4" />
                          </button>
                          <button
                            onClick={() => handleRestore(backup)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Khôi phục"
                          >
                            <RefreshCw className="size-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(backup.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {backups.length === 0 && (
          <div className="text-center py-12">
            <Database className="size-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Chưa có bản sao lưu nào</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedBackup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Chi tiết bản sao lưu</h3>
              <button
                onClick={() => setSelectedBackup(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="size-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Badge */}
              <div className={`p-4 rounded-xl border-2 ${
                selectedBackup.status === 'success'
                  ? 'bg-green-50 border-green-200'
                  : selectedBackup.status === 'failed'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center gap-3">
                  {selectedBackup.status === 'success' && <CheckCircle className="size-6 text-green-600" />}
                  {selectedBackup.status === 'failed' && <XCircle className="size-6 text-red-600" />}
                  {selectedBackup.status === 'in-progress' && <AlertCircle className="size-6 text-yellow-600" />}
                  <div>
                    <p className="font-semibold text-gray-900">{selectedBackup.name}</p>
                    <p className="text-sm text-gray-600">{selectedBackup.description}</p>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Loại sao lưu</p>
                  <p className="font-medium text-gray-900">
                    {selectedBackup.type === 'auto' ? '🤖 Tự động' : '👤 Thủ công'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Dung lượng</p>
                  <p className="font-medium text-gray-900">{selectedBackup.size}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Ngày tạo</p>
                  <p className="font-medium text-gray-900">{selectedBackup.date}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Giờ tạo</p>
                  <p className="font-medium text-gray-900">{selectedBackup.time}</p>
                </div>
              </div>

              {/* Includes */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Nội dung bao gồm:</h4>
                <div className="space-y-2">
                  {selectedBackup.includes.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <CheckCircle className="size-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {selectedBackup.status === 'success' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(selectedBackup)}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="size-4" />
                    Tải xuống
                  </button>
                  <button
                    onClick={() => handleRestore(selectedBackup)}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="size-4" />
                    Khôi phục
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Backup Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Tạo bản sao lưu mới</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>📦 Sẽ sao lưu:</strong> Database, User Data, Exam Files, AI Logs, System Config
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Lưu ý:</strong> Quá trình sao lưu có thể mất vài phút. Hệ thống vẫn hoạt động bình thường trong thời gian này.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateBackup}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="size-4" />
                  Tạo ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Cấu hình sao lưu tự động</h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="size-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">Kích hoạt sao lưu tự động</p>
                    <p className="text-sm text-gray-600">Tự động sao lưu theo lịch đã cấu hình</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tần suất</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Hàng ngày</option>
                    <option>Hàng tuần</option>
                    <option>Hàng tháng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                  <input
                    type="time"
                    defaultValue="03:00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lưu giữ (ngày)</label>
                <input
                  type="number"
                  defaultValue={30}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Các bản sao lưu cũ hơn sẽ tự động bị xóa</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    alert('Cấu hình đã được lưu!');
                    setShowConfigModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="size-4" />
                  Lưu cấu hình
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
