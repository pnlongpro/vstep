import { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Clock, Filter, MessageCircle, ChevronRight, X, CheckCircle2 } from 'lucide-react';
import { SpeakingExercise } from './speaking/SpeakingExercise';
import { SpeakingResult } from './speaking/SpeakingResult';
import { speakingTasks } from '../data/speakingData';
import { SpeakingFullTest } from './SpeakingFullTest';
import { SpeakingPartPractice } from './SpeakingPartPractice';

interface SpeakingPracticeProps {
  onBack: () => void;
  autoStart?: boolean;
  exerciseId?: number;
  fullTestMode?: boolean;
  partMode?: boolean;
  selectedPart?: 1 | 2 | 3;
}

type Level = 'A2' | 'B1' | 'B2' | 'C1';
type Mode = 'select' | 'part' | 'full';
type Part = 1 | 2 | 3;

export function SpeakingPractice({ onBack, autoStart = false, exerciseId, fullTestMode = false, partMode = false, selectedPart: selectedPartProp }: SpeakingPracticeProps) {
  const [mode, setMode] = useState<Mode>('select');
  const [selectedPart, setSelectedPart] = useState<Part | null>(selectedPartProp || null);
  const [selectedLevel, setSelectedLevel] = useState<Level>('B1');
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedFullTest, setSelectedFullTest] = useState<any>(null); // Đề thi được chọn

  // Debug log
  console.log('🎯 SpeakingPractice rendered with:', { partMode, selectedPart: selectedPartProp, fullTestMode });

  // Update mode when props change
  useEffect(() => {
    console.log('SpeakingPractice useEffect - partMode:', partMode, 'selectedPart:', selectedPartProp);
    if (partMode && selectedPartProp) {
      setMode('part');
      setSelectedPart(selectedPartProp);
    } else if (fullTestMode) {
      setMode('full');
    } else if (autoStart) {
      setMode('select');
    } else {
      setMode('select');
    }
  }, [fullTestMode, autoStart, partMode, selectedPartProp]);

  // Auto start exercise if exerciseId is provided
  useEffect(() => {
    if (exerciseId && fullTestMode) {
      // Nếu là fullTestMode, map exerciseId sang level và mở SpeakingFullTest
      // exerciseId 401-405 từ PracticeList mockFullTests
      const fullTestMapping: Record<number, { id: number; level: 'B1' | 'B2' | 'C1'; title: string }> = {
        401: { id: 1, level: 'B1', title: 'VSTEP Speaking B1 - Full Test 01' },
        402: { id: 2, level: 'B1', title: 'VSTEP Speaking B1 - Full Test 02' },
        403: { id: 3, level: 'B2', title: 'VSTEP Speaking B2 - Full Test 01' },
        404: { id: 4, level: 'B2', title: 'VSTEP Speaking B2 - Full Test 02' },
        405: { id: 5, level: 'C1', title: 'VSTEP Speaking C1 - Full Test 01' },
      };
      
      const test = fullTestMapping[exerciseId];
      if (test) {
        setSelectedFullTest(test);
      }
    } else if (exerciseId && autoStart) {
      // Map exerciseId từ PracticeList mockExercises sang part và level
      // Speaking Part 1: id 31 (B1), 32 (A2)
      // Speaking Part 2: id 33 (B2), 34 (B1)
      // Speaking Part 3: id 35 (C1), 36 (B2)
      const exerciseMapping: Record<number, { part: 1 | 2 | 3; level: 'B1' | 'B2' | 'C1' }> = {
        31: { part: 1, level: 'B1' },
        32: { part: 1, level: 'B1' }, // A2 → fallback to B1
        33: { part: 2, level: 'B2' },
        34: { part: 2, level: 'B1' },
        35: { part: 3, level: 'C1' },
        36: { part: 3, level: 'B2' },
      };
      
      const exercise = exerciseMapping[exerciseId];
      if (exercise) {
        console.log('🎯 Mapped exerciseId', exerciseId, 'to', exercise);
        // Set part để render SpeakingPartPractice
        setSelectedPart(exercise.part);
        setSelectedLevel(exercise.level);
        setMode('part');
        
        // Set currentTask để trigger render SpeakingPartPractice
        setCurrentTask({
          id: exerciseId,
          part: exercise.part,
          level: exercise.level,
          fromPracticeList: true
        });
      } else {
        console.warn('⚠️ No mapping found for exerciseId:', exerciseId);
      }
    } else if (exerciseId && speakingTasks.length > 0) {
      // Find task by ID
      console.log('Looking for task with exerciseId:', exerciseId);
      console.log('Available tasks:', speakingTasks.map(t => ({ id: t.id, title: t.title, part: t.part })));
      const task = speakingTasks.find(t => t.id === exerciseId);
      console.log('Found task:', task ? { id: task.id, title: task.title, part: task.part } : 'NOT FOUND');
      
      if (task) {
        setCurrentTask(task);
      } else {
        console.error('Task not found! exerciseId:', exerciseId);
        // Fallback to first task of same skill
        setCurrentTask(speakingTasks[0]);
      }
    } else if (autoStart && speakingTasks.length > 0) {
      // Fallback: autoStart without specific exerciseId
      setCurrentTask(speakingTasks[0]);
    }
  }, [autoStart, exerciseId, fullTestMode]);

  const filteredTasks = speakingTasks.filter((task) => {
    const levelMatch = task.level === selectedLevel;
    const partMatch = !selectedPart || task.part === `part${selectedPart}`; // FIX: Convert number to "part1", "part2", "part3"
    return levelMatch && partMatch;
  });

  // Debug: Log filtered tasks
  console.log('Selected Part:', selectedPart);
  console.log('Selected Level:', selectedLevel);
  console.log('Filtered Tasks:', filteredTasks.map(t => ({ id: t.id, part: t.part, title: t.title })));

  const handleStartTask = (task: any) => {
    console.log('handleStartTask called with:', { id: task.id, part: task.part, title: task.title });
    setCurrentTask(task);
    setShowResult(false);
  };

  const handleSubmit = (recordingUrl: string, duration: number) => {
    const resultData = {
      recordingUrl,
      duration,
      task: currentTask,
      aiScore: {
        fluency: 7.5,
        pronunciation: 7.0,
        vocabulary: 7.5,
        grammar: 7.0,
        overall: 7.25,
      },
    };
    setResult(resultData);
    setShowResult(true);
  };

  // If selected a full test, render SpeakingFullTest component
  if (selectedFullTest) {
    return <SpeakingFullTest onBack={onBack} level={selectedFullTest.level as 'B1' | 'B2' | 'C1'} />;
  }

  // If currentTask is from PracticeList (autoStart mode), render SpeakingPartPractice
  if (currentTask && currentTask.fromPracticeList) {
    return (
      <SpeakingPartPractice
        onBack={onBack}
        level={currentTask.level}
        part={currentTask.part}
      />
    );
  }

  if (currentTask && !showResult) {
    return (
      <SpeakingExercise
        task={currentTask}
        onSubmit={handleSubmit}
        onBack={() => {
          // Nếu autoStart=true (từ PracticeList), quay về PracticeList
          if (autoStart) {
            onBack();
          } else {
            // Ngược lại, clear task để quay về danh sách
            setCurrentTask(null);
          }
        }}
      />
    );
  }

  if (showResult && result) {
    return (
      <SpeakingResult
        result={result}
        onTryAgain={() => {
          setShowResult(false);
          setCurrentTask(null);
        }}
        onBackToList={() => {
          setShowResult(false);
          setCurrentTask(null);
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
          
          // Smart back navigation cho mode thông thường
          if (mode === 'part' && selectedPart) {
            // From task list -> back to part selection
            setSelectedPart(null);
          } else if (mode === 'part' || mode === 'full') {
            // From part/full selection -> back to mode selection
            setMode('select');
          } else {
            // From mode selection -> back to home
            onBack();
          }
        }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h2 className="text-2xl">Luyện tập Nói</h2>
          <p className="text-gray-600">Luyện tập kỹ năng giao tiếp</p>
        </div>
      </div>

      {/* Mode Selection */}
      {mode === 'select' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Mic className="size-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-2xl">Nói</h3>
                <p className="text-gray-600">Chọn chế độ luyện tập</p>
              </div>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              Bạn muốn luyện từng Part riêng lẻ hay làm bộ đề đầy đủ?
            </p>

            <div className="space-y-4">
              <button onClick={() => setMode('part')} className="w-full p-6 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all border-2 border-orange-200 text-left group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                      <Mic className="size-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg text-orange-900 mb-1">Luyện theo Part</h4>
                      <p className="text-sm text-orange-700">Chọn Part 1, 2 hoặc 3 để luyện tập riêng lẻ</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 bg-orange-200 text-orange-700 text-xs rounded-full">Interview</span>
                        <span className="px-3 py-1 bg-orange-200 text-orange-700 text-xs rounded-full">Long Turn</span>
                        <span className="px-3 py-1 bg-orange-200 text-orange-700 text-xs rounded-full">Discussion</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-6 text-orange-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button onClick={() => setMode('full')} className="w-full p-6 bg-red-50 rounded-xl hover:bg-red-100 transition-all border-2 border-red-200 text-left group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                      <Mic className="size-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg text-red-900 mb-1">Làm bộ đề đầy đủ</h4>
                      <p className="text-sm text-red-700">Làm đầy đủ 3 Parts như thi thật</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-red-700">
                        <div className="flex items-center gap-1">
                          <Clock className="size-4" />
                          <span>12-15 phút</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="size-4" />
                          <span>Chấm điểm AI chi tiết</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-6 text-red-600 group-hover:translate-x-1 transition-transform" />
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
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Mic className="size-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-2xl">Chọn Part</h3>
                  <p className="text-gray-600">Chọn phần bạn muốn luyện tập</p>
                </div>
              </div>
              <button onClick={() => setMode('select')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="size-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={() => setSelectedPart(1)} className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-lg transition-all border-2 border-orange-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">1</span>
                  </div>
                  <h4 className="text-lg text-orange-900 mb-2">Part 1</h4>
                  <p className="text-sm text-orange-700 mb-3">Interview</p>
                  <div className="text-xs text-orange-600">
                    <div>Giới thiệu bản thân</div>
                    <div>3-4 phút</div>
                  </div>
                </div>
              </button>

              <button onClick={() => setSelectedPart(2)} className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl hover:shadow-lg transition-all border-2 border-red-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">2</span>
                  </div>
                  <h4 className="text-lg text-red-900 mb-2">Part 2</h4>
                  <p className="text-sm text-red-700 mb-3">Solution Discussion</p>
                  <div className="text-xs text-red-600">
                    <div>Thảo luận giải pháp</div>
                    <div>4 phút</div>
                  </div>
                </div>
              </button>

              <button onClick={() => setSelectedPart(3)} className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl hover:shadow-lg transition-all border-2 border-pink-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">3</span>
                  </div>
                  <h4 className="text-lg text-pink-900 mb-2">Part 3</h4>
                  <p className="text-sm text-pink-700 mb-3">Topic Development</p>
                  <div className="text-xs text-pink-600">
                    <div>Phát triển chủ đề</div>
                    <div>5 phút</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Part Exercise List */}
      {mode === 'part' && selectedPart && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl">Part {selectedPart} - Danh sách đề</h3>
              <button onClick={() => setSelectedPart(null)} className="text-sm text-orange-600 hover:underline mt-1">
                ← Quay lại chọn Part
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Cấp độ:</span>
              <select 
                value={selectedLevel} 
                onChange={(e) => setSelectedLevel(e.target.value as Level)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
              <span className="text-sm text-gray-600 ml-2">{filteredTasks.length} đề</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.slice(0, 6).map((task, index) => (
              <div key={task.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded">Đề {index + 1}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{task.level}</span>
                  </div>
                </div>
                <h4 className="mb-2 text-sm line-clamp-2">{task.title}</h4>
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="size-4" />
                    <span>{task.part.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-4" />
                    <span>{Math.ceil(task.speakingTime / 60)} phút</span>
                  </div>
                </div>
                <button onClick={() => handleStartTask(task)} className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Bắt đầu luyện nói
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Test List */}
      {mode === 'full' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl">Danh sách đề thi đầy đủ</h3>
              <button onClick={() => setMode('select')} className="text-sm text-orange-600 hover:underline mt-1">
                ← Quay lại chọn chế độ
              </button>
            </div>
            <span className="text-sm text-gray-600">6 bộ đề</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 1, level: 'B1', title: 'VSTEP B1 - Full Test 01', difficulty: 'Dễ' },
              { id: 2, level: 'B1', title: 'VSTEP B1 - Full Test 02', difficulty: 'Trung bình' },
              { id: 3, level: 'B2', title: 'VSTEP B2 - Full Test 01', difficulty: 'Trung bình' },
              { id: 4, level: 'B2', title: 'VSTEP B2 - Full Test 02', difficulty: 'Khó' },
              { id: 5, level: 'C1', title: 'VSTEP C1 - Full Test 01', difficulty: 'Khó' },
              { id: 6, level: 'C1', title: 'VSTEP C1 - Full Test 02', difficulty: 'Rất khó' },
            ].map((test) => (
              <div key={test.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg">{test.level}</span>
                    <span className={`px-3 py-1 text-xs rounded-lg ${
                      test.difficulty === 'Dễ' ? 'bg-green-100 text-green-700' :
                      test.difficulty === 'Trung bình' ? 'bg-yellow-100 text-yellow-700' :
                      test.difficulty === 'Khó' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>{test.difficulty}</span>
                  </div>
                  <span className="text-2xl">🎤</span>
                </div>
                <h4 className="text-lg mb-2">{test.title}</h4>
                <p className="text-sm text-gray-600 mb-4">Bộ đề thi Speaking đầy đủ 3 Parts theo chuẩn VSTEP</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg text-gray-900">12-15</div>
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
                    <span>Part 1: Interview (3-4 phút)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>Part 2: Long Turn (3-4 phút)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>Part 3: Discussion (5-6 phút)</span>
                  </div>
                </div>
                <button onClick={() => {
                  // Set selected full test to render SpeakingFullTest component
                  setSelectedFullTest(test);
                }} className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-md">
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