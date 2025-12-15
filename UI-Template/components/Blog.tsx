import { useState } from 'react';
import { ArrowLeft, BookOpen, Headphones, FileText, Mic, GraduationCap, ArrowRight, User, Calendar } from 'lucide-react';

interface BlogProps {
  onBack: () => void;
}

type Category = 'all' | 'reading' | 'listening' | 'writing' | 'speaking' | 'study';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  category: Category;
  author: string;
  date: string;
  gradient: string;
  icon: any;
}

export function Blog({ onBack }: BlogProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const categories = [
    { id: 'all', name: 'Tất cả', icon: GraduationCap },
    { id: 'reading', name: 'Reading Tips', icon: BookOpen },
    { id: 'listening', name: 'Listening Tips', icon: Headphones },
    { id: 'writing', name: 'Writing Guide', icon: FileText },
    { id: 'speaking', name: 'Speaking Guide', icon: Mic },
    { id: 'study', name: 'Study Tips', icon: GraduationCap },
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: '10 Mẹo Làm Bài Reading VSTEP Hiệu Quả',
      description: 'Khám phá các chiến lược giúp bạn đọc nhanh hơn và trả lời chính xác hơn trong phần Reading...',
      category: 'reading',
      author: 'Nguyễn Văn A',
      date: '10/12/2024',
      gradient: 'from-blue-400 to-blue-600',
      icon: BookOpen,
    },
    {
      id: 2,
      title: 'Cách Cải Thiện Kỹ Năng Nghe Tiếng Anh',
      description: 'Phương pháp luyện nghe hiệu quả giúp bạn nắm bắt thông tin chính xác trong bài thi Listening...',
      category: 'listening',
      author: 'Trần Thị B',
      date: '08/12/2024',
      gradient: 'from-purple-400 to-purple-600',
      icon: Headphones,
    },
    {
      id: 3,
      title: 'Template Writing Task 2 Điểm Cao',
      description: 'Bộ template chuẩn giúp bạn viết bài luận VSTEP đạt điểm 7.5+ với cấu trúc rõ ràng...',
      category: 'writing',
      author: 'Lê Văn C',
      date: '05/12/2024',
      gradient: 'from-orange-400 to-orange-600',
      icon: FileText,
    },
    {
      id: 4,
      title: 'Speaking Script Mẫu Cho Part 3',
      description: 'Các cấu trúc lời mẫu và từ vựng hữu ích cho phần thảo luận trong bài thi Speaking...',
      category: 'speaking',
      author: 'Phạm Thị D',
      date: '03/12/2024',
      gradient: 'from-green-400 to-green-600',
      icon: Mic,
    },
    {
      id: 5,
      title: 'So Sánh VSTEP Với IELTS',
      description: 'Phân tích chi tiết sự khác biệt giữa kỳ thi VSTEP và IELTS để bạn đưa ra lựa chọn phù hợp...',
      category: 'study',
      author: 'Nguyễn Văn A',
      date: '01/12/2024',
      gradient: 'from-indigo-400 to-indigo-600',
      icon: GraduationCap,
    },
    {
      id: 6,
      title: 'Lộ Trình Học VSTEP Từ A2 Lên B2',
      description: 'Hướng dẫn chi tiết từng bước để cải thiện trình độ tiếng Anh từ cơ bản đến trung cấp...',
      category: 'study',
      author: 'Trần Thị B',
      date: '28/11/2024',
      gradient: 'from-pink-400 to-pink-600',
      icon: GraduationCap,
    },
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="size-6" />
        </button>
        <div>
          <h2 className="text-2xl">Blog</h2>
          <p className="text-gray-600">
            Kiến thức, mẹo học tập và hướng dẫn chi tiết cho kỳ thi VSTEP
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-200">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as Category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="size-4" />
              <span className="text-sm">{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => {
          const Icon = post.icon;
          return (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
            >
              {/* Gradient Header with Icon */}
              <div className={`bg-gradient-to-r ${post.gradient} p-8 text-white flex items-center justify-center`}>
                <Icon className="size-20 opacity-80" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg">
                    {categories.find(c => c.id === post.category)?.name || 'Study Tips'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {post.description}
                </p>

                {/* Meta Information */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="size-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>{post.date}</span>
                  </div>
                </div>

                {/* Read More Button */}
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm group/btn">
                  <span>Đọc tiếp</span>
                  <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="size-12 text-gray-400" />
          </div>
          <h3 className="text-xl text-gray-900 mb-2">Chưa có bài viết</h3>
          <p className="text-gray-600">Danh mục này đang được cập nhật. Vui lòng quay lại sau.</p>
        </div>
      )}
    </div>
  );
}
