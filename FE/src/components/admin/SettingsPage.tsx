import { useState } from 'react';
import { Settings, Bell, Shield, Database, Mail, Globe, CreditCard, Users, Save } from 'lucide-react';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'Cài đặt chung', icon: Settings },
    { id: 'notifications', name: 'Thông báo', icon: Bell },
    { id: 'security', name: 'Bảo mật', icon: Shield },
    { id: 'database', name: 'Cơ sở dữ liệu', icon: Database },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'localization', name: 'Ngôn ngữ & Vùng', icon: Globe },
    { id: 'payment', name: 'Thanh toán', icon: CreditCard },
    { id: 'users', name: 'Quản lý người dùng', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl mb-2">Cài đặt hệ thống</h2>
        <p className="text-sm text-gray-600">Quản lý và cấu hình các thiết lập hệ thống VSTEPRO</p>
      </div>

      {/* Tabs & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4">
              <h3 className="text-sm text-gray-600 mb-3">Danh mục</h3>
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="size-4" />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg mb-4">Cài đặt chung</h3>
                
                <div>
                  <label className="block text-sm mb-2">Tên hệ thống</label>
                  <input
                    type="text"
                    defaultValue="VSTEPRO"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Slogan</label>
                  <input
                    type="text"
                    defaultValue="Nền tảng luyện thi VSTEP hàng đầu Việt Nam"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Logo URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Timezone</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh (GMT+7)</option>
                    <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                    <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm">Chế độ bảo trì</p>
                    <p className="text-xs text-gray-600">Tạm thời tắt hệ thống để bảo trì</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Save className="size-4" />
                  Lưu thay đổi
                </button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg mb-4">Cài đặt thông báo</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm">Thông báo email</p>
                      <p className="text-xs text-gray-600">Gửi email thông báo cho người dùng</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm">Thông báo đẩy</p>
                      <p className="text-xs text-gray-600">Gửi push notification cho ứng dụng mobile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm">Thông báo SMS</p>
                      <p className="text-xs text-gray-600">Gửi tin nhắn SMS cho người dùng</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm">Nhắc nhở học tập</p>
                      <p className="text-xs text-gray-600">Gửi nhắc nhở hàng ngày cho học viên</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Save className="size-4" />
                  Lưu thay đổi
                </button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg mb-4">Cài đặt bảo mật</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm">Xác thực 2 yếu tố (2FA)</p>
                      <p className="text-xs text-gray-600">Yêu cầu mã xác thực khi đăng nhập</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Độ dài mật khẩu tối thiểu</label>
                    <input
                      type="number"
                      defaultValue="8"
                      min="6"
                      max="20"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Thời gian hết hạn phiên (phút)</label>
                    <input
                      type="number"
                      defaultValue="30"
                      min="5"
                      max="120"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm">Giới hạn số lần đăng nhập sai</p>
                      <p className="text-xs text-gray-600">Khóa tài khoản sau số lần đăng nhập sai</p>
                    </div>
                    <input
                      type="number"
                      defaultValue="5"
                      min="3"
                      max="10"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Save className="size-4" />
                  Lưu thay đổi
                </button>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-6">
                <h3 className="text-lg mb-4">Cài đặt cơ sở dữ liệu</h3>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">Kết nối database: <span className="font-medium">PostgreSQL</span></p>
                  <p className="text-xs text-blue-700 mt-1">Host: db.vstepro.com | Port: 5432</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm">Tự động backup</p>
                      <p className="text-xs text-gray-600">Backup database hàng ngày</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Thời gian backup</label>
                    <input
                      type="time"
                      defaultValue="02:00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Số lượng backup lưu trữ</label>
                    <input
                      type="number"
                      defaultValue="7"
                      min="1"
                      max="30"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Database className="size-4" />
                    Backup ngay
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Save className="size-4" />
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-6">
                <h3 className="text-lg mb-4">Cài đặt Email</h3>
                
                <div>
                  <label className="block text-sm mb-2">SMTP Server</label>
                  <input
                    type="text"
                    defaultValue="smtp.gmail.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Port</label>
                    <input
                      type="number"
                      defaultValue="587"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Encryption</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Email gửi đi</label>
                  <input
                    type="email"
                    defaultValue="noreply@vstepro.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Tên người gửi</label>
                  <input
                    type="text"
                    defaultValue="VSTEPRO Team"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Save className="size-4" />
                  Lưu thay đổi
                </button>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h3 className="text-lg mb-4">Cài đặt thanh toán</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm">Cổng thanh toán VNPay</p>
                      <p className="text-xs text-gray-600">Kích hoạt thanh toán qua VNPay</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm">Cổng thanh toán MoMo</p>
                      <p className="text-xs text-gray-600">Kích hoạt thanh toán qua MoMo</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm">Cổng thanh toán ZaloPay</p>
                      <p className="text-xs text-gray-600">Kích hoạt thanh toán qua ZaloPay</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Đơn vị tiền tệ</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="VND">VND - Việt Nam Đồng</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>

                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Save className="size-4" />
                  Lưu thay đổi
                </button>
              </div>
            )}

            {['localization', 'users'].includes(activeTab) && (
              <div className="text-center py-12">
                <p className="text-gray-600">Tính năng đang được phát triển...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
