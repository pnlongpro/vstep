import { useState } from 'react';
import { MessageSquare, Search, Send, Paperclip, MoreVertical, Phone, Video, Users } from 'lucide-react';

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  type: 'student' | 'group';
}

interface Message {
  id: number;
  sender: 'me' | 'other';
  content: string;
  timestamp: string;
  avatar?: string;
}

export function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const conversations: Conversation[] = [
    {
      id: "1",
      name: 'Nguyễn Văn A',
      avatar: '👨‍🎓',
      lastMessage: 'Em cảm ơn thầy đã giải đáp!',
      timestamp: '10:30 AM',
      unread: 2,
      online: true,
      type: 'student'
    },
    {
      id: "2",
      name: 'VSTEP B1 - Lớp sáng',
      avatar: '👥',
      lastMessage: 'Thầy ơi, bài tập deadline là ngày nào ạ?',
      timestamp: '9:15 AM',
      unread: 5,
      online: false,
      type: 'group'
    },
    {
      id: "3",
      name: 'Trần Thị B',
      avatar: '👩‍🎓',
      lastMessage: 'Thầy có thể giải thích thêm về grammar không ạ?',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
      type: 'student'
    },
    {
      id: "4",
      name: 'VSTEP B2 - Lớp chiều',
      avatar: '👥',
      lastMessage: 'Lịch thi đã được cập nhật',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
      type: 'group'
    }
  ];

  const messages: Message[] = [
    {
      id: "1",
      sender: 'other',
      content: 'Thầy ơi, em có thắc mắc về bài tập Writing ạ',
      timestamp: '10:15 AM',
      avatar: '👨‍🎓'
    },
    {
      id: "2",
      sender: 'me',
      content: 'Chào em, thầy nghe đây. Em có thắc mắc gì?',
      timestamp: '10:16 AM'
    },
    {
      id: "3",
      sender: 'other',
      content: 'Em không hiểu phần Task Achievement, thầy có thể giải thích thêm không ạ?',
      timestamp: '10:18 AM',
      avatar: '👨‍🎓'
    },
    {
      id: "4",
      sender: 'me',
      content: 'Task Achievement là tiêu chí đánh giá xem bài viết của em có trả lời đúng yêu cầu đề bài không. Em cần chú ý...',
      timestamp: '10:20 AM'
    },
    {
      id: "5",
      sender: 'other',
      content: 'Em cảm ơn thầy đã giải đáp!',
      timestamp: '10:30 AM',
      avatar: '👨‍🎓'
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6">
      {/* Conversations List */}
      <div className="w-80 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl mb-4">Tin nhắn</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                selectedConversation?.id === conv.id ? 'bg-emerald-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                    {conv.avatar}
                  </div>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm truncate">{conv.name}</h3>
                    <span className="text-xs text-gray-500">{conv.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                </div>

                {/* Unread Badge */}
                {conv.unread > 0 && (
                  <div className="flex-shrink-0">
                    <span className="bg-emerald-600 text-white text-xs rounded-full px-2 py-0.5">
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
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-xl">
                  {selectedConversation.avatar}
                </div>
                {selectedConversation.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h3 className="text-sm">{selectedConversation.name}</h3>
                <p className="text-xs text-gray-600">
                  {selectedConversation.online ? 'Đang hoạt động' : 'Không hoạt động'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
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
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[70%] ${message.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {message.sender === 'other' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                      {message.avatar}
                    </div>
                  )}
                  <div>
                    <div
                      className={`px-4 py-2.5 rounded-2xl ${
                        message.sender === 'me'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${message.sender === 'me' ? 'text-right' : 'text-left'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="size-5 text-gray-600" />
              </button>
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && messageInput.trim()) {
                    // Send message logic
                    setMessageInput('');
                  }
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => {
                  if (messageInput.trim()) {
                    // Send message logic
                    setMessageInput('');
                  }
                }}
                className="p-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Send className="size-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="size-12 text-gray-400" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">Chọn một cuộc trò chuyện</h3>
            <p className="text-gray-600">Chọn từ danh sách bên trái để bắt đầu nhắn tin</p>
          </div>
        </div>
      )}
    </div>
  );
}
