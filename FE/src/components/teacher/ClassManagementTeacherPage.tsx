import { useState } from 'react';
import { Search, Users, BookOpen, TrendingUp, Archive, Eye, X, UserPlus, Upload, FileSpreadsheet } from 'lucide-react';
import { StudentHistoryModalAdvanced } from './StudentHistoryModalAdvanced';
import { ClassDetailPageTeacher } from './ClassDetailPageTeacher';

export function ClassManagementTeacherPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [showClassDetail, setShowClassDetail] = useState(false);
  
  console.log('🔍 DEBUG - ClassManagementTeacherPage render:', { selectedClass, showClassDetail });

  const itemsPerPage = 10;

  // Mock data
  const classStats = [
    { title: 'Lớp của tôi', value: '12', change: '+3%', icon: BookOpen, color: 'from-purple-500 to-purple-600' },
    { title: 'Đang hoạt động', value: '9', change: '+2%', icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { title: 'Tổng học viên', value: '356', change: '+12%', icon: Users, color: 'from-blue-500 to-blue-600' },
    { title: 'Đã hoàn thành', value: '3', change: '-', icon: Archive, color: 'from-gray-500 to-gray-600' },
  ];

  const classes = [
    { id: 1, name: 'VSTEP B2 - Lớp sáng', students: 35, level: 'B2', created: '2024-01-15', status: 'active', progress: 65 },
    { id: 2, name: 'VSTEP Writing Intensive', students: 28, level: 'C1', created: '2024-02-20', status: 'active', progress: 45 },
    { id: 3, name: 'VSTEP Speaking Practice', students: 30, level: 'B1', created: '2024-03-10', status: 'active', progress: 80 },
    { id: 4, name: 'VSTEP Full Course - Buổi tối', students: 42, level: 'B2', created: '2024-04-05', status: 'archived', progress: 100 },
  ];

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || cls.level === filterLevel;
    const matchesStatus = filterStatus === 'all' || cls.status === filterStatus;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* If class detail is shown, render ClassDetailPageTeacher */}
      {selectedClass && showClassDetail ? (
        <ClassDetailPageTeacher 
          onBack={() => {
            setSelectedClass(null);
            setShowClassDetail(false);
          }} 
          classData={selectedClass}
        />
      ) : (
        <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {classStats.map((stat, index) => {
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
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên lớp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tất cả cấp độ</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="archived">Đã hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Class List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Tên lớp</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Số học viên</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Cấp độ</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Tiến độ</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Ngày tạo</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Trạng thái</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClasses.map((cls) => (
                <tr 
                  key={cls.id} 
                  className="border-b border-gray-100 hover:bg-purple-50 transition-colors cursor-pointer"
                  onClick={() => {
                    console.log('Row clicked!', cls);
                    alert('Clicked on: ' + cls.name);
                    setSelectedClass(cls);
                    setShowClassDetail(true);
                  }}
                >
                  <td className="py-3 px-4">
                    <p className="text-sm">{cls.name}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-gray-500" />
                      <span className="text-sm">{cls.students}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                      {cls.level}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${cls.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{cls.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{cls.created}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      cls.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {cls.status === 'active' ? 'Hoạt động' : 'Hoàn thành'}
                    </span>
                  </td>
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => {
                          setSelectedClass(cls);
                          setShowClassDetail(true);
                        }}
                        className="p-1 hover:bg-purple-200 rounded" 
                        title="Xem chi tiết"
                      >
                        <Eye className="size-4 text-purple-600" />
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
            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, filteredClasses.length)} trong tổng số {filteredClasses.length} lớp học
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
                    ? 'bg-purple-600 text-white'
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
    </>
      )}
    </div>
  );
}