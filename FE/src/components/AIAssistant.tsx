import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, Upload, Copy, RotateCcw, Bot, User, Sparkles, MessageCircle, Trash2, Clock, Crown, Zap, FileText, Volume2, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AIAssistantProps {
  onBack: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  hasHighlights?: boolean;
  highlights?: Array<{ text: string; type: 'error' | 'good' | 'suggestion' }>;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  lastUpdate: Date;
}

interface UserQuota {
  daily: number;
  total: number;
  isPremium: boolean;
}

export function AIAssistant({ onBack }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Xin chào! Tôi là Trợ lý VSTEP AI. Tôi có thể giúp bạn:\\n\\n🗣️ **Luyện Speaking** - Chấm điểm, sửa câu, đóng vai giám khảo\\n✍️ **Luyện Writing** - Chấm bài, highlight lỗi, gợi ý cải thiện\\n📝 **Tạo đề luyện tập** - Writing, Speaking, Reading, Listening\\n✅ **Chấm bài** - Reading/Listening với giải thích chi tiết\\n📚 **Giải thích ngữ pháp** - Từ vựng, cấu trúc câu\\n📊 **Phân tích điểm mạnh/yếu** - Dựa trên kết quả học tập\\n\\nBạn cần hỗ trợ gì hôm nay?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [micPermissionError, setMicPermissionError] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('current');
  const [isRecording, setIsRecording] = useState(false);
  const [userQuota, setUserQuota] = useState<UserQuota>({
    daily: 50,
    total: 50,
    isPremium: false,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat histories from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ai_chat_histories');
    if (saved) {
      const histories = JSON.parse(saved).map((h: any) => ({
        ...h,
        lastUpdate: new Date(h.lastUpdate),
        messages: h.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      }));
      setChatHistories(histories);
    }
  }, []);

  const saveChatHistory = () => {
    if (messages.length <= 1) return; // Don't save if only welcome message

    const newHistory: ChatHistory = {
      id: Date.now().toString(),
      title: messages[1]?.content.slice(0, 50) + '...' || 'Cuộc trò chuyện mới',
      messages: messages,
      lastUpdate: new Date(),
    };

    const updatedHistories = [newHistory, ...chatHistories].slice(0, 20); // Keep last 20 chats
    setChatHistories(updatedHistories);
    localStorage.setItem('ai_chat_histories', JSON.stringify(updatedHistories));
  };

  const loadChatHistory = (historyId: string) => {
    const history = chatHistories.find((h) => h.id === historyId);
    if (history) {
      setMessages(history.messages);
      setCurrentChatId(historyId);
      setShowHistory(false);
    }
  };

  const startNewChat = () => {
    if (messages.length > 1) {
      saveChatHistory();
    }
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: 'Xin chào! Tôi là Trợ lý VSTEP AI. Tôi có thể giúp bạn:\n\n🗣️ **Luyện Speaking** - Chấm điểm, sửa câu, đóng vai giám khảo\n✍️ **Luyện Writing** - Chấm bài, highlight lỗi, gợi ý cải thiện\n📝 **Tạo đề luyện tập** - Writing, Speaking, Reading, Listening\n✅ **Chấm bài** - Reading/Listening với giải thích chi tiết\n📚 **Giải thích ngữ pháp** - Từ vựng, cấu trúc câu\n📊 **Phân tích điểm mạnh/yếu** - Dựa trên kết quả học tập\n\nBạn cần hỗ trợ gì hôm nay?',
        timestamp: new Date(),
      },
    ]);
    setCurrentChatId('current');
    setShowHistory(false);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Check quota
    if (!userQuota.isPremium && userQuota.daily <= 0) {
      const warningMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: '⚠️ Bạn đã hết lượt chat miễn phí hôm nay!\n\n🔓 **Nâng cấp lên Premium để:**\n• Chat không giới hạn\n• Chấm bài chi tiết hơn\n• Ưu tiên phản hồi nhanh\n• Truy cập tính năng độc quyền\n\nHãy nâng cấp tài khoản để tiếp tục sử dụng!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, warningMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Decrease quota
    if (!userQuota.isPremium) {
      setUserQuota((prev) => ({
        ...prev,
        daily: prev.daily - 1,
      }));
      localStorage.setItem('ai_quota', JSON.stringify({
        ...userQuota,
        daily: userQuota.daily - 1,
      }));
    }

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Luyện Speaking
    if (input.includes('luyện nói') || input.includes('speaking part') || input.includes('practice speaking')) {
      return '🎙️ **Chào mừng đến với phần luyện Speaking VSTEP!**\n\nTôi sẽ đóng vai giám khảo và hỏi bạn các câu hỏi theo format VSTEP.\n\n**📋 Hãy chọn Part bạn muốn luyện:**\n\n**Part 1: Social Interaction (3 phút)**\nCâu hỏi về bản thân, sở thích, công việc\n\n**Part 2: Solution Discussion (4 phút)**\nThảo luận về tình huống, đưa ra giải pháp\n\n**Part 3: Topic Development (5 phút)**\nTriển khai chủ đề sâu, thể hiện quan điểm\n\n---\n\n**Ví dụ câu hỏi Part 1:**\n\n"Can you tell me about your hometown?"\n\nHãy trả lời câu hỏi này, tôi sẽ chấm điểm và góp ý cho bạn!';
    }
    
    // Phản hồi Speaking (simulate)
    if (input.includes('my hometown') || input.includes('i live') || input.includes('i come from')) {
      return '✅ **Đánh giá câu trả lời của bạn:**\n\n📊 **Pronunciation & Fluency: 7.5/10**\n✅ Phát âm rõ ràng, dễ hiểu\n✅ Tốc độ nói ổn định\n⚠️ Có 2-3 chỗ ngập ngừng\n💡 Gợi ý: Luyện thêm về stress và intonation\n\n📚 **Vocabulary: 7.0/10**\n✅ Sử dụng từ vựng phù hợp với chủ đề\n✅ Có một số từ vựng tốt: "vibrant", "culturally diverse"\n⚠️ Lặp từ "beautiful" nhiều lần\n💡 Synonyms: gorgeous, stunning, picturesque\n\n📝 **Grammar: 6.5/10**\n✅ Cấu trúc câu cơ bản đúng\n❌ Lỗi: "There is many people" → "There are many people"\n❌ Lỗi: "I living there" → "I live there" hoặc "I have been living there"\n\n🎯 **Coherence: 8.0/10**\n✅ Trả lời đúng trọng tâm câu hỏi\n✅ Có logic, dễ theo dõi\n✅ Kết nối ý tốt\n\n**📊 Điểm tổng: 7.25/10 (tương đương B2+)**\n\n**💡 Câu trả lời mẫu cải thiện:**\n"I come from Hanoi, the capital city of Vietnam. It\'s a vibrant and culturally diverse city with a rich history spanning over a thousand years. What I love most about my hometown is the perfect blend of traditional and modern elements. You can find ancient temples next to contemporary skyscrapers. The food scene is absolutely amazing, especially the street food culture."\n\n---\n**Câu hỏi tiếp theo:**\n"What do you usually do in your free time?"';
    }
    
    // Luyện Writing
    if (input.includes('viết đoạn văn') || input.includes('writing') || input.includes('essay')) {
      return '✍️ **Chào mừng đến với phần luyện Writing VSTEP!**\n\n**📋 Chọn Task bạn muốn luyện:**\n\n**Task 1: Email/Letter (120 words)**\n• Viết email xin việc, khiếu nại, yêu cầu thông tin\n• Thời gian: 20 phút\n\n**Task 2: Essay (250 words)**\n• Agree/Disagree\n• Advantages/Disadvantages  \n• Problem/Solution\n• Thời gian: 40 phút\n\n---\n\n**Ví dụ đề Task 2:**\n\n"Some people believe that studying at university is the best way to get a good job. Others think that gaining work experience is more important.\n\nDiscuss both views and give your own opinion."\n\nHãy viết bài essay của bạn, tôi sẽ chấm theo 4 tiêu chí VSTEP!';
    }
    
    // Chấm Writing (simulate khi user paste đoạn văn dài)
    if (input.length > 200 && !input.includes('?')) {
      return '📊 **KẾT QUẢ CHẤM BÀI WRITING**\n\n**1. Task Fulfillment: 7.5/10**\n✅ Hoàn thành đầy đủ yêu cầu đề bài\n✅ Đề cập cả 2 quan điểm\n✅ Nêu rõ ý kiến cá nhân\n⚠️ Phần conclusion hơi ngắn\n\n**2. Organization: 7.0/10**\n✅ Có intro - body - conclusion rõ ràng\n✅ Mỗi đoạn có topic sentence\n⚠️ Linking words còn đơn điệu (firstly, secondly, finally)\n💡 Gợi ý thay thế:\n• To begin with, Furthermore, In addition\n• On the one hand... On the other hand\n• Consequently, As a result, Therefore\n\n**3. Vocabulary: 8.0/10**\n✅ Từ vựng đa dạng, academic\n✅ Collocations tốt: "gain practical experience", "acquire knowledge"\n⚠️ Lỗi lặp từ:\n• "important" (xuất hiện 5 lần) → vital, crucial, essential, significant\n• "people" (7 lần) → individuals, students, learners\n\n**4. Grammar: 6.5/10**\n❌ **Lỗi cần sửa:**\n• "University help students" → "University helps students" (subject-verb agreement)\n• "If I was a student" → "If I were a student" (subjunctive mood)\n• "Since 2020, I study" → "Since 2020, I have been studying" (present perfect)\n\n✅ Điểm tốt:\n• Sử dụng câu phức tốt\n• Có variety trong cấu trúc câu\n\n---\n**📝 ĐIỂM TỔNG: 7.25/10 (B2+)**\n\n**💡 GỢI Ý NÂNG CAO:**\n\n1. **Mở bài hay hơn:**\n"In today\'s competitive job market, there is an ongoing debate about whether..."\n\n2. **Thêm examples cụ thể:**\n"For instance, Steve Jobs dropped out of college but became one of the most successful entrepreneurs."\n\n3. **Cải thiện conclusion:**\n"In conclusion, while both approaches have their merits, I believe that a combination of academic qualifications and practical experience is the most effective route to career success."\n\n**✨ Bạn đã làm rất tốt! Cần cải thiện thêm về grammar và đa dạng linking words.**';
    }
    
    // Tạo đề luyện tập
    if (input.includes('tạo đề') || input.includes('sinh đề') || input.includes('generate')) {
      return '📝 **TẠO ĐỀ LUYỆN TẬT VSTEP**\n\n**📚 Chọn kỹ năng bạn muốn luyện:**\n\n**1. Reading**\n• Part 1: Multiple Choice Questions\n• Part 2: Sentence Completion\n• Part 3: Gap Filling\n\n**2. Listening**\n• Part 1: Short Conversations\n• Part 2: Monologue\n• Part 3: Discussion\n\n**3. Writing**\n• Task 1: Email/Letter\n• Task 2: Essay\n\n**4. Speaking**\n• Part 1: Interview\n• Part 2: Solution Discussion\n• Part 3: Topic Development\n\n---\n\n**VÍ DỤ ĐỀ WRITING TASK 2 (B2):**\n\n**Topic:** Education & Technology\n\n"Many people believe that technology has made education more accessible and effective. However, others argue that it has negative effects on students\' learning.\n\nDiscuss both views and give your opinion."\n\n**Requirements:**\n• At least 250 words\n• Include introduction, body paragraphs, conclusion\n• Give examples to support your ideas\n• Time: 40 minutes\n\n**Useful vocabulary:**\n• Digital learning platforms\n• Online resources\n• Interactive lessons\n• Screen time\n• Face-to-face interaction\n• Self-discipline\n\nBạn muốn tạo đề cho level nào? (A2, B1, B2, C1)';
    }
    
    // Chấm Reading/Listening
    if (input.includes('đáp án') || input.includes('answer') || input.match(/[ABCD].*[ABCD].*[ABCD]/)) {
      return '✅ **CHẤM BÀI READING/LISTENING**\n\n**📊 Kết quả:**\n\nPart 1: 7/10 câu đúng ✅\nPart 2: 6/10 câu đúng ⚠️\nPart 3: 8/10 câu đúng ✅\n\n**Tổng: 21/30 = 70% (B2)**\n\n---\n\n**🔍 GIẢI THÍCH CHI TIẾT:**\n\n**Câu 3: ❌ Sai**\nBạn chọn: B\nĐáp án đúng: C\n\n📖 Giải thích:\nTrong đoạn văn: "The author mentions that climate change has become one of the most pressing issues..."\n\nKeyword: "pressing issues" = urgent problems\n→ Đáp án C: "an urgent matter"\n\n**Từ vựng quan trọng:**\n• Pressing (adj): khẩn cấp, cấp bách\n• Issue (n): vấn đề\n• Urgent (adj): khẩn thiết\n\n---\n\n**Câu 7: ❌ Sai**\nBạn chọn: A\nĐáp án đúng: D\n\n📖 Giải thích:\nCâu hỏi inference (suy luận) - cần đọc kỹ toàn bộ đoạn\n\nBài văn ám chỉ: "While technology brings benefits, we must not overlook the potential risks..."\n\n→ Tác giả có quan điểm cân bằng (balanced view)\n→ Đáp án D: "Both positive and negative aspects should be considered"\n\n---\n\n**💡 GỢI Ý NÂNG CAO:**\n\n1. **Với câu hỏi Main Idea:**\n• Đọc câu đầu và câu cuối mỗi đoạn\n• Tìm từ lặp lại nhiều lần\n\n2. **Với câu hỏi Detail:**\n• Scan để tìm keywords\n• Đọc kỹ câu chứa keyword\n\n3. **Với câu hỏi Inference:**\n• Đọc hiểu toàn bộ맥락\n• Chú ý tone (tích cực/tiêu cực)\n\n**📚 Từ vựng học thuật bạn nên nhớ:**\n• Pressing, urgent, crucial\n• Overlook, neglect, ignore\n• Benefit, advantage, merit\n• Risk, drawback, downside\n\n**🎯 Bạn cần luyện thêm Part 2 - tập trung vào inference questions!**';
    }
    
    // Giải thích ngữ pháp
    if (input.includes('present perfect') || input.includes('hiện tại hoàn thành')) {
      return '📚 **PRESENT PERFECT TENSE**\n\n**1. Cấu trúc:**\n✅ Khẳng định: S + have/has + V3\n❌ Phủ định: S + haven\'t/hasn\'t + V3\n❓ Nghi vấn: Have/Has + S + V3?\n\n**2. Cách dùng:**\n\n**a) Hành động bắt đầu trong quá khứ, kéo dài đến hiện tại:**\n• I have lived in Hanoi for 10 years.\n• She has worked here since 2020.\n\n**b) Kinh nghiệm trong đời:**\n• I have visited Paris three times.\n• Have you ever eaten sushi?\n\n**c) Hành động vừa mới xảy ra:**\n• I have just finished my homework.\n• He has already left.\n\n**d) Hành động trong quá khứ, không rõ thời gian:**\n• Someone has broken the window.\n• I have lost my keys.\n\n**3. Dấu hiệu nhận biết:**\n• for, since, already, yet, just\n• ever, never, recently, lately\n• so far, up to now, until now\n\n**4. So sánh với Past Simple:**\n\n❌ I lived here for 5 years. (đã không sống nữa)\n✅ I have lived here for 5 years. (vẫn đang sống)\n\n❌ I saw that movie. (thời điểm cụ thể)\n✅ I have seen that movie. (kinh nghiệm, không rõ khi nào)\n\n**5. Bài tập:**\nĐiền vào chỗ trống:\n1. I _____ (study) English for 3 years.\n2. She _____ (already/finish) her project.\n3. _____ you ever _____ (be) to Japan?\n\n**Đáp án:**\n1. have studied\n2. has already finished\n3. Have... been\n\nBạn có câu hỏi gì về Present Perfect không?';
    }
    
    // Phân tích điểm mạnh yếu
    if (input.includes('điểm yếu') || input.includes('phân tích') || input.includes('weak')) {
      return '📊 **PHÂN TÍCH ĐIỂM MẠNH & ĐIỂM YẾU**\n\nDựa trên 15 bài luyện tập gần đây của bạn:\n\n---\n\n**💪 ĐIỂM MẠNH:**\n\n**Reading:**\n✅ Part 1 (MCQ): 85% accuracy\n✅ Tốc độ đọc nhanh\n✅ Nắm ý chính tốt\n\n**Listening:**\n✅ Part 1 (Conversations): 80% accuracy\n✅ Hiểu ngữ cảnh hội thoại\n\n**Writing:**\n✅ Vocabulary đa dạng (Band 7.5)\n✅ Cấu trúc bài rõ ràng\n\n---\n\n**⚠️ ĐIỂM YẾU CẦN CẢI THIỆN:**\n\n**Reading:**\n❌ Part 3 (Inference): 60% accuracy\n💡 Gợi ý: Luyện thêm câu hỏi suy luận, đọc hiểu ngụ ý\n\n**Listening:**\n❌ Part 3 (Academic): 55% accuracy\n💡 Gợi ý: Nghe podcast học thuật, TED talks\n❌ Không kịp ghi chú khi nghe\n💡 Gợi ý: Luyện note-taking skills\n\n**Writing:**\n❌ Grammar accuracy: 65%\n💡 Lỗi thường gặp:\n• Subject-verb agreement (5 lỗi)\n• Present perfect vs past simple (4 lỗi)\n• Article usage (3 lỗi)\n\n**Speaking:**\n❌ Fluency: Band 6.0\n💡 Còn ngập ngừng nhiều\n💡 Gợi ý: Luyện shadowing, record & review\n\n❌ Pronunciation: Band 6.5\n💡 Stress & intonation chưa tốt\n💡 Gợi ý: Học IPA, luyện với native speakers\n\n---\n\n**🎯 LỘ TRÌNH CẢI THIỆN 4 TUẦN:**\n\n**Tuần 1-2:**\n• Reading: 5 bài Part 3 mỗi tuần\n• Listening: 30 phút podcast học thuật mỗi ngày\n• Grammar: Làm 50 câu tập về thì\n\n**Tuần 3-4:**\n• Writing: Viết 2 bài Task 2, focus vào grammar\n• Speaking: Record 1 bài mỗi ngày, self-review\n• Shadowing: 15 phút mỗi ngày\n\n**📈 MỤC TIÊU:**\nTừ B2 (6.5) → B2+ (7.0) trong 1 tháng\n\nBạn muốn tôi tạo bài luyện tập cụ thể cho điểm yếu nào?';
    }
    
    // Default
    return 'Cảm ơn câu hỏi của bạn! Tôi hiểu bạn quan tâm đến vấn đề này.\n\nĐể tôi có thể hỗ trợ tốt hơn, bạn có thể:\n\n1️⃣ **Luyện Speaking:** "Luyện nói VSTEP part 1"\n2️⃣ **Luyện Writing:** "Giúp tôi viết đoạn văn B2"\n3️⃣ **Chấm bài:** Upload file hoặc paste bài làm\n4️⃣ **Tạo đề:** "Tạo đề Writing Task 2 level B2"\n5️⃣ **Giải thích:** "Giải thích về Present Perfect"\n6️⃣ **Phân tích:** "Phân tích điểm yếu của tôi"\n\nTôi luôn sẵn sàng giúp đỡ bạn! 😊';
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    // You can add a toast notification here
  };

  const handleRegenerate = (messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex > 0) {
      const previousUserMessage = messages[messageIndex - 1];
      if (previousUserMessage.type === 'user') {
        setIsTyping(true);
        setTimeout(() => {
          const newAIMessage: Message = {
            id: Date.now().toString(),
            type: 'ai',
            content: generateAIResponse(previousUserMessage.content),
            timestamp: new Date(),
          };
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[messageIndex] = newAIMessage;
            return newMessages;
          });
          setIsTyping(false);
        }, 1500);
      }
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `📎 Đã tải lên file: ${file.name}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      
      setIsTyping(true);
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `Tôi đã nhận được file "${file.name}". Đang phân tích bài làm của bạn...\n\n📊 **Kết quả đánh giá:**\n\n**Task Achievement: 7.0/10**\n✅ Hoàn thành đầy đủ yêu cầu đề bài\n✅ Trình bày rõ ràng luận điểm\n⚠️ Cần bổ sung thêm ví dụ minh họa\n\n**Coherence & Cohesion: 6.5/10**\n✅ Bài viết có cấu trúc logic\n⚠️ Sử dụng linking words còn đơn điệu\n💡 Gợi ý: Thêm "Moreover", "Furthermore", "In addition"\n\n**Vocabulary: 7.5/10**\n✅ Từ vựng phong phú, chính xác\n✅ Sử dụng academic words tốt\n⚠️ Lặp từ "important" nhiều lần\n\n**Grammar: 7.0/10**\n✅ Ít lỗi ngữ pháp nghiêm trọng\n⚠️ 2 lỗi về subject-verb agreement\n⚠️ 1 lỗi thì (dùng past simple thay vì present perfect)\n\n**📝 Điểm tổng thể: 7.0/10**\n\n**💡 Gợi ý cải thiện:**\n1. Đa dạng hóa linking words\n2. Tránh lặp từ - sử dụng synonyms\n3. Kiểm tra subject-verb agreement kỹ hơn\n4. Thêm ví dụ cụ thể cho mỗi luận điểm\n\nBạn có muốn tôi giải thích chi tiết hơn phần nào không?`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const quickQuestions = [
    'Luyện nói VSTEP part 1',
    'Giúp tôi viết đoạn văn B2',
    'Phân tích bài viết của tôi',
    'Tạo đề Writing Task 2',
    'Giải thích đáp án bài nghe',
  ];

  const deleteChatHistory = (historyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistories = chatHistories.filter((h) => h.id !== historyId);
    setChatHistories(updatedHistories);
    localStorage.setItem('ai_chat_histories', JSON.stringify(updatedHistories));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hôm nay';
    if (days === 1) return 'Hôm qua';
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const handleStartRecording = () => {
    if (isRecording) return;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        const audioChunks: Blob[] = [];

        recorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();

          const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: `🎤 Đã ghi âm: ${audioUrl}`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, userMessage]);

          setIsTyping(true);
          setTimeout(() => {
            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              type: 'ai',
              content: `Tôi đã nhận được âm thanh. Đang phân tích nội dung...\n\n📊 **Kết quả đánh giá:**\n\n**Task Achievement: 7.0/10**\n✅ Hoàn thành đầy đủ yêu cầu đề bài\n✅ Trình bày rõ ràng luận điểm\n⚠️ Cần bổ sung thêm ví dụ minh họa\n\n**Coherence & Cohesion: 6.5/10**\n✅ Bài viết có cấu trúc logic\n⚠️ Sử dụng linking words còn đơn điệu\n💡 Gợi ý: Thêm "Moreover", "Furthermore", "In addition"\n\n**Vocabulary: 7.5/10**\n✅ Từ vựng phong phú, chính xác\n✅ Sử dụng academic words tốt\n⚠️ Lặp từ "important" nhiều lần\n\n**Grammar: 7.0/10**\n✅ Ít lỗi ngữ pháp nghiêm trọng\n⚠️ 2 lỗi về subject-verb agreement\n⚠️ 1 lỗi thì (dùng past simple thay vì present perfect)\n\n**📝 Điểm tổng thể: 7.0/10**\n\n**💡 Gợi ý cải thiện:**\n1. Đa dạng hóa linking words\n2. Tránh lặp từ - sử dụng synonyms\n3. Kiểm tra subject-verb agreement kỹ hơn\n4. Thêm ví dụ cụ thể cho mỗi luận điểm\n\nBạn có muốn tôi giải thích chi tiết hơn phần nào không?`,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
          }, 2000);
        };

        recorder.start();
        setIsRecording(true);
      })
      .catch((err) => {
        // Handle microphone permission denial gracefully - UI will show error message
        setMicPermissionError('Không thể truy cập microphone. Hãy kiểm tra quyền truy cập.');
      });
  };

  const handleStopRecording = () => {
    if (!isRecording) return;

    const recorder = mediaRecorderRef.current;
    if (recorder) {
      recorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex gap-4">
      {/* Chat History Sidebar */}
      <div className={`${showHistory ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden`}>
        <div className="bg-white rounded-2xl shadow-lg h-full p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-gray-900">
              <Clock className="size-5 text-blue-600" />
              Lịch sử trò chuyện
            </h3>
            <button
              onClick={() => setShowHistory(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="size-4 text-gray-600" />
            </button>
          </div>

          <button
            onClick={startNewChat}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all mb-4 flex items-center justify-center gap-2"
          >
            <MessageCircle className="size-4" />
            Cuộc trò chuyện mới
          </button>

          <div className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
            {chatHistories.map((history) => (
              <div
                key={history.id}
                onClick={() => loadChatHistory(history.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all group ${
                  currentChatId === history.id
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{history.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(history.lastUpdate)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteChatHistory(history.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-lg transition-all"
                  >
                    <Trash2 className="size-3 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
            
            {chatHistories.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">
                Chưa có lịch sử trò chuyện
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between relative">
          {/* Close Button X - Top Right with Text "X" */}
          <button
            onClick={onBack}
            className="absolute -top-2 right-4 p-2 bg-white hover:bg-gray-100 rounded-full transition-all shadow-md border border-gray-300 group z-20 w-8 h-8 flex items-center justify-center"
            title="Đóng"
          >
            <span className="text-gray-700 group-hover:text-gray-900 transition-colors">X</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="size-7 text-blue-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-white">Trợ lý VSTEP AI</h2>
                  <Sparkles className="size-4 text-yellow-300" />
                </div>
                <p className="text-sm text-blue-100">Luôn sẵn sàng hỗ trợ bạn 24/7</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors backdrop-blur-sm flex items-center gap-2 text-white mr-10"
          >
            <Clock className="size-4" />
            <span className="hidden md:inline">Lịch sử</span>
          </button>
        </div>

        {/* Banner */}
        <div className="relative h-40 overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
          <div className="relative h-full flex flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <Bot className="size-8 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-gray-900 flex items-center gap-2">
                  Trợ lý VSTEP AI
                  <Sparkles className="size-4 text-yellow-500" />
                </h3>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                  Người đồng hành thông minh hỗ trợ luyện Speaking, Writing, tạo đề thi, chấm bài và giải thích đáp án. Học tập 24/7 với trải nghiệm như có giáo viên riêng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width CTA Button */}
        <div className="px-6 py-4 bg-white border-b">
          <button
            onClick={() => inputRef.current?.focus()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
          >
            <Sparkles className="size-5 group-hover:rotate-12 transition-transform" />
            <span>Bắt đầu trò chuyện với AI - Hỏi bất cứ điều gì!</span>
            <MessageCircle className="size-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {message.type === 'ai' ? (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <Bot className="size-5 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                    <User className="size-5 text-white" />
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className={`flex-1 max-w-2xl ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white shadow-md border border-gray-100'
                  }`}
                >
                  <p className={`whitespace-pre-wrap ${message.type === 'user' ? 'text-white' : 'text-gray-800'}`}>
                    {message.content}
                  </p>
                </div>

                {/* Action Buttons */}
                {message.type === 'ai' && (
                  <div className="flex items-center gap-2 mt-2 px-2">
                    <button
                      onClick={() => handleCopy(message.content)}
                      className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors group"
                      title="Sao chép"
                    >
                      <Copy className="size-3 text-gray-500 group-hover:text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleRegenerate(message.id)}
                      className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors group"
                      title="Tạo lại câu trả lời"
                    >
                      <RotateCcw className="size-3 text-gray-500 group-hover:text-gray-700" />
                    </button>
                    <span className="text-xs text-gray-400 ml-1">
                      {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}

                {message.type === 'user' && (
                  <div className="flex items-center justify-end gap-2 mt-2 px-2">
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                <Bot className="size-5 text-white" />
              </div>
              <div className="bg-white shadow-md border border-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-6 py-4 bg-white border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-3">💡 Gợi ý câu hỏi:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(question)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          {/* Mic Permission Error */}
          {micPermissionError && (
            <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700">{micPermissionError}</p>
                <button
                  onClick={() => {
                    setMicPermissionError('');
                    handleStartRecording();
                  }}
                  className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                >
                  Thử lại
                </button>
              </div>
              <button
                onClick={() => setMicPermissionError('')}
                className="p-1 hover:bg-red-100 rounded transition-colors"
              >
                <X className="size-4 text-red-600" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".doc,.docx,.pdf"
              className="hidden"
            />
            
            <button
              onClick={handleFileUpload}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex-shrink-0"
              title="Tải lên file"
            >
              <Upload className="size-5 text-gray-600" />
            </button>

            <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Nhập câu hỏi của bạn..."
                className="w-full px-4 py-3 bg-transparent resize-none outline-none text-gray-800 placeholder-gray-500"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all flex-shrink-0"
            >
              <Send className="size-5 text-white" />
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Nhấn Enter để gửi • Shift + Enter để xuống dòng
          </p>
        </div>
      </div>
    </div>
  );
}