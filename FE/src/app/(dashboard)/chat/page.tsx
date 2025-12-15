"use client";

import { useState } from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatWindow } from "@/components/chat/chat-window";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <ChatSidebar
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />
      <ChatWindow chatId={selectedChat} />
    </div>
  );
}
