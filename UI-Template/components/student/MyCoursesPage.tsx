import { useState } from 'react';
import { BookOpen, Calendar, Users, TrendingUp, Search, Filter, ChevronRight, Award } from 'lucide-react';
import { ClassDetailPage } from './ClassDetailPage';

export function MyCoursesPage() {
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for student's classes
  const classes = [
    {
      id: 1,
      name: 'VSTEP B2 Intensive – Khóa 12',
      level: 'B2',
      teacher: {
        name: 'Nguyễn Thị Mai',
        avatar: '👩‍🏫'
      },
      startDate: '01/09/2024',
      endDate: '30/12/2024',
      schedule: 'Thứ 3 – Thứ 5 | 19:00–21:00',
      status: 'active',
      statusLabel: 'Đang học',
      progress: 68,
      totalStudents: 25,
      completedAssignments: 32,
      totalAssignments: 45,
      nextClass: 'Thứ 5, 19/12/2024 - 19:00'
    },
    {
      id: 2,
      name: 'VSTEP B1 Foundation – Khóa 08',
      level: 'B1',
      teacher: {
        name: 'Trần Văn Nam',
        avatar: '👨‍🏫'
      },
      startDate: '15/06/2024',
      endDate: '15/09/2024',
      schedule: 'Thứ 2 – Thứ 4 | 18:00–20:00',
      status: 'completed',
      statusLabel: 'Đã hoàn thành',
      progress: 100,
      totalStudents: 30,
      completedAssignments: 50,
      totalAssignments: 50,
      nextClass: null
    },
    {
      id: 3,
      name: 'VSTEP C1 Advanced – Khóa 05',
      level: 'C1',
      teacher: {
        name: 'Lê Thị Hương',
        avatar: '👩‍🏫'
      },
      startDate: '05/01/2025',
      endDate: '05/04/2025',
      schedule: 'Thứ 6 – Thứ 7 | 14:00–16:00',
      status: 'upcoming',
      statusLabel: 'Sắp khai giảng',
      progress: 0,
      totalStudents: 20,
      completedAssignments: 0,
      totalAssignments: 40,
      nextClass: 'Thứ 6, 05/01/2025 - 14:00'
    }
  ];

  // Filter classes
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cls.teacher.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cls.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'A2': return 'bg-green-100 text-green-700';
      case 'B1': return 'bg-blue-100 text-blue-700';
      case 'B2': return 'bg-purple-100 text-purple-700';
      case 'C1': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (selectedClass) {
    return <ClassDetailPage onBack={() => setSelectedClass(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng lớp học</p>
              <p className="text-2xl font-bold">{classes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đang học</p>
              <p className="text-2xl font-bold text-green-600">
                {classes.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Award className="size-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-gray-700">
                {classes.filter(c => c.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sắp khai giảng</p>
              <p className="text-2xl font-bold text-blue-600">
                {classes.filter(c => c.status === 'upcoming').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm lớp học hoặc giáo viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang học</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="upcoming">Sắp khai giảng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        {filteredClasses.map(cls => (
          <div
            key={cls.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedClass(cls)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold">{cls.name}</h3>
                  <span className={`px-3 py-1 text-sm rounded-lg font-medium ${getLevelColor(cls.level)}`}>
                    {cls.level}
                  </span>
                  <span className={`px-3 py-1 text-sm rounded-lg border ${getStatusColor(cls.status)}`}>
                    {cls.statusLabel}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cls.teacher.avatar}</span>
                    <span className="text-sm">{cls.teacher.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    <span className="text-sm">{cls.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="size-4" />
                    <span className="text-sm">{cls.totalStudents} học viên</span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight className="size-6 text-gray-400" />
              </button>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Tiến độ học tập</span>
                <span className="text-sm font-medium text-blue-600">{cls.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${cls.progress}%` }}
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-gray-500">Bài tập: </span>
                  <span className="font-medium">
                    {cls.completedAssignments}/{cls.totalAssignments}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Thời gian: </span>
                  <span className="font-medium">
                    {cls.startDate} - {cls.endDate}
                  </span>
                </div>
              </div>
              {cls.nextClass && (
                <div className="text-blue-600">
                  <span className="text-gray-500">Buổi tiếp: </span>
                  <span className="font-medium">{cls.nextClass}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredClasses.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <BookOpen className="size-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Không tìm thấy lớp học nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
