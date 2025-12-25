// Admin Class Detail Page - RED theme with API integration
'use client';

import { useState, useMemo } from 'react';
import {
  ArrowLeft, Calendar, Clock, Users, TrendingUp, CheckCircle,
  AlertCircle, Eye, Award, User, Loader2, Copy, Check,
  Trash2, BookOpen, Settings
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { StudentHistoryModalAdvanced } from '../StudentHistoryModalAdvanced';
import { 
  useAdminClassDetails, 
  useAdminClassStats, 
  useAdminClassStudents, 
  useAdminActivateClass,
  useAdminCompleteClass,
  useAdminDeleteClass,
  useAdminRemoveStudent
} from '@/hooks/useClasses';
import { useApiError } from '@/hooks/useApiError';
import { toast } from 'sonner';
import type { ClassStudent } from '@/types/class.types';

interface ClassDetailPageAdminProps {
  onBack: () => void;
  classData?: { id: string } | any;
}

export function ClassDetailPageAdmin({ onBack, classData }: ClassDetailPageAdminProps) {
  const { handleError } = useApiError();
  const classId = classData?.id || '';
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState<{ id: string; name: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // API Hooks
  const { 
    data: classDetail, 
    isLoading: isLoadingClass, 
    error: classError,
    refetch: refetchClass 
  } = useAdminClassDetails(classId);

  const { data: statsData } = useAdminClassStats(classId);
  const { data: studentsData, isLoading: isLoadingStudents } = useAdminClassStudents(classId);

  const activateMutation = useAdminActivateClass();
  const completeMutation = useAdminCompleteClass();
  const deleteMutation = useAdminDeleteClass();
  const removeStudentMutation = useAdminRemoveStudent();

  // Derived data from API
  const classInfo = useMemo(() => {
    const cls = classDetail?.data;
    if (!cls) return null;
    
    const stats = statsData?.data;
    const scheduleStr = cls.schedule
      ?.map((s: any) => `${s.day} | ${s.startTime}-${s.endTime}`)
      .join(', ') || 'Chưa có lịch';

    return {
      id: cls.id,
      name: cls.name,
      description: cls.description,
      level: cls.level,
      inviteCode: cls.inviteCode || '',
      teacher: cls.teacher ? { 
        id: cls.teacher.id,
        name: cls.teacher.name, 
        email: cls.teacher.email,
        avatar: '👩‍🏫' 
      } : null,
      startDate: cls.startDate ? new Date(cls.startDate).toLocaleDateString('vi-VN') : 'Chưa xác định',
      endDate: cls.endDate ? new Date(cls.endDate).toLocaleDateString('vi-VN') : 'Chưa xác định',
      schedule: scheduleStr,
      status: cls.status,
      statusDisplay: cls.status === 'active' ? 'Đang học' : cls.status === 'completed' ? 'Đã hoàn thành' : cls.status === 'draft' ? 'Bản nháp' : cls.status,
      progress: stats?.completionRate || stats?.averageProgress || 0,
      totalSessions: stats?.totalSessions || 0,
      completedSessions: stats?.completedSessions || 0,
      totalAssignments: stats?.totalAssignments || 0,
      completedAssignments: stats?.completedAssignments || 0,
      pendingAssignments: stats?.pendingAssignments || 0,
      averageScore: stats?.averageScore?.toFixed(1) || '0.0',
      totalStudents: cls.studentLimit || 30,
      activeStudents: cls.studentCount || 0,
      createdAt: cls.createdAt,
      updatedAt: cls.updatedAt,
    };
  }, [classDetail, statsData]);

  // Students data
  const members = useMemo(() => {
    const students = studentsData?.data || [];
    return students.map((s: ClassStudent) => ({
      id: s.id,
      userId: s.userId,
      name: s.user?.name || 'Unknown',
      email: s.user?.email || '',
      role: 'student',
      avatar: '👩‍🎓',
      progress: s.progress || 0,
      gpa: s.averageScore?.toFixed(1) || '0.0',
      status: s.status,
      joinedAt: s.joinedAt,
    }));
  }, [studentsData]);

  // Copy invite code
  const handleCopyCode = () => {
    if (classInfo?.inviteCode) {
      navigator.clipboard.writeText(classInfo.inviteCode);
      setCopiedCode(true);
      toast.success('Đã copy mã mời!');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Handle activate class
  const handleActivate = async () => {
    try {
      await activateMutation.mutateAsync(classId);
      toast.success('Đã kích hoạt lớp học!');
      refetchClass();
    } catch (err) {
      handleError(err);
    }
  };

  // Handle complete class
  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync(classId);
      toast.success('Đã hoàn thành lớp học!');
      refetchClass();
    } catch (err) {
      handleError(err);
    }
  };

  // Handle delete class
  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa lớp học này?')) return;
    
    try {
      await deleteMutation.mutateAsync(classId);
      toast.success('Đã xóa lớp học!');
      onBack();
    } catch (err) {
      handleError(err);
    }
  };

  // Handle remove student
  const handleRemoveStudent = async () => {
    if (!studentToRemove) return;

    try {
      await removeStudentMutation.mutateAsync({ classId, studentId: studentToRemove.id });
      toast.success(`Đã xóa ${studentToRemove.name} khỏi lớp`);
      setShowRemoveModal(false);
      setStudentToRemove(null);
      refetchClass();
    } catch (err) {
      handleError(err);
    }
  };

  const handleViewStudentHistory = (student: any) => {
    setSelectedStudent(student);
    setShowHistoryModal(true);
  };

  // Loading state
  if (isLoadingClass) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin lớp học...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (classError || !classInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="size-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải thông tin lớp học</h2>
          <p className="text-gray-600 mb-4">Vui lòng thử lại sau</p>
          <button onClick={onBack} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: TrendingUp },
    { id: 'members', label: `Học viên (${members.length})`, icon: Users },
    { id: 'assignments', label: 'Bài tập', icon: BookOpen },
    { id: 'schedule', label: 'Lịch học', icon: Calendar },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-4">
            <ArrowLeft className="size-5" /><span>Quay lại danh sách lớp</span>
          </button>
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{classInfo.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  classInfo.status === 'active' ? 'bg-green-100 text-green-700' :
                  classInfo.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                  classInfo.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {classInfo.statusDisplay}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Award className="size-4 text-red-600" />
                  <span>Trình độ: <strong className="text-red-600">{classInfo.level}</strong></span>
                </div>
                {classInfo.teacher && (
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-red-600" />
                    <span>{classInfo.teacher.avatar} {classInfo.teacher.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-red-600" />
                  <span>{classInfo.startDate} - {classInfo.endDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-red-600" />
                  <span>{classInfo.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-red-600" />
                  <span>{classInfo.activeStudents}/{classInfo.totalStudents} học viên</span>
                </div>
              </div>
              {/* Invite Code */}
              {classInfo.inviteCode && (
                <div className="flex items-center gap-3 mt-3 p-3 bg-red-50 rounded-lg w-fit">
                  <span className="text-sm text-gray-600">Mã mời:</span>
                  <span className="font-mono font-bold text-red-600 text-lg">{classInfo.inviteCode}</span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 hover:bg-red-100 rounded transition-colors"
                    title="Copy mã mời"
                  >
                    {copiedCode ? <Check className="size-4 text-green-600" /> : <Copy className="size-4 text-red-600" />}
                  </button>
                </div>
              )}
            </div>
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {classInfo.status === 'draft' && (
                <button
                  onClick={handleActivate}
                  disabled={activateMutation.isPending}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {activateMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
                  Kích hoạt
                </button>
              )}
              {classInfo.status === 'active' && (
                <button
                  onClick={handleComplete}
                  disabled={completeMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {completeMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
                  Hoàn thành
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                Xóa lớp
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200 -mb-px overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-600 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-600 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="size-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Học viên</span>
                  <Users className="size-5 text-red-600" />
                </div>
                <p className="text-2xl font-bold">{classInfo.activeStudents}</p>
                <p className="text-xs text-gray-500">/ {classInfo.totalStudents} tối đa</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Tiến độ</span>
                  <TrendingUp className="size-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold">{Math.round(classInfo.progress)}%</p>
                <Progress 
                  value={classInfo.progress} 
                  className="w-full h-2 mt-2 bg-gray-200 [&>div]:bg-green-600" 
                />
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Điểm TB</span>
                  <Award className="size-5 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold">{classInfo.averageScore}</p>
                <p className="text-xs text-gray-500">điểm trung bình</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Bài tập</span>
                  <BookOpen className="size-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold">{classInfo.completedAssignments}/{classInfo.totalAssignments}</p>
                <p className="text-xs text-gray-500">đã hoàn thành</p>
              </div>
            </div>

            {/* Class Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Thông tin lớp học</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Mô tả</p>
                  <p className="text-gray-800">{classInfo.description || 'Chưa có mô tả'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Giáo viên phụ trách</p>
                  {classInfo.teacher ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{classInfo.teacher.avatar}</span>
                      <div>
                        <p className="font-medium">{classInfo.teacher.name}</p>
                        <p className="text-sm text-gray-500">{classInfo.teacher.email}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Chưa có giáo viên</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Học viên trong lớp ({members.length})</h3>
                <p className="text-sm text-gray-500">Danh sách học viên đã tham gia lớp học</p>
              </div>
            </div>

            {isLoadingStudents ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-red-600" />
                <span className="ml-2 text-gray-600">Đang tải danh sách học viên...</span>
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="size-12 mx-auto mb-4 text-gray-300" />
                <p>Chưa có học viên nào trong lớp</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Học viên</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Tiến độ</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Điểm TB</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Trạng thái</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Ngày tham gia</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(member => (
                      <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{member.avatar}</span>
                            <span className="font-medium">{member.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{member.email}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Progress 
                              value={member.progress} 
                              className="w-20 h-2 bg-gray-200 [&>div]:bg-red-600" 
                            />
                            <span className="text-sm">{member.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-green-600">{member.gpa}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs ${
                            member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {member.status === 'active' ? 'Hoạt động' : member.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-gray-500 text-sm">
                          {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('vi-VN') : '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewStudentHistory(member)}
                              className="p-1.5 hover:bg-red-100 rounded"
                              title="Xem lịch sử"
                            >
                              <Eye className="size-4 text-red-600" />
                            </button>
                            <button
                              onClick={() => {
                                setStudentToRemove({ id: member.userId || member.id, name: member.name });
                                setShowRemoveModal(true);
                              }}
                              className="p-1.5 hover:bg-red-100 rounded"
                              title="Xóa học viên"
                            >
                              <Trash2 className="size-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'overview' && activeTab !== 'members' && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Tab &ldquo;{activeTab}&rdquo;</h3>
            <p className="text-gray-600">Nội dung tab đang được phát triển...</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showHistoryModal && selectedStudent && (
        <StudentHistoryModalAdvanced 
          onClose={() => { setShowHistoryModal(false); setSelectedStudent(null); }} 
          student={selectedStudent} 
        />
      )}

      {/* Remove Student Modal */}
      {showRemoveModal && studentToRemove && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowRemoveModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="size-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Xác nhận xóa học viên</h3>
                <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Bạn có chắc chắn muốn xóa <strong>{studentToRemove.name}</strong> khỏi lớp học này?
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => { setShowRemoveModal(false); setStudentToRemove(null); }}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleRemoveStudent}
                disabled={removeStudentMutation.isPending}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {removeStudentMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  'Xóa học viên'
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
