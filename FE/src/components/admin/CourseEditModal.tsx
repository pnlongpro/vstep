import { useState } from 'react';
import { X, Info, BookOpen, Smartphone, FileText, Map, Plus, Trash2, Upload, GripVertical, CheckCircle, Clock, PlayCircle } from 'lucide-react';

interface CourseEditModalProps {
  isOpen: boolean;
  course: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function CourseEditModal({ isOpen, course, onClose, onSave }: CourseEditModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'devices' | 'documents' | 'roadmap'>('info');
  const [deviceLimit, setDeviceLimit] = useState(course?.deviceLimit || 2);
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Giáo trình Writing Task 1.pdf', type: 'PDF', size: '2.5 MB', uploadDate: '15/12/2024', downloads: 234 },
    { id: 2, name: 'Bài tập thực hành Speaking.docx', type: 'DOCX', size: '1.8 MB', uploadDate: '12/12/2024', downloads: 189 },
    { id: 3, name: 'Từ vựng VSTEP B2.xlsx', type: 'XLSX', size: '850 KB', uploadDate: '10/12/2024', downloads: 456 },
  ]);
  const [roadmapItems, setRoadmapItems] = useState([
    { id: 1, week: 1, title: 'Làm quen với VSTEP', lessons: 5, duration: '2 giờ', status: 'completed', order: 1 },
    { id: 2, week: 2, title: 'Reading Foundation', lessons: 8, duration: '3 giờ', status: 'in-progress', order: 2 },
    { id: 3, week: 3, title: 'Listening Basics', lessons: 6, duration: '2.5 giờ', status: 'locked', order: 3 },
    { id: 4, week: 4, title: 'Writing Task 1', lessons: 10, duration: '4 giờ', status: 'locked', order: 4 },
    { id: 5, week: 5, title: 'Speaking Part 1-2', lessons: 7, duration: '3 giờ', status: 'locked', order: 5 },
  ]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'info', label: 'Thông tin cơ bản', icon: BookOpen },
    { id: 'devices', label: 'Giới hạn thiết bị', icon: Smartphone },
    { id: 'documents', label: 'Tài liệu khóa học', icon: FileText },
    { id: 'roadmap', label: 'Lộ trình học tập', icon: Map },
  ];

  const handleAddDocument = () => {
    // Mock add document
    const newDoc = {
      id: documents.length + 1,
      name: 'Tài liệu mới.pdf',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: new Date().toLocaleDateString('vi-VN'),
      downloads: 0
    };
    setDocuments([...documents, newDoc]);
  };

  const handleRemoveDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleAddRoadmapItem = () => {
    const newItem = {
      id: roadmapItems.length + 1,
      week: roadmapItems.length + 1,
      title: `Tuần ${roadmapItems.length + 1}`,
      lessons: 0,
      duration: '0 giờ',
      status: 'locked',
      order: roadmapItems.length + 1
    };
    setRoadmapItems([...roadmapItems, newItem]);
  };

  const handleRemoveRoadmapItem = (id: number) => {
    setRoadmapItems(roadmapItems.filter(item => item.id !== id));
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h3 className="text-xl mb-1">Chỉnh sửa khóa học</h3>
            <p className="text-sm text-gray-600">{course?.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors">
            <X className="size-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="size-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Tab: Thông tin cơ bản */}
          {activeTab === 'info' && (
            <div className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Tên khóa học</label>
                  <input
                    type="text"
                    defaultValue={course?.title}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Danh mục</label>
                  <select
                    defaultValue={course?.category}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Full Course</option>
                    <option>Reading</option>
                    <option>Listening</option>
                    <option>Writing</option>
                    <option>Speaking</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Giảng viên</label>
                  <input
                    type="text"
                    defaultValue={course?.instructor}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Giá khóa học</label>
                  <input
                    type="text"
                    defaultValue={course?.price}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2">Số bài học</label>
                  <input
                    type="number"
                    defaultValue={course?.lessons}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Thời lượng</label>
                  <input
                    type="text"
                    defaultValue={course?.duration}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Trạng thái</label>
                  <select
                    defaultValue={course?.status}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="draft">Bản nháp</option>
                    <option value="inactive">Tạm ngưng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Mô tả khóa học</label>
                <textarea
                  rows={4}
                  placeholder="Nhập mô tả chi tiết về khóa học..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Tab: Giới hạn thiết bị */}
          {activeTab === 'devices' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Smartphone className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm mb-2">Giới hạn số thiết bị đăng nhập</h4>
                    <p className="text-xs text-blue-700 mb-4">
                      Đặt số thiết bị tối đa mà học viên có thể đăng nhập cùng lúc khi học khóa này.
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={deviceLimit}
                        onChange={(e) => setDeviceLimit(parseInt(e.target.value) || 1)}
                        min="1"
                        max="10"
                        className="w-24 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                      <span className="text-sm text-gray-600">thiết bị</span>
                      <div className="flex-1 bg-white rounded-lg px-3 py-2 border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Info className="size-4 text-blue-600" />
                          <span className="text-xs text-gray-600">
                            Khuyến nghị: <strong className="text-blue-600">2 thiết bị</strong> (PC + Mobile)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Giới hạn hiện tại</p>
                  <p className="text-2xl text-blue-600">{deviceLimit}</p>
                  <p className="text-xs text-gray-500">thiết bị/học viên</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Học viên áp dụng</p>
                  <p className="text-2xl text-gray-900">{course?.students || 0}</p>
                  <p className="text-xs text-gray-500">người dùng</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Tổng slot</p>
                  <p className="text-2xl text-gray-900">{(course?.students || 0) * deviceLimit}</p>
                  <p className="text-xs text-gray-500">thiết bị tối đa</p>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="size-4 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><strong>Lưu ý quan trọng:</strong></p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                      <li>Giới hạn này áp dụng cho TẤT CẢ học viên của khóa học</li>
                      <li>Thay đổi sẽ có hiệu lực ngay lập tức với học viên mới</li>
                      <li>Học viên cũ sẽ được thông báo về thay đổi</li>
                      <li>Nếu giảm giới hạn, học viên vượt quá sẽ bị đăng xuất thiết bị cũ nhất</li>
                      <li>Admin vẫn có thể force logout thiết bị cá nhân nếu cần</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <p className="text-sm mb-3">Mẫu nhanh:</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeviceLimit(1)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      deviceLimit === 1
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-sm">1 thiết bị</div>
                    <div className="text-xs text-gray-500">Strict mode</div>
                  </button>
                  <button
                    onClick={() => setDeviceLimit(2)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      deviceLimit === 2
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-sm">2 thiết bị</div>
                    <div className="text-xs text-gray-500">Khuyến nghị</div>
                  </button>
                  <button
                    onClick={() => setDeviceLimit(3)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      deviceLimit === 3
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-sm">3 thiết bị</div>
                    <div className="text-xs text-gray-500">Flexible</div>
                  </button>
                  <button
                    onClick={() => setDeviceLimit(5)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      deviceLimit === 5
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-sm">5 thiết bị</div>
                    <div className="text-xs text-gray-500">Premium</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Tài liệu khóa học */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm mb-1">Danh sách tài liệu</h4>
                  <p className="text-xs text-gray-600">Quản lý tài liệu học tập cho khóa học này</p>
                </div>
                <button
                  onClick={handleAddDocument}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Upload className="size-4" />
                  Tải lên tài liệu
                </button>
              </div>

              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="size-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm mb-1">{doc.name}</h5>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>Tải lên: {doc.uploadDate}</span>
                          <span>•</span>
                          <span>{doc.downloads} lượt tải</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {documents.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <FileText className="size-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">Chưa có tài liệu nào</p>
                  <button
                    onClick={handleAddDocument}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Tải lên tài liệu đầu tiên
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab: Lộ trình học tập */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm mb-1">Lộ trình học tập</h4>
                  <p className="text-xs text-gray-600">Sắp xếp các mốc học tập theo tuần</p>
                </div>
                <button
                  onClick={handleAddRoadmapItem}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Plus className="size-4" />
                  Thêm mốc học tập
                </button>
              </div>

              <div className="space-y-3">
                {roadmapItems.map((item, index) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <button className="p-1 hover:bg-gray-100 rounded cursor-move" title="Kéo để sắp xếp">
                          <GripVertical className="size-4 text-gray-400" />
                        </button>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.status === 'completed' ? 'bg-green-100' :
                          item.status === 'in-progress' ? 'bg-blue-100' :
                          'bg-gray-100'
                        }`}>
                          {item.status === 'completed' ? (
                            <CheckCircle className="size-5 text-green-600" />
                          ) : item.status === 'in-progress' ? (
                            <PlayCircle className="size-5 text-blue-600" />
                          ) : (
                            <Clock className="size-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            defaultValue={item.title}
                            className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full whitespace-nowrap">
                            Tuần {item.week}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                          <div>
                            <span className="text-gray-500">Số bài:</span>{' '}
                            <input
                              type="number"
                              defaultValue={item.lessons}
                              className="w-16 px-2 py-0.5 border border-gray-300 rounded text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-gray-500">Thời lượng:</span>{' '}
                            <input
                              type="text"
                              defaultValue={item.duration}
                              className="w-20 px-2 py-0.5 border border-gray-300 rounded text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-gray-500">Trạng thái:</span>{' '}
                            <select
                              defaultValue={item.status}
                              className="px-2 py-0.5 border border-gray-300 rounded text-xs"
                            >
                              <option value="locked">Khóa</option>
                              <option value="in-progress">Đang học</option>
                              <option value="completed">Hoàn thành</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveRoadmapItem(item.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {roadmapItems.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Map className="size-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">Chưa có lộ trình học tập</p>
                  <button
                    onClick={handleAddRoadmapItem}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Thêm mốc học tập đầu tiên
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
          >
            Hủy
          </button>
          <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Lưu nháp
            </button>
            <button
              onClick={() => {
                onSave({ deviceLimit, documents, roadmapItems });
                onClose();
              }}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
