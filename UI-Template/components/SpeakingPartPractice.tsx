import { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Clock, Maximize, Minimize, StopCircle } from 'lucide-react';
import { SpeakingResult } from './speaking/SpeakingResult';
import { speakingPartsConfig } from '../data/partsConfig';

interface SpeakingPartPracticeProps {
  onBack: () => void;
  level: 'B1' | 'B2' | 'C1';
  part: 1 | 2 | 3;
}

export function SpeakingPartPractice({ onBack, level, part }: SpeakingPartPracticeProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentPartConfig = speakingPartsConfig[part - 1];
  const maxRecordTime = currentPartConfig.timeLimit * 60; // Convert to seconds

  // Part 1 data - Social Interaction
  const part1Data = {
    topics: [
      {
        title: "Let's talk about your hometown",
        questions: [
          'Where is your hometown?',
          'What do you like most about your hometown?',
          'Has your hometown changed much in recent years?',
        ],
      },
      {
        title: "Now, let's talk about food and cooking",
        questions: [
          'Do you enjoy cooking?',
          'What is your favorite food?',
          'Do you prefer eating at home or eating out?',
        ],
      },
    ],
  };

  // Part 2 data - Solution Discussion
  const part2Data = {
    situation: 'Your friend wants to improve their English speaking skills but feels nervous when talking to native speakers.',
    note: 'Give them THREE suggestions to help them overcome this challenge and become more confident.',
    options: [
      'Practice with language exchange partners online',
      'Join English speaking clubs or meetups',
      'Record yourself speaking and review the recordings',
    ],
  };

  // Part 3 data - Topic Development
  const part3Data = {
    topic: 'What are the benefits of learning a foreign language?',
    mindMap: {
      center: 'Benefits of learning a foreign language',
      nodes: [
        'Career opportunities',
        'Cultural understanding',
        'Personal development',
        'Travel experiences',
      ],
    },
    followUpQuestions: [
      'At what age do you think children should start learning a foreign language?',
      'Do you think everyone should learn English? Why or why not?',
      'How has technology changed the way people learn foreign languages?',
    ],
  };

  // Auto-stop when time runs out
  useEffect(() => {
    if (isRecording && recordTime >= maxRecordTime) {
      stopRecording();
    }
  }, [isRecording, recordTime, maxRecordTime]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordTime(0);
    // TODO: Start actual recording in production
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);
    // TODO: Stop actual recording in production
  };

  const submitTest = () => {
    if (!hasRecorded) {
      alert('Vui lòng ghi âm trước khi nộp bài!');
      return;
    }

    // Mock AI scoring - structure matching SpeakingResult expectations
    const mockResult = {
      audioUrl: 'mock-audio-url',
      timeSpent: recordTime,
      scores: {
        overall: 7.0,
        fluency: 7.5,
        vocabulary: 7.0,
        grammar: 6.5,
        pronunciation: 7.0,
      },
      transcript: 'This is a mock transcript of your speaking response. In a real test, this would contain your actual spoken words transcribed by AI...',
      feedback: {
        strengths: [
          'Good use of linking words and phrases',
          'Clear pronunciation and natural intonation',
          'Relevant examples to support ideas',
        ],
        improvements: [
          'Try to use more complex sentence structures',
          'Expand vocabulary range with more topic-specific words',
          'Reduce hesitation and filler words',
        ],
      },
      sampleAnswer: 'This is a sample answer for reference. In my opinion, learning a foreign language offers numerous benefits...',
      task: {
        id: part,
        title: `Speaking ${currentPartConfig.label}`,
        description: currentPartConfig.title,
        level: level,
        part: `part-${part}`,
      },
    };

    setResult(mockResult);
    setShowResult(true);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setResult(null);
    setIsRecording(false);
    setRecordTime(0);
    setHasRecorded(false);
  };

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
                <h1 className="text-xl">Speaking {currentPartConfig.label} - {level}</h1>
                <p className="text-sm text-gray-600">{currentPartConfig.title} · {currentPartConfig.timeLimit} phút</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
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
                disabled={!hasRecorded}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          {/* Part Badge */}
          <div className="mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 ${currentPartConfig.bgColor} rounded-lg mb-3`}>
              <Mic className={`size-5 ${currentPartConfig.textColor}`} />
              <span className={`${currentPartConfig.textColor}`}>
                {currentPartConfig.label} - {currentPartConfig.title}
              </span>
            </div>
            
            <h2 className="text-2xl mb-2">
              {currentPartConfig.label}: {currentPartConfig.title}
            </h2>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="size-4" />
              <span>Trả lời: {formatTime(maxRecordTime)}</span>
            </div>
          </div>

          {/* Directions */}
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
            <p className="text-sm text-purple-900 mb-2">
              <strong>Directions:</strong>
            </p>
            {part === 1 && (
              <p className="text-sm text-purple-800">
                In this part of the test, the examiner will ask you some questions about yourself. 
                Listen carefully and answer naturally.
              </p>
            )}
            {part === 2 && (
              <p className="text-sm text-purple-800">
                In this part of the test, you will be given a situation and THREE options. 
                You need to discuss all THREE options and choose the best one, explaining your reasons. 
                You will have up to {currentPartConfig.timeLimit} minutes to speak.
              </p>
            )}
            {part === 3 && (
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

          {/* Questions/Content */}
          <div className="mb-6">
            {/* PART 1: Social Interaction */}
            {part === 1 && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                {part1Data.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className={topicIndex > 0 ? 'border-t-2 border-gray-200 pt-6' : ''}>
                    <p className="mb-3 italic text-gray-700">{topic.title}</p>
                    <ol className="space-y-2 ml-6 list-decimal">
                      {topic.questions.map((question, qIndex) => (
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
            {part === 2 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="mb-2">
                  <strong>Situation:</strong> {part2Data.situation}
                </p>
                
                {part2Data.note && (
                  <p className="mt-4 mb-3 text-gray-700">{part2Data.note}</p>
                )}
                
                <ul className="space-y-2 ml-6">
                  {part2Data.options?.map((option, index) => (
                    <li key={index} className="text-sm text-gray-700 leading-relaxed">
                      - {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* PART 3: Topic Development */}
            {part === 3 && (
              <div>
                <p className="mb-6">
                  <strong>Topic:</strong> {part3Data.topic}
                </p>

                {/* Mind Map Visual */}
                {part3Data.mindMap && (
                  <div className="mb-6 p-6 border-2 border-gray-300 rounded-lg bg-white">
                    <div className="flex flex-col items-center gap-4">
                      {/* Top node */}
                      <div className="flex gap-8 justify-center">
                        <div className="border-2 border-gray-400 bg-gray-50 px-4 py-2 rounded text-sm">
                          {part3Data.mindMap.nodes[0]}
                        </div>
                      </div>
                      
                      {/* Connector line */}
                      <div className="w-px h-8 bg-gray-400"></div>
                      
                      {/* Center row */}
                      <div className="flex gap-8 items-center">
                        <div className="border-2 border-gray-400 bg-gray-50 px-4 py-2 rounded text-sm">
                          {part3Data.mindMap.nodes[1]}
                        </div>
                        
                        <div className="w-8 h-px bg-gray-400"></div>
                        
                        <div className="border-2 border-blue-600 bg-blue-50 px-6 py-3 rounded text-sm">
                          {part3Data.mindMap.center}
                        </div>
                        
                        <div className="w-8 h-px bg-gray-400"></div>
                        
                        <div className="border-2 border-gray-400 bg-gray-50 px-4 py-2 rounded text-sm">
                          {part3Data.mindMap.nodes[2]}
                        </div>
                      </div>
                      
                      {/* Connector line */}
                      <div className="w-px h-8 bg-gray-400"></div>
                      
                      {/* Bottom node */}
                      <div className="flex gap-8 justify-center">
                        <div className="border-2 border-gray-400 bg-gray-50 px-4 py-2 rounded text-sm">
                          {part3Data.mindMap.nodes[3]}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Follow-up Questions */}
                {part3Data.followUpQuestions && part3Data.followUpQuestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-2">Follow-up questions:</p>
                    {part3Data.followUpQuestions.map((question, index) => (
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

          {/* Recording Controls */}
          <div className="flex flex-col items-center gap-4">
            {hasRecorded && !isRecording ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg mb-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Đã ghi âm xong</span>
                </div>
                <button
                  onClick={() => {
                    setHasRecorded(false);
                    setRecordTime(0);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Ghi lại
                </button>
              </div>
            ) : isRecording ? (
              <button
                onClick={stopRecording}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all flex flex-col items-center justify-center gap-2 shadow-lg text-white"
              >
                <StopCircle className="size-10" />
                <span className="text-sm">Dừng ghi âm</span>
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 transition-all flex flex-col items-center justify-center gap-2 shadow-lg text-white"
              >
                <Mic className="size-10" />
                <span className="text-sm">Bắt đầu ghi âm</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}