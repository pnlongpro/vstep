import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mic, Square, Play, Pause, Clock, Send, Loader, AlertCircle } from 'lucide-react';

interface SpeakingExerciseProps {
  task: any;
  onSubmit: (audioBlob: Blob, timeSpent: number) => void;
  onBack: () => void;
}

type RecordingState = 'idle' | 'preparing' | 'recording' | 'recorded';

export function SpeakingExercise({ task, onSubmit, onBack }: SpeakingExerciseProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [preparationTime, setPreparationTime] = useState(task.preparationTime || 0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startPreparation = () => {
    // Clear any previous error
    setMicPermissionError('');
    
    if (!task.preparationTime) {
      startRecording();
      return;
    }

    setRecordingState('preparing');
    setPreparationTime(task.preparationTime);

    timerRef.current = setInterval(() => {
      setPreparationTime((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setRecordingState('recorded');

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecordingState('recording');
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= task.speakingTime) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      // Silently handle microphone permission denial
      setMicPermissionError('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      // Ignore AbortError when play is interrupted
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Audio playback error:', error);
      }
      setIsPlaying(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;

    setIsSubmitting(true);
    await onSubmit(audioBlob, recordingTime);
  };

  const handleReset = () => {
    setRecordingState('idle');
    setRecordingTime(0);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl('');
    }
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (recordingTime / task.speakingTime) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          disabled={recordingState === 'recording' || recordingState === 'preparing'}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h2 className="text-2xl">Speaking Exercise</h2>
          <p className="text-gray-600">
            {task.level} - {task.part.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Main Content - Single Column Layout like Exam */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header Badge */}
          <div className="bg-gradient-to-r from-pink-100 to-red-100 px-6 py-3 border-b border-pink-200">
            <div className="flex items-center gap-2 text-pink-700">
              <Mic className="size-5" />
              <span className="uppercase tracking-wide">
                {task.part === 'part1' && 'PART 1 - SOCIAL INTERACTION (~ 3 mins)'}
                {task.part === 'part2' && 'PART 2 - SOLUTION DISCUSSION (~ 4 mins)'}
                {task.part === 'part3' && 'PART 3 - TOPIC DEVELOPMENT (~ 5 mins)'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Title */}
            <div>
              <h3 className="text-2xl mb-2">
                {task.part === 'part1' && 'Part 1: SOCIAL INTERACTION (~ 3 mins)'}
                {task.part === 'part2' && 'Part 2: SOLUTION DISCUSSION (~ 4 mins)'}
                {task.part === 'part3' && 'Part 3: TOPIC DEVELOPMENT (~ 5 mins)'}
              </h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Clock className="size-4" />
                <span>Trả lời: {formatTime(task.speakingTime)}</span>
              </div>
            </div>

            {/* Directions Box */}
            <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
              <p className="text-sm mb-2"><strong>Directions:</strong></p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {task.part === 'part1' && 'In this part of the test, the examiner will ask you some questions about yourself. Listen carefully and answer naturally.'}
                {task.part === 'part2' && 'In this part of the test, you will be given a situation and THREE options. You need to discuss all THREE options and choose the best one, explaining your reasons.'}
                {task.part === 'part3' && 'In this part of the test, you will develop a topic using the mind map provided. The examiner will then ask you some follow-up questions about the topic.'}
              </p>
            </div>

            {/* PART 1: Social Interaction */}
            {task.part === 'part1' && task.topics && (
              <div className="space-y-6">
                {task.topics.map((topic: any, topicIndex: number) => (
                  <div key={topicIndex} className="space-y-3">
                    <p className="text-base italic text-gray-800">{topic.title}</p>
                    <ol className="text-sm text-gray-700 space-y-2 ml-6 list-decimal">
                      {topic.questions.map((question: string, qIndex: number) => (
                        <li key={qIndex} className="leading-relaxed">{question}</li>
                      ))}
                    </ol>
                    {topicIndex < task.topics.length - 1 && (
                      <hr className="border-gray-200 my-4" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* PART 2: Solution Discussion */}
            {task.part === 'part2' && task.situation && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{task.situation}</p>
                </div>
                
                {task.options && (
                  <div>
                    <p className="text-sm mb-3"><strong>{task.note || 'There are THREE options for you to choose:'}</strong></p>
                    <ul className="text-sm text-gray-700 space-y-2 ml-6 list-disc">
                      {task.options.map((option: string, index: number) => (
                        <li key={index} className="leading-relaxed">{option}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* PART 3: Topic Development */}
            {task.part === 'part3' && task.topic && (
              <div className="space-y-5">
                <div>
                  <p className="text-sm mb-2"><strong>Topic:</strong></p>
                  <p className="text-base text-gray-800 leading-relaxed">{task.topic}</p>
                </div>

                {/* Mind Map */}
                {task.mindMap && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col items-center gap-3">
                      <div className="border-2 border-gray-400 bg-white px-4 py-2 rounded-lg text-sm">
                        {task.mindMap.nodes[0]}
                      </div>
                      <div className="w-0.5 h-6 bg-gray-400"></div>
                      <div className="flex gap-3 items-center">
                        <div className="border-2 border-gray-400 bg-white px-4 py-2 rounded-lg text-sm">
                          {task.mindMap.nodes[1]}
                        </div>
                        <div className="w-6 h-0.5 bg-gray-400"></div>
                        <div className="border-2 border-blue-600 bg-blue-50 px-6 py-3 rounded-lg text-sm">
                          <strong>{task.mindMap.center}</strong>
                        </div>
                        <div className="w-6 h-0.5 bg-gray-400"></div>
                        <div className="border-2 border-gray-400 bg-white px-4 py-2 rounded-lg text-sm">
                          {task.mindMap.nodes[2]}
                        </div>
                      </div>
                      <div className="w-0.5 h-6 bg-gray-400"></div>
                      <div className="border-2 border-gray-400 bg-white px-4 py-2 rounded-lg text-sm">
                        {task.mindMap.nodes[3]}
                      </div>
                    </div>
                  </div>
                )}

                {/* Follow-up Questions */}
                {task.questions && task.questions.length > 0 && (
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                    <p className="text-sm mb-3"><strong>Follow-up questions:</strong></p>
                    <ol className="text-sm text-gray-700 space-y-2 ml-6 list-decimal">
                      {task.questions.map((question: string, index: number) => (
                        <li key={index} className="leading-relaxed">{question}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Recording Controls - Centered */}
            <div className="pt-6 border-t border-gray-200">
              <div className="text-center">
                {recordingState === 'idle' && (
                  <>
                    {/* Mic Permission Error Alert */}
                    {micPermissionError && (
                      <div className="max-w-md mx-auto mb-6">
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="size-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="text-red-800 mb-1">Không thể truy cập microphone</h4>
                              <p className="text-sm text-red-700 mb-3">
                                Vui lòng cho phép quyền truy cập microphone trong trình duyệt để ghi âm.
                              </p>
                              <div className="text-xs text-red-600 bg-red-100 rounded p-2 mb-3">
                                <p className="mb-1"><strong>Hướng dẫn:</strong></p>
                                <ol className="list-decimal ml-4 space-y-1">
                                  <li>Nhấn vào biểu tượng khóa/thông tin bên cạnh URL</li>
                                  <li>Tìm phần "Microphone" hoặc "Quyền"</li>
                                  <li>Chọn "Cho phép" (Allow)</li>
                                  <li>Tải lại trang và thử lại</li>
                                </ol>
                              </div>
                              <button
                                onClick={() => {
                                  setMicPermissionError('');
                                  startPreparation();
                                }}
                                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Thử lại
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={startPreparation}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-xl hover:from-pink-700 hover:to-red-700 transition-all shadow-lg text-lg"
                    >
                      <Mic className="size-6" />
                      Bắt đầu ghi âm
                    </button>
                  </>
                )}

                {recordingState === 'preparing' && (
                  <>
                    <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <Clock className="size-16 text-blue-600" />
                    </div>
                    <h3 className="text-2xl mb-2">Chuẩn bị</h3>
                    <p className="text-4xl text-blue-600 mb-2">{preparationTime}s</p>
                    <p className="text-gray-600">Đọc kỹ đề và chuẩn bị câu trả lời...</p>
                  </>
                )}

                {recordingState === 'recording' && (
                  <>
                    <div className="w-32 h-32 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <Mic className="size-16 text-white" />
                    </div>
                    <h3 className="text-2xl mb-2 text-red-600">Đang ghi âm...</h3>
                    <p className="text-4xl text-red-600 mb-4">{formatTime(recordingTime)}</p>
                    <div className="max-w-md mx-auto">
                      <div className="h-3 bg-white rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-red-500 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        {task.speakingTime - recordingTime}s còn lại
                      </p>
                    </div>
                  </>
                )}

                {recordingState === 'recorded' && (
                  <>
                    <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Mic className="size-16 text-green-600" />
                    </div>
                    <h3 className="text-2xl mb-2 text-green-600">Hoàn thành!</h3>
                    <p className="text-gray-600 mb-6">
                      Thời gian: {formatTime(recordingTime)}
                    </p>

                    {/* Audio Playback */}
                    <div className="max-w-md mx-auto mb-6">
                      <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={togglePlayback}
                            className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors"
                          >
                            {isPlaying ? (
                              <Pause className="size-5" />
                            ) : (
                              <Play className="size-5 ml-0.5" />
                            )}
                          </button>
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-1">Nghe lại bài nói</p>
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div className="h-full bg-orange-500 rounded-full w-0" />
                            </div>
                          </div>
                        </div>
                      </div>
                      {audioUrl && (
                        <audio
                          ref={audioRef}
                          src={audioUrl}
                          onEnded={handleAudioEnded}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center mt-4">
                {recordingState === 'recording' && (
                  <button
                    onClick={stopRecording}
                    className="px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 text-lg"
                  >
                    <Square className="size-5" />
                    Dừng lại
                  </button>
                )}

                {recordingState === 'recorded' && (
                  <>
                    <button
                      onClick={handleReset}
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Ghi lại
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="size-5 animate-spin" />
                          Đang chấm...
                        </>
                      ) : (
                        <>
                          <Send className="size-5" />
                          Gửi chấm AI
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}