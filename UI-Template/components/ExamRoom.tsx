import { useState } from 'react';
import { ArrowLeft, Play, AlertCircle } from 'lucide-react';
import { ExamInterface } from './exam/ExamInterface';
import { PreExamInstructions } from './exam/PreExamInstructions';

interface ExamRoomProps {
  onBack: () => void;
}

type Level = 'B1' | 'B2' | 'C1';

// Mock exam data
const mockExams = [
  {
    id: 'exam_b1_001',
    level: 'B1',
    title: 'Đề thi VSTEP B1 - Đề số 01',
    description: 'Đề thi đầy đủ 4 kỹ năng theo chuẩn VSTEP B1',
    totalTime: 172, // phút
  },
  {
    id: 'exam_b1_002',
    level: 'B1',
    title: 'Đề thi VSTEP B1 - Đề số 02',
    description: 'Đề thi đầy đủ 4 kỹ năng theo chuẩn VSTEP B1',
    totalTime: 172,
  },
  {
    id: 'exam_b2_001',
    level: 'B2',
    title: 'Đề thi VSTEP B2 - Đề số 01',
    description: 'Đề thi đầy đủ 4 kỹ năng theo chuẩn VSTEP B2',
    totalTime: 172,
  },
  {
    id: 'exam_b2_002',
    level: 'B2',
    title: 'Đề thi VSTEP B2 - Đề số 02',
    description: 'Đề thi đầy đủ 4 kỹ năng theo chuẩn VSTEP B2',
    totalTime: 172,
  },
  {
    id: 'exam_c1_001',
    level: 'C1',
    title: 'Đề thi VSTEP C1 - Đề số 01',
    description: 'Đề thi đầy đủ 4 kỹ năng theo chuẩn VSTEP C1',
    totalTime: 172,
  },
];

export function ExamRoom({ onBack }: ExamRoomProps) {
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level>('B1');
  const [showInstructions, setShowInstructions] = useState(false);

  const levels: Level[] = ['B1', 'B2', 'C1'];

  const filteredExams = mockExams.filter((exam) => exam.level === selectedLevel);

  // Show pre-exam instructions
  if (showInstructions && selectedExam) {
    return (
      <PreExamInstructions
        studentName="Phạm Ngọc Anh"
        studentId="FOBI0409180037"
        onStartExam={() => setShowInstructions(false)}
        onBack={() => {
          setShowInstructions(false);
          setSelectedExam(null);
        }}
      />
    );
  }

  // Show exam interface
  if (selectedExam && !showInstructions) {
    return (
      <ExamInterface
        examId={selectedExam.id}
        studentName="Phạm Ngọc Anh"
        onBack={() => setSelectedExam(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="size-6" />
        </button>
        <div>
          <h2 className="text-2xl">Hướng dẫn thi VSTEP</h2>
          <p className="text-gray-600">Thi thử đề thi VSTEP chính thức</p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertCircle className="size-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl mb-2 text-red-900">Lưu ý quan trọng trước khi bắt đầu</h3>
            <ul className="space-y-2 text-sm text-red-800">
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Đây là bài thi mô phỏng hoàn toàn như thi thật với đầy đủ 4 kỹ năng</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Thời gian làm bài: Khoảng 2 giờ 50 phút (Reading 60 phút, Listening 40 phút, Writing 60 phút, Speaking 12 phút)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Bạn phải làm tuần tự từ Reading → Listening → Writing → Speaking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Không được quay lại phần đã làm</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Đảm bảo kết nối internet ổn định và không bị gián đoạn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Level Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-4">Chọn cấp độ thi</h3>
        <div className="flex gap-3">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-6 py-3 rounded-lg transition-colors ${
                selectedLevel === level
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Exam List */}
      <div>
        <h3 className="text-xl mb-4">Đề thi có sẵn</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-100 hover:border-red-200 hover:shadow-lg transition-all"
            >
              <div className="mb-4">
                <span className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded">
                  {exam.level}
                </span>
              </div>
              <h4 className="text-xl mb-2">{exam.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{exam.description}</p>
              <div className="mb-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Tổng thời gian:</span>
                  <span className="text-red-600">{exam.totalTime} phút</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedExam(exam);
                  setShowInstructions(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
              >
                <Play className="size-5" />
                Bắt đầu thi
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}