import { useState } from 'react';
import { UserPlus, Search, Mail, Phone, Calendar, TrendingUp, Gift, Lock, Unlock, Eye, Download, Filter, ChevronDown, ChevronUp, Clock, Award, MessageSquare, FileText, Mic } from 'lucide-react';

interface FreeUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
  lastActive: string;
  status: 'active' | 'inactive';
  usage: {
    mockTests: number;
    aiSpeaking: number;
    aiWriting: number;
  };
  limits: {
    mockTests: number;
    aiSpeaking: number;
    aiWriting: number;
  };
}

export function FreeAccountManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<FreeUser | null>(null);

  const [freeUsers, setFreeUsers] = useState<FreeUser[]>([
    {
      id: 1,
      name: 'Nguyễn Văn An',
      email: 'nguyenvanan@gmail.com',
      phone: '0901234567',
      registeredDate: '2025-01-15',
      lastActive: '2 giờ trước',
      status: 'active',
      usage: { mockTests: 2, aiSpeaking: 1, aiWriting: 0 },
      limits: { mockTests: 3, aiSpeaking: 1, aiWriting: 1 },
    },
    {
      id: 2,
      name: 'Trần Thị Bình',
      email: 'tranthibinh@gmail.com',
      phone: '0912345678',
      registeredDate: '2025-01-14',
      lastActive: '1 ngày trước',
      status: 'active',
      usage: { mockTests: 3, aiSpeaking: 1, aiWriting: 1 },
      limits: { mockTests: 3, aiSpeaking: 1, aiWriting: 1 },
    },
    {
      id: 3,
      name: 'Lê Hoàng Cường',
      email: 'lehoangcuong@gmail.com',
      phone: '0923456789',
      registeredDate: '2025-01-10',
      lastActive: '5 ngày trước',
      status: 'inactive',
      usage: { mockTests: 1, aiSpeaking: 0, aiWriting: 0 },
      limits: { mockTests: 3, aiSpeaking: 1, aiWriting: 1 },
    },
    {
      id: 4,
      name: 'Phạm Thị Dung',
      email: 'phamthidung@gmail.com',
      phone: '0934567890',
      registeredDate: '2025-01-12',
      lastActive: '3 giờ trước',
      status: 'active',
      usage: { mockTests: 0, aiSpeaking: 0, aiWriting: 1 },
      limits: { mockTests: 3, aiSpeaking: 1, aiWriting: 1 },
    },
    {
      id: 5,
      name: 'Hoàng Văn Em',
      email: 'hoangvanem@gmail.com',
      phone: '0945678901',
      registeredDate: '2025-01-08',
      lastActive: '1 tuần trước',
      status: 'inactive',
      usage: { mockTests: 3, aiSpeaking: 1, aiWriting: 1 },
      limits: { mockTests: 3, aiSpeaking: 1, aiWriting: 1 },
    },
    {
      id: 6,
      name: 'Đỗ Thị Phương',
      email: 'dothiphuong@gmail.com',
      phone: '0956789012',
      registeredDate: '2025-01-13',
      lastActive: '30 phút trước',
      status: 'active',
      usage: { mockTests: 1, aiSpeaking: 1, aiWriting: 0 },
      limits: { mockTests: 3, aiSpeaking: 1, aiWriting: 1 },
    },
  ]);

  const filteredUsers = freeUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: freeUsers.length,
    active: freeUsers.filter(u => u.status === 'active').length,
    inactive: freeUsers.filter(u => u.status === 'inactive').length,
    newThisWeek: freeUsers.filter(u => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(u.registeredDate) > weekAgo;
    }).length,
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 100) return 'text-red-600 bg-red-100';
    if (percentage >= 75) return 'text-orange-600 bg-orange-100';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Gift className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý tài khoản miễn phí</h2>
            <p className="text-sm text-gray-600">Theo dõi và quản lý người dùng gói Free</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <UserPlus className="size-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.total}</p>
          <p className="text-sm opacity-90">Tổng tài khoản Free</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="size-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.active}</p>
          <p className="text-sm opacity-90">Đang hoạt động</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock className="size-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.inactive}</p>
          <p className="text-sm opacity-90">Không hoạt động</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Award className="size-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.newThisWeek}</p>
          <p className="text-sm opacity-90">Đăng ký tuần này</p>
        </div>
      </div>

      {/* Free Plan Info Card */}
      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border-2 border-green-200">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Gift className="size-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">🎁 Gói miễn phí VSTEPRO</h3>
            <p className="text-gray-700 mb-4">
              Gói miễn phí được thiết kế để người dùng trải nghiệm các tính năng chính của hệ thống trước khi nâng cấp lên gói Premium.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mock Tests */}
              <div className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">3</p>
                    <p className="text-xs text-gray-600">bài Mock Test</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">Truy cập 3 bài thi thử hoàn chỉnh với chấm điểm tự động</p>
              </div>

              {/* AI Speaking */}
              <div className="bg-white rounded-xl p-4 border-2 border-purple-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Mic className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">1/ngày</p>
                    <p className="text-xs text-gray-600">AI Speaking</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">Luyện Speaking với AI và nhận feedback chi tiết mỗi ngày</p>
              </div>

              {/* AI Writing */}
              <div className="bg-white rounded-xl p-4 border-2 border-pink-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="size-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-pink-600">1/ngày</p>
                    <p className="text-xs text-gray-600">AI Writing</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">Chấm bài Writing tự động với AI và feedback cải thiện</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-100 border-2 border-green-300 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>💡 Mục tiêu:</strong> Gói miễn phí giúp thu hút người dùng mới, cho phép họ trải nghiệm đầy đủ các tính năng chính của VSTEPRO trước khi quyết định nâng cấp lên gói Premium để học tập không giới hạn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hoạt động ({stats.active})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'inactive'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Không hoạt động ({stats.inactive})
            </button>
          </div>

          {/* Export */}
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="size-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Người dùng</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Liên hệ</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Ngày đăng ký</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Hoạt động</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Mock Tests</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">AI Speaking</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">AI Writing</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Trạng thái</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  {/* User Info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail className="size-4 text-gray-400" />
                        <a href={`mailto:${user.email}`} className="hover:text-green-600 hover:underline">
                          {user.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="size-4 text-gray-400" />
                        <a href={`tel:${user.phone}`} className="hover:text-green-600 hover:underline">
                          {user.phone}
                        </a>
                      </div>
                    </div>
                  </td>

                  {/* Registration Date */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="size-4 text-gray-400" />
                      {new Date(user.registeredDate).toLocaleDateString('vi-VN')}
                    </div>
                  </td>

                  {/* Last Active */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{user.lastActive}</span>
                    </div>
                  </td>

                  {/* Mock Tests Usage */}
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className={`font-medium ${getUsageColor(user.usage.mockTests, user.limits.mockTests)}`}>
                          {user.usage.mockTests}/{user.limits.mockTests}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getUsagePercentage(user.usage.mockTests, user.limits.mockTests)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            user.usage.mockTests >= user.limits.mockTests
                              ? 'bg-red-500'
                              : user.usage.mockTests >= user.limits.mockTests * 0.75
                              ? 'bg-orange-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${getUsagePercentage(user.usage.mockTests, user.limits.mockTests)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* AI Speaking Usage */}
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className={`font-medium ${getUsageColor(user.usage.aiSpeaking, user.limits.aiSpeaking)}`}>
                          {user.usage.aiSpeaking}/{user.limits.aiSpeaking}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getUsagePercentage(user.usage.aiSpeaking, user.limits.aiSpeaking)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            user.usage.aiSpeaking >= user.limits.aiSpeaking
                              ? 'bg-red-500'
                              : 'bg-purple-500'
                          }`}
                          style={{ width: `${getUsagePercentage(user.usage.aiSpeaking, user.limits.aiSpeaking)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* AI Writing Usage */}
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className={`font-medium ${getUsageColor(user.usage.aiWriting, user.limits.aiWriting)}`}>
                          {user.usage.aiWriting}/{user.limits.aiWriting}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getUsagePercentage(user.usage.aiWriting, user.limits.aiWriting)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            user.usage.aiWriting >= user.limits.aiWriting
                              ? 'bg-red-500'
                              : 'bg-pink-500'
                          }`}
                          style={{ width: `${getUsagePercentage(user.usage.aiWriting, user.limits.aiWriting)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {user.status === 'active' ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          Hoạt động
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-gray-500 rounded-full" />
                          Không hoạt động
                        </>
                      )}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Gửi email"
                      >
                        <Mail className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Gift className="size-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Không tìm thấy người dùng nào</p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Chi tiết người dùng Free</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronUp className="size-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border-2 border-green-200">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900">{selectedUser.name}</h4>
                  <p className="text-sm text-gray-600">ID: {selectedUser.id}</p>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      selectedUser.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {selectedUser.status === 'active' ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Hoạt động
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-gray-500 rounded-full" />
                        Không hoạt động
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">Thông tin liên hệ</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="size-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Email</p>
                      <a href={`mailto:${selectedUser.email}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                        {selectedUser.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="size-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Số điện thoại</p>
                      <a href={`tel:${selectedUser.phone}`} className="text-sm font-medium text-gray-900 hover:text-green-600">
                        {selectedUser.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="size-5 text-purple-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Ngày đăng ký</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedUser.registeredDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="size-5 text-orange-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Hoạt động gần nhất</p>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.lastActive}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Statistics */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">Thống kê sử dụng</h5>
                <div className="space-y-3">
                  {/* Mock Tests */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="size-5 text-blue-600" />
                        <span className="font-medium text-gray-900">Mock Tests</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        {selectedUser.usage.mockTests}/{selectedUser.limits.mockTests}
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${getUsagePercentage(selectedUser.usage.mockTests, selectedUser.limits.mockTests)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {getUsagePercentage(selectedUser.usage.mockTests, selectedUser.limits.mockTests)}% đã sử dụng
                    </p>
                  </div>

                  {/* AI Speaking */}
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Mic className="size-5 text-purple-600" />
                        <span className="font-medium text-gray-900">AI Speaking (hôm nay)</span>
                      </div>
                      <span className="text-sm font-bold text-purple-600">
                        {selectedUser.usage.aiSpeaking}/{selectedUser.limits.aiSpeaking}
                      </span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-3">
                      <div
                        className="bg-purple-600 h-3 rounded-full transition-all"
                        style={{ width: `${getUsagePercentage(selectedUser.usage.aiSpeaking, selectedUser.limits.aiSpeaking)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {getUsagePercentage(selectedUser.usage.aiSpeaking, selectedUser.limits.aiSpeaking)}% đã sử dụng
                    </p>
                  </div>

                  {/* AI Writing */}
                  <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="size-5 text-pink-600" />
                        <span className="font-medium text-gray-900">AI Writing (hôm nay)</span>
                      </div>
                      <span className="text-sm font-bold text-pink-600">
                        {selectedUser.usage.aiWriting}/{selectedUser.limits.aiWriting}
                      </span>
                    </div>
                    <div className="w-full bg-pink-200 rounded-full h-3">
                      <div
                        className="bg-pink-600 h-3 rounded-full transition-all"
                        style={{ width: `${getUsagePercentage(selectedUser.usage.aiWriting, selectedUser.limits.aiWriting)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {getUsagePercentage(selectedUser.usage.aiWriting, selectedUser.limits.aiWriting)}% đã sử dụng
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Mail className="size-4" />
                  Gửi Email
                </button>
                <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <Phone className="size-4" />
                  Gọi điện
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
