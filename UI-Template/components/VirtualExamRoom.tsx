import { useState, useRef } from 'react';
import { ArrowLeft, Camera, Volume2, User, LogOut } from 'lucide-react';

interface VirtualExamRoomProps {
  onBack: () => void;
}

export function VirtualExamRoom({ onBack }: VirtualExamRoomProps) {
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const studentInfo = {
    name: 'Phạm Ngọc Anh',
    gender: 'Nữ',
    account: 'FOBI0409180037',
    examId: 'SEP0037'
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
      {/* Hidden back button for consistency */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
      >
        <ArrowLeft className="size-5" />
      </button>

      <div className="max-w-7xl mx-auto">
        {/* Hướng dẫn các bước làm bài thi */}
        <div className="bg-white text-gray-900 rounded-2xl p-8 mb-8 mt-8 shadow-2xl">
          <h2 className="text-center text-3xl mb-8">
            HƯỚNG DẪN CÁC BƯỚC LÀM BÀI THI 3 BẬC (B1, B2, C1)
          </h2>

          {/* Bước 1 */}
          <div className="mb-8">
            <h3 className="text-xl mb-4">
              <strong>BƯỚC 1:</strong> THÍ SINH NHẬN ĐƯỢC TÀI KHOẢN VÀ MẬT KHẨU TỪ GIÁM THI
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-2 border-gray-800">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border-2 border-gray-800 px-4 py-3 text-left">STT</th>
                    <th className="border-2 border-gray-800 px-4 py-3 text-left">MÃ SỐ</th>
                    <th className="border-2 border-gray-800 px-4 py-3 text-left">HỌ</th>
                    <th className="border-2 border-gray-800 px-4 py-3 text-left">TÊN</th>
                    <th className="border-2 border-gray-800 px-4 py-3 text-left">TÊN ĐĂNG NHẬP</th>
                    <th className="border-2 border-gray-800 px-4 py-3 text-left">MẬT KHẨU</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-2 border-gray-800 px-4 py-3">1</td>
                    <td className="border-2 border-gray-800 px-4 py-3">HA0001</td>
                    <td className="border-2 border-gray-800 px-4 py-3">Nguyễn Năng</td>
                    <td className="border-2 border-gray-800 px-4 py-3">An</td>
                    <td className="border-2 border-gray-800 px-4 py-3">FOBI0709180211</td>
                    <td className="border-2 border-gray-800 px-4 py-3">721936</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bước 2 */}
          <div className="mb-8">
            <h3 className="text-xl mb-4">
              <strong>BƯỚC 2:</strong> THÍ SINH ĐIỀN TÀI KHOẢN ĐĂNG NHẬP VÀ MẬT KHẨU NHƯ HÌNH BÊN TRÊN
            </h3>
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-12 rounded-2xl w-full max-w-md">
                <div className="space-y-6">
                  <input
                    type="text"
                    placeholder="Nhập tài khoản"
                    disabled
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-white/50 text-white placeholder-white/70 outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    disabled
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-white/50 text-white placeholder-white/70 outline-none"
                  />
                  <div className="flex justify-center pt-4">
                    <button
                      disabled
                      className="px-12 py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-full transition-colors"
                    >
                      ĐĂNG NHẬP
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-red-600 text-center">
              <strong>LƯU Ý: THÍ SINH NHẬP ĐÚNG CHỮ CÁI VÀ SỐ TRONG TỜ GIẤY ĐƯỢC PHÁT</strong>
            </p>
          </div>

          {/* Bước 3 */}
          <div>
            <h3 className="text-xl mb-4">
              <strong>BƯỚC 3:</strong> THÍ SINH KIỂM TRA THÔNG TIN CỦA MÌNH VÀ ĐỌC KỸ CÁC HƯỚNG DẪN BÊN DƯỚI
            </h3>
            <p className="text-gray-700">
              Sau khi đăng nhập thành công, thí sinh sẽ thấy thông tin cá nhân và 3 phần hướng dẫn quan trọng:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 ml-4">
              <li>Bài thi bao gồm 4 kỹ năng (Listening, Reading, Writing, Speaking)</li>
              <li>Kiểm tra tai nghe (4 bước kiểm tra thiết bị)</li>
              <li>Các lưu ý quan trọng khi làm bài</li>
            </ul>
          </div>
        </div>

        {/* Header - Student Info */}
        <div className="flex items-start justify-between mb-12 mt-8">
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
                    className="w-24 h-24 rounded-full object-cover"
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
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <button
                    onClick={() => setCapturedImage(null)}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-full text-xs transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <User className="size-12 text-blue-600" />
                </div>
              )}
              {/* Hidden canvas for capturing */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="space-y-1">
              <p className="text-xl"><strong>Họ tên:</strong> {studentInfo.name}</p>
              <p className="text-lg"><strong>Giới tính:</strong> {studentInfo.gender}</p>
              <p className="text-lg"><strong>Tài khoản:</strong> {studentInfo.account}</p>
              <p className="text-lg"><strong>SBD:</strong> {studentInfo.examId}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleFindWebcam}
              className={`px-6 py-2 rounded-lg transition-all ${
                webcamEnabled 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <Camera className="size-5" />
                {webcamEnabled ? 'WEBCAM ĐÃ BẬT' : 'TÌM WEBCAM'}
              </span>
            </button>
            <button className="px-8 py-3 bg-cyan-400 hover:bg-cyan-500 text-blue-900 rounded-lg transition-all text-lg">
              NHẬN ĐỀ
            </button>
          </div>
        </div>

        {/* Main Content - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Exam Structure */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl text-blue-600">1</span>
              </div>
              <h3 className="text-xl">BÀI THI BAO GỒM 4 KỸ NĂNG</h3>
            </div>
            <div className="space-y-3 text-white/90">
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
              <h3 className="text-xl">KIỂM TRA TAI NGHE</h3>
            </div>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div>
                <p className="mb-2 text-sm">- Bước 1: Đeo tai nghe và nghe một đoạn audio bên dưới</p>
                <div className="bg-black/40 rounded-lg p-3 flex items-center gap-3">
                  <button 
                    onClick={() => playAudio(1)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    {audioPlaying === 1 ? '⏸' : '▶'}
                  </button>
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                  <span className="text-sm">0:00 / 2:50</span>
                  <Volume2 className="size-5 ml-auto" />
                  <div className="w-24 h-1 bg-white/30 rounded-full"></div>
                </div>
                {/* Audio element only for demo - no actual source needed */}
              </div>

              {/* Step 2 */}
              <p className="text-sm">- Bước 2: Để mic sát miệng</p>

              {/* Step 3 */}
              <div>
                <p className="mb-2 text-sm">- Bước 3: Nhấn vào nút &quot;Thu âm&quot; để thu âm</p>
                <div className="bg-black/40 rounded-lg p-3 flex items-center gap-3">
                  <button 
                    onClick={() => playAudio(2)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    {audioPlaying === 2 ? '⏸' : '▶'}
                  </button>
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                  <span className="text-sm">0:00 / 0:00</span>
                  <Volume2 className="size-5 ml-auto" />
                  <div className="w-24 h-1 bg-white/30 rounded-full"></div>
                </div>
                {/* Audio element only for demo - no actual source needed */}
                
                <div className="flex gap-2 mt-3">
                  <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm transition-colors">
                    Thu âm
                  </button>
                  <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
                    Nghe lại
                  </button>
                </div>
              </div>

              {/* Step 4 */}
              <p className="text-sm">- Bước 4: Nếu không nghe được giọng nói của mình vui lòng báo với giám thị trưởng thi</p>
            </div>
          </div>

          {/* Column 3: Instructions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">3</span>
              </div>
              <h3 className="text-xl">CÁC LƯU Ý</h3>
            </div>
            
            <div className="space-y-3 text-sm text-white/90">
              <p>- Khi hết thời gian của từng kỹ năng, hệ thống sẽ tự động chuyển sang kỹ năng tiếp theo. Thí sinh không thể thao tác được với kỹ năng đã làm trước đó.</p>
              <p>- Thí sinh phải click nút &quot;LƯU BÀI&quot; sau khi hoàn thành mỗi part.</p>
              <p>- Để chuyển part hay kỹ năng, thí sinh click vào nút &quot;TIẾP TỤC&quot;.</p>
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