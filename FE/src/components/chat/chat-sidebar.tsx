"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";

interface ChatSidebarProps {
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
}

export function ChatSidebar({ selectedChat, onSelectChat }: ChatSidebarProps) {
  const chats = [
    { id: "1", name: "Giáo viên Nguyễn Văn A", lastMessage: "Bài tập của bạn rất tốt!", time: "10:30" },
    { id: "2", name: "Hỗ trợ kỹ thuật", lastMessage: "Chúng tôi sẽ giúp bạn...", time: "09:15" },
  ];

  return (
    <Card className="w-80 flex-shrink-0">
      <div className="p-4 border-b">
        <h2 className="font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Tin nhắn
        </h2>
      </div>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="p-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full p-3 rounded-lg hover:bg-secondary transition-colors text-left ${
                selectedChat === chat.id ? "bg-secondary" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{chat.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                </div>
                <span className="text-xs text-muted-foreground">{chat.time}</span>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
