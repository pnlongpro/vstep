import { Book, Headphones, PenTool, Mic, ChevronLeft, Clock, Target, TrendingUp, Filter, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PracticeListProps {
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  mode: 'part' | 'fulltest';
  part?: number;
  onBack: () => void;
  onStartPractice: (exerciseId: number) => void;
}

export function PracticeList({ skill, mode, part, onBack, onStartPractice }: PracticeListProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debug: log props khi component mount hoặc props thay đổi
  useEffect(() => {
    console.log('PracticeList Props:', { skill, mode, part });
  }, [skill, mode, part]);

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Remove Vietnamese diacritics for better search
  const removeDiacritics = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  const skillInfo = {
    reading: {
      name: 'Đọc hiểu',
      icon: Book,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      parts: [
        { id: 1, name: 'Part 1: Điền từ', description: 'Điền từ vào đoạn văn' },
        { id: 2, name: 'Part 2: Đọc hiểu ngắn', description: 'Đọc hiểu đoạn văn ngắn' },
        { id: 3, name: 'Part 3: Nối đoạn', description: 'Nối tiêu đề với đoạn văn' },
        { id: 4, name: 'Part 4: Đọc hiểu dài', description: 'Đọc hiểu bài dài' },
      ],
    },
    listening: {
      name: 'Nghe hiểu',
      icon: Headphones,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      parts: [
        { id: 1, name: 'Part 1: Hội thoại ngắn', description: 'Nghe hội thoại hàng ngày' },
        { id: 2, name: 'Part 2: Hội thoại dài', description: 'Nghe hội thoại chi tiết' },
        { id: 3, name: 'Part 3: Bài giảng', description: 'Nghe bài giảng học thuật' },
      ],
    },
    writing: {
      name: 'Viết',
      icon: PenTool,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      parts: [
        { id: 1, name: 'Part 1: Viết thư/Email', description: 'Viết thư trang trọng/Email' },
        { id: 2, name: 'Part 2: Viết luận', description: 'Viết bài luận ý kiến' },
      ],
    },
    speaking: {
      name: 'Nói',
      icon: Mic,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      parts: [
        { id: 1, name: 'Part 1: Phỏng vấn', description: 'Trả lời câu hỏi cá nhân' },
        { id: 2, name: 'Part 2: Diễn thuyết', description: 'Nói dài về chủ đề' },
        { id: 3, name: 'Part 3: Thảo luận', description: 'Thảo luận chuyên sâu' },
      ],
    },
  };

  const currentSkill = skillInfo[skill];
  
  // Safety check: if skill is invalid, return error state
  if (!currentSkill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Kỹ năng không hợp lệ</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }
  
  const Icon = currentSkill.icon;

  // Mock data - danh sách bài tập
  const mockExercises = [
    // Reading Part 1
    { id: 1, title: 'Bài tập 1: Môi trường và biến đổi khí hậu', level: 'B1', questions: 10, time: 15, completed: true, score: 8.5, part: 1, skill: 'reading' },
    { id: 2, title: 'Bài tập 2: Công nghệ và xã hội hiện đại', level: 'B2', questions: 12, time: 18, completed: true, score: 7.0, part: 1, skill: 'reading' },
    { id: 3, title: 'Bài tập 3: Giáo dục và phát triển', level: 'B1', questions: 10, time: 15, completed: false, score: null, part: 1, skill: 'reading' },
    // Reading Part 2
    { id: 4, title: 'Bài tập 4: Văn hóa và truyền thống', level: 'C1', questions: 15, time: 20, completed: false, score: null, part: 2, skill: 'reading' },
    { id: 5, title: 'Bài tập 5: Kinh tế và thương mại', level: 'B2', questions: 12, time: 18, completed: false, score: null, part: 2, skill: 'reading' },
    // Reading Part 3
    { id: 6, title: 'Bài tập 6: Sức khỏe và lối sống', level: 'A2', questions: 8, time: 12, completed: true, score: 9.0, part: 3, skill: 'reading' },
    { id: 7, title: 'Bài tập 7: Du lịch và khám phá', level: 'B1', questions: 10, time: 15, completed: false, score: null, part: 3, skill: 'reading' },
    // Reading Part 4
    { id: 8, title: 'Bài tập 8: Nghệ thuật và giải trí', level: 'B2', questions: 12, time: 18, completed: false, score: null, part: 4, skill: 'reading' },
    // Listening Part 1
    { id: 11, title: 'Bài tập 1: Hội thoại gia đình', level: 'B1', questions: 10, time: 15, completed: true, score: 8.0, part: 1, skill: 'listening' },
    { id: 12, title: 'Bài tập 2: Hội thoại mua sắm', level: 'A2', questions: 8, time: 12, completed: false, score: null, part: 1, skill: 'listening' },
    // Listening Part 2
    { id: 13, title: 'Bài tập 3: Hội thoại công việc', level: 'B2', questions: 12, time: 18, completed: false, score: null, part: 2, skill: 'listening' },
    { id: 14, title: 'Bài tập 4: Hội thoại học tập', level: 'B1', questions: 10, time: 15, completed: true, score: 7.5, part: 2, skill: 'listening' },
    // Listening Part 3
    { id: 15, title: 'Bài tập 5: Bài giảng khoa học', level: 'C1', questions: 15, time: 20, completed: false, score: null, part: 3, skill: 'listening' },
    { id: 16, title: 'Bài tập 6: Bài giảng lịch sử', level: 'B2', questions: 12, time: 18, completed: false, score: null, part: 3, skill: 'listening' },
    // Writing Part 1
    { id: 21, title: 'Bài tập 1: Viết email xin việc', level: 'B1', questions: 1, time: 20, completed: true, score: 7.0, part: 1, skill: 'writing' },
    { id: 22, title: 'Bài tập 2: Viết thư phàn nàn', level: 'B2', questions: 1, time: 20, completed: false, score: null, part: 1, skill: 'writing' },
    // Writing Part 2
    { id: 23, title: 'Bài tập 3: Luận về giáo dục', level: 'B2', questions: 1, time: 40, completed: false, score: null, part: 2, skill: 'writing' },
    { id: 24, title: 'Bài tập 4: Luận về công nghệ', level: 'C1', questions: 1, time: 40, completed: true, score: 8.0, part: 2, skill: 'writing' },
    // Speaking Part 1
    { id: 31, title: 'Bài tập 1: Giới thiệu bản thân', level: 'B1', questions: 5, time: 5, completed: true, score: 7.5, part: 1, skill: 'speaking' },
    { id: 32, title: 'Bài tập 2: Nói về sở thích', level: 'A2', questions: 5, time: 5, completed: false, score: null, part: 1, skill: 'speaking' },
    // Speaking Part 2
    { id: 33, title: 'Bài tập 3: Diễn thuyết về môi trường', level: 'B2', questions: 1, time: 5, completed: false, score: null, part: 2, skill: 'speaking' },
    { id: 34, title: 'Bài tập 4: Diễn thuyết về du lịch', level: 'B1', questions: 1, time: 5, completed: false, score: null, part: 2, skill: 'speaking' },
    // Speaking Part 3
    { id: 35, title: 'Bài tập 5: Thảo luận văn hóa', level: 'C1', questions: 3, time: 5, completed: false, score: null, part: 3, skill: 'speaking' },
    { id: 36, title: 'Bài tập 6: Thảo luận xã hội', level: 'B2', questions: 3, time: 5, completed: true, score: 8.5, part: 3, skill: 'speaking' },
  ];

  // Mock data - danh sách bộ đề (fulltest mode)
  const mockFullTests = skill === 'reading' ? [
    { id: 101, title: 'VSTEP Reading B1 - Full Test 01', level: 'B1', parts: 4, time: 60, completed: true, score: 7.5, examId: 'R001' },
    { id: 102, title: 'VSTEP Reading B1 - Full Test 02', level: 'B1', parts: 4, time: 60, completed: false, score: null, examId: 'R002' },
    { id: 103, title: 'VSTEP Reading B2 - Full Test 01', level: 'B2', parts: 4, time: 60, completed: false, score: null, examId: 'R003' },
    { id: 104, title: 'VSTEP Reading B2 - Full Test 02', level: 'B2', parts: 4, time: 60, completed: true, score: 8.0, examId: 'R004' },
    { id: 105, title: 'VSTEP Reading C1 - Full Test 01', level: 'C1', parts: 4, time: 60, completed: false, score: null, examId: 'R005' },
  ] : skill === 'listening' ? [
    { id: 201, title: 'VSTEP Listening B1 - Full Test 01', level: 'B1', parts: 3, time: 40, completed: true, score: 7.0, examId: 'L001' },
    { id: 202, title: 'VSTEP Listening B1 - Full Test 02', level: 'B1', parts: 3, time: 40, completed: false, score: null, examId: 'L002' },
    { id: 203, title: 'VSTEP Listening B2 - Full Test 01', level: 'B2', parts: 3, time: 40, completed: false, score: null, examId: 'L003' },
    { id: 204, title: 'VSTEP Listening B2 - Full Test 02', level: 'B2', parts: 3, time: 40, completed: true, score: 7.5, examId: 'L004' },
    { id: 205, title: 'VSTEP Listening C1 - Full Test 01', level: 'C1', parts: 3, time: 40, completed: false, score: null, examId: 'L005' },
  ] : skill === 'writing' ? [
    { id: 301, title: 'VSTEP Writing B1 - Full Test 01', level: 'B1', parts: 2, time: 60, completed: true, score: 6.5, examId: 'W001' },
    { id: 302, title: 'VSTEP Writing B1 - Full Test 02', level: 'B1', parts: 2, time: 60, completed: false, score: null, examId: 'W002' },
    { id: 303, title: 'VSTEP Writing B2 - Full Test 01', level: 'B2', parts: 2, time: 60, completed: false, score: null, examId: 'W003' },
    { id: 304, title: 'VSTEP Writing B2 - Full Test 02', level: 'B2', parts: 2, time: 60, completed: true, score: 7.0, examId: 'W004' },
    { id: 305, title: 'VSTEP Writing C1 - Full Test 01', level: 'C1', parts: 2, time: 60, completed: false, score: null, examId: 'W005' },
  ] : [
    { id: 401, title: 'VSTEP Speaking B1 - Full Test 01', level: 'B1', parts: 3, time: 15, completed: true, score: 6.0, examId: 'S001' },
    { id: 402, title: 'VSTEP Speaking B1 - Full Test 02', level: 'B1', parts: 3, time: 15, completed: false, score: null, examId: 'S002' },
    { id: 403, title: 'VSTEP Speaking B2 - Full Test 01', level: 'B2', parts: 3, time: 15, completed: false, score: null, examId: 'S003' },
    { id: 404, title: 'VSTEP Speaking B2 - Full Test 02', level: 'B2', parts: 3, time: 15, completed: true, score: 7.0, examId: 'S004' },
    { id: 405, title: 'VSTEP Speaking C1 - Full Test 01', level: 'C1', parts: 3, time: 15, completed: false, score: null, examId: 'S005' },
  ];

  const exercises = mode === 'fulltest' ? mockFullTests : mockExercises;

  const filteredExercises = exercises.filter(ex => {
    const matchLevel = selectedLevel === 'all' || ex.level === selectedLevel;
    
    // Search trong title, level, và skill (nếu có)
    const searchableText = [
      ex.title,
      ex.level,
      'skill' in ex ? skillInfo[ex.skill as keyof typeof skillInfo]?.name : '',
      'part' in ex ? `Part ${ex.part}` : ''
    ].join(' ').toLowerCase();
    
    const matchSearch = removeDiacritics(searchableText).includes(removeDiacritics(debouncedSearch.toLowerCase()));
    
    // Nếu là mode 'part', filter theo skill và part
    if (mode === 'part' && 'skill' in ex && 'part' in ex) {
      const matchSkill = ex.skill === skill;
      const matchPart = part ? ex.part === part : true;
      return matchLevel && matchSearch && matchSkill && matchPart;
    }
    
    return matchLevel && matchSearch;
  });

  const levels = ['all', 'A2', 'B1', 'B2', 'C1'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`bg-gradient-to-br ${currentSkill.color} p-4 rounded-xl text-white`}>
            <Icon className="size-8" />
          </div>
          <div>
            <h2 className="text-2xl mb-1">
              {mode === 'fulltest' 
                ? `${currentSkill.name} - Bộ đề đầy đủ`
                : `${currentSkill.name} - ${currentSkill.parts.find(p => p.id === part)?.name || 'Tất cả'}`
              }
            </h2>
            <p className="text-sm text-gray-500">
              {mode === 'fulltest'
                ? 'Luyện tập với bộ đề hoàn chỉnh'
                : currentSkill.parts.find(p => p.id === part)?.description || 'Chọn bài tập để luyện tập'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Search Bar - Modern UI */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm -mx-6 px-6 py-4 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="size-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm đề thi theo tên, mã đề, cấp độ, kỹ năng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-[#F5F7FA] border border-transparent rounded-2xl text-sm focus:outline-none focus:bg-white focus:border-[#3B82F6] focus:shadow-lg focus:shadow-blue-100 transition-all duration-200 placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Level Filter */}
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-gray-500" />
            <span className="text-sm text-gray-600">Cấp độ:</span>
            <div className="flex gap-2">
              {levels.map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedLevel === level
                      ? `bg-gradient-to-r ${currentSkill.color} text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level === 'all' ? 'Tất cả' : level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`${currentSkill.bgColor} p-3 rounded-lg`}>
              <Target className={`size-5 ${currentSkill.textColor}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng bài tập</p>
              <p className="text-xl">{filteredExercises.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <TrendingUp className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đã hoàn thành</p>
              <p className="text-xl">{filteredExercises.filter(ex => ex.completed).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-3 rounded-lg">
              <Clock className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Điểm trung bình</p>
              <p className="text-xl">
                {filteredExercises.filter(ex => ex.score).length > 0
                  ? (filteredExercises.filter(ex => ex.score).reduce((acc, ex) => acc + (ex.score || 0), 0) / 
                     filteredExercises.filter(ex => ex.score).length).toFixed(1)
                  : '--'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-4">
        <h3 className="text-lg">
          Danh sách {mode === 'fulltest' ? 'bộ đề' : 'bài tập'} ({filteredExercises.length})
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {filteredExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => onStartPractice(exercise.id)}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all text-left group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-lg group-hover:text-blue-600 transition-colors">
                      {exercise.title}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      exercise.level === 'A2' ? 'bg-green-100 text-green-700' :
                      exercise.level === 'B1' ? 'bg-blue-100 text-blue-700' :
                      exercise.level === 'B2' ? 'bg-purple-100 text-purple-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {exercise.level}
                    </span>
                    {exercise.completed && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Đã làm
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {'examId' in exercise && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">ID:</span>
                        <span className="font-medium text-gray-700">{exercise.examId}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Target className="size-4" />
                      <span>{mode === 'fulltest' ? `${exercise.parts} phần` : `${exercise.questions} câu`}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-4" />
                      <span>{exercise.time} phút</span>
                    </div>
                    {exercise.completed && exercise.score && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="size-4 text-green-600" />
                        <span className="text-green-600">Điểm: {exercise.score}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentSkill.bgColor} ${currentSkill.textColor} group-hover:scale-110 transition-transform`}>
                  <Icon className="size-5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}