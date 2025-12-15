import { useState } from 'react';
import { ArrowLeft, Upload, Sparkles, CheckCircle2, FileText, Mic, Square } from 'lucide-react';

interface AIGradingProps {
  onBack: () => void;
}

export function AIGrading({ onBack }: AIGradingProps) {
  const [activeTab, setActiveTab] = useState<'writing' | 'speaking'>('writing');
  const [taskInput, setTaskInput] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTranscript(''); // Reset transcript

      // Initialize Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US'; // VSTEP is English exam
        recognition.continuous = true;
        recognition.interimResults = true;

        let finalTranscript = '';

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPiece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcriptPiece + ' ';
            } else {
              interimTranscript += transcriptPiece;
            }
          }
          
          setTranscript(finalTranscript + interimTranscript);
          setIsTranscribing(true);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error !== 'no-speech') {
            setIsTranscribing(false);
          }
        };

        recognition.onend = () => {
          setIsTranscribing(false);
        };

        recognition.start();
        (window as any).speechRecognition = recognition;
      } else {
        console.warn('Speech Recognition not supported');
      }

      // Start timer
      let time = 0;
      const timer = setInterval(() => {
        time++;
        setRecordingTime(time);
      }, 1000);

      // Store timer in window for cleanup
      (window as any).recordingTimer = timer;

      // Store mediaRecorder for stopping
      (window as any).mediaRecorder = mediaRecorder;
    } catch (error) {
      // Silently handle microphone permission denial - UI will show error message
      setRecordingError('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
    }
  };

  const handleStopRecording = () => {
    const mediaRecorder = (window as any).mediaRecorder;
    const timer = (window as any).recordingTimer;
    const recognition = (window as any).speechRecognition;

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }

    if (timer) {
      clearInterval(timer);
    }

    if (recognition) {
      recognition.stop();
    }

    setIsRecording(false);
    setIsTranscribing(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="size-5 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Powered by Advanced AI</span>
          </div>
          <h2 className="text-2xl">Chấm Điểm AI</h2>
          <p className="text-gray-600">
            Nhận kết quả chấm điểm và phản hồi chi tiết cho bài Writing và Speaking của bạn trong vài giây
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('writing')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
            activeTab === 'writing'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FileText className="size-4" />
          Chấm Writing
        </button>
        <button
          onClick={() => setActiveTab('speaking')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
            activeTab === 'speaking'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Mic className="size-4" />
          Chấm Speaking
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="text-xl mb-4">
            Chấm {activeTab === 'writing' ? 'Writing' : 'Speaking'}
            <span className="text-sm text-gray-500 ml-2">Task 1 hoặc Task 2</span>
          </h3>

          <div className="space-y-4">
            {/* Task Input */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Dán đề bài (nội dung task) của bạn vào đây:
              </label>
              <textarea
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Nhập hoặc dán đề bài của bạn vào đây..."
                className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* User Answer */}
            {activeTab === 'writing' ? (
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Dán bài viết của bạn vào đây:
                </label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="VD: Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake, regardless of whether the course is useful to an employer.

What, in your opinion, should be the main function of a university?"
                  className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Recording Button */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Ghi âm câu trả lời:
                  </label>
                  
                  {/* Permission Notice */}
                  {!isRecording && !audioBlob && !recordingError && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-700 flex items-start gap-2">
                        <span className="text-base">ℹ️</span>
                        <span>
                          <strong>Lưu ý:</strong> Trình duyệt sẽ yêu cầu quyền truy cập microphone. 
                          Vui lòng chọn <strong>"Allow"</strong> hoặc <strong>"Cho phép"</strong> khi popup xuất hiện.
                        </span>
                      </p>
                    </div>
                  )}
                  
                  <div className="border-2 border-purple-300 rounded-xl p-6 bg-purple-50">
                    {recordingError && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 mb-2">⚠️ {recordingError}</p>
                        <div className="text-xs text-red-600 space-y-1">
                          <p><strong>Hướng dẫn:</strong></p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Cho phép quyền truy cập microphone trong trình duyệt</li>
                            <li>Kiểm tra thiết lập Privacy & Security</li>
                            <li>Hoặc sử dụng tính năng "Upload file" bên dưới</li>
                          </ul>
                        </div>
                        <button
                          onClick={() => setRecordingError(null)}
                          className="mt-3 text-xs text-red-700 underline hover:text-red-800"
                        >
                          Thử lại
                        </button>
                      </div>
                    )}
                    
                    {!isRecording && !audioBlob && !recordingError && (
                      <div className="text-center">
                        <button
                          onClick={handleStartRecording}
                          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
                        >
                          <Mic className="size-5" />
                          <span>Bấm để ghi âm</span>
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                          Click để bắt đầu ghi âm và nhận diện giọng nói tự động
                        </p>
                      </div>
                    )}

                    {isRecording && (
                      <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-red-600 font-medium">Đang ghi âm...</span>
                        </div>
                        <div className="text-3xl font-mono text-purple-700">
                          {formatTime(recordingTime)}
                        </div>
                        
                        {/* Live Transcript Display */}
                        {transcript && (
                          <div className="mt-4 p-4 bg-white rounded-lg border-2 border-blue-200 text-left max-h-40 overflow-y-auto">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="size-4 text-blue-600" />
                              <span className="text-xs text-blue-600 font-medium">
                                {isTranscribing ? 'Đang chuyển đổi giọng nói...' : 'Transcript'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {transcript}
                            </p>
                          </div>
                        )}
                        
                        <button
                          onClick={handleStopRecording}
                          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:shadow-lg transition-all"
                        >
                          <Square className="size-5" />
                          <span>Dừng ghi âm</span>
                        </button>
                      </div>
                    )}

                    {audioBlob && !isRecording && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle2 className="size-5" />
                          <span className="font-medium">Đã ghi âm thành công!</span>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <audio
                            controls
                            src={URL.createObjectURL(audioBlob)}
                            className="w-full"
                          />
                        </div>
                        
                        {/* Show Final Transcript */}
                        {transcript && (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="size-4 text-blue-600" />
                              <span className="text-xs text-blue-600 font-medium">Transcript (AI sẽ dùng để chấm điểm)</span>
                            </div>
                            <textarea
                              value={transcript}
                              onChange={(e) => setTranscript(e.target.value)}
                              className="w-full h-32 p-3 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                              placeholder="Transcript sẽ xuất hiện ở đây..."
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              💡 Bạn có thể chỉnh sửa nếu có lỗi nhận diện
                            </p>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setAudioBlob(null);
                              setRecordingTime(0);
                              setTranscript('');
                            }}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Ghi lại
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* File Upload Option */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Hoặc upload file:
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".txt,.docx,.pdf,.mp3,.wav,.m4a"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                          <Upload className="size-8 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-gray-700 mb-1">
                            Kéo thả file hoặc <span className="text-purple-600 font-medium">click để chọn</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            MP3, WAV, M4A (tối đa 10MB)
                          </p>
                        </div>
                      </div>
                    </label>
                    {uploadedFile && (
                      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-700">
                          📄 {uploadedFile.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2 group">
              <Sparkles className="size-5 group-hover:scale-110 transition-transform" />
              <span>Chấm điểm ngay</span>
            </button>
          </div>
        </div>

        {/* Right Column - AI Feedback */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="text-xl mb-4">AI sẽ phản hồi:</h3>

          <div className="space-y-3">
            {[
              {
                title: 'Task Response',
                description: 'Đánh giá mức độ trả lời yêu cầu đề bài',
              },
              {
                title: 'Coherence & Cohesion',
                description: 'Kiểm tra tính liên kết và logic, sử dụng từ nối',
              },
              {
                title: 'Vocabulary',
                description: 'Đánh giá từ vựng và cách sử dụng',
              },
              {
                title: 'Grammar',
                description: 'Phân tích ngữ pháp và cấu trúc câu',
              },
            ].map((criterion, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
              >
                <div className="w-8 h-8 flex-shrink-0 bg-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="size-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{criterion.title}</h4>
                  <p className="text-sm text-gray-600">{criterion.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Example Score Display */}
          <div className="mt-6 p-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl text-white">
            <div className="text-center">
              <p className="text-sm opacity-90 mb-2">Điểm dự kiến</p>
              <div className="text-5xl mb-2">--</div>
              <p className="text-xs opacity-75">Gửi bài để nhận điểm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}