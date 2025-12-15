import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Award, ArrowUp, ArrowDown, AlertTriangle, Mic, FileText, UserX, Wallet, ArrowRight, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AdminDashboardPage() {
  // Mock data for charts
  const revenueData = [
    { month: 'T1', revenue: 45000 },
    { month: 'T2', revenue: 52000 },
    { month: 'T3', revenue: 48000 },
    { month: 'T4', revenue: 61000 },
    { month: 'T5', revenue: 73000 },
    { month: 'T6', revenue: 89450 },
  ];

  const userGrowthData = [
    { month: 'T1', users: 1200 },
    { month: 'T2', users: 1890 },
    { month: 'T3', users: 2340 },
    { month: 'T4', users: 3120 },
    { month: 'T5', users: 4200 },
    { month: 'T6', users: 5234 },
  ];

  const subscriptionData = [
    { name: 'Miễn phí', value: 8234, color: '#94a3b8' },
    { name: 'Cơ bản', value: 4500, color: '#3b82f6' },
    { name: 'Pro', value: 2000, color: '#8b5cf6' },
    { name: 'Premium', value: 500, color: '#f59e0b' },
  ];

  const recentActivities = [
    { user: 'Nguyễn Văn A', action: 'Hoàn thành bài thi Writing', time: '2 phút trước', type: 'success' },
    { user: 'Trần Thị B', action: 'Bắt đầu luyện Speaking', time: '5 phút trước', type: 'info' },
    { user: 'Admin', action: 'Cập nhật ngân hàng câu hỏi', time: '10 phút trước', type: 'warning' },
    { user: 'Lê Văn C', action: 'Mua gói Premium', time: '15 phút trước', type: 'success' },
    { user: 'Phạm Thị D', action: 'Lỗi tải bài kiểm tra', time: '20 phút trước', type: 'error' },
  ];

  const systemHealth = [
    { service: 'API Server', status: 'hoạt động', uptime: '99.9%', color: 'bg-green-500' },
    { service: 'Database', status: 'hoạt động', uptime: '99.8%', color: 'bg-green-500' },
    { service: 'AI Service', status: 'hoạt động', uptime: '98.5%', color: 'bg-green-500' },
    { service: 'CDN', status: 'suy giảm', uptime: '95.2%', color: 'bg-yellow-500' },
  ];

  const stats = [
    {
      title: 'Tổng người dùng',
      value: '2,890',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-100',
    },
    {
      title: 'Bài thi đã làm',
      value: '12,456',
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-100',
    },
    {
      title: 'AI Scoring sử dụng',
      value: '3,245',
      change: '+15%',
      trend: 'up',
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-100',
    },
    {
      title: 'Doanh thu tháng này',
      value: '85M',
      change: '+18%',
      trend: 'up',
      icon: Award,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Priority Alerts */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="size-6 text-orange-600" />
          <div>
            <h3 className="text-lg font-bold text-gray-900">🔥 PRIORITY ALERTS - Cần xử lý ngay</h3>
            <p className="text-sm text-orange-700">⚠️ PENDING ACTIONS - Có 48 items cần xử lý ngay</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Speaking cần chấm */}
          <div className="bg-white rounded-xl p-5 border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Mic className="size-5 text-red-600" />
              <span className="text-sm text-gray-600">🎤 Speaking cần chấm</span>
            </div>
            <p className="text-3xl font-bold text-red-600 mb-2">40 bài</p>
            <p className="text-xs text-gray-500 mb-4">Oldest: 87 ngày trước</p>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
              Xem ngay
              <ArrowRight className="size-4" />
            </button>
          </div>

          {/* Writing cần chấm */}
          <div className="bg-white rounded-xl p-5 border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="size-5 text-orange-600" />
              <span className="text-sm text-gray-600">✍️ Writing cần chấm</span>
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-2">8 bài</p>
            <p className="text-xs text-gray-500 mb-4">Oldest: 87 ngày trước</p>
            <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
              Xem ngay
              <ArrowRight className="size-4" />
            </button>
          </div>

          {/* Students sắp hết hạn */}
          <div className="bg-white rounded-xl p-5 border-l-4 border-gray-400 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <UserX className="size-5 text-gray-600" />
              <span className="text-sm text-gray-600">⏰ Students sắp hết hạn</span>
            </div>
            <p className="text-3xl font-bold text-gray-700 mb-2">28 users</p>
            <p className="text-xs text-gray-500 mb-4">Expires in 7 days</p>
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
              Xem danh sách
              <ArrowRight className="size-4" />
            </button>
          </div>

          {/* AI Budget */}
          <div className="bg-white rounded-xl p-5 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="size-5 text-blue-600" />
              <span className="text-sm text-gray-600">💰 AI Budget</span>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">3.117%</p>
            <p className="text-xs text-gray-500 mb-1">$1,538 / $500 monthly limit</p>
            <div className="w-full bg-blue-100 rounded-full h-2 mb-3">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '3.117%' }}></div>
            </div>
            <p className="text-xs text-blue-700 font-medium">✅ Trong giới hạn</p>
          </div>
        </div>
      </div>

      {/* Time-based Metrics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="size-6 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">📊 TIME-BASED METRICS</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Hôm nay
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm text-gray-700">🎤 Speaking đã chấm</span>
                <span className="text-lg font-bold text-green-600">12</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm text-gray-700">✍️ Writing đã chấm</span>
                <span className="text-lg font-bold text-green-600">8</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm text-gray-700">👥 Users mới</span>
                <span className="text-lg font-bold text-green-600">24</span>
              </div>
            </div>
          </div>

          {/* This Week */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Tuần này
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm text-gray-700">🎤 Speaking đã chấm</span>
                <span className="text-lg font-bold text-blue-600">87</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm text-gray-700">✍️ Writing đã chấm</span>
                <span className="text-lg font-bold text-blue-600">64</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm text-gray-700">👥 Users mới</span>
                <span className="text-lg font-bold text-blue-600">156</span>
              </div>
            </div>
          </div>

          {/* This Month */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Tháng này
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-sm text-gray-700">🎤 Speaking đã chấm</span>
                <span className="text-lg font-bold text-purple-600">342</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-sm text-gray-700">✍️ Writing đã chấm</span>
                <span className="text-lg font-bold text-purple-600">278</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-sm text-gray-700">👥 Users mới</span>
                <span className="text-lg font-bold text-purple-600">624</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown;
          
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <Icon className="size-10 opacity-80" />
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                  stat.trend === 'up' ? 'bg-white/20' : 'bg-black/20'
                }`}>
                  <TrendIcon className="size-4" />
                  <span className="text-xs">{stat.change}</span>
                </div>
              </div>
              <h3 className="text-3xl mb-1">{stat.value}</h3>
              <p className={`text-sm ${stat.textColor}`}>{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="size-5 text-green-600" />
            Doanh thu (6 tháng)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <Users className="size-5 text-blue-600" />
            Tăng trưởng người dùng
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="users" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4">Phân bổ gói dịch vụ</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subscriptionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {subscriptionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {subscriptionData.map((sub, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sub.color }}></div>
                  <span>{sub.name}</span>
                </div>
                <span className="text-gray-600">{sub.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 lg:col-span-2">
          <h3 className="text-lg mb-4">Hoạt động gần đây</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'error' ? 'bg-red-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Giám sát hệ thống</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemHealth.map((service, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${service.color}`}></div>
                <span className="text-sm font-medium">{service.service}</span>
              </div>
              <p className="text-xs text-gray-600 mb-1 capitalize">{service.status}</p>
              <p className="text-lg">{service.uptime}</p>
              <p className="text-xs text-gray-500">Thời gian hoạt động</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}