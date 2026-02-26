import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useGame } from './GameContext';

// Custom hooks for game data fetching and mutations

// Profile hooks
export const useProfile = () => {
  const { dispatch } = useGame();
  
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => api.game.getProfile(),
    onSuccess: (data) => {
      if (data.success && data.data) {
        dispatch({ type: 'SET_PLAYER', payload: data.data });
      }
    },
    onError: (error) => {
      console.error('Failed to fetch profile:', error);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { dispatch } = useGame();
  
  return useMutation({
    mutationFn: (data: any) => api.game.updateProfile(data),
    onSuccess: (data) => {
      if (data.success && data.data) {
        dispatch({ type: 'UPDATE_PLAYER', payload: data.data });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
  });
};

// Game actions hook
export const useGameAction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (action: any) => api.game.performAction(action),
    onSuccess: () => {
      // Invalidate relevant queries after action
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

// Missions hooks
export const useMissions = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['missions', params],
    queryFn: () => api.game.getMissions(params),
    select: (data) => data.data,
  });
};

export const useCompleteMission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ missionId, data }: { missionId: string; data?: any }) =>
      api.game.completeMission(missionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

// Leaderboard hooks
export const useLeaderboards = (params?: { type?: string; period?: string; limit?: number }) => {
  return useQuery({
    queryKey: ['leaderboards', params],
    queryFn: () => api.game.getLeaderboards(params),
    select: (data) => data.data,
  });
};

// Stats hook
export const useStats = (period?: string) => {
  return useQuery({
    queryKey: ['stats', period],
    queryFn: () => api.game.getStats(period),
    select: (data) => data.data,
  });
};

// Habits hooks
export const useHabits = () => {
  return useQuery({
    queryKey: ['habits'],
    queryFn: () => api.game.getHabits(),
    select: (data) => data.data,
  });
};

export const useUpdateHabitProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ habitId, progress }: { habitId: string; progress: any }) =>
      api.game.updateHabitProgress(habitId, progress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
};

// Communities hooks
export const useCommunities = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['communities', params],
    queryFn: () => api.social.getCommunities(params),
    select: (data) => data.data,
  });
};

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => api.social.createCommunity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });
};

export const useJoinCommunity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (communityId: string) => api.social.joinCommunity(communityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });
};

// Competitions hooks
export const useCompetitions = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['competitions', params],
    queryFn: () => api.social.getCompetitions(params),
    select: (data) => data.data,
  });
};

export const useJoinCompetition = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (competitionId: string) => api.social.joinCompetition(competitionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
      queryClient.invalidateQueries({ queryKey: ['competition-history'] });
    },
  });
};

// Economy hooks
export const useBalance = () => {
  return useQuery({
    queryKey: ['balance'],
    queryFn: () => api.economy.getBalance(),
    select: (data) => data.data,
  });
};

export const useTransactions = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => api.economy.getTransactions(params),
    select: (data) => data.data,
  });
};

export const useTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => api.economy.processTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

// Shop hooks
export const useShop = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['shop', params],
    queryFn: () => api.economy.getShop(params),
    select: (data) => data.data,
  });
};

export const usePurchaseItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId: string) => api.economy.purchaseItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['shop'] });
    },
  });
};

// Chat hooks
export const useChannels = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['channels', params],
    queryFn: () => api.chat.getChannels(params),
    select: (data) => data.data,
  });
};

export const useMessages = (channelId: string, params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['messages', channelId, params],
    queryFn: () => api.chat.getMessages(channelId, params),
    select: (data) => data.data,
    enabled: !!channelId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ channelId, message }: { channelId: string; message: any }) =>
      api.chat.sendMessage(channelId, message),
    onSuccess: (_, { channelId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', channelId] });
    },
  });
};

// Authentication hook
export const useAuth = () => {
  const queryClient = useQueryClient();
  
  const login = useMutation({
    mutationFn: (telegramData: any) => api.auth.authenticate(telegramData),
    onSuccess: (data) => {
      if (data.success) {
        // Store token if provided
        if (data.data?.token) {
          localStorage.setItem('authToken', data.data.token);
        }
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
  });
  
  const logout = useMutation({
    mutationFn: () => api.auth.logout(),
    onSuccess: () => {
      localStorage.removeItem('authToken');
      queryClient.clear();
    },
  });
  
  return {
    login,
    logout,
  };
};

// Health check hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => api.health.check(),
    refetchInterval: 30000, // Check every 30 seconds
    retry: 3,
  });
};
