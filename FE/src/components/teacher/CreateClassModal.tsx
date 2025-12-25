'use client';

import { useState } from 'react';
import { X, Loader2, Copy, Check } from 'lucide-react';
import { useCreateClass } from '@/hooks/useClasses';
import { useApiError } from '@/hooks/useApiError';
import type { CreateClassRequest, VstepLevel } from '@/types/class.types';

interface CreateClassModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  description: string;
  level: VstepLevel;
  maxStudents: number;
  startDate: string;
  endDate: string;
}

export function CreateClassModal({ onClose, onSuccess }: CreateClassModalProps) {
  const { handleError } = useApiError();
  const createClassMutation = useCreateClass();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    level: 'B1',
    maxStudents: 30,
    startDate: '',
    endDate: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [createdClass, setCreatedClass] = useState<{ id: string; inviteCode: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên lớp học';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Tên lớp phải có ít nhất 3 ký tự';
    }
    
    if (formData.maxStudents < 1 || formData.maxStudents > 100) {
      newErrors.maxStudents = 'Số học viên phải từ 1 đến 100';
    }
    
    if (formData.startDate) {
      const start = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) {
        newErrors.startDate = 'Ngày bắt đầu phải từ hôm nay trở đi';
      }
    }
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const payload: CreateClassRequest = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        level: formData.level,
        maxStudents: formData.maxStudents,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
      };
      
      const response = await createClassMutation.mutateAsync(payload);
      
      if (response.success && response.data) {
        setCreatedClass({
          id: response.data.id,
          inviteCode: response.data.inviteCode,
        });
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleCopyCode = async () => {
    if (!createdClass?.inviteCode) return;
    
    try {
      await navigator.clipboard.writeText(createdClass.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = createdClass.inviteCode;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Success view
  if (createdClass) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="size-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tạo lớp học thành công!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Chia sẻ mã lớp cho học viên để họ tham gia
          </p>
          
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-2">Mã lớp học</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-mono font-bold text-blue-600 tracking-wider">
                {createdClass.inviteCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Sao chép"
              >
                {copied ? (
                  <Check className="size-5 text-green-600" />
                ) : (
                  <Copy className="size-5 text-gray-600" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 mt-2">Đã sao chép!</p>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Đóng
            </button>
            <button
              onClick={onSuccess}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Tạo lớp học mới</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="size-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Class Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên lớp học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="VD: VSTEP B2 - Lớp sáng"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={100}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả lớp học
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Mô tả ngắn gọn về lớp học..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              maxLength={500}
            />
            <p className="mt-1 text-xs text-gray-500 text-right">
              {formData.description.length}/500
            </p>
          </div>

          {/* Level & Max Students */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cấp độ VSTEP <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.level}
                onChange={(e) => handleChange('level', e.target.value as VstepLevel)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số học viên tối đa
              </label>
              <input
                type="number"
                value={formData.maxStudents}
                onChange={(e) => handleChange('maxStudents', parseInt(e.target.value) || 0)}
                min={1}
                max={100}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.maxStudents ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.maxStudents && (
                <p className="mt-1 text-sm text-red-500">{errors.maxStudents}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày kết thúc (dự kiến)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                min={formData.startDate}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Sau khi tạo, lớp học sẽ ở trạng thái "Bản nháp". 
              Bạn cần kích hoạt để học viên có thể tham gia bằng mã lớp.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createClassMutation.isPending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {createClassMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Tạo lớp học'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
