'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateSession } from '@/hooks/usePractice';
import { VstepLevel } from '@/types/practice';
import {
  ArrowLeft,
  PenTool,
  Clock,
  CheckCircle2,
  ChevronRight,
  X,
  Play,
  FileText,
  Sparkles,
} from 'lucide-react';

type Mode = 'select' | 'task' | 'full';
type Task = 1 | 2;

const tasksConfig = [
  { id: 1, title: 'Email/Letter Writing', questions: 1, wordLimit: '120-150', description: 'Viết email hoặc thư theo tình huống' },
  { id: 2, title: 'Essay Writing', questions: 1, wordLimit: '250-300', description: 'Viết bài luận theo chủ đề' },
];

const fullTests = [
  { id: 1, level: 'B1' as VstepLevel, title: 'VSTEP B1 - Full Test 01', tasks: 2, duration: 60, difficulty: 'Dễ' },
  { id: 2, level: 'B1' as VstepLevel, title: 'VSTEP B1 - Full Test 02', tasks: 2, duration: 60, difficulty: 'Trung bình' },
  { id: 3, level: 'B2' as VstepLevel, title: 'VSTEP B2 - Full Test 01', tasks: 2, duration: 60, difficulty: 'Trung bình' },
  { id: 4, level: 'B2' as VstepLevel, title: 'VSTEP B2 - Full Test 02', tasks: 2, duration: 60, difficulty: 'Khó' },
  { id: 5, level: 'C1' as VstepLevel, title: 'VSTEP C1 - Full Test 01', tasks: 2, duration: 60, difficulty: 'Khó' },
  { id: 6, level: 'C1' as VstepLevel, title: 'VSTEP C1 - Full Test 02', tasks: 2, duration: 60, difficulty: 'Rất khó' },
];

export default function WritingSkillPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('select');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<VstepLevel>('B1');
  
  const createSession = useCreateSession();

  const handleStartTaskPractice = async (task: Task, level: VstepLevel) => {
    try {
      const session = await createSession.mutateAsync({
        skill: 'writing',
        level,
        mode: 'practice',
        questionCount: 1,
        timeLimit: task === 1 ? 20 * 60 : 40 * 60, // Task 1: 20 min, Task 2: 40 min
        settings: { task },
      });
      router.push(`/practice/${session.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleStartFullTest = async (level: VstepLevel) => {
    try {
      const session = await createSession.mutateAsync({
        skill: 'writing',
        level,
        mode: 'mock_test',
        questionCount: 2,
        timeLimit: 60 * 60, // 60 minutes
      });
      router.push(`/practice/${session.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleBack = () => {
    if (mode === 'task' && selectedTask) {
      setSelectedTask(null);
    } else if (mode === 'task' || mode === 'full') {
      setMode('select');
    } else {
      router.push('/practice');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'bg-green-100 text-green-700';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-700';
      case 'Khó': return 'bg-orange-100 text-orange-700';
      case 'Rất khó': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Quay lại"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h2 className="text-2xl font-semibold">Luyện tập Viết</h2>
          <p className="text-gray-600">Luyện tập kỹ năng viết với AI chấm điểm tự động</p>
        </div>
      </div>

      {/* AI Scoring Badge */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Sparkles className="size-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-purple-900">AI Chấm điểm tự động</h4>
            <p className="text-sm text-purple-700">Nhận phản hồi chi tiết về Task Achievement, Coherence, Vocabulary & Grammar</p>
          </div>
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
                <h3 className="text-2xl font-semibold">Viết</h3>
                <p className="text-gray-600">Chọn chế độ luyện tập</p>
              </div>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              Bạn muốn luyện từng Task riêng lẻ hay làm bộ đề đầy đủ?
            </p>

            <div className="space-y-4">
              {/* Option 1: Practice by Task */}
              <button
                onClick={() => setMode('task')}
                className="w-full p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all border-2 border-purple-200 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                      <FileText className="size-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-purple-900 mb-1">Luyện theo Task</h4>
                      <p className="text-sm text-purple-700">Chọn từng dạng bài cụ thể để luyện tập riêng lẻ</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 bg-purple-200 text-purple-700 text-xs font-medium rounded-full">
                          Task 1: Email/Letter
                        </span>
                        <span className="px-3 py-1 bg-purple-200 text-purple-700 text-xs font-medium rounded-full">
                          Task 2: Essay
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-6 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 2: Full Test */}
              <button
                onClick={() => setMode('full')}
                className="w-full p-6 bg-pink-50 rounded-xl hover:bg-pink-100 transition-all border-2 border-pink-200 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center">
                      <PenTool className="size-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-pink-900 mb-1">Làm bộ đề đầy đủ</h4>
                      <p className="text-sm text-pink-700">Làm bài thi hoàn chỉnh với cả 2 Tasks</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-pink-700">
                        <div className="flex items-center gap-1">
                          <Clock className="size-4" />
                          <span>60 phút</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Sparkles className="size-4" />
                          <span>AI chấm điểm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-6 text-pink-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Selection */}
      {mode === 'task' && !selectedTask && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <PenTool className="size-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">Chọn Task</h3>
                  <p className="text-gray-600">Chọn dạng bài bạn muốn luyện tập</p>
                </div>
              </div>
              <button
                onClick={() => setMode('select')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Đóng"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasksConfig.map((taskConfig, index) => {
                const colors = [
                  { bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', icon: 'bg-purple-600', text: 'text-purple-900', subtext: 'text-purple-700', badge: 'text-purple-600' },
                  { bg: 'from-pink-50 to-pink-100', border: 'border-pink-200', icon: 'bg-pink-600', text: 'text-pink-900', subtext: 'text-pink-700', badge: 'text-pink-600' },
                ];
                const color = colors[index];
                
                return (
                  <button
                    key={taskConfig.id}
                    onClick={() => setSelectedTask(taskConfig.id as Task)}
                    className={`p-6 bg-gradient-to-br ${color.bg} rounded-xl hover:shadow-lg transition-all border-2 ${color.border} group`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 ${color.icon} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <span className="text-2xl text-white font-bold">{taskConfig.id}</span>
                      </div>
                      <h4 className={`text-lg font-semibold ${color.text} mb-2`}>Task {taskConfig.id}</h4>
                      <p className={`text-sm ${color.subtext} mb-3`}>{taskConfig.title}</p>
                      <div className={`text-xs ${color.badge}`}>
                        <div>{taskConfig.wordLimit} từ</div>
                        <div>{taskConfig.id === 1 ? '20' : '40'} phút</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Task Practice - Level Selection */}
      {mode === 'task' && selectedTask && (
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedTask(null)}
            className="text-sm text-purple-600 hover:underline mb-4 flex items-center gap-1"
          >
            <ArrowLeft className="size-4" />
            Quay lại chọn Task
          </button>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Task {selectedTask}: {tasksConfig[selectedTask - 1].title}</h3>
                <p className="text-gray-600 text-sm">{tasksConfig[selectedTask - 1].description}</p>
              </div>
              <span className="text-3xl">✍️</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{tasksConfig[selectedTask - 1].wordLimit}</div>
                <div className="text-xs text-gray-600">Số từ yêu cầu</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{selectedTask === 1 ? '20' : '40'}</div>
                <div className="text-xs text-gray-600">Phút</div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Chọn cấp độ</label>
              <div className="grid grid-cols-4 gap-2">
                {(['A2', 'B1', 'B2', 'C1'] as VstepLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      selectedLevel === level
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Sparkles className="size-4 text-purple-600" />
                <span>AI chấm điểm theo 4 tiêu chí VSTEP</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="size-4 text-green-600" />
                <span>Phản hồi chi tiết về lỗi ngữ pháp & từ vựng</span>
              </div>
            </div>

            <button
              onClick={() => handleStartTaskPractice(selectedTask, selectedLevel)}
              disabled={createSession.isPending}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {createSession.isPending ? (
                <span>Đang tạo...</span>
              ) : (
                <>
                  <Play className="size-5" />
                  Bắt đầu làm bài
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Full Test List */}
      {mode === 'full' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Danh sách đề thi đầy đủ</h3>
              <button
                onClick={() => setMode('select')}
                className="text-sm text-purple-600 hover:underline mt-1"
              >
                ← Quay lại chọn chế độ
              </button>
            </div>
            <span className="text-sm text-gray-600">{fullTests.length} bộ đề</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fullTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 font-medium rounded-lg">
                      {test.level}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-lg ${getDifficultyColor(test.difficulty)}`}>
                      {test.difficulty}
                    </span>
                  </div>
                  <span className="text-2xl">✍️</span>
                </div>

                <h4 className="text-lg font-semibold mb-2">{test.title}</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Bộ đề thi Writing đầy đủ 2 Tasks theo chuẩn VSTEP
                </p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">{test.tasks}</div>
                    <div className="text-xs text-gray-600">Tasks</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">{test.duration}</div>
                    <div className="text-xs text-gray-600">Phút</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">AI</div>
                    <div className="text-xs text-gray-600">Chấm điểm</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>Task 1: Email/Letter (120-150 từ)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>Task 2: Essay (250-300 từ)</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartFullTest(test.level)}
                  disabled={createSession.isPending}
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {createSession.isPending ? (
                    <span>Đang tạo...</span>
                  ) : (
                    <>
                      <Play className="size-5" />
                      Bắt đầu làm bài
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
