import { useState } from 'react';
import { X, Plus, Book, Trash2, Sparkles, Eye, Save } from 'lucide-react';

interface CreateReadingExamProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

interface Question {
  id: string;
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

interface Part {
  partNumber: number;
  passage: string;
  questions: Question[];
}

export function CreateReadingExam({ onClose, onSave }: CreateReadingExamProps) {
  const [basicInfo, setBasicInfo] = useState({
    title: '',
    code: '',
    duration: 60,
    createdBy: '',
  });

  const [parts, setParts] = useState<Part[]>([
    {
      partNumber: 1,
      passage: '',
      questions: [],
    },
  ]);

  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const addQuestion = (partIndex: number) => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      question: '',
      answerA: '',
      answerB: '',
      answerC: '',
      answerD: '',
      correctAnswer: 'A',
      explanation: '',
    };

    const updatedParts = [...parts];
    updatedParts[partIndex].questions.push(newQuestion);
    setParts(updatedParts);
    setExpandedQuestion(newQuestion.id);
  };

  const updateQuestion = (partIndex: number, qIndex: number, field: string, value: any) => {
    const updatedParts = [...parts];
    updatedParts[partIndex].questions[qIndex] = {
      ...updatedParts[partIndex].questions[qIndex],
      [field]: value,
    };
    setParts(updatedParts);
  };

  const deleteQuestion = (partIndex: number, qIndex: number) => {
    const updatedParts = [...parts];
    updatedParts[partIndex].questions.splice(qIndex, 1);
    setParts(updatedParts);
  };

  const addPart = () => {
    setParts([
      ...parts,
      {
        partNumber: parts.length + 1,
        passage: '',
        questions: [],
      },
    ]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Book className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Tạo đề thi Reading mới</h2>
              <p className="text-sm text-blue-100">Định dạng chuẩn VSTEP - Đã đăng upload đề thi</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="size-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Thông tin cơ bản */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Book className="size-5" />
              Thông tin cơ bản
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên đề thi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={basicInfo.title}
                  onChange={(e) => setBasicInfo({ ...basicInfo, title: e.target.value })}
                  placeholder="VD: Reading Test 01 - Climate Change"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã đề thi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={basicInfo.code}
                  onChange={(e) => setBasicInfo({ ...basicInfo, code: e.target.value })}
                  placeholder="VD: VSTEP-001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian (phút) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={basicInfo.duration}
                  onChange={(e) => setBasicInfo({ ...basicInfo, duration: parseInt(e.target.value) })}
                  placeholder="60"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tạo bởi
                </label>
                <input
                  type="text"
                  value={basicInfo.createdBy}
                  onChange={(e) => setBasicInfo({ ...basicInfo, createdBy: e.target.value })}
                  placeholder="Tên giáo viên / người tạo đề"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Parts */}
          {parts.map((part, partIndex) => (
            <div key={part.partNumber} className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Book className="size-5 text-blue-600" />
                  Part {part.partNumber}
                </h3>
                <span className="text-sm text-blue-600">{part.questions.length} câu hỏi</span>
              </div>

              {/* Passage */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đoạn văn (Passage) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={part.passage}
                  onChange={(e) => {
                    const updated = [...parts];
                    updated[partIndex].passage = e.target.value;
                    setParts(updated);
                  }}
                  rows={8}
                  placeholder="Nhập hoặc paste đoạn văn tiếng Anh..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-serif bg-white"
                />
              </div>

              {/* Questions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Câu hỏi và đáp án
                  </label>
                  <button
                    onClick={() => addQuestion(partIndex)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                  >
                    <Plus className="size-4" />
                    Thêm câu hỏi
                  </button>
                </div>

                {part.questions.map((question, qIndex) => (
                  <div key={question.id} className="bg-white rounded-lg p-4 border border-gray-200">
                    {/* Question Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-900">Câu {qIndex + 1}</span>
                      <button
                        onClick={() => deleteQuestion(partIndex, qIndex)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </button>
                    </div>

                    {/* Question Text */}
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(partIndex, qIndex, 'question', e.target.value)}
                      placeholder="Nhập câu hỏi..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    />

                    {/* Answers Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {/* Answer A */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm flex-shrink-0">
                          A
                        </div>
                        <input
                          type="text"
                          value={question.answerA}
                          onChange={(e) => updateQuestion(partIndex, qIndex, 'answerA', e.target.value)}
                          placeholder="Đáp án A"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>

                      {/* Answer B */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm flex-shrink-0">
                          B
                        </div>
                        <input
                          type="text"
                          value={question.answerB}
                          onChange={(e) => updateQuestion(partIndex, qIndex, 'answerB', e.target.value)}
                          placeholder="Đáp án B"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>

                      {/* Answer C */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm flex-shrink-0">
                          C
                        </div>
                        <input
                          type="text"
                          value={question.answerC}
                          onChange={(e) => updateQuestion(partIndex, qIndex, 'answerC', e.target.value)}
                          placeholder="Đáp án C"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>

                      {/* Answer D */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm flex-shrink-0">
                          D
                        </div>
                        <input
                          type="text"
                          value={question.answerD}
                          onChange={(e) => updateQuestion(partIndex, qIndex, 'answerD', e.target.value)}
                          placeholder="Đáp án D"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* Correct Answer Selection */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đáp án đúng:
                      </label>
                      <div className="flex items-center gap-2">
                        {(['A', 'B', 'C', 'D'] as const).map((letter) => (
                          <button
                            key={letter}
                            type="button"
                            onClick={() => updateQuestion(partIndex, qIndex, 'correctAnswer', letter)}
                            className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                              question.correctAnswer === letter
                                ? 'bg-green-600 text-white shadow-lg scale-105'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {letter}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* GIẢI THÍCH ĐÁP ÁN */}
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                      <label className="block text-sm font-medium text-yellow-800 mb-2 flex items-center gap-2">
                        <Sparkles className="size-4" />
                        Giải thích đáp án (Quan trọng!)
                      </label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) => updateQuestion(partIndex, qIndex, 'explanation', e.target.value)}
                        rows={4}
                        placeholder="Giải thích tại sao đáp án này đúng, các đáp án khác sai như thế nào, đoạn văn nào chứa thông tin...&#10;&#10;VD: Đoạn văn có câu 'Climate change has become one of the most pressing issues' - pressing issues nghĩa là vấn đề cấp bách → Đáp án C 'an urgent matter' là đúng. Đáp án A sai vì không đề cập đến tính cấp bách, B sai vì nói về tương lai trong khi đoạn văn nói hiện tại, D sai vì quá cụ thể."
                        className="w-full px-4 py-2 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-sm resize-none"
                      />
                      <p className="text-xs text-yellow-700 mt-2 flex items-start gap-1">
                        <span>💡</span>
                        <span>Học viên sẽ thấy phần giải thích này sau khi nộp bài để hiểu rõ tại sao đáp án đúng/sai. Phần này rất quan trọng giúp học viên học được từ sai lầm.</span>
                      </p>
                    </div>
                  </div>
                ))}

                {part.questions.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Chưa có câu hỏi. Click "Thêm câu hỏi" để bắt đầu.
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add Part Button */}
          <button
            onClick={addPart}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <Plus className="size-5" />
            <span>Thêm Part mới</span>
          </button>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 p-4 rounded-b-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="publish" className="rounded" />
            <label htmlFor="publish" className="text-sm text-gray-700">
              Xuất bản ngay
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Eye className="size-4" />
              Preview
            </button>
            <button
              onClick={() => onSave({ basicInfo, parts })}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="size-4" />
              Lưu đề thi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}