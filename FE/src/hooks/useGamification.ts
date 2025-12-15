import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationService } from '@/services';
import type { CreateGoalRequest } from '@/services';

// Query Keys
export const gamificationKeys = {
  all: ['gamification'] as const,
  badges: () => [...gamificationKeys.all, 'badges'] as const,
  earnedBadges: () => [...gamificationKeys.badges(), 'earned'] as const,
  goals: () => [...gamificationKeys.all, 'goals'] as const,
  goalList: (status?: string) => [...gamificationKeys.goals(), { status }] as const,
  leaderboards: () => [...gamificationKeys.all, 'leaderboards'] as const,
  leaderboard: (params: any) => [...gamificationKeys.leaderboards(), params] as const,
  points: () => [...gamificationKeys.all, 'points'] as const,
};

// Hooks for Gamification

export function useBadges() {
  return useQuery({
    queryKey: gamificationKeys.badges(),
    queryFn: () => gamificationService.getBadges(),
  });
}

export function useEarnedBadges() {
  return useQuery({
    queryKey: gamificationKeys.earnedBadges(),
    queryFn: () => gamificationService.getEarnedBadges(),
  });
}

export function useCheckBadgeUnlock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => gamificationService.checkBadgeUnlock(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gamificationKeys.badges() });
      queryClient.invalidateQueries({ queryKey: gamificationKeys.earnedBadges() });
    },
  });
}

export function useGoals(status?: string) {
  return useQuery({
    queryKey: gamificationKeys.goalList(status),
    queryFn: () => gamificationService.getGoals(status),
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGoalRequest) =>
      gamificationService.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gamificationKeys.goals() });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      goalId,
      data,
    }: {
      goalId: string;
      data: Partial<CreateGoalRequest>;
    }) => gamificationService.updateGoal(goalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gamificationKeys.goals() });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goalId: string) => gamificationService.deleteGoal(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gamificationKeys.goals() });
    },
  });
}

export function useAbandonGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goalId: string) => gamificationService.abandonGoal(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gamificationKeys.goals() });
    },
  });
}

export function useLeaderboard(params?: { scope?: string; period?: string }) {
  return useQuery({
    queryKey: gamificationKeys.leaderboard(params),
    queryFn: () => gamificationService.getLeaderboard(params),
  });
}

export function usePoints() {
  return useQuery({
    queryKey: gamificationKeys.points(),
    queryFn: () => gamificationService.getPoints(),
  });
}
