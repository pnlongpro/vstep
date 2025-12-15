import { useState } from 'react';
import { Search, Filter, Brain, TrendingUp, CheckCircle, Clock, AlertTriangle, Zap, DollarSign, BarChart3, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

type TabType = 'overview' | 'costs' | 'stats' | 'errors' | 'requests';

export function AILogsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - Overview Stats
  const overviewStats = [
    { label: 'Chi phí hôm nay', value: '0.9816 USD', icon: DollarSign, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'Tổng requests', value: '121', icon: Zap, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Success Rate', value: '93.39%', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Avg Response Time', value: '9104ms', icon: Clock, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  // Mock data - Model Distribution (Today)
  const modelDistribution = [
    { model: 'gpt-4o', requests: 58, cost: '$0.9816', avgTime: '14635ms' },
    { model: 'whisper-1', requests: 63, cost: '$0.0000', avgTime: '4013ms' },
  ];

  // Mock data - Errors Today
  const errorStats = {
    totalErrors: 8,
    errorRate: '6.61%',
  };

  // Mock data - Recent Errors
  const recentErrors = [
    { id: 1, time: '10:30:45', model: 'gpt-4o', error: 'Timeout error', message: 'Request timeout after 30 seconds' },
    { id: 2, time: '09:15:22', model: 'whisper-1', error: 'API rate limit', message: 'Rate limit exceeded' },
    { id: 3, time: '08:45:10', model: 'gpt-4o', error: 'Invalid response', message: 'JSON parsing error' },
  ];

  // Mock data - Usage Chart
  const usageData = [
    { time: '00:00', gpt4o: 5, whisper: 8 },
    { time: '03:00', gpt4o: 3, whisper: 4 },
    { time: '06:00', gpt4o: 7, whisper: 9 },
    { time: '09:00', gpt4o: 15, whisper: 18 },
    { time: '12:00', gpt4o: 12, whisper: 14 },
    { time: '15:00', gpt4o: 9, whisper: 6 },
    { time: '18:00', gpt4o: 4, whisper: 3 },
    { time: '21:00', gpt4o: 3, whisper: 1 },
  ];

  // Mock data - Cost by Model
  const costByModel = [
    { model: 'gpt-4o', cost: 0.9816, percentage: 100 },
    { model: 'whisper-1', cost: 0.0000, percentage: 0 },
  ];

  // Mock data - All Requests
  const allRequests = [
    { id: 'REQ-001', time: '10:45:32', model: 'gpt-4o', user: 'Nguyễn Văn A', type: 'Writing', status: 'success', cost: '$0.0145', responseTime: '12350ms' },
    { id: 'REQ-002', time: '10:44:18', model: 'whisper-1', user: 'Trần Thị B', type: 'Speaking', status: 'success', cost: '$0.0000', responseTime: '3200ms' },
    { id: 'REQ-003', time: '10:43:05', model: 'gpt-4o', user: 'Lê Văn C', type: 'Writing', status: 'failed', cost: '$0.0000', responseTime: '28500ms' },
    { id: 'REQ-004', time: '10:42:22', model: 'gpt-4o', user: 'Phạm Thị D', type: 'Writing', status: 'success', cost: '$0.0152', responseTime: '11200ms' },
    { id: 'REQ-005', time: '10:41:10', model: 'whisper-1', user: 'Hoàng Văn E', type: 'Speaking', status: 'success', cost: '$0.0000', responseTime: '4100ms' },
    { id: 'REQ-006', time: '10:40:45', model: 'gpt-4o', user: 'Vũ Thị F', type: 'Writing', status: 'success', cost: '$0.0148', responseTime: '13500ms' },
    { id: 'REQ-007', time: '10:39:30', model: 'whisper-1', user: 'Đỗ Văn G', type: 'Speaking', status: 'failed', cost: '$0.0000', responseTime: '25000ms' },
    { id: 'REQ-008', time: '10:38:15', model: 'gpt-4o', user: 'Bùi Thị H', type: 'Writing', status: 'success', cost: '$0.0141', responseTime: '14800ms' },
    { id: 'REQ-009', time: '10:37:05', model: 'gpt-4o', user: 'Đinh Văn I', type: 'Writing', status: 'success', cost: '$0.0150', responseTime: '12100ms' },
    { id: 'REQ-010', time: '10:36:20', model: 'whisper-1', user: 'Mai Thị K', type: 'Speaking', status: 'success', cost: '$0.0000', responseTime: '3800ms' },
  ];

  const filteredRequests = allRequests.filter(req => {
    const matchesSearch = req.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          req.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || req.model === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {overviewStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className={`${stat.bgColor} rounded-xl p-6 border-2 border-gray-100`}>
                    <div className="flex items-center justify-between mb-3">
                      <Icon className={`size-8 ${stat.color}`} />
                    </div>
                    <h3 className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</h3>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Model Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="size-5 text-blue-600" />
                Phân bổ theo Model (Hôm nay)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Model</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Số requests</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Chi phí ($)</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Avg Time (ms)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelDistribution.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {item.model}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">{item.requests}</td>
                        <td className="py-3 px-4 text-sm font-medium text-emerald-600">{item.cost}</td>
                        <td className="py-3 px-4 text-sm">{item.avgTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Usage Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="size-5 text-purple-600" />
                Lượng sử dụng theo giờ
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" />
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
                    dataKey="gpt4o" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    name="GPT-4o"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="whisper" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', r: 4 }}
                    name="Whisper-1"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'costs':
        return (
          <div className="space-y-6">
            {/* Cost Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="size-10 opacity-80" />
                </div>
                <h3 className="text-3xl font-bold mb-1">$0.9816</h3>
                <p className="text-sm opacity-90">Chi phí hôm nay</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h4 className="text-sm text-gray-600 mb-2">Chi phí tuần này</h4>
                <p className="text-3xl font-bold mb-1">$6.45</p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="size-4" />
                  <span>+12.3% so với tuần trước</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h4 className="text-sm text-gray-600 mb-2">Chi phí tháng này</h4>
                <p className="text-3xl font-bold mb-1">$24.32</p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="size-4" />
                  <span>+8.5% so với tháng trước</span>
                </div>
              </div>
            </div>

            {/* Cost by Model */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Chi phí theo Model</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={costByModel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="model" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="cost" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Cost Breakdown Table */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Chi tiết chi phí</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Model</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Requests</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Chi phí ($)</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">% Tổng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costByModel.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {item.model}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          {modelDistribution.find(m => m.model === item.model)?.requests || 0}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-emerald-600">
                          ${item.cost.toFixed(4)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-600" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{item.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-6">
            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h4 className="text-sm text-gray-600 mb-2">Tổng Requests</h4>
                <p className="text-3xl font-bold mb-1">121</p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="size-4" />
                  <span>+18.3% hôm nay</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h4 className="text-sm text-gray-600 mb-2">Thành công</h4>
                <p className="text-3xl font-bold mb-1">113</p>
                <p className="text-sm text-green-600">93.39% success rate</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h4 className="text-sm text-gray-600 mb-2">Thất bại</h4>
                <p className="text-3xl font-bold mb-1">8</p>
                <p className="text-sm text-red-600">6.61% error rate</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h4 className="text-sm text-gray-600 mb-2">Avg Response Time</h4>
                <p className="text-3xl font-bold mb-1">9104ms</p>
                <p className="text-sm text-gray-600">~9.1 giây</p>
              </div>
            </div>

            {/* Usage by Type */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Phân bổ theo loại bài tập</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-700">Writing (GPT-4o)</span>
                    <span className="text-2xl font-bold text-purple-600">58</span>
                  </div>
                  <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600" style={{ width: '48%' }}></div>
                  </div>
                  <p className="text-xs text-purple-600 mt-1">48% tổng requests</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-orange-700">Speaking (Whisper-1)</span>
                    <span className="text-2xl font-bold text-orange-600">63</span>
                  </div>
                  <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-600" style={{ width: '52%' }}></div>
                  </div>
                  <p className="text-xs text-orange-600 mt-1">52% tổng requests</p>
                </div>
              </div>
            </div>

            {/* Response Time Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Phân bổ thời gian phản hồi</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{'< 5s'}</span>
                    <span className="font-medium">45 requests (37%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600" style={{ width: '37%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">5s - 10s</span>
                    <span className="font-medium">38 requests (31%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-600" style={{ width: '31%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">10s - 20s</span>
                    <span className="font-medium">30 requests (25%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-600" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{"> 20s"}</span>
                    <span className="font-medium">8 requests (7%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600" style={{ width: '7%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'errors':
        return (
          <div className="space-y-6">
            {/* Error Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                <div className="flex items-center justify-between mb-3">
                  <AlertTriangle className="size-8 text-red-600" />
                </div>
                <h3 className="text-3xl font-bold mb-1 text-red-600">{errorStats.totalErrors}</h3>
                <p className="text-sm text-gray-600">Tổng lỗi</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <BarChart3 className="size-8 text-orange-600" />
                </div>
                <h3 className="text-3xl font-bold mb-1 text-orange-600">{errorStats.errorRate}</h3>
                <p className="text-sm text-gray-600">Error Rate</p>
              </div>
            </div>

            {/* Recent Errors Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="size-5 text-red-600" />
                  Lỗi gần đây
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Thời gian</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Model</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Loại lỗi</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentErrors.map((error) => (
                      <tr key={error.id} className="border-b border-gray-100 hover:bg-red-50 transition-colors">
                        <td className="py-3 px-4 text-sm font-mono">{error.time}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {error.model}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            {error.error}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{error.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Error Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Phân loại lỗi</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Timeout errors</span>
                    <span className="font-medium">4 (50%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Rate limit errors</span>
                    <span className="font-medium">2 (25%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-600" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Invalid response</span>
                    <span className="font-medium">2 (25%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-600" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'requests':
        return (
          <div className="space-y-6">
            {/* Filters & Search */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo Request ID hoặc người dùng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả Model</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="whisper-1">Whisper-1</option>
                </select>
              </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Request ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Thời gian</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Model</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Người dùng</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Loại</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trạng thái</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Chi phí</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Response Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRequests.map((req) => (
                      <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm font-mono text-blue-600">{req.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{req.time}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {req.model}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{req.user}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            req.type === 'Writing' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {req.type === 'Writing' ? 'Viết' : 'Nói'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                            req.status === 'success' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {req.status === 'success' ? 'Thành công' : 'Thất bại'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-emerald-600">{req.cost}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{req.responseTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, filteredRequests.length)} trong tổng số {filteredRequests.length} bản ghi
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg ${
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
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Icon */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
          <Brain className="size-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Request Tracking</h2>
          <p className="text-sm text-gray-600">Quản lý và giám sát các yêu cầu của AI (OpenAI)</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl p-2 shadow-sm border-2 border-gray-200">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="size-4" />
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('costs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium ${
              activeTab === 'costs'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <DollarSign className="size-4" />
            Chi phí
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium ${
              activeTab === 'stats'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="size-4" />
            Thống kê
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium ${
              activeTab === 'errors'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <AlertTriangle className="size-4" />
            Lỗi gần đây
            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
              {errorStats.totalErrors}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium ${
              activeTab === 'requests'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Activity className="size-4" />
            Chi tiết Requests
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}
