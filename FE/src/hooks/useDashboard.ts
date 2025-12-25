import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  dashboardService,
  DashboardOverview,
  WeeklySummary,
  ActivityResponse,
  CalendarDay,
  SkillProgress,
  LearningRoadmap,
  WeeklyPlan,
  CreateRoadmapRequest,
  UpdateRoadmapRequest,
} from '@/services/dashboard.service';

// ==================== Dashboard Overview Hooks ====================

export function useDashboardOverview() {
  return useQuery<DashboardOverview>({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => dashboardService.getOverview(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useWeeklySummary() {
  return useQuery<WeeklySummary>({
    queryKey: ['dashboard', 'weekly-summary'],
    queryFn: () => dashboardService.getWeeklySummary(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// ==================== Calendar & Progress Hooks ====================

export function useActivityCalendar(startDate?: string, endDate?: string) {
  return useQuery<CalendarDay[]>({
    queryKey: ['dashboard', 'calendar', startDate, endDate],
    queryFn: () => dashboardService.getCalendar(startDate, endDate),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

export function useSkillProgress(days = 30) {
  return useQuery<SkillProgress>({
    queryKey: ['dashboard', 'skill-progress', days],
    queryFn: () => dashboardService.getSkillProgress(days),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// ==================== Activity Feed Hooks ====================

export function useActivities(page = 1, limit = 20, category?: string) {
  return useQuery<ActivityResponse>({
    queryKey: ['activities', page, limit, category],
    queryFn: () => dashboardService.getActivities(page, limit, category),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useActivityTimeline(days = 30) {
  return useQuery({
    queryKey: ['activities', 'timeline', days],
    queryFn: () => dashboardService.getActivityTimeline(days),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useActivitySummary(days = 7) {
  return useQuery<Record<string, number>>({
    queryKey: ['activities', 'summary', days],
    queryFn: () => dashboardService.getActivitySummary(days),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ==================== Learning Roadmap Hooks ====================

export function useRoadmap() {
  return useQuery<LearningRoadmap>({
    queryKey: ['roadmap'],
    queryFn: () => dashboardService.getRoadmap(),
    retry: false, // Don't retry if user doesn't have a roadmap
  });
}

export function useWeeklyPlan() {
  return useQuery<WeeklyPlan>({
    queryKey: ['roadmap', 'weekly-plan'],
    queryFn: () => dashboardService.getWeeklyPlan(),
    retry: false,
  });
}

export function useCreateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoadmapRequest) => dashboardService.createRoadmap(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    },
  });
}

export function useUpdateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRoadmapRequest) => dashboardService.updateRoadmap(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    },
  });
}

// ==================== Combined Dashboard Hook ====================

export function useDashboard() {
  const overview = useDashboardOverview();
  const weekly = useWeeklySummary();

  return {
    overview: overview.data,
    weeklySummary: weekly.data,
    isLoading: overview.isLoading || weekly.isLoading,
    isError: overview.isError || weekly.isError,
    error: overview.error || weekly.error,
    refetch: () => {
      overview.refetch();
      weekly.refetch();
    },
  };
}
