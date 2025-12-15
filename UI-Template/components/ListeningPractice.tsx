import { useState, useEffect } from 'react';
import { ArrowLeft, Headphones, Clock, Filter, PlayCircle, ChevronRight, X, CheckCircle2 } from 'lucide-react';
import { ListeningExercise } from './listening/ListeningExercise';
import { ListeningResult } from './listening/ListeningResult';
import { listeningQuestions } from '../data/listeningData';
import { ListeningFullTest } from './ListeningFullTest';
import { ListeningPartPractice } from './ListeningPartPractice';

interface ListeningPracticeProps {
  onBack: () => void;
  autoStart?: boolean;
  exerciseId?: number;
  fullTestMode?: boolean;
  partMode?: boolean; // Thêm prop để xác định mode "Luyện theo phần"
  selectedPart?: 1 | 2 | 3; // Part được chọn từ modal
}

type Level = 'A2' | 'B1' | 'B2' | 'C1';
type TaskType = 'all' | 'short' | 'long' | 'lecture';
type Mode = 'select' | 'part' | 'full' | 'exercise';
type Part = 1 | 2 | 3;

export function ListeningPractice({ onBack, autoStart = false, exerciseId, fullTestMode = false, partMode = false, selectedPart }: ListeningPracticeProps) {
  const [mode, setMode] = useState<Mode>('full'); // Mặc định là 'full' thay vì 'select'
  const [selectedPartState, setSelectedPartState] = useState<Part | null>(selectedPart || null); // Sử dụng selectedPart từ props
  const [selectedPartTest, setSelectedPartTest] = useState<{ level: 'B1' | 'B2' | 'C1'; part: 1 | 2 | 3 } | null>(null); // Bộ đề Part được chọn
  const [selectedLevel, setSelectedLevel] = useState<Level>('B1');
  const [selectedTask, setSelectedTask] = useState<TaskType>('all');
  const [currentExercise, setCurrentExercise] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedFullTest, setSelectedFullTest] = useState<any>(null); // Đề thi được chọn

  // Update mode when props change
  useEffect(() => {
    console.log('ListeningPractice useEffect - partMode:', partMode, 'selectedPart:', selectedPart);
    if (partMode && selectedPart) {
      setMode('part');
      setSelectedPartState(selectedPart);
    } else if (fullTestMode) {
      setMode('full');
    } else if (autoStart) {
      setMode('exercise');
    } else {
      setMode('full'); // Luôn vào mode 'full' thay vì 'select'
    }
  }, [fullTestMode, autoStart, partMode, selectedPart]);

  // Auto start exercise if provided
  useEffect(() => {
    if (exerciseId && fullTestMode) {
      // Nếu là fullTestMode, map exerciseId sang level và mở ListeningFullTest
      // exerciseId 201-205 từ PracticeList mockFullTests
      const fullTestMapping: Record<number, { id: number; level: 'B1' | 'B2' | 'C1'; title: string }> = {
        201: { id: 1, level: 'B1', title: 'VSTEP Listening B1 - Full Test 01' },
        202: { id: 2, level: 'B1', title: 'VSTEP Listening B1 - Full Test 02' },
        203: { id: 3, level: 'B2', title: 'VSTEP Listening B2 - Full Test 01' },
        204: { id: 4, level: 'B2', title: 'VSTEP Listening B2 - Full Test 02' },
        205: { id: 5, level: 'C1', title: 'VSTEP Listening C1 - Full Test 01' },
      };
      
      const test = fullTestMapping[exerciseId];
      if (test) {
        setSelectedFullTest(test);
      }
    } else if (exerciseId && listeningQuestions.length > 0) {
      // Find exercise by ID
      const exercise = listeningQuestions.find(ex => ex.id === exerciseId) || listeningQuestions[0];
      setCurrentExercise(exercise);
      setMode('exercise');
    } else if (autoStart && listeningQuestions.length > 0) {
      // Fallback: autoStart without specific exerciseId
      setCurrentExercise(listeningQuestions[0]);
      setMode('exercise');
    }
  }, [autoStart, exerciseId, fullTestMode]);

  const filteredExercises = listeningQuestions.filter((ex) => {
    const levelMatch = ex.level === selectedLevel;
    const taskMatch = selectedTask === 'all' || ex.type === selectedTask;
    const partMatch = !selectedPartState || ex.part === selectedPartState; // Filter by selected part
    return levelMatch && taskMatch && partMatch;
  });

  const handleStartExercise = (exercise: any) => {
    setCurrentExercise(exercise);
    setShowResult(false);
  };

  const handleSubmit = (answers: Record<number, string>, timeSpent: number) => {
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
  };

  // If selected a full test, render ListeningFullTest component
  if (selectedFullTest) {
    return <ListeningFullTest onBack={onBack} level={selectedFullTest.level as 'B1' | 'B2' | 'C1'} />;
  }

  // If selected a part test, render ListeningPartPractice component
  if (selectedPartTest) {
    return <ListeningPartPractice 
      key={`part-${selectedPartTest.part}-${selectedPartTest.level}`} 
      onBack={onBack} 
      level={selectedPartTest.level} 
      part={selectedPartTest.part} 
    />;
  }

  // If partMode with selectedPartState (from PartSelectionModal via App.tsx)
  if (partMode && selectedPartState) {
    console.log('🎯 Rendering ListeningPartPractice from partMode with selectedPartState:', selectedPartState);
    return <ListeningPartPractice 
      key={`part-mode-${selectedPartState}-${selectedLevel}`}
      onBack={onBack} 
      level={selectedLevel} 
      part={selectedPartState} 
    />;
  }

  if (currentExercise && !showResult) {
    return (
      <ListeningExercise
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

  if (showResult && result) {
    return (
      <ListeningResult
        result={result}
        onTryAgain={() => {
          setShowResult(false);
          setCurrentExercise(null);
        }}
        onBackToList={() => {
          setShowResult(false);
          setCurrentExercise(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => {
          // Nếu autoStart=true (từ PracticeList), luôn quay về PracticeList
          if (autoStart) {
            onBack();
            return;
          }
          
          // Luôn quay về màn hình chính vì không còn mode selection
          onBack();
        }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h2 className="text-2xl">Luyện tập Nghe hiểu</h2>
          <p className="text-gray-600">Bộ đề thi đầy đủ theo chuẩn VSTEP</p>
        </div>
      </div>

      {/* Mode Selection */}
      {mode === 'select' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <Headphones className="size-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl">Nghe hiểu</h3>
                <p className="text-gray-600">Chọn chế độ luyện tập</p>
              </div>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              Bạn muốn luyện từng phần riêng lẻ hay làm bộ đề đầy đủ?
            </p>

            <div className="space-y-4">
              <button onClick={() => setMode('part')} className="w-full p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-all border-2 border-green-200 text-left group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                      <Headphones className="size-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg text-green-900 mb-1">Luyện theo phần</h4>
                      <p className="text-sm text-green-700">Chọn từng dạng bài cụ thể để luyện tập riêng lẻ</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 bg-green-200 text-green-700 text-xs rounded-full">Hội thoại ngắn</span>
                        <span className="px-3 py-1 bg-green-200 text-green-700 text-xs rounded-full">Hội thoại dài</span>
                        <span className="px-3 py-1 bg-green-200 text-green-700 text-xs rounded-full">Bài giảng</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-6 text-green-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button onClick={() => setMode('full')} className="w-full p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all border-2 border-purple-200 text-left group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                      <Headphones className="size-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg text-purple-900 mb-1">Làm bộ đề đầy đủ</h4>
                      <p className="text-sm text-purple-700">Làm bài thi hoàn chỉnh với đầy đủ các phần</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-purple-700">
                        <div className="flex items-center gap-1">
                          <Clock className="size-4" />
                          <span>40 phút</span>
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
      {mode === 'part' && !selectedPartState && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Headphones className="size-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl">Chọn Part</h3>
                  <p className="text-gray-600">Hiện tại chỉ có Part 1 cho luyện riêng lẻ</p>
                </div>
              </div>
              <button onClick={() => setMode('select')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="size-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => setSelectedPartState(1)} className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-all border-2 border-green-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">1</span>
                  </div>
                  <h4 className="text-lg text-green-900 mb-2">Part 1</h4>
                  <p className="text-sm text-green-700 mb-3">Hội thoại ngắn</p>
                  <div className="text-xs text-green-600">
                    <div>8 câu hỏi</div>
                    <div>10 phút</div>
                  </div>
                </div>
              </button>

              <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200 opacity-60">
                <div className="text-center">
                  <p className="text-gray-600 mb-3">
                    <strong>Part 2 & Part 3</strong> chỉ có trong <strong>Bộ đề đầy đủ</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    Để luyện Part 2 (Hội thoại dài) và Part 3 (Bài giảng), vui lòng chọn chế độ "Làm bộ đề đầy đủ"
                  </p>
                  <button 
                    onClick={() => setMode('full')} 
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
                  >
                    Đi đến Bộ đề đầy đủ
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Part Exercise List */}
      {mode === 'part' && selectedPartState && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl">Part {selectedPartState} - Bộ đề luyện tập</h3>
              <p className="text-sm text-gray-600 mt-1">Bộ đề duy nhất theo chuẩn VSTEP (Copy từ Thi thử)</p>
              <button onClick={() => {
                setSelectedPartState(null);
                setMode('select');
              }} className="text-sm text-green-600 hover:underline mt-1">
                ← Quay lại chọn chế độ
              </button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg">B1</span>
                  <span className="px-3 py-1 text-xs rounded-lg bg-blue-100 text-blue-700">Đề thi thử số 01</span>
                </div>
                <span className="text-2xl">🎧</span>
              </div>
              <h4 className="text-lg mb-2">VSTEP Listening - Đề số 01</h4>
              <p className="text-sm text-gray-600 mb-4">
                Part {selectedPartState}: {selectedPartState === 1 ? 'Hội thoại ngắn (8 câu)' : selectedPartState === 2 ? 'Hội thoại dài (12 câu)' : 'Bài giảng (15 câu)'}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg text-gray-900">{selectedPartState === 1 ? 8 : selectedPartState === 2 ? 12 : 15}</div>
                  <div className="text-xs text-gray-600">Câu hỏi</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg text-gray-900">{selectedPartState === 1 ? 15 : selectedPartState === 2 ? 20 : 25}</div>
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
                console.log('Selected Part:', selectedPartState, 'Level: B1');
                setSelectedPartTest({ level: 'B1', part: selectedPartState as 1 | 2 | 3 });
              }} className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md">
                Bt đầu làm bài
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Test List */}
      {mode === 'full' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl">Bộ đề thi Listening đầy đủ</h3>
              <p className="text-sm text-gray-600 mt-1">Bộ đề bao gồm đầy đủ 3 phần theo chuẩn VSTEP</p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            {(() => {
              const test = { id: 1, level: 'B1', title: 'VSTEP B1 - Full Test', questions: 35, duration: 40, difficulty: 'Trung bình' };
              
              return (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg">{test.level}</span>
                      <span className="px-3 py-1 text-xs rounded-lg bg-yellow-100 text-yellow-700">{test.difficulty}</span>
                    </div>
                    <span className="text-2xl">🎧</span>
                  </div>
                  <h4 className="text-lg mb-2">{test.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">Bộ đề thi Listening đầy đủ 3 phần theo chuẩn VSTEP</p>
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
                      <span>Part 1: Hội thoại ngắn (8 câu)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="size-4 text-green-600" />
                      <span>Part 2: Hội thoại dài (12 câu)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="size-4 text-green-600" />
                      <span>Part 3: Bài giảng (15 câu)</span>
                    </div>
                  </div>
                  <button onClick={() => {
                    // Set selected full test to render ListeningFullTest component
                    setSelectedFullTest(test);
                  }} className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md">
                    Bắt đầu làm bài
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}