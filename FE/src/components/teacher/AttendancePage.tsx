import { useState } from 'react';
import { ArrowLeft, Search, Calendar, Users, CheckCircle, XCircle, Download, Filter, Clock } from 'lucide-react';

interface AttendancePageProps {
  onBack: () => void;
}

interface Student {
  id: string;
  name: string;
  studentCode: string;
  avatar?: string;
}

interface ClassData {
  id: string;
  name: string;
  students: Student[];
  totalSessions: number;
}

export function AttendancePage({ onBack }: AttendancePageProps) {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | null>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'classes' | 'attendance'>('classes');

  // Mock data
  const classes: ClassData[] = [
    {
      id: 'c1',
      name: 'VSTEP B2 - Lớp 01',
      students: [
        { id: 's1', name: 'Nguyễn Văn A', studentCode: 'SV001' },
        { id: 's2', name: 'Trần Thị B', studentCode: 'SV002' },
        { id: 's3', name: 'Lê Văn C', studentCode: 'SV003' },
        { id: 's4', name: 'Phạm Thị D', studentCode: 'SV004' },
        { id: 's5', name: 'Hoàng Văn E', studentCode: 'SV005' },
      ],
      totalSessions: 20,
    },
    {
      id: 'c2',
      name: 'VSTEP C1 - Lớp 02',
      students: [
        { id: 's6', name: 'Đỗ Văn F', studentCode: 'SV006' },
        { id: 's7', name: 'Vũ Thị G', studentCode: 'SV007' },
        { id: 's8', name: 'Bùi Văn H', studentCode: 'SV008' },
      ],
      totalSessions: 15,
    },
    {
      id: 'c3',
      name: 'VSTEP B1 - Lớp 03',
      students: [
        { id: 's9', name: 'Mai Văn I', studentCode: 'SV009' },
        { id: 's10', name: 'Đinh Thị K', studentCode: 'SV010' },
        { id: 's11', name: 'Cao Văn L', studentCode: 'SV011' },
        { id: 's12', name: 'Tô Thị M', studentCode: 'SV012' },
      ],
      totalSessions: 18,
    },
  ];

  const currentClass = classes.find(c => c.id === selectedClass);

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late' | null) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveAttendance = () => {
    console.log('Saving attendance:', {
      classId: selectedClass,
      date: selectedDate,
      attendance,
    });
    alert('Đã lưu điểm danh thành công!');
  };

  const handleMarkAllPresent = () => {
    if (!currentClass) return;
    const newAttendance: Record<string, 'present'> = {};
    currentClass.students.forEach(student => {
      newAttendance[student.id] = 'present';
    });
    setAttendance(newAttendance);
  };

  const filteredStudents = currentClass?.students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentCode.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length;
  const lateCount = Object.values(attendance).filter(v => v === 'late').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (view === 'attendance') {
                  setView('classes');
                  setSelectedClass('');
                  setAttendance({});
                } else {
                  onBack();
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {view === 'classes' ? 'Điểm danh' : currentClass?.name}
              </h1>
              <p className="text-sm text-gray-600">
                {view === 'classes' ? 'Chọn lớp học để điểm danh' : `Điểm danh ngày ${selectedDate}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {view === 'classes' ? (
          /* Class Selection View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                onClick={() => {
                  setSelectedClass(classItem.id);
                  setView('attendance');
                }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer hover:border-emerald-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Users className="size-6 text-emerald-600" />
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {classItem.students.length} sinh viên
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{classItem.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="size-4" />
                  <span>{classItem.totalSessions} buổi học</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Attendance View */
          <>
            {/* Controls */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày điểm danh
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tìm kiếm sinh viên
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm theo tên hoặc mã SV..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thao tác nhanh
                  </label>
                  <button
                    onClick={handleMarkAllPresent}
                    className="w-full px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="size-4" />
                    Điểm danh tất cả
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng số</p>
                    <p className="text-2xl font-bold text-gray-900">{currentClass?.students.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Có mặt</p>
                    <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <XCircle className="size-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vắng mặt</p>
                    <p className="text-2xl font-bold text-red-600">{absentCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="size-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Đi muộn</p>
                    <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Student List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">STT</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Mã SV</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Họ và tên</th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudents.map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{student.studentCode}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{student.name}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleAttendanceChange(student.id, 'present')}
                              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                                attendance[student.id] === 'present'
                                  ? 'bg-green-600 text-white shadow-md'
                                  : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'
                              }`}
                            >
                              Có mặt
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student.id, 'late')}
                              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                                attendance[student.id] === 'late'
                                  ? 'bg-yellow-600 text-white shadow-md'
                                  : 'bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-700'
                              }`}
                            >
                              Muộn
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student.id, 'absent')}
                              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                                attendance[student.id] === 'absent'
                                  ? 'bg-red-600 text-white shadow-md'
                                  : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700'
                              }`}
                            >
                              Vắng
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-between">
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="size-4" />
                Xuất Excel
              </button>
              <button
                onClick={handleSaveAttendance}
                className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="size-5" />
                Lưu điểm danh
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
