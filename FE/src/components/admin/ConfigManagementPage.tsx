import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Settings, Search } from 'lucide-react';

interface ConfigItem {
  id: number;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export function ConfigManagementPage() {
  const [configs, setConfigs] = useState<ConfigItem[]>([
    { id: 1, key: 'Đường dẫn website', value: 'https://aptispro.vn', createdAt: '2025-04-20T16:25:23.112Z', updatedAt: '2025-04-20T16:25:23.112Z' },
    { id: 2, key: 'Tên website', value: 'Aptis Pro', createdAt: '2025-04-20T16:25:23.125Z', updatedAt: '2025-04-20T16:25:23.125Z' },
    { id: 3, key: 'Email quản trị', value: 'Aptispro.vn@gmail.com', createdAt: '2025-07-11T15:58:48.759Z', updatedAt: '2025-07-24T17:04:18.000Z' },
    { id: 4, key: 'Nguồn CORS cho phép', value: 'http://localhost:5173 https://aptispro.vn', createdAt: '2025-09-13T16:16:20.523Z', updatedAt: '2025-09-13T16:16:20.523Z' },
    { id: 5, key: 'Vô hiệu hóa người dùng sau (ngày)', value: '40', createdAt: '2025-05-12T19:50:54.243Z', updatedAt: '2025-10-01T11:48:19.000Z' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const filteredConfigs = configs.filter(config =>
    config.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    config.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (config: ConfigItem) => {
    setEditingId(config.id);
    setEditValue(config.value);
  };

  const handleSave = (id: number) => {
    setConfigs(configs.map(config =>
      config.id === id
        ? { ...config, value: editValue, updatedAt: new Date().toISOString() }
        : config
    ));
    setEditingId(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa cấu hình này?')) {
      setConfigs(configs.filter(config => config.id !== id));
    }
  };

  const handleAddConfig = () => {
    if (!newKey || !newValue) {
      alert('Vui lòng nhập đầy đủ Tên cấu hình và Giá trị');
      return;
    }

    const newConfig: ConfigItem = {
      id: Math.max(...configs.map(c => c.id)) + 1,
      key: newKey,
      value: newValue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setConfigs([...configs, newConfig]);
    setShowAddModal(false);
    setNewKey('');
    setNewValue('');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Settings className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý cấu hình</h2>
            <p className="text-sm text-gray-600">Cấu hình các thiết lập hệ thống</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="size-4" />
          Thêm cấu hình
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo Key hoặc Value..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Config Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Key</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Giá trị</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Ngày tạo</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Cập nhật lúc</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredConfigs.map((config) => (
                <tr key={config.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm text-gray-900">{config.key}</span>
                  </td>
                  <td className="py-4 px-6">
                    {editingId === config.id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm text-gray-700">{config.value}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {formatDateTime(config.createdAt)}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {formatDateTime(config.updatedAt)}
                  </td>
                  <td className="py-4 px-6">
                    {editingId === config.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSave(config.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Lưu"
                        >
                          <Save className="size-4" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Hủy"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(config)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(config.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredConfigs.length === 0 && (
          <div className="text-center py-12">
            <Settings className="size-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Không tìm thấy cấu hình nào</p>
          </div>
        )}
      </div>

      {/* Add Config Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Thêm cấu hình mới</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewKey('');
                  setNewValue('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên cấu hình <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Ví dụ: Kích thước tối đa file upload"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá trị <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Ví dụ: 10485760"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewKey('');
                  setNewValue('');
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleAddConfig}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="size-4" />
                Thêm cấu hình
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}