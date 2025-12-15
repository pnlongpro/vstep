import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Book, Headphones, PenTool, Mic, Trophy, Search, Filter, Calendar, 
  TrendingUp, Clock, ChevronDown, ChevronRight, Eye, Download, Trash2, X, User, 
  Lightbulb, Target, FileText 
} from 'lucide-react';

interface HistoryProps {
  onBack: () => void;
  onSelectSkill?: (skill: 'reading' | 'listening' | 'writing' | 'speaking') => void;
}

type SkillFilter = 'all' | 'reading' | 'listening' | 'writing' | 'speaking' | 'exam';
type LevelFilter = 'all' | 'A2' | 'B1' | 'B2' | 'C1';

export function History({ onBack, onSelectSkill }: HistoryProps) {
  const [skillFilter, setSkillFilter] = useState<SkillFilter>('all');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [feedbackTab, setFeedbackTab] = useState<'ai' | 'teacher'>('ai');
  const [examSkillTab, setExamSkillTab] = useState<'reading' | 'listening' | 'writing' | 'speaking'>('reading');

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = () => {
    // Load from localStorage and combine with mock data
    const examHistory = JSON.parse(localStorage.getItem('exam_history') || '[]');
    
    const mockHistory = [
      {
        id: 'h1',
        type: 'reading',
        title: 'Multiple Choice - Climate Change',
        level: 'B2',
        score: 8.5,
        totalQuestions: 10,
        correctAnswers: 9,
        date: '2025-12-08T10:30:00',
        duration: 25,
        answers: {},
        questions: [
          {
            id: 1,
            question: 'What is the main idea of the passage?',
            options: ['A. Climate change is a natural phenomenon', 'B. Human activities are the primary cause of climate change', 'C. Climate change only affects polar regions', 'D. Technology can solve all climate problems'],
            userAnswer: 'B',
            correctAnswer: 'B',
            isCorrect: true,
          },
          {
            id: 2,
            question: 'According to the text, which factor contributes most to global warming?',
            options: ['A. Solar radiation', 'B. Volcanic eruptions', 'C. Greenhouse gas emissions', 'D. Ocean currents'],
            userAnswer: 'C',
            correctAnswer: 'C',
            isCorrect: true,
          },
          {
            id: 3,
            question: 'What does the author suggest about renewable energy?',
            options: ['A. It is too expensive', 'B. It cannot replace fossil fuels', 'C. It is a viable solution', 'D. It is only suitable for developed countries'],
            userAnswer: 'C',
            correctAnswer: 'C',
            isCorrect: true,
          },
          {
            id: 4,
            question: 'The word "mitigate" in paragraph 3 is closest in meaning to:',
            options: ['A. Worsen', 'B. Reduce', 'C. Ignore', 'D. Accelerate'],
            userAnswer: 'A',
            correctAnswer: 'B',
            isCorrect: false,
          },
          {
            id: 5,
            question: 'Which of the following is NOT mentioned as an impact of climate change?',
            options: ['A. Rising sea levels', 'B. Extreme weather events', 'C. Loss of biodiversity', 'D. Increased earthquake frequency'],
            userAnswer: 'D',
            correctAnswer: 'D',
            isCorrect: true,
          },
          {
            id: 6,
            question: 'What can be inferred about the Paris Agreement?',
            options: ['A. It has been completely successful', 'B. It aims to limit global temperature rise', 'C. It focuses only on developed nations', 'D. It has been abandoned'],
            userAnswer: 'B',
            correctAnswer: 'B',
            isCorrect: true,
          },
          {
            id: 7,
            question: 'The passage suggests that individual actions:',
            options: ['A. Are meaningless', 'B. Can make a significant difference', 'C. Should be avoided', 'D. Are only symbolic'],
            userAnswer: 'B',
            correctAnswer: 'B',
            isCorrect: true,
          },
          {
            id: 8,
            question: 'What does the author imply about future generations?',
            options: ['A. They will solve the problem easily', 'B. They will face severe consequences if action is not taken', 'C. They are not affected by current decisions', 'D. They prefer fossil fuels'],
            userAnswer: 'B',
            correctAnswer: 'B',
            isCorrect: true,
          },
          {
            id: 9,
            question: 'According to the text, which sector needs the most transformation?',
            options: ['A. Agriculture', 'B. Transportation', 'C. Energy production', 'D. Manufacturing'],
            userAnswer: 'C',
            correctAnswer: 'C',
            isCorrect: true,
          },
          {
            id: 10,
            question: 'The tone of the passage can best be described as:',
            options: ['A. Pessimistic', 'B. Neutral', 'C. Urgent but hopeful', 'D. Indifferent'],
            userAnswer: 'C',
            correctAnswer: 'C',
            isCorrect: true,
          },
        ],
        feedback: {
          strengths: ['Hiểu ý chính tốt', 'Từ vựng về môi trường tốt'],
          improvements: ['Chú ý đến chi tiết nhỏ', 'Cải thiện tốc độ đọc'],
        },
      },
      {
        id: 'h2',
        type: 'exam',
        title: 'VSTEP B1 - Full Test 01',
        level: 'B1',
        score: 7.2,
        date: '2025-12-07T14:00:00',
        duration: 145,
        breakdown: {
          reading: { score: 7.5, correct: 7, total: 8 },
          listening: { score: 7.0, correct: 5, total: 6 },
          writing: { score: 6.8, task1Words: 135, task2Words: 268 },
          speaking: { score: 7.5, parts: 3 },
        },
        detailedResults: {
          reading: {
            totalQuestions: 8,
            correctAnswers: 7,
            questions: [
              { id: 1, question: 'What is the passage mainly about?', userAnswer: 'B', correctAnswer: 'B', isCorrect: true },
              { id: 2, question: 'According to the passage, which is true?', userAnswer: 'A', correctAnswer: 'A', isCorrect: true },
              { id: 3, question: 'The word "they" in line 3 refers to...', userAnswer: 'C', correctAnswer: 'C', isCorrect: true },
              { id: 4, question: 'What does the author suggest?', userAnswer: 'D', correctAnswer: 'D', isCorrect: true },
              { id: 5, question: 'Which statement is NOT mentioned?', userAnswer: 'A', correctAnswer: 'B', isCorrect: false },
              { id: 6, question: 'It can be inferred that...', userAnswer: 'C', correctAnswer: 'C', isCorrect: true },
              { id: 7, question: 'What is the main purpose?', userAnswer: 'B', correctAnswer: 'B', isCorrect: true },
              { id: 8, question: 'According to paragraph 2...', userAnswer: 'D', correctAnswer: 'D', isCorrect: true },
            ],
          },
          listening: {
            totalQuestions: 6,
            correctAnswers: 5,
            questions: [
              { id: 1, question: 'What is the main topic?', userAnswer: 'A', correctAnswer: 'A', isCorrect: true },
              { id: 2, question: 'Where will they meet?', userAnswer: 'C', correctAnswer: 'C', isCorrect: true },
              { id: 3, question: 'What time is mentioned?', userAnswer: 'B', correctAnswer: 'B', isCorrect: true },
              { id: 4, question: 'Why did the man call?', userAnswer: 'A', correctAnswer: 'D', isCorrect: false },
              { id: 5, question: 'What will the woman do next?', userAnswer: 'B', correctAnswer: 'B', isCorrect: true },
              { id: 6, question: 'What does the speaker recommend?', userAnswer: 'C', correctAnswer: 'C', isCorrect: true },
            ],
          },
          writing: {
            task1: {
              prompt: 'Write a letter to your teacher explaining why you missed class yesterday.',
              essay: 'Dear Ms. Johnson,\n\nI am writing to apologize for missing your English class yesterday afternoon. I had an unexpected family emergency that required my immediate attention.\n\nMy grandmother suddenly fell ill, and I had to take her to the hospital. We spent several hours at the emergency room, and I was unable to inform you in advance due to the urgency of the situation.\n\nI understand that we covered important grammar topics in class. Could you please let me know what homework was assigned? I would like to catch up on the material as soon as possible.\n\nI promise to be more attentive to my attendance in the future and will make every effort to avoid missing classes.\n\nThank you for your understanding.\n\nSincerely,\nAnh Nguyen',
              wordCount: 135,
              score: 6.5,
            },
            task2: {
              prompt: 'Some people think that social media has negative effects on young people. Do you agree or disagree? Give reasons for your answer.',
              essay: 'Social media has become an integral part of modern life, especially for young people. While it offers many benefits, I believe that social media can have significant negative effects on youth.\n\nFirstly, excessive use of social media can lead to mental health problems. Many young people compare themselves to others online, which can result in low self-esteem and depression. Studies have shown that teenagers who spend more time on social media are more likely to experience anxiety.\n\nSecondly, social media can be addictive and waste valuable time. Instead of studying or engaging in physical activities, many young people spend hours scrolling through their feeds. This can negatively impact their academic performance and physical health.\n\nHowever, it is important to note that social media is not entirely bad. It helps people stay connected with friends and family, especially those who live far away. It can also be a valuable source of information and educational content.\n\nIn conclusion, while social media has some advantages, its negative effects on young people cannot be ignored. Parents and educators should help young people use social media responsibly.',
              wordCount: 268,
              score: 7.0,
            },
            aiGrading: {
              taskAchievement: 6.8,
              coherence: 7.0,
              vocabulary: 6.5,
              grammar: 7.0,
            },
          },
          speaking: {
            totalQuestions: 5,
            questions: [
              {
                id: 1,
                questionNumber: 'Q1',
                type: 'PART 1',
                question: 'Where do you live?',
                audioUrl: '#',
                score: 2.5,
                maxScore: 3.0,
                feedback: 'Câu trả lời rõ ràng với mô tả cơ bản.',
              },
              {
                id: 2,
                questionNumber: 'Q2',
                type: 'PART 1',
                question: 'Do you like your neighborhood?',
                audioUrl: '#',
                score: 2.6,
                maxScore: 3.0,
                feedback: 'Tốt! Có lý do cụ thể và ví dụ.',
              },
              {
                id: 3,
                questionNumber: 'Q3',
                type: 'PART 2',
                question: 'Describe your favorite place in your city.',
                audioUrl: '#',
                score: 2.4,
                maxScore: 3.0,
                feedback: 'Câu trả lời tốt nhưng cần thêm chi tiết.',
              },
              {
                id: 4,
                questionNumber: 'Q4',
                type: 'PART 3',
                question: 'How do cities today differ from the past?',
                audioUrl: '#',
                score: 2.3,
                maxScore: 3.0,
                feedback: 'Có so sánh nhưng cần phát triển ý sâu hơn.',
              },
              {
                id: 5,
                questionNumber: 'Q5',
                type: 'PART 3',
                question: 'What are the advantages of living in a city?',
                audioUrl: '#',
                score: 2.7,
                maxScore: 3.0,
                feedback: 'Xuất sắc! Nhiều ý tưởng và ví dụ hay.',
              },
            ],
            aiGrading: {
              fluency: 7.5,
              pronunciation: 7.0,
              vocabulary: 7.5,
              grammar: 8.0,
            },
          },
        },
        feedback: {
          strengths: ['Reading và Speaking tốt', 'Quản lý thời gian hiệu quả'],
          improvements: ['Cải thiện Writing Task 2', 'Luyện thêm Listening'],
        },
      },
      {
        id: 'h3',
        type: 'listening',
        title: 'Long Conversation - University Life',
        level: 'B2',
        score: 7.5,
        totalQuestions: 8,
        correctAnswers: 6,
        date: '2025-12-06T16:20:00',
        duration: 30,
        answers: {},
        questions: [
          {
            id: 1,
            question: 'What is the main topic of the conversation?',
            options: ['A. Choosing a major', 'B. Campus facilities', 'C. Study abroad programs', 'D. Scholarship opportunities'],
            userAnswer: 'C',
            correctAnswer: 'C',
            isCorrect: true,
          },
          {
            id: 2,
            question: 'How long is the exchange program mentioned?',
            options: ['A. 3 months', 'B. 6 months', 'C. 1 semester', 'D. 1 year'],
            userAnswer: 'C',
            correctAnswer: 'C',
            isCorrect: true,
          },
          {
            id: 3,
            question: 'What does the woman say about housing?',
            options: ['A. It is very expensive', 'B. It is included in the program', 'C. Students must find it themselves', 'D. It is not available'],
            userAnswer: 'B',
            correctAnswer: 'B',
            isCorrect: true,
          },
          {
            id: 4,
            question: 'When is the application deadline?',
            options: ['A. January 15th', 'B. February 1st', 'C. March 1st', 'D. April 15th'],
            userAnswer: 'A',
            correctAnswer: 'B',
            isCorrect: false,
          },
          {
            id: 5,
            question: 'What language proficiency is required?',
            options: ['A. TOEFL 80', 'B. IELTS 6.0', 'C. TOEFL 90', 'D. IELTS 6.5'],
            userAnswer: 'D',
            correctAnswer: 'D',
            isCorrect: true,
          },
          {
            id: 6,
            question: 'What does the man suggest about internships?',
            options: ['A. They are mandatory', 'B. They are available during the program', 'C. They are not offered', 'D. They require extra fees'],
            userAnswer: 'B',
            correctAnswer: 'B',
            isCorrect: true,
          },
          {
            id: 7,
            question: 'How many credits can be transferred?',
            options: ['A. 12 credits', 'B. 15 credits', 'C. 18 credits', 'D. 24 credits'],
            userAnswer: 'B',
            correctAnswer: 'C',
            isCorrect: false,
          },
          {
            id: 8,
            question: 'What does the woman recommend doing first?',
            options: ['A. Book flights', 'B. Contact the coordinator', 'C. Submit transcripts', 'D. Pay the deposit'],
            userAnswer: 'B',
            correctAnswer: 'B',
            isCorrect: true,
          },
        ],
        feedback: {
          strengths: ['Nghe hiểu ý chính tốt', 'Từ vựng học thuật ổn'],
          improvements: ['Chi tiết số liệu', 'Phân biệt giọng nói'],
        },
      },
      {
        id: 'h4',
        type: 'writing',
        title: 'Opinion Essay - Social Media',
        level: 'B1',
        score: 6.5,
        date: '2025-12-05T11:00:00',
        duration: 45,
        wordCount: 287,
        content: `Social media has become an integral part of our daily lives. While some people believe that it has more negative impacts than positive ones, I disagree with this view and believe that the advantages of social media outweigh the disadvantages.

Firstly, social media helps people stay connected with friends and family who live far away. Through platforms like Facebook and Instagram, we can easily share photos, videos, and updates about our lives. This helps maintain relationships that might otherwise fade due to distance.

Secondly, social media is a valuable tool for education and learning. Many educational institutions and teachers use platforms like YouTube and Facebook groups to share knowledge and resources. Students can access free educational content, join online study groups, and ask questions to experts from around the world.

However, it is true that social media can be addictive and waste people's time. Some individuals spend too many hours scrolling through their feeds instead of being productive. Despite this drawback, I believe that with proper self-control and time management, people can enjoy the benefits of social media while avoiding its negative effects.

In conclusion, although social media has some disadvantages, the benefits it brings in terms of communication, education, and information sharing make it a valuable tool in modern society.`,
        aiGrading: {
          taskAchievement: 7.0,
          coherence: 6.5,
          vocabulary: 6.0,
          grammar: 6.5,
        },
        teacherFeedback: {
          hasReview: true,
          teacher: {
            name: 'Cô Nguyễn Thị Mai',
            avatar: '👩‍🏫',
            title: 'Giảng viên VSTEP',
            reviewedDate: '2025-12-06T09:30:00',
          },
          overallScore: 7.0,
          scores: {
            taskAchievement: 7.5,
            coherence: 7.0,
            vocabulary: 6.5,
            grammar: 7.0,
          },
          detailedComments: {
            opening: 'Mở bài rõ ràng, nêu được quan điểm cá nhân. Tuy nhiên nên paraphrase lại đề bài thay vì copy trực tiếp.',
            bodyParagraphs: 'Các đoạn thân bài có luận điểm rõ ràng với ví dụ minh họa tốt. Đoạn 2 về giáo dục đặc biệt thuyết phục với ví dụ cụ thể về YouTube và Facebook groups.',
            conclusion: 'Kết luận tóm tắt lại ý chính một cách ngắn gọn và phù hợp.',
            grammar: 'Sử dụng nhiều cấu trúc câu đa dạng. Có một số lỗi nhỏ về mạo từ nhưng không ảnh hưởng đến ý nghĩa.',
            vocabulary: 'Vốn từ vựng tương đối phong phú với các cụm từ như "integral part", "outweigh", "fade due to distance". Nên sử dụng thêm các từ nối nâng cao.',
          },
          strengths: [
            'Bố cục 5 đoạn chuẩn với mở bài, 2 thân bài, đoạn nhượng bộ, và kết luận',
            'Sử dụng ví dụ cụ thể và thuyết phục (Facebook, Instagram, YouTube)',
            'Có đoạn nhượng bộ thể hiện tư duy phản biện tốt',
            'Độ dài bài viết phù hợp (287 từ)',
          ],
          improvements: [
            'Paraphrase đề bài trong mở bài thay vì copy trực tiếp',
            'Thêm từ nối nâng cao: Furthermore, Moreover, In addition',
            'Phát triển thêm ý trong đoạn nhượng bộ với 1-2 câu giải thích',
            'Sử dụng từ đồng nghĩa để tránh lặp từ (ví dụ: "people" lặp nhiều lần)',
          ],
          actionPlan: [
            'Học cách paraphrase hiệu quả - luyện viết lại 10 câu mở bài khác nhau cho cùng 1 đề',
            'Tạo danh sách 20 từ nối và cấu trúc nối câu, luyện áp dụng vào bài viết',
            'Viết thêm 3 bài essay tương tự và chú ý áp dụng feedback này',
          ],
          teacherNote: 'Em đã làm rất tốt! Đây là một bài viết B1-B2 vững chắc. Với một chút điều chỉnh về paraphrase và từ nối, em hoàn toàn có thể đạt 7.5-8.0. Hãy tiếp tục luyện tập nhé! 💪',
        },
        feedback: {
          strengths: ['Bố cục rõ ràng', 'Ví dụ cụ thể tốt'],
          improvements: ['Đa dạng từ vựng hơn', 'Cấu trúc câu phức tạp hơn'],
        },
      },
      {
        id: 'h5',
        type: 'speaking',
        title: 'Part 2 - Long Turn',
        level: 'B2',
        score: 7.8,
        date: '2025-12-04T09:15:00',
        duration: 15,
        totalQuestions: 4,
        maxScore: 10,
        questions: [
          {
            id: 1,
            questionNumber: 'Q1',
            type: 'MAIN QUESTION',
            question: 'Tell your favorite place.',
            audioUrl: '#',
            score: 2.8,
            maxScore: 3.0,
            feedback: 'Câu trả lời đúng chủ đề nhưng có ít ngữ pháp. Cần cải thiện trúc câu.',
            detailedFeedback: {
              fluency: 'Trôi chảy, tự nhiên',
              pronunciation: 'Phát âm rõ ràng',
              vocabulary: 'Từ vựng phù hợp',
              grammar: 'Có một số lỗi ngữ pháp nhỏ',
            }
          },
          {
            id: 2,
            questionNumber: 'Q2',
            type: 'MAIN QUESTION',
            question: 'Tell your favorite film star.',
            audioUrl: '#',
            score: 2.0,
            maxScore: 3.0,
            feedback: 'Câu trả lời có ý rõ ràng nhưng có nhiều lỗi ngữ pháp và từ vựng.',
            detailedFeedback: {
              fluency: 'Khá trôi chảy',
              pronunciation: 'Phát âm tốt',
              vocabulary: 'Từ vựng cần phong phú hơn',
              grammar: 'Nhiều lỗi ngữ pháp cơ bản',
            }
          },
          {
            id: 3,
            questionNumber: 'Q3',
            type: 'MAIN QUESTION',
            question: 'Tell me the last time you saw an advertisement.',
            audioUrl: '#',
            score: 1.0,
            maxScore: 3.0,
            feedback: 'Câu trả lời không hoàn chỉnh, cần cải thiện trúc câu và ngữ pháp.',
            detailedFeedback: {
              fluency: 'Chưa trôi chảy, nhiều dừng nghỉ',
              pronunciation: 'Phát âm cần cải thiện',
              vocabulary: 'Từ vựng hạn chế',
              grammar: 'Nhiều lỗi ngữ pháp nghiêm trọng',
            }
          },
          {
            id: 4,
            questionNumber: 'Q4',
            type: 'MAIN QUESTION',
            question: 'What kind of music do you like?',
            audioUrl: '#',
            score: 2.5,
            maxScore: 3.0,
            feedback: 'Câu trả lời tốt, có ví dụ cụ thể. Cần chú ý phát âm một số từ.',
            detailedFeedback: {
              fluency: 'Rất trôi chảy',
              pronunciation: 'Phát âm tốt, có vài từ cần chú ý',
              vocabulary: 'Từ vựng đa dạng',
              grammar: 'Ngữ pháp chính xác',
            }
          },
        ],
        aiGrading: {
          fluency: 8.0,
          pronunciation: 7.5,
          vocabulary: 7.5,
          grammar: 8.0,
        },
        feedback: {
          strengths: ['Trôi chảy, tự nhiên', 'Phát âm rõ ràng'],
          improvements: ['Sử dụng idioms', 'Linking words đa dạng hơn'],
        },
      },
      {
        id: 'h6',
        type: 'reading',
        title: 'True/False/Not Given - Technology',
        level: 'C1',
        score: 6.8,
        totalQuestions: 12,
        correctAnswers: 8,
        date: '2025-12-03T15:45:00',
        duration: 35,
        answers: {},
        feedback: {
          strengths: ['Tốc độ đọc tốt'],
          improvements: ['Phân biệt Not Given và False', 'Đọc kỹ câu hỏi'],
        },
      },
      {
        id: 'h7',
        type: 'listening',
        title: 'Lecture - Economics',
        level: 'C1',
        score: 7.2,
        totalQuestions: 10,
        correctAnswers: 7,
        date: '2025-12-02T13:30:00',
        duration: 40,
        answers: {},
        feedback: {
          strengths: ['Hiểu thuật ngữ chuyên ngành'],
          improvements: ['Tập trung khi nghe dài', 'Note-taking skills'],
        },
      },
      {
        id: 'h8',
        type: 'exam',
        title: 'VSTEP B2 - Full Test 01',
        level: 'B2',
        score: 7.8,
        date: '2025-12-01T09:00:00',
        duration: 150,
        breakdown: {
          reading: { score: 8.0, correct: 9, total: 10 },
          listening: { score: 7.5, correct: 6, total: 7 },
          writing: { score: 7.5, task1Words: 165, task2Words: 285 },
          speaking: { score: 8.0, parts: 3 },
        },
        detailedResults: {
          reading: {
            totalQuestions: 10,
            correctAnswers: 9,
            questions: [
              { id: 1, question: 'What is the main idea of the passage?', userAnswer: 'C', correctAnswer: 'C', isCorrect: true },
              { id: 2, question: 'According to the text, technology helps...', userAnswer: 'B', correctAnswer: 'B', isCorrect: true },
              { id: 3, question: 'The word "it" in line 5 refers to...', userAnswer: 'A', correctAnswer: 'A', isCorrect: true },
              { id: 4, question: 'Which statement is NOT mentioned?', userAnswer: 'D', correctAnswer: 'D', isCorrect: true },
              { id: 5, question: 'What can be inferred from paragraph 3?', userAnswer: 'C', correctAnswer: 'C', isCorrect: true },
              { id: 6, question: 'The author suggests that...', userAnswer: 'B', correctAnswer: 'A', isCorrect: false },
              { id: 7, question: 'According to the passage, students...', userAnswer: 'A', correctAnswer: 'A', isCorrect: true },
              { id: 8, question: 'Which of the following is true?', userAnswer: 'D', correctAnswer: 'D', isCorrect: true },
              { id: 9, question: 'The tone of the passage is...', userAnswer: 'B', correctAnswer: 'B', isCorrect: true },
              { id: 10, question: 'What does the author conclude?', userAnswer: 'C', correctAnswer: 'C', isCorrect: true },
            ],
          },
          listening: {
            totalQuestions: 7,
            correctAnswers: 6,
            questions: [
              { id: 1, question: 'Where does the conversation take place?', userAnswer: 'B', correctAnswer: 'B', isCorrect: true },
              { id: 2, question: 'What time does the train leave?', userAnswer: 'A', correctAnswer: 'A', isCorrect: true },
              { id: 3, question: 'How much does the ticket cost?', userAnswer: 'C', correctAnswer: 'C', isCorrect: true },
              { id: 4, question: 'What is the man going to do?', userAnswer: 'B', correctAnswer: 'D', isCorrect: false },
              { id: 5, question: 'According to the speaker, which is true?', userAnswer: 'A', correctAnswer: 'A', isCorrect: true },
              { id: 6, question: 'What problem does the woman mention?', userAnswer: 'D', correctAnswer: 'D', isCorrect: true },
              { id: 7, question: 'What does the speaker suggest?', userAnswer: 'C', correctAnswer: 'C', isCorrect: true },
            ],
          },
          writing: {
            task1: {
              prompt: 'Write a letter to your friend about a recent trip you took.',
              essay: 'Dear John,\n\nI hope this letter finds you well. I am writing to share with you about my recent trip to Da Nang, which was absolutely amazing.\n\nLast week, I spent three days in Da Nang with my family. We visited many beautiful places such as Ba Na Hills, Marble Mountains, and My Khe Beach. The weather was perfect for sightseeing, and the local food was delicious.\n\nWhat impressed me most was the Golden Bridge at Ba Na Hills. The architecture is stunning, and the view from the top is breathtaking. I took many photos there and wished you could have been with us.\n\nI highly recommend that you visit Da Nang when you have a chance. I am sure you will love it as much as I did.\n\nLooking forward to hearing from you soon.\n\nBest regards,\nMinh',
              wordCount: 165,
              score: 7.5,
            },
            task2: {
              prompt: 'Some people believe that technology has made life easier. Others think it has made life more complicated. Discuss both views and give your opinion.',
              essay: 'In today\'s modern world, technology plays an integral part in our daily lives. While some people argue that technology has simplified life, others believe it has created more complexity. This essay will discuss both perspectives before presenting my own viewpoint.\n\nOn the one hand, technology has undoubtedly made many aspects of life more convenient. Communication has become faster and easier through smartphones and social media platforms. People can now stay connected with friends and family across the globe instantly. Moreover, technology has revolutionized education, making learning resources accessible to everyone through online courses and educational platforms.\n\nOn the other hand, technology can also complicate our lives. The constant connectivity means we are always available, which can lead to stress and burnout. Privacy concerns have increased with the rise of social media, and many people struggle to maintain a healthy work-life balance. Additionally, the rapid pace of technological change requires continuous learning and adaptation.\n\nIn my opinion, while technology does present certain challenges, its benefits outweigh the drawbacks. The key is to use technology mindfully and maintain a balance. We should embrace technological advances while being aware of their potential negative impacts.\n\nIn conclusion, technology has both simplified and complicated modern life. However, with proper management and awareness, we can maximize its benefits while minimizing its disadvantages.',
              wordCount: 285,
              score: 7.5,
            },
            aiGrading: {
              taskAchievement: 7.5,
              coherence: 7.5,
              vocabulary: 7.0,
              grammar: 8.0,
            },
          },
          speaking: {
            totalQuestions: 5,
            questions: [
              {
                id: 1,
                questionNumber: 'Q1',
                type: 'PART 1',
                question: 'Tell me about your hometown.',
                audioUrl: '#',
                score: 2.7,
                maxScore: 3.0,
                feedback: 'Câu trả lời tốt với mô tả chi tiết về quê hương.',
              },
              {
                id: 2,
                questionNumber: 'Q2',
                type: 'PART 1',
                question: 'What do you do in your free time?',
                audioUrl: '#',
                score: 2.5,
                maxScore: 3.0,
                feedback: 'Câu trả lời rõ ràng, có ví dụ cụ thể.',
              },
              {
                id: 3,
                questionNumber: 'Q3',
                type: 'PART 2',
                question: 'Describe a person who has influenced you.',
                audioUrl: '#',
                score: 2.8,
                maxScore: 3.0,
                feedback: 'Xuất sắc! Có cấu trúc rõ ràng và nhiều chi tiết.',
              },
              {
                id: 4,
                questionNumber: 'Q4',
                type: 'PART 3',
                question: 'How has education changed in your country?',
                audioUrl: '#',
                score: 2.6,
                maxScore: 3.0,
                feedback: 'Phân tích tốt với nhiều ý tưởng.',
              },
              {
                id: 5,
                questionNumber: 'Q5',
                type: 'PART 3',
                question: 'What role does technology play in education?',
                audioUrl: '#',
                score: 2.4,
                maxScore: 3.0,
                feedback: 'Câu trả lời tốt nhưng cần thêm ví dụ.',
              },
            ],
            aiGrading: {
              fluency: 8.0,
              pronunciation: 8.0,
              vocabulary: 7.5,
              grammar: 8.5,
            },
          },
        },
        feedback: {
          strengths: ['Toàn diện các kỹ năng', 'Điểm cao Reading và Speaking'],
          improvements: ['Duy trì phong độ', 'Tiếp tục luyện tập đều đặn'],
        },
      },
      {
        id: 'h9',
        type: 'writing',
        title: 'Formal Letter - Job Application',
        level: 'B2',
        score: 7.5,
        date: '2025-11-30T10:20:00',
        duration: 40,
        wordCount: 168,
        aiGrading: {
          taskAchievement: 8.0,
          coherence: 7.5,
          vocabulary: 7.0,
          grammar: 7.5,
        },
        feedback: {
          strengths: ['Format chuẩn', 'Ngôn ngữ formal phù hợp'],
          improvements: ['Thêm chi tiết về kinh nghiệm'],
        },
      },
      {
        id: 'h10',
        type: 'speaking',
        title: 'Part 3 - Discussion',
        level: 'B1',
        score: 6.8,
        date: '2025-11-29T14:00:00',
        duration: 10,
        totalQuestions: 3,
        maxScore: 10,
        questions: [
          {
            id: 1,
            questionNumber: 'Q1',
            type: 'MAIN QUESTION',
            question: 'Do you think technology makes life easier?',
            audioUrl: '#',
            score: 2.3,
            maxScore: 3.5,
            feedback: 'Câu trả lời có ý tốt nhưng cần phát triển thêm lý do và ví dụ.',
            detailedFeedback: {
              fluency: 'Khá trôi chảy',
              pronunciation: 'Phát âm tốt',
              vocabulary: 'Từ vựng cơ bản',
              grammar: 'Một số lỗi ngữ pháp',
            }
          },
          {
            id: 2,
            questionNumber: 'Q2',
            type: 'MAIN QUESTION',
            question: 'How has technology changed communication?',
            audioUrl: '#',
            score: 2.2,
            maxScore: 3.5,
            feedback: 'Cần thêm ví dụ cụ thể và phát triển ý sâu hơn.',
            detailedFeedback: {
              fluency: 'Trôi chảy',
              pronunciation: 'Phát âm rõ ràng',
              vocabulary: 'Từ vựng hạn chế',
              grammar: 'Cần cải thiện cấu trúc câu phức',
            }
          },
          {
            id: 3,
            questionNumber: 'Q3',
            type: 'MAIN QUESTION',
            question: 'What are the disadvantages of social media?',
            audioUrl: '#',
            score: 2.3,
            maxScore: 3.0,
            feedback: 'Câu trả lời tốt với 2-3 ý chính. Cần thêm từ nối.',
            detailedFeedback: {
              fluency: 'Tốt',
              pronunciation: 'Rõ ràng',
              vocabulary: 'Phù hợp với chủ đề',
              grammar: 'Tương đối chính xác',
            }
          },
        ],
        aiGrading: {
          fluency: 7.0,
          pronunciation: 7.0,
          vocabulary: 6.5,
          grammar: 6.5,
        },
        feedback: {
          strengths: ['Phát âm tốt', 'Tự tin'],
          improvements: ['Phát triển ý sâu hơn', 'Từ vựng học thuật'],
        },
      },
    ];

    setHistoryData(mockHistory);
  };

  const filteredData = historyData.filter((item) => {
    const matchesSkill = skillFilter === 'all' || item.type === skillFilter;
    const matchesLevel = levelFilter === 'all' || item.level === levelFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSkill && matchesLevel && matchesSearch;
  });

  const getSkillIcon = (type: string) => {
    switch (type) {
      case 'reading': return Book;
      case 'listening': return Headphones;
      case 'writing': return PenTool;
      case 'speaking': return Mic;
      case 'exam': return Trophy;
      default: return Book;
    }
  };

  const getSkillColor = (type: string) => {
    switch (type) {
      case 'reading': return 'blue';
      case 'listening': return 'green';
      case 'writing': return 'purple';
      case 'speaking': return 'orange';
      case 'exam': return 'red';
      default: return 'gray';
    }
  };

  const getSkillName = (type: string) => {
    switch (type) {
      case 'reading': return 'Reading';
      case 'listening': return 'Listening';
      case 'writing': return 'Writing';
      case 'speaking': return 'Speaking';
      case 'exam': return 'Thi thử';
      default: return type;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6.5) return 'text-blue-600';
    if (score >= 5) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const stats = {
    total: historyData.length,
    reading: historyData.filter(h => h.type === 'reading').length,
    listening: historyData.filter(h => h.type === 'listening').length,
    writing: historyData.filter(h => h.type === 'writing').length,
    speaking: historyData.filter(h => h.type === 'speaking').length,
    exam: historyData.filter(h => h.type === 'exam').length,
  };

  // Calculate average scores for each skill
  const calculateAverage = (type: string) => {
    const items = historyData.filter(h => h.type === type);
    if (items.length === 0) return 0;
    const sum = items.reduce((acc, item) => acc + item.score, 0);
    return sum / items.length;
  };

  const averageScores = {
    reading: calculateAverage('reading'),
    listening: calculateAverage('listening'),
    writing: calculateAverage('writing'),
    speaking: calculateAverage('speaking'),
    overall: historyData.length > 0 
      ? historyData.reduce((acc, item) => acc + item.score, 0) / historyData.length 
      : 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h2 className="text-2xl">Lịch sử làm bài</h2>
            <p className="text-gray-600">Xem lại kết quả và phân tích chi tiết</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-200">
          <div className="text-2xl mb-1">{stats.total}</div>
          <div className="text-sm text-gray-600">Tổng bài</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-blue-200">
          <div className="text-2xl text-blue-600 mb-1">{stats.reading}</div>
          <div className="text-sm text-gray-600">Reading</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-green-200">
          <div className="text-2xl text-green-600 mb-1">{stats.listening}</div>
          <div className="text-sm text-gray-600">Listening</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-purple-200">
          <div className="text-2xl text-purple-600 mb-1">{stats.writing}</div>
          <div className="text-sm text-gray-600">Writing</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-orange-200">
          <div className="text-2xl text-orange-600 mb-1">{stats.speaking}</div>
          <div className="text-sm text-gray-600">Speaking</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-red-200">
          <div className="text-2xl text-red-600 mb-1">{stats.exam}</div>
          <div className="text-sm text-gray-600">Thi thử</div>
        </div>
      </div>

      {/* Average Scores by Skill */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 shadow-sm border-2 border-blue-200">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="size-6 text-blue-600" />
          <h3 className="text-xl">Điểm trung bình từng kỹ năng</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Overall Average */}
          <button
            onClick={() => {
              setSkillFilter('all');
              document.getElementById('filter-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={`bg-white rounded-xl p-5 shadow-md transition-all text-left ${
              skillFilter === 'all'
                ? 'border-4 border-gray-500 shadow-xl scale-105'
                : 'border-2 border-gray-300 hover:shadow-lg hover:border-gray-400'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="size-5 text-gray-700" />
              <span className="text-sm text-gray-700">Tổng quát</span>
            </div>
            <div className={`text-3xl mb-1 ${getScoreColor(averageScores.overall)}`}>
              {averageScores.overall > 0 ? averageScores.overall.toFixed(1) : '--'}
            </div>
            <div className="text-xs text-gray-500">Điểm TB chung</div>
          </button>

          {/* Reading Average */}
          <button
            onClick={() => {
              if (onSelectSkill) {
                onSelectSkill('reading');
              }
            }}
            className="bg-white rounded-xl p-5 shadow-md border-2 border-blue-300 hover:shadow-lg hover:border-blue-400 transition-all text-left"
          >
            <div className="flex items-center gap-2 mb-3">
              <Book className="size-5 text-blue-600" />
              <span className="text-sm text-blue-700">Reading</span>
            </div>
            <div className={`text-3xl mb-1 ${getScoreColor(averageScores.reading)}`}>
              {averageScores.reading > 0 ? averageScores.reading.toFixed(1) : '--'}
            </div>
            <div className="text-xs text-gray-500">{stats.reading} bài</div>
          </button>

          {/* Listening Average */}
          <button
            onClick={() => {
              if (onSelectSkill) {
                onSelectSkill('listening');
              }
            }}
            className="bg-white rounded-xl p-5 shadow-md border-2 border-green-300 hover:shadow-lg hover:border-green-400 transition-all text-left"
          >
            <div className="flex items-center gap-2 mb-3">
              <Headphones className="size-5 text-green-600" />
              <span className="text-sm text-green-700">Listening</span>
            </div>
            <div className={`text-3xl mb-1 ${getScoreColor(averageScores.listening)}`}>
              {averageScores.listening > 0 ? averageScores.listening.toFixed(1) : '--'}
            </div>
            <div className="text-xs text-gray-500">{stats.listening} bài</div>
          </button>

          {/* Writing Average */}
          <button
            onClick={() => {
              if (onSelectSkill) {
                onSelectSkill('writing');
              }
            }}
            className="bg-white rounded-xl p-5 shadow-md border-2 border-purple-300 hover:shadow-lg hover:border-purple-400 transition-all text-left"
          >
            <div className="flex items-center gap-2 mb-3">
              <PenTool className="size-5 text-purple-600" />
              <span className="text-sm text-purple-700">Writing</span>
            </div>
            <div className={`text-3xl mb-1 ${getScoreColor(averageScores.writing)}`}>
              {averageScores.writing > 0 ? averageScores.writing.toFixed(1) : '--'}
            </div>
            <div className="text-xs text-gray-500">{stats.writing} bài</div>
          </button>

          {/* Speaking Average */}
          <button
            onClick={() => {
              if (onSelectSkill) {
                onSelectSkill('speaking');
              }
            }}
            className="bg-white rounded-xl p-5 shadow-md border-2 border-orange-300 hover:shadow-lg hover:border-orange-400 transition-all text-left"
          >
            <div className="flex items-center gap-2 mb-3">
              <Mic className="size-5 text-orange-600" />
              <span className="text-sm text-orange-700">Speaking</span>
            </div>
            <div className={`text-3xl mb-1 ${getScoreColor(averageScores.speaking)}`}>
              {averageScores.speaking > 0 ? averageScores.speaking.toFixed(1) : '--'}
            </div>
            <div className="text-xs text-gray-500">{stats.speaking} bài</div>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div id="filter-section" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài luyện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Skill Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSkillFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                skillFilter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSkillFilter('reading')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                skillFilter === 'reading'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reading
            </button>
            <button
              onClick={() => setSkillFilter('listening')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                skillFilter === 'listening'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Listening
            </button>
            <button
              onClick={() => setSkillFilter('writing')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                skillFilter === 'writing'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Writing
            </button>
            <button
              onClick={() => setSkillFilter('speaking')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                skillFilter === 'speaking'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Speaking
            </button>
            <button
              onClick={() => setSkillFilter('exam')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                skillFilter === 'exam'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Thi thử
            </button>
          </div>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as LevelFilter)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả cấp độ</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <Search className="size-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Không tìm thấy bài luyện nào</p>
          </div>
        ) : (
          filteredData.map((item) => {
            const Icon = getSkillIcon(item.type);
            const color = getSkillColor(item.type);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Icon and Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 bg-${color}-50 rounded-lg flex-shrink-0`}>
                      <Icon className={`size-6 text-${color}-600`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg">{item.title}</h3>
                        <span className={`px-2 py-0.5 bg-${color}-100 text-${color}-600 text-xs rounded`}>
                          {item.level}
                        </span>
                        {item.type === 'exam' && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">
                            Full Test
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-4" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="size-4" />
                          <span>{item.duration} phút</span>
                        </div>
                        {item.type !== 'exam' && item.totalQuestions && (
                          <div className="flex items-center gap-1">
                            <span>
                              {item.correctAnswers}/{item.totalQuestions} câu đúng
                            </span>
                          </div>
                        )}
                        {item.wordCount && (
                          <div className="flex items-center gap-1">
                            <span>{item.wordCount} từ</span>
                          </div>
                        )}
                      </div>

                      {/* Breakdown for Full Test */}
                      {item.type === 'exam' && item.breakdown && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <div className="text-xs text-gray-600 mb-1">Reading</div>
                            <div className="text-blue-600">{item.breakdown.reading.score}</div>
                          </div>
                          <div className="p-2 bg-green-50 rounded-lg">
                            <div className="text-xs text-gray-600 mb-1">Listening</div>
                            <div className="text-green-600">{item.breakdown.listening.score}</div>
                          </div>
                          <div className="p-2 bg-purple-50 rounded-lg">
                            <div className="text-xs text-gray-600 mb-1">Writing</div>
                            <div className="text-purple-600">{item.breakdown.writing.score}</div>
                          </div>
                          <div className="p-2 bg-orange-50 rounded-lg">
                            <div className="text-xs text-gray-600 mb-1">Speaking</div>
                            <div className="text-orange-600">{item.breakdown.speaking.score}</div>
                          </div>
                        </div>
                      )}

                      {/* Quick Feedback */}
                      {item.feedback && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span className="text-gray-600">{item.feedback.strengths[0]}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-orange-600">!</span>
                            <span className="text-gray-600">{item.feedback.improvements[0]}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Score and Actions */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="text-center">
                      <div className={`text-3xl ${getScoreColor(item.score)}`}>
                        {item.score.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">điểm</div>
                    </div>

                    <div className="flex flex-col gap-2 w-full min-w-[140px]">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setFeedbackTab('ai');
                          setExamSkillTab('reading');
                        }}
                        className={`px-4 py-2 bg-${color}-600 text-white rounded-lg hover:bg-${color}-700 transition-colors flex items-center justify-center gap-2 text-sm`}
                      >
                        <Eye className="size-4" />
                        Xem chi tiết
                      </button>

                      {/* Show "Nhận xét & AI" button for Writing and Speaking only */}
                      {(item.type === 'writing' || item.type === 'speaking') && (
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setFeedbackTab('teacher');
                          }}
                          className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <User className="size-4" />
                          Nhận xét & AI
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <div>
                <h3 className="text-2xl mb-1">{selectedItem.title}</h3>
                <p className="text-gray-600">{formatDate(selectedItem.date)}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Overall Score */}
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="text-5xl mb-2">
                  <span className={getScoreColor(selectedItem.score)}>{selectedItem.score.toFixed(1)}</span>
                  <span className="text-2xl text-gray-400">/10</span>
                </div>
                <div className="text-gray-600">Điểm tổng</div>
              </div>

              {/* Exam Detail - Show 4 Skills */}
              {selectedItem.type === 'exam' && selectedItem.detailedResults && (
                <div>
                  {/* Breakdown Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Book className="size-5 text-blue-600" />
                        <span className="text-sm text-blue-700">Reading</span>
                      </div>
                      <div className={`text-2xl ${getScoreColor(selectedItem.breakdown.reading.score)}`}>
                        {selectedItem.breakdown.reading.score.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {selectedItem.breakdown.reading.correct}/{selectedItem.breakdown.reading.total} câu
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Headphones className="size-5 text-green-600" />
                        <span className="text-sm text-green-700">Listening</span>
                      </div>
                      <div className={`text-2xl ${getScoreColor(selectedItem.breakdown.listening.score)}`}>
                        {selectedItem.breakdown.listening.score.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {selectedItem.breakdown.listening.correct}/{selectedItem.breakdown.listening.total} câu
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <PenTool className="size-5 text-purple-600" />
                        <span className="text-sm text-purple-700">Writing</span>
                      </div>
                      <div className={`text-2xl ${getScoreColor(selectedItem.breakdown.writing.score)}`}>
                        {selectedItem.breakdown.writing.score.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-600">
                        Task1: {selectedItem.breakdown.writing.task1Words}w, Task2: {selectedItem.breakdown.writing.task2Words}w
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Mic className="size-5 text-orange-600" />
                        <span className="text-sm text-orange-700">Speaking</span>
                      </div>
                      <div className={`text-2xl ${getScoreColor(selectedItem.breakdown.speaking.score)}`}>
                        {selectedItem.breakdown.speaking.score.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {selectedItem.breakdown.speaking.parts} Parts
                      </div>
                    </div>
                  </div>

                  {/* Skill Tabs */}
                  <div className="flex gap-2 mb-6 overflow-x-auto">
                    <button
                      onClick={() => setExamSkillTab('reading')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                        examSkillTab === 'reading'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Book className="size-4" />
                      Reading
                    </button>
                    <button
                      onClick={() => setExamSkillTab('listening')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                        examSkillTab === 'listening'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Headphones className="size-4" />
                      Listening
                    </button>
                    <button
                      onClick={() => setExamSkillTab('writing')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                        examSkillTab === 'writing'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <PenTool className="size-4" />
                      Writing
                    </button>
                    <button
                      onClick={() => setExamSkillTab('speaking')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                        examSkillTab === 'speaking'
                          ? 'bg-orange-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Mic className="size-4" />
                      Speaking
                    </button>
                  </div>

                  {/* Skill Content */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    {/* Reading Detail */}
                    {examSkillTab === 'reading' && (
                      <div>
                        <h4 className="text-xl mb-4 flex items-center gap-2">
                          <Book className="size-6 text-blue-600" />
                          Reading - Chi tiết câu hỏi
                        </h4>
                        <div className="space-y-3">
                          {selectedItem.detailedResults.reading.questions.map((q: any) => (
                            <div
                              key={q.id}
                              className={`p-4 rounded-lg border-2 ${
                                q.isCorrect
                                  ? 'bg-green-50 border-green-300'
                                  : 'bg-red-50 border-red-300'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-white rounded text-sm">
                                      Q{q.id}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-sm ${
                                      q.isCorrect
                                        ? 'bg-green-200 text-green-800'
                                        : 'bg-red-200 text-red-800'
                                    }`}>
                                      {q.isCorrect ? '✓ Đúng' : '✗ Sai'}
                                    </span>
                                  </div>
                                  <p className="text-gray-900 mb-2">{q.question}</p>
                                  <div className="flex items-center gap-4 text-sm">
                                    <span className="text-gray-700">
                                      Bạn chọn: <span className="px-2 py-0.5 bg-white rounded">{q.userAnswer}</span>
                                    </span>
                                    {!q.isCorrect && (
                                      <span className="text-green-700">
                                        Đáp án đúng: <span className="px-2 py-0.5 bg-green-200 rounded">{q.correctAnswer}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Kết quả:</span>
                            <span className="text-lg">
                              {selectedItem.detailedResults.reading.correctAnswers}/{selectedItem.detailedResults.reading.totalQuestions} câu đúng
                              <span className="text-sm text-gray-600 ml-2">
                                ({((selectedItem.detailedResults.reading.correctAnswers / selectedItem.detailedResults.reading.totalQuestions) * 100).toFixed(0)}%)
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Listening Detail */}
                    {examSkillTab === 'listening' && (
                      <div>
                        <h4 className="text-xl mb-4 flex items-center gap-2">
                          <Headphones className="size-6 text-green-600" />
                          Listening - Chi tiết câu hỏi
                        </h4>
                        <div className="space-y-3">
                          {selectedItem.detailedResults.listening.questions.map((q: any) => (
                            <div
                              key={q.id}
                              className={`p-4 rounded-lg border-2 ${
                                q.isCorrect
                                  ? 'bg-green-50 border-green-300'
                                  : 'bg-red-50 border-red-300'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-white rounded text-sm">
                                      Q{q.id}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-sm ${
                                      q.isCorrect
                                        ? 'bg-green-200 text-green-800'
                                        : 'bg-red-200 text-red-800'
                                    }`}>
                                      {q.isCorrect ? '✓ Đúng' : '✗ Sai'}
                                    </span>
                                  </div>
                                  <p className="text-gray-900 mb-2">{q.question}</p>
                                  <div className="flex items-center gap-4 text-sm">
                                    <span className="text-gray-700">
                                      Bạn chọn: <span className="px-2 py-0.5 bg-white rounded">{q.userAnswer}</span>
                                    </span>
                                    {!q.isCorrect && (
                                      <span className="text-green-700">
                                        Đáp án đúng: <span className="px-2 py-0.5 bg-green-200 rounded">{q.correctAnswer}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Kết quả:</span>
                            <span className="text-lg">
                              {selectedItem.detailedResults.listening.correctAnswers}/{selectedItem.detailedResults.listening.totalQuestions} câu đúng
                              <span className="text-sm text-gray-600 ml-2">
                                ({((selectedItem.detailedResults.listening.correctAnswers / selectedItem.detailedResults.listening.totalQuestions) * 100).toFixed(0)}%)
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Writing Detail */}
                    {examSkillTab === 'writing' && (
                      <div>
                        <h4 className="text-xl mb-4 flex items-center gap-2">
                          <PenTool className="size-6 text-purple-600" />
                          Writing - Bài viết của bạn
                        </h4>

                        {/* Task 1 */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-lg">Task 1 - Letter</h5>
                            <span className={`px-3 py-1 rounded-lg ${getScoreColor(selectedItem.detailedResults.writing.task1.score)}`}>
                              {selectedItem.detailedResults.writing.task1.score.toFixed(1)}/10
                            </span>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-4 mb-3 border border-blue-200">
                            <p className="text-sm text-gray-700 italic">{selectedItem.detailedResults.writing.task1.prompt}</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
                            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                              {selectedItem.detailedResults.writing.task1.essay}
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                              Số từ: {selectedItem.detailedResults.writing.task1.wordCount}
                            </div>
                          </div>
                        </div>

                        {/* Task 2 */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-lg">Task 2 - Essay</h5>
                            <span className={`px-3 py-1 rounded-lg ${getScoreColor(selectedItem.detailedResults.writing.task2.score)}`}>
                              {selectedItem.detailedResults.writing.task2.score.toFixed(1)}/10
                            </span>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-4 mb-3 border border-blue-200">
                            <p className="text-sm text-gray-700 italic">{selectedItem.detailedResults.writing.task2.prompt}</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
                            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                              {selectedItem.detailedResults.writing.task2.essay}
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                              Số từ: {selectedItem.detailedResults.writing.task2.wordCount}
                            </div>
                          </div>
                        </div>

                        {/* AI Grading */}
                        <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
                          <h5 className="mb-3 flex items-center gap-2">
                            <span className="text-xl">🤖</span>
                            <span className="text-lg">Chấm điểm AI</span>
                          </h5>
                          <div className="space-y-3">
                            {Object.entries(selectedItem.detailedResults.writing.aiGrading).map(([key, value]: [string, any]) => {
                              const percentage = (value / 10) * 100;
                              return (
                                <div key={key}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <span className="text-sm">{value.toFixed(1)}</span>
                                  </div>
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Speaking Detail */}
                    {examSkillTab === 'speaking' && (
                      <div>
                        <h4 className="text-xl mb-4 flex items-center gap-2">
                          <Mic className="size-6 text-orange-600" />
                          Speaking - Chi tiết câu hỏi
                        </h4>
                        
                        {/* Questions Table */}
                        <div className="bg-white rounded-xl border-2 border-gray-200">
                          {selectedItem.detailedResults.speaking.questions.map((q: any, index: number) => (
                            <div
                              key={q.id}
                              className={`p-4 grid grid-cols-12 gap-4 ${
                                index !== selectedItem.detailedResults.speaking.questions.length - 1 ? 'border-b border-gray-200' : ''
                              }`}
                            >
                              {/* Question Column */}
                              <div className="col-span-4">
                                <div className="mb-2">
                                  <span className="inline-block px-2 py-1 bg-orange-500 text-white text-xs rounded">
                                    {q.questionNumber}
                                  </span>
                                  <span className="ml-2 inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                    {q.type}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-900">{q.question}</p>
                              </div>

                              {/* Audio Column */}
                              <div className="col-span-4">
                                <audio controls className="w-full mb-2">
                                  <source src={q.audioUrl} type="audio/mpeg" />
                                </audio>
                                <button className="w-full py-2 px-3 bg-white border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 text-sm">
                                  <Download className="size-4" />
                                  Tải xuống
                                </button>
                              </div>

                              {/* Score Column */}
                              <div className="col-span-2 flex flex-col items-center justify-center">
                                <div className={`text-2xl mb-1 ${getScoreColor(q.score)}`}>
                                  {q.score.toFixed(1)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  /{q.maxScore.toFixed(1)}
                                </div>
                              </div>

                              {/* Feedback Column */}
                              <div className="col-span-2">
                                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                                  <p className="text-xs text-gray-700">{q.feedback}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* AI Grading */}
                        <div className="mt-4 bg-orange-50 rounded-lg p-5 border border-orange-200">
                          <h5 className="mb-3 flex items-center gap-2">
                            <span className="text-xl">🤖</span>
                            <span className="text-lg">Chấm điểm AI</span>
                          </h5>
                          <div className="space-y-3">
                            {Object.entries(selectedItem.detailedResults.speaking.aiGrading).map(([key, value]: [string, any]) => {
                              const percentage = (value / 10) * 100;
                              return (
                                <div key={key}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <span className="text-sm">{value.toFixed(1)}</span>
                                  </div>
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Show student's work for Writing/Speaking */}
              {(selectedItem.type === 'writing' || selectedItem.type === 'speaking') && selectedItem.content && (
                <div>
                  <h4 className="text-xl mb-4">
                    {selectedItem.type === 'writing' ? '📝 Bài viết của bạn' : '🎤 Bài nói của bạn'}
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {selectedItem.content}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Switcher for Writing/Speaking with AI or Teacher feedback */}
              {(selectedItem.type === 'writing' || selectedItem.type === 'speaking') && (selectedItem.aiGrading || selectedItem.teacherFeedback) && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => setFeedbackTab('ai')}
                      className={`flex-1 py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                        feedbackTab === 'ai'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-xl">🤖</span>
                      <span>AI tự động</span>
                      {feedbackTab === 'ai' && <span className="px-2 py-0.5 bg-white/20 rounded text-xs">Chấm ngay</span>}
                    </button>
                    <button
                      onClick={() => setFeedbackTab('teacher')}
                      className={`flex-1 py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                        feedbackTab === 'teacher'
                          ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-xl">👩‍🏫</span>
                      <span>Nhận xét giáo viên</span>
                      {feedbackTab === 'teacher' && selectedItem.teacherFeedback?.hasReview && (
                        <span className="px-2 py-0.5 bg-white/20 rounded text-xs">Đã chấm</span>
                      )}
                      {feedbackTab === 'teacher' && !selectedItem.teacherFeedback?.hasReview && (
                        <span className="px-2 py-0.5 bg-yellow-400/30 rounded text-xs">Chờ chấm</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* AI Grading Details - Only show when AI tab is active */}
              {feedbackTab === 'ai' && selectedItem.aiGrading && (
                <div>
                  <h4 className="text-xl mb-4">Chấm điểm AI chi tiết</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedItem.aiGrading).map(([key, value]: [string, any]) => {
                      const percentage = (value / 10) * 100;
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-sm">{value.toFixed(1)}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI Feedback */}
              {feedbackTab === 'ai' && selectedItem.feedback && (
                <div>
                  <h4 className="text-xl mb-4">Nhận xét và gợi ý</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h5 className="mb-3 text-green-700">Điểm mạnh</h5>
                      <ul className="space-y-2">
                        {selectedItem.feedback.strengths.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-green-600">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-xl">
                      <h5 className="mb-3 text-orange-700">Cần cải thiện</h5>
                      <ul className="space-y-2">
                        {selectedItem.feedback.improvements.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-orange-600">!</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Questions Review for Speaking */}
              {selectedItem.type === 'speaking' && selectedItem.questions && selectedItem.questions.length > 0 && (
                <div>
                  <h4 className="text-xl mb-4">🎤 Chi tiết câu hỏi Speaking</h4>
                  
                  {/* Table Header */}
                  <div className="bg-gray-100 rounded-t-xl p-4 grid grid-cols-12 gap-4 border-b-2 border-gray-300">
                    <div className="col-span-3">
                      <span className="text-sm text-gray-700">Câu hỏi</span>
                    </div>
                    <div className="col-span-4">
                      <span className="text-sm text-gray-700">Câu trả lời của bạn</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-sm text-gray-700">Điểm số</span>
                    </div>
                    <div className="col-span-3">
                      <span className="text-sm text-gray-700">Nhận xét</span>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="bg-white border-2 border-gray-200 rounded-b-xl">
                    {selectedItem.questions.map((q: any, index: number) => (
                      <div
                        key={q.id}
                        className={`p-4 grid grid-cols-12 gap-4 ${
                          index !== selectedItem.questions.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                      >
                        {/* Question Column */}
                        <div className="col-span-3">
                          <div className="mb-2">
                            <span className="inline-block px-2 py-1 bg-blue-500 text-white text-xs rounded">
                              {q.questionNumber}
                            </span>
                            <span className="ml-2 inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                              {q.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900">{q.question}</p>
                        </div>

                        {/* Audio Player Column */}
                        <div className="col-span-4">
                          <audio controls className="w-full mb-2">
                            <source src={q.audioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                          <button className="w-full py-2 px-3 bg-white border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm">
                            <Download className="size-4" />
                            Tải xuống
                          </button>
                        </div>

                        {/* Score Column */}
                        <div className="col-span-2 flex flex-col items-center justify-center">
                          <div className={`text-2xl mb-1 ${getScoreColor(q.score)}`}>
                            {q.score.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500">
                            ({(q.score / q.maxScore * 100).toFixed(0)}%)
                          </div>
                          <div className="text-xs text-blue-600 mt-1 cursor-pointer hover:underline flex items-center gap-1">
                            🤖 AI
                          </div>
                        </div>

                        {/* Feedback Column */}
                        <div className="col-span-3">
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <p className="text-sm text-gray-700 mb-2">{q.feedback}</p>
                            <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                              <Lightbulb className="size-3" />
                              AI Feedback
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Stats */}
                  <div className="mt-6 p-5 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border-2 border-orange-200">
                    <h5 className="mb-3">📊 Thống kê</h5>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl text-orange-600">{selectedItem.totalQuestions}</div>
                        <div className="text-xs text-gray-600">Tổng câu</div>
                      </div>
                      <div>
                        <div className={`text-2xl ${getScoreColor(selectedItem.score)}`}>
                          {selectedItem.score.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-600">Điểm trung bình</div>
                      </div>
                      <div>
                        <div className="text-2xl text-blue-600">
                          {selectedItem.maxScore ? ((selectedItem.score / selectedItem.maxScore) * 100).toFixed(0) : '--'}%
                        </div>
                        <div className="text-xs text-gray-600">Tỉ lệ đạt</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Questions Review for Reading/Listening */}
              {(selectedItem.type === 'reading' || selectedItem.type === 'listening') && selectedItem.questions && selectedItem.questions.length > 0 && (
                <div>
                  <h4 className="text-xl mb-4">📋 Chi tiết câu hỏi</h4>
                  <div className="space-y-4">
                    {selectedItem.questions.map((q: any, index: number) => (
                      <div
                        key={q.id}
                        className={`p-5 rounded-xl border-2 transition-all ${
                          q.isCorrect
                            ? 'bg-green-50 border-green-300'
                            : 'bg-red-50 border-red-300'
                        }`}
                      >
                        {/* Question Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              q.isCorrect
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                            }`}
                          >
                            {q.isCorrect ? '✓' : '✗'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm bg-gray-800 text-white px-2 py-0.5 rounded">
                                Câu {index + 1}
                              </span>
                              {q.isCorrect ? (
                                <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">
                                  Chính xác
                                </span>
                              ) : (
                                <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">
                                  Sai
                                </span>
                              )}
                            </div>
                            <p className="text-gray-900">{q.question}</p>
                          </div>
                        </div>

                        {/* Options */}
                        {q.options && (
                          <div className="space-y-2 ml-11">
                            {q.options.map((option: string, optIndex: number) => {
                              const optionLetter = option.charAt(0);
                              const isUserAnswer = optionLetter === q.userAnswer;
                              const isCorrectAnswer = optionLetter === q.correctAnswer;
                              
                              let optionClass = 'bg-gray-100 text-gray-700';
                              if (isCorrectAnswer) {
                                optionClass = 'bg-green-200 text-green-900 border-2 border-green-500';
                              } else if (isUserAnswer && !q.isCorrect) {
                                optionClass = 'bg-red-200 text-red-900 border-2 border-red-500';
                              }

                              return (
                                <div
                                  key={optIndex}
                                  className={`p-3 rounded-lg text-sm transition-all ${optionClass}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span>{option}</span>
                                    {isCorrectAnswer && (
                                      <span className="ml-auto text-green-700">✓ Đáp án đúng</span>
                                    )}
                                    {isUserAnswer && !isCorrectAnswer && (
                                      <span className="ml-auto text-red-700">✗ Bạn chọn</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Explanation if wrong */}
                        {!q.isCorrect && (
                          <div className="mt-3 ml-11 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                            <div className="flex items-start gap-2">
                              <span className="text-yellow-600">💡</span>
                              <div className="text-sm text-gray-700">
                                <span>Đáp án đúng là: </span>
                                <span className="text-green-700">
                                  {q.options.find((opt: string) => opt.charAt(0) === q.correctAnswer)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Summary Stats */}
                  <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                    <h5 className="mb-3">📊 Thống kê</h5>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl text-green-600">{selectedItem.correctAnswers}</div>
                        <div className="text-xs text-gray-600">Câu đúng</div>
                      </div>
                      <div>
                        <div className="text-2xl text-red-600">
                          {selectedItem.totalQuestions - selectedItem.correctAnswers}
                        </div>
                        <div className="text-xs text-gray-600">Câu sai</div>
                      </div>
                      <div>
                        <div className="text-2xl text-blue-600">
                          {((selectedItem.correctAnswers / selectedItem.totalQuestions) * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-600">Độ chính xác</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Teacher Feedback - Only show when Teacher tab is active */}
              {feedbackTab === 'teacher' && selectedItem.teacherFeedback?.hasReview && (
                <div className="space-y-6">
                  {/* Teacher Info Header */}
                  <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-full flex items-center justify-center text-3xl shadow-lg">
                        {selectedItem.teacherFeedback.teacher.avatar}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl text-indigo-900">{selectedItem.teacherFeedback.teacher.name}</h4>
                        <p className="text-sm text-indigo-600">{selectedItem.teacherFeedback.teacher.title}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Đã chấm: {formatDate(selectedItem.teacherFeedback.teacher.reviewedDate)}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className={`text-4xl ${getScoreColor(selectedItem.teacherFeedback.overallScore)}`}>
                          {selectedItem.teacherFeedback.overallScore.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-600">Điểm giáo viên</div>
                      </div>
                    </div>
                  </div>

                  {/* Teacher Scores Breakdown */}
                  <div>
                    <h4 className="text-xl mb-4">Chấm điểm chi tiết từ giáo viên</h4>
                    <div className="space-y-3">
                      {Object.entries(selectedItem.teacherFeedback.scores).map(([key, value]: [string, any]) => {
                        const percentage = (value / 10) * 100;
                        return (
                          <div key={key}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className={`${getScoreColor(value)}`}>{value.toFixed(1)}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detailed Comments from Teacher */}
                  <div>
                    <h4 className="text-xl mb-4">Nhận xét chi tiết</h4>
                    <div className="space-y-4">
                      {selectedItem.type === 'writing' && (
                        <>
                          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                            <h5 className="text-blue-900 mb-2">📌 Mở bài</h5>
                            <p className="text-sm text-gray-700">{selectedItem.teacherFeedback.detailedComments.opening}</p>
                          </div>
                          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                            <h5 className="text-purple-900 mb-2">📝 Thân bài</h5>
                            <p className="text-sm text-gray-700">{selectedItem.teacherFeedback.detailedComments.bodyParagraphs}</p>
                          </div>
                          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                            <h5 className="text-green-900 mb-2">🎯 Kết luận</h5>
                            <p className="text-sm text-gray-700">{selectedItem.teacherFeedback.detailedComments.conclusion}</p>
                          </div>
                        </>
                      )}
                      <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
                        <h5 className="text-orange-900 mb-2">📚 Ngữ pháp</h5>
                        <p className="text-sm text-gray-700">{selectedItem.teacherFeedback.detailedComments.grammar}</p>
                      </div>
                      <div className="bg-pink-50 rounded-xl p-5 border border-pink-200">
                        <h5 className="text-pink-900 mb-2">💬 Từ vựng</h5>
                        <p className="text-sm text-gray-700">{selectedItem.teacherFeedback.detailedComments.vocabulary}</p>
                      </div>
                    </div>
                  </div>

                  {/* Teacher's Strengths and Improvements */}
                  <div>
                    <h4 className="text-xl mb-4">Điểm mạnh & Cần cải thiện</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
                        <h5 className="mb-3 text-green-800">✨ Điểm mạnh</h5>
                        <ul className="space-y-2">
                          {selectedItem.teacherFeedback.strengths.map((item: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-orange-50 rounded-xl p-5 border-2 border-orange-200">
                        <h5 className="mb-3 text-orange-800">📈 Cần cải thiện</h5>
                        <ul className="space-y-2">
                          {selectedItem.teacherFeedback.improvements.map((item: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-orange-600 mt-0.5">→</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action Plan from Teacher */}
                  <div>
                    <h4 className="text-xl mb-4">💡 Kế hoạch hành động</h4>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                      <ul className="space-y-3">
                        {selectedItem.teacherFeedback.actionPlan.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                            <span className="text-lg mt-0.5">{index + 1}.</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Teacher's Personal Note */}
                  <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6 border-2 border-pink-200">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💌</span>
                      <div>
                        <h5 className="text-pink-900 mb-2">Lời nhắn từ giáo viên</h5>
                        <p className="text-gray-700 italic">{selectedItem.teacherFeedback.teacherNote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Teacher Feedback - Waiting State */}
              {feedbackTab === 'teacher' && !selectedItem.teacherFeedback?.hasReview && (
                <div className="bg-yellow-50 rounded-xl p-12 text-center border-2 border-yellow-200">
                  <div className="text-6xl mb-4">⏳</div>
                  <h4 className="text-2xl text-yellow-900 mb-2">Đang chờ giáo viên chấm</h4>
                  <p className="text-gray-700 mb-4">
                    Bài làm của bạn đã được gửi đến giáo viên. Nhận xét chi tiết sẽ có trong vòng 24-48 giờ.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <span>💡 Trong lúc chờ, bạn có thể xem phản hồi AI ở tab</span>
                    <button
                      onClick={() => setFeedbackTab('ai')}
                      className="text-blue-600 hover:underline"
                    >
                      "AI tự động"
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Download className="size-5" />
                  Tải báo cáo
                </button>
                <button className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                  Làm lại bài này
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}