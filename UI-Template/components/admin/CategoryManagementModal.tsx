import { useState } from 'react';
import { X, Plus, Trash2, Tag, AlertCircle, BookOpen, FileText, Calendar, Headphones, PenTool, Mic, Newspaper } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
}

interface CategoryManagementModalProps {
  categories: Category[];
  onClose: () => void;
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const availableIcons = [
  { name: 'BookOpen', component: BookOpen, label: 'Sách mở' },
  { name: 'FileText', component: FileText, label: 'Tài liệu' },
  { name: 'Calendar', component: Calendar, label: 'Lịch' },
  { name: 'Headphones', component: Headphones, label: 'Tai nghe' },
  { name: 'PenTool', component: PenTool, label: 'Viết' },
  { name: 'Mic', component: Mic, label: 'Micro' },
  { name: 'Newspaper', component: Newspaper, label: 'Báo' },
  { name: 'Tag', component: Tag, label: 'Thẻ' },
];

const availableColors = [
  { name: 'blue', label: 'Xanh dương', class: 'bg-blue-500' },
  { name: 'purple', label: 'Tím', class: 'bg-purple-500' },
  { name: 'green', label: 'Xanh lá', class: 'bg-green-500' },
  { name: 'orange', label: 'Cam', class: 'bg-orange-500' },
  { name: 'pink', label: 'Hồng', class: 'bg-pink-500' },
  { name: 'indigo', label: 'Chàm', class: 'bg-indigo-500' },
  { name: 'red', label: 'Đỏ', class: 'bg-red-500' },
  { name: 'teal', label: 'Xanh ngọc', class: 'bg-teal-500' },
  { name: 'amber', label: 'Hổ phách', class: 'bg-amber-500' },
  { name: 'gray', label: 'Xám', class: 'bg-gray-500' },
];

export function CategoryManagementModal({ categories, onClose, onAddCategory, onDeleteCategory }: CategoryManagementModalProps) {
  const [newCategory, setNewCategory] = useState({
    name: '',
    iconName: 'BookOpen',
    color: 'blue',
  });

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      alert('Vui lòng nhập tên chuyên mục');
      return;
    }

    const iconObj = availableIcons.find(i => i.name === newCategory.iconName);
    if (!iconObj) {
      alert('Vui lòng chọn icon hợp lệ');
      return;
    }

    const categoryId = newCategory.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if category ID already exists
    if (categories.some(c => c.id === categoryId)) {
      alert('Chuyên mục này đã tồn tại!');
      return;
    }

    const category: Category = {
      id: categoryId,
      name: newCategory.name,
      icon: iconObj.component,
      color: newCategory.color,
    };

    onAddCategory(category);
    setNewCategory({ name: '', iconName: 'BookOpen', color: 'blue' });
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      alert('Không thể xóa chuyên mục "Tất cả"');
      return;
    }
    if (confirm('Bạn có chắc chắn muốn xóa chuyên mục này?')) {
      onDeleteCategory(categoryId);
    }
  };

  const selectedIcon = availableIcons.find(i => i.name === newCategory.iconName)?.component || BookOpen;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl mb-1">🏷️ Quản lý chuyên mục Blog</h3>
              <p className="text-sm text-gray-600">Thêm, xóa và chỉnh sửa các chuyên mục blog</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors">
              <X className="size-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add New Category Form */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
            <h4 className="flex items-center gap-2 mb-4">
              <Plus className="size-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Thêm chuyên mục mới</span>
            </h4>

            <div className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên chuyên mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="VD: Luyện thi Reading"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableIcons.map((icon) => {
                    const IconComponent = icon.component;
                    const isSelected = newCategory.iconName === icon.name;
                    return (
                      <button
                        key={icon.name}
                        onClick={() => setNewCategory({ ...newCategory, iconName: icon.name })}
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-100'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <IconComponent className={`size-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                        <span className={`text-xs ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-500'}`}>
                          {icon.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn màu
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {availableColors.map((color) => {
                    const isSelected = newCategory.color === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setNewCategory({ ...newCategory, color: color.name })}
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'border-gray-800 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${color.class}`} />
                        <span className={`text-xs ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                          {color.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xem trước
                </label>
                <div className="flex items-center gap-2">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-${newCategory.color}-600 bg-${newCategory.color}-50 text-${newCategory.color}-700 cursor-default`}
                  >
                    {(() => {
                      const IconComponent = selectedIcon;
                      return <IconComponent className="size-4" />;
                    })()}
                    <span>{newCategory.name || 'Tên chuyên mục'}</span>
                  </button>
                </div>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddCategory}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="size-5" />
                Thêm chuyên mục
              </button>
            </div>
          </div>

          {/* Current Categories List */}
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900">Danh sách chuyên mục ({categories.length})</h4>
            </div>
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-${category.color}-100 rounded-lg`}>
                        <IconComponent className={`size-5 text-${category.color}-600`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{category.name}</p>
                        <p className="text-xs text-gray-500">ID: {category.id}</p>
                      </div>
                      {category.id === 'all' && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          Mặc định
                        </span>
                      )}
                    </div>
                    {category.id !== 'all' && (
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa chuyên mục"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Khi xóa chuyên mục, các bài viết thuộc chuyên mục đó sẽ không bị xóa. 
              Bạn cần tự chỉnh sửa lại chuyên mục cho các bài viết đó.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
