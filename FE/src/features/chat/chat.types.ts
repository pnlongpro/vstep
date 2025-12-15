export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: "text" | "file" | "image";
  createdAt: string;
  isRead: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
}

export interface SendMessageRequest {
  content: string;
  type?: "text" | "file" | "image";
}
