import { useState } from 'react';
import { Search, Download, Plus, Edit, Trash2, Eye, HelpCircle, CheckCircle, Clock, Tag } from 'lucide-react';

export function QuestionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data
  const questionStats = [
    { title: 'Tổng câu hỏi', value: '8,456', change: '+23%', icon: HelpCircle, color: 'from-blue-500 to-blue-600' },
    { title: 'Đã kiểm duyệt', value: '6,234', change: '+15%', icon: CheckCircle, color: 'from-green-500 to-green-600' },
    { title: 'Chờ duyệt', value: '1,456', change: '+8%', icon: Clock, color: 'from-orange-500 to-orange-600' },
    { title: 'Tags đã tạo', value: '234', change: '+5%', icon: Tag, color: 'from-purple-500 to-purple-600' },
  ];

  const questions = [
    { id: 1, content: 'What is the main idea of the passage?', skill: 'Reading', level: 'B2', type: 'Multiple Choice', difficulty: 'Medium', tags: ['Main Idea', 'Comprehension'], usedIn: 12, status: 'approved', created: '2024-01-15', author: 'TS. Nguyễn Văn A' },
    { id: 2, content: 'Write an essay about environmental protection (min 250 words)', skill: 'Writing', level: 'C1', type: 'Essay', difficulty: 'Hard', tags: ['Essay', 'Environment'], usedIn: 8, status: 'approved', created: '2024-02-20', author: 'ThS. Trần Thị B' },
    { id: 3, content: 'Listen and choose the correct answer about the conversation', skill: 'Listening', level: 'B1', type: 'Multiple Choice', difficulty: 'Easy', tags: ['Conversation', 'Details'], usedIn: 15, status: 'approved', created: '2024-03-10', author: 'TS. Lê Văn C' },
    { id: 4, content: 'Describe your hometown in 2 minutes', skill: 'Speaking', level: 'B2', type: 'Monologue', difficulty: 'Medium', tags: ['Description', 'Personal'], usedIn: 6, status: 'pending', created: '2024-04-05', author: 'ThS. Phạm Thị D' },
    { id: 5, content: 'Identify the synonym of the underlined word', skill: 'Reading', level: 'C1', type: 'Vocabulary', difficulty: 'Hard', tags: ['Vocabulary', 'Synonyms'], usedIn: 20, status: 'approved', created: '2024-05-12', author: 'GV. Hoàng Văn E' },
    { id: 6, content: 'Fill in the blank with the correct word you hear', skill: 'Listening', level: 'A2', type: 'Fill in Blank', difficulty: 'Easy', tags: ['Listening', 'Vocabulary'], usedIn: 18, status: 'approved', created: '2024-06-25', author: 'TS. Vũ Thị F' },
    { id: 7, content: 'Write a formal letter to your manager (min 150 words)', skill: 'Writing', level: 'B2', type: 'Letter', difficulty: 'Medium', tags: ['Formal Writing', 'Letter'], usedIn: 9, status: 'approved', created: '2024-07-15', author: 'ThS. Đặng Văn G' },
    { id: 8, content: 'Have a conversation about your favorite hobby', skill: 'Speaking', level: 'B1', type: 'Conversation', difficulty: 'Easy', tags: ['Conversation', 'Hobbies'], usedIn: 11, status: 'pending', created: '2024-08-20', author: 'GV. Bùi Thị H' },
    { id: 9, content: 'What can be inferred from paragraph 3?', skill: 'Reading', level: 'C1', type: 'Inference', difficulty: 'Hard', tags: ['Inference', 'Critical Thinking'], usedIn: 7, status: 'approved', created: '2024-09-18', author: 'TS. Đinh Văn I' },
    { id: 10, content: 'Listen and answer the multiple questions about the lecture', skill: 'Listening', level: 'B2', type: 'Multiple Choice', difficulty: 'Medium', tags: ['Lecture', 'Academic'], usedIn: 13, status: 'approved', created: '2024-10-22', author: 'ThS. Mai Thị K' },
  ];

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSkill = filterSkill === 'all' || q.skill === filterSkill;
    const matchesLevel = filterLevel === 'all' || q.level === filterLevel;
    const matchesType = filterType === 'all' || q.type === filterType;
    return matchesSearch && matchesSkill && matchesLevel && matchesType;
  });

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {questionStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-3">
                <Icon className="size-10 opacity-80" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{stat.change}</span>
              </div>
              <h3 className="text-3xl mb-1">{stat.value}</h3>
              <p className="text-sm opacity-90">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo nội dung hoặc tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Skill Filter */}
          <select
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả kỹ năng</option>
            <option value="Reading">Reading</option>
            <option value="Listening">Listening</option>
            <option value="Writing">Writing</option>
            <option value="Speaking">Speaking</option>
          </select>

          {/* Level Filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả cấp độ</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả loại</option>
            <option value="Multiple Choice">Trắc nghiệm</option>
            <option value="Essay">Luận</option>
            <option value="Fill in Blank">Điền từ</option>
            <option value="Vocabulary">Từ vựng</option>
          </select>
        </div>

        <div className="flex gap-2">
          {/* Add Question Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="size-4" />
            Thêm câu hỏi
          </button>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="size-4" />
            Xuất file
          </button>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Nội dung</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Kỹ năng</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Cấp độ</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Loại</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Độ khó</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Tags</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Đã dùng</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Trạng thái</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedQuestions.map((question) => (
                <tr key={question.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="max-w-xs">
                      <p className="text-sm truncate" title={question.content}>{question.content}</p>
                      <p className="text-xs text-gray-500">Tạo bởi: {question.author}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      question.skill === 'Reading' ? 'bg-blue-100 text-blue-700' :
                      question.skill === 'Listening' ? 'bg-purple-100 text-purple-700' :
                      question.skill === 'Writing' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {question.skill}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
                      {question.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{question.type}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {question.difficulty === 'Easy' ? 'Dễ' :
                       question.difficulty === 'Medium' ? 'Trung bình' :
                       'Khó'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {question.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{question.usedIn}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      question.status === 'approved' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {question.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-gray-200 rounded" title="Xem">
                        <Eye className="size-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded" title="Chỉnh sửa">
                        <Edit className="size-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded" title="Xóa">
                        <Trash2 className="size-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, filteredQuestions.length)} trong tổng số {filteredQuestions.length} câu hỏi
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
