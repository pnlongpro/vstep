import { useState, useRef } from 'react';
import { Camera, Volume2, User, LogOut } from 'lucide-react';

interface ExamCheckScreenProps {
  onBack: () => void;
  onStartExam: () => void;
}

export function ExamCheckScreen({ onBack, onStartExam }: ExamCheckScreenProps) {
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const studentInfo = {
    name: 'Nguyễn Văn A',
    gender: 'Nữ',
    account: 'TS2024001',
    examId: 'VD001'
  };

  const handleFindWebcam = async () => {
    if (webcamEnabled) {
      // Turn off webcam
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setWebcamEnabled(false);
      setCapturedImage(null);
    } else {
      // Turn on webcam
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setWebcamEnabled(true);
      } catch (error) {
        alert('❌ Không thể truy cập webcam. Vui lòng kiểm tra quyền truy cập.');
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && webcamEnabled) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
      }
    }
  };

  const playAudio = async (audioNum: number) => {
    // Demo mode: just toggle visual state without actual audio
    if (audioPlaying === audioNum) {
      setAudioPlaying(null);
    } else {
      setAudioPlaying(audioNum);
      // Auto-stop after 2 seconds for demo
      setTimeout(() => {
        setAudioPlaying(null);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - Student Info & NHẬN ĐỀ Button */}
        <div className="flex items-start justify-between mb-12">
          <div className="flex items-center gap-6">
            <div className="relative">
              {/* Avatar or Webcam Preview */}
              {webcamEnabled && !capturedImage ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-32 h-32 rounded-full object-cover border-4 border-white"
                  />
                  <button
                    onClick={capturePhoto}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-full text-xs transition-colors flex items-center gap-1"
                  >
                    <Camera className="size-3" />
                    Chụp
                  </button>
                </div>
              ) : capturedImage ? (
                <div className="relative">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white"
                  />
                  <button
                    onClick={() => setCapturedImage(null)}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-full text-xs transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-white">
                  <User className="size-16 text-blue-600" />
                </div>
              )}
              {/* Hidden canvas for capturing */}
              <canvas ref={canvasRef} className="hidden" />
              
              {/* TÌM WEBCAM Button */}
              <button
                onClick={handleFindWebcam}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded text-xs transition-colors whitespace-nowrap"
              >
                TÌM WEBCAM
              </button>
            </div>
            
            <div className="space-y-1 text-sm">
              <p><strong>Họ tên:</strong> {studentInfo.name}</p>
              <p><strong>Giới tính:</strong> {studentInfo.gender}</p>
              <p><strong>Tài khoản:</strong> {studentInfo.account}</p>
              <p><strong>SBD:</strong> {studentInfo.examId}</p>
            </div>
          </div>

          {/* NHẬN ĐỀ Button */}
          <button
            onClick={onStartExam}
            className="px-8 py-3 bg-cyan-400 hover:bg-cyan-500 text-blue-900 rounded-lg transition-all text-lg shadow-lg"
          >
            NHẬN ĐỀ
          </button>
        </div>

        {/* Main Content - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Exam Structure */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl text-blue-600">1</span>
              </div>
              <h3 className="text-lg">BÀI THI BAO GỒM 4 KỸ NĂNG</h3>
            </div>
            <div className="space-y-2 text-sm text-white/90">
              <p>Listening: 3 parts - 45 phút</p>
              <p>Reading: 4 parts - 60 phút</p>
              <p>Writing: 2 parts - 60 phút</p>
              <p>Speaking: 1 parts - 12 phút</p>
            </div>
          </div>

          {/* Column 2: Audio Test */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">2</span>
              </div>
              <h3 className="text-lg">KIỂM TRA TAI NGHE</h3>
            </div>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div>
                <p className="mb-2 text-xs">- Bước 1: Đeo tai nghe và nghe một đoạn audio bên dưới</p>
                <div className="bg-black/40 rounded-lg p-3 flex items-center gap-3">
                  <button 
                    onClick={() => playAudio(1)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    {audioPlaying === 1 ? '⏸' : '▶'}
                  </button>
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                  <span className="text-xs">0:00 / 0:00</span>
                  <Volume2 className="size-4 ml-auto" />
                  <div className="w-20 h-1 bg-white/30 rounded-full"></div>
                </div>
              </div>

              {/* Step 2 */}
              <p className="text-xs">- Bước 2: Để mic sát miệng</p>

              {/* Step 3 */}
              <div>
                <p className="mb-2 text-xs">- Bước 3: Nhấn vào nút "Thu âm" để thu âm</p>
                <div className="bg-black/40 rounded-lg p-3 flex items-center gap-3">
                  <button 
                    onClick={() => playAudio(2)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    {audioPlaying === 2 ? '⏸' : '▶'}
                  </button>
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                  <span className="text-xs">0:00 / 0:00</span>
                  <Volume2 className="size-4 ml-auto" />
                  <div className="w-20 h-1 bg-white/30 rounded-full"></div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-xs transition-colors">
                    Thu âm
                  </button>
                  <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xs transition-colors">
                    Nghe lại
                  </button>
                </div>
              </div>

              {/* Step 4 */}
              <p className="text-xs">- Bước 4: Nếu không nghe được giọng nói của mình vui lòng báo với giám thị trưởng thi</p>
            </div>
          </div>

          {/* Column 3: Instructions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">3</span>
              </div>
              <h3 className="text-lg">CÁC LƯU Ý</h3>
            </div>
            
            <div className="space-y-3 text-xs text-white/90">
              <p>- Khi hết thời gian của từng kỹ năng, hệ thống sẽ tự động chuyển sang kỹ năng tiếp theo và thí sinh không thể thao tác được với kỹ năng đã làm trước đó.</p>
              <p>- Thí sinh phải click nút "LƯU BÀI" sau khi hoàn thành mỗi part.</p>
              <p>- Để chuyển part hay kỹ năng, thí sinh click vào nút "TIẾP TỤC".</p>
              <p>- Sau khi kiểm tra tai nghe và mic thành công, thí sinh chọn nút "CHỤP HÌNH" để lưu lại hình ảnh (nếu được yêu cầu).</p>
              <p>- Sau khi đã sẵn sàng, nhấn nút "NHẬN ĐỀ" để vào thi.</p>
              <p>- Khi đã sẵn sàng, nhấn nút "NHẬN ĐỀ" ở góc trên bên phải để bắt đầu làm bài thi</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors flex items-center gap-2"
          >
            <LogOut className="size-5" />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
