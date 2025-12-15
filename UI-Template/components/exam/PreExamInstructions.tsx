import { useState, useRef } from 'react';
import { Camera, User, LogOut, Volume2, Play, Pause, Mic, CheckCircle } from 'lucide-react';

interface PreExamInstructionsProps {
  studentName: string;
  studentId: string;
  onStartExam: () => void;
  onBack: () => void;
}

export function PreExamInstructions({ 
  studentName, 
  studentId,
  onStartExam,
  onBack 
}: PreExamInstructionsProps) {
  const [audioPlaying1, setAudioPlaying1] = useState(false);
  const [audioPlaying2, setAudioPlaying2] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [webcamFound, setWebcamFound] = useState(false);
  const [audioTime1, setAudioTime1] = useState({ current: 0, duration: 0 });
  const [audioTime2, setAudioTime2] = useState({ current: 0, duration: 0 });
  
  const audioRef1 = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Find webcam
  const handleFindWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop the stream immediately after checking
      stream.getTracks().forEach(track => track.stop());
      setWebcamFound(true);
      alert('✅ Webcam đã được tìm thấy và hoạt động bình thường!');
    } catch (error) {
      alert('❌ Không tìm thấy webcam. Vui lòng kiểm tra kết nối webcam của bạn.');
      setWebcamFound(false);
    }
  };

  const toggleAudio1 = async () => {
    if (audioRef1.current) {
      try {
        if (audioPlaying1) {
          audioRef1.current.pause();
          setAudioPlaying1(false);
        } else {
          await audioRef1.current.play();
          setAudioPlaying1(true);
        }
      } catch (error) {
        // Ignore AbortError when play is interrupted
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Audio playback error:', error);
        }
        setAudioPlaying1(false);
      }
    }
  };

  const toggleAudio2 = async () => {
    if (audioRef2.current) {
      try {
        if (audioPlaying2) {
          audioRef2.current.pause();
          setAudioPlaying2(false);
        } else {
          await audioRef2.current.play();
          setAudioPlaying2(true);
        }
      } catch (error) {
        // Ignore AbortError when play is interrupted
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Audio playback error:', error);
        }
        setAudioPlaying2(false);
      }
    }
  };

  // Recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef2.current) {
          audioRef2.current.src = audioUrl;
        }
        setHasRecording(true);
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      alert('❌ Không thể truy cập microphone. Vui lòng cho phép quyền truy cập trong trình duyệt.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Update time for audio 1
  const handleTimeUpdate1 = () => {
    if (audioRef1.current) {
      setAudioTime1({
        current: audioRef1.current.currentTime,
        duration: audioRef1.current.duration || 0,
      });
    }
  };

  // Update time for audio 2
  const handleTimeUpdate2 = () => {
    if (audioRef2.current) {
      setAudioTime2({
        current: audioRef2.current.currentTime,
        duration: audioRef2.current.duration || 0,
      });
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white">
      {/* Header with student info */}
      <div className="bg-blue-600/50 backdrop-blur-sm border-b border-white/10 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Avatar, Info, and Button - All in one row */}
          <div className="flex items-center gap-8">
            {/* Left: Avatar + Webcam */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <User className="size-16 text-blue-600" />
              </div>
              
              {/* Webcam button under avatar */}
              <button
                onClick={handleFindWebcam}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded text-sm transition-colors shadow-lg"
              >
                TÌM WEBCAM
              </button>
            </div>
            
            {/* Middle: Student Info */}
            <div className="flex-1 space-y-2">
              <div className="text-xl">
                <span className="opacity-80">Họ tên:</span>
                <span className="ml-2">{studentName}</span>
              </div>
              <div className="text-lg">
                <span className="opacity-80">Giới tính:</span>
                <span className="ml-2">Nữ</span>
              </div>
              <div className="text-lg">
                <span className="opacity-80">Tài khoản:</span>
                <span className="ml-2">{studentId}</span>
              </div>
              <div className="text-lg">
                <span className="opacity-80">SBD:</span>
                <span className="ml-2">SEP0037</span>
              </div>
            </div>

            {/* Right: Nhận đề button */}
            <div className="flex items-center">
              <button
                onClick={onStartExam}
                className="px-12 py-4 bg-cyan-400 hover:bg-cyan-500 text-blue-900 rounded-full text-lg transition-colors shadow-lg"
              >
                NHẬN ĐỀ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. BÀI THI BAO GỒM 4 KỸ NĂNG */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center text-xl">
                1
              </div>
              <h2 className="text-xl uppercase">Bài thi bao gồm 4 kỹ năng</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white">Listening: 3 parts - 45 phút</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white">Reading: 4 parts - 60 phút</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white">Writing: 2 parts - 60 phút</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white">Speaking: 1 parts - 12 phút</div>
              </div>
            </div>
          </div>

          {/* 2. KIỂM TRA TAI NGHE */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl">
                2
              </div>
              <h2 className="text-xl uppercase">Kiểm tra tai nghe</h2>
            </div>

            <div className="space-y-4">
              {/* Bước 1 */}
              <div>
                <div className="text-sm opacity-90 mb-2">
                  - Bước 1: Đeo tai nghe và nghe một đoạn audio bên dưới
                </div>
                <div className="bg-blue-800/50 rounded-lg p-4 flex items-center gap-3">
                  <button
                    onClick={toggleAudio1}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors"
                  >
                    {audioPlaying1 ? (
                      <Pause className="size-5 text-blue-600" />
                    ) : (
                      <Play className="size-5 text-blue-600 ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="text-xs mb-1">{formatTime(audioTime1.current)} / {formatTime(audioTime1.duration)}</div>
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-200" 
                        style={{ width: `${audioTime1.duration > 0 ? (audioTime1.current / audioTime1.duration) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <Volume2 className="size-5 opacity-70" />
                  <audio ref={audioRef1} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" onTimeUpdate={handleTimeUpdate1} />
                </div>
              </div>

              {/* Bước 2 */}
              <div className="text-sm opacity-90">
                - Bước 2: Để mic sát miệng
              </div>

              {/* Bước 3 */}
              <div>
                <div className="text-sm opacity-90 mb-2">
                  - Bước 3: Nhấn vào nút "Thu âm" để thu âm
                </div>
                <div className="bg-blue-800/50 rounded-lg p-4 flex items-center gap-3">
                  <button
                    onClick={toggleAudio2}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors"
                  >
                    {audioPlaying2 ? (
                      <Pause className="size-5 text-blue-600" />
                    ) : (
                      <Play className="size-5 text-blue-600 ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="text-xs mb-1">{formatTime(audioTime2.current)} / {formatTime(audioTime2.duration)}</div>
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-200" 
                        style={{ width: `${audioTime2.duration > 0 ? (audioTime2.current / audioTime2.duration) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <Volume2 className="size-5 opacity-70" />
                  {/* Audio element for playback - src will be set dynamically */}
                  <audio ref={audioRef2} onTimeUpdate={handleTimeUpdate2} />
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleRecordClick}
                    className={`px-4 py-2 ${isRecording ? 'bg-red-500 text-white' : 'bg-cyan-400 text-blue-900'} rounded-lg text-sm hover:bg-cyan-500 transition-colors flex items-center gap-2`}
                  >
                    {isRecording ? (
                      <>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span>Dừng thu âm</span>
                      </>
                    ) : (
                      <>
                        <Mic className="size-4" />
                        <span>Thu âm</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={toggleAudio2}
                    disabled={!hasRecording}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      hasRecording
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Nghe lại
                  </button>
                  {hasRecording && (
                    <div className="flex items-center gap-1 px-2 text-green-300">
                      <CheckCircle className="size-4" />
                      <span className="text-xs">Đã ghi âm</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bước 4 */}
              <div className="text-sm opacity-90">
                - Bước 4: Nếu không nghe được giọng nói của mình vui lòng báo với giám thị trường thi
              </div>
            </div>
          </div>

          {/* 3. CÁC LƯU Ý */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xl">
                3
              </div>
              <h2 className="text-xl uppercase">Các lưu ý</h2>
            </div>

            <div className="space-y-4 text-sm">
              <div className="leading-relaxed">
                - Khi hết thời gian của từng kỹ năng, hệ thống sẽ tự động chuyển sang kỹ năng tiếp theo và thí sinh không thể thao tác được với kỹ năng đã làm trước đó.
              </div>
              
              <div className="leading-relaxed">
                - Thí sinh phải click nút <span className="text-yellow-300">"LƯU BÀI"</span> sau khi hoàn thành mỗi part.
              </div>
              
              <div className="leading-relaxed">
                - Để chuyển part hay kỹ năng, thí sinh click vào nút <span className="text-yellow-300">"TIẾP TỤC"</span>.
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="text-center mb-4 opacity-90">
                  Khi đã sẵn sàng, nhấn nút "NHẬN ĐỀ" ở góc trên bên phải để bắt đầu làm bài thi
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg transition-colors"
          >
            <LogOut className="size-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
}