import { useState } from 'react';
import { ArrowLeft, BookOpen, Upload, Search, Filter, Users, Calendar, Clock, FileText, Send, CheckCircle2, X, File, Image, FileType } from 'lucide-react';

interface AssignmentCreatorNewProps {
  onBack: () => void;
}

type AssignmentSource = 'library' | 'upload' | null;

interface Exercise {
  id: number;
  title: string;
  description: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  level: 'A2' | 'B1' | 'B2' | 'C1';
  duration: number;
  parts: number;
  questionCount: number;
}

interface Class {
  id: number;
  name: string;
  code: string;
  students: number;
  level: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  level: 'A2' | 'B1' | 'B2' | 'C1';
  classId: number;
  className: string;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
}

const mockExercises: Exercise[] = [
  {
    id: 1,
    title: 'Academic Reading - Technology in Education',
    description: 'Bài đọc hiểu về công nghệ trong giáo dục với 3 đoạn văn',
    skill: 'reading',
    level: 'B2',
    duration: 60,
    parts: 3,
    questionCount: 40
  },
  {
    id: 2,
    title: 'VSTEP Writing Task 2 - Opinion Essay',
    description: 'Viết bài luận về chủ đề "Working from home"',
    skill: 'writing',
    level: 'B2',
    duration: 50,
    parts: 1,
    questionCount: 1
  },
  {
    id: 3,
    title: 'Listening Practice - Daily Conversations',
    description: 'Nghe các hội thoại hàng ngày với 30 câu hỏi',
    skill: 'listening',
    level: 'B1',
    duration: 30,
    parts: 3,
    questionCount: 30
  },
  {
    id: 4,
    title: 'Speaking Part 3 - Discussion',
    description: 'Thảo luận về các chủ đề xã hội',
    skill: 'speaking',
    level: 'C1',
    duration: 15,
    parts: 1,
    questionCount: 5
  },
  {
    id: 5,
    title: 'Reading Comprehension - Science Topics',
    description: 'Các bài đọc hiểu về khoa học',
    skill: 'reading',
    level: 'C1',
    duration: 60,
    parts: 4,
    questionCount: 50
  },
  {
    id: 6,
    title: 'Writing Task 1 - Describing Graphs',
    description: 'Mô tả biểu đồ và số liệu',
    skill: 'writing',
    level: 'B1',
    duration: 20,
    parts: 1,
    questionCount: 1
  },
];

const mockClasses: Class[] = [
  { id: 1, name: 'VSTEP B1 - Lớp sáng', code: 'VSTEP-B1-M01', students: 25, level: 'B1' },
  { id: 2, name: 'VSTEP B2 - Lớp chiều', code: 'VSTEP-B2-A01', students: 30, level: 'B2' },
  { id: 3, name: 'VSTEP C1 - Lớp tối', code: 'VSTEP-C1-E01', students: 20, level: 'C1' },
  { id: 4, name: 'VSTEP B1 - Lớp cuối tuần', code: 'VSTEP-B1-W01', students: 18, level: 'B1' },
];

const mockStudents: Student[] = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', level: 'B2', classId: 2, className: 'VSTEP B2 - Lớp chiều' },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', level: 'B2', classId: 2, className: 'VSTEP B2 - Lớp chiều' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', level: 'B1', classId: 1, className: 'VSTEP B1 - Lớp sáng' },
  { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', level: 'C1', classId: 3, className: 'VSTEP C1 - Lớp tối' },
  { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@email.com', level: 'B2', classId: 2, className: 'VSTEP B2 - Lớp chiều' },
  { id: 6, name: 'Đỗ Thị F', email: 'dothif@email.com', level: 'B1', classId: 1, className: 'VSTEP B1 - Lớp sáng' },
];

export function AssignmentCreatorNew({ onBack }: AssignmentCreatorNewProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [assignmentSource, setAssignmentSource] = useState<AssignmentSource>(null);
  
  // Step 1: Content selection
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]); // Changed to array of IDs
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<'all' | 'reading' | 'listening' | 'writing' | 'speaking'>('all');
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  
  // Step 2: Recipients selection
  const [recipientMode, setRecipientMode] = useState<'classes' | 'students'>('classes');
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  
  // Step 3: Configuration
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('23:59');
  const [allowLateSubmission, setAllowLateSubmission] = useState(false);
  
  // Success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: UploadedFile[] = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const filteredExercises = mockExercises.filter(ex => {
    const matchesSearch = ex.title.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
                         ex.description.toLowerCase().includes(exerciseSearch.toLowerCase());
    const matchesSkill = selectedSkillFilter === 'all' || ex.skill === selectedSkillFilter;
    return matchesSearch && matchesSkill;
  });

  const handleToggleClass = (classId: number) => {
    setSelectedClasses(prev =>
      prev.includes(classId)
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const handleToggleStudent = (studentId: number) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const getTotalRecipients = () => {
    if (recipientMode === 'classes') {
      return selectedClasses.reduce((total, classId) => {
        const cls = mockClasses.find(c => c.id === classId);
        return total + (cls?.students || 0);
      }, 0);
    }
    return selectedStudents.length;
  };

  const canProceedStep1 = () => {
    if (assignmentSource === 'library') {
      return selectedExercises.length > 0;
    }
    if (assignmentSource === 'upload') {
      return uploadedFiles.length > 0 && customTitle.trim() !== '';
    }
    return false;
  };

  const canProceedStep2 = () => {
    return getTotalRecipients() > 0;
  };

  const handleSubmit = () => {
    // Logic giao bài tập
    console.log('Submitting assignment:', {
      source: assignmentSource,
      exercises: selectedExercises.map(id => mockExercises.find(ex => ex.id === id)),
      files: uploadedFiles,
      title: assignmentTitle,
      instructions,
      dueDate,
      dueTime,
      recipients: recipientMode === 'classes' ? selectedClasses : selectedStudents,
      recipientMode,
      totalRecipients: getTotalRecipients()
    });
    
    setShowSuccessModal(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <File className="size-8 text-red-500" />;
    if (type.includes('image')) return <Image className="size-8 text-blue-500" />;
    if (type.includes('word') || type.includes('document')) return <FileType className="size-8 text-blue-600" />;
    return <FileText className="size-8 text-gray-500" />;
  };

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
                <p className="text-sm text-gray-600">
                  Bước {step}/3: {step === 1 ? 'Chọn nội dung' : step === 2 ? 'Chọn đối tượng' : 'Cấu hình & giao bài'}
                </p>
              </div>
            </div>

            {/* Step Progress */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    s === step
                      ? 'bg-emerald-600 text-white'
                      : s < step
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {s < step ? <CheckCircle2 className="size-5" /> : s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Choose Content Source */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Source Selection */}
            {!assignmentSource && (
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => setAssignmentSource('library')}
                  className="bg-white rounded-2xl border-2 border-gray-200 hover:border-emerald-400 hover:shadow-xl transition-all p-8 text-left group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="size-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Chọn từ kho bài tập</h3>
                  <p className="text-gray-600">
                    Chọn bài tập có sẵn từ thư viện với đầy đủ câu hỏi và đáp án
                  </p>
                  <div className="mt-4 flex items-center text-emerald-600 font-medium">
                    <span>Chọn phương thức này</span>
                    <ArrowLeft className="size-4 ml-2 rotate-180" />
                  </div>
                </button>

                <button
                  onClick={() => setAssignmentSource('upload')}
                  className="bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-xl transition-all p-8 text-left group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="size-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Upload file tự tạo</h3>
                  <p className="text-gray-600">
                    Tải lên file PDF, DOCX, hoặc hình ảnh bài tập tự thiết kế
                  </p>
                  <div className="mt-4 flex items-center text-purple-600 font-medium">
                    <span>Chọn phương thức này</span>
                    <ArrowLeft className="size-4 ml-2 rotate-180" />
                  </div>
                </button>
              </div>
            )}

            {/* Library Selection */}
            {assignmentSource === 'library' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">Chọn bài tập từ kho</h2>
                    {selectedExercises.length > 0 && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full font-medium">
                        {selectedExercises.length} bài đã chọn
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setAssignmentSource(null);
                      setSelectedExercises([]);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    ← Quay lại chọn phương thức khác
                  </button>
                </div>

                {/* Search & Filter */}
                <div className="bg-white rounded-xl border p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm bài tập..."
                        value={exerciseSearch}
                        onChange={(e) => setExerciseSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="size-5 text-gray-400" />
                      <select
                        value={selectedSkillFilter}
                        onChange={(e) => setSelectedSkillFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="all">Tất cả kỹ năng</option>
                        <option value="reading">Đọc</option>
                        <option value="listening">Nghe</option>
                        <option value="writing">Viết</option>
                        <option value="speaking">Nói</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Select All/Deselect All Buttons */}
                  {filteredExercises.length > 0 && (
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => setSelectedExercises(filteredExercises.map(ex => ex.id))}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Chọn tất cả
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => setSelectedExercises([])}
                        className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                      >
                        Bỏ chọn tất cả
                      </button>
                    </div>
                  )}
                </div>

                {/* Exercise List */}
                <div className="grid grid-cols-1 gap-4">
                  {filteredExercises.map(exercise => (
                    <button
                      key={exercise.id}
                      onClick={() => setSelectedExercises(prev => prev.includes(exercise.id) ? prev.filter(id => id !== exercise.id) : [...prev, exercise.id])}
                      className={`bg-white rounded-xl border-2 p-6 text-left transition-all ${
                        selectedExercises.includes(exercise.id)
                          ? 'border-emerald-500 shadow-lg'
                          : 'border-gray-200 hover:border-emerald-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${getSkillColor(exercise.skill)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <BookOpen className="size-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{exercise.title}</h3>
                            {selectedExercises.includes(exercise.id) && (
                              <CheckCircle2 className="size-5 text-emerald-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`px-2 py-1 bg-gradient-to-r ${getSkillColor(exercise.skill)} text-white rounded`}>
                              {getSkillLabel(exercise.skill)}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                              {exercise.level}
                            </span>
                            <span className="text-gray-600">
                              <Clock className="size-4 inline mr-1" />
                              {exercise.duration} phút
                            </span>
                            <span className="text-gray-600">
                              <FileText className="size-4 inline mr-1" />
                              {exercise.questionCount} câu hỏi
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Files */}
            {assignmentSource === 'upload' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Upload file bài tập</h2>
                  <button
                    onClick={() => {
                      setAssignmentSource(null);
                      setUploadedFiles([]);
                      setCustomTitle('');
                      setCustomDescription('');
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    ← Quay lại chọn phương thức khác
                  </button>
                </div>

                {/* File Upload Zone */}
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8">
                  <div className="text-center">
                    <Upload className="size-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Kéo thả file hoặc click để chọn
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Hỗ trợ: PDF, DOCX, PNG, JPG (Tối đa 10MB mỗi file)
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors">
                      <Upload className="size-5" />
                      Chọn file
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="bg-white rounded-xl border p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      File đã tải lên ({uploadedFiles.length})
                    </h3>
                    <div className="space-y-3">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          {getFileIcon(file.type)}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="size-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Info */}
                {uploadedFiles.length > 0 && (
                  <div className="bg-white rounded-xl border p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Thông tin bài tập</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tiêu đề bài tập *
                        </label>
                        <input
                          type="text"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          placeholder="VD: Reading Practice - Unit 5"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mô tả (tùy chọn)
                        </label>
                        <textarea
                          value={customDescription}
                          onChange={(e) => setCustomDescription(e.target.value)}
                          placeholder="Mô tả ngắn về bài tập..."
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            {assignmentSource && (
              <div className="flex justify-between pt-6 border-t">
                <button
                  onClick={() => {
                    setAssignmentSource(null);
                    setSelectedExercises([]);
                    setUploadedFiles([]);
                  }}
                  className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1()}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    canProceedStep1()
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Tiếp theo →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Recipients */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Chọn đối tượng nhận bài tập</h2>

            {/* Mode Selection */}
            <div className="bg-white rounded-xl border p-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setRecipientMode('classes')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    recipientMode === 'classes'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Users className="size-6 mx-auto mb-2" />
                  <p className="font-medium">Giao theo lớp</p>
                  <p className="text-sm text-gray-600">Chọn cả lớp học</p>
                </button>
                <button
                  onClick={() => setRecipientMode('students')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    recipientMode === 'students'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Users className="size-6 mx-auto mb-2" />
                  <p className="font-medium">Giao theo học sinh</p>
                  <p className="text-sm text-gray-600">Chọn từng học sinh</p>
                </button>
              </div>
            </div>

            {/* Classes Selection */}
            {recipientMode === 'classes' && (
              <div className="grid grid-cols-2 gap-4">
                {mockClasses.map(cls => (
                  <button
                    key={cls.id}
                    onClick={() => handleToggleClass(cls.id)}
                    className={`bg-white rounded-xl border-2 p-6 text-left transition-all ${
                      selectedClasses.includes(cls.id)
                        ? 'border-emerald-500 shadow-lg'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                      {selectedClasses.includes(cls.id) && (
                        <CheckCircle2 className="size-5 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{cls.code}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        <Users className="size-4 inline mr-1" />
                        {cls.students} học sinh
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {cls.level}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Students Selection */}
            {recipientMode === 'students' && (
              <div className="bg-white rounded-xl border">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Danh sách học sinh ({selectedStudents.length} đã chọn)
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedStudents(mockStudents.map(s => s.id))}
                        className="text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        Chọn tất cả
                      </button>
                      <button
                        onClick={() => setSelectedStudents([])}
                        className="text-sm text-gray-600 hover:text-gray-700"
                      >
                        Bỏ chọn tất cả
                      </button>
                    </div>
                  </div>
                </div>
                <div className="divide-y">
                  {mockStudents.map(student => (
                    <label
                      key={student.id}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleToggleStudent(student.id)}
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {student.level}
                        </span>
                        <span className="text-sm text-gray-600">{student.className}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            {getTotalRecipients() > 0 && (
              <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-6 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Đã chọn {getTotalRecipients()} học sinh
                    </p>
                    <p className="text-sm text-gray-600">
                      {recipientMode === 'classes'
                        ? `Từ ${selectedClasses.length} lớp học`
                        : 'Được chọn riêng lẻ'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Quay lại
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2()}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  canProceedStep2()
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Tiếp theo →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Configure & Send */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Cấu hình và giao bài</h2>

            {/* Assignment Summary */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tóm tắt bài tập</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <BookOpen className="size-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Nội dung</p>
                    <p className="font-medium text-gray-900">
                      {assignmentSource === 'library'
                        ? selectedExercises.map(id => mockExercises.find(ex => ex.id === id)?.title).join(', ')
                        : customTitle || 'File tự tạo'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="size-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Đối tượng</p>
                    <p className="font-medium text-gray-900">
                      {getTotalRecipients()} học sinh
                      {recipientMode === 'classes' && ` (${selectedClasses.length} lớp)`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Cấu hình bài tập</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề hiển thị *
                  </label>
                  <input
                    type="text"
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                    placeholder={
                      assignmentSource === 'library'
                        ? selectedExercises.map(id => mockExercises.find(ex => ex.id === id)?.title).join(', ')
                        : customTitle
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hướng dẫn cho học sinh
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Nhập hướng dẫn, yêu cầu đặc biệt..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hạn nộp *
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giờ hạn nộp
                    </label>
                    <input
                      type="time"
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allowLateSubmission}
                    onChange={(e) => setAllowLateSubmission(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">Cho phép nộp muộn</span>
                </label>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Quay lại
              </button>
              <button
                onClick={handleSubmit}
                disabled={!assignmentTitle || !dueDate}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                  assignmentTitle && dueDate
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="size-5" />
                Giao bài tập
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="size-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Giao bài thành công!</h3>
            <p className="text-gray-600 mb-6">
              Bài tập đã được giao cho {getTotalRecipients()} học sinh
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                onBack();
              }}
              className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}