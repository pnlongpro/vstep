import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classesService } from '@/services';
import type {
  CreateClassRequest,
  InviteStudentsRequest,
  JoinClassRequest,
  CreateScheduleRequest,
  MarkAttendanceRequest,
} from '@/services';

// Query Keys
export const classKeys = {
  all: ['classes'] as const,
  lists: () => [...classKeys.all, 'list'] as const,
  list: (filters: any) => [...classKeys.lists(), { filters }] as const,
  details: () => [...classKeys.all, 'detail'] as const,
  detail: (id: string) => [...classKeys.details(), id] as const,
  students: (id: string) => [...classKeys.detail(id), 'students'] as const,
  schedule: (id: string, month?: string) =>
    [...classKeys.detail(id), 'schedule', { month }] as const,
  attendance: (id: string, month?: string) =>
    [...classKeys.detail(id), 'attendance', { month }] as const,
};

// Hooks for Classes

export function useClasses(filters?: { role?: string; status?: string }) {
  return useQuery({
    queryKey: classKeys.list(filters),
    queryFn: () => classesService.getClasses(filters),
  });
}

export function useClassDetails(classId: string) {
  return useQuery({
    queryKey: classKeys.detail(classId),
    queryFn: () => classesService.getClassDetails(classId),
    enabled: !!classId,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateClassRequest) =>
      classesService.createClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      classId,
      data,
    }: {
      classId: string;
      data: Partial<CreateClassRequest>;
    }) => classesService.updateClass(classId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: classKeys.detail(variables.classId),
      });
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (classId: string) => classesService.deleteClass(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
    },
  });
}

export function useInviteStudents() {
  return useMutation({
    mutationFn: ({
      classId,
      data,
    }: {
      classId: string;
      data: InviteStudentsRequest;
    }) => classesService.inviteStudents(classId, data),
  });
}

export function useJoinClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: JoinClassRequest) => classesService.joinClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
    },
  });
}

export function useClassStudents(classId: string) {
  return useQuery({
    queryKey: classKeys.students(classId),
    queryFn: () => classesService.getClassStudents(classId),
    enabled: !!classId,
  });
}

export function useRemoveStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      classId,
      studentId,
    }: {
      classId: string;
      studentId: string;
    }) => classesService.removeStudent(classId, studentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: classKeys.students(variables.classId),
      });
      queryClient.invalidateQueries({
        queryKey: classKeys.detail(variables.classId),
      });
    },
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      classId,
      data,
    }: {
      classId: string;
      data: CreateScheduleRequest;
    }) => classesService.createSchedule(classId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: classKeys.schedule(variables.classId),
      });
    },
  });
}

export function useClassSchedule(classId: string, month?: string) {
  return useQuery({
    queryKey: classKeys.schedule(classId, month),
    queryFn: () => classesService.getClassSchedule(classId, month),
    enabled: !!classId,
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      classId,
      data,
    }: {
      classId: string;
      data: MarkAttendanceRequest;
    }) => classesService.markAttendance(classId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: classKeys.attendance(variables.classId),
      });
    },
  });
}

export function useAttendance(classId: string, month?: string) {
  return useQuery({
    queryKey: classKeys.attendance(classId, month),
    queryFn: () => classesService.getAttendance(classId, month),
    enabled: !!classId,
  });
}
