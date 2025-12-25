'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateSession } from '@/hooks/usePractice';
import { VstepLevel } from '@/types/practice';
import {
  ArrowLeft,
  Mic,
  Clock,
  CheckCircle2,
  ChevronRight,
  X,
  Play,
  FileText,
  Sparkles,
  Volume2,
} from 'lucide-react';

type Mode = 'select' | 'part' | 'full';
type Part = 1 | 2 | 3;

const partsConfig = [
  { id: 1, title: 'Social Interaction', questions: 1, duration: 3, description: 'Tương tác xã hội - Trả lời câu hỏi về bản thân và các chủ đề quen thuộc' },
  { id: 2, title: 'Solution Discussion', questions: 1, duration: 4, description: 'Thảo luận giải pháp - Thảo luận về một vấn đề cụ thể và đề xuất giải pháp' },
  { id: 3, title: 'Topic Development', questions: 1, duration: 5, description: 'Phát triển chủ đề - Trình bày ý kiến về một chủ đề cho trước' },
];

const fullTests = [
  { id: 1, level: 'B1' as VstepLevel, title: 'VSTEP B1 - Speaking Test 01', parts: 3, duration: 12, difficulty: 'Dễ' },
  { id: 2, level: 'B1' as VstepLevel, title: 'VSTEP B1 - Speaking Test 02', parts: 3, duration: 12, difficulty: 'Trung bình' },
  { id: 3, level: 'B2' as VstepLevel, title: 'VSTEP B2 - Speaking Test 01', parts: 3, duration: 12, difficulty: 'Trung bình' },
  { id: 4, level: 'B2' as VstepLevel, title: 'VSTEP B2 - Speaking Test 02', parts: 3, duration: 12, difficulty: 'Khó' },
  { id: 5, level: 'C1' as VstepLevel, title: 'VSTEP C1 - Speaking Test 01', parts: 3, duration: 12, difficulty: 'Khó' },
  { id: 6, level: 'C1' as VstepLevel, title: 'VSTEP C1 - Speaking Test 02', parts: 3, duration: 12, difficulty: 'Rất khó' },
];

export default function SpeakingSkillPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('select');
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<VstepLevel>('B1');
  
  const createSession = useCreateSession();

  const handleStartPartPractice = async (part: Part, level: VstepLevel) => {
    try {
      const session = await createSession.mutateAsync({
        skill: 'speaking',
        level,
        mode: 'practice',
        questionCount: 1,
        timeLimit: partsConfig[part - 1].duration * 60,
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
        skill: 'speaking',
        level,
        mode: 'mock_test',
        questionCount: 3,
        timeLimit: 12 * 60, // 12 minutes
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
          <h2 className="text-2xl font-semibold">Luyện tập Nói</h2>
          <p className="text-gray-600">Luyện tập kỹ năng nói với AI chấm điểm tự động</p>
        </div>
      </div>

      {/* AI Scoring Badge */}
      <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-4 border-2 border-orange-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg flex items-center justify-center">
            <Sparkles className="size-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-orange-900">AI Chấm điểm tự động</h4>
            <p className="text-sm text-orange-700">Nhận phản hồi chi tiết về Pronunciation, Fluency, Grammar & Vocabulary</p>
          </div>
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
                <h3 className="text-2xl font-semibold">Nói</h3>
                <p className="text-gray-600">Chọn chế độ luyện tập</p>
              </div>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              Bạn muốn luyện từng phần riêng lẻ hay làm bài test đầy đủ?
            </p>

            <div className="space-y-4">
              {/* Option 1: Practice by Part */}
              <button
                onClick={() => setMode('part')}
                className="w-full p-6 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all border-2 border-orange-200 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                      <FileText className="size-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-orange-900 mb-1">Luyện theo phần</h4>
                      <p className="text-sm text-orange-700">Chọn từng dạng bài cụ thể để luyện tập riêng lẻ</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 bg-orange-200 text-orange-700 text-xs font-medium rounded-full">
                          Part 1: Social
                        </span>
                        <span className="px-3 py-1 bg-orange-200 text-orange-700 text-xs font-medium rounded-full">
                          Part 2: Solution
                        </span>
                        <span className="px-3 py-1 bg-orange-200 text-orange-700 text-xs font-medium rounded-full">
                          Part 3: Topic
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-6 text-orange-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 2: Full Test */}
              <button
                onClick={() => setMode('full')}
                className="w-full p-6 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all border-2 border-amber-200 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
                      <Mic className="size-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-amber-900 mb-1">Làm bài test đầy đủ</h4>
                      <p className="text-sm text-amber-700">Làm bài thi hoàn chỉnh với cả 3 phần</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-amber-700">
                        <div className="flex items-center gap-1">
                          <Clock className="size-4" />
                          <span>12 phút</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Sparkles className="size-4" />
                          <span>AI chấm điểm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-6 text-amber-600 group-hover:translate-x-1 transition-transform" />
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
                  <h3 className="text-2xl font-semibold">Chọn phần</h3>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {partsConfig.map((partConfig, index) => {
                const colors = [
                  { bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', icon: 'bg-orange-600', text: 'text-orange-900', subtext: 'text-orange-700', badge: 'text-orange-600' },
                  { bg: 'from-amber-50 to-amber-100', border: 'border-amber-200', icon: 'bg-amber-600', text: 'text-amber-900', subtext: 'text-amber-700', badge: 'text-amber-600' },
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
                        <div>{partConfig.duration} phút</div>
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
            className="text-sm text-orange-600 hover:underline mb-4 flex items-center gap-1"
          >
            <ArrowLeft className="size-4" />
            Quay lại chọn phần
          </button>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Part {selectedPart}: {partsConfig[selectedPart - 1].title}</h3>
                <p className="text-gray-600 text-sm">{partsConfig[selectedPart - 1].description}</p>
              </div>
              <span className="text-3xl">🎤</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{partsConfig[selectedPart - 1].duration}</div>
                <div className="text-xs text-gray-600">Phút</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{partsConfig[selectedPart - 1].questions}</div>
                <div className="text-xs text-gray-600">Câu hỏi</div>
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
                        ? 'bg-orange-600 text-white'
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
                <Sparkles className="size-4 text-orange-600" />
                <span>AI chấm điểm phát âm, lưu loát, ngữ pháp</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Volume2 className="size-4 text-blue-600" />
                <span>Ghi âm trực tiếp trên trình duyệt</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="size-4 text-green-600" />
                <span>Transcript và phản hồi chi tiết</span>
              </div>
            </div>

            <button
              onClick={() => handleStartPartPractice(selectedPart, selectedLevel)}
              disabled={createSession.isPending}
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
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
              <h3 className="text-xl font-semibold">Danh sách bài test đầy đủ</h3>
              <button
                onClick={() => setMode('select')}
                className="text-sm text-orange-600 hover:underline mt-1"
              >
                ← Quay lại chọn chế độ
              </button>
            </div>
            <span className="text-sm text-gray-600">{fullTests.length} bài test</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fullTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 font-medium rounded-lg">
                      {test.level}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-lg ${getDifficultyColor(test.difficulty)}`}>
                      {test.difficulty}
                    </span>
                  </div>
                  <span className="text-2xl">🎤</span>
                </div>

                <h4 className="text-lg font-semibold mb-2">{test.title}</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Bài test Speaking đầy đủ 3 phần theo chuẩn VSTEP
                </p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">{test.parts}</div>
                    <div className="text-xs text-gray-600">Phần</div>
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
                    <span>Part 1: Social Interaction (3 phút)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>Part 2: Solution Discussion (4 phút)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>Part 3: Topic Development (5 phút)</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartFullTest(test.level)}
                  disabled={createSession.isPending}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
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
