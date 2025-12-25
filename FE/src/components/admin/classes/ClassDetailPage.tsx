'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft, BookOpen, Calendar, Clock, Users, Bell, FileText, TrendingUp, CheckCircle, AlertCircle, PlayCircle, Eye, Download, Send, Award, Target, Brain, Zap, User, Video, Link as LinkIcon, Headphones, Mic, PenTool, X, UserPlus, Upload, Search, FileSpreadsheet, Loader2 } from 'lucide-react';
import { StudentHistoryModalAdvanced } from '../StudentHistoryModalAdvanced';
import * as XLSX from 'xlsx';
import { 
  useAdminClassDetails, 
  useAdminClassStats, 
  useAdminClassStudents,
  useAdminRemoveStudent,
  useAdminClassMaterials,
  useAdminClassSchedules,
  useAdminClassAnnouncements,
  useAdminClassAssignments,
  useAdminGradingSubmissions,
} from '@/hooks/useClasses';
import { useApiError } from '@/hooks/useApiError';
import { toast } from 'sonner';

interface ClassDetailPageProps {
  onBack: () => void;
  classData?: any;
}

export function ClassDetailPage({ onBack, classData }: ClassDetailPageProps) {
  const { handleError } = useApiError();
  const [activeTab, setActiveTab] = useState('overview');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Get classId from props
  const classId = classData?.id;

  // API Hooks
  const { 
    data: classDetailResponse, 
    isLoading: isLoadingDetail,
    error: detailError 
  } = useAdminClassDetails(classId || '');

  const { 
    data: classStatsResponse, 
    isLoading: isLoadingStats 
  } = useAdminClassStats(classId || '');

  const { 
    data: studentsResponse, 
    isLoading: isLoadingStudents,
    refetch: refetchStudents 
  } = useAdminClassStudents(classId || '', { page: 1, limit: 50 });

  // New API hooks for Materials, Schedules, Announcements, Assignments, Submissions
  const { 
    data: materialsResponse, 
    isLoading: isLoadingMaterials 
  } = useAdminClassMaterials(classId || '');

  const { 
    data: schedulesResponse, 
    isLoading: isLoadingSchedules 
  } = useAdminClassSchedules(classId || '');

  const { 
    data: announcementsResponse, 
    isLoading: isLoadingAnnouncements 
  } = useAdminClassAnnouncements(classId || '');

  const { 
    data: assignmentsResponse, 
    isLoading: isLoadingAssignments 
  } = useAdminClassAssignments(classId || '');

  const { 
    data: submissionsResponse, 
    isLoading: isLoadingSubmissions 
  } = useAdminGradingSubmissions(classId || '');

  const removeStudentMutation = useAdminRemoveStudent();

  // Extract data from API responses
  const classDetail = classDetailResponse?.data;
  const stats = classStatsResponse?.data;
  const students = useMemo(() => studentsResponse?.data || [], [studentsResponse?.data]);
  
  // Extract new API data
  const materialsFromAPI = useMemo(() => materialsResponse?.data || [], [materialsResponse?.data]);
  const schedulesFromAPI = useMemo(() => schedulesResponse?.data || [], [schedulesResponse?.data]);
  const announcementsFromAPI = useMemo(() => announcementsResponse?.data || [], [announcementsResponse?.data]);
  const assignmentsFromAPI = useMemo(() => assignmentsResponse?.data || [], [assignmentsResponse?.data]);
  const submissionsFromAPI = useMemo(() => submissionsResponse?.data || [], [submissionsResponse?.data]);

  // Merge classData from props with API detail (props có thể có data cơ bản từ list)
  const mergedClassInfo = useMemo(() => {
    const detail = classDetail || classData || {};
    return {
      id: detail.id,
      name: detail.name || 'Chưa có tên',
      level: detail.level || 'B1',
      teacher: detail.teacher ? {
        id: detail.teacher.id,
        name: detail.teacher.name || detail.teacher.fullName || `${detail.teacher.firstName || ''} ${detail.teacher.lastName || ''}`.trim() || 'Chưa có giáo viên',
        email: detail.teacher.email,
        avatar: '👩‍🏫'
      } : { name: 'Chưa có giáo viên', avatar: '👩‍🏫' },
      startDate: detail.startDate ? new Date(detail.startDate).toLocaleDateString('vi-VN') : 'Chưa xác định',
      endDate: detail.endDate ? new Date(detail.endDate).toLocaleDateString('vi-VN') : 'Chưa xác định',
      schedule: detail.schedule?.map((s: any) => `${s.day} | ${s.startTime}-${s.endTime}`).join(', ') || 'Chưa có lịch',
      status: detail.status || 'draft',
      progress: stats?.averageProgress || 0,
      totalSessions: stats?.totalSessions || 0,
      completedSessions: stats?.completedSessions || 0,
      totalAssignments: stats?.totalAssignments || 0,
      completedAssignments: stats?.completedAssignments || 0,
      pendingAssignments: stats?.pendingAssignments || 0,
      averageGPA: stats?.averageScore || 0,
      totalStudents: stats?.totalStudents || detail.studentCount || 0,
      activeStudents: stats?.totalStudents || detail.studentCount || 0,
      maxStudents: detail.maxStudents || 30,
      inviteCode: detail.inviteCode,
      description: detail.description,
    };
  }, [classDetail, classData, stats]);

  // Transform students data for UI
  const membersFromAPI = useMemo(() => {
    const teacherMember = mergedClassInfo.teacher?.name !== 'Chưa có giáo viên' ? [{
      id: mergedClassInfo.teacher.id || 'teacher-1',
      name: mergedClassInfo.teacher.name,
      role: 'teacher',
      avatar: '👩‍🏫',
      online: true,
      email: mergedClassInfo.teacher.email || '',
    }] : [];

    const studentMembers = students.map((s: any) => ({
      id: s.id,
      studentId: s.studentId,
      name: s.student?.name || s.student?.fullName || 'Unknown',
      role: 'student',
      avatar: '👨‍🎓',
      online: false,
      email: s.student?.email || '',
      progress: s.progress || 0,
      gpa: 0,
      status: s.status,
      enrolledAt: s.enrolledAt,
    }));

    return [...teacherMember, ...studentMembers];
  }, [mergedClassInfo.teacher, students]);

  // Handle remove student
  const handleRemoveStudent = async (studentId: string) => {
    if (!classId) return;
    
    if (!confirm('Bạn có chắc muốn xóa học viên này khỏi lớp?')) return;

    try {
      await removeStudentMutation.mutateAsync({ classId, studentId });
      toast.success('Đã xóa học viên khỏi lớp');
      refetchStudents();
    } catch (err) {
      handleError(err);
    }
  };

  // Use API members or fall back to mock for demo
  const members = membersFromAPI.length > 0 ? membersFromAPI : [
    {
      id: 1,
      name: 'Nguyễn Thị Mai',
      role: 'teacher',
      avatar: '👩‍🏫',
      online: true,
      email: 'mai.nguyen@vstep.edu.vn'
    },
    {
      id: 2,
      name: 'Trần Văn An',
      role: 'assistant',
      avatar: '👨‍💼',
      online: false,
      email: 'an.tran@vstep.edu.vn'
    },
    {
      id: 3,
      name: 'Lê Thị Hoa',
      role: 'student',
      avatar: '👩‍🎓',
      online: true,
      email: 'hoa.le@student.vstep.edu.vn',
      progress: 72,
      gpa: 7.8
    },
  ];

  // Use mergedClassInfo instead of classInfo
  const classInfo = mergedClassInfo;

  // Transform API assignments data
  const pendingAssignments = useMemo(() => {
    return assignmentsFromAPI
      .filter((a: any) => a.status === 'published' && a.submissionCount < (stats?.totalStudents || 0))
      .map((a: any) => ({
        id: a.id,
        title: a.title,
        skill: a.skill,
        level: mergedClassInfo.level,
        deadline: a.dueDate ? new Date(a.dueDate).toLocaleDateString('vi-VN') : 'Không có hạn',
        status: a.gradedCount < a.submissionCount ? 'in-progress' : 'pending',
        questions: a.totalPoints,
        assignedCount: stats?.totalStudents || 0,
        completedCount: a.submissionCount,
      }));
  }, [assignmentsFromAPI, stats?.totalStudents, mergedClassInfo.level]);

  const completedAssignments = useMemo(() => {
    return assignmentsFromAPI
      .filter((a: any) => a.status === 'closed' || a.submissionCount >= (stats?.totalStudents || 1))
      .map((a: any) => ({
        id: a.id,
        title: a.title,
        skill: a.skill,
        level: mergedClassInfo.level,
        completedDate: a.createdAt ? new Date(a.createdAt).toLocaleDateString('vi-VN') : '',
        avgScore: 0, // Would need to calculate from submissions
        assignedCount: stats?.totalStudents || 0,
        completedCount: a.submissionCount,
      }));
  }, [assignmentsFromAPI, stats?.totalStudents, mergedClassInfo.level]);

  // Transform API schedule data
  const scheduleData = useMemo(() => {
    return schedulesFromAPI.map((s: any) => ({
      id: s.id,
      date: s.date ? new Date(s.date).toLocaleDateString('vi-VN') : '',
      day: s.date ? new Date(s.date).toLocaleDateString('vi-VN', { weekday: 'long' }) : '',
      time: `${s.startTime}-${s.endTime}`,
      topic: s.title,
      status: s.status,
      attendance: s.attendanceCount || 0,
      total: s.totalStudents || stats?.totalStudents || 0,
      zoomLink: s.zoomLink,
    }));
  }, [schedulesFromAPI, stats?.totalStudents]);

  // Transform API announcements
  const announcements = useMemo(() => {
    return announcementsFromAPI.map((a: any) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      author: a.author || 'Admin',
      date: a.createdAt ? new Date(a.createdAt).toLocaleDateString('vi-VN') : '',
      pinned: a.isPinned,
    }));
  }, [announcementsFromAPI]);

  // Transform API materials
  const materials = useMemo(() => {
    return materialsFromAPI.map((m: any) => ({
      id: m.id,
      title: m.title,
      type: m.type || 'document',
      uploadDate: m.createdAt ? new Date(m.createdAt).toLocaleDateString('vi-VN') : '',
      uploadBy: m.uploadedBy || 'Unknown',
      size: m.fileSize ? formatFileSize(m.fileSize) : 'N/A',
      downloads: m.downloadCount || 0,
      fileUrl: m.fileUrl,
    }));
  }, [materialsFromAPI]);

  // Transform API grading submissions
  const gradingSubmissions = useMemo(() => {
    return submissionsFromAPI.map((s: any) => ({
      id: s.id,
      student: s.student,
      skill: s.skill,
      assignment: s.assignment,
      submittedDate: s.submittedAt ? new Date(s.submittedAt).toLocaleString('vi-VN') : '',
      status: s.status,
      taskType: s.skill === 'writing' ? 'Task 2' : 'Part 2',
      wordCount: s.wordCount,
      duration: s.duration,
      score: s.score,
      grader: s.grader,
      gradedDate: s.gradedAt ? new Date(s.gradedAt).toLocaleString('vi-VN') : undefined,
    }));
  }, [submissionsFromAPI]);

  // Helper function to format file size
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  const getSkillIcon = (skill: string) => {
    switch(skill) {
      case 'reading': return <BookOpen className="size-4 text-blue-600" />;
      case 'listening': return <Headphones className="size-4 text-green-600" />;
      case 'writing': return <PenTool className="size-4 text-purple-600" />;
      case 'speaking': return <Mic className="size-4 text-orange-600" />;
      default: return <FileText className="size-4 text-gray-600" />;
    }
  };

  const getSkillColor = (skill: string) => {
    switch(skill) {
      case 'reading': return 'bg-blue-100 text-blue-700';
      case 'listening': return 'bg-green-100 text-green-700';
      case 'writing': return 'bg-purple-100 text-purple-700';
      case 'speaking': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Chưa làm</span>;
      case 'in-progress': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Đang làm</span>;
      case 'completed': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Hoàn thành</span>;
      case 'overdue': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Quá hạn</span>;
      default: return null;
    }
  };

  const handleViewStudentHistory = (student: any) => {
    setSelectedStudent(student);
    setShowHistoryModal(true);
  };

  // Loading state
  if (isLoadingDetail && !classData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-red-600" />
        <span className="ml-3 text-gray-600">Đang tải thông tin lớp học...</span>
      </div>
    );
  }

  // Error state
  if (detailError && !classData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="bg-red-100 text-red-600 p-6 rounded-xl max-w-md">
          <AlertCircle className="size-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Không thể tải dữ liệu</h3>
          <p className="text-sm mb-4">Đã xảy ra lỗi khi tải thông tin lớp học.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Thông tin lớp học */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Back button */}
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-4"
          >
            <ArrowLeft className="size-5" />
            <span>Quay lại danh sách lớp</span>
          </button>

          {/* Class Info */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{classInfo.name}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Award className="size-5 text-red-600" />
                  <span>Trình độ: <strong className="text-red-600">{classInfo.level}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="size-5 text-red-600" />
                  <span>{classInfo.teacher.avatar} {classInfo.teacher.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-5 text-red-600" />
                  <span>{classInfo.startDate} - {classInfo.endDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-red-600" />
                  <span>{classInfo.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-red-600" />
                  <span>{classInfo.activeStudents}/{classInfo.totalStudents} học viên</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                {classInfo.status}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Tiến độ chung của lớp</span>
              <span className="text-sm font-medium text-red-600">{classInfo.progress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-600 rounded-full transition-all"
                style={{ width: `${classInfo.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-red-600'
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'assignments'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-red-600'
              }`}
            >
              Bài tập
              {pendingAssignments.length > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">
                  {pendingAssignments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-red-600'
              }`}
            >
              Lịch sử làm bài
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'schedule'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-red-600'
              }`}
            >
              Lịch học
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'members'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-red-600'
              }`}
            >
              Thành viên
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'announcements'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-red-600'
              }`}
            >
              Thông báo
              {announcements.filter(a => a.pinned).length > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">
                  {announcements.filter(a => a.pinned).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'materials'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-red-600'
              }`}
            >
              Tài liệu
            </button>
            <button
              onClick={() => setActiveTab('grading')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'grading'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-red-600'
              }`}
            >
              Chấm chữa Nói Viết
              <span className="px-2 py-0.5 bg-orange-500 text-white rounded-full text-xs">12</span>
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'results'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-red-600'
              }`}
            >
              Kết quả & Thống kê
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* TAB 1: Tổng quan */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Calendar className="size-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Buổi học</p>
                    <p className="text-2xl font-bold">{classInfo.completedSessions}/{classInfo.totalSessions}</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                  <div 
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${(classInfo.completedSessions / classInfo.totalSessions) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bài tập hoàn thành</p>
                    <p className="text-2xl font-bold">{classInfo.completedAssignments}/{classInfo.totalAssignments}</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                  <div 
                    className="h-full bg-green-600 rounded-full"
                    style={{ width: `${(classInfo.completedAssignments / classInfo.totalAssignments) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertCircle className="size-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bài tập chưa làm</p>
                    <p className="text-2xl font-bold text-yellow-600">{classInfo.pendingAssignments}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">Cần theo dõi</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">GPA Trung bình</p>
                    <p className="text-2xl font-bold text-purple-600">{classInfo.averageGPA}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">Kết quả tốt</p>
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Thông báo mới nhất</h3>
              <div className="space-y-3">
                {announcements.slice(0, 3).map(announcement => (
                  <div key={announcement.id} className="p-4 bg-red-50 border border-red-100 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Bell className="size-5 text-red-600 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{announcement.title}</h4>
                          {announcement.pinned && (
                            <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs">Quan trọng</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{announcement.content}</p>
                        <p className="text-xs text-gray-500">{announcement.author} • {announcement.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Bài tập */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            {/* Bài tập đang mở */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="size-5 text-yellow-600" />
                Bài tập đang mở ({pendingAssignments.length})
              </h3>
              <div className="space-y-3">
                {pendingAssignments.map(assignment => (
                  <div key={assignment.id} className="p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getSkillIcon(assignment.skill)}
                          <h4 className="font-medium">{assignment.title}</h4>
                          <span className={`px-2 py-0.5 text-xs rounded ${getSkillColor(assignment.skill)}`}>
                            {assignment.skill.toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            {assignment.level}
                          </span>
                          {getStatusBadge(assignment.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>📝 {assignment.questions} câu hỏi</span>
                          <span>⏰ Hạn: {assignment.deadline}</span>
                          <span className="text-red-600 font-medium">
                            {assignment.completedCount}/{assignment.assignedCount} học viên đã làm
                          </span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
                        <Eye className="size-4" />
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bài tập đã đóng */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="size-5 text-green-600" />
                Bài tập đã đóng ({completedAssignments.length})
              </h3>
              <div className="space-y-3">
                {completedAssignments.map(assignment => (
                  <div key={assignment.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getSkillIcon(assignment.skill)}
                          <h4 className="font-medium">{assignment.title}</h4>
                          <span className={`px-2 py-0.5 text-xs rounded ${getSkillColor(assignment.skill)}`}>
                            {assignment.skill.toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            {assignment.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>✅ Đóng: {assignment.completedDate}</span>
                          <span className="text-green-600 font-medium">
                            Điểm TB: {assignment.avgScore}
                          </span>
                          <span>
                            {assignment.completedCount}/{assignment.assignedCount} học viên
                          </span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                        <Eye className="size-4" />
                        Xem báo cáo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Lịch sử làm bài */}
        {activeTab === 'history' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Lịch sử làm bài của lớp</h3>
              <p className="text-sm text-gray-500">Click vào học viên để xem chi tiết lịch sử làm bài</p>
            </div>

            {/* Student List with History Access */}
            <div className="space-y-3">
              {members.filter(m => m.role === 'student').map(student => (
                <div 
                  key={student.id} 
                  className="p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors cursor-pointer"
                  onClick={() => handleViewStudentHistory(student)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{student.avatar}</div>
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Tiến độ</p>
                        <p className="text-lg font-medium text-red-600">{student.progress}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">GPA</p>
                        <p className="text-lg font-medium text-green-600">{student.gpa}</p>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
                        <Eye className="size-4" />
                        Xem lịch sử
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Lịch học */}
        {activeTab === 'schedule' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Lịch học lớp {classInfo.name}</h3>
            <div className="space-y-3">
              {scheduleData.map(session => (
                <div key={session.id} className={`p-4 border rounded-lg ${
                  session.status === 'completed' ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {session.status === 'completed' ? (
                        <CheckCircle className="size-6 text-green-600" />
                      ) : (
                        <Clock className="size-6 text-red-600" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{session.topic}</h4>
                          {session.status === 'upcoming' && (
                            <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs">Sắp tới</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>📅 {session.day}, {session.date}</span>
                          <span>🕐 {session.time}</span>
                          {session.status === 'completed' && (
                            <span className="text-green-600">
                              ✓ Điểm danh: {session.attendance}/{session.total}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {session.status === 'upcoming' && (
                      <a 
                        href={session.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                      >
                        <Video className="size-4" />
                        Link Zoom
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Thành viên */}
        {activeTab === 'members' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Thành viên lớp ({members.length})</h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowAddStudentModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <UserPlus className="size-4" />
                  Thêm học viên
                </button>
                <button 
                  onClick={() => setShowImportModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Upload className="size-4" />
                  Import từ Excel
                </button>
              </div>
            </div>
            
            {/* Teachers & Assistants */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Giáo viên & Trợ giảng</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.filter(m => m.role !== 'student').map(member => (
                  <div key={member.id} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="text-3xl">{member.avatar}</div>
                        {member.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {member.role === 'teacher' ? 'Giáo viên' : 'Trợ giảng'}
                        </p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Students */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">
                Học viên ({members.filter(m => m.role === 'student').length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.filter(m => m.role === 'student').map(member => (
                  <div key={member.id} className="p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className="text-3xl">{member.avatar}</div>
                        {member.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{member.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{member.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">Tiến độ</p>
                        <p className="font-medium text-red-600">{member.progress}%</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">GPA</p>
                        <p className="font-medium text-green-600">{member.gpa}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Thông báo */}
        {activeTab === 'announcements' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Thông báo lớp học</h3>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                + Tạo thông báo mới
              </button>
            </div>
            <div className="space-y-4">
              {announcements.map(announcement => (
                <div key={announcement.id} className={`p-5 rounded-lg border ${
                  announcement.pinned 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-start gap-3">
                    <Bell className={`size-5 mt-1 ${announcement.pinned ? 'text-red-600' : 'text-blue-600'}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{announcement.title}</h4>
                        {announcement.pinned && (
                          <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs">📌 Ghim</span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{announcement.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>👤 {announcement.author}</span>
                        <span>📅 {announcement.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: Tài liệu */}
        {activeTab === 'materials' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tài liệu học tập</h3>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                + Upload tài liệu
              </button>
            </div>
            <div className="space-y-3">
              {materials.map(material => (
                <div key={material.id} className="p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {material.type === 'pdf' && <FileText className="size-6 text-red-600" />}
                      {material.type === 'audio' && <Headphones className="size-6 text-green-600" />}
                      {material.type === 'video' && <Video className="size-6 text-purple-600" />}
                      <div>
                        <h4 className="font-medium">{material.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>📤 {material.uploadBy}</span>
                          <span>📅 {material.uploadDate}</span>
                          <span>📦 {material.size}</span>
                          <span className="text-red-600">⬇ {material.downloads} lượt tải</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
                      <Download className="size-4" />
                      Tải xuống
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: Chấm chữa Nói Viết */}
        {activeTab === 'grading' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg"><Clock className="size-5 text-orange-600" /></div>
                  <div>
                    <p className="text-sm text-gray-600">Chờ chấm</p>
                    <p className="text-2xl font-bold text-orange-600">{gradingSubmissions.filter(s => s.status === 'pending').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg"><PenTool className="size-5 text-blue-600" /></div>
                  <div>
                    <p className="text-sm text-gray-600">Đang chấm</p>
                    <p className="text-2xl font-bold text-blue-600">{gradingSubmissions.filter(s => s.status === 'grading').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="size-5 text-green-600" /></div>
                  <div>
                    <p className="text-sm text-gray-600">Đã chấm</p>
                    <p className="text-2xl font-bold text-green-600">{gradingSubmissions.filter(s => s.status === 'graded').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg"><FileText className="size-5 text-purple-600" /></div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng bài nộp</p>
                    <p className="text-2xl font-bold text-purple-600">{gradingSubmissions.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ chấm</option>
                  <option value="grading">Đang chấm</option>
                  <option value="graded">Đã chấm</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="all">Tất cả kỹ năng</option>
                  <option value="writing">Writing</option>
                  <option value="speaking">Speaking</option>
                </select>
                <div className="flex-1" />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Sắp xếp:</span>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="priority">Ưu tiên</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submissions List */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Học viên</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Kỹ năng</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Bài tập</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Chi tiết</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Ngày nộp</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Trạng thái</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Điểm</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradingSubmissions.map((submission) => (
                      <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <User className="size-4 text-red-600" />
                            </div>
                            <span className="text-sm font-medium">{submission.student}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {submission.skill === 'writing' ? (
                              <PenTool className="size-4 text-purple-600" />
                            ) : (
                              <Mic className="size-4 text-orange-600" />
                            )}
                            <span className={`px-2 py-1 text-xs rounded ${
                              submission.skill === 'writing' 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {submission.skill === 'writing' ? 'Writing' : 'Speaking'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium">{submission.assignment}</p>
                          <p className="text-xs text-gray-500">{submission.taskType}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-xs text-gray-600">
                            {submission.skill === 'writing' ? (
                              <span>📝 {submission.wordCount} words</span>
                            ) : (
                              <span>🎤 {submission.duration}</span>
                            )}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-600">{submission.submittedDate}</p>
                        </td>
                        <td className="py-3 px-4">
                          {submission.status === 'pending' && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs flex items-center gap-1 w-fit">
                              <Clock className="size-3" /> Chờ chấm
                            </span>
                          )}
                          {submission.status === 'grading' && (
                            <div>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs flex items-center gap-1 w-fit mb-1">
                                <PenTool className="size-3" /> Đang chấm
                              </span>
                              <p className="text-xs text-gray-500">bởi {submission.grader}</p>
                            </div>
                          )}
                          {submission.status === 'graded' && (
                            <div>
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1 w-fit mb-1">
                                <CheckCircle className="size-3" /> Đã chấm
                              </span>
                              <p className="text-xs text-gray-500">{submission.gradedDate}</p>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {submission.status === 'graded' ? (
                            <span className="text-lg font-bold text-green-600">{submission.score}</span>
                          ) : (
                            <span className="text-sm text-gray-400">---</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {submission.status === 'pending' && (
                            <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center gap-1">
                              <PenTool className="size-3" /> Chấm bài
                            </button>
                          )}
                          {submission.status === 'grading' && (
                            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1">
                              <Eye className="size-3" /> Tiếp tục
                            </button>
                          )}
                          {submission.status === 'graded' && (
                            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center gap-1">
                              <Eye className="size-3" /> Xem lại
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: Kết quả & Thống kê */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Overall Stats */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">GPA trung bình của lớp</p>
                  <p className="text-5xl font-bold">{classInfo.averageGPA}</p>
                  <p className="text-sm opacity-90 mt-2">Xếp loại: <strong>Giỏi</strong></p>
                </div>
                <Award className="size-20 opacity-20" />
              </div>
            </div>

            {/* Skill Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Average Scores by Skill */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Điểm trung bình theo kỹ năng</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="size-5 text-blue-600" />
                        <span className="font-medium">Reading</span>
                      </div>
                      <span className="font-bold text-blue-600">7.8</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Headphones className="size-5 text-green-600" />
                        <span className="font-medium">Listening</span>
                      </div>
                      <span className="font-bold text-green-600">7.3</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full">
                      <div className="h-full bg-green-600 rounded-full" style={{ width: '73%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <PenTool className="size-5 text-purple-600" />
                        <span className="font-medium">Writing</span>
                      </div>
                      <span className="font-bold text-purple-600">7.0</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Mic className="size-5 text-orange-600" />
                        <span className="font-medium">Speaking</span>
                      </div>
                      <span className="font-bold text-orange-600">7.5</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full">
                      <div className="h-full bg-orange-600 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Top 3 học viên xuất sắc</h3>
                <div className="space-y-3">
                  {members
                    .filter(m => m.role === 'student')
                    .sort((a, b) => (b.gpa || 0) - (a.gpa || 0))
                    .slice(0, 3)
                    .map((student, index) => (
                      <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                        <div className="text-2xl">{student.avatar}</div>
                        <div className="flex-1">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">Tiến độ: {student.progress}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-red-600">{student.gpa}</p>
                          <p className="text-xs text-gray-500">GPA</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Class Performance Insights */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="size-5 text-purple-600" />
                Phân tích & Đề xuất
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-start gap-3">
                  <Zap className="size-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Điểm mạnh</h4>
                    <p className="text-sm text-gray-700">
                      Lớp học có tỷ lệ hoàn thành bài tập cao (71%). Điểm Reading và Speaking đạt trên mức trung bình.
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start gap-3">
                  <Target className="size-5 text-yellow-600 mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Cần cải thiện</h4>
                    <p className="text-sm text-gray-700">
                      Điểm Writing còn thấp (7.0). Nên tổ chức thêm workshop và feedback cá nhân hóa cho học viên.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student History Modal */}
      {showHistoryModal && selectedStudent && (
        <StudentHistoryModalAdvanced 
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
        />
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <AddStudentModal 
          onClose={() => setShowAddStudentModal(false)} 
          className={classInfo.name}
        />
      )}

      {/* Import Excel Modal */}
      {showImportModal && (
        <ImportExcelModal 
          onClose={() => setShowImportModal(false)} 
          className={classInfo.name}
        />
      )}
    </div>
  );
}

// Import Excel Modal Component  
function ImportExcelModal({ onClose, className }: { onClose: () => void; className: string }) {
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [importResults, setImportResults] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: []
  });

  const previewData = [
    { row: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0901234567', status: '✓ Hợp lệ' },
    { row: 2, name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0907654321', status: '✓ Hợp lệ' },
    { row: 3, name: 'Lê Văn C', email: 'levanc@example.com', phone: '0912345678', status: '✓ Hợp lệ' },
    { row: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', phone: '0909876543', status: '✓ Hợp lệ' },
    { row: 5, name: 'Hoàng Văn E', email: '', phone: '0918765432', status: '⚠️ Thiếu email' },
  ];

  const downloadTemplate = () => { alert('Tải file template Excel mẫu...'); };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const parsedData = jsonData.map((row: any, index: number) => ({
          row: index + 1,
          name: row[0],
          email: row[1],
          phone: row[2],
          status: row[1] ? '✓ Hợp lệ' : '⚠️ Thiếu email'
        }));
        setUploadedData(parsedData);
        setStep('preview');
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleImport = () => {
    setTimeout(() => {
      setImportResults({ success: 4, failed: 1, errors: ['Dòng 5: Thiếu email - Nguyễn được bỏ qua'] });
      setStep('result');
    }, 1000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={step === 'upload' ? onClose : undefined} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-green-500 to-emerald-600 text-white sticky top-0">
          <div>
            <h3 className="text-xl">Import học viên từ Excel</h3>
            <p className="text-sm opacity-90 mt-1">Lớp: {className}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step === 'upload' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'upload' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>1</div>
                <span className="text-sm">Tải lên</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200"></div>
              <div className={`flex items-center gap-2 ${step === 'preview' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'preview' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>2</div>
                <span className="text-sm">Xem trước</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200"></div>
              <div className={`flex items-center gap-2 ${step === 'result' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'result' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>3</div>
                <span className="text-sm">Kết quả</span>
              </div>
            </div>
          </div>

          {step === 'upload' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="flex items-center gap-2 text-blue-900 mb-3">
                  <FileSpreadsheet className="size-5" />Hướng dẫn import
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• File Excel phải có các cột: <strong>Họ tên, Email, Số điện thoại</strong></li>
                  <li>• Email là bắt buộc và phải đúng định dạng</li>
                  <li>• Số điện thoại phải đúng định dạng (10 số)</li>
                  <li>• Dòng đầu tiên là tiêu đề cột (sẽ bỏ qua khi import)</li>
                  <li>• Tối đa 500 học viên mỗi lần import</li>
                </ul>
              </div>
              <button onClick={downloadTemplate} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-gray-700">
                <Download className="size-5 text-green-600" /><span>Tải file Excel mẫu</span>
              </button>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer relative">
                <FileSpreadsheet className="size-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 mb-2">Kéo thả file Excel vào đây hoặc click để chọn</p>
                <p className="text-sm text-gray-500">Hỗ trợ: .xlsx, .xls (Tối đa 5MB)</p>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800"><strong>Tìm thấy {previewData.length} học viên</strong> từ file Excel. Vui lòng kiểm tra trước khi import.</p>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm">Dòng</th>
                        <th className="text-left py-3 px-4 text-sm">Họ tên</th>
                        <th className="text-left py-3 px-4 text-sm">Email</th>
                        <th className="text-left py-3 px-4 text-sm">Số điện thoại</th>
                        <th className="text-left py-3 px-4 text-sm">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className={`border-b border-gray-100 ${row.status.includes('⚠️') ? 'bg-red-50' : ''}`}>
                          <td className="py-3 px-4 text-sm">{row.row}</td>
                          <td className="py-3 px-4 text-sm">{row.name}</td>
                          <td className="py-3 px-4 text-sm">{row.email || <span className="text-red-500">Thiếu</span>}</td>
                          <td className="py-3 px-4 text-sm">{row.phone}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${row.status.includes('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{row.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div><p className="text-gray-600 mb-1">Tổng số</p><p className="text-2xl">{previewData.length}</p></div>
                  <div><p className="text-gray-600 mb-1">Hợp lệ</p><p className="text-2xl text-green-600">{previewData.filter(r => r.status.includes('✓')).length}</p></div>
                  <div><p className="text-gray-600 mb-1">Lỗi</p><p className="text-2xl text-red-600">{previewData.filter(r => r.status.includes('⚠️')).length}</p></div>
                </div>
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="size-12 text-green-600" />
                </div>
                <h4 className="text-2xl mb-2">Import hoàn tất!</h4>
                <p className="text-gray-600">Đã thêm học viên vào lớp học thành công</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-green-600 mb-2">Thành công</p>
                  <p className="text-4xl text-green-600">{importResults.success}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-red-600 mb-2">Thất bại</p>
                  <p className="text-4xl text-red-600">{importResults.failed}</p>
                </div>
              </div>
              {importResults.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h5 className="flex items-center gap-2 text-red-900 mb-3"><AlertCircle className="size-5" />Chi tiết lỗi</h5>
                  <ul className="space-y-1 text-sm text-red-800">
                    {importResults.errors.map((error, index) => (<li key={index}>• {error}</li>))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
          {step === 'upload' && (
            <>
              <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">Hủy</button>
              <div></div>
            </>
          )}
          {step === 'preview' && (
            <>
              <button onClick={() => setStep('upload')} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">Quay lại</button>
              <button onClick={handleImport} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <CheckCircle className="size-4" />Xác nhận Import ({previewData.filter(r => r.status.includes('✓')).length} học viên)
              </button>
            </>
          )}
          {step === 'result' && (
            <>
              <button onClick={() => { setStep('upload'); setUploadedData([]); }} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">Import thêm</button>
              <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Hoàn tất</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// Add Student Modal Component
function AddStudentModal({ onClose, className }: { onClose: () => void; className: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  const allStudents = [
    { id: 996, fullName: 'Nguyễn Văn Thunm', username: 'thunm', email: 'thunm.aof@gmail.com' },
    { id: 995, fullName: 'Đỗ Duy', username: 'doduy3801', email: 'doduy3801@gmail.com' },
    { id: 994, fullName: 'Minh Sơn', username: 'Minhson031100', email: 'Minhson031100@gmail.com' },
    { id: 992, fullName: 'Nguyễn Thị Ngân', username: 'nguyenthingan101192', email: 'nguyenthingan101192@gmail.com' },
    { id: 991, fullName: 'Anh Hải', username: 'anh186148', email: 'anh186148@gmail.com' },
    { id: 990, fullName: 'Phạm Hạ Phương', username: 'phamhaphuong', email: 'phamhaphuong.fw@gmail.com' },
    { id: 988, fullName: 'Hùng Nguyễn', username: 'hungnguyenyb100', email: 'hungnguyenyb1002@gmail.com' },
    { id: 987, fullName: 'Trung Hiếu', username: 'trunghieubh123', email: 'trunghieubh123@gmail.com' },
    { id: 986, fullName: 'Yến Linh', username: 'yenlinhbg12345', email: 'yenlinhbg12345@gmail.com' },
    { id: 985, fullName: 'Hoàng Anh Tuấn', username: 'hoanganhtuan', email: 'hoanganhtuan@gmail.com' },
    { id: 984, fullName: 'Lê Thị Mai', username: 'lethimai', email: 'lethimai@gmail.com' },
    { id: 983, fullName: 'Trần Văn Bình', username: 'tranvanbinh', email: 'tranvanbinh@gmail.com' },
  ];

  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toString().includes(searchQuery);
    return matchesSearch;
  });

  const toggleStudent = (id: number) => {
    setSelectedStudents(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedStudents.length === filteredStudents.length) { setSelectedStudents([]); } 
    else { setSelectedStudents(filteredStudents.map(s => s.id)); }
  };

  const handleAddStudents = () => {
    if (selectedStudents.length === 0) { alert('Vui lòng chọn ít nhất 1 học viên'); return; }
    setTimeout(() => { alert(`Đã thêm ${selectedStudents.length} học viên vào lớp ${className}`); onClose(); }, 500);
  };

  const resetFilters = () => { setSearchQuery(''); setFilterType('all'); setSelectedStudents([]); };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white">
          <h3 className="text-xl font-medium">Thêm học viên vào lớp</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="size-5 text-gray-500" /></button>
        </div>
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input type="text" placeholder="Tìm theo email, tên, hoặc số điện thoại..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]">
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
            <button onClick={() => setSearchQuery('')} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><Search className="size-4" />Tìm kiếm</button>
            <button onClick={resetFilters} className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">Đặt lại bộ lọc</button>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-280px)]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-6 w-12">
                  <input type="checkbox" checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0} onChange={toggleAll} className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">ID</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Full Name</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">User Name</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleStudent(student.id)}>
                  <td className="py-4 px-6">
                    <input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => toggleStudent(student.id)} onClick={(e) => e.stopPropagation()} className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{student.id}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{student.fullName}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{student.username}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{student.email}</td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr><td colSpan={5} className="py-12 text-center text-gray-500"><Users className="size-12 mx-auto mb-3 text-gray-300" /><p>Không tìm thấy học viên nào</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-gray-200 bg-white flex items-center justify-between">
          <div className="text-sm text-gray-600">Đã chọn <strong>{selectedStudents.length}</strong> học viên</div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">Hủy</button>
            <button onClick={handleAddStudents} disabled={selectedStudents.length === 0} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <UserPlus className="size-4" />Thêm {selectedStudents.length > 0 ? `(${selectedStudents.length})` : ''} học viên
            </button>
          </div>
        </div>
      </div>
    </>
  );
}