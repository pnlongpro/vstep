import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Search, Send, Paperclip, MoreVertical, Phone, Video, Users, UserPlus, Image as ImageIcon, Smile, Hash, ChevronDown, File, FileText, Download, X, Upload, CheckCircle, Music, Video as VideoIcon, Archive, Pin, Bell, Megaphone, RotateCcw } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  avatar: string;
  level: 'A2' | 'B1' | 'B2' | 'C1';
  online: boolean;
  lastSeen?: string;
  className: string;
}

interface ClassGroup {
  id: number;
  name: string;
  className: string;
  members: number;
  avatar: string;
}

interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online?: boolean;
  members?: number;
  className?: string;
  isPinned?: boolean;
}

interface FileAttachment {
  name: string;
  size: number;
  type: string;
  url?: string;
}

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  files?: FileAttachment[];
  image?: string;
  isPinned?: boolean;
  isAnnouncement?: boolean;
}

const mockStudents: Student[] = [
  { id: 1, name: 'Nguyễn Văn A', avatar: '👨‍🎓', level: 'B2', online: true, className: 'Lớp B2.1' },
  { id: 2, name: 'Trần Thị B', avatar: '👩‍🎓', level: 'B2', online: true, className: 'Lớp B2.1' },
  { id: 3, name: 'Lê Văn C', avatar: '👨‍💼', level: 'B2', online: false, lastSeen: '5 phút trước', className: 'Lớp B2.1' },
  { id: 4, name: 'Phạm Thị D', avatar: '👩‍💻', level: 'B1', online: false, lastSeen: '1 giờ trước', className: 'Lớp B1.2' },
  { id: 5, name: 'Hoàng Văn E', avatar: '👨‍🔬', level: 'B2', online: true, className: 'Lớp B2.1' },
  { id: 6, name: 'Đỗ Thị F', avatar: '👩‍🎨', level: 'B1', online: false, lastSeen: 'Hôm qua', className: 'Lớp B1.2' },
];

const mockClassGroups: ClassGroup[] = [
  { id: 1, name: 'VSTEP B2 - Lớp sáng', className: 'Lớp B2.1', members: 25, avatar: '📚' },
  { id: 2, name: 'VSTEP B1 - Lớp chiều', className: 'Lớp B1.2', members: 18, avatar: '📖' },
  { id: 3, name: 'VSTEP C1 - Lớp tối', className: 'Lớp C1.1', members: 12, avatar: '🎓' },
];

// Helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const getFileIcon = (fileType: string) => {
  if (fileType.includes('pdf')) return <FileText className="size-6 text-red-500" />;
  if (fileType.includes('word') || fileType.includes('doc')) return <FileText className="size-6 text-blue-500" />;
  if (fileType.includes('excel') || fileType.includes('sheet')) return <FileText className="size-6 text-green-500" />;
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return <FileText className="size-6 text-orange-500" />;
  if (fileType.includes('image')) return <ImageIcon className="size-6 text-purple-500" />;
  if (fileType.includes('video')) return <VideoIcon className="size-6 text-pink-500" />;
  if (fileType.includes('audio')) return <Music className="size-6 text-indigo-500" />;
  if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="size-6 text-yellow-500" />;
  return <File className="size-6 text-gray-500" />;
};

const getFileColor = (fileType: string) => {
  if (fileType.includes('pdf')) return 'bg-red-50 border-red-200';
  if (fileType.includes('word') || fileType.includes('doc')) return 'bg-blue-50 border-blue-200';
  if (fileType.includes('excel') || fileType.includes('sheet')) return 'bg-green-50 border-green-200';
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'bg-orange-50 border-orange-200';
  if (fileType.includes('image')) return 'bg-purple-50 border-purple-200';
  if (fileType.includes('video')) return 'bg-pink-50 border-pink-200';
  if (fileType.includes('audio')) return 'bg-indigo-50 border-indigo-200';
  if (fileType.includes('zip') || fileType.includes('rar')) return 'bg-yellow-50 border-yellow-200';
  return 'bg-gray-50 border-gray-200';
};

export function TeacherMessagesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'groups'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showMembersList, setShowMembersList] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<{[key: string]: Message[]}>({});
  const [showMessageMenu, setShowMessageMenu] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Mock conversations
  const conversations: Conversation[] = [
    {
      id: 'admin-support',
      type: 'direct',
      name: 'Admin VSTEPRO',
      avatar: '🛡️',
      lastMessage: 'Đã xử lý yêu cầu của thầy',
      timestamp: '10:33 AM',
      unread: 0,
      online: true,
      isPinned: true,
    },
    {
      id: 'class-b21',
      type: 'group',
      name: '📢 Lớp B2.1 - Sáng',
      avatar: '📚',
      lastMessage: 'Thầy: Nhớ nộp bài tập Writing nhé các em!',
      timestamp: '11:20 AM',
      unread: 0,
      members: 25,
      className: 'Lớp B2.1',
      isPinned: true,
    },
    {
      id: 'class-b12',
      type: 'group',
      name: '📢 Lớp B1.2 - Chiều',
      avatar: '📖',
      lastMessage: 'Phạm Thị D: Em có thắc mắc về bài giảng ạ',
      timestamp: '2 hours ago',
      unread: 2,
      members: 18,
      className: 'Lớp B1.2',
      isPinned: true,
    },
    {
      id: 1,
      type: 'direct',
      name: 'Nguyễn Văn A',
      avatar: '👨‍🎓',
      lastMessage: 'Em cảm ơn thầy đã giải đáp ạ!',
      timestamp: '1 hour ago',
      unread: 1,
      online: true,
    },
    {
      id: 2,
      type: 'direct',
      name: 'Trần Thị B',
      avatar: '👩‍🎓',
      lastMessage: 'Thầy cho em hỏi về Speaking Part 2',
      timestamp: '3 hours ago',
      unread: 0,
      online: true,
    },
    {
      id: 3,
      type: 'direct',
      name: 'Lê Văn C',
      avatar: '👨‍💼',
      lastMessage: 'Em đã nộp bài rồi ạ',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
    },
  ];

  // Messages for Class B2.1
  const classB21Messages: Message[] = [
    {
      id: 1,
      senderId: 0,
      senderName: 'Thầy Minh',
      senderAvatar: '👨‍🏫',
      content: '📢 THÔNG BÁO QUAN TRỌNG\n\nCác em chú ý:\n\n📝 Bài tập Writing Task 2 cần nộp trước 18h ngày mai\n📚 Đề bài: "Some people believe technology makes life easier. Discuss."\n📏 Yêu cầu: Tối thiểu 250 từ\n\nChúc các em làm bài tốt! 💪',
      timestamp: '11:20 AM',
      isMe: true,
      isAnnouncement: true,
      isPinned: true,
    },
    {
      id: 2,
      senderId: 1,
      senderName: 'Nguyễn Văn A',
      senderAvatar: '👨‍🎓',
      content: 'Dạ em hiểu rồi ạ. Em sẽ nộp đúng hạn!',
      timestamp: '11:25 AM',
      isMe: false,
    },
    {
      id: 3,
      senderId: 2,
      senderName: 'Trần Thị B',
      senderAvatar: '👩‍🎓',
      content: 'Thầy ơi, em có thể gửi outline trước để thầy xem được không ạ?',
      timestamp: '11:30 AM',
      isMe: false,
    },
    {
      id: 4,
      senderId: 0,
      senderName: 'Thầy Minh',
      senderAvatar: '👨‍🏫',
      content: 'Được chứ em! Em gửi vào email hoặc inbox trực tiếp cho thầy nhé.',
      timestamp: '11:35 AM',
      isMe: true,
    },
    {
      id: 5,
      senderId: 0,
      senderName: 'Thầy Minh',
      senderAvatar: '👨‍🏫',
      content: 'Thầy gửi cho các em tài liệu tham khảo về Writing Task 2:',
      timestamp: '11:40 AM',
      isMe: true,
      files: [
        { name: 'Writing_Task2_Guidelines.pdf', size: 2097152, type: 'application/pdf' },
        { name: 'Sample_Essays_Band_7-8.pdf', size: 3145728, type: 'application/pdf' },
        { name: 'Linking_Words_Advanced.docx', size: 524288, type: 'application/msword' },
      ],
    },
    {
      id: 6,
      senderId: 5,
      senderName: 'Hoàng Văn E',
      senderAvatar: '👨‍🔬',
      content: 'Cảm ơn thầy rất nhiều ạ! 🙏',
      timestamp: '11:45 AM',
      isMe: false,
    },
  ];

  // Messages for Student A
  const studentAMessages: Message[] = [
    {
      id: 1,
      senderId: 1,
      senderName: 'Nguyễn Văn A',
      senderAvatar: '👨‍🎓',
      content: 'Thầy ơi, em có thắc mắc về bài Writing hôm qua ạ',
      timestamp: '10:00 AM',
      isMe: false,
    },
    {
      id: 2,
      senderId: 0,
      senderName: 'Thầy Minh',
      senderAvatar: '👨‍🏫',
      content: 'Chào em! Thầy nghe đây, em thắc mắc gì?',
      timestamp: '10:05 AM',
      isMe: true,
    },
    {
      id: 3,
      senderId: 1,
      senderName: 'Nguyễn Văn A',
      senderAvatar: '👨‍🎓',
      content: 'Em không rõ phần Task Achievement, thầy có thể giải thích thêm không ạ?',
      timestamp: '10:10 AM',
      isMe: false,
    },
    {
      id: 4,
      senderId: 0,
      senderName: 'Thầy Minh',
      senderAvatar: '👨‍🏫',
      content: '📝 Task Achievement đánh giá những điểm sau:\n\n1️⃣ Trả lời đúng câu hỏi đề bài\n2️⃣ Phát triển ý đầy đủ và logic\n3️⃣ Đưa ra ví dụ cụ thể\n4️⃣ Đạt độ dài yêu cầu (150/250 từ)\n\nEm cần chú ý phân tích kỹ đề bài trước khi viết nhé!',
      timestamp: '10:15 AM',
      isMe: true,
    },
    {
      id: 5,
      senderId: 1,
      senderName: 'Nguyễn Văn A',
      senderAvatar: '👨‍🎓',
      content: 'Dạ em hiểu rồi ạ. Thầy có tài liệu mẫu không ạ?',
      timestamp: '10:20 AM',
      isMe: false,
    },
    {
      id: 6,
      senderId: 0,
      senderName: 'Thầy Minh',
      senderAvatar: '👨‍🏫',
      content: 'Có em, thầy gửi cho em nhé:',
      timestamp: '10:25 AM',
      isMe: true,
      files: [
        { name: 'Task_Achievement_Examples.pdf', size: 1572864, type: 'application/pdf' },
        { name: 'Band_Score_Rubrics.docx', size: 786432, type: 'application/msword' },
      ],
    },
    {
      id: 7,
      senderId: 1,
      senderName: 'Nguyễn Văn A',
      senderAvatar: '👨‍🎓',
      content: 'Em cảm ơn thầy đã giải đáp ạ! Em sẽ học kỹ hơn 🙏',
      timestamp: '10:30 AM',
      isMe: false,
    },
  ];

  // Messages for Admin
  const adminMessages: Message[] = [
    {
      id: 1,
      senderId: 998,
      senderName: 'Admin VSTEPRO',
      senderAvatar: '🛡️',
      content: 'Xin chào thầy! Admin có thể hỗ trợ gì cho thầy không ạ?',
      timestamp: '9:00 AM',
      isMe: false,
    },
    {
      id: 2,
      senderId: 0,
      senderName: 'Thầy Minh',
      senderAvatar: '👨‍🏫',
      content: 'Chào admin, tôi muốn yêu cầu thêm tài khoản học sinh vào lớp B2.1',
      timestamp: '9:05 AM',
      isMe: true,
    },
    {
      id: 3,
      senderId: 998,
      senderName: 'Admin VSTEPRO',
      senderAvatar: '🛡️',
      content: 'Dạ được ạ! Thầy vui lòng gửi danh sách học sinh (tên + email) để admin xử lý nhé.',
      timestamp: '9:10 AM',
      isMe: false,
    },
    {
      id: 4,
      senderId: 0,
      senderName: 'Thầy Minh',
      senderAvatar: '👨‍🏫',
      content: 'Đây là danh sách:',
      timestamp: '9:15 AM',
      isMe: true,
      files: [
        { name: 'Danh_sách_học_sinh_mới.xlsx', size: 45056, type: 'application/vnd.ms-excel' },
      ],
    },
    {
      id: 5,
      senderId: 998,
      senderName: 'Admin VSTEPRO',
      senderAvatar: '🛡️',
      content: 'Dạ admin đã nhận được file. Sẽ xử lý trong vòng 24h và thông báo lại cho thầy ạ! ✅',
      timestamp: '9:20 AM',
      isMe: false,
    },
    {
      id: 6,
      senderId: 0,
      senderName: 'Thầy Minh',
      senderAvatar: '👨‍🏫',
      content: 'Cảm ơn admin nhiều nhé!',
      timestamp: '9:25 AM',
      isMe: true,
    },
  ];

  const mockMessages: Message[] = [
    {
      id: 1,
      senderId: 2,
      senderName: 'Trần Thị B',
      senderAvatar: '👩‍🎓',
      content: 'Thầy cho em hỏi về Speaking Part 2 ạ',
      timestamp: '3:00 PM',
      isMe: false,
    },
    {
      id: 2,
      senderId: 0,
      senderName: 'Thầy Minh',
      senderAvatar: '👨‍🏫',
      content: 'Chào em! Em có thắc mắc gì về Part 2?',
      timestamp: '3:05 PM',
      isMe: true,
    },
  ];

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'students') return matchesSearch && conv.type === 'direct';
    if (activeTab === 'groups') return matchesSearch && conv.type === 'group';
    return matchesSearch;
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (messageInput.trim() || selectedFiles.length > 0) {
      console.log('Sending message:', messageInput);
      console.log('Attached files:', selectedFiles);
      setMessageInput('');
      setSelectedFiles([]);
    }
  };

  const getCurrentMessages = () => {
    if (!selectedConversation) return [];
    
    switch (selectedConversation.id) {
      case 'class-b21':
        return classB21Messages;
      case 'admin-support':
        return adminMessages;
      case '1':
        return studentAMessages;
      default:
        return mockMessages;
    }
  };

  const currentMessages = getCurrentMessages();

  // Auto-select first conversation on mount
  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0]);
    }
  }, []);

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6">
      {/* Left Sidebar */}
      <div className="w-80 flex-shrink-0 bg-white rounded-xl shadow-sm border-2 border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Tin nhắn</h2>
            <button className="p-2 hover:bg-emerald-50 rounded-lg transition-colors">
              <UserPlus className="size-5 text-emerald-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'students'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Học sinh
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'groups'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lớp học
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'students' && searchTerm === '' && (
            <>
              {/* Online Students Section */}
              <div className="p-3 bg-green-50 border-b border-green-100">
                <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Đang online ({mockStudents.filter(m => m.online).length})
                </div>
              </div>
              
              {mockStudents
                .filter(student => student.online)
                .map(student => (
                  <button
                    key={`online-${student.id}`}
                    onClick={() => {
                      const conv = conversations.find(c => c.name === student.name);
                      if (conv) setSelectedConversation(conv);
                    }}
                    className="w-full p-4 border-b border-gray-100 hover:bg-emerald-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-2xl">
                          {student.avatar}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-xs text-green-600">Đang online</div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        {student.level}
                      </span>
                    </div>
                  </button>
                ))}

              {/* Offline Students Section */}
              {mockStudents.filter(m => !m.online).length > 0 && (
                <>
                  <div className="p-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      Không hoạt động ({mockStudents.filter(m => !m.online).length})
                    </div>
                  </div>
                  
                  {mockStudents
                    .filter(student => !student.online)
                    .map(student => (
                      <button
                        key={`offline-${student.id}`}
                        onClick={() => {
                          const conv = conversations.find(c => c.name === student.name);
                          if (conv) setSelectedConversation(conv);
                        }}
                        className="w-full p-4 border-b border-gray-100 hover:bg-emerald-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-2xl opacity-70">
                              {student.avatar}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-xs text-gray-500">{student.lastSeen}</div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {student.level}
                          </span>
                        </div>
                      </button>
                    ))}
                </>
              )}
            </>
          )}

          {activeTab === 'groups' && searchTerm === '' && (
            <>
              <div className="p-3 bg-emerald-50 border-b border-emerald-100">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                  <Hash className="size-4" />
                  Lớp học ({mockClassGroups.length})
                </div>
              </div>
              
              {mockClassGroups.map(group => (
                <button
                  key={group.id}
                  onClick={() => {
                    const conv = conversations.find(c => c.name.includes(group.name));
                    if (conv) setSelectedConversation(conv);
                  }}
                  className="w-full p-4 border-b border-gray-100 hover:bg-emerald-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-2xl">
                      {group.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{group.name}</div>
                      <div className="text-xs text-gray-500">{group.members} học sinh</div>
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}

          {(activeTab === 'all' || searchTerm !== '') && (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 border-b border-gray-100 hover:bg-emerald-50 transition-colors text-left ${
                  selectedConversation?.id === conv.id ? 'bg-emerald-50 border-l-4 border-l-emerald-600' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 bg-gradient-to-br ${conv.type === 'group' ? 'from-emerald-500 to-teal-500' : 'from-emerald-500 to-blue-500'} rounded-full flex items-center justify-center text-2xl`}>
                      {conv.avatar}
                    </div>
                    {conv.type === 'direct' && conv.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                    {conv.isPinned && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                        <Pin className="size-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-medium text-gray-900 truncate">{conv.name}</h3>
                        {conv.isPinned && (
                          <Pin className="size-3.5 text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conv.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                  </div>

                  {/* Unread Badge */}
                  {conv.unread > 0 && (
                    <div className="flex-shrink-0">
                      <span className="bg-emerald-600 text-white text-xs rounded-full px-2 py-0.5 font-medium">
                        {conv.unread}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 bg-white rounded-xl shadow-sm border-2 border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b-2 border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-12 h-12 bg-gradient-to-br ${selectedConversation.type === 'group' ? 'from-emerald-500 to-teal-500' : 'from-emerald-500 to-blue-500'} rounded-full flex items-center justify-center text-2xl`}>
                  {selectedConversation.avatar}
                </div>
                {selectedConversation.type === 'direct' && selectedConversation.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedConversation.name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedConversation.type === 'group' 
                    ? `${selectedConversation.members} học sinh` 
                    : selectedConversation.online ? 'Đang hoạt động' : 'Không hoạt động'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {selectedConversation.type === 'group' && (
                <button 
                  onClick={() => setShowMembersList(!showMembersList)}
                  className="px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-gray-700"
                >
                  <Users className="size-5" />
                  <span className="text-sm">Học sinh</span>
                </button>
              )}
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Phone className="size-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Video className="size-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="size-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-emerald-50">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[70%] ${message.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!message.isMe && (
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                      {message.senderAvatar}
                    </div>
                  )}
                  <div className="flex-1">
                    {!message.isMe && selectedConversation.type === 'group' && (
                      <p className="text-xs text-gray-600 mb-1 ml-2">{message.senderName}</p>
                    )}
                    
                    {/* Text Message */}
                    {message.content && (
                      <div
                        className={`px-4 py-2.5 rounded-2xl ${
                          message.isMe
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                      </div>
                    )}

                    {/* Image Attachment */}
                    {message.image && (
                      <div className={`mt-2 ${message.content ? '' : ''}`}>
                        <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm max-w-sm">
                          <img 
                            src={message.image} 
                            alt="Shared image" 
                            className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                          />
                        </div>
                      </div>
                    )}

                    {/* File Attachments */}
                    {message.files && message.files.length > 0 && (
                      <div className={`space-y-2 ${message.content || message.image ? 'mt-2' : ''}`}>
                        {message.files.map((file, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 ${getFileColor(file.type)} ${
                              message.isMe ? '' : 'bg-white'
                            } shadow-sm hover:shadow-md transition-shadow cursor-pointer group`}
                          >
                            <div className="flex-shrink-0">
                              {getFileIcon(file.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                            <button className="flex-shrink-0 p-1.5 hover:bg-gray-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                              <Download className="size-4 text-gray-600" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className={`text-xs text-gray-500 mt-1 ${message.isMe ? 'text-right' : 'text-left'} ml-2`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t-2 border-gray-200 bg-gray-50">
            {/* File Preview Area */}
            {selectedFiles.length > 0 && (
              <div className="mb-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-emerald-900">
                    {selectedFiles.length} file đã chọn
                  </span>
                  <button
                    onClick={() => setSelectedFiles([])}
                    className="text-xs text-emerald-600 hover:text-emerald-800"
                  >
                    Xóa tất cả
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 bg-white rounded-lg border border-emerald-200"
                    >
                      <div className="flex-shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="flex-shrink-0 p-1 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="size-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="flex items-end gap-2">
              <div className="flex gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-emerald-100 rounded-lg transition-colors group relative" 
                  title="Đính kèm file"
                >
                  <Paperclip className="size-5 text-gray-600 group-hover:text-emerald-600" />
                </button>
                
                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*"
                />
                <button 
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 hover:bg-purple-100 rounded-lg transition-colors group relative" 
                  title="Gửi ảnh"
                >
                  <ImageIcon className="size-5 text-gray-600 group-hover:text-purple-600" />
                </button>
                
                <button className="p-2 hover:bg-yellow-100 rounded-lg transition-colors group relative" title="Emoji">
                  <Smile className="size-5 text-gray-600 group-hover:text-yellow-600" />
                </button>
              </div>
              
              <textarea
                placeholder="Nhập tin nhắn..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                style={{ minHeight: '42px', maxHeight: '120px' }}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() && selectedFiles.length === 0}
                className="p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                <Send className="size-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-xl shadow-sm border-2 border-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="size-12 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chào mừng đến Tin nhắn</h3>
            <p className="text-gray-600 mb-4">Chọn một cuộc trò chuyện bên trái để bắt đầu</p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                <span>{mockStudents.length} học sinh</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="size-4" />
                <span>{mockClassGroups.length} lớp học</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members List Sidebar (for group chats) */}
      {showMembersList && selectedConversation?.type === 'group' && (
        <div className="w-64 flex-shrink-0 bg-white rounded-xl shadow-sm border-2 border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Học sinh</h3>
            <button 
              onClick={() => setShowMembersList(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronDown className="size-4 text-gray-600" />
            </button>
          </div>
          <div className="space-y-2">
            {mockStudents.slice(0, selectedConversation.members || 6).map(student => (
              <div key={student.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-lg">
                    {student.avatar}
                  </div>
                  {student.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{student.name}</div>
                  <div className="text-xs text-gray-500">{student.online ? 'Online' : 'Offline'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}