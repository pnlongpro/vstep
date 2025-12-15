import { Plus, Trash2, Mic, AlertCircle, Copy, Upload, Music, Volume2, X, Check } from 'lucide-react';
import { useState } from 'react';

interface SpeakingExamContentProps {
  data: any;
  setData: (data: any) => void;
}

// Default audio library
const DEFAULT_AUDIO_LIBRARY = [
  { id: 1, name: 'English Male Voice 1', url: '/audio/en-male-1.mp3', duration: '2:30' },
  { id: 2, name: 'English Female Voice 1', url: '/audio/en-female-1.mp3', duration: '2:15' },
  { id: 3, name: 'English Male Voice 2', url: '/audio/en-male-2.mp3', duration: '2:45' },
  { id: 4, name: 'English Female Voice 2', url: '/audio/en-female-2.mp3', duration: '2:20' },
  { id: 5, name: 'English Male Voice 3 (British)', url: '/audio/en-male-british.mp3', duration: '2:35' },
  { id: 6, name: 'English Female Voice 3 (British)', url: '/audio/en-female-british.mp3', duration: '2:25' },
];

export function SpeakingExamContent({ data, setData }: SpeakingExamContentProps) {
  const [showAudioLibrary, setShowAudioLibrary] = useState<{ part: string; section?: number } | null>(null);

  // Part 1: Add/Remove sections
  const addPart1Section = () => {
    setData({
      ...data,
      part1: {
        ...data.part1,
        sections: [
          ...data.part1.sections,
          { topicName: '', questions: ['', '', ''] }
        ]
      }
    });
  };

  const removePart1Section = (sectionIndex: number) => {
    const newSections = data.part1.sections.filter((_: any, i: number) => i !== sectionIndex);
    setData({ ...data, part1: { ...data.part1, sections: newSections } });
  };

  const updatePart1TopicName = (sectionIndex: number, value: string) => {
    const newSections = [...data.part1.sections];
    newSections[sectionIndex].topicName = value;
    setData({ ...data, part1: { ...data.part1, sections: newSections } });
  };

  const updatePart1Question = (sectionIndex: number, index: number, value: string) => {
    const newSections = [...data.part1.sections];
    newSections[sectionIndex].questions[index] = value;
    setData({ ...data, part1: { ...data.part1, sections: newSections } });
  };

  const addPart1Question = (sectionIndex: number) => {
    setData({ 
      ...data, 
      part1: { 
        ...data.part1, 
        sections: data.part1.sections.map((section: any, i: number) => 
          i === sectionIndex ? { ...section, questions: [...section.questions, ''] } : section
        ) 
      } 
    });
  };

  const removePart1Question = (sectionIndex: number, index: number) => {
    const newSections = data.part1.sections.map((section: any, i: number) => 
      i === sectionIndex ? { ...section, questions: section.questions.filter((_: any, j: number) => j !== index) } : section
    );
    setData({ ...data, part1: { ...data.part1, sections: newSections } });
  };

  // Part 2: Update options
  const updatePart2Option = (index: number, value: string) => {
    const newOptions = [...data.part2.options];
    newOptions[index] = value;
    setData({ ...data, part2: { ...data.part2, options: newOptions } });
  };

  // Part 3: Questions
  const updatePart3Question = (index: number, value: string) => {
    const newQuestions = [...data.part3.followUpQuestions];
    newQuestions[index] = value;
    setData({ ...data, part3: { ...data.part3, followUpQuestions: newQuestions } });
  };

  const addPart3Question = () => {
    setData({ 
      ...data, 
      part3: { 
        ...data.part3, 
        followUpQuestions: [...data.part3.followUpQuestions, ''] 
      } 
    });
  };

  const removePart3Question = (index: number) => {
    const newQuestions = data.part3.followUpQuestions.filter((_: any, i: number) => i !== index);
    setData({ ...data, part3: { ...data.part3, followUpQuestions: newQuestions } });
  };

  // Part 3: Mind map branches
  const updateMindMapBranch = (index: number, value: string) => {
    const newBranches = [...data.part3.mindMapBranches];
    newBranches[index] = value;
    setData({ ...data, part3: { ...data.part3, mindMapBranches: newBranches } });
  };

  // Audio management
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, part: string, section?: number) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, upload to server and get URL
      const fakeUrl = URL.createObjectURL(file);
      
      if (part === 'part1') {
        setData({ ...data, part1: { ...data.part1, audioUrl: fakeUrl, audioName: file.name } });
      } else if (part === 'part2') {
        setData({ ...data, part2: { ...data.part2, audioUrl: fakeUrl, audioName: file.name } });
      } else if (part === 'part3') {
        setData({ ...data, part3: { ...data.part3, audioUrl: fakeUrl, audioName: file.name } });
      }
    }
  };

  const selectDefaultAudio = (audioItem: any, part: string, section?: number) => {
    if (part === 'part1') {
      setData({ ...data, part1: { ...data.part1, audioUrl: audioItem.url, audioName: audioItem.name } });
    } else if (part === 'part2') {
      setData({ ...data, part2: { ...data.part2, audioUrl: audioItem.url, audioName: audioItem.name } });
    } else if (part === 'part3') {
      setData({ ...data, part3: { ...data.part3, audioUrl: audioItem.url, audioName: audioItem.name } });
    }
    setShowAudioLibrary(null);
  };

  const removeAudio = (part: string, section?: number) => {
    if (part === 'part1') {
      setData({ ...data, part1: { ...data.part1, audioUrl: undefined, audioName: undefined } });
    } else if (part === 'part2') {
      setData({ ...data, part2: { ...data.part2, audioUrl: undefined, audioName: undefined } });
    } else if (part === 'part3') {
      setData({ ...data, part3: { ...data.part3, audioUrl: undefined, audioName: undefined } });
    }
  };

  return (
    <div className="space-y-6">
      {/* Part 1 - SOCIAL INTERACTION */}
      <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-bold text-pink-900 flex items-center gap-2">
              <Mic className="size-5" />
              Part 1 - SOCIAL INTERACTION (~ 3 mins)
            </h4>
            <p className="text-xs text-pink-700 mt-1">⏱️ Trả lời: 3:00</p>
          </div>
          <button
            onClick={addPart1Section}
            className="flex items-center gap-1 px-3 py-1.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm font-medium"
          >
            <Plus className="size-4" />
            Thêm chủ đề
          </button>
        </div>

        {/* Directions */}
        <div className="bg-violet-50 border-l-4 border-violet-400 p-4 mb-6 rounded">
          <p className="text-sm font-bold text-violet-900 mb-2">Directions:</p>
          <p className="text-sm text-violet-800">
            In this part of the test, the examiner will ask you some questions about yourself. Listen carefully and answer naturally.
          </p>
        </div>

        {/* Topic Sections */}
        <div className="space-y-6">
          {data.part1.sections.map((section: any, sectionIndex: number) => (
            <div key={sectionIndex} className="bg-white border-2 border-pink-200 rounded-lg p-4">
              {/* Topic Name */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tên chủ đề <span className="text-red-500">*</span>
                  </label>
                  {data.part1.sections.length > 1 && (
                    <button
                      onClick={() => removePart1Section(sectionIndex)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="VD: Let's talk about rooms in your house"
                  value={section.topicName}
                  onChange={(e) => updatePart1TopicName(sectionIndex, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium italic"
                />
              </div>

              {/* Questions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Câu hỏi (thường 3-4 câu)
                  </label>
                  <button
                    onClick={() => addPart1Question(sectionIndex)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm font-medium"
                  >
                    <Plus className="size-4" />
                    Thêm câu hỏi
                  </button>
                </div>

                {section.questions.map((q: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-sm font-bold text-pink-700 flex-shrink-0">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="VD: Which room in your house do you like best?"
                      value={q}
                      onChange={(e) => updatePart1Question(sectionIndex, index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    {section.questions.length > 1 && (
                      <button
                        onClick={() => removePart1Question(sectionIndex, index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part 2 - SOLUTION DISCUSSION */}
      <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
        <div className="mb-4">
          <h4 className="text-lg font-bold text-orange-900 flex items-center gap-2">
            <Mic className="size-5" />
            Part 2 - SOLUTION DISCUSSION (~ 4 mins)
          </h4>
          <p className="text-xs text-orange-700 mt-1">⏱️ Trả lời: 4:00</p>
        </div>

        {/* Directions */}
        <div className="bg-violet-50 border-l-4 border-violet-400 p-4 mb-6 rounded">
          <p className="text-sm font-bold text-violet-900 mb-2">Directions:</p>
          <p className="text-sm text-violet-800 mb-3">
            In this part of the test, you will be given a situation and THREE options. You need to discuss all THREE options and choose the best one, explaining your reasons.
          </p>
          <p className="text-sm text-violet-800">
            You will have up to 4 minutes to speak. You should talk about all the options, discuss the advantages and disadvantages of each, and then give your final choice with reasons.
          </p>
        </div>

        <div className="space-y-4">
          {/* Situation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="font-bold bg-gray-200 px-2 py-1 rounded">Situation:</span> <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="VD: Some of your friends are visiting you this weekend. You would like to do something fun with them. What will you do?"
              value={data.part2.situation}
              onChange={(e) => setData({ ...data, part2: { ...data.part2, situation: e.target.value } })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              There are THREE options for you to choose: <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {data.part2.options.map((option: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-lg font-bold text-gray-500 mt-2">-</span>
                  <input
                    type="text"
                    placeholder={index === 0 ? "VD: Cook a meal together in your apartment." : 
                                 index === 1 ? "VD: Go to a local restaurant together." :
                                 "VD: Take your friends out for sightseeing."}
                    value={option}
                    onChange={(e) => updatePart2Option(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Part 3 - TOPIC DEVELOPMENT */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
        <div className="mb-4">
          <h4 className="text-lg font-bold text-yellow-900 flex items-center gap-2">
            <Mic className="size-5" />
            Part 3 - TOPIC DEVELOPMENT (~ 5 mins)
          </h4>
          <p className="text-xs text-yellow-700 mt-1">⏱️ Trả lời: 5:00</p>
        </div>

        {/* Directions */}
        <div className="bg-violet-50 border-l-4 border-violet-400 p-4 mb-6 rounded">
          <p className="text-sm font-bold text-violet-900 mb-2">Directions:</p>
          <p className="text-sm text-violet-800 mb-3">
            In this part of the test, you will have to speak on a topic for up to 5 minutes. The examiner will give you a mind map to help you develop your ideas.
          </p>
          <p className="text-sm text-violet-800">
            You should talk about the topic using the ideas in the mind map as prompts. You can also add your own ideas if you wish. After you finish speaking, the examiner will ask you some follow-up questions related to the topic.
          </p>
        </div>

        <div className="space-y-6">
          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="font-bold bg-gray-200 px-2 py-1 rounded">Topic:</span> <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: Things that affect people's job satisfaction?"
              value={data.part3.topic}
              onChange={(e) => setData({ ...data, part3: { ...data.part3, topic: e.target.value } })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 font-medium"
            />
          </div>

          {/* Mind Map */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Mind Map (Sơ đồ tư duy)
            </label>
            
            <div className="bg-white border-2 border-yellow-200 rounded-lg p-6">
              {/* Center */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Center (Tâm sơ đồ)
                </label>
                <input
                  type="text"
                  placeholder="VD: Job satisfaction"
                  value={data.part3.mindMapCenter}
                  onChange={(e) => setData({ ...data, part3: { ...data.part3, mindMapCenter: e.target.value } })}
                  className="w-full px-4 py-2 bg-blue-50 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold"
                />
              </div>

              {/* Branches */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-3">
                  Branches (Nhánh - thường 4 nhánh)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {data.part3.mindMapBranches.map((branch: string, index: number) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={index === 0 ? "VD: Qualifications" :
                                   index === 1 ? "VD: Attitude to work" :
                                   index === 2 ? "VD: Your own ideas" :
                                   "VD: Relationship with colleagues"}
                      value={branch}
                      onChange={(e) => updateMindMapBranch(index, e.target.value)}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Follow-up Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up questions:
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-600">Thường 3-4 câu hỏi</span>
                <button
                  onClick={addPart3Question}
                  className="flex items-center gap-1 px-3 py-1.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium"
                >
                  <Plus className="size-4" />
                  Thêm câu hỏi
                </button>
              </div>

              {data.part3.followUpQuestions.map((q: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-lg font-bold text-gray-500 mt-2">-</span>
                  <input
                    type="text"
                    placeholder="VD: Do you think companies should promote workers who are experienced?"
                    value={q}
                    onChange={(e) => updatePart3Question(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  {data.part3.followUpQuestions.length > 1 && (
                    <button
                      onClick={() => removePart3Question(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Hướng dẫn soạn đề Speaking theo chuẩn VSTEP:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Part 1:</strong> Social Interaction - 2-3 chủ đề, mỗi chủ đề 3-4 câu hỏi về cuộc sống hàng ngày (3 phút)</li>
              <li><strong>Part 2:</strong> Solution Discussion - 1 tình huống với 3 lựa chọn, thảo luận ưu/nhược điểm và chọn 1 (4 phút)</li>
              <li><strong>Part 3:</strong> Topic Development - 1 chủ đề với mind map, nói 5 phút + câu hỏi follow-up</li>
              <li>AI sẽ chấm dựa trên: Fluency, Vocabulary, Grammar, Pronunciation, Task Response</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Audio Management Section */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6">
        <h4 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
          <Volume2 className="size-5" />
          Quản lý Audio (Tùy chọn)
        </h4>
        <p className="text-sm text-purple-700 mb-6">
          Thêm audio hướng dẫn cho từng phần. Bạn có thể upload file mới hoặc chọn từ thư viện mặc định.
        </p>

        {/* Part 1 Audio */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-gray-900">Part 1 - Social Interaction</h5>
            {data.part1.audioUrl && (
              <button
                onClick={() => removeAudio('part1')}
                className="text-red-600 hover:bg-red-50 p-1 rounded"
                title="Xóa audio"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          
          {data.part1.audioUrl ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-3 mb-2">
                <Music className="size-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">{data.part1.audioName || 'Audio file'}</p>
                  <p className="text-xs text-green-700">Audio đã được thêm</p>
                </div>
                <Check className="size-5 text-green-600" />
              </div>
              <audio controls className="w-full mt-2" src={data.part1.audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : (
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors cursor-pointer">
                <Upload className="size-4 text-purple-600" />
                <span className="text-sm">Upload Audio</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileUpload(e, 'part1')}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowAudioLibrary({ part: 'part1' })}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center gap-2"
              >
                <Music className="size-4" />
                Thư viện
              </button>
            </div>
          )}
        </div>

        {/* Part 2 Audio */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-gray-900">Part 2 - Solution Discussion</h5>
            {data.part2.audioUrl && (
              <button
                onClick={() => removeAudio('part2')}
                className="text-red-600 hover:bg-red-50 p-1 rounded"
                title="Xóa audio"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          
          {data.part2.audioUrl ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-3 mb-2">
                <Music className="size-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">{data.part2.audioName || 'Audio file'}</p>
                  <p className="text-xs text-green-700">Audio đã được thêm</p>
                </div>
                <Check className="size-5 text-green-600" />
              </div>
              <audio controls className="w-full mt-2" src={data.part2.audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : (
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors cursor-pointer">
                <Upload className="size-4 text-purple-600" />
                <span className="text-sm">Upload Audio</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileUpload(e, 'part2')}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowAudioLibrary({ part: 'part2' })}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center gap-2"
              >
                <Music className="size-4" />
                Thư viện
              </button>
            </div>
          )}
        </div>

        {/* Part 3 Audio */}
        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-gray-900">Part 3 - Topic Development</h5>
            {data.part3.audioUrl && (
              <button
                onClick={() => removeAudio('part3')}
                className="text-red-600 hover:bg-red-50 p-1 rounded"
                title="Xóa audio"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          
          {data.part3.audioUrl ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-3 mb-2">
                <Music className="size-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">{data.part3.audioName || 'Audio file'}</p>
                  <p className="text-xs text-green-700">Audio đã được thêm</p>
                </div>
                <Check className="size-5 text-green-600" />
              </div>
              <audio controls className="w-full mt-2" src={data.part3.audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : (
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors cursor-pointer">
                <Upload className="size-4 text-purple-600" />
                <span className="text-sm">Upload Audio</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileUpload(e, 'part3')}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowAudioLibrary({ part: 'part3' })}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center gap-2"
              >
                <Music className="size-4" />
                Thư viện
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Audio Library Modal */}
      {showAudioLibrary && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowAudioLibrary(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <div>
                <h3 className="text-xl font-bold">Thư viện Audio Mặc định</h3>
                <p className="text-sm opacity-90 mt-1">Chọn audio giọng đọc chuẩn</p>
              </div>
              <button onClick={() => setShowAudioLibrary(null)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              <div className="grid gap-3">
                {DEFAULT_AUDIO_LIBRARY.map((audio) => (
                  <div
                    key={audio.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer"
                    onClick={() => selectDefaultAudio(audio, showAudioLibrary.part, showAudioLibrary.section)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Volume2 className="size-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{audio.name}</p>
                        <p className="text-xs text-gray-500">Thời lượng: {audio.duration}</p>
                      </div>
                      <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                        Chọn
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* JSON Import/Export */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6">
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Copy className="size-4" />
          Import/Export JSON
        </h4>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const json = JSON.stringify(data, null, 2);
              navigator.clipboard.writeText(json);
              alert('Đã copy JSON!');
            }}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
          >
            Copy JSON
          </button>
          <button
            onClick={() => {
              const json = prompt('Paste JSON:');
              if (json) {
                try {
                  setData(JSON.parse(json));
                  alert('Import thành công!');
                } catch (e) {
                  alert('JSON không hợp lệ!');
                }
              }
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
          >
            Import JSON
          </button>
        </div>
      </div>
    </div>
  );
}