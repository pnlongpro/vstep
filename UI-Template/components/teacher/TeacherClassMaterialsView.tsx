import { useState } from 'react';
import { Search, Download, Video, Book, Plus, Eye, Calendar, XCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { textbookMaterialsData, mediaMaterialsData, type Material, type ClassCategory } from '../../data/classMaterialsData';

export function TeacherClassMaterialsView() {
  const [classCategory, setClassCategory] = useState<ClassCategory>('textbook');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('VSTEP Complete');

  // Get current materials based on category
  const currentMaterials = classCategory === 'textbook' ? textbookMaterialsData : mediaMaterialsData;

  // Filter materials
  const filteredClassMaterials = currentMaterials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = material.course === filterCourse;
    const matchesSkill = filterSkill === 'all' || 
                        (classCategory === 'media' && 'skill' in material && material.skill === filterSkill);
    // Teacher chỉ xem tài liệu đã duyệt
    const isApproved = material.status === 'approved';
    return matchesSearch && matchesCourse && matchesSkill && isApproved;
  });

  // Count materials by course (only approved)
  const approvedMaterials = currentMaterials.filter(m => m.status === 'approved');
  const countByCourse = {
    'VSTEP Complete': approvedMaterials.filter(m => m.course === 'VSTEP Complete').length,
    'VSTEP Foundation': approvedMaterials.filter(m => m.course === 'VSTEP Foundation').length,
    'VSTEP Starter': approvedMaterials.filter(m => m.course === 'VSTEP Starter').length,
    'VSTEP Builder': approvedMaterials.filter(m => m.course === 'VSTEP Builder').length,
    'VSTEP Developer': approvedMaterials.filter(m => m.course === 'VSTEP Developer').length,
    'VSTEP Booster': approvedMaterials.filter(m => m.course === 'VSTEP Booster').length,
    'VSTEP Intensive': approvedMaterials.filter(m => m.course === 'VSTEP Intensive').length,
    'VSTEP Practice': approvedMaterials.filter(m => m.course === 'VSTEP Practice').length,
    'VSTEP Premium': approvedMaterials.filter(m => m.course === 'VSTEP Premium').length,
    'VSTEP Master': approvedMaterials.filter(m => m.course === 'VSTEP Master').length,
  };

  const getFileIcon = (type: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      docx: '📝',
      pptx: '📊',
      xlsx: '📗',
      video: '🎥',
      audio: '🎵',
    };
    return icons[type] || '📁';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      pdf: 'bg-red-100 text-red-700 border-red-200',
      docx: 'bg-blue-100 text-blue-700 border-blue-200',
      pptx: 'bg-orange-100 text-orange-700 border-orange-200',
      xlsx: 'bg-green-100 text-green-700 border-green-200',
      video: 'bg-purple-100 text-purple-700 border-purple-200',
      audio: 'bg-pink-100 text-pink-700 border-pink-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Stats
  const approvedTextbooks = textbookMaterialsData.filter(m => m.status === 'approved').length;
  const approvedMedia = mediaMaterialsData.filter(m => m.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Book className="size-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{approvedTextbooks}</h3>
          <p className="text-sm text-gray-600">Giáo trình</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Video className="size-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{approvedMedia}</h3>
          <p className="text-sm text-gray-600">Audio/Video</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="flex border-b-2 border-gray-200">
          <button
            onClick={() => {
              setClassCategory('textbook');
              setSearchTerm('');
              setFilterSkill('all');
            }}
            className={`flex-1 px-6 py-4 font-medium transition-colors border-b-4 ${
              classCategory === 'textbook'
                ? 'border-blue-600 text-blue-600 bg-blue-50 -mb-0.5'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Book className="size-5" />
              <span>Giáo trình</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                classCategory === 'textbook' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {approvedTextbooks}
              </span>
            </div>
          </button>
          <button
            onClick={() => {
              setClassCategory('media');
              setSearchTerm('');
              setFilterSkill('all');
            }}
            className={`flex-1 px-6 py-4 font-medium transition-colors border-b-4 ${
              classCategory === 'media'
                ? 'border-purple-600 text-purple-600 bg-purple-50 -mb-0.5'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Video className="size-5" />
              <span>Audio/Video</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                classCategory === 'media' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {approvedMedia}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Course Tabs */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Lọc theo khóa học</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { name: 'VSTEP Complete', icon: '🎯' },
              { name: 'VSTEP Foundation', icon: '📚' },
              { name: 'VSTEP Starter', icon: '🚀' },
              { name: 'VSTEP Builder', icon: '🏗️' },
              { name: 'VSTEP Developer', icon: '💻' },
              { name: 'VSTEP Booster', icon: '⚡' },
              { name: 'VSTEP Intensive', icon: '🔥' },
              { name: 'VSTEP Practice', icon: '📝' },
              { name: 'VSTEP Premium', icon: '👑' },
              { name: 'VSTEP Master', icon: '🏆' },
            ].map((course) => (
              <button
                key={course.name}
                onClick={() => setFilterCourse(course.name)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  filterCourse === course.name
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div>{course.icon} {course.name}</div>
                <div className="text-xs opacity-80 mt-1">{countByCourse[course.name]} tài liệu</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Skill Filter - Only for media */}
          {classCategory === 'media' && (
            <div>
              <select 
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">Tất cả kỹ năng</option>
                <option value="Reading">Reading</option>
                <option value="Listening">Listening</option>
                <option value="Writing">Writing</option>
                <option value="Speaking">Speaking</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold text-purple-600">{filteredClassMaterials.length}</span> tài liệu
        </p>
      </div>

      {/* Materials List */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="divide-y-2 divide-gray-200">
          {filteredClassMaterials.map((material) => (
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
                    
                    {material.course && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {material.course}
                      </span>
                    )}
                    
                    {material.category === 'media' && 'skill' in material && material.skill && (
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        {material.skill}
                      </span>
                    )}

                    {material.category === 'media' && 'duration' in material && (
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-pink-100 text-pink-700 border border-pink-200">
                        ⏱️ {material.duration}
                      </span>
                    )}

                    {material.category === 'textbook' && 'author' in material && material.author && (
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        👤 {material.author}
                      </span>
                    )}

                    {material.category === 'textbook' && 'pages' in material && material.pages && (
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                        📄 {material.pages} trang
                      </span>
                    )}

                    <span className="px-2 py-1 rounded-md text-xs text-gray-600">
                      {material.size}
                    </span>
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex items-center gap-4 flex-shrink-0">
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

                  {/* Action Buttons - Only View and Download */}
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Tải xuống"
                    >
                      <Download className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredClassMaterials.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border-2 border-gray-200">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Book className="size-12 text-gray-400" />
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
