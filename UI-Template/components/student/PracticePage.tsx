import { useState } from 'react';
import { Book, Headphones, PenTool, Mic, Target, ChevronRight, Clock, Award, TrendingUp, Filter, Search, Star, Play, CheckCircle, Lock, BookOpen, Zap, FileText, Brain, BarChart3, Calendar } from 'lucide-react';

export function PracticePage() {
  const [selectedSkill, setSelectedSkill] = useState<'all' | 'reading' | 'listening' | 'writing' | 'speaking'>('all');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'A2' | 'B1' | 'B2' | 'C1'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'part' | 'full' | 'practice'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - exercises
  const exercises = [
    {
      id: 1,
      title: 'Reading Part 1: Điền từ vào chỗ trống',
      skill: 'reading',
      level: 'B1',
      type: 'part',
      duration: 15,
      questions: 10,
      completed: true,
      score: 8.5,
      difficulty: 'Trung bình',
      icon: Book,
      color: 'blue',
      description: 'Luyện tập kỹ năng điền từ vào đoạn văn'
    },
    {
      id: 2,
      title: 'Listening Part 2: Hội thoại ngắn',
      skill: 'listening',
      level: 'B1',
      type: 'part',
      duration: 20,
      questions: 8,
      completed: true,
      score: 7.5,
      difficulty: 'Dễ',
      icon: Headphones,
      color: 'green',
      description: 'Nghe và trả lời câu hỏi về hội thoại'
    },
    {
      id: 3,
      title: 'Writing Task 1: Email thân mật',
      skill: 'writing',
      level: 'B2',
      type: 'part',
      duration: 20,
      questions: 1,
      completed: false,
      score: null,
      difficulty: 'Trung bình',
      icon: PenTool,
      color: 'purple',
      description: 'Viết email cho người quen về một chủ đề'
    },
    {
      id: 4,
      title: 'Speaking Part 1: Tự giới thiệu',
      skill: 'speaking',
      level: 'B1',
      type: 'part',
      duration: 5,
      questions: 5,
      completed: false,
      score: null,
      difficulty: 'Dễ',
      icon: Mic,
      color: 'orange',
      description: 'Trả lời câu hỏi về bản thân'
    },
    {
      id: 5,
      title: 'Full Test VSTEP B2',
      skill: 'reading',
      level: 'B2',
      type: 'full',
      duration: 150,
      questions: 140,
      completed: false,
      score: null,
      difficulty: 'Khó',
      icon: FileText,
      color: 'red',
      description: 'Bài thi đầy đủ cả 4 kỹ năng'
    },
    {
      id: 6,
      title: 'Reading Part 3: Đọc hiểu đoạn văn dài',
      skill: 'reading',
      level: 'C1',
      type: 'part',
      duration: 30,
      questions: 15,
      completed: false,
      score: null,
      difficulty: 'Khó',
      icon: Book,
      color: 'blue',
      description: 'Đọc và phân tích các đoạn văn phức tạp'
    },
    {
      id: 7,
      title: 'Listening Part 3: Bài giảng học thuật',
      skill: 'listening',
      level: 'C1',
      type: 'part',
      duration: 25,
      questions: 12,
      completed: false,
      score: null,
      difficulty: 'Khó',
      icon: Headphones,
      color: 'green',
      description: 'Nghe bài giảng và trả lời câu hỏi chi tiết'
    },
    {
      id: 8,
      title: 'Writing Task 2: Bài luận ý kiến',
      skill: 'writing',
      level: 'B2',
      type: 'part',
      duration: 40,
      questions: 1,
      completed: true,
      score: 7.0,
      difficulty: 'Khó',
      icon: PenTool,
      color: 'purple',
      description: 'Viết bài luận bày tỏ quan điểm'
    },
    {
      id: 9,
      title: 'Speaking Part 3: Thảo luận chủ đề',
      skill: 'speaking',
      level: 'B2',
      type: 'part',
      duration: 10,
      questions: 3,
      completed: false,
      score: null,
      difficulty: 'Trung bình',
      icon: Mic,
      color: 'orange',
      description: 'Trả lời câu hỏi sâu về một chủ đề'
    },
    {
      id: 10,
      title: 'Practice: 100 câu từ vựng B1',
      skill: 'reading',
      level: 'B1',
      type: 'practice',
      duration: 30,
      questions: 100,
      completed: false,
      score: null,
      difficulty: 'Dễ',
      icon: Brain,
      color: 'indigo',
      description: 'Luyện tập từ vựng theo chủ đề'
    },
  ];

  // Filter exercises
  const filteredExercises = exercises.filter(ex => {
    const matchesSkill = selectedSkill === 'all' || ex.skill === selectedSkill;
    const matchesLevel = selectedLevel === 'all' || ex.level === selectedLevel;
    const matchesType = selectedType === 'all' || ex.type === selectedType;
    const matchesSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSkill && matchesLevel && matchesType && matchesSearch;
  });

  // Statistics
  const stats = {
    totalCompleted: exercises.filter(e => e.completed).length,
    totalExercises: exercises.length,
    averageScore: exercises.filter(e => e.score).reduce((acc, e) => acc + (e.score || 0), 0) / exercises.filter(e => e.score).length,
    totalTime: exercises.filter(e => e.completed).reduce((acc, e) => acc + e.duration, 0),
    streak: 7,
  };

  const skills = [
    { id: 'all', label: 'Tất cả', icon: Target, color: 'gray' },
    { id: 'reading', label: 'Reading', icon: Book, color: 'blue' },
    { id: 'listening', label: 'Listening', icon: Headphones, color: 'green' },
    { id: 'writing', label: 'Writing', icon: PenTool, color: 'purple' },
    { id: 'speaking', label: 'Speaking', icon: Mic, color: 'orange' },
  ];

  const levels = [
    { id: 'all', label: 'Tất cả' },
    { id: 'A2', label: 'A2' },
    { id: 'B1', label: 'B1' },
    { id: 'B2', label: 'B2' },
    { id: 'C1', label: 'C1' },
  ];

  const types = [
    { id: 'all', label: 'Tất cả' },
    { id: 'part', label: 'Từng phần' },
    { id: 'full', label: 'Đề đầy đủ' },
    { id: 'practice', label: 'Luyện tập' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'text-green-700 bg-green-100';
      case 'Trung bình': return 'text-yellow-700 bg-yellow-100';
      case 'Khó': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'reading': return 'blue';
      case 'listening': return 'green';
      case 'writing': return 'purple';
      case 'speaking': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">🎯 Luyện tập</h1>
            <p className="text-blue-100">
              Theo dõi tiến độ và luyện tập theo kỹ năng
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-1">{stats.streak} 🔥</div>
            <p className="text-sm text-blue-100">Chuỗi ngày học</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="size-8 text-green-600" />
            <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              +{stats.totalCompleted}
            </span>
          </div>
          <p className="text-2xl mb-1">{stats.totalCompleted}/{stats.totalExercises}</p>
          <p className="text-sm text-gray-600">Bài đã hoàn thành</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Award className="size-8 text-yellow-600" />
            <span className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
              Tốt
            </span>
          </div>
          <p className="text-2xl mb-1">{stats.averageScore.toFixed(1)}/10</p>
          <p className="text-sm text-gray-600">Điểm trung bình</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Clock className="size-8 text-blue-600" />
            <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Tuần này
            </span>
          </div>
          <p className="text-2xl mb-1">{Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m</p>
          <p className="text-sm text-gray-600">Thời gian luyện tập</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="size-8 text-purple-600" />
            <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              +15%
            </span>
          </div>
          <p className="text-2xl mb-1">85%</p>
          <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài tập..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filter Pills - Skills */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="size-4 text-gray-600" />
            <span className="text-sm text-gray-700">Kỹ năng:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => {
              const Icon = skill.icon;
              const isActive = selectedSkill === skill.id;
              return (
                <button
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? `bg-${skill.color}-100 text-${skill.color}-700 border-2 border-${skill.color}-500`
                      : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <Icon className="size-4" />
                  <span className="text-sm">{skill.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Pills - Levels and Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Levels */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="size-4 text-gray-600" />
              <span className="text-sm text-gray-700">Trình độ:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedLevel === level.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Types */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="size-4 text-gray-600" />
              <span className="text-sm text-gray-700">Loại bài:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedType === type.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Tìm thấy <span className="text-blue-600">{filteredExercises.length}</span> bài tập
          </p>
        </div>
      </div>

      {/* Exercise List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredExercises.map((exercise) => {
          const Icon = exercise.icon;
          const skillColor = getSkillColor(exercise.skill);
          
          return (
            <div
              key={exercise.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 group"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-14 h-14 bg-${skillColor}-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`size-7 text-${skillColor}-600`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg mb-1 group-hover:text-blue-600 transition-colors">
                        {exercise.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                    </div>
                    {exercise.completed && (
                      <div className="ml-4 flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle className="size-4 text-green-600" />
                        <span className="text-sm text-green-700">{exercise.score}/10</span>
                      </div>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="size-4" />
                      <span>{exercise.duration} phút</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="size-4" />
                      <span>{exercise.questions} câu hỏi</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs bg-${skillColor}-100 text-${skillColor}-700`}>
                      {exercise.level}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all ${
                      exercise.completed
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : `bg-${skillColor}-600 text-white hover:bg-${skillColor}-700`
                    }`}
                  >
                    <Play className="size-4" />
                    <span>{exercise.completed ? 'Làm lại' : 'Bắt đầu'}</span>
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredExercises.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <Target className="size-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl text-gray-900 mb-2">Không tìm thấy bài tập</h3>
          <p className="text-gray-600 mb-6">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
          <button
            onClick={() => {
              setSelectedSkill('all');
              setSelectedLevel('all');
              setSelectedType('all');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
