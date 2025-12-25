import { CheckCircle, FileText, Clock, PenTool } from 'lucide-react';

interface BankTest {
  id: number;
  title: string;
  level: string;
  parts: number;
  time: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions?: number;
  words?: number;
  type?: string;
}

interface BankTestSelectorProps {
  tests: BankTest[];
  selectedTestId: number | null;
  onSelectTest: (testId: number) => void;
}

export function BankTestSelector({ tests, selectedTestId, onSelectTest }: BankTestSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-3">
        📚 Ngân hàng đề VSTEP chuẩn <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto p-1">
        {tests.map((test) => (
          <button
            key={test.id}
            type="button"
            onClick={() => onSelectTest(test.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedTestId === test.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  test.level === 'B1' 
                    ? 'bg-green-100 text-green-700' 
                    : test.level === 'B2'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {test.level}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  test.difficulty === 'Easy'
                    ? 'bg-green-50 text-green-600'
                    : test.difficulty === 'Medium'
                    ? 'bg-yellow-50 text-yellow-600'
                    : 'bg-red-50 text-red-600'
                }`}>
                  {test.difficulty === 'Easy' ? '⭐ Dễ' : test.difficulty === 'Medium' ? '⭐⭐ TB' : '⭐⭐⭐ Khó'}
                </span>
              </div>
              {selectedTestId === test.id && (
                <CheckCircle className="size-5 text-blue-600" />
              )}
            </div>
            
            <h4 className="font-medium text-gray-900 mb-2">{test.title}</h4>
            
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <FileText className="size-3.5" />
                <span>{test.parts} Parts</span>
              </div>
              {test.questions && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="size-3.5" />
                  <span>{test.questions} câu</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="size-3.5" />
                <span>{test.time} phút</span>
              </div>
              {test.words && (
                <div className="flex items-center gap-1">
                  <PenTool className="size-3.5" />
                  <span>{test.words} từ</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        💡 Chọn 1 đề để tự động điền thông tin
      </p>
    </div>
  );
}
