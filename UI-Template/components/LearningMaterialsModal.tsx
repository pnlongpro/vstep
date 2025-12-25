import { X, BookOpen, FileText, Download, Eye, BookA, Languages, BookMarked, PenTool, Headphones, Mic } from 'lucide-react';
import { useState } from 'react';

interface LearningMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Material {
  id: number;
  title: string;
  category: 'grammar' | 'vocabulary' | 'reading' | 'writing' | 'listening' | 'speaking';
  fileType: string;
  size: string;
  downloads?: number;
  views?: number;
  level: 'A2' | 'B1' | 'B2' | 'C1';
}

export function LearningMaterialsModal({ isOpen, onClose }: LearningMaterialsModalProps) {
  const [activeCategory, setActiveCategory] = useState<'grammar' | 'vocabulary' | 'reading' | 'writing' | 'listening' | 'speaking'>('grammar');

  if (!isOpen) return null;

  const stats = {
    grammar: 8,
    vocabulary: 10,
    reading: 12,
    writing: 9,
    listening: 11,
    speaking: 7,
  };

  const materials: Material[] = [
    // Grammar
    { id: 1, title: 'English Grammar in Use - Elementary', category: 'grammar', fileType: 'PDF', size: '15.2 MB', downloads: 456, views: 892, level: 'A2' },
    { id: 2, title: 'Essential Grammar in Use', category: 'grammar', fileType: 'PDF', size: '12.3 MB', downloads: 389, views: 745, level: 'B1' },
    { id: 3, title: 'Advanced Grammar in Use', category: 'grammar', fileType: 'PDF', size: '18.7 MB', downloads: 523, views: 1024, level: 'B2' },
    { id: 4, title: 'English Grammar Exercises - B2', category: 'grammar', fileType: 'PDF', size: '8.4 MB', downloads: 312, views: 634, level: 'B2' },
    { id: 5, title: 'Tenses Practice Workbook', category: 'grammar', fileType: 'PDF', size: '6.8 MB', downloads: 278, views: 589, level: 'B1' },
    { id: 6, title: 'Conditional Sentences Guide', category: 'grammar', fileType: 'PDF', size: '4.2 MB', downloads: 234, views: 478, level: 'B2' },
    { id: 7, title: 'Passive Voice Exercises', category: 'grammar', fileType: 'PDF', size: '3.5 MB', downloads: 198, views: 412, level: 'B1' },
    { id: 8, title: 'Modal Verbs Complete Guide', category: 'grammar', fileType: 'PDF', size: '5.9 MB', downloads: 267, views: 534, level: 'C1' },

    // Vocabulary
    { id: 9, title: 'Academic Vocabulary in Use', category: 'vocabulary', fileType: 'PDF', size: '14.3 MB', downloads: 512, views: 978, level: 'B2' },
    { id: 10, title: 'Essential Words for VSTEP', category: 'vocabulary', fileType: 'PDF', size: '9.8 MB', downloads: 445, views: 867, level: 'B1' },
    { id: 11, title: 'Collocations in Use - Intermediate', category: 'vocabulary', fileType: 'PDF', size: '11.2 MB', downloads: 378, views: 723, level: 'B2' },
    { id: 12, title: 'Phrasal Verbs Dictionary', category: 'vocabulary', fileType: 'PDF', size: '7.6 MB', downloads: 334, views: 645, level: 'B1' },
    { id: 13, title: 'Business English Vocabulary', category: 'vocabulary', fileType: 'PDF', size: '10.4 MB', downloads: 289, views: 578, level: 'B2' },
    { id: 14, title: 'Topic Vocabulary - 100 Topics', category: 'vocabulary', fileType: 'PDF', size: '16.7 MB', downloads: 498, views: 912, level: 'C1' },
    { id: 15, title: 'Idioms and Expressions', category: 'vocabulary', fileType: 'PDF', size: '8.9 MB', downloads: 356, views: 689, level: 'B2' },
    { id: 16, title: 'Word Formation Guide', category: 'vocabulary', fileType: 'PDF', size: '5.3 MB', downloads: 267, views: 534, level: 'B1' },
    { id: 17, title: 'Academic Word List Practice', category: 'vocabulary', fileType: 'PDF', size: '6.8 MB', downloads: 401, views: 789, level: 'C1' },
    { id: 18, title: 'Common Mistakes in English', category: 'vocabulary', fileType: 'PDF', size: '4.7 MB', downloads: 312, views: 612, level: 'B2' },

    // Reading
    { id: 19, title: 'VSTEP Reading Strategies B2', category: 'reading', fileType: 'PDF', size: '13.5 MB', downloads: 567, views: 1123, level: 'B2' },
    { id: 20, title: 'Academic Reading Practice - 50 Tests', category: 'reading', fileType: 'PDF', size: '25.8 MB', downloads: 489, views: 934, level: 'C1' },
    { id: 21, title: 'Reading Comprehension Skills', category: 'reading', fileType: 'PDF', size: '11.4 MB', downloads: 423, views: 834, level: 'B1' },
    { id: 22, title: 'VSTEP Reading Part 1-3 Guide', category: 'reading', fileType: 'PDF', size: '9.7 MB', downloads: 378, views: 745, level: 'B2' },
    { id: 23, title: 'Advanced Reading Tests', category: 'reading', fileType: 'PDF', size: '18.3 MB', downloads: 445, views: 867, level: 'C1' },
    { id: 24, title: 'Skimming & Scanning Techniques', category: 'reading', fileType: 'PDF', size: '7.2 MB', downloads: 334, views: 678, level: 'B1' },
    { id: 25, title: 'Reading for IELTS & VSTEP', category: 'reading', fileType: 'PDF', size: '15.6 MB', downloads: 512, views: 989, level: 'B2' },
    { id: 26, title: 'Critical Reading Practice', category: 'reading', fileType: 'PDF', size: '12.1 MB', downloads: 398, views: 756, level: 'C1' },
    { id: 27, title: 'Vocabulary in Context Reading', category: 'reading', fileType: 'PDF', size: '10.5 MB', downloads: 367, views: 701, level: 'B2' },
    { id: 28, title: 'VSTEP Reading Mock Tests', category: 'reading', fileType: 'PDF', size: '22.4 MB', downloads: 534, views: 1045, level: 'B2' },
    { id: 29, title: 'Academic Articles Collection', category: 'reading', fileType: 'PDF', size: '19.8 MB', downloads: 456, views: 889, level: 'C1' },
    { id: 30, title: 'Reading Speed Builder', category: 'reading', fileType: 'PDF', size: '8.9 MB', downloads: 312, views: 623, level: 'B1' },

    // Writing
    { id: 31, title: 'VSTEP Writing Task 1 & 2 Guide', category: 'writing', fileType: 'PDF', size: '10.3 MB', downloads: 489, views: 945, level: 'B2' },
    { id: 32, title: 'Essay Writing Templates', category: 'writing', fileType: 'PDF', size: '7.8 MB', downloads: 423, views: 834, level: 'B1' },
    { id: 33, title: '100 Sample Essays - VSTEP', category: 'writing', fileType: 'PDF', size: '16.5 MB', downloads: 567, views: 1089, level: 'B2' },
    { id: 34, title: 'Academic Writing Skills', category: 'writing', fileType: 'PDF', size: '12.7 MB', downloads: 401, views: 789, level: 'C1' },
    { id: 35, title: 'Linking Words & Cohesion', category: 'writing', fileType: 'PDF', size: '5.4 MB', downloads: 356, views: 689, level: 'B1' },
    { id: 36, title: 'Writing Task 2 Model Answers', category: 'writing', fileType: 'PDF', size: '9.2 MB', downloads: 445, views: 867, level: 'B2' },
    { id: 37, title: 'Grammar for Writing', category: 'writing', fileType: 'PDF', size: '8.6 MB', downloads: 378, views: 734, level: 'B2' },
    { id: 38, title: 'Advanced Writing Techniques', category: 'writing', fileType: 'PDF', size: '11.9 MB', downloads: 434, views: 823, level: 'C1' },
    { id: 39, title: 'Common Writing Mistakes', category: 'writing', fileType: 'PDF', size: '6.3 MB', downloads: 312, views: 612, level: 'B1' },

    // Listening
    { id: 40, title: 'VSTEP Listening Practice - 50 Tests', category: 'listening', fileType: 'ZIP', size: '156 MB', downloads: 534, views: 1034, level: 'B2' },
    { id: 41, title: 'Academic Listening Skills', category: 'listening', fileType: 'ZIP', size: '89 MB', downloads: 467, views: 912, level: 'C1' },
    { id: 42, title: 'Listening Strategies Guide', category: 'listening', fileType: 'PDF', size: '8.4 MB', downloads: 398, views: 778, level: 'B1' },
    { id: 43, title: 'Note-taking for Listening', category: 'listening', fileType: 'PDF', size: '6.7 MB', downloads: 345, views: 667, level: 'B2' },
    { id: 44, title: 'Dictation Practice Audio', category: 'listening', fileType: 'ZIP', size: '45 MB', downloads: 412, views: 801, level: 'B1' },
    { id: 45, title: 'VSTEP Listening Part 1-3', category: 'listening', fileType: 'ZIP', size: '112 MB', downloads: 489, views: 945, level: 'B2' },
    { id: 46, title: 'Advanced Listening Tests', category: 'listening', fileType: 'ZIP', size: '78 MB', downloads: 423, views: 834, level: 'C1' },
    { id: 47, title: 'Conversation Practice Audio', category: 'listening', fileType: 'ZIP', size: '67 MB', downloads: 378, views: 734, level: 'B1' },
    { id: 48, title: 'Academic Lectures - 30 Topics', category: 'listening', fileType: 'ZIP', size: '134 MB', downloads: 501, views: 967, level: 'B2' },
    { id: 49, title: 'Listening Mock Exams', category: 'listening', fileType: 'ZIP', size: '198 MB', downloads: 556, views: 1078, level: 'B2' },
    { id: 50, title: 'Pronunciation & Listening', category: 'listening', fileType: 'ZIP', size: '56 MB', downloads: 334, views: 656, level: 'B1' },

    // Speaking
    { id: 51, title: 'VSTEP Speaking Guide & Tips', category: 'speaking', fileType: 'PDF', size: '9.8 MB', downloads: 478, views: 923, level: 'B2' },
    { id: 52, title: 'Speaking Topics & Sample Answers', category: 'speaking', fileType: 'PDF', size: '12.4 MB', downloads: 512, views: 989, level: 'B2' },
    { id: 53, title: 'Speaking Video Tutorials', category: 'speaking', fileType: 'Video', size: '850 MB', downloads: 445, views: 867, level: 'B1' },
    { id: 54, title: 'Pronunciation Practice', category: 'speaking', fileType: 'ZIP', size: '78 MB', downloads: 389, views: 756, level: 'B1' },
    { id: 55, title: 'Part 3 Discussion Ideas', category: 'speaking', fileType: 'PDF', size: '7.3 MB', downloads: 423, views: 823, level: 'B2' },
    { id: 56, title: 'Fluency Building Exercises', category: 'speaking', fileType: 'PDF', size: '6.1 MB', downloads: 367, views: 701, level: 'B1' },
    { id: 57, title: 'Advanced Speaking Strategies', category: 'speaking', fileType: 'PDF', size: '10.7 MB', downloads: 456, views: 889, level: 'C1' },
  ];

  const filteredMaterials = materials.filter(m => m.category === activeCategory);

  const getCategoryIcon = (category: typeof activeCategory) => {
    switch (category) {
      case 'grammar': return BookA;
      case 'vocabulary': return Languages;
      case 'reading': return BookMarked;
      case 'writing': return PenTool;
      case 'listening': return Headphones;
      case 'speaking': return Mic;
    }
  };

  const getCategoryColor = (category: typeof activeCategory) => {
    switch (category) {
      case 'grammar': return 'from-blue-400 to-blue-600';
      case 'vocabulary': return 'from-emerald-400 to-emerald-600';
      case 'reading': return 'from-purple-400 to-purple-600';
      case 'writing': return 'from-pink-400 to-pink-600';
      case 'listening': return 'from-green-400 to-green-600';
      case 'speaking': return 'from-orange-400 to-orange-600';
    }
  };

  const getCategoryBgColor = (category: typeof activeCategory) => {
    switch (category) {
      case 'grammar': return 'bg-blue-50';
      case 'vocabulary': return 'bg-emerald-50';
      case 'reading': return 'bg-purple-50';
      case 'writing': return 'bg-pink-50';
      case 'listening': return 'bg-green-50';
      case 'speaking': return 'bg-orange-50';
    }
  };

  const getCategoryName = (category: typeof activeCategory) => {
    switch (category) {
      case 'grammar': return 'Ngữ pháp';
      case 'vocabulary': return 'Từ vựng';
      case 'reading': return 'Đọc hiểu';
      case 'writing': return 'Viết';
      case 'listening': return 'Nghe';
      case 'speaking': return 'Nói';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A2': return 'bg-green-100 text-green-700';
      case 'B1': return 'bg-blue-100 text-blue-700';
      case 'B2': return 'bg-purple-100 text-purple-700';
      case 'C1': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
              <BookOpen className="size-6 text-white" />
            </div>
            <h2 className="text-2xl text-white">Tài liệu học tập</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-8 py-6 grid grid-cols-6 gap-3">
          {(['grammar', 'vocabulary', 'reading', 'writing', 'listening', 'speaking'] as const).map((category) => {
            const Icon = getCategoryIcon(category);
            const isActive = activeCategory === category;
            
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`${getCategoryBgColor(category)} rounded-xl p-4 transition-all hover:scale-105 ${
                  isActive ? 'ring-2 ring-offset-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`bg-gradient-to-br ${getCategoryColor(category)} p-2.5 rounded-xl shadow-md`}>
                    <Icon className="size-5 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats[category]}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{getCategoryName(category)}</div>
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
            <span className="text-sm text-gray-500">({filteredMaterials.length} tài liệu)</span>
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
                  <div className={`${getCategoryBgColor(activeCategory)} p-3 rounded-lg flex-shrink-0 border-2 border-white shadow-sm`}>
                    <FileText className={`size-5 ${activeCategory === 'grammar' ? 'text-blue-600' : activeCategory === 'vocabulary' ? 'text-emerald-600' : activeCategory === 'reading' ? 'text-purple-600' : activeCategory === 'writing' ? 'text-pink-600' : activeCategory === 'listening' ? 'text-green-600' : 'text-orange-600'}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {material.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span className={`px-2 py-0.5 rounded ${getLevelColor(material.level)}`}>{material.level}</span>
                      <span>{material.fileType}</span>
                      <span>•</span>
                      <span>{material.size}</span>
                    </div>
                    
                    {/* Stats */}
                    {material.downloads && material.views && (
                      <div className="flex items-center gap-4 text-xs text-gray-600">
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

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors" title="Tải về">
                      <Download className="size-4" />
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-lg transition-colors" title="Xem">
                      <Eye className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}