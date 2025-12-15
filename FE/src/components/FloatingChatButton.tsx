import { useState } from 'react';
import { Bot, X, Sparkles, MessageCircle, Settings } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick: () => void;
  onHide: () => void;
}

export function FloatingChatButton({ onClick, onHide }: FloatingChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHide = (e: React.MouseEvent) => {
    e.stopPropagation();
    onHide();
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      {isHovered && (
        <div className="bg-gray-900 text-white px-4 py-2 rounded-xl shadow-lg animate-fadeIn">
          <p className="text-sm whitespace-nowrap">Trợ lý VSTEP AI</p>
          <p className="text-xs text-gray-300">Hỏi đáp ngay 24/7</p>
        </div>
      )}

      <div className="relative">
        {/* Hide Button - Show on hover, positioned at top-left */}
        {isHovered && (
          <button
            onClick={handleHide}
            className="absolute -top-2 -left-2 z-10 bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-full shadow-xl transition-all animate-fadeIn hover:scale-110"
            title="Ẩn trợ lý AI"
          >
            <X className="size-5" />
          </button>
        )}

        {/* Floating Button */}
        <button
          onClick={onClick}
          className="relative group"
        >
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-75" />
          
          {/* Main Button */}
          <div className="relative w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group-hover:scale-110">
            <Bot className="size-8 text-white" />
            
            {/* AI Badge */}
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              <Sparkles className="size-3 text-yellow-900" />
            </div>

            {/* Online Indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>

          {/* Ripple Effect on Hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        </button>
      </div>
    </div>
  );
}