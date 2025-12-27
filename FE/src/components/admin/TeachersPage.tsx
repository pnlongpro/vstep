'use client';

import { useState } from 'react';
import { Search, Download, Mail, Edit, MoreVertical, Users, Award, TrendingUp, BookOpen } from 'lucide-react';

export function TeachersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data
  const teacherStats = [
    { title: 'Tổng giáo viên', value: '245', change: '+5.2%', icon: Users, color: 'from-blue-500 to-blue-600' },
    { title: 'Đang hoạt động', value: '198', change: '+3.1%', icon: Award, color: 'from-green-500 to-green-600' },
    { title: 'Khóa học đã tạo', value: '1,234', change: '+12.5%', icon: BookOpen, color: 'from-purple-500 to-purple-600' },
    { title: 'Học viên được dạy', value: '8,456', change: '+18.3%', icon: TrendingUp, color: 'from-orange-500 to-orange-600' },
  ];

  const teachers = [
    { id: 1, name: 'TS. Nguyễn Văn A', email: 'nguyenvana@vstepro.com', status: 'active', specialty: 'Writing', courses: 12, students: 456, rating: 4.8, joined: '2023-01-15' },
    { id: 2, name: 'ThS. Trần Thị B', email: 'tranthib@vstepro.com', status: 'active', specialty: 'Speaking', courses: 8, students: 324, rating: 4.9, joined: '2023-02-20' },
    { id: 3, name: 'TS. Lê Văn C', email: 'levanc@vstepro.com', status: 'active', specialty: 'Reading', courses: 15, students: 567, rating: 4.7, joined: '2023-03-10' },
    { id: 4, name: 'ThS. Phạm Thị D', email: 'phamthid@vstepro.com', status: 'inactive', specialty: 'Listening', courses: 6, students: 234, rating: 4.6, joined: '2023-04-05' },
    { id: 5, name: 'GV. Hoàng Văn E', email: 'hoangvane@vstepro.com', status: 'active', specialty: 'Grammar', courses: 10, students: 398, rating: 4.8, joined: '2023-05-12' },
    { id: 6, name: 'TS. Vũ Thị F', email: 'vuthif@vstepro.com', status: 'active', specialty: 'Writing', courses: 14, students: 512, rating: 4.9, joined: '2023-06-25' },
    { id: 7, name: 'ThS. Đặng Văn G', email: 'dangvang@vstepro.com', status: 'active', specialty: 'Speaking', courses: 9, students: 378, rating: 4.7, joined: '2023-07-15' },
    { id: 8, name: 'GV. Bùi Thị H', email: 'buithih@vstepro.com', status: 'active', specialty: 'Reading', courses: 7, students: 289, rating: 4.5, joined: '2023-08-20' },
    { id: 9, name: 'TS. Đinh Văn I', email: 'dinhvani@vstepro.com', status: 'active', specialty: 'Listening', courses: 11, students: 445, rating: 4.8, joined: '2023-09-18' },
    { id: 10, name: 'ThS. Mai Thị K', email: 'maithik@vstepro.com', status: 'active', specialty: 'Vocabulary', courses: 13, students: 501, rating: 4.9, joined: '2023-10-22' },
  ];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          teacher.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || teacher.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleTeacherSelection = (id: number) => {
    setSelectedTeachers(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedTeachers(
      selectedTeachers.length === paginatedTeachers.length
        ? []
        : paginatedTeachers.map(t => t.id)
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teacherStats.map((stat, index) => {
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
              placeholder="Tìm kiếm theo tên, email hoặc chuyên môn..."
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
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>

          {/* Add Teacher Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Users className="size-4" />
            Thêm giáo viên
          </button>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="size-4" />
            Xuất file
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedTeachers.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-900">{selectedTeachers.length} giáo viên được chọn</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                Gửi email
              </button>
              <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                Vô hiệu hóa
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedTeachers.length === paginatedTeachers.length && paginatedTeachers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Giáo viên</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Chuyên môn</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Khóa học</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Học viên</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Đánh giá</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Trạng thái</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Tham gia</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTeachers.map((teacher) => (
                <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedTeachers.includes(teacher.id)}
                      onChange={() => toggleTeacherSelection(teacher.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm">{teacher.name}</p>
                      <p className="text-xs text-gray-500">{teacher.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {teacher.specialty}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{teacher.courses}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{teacher.students}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-yellow-600">★</span>
                      <span className="text-sm">{teacher.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      teacher.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {teacher.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{teacher.joined}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-gray-200 rounded" title="Chỉnh sửa">
                        <Edit className="size-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded" title="Gửi email">
                        <Mail className="size-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded" title="Thêm">
                        <MoreVertical className="size-4 text-gray-600" />
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
            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, filteredTeachers.length)} trong tổng số {filteredTeachers.length} giáo viên
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
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
