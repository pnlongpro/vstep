import { useState } from 'react';

interface SwitchRoleButtonProps {
  currentRole: 'student' | 'teacher' | 'admin' | 'uploader';
  onRoleChange: (role: 'student' | 'teacher' | 'admin' | 'uploader') => void;
}

export function SwitchRoleButton({ currentRole, onRoleChange }: SwitchRoleButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getRoleInitial = () => {
    switch (currentRole) {
      case 'student': return 'S';
      case 'teacher': return 'T';
      case 'admin': return 'A';
      case 'uploader': return 'U';
      default: return 'S';
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 left-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-[100] flex items-center justify-center group"
        title="Chuyển đổi vai trò"
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-sm font-bold">
            {getRoleInitial()}
          </span>
        </div>
      </button>

      {/* Popup Panel */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed bottom-24 left-8 bg-white rounded-xl shadow-2xl p-6 z-[100] border border-gray-200 animate-in fade-in slide-in-from-bottom-5">
            <h3 className="text-sm text-gray-600 mb-4">Chuyển đổi vai trò:</h3>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onRoleChange('student');
                  setIsOpen(false);
                }}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                  currentRole === 'student'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Học viên
              </button>
              <button
                onClick={() => {
                  onRoleChange('teacher');
                  setIsOpen(false);
                }}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                  currentRole === 'teacher'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Giáo viên
              </button>
              <button
                onClick={() => {
                  onRoleChange('admin');
                  setIsOpen(false);
                }}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                  currentRole === 'admin'
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Quản trị
              </button>
              <button
                onClick={() => {
                  onRoleChange('uploader');
                  setIsOpen(false);
                }}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                  currentRole === 'uploader'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📤 Upload đề
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}