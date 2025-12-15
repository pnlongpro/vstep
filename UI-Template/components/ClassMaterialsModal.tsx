import { X, BookOpen, FileText, Headphones, Download, Eye } from 'lucide-react';
import { useState } from 'react';

interface ClassMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Material {
  id: number;
  title: string;
  type: 'lecture' | 'exercise' | 'audio';
  fileType: string;
  size: string;
  downloads?: number;
  views?: number;
}

export function ClassMaterialsModal({ isOpen, onClose }: ClassMaterialsModalProps) {
  const [activeCategory, setActiveCategory] = useState<'lecture' | 'exercise' | 'audio'>('lecture');

  if (!isOpen) return null;

  const stats = {
    lecture: 6,
    exercise: 12,
    audio: 8,
  };

  const materials: Material[] = [
    // Giáo trình
    { id: 1, title: 'Giáo trình VSTEP B2 - Full', type: 'lecture', fileType: 'PDF', size: '12.5 MB', downloads: 234, views: 567 },
    { id: 2, title: 'VSTEP Grammar Guide', type: 'lecture', fileType: 'PDF', size: '5.4 MB', downloads: 189, views: 423 },
    { id: 3, title: 'Vocabulary Builder B1-B2', type: 'lecture', fileType: 'PDF', size: '3.8 MB', downloads: 156, views: 378 },
    { id: 4, title: 'Writing Templates & Samples', type: 'lecture', fileType: 'PDF', size: '2.1 MB', downloads: 298, views: 612 },
    { id: 5, title: 'Speaking Practice Guide', type: 'lecture', fileType: 'PDF', size: '4.2 MB', downloads: 201, views: 489 },
    { id: 6, title: 'Reading Strategies B2-C1', type: 'lecture', fileType: 'PDF', size: '6.7 MB', downloads: 145, views: 334 },
    
    // Bài tập
    { id: 7, title: 'Grammar Exercise Set 1', type: 'exercise', fileType: 'PDF', size: '1.2 MB', downloads: 312, views: 701 },
    { id: 8, title: 'Vocabulary Quiz - Unit 1-5', type: 'exercise', fileType: 'PDF', size: '0.8 MB', downloads: 267, views: 589 },
    { id: 9, title: 'Reading Comprehension Practice', type: 'exercise', fileType: 'PDF', size: '2.3 MB', downloads: 234, views: 523 },
    { id: 10, title: 'Writing Task 1 Exercises', type: 'exercise', fileType: 'PDF', size: '1.5 MB', downloads: 289, views: 634 },
    { id: 11, title: 'Listening Practice Test 1', type: 'exercise', fileType: 'PDF', size: '0.9 MB', downloads: 198, views: 445 },
    { id: 12, title: 'Speaking Topics & Prompts', type: 'exercise', fileType: 'PDF', size: '1.1 MB', downloads: 223, views: 512 },
    { id: 13, title: 'Grammar Exercise Set 2', type: 'exercise', fileType: 'PDF', size: '1.4 MB', downloads: 176, views: 398 },
    { id: 14, title: 'Vocabulary Quiz - Unit 6-10', type: 'exercise', fileType: 'PDF', size: '0.7 MB', downloads: 154, views: 367 },
    { id: 15, title: 'Writing Task 2 Exercises', type: 'exercise', fileType: 'PDF', size: '1.6 MB', downloads: 201, views: 478 },
    { id: 16, title: 'Listening Practice Test 2', type: 'exercise', fileType: 'PDF', size: '1.0 MB', downloads: 189, views: 423 },
    { id: 17, title: 'Reading Speed Training', type: 'exercise', fileType: 'PDF', size: '2.1 MB', downloads: 167, views: 391 },
    { id: 18, title: 'Mixed Skills Practice', type: 'exercise', fileType: 'PDF', size: '3.2 MB', downloads: 245, views: 556 },
    
    // Audio/Video
    { id: 19, title: 'Pronunciation Basics', type: 'audio', fileType: 'MP3', size: '15.3 MB', downloads: 178, views: 412 },
    { id: 20, title: 'Listening Conversation - Unit 1', type: 'audio', fileType: 'MP3', size: '8.7 MB', downloads: 234, views: 567 },
    { id: 21, title: 'Academic Lecture Sample', type: 'audio', fileType: 'MP3', size: '12.4 MB', downloads: 156, views: 389 },
    { id: 22, title: 'Speaking Model Answers', type: 'audio', fileType: 'MP3', size: '9.8 MB', downloads: 201, views: 478 },
    { id: 23, title: 'Listening Conversation - Unit 2', type: 'audio', fileType: 'MP3', size: '7.9 MB', downloads: 189, views: 445 },
    { id: 24, title: 'Interview Practice Audio', type: 'audio', fileType: 'MP3', size: '11.2 MB', downloads: 167, views: 398 },
    { id: 25, title: 'Dictation Exercise Audio', type: 'audio', fileType: 'MP3', size: '6.5 MB', downloads: 145, views: 334 },
    { id: 26, title: 'News Listening Practice', type: 'audio', fileType: 'MP3', size: '10.1 MB', downloads: 223, views: 512 },
  ];

  const filteredMaterials = materials.filter(m => m.type === activeCategory);

  const getCategoryIcon = (type: 'lecture' | 'exercise' | 'audio') => {
    switch (type) {
      case 'lecture':
        return BookOpen;
      case 'exercise':
        return FileText;
      case 'audio':
        return Headphones;
    }
  };

  const getCategoryColor = (type: 'lecture' | 'exercise' | 'audio') => {
    switch (type) {
      case 'lecture':
        return 'from-blue-400 to-blue-600';
      case 'exercise':
        return 'from-green-400 to-green-600';
      case 'audio':
        return 'from-purple-400 to-purple-600';
    }
  };

  const getCategoryBgColor = (type: 'lecture' | 'exercise' | 'audio') => {
    switch (type) {
      case 'lecture':
        return 'bg-blue-50';
      case 'exercise':
        return 'bg-green-50';
      case 'audio':
        return 'bg-purple-50';
    }
  };

  const getCategoryName = (type: 'lecture' | 'exercise' | 'audio') => {
    switch (type) {
      case 'lecture':
        return 'Giáo trình';
      case 'exercise':
        return 'Bài tập';
      case 'audio':
        return 'Audio/Video';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
              <BookOpen className="size-6 text-white" />
            </div>
            <h2 className="text-2xl text-white">Tài liệu lớp học</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="px-8 py-6 grid grid-cols-3 gap-4">
          {(['lecture', 'exercise', 'audio'] as const).map((type) => {
            const Icon = getCategoryIcon(type);
            const isActive = activeCategory === type;
            
            return (
              <button
                key={type}
                onClick={() => setActiveCategory(type)}
                className={`${getCategoryBgColor(type)} rounded-xl p-6 transition-all hover:scale-105 ${
                  isActive ? 'ring-2 ring-offset-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`bg-gradient-to-br ${getCategoryColor(type)} p-3 rounded-xl shadow-md`}>
                    <Icon className="size-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold text-gray-900">{stats[type]}</div>
                    <div className="text-sm text-gray-600 mt-0.5">{getCategoryName(type)}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Category Title */}
        <div className="px-8 pb-4">
          <div className="flex items-center gap-3">
            {(() => {
              const Icon = getCategoryIcon(activeCategory);
              return <Icon className="size-5 text-gray-700" />;
            })()}
            <h3 className="text-lg font-semibold text-gray-900">{getCategoryName(activeCategory)}</h3>
          </div>
        </div>

        {/* Materials List */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="grid grid-cols-2 gap-4">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                className="bg-gray-50 hover:bg-gray-100 rounded-xl p-5 transition-all hover:shadow-md border border-gray-200 group"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                    <FileText className="size-5 text-blue-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {material.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{material.fileType}</span>
                      <span>•</span>
                      <span>{material.size}</span>
                    </div>
                    
                    {/* Stats */}
                    {material.downloads && material.views && (
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Download className="size-3.5" />
                          <span>{material.downloads}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="size-3.5" />
                          <span>{material.views}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg">
                    <Download className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
