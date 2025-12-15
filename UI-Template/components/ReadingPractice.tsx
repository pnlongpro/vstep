import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle2, XCircle, Filter, BookOpen, ChevronRight, X } from 'lucide-react';
import { ReadingExercise } from './reading/ReadingExercise';
import { ReadingResult } from './reading/ReadingResult';
import { readingQuestions } from '../data/readingData';
import { ReadingFullTest } from './ReadingFullTest';
import { ReadingPartPractice } from './ReadingPartPractice';
import { readingPartsConfig } from '../data/partsConfig';

interface ReadingPracticeProps {
  onBack: () => void;
  autoStart?: boolean;
  exerciseId?: number;
  fullTestMode?: boolean; // Chế độ làm đủ tất cả parts với tabs navigation
}

type Level = 'A2' | 'B1' | 'B2' | 'C1';
type TaskType = 'all' | 'mcq' | 'cloze' | 'matching' | 'tfng';
type Mode = 'select' | 'part' | 'full' | 'exercise';
type Part = 1 | 2 | 3 | 4;

export function ReadingPractice({ onBack, autoStart = false, exerciseId, fullTestMode = false }: ReadingPracticeProps) {
  const [mode, setMode] = useState<Mode>(autoStart ? 'exercise' : (fullTestMode ? 'full' : 'select'));
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [selectedPartTest, setSelectedPartTest] = useState<{ level: 'B1' | 'B2' | 'C1'; part: 1 | 2 | 3 | 4 } | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level>('B1');
  const [selectedTask, setSelectedTask] = useState<TaskType>('all');
  const [currentExercise, setCurrentExercise] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedFullTest, setSelectedFullTest] = useState<any>(null); // Đề thi được chọn

  // Update mode when fullTestMode prop changes
  useEffect(() => {
    if (fullTestMode) {
      setMode('full');
    } else if (autoStart) {
      setMode('exercise');
    } else {
      setMode('select');
    }
  }, [fullTestMode, autoStart]);

  // Auto start exercise if exerciseId is provided
  useEffect(() => {
    if (exerciseId && fullTestMode) {
      // Nếu là fullTestMode, map exerciseId sang level và mở ReadingFullTest
      // exerciseId 101-105 từ PracticeList mockFullTests
      const fullTestMapping: Record<number, { id: number; level: 'B1' | 'B2' | 'C1'; title: string; examId: string }> = {
        101: { id: 1, level: 'B1', title: 'VSTEP Reading B1 - Full Test 01', examId: 'R001' },
        102: { id: 2, level: 'B1', title: 'VSTEP Reading B1 - Full Test 02', examId: 'R002' },
        103: { id: 3, level: 'B2', title: 'VSTEP Reading B2 - Full Test 01', examId: 'R003' },
        104: { id: 4, level: 'B2', title: 'VSTEP Reading B2 - Full Test 02', examId: 'R004' },
        105: { id: 5, level: 'C1', title: 'VSTEP Reading C1 - Full Test 01', examId: 'R005' },
      };
      
      const test = fullTestMapping[exerciseId];
      if (test) {
        setSelectedFullTest(test);
      }
    } else if (exerciseId && readingQuestions.length > 0) {
      // Find exercise by ID
      const exercise = readingQuestions.find(ex => ex.id === exerciseId) || readingQuestions[0];
      setCurrentExercise(exercise);
      setMode('exercise');
    } else if (autoStart && readingQuestions.length > 0) {
      // Fallback: autoStart without specific exerciseId
      setCurrentExercise(readingQuestions[0]);
      setMode('exercise');
    }
  }, [autoStart, exerciseId, fullTestMode]);

  const levels: Level[] = ['A2', 'B1', 'B2', 'C1'];
  const taskTypes = [
    { value: 'all', label: 'Tất cả' },
    { value: 'mcq', label: 'Trắc nghiệm' },
    { value: 'cloze', label: 'Điền từ' },
    { value: 'matching', label: 'Nối câu' },
    { value: 'tfng', label: 'Đúng/Sai/Không xác định' },
  ];

  // Filter exercises
  const filteredExercises = readingQuestions.filter((ex) => {
    const levelMatch = ex.level === selectedLevel;
    const taskMatch = selectedTask === 'all' || ex.type === selectedTask;
    const partMatch = !selectedPart || ex.part === selectedPart; // Filter by selected part
    return levelMatch && taskMatch && partMatch;
  });

  const handleStartExercise = (exercise: any) => {
    setCurrentExercise(exercise);
    setShowResult(false);
  };

  const handleSubmit = (answers: Record<number, string>, timeSpent: number) => {
    // Calculate score
    let correct = 0;
    const details: any[] = [];

    currentExercise.questions.forEach((q: any, index: number) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correct++;

      details.push({
        questionIndex: index,
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      });
    });

    const total = currentExercise.questions.length;
    const percentage = (correct / total) * 100;
    let vstepScore = 0;

    // VSTEP score conversion
    if (percentage >= 90) vstepScore = 10;
    else if (percentage >= 80) vstepScore = 9;
    else if (percentage >= 70) vstepScore = 8;
    else if (percentage >= 60) vstepScore = 7;
    else if (percentage >= 50) vstepScore = 6;
    else if (percentage >= 40) vstepScore = 5;
    else vstepScore = 4;

    const resultData = {
      correct,
      total,
      percentage,
      vstepScore,
      timeSpent,
      details,
      exercise: currentExercise,
    };

    setResult(resultData);
    setShowResult(true);

    // Save to history
    saveToHistory(resultData);
  };

  const saveToHistory = (resultData: any) => {
    const history = JSON.parse(localStorage.getItem('reading_history') || '[]');
    history.unshift({
      ...resultData,
      date: new Date().toISOString(),
      skill: 'reading',
    });
    localStorage.setItem('reading_history', JSON.stringify(history.slice(0, 50)));
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentExercise(null);
  };

  // If selected a full test, render ReadingFullTest component
  if (selectedFullTest) {
    return <ReadingFullTest onBack={onBack} level={selectedFullTest.level as 'B1' | 'B2' | 'C1'} examId={selectedFullTest.examId} />;
  }

  // If selected a part test, render ReadingPartPractice component
  if (selectedPartTest) {
    return <ReadingPartPractice 
      key={`part-${selectedPartTest.part}-${selectedPartTest.level}`} 
      onBack={onBack} 
      level={selectedPartTest.level} 
      part={selectedPartTest.part} 
    />;
  }

  // If doing exercise
  if (currentExercise && !showResult) {
    return (
      <ReadingExercise
        exercise={currentExercise}
        onSubmit={handleSubmit}
        onBack={() => {
          // Nếu autoStart=true (từ PracticeList), quay về PracticeList
          if (autoStart) {
            onBack();
          } else {
            // Ngược lại, clear exercise để quay về danh sách
            setCurrentExercise(null);
          }
        }}
      />
    );
  }

  // If showing result
  if (showResult && result) {
    return (
      <ReadingResult
        result={result}
        onTryAgain={handleTryAgain}
        onBackToList={() => {
          setShowResult(false);
          setCurrentExercise(null);
        }}
      />
    );
  }

  // Exercise list
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            // Nếu autoStart=true (từ PracticeList), luôn quay về PracticeList
            if (autoStart) {
              onBack();
              return;
            }
            
            // Smart back navigation cho mode thông thường
            if (mode === 'part' && selectedPart) {
              // From exercise list -> back to part selection
              setSelectedPart(null);
            } else if (mode === 'part' || mode === 'full') {
              // From part/full selection -> back to mode selection
              setMode('select');
            } else {
              // From mode selection -> back to home
              onBack();
            }
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h2 className="text-2xl">Luyện tập Đọc hiểu</h2>
          <p className="text-gray-600">Luyện tập kỹ năng đọc hiểu</p>
        </div>
      </div>

      {/* Mode Selection Modal */}
      {mode === 'select' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <BookOpen className="size-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl">Đọc hiểu</h3>
                <p className="text-gray-600">Chọn chế độ luyện tập</p>
              </div>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              Bạn muốn luyện từng phần riêng lẻ hay làm bộ đề đầy đủ?
            </p>

            <div className="space-y-4">
              {/* Option 1: Practice by Part */}
              <button
                onClick={() => setMode('part')}
                className="w-full p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all border-2 border-blue-200 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <BookOpen className="size-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg text-blue-900 mb-1">Luyện theo phần</h4>
                      <p className="text-sm text-blue-700">Chọn từng dạng bài cụ thể để luyện tập riêng lẻ</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 bg-blue-200 text-blue-700 text-xs rounded-full">
                          Trắc nghiệm
                        </span>
                        <span className="px-3 py-1 bg-blue-200 text-blue-700 text-xs rounded-full">
                          Điền từ vào đoạn văn
                        </span>
                        <span className="px-3 py-1 bg-blue-200 text-blue-700 text-xs rounded-full">
                          Nối tiêu đề
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-6 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 2: Full Test */}
              <button
                onClick={() => setMode('full')}
                className="w-full p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all border-2 border-purple-200 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                      <BookOpen className="size-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg text-purple-900 mb-1">Làm bộ đề đầy đủ</h4>
                      <p className="text-sm text-purple-700">Làm bài thi hoàn chỉnh với đầy đủ các phần</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-purple-700">
                        <div className="flex items-center gap-1">
                          <Clock className="size-4" />
                          <span>60 phút</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="size-4" />
                          <span>Chấm điểm đầy đủ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-6 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Part Selection */}
      {mode === 'part' && !selectedPart && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <BookOpen className="size-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl">Chọn Part</h3>
                  <p className="text-gray-600">Chọn phần bạn muốn luyện tập</p>
                </div>
              </div>
              <button
                onClick={() => setMode('select')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {readingPartsConfig.map((partConfig, index) => (
                <button
                  key={partConfig.id}
                  onClick={() => setSelectedPart(partConfig.id as Part)}
                  className={`p-6 bg-gradient-to-br ${
                    index === 0 ? 'from-blue-50 to-blue-100 border-blue-200' :
                    index === 1 ? 'from-purple-50 to-purple-100 border-purple-200' :
                    index === 2 ? 'from-green-50 to-green-100 border-green-200' :
                    'from-yellow-50 to-yellow-100 border-yellow-200'
                  } rounded-xl hover:shadow-lg transition-all border-2 group`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 ${
                      index === 0 ? 'bg-blue-600' :
                      index === 1 ? 'bg-purple-600' :
                      index === 2 ? 'bg-green-600' :
                      'bg-yellow-600'
                    } rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <span className="text-2xl text-white">{partConfig.id}</span>
                    </div>
                    <h4 className={`text-lg ${
                      index === 0 ? 'text-blue-900' :
                      index === 1 ? 'text-purple-900' :
                      index === 2 ? 'text-green-900' :
                      'text-yellow-900'
                    } mb-2`}>Part {partConfig.id}</h4>
                    <p className={`text-sm ${
                      index === 0 ? 'text-blue-700' :
                      index === 1 ? 'text-purple-700' :
                      index === 2 ? 'text-green-700' :
                      'text-yellow-700'
                    } mb-3`}>{partConfig.title}</p>
                    <div className={`text-xs ${
                      index === 0 ? 'text-blue-600' :
                      index === 1 ? 'text-purple-600' :
                      index === 2 ? 'text-green-600' :
                      'text-yellow-600'
                    }`}>
                      <div>{partConfig.questions} câu hỏi</div>
                      <div>15 phút</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Exercise List */}
      {mode === 'part' && selectedPart && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl">Part {selectedPart} - Bộ đề luyện tập</h3>
              <p className="text-sm text-gray-600 mt-1">Bộ đề theo chuẩn VSTEP (Copy từ Thi thử)</p>
              <button
                onClick={() => setSelectedPart(null)}
                className="text-sm text-blue-600 hover:underline mt-1"
              >
                ← Quay lại chọn Part
              </button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">B1</span>
                  <span className="px-3 py-1 text-xs rounded-lg bg-purple-100 text-purple-700">Đề thi thử số 01</span>
                </div>
                <span className="text-2xl">📝</span>
              </div>
              <h4 className="text-lg mb-2">VSTEP Reading - Đề số 01</h4>
              <p className="text-sm text-gray-600 mb-4">
                Part {selectedPart}: {
                  selectedPart === 1 ? 'Trắc nghiệm (10 câu)' :
                  selectedPart === 2 ? 'Điền từ vào đoạn văn (10 câu)' :
                  selectedPart === 3 ? 'Nối tiêu đề (10 câu)' :
                  'True/False/Not Given (10 câu)'
                }
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg text-gray-900">10</div>
                  <div className="text-xs text-gray-600">Câu hỏi</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg text-gray-900">15</div>
                  <div className="text-xs text-gray-600">Phút</div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="size-4 text-green-600" />
                  <span>
                    Cấu trúc theo chuẩn VSTEP chính thức
                  </span>
                </div>
              </div>
              <button onClick={() => {
                console.log('Selected Part:', selectedPart, 'Level: B1');
                setSelectedPartTest({ level: 'B1', part: selectedPart as 1 | 2 | 3 | 4 });
              }} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
                Bắt đầu làm bài
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Test List */}
      {mode === 'full' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl">Danh sách đề thi đầy đủ</h3>
              <button
                onClick={() => setMode('select')}
                className="text-sm text-blue-600 hover:underline mt-1"
              >
                ← Quay lại chọn chế độ
              </button>
            </div>
            <span className="text-sm text-gray-600">
              6 bộ đề
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 1, level: 'B1', title: 'VSTEP B1 - Full Test 01', questions: 30, duration: 60, difficulty: 'Dễ', examId: 'R001' },
              { id: 2, level: 'B1', title: 'VSTEP B1 - Full Test 02', questions: 30, duration: 60, difficulty: 'Trung bình', examId: 'R002' },
              { id: 3, level: 'B2', title: 'VSTEP B2 - Full Test 01', questions: 40, duration: 60, difficulty: 'Trung bình', examId: 'R003' },
              { id: 4, level: 'B2', title: 'VSTEP B2 - Full Test 02', questions: 40, duration: 60, difficulty: 'Khó', examId: 'R004' },
              { id: 5, level: 'C1', title: 'VSTEP C1 - Full Test 01', questions: 50, duration: 60, difficulty: 'Khó', examId: 'R005' },
              { id: 6, level: 'C1', title: 'VSTEP C1 - Full Test 02', questions: 50, duration: 60, difficulty: 'Rất khó', examId: 'R006' },
            ].map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg">
                      {test.level}
                    </span>
                    <span className={`px-3 py-1 text-xs rounded-lg ${
                      test.difficulty === 'Dễ' ? 'bg-green-100 text-green-700' :
                      test.difficulty === 'Trung bình' ? 'bg-yellow-100 text-yellow-700' :
                      test.difficulty === 'Khó' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {test.difficulty}
                    </span>
                  </div>
                  <span className="text-2xl">📝</span>
                </div>

                <h4 className="text-lg mb-2">{test.title}</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Bộ đề thi Reading đầy đủ 3 phần theo chuẩn VSTEP
                </p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg text-gray-900">{test.questions}</div>
                    <div className="text-xs text-gray-600">Câu hỏi</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg text-gray-900">{test.duration}</div>
                    <div className="text-xs text-gray-600">Phút</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg text-gray-900">3</div>
                    <div className="text-xs text-gray-600">Parts</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>Part 1: Trắc nghiệm (10 câu)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>Part 2: Điền từ vào đoạn văn (10 câu)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>Part 3: Nối tiêu đề (10 câu)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    // Set selected full test to render ReadingFullTest component
                    setSelectedFullTest(test);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md"
                >
                  Bắt đầu làm bài
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}