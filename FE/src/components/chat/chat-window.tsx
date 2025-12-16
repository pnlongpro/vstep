"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";

interface ChatWindowProps {
  chatId: string | null;
}

export function ChatWindow({ chatId }: ChatWindowProps) {
  const [message, setMessage] = useState("");

  const messages = chatId
    ? [
        { id: "1", sender: "teacher", text: "Chào em! Bài tập của em rất tốt.", time: "10:25" },
        { id: "2", sender: "me", text: "Cảm ơn thầy ạ!", time: "10:30" },
      ]
    : [];

  if (!chatId) {
    return (
      <Card className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Chọn một cuộc trò chuyện để bắt đầu</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader className="border-b">
        <CardTitle>Giáo viên Nguyễn Văn A</CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "me" ? "flex-row-reverse" : ""}`}
            >
              <Avatar className="flex-shrink-0">
                <AvatarFallback>{msg.sender === "me" ? "B" : "T"}</AvatarFallback>
              </Avatar>
              <div className={`flex flex-col ${msg.sender === "me" ? "items-end" : ""}`}>
                <div
                  className={`rounded-lg p-3 max-w-md ${
                    msg.sender === "me" ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-xs text-muted-foreground mt-1">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <CardContent className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && message.trim()) {
                // Handle send
                setMessage("");
              }
            }}
          />
          <Button size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
