import { useState } from 'react';
import { GraduationCap, FolderOpen } from 'lucide-react';
import { AdminClassMaterialsTab } from './AdminClassMaterialsTab';
import { AdminStudyMaterialsTab } from './AdminStudyMaterialsTab';

export function AdminMaterialsManagementPage() {
  const [activeTab, setActiveTab] = useState<'study' | 'class'>('class');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📚 Quản lý thư viện tài liệu chung</h1>
            <p className="text-red-100">
              Quản lý tài liệu học tập và tài liệu lớp học - Tải lên, sửa, xóa, duyệt tài liệu
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="flex border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('study')}
            className={`flex-1 px-6 py-4 font-medium transition-colors border-b-4 ${
              activeTab === 'study'
                ? 'border-orange-600 text-orange-600 bg-orange-50 -mb-0.5'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <GraduationCap className="size-5" />
              <span className="text-lg">Tài liệu học tập</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('class')}
            className={`flex-1 px-6 py-4 font-medium transition-colors border-b-4 ${
              activeTab === 'class'
                ? 'border-blue-600 text-blue-600 bg-blue-50 -mb-0.5'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FolderOpen className="size-5" />
              <span className="text-lg">Tài liệu lớp học</span>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'study' ? (
        <AdminStudyMaterialsTab />
      ) : (
        <AdminClassMaterialsTab />
      )}
    </div>
  );
}