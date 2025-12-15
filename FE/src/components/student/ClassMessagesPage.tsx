import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Search, Send, Paperclip, MoreVertical, Phone, Video, Users, UserPlus, Image as ImageIcon, Smile, Hash, ChevronDown, File, FileText, Download, X, Upload, CheckCircle, Music, Video as VideoIcon, Archive, Pin, Bell, Megaphone } from 'lucide-react';

interface ClassMate {
  id: number;
  name: string;
  avatar: string;
  level: 'A2' | 'B1' | 'B2' | 'C1';
  online: boolean;
  lastSeen?: string;
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
  isFromTeacher?: boolean;
}

const mockClassMates: ClassMate[] = [
  { id: 1, name: 'Nguyễn Văn A', avatar: '👨‍🎓', level: 'B2', online: true },
  { id: 2, name: 'Trần Thị B', avatar: '👩‍🎓', level: 'B2', online: true },
  { id: 3, name: 'Lê Văn C', avatar: '👨‍💼', level: 'B2', online: false, lastSeen: '5 phút trước' },
  { id: 4, name: 'Phạm Thị D', avatar: '👩‍💻', level: 'B2', online: false, lastSeen: '1 giờ trước' },
  { id: 5, name: 'Hoàng Văn E', avatar: '👨‍🔬', level: 'B2', online: true },
  { id: 6, name: 'Đỗ Thị F', avatar: '👩‍🎨', level: 'B2', online: false, lastSeen: 'Hôm qua' },
];

const mockClassGroups: ClassGroup[] = [
  { id: 1, name: 'VSTEP B2 - Lớp sáng', className: 'Lớp B2.1', members: 25, avatar: '📚' },
  { id: 2, name: 'Nhóm học Speaking', className: 'Lớp B2.1', members: 8, avatar: '🗣️' },
  { id: 3, name: 'Writing Practice Group', className: 'Lớp B2.1', members: 6, avatar: '✍️' },
];

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Helper function to get file icon
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

// Helper function to get file color
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

export function ClassMessagesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'classmates' | 'groups'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showMembersList, setShowMembersList] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Mock conversations
  const conversations: Conversation[] = [
    {
      id: 'admin-support',
      type: 'direct',
      name: 'Admin VSTEPRO',
      avatar: '🛡️',
      lastMessage: 'Tài khoản Premium có giá 299.000đ/tháng...',
      timestamp: '10:33 AM',
      unread: 0,
      online: true,
      isPinned: true,
    },
    {
      id: 'teacher-main',
      type: 'direct',
      name: 'GV Minh',
      avatar: '👨‍🏫',
      lastMessage: 'Các em chuẩn bị tốt cho bài thi nhé!',
      timestamp: '11:20 AM',
      unread: 1,
      online: true,
      isPinned: true,
    },
    {
      id: 'class-general',
      type: 'group',
      name: '📢 Thông báo chung - Lớp B2.1',
      avatar: '📢',
      lastMessage: 'GV Minh: Thông báo lịch thi giữa kỳ',
      timestamp: '2 hours ago',
      unread: 3,
      members: 25,
      className: 'Lớp B2.1',
      isPinned: true,
    },
    {
      id: 1,
      type: 'direct',
      name: 'Nguyễn Văn A',
      avatar: '👨‍🎓',
      lastMessage: 'Bạn có thể giải thích thêm về Part 3 không?',
      timestamp: '1 hour ago',
      unread: 2,
      online: true,
    },
    {
      id: 'class-group',
      type: 'group',
      name: '📚 VSTEP B2 - Lớp sáng',
      avatar: '📚',
      lastMessage: 'Hôm nay học Writing Task 2 nhé các bạn!',
      timestamp: '3 hours ago',
      unread: 5,
      members: 18,
      className: 'Lớp B2.1',
      isPinned: true,
    },
    {
      id: 2,
      type: 'direct',
      name: 'Trần Thị B',
      avatar: '👩‍🎓',
      lastMessage: 'Thanks bạn! Mình đã hiểu rồi 😊',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
    },
    {
      id: 5,
      type: 'group',
      name: '🗣️ Nhóm học Speaking',
      avatar: '🗣️',
      lastMessage: 'Lê Văn C: Đây là link Zoom...',
      timestamp: 'Yesterday',
      unread: 1,
      members: 6,
    },
  ];

  const classGeneralMessages: Message[] = [
    {
      id: 1,
      senderId: 999,
      senderName: 'GV Minh',
      senderAvatar: '👨‍🏫',
      content: '📢 THÔNG BÁO QUAN TRỌNG\n\nLịch thi giữa kỳ VSTEP B2 đã được xác định:\n\n📅 Ngày thi: 20/12/2025\n🕐 Giờ thi: 8:00 - 11:30 AM\n📍 Địa điểm: Phòng 301, Tòa nhà A\n\nCác em chuẩn bị kỹ và đến đúng giờ nhé! Chúc các em thi tốt! 💪',
      timestamp: '2 hours ago',
      isMe: false,
      isFromTeacher: true,
      isAnnouncement: true,
      isPinned: true,
    },
    {
      id: 2,
      senderId: 2,
      senderName: 'Trần Thị B',
      senderAvatar: '👩‍🎓',
      content: 'Cảm ơn thầy đã thông báo ạ! Em đã ghi chú lại rồi.',
      timestamp: '2 hours ago',
      isMe: false,
    },
    {
      id: 3,
      senderId: 1,
      senderName: 'Nguyễn Văn A',
      senderAvatar: '👨‍🎓',
      content: 'Thầy ơi, bài thi có format giống như đề mock test không ạ?',
      timestamp: '1 hour ago',
      isMe: false,
    },
    {
      id: 4,
      senderId: 999,
      senderName: 'GV Minh',
      senderAvatar: '👨‍🏫',
      content: 'Đúng rồi em, format y hệt như các đề mock test các em đã làm. Các em có thể tham khảo lại đề thi mẫu nhé.',
      timestamp: '1 hour ago',
      isMe: false,
      isFromTeacher: true,
    },
    {
      id: 5,
      senderId: 0,
      senderName: 'Me',
      senderAvatar: '👤',
      content: 'Thầy có thể chia sẻ lại link tài liệu ôn tập được không ạ?',
      timestamp: '45 min ago',
      isMe: true,
    },
    {
      id: 6,
      senderId: 999,
      senderName: 'GV Minh',
      senderAvatar: '👨‍🏫',
      content: 'Dạ được em, thầy sẽ gửi file ngay đây nhé!',
      timestamp: '40 min ago',
      isMe: false,
      isFromTeacher: true,
      files: [
        { name: 'VSTEP_B2_Review_Materials.pdf', size: 3145728, type: 'application/pdf' },
        { name: 'Sample_Tests_Collection.zip', size: 5242880, type: 'application/zip' },
      ],
    },
    {
      id: 7,
      senderId: 5,
      senderName: 'Hoàng Văn E',
      senderAvatar: '👨‍🔬',
      content: 'Cảm ơn thầy rất nhiều! 🙏',
      timestamp: '35 min ago',
      isMe: false,
    },
    {
      id: 8,
      senderId: 999,
      senderName: 'GV Minh',
      senderAvatar: '👨‍🏫',
      content: '🎯 Nhắc nhở quan trọng:\n\n✅ Các em nhớ mang theo:\n- CMND/CCCD\n- Bút viết\n- Tai nghe (cho phần Listening)\n- Đồng hồ đeo tay\n\n❌ Không mang:\n- Điện thoại\n- Tài liệu\n- Thiết bị điện tử khác',
      timestamp: '30 min ago',
      isMe: false,
      isFromTeacher: true,
      isAnnouncement: true,
    },
  ];

  const vstepB2ClassMessages: Message[] = [
    {
      id: 1,
      senderId: 2,
      senderName: 'Trần Thị B',
      senderAvatar: '👩‍🎓',
      content: 'Chào mọi người! Mình vừa tìm được bài giảng Writing rất hay, chia sẻ cho các bạn nhé!',
      timestamp: '9:00 AM',
      isMe: false,
    },
    {
      id: 2,
      senderId: 2,
      senderName: 'Trần Thị B',
      senderAvatar: '👩‍🎓',
      content: 'Đây là file bài giảng',
      timestamp: '9:01 AM',
      isMe: false,
      files: [
        { name: 'Bài_giảng_Writing.pdf', size: 2097152, type: 'application/pdf' },
        { name: 'Writing_Task_2_Examples.docx', size: 1048576, type: 'application/msword' },
      ],
    },
    {
      id: 3,
      senderId: 1,
      senderName: 'Nguyễn Văn A',
      senderAvatar: '👨‍🎓',
      content: 'Wow cảm ơn bạn nhiều! Đúng là tài liệu mình đang cần 🙏',
      timestamp: '9:05 AM',
      isMe: false,
    },
    {
      id: 4,
      senderId: 0,
      senderName: 'Me',
      senderAvatar: '👤',
      content: 'Thanks B! Mình cũng có vài tài liệu Reading chia sẻ lại',
      timestamp: '9:10 AM',
      isMe: true,
      files: [
        { name: 'Reading_Strategies.pdf', size: 1572864, type: 'application/pdf' },
      ],
    },
    {
      id: 5,
      senderId: 5,
      senderName: 'Hoàng Văn E',
      senderAvatar: '👨‍🔬',
      content: 'Mình có note Listening này, khá chi tiết đấy!',
      timestamp: '9:15 AM',
      isMe: false,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
    },
    {
      id: 6,
      senderId: 3,
      senderName: 'Lê Văn C',
      senderAvatar: '👨‍💼',
      content: 'Các bạn ơi, ngày mai có ai muốn tập Speaking cùng mình không?',
      timestamp: '9:20 AM',
      isMe: false,
    },
    {
      id: 7,
      senderId: 2,
      senderName: 'Trần Thị B',
      senderAvatar: '👩‍🎓',
      content: 'Mình tham gia nhé! Tối nay 7h được không?',
      timestamp: '9:22 AM',
      isMe: false,
    },
  ];

  const speakingGroupMessages: Message[] = [
    {
      id: 1,
      senderId: 3,
      senderName: 'Lê Văn C',
      senderAvatar: '👨‍💼',
      content: 'Chào nhóm! Tối nay mình tập speaking nhé! 🗣️',
      timestamp: 'Yesterday',
      isMe: false,
    },
    {
      id: 2,
      senderId: 1,
      senderName: 'Nguyễn Văn A',
      senderAvatar: '👨‍🎓',
      content: 'Ok! Mình tập Part 2 - Long Turn nhé',
      timestamp: 'Yesterday',
      isMe: false,
    },
    {
      id: 3,
      senderId: 2,
      senderName: 'Trần Thị B',
      senderAvatar: '👩‍🎓',
      content: 'Mình gửi topic list cho các bạn tham khảo',
      timestamp: 'Yesterday',
      isMe: false,
      files: [
        { name: 'Speaking_Topics_List.pdf', size: 524288, type: 'application/pdf' },
        { name: 'Speaking_Part2_Templates.docx', size: 786432, type: 'application/msword' },
      ],
    },
    {
      id: 4,
      senderId: 0,
      senderName: 'Me',
      senderAvatar: '👤',
      content: 'Cảm ơn! Mình có bản ghi âm mẫu của native speaker này',
      timestamp: 'Yesterday',
      isMe: true,
      files: [
        { name: 'Sample_Speaking_Part2.mp3', size: 2097152, type: 'audio/mpeg' },
      ],
    },
    {
      id: 5,
      senderId: 5,
      senderName: 'Hoàng Văn E',
      senderAvatar: '👨‍🔬',
      content: 'Perfect! Mình sẽ chuẩn bị trước nhé',
      timestamp: 'Yesterday',
      isMe: false,
    },
    {
      id: 6,
      senderId: 3,
      senderName: 'Lê Văn C',
      senderAvatar: '👨‍💼',
      content: 'Đây là link Zoom cho buổi tập tối nay: https://zoom.us/j/123456789',
      timestamp: 'Yesterday',
      isMe: false,
    },
  ];

  const adminMessages: Message[] = [
    {
      id: 1,
      senderId: 998,
      senderName: 'Admin VSTEPRO',
      senderAvatar: '🛡️',
      content: 'Xin chào! Chào mừng bạn đến với VSTEPRO. Tôi có thể giúp gì cho bạn? 😊',
      timestamp: '10:00 AM',
      isMe: false,
    },
    {
      id: 2,
      senderId: 0,
      senderName: 'Me',
      senderAvatar: '👤',
      content: 'Em muốn hỏi về việc nâng cấp tài khoản Premium ạ',
      timestamp: '10:05 AM',
      isMe: true,
    },
    {
      id: 3,
      senderId: 998,
      senderName: 'Admin VSTEPRO',
      senderAvatar: '🛡️',
      content: '💎 Tài khoản Premium có các tính năng sau:\n\n✅ Chấm AI không giới hạn\n✅ Truy cập đầy đủ kho đề thi\n✅ Báo cáo chi tiết & phân tích sâu\n✅ Ưu tiên hỗ trợ 24/7\n✅ Tài liệu học độc quyền\n\n💰 Giá: 299.000đ/tháng\n🎁 Giảm 20% nếu đăng ký 6 tháng!',
      timestamp: '10:10 AM',
      isMe: false,
    },
    {
      id: 4,
      senderId: 0,
      senderName: 'Me',
      senderAvatar: '👤',
      content: 'Cảm ơn admin! Cho em xem thêm về phương thức thanh toán được không ạ?',
      timestamp: '10:15 AM',
      isMe: true,
    },
    {
      id: 5,
      senderId: 998,
      senderName: 'Admin VSTEPRO',
      senderAvatar: '🛡️',
      content: 'Dạ được em! Em gửi file hướng dẫn thanh toán nhé',
      timestamp: '10:20 AM',
      isMe: false,
      files: [
        { name: 'Hướng_dẫn_thanh_toán.pdf', size: 1048576, type: 'application/pdf' },
        { name: 'Bảng_giá_gói_Premium.pdf', size: 524288, type: 'application/pdf' },
      ],
    },
    {
      id: 6,
      senderId: 0,
      senderName: 'Me',
      senderAvatar: '👤',
      content: 'Cảm ơn admin rất nhiều! Em sẽ xem và quyết định ạ 🙏',
      timestamp: '10:25 AM',
      isMe: true,
    },
  ];

  const teacherMessages: Message[] = [
    {
      id: 1,
      senderId: 999,
      senderName: 'GV Minh',
      senderAvatar: '👨‍🏫',
      content: 'Chào em! Thầy thấy em vừa hoàn thành bài thi Writing, kết quả khá tốt đấy! 👍',
      timestamp: '11:00 AM',
      isMe: false,
      isFromTeacher: true,
    },
    {
      id: 2,
      senderId: 0,
      senderName: 'Me',
      senderAvatar: '👤',
      content: 'Dạ cảm ơn thầy! Em muốn hỏi về cách cải thiện Writing Task 2 ạ',
      timestamp: '11:05 AM',
      isMe: true,
    },
    {
      id: 3,
      senderId: 999,
      senderName: 'GV Minh',
      senderAvatar: '👨‍🏫',
      content: '📝 Để cải thiện Writing Task 2, em nên:\n\n1️⃣ Luyện tập viết essay theo cấu trúc 4 đoạn:\n   - Introduction (giới thiệu)\n   - Body 1 (luận điểm 1)\n   - Body 2 (luận điểm 2)\n   - Conclusion (kết luận)\n\n2️⃣ Sử dụng linking words đa dạng\n3️⃣ Phát triển ý với ví dụ cụ thể\n4️⃣ Quản lý thời gian: 40 phút cho Task 2',
      timestamp: '11:10 AM',
      isMe: false,
      isFromTeacher: true,
    },
    {
      id: 4,
      senderId: 0,
      senderName: 'Me',
      senderAvatar: '👤',
      content: 'Dạ em hiểu rồi ạ! Thầy có tài liệu mẫu không ạ?',
      timestamp: '11:12 AM',
      isMe: true,
    },
    {
      id: 5,
      senderId: 999,
      senderName: 'GV Minh',
      senderAvatar: '👨‍🏫',
      content: 'Có em! Thầy gửi cho em bộ tài liệu Writing đầy đủ nhé',
      timestamp: '11:15 AM',
      isMe: false,
      isFromTeacher: true,
      files: [
        { name: 'Writing_Task2_Sample_Essays.pdf', size: 2621440, type: 'application/pdf' },
        { name: 'Linking_Words_Collection.docx', size: 786432, type: 'application/msword' },
        { name: 'Writing_Templates.pdf', size: 1310720, type: 'application/pdf' },
      ],
    },
    {
      id: 6,
      senderId: 0,
      senderName: 'Me',
      senderAvatar: '👤',
      content: 'Cảm ơn thầy rất nhiều ạ! Em sẽ học kỹ và thực hành nhiều hơn 🙏',
      timestamp: '11:18 AM',
      isMe: true,
    },
    {
      id: 7,
      senderId: 999,
      senderName: 'GV Minh',
      senderAvatar: '👨‍🏫',
      content: 'Tốt lắm! Nếu em cần feedback cho bài viết nào, cứ gửi cho thầy nhé. Chúc em học tốt! 💪',
      timestamp: '11:20 AM',
      isMe: false,
      isFromTeacher: true,
    },
  ];

  const mockMessages: Message[] = [
    {
      id: 1,
      senderId: 1,
      senderName: 'Nguyễn Văn A',
      senderAvatar: '👨‍🎓',
      content: 'Chào bạn! Mình có thể hỏi về bài tập hôm qua không?',
      timestamp: '10:15 AM',
      isMe: false,
    },
    {
      id: 2,
      senderId: 0,
      senderName: 'Me',
      senderAvatar: '👤',
      content: 'Được chứ, bạn cứ hỏi đi!',
      timestamp: '10:16 AM',
      isMe: true,
    },
    {
      id: 3,
      senderId: 1,
      senderName: 'Nguyễn Văn A',
      senderAvatar: '👨‍🎓',
      content: 'Mình gửi bạn file tài liệu nhé',
      timestamp: '10:18 AM',
      isMe: false,
      files: [
        { name: 'VSTEP_Reading_Practice.pdf', size: 2457600, type: 'application/pdf' },
        { name: 'Vocabulary_List.docx', size: 524288, type: 'application/msword' },
      ],
    },
    {
      id: 4,
      senderId: 0,
      senderName: 'Me',
      senderAvatar: '👤',
      content: 'Cảm ơn bạn! Mình cũng có vài ảnh note gửi lại cho bạn',
      timestamp: '10:20 AM',
      isMe: true,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
    },
    {
      id: 5,
      senderId: 1,
      senderName: 'Nguyễn Văn A',
      senderAvatar: '👨‍🎓',
      content: 'Perfect! Mình sẽ xem qua',
      timestamp: '10:22 AM',
      isMe: false,
    },
    {
      id: 6,
      senderId: 0,
      senderName: 'Me',
      senderAvatar: '👤',
      content: 'Đây là bài tập mẫu mình làm',
      timestamp: '10:25 AM',
      isMe: true,
      files: [
        { name: 'Essay_Sample.pdf', size: 1048576, type: 'application/pdf' },
      ],
    },
  ];

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'classmates') return matchesSearch && conv.type === 'direct';
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
      // Logic to send message with files
      console.log('Sending message:', messageInput);
      console.log('Attached files:', selectedFiles);
      setMessageInput('');
      setSelectedFiles([]);
    }
  };

  // Get messages based on selected conversation
  const getCurrentMessages = () => {
    if (!selectedConversation) return [];
    
    switch (selectedConversation.id) {
      case 'class-general':
        return classGeneralMessages;
      case 'class-group':
        return vstepB2ClassMessages;
      case 'group-2':
        return speakingGroupMessages;
      case 'admin-support':
        return adminMessages;
      case 'teacher-main':
        return teacherMessages;
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
            <h2 className="text-xl font-bold text-gray-900">Tin nhắn lớp học</h2>
            <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
              <UserPlus className="size-5 text-blue-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveTab('classmates')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'classmates'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Bạn học
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'groups'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Nhóm
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'classmates' && searchTerm === '' && (
            <>
              {/* Online Classmates Section */}
              <div className="p-3 bg-green-50 border-b border-green-100">
                <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Đang online ({mockClassMates.filter(m => m.online).length})
                </div>
              </div>
              
              {mockClassMates
                .filter(mate => mate.online)
                .map(mate => (
                  <button
                    key={`online-${mate.id}`}
                    onClick={() => {
                      const conv = conversations.find(c => c.name === mate.name);
                      if (conv) setSelectedConversation(conv);
                    }}
                    className="w-full p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                          {mate.avatar}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{mate.name}</div>
                        <div className="text-xs text-green-600">Đang online</div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        {mate.level}
                      </span>
                    </div>
                  </button>
                ))}

              {/* Offline Classmates Section */}
              {mockClassMates.filter(m => !m.online).length > 0 && (
                <>
                  <div className="p-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      Không hoạt động ({mockClassMates.filter(m => !m.online).length})
                    </div>
                  </div>
                  
                  {mockClassMates
                    .filter(mate => !mate.online)
                    .map(mate => (
                      <button
                        key={`offline-${mate.id}`}
                        onClick={() => {
                          const conv = conversations.find(c => c.name === mate.name);
                          if (conv) setSelectedConversation(conv);
                        }}
                        className="w-full p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-2xl opacity-70">
                              {mate.avatar}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{mate.name}</div>
                            <div className="text-xs text-gray-500">{mate.lastSeen}</div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {mate.level}
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
              <div className="p-3 bg-blue-50 border-b border-blue-100">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                  <Hash className="size-4" />
                  Nhóm lớp học ({mockClassGroups.length})
                </div>
              </div>
              
              {mockClassGroups.map(group => (
                <button
                  key={group.id}
                  onClick={() => {
                    const conv = conversations.find(c => c.name === group.name);
                    if (conv) setSelectedConversation(conv);
                  }}
                  className="w-full p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                      {group.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{group.name}</div>
                      <div className="text-xs text-gray-500">{group.members} thành viên</div>
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
                className={`w-full p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors text-left ${
                  selectedConversation?.id === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 bg-gradient-to-br ${conv.type === 'group' ? 'from-blue-500 to-cyan-500' : 'from-blue-500 to-purple-500'} rounded-full flex items-center justify-center text-2xl`}>
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
                      <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 font-medium">
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
                <div className={`w-12 h-12 bg-gradient-to-br ${selectedConversation.type === 'group' ? 'from-blue-500 to-cyan-500' : 'from-blue-500 to-purple-500'} rounded-full flex items-center justify-center text-2xl`}>
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
                    ? `${selectedConversation.members} thành viên` 
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
                  <span className="text-sm">Thành viên</span>
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
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[70%] ${message.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!message.isMe && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">
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
                            ? 'bg-blue-600 text-white'
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
              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedFiles.length} file đã chọn
                  </span>
                  <button
                    onClick={() => setSelectedFiles([])}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Xóa tất cả
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 bg-white rounded-lg border border-blue-200"
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
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors group relative" 
                  title="Đính kèm file"
                >
                  <Paperclip className="size-5 text-gray-600 group-hover:text-blue-600" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    File tài liệu
                  </span>
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
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Hình ảnh
                  </span>
                </button>
                
                <button className="p-2 hover:bg-yellow-100 rounded-lg transition-colors group relative" title="Emoji">
                  <Smile className="size-5 text-gray-600 group-hover:text-yellow-600" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Emoji
                  </span>
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
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                style={{ minHeight: '42px', maxHeight: '120px' }}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() && selectedFiles.length === 0}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                <Send className="size-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-xl shadow-sm border-2 border-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="size-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chào mừng đến Tin nhắn lớp học</h3>
            <p className="text-gray-600 mb-4">Chọn một cuộc trò chuyện bên trái để bắt đầu</p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                <span>{mockClassMates.length} bạn học</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="size-4" />
                <span>{mockClassGroups.length} nhóm</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members List Sidebar (for group chats) */}
      {showMembersList && selectedConversation?.type === 'group' && (
        <div className="w-64 flex-shrink-0 bg-white rounded-xl shadow-sm border-2 border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Thành viên</h3>
            <button 
              onClick={() => setShowMembersList(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronDown className="size-4 text-gray-600" />
            </button>
          </div>
          <div className="space-y-2">
            {mockClassMates.slice(0, 8).map(mate => (
              <div key={mate.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-lg">
                    {mate.avatar}
                  </div>
                  {mate.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{mate.name}</div>
                  <div className="text-xs text-gray-500">{mate.online ? 'Online' : 'Offline'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}