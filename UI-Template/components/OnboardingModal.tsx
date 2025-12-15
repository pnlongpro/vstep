import { useState } from 'react';
import { Book, Headphones, PenTool, Mic, CheckCircle, ArrowRight, ArrowLeft, X, Sparkles, Save, Bot, Target, Trophy, Zap } from 'lucide-react';

interface OnboardingModalProps {
  onComplete: () => void;
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'welcome',
      title: 'Chào mừng đến VSTEPRO! 🎉',
      description: 'Nền tảng luyện thi VSTEP hàng đầu Việt Nam',
      content: (
        <div className="flex flex-col items-center gap-6 py-8">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <Trophy className="size-16 text-white" />
          </div>
          <div className="text-center space-y-3">
            <p className="text-lg text-gray-700">
              Học viên thân mến! 👋
            </p>
            <p className="text-gray-600">
              Cảm ơn bạn đã tin tưởng và lựa chọn VSTEPRO.<br />
              Chúng tôi sẽ đồng hành cùng bạn chinh phục mục tiêu VSTEP!
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Target className="size-6 text-green-600" />
                </div>
                <span className="text-xs text-gray-600">Mục tiêu rõ ràng</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Zap className="size-6 text-blue-600" />
                </div>
                <span className="text-xs text-gray-600">Học nhanh hiệu quả</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <Trophy className="size-6 text-purple-600" />
                </div>
                <span className="text-xs text-gray-600">Đạt điểm cao</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'skills',
      title: '4 Kỹ Năng Toàn Diện 📚',
      description: 'Luyện tập đầy đủ theo chuẩn VSTEP từ A2 đến C1',
      content: (
        <div className="grid grid-cols-2 gap-4 py-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
              <Book className="size-7 text-green-600" />
            </div>
            <h3 className="text-green-900 mb-2">Reading</h3>
            <p className="text-sm text-green-700">4 Parts với đa dạng dạng bài</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
              <Headphones className="size-7 text-purple-600" />
            </div>
            <h3 className="text-purple-900 mb-2">Listening</h3>
            <p className="text-sm text-purple-700">3 Parts với audio chất lượng cao</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-200 hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
              <PenTool className="size-7 text-orange-600" />
            </div>
            <h3 className="text-orange-900 mb-2">Writing</h3>
            <p className="text-sm text-orange-700">2 Tasks với AI chấm điểm</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border-2 border-pink-200 hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
              <Mic className="size-7 text-pink-600" />
            </div>
            <h3 className="text-pink-900 mb-2">Speaking</h3>
            <p className="text-sm text-pink-700">3 Parts với voice recording</p>
          </div>
        </div>
      ),
    },
    {
      id: 'modes',
      title: '2 Chế Độ Luyện Tập 🎯',
      description: 'Linh hoạt theo nhu cầu của bạn',
      content: (
        <div className="space-y-4 py-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl">1</span>
              </div>
              <div>
                <h3 className="text-blue-900 mb-2">Luyện Theo Phần</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Chọn Part cụ thể để rèn luyện kỹ năng yếu
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white rounded-full text-xs text-blue-700 border border-blue-200">
                    Part 1
                  </span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs text-blue-700 border border-blue-200">
                    Part 2
                  </span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs text-blue-700 border border-blue-200">
                    Part 3
                  </span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs text-blue-700 border border-blue-200">
                    Part 4
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl">2</span>
              </div>
              <div>
                <h3 className="text-purple-900 mb-2">Làm Bộ Đề Đầy Đủ</h3>
                <p className="text-sm text-purple-700 mb-3">
                  Làm đầy đủ tất cả Parts trong 1 kỹ năng
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-5 text-purple-600" />
                  <span className="text-sm text-purple-700">
                    Mô phỏng bài thi thật với đầy đủ thời gian
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'features',
      title: 'Tính Năng Nổi Bật ✨',
      description: 'Công nghệ hiện đại hỗ trợ học tập',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
          <div className="bg-white p-5 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="size-5 text-white" />
              </div>
              <h4 className="text-gray-900">AI Chấm Điểm</h4>
            </div>
            <p className="text-sm text-gray-600">
              Writing & Speaking được chấm bởi AI với feedback chi tiết theo 4 tiêu chí
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border-2 border-gray-200 hover:border-green-300 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="size-5 text-white" />
              </div>
              <h4 className="text-gray-900">Tự Động Chấm</h4>
            </div>
            <p className="text-sm text-gray-600">
              Reading & Listening tự động chấm điểm ngay lập tức
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Save className="size-5 text-white" />
              </div>
              <h4 className="text-gray-900">Auto Save</h4>
            </div>
            <p className="text-sm text-gray-600">
              Bài làm tự động lưu mỗi 10 giây, không lo mất dữ liệu
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border-2 border-gray-200 hover:border-orange-300 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Sparkles className="size-5 text-white" />
              </div>
              <h4 className="text-gray-900">Trợ Lý AI 24/7</h4>
            </div>
            <p className="text-sm text-gray-600">
              Chatbot AI sẵn sàng hỗ trợ bạn mọi lúc mọi nơi
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'ready',
      title: 'Sẵn Sàng Bắt Đầu! 🚀',
      description: 'Hành trình chinh phục VSTEP của bạn bắt đầu từ đây',
      content: (
        <div className="flex flex-col items-center gap-6 py-8">
          <div className="relative">
            <div className="w-40 h-40 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="size-20 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="size-8 text-yellow-900" />
            </div>
          </div>
          
          <div className="text-center space-y-4 max-w-md">
            <h3 className="text-2xl text-gray-800">
              Bạn đã sẵn sàng!
            </h3>
            <p className="text-gray-600">
              Hãy bắt đầu với bất kỳ kỹ năng nào bạn muốn luyện tập.<br />
              Chúc bạn học tốt và đạt điểm cao! 💪
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200 mt-6">
              <p className="text-sm text-gray-700 mb-3">
                💡 <strong>Mẹo:</strong> Bạn có thể truy cập hướng dẫn bất kỳ lúc nào từ menu
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <span>Sidebar</span>
                <ArrowRight className="size-4" />
                <span>Chức năng khác</span>
                <ArrowRight className="size-4" />
                <span>Hỗ trợ AI</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-fadeIn relative">
        {/* Close Button X - Top Right Inside Modal */}
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-20 p-2.5 bg-white hover:bg-gray-100 rounded-full transition-all shadow-lg border border-gray-200 group"
          title="Bỏ qua"
        >
          <X className="size-5 text-gray-700 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-200" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
          <div className="pr-16">
            <h2 className="text-2xl mb-2">{currentStepData.title}</h2>
            <p className="text-blue-100 text-sm">{currentStepData.description}</p>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mt-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-white'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 240px)' }}>
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Bước {currentStep + 1} / {steps.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="px-6 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-all flex items-center gap-2"
              >
                <ArrowLeft className="size-4" />
                Quay lại
              </button>
            )}

            {!isLastStep && (
              <button
                onClick={handleSkip}
                className="px-6 py-2.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-all"
              >
                Bỏ qua
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              {isLastStep ? (
                <>
                  Bắt đầu ngay
                  <Sparkles className="size-4" />
                </>
              ) : (
                <>
                  Tiếp tục
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}