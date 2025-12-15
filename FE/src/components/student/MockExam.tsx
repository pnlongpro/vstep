import { useState, useEffect } from 'react';
import { Shuffle, Play, RotateCw, Book, Headphones, PenTool, Mic, Clock, FileText, CheckCircle, Info, Sparkles, TrendingUp, ChevronRight, ArrowLeft } from 'lucide-react';
import { ExamInterface } from '../exam/ExamInterface';

interface Exam {
  id: string;
  title: string;
  level: string;
  duration: string;
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface SelectedExams {
  reading: Exam | null;
  listening: Exam | null;
  writing: Exam | null;
  speaking: Exam | null;
}

interface MockExamProps {
  onBack: () => void;
}

export function MockExam({ onBack }: MockExamProps) {
  const [selectedExams, setSelectedExams] = useState<SelectedExams>({
    reading: null,
    listening: null,
    writing: null,
    speaking: null,
  });
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [hasRandomized, setHasRandomized] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  // Mock data - Kho đề cho mỗi kỹ năng
  const examPools = {
    reading: [
      { id: 'R001', title: 'Reading Test A - Academic Topics', level: 'B2', duration: '60 phút', questions: 40, difficulty: 'Medium' as const },
      { id: 'R002', title: 'Reading Test B - Social Issues', level: 'B2', duration: '60 phút', questions: 40, difficulty: 'Medium' as const },
      { id: 'R003', title: 'Reading Test C - Science & Technology', level: 'C1', duration: '60 phút', questions: 40, difficulty: 'Hard' as const },
      { id: 'R004', title: 'Reading Test D - Business & Economics', level: 'B1', duration: '60 phút', questions: 40, difficulty: 'Easy' as const },
      { id: 'R005', title: 'Reading Test E - Arts & Culture', level: 'B2', duration: '60 phút', questions: 40, difficulty: 'Medium' as const },
      { id: 'R006', title: 'Reading Test F - Environment', level: 'C1', duration: '60 phút', questions: 40, difficulty: 'Hard' as const },
    ],
    listening: [
      { id: 'L001', title: 'Listening Test A - Conversations', level: 'B2', duration: '40 phút', questions: 35, difficulty: 'Medium' as const },
      { id: 'L002', title: 'Listening Test B - Lectures', level: 'B2', duration: '40 phút', questions: 35, difficulty: 'Medium' as const },
      { id: 'L003', title: 'Listening Test C - Interviews', level: 'C1', duration: '40 phút', questions: 35, difficulty: 'Hard' as const },
      { id: 'L004', title: 'Listening Test D - News & Reports', level: 'B1', duration: '40 phút', questions: 35, difficulty: 'Easy' as const },
      { id: 'L005', title: 'Listening Test E - Discussions', level: 'B2', duration: '40 phút', questions: 35, difficulty: 'Medium' as const },
      { id: 'L006', title: 'Listening Test F - Presentations', level: 'C1', duration: '40 phút', questions: 35, difficulty: 'Hard' as const },
    ],
    writing: [
      { id: 'W001', title: 'Writing Test A - Formal Letter + Essay', level: 'B2', duration: '60 phút', questions: 2, difficulty: 'Medium' as const },
      { id: 'W002', title: 'Writing Test B - Email + Argumentative', level: 'B2', duration: '60 phút', questions: 2, difficulty: 'Medium' as const },
      { id: 'W003', title: 'Writing Test C - Report + Opinion', level: 'C1', duration: '60 phút', questions: 2, difficulty: 'Hard' as const },
      { id: 'W004', title: 'Writing Test D - Complaint + Discuss', level: 'B1', duration: '60 phút', questions: 2, difficulty: 'Easy' as const },
      { id: 'W005', title: 'Writing Test E - Request + Compare', level: 'B2', duration: '60 phút', questions: 2, difficulty: 'Medium' as const },
      { id: 'W006', title: 'Writing Test F - Application + Analysis', level: 'C1', duration: '60 phút', questions: 2, difficulty: 'Hard' as const },
    ],
    speaking: [
      { id: 'S001', title: 'Speaking Test A - Personal + Topic', level: 'B2', duration: '12 phút', questions: 3, difficulty: 'Medium' as const },
      { id: 'S002', title: 'Speaking Test B - Experience + Discussion', level: 'B2', duration: '12 phút', questions: 3, difficulty: 'Medium' as const },
      { id: 'S003', title: 'Speaking Test C - Abstract Topics', level: 'C1', duration: '12 phút', questions: 3, difficulty: 'Hard' as const },
      { id: 'S004', title: 'Speaking Test D - Daily Life', level: 'B1', duration: '12 phút', questions: 3, difficulty: 'Easy' as const },
      { id: 'S005', title: 'Speaking Test E - Social Issues', level: 'B2', duration: '12 phút', questions: 3, difficulty: 'Medium' as const },
      { id: 'S006', title: 'Speaking Test F - Professional Topics', level: 'C1', duration: '12 phút', questions: 3, difficulty: 'Hard' as const },
    ],
  };

  const randomizeExams = () => {
    setIsRandomizing(true);
    
    // Simulate random animation
    setTimeout(() => {
      const newSelection: SelectedExams = {
        reading: examPools.reading[Math.floor(Math.random() * examPools.reading.length)],
        listening: examPools.listening[Math.floor(Math.random() * examPools.listening.length)],
        writing: examPools.writing[Math.floor(Math.random() * examPools.writing.length)],
        speaking: examPools.speaking[Math.floor(Math.random() * examPools.speaking.length)],
      };
      
      setSelectedExams(newSelection);
      setIsRandomizing(false);
      setHasRandomized(true);
    }, 800);
  };

  // Auto random on first load
  useEffect(() => {
    randomizeExams();
  }, []);

  const skills = [
    { 
      id: 'reading', 
      name: 'Reading', 
      icon: Book, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    },
    { 
      id: 'listening', 
      name: 'Listening', 
      icon: Headphones, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700'
    },
    { 
      id: 'writing', 
      name: 'Writing', 
      icon: PenTool, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700'
    },
    { 
      id: 'speaking', 
      name: 'Speaking', 
      icon: Mic, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700'
    },
  ];

  const getTotalDuration = () => {
    let total = 0;
    Object.values(selectedExams).forEach(exam => {
      if (exam) {
        const minutes = parseInt(exam.duration.split(' ')[0]);
        total += minutes;
      }
    });
    return total;
  };

  const getTotalQuestions = () => {
    let total = 0;
    Object.values(selectedExams).forEach(exam => {
      if (exam) {
        total += exam.questions;
      }
    });
    return total;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Khi đã bắt đầu thi, render ExamInterface full-screen
  if (examStarted) {
    return (
      <ExamInterface
        examTitle="Thi thử VSTEP - Random đề"
        duration={172}
        skills={['reading', 'listening', 'writing', 'speaking']}
        onBack={() => {
          if (confirm('Bạn có chắc muốn thoát khỏi bài thi? Tiến trình sẽ không được lưu.')) {
            setExamStarted(false);
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-6">{/* Removed max-w-7xl and padding as App.tsx already provides it */}
      {/* Back Button - ONLY show when NOT in exam */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
      >
        <ArrowLeft className="size-4" />
        <span>Quay lại Trang chủ</span>
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Shuffle className="size-6" />
              </div>
              <div>
                <h1 className="text-2xl">Thi thử VSTEP - Random đề</h1>
                <p className="text-sm text-white/80">Hệ thống tự động random đề từ từng kỹ năng riêng biệt</p>
              </div>
            </div>
          </div>
          <button
            onClick={randomizeExams}
            disabled={isRandomizing}
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <RotateCw className={`size-5 ${isRandomizing ? 'animate-spin' : ''}`} />
            <span>{isRandomizing ? 'Đang random...' : 'Random lại'}</span>
          </button>
        </div>

        {/* Stats */}
        {hasRandomized && (
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="size-4" />
                <span className="text-xs opacity-80">Tổng thời gian</span>
              </div>
              <p className="text-2xl">{getTotalDuration()} phút</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="size-4" />
                <span className="text-xs opacity-80">Tổng câu hỏi</span>
              </div>
              <p className="text-2xl">{getTotalQuestions()} câu</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="size-4" />
                <span className="text-xs opacity-80">Kỹ năng</span>
              </div>
              <p className="text-2xl">4/4</p>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm text-blue-900 mb-2">
              <strong>🎲 Cơ chế Random Đề Thi</strong>
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>Bài thi thử sẽ tự động random đề từ từng kỹ năng riêng biệt. Mỗi lần thi, hệ thống sẽ chọn ngẫu nhiên:</p>
              <ul className="list-none space-y-0.5 ml-4 mt-2">
                <li>🔹 <strong>1 đề Reading</strong> từ kho đề Reading ({examPools.reading.length} đề)</li>
                <li>🔹 <strong>1 đề Listening</strong> từ kho đề Listening ({examPools.listening.length} đề)</li>
                <li>🔹 <strong>1 đề Writing</strong> từ kho đề Writing ({examPools.writing.length} đề)</li>
                <li>🔹 <strong>1 đề Speaking</strong> từ kho đề Speaking ({examPools.speaking.length} đề)</li>
              </ul>
              <p className="mt-2">⚡ <strong>Không theo bộ 4 kỹ năng cố định</strong> → Đảm bảo đa dạng và công bằng!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {skills.map((skill) => {
          const Icon = skill.icon;
          const exam = selectedExams[skill.id as keyof SelectedExams];
          
          return (
            <div
              key={skill.id}
              className={`bg-white rounded-xl border-2 ${skill.borderColor} overflow-hidden transition-all ${
                isRandomizing ? 'animate-pulse' : 'hover:shadow-lg'
              }`}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${skill.color} p-4 text-white`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg">{skill.name}</h3>
                    <p className="text-xs opacity-80">Đề được random tự động</p>
                  </div>
                  <Shuffle className="size-5 opacity-60" />
                </div>
              </div>

              {/* Content */}
              {exam ? (
                <div className="p-5 space-y-4">
                  {/* Exam Title */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(exam.difficulty)}`}>
                        {exam.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${skill.bgColor} ${skill.textColor}`}>
                        {exam.level}
                      </span>
                    </div>
                    <h4 className="text-sm">{exam.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">ID: {exam.id}</p>
                  </div>

                  {/* Exam Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`${skill.bgColor} rounded-lg p-3`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className={`size-4 ${skill.textColor}`} />
                        <span className={`text-xs ${skill.textColor}`}>Thời gian</span>
                      </div>
                      <p className="text-sm">{exam.duration}</p>
                    </div>
                    <div className={`${skill.bgColor} rounded-lg p-3`}>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className={`size-4 ${skill.textColor}`} />
                        <span className={`text-xs ${skill.textColor}`}>Câu hỏi</span>
                      </div>
                      <p className="text-sm">{exam.questions} câu</p>
                    </div>
                  </div>

                  {/* Progress Preview */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>Tiến độ chuẩn bị</span>
                      <span>Sẵn sàng</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${skill.color} w-full`} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className={`w-16 h-16 ${skill.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`size-8 ${skill.textColor}`} />
                  </div>
                  <p className="text-sm text-gray-500">Đang random đề...</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      {hasRandomized && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm mb-1">Sẵn sàng bắt đầu?</h4>
                <p className="text-xs text-gray-600">
                  Bạn sẽ làm bài thi với 4 đề đã được random. Thời gian làm bài: <strong>{getTotalDuration()} phút</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={randomizeExams}
                className="flex items-center gap-2 px-5 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                <RotateCw className="size-4" />
                <span className="text-sm">Random lại</span>
              </button>
              <button
                onClick={() => {
                  console.log('Starting exam with:', selectedExams);
                  alert('Bắt đầu thi với đề đã random!\n\n' + 
                    `Reading: ${selectedExams.reading?.title}\n` +
                    `Listening: ${selectedExams.listening?.title}\n` +
                    `Writing: ${selectedExams.writing?.title}\n` +
                    `Speaking: ${selectedExams.speaking?.title}`
                  );
                  setExamStarted(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <Play className="size-5" />
                <span>Bắt đầu thi ngay</span>
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="size-5 text-blue-600" />
          <h3 className="text-sm">Thống kê kho đề</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((skill) => {
            const poolSize = examPools[skill.id as keyof typeof examPools].length;
            const Icon = skill.icon;
            return (
              <div key={skill.id} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className={`w-8 h-8 ${skill.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                  <Icon className={`size-4 ${skill.textColor}`} />
                </div>
                <p className="text-xs text-gray-600 mb-1">{skill.name}</p>
                <p className="text-xl text-gray-900">{poolSize}</p>
                <p className="text-xs text-gray-500">đề có sẵn</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}