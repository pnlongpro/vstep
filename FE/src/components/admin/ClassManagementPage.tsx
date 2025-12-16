import { useState } from 'react';
import { Search, Plus, Users, BookOpen, TrendingUp, Archive, Eye, Edit, Trash2, X, Calendar, Filter, UserPlus, Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle, ClipboardList, Clock, ArrowLeft, Trophy, Headphones, Mic, PenTool, FileText, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import { StudentHistoryModalAdvanced } from './StudentHistoryModalAdvanced';
import { ClassDetailPage } from './ClassDetailPage';

export function ClassManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTeacher, setFilterTeacher] = useState('all');
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [showClassDetail, setShowClassDetail] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data
  const classStats = [
    { title: 'Tổng lớp học', value: '86', change: '+12%', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { title: 'Đang hoạt động', value: '68', change: '+8%', icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { title: 'Tổng học viên', value: '2,456', change: '+15%', icon: Users, color: 'from-purple-500 to-purple-600' },
    { title: 'Đã lưu trữ', value: '18', change: '-3%', icon: Archive, color: 'from-gray-500 to-gray-600' },
  ];

  const classes = [
    { id: 1, name: 'VSTEP B2 - Lớp sáng', teacher: 'TS. Nguyễn Văn A', students: 35, level: 'B2', created: '2024-01-15', status: 'active', progress: 65 },
    { id: 2, name: 'VSTEP Writing Intensive', teacher: 'ThS. Trần Thị B', students: 28, level: 'C1', created: '2024-02-20', status: 'active', progress: 45 },
    { id: 3, name: 'VSTEP Speaking Practice', teacher: 'TS. Lê Văn C', students: 30, level: 'B1', created: '2024-03-10', status: 'active', progress: 80 },
    { id: 4, name: 'VSTEP Full Course - Buổi tối', teacher: 'ThS. Phạm Thị D', students: 42, level: 'B2', created: '2024-04-05', status: 'archived', progress: 100 },
    { id: 5, name: 'VSTEP Reading Advanced', teacher: 'GV. Hoàng Văn E', students: 25, level: 'C1', created: '2024-05-12', status: 'active', progress: 55 },
    { id: 6, name: 'VSTEP Listening Basic', teacher: 'TS. Vũ Thị F', students: 38, level: 'A2', created: '2024-06-25', status: 'active', progress: 35 },
    { id: 7, name: 'VSTEP Grammar Foundation', teacher: 'ThS. Đặng Văn G', students: 32, level: 'B1', created: '2024-07-15', status: 'active', progress: 70 },
    { id: 8, name: 'VSTEP Mock Test Series', teacher: 'GV. Bùi Thị H', students: 29, level: 'B2', created: '2024-08-20', status: 'active', progress: 40 },
  ];

  const classStudents = [
    { id: 1, name: 'Nguyễn Văn X', email: 'nguyenvanx@example.com', progress: 75, lastActivity: '2 giờ trước' },
    { id: 2, name: 'Trần Thị Y', email: 'tranthiy@example.com', progress: 82, lastActivity: '5 giờ trước' },
    { id: 3, name: 'Lê Văn Z', email: 'levanz@example.com', progress: 68, lastActivity: '1 ngày trước' },
    { id: 4, name: 'Phạm Thị W', email: 'phamthiw@example.com', progress: 90, lastActivity: '3 giờ trước' },
  ];

  const progressData = [
    { week: 'T1', progress: 20 },
    { week: 'T2', progress: 35 },
    { week: 'T3', progress: 48 },
    { week: 'T4', progress: 55 },
    { week: 'T5', progress: 65 },
  ];

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cls.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || cls.level === filterLevel;
    const matchesStatus = filterStatus === 'all' || cls.status === filterStatus;
    const matchesTeacher = filterTeacher === 'all' || cls.teacher === filterTeacher;
    return matchesSearch && matchesLevel && matchesStatus && matchesTeacher;
  });

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* If class detail is shown, render ClassDetailPage */}
      {selectedClass && showClassDetail ? (
        <ClassDetailPage 
          onBack={() => {
            setSelectedClass(null);
            setShowClassDetail(false);
          }} 
          classData={selectedClass}
        />
      ) : (
        <>
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
        <h3 className="text-xl font-bold mb-2">🎓 Quản lý lớp học - Hướng dẫn nhanh</h3>
        <p className="text-sm opacity-90 mb-4">
          Click vào icon <Eye className="inline size-4" /> ở cột "Hành động" để xem chi tiết lớp học, sau đó bạn có thể:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <UserPlus className="size-5" />
              <span className="font-medium">Thêm học viên thủ công</span>
            </div>
            <p className="text-xs opacity-80">Click button "Thêm học viên" (màu xanh dương) trong chi tiết lớp</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Upload className="size-5" />
              <span className="font-medium">Import từ Excel</span>
            </div>
            <p className="text-xs opacity-80">Click button "Import Excel" (màu xanh lá) trong chi tiết lớp</p>
          </div>
        </div>
      </div>

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
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên lớp hoặc giáo viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Level Filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả cấp độ</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="archived">Đã lưu trữ</option>
          </select>

          {/* Teacher Filter */}
          <select
            value={filterTeacher}
            onChange={(e) => setFilterTeacher(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả giáo viên</option>
            <option value="TS. Nguyễn Văn A">TS. Nguyễn Văn A</option>
            <option value="ThS. Trần Thị B">ThS. Trần Thị B</option>
            <option value="TS. Lê Văn C">TS. Lê Văn C</option>
          </select>

          {/* Create Class Button */}
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            <Plus className="size-4" />
            Tạo lớp mới
          </button>
        </div>
      </div>

      {/* Class List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Tên lớp</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Giáo viên</th>
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
                  className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedClass(cls);
                    setShowClassDetail(true);
                  }}
                >
                  <td className="py-3 px-4">
                    <p className="text-sm">{cls.name}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{cls.teacher}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-gray-500" />
                      <span className="text-sm">{cls.students}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
                      {cls.level}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
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
                      {cls.status === 'active' ? 'Hoạt động' : 'Lưu trữ'}
                    </span>
                  </td>
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => {
                          setSelectedClass(cls);
                          setShowClassDetail(true);
                        }}
                        className="p-1 hover:bg-blue-200 rounded" 
                        title="Xem chi tiết"
                      >
                        <Eye className="size-4 text-blue-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded" title="Chỉnh sửa">
                        <Edit className="size-4 text-gray-600" />
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

      {/* Class Detail Modal */}
      {selectedClass && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedClass(null)} />
          <div className="fixed inset-4 bg-white z-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white">
              <h3 className="text-xl font-semibold">Chi tiết lớp học</h3>
              <button onClick={() => setSelectedClass(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Class Info Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-4">Thông tin lớp học</h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Tên lớp:</label>
                    <p className="text-sm font-medium mt-1">{selectedClass.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Giáo viên:</label>
                    <p className="text-sm font-medium mt-1">{selectedClass.teacher}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Ngày bắt đầu:</label>
                    <p className="text-sm font-medium mt-1">{selectedClass.created}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Trạng thái:</label>
                    <p className="text-sm font-medium mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedClass.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedClass.status === 'active' ? 'Đang hoạt động' : 'Đã lưu trữ'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Ngày kết thúc:</label>
                    <p className="text-sm font-medium mt-1">-</p>
                  </div>
                </div>
              </div>

              {/* Student List Section */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h4 className="font-semibold">Danh sách học viên</h4>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Tất cả</span>
                      <input type="checkbox" className="size-4 rounded" defaultChecked />
                    </label>
                    <button 
                      onClick={() => setShowAddStudentModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      Thêm học viên
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700">
                      Tạo SBD
                    </button>
                    <button 
                      onClick={() => setShowImportModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                    >
                      <Upload className="size-4" />
                      Import từ Excel
                    </button>
                  </div>
                </div>

                {/* Students Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-16">STT</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-24">SBD</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Full Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-32">Tiến độ chấm/chữa</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-20">CEFR</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-32">Thi mô phỏng</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-32">Số lần thi tới đa</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-56">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classStudents.map((student, index) => (
                        <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">{index + 1}</td>
                          <td className="py-3 px-4 text-sm">-</td>
                          <td className="py-3 px-4 text-sm">{student.name}</td>
                          <td className="py-3 px-4 text-sm">0 / 4</td>
                          <td className="py-3 px-4 text-sm">
                            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">A1</span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-400">-- Chưa thi --</td>
                          <td className="py-3 px-4 text-sm text-gray-400">-- Chưa có SBD --</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button className="px-3 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50">
                                Delete
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setShowHistoryModal(true);
                                }}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                Overview
                              </button>
                              <button className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700">
                                Grading
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Create Class Modal */}
      {showCreateModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCreateModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl">Tạo lớp học mới</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="size-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Tên lớp học</label>
                <input
                  type="text"
                  placeholder="VD: VSTEP B2 - Lớp sáng"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Giáo viên</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Chọn giáo viên</option>
                  <option value="1">TS. Nguyễn Văn A</option>
                  <option value="2">ThS. Trần Thị B</option>
                  <option value="3">TS. Lê Văn C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Cấp độ</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Chọn cấp độ</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Tạo lớp
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Import Excel Modal */}
      {showImportModal && <ImportExcelModal onClose={() => setShowImportModal(false)} className={selectedClass?.name || 'Lớp học'} />}
      
      {/* Add Student Modal */}
      {showAddStudentModal && <AddStudentModal onClose={() => setShowAddStudentModal(false)} className={selectedClass?.name || 'Lớp học'} />}
      
      {/* Student History Modal */}
      {showHistoryModal && selectedStudent && <StudentHistoryModalAdvanced onClose={() => setShowHistoryModal(false)} student={selectedStudent} />}
    </>
      )}
    </div>
  );
}

// Import Excel Modal Component
function ImportExcelModal({ onClose, className }: { onClose: () => void; className: string }) {
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [importResults, setImportResults] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: []
  });

  // Mock preview data
  const previewData = [
    { row: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0901234567', status: '✓ Hợp lệ' },
    { row: 2, name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0907654321', status: '✓ Hợp lệ' },
    { row: 3, name: 'Lê Văn C', email: 'levanc@example.com', phone: '0912345678', status: '✓ Hợp lệ' },
    { row: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', phone: '0909876543', status: '✓ Hợp lệ' },
    { row: 5, name: 'Hoàng Văn E', email: '', phone: '0918765432', status: '⚠️ Thiếu email' },
  ];

  const downloadTemplate = () => {
    alert('Tải file template Excel mẫu...');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const parsedData = jsonData.map((row: any, index: number) => ({
          row: index + 1,
          name: row[0],
          email: row[1],
          phone: row[2],
          status: row[1] ? '✓ Hợp lệ' : '⚠️ Thiếu email'
        }));
        setUploadedData(parsedData);
        setStep('preview');
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleImport = () => {
    // Simulate import process
    setTimeout(() => {
      setImportResults({
        success: 4,
        failed: 1,
        errors: ['Dòng 5: Thiếu email - Nguyễn được bỏ qua']
      });
      setStep('result');
    }, 1000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={step === 'upload' ? onClose : undefined} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-green-500 to-emerald-600 text-white sticky top-0">
          <div>
            <h3 className="text-xl">Import học viên từ Excel</h3>
            <p className="text-sm opacity-90 mt-1">Lớp: {className}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step === 'upload' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'upload' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="text-sm">Tải lên</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200"></div>
              <div className={`flex items-center gap-2 ${step === 'preview' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'preview' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="text-sm">Xem trước</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200"></div>
              <div className={`flex items-center gap-2 ${step === 'result' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'result' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="text-sm">Kết quả</span>
              </div>
            </div>
          </div>

          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="flex items-center gap-2 text-blue-900 mb-3">
                  <FileSpreadsheet className="size-5" />
                  Hướng dẫn import
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• File Excel phải có các cột: <strong>Họ tên, Email, Số điện thoại</strong></li>
                  <li>• Email là bắt buộc và phải đúng định dạng</li>
                  <li>• Số điện thoại phải đúng định dạng (10 số)</li>
                  <li>• Dòng đầu tiên là tiêu đề cột (sẽ bỏ qua khi import)</li>
                  <li>• Tối đa 500 học viên mỗi lần import</li>
                </ul>
              </div>

              {/* Download Template */}
              <button 
                onClick={downloadTemplate}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-gray-700"
              >
                <Download className="size-5 text-green-600" />
                <span>Tải file Excel mẫu</span>
              </button>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer">
                <FileSpreadsheet className="size-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 mb-2">Kéo thả file Excel vào đây hoặc click để chọn</p>
                <p className="text-sm text-gray-500">Hỗ trợ: .xlsx, .xls (Tối đa 5MB)</p>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Tìm thấy {previewData.length} học viên</strong> từ file Excel. Vui lòng kiểm tra trước khi import.
                </p>
              </div>

              {/* Preview Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm">Dòng</th>
                        <th className="text-left py-3 px-4 text-sm">Họ tên</th>
                        <th className="text-left py-3 px-4 text-sm">Email</th>
                        <th className="text-left py-3 px-4 text-sm">Số điện thoại</th>
                        <th className="text-left py-3 px-4 text-sm">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className={`border-b border-gray-100 ${row.status.includes('⚠️') ? 'bg-red-50' : ''}`}>
                          <td className="py-3 px-4 text-sm">{row.row}</td>
                          <td className="py-3 px-4 text-sm">{row.name}</td>
                          <td className="py-3 px-4 text-sm">{row.email || <span className="text-red-500">Thiếu</span>}</td>
                          <td className="py-3 px-4 text-sm">{row.phone}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${
                              row.status.includes('✓') 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Tổng số</p>
                    <p className="text-2xl">{previewData.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Hợp lệ</p>
                    <p className="text-2xl text-green-600">{previewData.filter(r => r.status.includes('✓')).length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Lỗi</p>
                    <p className="text-2xl text-red-600">{previewData.filter(r => r.status.includes('⚠️')).length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Result */}
          {step === 'result' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="size-12 text-green-600" />
                </div>
                <h4 className="text-2xl mb-2">Import hoàn tất!</h4>
                <p className="text-gray-600">Đã thêm học viên vào lớp học thành công</p>
              </div>

              {/* Results Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-green-600 mb-2">Thành công</p>
                  <p className="text-4xl text-green-600">{importResults.success}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-red-600 mb-2">Thất bại</p>
                  <p className="text-4xl text-red-600">{importResults.failed}</p>
                </div>
              </div>

              {/* Error Details */}
              {importResults.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h5 className="flex items-center gap-2 text-red-900 mb-3">
                    <AlertCircle className="size-5" />
                    Chi tiết lỗi
                  </h5>
                  <ul className="space-y-1 text-sm text-red-800">
                    {importResults.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
          {step === 'upload' && (
            <>
              <button 
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <div></div>
            </>
          )}
          
          {step === 'preview' && (
            <>
              <button 
                onClick={() => setStep('upload')}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Quay lại
              </button>
              <button 
                onClick={handleImport}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="size-4" />
                Xác nhận Import ({previewData.filter(r => r.status.includes('✓')).length} học viên)
              </button>
            </>
          )}

          {step === 'result' && (
            <>
              <button 
                onClick={() => {
                  setStep('upload');
                  setUploadedData([]);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Import thêm
              </button>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Hoàn tất
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// Add Student Modal Component
function AddStudentModal({ onClose, className }: { onClose: () => void; className: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  // Mock student database
  const allStudents = [
    { id: 996, fullName: 'Nguyễn Văn Thunm', username: 'thunm', email: 'thunm.aof@gmail.com' },
    { id: 995, fullName: 'Đỗ Duy', username: 'doduy3801', email: 'doduy3801@gmail.com' },
    { id: 994, fullName: 'Minh Sơn', username: 'Minhson031100', email: 'Minhson031100@gmail.com' },
    { id: 992, fullName: 'Nguyễn Thị Ngân', username: 'nguyenthingan101192', email: 'nguyenthingan101192@gmail.com' },
    { id: 991, fullName: 'Anh Hải', username: 'anh186148', email: 'anh186148@gmail.com' },
    { id: 990, fullName: 'Phạm Hạ Phương', username: 'phamhaphuong', email: 'phamhaphuong.fw@gmail.com' },
    { id: 988, fullName: 'Hùng Nguyễn', username: 'hungnguyenyb100', email: 'hungnguyenyb1002@gmail.com' },
    { id: 987, fullName: 'Trung Hiếu', username: 'trunghieubh123', email: 'trunghieubh123@gmail.com' },
    { id: 986, fullName: 'Yến Linh', username: 'yenlinhbg12345', email: 'yenlinhbg12345@gmail.com' },
    { id: 985, fullName: 'Hoàng Anh Tuấn', username: 'hoanganhtuan', email: 'hoanganhtuan@gmail.com' },
    { id: 984, fullName: 'Lê Thị Mai', username: 'lethimai', email: 'lethimai@gmail.com' },
    { id: 983, fullName: 'Trần Văn Bình', username: 'tranvanbinh', email: 'tranvanbinh@gmail.com' },
  ];

  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = 
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toString().includes(searchQuery);
    
    return matchesSearch;
  });

  const toggleStudent = (id: number) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleAddStudents = () => {
    if (selectedStudents.length === 0) {
      alert('Vui lòng chọn ít nhất 1 học viên');
      return;
    }
    setTimeout(() => {
      alert(`Đã thêm ${selectedStudents.length} học viên vào lớp ${className}`);
      onClose();
    }, 500);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setSelectedStudents([]);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white">
          <h3 className="text-xl font-medium">Thêm học viên vào lớp</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="size-5 text-gray-500" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo email, tên, hoặc số điện thoại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
            <button 
              onClick={() => setSearchQuery('')}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Search className="size-4" />
              Tìm kiếm
            </button>
            <button 
              onClick={resetFilters}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-y-auto max-h-[calc(90vh-280px)]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-6 w-12">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={toggleAll}
                    className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">ID</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Full Name</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">User Name</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr 
                  key={student.id} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => toggleStudent(student.id)}
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{student.id}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{student.fullName}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{student.username}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{student.email}</td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <Users className="size-12 mx-auto mb-3 text-gray-300" />
                    <p>Không tìm thấy học viên nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Đã chọn <strong>{selectedStudents.length}</strong> học viên
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            >
              Hủy
            </button>
            <button 
              onClick={handleAddStudents}
              disabled={selectedStudents.length === 0}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="size-4" />
              Thêm {selectedStudents.length > 0 ? `(${selectedStudents.length})` : ''} học viên
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Old StudentHistoryModal removed - now using StudentHistoryModalAdvanced