import { useState } from 'react';
import { ArrowLeft, Users, BookOpen, Calendar, Clock, Send, Search, Filter, Eye, BarChart3, CheckCircle2, AlertCircle } from 'lucide-react';
import { ClassAssignmentDetailView } from './ClassAssignmentDetailView';
import { AssignmentCreatorNew } from './AssignmentCreatorNew';

interface AssignmentByClassPageProps {
  onBack: () => void;
}

type PageView = 'classes' | 'assignments' | 'detail' | 'create';

interface Class {
  id: number;
  name: string;
  code: string;
  level: string;
  students: number;
  schedule: string;
  activeAssignments: number;
  completionRate: number;
  status: 'active' | 'completed' | 'upcoming';
}

interface ClassAssignment {
  id: number;
  classId: number;
  className: string;
  title: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  dueDate: string;
  totalStudents: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  status: 'active' | 'expired';
}

const mockClasses: Class[] = [
  {
    id: 1,
    name: 'VSTEP B1 - Lớp sáng',
    code: 'VSTEP-B1-M01',
    level: 'B1',
    students: 25,
    schedule: 'T2, T4, T6 - 8:00-10:00',
    activeAssignments: 3,
    completionRate: 85,
    status: 'active'
  },
  {
    id: 2,
    name: 'VSTEP B2 - Lớp chiều',
    code: 'VSTEP-B2-A01',
    level: 'B2',
    students: 30,
    schedule: 'T3, T5, T7 - 14:00-16:00',
    activeAssignments: 5,
    completionRate: 78,
    status: 'active'
  },
  {
    id: 3,
    name: 'VSTEP C1 - Lớp tối',
    code: 'VSTEP-C1-E01',
    level: 'C1',
    students: 20,
    schedule: 'T2, T4 - 18:00-20:00',
    activeAssignments: 2,
    completionRate: 92,
    status: 'active'
  },
  {
    id: 4,
    name: 'VSTEP B1 - Lớp cuối tuần',
    code: 'VSTEP-B1-W01',
    level: 'B1',
    students: 18,
    schedule: 'T7, CN - 9:00-12:00',
    activeAssignments: 1,
    completionRate: 65,
    status: 'active'
  },
];

const mockAssignments: ClassAssignment[] = [
  {
    id: 1,
    classId: 1,
    className: 'VSTEP B1 - Lớp sáng',
    title: 'Reading Comprehension - Unit 5',
    skill: 'reading',
    dueDate: '2025-12-20',
    totalStudents: 25,
    completed: 18,
    inProgress: 5,
    notStarted: 2,
    status: 'active',
  },
  {
    id: 2,
    classId: 1,
    className: 'VSTEP B1 - Lớp sáng',
    title: 'Listening Practice - Part 3',
    skill: 'listening',
    dueDate: '2025-12-18',
    totalStudents: 25,
    completed: 20,
    inProgress: 3,
    notStarted: 2,
    status: 'active',
  },
  {
    id: 3,
    classId: 2,
    className: 'VSTEP B2 - Lớp chiều',
    title: 'Writing Task 2 - Opinion Essay',
    skill: 'writing',
    dueDate: '2025-12-22',
    totalStudents: 30,
    completed: 15,
    inProgress: 10,
    notStarted: 5,
    status: 'active',
  },
  {
    id: 4,
    classId: 2,
    className: 'VSTEP B2 - Lớp chiều',
    title: 'Speaking Part 2 - Describe',
    skill: 'speaking',
    dueDate: '2025-12-25',
    totalStudents: 30,
    completed: 10,
    inProgress: 15,
    notStarted: 5,
    status: 'active',
  },
  {
    id: 5,
    classId: 3,
    className: 'VSTEP C1 - Lớp tối',
    title: 'Advanced Reading - Academic',
    skill: 'reading',
    dueDate: '2025-12-19',
    totalStudents: 20,
    completed: 18,
    inProgress: 2,
    notStarted: 0,
    status: 'active',
  },
];

export function AssignmentByClassPage({ onBack }: AssignmentByClassPageProps) {
  const [view, setView] = useState<PageView>('classes');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<ClassAssignment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'upcoming'>('all');

  const filteredClasses = mockClasses.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || cls.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getClassAssignments = (classId: number) => {
    return mockAssignments.filter(a => a.classId === classId);
  };

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'reading': return 'from-blue-500 to-cyan-500';
      case 'listening': return 'from-purple-500 to-pink-500';
      case 'writing': return 'from-emerald-500 to-teal-500';
      case 'speaking': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSkillLabel = (skill: string) => {
    switch (skill) {
      case 'reading': return 'Đọc';
      case 'listening': return 'Nghe';
      case 'writing': return 'Viết';
      case 'speaking': return 'Nói';
      default: return skill;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A2': return 'bg-green-100 text-green-700';
      case 'B1': return 'bg-blue-100 text-blue-700';
      case 'B2': return 'bg-purple-100 text-purple-700';
      case 'C1': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewClass = (cls: Class) => {
    setSelectedClass(cls);
    setView('assignments');
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
    setView('classes');
  };

  const handleViewDetail = (assignment: ClassAssignment) => {
    setSelectedAssignment(assignment);
    setView('detail');
  };

  const handleCreateAssignment = () => {
    setView('create');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={view === 'assignments' ? handleBackToClasses : onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {view === 'classes' ? 'Giao bài tập theo lớp' : selectedClass?.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {view === 'classes' 
                    ? 'Quản lý bài tập theo từng lớp học' 
                    : `${selectedClass?.students} học sinh • ${selectedClass?.schedule}`
                  }
                </p>
              </div>
            </div>

            {view === 'assignments' && selectedClass && (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                onClick={handleCreateAssignment}
              >
                <Send className="size-4" />
                Giao bài tập mới cho lớp
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'classes' ? (
          // Classes View
          <div className="space-y-6">
            {/* Search & Filter */}
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm lớp học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="size-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="active">Đang học</option>
                    <option value="upcoming">Sắp diễn ra</option>
                    <option value="completed">Hoàn thành</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-emerald-300 transition-all shadow-sm overflow-hidden"
                >
                  {/* Class Header */}
                  <div className="p-6 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{cls.name}</h3>
                        <p className="text-sm text-gray-600">{cls.code}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(cls.level)}`}>
                        {cls.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="size-4" />
                        {cls.students} học sinh
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        {cls.schedule.split(' - ')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Class Stats */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-blue-600">{cls.activeAssignments}</div>
                        <div className="text-xs text-blue-700">Bài tập đang giao</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-green-600">{cls.completionRate}%</div>
                        <div className="text-xs text-green-700">Tỷ lệ hoàn thành</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleViewClass(cls)}
                      className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="size-4" />
                      Xem bài tập lớp này
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : view === 'assignments' ? (
          // Assignments View for Selected Class
          <div className="space-y-6">
            {/* Class Overview */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tổng quan lớp học</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-700">Tổng bài tập</span>
                    <BookOpen className="size-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedClass ? getClassAssignments(selectedClass.id).length : 0}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-700">Hoàn thành</span>
                    <CheckCircle2 className="size-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {selectedClass?.completionRate}%
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-purple-700">Học sinh</span>
                    <Users className="size-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedClass?.students}
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-orange-700">Đang hoạt động</span>
                    <AlertCircle className="size-5 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedClass?.activeAssignments}
                  </div>
                </div>
              </div>
            </div>

            {/* Assignments List */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Danh sách bài tập đã giao</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {selectedClass && getClassAssignments(selectedClass.id).map((assignment) => (
                  <div key={assignment.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Skill Icon */}
                        <div className={`w-12 h-12 bg-gradient-to-br ${getSkillColor(assignment.skill)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <BookOpen className="size-6 text-white" />
                        </div>

                        {/* Assignment Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{assignment.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className={`px-2 py-1 bg-gradient-to-r ${getSkillColor(assignment.skill)} text-white rounded text-xs`}>
                              {getSkillLabel(assignment.skill)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              Hạn: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="size-3" />
                              {assignment.totalStudents} học sinh
                            </span>
                          </div>

                          {/* Progress Stats */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-gray-600">Hoàn thành: <strong className="text-green-600">{assignment.completed}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-gray-600">Đang làm: <strong className="text-blue-600">{assignment.inProgress}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                              <span className="text-gray-600">Chưa làm: <strong className="text-gray-600">{assignment.notStarted}</strong></span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Tiến độ hoàn thành</span>
                              <span className="text-xs font-medium text-emerald-600">
                                {Math.round((assignment.completed / assignment.totalStudents) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 transition-all duration-300"
                                style={{ width: `${(assignment.completed / assignment.totalStudents) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                          onClick={() => handleViewDetail(assignment)}
                        >
                          <Eye className="size-5" />
                        </button>
                        <button
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Thống kê"
                        >
                          <BarChart3 className="size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {selectedClass && getClassAssignments(selectedClass.id).length === 0 && (
                  <div className="p-12 text-center">
                    <BookOpen className="size-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có bài tập</h3>
                    <p className="text-sm text-gray-600 mb-4">Lớp này chưa được giao bài tập nào</p>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center gap-2">
                      <Send className="size-4" />
                      Giao bài tập đầu tiên
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : view === 'detail' ? (
          // Detail View
          selectedAssignment && selectedClass && (
            <ClassAssignmentDetailView
              assignmentId={selectedAssignment.id}
              classId={selectedClass.id}
              onBack={() => setView('assignments')}
            />
          )
        ) : (
          // Create View
          <AssignmentCreatorNew
            onBack={() => setView('assignments')}
          />
        )}
      </div>
    </div>
  );
}