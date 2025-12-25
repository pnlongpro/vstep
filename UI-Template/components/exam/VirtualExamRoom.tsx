import { useState, useRef } from 'react';
import { ArrowLeft, Camera, Volume2, User, LogOut, Play, Pause, Mic, CheckCircle, XCircle } from 'lucide-react';

interface VirtualExamRoomProps {
  onBack: () => void;
  onStartExam?: () => void;
}

export function VirtualExamRoom({ onBack, onStartExam }: VirtualExamRoomProps) {
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const studentInfo = {
    name: 'Nguyễn Văn A',
    gender: 'Nam',
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

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
    } else {
      setIsRecording(true);
      // Auto-stop after 3 seconds for demo
      setTimeout(() => {
        setIsRecording(false);
        setHasRecorded(true);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white p-8">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
      >
        <ArrowLeft className="size-5" />
      </button>

      <div className="max-w-7xl mx-auto">
        {/* PHẦN 1: HƯỚNG DẪN CÁC BƯỚC LÀM BÀI THI */}
        <div className="bg-white text-gray-900 rounded-2xl p-8 mb-8 mt-8 shadow-2xl">
          <h1 className="text-center text-4xl mb-8 text-blue-600">
            🎓 HƯỚNG DẪN CÁC BƯỚC LÀM BÀI THI VSTEP (B1, B2, C1)
          </h1>

          {/* BƯỚC 1: NHẬN TÀI KHOẢN */}
          <div className="mb-10 pb-8 border-b-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                1
              </div>
              <h2 className="text-2xl">
                <strong>BƯỚC 1:</strong> THÍ SINH NHẬN ĐƯỢC TÀI KHOẢN VÀ MẬT KHẨU TỪ GIÁM THI
              </h2>
            </div>
            <p className="mb-4 text-gray-700 ml-16">
              Giám thị sẽ phát cho mỗi thí sinh một tờ giấy có ghi thông tin tài khoản như bảng dưới đây:
            </p>
            <div className="overflow-x-auto ml-16">
              <table className="w-full border-2 border-gray-800">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border-2 border-gray-800 px-4 py-3 text-left">STT</th>
                    <th className="border-2 border-gray-800 px-4 py-3 text-left">MÃ SỐ THÍ SINH</th>
                    <th className="border-2 border-gray-800 px-4 py-3 text-left">HỌ</th>
                    <th className="border-2 border-gray-800 px-4 py-3 text-left">TÊN</th>
                    <th className="border-2 border-gray-800 px-4 py-3 text-left">TÊN ĐĂNG NHẬP</th>
                    <th className="border-2 border-gray-800 px-4 py-3 text-left">MẬT KHẨU</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border-2 border-gray-800 px-4 py-3">1</td>
                    <td className="border-2 border-gray-800 px-4 py-3 font-semibold">VD001</td>
                    <td className="border-2 border-gray-800 px-4 py-3">Nguyễn Văn</td>
                    <td className="border-2 border-gray-800 px-4 py-3">A</td>
                    <td className="border-2 border-gray-800 px-4 py-3 font-semibold text-blue-600">TS2024001</td>
                    <td className="border-2 border-gray-800 px-4 py-3 font-semibold text-blue-600">123456</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 ml-16 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-600">
                <strong>⚠️ LƯU Ý QUAN TRỌNG:</strong> Thí sinh cần ghi nhớ hoặc giữ cẩn thận tờ giấy này. Không được đánh mất!
              </p>
            </div>
          </div>

          {/* BƯỚC 2: ĐĂNG NHẬP VÀO HỆ THỐNG */}
          <div className="mb-10 pb-8 border-b-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
                2
              </div>
              <h2 className="text-2xl">
                <strong>BƯỚC 2:</strong> ĐĂNG NHẬP VÀO HỆ THỐNG THI
              </h2>
            </div>
            <p className="mb-4 text-gray-700 ml-16">
              Thí sinh truy cập vào trang thi và điền thông tin đăng nhập như sau:
            </p>
            
            {/* Màn hình mô phỏng đăng nhập */}
            <div className="flex justify-center mb-6 ml-16">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-12 rounded-2xl w-full max-w-md shadow-xl">
                <div className="text-center mb-8">
                  <h3 className="text-3xl text-white mb-2">VSTEP Online</h3>
                  <p className="text-white/80">Hệ thống thi trực tuyến</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-white/90 mb-2">Tên đăng nhập</label>
                    <input
                      type="text"
                      placeholder="Nhập tài khoản (VD: TS2024001)"
                      value="TS2024001"
                      disabled
                      className="w-full px-4 py-3 bg-white/20 border-2 border-white/30 text-white placeholder-white/60 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 mb-2">Mật khẩu</label>
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value="123456"
                      disabled
                      className="w-full px-4 py-3 bg-white/20 border-2 border-white/30 text-white placeholder-white/60 rounded-lg outline-none"
                    />
                  </div>
                  <div className="flex justify-center pt-4">
                    <button
                      disabled
                      className="px-16 py-3 bg-white text-blue-600 rounded-full transition-all hover:bg-blue-50 shadow-lg"
                    >
                      ĐĂNG NHẬP
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 ml-16 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-600">
                <strong>⚠️ LƯU Ý:</strong> THÍ SINH PHẢI NHẬP ĐÚNG CHỮ CÁI HOA/THƯỜNG VÀ SỐ TRONG TỜ GIẤY ĐƯỢC PHÁT
              </p>
            </div>
          </div>

          {/* BƯỚC 3: KIỂM TRA THÔNG TIN */}
          <div className="mb-10 pb-8 border-b-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl">
                3
              </div>
              <h2 className="text-2xl">
                <strong>BƯỚC 3:</strong> KIỂM TRA THÔNG TIN VÀ ĐỌC HƯỚNG DẪN
              </h2>
            </div>
            <p className="mb-4 text-gray-700 ml-16">
              Sau khi đăng nhập thành công, thí sinh sẽ thấy màn hình phòng thi ảo với các thông tin:
            </p>
            
            <div className="ml-16 space-y-4">
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                <h3 className="text-xl mb-3 text-blue-600">✅ Kiểm tra thông tin cá nhân:</h3>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li><strong>Họ tên:</strong> Nguyễn Văn A</li>
                  <li><strong>Giới tính:</strong> Nam</li>
                  <li><strong>Tài khoản:</strong> TS2024001</li>
                  <li><strong>Số báo danh (SBD):</strong> VD001</li>
                </ul>
                <p className="mt-3 text-red-600">
                  ⚠️ <strong>Nếu thông tin sai, báo ngay cho giám thị!</strong>
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                <h3 className="text-xl mb-3 text-blue-600">📚 Đọc kỹ 3 phần hướng dẫn:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mb-2">1</div>
                    <h4 className="text-sm mb-2">Bài thi bao gồm 4 kỹ năng</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Listening: 45 phút</li>
                      <li>• Reading: 60 phút</li>
                      <li>• Writing: 60 phút</li>
                      <li>• Speaking: 12 phút</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white mb-2">2</div>
                    <h4 className="text-sm mb-2">Kiểm tra tai nghe và mic</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Nghe đoạn audio thử</li>
                      <li>• Thu âm giọng nói</li>
                      <li>• Nghe lại kiểm tra</li>
                      <li>• Báo giám thị nếu lỗi</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-yellow-200">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white mb-2">3</div>
                    <h4 className="text-sm mb-2">Các lưu ý quan trọng</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Nhấn "LƯU BÀI" sau mỗi part</li>
                      <li>• Nhấn "TIẾP TỤC" để chuyển part</li>
                      <li>• Không quay lại kỹ năng cũ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BƯỚC 4: KIỂM TRA THIẾT BỊ */}
          <div className="mb-10 pb-8 border-b-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                4
              </div>
              <h2 className="text-2xl">
                <strong>BƯỚC 4:</strong> KIỂM TRA THIẾT BỊ (TAI NGHE, MIC, WEBCAM)
              </h2>
            </div>
            
            <div className="ml-16 space-y-6">
              {/* Kiểm tra tai nghe */}
              <div className="bg-orange-50 p-6 rounded-xl border-2 border-orange-200">
                <h3 className="text-xl mb-4 text-orange-700">
                  🎧 <strong>4.1. KIỂM TRA TAI NGHE (4 BƯỚC)</strong>
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="mb-3"><strong>Bước 1:</strong> Đeo tai nghe và nghe đoạn audio bên dưới</p>
                    <div className="bg-gray-900 rounded-lg p-4 flex items-center gap-3">
                      <button 
                        onClick={() => playAudio(1)}
                        className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                      >
                        {audioPlaying === 1 ? <Pause className="size-5" /> : <Play className="size-5" />}
                      </button>
                      <div className="flex-1 flex items-center gap-3">
                        <div className={`w-full h-2 rounded-full overflow-hidden ${audioPlaying === 1 ? 'bg-blue-300' : 'bg-gray-700'}`}>
                          <div className={`h-full bg-blue-600 transition-all ${audioPlaying === 1 ? 'w-1/2' : 'w-0'}`}></div>
                        </div>
                        <span className="text-white text-sm">0:00 / 2:50</span>
                      </div>
                      <Volume2 className="size-6 text-white" />
                      <input type="range" min="0" max="100" defaultValue="70" className="w-24" />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      💡 Nếu nghe thấy giọng nói rõ ràng → Tai nghe hoạt động tốt
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="mb-2"><strong>Bước 2:</strong> Đặt mic sát miệng (khoảng 2-3cm)</p>
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-blue-300">
                          <Mic className="size-16 text-blue-600" />
                        </div>
                        <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                          <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg text-xs whitespace-nowrap">
                            2-3cm từ miệng
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="mb-3"><strong>Bước 3:</strong> Nhấn nút "THU ÂM" để ghi âm giọng nói của bạn</p>
                    <div className="space-y-3">
                      <div className="bg-gray-900 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`}></div>
                          <span className="text-white">{isRecording ? 'Đang thu âm...' : hasRecorded ? 'Đã thu âm xong' : 'Sẵn sàng thu âm'}</span>
                        </div>
                        {isRecording && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-12 bg-gray-800 rounded flex items-center justify-center gap-1">
                              {[...Array(20)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className="w-1 bg-green-500 rounded-full animate-pulse"
                                  style={{ 
                                    height: `${Math.random() * 40 + 10}px`,
                                    animationDelay: `${i * 0.05}s`
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={handleRecord}
                          className={`px-6 py-3 rounded-lg text-white transition-all ${
                            isRecording 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-cyan-500 hover:bg-cyan-600'
                          }`}
                        >
                          {isRecording ? '⏹ Dừng thu âm' : '🎤 Thu âm'}
                        </button>
                        {hasRecorded && (
                          <button 
                            onClick={() => playAudio(2)}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            {audioPlaying === 2 ? '⏸ Đang nghe' : '🔊 Nghe lại'}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">
                      💡 Gợi ý: Hãy nói "Xin chào, tôi là thí sinh {studentInfo.name}, số báo danh {studentInfo.examId}"
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="mb-2"><strong>Bước 4:</strong> Kiểm tra kết quả</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="size-5" />
                        <span>✅ Nếu nghe được giọng nói của mình rõ ràng → Thiết bị hoạt động tốt → Tiếp tục</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="size-5" />
                        <span>❌ Nếu KHÔNG nghe được hoặc tiếng nhỏ → Báo ngay cho giám thị trưởng</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kiểm tra webcam */}
              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="text-xl mb-4 text-blue-700">
                  📷 <strong>4.2. CHỤP ẢNH XÁC THỰC (NẾU CẦN)</strong>
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <strong>Bước 1:</strong> Nhấn nút <span className="text-red-600 font-semibold">"TÌM WEBCAM"</span> để bật camera
                  </p>
                  <p className="text-gray-700">
                    <strong>Bước 2:</strong> Ngồi thẳng, nhìn vào camera, đảm bảo khuôn mặt rõ ràng
                  </p>
                  <p className="text-gray-700">
                    <strong>Bước 3:</strong> Nhấn nút <span className="text-blue-600 font-semibold">"CHỤP"</span> để chụp ảnh xác thực
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    💡 Ảnh này được sử dụng để xác thực danh tính thí sinh trong quá trình thi
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BƯỚC 5: NHẬN ĐỀ */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white text-xl">
                5
              </div>
              <h2 className="text-2xl">
                <strong>BƯỚC 5:</strong> NHẬN ĐỀ VÀ BẮT ĐẦU THI
              </h2>
            </div>
            <div className="ml-16 space-y-4">
              <p className="text-gray-700">
                Sau khi hoàn tất tất cả các bước kiểm tra ở trên, thí sinh nhấn nút <span className="text-cyan-600 font-semibold text-lg">"NHẬN ĐỀ"</span> để bắt đầu làm bài thi.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-yellow-700">
                  ⏰ <strong>Lưu ý:</strong> Sau khi nhận đề, đồng hồ đếm ngược sẽ bắt đầu chạy ngay lập tức. Thí sinh cần làm bài một cách tập trung và quản lý thời gian hợp lý.
                </p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-600">
                  ⚠️ <strong>Quan trọng:</strong> Sau khi bắt đầu, thí sinh KHÔNG THỂ thoát ra hoặc quay lại kiểm tra thiết bị. Hãy chắc chắn mọi thứ đã sẵn sàng trước khi nhấn "NHẬN ĐỀ"!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PHẦN 2: MÔ PHỎNG PHÒNG THI ẢO */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 className="text-center text-3xl mb-8">
            💻 MÔ PHỎNG PHÒNG THI ẢO
          </h2>

          {/* Header - Student Info */}
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
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <button
                      onClick={capturePhoto}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-sm transition-colors flex items-center gap-2 shadow-lg"
                    >
                      <Camera className="size-4" />
                      Chụp
                    </button>
                  </div>
                ) : capturedImage ? (
                  <div className="relative">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full text-sm transition-colors shadow-lg"
                    >
                      Xóa
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-200">
                    <User className="size-16 text-blue-600" />
                  </div>
                )}
                {/* Hidden canvas for capturing */}
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="space-y-2 bg-white/20 backdrop-blur-sm p-6 rounded-xl">
                <p className="text-xl"><strong>Họ tên:</strong> {studentInfo.name}</p>
                <p className="text-lg"><strong>Giới tính:</strong> {studentInfo.gender}</p>
                <p className="text-lg"><strong>Tài khoản:</strong> {studentInfo.account}</p>
                <p className="text-lg"><strong>SBD:</strong> {studentInfo.examId}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleFindWebcam}
                className={`px-6 py-3 rounded-lg transition-all shadow-lg text-lg ${
                  webcamEnabled 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Camera className="size-6" />
                  {webcamEnabled ? '✅ WEBCAM ĐÃ BẬT' : '📷 TÌM WEBCAM'}
                </span>
              </button>
              <button 
                className="px-8 py-4 bg-cyan-400 hover:bg-cyan-500 text-blue-900 rounded-lg transition-all text-xl shadow-lg" 
                onClick={onStartExam}
              >
                📝 NHẬN ĐỀ
              </button>
            </div>
          </div>

          {/* Main Content - 3 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Exam Structure */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white">1</span>
                </div>
                <h3 className="text-xl">BÀI THI BAO GỒM 4 KỸ NĂNG</h3>
              </div>
              <div className="space-y-3 text-white/90">
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-lg">🎧 <strong>Listening:</strong> 3 parts - 45 phút</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-lg">📖 <strong>Reading:</strong> 4 parts - 60 phút</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-lg">✍️ <strong>Writing:</strong> 2 tasks - 60 phút</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-lg">🎤 <strong>Speaking:</strong> 3 parts - 12 phút</p>
                </div>
              </div>
            </div>

            {/* Column 2: Audio Test */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white">2</span>
                </div>
                <h3 className="text-xl">KIỂM TRA TAI NGHE</h3>
              </div>
              
              <div className="space-y-4 text-sm">
                <p>✓ Đeo tai nghe và nghe audio</p>
                <p>✓ Đặt mic sát miệng</p>
                <p>✓ Thu âm và nghe lại</p>
                <p>✓ Báo giám thị nếu có lỗi</p>
              </div>
            </div>

            {/* Column 3: Instructions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white">3</span>
                </div>
                <h3 className="text-xl">CÁC LƯU Ý</h3>
              </div>
              
              <div className="space-y-3 text-sm text-white/90">
                <p>⚠️ Hết giờ tự động chuyển kỹ năng</p>
                <p>⚠️ Không quay lại kỹ năng cũ</p>
                <p>⚠️ Nhấn "LƯU BÀI" sau mỗi part</p>
                <p>⚠️ Nhấn "TIẾP TỤC" để chuyển part</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={onBack}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut className="size-5" />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* PHẦN 3: HƯỚNG DẪN CHI TIẾT 4 KỸ NĂNG */}
        <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-center text-4xl mb-8 text-blue-600">
            📖 HƯỚNG DẪN CHI TIẾT CÁCH LÀM BÀI 4 KỸ NĂNG
          </h2>

          {/* Listening */}
          <div className="mb-10 pb-8 border-b-2 border-gray-300">
            <h3 className="text-3xl mb-6 text-blue-600 flex items-center gap-3">
              <span className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">🎧</span>
              <strong>1. KỸ NĂNG LISTENING (NGHE HIỂU)</strong>
            </h3>
            
            <div className="space-y-6 ml-16">
              <div className="bg-orange-50 p-6 rounded-xl border-l-4 border-orange-500">
                <p className="text-2xl mb-3">
                  <strong>⏱️ Thời gian:</strong> <span className="text-red-600">45 phút</span> cho cả 3 parts
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="px-8 py-4 bg-orange-500 text-white rounded-lg inline-block shadow-lg">
                    <span className="text-4xl tabular-nums">4 5 : 0 0</span>
                  </div>
                  <span className="text-gray-600 text-lg">(Đồng hồ đếm ngược)</span>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="text-xl mb-4"><strong>🔊 Cách nghe audio:</strong></h4>
                <ul className="list-disc ml-6 space-y-3 text-gray-700">
                  <li className="text-lg">Click vào nút <span className="text-blue-600 font-semibold">▶ TAM GIÁC</span> màu tím để bắt đầu nghe</li>
                  <li className="text-lg text-red-600"><strong>⚠️ CHỈ ĐƯỢC NGHE 1 LẦN DUY NHẤT</strong></li>
                  <li className="text-lg text-red-600"><strong>⚠️ KHÔNG THỂ NGHE LẠI</strong></li>
                  <li className="text-lg">Chọn đáp án A, B, C hoặc D sau khi nghe xong</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-xl">
                <h4 className="text-xl mb-4"><strong>💾 Lưu bài:</strong></h4>
                <div className="space-y-3">
                  <p className="text-lg text-gray-700">
                    Sau khi hoàn thành mỗi part, click nút 
                    <span className="mx-2 inline-block px-4 py-2 bg-red-500 text-white rounded shadow">LƯU BÀI</span>
                  </p>
                  <p className="text-lg text-gray-700">
                    Sau đó click nút 
                    <span className="mx-2 inline-block px-4 py-2 bg-cyan-500 text-white rounded shadow">TIẾP TỤC</span>
                    để chuyển sang part tiếp theo
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-xl mb-4"><strong>📝 Cấu trúc:</strong></h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-200 text-center">
                    <div className="text-3xl text-blue-600 mb-2">Part 1</div>
                    <div className="text-xl">8 câu hỏi</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-200 text-center">
                    <div className="text-3xl text-blue-600 mb-2">Part 2</div>
                    <div className="text-xl">10 câu hỏi</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-200 text-center">
                    <div className="text-3xl text-blue-600 mb-2">Part 3</div>
                    <div className="text-xl">12 câu hỏi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reading */}
          <div className="mb-10 pb-8 border-b-2 border-gray-300">
            <h3 className="text-3xl mb-6 text-blue-600 flex items-center gap-3">
              <span className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">📖</span>
              <strong>2. KỸ NĂNG READING (ĐỌC HIỂU)</strong>
            </h3>
            
            <div className="space-y-6 ml-16">
              <div className="bg-orange-50 p-6 rounded-xl border-l-4 border-orange-500">
                <p className="text-2xl mb-3">
                  <strong>⏱️ Thời gian:</strong> <span className="text-red-600">60 phút</span> cho cả 4 parts
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="text-xl mb-4"><strong>📖 Cách làm bài:</strong></h4>
                <ul className="list-disc ml-6 space-y-3 text-gray-700">
                  <li className="text-lg">Đọc đoạn văn/bài đọc và chọn đáp án A, B, C hoặc D</li>
                  <li className="text-lg">Có thể cuộn lên xuống để đọc toàn bộ nội dung</li>
                  <li className="text-lg">Có thể chọn lại đáp án trước khi nhấn "LƯU BÀI"</li>
                  <li className="text-lg">Đọc kỹ câu hỏi trước khi đọc bài để tiết kiệm thời gian</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-xl mb-4"><strong>📝 Cấu trúc:</strong></h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-200 text-center">
                    <div className="text-3xl text-blue-600 mb-2">Part 1</div>
                    <div className="text-xl">10 câu</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-200 text-center">
                    <div className="text-3xl text-blue-600 mb-2">Part 2</div>
                    <div className="text-xl">10 câu</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-200 text-center">
                    <div className="text-3xl text-blue-600 mb-2">Part 3</div>
                    <div className="text-xl">10 câu</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-200 text-center">
                    <div className="text-3xl text-blue-600 mb-2">Part 4</div>
                    <div className="text-xl">10 câu</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Writing */}
          <div className="mb-10 pb-8 border-b-2 border-gray-300">
            <h3 className="text-3xl mb-6 text-blue-600 flex items-center gap-3">
              <span className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">✍️</span>
              <strong>3. KỸ NĂNG WRITING (VIẾT)</strong>
            </h3>
            
            <div className="space-y-6 ml-16">
              <div className="bg-orange-50 p-6 rounded-xl border-l-4 border-orange-500">
                <p className="text-2xl mb-3">
                  <strong>⏱️ Thời gian:</strong> <span className="text-red-600">60 phút</span> cho cả 2 tasks
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="text-xl mb-4"><strong>✍️ Cách làm bài:</strong></h4>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-xl mb-2"><strong>Task 1: Viết Email</strong></p>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700">
                      <li className="text-lg">Yêu cầu: <strong className="text-red-600">Tối thiểu 120 từ</strong></li>
                      <li className="text-lg">Thời gian khuyến nghị: 20 phút</li>
                      <li className="text-lg">Nội dung: Viết email phản hồi theo tình huống cho sẵn</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                    <p className="text-xl mb-2"><strong>Task 2: Viết Bài luận</strong></p>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700">
                      <li className="text-lg">Yêu cầu: <strong className="text-red-600">Tối thiểu 250 từ</strong></li>
                      <li className="text-lg">Thời gian khuyến nghị: 40 phút</li>
                      <li className="text-lg">Nội dung: Viết bài luận theo chủ đề cho sẵn</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-500">
                <p className="text-xl text-red-600">
                  <strong>⚠️ LƯU Ý QUAN TRỌNG:</strong> Nếu không đủ số từ tối thiểu, bài viết sẽ bị trừ điểm nghiêm trọng!
                </p>
              </div>
            </div>
          </div>

          {/* Speaking */}
          <div className="mb-8">
            <h3 className="text-3xl mb-6 text-blue-600 flex items-center gap-3">
              <span className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">🎤</span>
              <strong>4. KỸ NĂNG SPEAKING (NÓI)</strong>
            </h3>
            
            <div className="space-y-6 ml-16">
              <div className="bg-orange-50 p-6 rounded-xl border-l-4 border-orange-500">
                <p className="text-2xl mb-3">
                  <strong>⏱️ Thời gian:</strong> <span className="text-red-600">12 phút</span> cho cả 3 parts
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="text-xl mb-4"><strong>🎤 Cách làm bài:</strong></h4>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                    <p className="text-xl mb-2"><strong>Part 1: Tự giới thiệu (3 phút)</strong></p>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700">
                      <li className="text-lg">5 câu hỏi về bản thân</li>
                      <li className="text-lg">Trả lời ngắn gọn, rõ ràng</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-xl mb-2"><strong>Part 2: Trình bày theo topic (4 phút)</strong></p>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700">
                      <li className="text-lg">1 phút chuẩn bị (có giấy nháp)</li>
                      <li className="text-lg">2 phút trình bày</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                    <p className="text-xl mb-2"><strong>Part 3: Thảo luận chuyên sâu (5 phút)</strong></p>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700">
                      <li className="text-lg">3 câu hỏi liên quan đến topic Part 2</li>
                      <li className="text-lg">Trả lời chi tiết, có lập luận</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl">
                <h4 className="text-xl mb-4"><strong>🎙️ Thu âm:</strong></h4>
                <div className="space-y-3">
                  <p className="text-lg">Click nút 
                    <span className="mx-2 inline-block px-4 py-2 bg-cyan-500 text-white rounded shadow">🎤 THU ÂM</span>
                    để bắt đầu ghi âm
                  </p>
                  <p className="text-lg">Khi hết thời gian, hệ thống tự động dừng</p>
                  <p className="text-lg">Có thể click 
                    <span className="mx-2 inline-block px-4 py-2 bg-blue-600 text-white rounded shadow">🔊 NGHE LẠI</span>
                    để kiểm tra
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* General Important Notes */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-4 border-yellow-400 rounded-2xl p-8 mt-10">
            <h3 className="text-3xl mb-6 text-yellow-700 flex items-center gap-3">
              <span className="text-4xl">⚠️</span>
              <strong>CÁC LƯU Ý CỰC KỲ QUAN TRỌNG KHI THI</strong>
            </h3>
            <ul className="space-y-4 text-lg text-gray-800">
              <li className="flex items-start gap-3">
                <span className="text-2xl">🔴</span>
                <span>Khi hết thời gian của từng kỹ năng, hệ thống sẽ <strong className="text-red-600">TỰ ĐỘNG CHUYỂN</strong> sang kỹ năng tiếp theo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🔴</span>
                <span>Thí sinh <strong className="text-red-600">KHÔNG THỂ QUAY LẠI</strong> kỹ năng đã làm trước đó</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🔴</span>
                <span>Phải nhấn nút <strong className="text-red-600">"LƯU BÀI"</strong> sau mỗi part, nếu không bài làm sẽ <strong className="text-red-600">KHÔNG ĐƯỢC LƯU</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🔴</span>
                <span>Thời gian đếm ngược <strong className="text-red-600">LIÊN TỤC</strong>, không dừng khi chuyển part trong cùng 1 kỹ năng</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🔴</span>
                <span>Nếu gặp sự cố kỹ thuật (mất kết nối, lỗi thiết bị), <strong className="text-red-600">BÁO NGAY</strong> cho giám thị, không tự ý xử lý</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🔴</span>
                <span>KHÔNG được sử dụng từ điển, tài liệu, điện thoại hoặc bất kỳ thiết bị hỗ trợ nào khác trong quá trình thi</span>
              </li>
            </ul>
          </div>

          {/* Success Tips */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-4 border-green-400 rounded-2xl p-8 mt-6">
            <h3 className="text-3xl mb-6 text-green-700 flex items-center gap-3">
              <span className="text-4xl">💡</span>
              <strong>MẸO ĐỂ ĐẠT ĐIỂM CAO</strong>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl">
                <h4 className="text-xl mb-3 text-blue-600">⏰ Quản lý thời gian</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Phân bổ thời gian hợp lý cho mỗi part</li>
                  <li>✓ Không dành quá nhiều thời gian cho 1 câu</li>
                  <li>✓ Để lại 5-10 phút cuối kiểm tra lại</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <h4 className="text-xl mb-3 text-purple-600">📝 Kỹ thuật làm bài</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Đọc kỹ yêu cầu đề bài</li>
                  <li>✓ Gạch chân từ khóa quan trọng</li>
                  <li>✓ Kiểm tra lại trước khi lưu bài</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <h4 className="text-xl mb-3 text-orange-600">🎯 Tâm lý ổn định</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Giữ bình tĩnh, không hoảng loạn</li>
                  <li>✓ Tập trung vào bài làm của mình</li>
                  <li>✓ Tự tin vào kiến thức đã học</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <h4 className="text-xl mb-3 text-red-600">🔧 Chuẩn bị kỹ thuật</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Kiểm tra thiết bị kỹ càng trước thi</li>
                  <li>✓ Đảm bảo kết nối internet ổn định</li>
                  <li>✓ Pin laptop/máy tính đầy đủ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer với nút quay lại */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onBack}
            className="px-12 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all text-xl shadow-lg flex items-center gap-3"
          >
            <ArrowLeft className="size-6" />
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
