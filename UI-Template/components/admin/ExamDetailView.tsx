import { useState } from 'react';
import { X, Book, Headphones, PenTool, Mic, Download, Edit, Trash2, Copy, Users, TrendingUp, Clock, FileText, CheckCircle, AlertCircle, Eye, Sparkles } from 'lucide-react';

interface ExamDetailViewProps {
  exam: any;
  onClose: () => void;
}

export function ExamDetailView({ exam, onClose }: ExamDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'statistics' | 'submissions'>('content');

  const getSkillIcon = () => {
    switch (exam.skill) {
      case 'reading': return Book;
      case 'listening': return Headphones;
      case 'writing': return PenTool;
      case 'speaking': return Mic;
      default: return FileText;
    }
  };

  const getSkillColor = () => {
    switch (exam.skill) {
      case 'reading': return 'blue';
      case 'listening': return 'emerald';
      case 'writing': return 'violet';
      case 'speaking': return 'orange';
      default: return 'gray';
    }
  };

  const SkillIcon = getSkillIcon();
  const color = getSkillColor();

  // Mock data cho Reading content
  const mockReadingContent = {
    parts: [
      {
        partNumber: 1,
        title: 'Part 1: Multiple Choice',
        passage: 'Climate change is one of the most pressing challenges facing humanity today. Rising global temperatures, melting ice caps, and extreme weather events are just some of the consequences...',
        questions: [
          {
            id: 'q1',
            question: 'What is the main topic of the passage?',
            type: 'multiple_choice',
            options: [
              'The history of climate science',
              'The current challenges of climate change',
              'Solutions to environmental problems',
              'The future of renewable energy'
            ],
            correctAnswer: 'B',
            explanation: 'Đoạn văn mở đầu bằng "Climate change is one of the most pressing challenges" - cho thấy chủ đề chính là về những thách thức hiện tại của biến đổi khí hậu. Đáp án A sai vì không đề cập đến lịch sử. Đáp án C và D quá hẹp so với nội dung tổng thể.',
            points: 1
          },
          {
            id: 'q2',
            question: 'According to the passage, which of the following is NOT mentioned as a consequence of climate change?',
            type: 'multiple_choice',
            options: [
              'Rising temperatures',
              'Melting ice caps',
              'Extreme weather',
              'Volcanic eruptions'
            ],
            correctAnswer: 'D',
            explanation: 'Đoạn văn có nhắc đến "Rising global temperatures, melting ice caps, and extreme weather events" nhưng không đề cập đến volcanic eruptions (phun trào núi lửa). Đây là dạng câu hỏi NOT mentioned - cần tìm đáp án KHÔNG có trong bài.',
            points: 1
          }
        ]
      },
      {
        partNumber: 2,
        title: 'Part 2: True/False/Not Given',
        passage: 'The development of renewable energy sources has accelerated in recent years. Solar and wind power have become increasingly cost-effective...',
        questions: [
          {
            id: 'q3',
            question: 'Solar power is now cheaper than fossil fuels.',
            type: 'true_false_ng',
            correctAnswer: 'Not Given',
            explanation: 'Đoạn văn chỉ nói "cost-effective" (hiệu quả về chi phí) nhưng không so sánh trực tiếp với nhiên liệu hóa thạch. Không đủ thông tin để xác định đúng hay sai, nên đáp án là Not Given.',
            points: 1
          }
        ]
      }
    ]
  };

  // Mock data cho Writing content
  const mockWritingContent = {
    tasks: [
      {
        taskNumber: 1,
        type: 'Email',
        prompt: 'You recently attended a conference. Write an email to your colleague to recommend the conference. In your email, you should:\n- Explain what the conference was about\n- Describe what you found most useful\n- Recommend whether they should attend next year',
        minWords: 150,
        sampleAnswer: `Dear Sarah,

I hope this email finds you well. I wanted to reach out to tell you about the International Marketing Conference I attended last week in Singapore, which I believe would be extremely beneficial for your professional development.

The conference focused on digital marketing strategies in the Asian market, with particular emphasis on social media trends and consumer behavior analytics. What I found most valuable was the workshop on data-driven marketing decisions, where industry experts shared practical case studies from leading companies like Grab and Shopee.

The networking opportunities were exceptional as well. I connected with several marketing directors who shared innovative approaches to customer engagement that we could potentially implement in our department.

I would highly recommend that you attend next year's conference. The insights gained and connections made will definitely enhance your understanding of regional market dynamics. The registration fee is reasonable, especially considering the quality of content and speakers.

Let me know if you'd like more details about the conference.

Best regards,
John`,
        scoringCriteria: {
          taskAchievement: 'Trả lời đầy đủ 3 yêu cầu trong đề bài, nội dung phù hợp với thể loại email khuyến nghị',
          coherenceCohesion: 'Bố cục rõ ràng với mở bài, thân bài (3 đoạn tương ứng 3 yêu cầu), và kết bài. Sử dụng linking words tự nhiên.',
          lexicalResource: 'Từ vựng đa dạng và chính xác (professional development, data-driven, consumer behavior, exceptional, innovative)',
          grammaticalRange: 'Đa dạng cấu trúc câu (relative clauses, conditional, modal verbs). Ít lỗi ngữ pháp.'
        }
      },
      {
        taskNumber: 2,
        type: 'Essay (Opinion)',
        prompt: 'Some people believe that university students should be required to attend classes. Others believe that going to classes should be optional for students. Discuss both views and give your own opinion.',
        minWords: 250,
        sampleAnswer: `The question of whether university attendance should be mandatory or optional has been widely debated in educational circles. While both perspectives have merit, I believe a balanced approach would serve students' interests best.

Those who advocate for compulsory attendance argue that regular class participation is essential for effective learning. Firstly, lectures provide structured learning environments where students can directly interact with professors and clarify complex concepts immediately. This face-to-face interaction is particularly valuable in subjects requiring practical demonstrations or group discussions. Secondly, mandatory attendance helps develop discipline and time management skills, which are crucial for future professional success.

On the other hand, proponents of optional attendance emphasize the importance of student autonomy and flexibility. University students are adults who should take responsibility for their own education. Some students may learn more effectively through independent study or online resources rather than traditional lectures. Additionally, optional attendance would allow students to balance their academic commitments with part-time work or family responsibilities more easily.

In my opinion, the optimal solution lies somewhere between these two extremes. Core courses and practical sessions should require attendance, as they provide irreplaceable learning experiences through direct interaction and hands-on practice. However, lecture-based courses could offer more flexibility, with attendance being recommended but not strictly enforced. This approach respects student autonomy while ensuring they don't miss critical educational opportunities.

In conclusion, while both mandatory and optional attendance systems have advantages, a hybrid model that combines structure with flexibility would better accommodate diverse learning styles and individual circumstances while maintaining educational quality.`,
        scoringCriteria: {
          taskAchievement: 'Thảo luận đầy đủ cả 2 quan điểm và nêu rõ ý kiến cá nhân. Đưa ra giải pháp cân bằng.',
          coherenceCohesion: 'Cấu trúc 5 đoạn rõ ràng: Introduction, Body 1 (view 1), Body 2 (view 2), Own opinion, Conclusion. Sử dụng topic sentences hiệu quả.',
          lexicalResource: 'Từ vựng academic phong phú (advocate, compulsory, autonomy, proponents, optimal, hybrid model). Paraphrasing tốt.',
          grammaticalRange: 'Đa dạng câu phức (relative clauses, conditional sentences, passive voice). Chính xác cao.'
        }
      }
    ]
  };

  // Mock data cho Speaking content
  const mockSpeakingContent = {
    parts: [
      {
        partNumber: 1,
        title: 'Part 1: Interview',
        questions: [
          {
            id: 's1',
            question: 'Can you tell me about your hometown?',
            sampleAnswer: 'I come from Hanoi, the capital city of Vietnam. It\'s a bustling city with over 8 million people, known for its rich history and cultural heritage. What I love most about my hometown is the perfect blend of traditional Vietnamese culture and modern development. The Old Quarter, with its narrow streets and colonial architecture, contrasts beautifully with the modern skyscrapers in the business district. The food scene is absolutely incredible - you can find authentic street food alongside high-end restaurants.',
            tips: [
              'Mention specific details about your hometown',
              'Use descriptive adjectives (bustling, incredible, authentic)',
              'Give examples to support your points',
              'Show enthusiasm about your topic'
            ]
          },
          {
            id: 's2',
            question: 'Do you prefer living in a big city or a small town? Why?',
            sampleAnswer: 'I definitely prefer living in a big city, primarily because of the opportunities and convenience it offers. In cities, you have better access to quality education, diverse job opportunities, and modern healthcare facilities. The public transportation system is also more developed, making it easier to get around. Additionally, cities offer more cultural activities like museums, theaters, and international events. However, I do acknowledge that small towns have their charm with closer community connections and a more relaxed pace of life.',
            tips: [
              'State your preference clearly at the beginning',
              'Give 2-3 specific reasons',
              'Use transition words (primarily, additionally, however)',
              'Acknowledge the other viewpoint to show balance'
            ]
          }
        ]
      },
      {
        partNumber: 2,
        title: 'Part 2: Long Turn',
        questions: [
          {
            id: 's3',
            question: 'Describe a memorable journey you have taken. You should say:\n- Where you went\n- Who you went with\n- What you did there\n- And explain why it was memorable',
            sampleAnswer: `I'd like to talk about a memorable trip I took to Sapa, a mountainous region in northern Vietnam, last summer. I went there with three of my closest university friends during our summer break.

Sapa is famous for its breathtaking terraced rice fields and ethnic minority villages. We spent four days there, and each day was filled with amazing experiences. On the first day, we trekked through several villages, including Cat Cat and Ta Van, where we had the opportunity to interact with local H'mong people and learn about their traditional way of life. The scenery was absolutely stunning - endless green rice terraces cascading down the mountainsides.

The second day was particularly challenging as we climbed Fansipan, the highest mountain in Indochina. It took us nearly six hours to reach the summit, but the sense of accomplishment and the panoramic views from the top made every difficult step worthwhile. The third day was more relaxing - we visited the local market where ethnic minorities sell handmade crafts and fresh produce.

What made this journey truly memorable was not just the beautiful landscapes, but the bonding experience with my friends. We supported each other during the challenging trek, shared countless laughs, and created memories that we still talk about today. It was also eye-opening to witness how people in remote areas maintain their traditions while adapting to modern tourism. This trip taught me to appreciate both natural beauty and cultural diversity.`,
            tips: [
              'Use the 1-minute preparation time to plan your structure',
              'Cover all bullet points systematically',
              'Use past tense consistently',
              'Add specific details (names, numbers, descriptions)',
              'Use varied vocabulary (breathtaking, cascading, panoramic)',
              'Include personal feelings and reflections',
              'Aim to speak for 1.5-2 minutes'
            ]
          }
        ]
      },
      {
        partNumber: 3,
        title: 'Part 3: Discussion',
        questions: [
          {
            id: 's4',
            question: 'Why do you think people enjoy traveling?',
            sampleAnswer: 'I believe people enjoy traveling for several compelling reasons. Firstly, travel offers an escape from daily routines and work stress, providing much-needed relaxation and mental refreshment. When people visit new places, they experience different environments and cultures, which broadens their perspectives and helps them appreciate diversity. Secondly, travel creates lasting memories and unique experiences that enrich our lives. Whether it\'s trying exotic food, witnessing spectacular natural wonders, or meeting interesting people, these experiences become valuable stories we cherish. Finally, I think travel also satisfies our innate human curiosity - we have a natural desire to explore the unknown and discover what lies beyond our familiar surroundings.',
            tips: [
              'Give multiple reasons (2-3 points)',
              'Use discourse markers (Firstly, Secondly, Finally)',
              'Extend your answers with examples or explanations',
              'Use more complex vocabulary and structures',
              'Show analytical thinking'
            ]
          },
          {
            id: 's5',
            question: 'Do you think virtual reality could replace real travel in the future?',
            sampleAnswer: 'While virtual reality technology is advancing rapidly and offers exciting possibilities, I don\'t believe it can completely replace real travel. Virtual reality can certainly provide immersive visual experiences of famous landmarks and distant places, which could be beneficial for people with physical limitations or financial constraints. However, real travel involves much more than just seeing things - it engages all our senses. You can\'t truly experience the aroma of street food in Bangkok, the feeling of sand between your toes on a tropical beach, or the genuine warmth of local hospitality through a VR headset. Moreover, the unpredictability and authentic interactions that occur during real travel are irreplaceable. That said, VR could serve as an excellent complementary tool - perhaps for pre-trip planning or for experiencing places that are inaccessible or endangered.',
            tips: [
              'Present a balanced, nuanced opinion',
              'Use conditional language (could, might, would)',
              'Contrast ideas (While... however, That said)',
              'Give specific examples to support arguments',
              'Show critical thinking and awareness of limitations'
            ]
          }
        ]
      }
    ]
  };

  const renderReadingContent = () => (
    <div className="space-y-6">
      {mockReadingContent.parts.map((part) => (
        <div key={part.partNumber} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-300">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Book className="size-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{part.title}</h3>
              <p className="text-sm text-gray-600">{part.questions.length} câu hỏi</p>
            </div>
          </div>

          {/* Passage */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Đoạn văn:</h4>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 font-serif leading-relaxed">{part.passage}</p>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Câu hỏi:</h4>
            {part.questions.map((question, qIndex) => (
              <div key={question.id} className="bg-white rounded-lg p-4 border-2 border-gray-200 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm">
                    Q{qIndex + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{question.question}</p>
                  </div>
                </div>

                {/* Options */}
                {question.options && (
                  <div className="pl-14 space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className={`p-3 rounded-lg border-2 ${
                          String.fromCharCode(65 + oIndex) === question.correctAnswer
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {String.fromCharCode(65 + oIndex)}.
                          </span>
                          <span className="text-gray-700">{option}</span>
                          {String.fromCharCode(65 + oIndex) === question.correctAnswer && (
                            <CheckCircle className="size-5 text-green-600 ml-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Correct Answer (if not multiple choice) */}
                {!question.options && (
                  <div className="pl-14">
                    <div className="p-3 rounded-lg border-2 border-green-500 bg-green-50 flex items-center gap-2">
                      <CheckCircle className="size-5 text-green-600" />
                      <span className="font-medium text-green-700">
                        Đáp án: {question.correctAnswer}
                      </span>
                    </div>
                  </div>
                )}

                {/* EXPLANATION */}
                <div className="pl-14">
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <Sparkles className="size-5 text-yellow-600 mt-0.5" />
                      <h5 className="font-semibold text-yellow-800">Giải thích đáp án:</h5>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderWritingContent = () => (
    <div className="space-y-6">
      {mockWritingContent.tasks.map((task) => (
        <div key={task.taskNumber} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-300">
            <div className="p-2 bg-violet-600 rounded-lg">
              <PenTool className="size-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Task {task.taskNumber}: {task.type}</h3>
              <p className="text-sm text-gray-600">Minimum {task.minWords} words</p>
            </div>
          </div>

          {/* Prompt */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Đề bài:</h4>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 whitespace-pre-line">{task.prompt}</p>
            </div>
          </div>

          {/* SAMPLE ANSWER */}
          <div className="mb-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <Sparkles className="size-5 text-green-600 mt-0.5" />
                <h5 className="font-semibold text-green-800">Đáp án gợi ý (Band 4.0):</h5>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <p className="text-gray-700 font-serif leading-relaxed whitespace-pre-line">
                  {task.sampleAnswer}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
                <AlertCircle className="size-4" />
                <span>Word count: ~{task.sampleAnswer.split(' ').length} words</span>
              </div>
            </div>
          </div>

          {/* Scoring Criteria */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Tiêu chí chấm điểm:</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <h5 className="text-sm font-semibold text-gray-900 mb-1">Task Achievement</h5>
                <p className="text-sm text-gray-700">{task.scoringCriteria.taskAchievement}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <h5 className="text-sm font-semibold text-gray-900 mb-1">Coherence & Cohesion</h5>
                <p className="text-sm text-gray-700">{task.scoringCriteria.coherenceCohesion}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <h5 className="text-sm font-semibold text-gray-900 mb-1">Lexical Resource</h5>
                <p className="text-sm text-gray-700">{task.scoringCriteria.lexicalResource}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <h5 className="text-sm font-semibold text-gray-900 mb-1">Grammatical Range & Accuracy</h5>
                <p className="text-sm text-gray-700">{task.scoringCriteria.grammaticalRange}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSpeakingContent = () => (
    <div className="space-y-6">
      {mockSpeakingContent.parts.map((part) => (
        <div key={part.partNumber} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-300">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Mic className="size-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{part.title}</h3>
              <p className="text-sm text-gray-600">{part.questions.length} câu hỏi</p>
            </div>
          </div>

          <div className="space-y-4">
            {part.questions.map((question, qIndex) => (
              <div key={question.id} className="bg-white rounded-lg p-4 border-2 border-gray-200 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg font-semibold text-sm">
                    Q{qIndex + 1}
                  </span>
                  <p className="flex-1 font-medium text-gray-900 whitespace-pre-line">{question.question}</p>
                </div>

                {/* SAMPLE ANSWER */}
                <div className="pl-14">
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-3">
                      <Sparkles className="size-5 text-green-600 mt-0.5" />
                      <h5 className="font-semibold text-green-800">Câu trả lời mẫu (Band 4.0):</h5>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {question.sampleAnswer}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                {question.tips && question.tips.length > 0 && (
                  <div className="pl-14">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h5 className="font-semibold text-blue-800 text-sm mb-2">💡 Tips:</h5>
                      <ul className="space-y-1">
                        {question.tips.map((tip, tIndex) => (
                          <li key={tIndex} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'content':
        if (exam.skill === 'reading') return renderReadingContent();
        if (exam.skill === 'writing') return renderWritingContent();
        if (exam.skill === 'speaking') return renderSpeakingContent();
        return <div className="p-12 text-center text-gray-600">Listening content (similar to Reading)</div>;
      case 'statistics':
        return (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="size-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{exam.attempts}</h3>
                  <p className="text-sm text-gray-600">Lượt thi</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="size-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{exam.averageScore}/4.0</h3>
                  <p className="text-sm text-gray-600">Điểm trung bình</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CheckCircle className="size-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{exam.passRate}%</h3>
                  <p className="text-sm text-gray-600">Tỷ lệ đạt</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'submissions':
        return (
          <div className="p-12 text-center text-gray-600">
            <Users className="size-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Danh sách bài nộp</h3>
            <p>Sẽ hiển thị danh sách học viên đã làm bài</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 bg-${color}-100 rounded-lg`}>
                <SkillIcon className={`size-8 text-${color}-600`} />
              </div>
              <div>
                <code className="text-sm font-mono text-gray-600">{exam.code}</code>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">{exam.title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-3 py-1 bg-${color}-100 text-${color}-700 rounded-lg text-sm font-medium`}>
                    {exam.skill.charAt(0).toUpperCase() + exam.skill.slice(1)}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                    {exam.level}
                  </span>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="size-4" />
                    {exam.duration} phút
                  </span>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <FileText className="size-4" />
                    {exam.totalQuestions} câu
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="size-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'content'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Nội dung đề thi
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'statistics'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Thống kê
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'submissions'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Bài nộp
            </button>

            <div className="ml-auto flex items-center gap-2">
              <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                <Download className="size-5" />
                <span>Tải về</span>
              </button>
              <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                <Edit className="size-5" />
                <span>Chỉnh sửa</span>
              </button>
            </div>
          </div>

          {/* Scoring System Info - Only for Reading and Listening */}
          {(exam.skill === 'reading' || exam.skill === 'listening') && (
            <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-400 rounded-lg">
                  <CheckCircle className="size-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">📊 Hệ thống tính điểm tự động</h4>
                  {exam.skill === 'listening' ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-yellow-200 text-yellow-900 rounded font-mono text-xs">
                          1 điểm/câu
                        </span>
                        <span className="text-gray-700">× {exam.totalQuestions} câu = Tổng {exam.totalQuestions} điểm</span>
                      </div>
                      <div className="bg-white rounded-lg p-3 border-2 border-yellow-300">
                        <p className="font-semibold text-emerald-700 mb-1">Công thức tính điểm trên thang 10:</p>
                        <code className="text-sm bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded font-mono block">
                          Điểm = (Số câu đúng × 10) ÷ {exam.totalQuestions}
                        </code>
                        <p className="text-xs text-gray-600 mt-2">
                          VD: Trả lời đúng 28/{exam.totalQuestions} câu → Điểm = (28 × 10) ÷ {exam.totalQuestions} = <strong>{((28 * 10) / exam.totalQuestions).toFixed(2)}/10</strong>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-yellow-200 text-yellow-900 rounded font-mono text-xs">
                          0.25 điểm/câu
                        </span>
                        <span className="text-gray-700">× {exam.totalQuestions} câu = Tổng {exam.totalQuestions * 0.25} điểm</span>
                      </div>
                      <div className="bg-white rounded-lg p-3 border-2 border-yellow-300">
                        <p className="font-semibold text-blue-700 mb-1">Công thức tính điểm trên thang 10:</p>
                        <code className="text-sm bg-blue-100 text-blue-900 px-3 py-1.5 rounded font-mono block">
                          Điểm = Số câu đúng × 0.25
                        </code>
                        <p className="text-xs text-gray-600 mt-2">
                          VD: Trả lời đúng 32/{exam.totalQuestions} câu → Điểm = 32 × 0.25 = <strong>{(32 * 0.25).toFixed(2)}/10</strong>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}