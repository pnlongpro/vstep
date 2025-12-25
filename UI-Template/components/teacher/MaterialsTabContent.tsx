// Material Tab Content Component for ClassDetailPageTeacher
import { useState } from 'react';
import { FileText, Download, Eye, Calendar, User, Headphones, Video, BookOpen, PenTool, Trash2, ArrowLeft, Search, Book, Music, Mic } from 'lucide-react';

type ClassCategory = 'textbook' | 'media';

interface TextbookMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'pptx';
  category: 'textbook';
  size: string;
  uploadDate: string;
  views: number;
  downloads: number;
  description: string;
  course?: string;
  author?: string;
}

interface MediaMaterial {
  id: string;
  name: string;
  type: 'video' | 'audio';
  category: 'media';
  skill?: 'Reading' | 'Listening' | 'Writing' | 'Speaking';
  course?: string;
  size: string;
  uploadDate: string;
  views: number;
  downloads: number;
  description: string;
  duration: string;
}

type ClassMaterial = TextbookMaterial | MediaMaterial;

interface MaterialsTabContentProps {
  classInfo: {
    course: string;
  };
}

export function MaterialsTabContent({ classInfo }: MaterialsTabContentProps) {
  const [classCategory, setClassCategory] = useState<ClassCategory>('textbook');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');

  // TEXTBOOK MATERIALS - Giáo trình (cho lớp học)
  const textbookMaterials: TextbookMaterial[] = [
    {
      id: 'TB001',
      name: 'Giáo trình VSTEP Complete - Full',
      type: 'pdf',
      category: 'textbook',
      size: '45.8 MB',
      uploadDate: '01/12/2024',
      views: 234,
      downloads: 187,
      description: 'Giáo trình VSTEP Complete đầy đủ 4 kỹ năng',
      course: 'VSTEP Complete',
      author: 'Nguyễn Thị Mai'
    },
    {
      id: 'TB002',
      name: 'VSTEP Grammar Guide',
      type: 'pdf',
      category: 'textbook',
      size: '28.3 MB',
      uploadDate: '02/12/2024',
      views: 198,
      downloads: 154,
      description: 'Hướng dẫn ngữ pháp toàn diện',
      course: 'VSTEP Complete',
      author: 'Nguyễn Thị Mai'
    },
    {
      id: 'TB003',
      name: 'Vocabulary Builder',
      type: 'pdf',
      category: 'textbook',
      size: '32.5 MB',
      uploadDate: '03/12/2024',
      views: 215,
      downloads: 168,
      description: '5000 từ vựng thiết yếu cho VSTEP Complete',
      course: 'VSTEP Complete',
      author: 'Nguyễn Thị Mai'
    }
  ];

  // MEDIA MATERIALS - Audio/Video
  const mediaMaterials: MediaMaterial[] = [
    {
      id: 'MD001',
      name: 'Video bài giảng Reading',
      type: 'video',
      category: 'media',
      skill: 'Reading',
      course: 'VSTEP Complete',
      size: '245 MB',
      uploadDate: '10/12/2024',
      views: 198,
      downloads: 123,
      description: 'Video hướng dẫn chiến lược Reading',
      duration: '45 phút'
    },
    {
      id: 'MD002',
      name: 'Video bài giảng Writing',
      type: 'video',
      category: 'media',
      skill: 'Writing',
      course: 'VSTEP Complete',
      size: '312 MB',
      uploadDate: '11/12/2024',
      views: 213,
      downloads: 154,
      description: 'Video hướng dẫn Writing Task 1&2',
      duration: '52 phút'
    },
    {
      id: 'MD003',
      name: 'Audio Listening - Part 2',
      type: 'audio',
      category: 'media',
      skill: 'Listening',
      course: 'VSTEP Complete',
      size: '156 MB',
      uploadDate: '12/12/2024',
      views: 204,
      downloads: 165,
      description: 'Bộ audio luyện nghe Part 2',
      duration: '35 phút'
    },
    {
      id: 'MD004',
      name: 'Video Grammar Essentials',
      type: 'video',
      category: 'media',
      course: 'VSTEP Complete',
      size: '278 MB',
      uploadDate: '13/12/2024',
      views: 189,
      downloads: 143,
      description: 'Video tổng hợp ngữ pháp cơ bản',
      duration: '48 phút'
    }
  ];

  // Get materials based on category
  const getMaterialsByCategory = (): ClassMaterial[] => {
    if (classCategory === 'textbook') return textbookMaterials;
    return mediaMaterials;
  };

  const classMaterials = getMaterialsByCategory();

  // Filter materials
  const filteredMaterials = classMaterials.filter(mat => {
    const matchesSearch = mat.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by skill (for exercises and media)
    if (mat.category === 'media') {
      const hasSkill = 'skill' in mat;
      if (filterSkill !== 'all' && hasSkill) {
        return matchesSearch && mat.skill === filterSkill;
      }
    }
    
    // Filter by course
    if (filterCourse !== 'all') {
      const hasCourse = 'course' in mat;
      if (hasCourse) {
        return matchesSearch && mat.course === filterCourse;
      }
    }
    
    return matchesSearch;
  });

  const getFileIcon = (type: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      docx: '📝',
      pptx: '📊',
      video: '🎥',
      audio: '🎵'
    };
    return icons[type] || '📁';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      pdf: 'bg-red-100 text-red-700 border-red-200',
      docx: 'bg-blue-100 text-blue-700 border-blue-200',
      pptx: 'bg-orange-100 text-orange-700 border-orange-200',
      video: 'bg-purple-100 text-purple-700 border-purple-200',
      audio: 'bg-pink-100 text-pink-700 border-pink-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FileText className="size-5 text-purple-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Thư viện tài liệu lớp học</h4>
            <p className="text-sm text-purple-700">
              Bao gồm <strong>Giáo trình</strong> chính thức, <strong>Bài tập</strong> luyện tập 4 kỹ năng, và <strong>Audio/Video</strong> hỗ trợ học tập cho khóa {classInfo.course}.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Book className="size-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{textbookMaterials.length}</h3>
          <p className="text-sm text-gray-600">Giáo trình</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Video className="size-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{mediaMaterials.length}</h3>
          <p className="text-sm text-gray-600">Audio/Video</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setClassCategory('textbook');
              setSearchTerm('');
              setFilterSkill('all');
              setFilterCourse('all');
            }}
            className={`flex-1 px-6 py-4 font-medium transition-colors border-b-2 ${
              classCategory === 'textbook'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Book className="size-5" />
              <span>Giáo trình</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                classCategory === 'textbook' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {textbookMaterials.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => {
              setClassCategory('media');
              setSearchTerm('');
              setFilterSkill('all');
              setFilterCourse('all');
            }}
            className={`flex-1 px-6 py-4 font-medium transition-colors border-b-2 ${
              classCategory === 'media'
                ? 'border-purple-600 text-purple-600 bg-purple-50'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Video className="size-5" />
              <span>Audio/Video</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                classCategory === 'media' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {mediaMaterials.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skill Filter - Only for exercises and media */}
            {(classCategory === 'media') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
                <select 
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">Tất cả kỹ năng</option>
                  <option value="Reading">Reading</option>
                  <option value="Listening">Listening</option>
                  <option value="Writing">Writing</option>
                  <option value="Speaking">Speaking</option>
                </select>
              </div>
            )}

            {/* Course Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Khóa học</label>
              <select 
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">Tất cả khóa học</option>
                <option value="VSTEP Complete">VSTEP Complete</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold text-purple-600">{filteredMaterials.length}</span> tài liệu
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <FileText className="size-4" />
            Thêm từ thư viện
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <Download className="size-4" />
            Tải lên mới
          </button>
        </div>
      </div>

      {/* Materials List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredMaterials.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="p-4 hover:bg-gray-50 transition-colors">
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
                      
                      {material.category === 'textbook' && 'course' in material && material.course && (
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                          {material.course}
                        </span>
                      )}
                      
                      {material.category === 'media' && (
                        <>
                          {material.skill && (
                            <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                              {material.skill}
                            </span>
                          )}
                          {material.course && (
                            <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                              {material.course}
                            </span>
                          )}
                          <span className="px-2 py-1 rounded-md text-xs font-medium bg-pink-100 text-pink-700 border border-pink-200">
                            ⏱️ {material.duration}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex items-center gap-6 flex-shrink-0">
                    {/* Size */}
                    <div className="text-center min-w-[60px]">
                      <div className="text-xs text-gray-500 mb-1">Kích thước</div>
                      <div className="text-sm font-medium text-gray-900">{material.size}</div>
                    </div>

                    {/* Downloads */}
                    <div className="text-center min-w-[60px]">
                      <div className="text-xs text-gray-500 mb-1">Tải xuống</div>
                      <div className="text-sm font-medium text-gray-900">{material.downloads}</div>
                    </div>

                    {/* Views */}
                    <div className="text-center min-w-[60px]">
                      <div className="text-xs text-gray-500 mb-1">Lượt xem</div>
                      <div className="text-sm font-medium text-gray-900">{material.views}</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => alert(`Tải về "${material.name}"`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                      >
                        <Download className="size-4" />
                        Download
                      </button>
                      <button className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="size-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy tài liệu</h3>
            <p className="text-gray-600 mb-6">Không tìm thấy tài liệu nào phù hợp với bộ lọc</p>
          </div>
        )}
      </div>

      {/* Suggested Materials from Library */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Tài liệu gợi ý từ thư viện chung</h3>
            <p className="text-sm text-gray-600 mt-1">Phù hợp với khóa học {classInfo.course}</p>
          </div>
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2">
            Xem tất cả
            <ArrowLeft className="size-4 rotate-180" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Suggested Material 1 */}
          <div className="p-5 border-2 border-blue-200 bg-blue-50 rounded-xl hover:shadow-md transition-all">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="size-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">VSTEP Reading Strategies - Complete Guide</h4>
                <p className="text-xs text-gray-600">PDF • 8.5 MB</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-600 mb-3">
              <BookOpen className="size-3" />
              <span>Reading • {classInfo.course}</span>
            </div>
            <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
              <FileText className="size-4" />
              Thêm vào lớp
            </button>
          </div>

          {/* Suggested Material 2 */}
          <div className="p-5 border-2 border-blue-200 bg-blue-50 rounded-xl hover:shadow-md transition-all">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Headphones className="size-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">VSTEP Listening Practice Audio Collection</h4>
                <p className="text-xs text-gray-600">Audio • 156 MB</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600 mb-3">
              <Headphones className="size-3" />
              <span>Listening • {classInfo.course}</span>
            </div>
            <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
              <FileText className="size-4" />
              Thêm vào lớp
            </button>
          </div>

          {/* Suggested Material 3 */}
          <div className="p-5 border-2 border-blue-200 bg-blue-50 rounded-xl hover:shadow-md transition-all">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <PenTool className="size-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">Academic Writing - VSTEP B2/C1</h4>
                <p className="text-xs text-gray-600">PPTX • 12.4 MB</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-600 mb-3">
              <PenTool className="size-3" />
              <span>Writing • {classInfo.course}</span>
            </div>
            <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
              <FileText className="size-4" />
              Thêm vào lớp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}