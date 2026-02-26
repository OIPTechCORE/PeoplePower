import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// API response wrapper
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

// Generic API request function
async function apiRequest<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.request<ApiResponse<T>>({
      method,
      url: endpoint,
      data,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
}

// Authentication API
export const authAPI = {
  authenticate: (telegramData: any) =>
    apiRequest('POST', '/auth/telegram', telegramData),
  
  refreshToken: () =>
    apiRequest('POST', '/auth/refresh'),
  
  logout: () =>
    apiRequest('POST', '/auth/logout'),
};

// Player/Game API
export const gameAPI = {
  // Profile
  getProfile: () =>
    apiRequest('GET', '/game/profile'),
  
  updateProfile: (data: any) =>
    apiRequest('PUT', '/game/profile', data),
  
  // Game actions
  performAction: (action: any) =>
    apiRequest('POST', '/game/action', action),
  
  // Missions
  getMissions: (params?: { page?: number; limit?: number }) =>
    apiRequest('GET', '/game/missions', params),
  
  completeMission: (missionId: string, data?: any) =>
    apiRequest('POST', `/game/missions/${missionId}/complete`, data),
  
  // Leaderboards
  getLeaderboards: (params?: { type?: string; period?: string; limit?: number }) =>
    apiRequest('GET', '/game/leaderboards', params),
  
  // Stats
  getStats: (period?: string) =>
    apiRequest('GET', '/game/stats', { period }),
  
  // Habits
  getHabits: () =>
    apiRequest('GET', '/game/habits'),
  
  updateHabitProgress: (habitId: string, progress: any) =>
    apiRequest('PUT', `/game/habits/${habitId}/progress`, progress),
};

// Social API
export const socialAPI = {
  // Communities
  getCommunities: (params?: { page?: number; limit?: number }) =>
    apiRequest('GET', '/social/communities', params),
  
  createCommunity: (data: any) =>
    apiRequest('POST', '/social/communities', data),
  
  joinCommunity: (communityId: string) =>
    apiRequest('POST', `/social/communities/${communityId}/join`),
  
  getCommunityMembers: (communityId: string, params?: { page?: number; limit?: number }) =>
    apiRequest('GET', `/social/communities/${communityId}/members`, params),
  
  // Competitions
  getCompetitions: (params?: { page?: number; limit?: number }) =>
    apiRequest('GET', '/social/competitions', params),
  
  joinCompetition: (competitionId: string) =>
    apiRequest('POST', `/social/competitions/${competitionId}/join`),
  
  getCompetitionHistory: (params?: { page?: number; limit?: number }) =>
    apiRequest('GET', '/social/competitions/history', params),
  
  // Referrals
  getReferrals: (params?: { page?: number; limit?: number }) =>
    apiRequest('GET', '/social/referrals', params),
  
  // Social sharing
  share: (data: any) =>
    apiRequest('POST', '/social/share', data),
};

// Economy API
export const economyAPI = {
  // Balance and transactions
  getBalance: () =>
    apiRequest('GET', '/economy/balance'),
  
  getTransactions: (params?: { page?: number; limit?: number }) =>
    apiRequest('GET', '/economy/transactions', params),
  
  processTransaction: (data: any) =>
    apiRequest('POST', '/economy/transaction', data),
  
  // Shop
  getShop: (params?: { page?: number; limit?: number }) =>
    apiRequest('GET', '/economy/shop', params),
  
  purchaseItem: (itemId: string) =>
    apiRequest('POST', `/economy/shop/${itemId}/purchase`),
  
  getPurchases: (params?: { page?: number; limit?: number }) =>
    apiRequest('GET', '/economy/purchases', params),
  
  // Stats
  getStats: () =>
    apiRequest('GET', '/economy/stats'),
};

// Chat API
export const chatAPI = {
  // Channels
  getChannels: (params?: { page?: number; limit?: number }) =>
    apiRequest('GET', '/chat/channels', params),
  
  createChannel: (data: any) =>
    apiRequest('POST', '/chat/channels', data),
  
  joinChannel: (channelId: string) =>
    apiRequest('POST', `/chat/channels/${channelId}/join`),
  
  leaveChannel: (channelId: string) =>
    apiRequest('POST', `/chat/channels/${channelId}/leave`),
  
  // Messages
  getMessages: (channelId: string, params?: { page?: number; limit?: number }) =>
    apiRequest('GET', `/chat/channels/${channelId}/messages`, params),
  
  sendMessage: (channelId: string, data: any) =>
    apiRequest('POST', `/chat/channels/${channelId}/messages`, data),
  
  // Members
  getChannelMembers: (channelId: string, params?: { page?: number; limit?: number }) =>
    apiRequest('GET', `/chat/channels/${channelId}/members`, params),
};

// Health check API
export const healthAPI = {
  check: () =>
    apiRequest('GET', '/health'),
  
  ready: () =>
    apiRequest('GET', '/ready'),
  
  live: () =>
    apiRequest('GET', '/live'),
};

// Export all APIs
export const api = {
  auth: authAPI,
  game: gameAPI,
  social: socialAPI,
  economy: economyAPI,
  chat: chatAPI,
  health: healthAPI,
};

// Export axios instance for custom requests
export { apiClient };

// Export types
export type { ApiResponse };
