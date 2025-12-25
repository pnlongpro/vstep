'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateSession } from '@/hooks/usePractice';
import { VstepLevel } from '@/types/practice';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle2,
  ChevronRight,
  X,
  Play,
} from 'lucide-react';

type Mode = 'select' | 'part' | 'full';
type Part = 1 | 2 | 3 | 4;

const partsConfig = [
  { id: 1, title: 'Trắc nghiệm', questions: 10, description: 'Multiple Choice Questions' },
  { id: 2, title: 'Điền từ vào đoạn văn', questions: 10, description: 'Cloze Test' },
  { id: 3, title: 'Nối tiêu đề', questions: 10, description: 'Matching Headings' },
  { id: 4, title: 'Đúng/Sai/Không xác định', questions: 10, description: 'True/False/Not Given' },
];

const fullTests = [
  { id: 1, level: 'B1' as VstepLevel, title: 'VSTEP B1 - Full Test 01', questions: 30, duration: 60, difficulty: 'Dễ' },
  { id: 2, level: 'B1' as VstepLevel, title: 'VSTEP B1 - Full Test 02', questions: 30, duration: 60, difficulty: 'Trung bình' },
  { id: 3, level: 'B2' as VstepLevel, title: 'VSTEP B2 - Full Test 01', questions: 40, duration: 60, difficulty: 'Trung bình' },
  { id: 4, level: 'B2' as VstepLevel, title: 'VSTEP B2 - Full Test 02', questions: 40, duration: 60, difficulty: 'Khó' },
  { id: 5, level: 'C1' as VstepLevel, title: 'VSTEP C1 - Full Test 01', questions: 50, duration: 60, difficulty: 'Khó' },
  { id: 6, level: 'C1' as VstepLevel, title: 'VSTEP C1 - Full Test 02', questions: 50, duration: 60, difficulty: 'Rất khó' },
];

export default function ReadingSkillPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('select');
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<VstepLevel>('B1');
  
  const createSession = useCreateSession();

  const handleStartPartPractice = async (part: Part, level: VstepLevel) => {
    try {
      const session = await createSession.mutateAsync({
        skill: 'reading',
        level,
        mode: 'practice',
        questionCount: 10,
        timeLimit: 15 * 60, // 15 minutes
        settings: { part },
      });
      router.push(`/practice/${session.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleStartFullTest = async (level: VstepLevel) => {
    try {
      const session = await createSession.mutateAsync({
        skill: 'reading',
        level,
        mode: 'mock_test',
        questionCount: level === 'B1' ? 30 : level === 'B2' ? 40 : 50,
        timeLimit: 60 * 60, // 60 minutes
      });
      router.push(`/practice/${session.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleBack = () => {
    if (mode === 'part' && selectedPart) {
      setSelectedPart(null);
    } else if (mode === 'part' || mode === 'full') {
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
          <h2 className="text-2xl font-semibold">Luyện tập Đọc hiểu</h2>
          <p className="text-gray-600">Luyện tập kỹ năng đọc hiểu theo chuẩn VSTEP</p>
        </div>
      </div>

      {/* Mode Selection */}
      {mode === 'select' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <BookOpen className="size-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Đọc hiểu</h3>
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
                      <h4 className="text-lg font-semibold text-blue-900 mb-1">Luyện theo phần</h4>
                      <p className="text-sm text-blue-700">Chọn từng dạng bài cụ thể để luyện tập riêng lẻ</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 bg-blue-200 text-blue-700 text-xs font-medium rounded-full">
                          Trắc nghiệm
                        </span>
                        <span className="px-3 py-1 bg-blue-200 text-blue-700 text-xs font-medium rounded-full">
                          Điền từ vào đoạn văn
                        </span>
                        <span className="px-3 py-1 bg-blue-200 text-blue-700 text-xs font-medium rounded-full">
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
                      <h4 className="text-lg font-semibold text-purple-900 mb-1">Làm bộ đề đầy đủ</h4>
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
                  <h3 className="text-2xl font-semibold">Chọn Part</h3>
                  <p className="text-gray-600">Chọn phần bạn muốn luyện tập</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {partsConfig.map((partConfig, index) => {
                const colors = [
                  { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', icon: 'bg-blue-600', text: 'text-blue-900', subtext: 'text-blue-700', badge: 'text-blue-600' },
                  { bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', icon: 'bg-purple-600', text: 'text-purple-900', subtext: 'text-purple-700', badge: 'text-purple-600' },
                  { bg: 'from-green-50 to-green-100', border: 'border-green-200', icon: 'bg-green-600', text: 'text-green-900', subtext: 'text-green-700', badge: 'text-green-600' },
                  { bg: 'from-yellow-50 to-yellow-100', border: 'border-yellow-200', icon: 'bg-yellow-600', text: 'text-yellow-900', subtext: 'text-yellow-700', badge: 'text-yellow-600' },
                ];
                const color = colors[index];
                
                return (
                  <button
                    key={partConfig.id}
                    onClick={() => setSelectedPart(partConfig.id as Part)}
                    className={`p-6 bg-gradient-to-br ${color.bg} rounded-xl hover:shadow-lg transition-all border-2 ${color.border} group`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 ${color.icon} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <span className="text-2xl text-white font-bold">{partConfig.id}</span>
                      </div>
                      <h4 className={`text-lg font-semibold ${color.text} mb-2`}>Part {partConfig.id}</h4>
                      <p className={`text-sm ${color.subtext} mb-3`}>{partConfig.title}</p>
                      <div className={`text-xs ${color.badge}`}>
                        <div>{partConfig.questions} câu hỏi</div>
                        <div>15 phút</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Part Practice - Level Selection */}
      {mode === 'part' && selectedPart && (
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedPart(null)}
            className="text-sm text-blue-600 hover:underline mb-4 flex items-center gap-1"
          >
            <ArrowLeft className="size-4" />
            Quay lại chọn Part
          </button>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Part {selectedPart}: {partsConfig[selectedPart - 1].title}</h3>
                <p className="text-gray-600 text-sm">{partsConfig[selectedPart - 1].description}</p>
              </div>
              <span className="text-3xl">📝</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">10</div>
                <div className="text-xs text-gray-600">Câu hỏi</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">15</div>
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
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="size-4 text-green-600" />
                <span>Cấu trúc theo chuẩn VSTEP chính thức</span>
              </div>
            </div>

            <button
              onClick={() => handleStartPartPractice(selectedPart, selectedLevel)}
              disabled={createSession.isPending}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
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
                className="text-sm text-blue-600 hover:underline mt-1"
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
                  <span className="text-2xl">📝</span>
                </div>

                <h4 className="text-lg font-semibold mb-2">{test.title}</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Bộ đề thi Reading đầy đủ 4 phần theo chuẩn VSTEP
                </p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">{test.questions}</div>
                    <div className="text-xs text-gray-600">Câu hỏi</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">{test.duration}</div>
                    <div className="text-xs text-gray-600">Phút</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">4</div>
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
                    <span>Part 3: Nối tiêu đề (5 câu)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>Part 4: Đúng/Sai/Không xác định (5 câu)</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartFullTest(test.level)}
                  disabled={createSession.isPending}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
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
