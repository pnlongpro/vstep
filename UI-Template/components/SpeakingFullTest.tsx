import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Clock, PlayCircle, StopCircle, Maximize, Minimize } from 'lucide-react';
import { SpeakingResult } from './speaking/SpeakingResult';
import { speakingPartsConfig } from '../data/partsConfig';

interface SpeakingFullTestProps {
  onBack: () => void;
  level: 'B1' | 'B2' | 'C1';
}

export function SpeakingFullTest({ onBack, level }: SpeakingFullTestProps) {
  const [currentPart, setCurrentPart] = useState<1 | 2 | 3>(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState<{1: boolean, 2: boolean, 3: boolean}>({1: false, 2: false, 3: false});
  const [completedParts, setCompletedParts] = useState<Set<number>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState<string>('');

  // Generate exam ID (format: S-B1-241214-001)
  const [examId] = useState(() => {
    const skillCode = 'S';
    const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, '').slice(0, 6); // YYMMDD
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const id = `${skillCode}-${level}-${dateCode}-${randomNum}`;
    console.log('🆔 Speaking Exam ID:', id);
    return id;
  });

  const parts = speakingPartsConfig.map((part, index) => ({
    ...part,
    responseTime: part.timeLimit * 60,
    topics: index === 0 
      ? [
          {
            title: "Let's talk about rooms in your house",
            questions: [
              'Which room in your house do you like best?',
              'What do you usually do in that room?',
              'Would you like to change anything in your room?',
            ],
          },
          {
            title: "Now, let's talk about your home environment",
            questions: [
              'Do you prefer living in a house or an apartment? Why?',
              'What makes a home comfortable for you?',
              'How important is natural light in your home?',
            ],
          },
        ]
      : undefined,
    situation: index === 1
      ? 'You are planning to redecorate your living room to make it more comfortable and functional. You have a limited budget and need to decide what to focus on. What will you suggest?'
      : undefined,
    options: index === 1
      ? [
          'Buy new furniture such as a sofa, coffee table, and shelves.',
          'Repaint the walls and change the curtains and decorations.',
          'Install better lighting and add some indoor plants.',
        ]
      : undefined,
    note: index === 1 ? 'There are THREE options for you to choose:' : undefined,
    topic: index === 2
      ? 'What are the benefits of learning a foreign language?'
      : undefined,
    mindMap: index === 2
      ? {
          center: 'Benefits of learning a foreign language',
          nodes: [
            'Career opportunities',
            'Cultural understanding',
            'Personal development',
            'Travel experiences',
          ],
        }
      : undefined,
    followUpQuestions: index === 2
      ? [
          'At what age do you think children should start learning a foreign language?',
          'Do you think everyone should learn English? Why or why not?',
          'How has technology changed the way people learn foreign languages?',
        ]
      : undefined,
  }));

  const currentPartData = parts[currentPart - 1];
  const maxRecordTime = currentPartData.responseTime;

  // Recording timer
  useEffect(() => {
    if (isRecording && recordTime < maxRecordTime) {
      const timer = setTimeout(() => setRecordTime(recordTime + 1), 1000);
      return () => clearTimeout(timer);
    } else if (isRecording && recordTime >= maxRecordTime) {
      // Auto move to next part when time is up
      setHasRecorded({...hasRecorded, [currentPart]: true});
      setCompletedParts(new Set([...completedParts, currentPart]));
      
      if (currentPart < 3) {
        // Move to next part automatically
        setCurrentPart((currentPart + 1) as 1 | 2 | 3);
        setRecordTime(0);
      } else {
        // All 3 parts completed, stop recording
        setIsRecording(false);
      }
    }
  }, [isRecording, recordTime, maxRecordTime]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordTime(0);
    // Only reset to Part 1 if no parts have been completed yet (first time recording)
    if (completedParts.size === 0 && !hasRecorded[1] && !hasRecorded[2] && !hasRecorded[3]) {
      setCurrentPart(1);
    }
    // TODO: Start actual recording
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecorded({...hasRecorded, [currentPart]: true});
    setCompletedParts(new Set([...completedParts, currentPart]));
    // TODO: Stop actual recording
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const submitTest = () => {
    if (!hasRecorded[1] || !hasRecorded[2] || !hasRecorded[3]) {
      alert('Vui lòng hoàn thành cả 3 phần!');
      return;
    }
    
    // Create mock result data
    const mockTask = {
      id: 999,
      title: `Speaking Full Test - ${level}`,
      description: 'Bộ đề thi đầy đủ 3 Parts',
      level: level,
      part: 'full-test',
      speakingTime: 600, // 10 minutes
    };

    const resultData = {
      recordingUrl: 'mock-recording-url',
      duration: 720, // 12 minutes
      task: mockTask,
      audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav', // Mock combined audio
      timeSpent: 600,
      scores: {
        fluency: 7.5,
        pronunciation: 7.0,
        vocabulary: 7.5,
        grammar: 7.0,
        overall: 7.25,
      },
      transcript: 'This is a mock transcript of your full speaking test covering all 3 parts...',
      feedback: {
        strengths: [
          'Part 1: Bạn đã trả lời tốt về bản thân và môi trường làm việc',
          'Part 2: Mô tả sự kiện đáng nhớ rất sinh động và chi tiết',
          'Part 3: Thảo luận về vai trò của giáo dục và công nghệ một cách rõ ràng',
        ],
        improvements: [
          'Cần cải thiện phát âm một số từ phức tạp',
          'Tăng cường sử dụng từ vựng học thuật trong Part 3',
          'Giảm số lần dùng các từ lặp lại như "uh", "um"',
        ],
        wordsPerMinute: 145,
      },
      sampleAnswer: 'This is a sample answer for reference...',
      // Individual part audios for Full Test
      partAudios: [
        {
          title: 'Social Interaction',
          audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav',
          duration: '3 phút',
          timeSpent: 180,
        },
        {
          title: 'Solution Discussion',
          audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav',
          duration: '3 phút',
          timeSpent: 180,
        },
        {
          title: 'Topic Development',
          audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav',
          duration: '4 phút',
          timeSpent: 240,
        },
      ],
    };

    setResult(resultData);
    setShowResult(true);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setHasRecorded({1: false, 2: false, 3: false});
    setCompletedParts(new Set());
    setCurrentPart(1);
  };

  // Fullscreen functionality
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // If showing result
  if (showResult && result) {
    return (
      <SpeakingResult
        result={result}
        onTryAgain={handleTryAgain}
        onBackToList={onBack}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl">Speaking Full Test - {level}</h1>
                  <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs rounded-full font-mono">
                    ID: {examId}
                  </span>
                </div>
                <p className="text-sm text-gray-600">3 phần · 12-15 phút</p>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                {[1, 2, 3].map((partNum) => (
                  <div key={partNum} className="flex items-center gap-1">
                    <span className={hasRecorded[partNum as 1 | 2 | 3] ? 'text-green-600' : 'text-gray-400'}>
                      Part {partNum}
                    </span>
                    {hasRecorded[partNum as 1 | 2 | 3] && (
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                    {partNum < 3 && <span className="text-gray-300 mx-1">|</span>}
                  </div>
                ))}
              </div>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={isFullscreen ? 'Thoát chế độ toàn màn hình' : 'Chế độ toàn màn hình'}
              >
                {isFullscreen ? (
                  <Minimize className="size-5 text-gray-700" />
                ) : (
                  <Maximize className="size-5 text-gray-700" />
                )}
              </button>
              <button
                onClick={submitTest}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Part Navigation Tabs */}
      <div className="bg-white border-b sticky top-[73px] z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto">
            {parts.map((part) => {
              const partCompleted = hasRecorded[part.id as 1 | 2 | 3];
              
              return (
                <button
                  key={part.id}
                  onClick={() => setCurrentPart(part.id as 1 | 2 | 3)}
                  className={`px-6 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                    currentPart === part.id
                      ? 'border-rose-600 text-rose-600 bg-rose-50'
                      : 'border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{part.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      partCompleted
                        ? 'bg-green-100 text-green-700'
                        : currentPart === part.id 
                        ? 'bg-rose-100 text-rose-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {partCompleted ? '✓ Đã ghi' : 'Chưa ghi'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          {/* Part Info */}
          <div className="mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 ${currentPartData.bgColor} rounded-lg mb-3`}>
              <Mic className={`size-5 ${currentPartData.textColor}`} />
              <span className={`${currentPartData.textColor}`}>
                {currentPartData.label} - {currentPartData.title}
              </span>
            </div>
            <h2 className="text-2xl mb-2">
              Part {currentPart}: {currentPartData.title}
            </h2>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span>🎙 Trả lời: {formatTime(currentPartData.responseTime)}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
            <p className="text-sm text-purple-900 mb-2">
              <strong>Directions:</strong>
            </p>
            {currentPart === 1 && (
              <p className="text-sm text-purple-800">
                In this part of the test, the examiner will ask you some questions about yourself. 
                Listen carefully and answer naturally.
              </p>
            )}
            {currentPart === 2 && (
              <div className="text-sm text-purple-800 space-y-2">
                <p>
                  In this part of the test, you will be given a situation and THREE options. 
                  You need to discuss all THREE options and choose the best one, explaining your reasons.
                </p>
                <p>
                  You will have up to 4 minutes to speak. You should talk about all the options, 
                  discuss the advantages and disadvantages of each, and then give your final choice with reasons.
                </p>
              </div>
            )}
            {currentPart === 3 && (
              <div className="text-sm text-purple-800 space-y-2">
                <p>
                  In this part of the test, you will have to speak on a topic for up to 5 minutes. 
                  The examiner will give you a mind map to help you develop your ideas.
                </p>
                <p>
                  You should talk about the topic using the ideas in the mind map as prompts. 
                  You can also add your own ideas if you wish. After you finish speaking, 
                  the examiner will ask you some follow-up questions related to the topic.
                </p>
              </div>
            )}
          </div>

          {/* Questions/Topic */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            {/* PART 1: Social Interaction */}
            {currentPart === 1 && 'topics' in currentPartData && (
              <div className="space-y-6">
                {currentPartData.topics.map((topic: any, topicIndex: number) => (
                  <div key={topicIndex} className={topicIndex > 0 ? 'border-t-2 border-gray-200 pt-6' : ''}>
                    <p className="mb-3 italic text-gray-700">{topic.title}</p>
                    <ol className="space-y-2 ml-6 list-decimal">
                      {topic.questions.map((question: string, qIndex: number) => (
                        <li key={qIndex} className="text-sm text-gray-700 leading-relaxed">
                          {question}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            )}

            {/* PART 2: Solution Discussion */}
            {currentPart === 2 && 'situation' in currentPartData && (
              <div>
                <p className="mb-2">
                  <strong>Situation:</strong> {currentPartData.situation}
                </p>
                
                {currentPartData.note && (
                  <p className="mt-4 mb-3 text-gray-700">{currentPartData.note}</p>
                )}
                
                <ul className="space-y-2 ml-6">
                  {currentPartData.options?.map((option: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 leading-relaxed">
                      - {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* PART 3: Topic Development */}
            {currentPart === 3 && 'topic' in currentPartData && 'mindMap' in currentPartData && (
              <div>
                <p className="mb-6">
                  <strong>Topic:</strong> {currentPartData.topic}
                </p>

                {/* Mind Map Visual */}
                {currentPartData.mindMap && (
                  <div className="mb-6 p-6 border-2 border-gray-300 rounded-lg bg-white">
                    <div className="flex flex-col items-center gap-4">
                      {/* Top node */}
                      <div className="flex gap-8 justify-center">
                        <div className="border-2 border-gray-400 bg-gray-50 px-4 py-2 rounded text-sm">
                          {currentPartData.mindMap.nodes[0]}
                        </div>
                      </div>
                      
                      {/* Connector line */}
                      <div className="w-px h-8 bg-gray-400"></div>
                      
                      {/* Center row */}
                      <div className="flex gap-8 items-center">
                        <div className="border-2 border-gray-400 bg-gray-50 px-4 py-2 rounded text-sm">
                          {currentPartData.mindMap.nodes[1]}
                        </div>
                        
                        <div className="w-8 h-px bg-gray-400"></div>
                        
                        <div className="border-2 border-blue-600 bg-blue-50 px-6 py-3 rounded text-sm">
                          {currentPartData.mindMap.center}
                        </div>
                        
                        <div className="w-8 h-px bg-gray-400"></div>
                        
                        <div className="border-2 border-gray-400 bg-gray-50 px-4 py-2 rounded text-sm">
                          {currentPartData.mindMap.nodes[2]}
                        </div>
                      </div>
                      
                      {/* Connector line */}
                      <div className="w-px h-8 bg-gray-400"></div>
                      
                      {/* Bottom node */}
                      <div className="flex gap-8 justify-center">
                        <div className="border-2 border-gray-400 bg-gray-50 px-4 py-2 rounded text-sm">
                          {currentPartData.mindMap.nodes[3]}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Follow-up Questions */}
                {currentPartData.followUpQuestions && currentPartData.followUpQuestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-2">Follow-up questions:</p>
                    {currentPartData.followUpQuestions.map((question: string, index: number) => (
                      <p key={index} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                        <span className="text-rose-600">-</span>
                        <span>{question}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recording Status */}
          {isRecording && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Mic className="size-6 text-red-600" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  </div>
                  <div>
                    <p className="text-sm text-red-900">Đang ghi âm...</p>
                    <p className="text-xs text-red-700">Hãy nói rõ ràng vào micro</p>
                  </div>
                </div>
                <div className="text-3xl text-red-600">
                  {formatTime(recordTime)} / {formatTime(maxRecordTime)}
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          {!isRecording && !(hasRecorded[1] && hasRecorded[2] && hasRecorded[3]) && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>📌 Lưu ý:</strong> Khi bấm "Bắt đầu ghi âm", hệ thống sẽ ghi liên tục cả 3 Parts 
                (Part 1 → Part 2 → Part 3) và tự động chuyển part khi hết thời gian. 
                Tổng thời gian: {formatTime(3 * 60)} + {formatTime(3 * 60)} + {formatTime(4 * 60)} = {formatTime(10 * 60)}
              </p>
            </div>
          )}

          {!isRecording && (
            <div className="flex flex-col items-center gap-4">
              {hasRecorded[currentPart] ? (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg mb-4">
                    <PlayCircle className="size-5" />
                    <span>Đã ghi âm xong Part {currentPart}</span>
                  </div>
                  <button
                    onClick={() => {
                      setHasRecorded({...hasRecorded, [currentPart]: false});
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Ghi lại
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    startRecording();
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl hover:from-rose-700 hover:to-pink-700 transition-all flex items-center gap-3 shadow-lg"
                >
                  <Mic className="size-6" />
                  <span>Bắt đầu ghi âm {hasRecorded[1] || hasRecorded[2] || hasRecorded[3] ? 'lại' : 'cả 3 Parts'}</span>
                </button>
              )}
            </div>
          )}

          {isRecording && (
            <div className="flex justify-center">
              <button
                onClick={stopRecording}
                className="px-8 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all flex items-center gap-3"
              >
                <StopCircle className="size-6" />
                <span>Dừng ghi âm</span>
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => currentPart > 1 && setCurrentPart((currentPart - 1) as 1 | 2 | 3)}
              disabled={currentPart === 1 || isRecording}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Part trước
            </button>
            {currentPart < 3 ? (
              <button
                onClick={() => setCurrentPart((currentPart + 1) as 1 | 2 | 3)}
                disabled={!hasRecorded[currentPart] || isRecording}
                className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Part tiếp theo →
              </button>
            ) : (
              <button
                onClick={submitTest}
                disabled={isRecording}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Nộp bài
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}