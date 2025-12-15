import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Send, Save, AlertCircle, Loader } from 'lucide-react';

interface WritingExerciseProps {
  task: any;
  onSubmit: (content: string, timeSpent: number, wordCount: number) => void;
  onBack: () => void;
}

export function WritingExercise({ task, onSubmit, onBack }: WritingExerciseProps) {
  const [content, setContent] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [autoSaved, setAutoSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
  const charCount = content.length;
  const isMinimumMet = wordCount >= task.minWords;

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Auto-save every 10 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (content.trim()) {
        localStorage.setItem(
          `writing_draft_${task.id}`,
          JSON.stringify({ content, timeSpent })
        );
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 2000);
      }
    }, 10000);

    return () => clearInterval(autoSaveInterval);
  }, [content, timeSpent, task.id]);

  // Load draft
  useEffect(() => {
    const draft = localStorage.getItem(`writing_draft_${task.id}`);
    if (draft) {
      const { content: savedContent, timeSpent: savedTime } = JSON.parse(draft);
      const shouldLoad = window.confirm(
        'Bạn có bài nháp chưa hoàn thành. Bạn có muốn tiếp tục?'
      );
      if (shouldLoad) {
        setContent(savedContent);
        setTimeSpent(savedTime);
      }
    }
  }, [task.id]);

  const handleSubmit = async () => {
    if (!isMinimumMet) {
      alert(`Bạn cần viết tối thiểu ${task.minWords} từ. Hiện tại: ${wordCount} từ.`);
      return;
    }

    const confirm = window.confirm(
      'Bạn có chắc muốn gửi bài để chấm AI? Bạn sẽ không thể chỉnh sửa sau khi gửi.'
    );

    if (confirm) {
      setIsSubmitting(true);
      localStorage.removeItem(`writing_draft_${task.id}`);
      await onSubmit(content, timeSpent, wordCount);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [content]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 sticky top-20 z-40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-gray-600">
                {task.level} - {task.taskNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {autoSaved && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Save className="size-4" />
                <span>Đã lưu</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Clock className="size-4 text-gray-600" />
              <span>{formatTime(timeSpent)}</span>
            </div>

            <div className="text-sm">
              <span className={wordCount >= task.minWords ? 'text-green-600' : 'text-orange-600'}>
                {wordCount}
              </span>
              <span className="text-gray-400"> / {task.minWords}+ từ</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader className="size-4 animate-spin" />
                  Đang chấm...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Gửi chấm AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Word count bar */}
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              isMinimumMet ? 'bg-green-500' : 'bg-orange-500'
            }`}
            style={{ width: `${Math.min(100, (wordCount / task.minWords) * 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Task Prompt */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-48">
            <h4 className="text-purple-600 mb-3">Đề bài</h4>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm leading-relaxed">{task.prompt}</p>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Số từ tối thiểu:</span>
                  <span>{task.minWords} từ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Thời gian đề xuất:</span>
                  <span>{task.duration} phút</span>
                </div>
              </div>

              {task.tips && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800 mb-2">💡 Gợi ý:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {task.tips.map((tip: string, index: number) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Writing Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-purple-600">Bài viết của bạn</h4>
              <div className="text-xs text-gray-500">{charCount} ký tự</div>
            </div>

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bắt đầu viết bài của bạn ở đây..."
              className="w-full min-h-[500px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              disabled={isSubmitting}
            />

            {!isMinimumMet && wordCount > 0 && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="size-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-700">
                  Bạn cần viết thêm {task.minWords - wordCount} từ để đạt yêu cầu tối thiểu.
                </div>
              </div>
            )}
          </div>

          {/* Guidelines */}
          <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <h4 className="mb-3">Tiêu chí chấm điểm</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-white rounded-lg">
                <p className="mb-1">Task Achievement</p>
                <p className="text-xs text-gray-600">Trả lời đủ yêu cầu đề bài</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="mb-1">Coherence & Cohesion</p>
                <p className="text-xs text-gray-600">Mạch lạc và liên kết</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="mb-1">Lexical Resource</p>
                <p className="text-xs text-gray-600">Từ vựng phong phú</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="mb-1">Grammatical Range</p>
                <p className="text-xs text-gray-600">Ngữ pháp đa dạng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
