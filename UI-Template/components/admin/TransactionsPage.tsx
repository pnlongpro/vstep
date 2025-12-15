import { useState } from 'react';
import { Search, Filter, Download, DollarSign, TrendingUp, CreditCard, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data
  const transactionStats = [
    { title: 'Tổng doanh thu', value: '2.236.125.000₫', change: '+12.5%', icon: DollarSign, color: 'from-green-500 to-green-600' },
    { title: 'Giao dịch', value: '1,234', change: '+8.2%', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
    { title: 'Giao dịch TB', value: '1.812.500₫', change: '+4.3%', icon: CreditCard, color: 'from-purple-500 to-purple-600' },
    { title: 'Tỷ lệ thành công', value: '98.5%', change: '+1.2%', icon: CheckCircle, color: 'from-orange-500 to-orange-600' },
  ];

  const weeklyRevenueData = [
    { day: 'T2', revenue: 312500000 },
    { day: 'T3', revenue: 395000000 },
    { day: 'T4', revenue: 330000000 },
    { day: 'T5', revenue: 460000000 },
    { day: 'T6', revenue: 417500000 },
    { day: 'T7', revenue: 355000000 },
    { day: 'CN', revenue: 282500000 },
  ];

  const transactions = [
    { id: 'GD-001', user: 'Nguyễn Văn An', amount: 2499000, plan: 'Premium', method: 'Thẻ tín dụng', status: 'completed', date: '11/06/2024 10:30' },
    { id: 'GD-002', user: 'Trần Thị Bình', amount: 1249000, plan: 'Pro', method: 'PayPal', status: 'completed', date: '11/06/2024 09:15' },
    { id: 'GD-003', user: 'Lê Hoàng Cường', amount: 749000, plan: 'Cơ bản', method: 'Thẻ tín dụng', status: 'pending', date: '11/06/2024 08:45' },
    { id: 'GD-004', user: 'Phạm Thị Dung', amount: 2499000, plan: 'Premium', method: 'Chuyển khoản', status: 'completed', date: '10/06/2024 16:20' },
    { id: 'GD-005', user: 'Hoàng Văn Em', amount: 1249000, plan: 'Pro', method: 'Thẻ tín dụng', status: 'failed', date: '10/06/2024 15:10' },
    { id: 'GD-006', user: 'Đỗ Thị Phương', amount: 2499000, plan: 'Premium', method: 'PayPal', status: 'completed', date: '10/06/2024 14:30' },
    { id: 'GD-007', user: 'Vũ Văn Giang', amount: 749000, plan: 'Cơ bản', method: 'Thẻ tín dụng', status: 'completed', date: '10/06/2024 13:45' },
    { id: 'GD-008', user: 'Bùi Thị Hoa', amount: 1249000, plan: 'Pro', method: 'Chuyển khoản', status: 'completed', date: '10/06/2024 12:20' },
    { id: 'GD-009', user: 'Đinh Văn Inh', amount: 2499000, plan: 'Premium', method: 'Thẻ tín dụng', status: 'pending', date: '10/06/2024 11:15' },
    { id: 'GD-010', user: 'Cao Thị Kim', amount: 1249000, plan: 'Pro', method: 'PayPal', status: 'completed', date: '10/06/2024 10:30' },
    { id: 'GD-011', user: 'Phan Văn Long', amount: 2499000, plan: 'Premium', method: 'Chuyển khoản', status: 'completed', date: '09/06/2024 17:45' },
    { id: 'GD-012', user: 'Tạ Thị Mai', amount: 749000, plan: 'Cơ bản', method: 'Thẻ tín dụng', status: 'completed', date: '09/06/2024 16:30' },
  ];

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          txn.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || txn.method === filterPayment;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToExcel = () => {
    alert('Xuất Excel - Chức năng đang phát triển!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatRevenueChart = (value: number) => {
    return (value / 1000000).toFixed(0) + 'M';
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {transactionStats.map((stat, index) => {
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

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="size-5 text-green-600" />
          Doanh thu theo tuần
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis 
              stroke="#6b7280"
              tickFormatter={formatRevenueChart}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Thứ ${label}`}
            />
            <Legend 
              formatter={() => 'Doanh thu'}
            />
            <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã giao dịch hoặc tên người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="completed">Hoàn thành</option>
            <option value="pending">Đang xử lý</option>
            <option value="failed">Thất bại</option>
          </select>

          {/* Payment Filter */}
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả phương thức</option>
            <option value="Thẻ tín dụng">Thẻ tín dụng</option>
            <option value="PayPal">PayPal</option>
            <option value="Chuyển khoản">Chuyển khoản</option>
          </select>

          {/* Export Button */}
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="size-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Mã giao dịch</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Người dùng</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Số tiền</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Gói</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Phương thức</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trạng thái</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ngày giao dịch</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((txn) => (
                <tr key={txn.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-mono text-blue-600 font-medium">{txn.id}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{txn.user}</td>
                  <td className="py-3 px-4 text-sm font-bold text-green-600">{formatCurrency(txn.amount)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      txn.plan === 'Premium' ? 'bg-purple-100 text-purple-700' :
                      txn.plan === 'Pro' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {txn.plan}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{txn.method}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      txn.status === 'completed' ? 'bg-green-100 text-green-700' :
                      txn.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {txn.status === 'completed' ? 'Hoàn thành' :
                       txn.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="size-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Không tìm thấy giao dịch nào</p>
          </div>
        )}

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} trong tổng số {filteredTransactions.length} giao dịch
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
