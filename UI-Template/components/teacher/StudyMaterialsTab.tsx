import { useState } from 'react';
import { Search, Download, Book, FileText, Target, PenTool } from 'lucide-react';
import { allStudyMaterials, getStudyMaterials, type StudyCategory } from './studyMaterialsData';

interface StudyMaterialsTabProps {
  onFilterChange?: () => void;
}

export function StudyMaterialsTab({ onFilterChange }: StudyMaterialsTabProps) {
  const [studyCategory, setStudyCategory] = useState<StudyCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  // Get filtered study materials
  const filteredStudyMaterials = getStudyMaterials(
    studyCategory,
    filterLevel !== 'all' ? (filterLevel as 'A2' | 'B1' | 'B2' | 'C1') : undefined,
    filterSkill,
    searchTerm
  );

  // Count study materials by category
  const studyMaterialCounts = {
    all: allStudyMaterials.length,
    textbook: allStudyMaterials.filter(m => m.category === 'textbook').length,
    lecture: allStudyMaterials.filter(m => m.category === 'lecture').length,
    exercise: allStudyMaterials.filter(m => m.category === 'exercise').length,
  };

  const getFileIcon = (type: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      docx: '📝',
      pptx: '📊',
      xlsx: '📗',
    };
    return icons[type] || '📁';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      pdf: 'bg-red-100 text-red-700 border-red-200',
      docx: 'bg-blue-100 text-blue-700 border-blue-200',
      pptx: 'bg-orange-100 text-orange-700 border-orange-200',
      xlsx: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getCategoryLabel = (category: StudyCategory) => {
    const labels: Record<string, string> = {
      all: 'Tất cả',
      textbook: 'Sách giáo khoa',
      lecture: 'Bài giảng',
      exercise: 'Bài tập',
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category: StudyCategory) => {
    if (category === 'textbook') return <Book className="size-5" />;
    if (category === 'lecture') return <FileText className="size-5" />;
    if (category === 'exercise') return <PenTool className="size-5" />;
    return <Target className="size-5" />;
  };

  const getCategoryColor = (category: StudyCategory, isActive: boolean) => {
    const colors: Record<string, string> = {
      all: isActive ? 'border-orange-600 text-orange-600 bg-orange-50' : '',
      textbook: isActive ? 'border-blue-600 text-blue-600 bg-blue-50' : '',
      lecture: isActive ? 'border-purple-600 text-purple-600 bg-purple-50' : '',
      exercise: isActive ? 'border-green-600 text-green-600 bg-green-50' : '',
    };
    return isActive ? colors[category] : 'border-transparent text-gray-600 hover:bg-gray-50';
  };

  const getBadgeColor = (category: StudyCategory, isActive: boolean) => {
    const colors: Record<string, string> = {
      all: isActive ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700',
      textbook: isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700',
      lecture: isActive ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700',
      exercise: isActive ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700',
    };
    return colors[category];
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Book className="size-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{studyMaterialCounts.textbook}</h3>
          <p className="text-sm text-gray-600">Sách giáo khoa</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="size-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{studyMaterialCounts.lecture}</h3>
          <p className="text-sm text-gray-600">Bài giảng</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <PenTool className="size-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{studyMaterialCounts.exercise}</h3>
          <p className="text-sm text-gray-600">Bài tập</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Target className="size-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{studyMaterialCounts.all}</h3>
          <p className="text-sm text-gray-600">Tổng tài liệu</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="grid grid-cols-4 border-b-2 border-gray-200">
          {(['all', 'textbook', 'lecture', 'exercise'] as StudyCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setStudyCategory(cat);
                setSearchTerm('');
                setFilterSkill('all');
                setFilterLevel('all');
              }}
              className={`px-6 py-4 font-medium transition-colors border-b-4 ${getCategoryColor(cat, studyCategory === cat)} -mb-0.5`}
            >
              <div className="flex items-center justify-center gap-2">
                {getCategoryIcon(cat)}
                <span>{getCategoryLabel(cat)}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${getBadgeColor(cat, studyCategory === cat)}`}>
                  {cat === 'all' ? studyMaterialCounts.all : studyMaterialCounts[cat]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div className="relative md:col-span-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trình độ</label>
            <select 
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Tất cả trình độ</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
            </select>
          </div>

          {/* Skill Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
            <select 
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Tất cả kỹ năng</option>
              <option value="Reading">Reading</option>
              <option value="Listening">Listening</option>
              <option value="Writing">Writing</option>
              <option value="Speaking">Speaking</option>
              <option value="Grammar">Grammar</option>
              <option value="Vocabulary">Vocabulary</option>
            </select>
          </div>

          {/* Quick Reset */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterSkill('all');
                setFilterLevel('all');
              }}
              className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold text-orange-600">{filteredStudyMaterials.length}</span> tài liệu
        </p>
      </div>

      {/* Materials List */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="divide-y-2 divide-gray-200">
          {filteredStudyMaterials.map((material) => (
            <div key={material.id} className="p-5 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="text-4xl flex-shrink-0">
                  {getFileIcon(material.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{material.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">{material.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor(material.type)}`}>
                      {material.type.toUpperCase()}
                    </span>
                    
                    {material.level && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        {material.level}
                      </span>
                    )}
                    
                    {material.skill && (
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        {material.skill}
                      </span>
                    )}

                    {material.course && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {material.course}
                      </span>
                    )}

                    {material.author && (
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        👤 {material.author}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex items-center gap-6 flex-shrink-0">
                  {/* Size */}
                  <div className="text-center min-w-[80px]">
                    <div className="text-xs text-gray-500 mb-1">Kích thước</div>
                    <div className="text-sm font-medium text-gray-900">{material.size}</div>
                  </div>

                  {/* Downloads */}
                  <div className="text-center min-w-[80px]">
                    <div className="text-xs text-gray-500 mb-1">Tải xuống</div>
                    <div className="text-sm font-medium text-gray-900">{material.downloads.toLocaleString()}</div>
                  </div>

                  {/* Views */}
                  <div className="text-center min-w-[80px]">
                    <div className="text-xs text-gray-500 mb-1">Lượt xem</div>
                    <div className="text-sm font-medium text-gray-900">{material.views.toLocaleString()}</div>
                  </div>

                  {/* Download Button */}
                  <button 
                    onClick={() => alert(`Tải về "${material.name}"`)}
                    className="flex items-center gap-2 px-5 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    <Download className="size-4" />
                    Tải về
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredStudyMaterials.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border-2 border-gray-200">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="size-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy tài liệu</h3>
          <p className="text-gray-600">
            Không tìm thấy tài liệu nào phù hợp với bộ lọc
          </p>
        </div>
      )}
    </div>
  );
}
