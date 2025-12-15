import { useState } from 'react';
import { X, MessageCircle, Send, Search, User, Shield } from 'lucide-react';
import { ClassMessagesPage } from './student/ClassMessagesPage';

interface ChatPanelProps {
  onClose: () => void;
  userRole: 'student' | 'teacher' | 'admin';
}

interface ChatMessage {
  id: number;
  sender: 'me' | 'admin' | 'teacher';
  content: string;
  timestamp: string;
}

export function ChatPanel({ onClose, userRole }: ChatPanelProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-2xl w-full max-w-[95vw] h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <MessageCircle className="size-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Tin nhắn lớp học</h2>
              <p className="text-xs text-gray-600">
                Nhắn tin với bạn học, giáo viên và nhóm lớp học
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="size-5 text-gray-600" />
          </button>
        </div>

        {/* Class Messages Content */}
        <div className="flex-1 overflow-hidden p-6">
          <ClassMessagesPage />
        </div>
      </div>
    </div>
  );
}