import { useState } from 'react';
import { Search, Download, Plus, Edit, Trash2, Eye, BookOpen, Users, Star, TrendingUp } from 'lucide-react';
import { CourseEditModal } from './CourseEditModal';

export function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const itemsPerPage = 10;

  // Mock data
  const courseStats = [
    { title: 'Tổng khóa học', value: '156', change: '+12%', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { title: 'Đang hoạt động', value: '124', change: '+8%', icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { title: 'Tổng học viên', value: '12,456', change: '+23%', icon: Users, color: 'from-purple-500 to-purple-600' },
    { title: 'Đánh giá TB', value: '4.7', change: '+0.2', icon: Star, color: 'from-yellow-500 to-yellow-600' },
  ];

  const courses = [
    { id: 1, title: 'VSTEP Complete Preparation Course', category: 'Full Course', instructor: 'TS. Nguyễn Văn A', students: 1234, lessons: 45, duration: '12 tuần', price: '1,500,000đ', rating: 4.8, reviews: 456, status: 'active', created: '2024-01-15' },
    { id: 2, title: 'VSTEP Writing Intensive Training', category: 'Writing', instructor: 'ThS. Trần Thị B', students: 856, lessons: 20, duration: '6 tuần', price: '800,000đ', rating: 4.9, reviews: 324, status: 'active', created: '2024-02-20' },
    { id: 3, title: 'VSTEP Speaking Mastery', category: 'Speaking', instructor: 'TS. Lê Văn C', students: 678, lessons: 18, duration: '5 tuần', price: '750,000đ', rating: 4.7, reviews: 289, status: 'active', created: '2024-03-10' },
    { id: 4, title: 'VSTEP Reading Comprehension', category: 'Reading', instructor: 'ThS. Phạm Thị D', students: 945, lessons: 25, duration: '8 tuần', price: '900,000đ', rating: 4.6, reviews: 412, status: 'draft', created: '2024-04-05' },
    { id: 5, title: 'VSTEP Listening Skills Development', category: 'Listening', instructor: 'GV. Hoàng Văn E', students: 1123, lessons: 22, duration: '7 tuần', price: '850,000đ', rating: 4.8, reviews: 523, status: 'active', created: '2024-05-12' },
    { id: 6, title: 'VSTEP Grammar Foundation', category: 'Grammar', instructor: 'TS. Vũ Thị F', students: 789, lessons: 30, duration: '10 tuần', price: '700,000đ', rating: 4.5, reviews: 367, status: 'active', created: '2024-06-25' },
    { id: 7, title: 'VSTEP Vocabulary Builder', category: 'Vocabulary', instructor: 'ThS. Đặng Văn G', students: 1456, lessons: 35, duration: '12 tuần', price: '650,000đ', rating: 4.7, reviews: 678, status: 'active', created: '2024-07-15' },
    { id: 8, title: 'VSTEP Mock Test Series', category: 'Practice', instructor: 'GV. Bùi Thị H', students: 567, lessons: 15, duration: '4 tuần', price: '500,000đ', rating: 4.9, reviews: 234, status: 'active', created: '2024-08-20' },
    { id: 9, title: 'VSTEP B1 to B2 Upgrade', category: 'Level Up', instructor: 'TS. Đinh Văn I', students: 892, lessons: 40, duration: '14 tuần', price: '1,200,000đ', rating: 4.8, reviews: 445, status: 'active', created: '2024-09-18' },
    { id: 10, title: 'VSTEP C1 Advanced Preparation', category: 'Advanced', instructor: 'ThS. Mai Thị K', students: 345, lessons: 50, duration: '16 tuần', price: '2,000,000đ', rating: 4.9, reviews: 178, status: 'inactive', created: '2024-10-22' },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courseStats.map((stat, index) => {
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
              placeholder="Tìm kiếm theo tên khóa học hoặc giảng viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="Full Course">Khóa đầy đủ</option>
            <option value="Reading">Reading</option>
            <option value="Listening">Listening</option>
            <option value="Writing">Writing</option>
            <option value="Speaking">Speaking</option>
            <option value="Grammar">Grammar</option>
            <option value="Vocabulary">Vocabulary</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="draft">Bản nháp</option>
            <option value="inactive">Không hoạt động</option>
          </select>

          {/* Add Course Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="size-4" />
            Thêm khóa học
          </button>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="size-4" />
            Xuất file
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Tên khóa học</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Danh mục</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Giảng viên</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Học viên</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Bài học</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Thời lượng</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Giá</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Đánh giá</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Trạng thái</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCourses.map((course) => (
                <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="max-w-xs">
                      <p className="text-sm" title={course.title}>{course.title}</p>
                      <p className="text-xs text-gray-500">{course.lessons} bài học</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                      {course.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{course.instructor}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{course.students}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{course.lessons}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{course.duration}</td>
                  <td className="py-3 px-4 text-sm">{course.price}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-yellow-600">★</span>
                      <span className="text-sm">{course.rating}</span>
                      <span className="text-xs text-gray-500">({course.reviews})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.status === 'active' ? 'bg-green-100 text-green-700' :
                      course.status === 'draft' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {course.status === 'active' ? 'Hoạt động' :
                       course.status === 'draft' ? 'Bản nháp' :
                       'Tạm ngưng'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-gray-200 rounded" title="Xem">
                        <Eye className="size-4 text-gray-600" />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Chỉnh sửa"
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowEditModal(true);
                        }}
                      >
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
            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, filteredCourses.length)} trong tổng số {filteredCourses.length} khóa học
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

      {/* Edit Course Modal */}
      {showEditModal && selectedCourse && (
        <CourseEditModal
          isOpen={showEditModal}
          course={selectedCourse}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCourse(null);
          }}
          onSave={(data) => {
            console.log('Save course data:', data);
            // Add API call here
          }}
        />
      )}
    </div>
  );
}