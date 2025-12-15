"use client";

import { AIChatInterface } from "@/components/chat/ai-chat-interface";

export default function AIChatPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Chat với AI</h1>
        <p className="text-muted-foreground">
          Trợ lý AI giúp bạn học tiếng Anh hiệu quả hơn
        </p>
      </div>
      <AIChatInterface />
    </div>
  );
}
