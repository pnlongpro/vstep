import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Search, Send, Paperclip, MoreVertical, Phone, Video, Users, UserPlus, Image as ImageIcon, Smile, Hash, ChevronDown, File, FileText, Download, X, Upload, CheckCircle, Music, Video as VideoIcon, Archive, Pin, Bell, Shield, RotateCcw } from 'lucide-react';

interface User {
  id: number;
  name: string;
  avatar: string;
  role: 'student' | 'teacher';
  online: boolean;
  lastSeen?: string;
}

interface Conversation {
  id: string;
  type: 'direct' | 'broadcast' | 'class';
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online?: boolean;
  recipients?: number;
  isPinned?: boolean;
  userRole?: 'student' | 'teacher' | 'all';
  className?: string;
  studentCount?: number;
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

const mockUsers: User[] = [
  { id: 1, name: 'GV Minh', avatar: '👨‍🏫', role: 'teacher', online: true },
  { id: 2, name: 'GV Hương', avatar: '👩‍🏫', role: 'teacher', online: true },
  { id: 3, name: 'Nguyễn Văn A', avatar: '👨‍🎓', role: 'student', online: false, lastSeen: '5 phút trước' },
  { id: 4, name: 'Trần Thị B', avatar: '👩‍🎓', role: 'student', online: false, lastSeen: '1 giờ trước' },
  { id: 5, name: 'Lê Văn C', avatar: '👨‍💼', role: 'student', online: true },
  { id: 6, name: 'Phạm Thị D', avatar: '👩‍💻', role: 'student', online: false, lastSeen: 'Hôm qua' },
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

export function AdminMessagesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'teachers' | 'students' | 'broadcast' | 'classes'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<{[key: string]: Message[]}>({});
  const [showMessageMenu, setShowMessageMenu] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Mock conversations
  const conversations: Conversation[] = [
    {
      id: 'broadcast-all',
      type: 'broadcast',
      name: '📢 Thông báo toàn hệ thống',
      avatar: '📢',
      lastMessage: 'Admin: Bảo trì hệ thống vào chủ nhật',
      timestamp: '1 hour ago',
      unread: 0,
      recipients: 2890,
      isPinned: true,
      userRole: 'all',
    },
    // Class Groups
    {
      id: 'class-a21',
      type: 'class',
      name: 'Lớp A2.1 - Sáng T2,T4,T6',
      avatar: '🎓',
      lastMessage: 'Admin: Nhắc nhở nộp bài tập tuần 3',
      timestamp: '30 mins ago',
      unread: 0,
      className: 'A2.1',
      studentCount: 25,
      isPinned: true,
    },
    {
      id: 'class-b12',
      type: 'class',
      name: 'Lớp B1.2 - Chiều T3,T5,T7',
      avatar: '📚',
      lastMessage: 'GV Hương: Chuẩn bị thi giữa kỳ',
      timestamp: '2 hours ago',
      unread: 3,
      className: 'B1.2',
      studentCount: 32,
    },
    {
      id: 'class-b21',
      type: 'class',
      name: 'Lớp B2.1 - Tối T2,T4,T6',
      avatar: '📖',
      lastMessage: 'GV Minh: Kết quả kiểm tra đã có',
      timestamp: '5 hours ago',
      unread: 0,
      className: 'B2.1',
      studentCount: 28,
    },
    {
      id: 'class-c11',
      type: 'class',
      name: 'Lớp C1.1 - Cuối tuần',
      avatar: '🏆',
      lastMessage: 'Admin: Chúc mừng 90% đạt C1',
      timestamp: 'Yesterday',
      unread: 0,
      className: 'C1.1',
      studentCount: 18,
    },
    {
      id: 'teacher-1',
      type: 'direct',
      name: 'GV Minh',
      avatar: '👨‍🏫',
      lastMessage: 'Em cần hỗ trợ thêm tài khoản học sinh',
      timestamp: '2 hours ago',
      unread: 1,
      online: true,
      userRole: 'teacher',
    },
    {
      id: 'teacher-2',
      type: 'direct',
      name: 'GV Hương',
      avatar: '👩‍🏫',
      lastMessage: 'Cảm ơn admin đã hỗ trợ!',
      timestamp: '3 hours ago',
      unread: 0,
      online: true,
      userRole: 'teacher',
    },
    {
      id: 'student-1',
      type: 'direct',
      name: 'Nguyễn Văn A',
      avatar: '👨‍🎓',
      lastMessage: 'Em muốn nâng cấp lên Premium',
      timestamp: 'Yesterday',
      unread: 2,
      online: false,
      userRole: 'student',
    },
    {
      id: 'student-2',
      type: 'direct',
      name: 'Trần Thị B',
      avatar: '👩‍🎓',
      lastMessage: 'Em quên mật khẩu rồi ạ',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
      userRole: 'student',
    },
  ];

  // Broadcast messages
  const broadcastMessages: Message[] = [
    {
      id: 1,
      senderId: 0,
      senderName: 'Admin VSTEPRO',
      senderAvatar: '🛡️',
      content: '📢 THÔNG BÁO BẢO TRÌ HỆ THỐNG\n\nHệ thống sẽ tạm ngừng hoạt động để bảo trì:\n\n🕐 Thời gian: Chủ nhật, 15/12/2025\n⏰ Từ: 00:00 - 06:00 AM\n\n📌 Lưu ý:\n- Vui lòng lưu lại tiến độ học tập trước 23:59 thứ 7\n- Hệ thống sẽ hoạt động trở lại vào 6h sáng\n- Mọi thắc mắc vui lòng liên hệ support@vstepro.vn\n\nCảm ơn các bạn đã thông cảm! 🙏',
      timestamp: '1 hour ago',
      isMe: true,
      isAnnouncement: true,
      isPinned: true,
    },
  ];

  // Teacher messages
  const teacherMessages: Message[] = [
    {
      id: 1,
      senderId: 1,
      senderName: 'GV Minh',
      senderAvatar: '👨‍🏫',
      content: 'Chào admin! Em cần hỗ trợ thêm tài khoản học sinh vào lớp B2.1 ạ',
      timestamp: '2:00 PM',
      isMe: false,
    },
    {
      id: 2,
      senderId: 0,
      senderName: 'Admin',
      senderAvatar: '🛡️',
      content: 'Chào thầy Minh! Thầy gửi danh sách học sinh (tên + email) cho admin nhé.',
      timestamp: '2:05 PM',
      isMe: true,
    },
    {
      id: 3,
      senderId: 1,
      senderName: 'GV Minh',
      senderAvatar: '👨‍🏫',
      content: 'Dạ em gửi file danh sách đây ạ:',
      timestamp: '2:10 PM',
      isMe: false,
      files: [
        { name: 'Danh_sách_học_sinh_mới.xlsx', size: 45056, type: 'application/vnd.ms-excel' },
      ],
    },
    {
      id: 4,
      senderId: 0,
      senderName: 'Admin',
      senderAvatar: '🛡️',
      content: 'Admin đã nhận được file. Sẽ xử lý trong 24h và thông báo lại cho thầy nhé! ✅',
      timestamp: '2:15 PM',
      isMe: true,
    },
    {
      id: 5,
      senderId: 1,
      senderName: 'GV Minh',
      senderAvatar: '👨‍🏫',
      content: 'Em cảm ơn admin nhiều ạ!',
      timestamp: '2:20 PM',
      isMe: false,
    },
  ];

  // Student messages
  const studentMessages: Message[] = [
    {
      id: 1,
      senderId: 3,
      senderName: 'Nguyễn Văn A',
      senderAvatar: '👨‍🎓',
      content: 'Chào admin! Em muốn nâng cấp tài khoản lên Premium ạ',
      timestamp: '10:00 AM',
      isMe: false,
    },
    {
      id: 2,
      senderId: 0,
      senderName: 'Admin',
      senderAvatar: '🛡️',
      content: 'Chào bạn! Bạn có thể nâng cấp Premium theo 2 cách:\n\n1️⃣ Thanh toán online qua:\n- MoMo\n- ZaloPay\n- Chuyển khoản ngân hàng\n\n2️⃣ Liên hệ trực tiếp:\n- Hotline: 1900 xxxx\n- Email: premium@vstepro.vn\n\nGói Premium: 299.000đ/tháng\n💎 Ưu đãi: Giảm 20% khi đăng ký 6 tháng!',
      timestamp: '10:05 AM',
      isMe: true,
    },
    {
      id: 3,
      senderId: 0,
      senderName: 'Admin',
      senderAvatar: '🛡️',
      content: 'Em gửi bạn file hướng dẫn chi tiết nhé:',
      timestamp: '10:10 AM',
      isMe: true,
      files: [
        { name: 'Hướng_dẫn_nâng_cấp_Premium.pdf', size: 1572864, type: 'application/pdf' },
        { name: 'Bảng_giá_các_gói.pdf', size: 524288, type: 'application/pdf' },
      ],
    },
    {
      id: 4,
      senderId: 3,
      senderName: 'Nguyễn Văn A',
      senderAvatar: '👨‍🎓',
      content: 'Cảm ơn admin rất nhiều! Em sẽ xem và quyết định ạ 🙏',
      timestamp: '10:15 AM',
      isMe: false,
    },
  ];

  const mockMessages: Message[] = [
    {
      id: 1,
      senderId: 4,
      senderName: 'Trần Thị B',
      senderAvatar: '👩‍🎓',
      content: 'Admin ơi, em quên mật khẩu rồi ạ',
      timestamp: '3:00 PM',
      isMe: false,
    },
    {
      id: 2,
      senderId: 0,
      senderName: 'Admin',
      senderAvatar: '🛡️',
      content: 'Bạn vui lòng click vào "Quên mật khẩu" ở trang đăng nhập và làm theo hướng dẫn nhé!',
      timestamp: '3:05 PM',
      isMe: true,
    },
  ];

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'teachers') return matchesSearch && conv.userRole === 'teacher';
    if (activeTab === 'students') return matchesSearch && conv.userRole === 'student';
    if (activeTab === 'broadcast') return matchesSearch && conv.type === 'broadcast';
    if (activeTab === 'classes') return matchesSearch && conv.type === 'class';
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

  // Handle pin message
  const handlePinMessage = (conversationId: string, messageId: number) => {
    const updatedMessages = { ...messages };
    if (updatedMessages[conversationId]) {
      updatedMessages[conversationId] = updatedMessages[conversationId].map(msg =>
        msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
      );
      setMessages(updatedMessages);
    }
  };

  // Handle recall (delete) message
  const handleRecallMessage = (conversationId: string, messageId: number) => {
    if (confirm('Bạn có chắc chắn muốn thu hồi tin nhắn này? Tin nhắn sẽ bị xóa vĩnh viễn.')) {
      const updatedMessages = { ...messages };
      if (updatedMessages[conversationId]) {
        updatedMessages[conversationId] = updatedMessages[conversationId].filter(msg => msg.id !== messageId);
        setMessages(updatedMessages);
      }
    }
  };

  const getCurrentMessages = () => {
    if (!selectedConversation) return [];
    
    switch (selectedConversation.id) {
      case 'broadcast-all':
        return broadcastMessages;
      case 'teacher-1':
        return teacherMessages;
      case 'student-1':
        return studentMessages;
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
            <h2 className="text-xl font-bold text-gray-900">Tin nhắn hệ thống</h2>
            <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors">
              <Bell className="size-5 text-purple-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveTab('broadcast')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'broadcast'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Broadcast
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'teachers'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Giáo viên
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'students'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Học sinh
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'classes'
                  ? 'bg-white text-purple-600 shadow-sm'
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full p-4 border-b border-gray-100 hover:bg-purple-50 transition-colors text-left ${
                selectedConversation?.id === conv.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 bg-gradient-to-br ${conv.type === 'broadcast' ? 'from-purple-500 to-pink-500' : 'from-purple-500 to-blue-500'} rounded-full flex items-center justify-center text-2xl`}>
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
                  {conv.type === 'broadcast' && (
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="size-3 text-purple-600" />
                      <span className="text-xs text-purple-600">{conv.recipients} người nhận</span>
                    </div>
                  )}
                  {conv.type === 'class' && (
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="size-3 text-blue-600" />
                      <span className="text-xs text-blue-600">{conv.studentCount} học sinh</span>
                    </div>
                  )}
                </div>

                {/* Unread Badge */}
                {conv.unread > 0 && (
                  <div className="flex-shrink-0">
                    <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-0.5 font-medium">
                      {conv.unread}
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 bg-white rounded-xl shadow-sm border-2 border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b-2 border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-12 h-12 bg-gradient-to-br ${selectedConversation.type === 'broadcast' ? 'from-purple-500 to-pink-500' : 'from-purple-500 to-blue-500'} rounded-full flex items-center justify-center text-2xl`}>
                  {selectedConversation.avatar}
                </div>
                {selectedConversation.type === 'direct' && selectedConversation.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedConversation.name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedConversation.type === 'broadcast' 
                    ? `${selectedConversation.recipients} người nhận` 
                    : selectedConversation.online ? 'Đang hoạt động' : 'Không hoạt động'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="size-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-purple-50">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'} group relative`}
              >
                <div className={`flex items-end gap-2 max-w-[70%] ${message.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!message.isMe && (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                      {message.senderAvatar}
                    </div>
                  )}
                  <div className="flex-1 relative">
                    {/* Pin Badge */}
                    {message.isPinned && (
                      <div className={`flex items-center gap-1 mb-1 ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                        <Pin className="size-3 text-yellow-500" />
                        <span className="text-xs text-yellow-600 font-medium">Tin nhắn đã ghim</span>
                      </div>
                    )}
                    
                    {!message.isMe && (
                      <p className="text-xs text-gray-600 mb-1 ml-2">{message.senderName}</p>
                    )}
                    
                    {/* Message Content Wrapper with Menu Button */}
                    <div className="relative group/message">
                      {/* Text Message */}
                      {message.content && (
                        <div
                          className={`px-4 py-2.5 rounded-2xl ${
                            message.isMe
                              ? 'bg-purple-600 text-white'
                              : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                        </div>
                      )}

                      {/* File Attachments */}
                      {message.files && message.files.length > 0 && (
                        <div className={`space-y-2 ${message.content ? 'mt-2' : ''}`}>
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

                      {/* Message Actions Dropdown - Only show on message hover */}
                      <div className={`absolute top-0 ${message.isMe ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} opacity-0 group-hover/message:opacity-100 transition-opacity`}>
                        <div className="relative">
                          <button
                            onClick={() => setShowMessageMenu(showMessageMenu === message.id ? null : message.id)}
                            className="p-1.5 bg-white hover:bg-gray-100 rounded-lg shadow-md border border-gray-200 transition-colors ml-2"
                            title="Tùy chọn"
                          >
                            <MoreVertical className="size-4 text-gray-600" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {showMessageMenu === message.id && (
                            <div className="absolute top-0 right-full mr-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[160px]">
                              <button
                                onClick={() => {
                                  handlePinMessage(selectedConversation?.id || '', message.id);
                                  setShowMessageMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                              >
                                <Pin className="size-4" />
                                {message.isPinned ? 'Bỏ ghim' : 'Ghim tin nhắn'}
                              </button>
                              <button
                                onClick={() => {
                                  handleRecallMessage(selectedConversation?.id || '', message.id);
                                  setShowMessageMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
                              >
                                <RotateCcw className="size-4" />
                                Thu hồi tin nhắn
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

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
              <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-900">
                    {selectedFiles.length} file đã chọn
                  </span>
                  <button
                    onClick={() => setSelectedFiles([])}
                    className="text-xs text-purple-600 hover:text-purple-800"
                  >
                    Xóa tất cả
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 bg-white rounded-lg border border-purple-200"
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
                  className="p-2 hover:bg-purple-100 rounded-lg transition-colors group relative" 
                  title="Đính kèm file"
                >
                  <Paperclip className="size-5 text-gray-600 group-hover:text-purple-600" />
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
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                style={{ minHeight: '42px', maxHeight: '120px' }}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() && selectedFiles.length === 0}
                className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                <Send className="size-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-xl shadow-sm border-2 border-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="size-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chào mừng đến Tin nhắn Admin</h3>
            <p className="text-gray-600 mb-4">Chọn một cuộc trò chuyện bên trái để bắt đầu</p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="size-4" />
                <span>Admin Panel</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}