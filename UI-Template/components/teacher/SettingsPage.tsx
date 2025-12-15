import { useState } from 'react';
import { Settings, User, Bell, Lock, Eye, EyeOff, Save } from 'lucide-react';

export function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');

  const tabs = [
    { id: 'profile' as const, label: 'Thông tin cá nhân', icon: User },
    { id: 'notifications' as const, label: 'Thông báo', icon: Bell },
    { id: 'security' as const, label: 'Bảo mật', icon: Lock }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl mb-2">Cài đặt</h2>
        <p className="text-gray-600">Quản lý thông tin và tùy chọn của bạn</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <div className="flex gap-2 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="size-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-4xl">
                  👨‍🏫
                </div>
                <div>
                  <h3 className="mb-2">Ảnh đại diện</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                      Thay đổi ảnh
                    </button>
                    <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Xóa ảnh
                    </button>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Họ và tên</label>
                  <input
                    type="text"
                    defaultValue="Nguyễn Văn Giáo Viên"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Email</label>
                  <input
                    type="email"
                    defaultValue="teacher@vstepro.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Số điện thoại</label>
                  <input
                    type="tel"
                    defaultValue="0912345678"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Chức vụ</label>
                  <input
                    type="text"
                    defaultValue="Giáo viên"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Giới thiệu bản thân</label>
                <textarea
                  rows={4}
                  defaultValue="Giáo viên VSTEP với 5 năm kinh nghiệm giảng dạy tiếng Anh"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  <Save className="size-5" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4">Email thông báo</h3>
                <div className="space-y-3">
                  {[
                    { id: 'new-submission', label: 'Bài nộp mới', description: 'Nhận email khi có bài nộp mới' },
                    { id: 'new-message', label: 'Tin nhắn mới', description: 'Nhận email khi có tin nhắn mới' },
                    { id: 'class-updates', label: 'Cập nhật lớp học', description: 'Nhận email về các thay đổi trong lớp' },
                    { id: 'weekly-summary', label: 'Tóm tắt tuần', description: 'Nhận báo cáo tổng kết hàng tuần' }
                  ].map((item) => (
                    <label key={item.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm mb-1">{item.label}</p>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4">Push notifications</h3>
                <div className="space-y-3">
                  {[
                    { id: 'push-submissions', label: 'Bài nộp mới', description: 'Hiển thị thông báo trên trình duyệt' },
                    { id: 'push-messages', label: 'Tin nhắn mới', description: 'Hiển thị thông báo tin nhắn' },
                    { id: 'push-reminders', label: 'Nhắc nhở', description: 'Nhắc nhở về lịch dạy và deadline' }
                  ].map((item) => (
                    <label key={item.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm mb-1">{item.label}</p>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  <Save className="size-5" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4">Đổi mật khẩu</h3>
                <div className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Mật khẩu hiện tại</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-2.5 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Mật khẩu mới</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Xác nhận mật khẩu mới</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="mb-4">Xác thực hai yếu tố</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-w-xl">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="two-factor"
                      className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <label htmlFor="two-factor" className="text-sm cursor-pointer block mb-1">
                        Bật xác thực hai yếu tố
                      </label>
                      <p className="text-xs text-gray-600">
                        Thêm một lớp bảo mật cho tài khoản của bạn
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="mb-4">Phiên đăng nhập</h3>
                <div className="space-y-3 max-w-xl">
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm mb-1">Windows - Chrome</p>
                      <p className="text-xs text-gray-600">Địa chỉ IP: 192.168.1.1 • Đang hoạt động</p>
                    </div>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Hiện tại</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm mb-1">iPhone - Safari</p>
                      <p className="text-xs text-gray-600">Địa chỉ IP: 192.168.1.2 • 2 giờ trước</p>
                    </div>
                    <button className="text-xs text-red-600 hover:text-red-700">Đăng xuất</button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  <Save className="size-5" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
