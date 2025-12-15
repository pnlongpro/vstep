import { useState } from 'react';
import { Search, Download, Plus, Mail, Lock, MoreVertical, Users, UserCheck, UserX, TrendingUp, Eye, Edit, Trash2, X, Shield, Activity, Clock, BarChart, Upload, Calendar, Smartphone } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ResetLoginModal } from './ResetLoginModal';
import { AccountExpiryModal } from './AccountExpiryModal';
import { DeviceLimitModal } from './DeviceLimitModal';

export function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterActivity, setFilterActivity] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showResetLoginModal, setShowResetLoginModal] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [showDeviceLimitModal, setShowDeviceLimitModal] = useState(false);
  const [resetLoginUser, setResetLoginUser] = useState<any>(null);
  const [expiryUser, setExpiryUser] = useState<any>(null);
  const [deviceLimitUser, setDeviceLimitUser] = useState<any>(null);
  const itemsPerPage = 10;

  // Mock data
  const userStats = [
    { title: 'Tổng người dùng', value: '15,234', change: '+12.5%', icon: Users, color: 'from-blue-500 to-blue-600' },
    { title: 'Đang hoạt động', value: '12,456', change: '+8.2%', icon: UserCheck, color: 'from-green-500 to-green-600' },
    { title: 'Không hoạt động', value: '2,778', change: '-3.1%', icon: UserX, color: 'from-gray-500 to-gray-600' },
    { title: 'Mới 7 ngày', value: '1,234', change: '+18.3%', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
  ];

  const users = [
    { 
      id: 1, 
      name: 'Nguyễn Văn A', 
      email: 'nguyenvana@example.com', 
      phone: '0901234567',
      role: 'Student', 
      status: 'active', 
      created: '2024-01-15', 
      lastLogin: '2 giờ trước',
      avatar: '👨',
      testsTaken: 45,
      skillsData: [
        { skill: 'Reading', score: 7.5 },
        { skill: 'Listening', score: 6.8 },
        { skill: 'Writing', score: 7.2 },
        { skill: 'Speaking', score: 6.5 },
      ]
    },
    { 
      id: 2, 
      name: 'Trần Thị B', 
      email: 'tranthib@example.com', 
      phone: '0902345678',
      role: 'Teacher', 
      status: 'active', 
      created: '2024-02-20', 
      lastLogin: '5 giờ trước',
      avatar: '👩',
      classesAssigned: 5,
      totalStudents: 156
    },
    { 
      id: 3, 
      name: 'Lê Văn C', 
      email: 'levanc@example.com', 
      phone: '0903456789',
      role: 'Student', 
      status: 'inactive', 
      created: '2024-03-10', 
      lastLogin: '2 tuần trước',
      avatar: '👨',
      testsTaken: 12,
      skillsData: [
        { skill: 'Reading', score: 5.5 },
        { skill: 'Listening', score: 6.0 },
        { skill: 'Writing', score: 5.8 },
        { skill: 'Speaking', score: 5.2 },
      ]
    },
    { 
      id: 4, 
      name: 'Phạm Thị D', 
      email: 'phamthid@example.com', 
      phone: '0904567890',
      role: 'Admin', 
      status: 'active', 
      created: '2024-04-05', 
      lastLogin: '30 phút trước',
      avatar: '👩'
    },
    { 
      id: 5, 
      name: 'Hoàng Văn E', 
      email: 'hoangvane@example.com', 
      phone: '0905678901',
      role: 'Student', 
      status: 'banned', 
      created: '2024-05-12', 
      lastLogin: '1 tháng trước',
      avatar: '👨',
      testsTaken: 8
    },
    { 
      id: 6, 
      name: 'Content Uploader 01', 
      email: 'uploader01@vstepro.com', 
      phone: '0906789012',
      role: 'Uploader', 
      status: 'active', 
      created: '2024-10-01', 
      lastLogin: '1 giờ trước',
      avatar: '📤',
      examsUploaded: 127,
      examsApproved: 98,
      examsPending: 15,
      examsRejected: 14,
      approvalRate: 77.2
    },
    { 
      id: 7, 
      name: 'Content Uploader 02', 
      email: 'uploader02@vstepro.com', 
      phone: '0907890123',
      role: 'Uploader', 
      status: 'active', 
      created: '2024-10-15', 
      lastLogin: '3 giờ trước',
      avatar: '📤',
      examsUploaded: 89,
      examsApproved: 72,
      examsPending: 8,
      examsRejected: 9,
      approvalRate: 80.9
    },
    { 
      id: 8, 
      name: 'Content Uploader 03', 
      email: 'uploader03@vstepro.com', 
      phone: '0908901234',
      role: 'Uploader', 
      status: 'inactive', 
      created: '2024-11-01', 
      lastLogin: '1 tuần trước',
      avatar: '📤',
      examsUploaded: 45,
      examsApproved: 38,
      examsPending: 2,
      examsRejected: 5,
      approvalRate: 84.4
    },
  ];

  const loginHistory = [
    { date: '2024-12-11 14:30', ip: '192.168.1.1', device: 'Chrome - Windows', status: 'success' },
    { date: '2024-12-10 09:15', ip: '192.168.1.1', device: 'Mobile App - iOS', status: 'success' },
    { date: '2024-12-09 18:45', ip: '192.168.1.2', device: 'Firefox - MacOS', status: 'failed' },
    { date: '2024-12-08 11:20', ip: '192.168.1.1', device: 'Chrome - Windows', status: 'success' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.phone.includes(searchQuery);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-3">
                <Icon className="size-10 opacity-80" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{stat.change}</span>
              </div>
              <h3 className="text-3xl mb-1">{stat.value}</h3>
              <p className="text-sm opacity-90">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="Student">Học viên</option>
            <option value="Teacher">Giáo viên</option>
            <option value="Admin">Quản trị</option>
            <option value="Uploader">Uploader</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="banned">Đã cấm</option>
          </select>

          {/* Activity Filter */}
          <select
            value={filterActivity}
            onChange={(e) => setFilterActivity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả</option>
            <option value="7days">Hoạt động 7 ngày</option>
            <option value="30days">Hoạt động 30 ngày</option>
          </select>

          {/* Add User Button */}
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            <Plus className="size-4" />
            Thêm người dùng
          </button>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
            <Download className="size-4" />
            Xuất file
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Người dùng</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Số điện thoại</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Vai trò</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Trạng thái</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Ngày tạo</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Đăng nhập</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.phone}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'Admin' ? 'bg-red-100 text-red-700' :
                      user.role === 'Teacher' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'Uploader' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'Admin' ? 'Quản trị' :
                       user.role === 'Teacher' ? 'Giáo viên' :
                       user.role === 'Uploader' ? 'Uploader' :
                       'Học viên'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-700' : 
                      user.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {user.status === 'active' ? 'Hoạt động' :
                       user.status === 'inactive' ? 'Tạm ngưng' :
                       'Đã cấm'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.created}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="p-1 hover:bg-gray-200 rounded" 
                        title="Xem chi tiết"
                      >
                        <Eye className="size-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded" title="Chỉnh sửa">
                        <Edit className="size-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => {
                          setResetLoginUser(user);
                          setShowResetLoginModal(true);
                        }}
                        className="p-1 hover:bg-gray-200 rounded" 
                        title="Reset đăng nhập"
                      >
                        <Lock className="size-4 text-orange-600" />
                      </button>
                      <button 
                        onClick={() => {
                          setExpiryUser(user);
                          setShowExpiryModal(true);
                        }}
                        className="p-1 hover:bg-gray-200 rounded" 
                        title="Quản lý hạn tài khoản"
                      >
                        <Calendar className="size-4 text-blue-600" />
                      </button>
                      <button 
                        onClick={() => {
                          setDeviceLimitUser(user);
                          setShowDeviceLimitModal(true);
                        }}
                        className="p-1 hover:bg-gray-200 rounded" 
                        title="Quản lý số thiết bị"
                      >
                        <Smartphone className="size-4 text-green-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded" title="Xóa">
                        <Trash2 className="size-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, filteredUsers.length)} trong tổng số {filteredUsers.length} người dùng
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Trước
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Sidebar */}
      {selectedUser && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedUser(null)} />
          <div className="fixed right-0 top-0 h-full w-full lg:w-[600px] bg-white z-50 overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl">Chi tiết người dùng</h3>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Info */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  {selectedUser.avatar}
                </div>
                <h2 className="text-2xl mb-2">{selectedUser.name}</h2>
                <p className="opacity-90 mb-1">{selectedUser.email}</p>
                <p className="opacity-90">{selectedUser.phone}</p>
              </div>

              {/* Role & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Vai trò</label>
                  <select 
                    defaultValue={selectedUser.role}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Student">Học viên</option>
                    <option value="Teacher">Giáo viên</option>
                    <option value="Admin">Quản trị</option>
                    <option value="Uploader">Uploader</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Trạng thái</label>
                  <select 
                    defaultValue={selectedUser.status}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm ngưng</option>
                    <option value="banned">Đã cấm</option>
                  </select>
                </div>
              </div>

              {/* Student Stats */}
              {selectedUser.role === 'Student' && selectedUser.skillsData && (
                <>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm mb-4">Thống kê học tập</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Bài thi đã làm</p>
                        <p className="text-2xl">{selectedUser.testsTaken}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Điểm trung bình</p>
                        <p className="text-2xl">6.8</p>
                      </div>
                    </div>
                    
                    {/* Skills Radar Chart */}
                    <div className="mt-4">
                      <p className="text-xs text-gray-600 mb-2">Biểu đồ kỹ năng</p>
                      <ResponsiveContainer width="100%" height={250}>
                        <RadarChart data={selectedUser.skillsData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="skill" />
                          <PolarRadiusAxis angle={90} domain={[0, 10]} />
                          <Radar name="Điểm" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent Activities */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm mb-4">Hoạt động gần đây</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Activity className="size-4 text-green-600" />
                        <p className="flex-1">Hoàn thành bài thi Reading B2</p>
                        <span className="text-xs text-gray-500">2h trước</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Activity className="size-4 text-blue-600" />
                        <p className="flex-1">Làm bài tập Writing Task 1</p>
                        <span className="text-xs text-gray-500">1 ngày trước</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Activity className="size-4 text-purple-600" />
                        <p className="flex-1">Xem video Speaking Tips</p>
                        <span className="text-xs text-gray-500">2 ngày trước</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Teacher Stats */}
              {selectedUser.role === 'Teacher' && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="text-sm mb-4">Thống kê giảng dạy</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Lớp học</p>
                      <p className="text-2xl">{selectedUser.classesAssigned}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Tổng học viên</p>
                      <p className="text-2xl">{selectedUser.totalStudents}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Uploader Stats */}
              {selectedUser.role === 'Uploader' && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="text-sm mb-4">Thống kê tải lên</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Bài thi đã tải lên</p>
                      <p className="text-2xl">{selectedUser.examsUploaded}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Bài thi đã duyệt</p>
                      <p className="text-2xl">{selectedUser.examsApproved}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Bài thi chờ duyệt</p>
                      <p className="text-2xl">{selectedUser.examsPending}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Bài thi bị từ chối</p>
                      <p className="text-2xl">{selectedUser.examsRejected}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Tỷ lệ duyệt</p>
                      <p className="text-2xl">{selectedUser.approvalRate}%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Login History */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm mb-4">Lịch sử đăng nhập</h4>
                <div className="space-y-3">
                  {loginHistory.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="size-4 text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm">{log.device}</p>
                        <p className="text-xs text-gray-500">{log.date} - IP: {log.ip}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {log.status === 'success' ? 'Thành công' : 'Thất bại'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Lưu thay đổi
                </button>
                <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
                  Reset mật khẩu
                </button>
                <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                  Cấm người dùng
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowAddModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl">Thêm người dùng mới</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="size-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Họ và tên</label>
                <input
                  type="text"
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="0901234567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Mật khẩu</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Vai trò</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Student">Học viên</option>
                  <option value="Teacher">Giáo viên</option>
                  <option value="Admin">Quản trị</option>
                  <option value="Uploader">Uploader</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Trạng thái</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm ngưng</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Thêm người dùng
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Reset Login Modal */}
      {showResetLoginModal && resetLoginUser && (
        <ResetLoginModal
          isOpen={showResetLoginModal}
          userName={resetLoginUser.name}
          onClose={() => {
            setShowResetLoginModal(false);
            setResetLoginUser(null);
          }}
          onConfirm={() => {
            console.log('Reset login sessions for:', resetLoginUser.name);
            // Add API call here
          }}
        />
      )}

      {/* Account Expiry Modal */}
      {showExpiryModal && expiryUser && (
        <AccountExpiryModal
          isOpen={showExpiryModal}
          userName={expiryUser.name}
          currentExpiry="16/12/2025 00:00:00"
          daysRemaining={3}
          planDays={30}
          onClose={() => {
            setShowExpiryModal(false);
            setExpiryUser(null);
          }}
          onSave={(mode, value) => {
            console.log('Save expiry for:', expiryUser.name, 'Mode:', mode, 'Value:', value);
            // Add API call here
          }}
        />
      )}

      {/* Device Limit Modal */}
      {showDeviceLimitModal && deviceLimitUser && (
        <DeviceLimitModal
          isOpen={showDeviceLimitModal}
          userName={deviceLimitUser.name}
          userEmail={deviceLimitUser.email}
          devices={[
            {
              id: '1',
              name: 'Windows PC - Chrome',
              type: 'desktop',
              browser: 'Chrome 120.0',
              os: 'Windows 11',
              ip: '192.168.1.100',
              location: 'Hà Nội, Việt Nam',
              lastActive: '2 phút trước',
              loginTime: '13/12/2024 09:30',
              isCurrentDevice: true
            },
            {
              id: '2',
              name: 'iPhone 15 Pro - Safari',
              type: 'mobile',
              browser: 'Safari 17.2',
              os: 'iOS 17.2',
              ip: '192.168.1.101',
              location: 'Hà Nội, Việt Nam',
              lastActive: '1 giờ trước',
              loginTime: '12/12/2024 18:45',
              isCurrentDevice: false
            }
          ]}
          maxDevices={2}
          onClose={() => {
            setShowDeviceLimitModal(false);
            setDeviceLimitUser(null);
          }}
          onLogoutDevice={(deviceId) => {
            console.log('Logout device:', deviceId);
            // Add API call here
          }}
          onLogoutAll={() => {
            console.log('Logout all devices for:', deviceLimitUser.name);
            // Add API call here
          }}
          onUpdateLimit={(newLimit) => {
            console.log('Update device limit to:', newLimit);
            // Add API call here
          }}
        />
      )}
    </div>
  );
}