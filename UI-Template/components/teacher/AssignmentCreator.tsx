import { useState } from 'react';
import { ArrowLeft, Plus, Save, Users, BookOpen, Calendar, Clock, FileText, Search, X, CheckCircle2, AlertCircle, Send } from 'lucide-react';

interface AssignmentCreatorProps {
  onBack: () => void;
}

interface Student {
  id: number;
  name: string;
  email: string;
  level: 'A2' | 'B1' | 'B2' | 'C1';
  class: string;
}

interface Exercise {
  id: number;
  title: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  level: 'A2' | 'B1' | 'B2' | 'C1';
  duration: number;
  parts: number;
}

const mockStudents: Student[] = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', level: 'B2', class: 'Lớp B2.1' },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', level: 'B2', class: 'Lớp B2.1' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', level: 'B1', class: 'Lớp B1.2' },
  { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', level: 'C1', class: 'Lớp C1.1' },
  { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@email.com', level: 'B2', class: 'Lớp B2.1' },
  { id: 6, name: 'Đỗ Thị F', email: 'dothif@email.com', level: 'B1', class: 'Lớp B1.2' },
];

const mockExercises: Exercise[] = [
  { id: 1, title: 'Academic Reading - Technology in Education', skill: 'reading', level: 'B2', duration: 60, parts: 3 },
  { id: 2, title: 'IELTS Writing Task 2 - Opinion Essay', skill: 'writing', level: 'B2', duration: 40, parts: 1 },
  { id: 3, title: 'Listening Practice - Daily Conversations', skill: 'listening', level: 'B1', duration: 30, parts: 3 },
  { id: 4, title: 'Speaking Part 2 - Describe a Place', skill: 'speaking', level: 'C1', duration: 15, parts: 2 },
  { id: 5, title: 'Reading Comprehension - Science Topics', skill: 'reading', level: 'C1', duration: 60, parts: 4 },
  { id: 6, title: 'Writing Task 1 - Describing Graphs', skill: 'writing', level: 'B1', duration: 20, parts: 1 },
];

const classes = ['Lớp B2.1', 'Lớp B1.2', 'Lớp C1.1', 'Lớp A2.1'];

export function AssignmentCreator({ onBack }: AssignmentCreatorProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]); // Changed to array
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('23:59');
  const [studentSearch, setStudentSearch] = useState('');
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<'all' | 'reading' | 'listening' | 'writing' | 'speaking'>('all');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [assignmentMode, setAssignmentMode] = useState<'class' | 'individual'>('class'); // New state for mode

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

  const handleSelectClass = (className: string) => {
    setSelectedClass(className);
    // Auto-select all students in this class
    const studentsInClass = mockStudents.filter(s => s.class === className).map(s => s.id);
    setSelectedStudents(studentsInClass);
  };

  const handleToggleStudent = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAllStudents = () => {
    setSelectedStudents(mockStudents.map(s => s.id));
  };

  const handleDeselectAllStudents = () => {
    setSelectedStudents([]);
    setSelectedClass('');
  };

  const handleToggleExercise = (exerciseId: number) => {
    setSelectedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleSelectAllExercises = () => {
    setSelectedExercises(filteredExercises.map(ex => ex.id));
  };

  const handleDeselectAllExercises = () => {
    setSelectedExercises([]);
  };

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.class.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredExercises = mockExercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(exerciseSearch.toLowerCase());
    const matchesSkill = selectedSkillFilter === 'all' || exercise.skill === selectedSkillFilter;
    return matchesSearch && matchesSkill;
  });

  const handleSubmit = () => {
    // In a real app, this would save to backend
    console.log('Creating assignment:', {
      title: assignmentTitle,
      description: assignmentDescription,
      exerciseIds: selectedExercises,
      studentIds: selectedStudents,
      dueDate,
      dueTime,
    });
    setShowSuccessModal(true);
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    setStep(1);
    setSelectedStudents([]);
    setSelectedClass('');
    setSelectedExercises([]); // Reset selected exercises
    setAssignmentTitle('');
    setAssignmentDescription('');
    setDueDate('');
    setDueTime('23:59');
  };

  const selectedExerciseData = mockExercises.find(ex => ex.id === selectedExercises[0]);
  const selectedExercisesData = mockExercises.filter(ex => selectedExercises.includes(ex.id));
  const totalDuration = selectedExercisesData.reduce((sum, ex) => sum + ex.duration, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Giao bài tập mới</h1>
                <p className="text-sm text-gray-600">Tạo và giao bài tập cho học sinh</p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${step >= 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {step > 1 ? <CheckCircle2 className="size-4" /> : '1'}
                </div>
                <span className="text-sm font-medium">Chọn học sinh</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${step >= 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {step > 2 ? <CheckCircle2 className="size-4" /> : '2'}
                </div>
                <span className="text-sm font-medium">Chọn bài tập</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${step >= 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  3
                </div>
                <span className="text-sm font-medium">Chi tiết</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Select Students */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="size-6 text-emerald-600" />
                Chọn học sinh nhận bài tập
              </h2>

              {/* Mode Selection Tabs */}
              <div className="mb-6">
                <div className="flex gap-3 p-1 bg-gray-100 rounded-xl">
                  <button
                    onClick={() => {
                      setAssignmentMode('class');
                      setSelectedStudents([]);
                      setSelectedClass('');
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all ${
                      assignmentMode === 'class'
                        ? 'bg-white text-emerald-700 shadow-md font-semibold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Users className="size-5" />
                    <span>Giao cho cả lớp</span>
                    {assignmentMode === 'class' && selectedClass && (
                      <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        {mockStudents.filter(s => s.class === selectedClass).length} HS
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setAssignmentMode('individual');
                      setSelectedClass('');
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all ${
                      assignmentMode === 'individual'
                        ? 'bg-white text-emerald-700 shadow-md font-semibold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Users className="size-5" />
                    <span>Giao cho cá nhân</span>
                    {assignmentMode === 'individual' && selectedStudents.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        {selectedStudents.length} HS
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Mode: Class Selection */}
              {assignmentMode === 'class' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Chọn lớp học
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {classes.map(className => {
                        const studentCount = mockStudents.filter(s => s.class === className).length;
                        const classStudents = mockStudents.filter(s => s.class === className);
                        const levelCounts = classStudents.reduce((acc, s) => {
                          acc[s.level] = (acc[s.level] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>);
                        
                        return (
                          <button
                            key={className}
                            onClick={() => handleSelectClass(className)}
                            className={`p-5 rounded-xl border-2 transition-all text-left ${
                              selectedClass === className
                                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                                : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className={`text-lg font-bold ${
                                selectedClass === className ? 'text-emerald-700' : 'text-gray-900'
                              }`}>
                                {className}
                              </h3>
                              {selectedClass === className && (
                                <CheckCircle2 className="size-6 text-emerald-600" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <Users className="size-4" />
                              <span>{studentCount} học sinh</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(levelCounts).map(([level, count]) => (
                                <span key={level} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                  {level}: {count}
                                </span>
                              ))}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preview selected class students */}
                  {selectedClass && (
                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <h4 className="font-medium text-emerald-900 mb-2">
                        Danh sách học sinh lớp {selectedClass}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                        {mockStudents
                          .filter(s => s.class === selectedClass)
                          .map(student => (
                            <div key={student.id} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                              <span className="text-gray-700">{student.name}</span>
                              <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
                                {student.level}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mode: Individual Selection */}
              {assignmentMode === 'individual' && (
                <div className="space-y-4">
                  {/* Search */}
                  <div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm học sinh theo tên, email, hoặc lớp..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Select All / Deselect All */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Đã chọn <span className="font-bold text-emerald-600">{selectedStudents.length}</span> học sinh
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSelectAllStudents}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Chọn tất cả
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={handleDeselectAllStudents}
                        className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                      >
                        Bỏ chọn tất cả
                      </button>
                    </div>
                  </div>

                  {/* Student List */}
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {filteredStudents.map(student => (
                      <div
                        key={student.id}
                        onClick={() => handleToggleStudent(student.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedStudents.includes(student.id)
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                {student.class}
                              </span>
                              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                {student.level}
                              </span>
                            </div>
                          </div>
                          {selectedStudents.includes(student.id) && (
                            <CheckCircle2 className="size-5 text-emerald-600 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={selectedStudents.length === 0}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                Tiếp tục
                <ArrowLeft className="size-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Exercise */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="size-6 text-emerald-600" />
                  Chọn bài tập
                  {selectedExercises.length > 0 && (
                    <span className="ml-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                      {selectedExercises.length} bài đã chọn
                    </span>
                  )}
                </h2>
                {filteredExercises.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSelectAllExercises}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Chọn tất cả
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={handleDeselectAllExercises}
                      className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                    >
                      Bỏ chọn tất cả
                    </button>
                  </div>
                )}
              </div>

              {/* Skill Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lọc theo kỹ năng
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSkillFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedSkillFilter === 'all'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setSelectedSkillFilter('reading')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedSkillFilter === 'reading'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Đọc
                  </button>
                  <button
                    onClick={() => setSelectedSkillFilter('listening')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedSkillFilter === 'listening'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Nghe
                  </button>
                  <button
                    onClick={() => setSelectedSkillFilter('writing')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedSkillFilter === 'writing'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Viết
                  </button>
                  <button
                    onClick={() => setSelectedSkillFilter('speaking')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedSkillFilter === 'speaking'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Nói
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài tập..."
                    value={exerciseSearch}
                    onChange={(e) => setExerciseSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Exercise List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredExercises.map(exercise => (
                  <div
                    key={exercise.id}
                    className={`p-4 rounded-lg border-2 transition-all relative ${
                      selectedExercises.includes(exercise.id)
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Exercise Icon */}
                      <div className={`w-12 h-12 bg-gradient-to-br ${getSkillColor(exercise.skill)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <BookOpen className="size-6 text-white" />
                      </div>

                      {/* Exercise Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{exercise.title}</h3>
                            <div className="flex items-center gap-2 flex-wrap text-sm text-gray-600">
                              <span className={`px-2 py-1 bg-gradient-to-r ${getSkillColor(exercise.skill)} text-white rounded text-xs font-medium`}>
                                {getSkillLabel(exercise.skill)}
                              </span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                {exercise.level}
                              </span>
                              <span className="flex items-center gap-1 text-xs">
                                <Clock className="size-3" />
                                {exercise.duration} phút
                              </span>
                              <span className="text-xs">{exercise.parts} câu hỏi</span>
                            </div>
                          </div>

                          {/* Checkbox */}
                          <button
                            type="button"
                            onClick={() => handleToggleExercise(exercise.id)}
                            className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                              selectedExercises.includes(exercise.id)
                                ? 'bg-emerald-600 border-emerald-600'
                                : 'border-gray-300 hover:border-emerald-400 bg-white'
                            }`}
                          >
                            {selectedExercises.includes(exercise.id) && (
                              <CheckCircle2 className="size-4 text-white" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="size-4" />
                Quay lại
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedExercises.length} // Update to array
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                Tiếp tục
                <ArrowLeft className="size-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Assignment Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="size-6 text-emerald-600" />
                Chi tiết bài tập
              </h2>

              <div className="space-y-6">
                {/* Assignment Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề bài tập <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                    placeholder="VD: Bài tập Reading tuần 1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả và hướng dẫn
                  </label>
                  <textarea
                    value={assignmentDescription}
                    onChange={(e) => setAssignmentDescription(e.target.value)}
                    placeholder="Nhập mô tả chi tiết về bài tập, yêu cầu, và hướng dẫn cho học sinh..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Due Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hạn nộp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giờ nộp
                    </label>
                    <input
                      type="time"
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h3 className="font-medium text-emerald-900 mb-3">Tóm tắt bài tập</h3>
                  <div className="space-y-2 text-sm">
                    {selectedClass && (
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-emerald-600" />
                        <span className="text-gray-700">
                          Lớp học: <strong>{selectedClass}</strong>
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-emerald-600" />
                      <span className="text-gray-700">
                        Giao cho <strong>{selectedStudents.length}</strong> học sinh
                      </span>
                    </div>
                    
                    {/* Multiple Exercises Display */}
                    {selectedExercisesData.length > 0 && (
                      <>
                        <div className="flex items-center gap-2 mt-3">
                          <BookOpen className="size-4 text-emerald-600" />
                          <span className="text-gray-700">
                            <strong>{selectedExercisesData.length}</strong> bài tập đã chọn
                          </span>
                        </div>
                        <div className="ml-6 space-y-1 max-h-32 overflow-y-auto">
                          {selectedExercisesData.map((exercise, index) => (
                            <div key={exercise.id} className="flex items-start gap-2 text-xs">
                              <span className="text-emerald-600 font-medium">{index + 1}.</span>
                              <div className="flex-1">
                                <span className="text-gray-700">{exercise.title}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`px-1.5 py-0.5 bg-gradient-to-r ${getSkillColor(exercise.skill)} text-white rounded`}>
                                    {getSkillLabel(exercise.skill)}
                                  </span>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-600">{exercise.duration} phút</span>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-600">{exercise.level}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-emerald-200">
                          <Clock className="size-4 text-emerald-600" />
                          <span className="text-gray-700">
                            Tổng thời gian: <strong>{totalDuration} phút</strong>
                          </span>
                        </div>
                      </>
                    )}
                    
                    {dueDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-emerald-600" />
                        <span className="text-gray-700">
                          Hạn nộp: <strong>{new Date(dueDate).toLocaleDateString('vi-VN')} lúc {dueTime}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="size-4" />
                Quay lại
              </button>
              <button
                onClick={handleSubmit}
                disabled={!assignmentTitle || !dueDate}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="size-4" />
                Giao bài tập
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="size-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Giao bài thành công!</h2>
            <div className="text-left bg-emerald-50 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                {selectedClass && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Lớp học:</span>
                    <span className="font-semibold text-emerald-700">{selectedClass}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Số học sinh:</span>
                  <span className="font-semibold text-emerald-700">{selectedStudents.length} học sinh</span>
                </div>
                {selectedExercisesData.length > 0 && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Số bài tập:</span>
                      <span className="font-semibold text-emerald-700">{selectedExercisesData.length} bài tập</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-emerald-200">
                      <div className="text-xs text-gray-600 mb-1">Danh sách bài tập:</div>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {selectedExercisesData.map((exercise, index) => (
                          <div key={exercise.id} className="text-xs text-emerald-700">
                            {index + 1}. {exercise.title}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-gray-600">Tổng thời gian:</span>
                      <span className="font-semibold text-emerald-700">{totalDuration} phút</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Học sinh sẽ nhận được thông báo qua email và trong hệ thống.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onBack();
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Về danh sách
              </button>
              <button
                onClick={handleCreateAnother}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Giao bài khác
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}