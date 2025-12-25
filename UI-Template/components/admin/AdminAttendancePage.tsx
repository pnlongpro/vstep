import { useState } from 'react';
import { ArrowLeft, Calendar, Users, CheckCircle, XCircle, Clock, ChevronDown, Search, Download, TrendingUp, AlertCircle, List, Layers, ChevronRight } from 'lucide-react';

interface Student {
  id: string;
  name: string;
}

interface ClassData {
  id: string;
  name: string;
  teacher: string;
  students: Student[];
  totalSessions: number;
  currentSession: number;
  month: number;
}

export function AdminAttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'months' | 'classes' | 'attendance'>('months');

  // Mock attendance data
  const mockAttendance: Record<string, Record<number, 'present' | 'absent' | 'late'>> = {
    's1': { 1: 'present', 2: 'present', 3: 'late', 4: 'present', 5: 'present' },
    's2': { 1: 'present', 2: 'absent', 3: 'present', 4: 'present', 5: 'late' },
    's3': { 1: 'late', 2: 'present', 3: 'present', 4: 'absent', 5: 'present' },
    's4': { 1: 'present', 2: 'present', 3: 'present', 4: 'present', 5: 'present' },
    's5': { 1: 'absent', 2: 'late', 3: 'present', 4: 'present', 5: 'present' },
    's6': { 1: 'present', 2: 'present', 3: 'present' },
    's7': { 1: 'late', 2: 'present', 3: 'absent' },
    's8': { 1: 'present', 2: 'absent', 3: 'present' },
    's9': { 1: 'present', 2: 'present', 3: 'present', 4: 'late', 5: 'present', 6: 'present', 7: 'present' },
    's10': { 1: 'late', 2: 'present', 3: 'absent', 4: 'present', 5: 'present', 6: 'late', 7: 'present' },
    's11': { 1: 'present', 2: 'present', 3: 'present', 4: 'present', 5: 'absent', 6: 'present', 7: 'present' },
    's12': { 1: 'absent', 2: 'late', 3: 'present', 4: 'present', 5: 'present', 6: 'present', 7: 'absent' },
  };

  // Mock data - Classes by month
  const allClasses: ClassData[] = [
    // === THÁNG 12/2024 ===
    {
      id: 'c1',
      name: '📚 VSTEP Complete - Khóa 12',
      teacher: 'Nguyễn Thị Mai',
      students: [
        { id: 's1', name: 'Nguyễn Văn A' },
        { id: 's2', name: 'Trần Thị B' },
        { id: 's3', name: 'Lê Văn C' },
        { id: 's4', name: 'Phạm Thị D' },
        { id: 's5', name: 'Hoàng Văn E' },
        { id: 's6', name: 'Đỗ Văn F' },
        { id: 's7', name: 'Vũ Thị G' },
        { id: 's8', name: 'Bùi Văn H' },
      ],
      totalSessions: 40,
      currentSession: 24,
      month: 12,
    },
    {
      id: 'c2',
      name: '🎯 VSTEP Foundation - Khóa 08',
      teacher: 'Lê Văn Tùng',
      students: [
        { id: 's9', name: 'Mai Văn I' },
        { id: 's10', name: 'Đinh Thị K' },
        { id: 's11', name: 'Cao Văn L' },
        { id: 's12', name: 'Tô Thị M' },
        { id: 's13', name: 'Nguyễn Văn N' },
      ],
      totalSessions: 30,
      currentSession: 18,
      month: 12,
    },
    {
      id: 'c3',
      name: '🚀 VSTEP Starter - Khóa 03',
      teacher: 'Phạm Thị Lan',
      students: [
        { id: 's14', name: 'Trần Văn O' },
        { id: 's15', name: 'Hoàng Văn P' },
        { id: 's16', name: 'Lý Thị Q' },
        { id: 's17', name: 'Đặng Văn R' },
        { id: 's18', name: 'Phan Thị S' },
        { id: 's19', name: 'Võ Văn T' },
      ],
      totalSessions: 25,
      currentSession: 15,
      month: 12,
    },
    {
      id: 'c4',
      name: '🏗️ VSTEP Builder - Khóa 05',
      teacher: 'Trần Văn Hùng',
      students: [
        { id: 's20', name: 'Dương Văn U' },
        { id: 's21', name: 'Hồ Thị V' },
        { id: 's22', name: 'Lương Văn W' },
        { id: 's23', name: 'Chu Thị X' },
      ],
      totalSessions: 35,
      currentSession: 20,
      month: 12,
    },
    {
      id: 'c5',
      name: '💻 VSTEP Developer - Khóa 02',
      teacher: 'Nguyễn Văn Khoa',
      students: [
        { id: 's24', name: 'Đào Văn Y' },
        { id: 's25', name: 'Tạ Thị Z' },
        { id: 's26', name: 'Hà Văn AA' },
        { id: 's27', name: 'Trương Thị BB' },
        { id: 's28', name: 'Lê Văn CC' },
      ],
      totalSessions: 30,
      currentSession: 12,
      month: 12,
    },

    // === THÁNG 1/2025 ===
    {
      id: 'c6',
      name: '📚 VSTEP Complete - Khóa 13',
      teacher: 'Nguyễn Thị Mai',
      students: [
        { id: 's29', name: 'Nguyễn Văn DD' },
        { id: 's30', name: 'Trần Thị EE' },
        { id: 's31', name: 'Lê Văn FF' },
        { id: 's32', name: 'Phạm Thị GG' },
        { id: 's33', name: 'Hoàng Văn HH' },
        { id: 's34', name: 'Đỗ Văn II' },
      ],
      totalSessions: 40,
      currentSession: 5,
      month: 1,
    },
    {
      id: 'c7',
      name: '⚡ VSTEP Booster - Khóa 04',
      teacher: 'Lê Văn Tùng',
      students: [
        { id: 's35', name: 'Vũ Thị JJ' },
        { id: 's36', name: 'Bùi Văn KK' },
        { id: 's37', name: 'Mai Văn LL' },
        { id: 's38', name: 'Đinh Thị MM' },
      ],
      totalSessions: 28,
      currentSession: 4,
      month: 1,
    },
    {
      id: 'c8',
      name: '🔥 VSTEP Intensive - Khóa 01',
      teacher: 'Phạm Thị Lan',
      students: [
        { id: 's39', name: 'Cao Văn NN' },
        { id: 's40', name: 'Tô Thị OO' },
        { id: 's41', name: 'Nguyễn Văn PP' },
        { id: 's42', name: 'Trần Văn QQ' },
        { id: 's43', name: 'Hoàng Văn RR' },
      ],
      totalSessions: 45,
      currentSession: 3,
      month: 1,
    },

    // === THÁNG 2/2025 ===
    {
      id: 'c9',
      name: '📝 VSTEP Practice - Khóa 06',
      teacher: 'Trần Văn Hùng',
      students: [
        { id: 's44', name: 'Lý Thị SS' },
        { id: 's45', name: 'Đặng Văn TT' },
        { id: 's46', name: 'Phan Thị UU' },
        { id: 's47', name: 'Võ Văn VV' },
        { id: 's48', name: 'Dương Văn WW' },
        { id: 's49', name: 'Hồ Thị XX' },
      ],
      totalSessions: 20,
      currentSession: 0,
      month: 2,
    },
    {
      id: 'c10',
      name: '👑 VSTEP Premium - Khóa 03',
      teacher: 'Nguyễn Văn Khoa',
      students: [
        { id: 's50', name: 'Lương Văn YY' },
        { id: 's51', name: 'Chu Thị ZZ' },
        { id: 's52', name: 'Đào Văn AAA' },
        { id: 's53', name: 'Tạ Thị BBB' },
      ],
      totalSessions: 50,
      currentSession: 0,
      month: 2,
    },
    {
      id: 'c11',
      name: '🏆 VSTEP Master - Khóa 02',
      teacher: 'Lê Văn Tùng',
      students: [
        { id: 's54', name: 'Hà Văn CCC' },
        { id: 's55', name: 'Trương Thị DDD' },
        { id: 's56', name: 'Lê Văn EEE' },
        { id: 's57', name: 'Nguyễn Văn FFF' },
        { id: 's58', name: 'Trần Thị GGG' },
      ],
      totalSessions: 60,
      currentSession: 0,
      month: 2,
    },

    // === THÁNG 3/2025 ===
    {
      id: 'c12',
      name: '📚 VSTEP Complete - Khóa 14',
      teacher: 'Phạm Thị Lan',
      students: [
        { id: 's59', name: 'Lê Văn HHH' },
        { id: 's60', name: 'Phạm Thị III' },
        { id: 's61', name: 'Hoàng Văn JJJ' },
      ],
      totalSessions: 40,
      currentSession: 0,
      month: 3,
    },
    {
      id: 'c13',
      name: '🎯 VSTEP Foundation - Khóa 09',
      teacher: 'Trần Văn Hùng',
      students: [
        { id: 's62', name: 'Đỗ Văn KKK' },
        { id: 's63', name: 'Vũ Thị LLL' },
        { id: 's64', name: 'Bùi Văn MMM' },
        { id: 's65', name: 'Mai Văn NNN' },
      ],
      totalSessions: 30,
      currentSession: 0,
      month: 3,
    },
  ];

  const months = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' },
  ];

  const classesByMonth = allClasses.filter(c => c.month === selectedMonth);
  const currentClass = allClasses.find(c => c.id === selectedClass);

  const filteredStudents = currentClass?.students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Calculate stats for selected month
  const totalClasses = classesByMonth.length;
  const totalStudents = classesByMonth.reduce((sum, c) => sum + c.students.length, 0);
  const totalSessions = classesByMonth.reduce((sum, c) => sum + c.currentSession, 0);

  // Calculate attendance rate
  let totalAttendanceRecords = 0;
  let presentRecords = 0;
  classesByMonth.forEach(cls => {
    cls.students.forEach(student => {
      const studentAttendance = mockAttendance[student.id] || {};
      for (let session = 1; session <= cls.currentSession; session++) {
        if (studentAttendance[session]) {
          totalAttendanceRecords++;
          if (studentAttendance[session] === 'present') {
            presentRecords++;
          }
        }
      }
    });
  });
  const attendanceRate = totalAttendanceRecords > 0 ? Math.round((presentRecords / totalAttendanceRecords) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {view !== 'months' && (
                <button
                  onClick={() => {
                    if (view === 'attendance') {
                      setView('classes');
                      setSelectedClass(null);
                    } else if (view === 'classes') {
                      setView('months');
                    }
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ArrowLeft className="size-5" />
                </button>
              )}
              <Calendar className="size-8" />
              <h1 className="text-3xl font-bold">
                {view === 'months' && 'Điểm danh các lớp học'}
                {view === 'classes' && `Lớp học - ${months.find(m => m.value === selectedMonth)?.label}`}
                {view === 'attendance' && currentClass?.name}
              </h1>
            </div>
            <p className="text-red-100">
              {view === 'months' && 'Xem và quản lý điểm danh theo tháng'}
              {view === 'classes' && `${classesByMonth.length} lớp học trong tháng`}
              {view === 'attendance' && `Giáo viên: ${currentClass?.teacher}`}
            </p>
          </div>
        </div>
      </div>

      {/* Month View - Stats */}
      {view === 'months' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="size-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng lớp học</p>
                  <p className="text-2xl font-bold text-gray-900">{totalClasses}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="size-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng học sinh</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="size-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng buổi học</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="size-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tỷ lệ có mặt</p>
                  <p className="text-2xl font-bold text-green-600">{attendanceRate}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Month Selector */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn tháng để xem
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {/* Year 2024 */}
              <optgroup label="─── Năm 2024 ───">
                <option value={12}>
                  Tháng 12/2024 - {allClasses.filter(c => c.month === 12).length} lớp học
                </option>
              </optgroup>
              
              {/* Year 2025 */}
              <optgroup label="─── Năm 2025 ───">
                {months.filter(m => m.value <= 3).map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}/2025 - {allClasses.filter(c => c.month === month.value).length} lớp học
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Classes Grid */}
          {classesByMonth.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classesByMonth.map((classItem) => {
                // Calculate class attendance stats
                let classTotal = 0;
                let classPresent = 0;
                classItem.students.forEach(student => {
                  const studentAttendance = mockAttendance[student.id] || {};
                  for (let session = 1; session <= classItem.currentSession; session++) {
                    if (studentAttendance[session]) {
                      classTotal++;
                      if (studentAttendance[session] === 'present') {
                        classPresent++;
                      }
                    }
                  }
                });
                const classRate = classTotal > 0 ? Math.round((classPresent / classTotal) * 100) : 0;

                return (
                  <div
                    key={classItem.id}
                    onClick={() => {
                      setSelectedClass(classItem.id);
                      setView('attendance');
                    }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer hover:border-red-500 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                        <Users className="size-6 text-red-600" />
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        classRate >= 90 ? 'bg-green-100 text-green-700' :
                        classRate >= 75 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {classRate}% có mặt
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{classItem.name}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users className="size-4" />
                        <span>{classItem.students.length} sinh viên</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        <span>{classItem.currentSession}/{classItem.totalSessions} buổi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">GV:</span>
                        <span className="font-medium">{classItem.teacher}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
              <AlertCircle className="size-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có lớp học</h3>
              <p className="text-gray-600">Không có lớp học nào trong tháng {selectedMonth}</p>
            </div>
          )}
        </>
      )}

      {/* Attendance Table View */}
      {view === 'attendance' && currentClass && (
        <>
          {/* Search */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sinh viên..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="size-4" />
                Xuất Excel
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">STT</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Họ và tên</th>
                    {Array.from({ length: Math.min(currentClass.currentSession, 10) }, (_, i) => i + 1).map(session => (
                      <th key={session} className="px-4 py-4 text-center text-sm font-medium text-gray-700">
                        Buổi {session}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student, index) => {
                    const studentAttendance = mockAttendance[student.id] || {};
                    
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                        {Array.from({ length: Math.min(currentClass.currentSession, 10) }, (_, i) => i + 1).map(session => {
                          const status = studentAttendance[session];
                          return (
                            <td key={session} className="px-4 py-4 text-center">
                              {status === 'present' && (
                                <div className="flex items-center justify-center">
                                  <CheckCircle className="size-5 text-green-600" />
                                </div>
                              )}
                              {status === 'late' && (
                                <div className="flex items-center justify-center">
                                  <Clock className="size-5 text-yellow-600" />
                                </div>
                              )}
                              {status === 'absent' && (
                                <div className="flex items-center justify-center">
                                  <XCircle className="size-5 text-red-600" />
                                </div>
                              )}
                              {!status && (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Chú thích</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-5 text-green-600" />
                <span className="text-sm text-gray-600">Có mặt</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-5 text-yellow-600" />
                <span className="text-sm text-gray-600">Đi muộn</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="size-5 text-red-600" />
                <span className="text-sm text-gray-600">Vắng mặt</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-300 font-bold">—</span>
                <span className="text-sm text-gray-600">Chưa điểm danh</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}