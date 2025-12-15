import { useState, useEffect } from 'react';
import { ArrowLeft, PenTool, Clock, Filter, FileText, ChevronRight, X, CheckCircle2 } from 'lucide-react';
import { WritingExercise } from './writing/WritingExercise';
import { WritingResult } from './writing/WritingResult';
import { writingTasks } from '../data/writingData';
import { WritingFullTest } from './WritingFullTest';
import { WritingPartPractice } from './WritingPartPractice';

interface WritingPracticeProps {
  onBack: () => void;
  autoStart?: boolean;
  exerciseId?: number;
  fullTestMode?: boolean;
  partMode?: boolean;
  selectedPart?: 1 | 2;
}

type Level = 'A2' | 'B1' | 'B2' | 'C1';
type TaskType = 'all' | 'email' | 'essay' | 'graph';
type Mode = 'select' | 'task' | 'full';

export function WritingPractice({ onBack, autoStart = false, exerciseId, fullTestMode = false, partMode = false, selectedPart }: WritingPracticeProps) {
  const [mode, setMode] = useState<Mode>('select');
  const [selectedTaskType, setSelectedTaskType] = useState<'task1' | 'task2' | null>(selectedPart ? (selectedPart === 1 ? 'task1' : 'task2') : null);
  const [selectedLevel, setSelectedLevel] = useState<Level>('B1');
  const [selectedTask, setSelectedTask] = useState<TaskType>('all');
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedFullTest, setSelectedFullTest] = useState<any>(null); // Đề thi được chọn

  // Debug log
  console.log('🎯 WritingPractice rendered with:', { partMode, selectedPart, fullTestMode });

  // Update mode when props change
  useEffect(() => {
    console.log('WritingPractice useEffect - partMode:', partMode, 'selectedPart:', selectedPart);
    if (partMode && selectedPart) {
      setMode('task');
      setSelectedTaskType(selectedPart === 1 ? 'task1' : 'task2');
    } else if (fullTestMode) {
      setMode('full');
    } else if (autoStart) {
      // Keep current mode
    } else {
      setMode('select');
    }
  }, [fullTestMode, autoStart, partMode, selectedPart]);

  // Auto start exercise if exerciseId is provided
  useEffect(() => {
    if (exerciseId && fullTestMode) {
      // Nếu là fullTestMode, map exerciseId sang level và mở WritingFullTest
      // exerciseId 301-305 từ PracticeList mockFullTests
      const fullTestMapping: Record<number, { id: number; level: 'B1' | 'B2' | 'C1'; title: string }> = {
        301: { id: 1, level: 'B1', title: 'VSTEP Writing B1 - Full Test 01' },
        302: { id: 2, level: 'B1', title: 'VSTEP Writing B1 - Full Test 02' },
        303: { id: 3, level: 'B2', title: 'VSTEP Writing B2 - Full Test 01' },
        304: { id: 4, level: 'B2', title: 'VSTEP Writing B2 - Full Test 02' },
        305: { id: 5, level: 'C1', title: 'VSTEP Writing C1 - Full Test 01' },
      };
      
      const test = fullTestMapping[exerciseId];
      if (test) {
        setSelectedFullTest(test);
      }
    } else if (exerciseId && autoStart) {
      // Map exerciseId từ PracticeList mockExercises sang part và level
      // Writing Part 1: id 21 (B1), 22 (B2)
      // Writing Part 2: id 23 (B2), 24 (C1)
      const exerciseMapping: Record<number, { part: 1 | 2; level: 'B1' | 'B2' | 'C1' }> = {
        21: { part: 1, level: 'B1' },
        22: { part: 1, level: 'B2' },
        23: { part: 2, level: 'B2' },
        24: { part: 2, level: 'C1' },
      };
      
      const exercise = exerciseMapping[exerciseId];
      if (exercise) {
        console.log('🎯 Mapped exerciseId', exerciseId, 'to', exercise);
        // Set part để render WritingPartPractice
        setSelectedTaskType(exercise.part === 1 ? 'task1' : 'task2');
        setSelectedLevel(exercise.level);
        setMode('task');
        
        // Set currentTask để trigger render WritingPartPractice
        setCurrentTask({
          id: exerciseId,
          part: exercise.part,
          level: exercise.level,
          fromPracticeList: true
        });
      } else {
        console.warn('⚠️ No mapping found for exerciseId:', exerciseId);
      }
    } else if (exerciseId && writingTasks.length > 0) {
      // Find task by ID from old writingTasks data
      const task = writingTasks.find(t => t.id === exerciseId) || writingTasks[0];
      setCurrentTask(task);
    } else if (autoStart && writingTasks.length > 0) {
      // Fallback: autoStart without specific exerciseId
      setCurrentTask(writingTasks[0]);
    }
  }, [autoStart, exerciseId, fullTestMode]);

  const filteredTasks = writingTasks.filter((task) => {
    const levelMatch = task.level === selectedLevel;
    const taskMatch = selectedTask === 'all' || task.type === selectedTask;
    return levelMatch && taskMatch;
  });

  const handleStartTask = (task: any) => {
    setCurrentTask(task);
    setShowResult(false);
  };

  const handleSubmit = (content: string, wordCount: number, timeSpent: number) => {
    const resultData = {
      content,
      wordCount,
      timeSpent,
      task: currentTask,
      aiScore: {
        taskAchievement: 7.5,
        coherence: 7.0,
        vocabulary: 7.0,
        grammar: 7.5,
        overall: 7.25,
      },
    };
    setResult(resultData);
    setShowResult(true);
  };

  // If selected a full test, render WritingFullTest component
  if (selectedFullTest) {
    return <WritingFullTest onBack={onBack} level={selectedFullTest.level as 'B1' | 'B2' | 'C1'} />
  }

  // If currentTask is from PracticeList (autoStart mode), render WritingPartPractice
  if (currentTask && currentTask.fromPracticeList) {
    return (
      <WritingPartPractice
        onBack={onBack}
        level={currentTask.level}
        part={currentTask.part}
      />
    );
  }

  if (currentTask && !showResult) {
    return (
      <WritingExercise
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
      <WritingResult
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
          if (mode === 'task' && selectedTaskType) {
            // From task list -> back to task selection
            setSelectedTaskType(null);
          } else if (mode === 'task' || mode === 'full') {
            // From task/full selection -> back to mode selection
            setMode('select');
          } else {
            // From mode selection -> back to home
            onBack();
          }
        }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h2 className="text-2xl">Luyện tập Viết</h2>
          <p className="text-gray-600">Luyện tập kỹ năng viết học thuật</p>
        </div>
      </div>

      {/* Mode Selection */}
      {mode === 'select' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                <PenTool className="size-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl">Viết</h3>
                <p className="text-gray-600">Chọn chế độ luyện tập</p>
              </div>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              Bạn muốn luyện từng Task riêng lẻ hay làm bộ đề đầy đủ?
            </p>

            <div className="space-y-4">
              <button onClick={() => setMode('task')} className="w-full p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all border-2 border-purple-200 text-left group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                      <PenTool className="size-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg text-purple-900 mb-1">Luyện theo Task</h4>
                      <p className="text-sm text-purple-700">Chọn Task 1 hoặc Task 2 để luyện tập riêng lẻ</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 bg-purple-200 text-purple-700 text-xs rounded-full">Task 1: Email/Thư</span>
                        <span className="px-3 py-1 bg-purple-200 text-purple-700 text-xs rounded-full">Task 2: Bài luận</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-6 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button onClick={() => setMode('full')} className="w-full p-6 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all border-2 border-indigo-200 text-left group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                      <PenTool className="size-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg text-indigo-900 mb-1">Làm bộ đề đầy đủ</h4>
                      <p className="text-sm text-indigo-700">Làm cả Task 1 và Task 2 như thi thật</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-indigo-700">
                        <div className="flex items-center gap-1">
                          <Clock className="size-4" />
                          <span>60 phút</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="size-4" />
                          <span>Chấm điểm AI chi tiết</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-6 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Selection */}
      {mode === 'task' && !selectedTaskType && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <PenTool className="size-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl">Chọn Task</h3>
                  <p className="text-gray-600">Chọn Task bạn muốn luyện tập</p>
                </div>
              </div>
              <button onClick={() => setMode('select')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="size-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => setSelectedTaskType('task1')} className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all border-2 border-purple-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">1</span>
                  </div>
                  <h4 className="text-lg text-purple-900 mb-2">Task 1</h4>
                  <p className="text-sm text-purple-700 mb-3">Email / Thư</p>
                  <div className="text-xs text-purple-600">
                    <div>150+ từ</div>
                    <div>20 phút</div>
                  </div>
                </div>
              </button>

              <button onClick={() => setSelectedTaskType('task2')} className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl hover:shadow-lg transition-all border-2 border-indigo-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">2</span>
                  </div>
                  <h4 className="text-lg text-indigo-900 mb-2">Task 2</h4>
                  <p className="text-sm text-indigo-700 mb-3">Bài luận</p>
                  <div className="text-xs text-indigo-600">
                    <div>250+ từ</div>
                    <div>40 phút</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Exercise List */}
      {mode === 'task' && selectedTaskType && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl">{selectedTaskType === 'task1' ? 'Task 1' : 'Task 2'} - Danh sách đề</h3>
              <button onClick={() => setSelectedTaskType(null)} className="text-sm text-purple-600 hover:underline mt-1">
                ← Quay lại chọn Task
              </button>
            </div>
            <span className="text-sm text-gray-600">{filteredTasks.length} đề</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.slice(0, 6).map((task, index) => (
              <div key={task.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded">Đề {index + 1}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{task.level}</span>
                  </div>
                </div>
                <h4 className="mb-2">{task.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{task.description}</p>
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FileText className="size-4" />
                    <span>{task.minWords}+ từ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-4" />
                    <span>{task.duration} phút</span>
                  </div>
                </div>
                <button onClick={() => handleStartTask(task)} className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Bắt đầu viết bài
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
              <button onClick={() => setMode('select')} className="text-sm text-purple-600 hover:underline mt-1">
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
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg">{test.level}</span>
                    <span className={`px-3 py-1 text-xs rounded-lg ${
                      test.difficulty === 'Dễ' ? 'bg-green-100 text-green-700' :
                      test.difficulty === 'Trung bình' ? 'bg-yellow-100 text-yellow-700' :
                      test.difficulty === 'Khó' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>{test.difficulty}</span>
                  </div>
                  <span className="text-2xl">✍️</span>
                </div>
                <h4 className="text-lg mb-2">{test.title}</h4>
                <p className="text-sm text-gray-600 mb-4">Bộ đề thi Writing đầy đủ 2 Tasks theo chuẩn VSTEP</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg text-gray-900">60</div>
                    <div className="text-xs text-gray-600">Phút</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg text-gray-900">2</div>
                    <div className="text-xs text-gray-600">Tasks</div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>Task 1: Email/Thư (150+ từ, 20 phút)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>Task 2: Bài luận (250+ từ, 40 phút)</span>
                  </div>
                </div>
                <button onClick={() => {
                  // Set selected full test to render WritingFullTest component
                  setSelectedFullTest(test);
                }} className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md">
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