import { useState } from 'react';
import { X, Save, Plus, Trash2, Upload, FileText, AlertCircle, CheckCircle, Book, Headphones, PenTool, Mic, ChevronDown, ChevronUp, Eye, Copy, Sparkles } from 'lucide-react';

interface CreateExamAdvancedProps {
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  onClose: () => void;
  onSave: (data: any) => void;
}

interface ReadingQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false_ng' | 'matching' | 'fill_blank';
  options?: string[];
  correctAnswer: string;
  explanation: string; // GIẢI THÍCH ĐÁP ÁN
  points: number;
}

interface ListeningQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'matching' | 'form_completion';
  options?: string[];
  correctAnswer: string;
  explanation: string; // GIẢI THÍCH ĐÁP ÁN
  points: number;
}

interface WritingTask {
  taskNumber: 1 | 2;
  prompt: string;
  type: string;
  minWords: number;
  sampleAnswer: string; // ĐÁP ÁN GỢI Ý
  scoringCriteria: {
    taskAchievement: string;
    coherenceCohesion: string;
    lexicalResource: string;
    grammaticalRange: string;
  };
}

interface SpeakingPart {
  partNumber: 1 | 2 | 3;
  title: string;
  questions: Array<{
    id: string;
    question: string;
    sampleAnswer: string; // ĐÁP ÁN GỢI Ý
    tips: string[];
  }>;
}

export function CreateExamAdvanced({ skill, onClose, onSave }: CreateExamAdvancedProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [expandedPart, setExpandedPart] = useState<number | null>(null);

  // Basic Info
  const [basicInfo, setBasicInfo] = useState({
    title: '',
    code: '',
    level: 'B2',
    duration: skill === 'reading' ? 60 : skill === 'listening' ? 40 : skill === 'writing' ? 60 : 12,
    instructions: '',
    status: 'draft',
  });

  // Reading State
  const [readingParts, setReadingParts] = useState<Array<{
    partNumber: number;
    title: string;
    passage: string;
    questions: ReadingQuestion[];
  }>>([
    {
      partNumber: 1,
      title: 'Part 1: Multiple Choice',
      passage: '',
      questions: [],
    },
  ]);

  // Listening State
  const [listeningParts, setListeningParts] = useState<Array<{
    partNumber: number;
    title: string;
    audioUrl: string;
    audioFile: File | null;
    questions: ListeningQuestion[];
  }>>([
    {
      partNumber: 1,
      title: 'Part 1: Short Conversations',
      audioUrl: '',
      audioFile: null,
      questions: [],
    },
  ]);

  // Writing State
  const [writingTasks, setWritingTasks] = useState<WritingTask[]>([
    {
      taskNumber: 1,
      prompt: '',
      type: 'email',
      minWords: 150,
      sampleAnswer: '',
      scoringCriteria: {
        taskAchievement: '',
        coherenceCohesion: '',
        lexicalResource: '',
        grammaticalRange: '',
      },
    },
    {
      taskNumber: 2,
      prompt: '',
      type: 'essay',
      minWords: 250,
      sampleAnswer: '',
      scoringCriteria: {
        taskAchievement: '',
        coherenceCohesion: '',
        lexicalResource: '',
        grammaticalRange: '',
      },
    },
  ]);

  // Speaking State
  const [speakingParts, setSpeakingParts] = useState<SpeakingPart[]>([
    {
      partNumber: 1,
      title: 'Part 1: Interview',
      questions: [],
    },
    {
      partNumber: 2,
      title: 'Part 2: Long Turn',
      questions: [],
    },
    {
      partNumber: 3,
      title: 'Part 3: Discussion',
      questions: [],
    },
  ]);

  // Add Reading Question
  const addReadingQuestion = (partIndex: number) => {
    const newQuestion: ReadingQuestion = {
      id: `q${Date.now()}`,
      question: '',
      type: 'multiple_choice',
      options: ['', '', '', ''],
      correctAnswer: 'A',
      explanation: '',
      points: 1,
    };
    
    const updatedParts = [...readingParts];
    updatedParts[partIndex].questions.push(newQuestion);
    setReadingParts(updatedParts);
  };

  // Add Listening Question
  const addListeningQuestion = (partIndex: number) => {
    const newQuestion: ListeningQuestion = {
      id: `q${Date.now()}`,
      question: '',
      type: 'multiple_choice',
      options: ['', '', '', ''],
      correctAnswer: 'A',
      explanation: '',
      points: 1,
    };
    
    const updatedParts = [...listeningParts];
    updatedParts[partIndex].questions.push(newQuestion);
    setListeningParts(updatedParts);
  };

  // Add Speaking Question
  const addSpeakingQuestion = (partIndex: number) => {
    const newQuestion = {
      id: `q${Date.now()}`,
      question: '',
      sampleAnswer: '',
      tips: [''],
    };
    
    const updatedParts = [...speakingParts];
    updatedParts[partIndex].questions.push(newQuestion);
    setSpeakingParts(updatedParts);
  };

  const steps = [
    { number: 1, title: 'Thông tin cơ bản', icon: FileText },
    { number: 2, title: 'Nội dung đề thi', icon: skill === 'reading' ? Book : skill === 'listening' ? Headphones : skill === 'writing' ? PenTool : Mic },
    { number: 3, title: 'Xem trước & Lưu', icon: Eye },
  ];

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên đề thi *
          </label>
          <input
            type="text"
            value={basicInfo.title}
            onChange={(e) => setBasicInfo({ ...basicInfo, title: e.target.value })}
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
            placeholder="VD: Reading Test 01 - Climate Change"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mã đề thi *
          </label>
          <input
            type="text"
            value={basicInfo.code}
            onChange={(e) => setBasicInfo({ ...basicInfo, code: e.target.value })}
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none font-mono"
            placeholder="VSTEP-R-B2-2024-001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cấp độ *
          </label>
          <select
            value={basicInfo.level}
            onChange={(e) => setBasicInfo({ ...basicInfo, level: e.target.value })}
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
          >
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời gian (phút) *
          </label>
          <input
            type="number"
            value={basicInfo.duration}
            onChange={(e) => setBasicInfo({ ...basicInfo, duration: parseInt(e.target.value) })}
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hướng dẫn làm bài
        </label>
        <textarea
          value={basicInfo.instructions}
          onChange={(e) => setBasicInfo({ ...basicInfo, instructions: e.target.value })}
          rows={4}
          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
          placeholder="Nhập hướng dẫn làm bài cho học viên..."
        />
      </div>
    </div>
  );

  const renderReadingContent = () => (
    <div className="space-y-6">
      {readingParts.map((part, partIndex) => (
        <div key={part.partNumber} className="bg-white rounded-xl border-2 border-gray-200">
          {/* Part Header */}
          <div
            className="p-4 bg-blue-50 border-b-2 border-blue-200 flex items-center justify-between cursor-pointer"
            onClick={() => setExpandedPart(expandedPart === part.partNumber ? null : part.partNumber)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Book className="size-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{part.title}</h3>
                <p className="text-sm text-gray-600">{part.questions.length} câu hỏi</p>
              </div>
            </div>
            {expandedPart === part.partNumber ? (
              <ChevronUp className="size-5 text-gray-600" />
            ) : (
              <ChevronDown className="size-5 text-gray-600" />
            )}
          </div>

          {/* Part Content */}
          {expandedPart === part.partNumber && (
            <div className="p-6 space-y-6">
              {/* Passage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đoạn văn (Passage)
                </label>
                <textarea
                  value={part.passage}
                  onChange={(e) => {
                    const updated = [...readingParts];
                    updated[partIndex].passage = e.target.value;
                    setReadingParts(updated);
                  }}
                  rows={10}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none font-serif"
                  placeholder="Nhập đoạn văn tiếng Anh..."
                />
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Câu hỏi</h4>
                  <button
                    onClick={() => addReadingQuestion(partIndex)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="size-4" />
                    <span>Thêm câu hỏi</span>
                  </button>
                </div>

                {part.questions.map((question, qIndex) => (
                  <div key={question.id} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 space-y-4">
                    {/* Question Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Câu {qIndex + 1}</span>
                      <button
                        onClick={() => {
                          const updated = [...readingParts];
                          updated[partIndex].questions.splice(qIndex, 1);
                          setReadingParts(updated);
                        }}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </button>
                    </div>

                    {/* Question Text */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Câu hỏi *
                      </label>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => {
                          const updated = [...readingParts];
                          updated[partIndex].questions[qIndex].question = e.target.value;
                          setReadingParts(updated);
                        }}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                        placeholder="Nhập câu hỏi..."
                      />
                    </div>

                    {/* Question Type */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Loại câu hỏi
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) => {
                            const updated = [...readingParts];
                            updated[partIndex].questions[qIndex].type = e.target.value as any;
                            setReadingParts(updated);
                          }}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                        >
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="true_false_ng">True/False/Not Given</option>
                          <option value="matching">Matching</option>
                          <option value="fill_blank">Fill in the Blank</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Điểm
                        </label>
                        <input
                          type="number"
                          step="0.25"
                          value={question.points}
                          onChange={(e) => {
                            const updated = [...readingParts];
                            updated[partIndex].questions[qIndex].points = parseFloat(e.target.value);
                            setReadingParts(updated);
                          }}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Options (if multiple choice) */}
                    {question.type === 'multiple_choice' && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Các đáp án
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {question.options?.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-2">
                              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm flex-shrink-0">
                                {String.fromCharCode(65 + oIndex)}
                              </span>
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const updated = [...readingParts];
                                  if (updated[partIndex].questions[qIndex].options) {
                                    updated[partIndex].questions[qIndex].options![oIndex] = e.target.value;
                                    setReadingParts(updated);
                                  }
                                }}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                                placeholder={`Đáp án ${String.fromCharCode(65 + oIndex)}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Correct Answer */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Đáp án đúng *
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 mr-2">Chọn đáp án đúng:</span>
                        {question.type === 'multiple_choice' ? (
                          <div className="flex items-center gap-2">
                            {['A', 'B', 'C', 'D'].map((letter) => (
                              <button
                                key={letter}
                                type="button"
                                onClick={() => {
                                  const updated = [...readingParts];
                                  updated[partIndex].questions[qIndex].correctAnswer = letter;
                                  setReadingParts(updated);
                                }}
                                className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                                  question.correctAnswer === letter
                                    ? 'bg-green-600 text-white shadow-lg scale-110'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {letter}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={question.correctAnswer}
                            onChange={(e) => {
                              const updated = [...readingParts];
                              updated[partIndex].questions[qIndex].correctAnswer = e.target.value;
                              setReadingParts(updated);
                            }}
                            className="flex-1 px-4 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none bg-green-50"
                            placeholder="Nhập đáp án đúng..."
                          />
                        )}
                      </div>
                      {question.type === 'multiple_choice' && question.correctAnswer && (
                        <p className="text-sm text-green-700 mt-2 flex items-center gap-1">
                          <CheckCircle className="size-4" />
                          Đáp án đúng: <span className="font-semibold">{question.correctAnswer}</span>
                        </p>
                      )}
                    </div>

                    {/* EXPLANATION - GIẢI THÍCH ĐÁP ÁN */}
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                      <label className="block text-sm font-medium text-yellow-800 mb-2 flex items-center gap-2">
                        <Sparkles className="size-4" />
                        Giải thích đáp án (Quan trọng!)
                      </label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) => {
                          const updated = [...readingParts];
                          updated[partIndex].questions[qIndex].explanation = e.target.value;
                          setReadingParts(updated);
                        }}
                        rows={4}
                        className="w-full px-4 py-2 border-2 border-yellow-300 rounded-lg focus:border-yellow-500 focus:outline-none bg-white"
                        placeholder="Giải thích tại sao đáp án này đúng, các đáp án khác sai như thế nào, đoạn văn nào chứa thông tin...&#10;&#10;VD: Đoạn văn có câu 'Climate change has become one of the most pressing issues' - pressing issues nghĩa là vấn đề cấp bách → Đáp án C 'an urgent matter' là đúng. Đáp án A sai vì..., B sai vì..., D sai vì..."
                      />
                      <p className="text-xs text-yellow-700 mt-2 flex items-start gap-1">
                        <span>💡</span>
                        <span>Học viên sẽ thấy phần giải thích này sau khi nộp bài để hiểu rõ tại sao đáp án đúng/sai</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => {
          setReadingParts([
            ...readingParts,
            {
              partNumber: readingParts.length + 1,
              title: `Part ${readingParts.length + 1}`,
              passage: '',
              questions: [],
            },
          ]);
        }}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
      >
        <Plus className="size-5" />
        <span>Thêm Part mới</span>
      </button>
    </div>
  );

  const renderWritingContent = () => (
    <div className="space-y-6">
      {writingTasks.map((task, taskIndex) => (
        <div key={task.taskNumber} className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6">
          {/* Task Header */}
          <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-200">
            <div className="p-2 bg-violet-600 rounded-lg">
              <PenTool className="size-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Task {task.taskNumber}</h3>
              <p className="text-sm text-gray-600">Minimum {task.minWords} words</p>
            </div>
          </div>

          {/* Task Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại bài viết
              </label>
              <select
                value={task.type}
                onChange={(e) => {
                  const updated = [...writingTasks];
                  updated[taskIndex].type = e.target.value;
                  setWritingTasks(updated);
                }}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
              >
                {task.taskNumber === 1 ? (
                  <>
                    <option value="email">Email</option>
                    <option value="letter">Letter</option>
                  </>
                ) : (
                  <>
                    <option value="essay">Essay (Opinion)</option>
                    <option value="argumentative">Essay (Argumentative)</option>
                    <option value="discussion">Essay (Discussion)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số từ tối thiểu
              </label>
              <input
                type="number"
                value={task.minWords}
                onChange={(e) => {
                  const updated = [...writingTasks];
                  updated[taskIndex].minWords = parseInt(e.target.value);
                  setWritingTasks(updated);
                }}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đề bài (Prompt) *
            </label>
            <textarea
              value={task.prompt}
              onChange={(e) => {
                const updated = [...writingTasks];
                updated[taskIndex].prompt = e.target.value;
                setWritingTasks(updated);
              }}
              rows={6}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
              placeholder="Nhập đề bài viết..."
            />
          </div>

          {/* SAMPLE ANSWER - ĐÁP ÁN GỢI Ý */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
              <Sparkles className="size-4" />
              Đáp án gợi ý (Sample Answer)
            </label>
            <textarea
              value={task.sampleAnswer}
              onChange={(e) => {
                const updated = [...writingTasks];
                updated[taskIndex].sampleAnswer = e.target.value;
                setWritingTasks(updated);
              }}
              rows={10}
              className="w-full px-4 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none bg-white font-serif"
              placeholder="Viết bài mẫu đạt band 4.0 để học viên tham khảo..."
            />
            <p className="text-xs text-green-700 mt-2">
              💡 Bài mẫu này sẽ hiển thị cho học viên sau khi nộp bài để tham khảo cách viết
            </p>
          </div>

          {/* Scoring Criteria */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Tiêu chí chấm điểm</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Achievement
              </label>
              <textarea
                value={task.scoringCriteria.taskAchievement}
                onChange={(e) => {
                  const updated = [...writingTasks];
                  updated[taskIndex].scoringCriteria.taskAchievement = e.target.value;
                  setWritingTasks(updated);
                }}
                rows={2}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-sm"
                placeholder="Trả lời đầy đủ yêu cầu, ý tưởng rõ ràng..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coherence & Cohesion
              </label>
              <textarea
                value={task.scoringCriteria.coherenceCohesion}
                onChange={(e) => {
                  const updated = [...writingTasks];
                  updated[taskIndex].scoringCriteria.coherenceCohesion = e.target.value;
                  setWritingTasks(updated);
                }}
                rows={2}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-sm"
                placeholder="Bố cục logic, sử dụng linking words..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lexical Resource
              </label>
              <textarea
                value={task.scoringCriteria.lexicalResource}
                onChange={(e) => {
                  const updated = [...writingTasks];
                  updated[taskIndex].scoringCriteria.lexicalResource = e.target.value;
                  setWritingTasks(updated);
                }}
                rows={2}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-sm"
                placeholder="Vốn từ vựng phong phú, chính xác..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grammatical Range & Accuracy
              </label>
              <textarea
                value={task.scoringCriteria.grammaticalRange}
                onChange={(e) => {
                  const updated = [...writingTasks];
                  updated[taskIndex].scoringCriteria.grammaticalRange = e.target.value;
                  setWritingTasks(updated);
                }}
                rows={2}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-sm"
                placeholder="Đa dạng cấu trúc ngữ pháp, ít lỗi..."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSpeakingContent = () => (
    <div className="space-y-6">
      {speakingParts.map((part, partIndex) => (
        <div key={part.partNumber} className="bg-white rounded-xl border-2 border-gray-200">
          {/* Part Header */}
          <div
            className="p-4 bg-orange-50 border-b-2 border-orange-200 flex items-center justify-between cursor-pointer"
            onClick={() => setExpandedPart(expandedPart === part.partNumber ? null : part.partNumber)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Mic className="size-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{part.title}</h3>
                <p className="text-sm text-gray-600">{part.questions.length} câu hỏi</p>
              </div>
            </div>
            {expandedPart === part.partNumber ? (
              <ChevronUp className="size-5 text-gray-600" />
            ) : (
              <ChevronDown className="size-5 text-gray-600" />
            )}
          </div>

          {/* Part Content */}
          {expandedPart === part.partNumber && (
            <div className="p-6 space-y-4">
              <button
                onClick={() => addSpeakingQuestion(partIndex)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
              >
                <Plus className="size-4" />
                <span>Thêm câu hỏi</span>
              </button>

              {part.questions.map((question, qIndex) => (
                <div key={question.id} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 space-y-4">
                  {/* Question Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Câu {qIndex + 1}</span>
                    <button
                      onClick={() => {
                        const updated = [...speakingParts];
                        updated[partIndex].questions.splice(qIndex, 1);
                        setSpeakingParts(updated);
                      }}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </button>
                  </div>

                  {/* Question */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Câu hỏi *
                    </label>
                    <textarea
                      value={question.question}
                      onChange={(e) => {
                        const updated = [...speakingParts];
                        updated[partIndex].questions[qIndex].question = e.target.value;
                        setSpeakingParts(updated);
                      }}
                      rows={2}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                      placeholder="Nhập câu hỏi..."
                    />
                  </div>

                  {/* SAMPLE ANSWER - ĐÁP ÁN GỢI Ý */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                      <Sparkles className="size-4" />
                      Câu trả lời gợi ý (Sample Answer)
                    </label>
                    <textarea
                      value={question.sampleAnswer}
                      onChange={(e) => {
                        const updated = [...speakingParts];
                        updated[partIndex].questions[qIndex].sampleAnswer = e.target.value;
                        setSpeakingParts(updated);
                      }}
                      rows={5}
                      className="w-full px-4 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none bg-white font-serif"
                      placeholder="Viết câu trả lời mẫu đạt band 4.0..."
                    />
                    <p className="text-xs text-green-700 mt-2">
                      💡 Học viên sẽ thấy câu trả lời mẫu này sau khi hoàn thành bài thi
                    </p>
                  </div>

                  {/* Tips */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tips cho học viên
                    </label>
                    {question.tips.map((tip, tIndex) => (
                      <div key={tIndex} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={tip}
                          onChange={(e) => {
                            const updated = [...speakingParts];
                            updated[partIndex].questions[qIndex].tips[tIndex] = e.target.value;
                            setSpeakingParts(updated);
                          }}
                          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-sm"
                          placeholder="VD: Use past tense, Give specific examples..."
                        />
                        {question.tips.length > 1 && (
                          <button
                            onClick={() => {
                              const updated = [...speakingParts];
                              updated[partIndex].questions[qIndex].tips.splice(tIndex, 1);
                              setSpeakingParts(updated);
                            }}
                            className="p-2 hover:bg-red-100 rounded-lg"
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const updated = [...speakingParts];
                        updated[partIndex].questions[qIndex].tips.push('');
                        setSpeakingParts(updated);
                      }}
                      className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
                    >
                      <Plus className="size-4" />
                      <span>Thêm tip</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeStep) {
      case 1:
        return renderBasicInfo();
      case 2:
        if (skill === 'reading') return renderReadingContent();
        if (skill === 'listening') return <div className="p-12 text-center text-gray-600">Listening content (similar to Reading)</div>;
        if (skill === 'writing') return renderWritingContent();
        if (skill === 'speaking') return renderSpeakingContent();
        return null;
      case 3:
        return (
          <div className="p-12 text-center">
            <Eye className="size-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Xem trước đề thi</h3>
            <p className="text-gray-600">Preview functionality sẽ được implement</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 rounded-t-xl z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Tạo đề thi {skill === 'reading' ? 'Reading' : skill === 'listening' ? 'Listening' : skill === 'writing' ? 'Writing' : 'Speaking'}
              </h2>
              <p className="text-gray-600 mt-1">
                {skill === 'reading' && 'Tạo đề thi đọc hiểu với giải thích đáp án chi tiết'}
                {skill === 'listening' && 'Tạo đề thi nghe với giải thích đáp án chi tiết'}
                {skill === 'writing' && 'Tạo đề thi viết với đáp án gợi ý'}
                {skill === 'speaking' && 'Tạo đề thi nói với câu trả lời mẫu'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="size-6" />
            </button>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <button
                  onClick={() => setActiveStep(step.number)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    activeStep === step.number
                      ? 'bg-red-100 text-red-700'
                      : activeStep > step.number
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    activeStep === step.number
                      ? 'bg-red-600 text-white'
                      : activeStep > step.number
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {activeStep > step.number ? (
                      <CheckCircle className="size-5" />
                    ) : (
                      <step.icon className="size-5" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-medium">Bước {step.number}</div>
                    <div className="text-sm font-semibold">{step.title}</div>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    activeStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-6 rounded-b-xl flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            Hủy
          </button>

          <div className="flex items-center gap-3">
            {activeStep > 1 && (
              <button
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-6 py-2.5 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                Quay lại
              </button>
            )}
            {activeStep < 3 ? (
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tiếp theo
              </button>
            ) : (
              <button
                onClick={() => onSave({ basicInfo, readingParts, writingTasks, speakingParts })}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save className="size-5" />
                <span>Lưu đề thi</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}