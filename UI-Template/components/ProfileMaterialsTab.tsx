import { FileText, BookOpen, PenTool, Headphones } from 'lucide-react';

export function ProfileMaterialsTab() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl mb-6 text-gray-800 flex items-center gap-2">
        <FileText className="size-6 text-blue-600" />
        Tài liệu lớp học
      </h2>
      
      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="size-5 text-white" />
            </div>
            <div>
              <p className="text-2xl text-blue-900">6</p>
              <p className="text-xs text-blue-700">Giáo trình</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <FileText className="size-5 text-white" />
            </div>
            <div>
              <p className="text-2xl text-green-900">12</p>
              <p className="text-xs text-green-700">Bài tập</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Headphones className="size-5 text-white" />
            </div>
            <div>
              <p className="text-2xl text-purple-900">8</p>
              <p className="text-xs text-purple-700">Audio/Video</p>
            </div>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-6">
        {/* Giáo trình */}
        <div>
          <h3 className="text-lg mb-3 text-gray-800 flex items-center gap-2">
            <BookOpen className="size-5 text-blue-600" />
            Giáo trình
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: 'Giáo trình VSTEP B2 - Full', size: '12.5 MB', type: 'PDF' },
              { name: 'VSTEP Grammar Guide', size: '5.4 MB', type: 'PDF' },
              { name: 'Vocabulary Builder B1-B2', size: '3.8 MB', type: 'PDF' },
              { name: 'Writing Templates & Samples', size: '2.1 MB', type: 'PDF' },
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-blue-200 rounded-lg">
                  <svg className="size-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bài tập */}
        <div>
          <h3 className="text-lg mb-3 text-gray-800 flex items-center gap-2">
            <PenTool className="size-5 text-green-600" />
            Bài tập & Đề luyện
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: 'Bài tập Unit 1-5', size: '3.2 MB', type: 'PDF' },
              { name: 'Reading Practice Tests', size: '4.7 MB', type: 'PDF' },
              { name: 'Đề thi thử VSTEP 2024', size: '6.1 MB', type: 'PDF' },
              { name: 'Writing Exercises Advanced', size: '2.8 MB', type: 'PDF' },
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-green-200 rounded-lg">
                  <svg className="size-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Audio & Video */}
        <div>
          <h3 className="text-lg mb-3 text-gray-800 flex items-center gap-2">
            <Headphones className="size-5 text-purple-600" />
            Audio & Video
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: 'Listening Practice Set 1-10', size: '45.3 MB', type: 'ZIP' },
              { name: 'Speaking Topics Audio', size: '28.7 MB', type: 'ZIP' },
              { name: 'Pronunciation Guide Videos', size: '156.2 MB', type: 'MP4' },
              { name: 'VSTEP Mock Test Audio', size: '32.5 MB', type: 'MP3' },
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Headphones className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-purple-200 rounded-lg">
                  <svg className="size-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Button */}
        <div className="pt-4 border-t border-gray-200">
          <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm">Tải lên tài liệu của bạn</span>
          </button>
        </div>
      </div>
    </div>
  );
}
