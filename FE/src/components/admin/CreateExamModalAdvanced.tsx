import { useState } from 'react';
import { X, Save, Upload, FileText, Book, Headphones, PenTool, Mic, Plus, Trash2, CheckCircle, AlertCircle, Copy, Eye } from 'lucide-react';
import { SpeakingExamContent } from './SpeakingExamContent';

interface CreateExamModalProps {
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  onClose: () => void;
  onSave: (data: any) => void;
}

export function CreateExamModalAdvanced({ skill, onClose, onSave }: CreateExamModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    examCode: '', // Mã đề thi
    level: '',
    duration: '',
    createdBy: '',
    status: 'draft',
  });

  const [showPreview, setShowPreview] = useState(false);

  // Reading specific state
  const [readingData, setReadingData] = useState({
    parts: [
      { partNumber: 1, passage: '', questions: [{ id: 1, question: '', options: ['', '', '', ''], correctAnswer: 'A' }] },
      { partNumber: 2, passage: '', questions: [{ id: 1, question: '', options: ['', '', '', ''], correctAnswer: 'A' }] },
      { partNumber: 3, passage: '', questions: [{ id: 1, question: '', options: ['', '', '', ''], correctAnswer: 'A' }] },
    ],
  });

  // Listening specific state
  const [listeningData, setListeningData] = useState({
    audioFile: null as File | null,
    audioUrl: '',
    parts: [
      { partNumber: 1, questions: [{ id: 1, question: '', options: ['', '', '', ''], correctAnswer: 'A' }] },
      { partNumber: 2, questions: [{ id: 1, question: '', options: ['', '', '', ''], correctAnswer: 'A' }] },
      { partNumber: 3, questions: [{ id: 1, question: '', options: ['', '', '', ''], correctAnswer: 'A' }] },
    ],
  });

  // Writing specific state
  const [writingData, setWritingData] = useState({
    task1: {
      prompt: '',
      type: 'email', // email, letter
      minWords: 150,
      rubric: '',
    },
    task2: {
      prompt: '',
      type: 'essay', // argumentative, discussion, opinion
      minWords: 250,
      rubric: '',
    },
  });

  // Speaking specific state
  const [speakingData, setSpeakingData] = useState({
    part1: {
      sections: [
        {
          topicName: '',
          questions: ['', '', ''],
        },
      ],
    },
    part2: {
      situation: '',
      options: ['', '', ''],
    },
    part3: {
      topic: '',
      mindMapCenter: '',
      mindMapBranches: ['', '', '', ''],
      followUpQuestions: ['', '', ''],
    },
  });

  const handleSave = () => {
    const examData = {
      ...formData,
      skill,
      data: skill === 'reading' ? readingData :
            skill === 'listening' ? listeningData :
            skill === 'writing' ? writingData :
            speakingData,
    };
    
    onSave(examData);
  };

  const getSkillIcon = () => {
    switch (skill) {
      case 'reading': return <Book className="size-6 text-blue-600" />;
      case 'listening': return <Headphones className="size-6 text-emerald-600" />;
      case 'writing': return <PenTool className="size-6 text-violet-600" />;
      case 'speaking': return <Mic className="size-6 text-amber-600" />;
    }
  };

  const getSkillColor = () => {
    switch (skill) {
      case 'reading': return 'from-blue-500 to-blue-600';
      case 'listening': return 'from-emerald-500 to-emerald-600';
      case 'writing': return 'from-violet-500 to-violet-600';
      case 'speaking': return 'from-amber-500 to-amber-600';
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getSkillColor()} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                {getSkillIcon()}
              </div>
              <div>
                <h3 className="text-2xl font-bold">Tạo đề thi {skill.charAt(0).toUpperCase() + skill.slice(1)} mới</h3>
                <p className="text-sm opacity-90 mt-1">Định dạng chuẩn VSTEP - Dễ dàng upload đề thi</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="size-6" />
            </button>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Basic Info - Common for all skills */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="size-5" />
                Thông tin cơ bản
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên đề thi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={`VD: ${skill.charAt(0).toUpperCase() + skill.slice(1)} Test 01 - Climate Change`}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã đề thi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: VSTEP-001"
                    value={formData.examCode}
                    onChange={(e) => setFormData({ ...formData, examCode: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cấp độ <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn cấp độ</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian (phút) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder={skill === 'reading' ? '60' : skill === 'listening' ? '40' : skill === 'writing' ? '60' : '12'}
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tạo bởi
                  </label>
                  <input
                    type="text"
                    placeholder="Tên giáo viên / người tạo đề"
                    value={formData.createdBy}
                    onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Skill-specific content */}
            {skill === 'reading' && <ReadingContent data={readingData} setData={setReadingData} />}
            {skill === 'listening' && <ListeningContent data={listeningData} setData={setListeningData} />}
            {skill === 'writing' && <WritingContent data={writingData} setData={setWritingData} />}
            {skill === 'speaking' && <SpeakingExamContent data={speakingData} setData={setSpeakingData} />}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.status === 'published'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })}
                  className="rounded" 
                />
                <span className="text-sm font-medium">Xuất bản ngay</span>
              </label>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Eye className="size-4" />
                Preview
              </button>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleSave}
                className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${getSkillColor()} text-white rounded-lg hover:opacity-90 font-medium transition-all shadow-lg`}
              >
                <Save className="size-4" />
                Lưu đề thi
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Reading Content Component
function ReadingContent({ data, setData }: any) {
  const addQuestion = (partIndex: number) => {
    const newParts = [...data.parts];
    const newQuestionId = newParts[partIndex].questions.length + 1;
    newParts[partIndex].questions.push({
      id: newQuestionId,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 'A',
    });
    setData({ ...data, parts: newParts });
  };

  const removeQuestion = (partIndex: number, questionIndex: number) => {
    const newParts = [...data.parts];
    newParts[partIndex].questions.splice(questionIndex, 1);
    setData({ ...data, parts: newParts });
  };

  const updatePassage = (partIndex: number, passage: string) => {
    const newParts = [...data.parts];
    newParts[partIndex].passage = passage;
    setData({ ...data, parts: newParts });
  };

  const updateQuestion = (partIndex: number, questionIndex: number, field: string, value: any) => {
    const newParts = [...data.parts];
    newParts[partIndex].questions[questionIndex][field] = value;
    setData({ ...data, parts: newParts });
  };

  const updateOption = (partIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    const newParts = [...data.parts];
    newParts[partIndex].questions[questionIndex].options[optionIndex] = value;
    setData({ ...data, parts: newParts });
  };

  return (
    <div className="space-y-6">
      {data.parts.map((part: any, partIndex: number) => (
        <div key={partIndex} className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <Book className="size-5" />
              Part {part.partNumber}
            </h4>
            <span className="text-sm text-blue-700 font-medium">
              {part.questions.length} câu hỏi
            </span>
          </div>

          {/* Passage */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đoạn văn (Passage) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={8}
              placeholder="Nhập hoặc paste đoạn văn tiếng Anh..."
              value={part.passage}
              onChange={(e) => updatePassage(partIndex, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Câu hỏi và đáp án
              </label>
              <button
                onClick={() => addQuestion(partIndex)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                <Plus className="size-4" />
                Thêm câu hỏi
              </button>
            </div>

            {part.questions.map((q: any, qIndex: number) => (
              <div key={qIndex} className="bg-white border border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <label className="text-sm font-medium text-gray-900">
                    Câu {qIndex + 1}
                  </label>
                  {part.questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(partIndex, qIndex)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>

                {/* Question text */}
                <input
                  type="text"
                  placeholder="Nhập câu hỏi..."
                  value={q.question}
                  onChange={(e) => updateQuestion(partIndex, qIndex, 'question', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-sm"
                />

                {/* Options */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {['A', 'B', 'C', 'D'].map((letter, oIndex) => (
                    <div key={letter} className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">
                        {letter}
                      </span>
                      <input
                        type="text"
                        placeholder={`Đáp án ${letter}`}
                        value={q.options[oIndex]}
                        onChange={(e) => updateOption(partIndex, qIndex, oIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Answer */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Đáp án đúng:</label>
                  <div className="flex gap-2">
                    {['A', 'B', 'C', 'D'].map((letter) => (
                      <button
                        key={letter}
                        onClick={() => updateQuestion(partIndex, qIndex, 'correctAnswer', letter)}
                        className={`w-8 h-8 rounded-lg font-bold text-sm transition-all ${
                          q.correctAnswer === letter
                            ? 'bg-green-600 text-white shadow-lg scale-110'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* JSON Import/Export Helper */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6">
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Copy className="size-4" />
          Import/Export JSON (Nâng cao)
        </h4>
        <p className="text-xs text-gray-600 mb-3">
          Có thể paste JSON để import hàng loạt hoặc copy JSON để backup
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const json = JSON.stringify(data, null, 2);
              navigator.clipboard.writeText(json);
              alert('Đã copy JSON!');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Copy JSON
          </button>
          <button
            onClick={() => {
              const json = prompt('Paste JSON:');
              if (json) {
                try {
                  setData(JSON.parse(json));
                  alert('Import thành công!');
                } catch (e) {
                  alert('JSON không hợp lệ!');
                }
              }
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
          >
            Import JSON
          </button>
        </div>
      </div>
    </div>
  );
}

// Listening Content Component
function ListeningContent({ data, setData }: any) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData({ ...data, audioFile: file, audioUrl: URL.createObjectURL(file) });
    }
  };

  const addQuestion = (partIndex: number) => {
    const newParts = [...data.parts];
    const newQuestionId = newParts[partIndex].questions.length + 1;
    newParts[partIndex].questions.push({
      id: newQuestionId,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 'A',
    });
    setData({ ...data, parts: newParts });
  };

  const removeQuestion = (partIndex: number, questionIndex: number) => {
    const newParts = [...data.parts];
    newParts[partIndex].questions.splice(questionIndex, 1);
    setData({ ...data, parts: newParts });
  };

  const updateQuestion = (partIndex: number, questionIndex: number, field: string, value: any) => {
    const newParts = [...data.parts];
    newParts[partIndex].questions[questionIndex][field] = value;
    setData({ ...data, parts: newParts });
  };

  const updateOption = (partIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    const newParts = [...data.parts];
    newParts[partIndex].questions[questionIndex].options[optionIndex] = value;
    setData({ ...data, parts: newParts });
  };

  return (
    <div className="space-y-6">
      {/* Audio Upload */}
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
        <h4 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
          <Headphones className="size-5" />
          File Audio <span className="text-red-500">*</span>
        </h4>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-white">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="audio-upload"
            />
            <label htmlFor="audio-upload" className="cursor-pointer">
              <Upload className="size-12 text-emerald-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Click để chọn file audio
              </p>
              <p className="text-xs text-gray-500">
                MP3, WAV, M4A (Tối đa 100MB)
              </p>
            </label>
          </div>

          {data.audioFile && (
            <div className="bg-white border-2 border-emerald-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="size-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{data.audioFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(data.audioFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setData({ ...data, audioFile: null, audioUrl: '' })}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              {data.audioUrl && (
                <audio controls className="w-full">
                  <source src={data.audioUrl} />
                </audio>
              )}
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Lưu ý về file audio:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Đảm bảo audio rõ ràng, không nhiễu</li>
                  <li>Độ dài phù hợp với thời gian làm bài (thường 30-35 phút)</li>
                  <li>Có đủ 3 parts theo chuẩn VSTEP</li>
                  <li>Format khuyên dùng: MP3 (128kbps trở lên)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions for each part */}
      {data.parts.map((part: any, partIndex: number) => (
        <div key={partIndex} className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              <Headphones className="size-5" />
              Part {part.partNumber}
            </h4>
            <span className="text-sm text-emerald-700 font-medium">
              {part.questions.length} câu hỏi
            </span>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Câu hỏi và đáp án
              </label>
              <button
                onClick={() => addQuestion(partIndex)}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
              >
                <Plus className="size-4" />
                Thêm câu hỏi
              </button>
            </div>

            {part.questions.map((q: any, qIndex: number) => (
              <div key={qIndex} className="bg-white border border-emerald-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <label className="text-sm font-medium text-gray-900">
                    Câu {qIndex + 1}
                  </label>
                  {part.questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(partIndex, qIndex)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>

                {/* Question text */}
                <input
                  type="text"
                  placeholder="Nhập câu hỏi..."
                  value={q.question}
                  onChange={(e) => updateQuestion(partIndex, qIndex, 'question', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3 text-sm"
                />

                {/* Options */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {['A', 'B', 'C', 'D'].map((letter, oIndex) => (
                    <div key={letter} className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-700">
                        {letter}
                      </span>
                      <input
                        type="text"
                        placeholder={`Đáp án ${letter}`}
                        value={q.options[oIndex]}
                        onChange={(e) => updateOption(partIndex, qIndex, oIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Answer */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Đáp án đúng:</label>
                  <div className="flex gap-2">
                    {['A', 'B', 'C', 'D'].map((letter) => (
                      <button
                        key={letter}
                        onClick={() => updateQuestion(partIndex, qIndex, 'correctAnswer', letter)}
                        className={`w-8 h-8 rounded-lg font-bold text-sm transition-all ${
                          q.correctAnswer === letter
                            ? 'bg-green-600 text-white shadow-lg scale-110'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* JSON Import/Export */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6">
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Copy className="size-4" />
          Import/Export JSON (Nâng cao)
        </h4>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const json = JSON.stringify(data, null, 2);
              navigator.clipboard.writeText(json);
              alert('Đã copy JSON!');
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
          >
            Copy JSON
          </button>
          <button
            onClick={() => {
              const json = prompt('Paste JSON:');
              if (json) {
                try {
                  const parsed = JSON.parse(json);
                  setData({ ...data, parts: parsed.parts });
                  alert('Import thành công!');
                } catch (e) {
                  alert('JSON không hợp lệ!');
                }
              }
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
          >
            Import JSON
          </button>
        </div>
      </div>
    </div>
  );
}

// Writing Content Component
function WritingContent({ data, setData }: any) {
  return (
    <div className="space-y-6">
      {/* Task 1 */}
      <div className="bg-violet-50 border-2 border-violet-200 rounded-xl p-6">
        <h4 className="text-lg font-bold text-violet-900 mb-4 flex items-center gap-2">
          <PenTool className="size-5" />
          Task 1 - Email/Letter
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại bài viết
            </label>
            <select
              value={data.task1.type}
              onChange={(e) => setData({ ...data, task1: { ...data.task1, type: e.target.value } })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="email">Formal Email</option>
              <option value="letter">Letter</option>
              <option value="informal-email">Informal Email</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đề bài (Prompt) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              placeholder="VD: You recently attended a conference. Write an email to your manager describing the conference and suggesting how the information you learned could be applied to your company."
              value={data.task1.prompt}
              onChange={(e) => setData({ ...data, task1: { ...data.task1, prompt: e.target.value } })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số từ tối thiểu
            </label>
            <input
              type="number"
              value={data.task1.minWords}
              onChange={(e) => setData({ ...data, task1: { ...data.task1, minWords: parseInt(e.target.value) } })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rubric chấm điểm (Tùy chọn)
            </label>
            <textarea
              rows={3}
              placeholder="Tiêu chí chấm: Format, Content, Language, Organization..."
              value={data.task1.rubric}
              onChange={(e) => setData({ ...data, task1: { ...data.task1, rubric: e.target.value } })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Task 2 */}
      <div className="bg-violet-50 border-2 border-violet-200 rounded-xl p-6">
        <h4 className="text-lg font-bold text-violet-900 mb-4 flex items-center gap-2">
          <PenTool className="size-5" />
          Task 2 - Essay
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại essay
            </label>
            <select
              value={data.task2.type}
              onChange={(e) => setData({ ...data, task2: { ...data.task2, type: e.target.value } })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="argumentative">Argumentative (Tranh luận)</option>
              <option value="discussion">Discussion (Thảo luận)</option>
              <option value="opinion">Opinion (Ý kiến)</option>
              <option value="problem-solution">Problem-Solution</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đề bài (Prompt) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              placeholder="VD: Some people believe that technology has made our lives easier, while others think it has created more problems. Discuss both views and give your own opinion."
              value={data.task2.prompt}
              onChange={(e) => setData({ ...data, task2: { ...data.task2, prompt: e.target.value } })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số từ tối thiểu
            </label>
            <input
              type="number"
              value={data.task2.minWords}
              onChange={(e) => setData({ ...data, task2: { ...data.task2, minWords: parseInt(e.target.value) } })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rubric chấm điểm (Tùy chọn)
            </label>
            <textarea
              rows={3}
              placeholder="Tiêu chí chấm: Task Response, Coherence & Cohesion, Lexical Resource, Grammar..."
              value={data.task2.rubric}
              onChange={(e) => setData({ ...data, task2: { ...data.task2, rubric: e.target.value } })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Hướng dẫn soạn đề Writing:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Task 1: Thường là email/letter formal hoặc informal (150+ từ)</li>
              <li>Task 2: Essay theo nhiều dạng khác nhau (250+ từ)</li>
              <li>Đảm bảo đề bài rõ ràng, có yêu cầu cụ thể</li>
              <li>AI sẽ chấm dựa trên: Task Achievement, Coherence, Vocabulary, Grammar</li>
            </ul>
          </div>
        </div>
      </div>

      {/* JSON Import/Export */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6">
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Copy className="size-4" />
          Import/Export JSON
        </h4>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const json = JSON.stringify(data, null, 2);
              navigator.clipboard.writeText(json);
              alert('Đã copy JSON!');
            }}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 text-sm font-medium"
          >
            Copy JSON
          </button>
          <button
            onClick={() => {
              const json = prompt('Paste JSON:');
              if (json) {
                try {
                  setData(JSON.parse(json));
                  alert('Import thành công!');
                } catch (e) {
                  alert('JSON không hợp lệ!');
                }
              }
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
          >
            Import JSON
          </button>
        </div>
      </div>
    </div>
  );
}

// Speaking Content Component
function SpeakingContent({ data, setData }: any) {
  const updatePart1Question = (sectionIndex: number, index: number, value: string) => {
    const newSections = [...data.part1.sections];
    newSections[sectionIndex].questions[index] = value;
    setData({ ...data, part1: { ...data.part1, sections: newSections } });
  };

  const addPart1Question = (sectionIndex: number) => {
    setData({ 
      ...data, 
      part1: { 
        ...data.part1, 
        sections: data.part1.sections.map((section: any, i: number) => 
          i === sectionIndex ? { ...section, questions: [...section.questions, ''] } : section
        ) 
      } 
    });
  };

  const removePart1Question = (sectionIndex: number, index: number) => {
    const newSections = data.part1.sections.map((section: any, i: number) => 
      i === sectionIndex ? { ...section, questions: section.questions.filter((_: any, j: number) => j !== index) } : section
    );
    setData({ ...data, part1: { ...data.part1, sections: newSections } });
  };

  const updatePart3Question = (index: number, value: string) => {
    const newQuestions = [...data.part3.followUpQuestions];
    newQuestions[index] = value;
    setData({ ...data, part3: { ...data.part3, followUpQuestions: newQuestions } });
  };

  const addPart3Question = () => {
    setData({ 
      ...data, 
      part3: { 
        ...data.part3, 
        followUpQuestions: [...data.part3.followUpQuestions, ''] 
      } 
    });
  };

  const removePart3Question = (index: number) => {
    const newQuestions = data.part3.followUpQuestions.filter((_: any, i: number) => i !== index);
    setData({ ...data, part3: { ...data.part3, followUpQuestions: newQuestions } });
  };

  return (
    <div className="space-y-6">
      {/* Part 1 */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
        <h4 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
          <Mic className="size-5" />
          Part 1 - Interview (Phỏng vấn)
        </h4>

        <div className="space-y-3">
          {data.part1.sections.map((section: any, sectionIndex: number) => (
            <div key={sectionIndex} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Câu hỏi (thường 3-4 câu)
                </label>
                <button
                  onClick={() => addPart1Question(sectionIndex)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
                >
                  <Plus className="size-4" />
                  Thêm câu hỏi
                </button>
              </div>

              {section.questions.map((q: string, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-sm font-bold text-amber-700 flex-shrink-0">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    placeholder="VD: What do you do in your free time?"
                    value={q}
                    onChange={(e) => updatePart1Question(sectionIndex, index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {section.questions.length > 1 && (
                    <button
                      onClick={() => removePart1Question(sectionIndex, index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Part 2 */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
        <h4 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
          <Mic className="size-5" />
          Part 2 - Long Turn (Nói dài)
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: Describe a memorable trip you have taken"
              value={data.part2.topic}
              onChange={(e) => setData({ ...data, part2: { ...data.part2, topic: e.target.value } })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cue Card (Gợi ý) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              placeholder={"You should say:\n- Where you went\n- When you went there\n- Who you went with\n- And explain why this trip was memorable"}
              value={data.part2.cueCard}
              onChange={(e) => setData({ ...data, part2: { ...data.part2, cueCard: e.target.value } })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian chuẩn bị (phút)
              </label>
              <input
                type="number"
                value={data.part2.prepTime}
                onChange={(e) => setData({ ...data, part2: { ...data.part2, prepTime: parseInt(e.target.value) } })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian nói (phút)
              </label>
              <input
                type="number"
                value={data.part2.speakTime}
                onChange={(e) => setData({ ...data, part2: { ...data.part2, speakTime: parseInt(e.target.value) } })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Part 3 */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
        <h4 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
          <Mic className="size-5" />
          Part 3 - Discussion (Thảo luận)
        </h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Câu hỏi thảo luận (thường 3-4 câu)
            </label>
            <button
              onClick={addPart3Question}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
            >
              <Plus className="size-4" />
              Thêm câu hỏi
            </button>
          </div>

          {data.part3.followUpQuestions.map((q: string, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-sm font-bold text-amber-700 flex-shrink-0">
                {index + 1}
              </span>
              <input
                type="text"
                placeholder="VD: Do you think traveling is important for young people? Why?"
                value={q}
                onChange={(e) => updatePart3Question(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {data.part3.followUpQuestions.length > 1 && (
                <button
                  onClick={() => removePart3Question(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Hướng dẫn soạn đề Speaking:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Part 1: Câu hỏi cá nhân, thường về cuộc sống hàng ngày (3-4 câu)</li>
              <li>Part 2: Topic với cue card, thí sinh chuẩn bị 1 phút, nói 2 phút</li>
              <li>Part 3: Câu hỏi thảo luận sâu hơn liên quan đến Part 2 (3-4 câu)</li>
              <li>AI sẽ chấm dựa trên: Fluency, Vocabulary, Grammar, Pronunciation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* JSON Import/Export */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6">
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Copy className="size-4" />
          Import/Export JSON
        </h4>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const json = JSON.stringify(data, null, 2);
              navigator.clipboard.writeText(json);
              alert('Đã copy JSON!');
            }}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
          >
            Copy JSON
          </button>
          <button
            onClick={() => {
              const json = prompt('Paste JSON:');
              if (json) {
                try {
                  setData(JSON.parse(json));
                  alert('Import thành công!');
                } catch (e) {
                  alert('JSON không hợp lệ!');
                }
              }
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
          >
            Import JSON
          </button>
        </div>
      </div>
    </div>
  );
}