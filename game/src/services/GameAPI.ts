// ========================================
// GAME API SERVICE
// Backend Integration for People Power Game
// ========================================

import { Player, GameState, Mission, StoryChapter, Community, Achievement } from '../types/game';
import { TelegramWebApp } from '../types/telegram';

export interface MissionResult {
  success: boolean;
  rewards: {
    influence: number;
    tokens: number;
    experience: number;
  };
  nextMission?: Mission;
}

export interface StoryResult {
  success: boolean;
  rewards: {
    influence: number;
    tokens: number;
    experience: number;
  };
  nextChapter?: StoryChapter;
}

export interface LevelUpRewards {
  tokens: number;
  influence: number;
  newAbilities: string[];
}

export interface DailyReward {
  influence: number;
  tokens: number;
  streakBonus: number;
}

export interface CommunityJoinResult {
  success: boolean;
  community: Community;
  message: string;
}

export interface PlayerData {
  player: Player;
  gameState: GameState;
  lastUpdated: Date;
}

export class GameAPI {
  private baseUrl: string;
  private initData: string;
  private playerId: string;

  constructor(initData: string) {
    this.baseUrl = process.env.REACT_APP_GAME_API_URL || 'https://api.peoplepower.game';
    this.initData = initData;
    this.playerId = this.extractPlayerId(initData);
  }

  private extractPlayerId(initData: string): string {
    try {
      const data = new URLSearchParams(initData);
      const user = JSON.parse(data.get('user') || '{}');
      return user.id.toString();
    } catch (error) {
      console.error('Failed to extract player ID from init data:', error);
      return 'unknown';
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.initData}`,
      ...options.headers
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // PLAYER DATA MANAGEMENT
  async getPlayerData(playerId: string): Promise<PlayerData | null> {
    try {
      const response = await this.makeRequest(`/players/${playerId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get player data:', error);
      return null;
    }
  }

  async updatePlayerData(playerId: string, updates: Partial<Player>): Promise<Player> {
    const response = await this.makeRequest(`/players/${playerId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return response.data;
  }

  async createPlayer(playerData: Partial<Player>): Promise<Player> {
    const response = await this.makeRequest('/players', {
      method: 'POST',
      body: JSON.stringify(playerData)
    });
    return response.data;
  }

  // MISSION SYSTEM
  async getAvailableMissions(playerId: string): Promise<Mission[]> {
    try {
      const response = await this.makeRequest(`/players/${playerId}/missions`);
      return response.data;
    } catch (error) {
      console.error('Failed to get missions:', error);
      return [];
    }
  }

  async completeMission(missionId: string, playerId: string): Promise<MissionResult> {
    try {
      const response = await this.makeRequest(`/missions/${missionId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ playerId })
      });
      return response.data;
    } catch (error) {
      console.error('Failed to complete mission:', error);
      return {
        success: false,
        rewards: { influence: 0, tokens: 0, experience: 0 }
      };
    }
  }

  async startMission(missionId: string, playerId: string): Promise<Mission> {
    const response = await this.makeRequest(`/missions/${missionId}/start`, {
      method: 'POST',
      body: JSON.stringify({ playerId })
    });
    return response.data;
  }

  // STORY SYSTEM
  async getStoryChapters(playerId: string): Promise<StoryChapter[]> {
    try {
      const response = await this.makeRequest(`/players/${playerId}/story`);
      return response.data;
    } catch (error) {
      console.error('Failed to get story chapters:', error);
      return [];
    }
  }

  async completeStoryChapter(chapterId: number, playerId: string): Promise<StoryResult> {
    try {
      const response = await this.makeRequest(`/story/${chapterId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ playerId })
      });
      return response.data;
    } catch (error) {
      console.error('Failed to complete story chapter:', error);
      return {
        success: false,
        rewards: { influence: 0, tokens: 0, experience: 0 }
      };
    }
  }

  async unlockStoryChapter(chapterId: number, playerId: string): Promise<StoryChapter> {
    const response = await this.makeRequest(`/story/${chapterId}/unlock`, {
      method: 'POST',
      body: JSON.stringify({ playerId })
    });
    return response.data;
  }

  // LEVEL AND PROGRESSION
  async getLevelUpRewards(level: number): Promise<LevelUpRewards> {
    try {
      const response = await this.makeRequest(`/rewards/level-up/${level}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get level up rewards:', error);
      return {
        tokens: level * 10,
        influence: level * 50,
        newAbilities: []
      };
    }
  }

  async checkLevelUp(playerId: string): Promise<{ canLevelUp: boolean; newLevel: number }> {
    try {
      const response = await this.makeRequest(`/players/${playerId}/level-up-check`);
      return response.data;
    } catch (error) {
      console.error('Failed to check level up:', error);
      return { canLevelUp: false, newLevel: 1 };
    }
  }

  // DAILY REWARDS
  async claimDailyReward(playerId: string): Promise<DailyReward> {
    try {
      const response = await this.makeRequest(`/players/${playerId}/daily-reward`, {
        method: 'POST'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to claim daily reward:', error);
      return {
        influence: 50,
        tokens: 5,
        streakBonus: 0
      };
    }
  }

  async getDailyRewardStatus(playerId: string): Promise<{ canClaim: boolean; streak: number }> {
    try {
      const response = await this.makeRequest(`/players/${playerId}/daily-reward-status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get daily reward status:', error);
      return { canClaim: true, streak: 1 };
    }
  }

  // COMMUNITY SYSTEM
  async getCommunities(): Promise<Community[]> {
    try {
      const response = await this.makeRequest('/communities');
      return response.data;
    } catch (error) {
      console.error('Failed to get communities:', error);
      return [];
    }
  }

  async joinCommunity(communityId: string, playerId: string): Promise<CommunityJoinResult> {
    try {
      const response = await this.makeRequest(`/communities/${communityId}/join`, {
        method: 'POST',
        body: JSON.stringify({ playerId })
      });
      return response.data;
    } catch (error) {
      console.error('Failed to join community:', error);
      return {
        success: false,
        community: null as any,
        message: 'Failed to join community'
      };
    }
  }

  async leaveCommunity(communityId: string, playerId: string): Promise<{ success: boolean }> {
    try {
      const response = await this.makeRequest(`/communities/${communityId}/leave`, {
        method: 'POST',
        body: JSON.stringify({ playerId })
      });
      return response.data;
    } catch (error) {
      console.error('Failed to leave community:', error);
      return { success: false };
    }
  }

  async getCommunityDetails(communityId: string): Promise<Community> {
    try {
      const response = await this.makeRequest(`/communities/${communityId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get community details:', error);
      throw error;
    }
  }

  // ACHIEVEMENT SYSTEM
  async getPlayerAchievements(playerId: string): Promise<Achievement[]> {
    try {
      const response = await this.makeRequest(`/players/${playerId}/achievements`);
      return response.data;
    } catch (error) {
      console.error('Failed to get player achievements:', error);
      return [];
    }
  }

  async unlockAchievement(achievementId: string, playerId: string): Promise<Achievement> {
    const response = await this.makeRequest(`/achievements/${achievementId}/unlock`, {
      method: 'POST',
      body: JSON.stringify({ playerId })
    });
    return response.data;
  }

  // LEADERBOARD SYSTEM
  async getLeaderboard(type: string, period: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/leaderboard?type=${type}&period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get leaderboard:', error);
      return { entries: [], playerRank: 0, totalPlayers: 0 };
    }
  }

  async getPlayerRank(playerId: string, type: string, period: string): Promise<number> {
    try {
      const response = await this.makeRequest(`/players/${playerId}/rank?type=${type}&period=${period}`);
      return response.data.rank;
    } catch (error) {
      console.error('Failed to get player rank:', error);
      return 0;
    }
  }

  // SHOP SYSTEM
  async getShopItems(): Promise<any[]> {
    try {
      const response = await this.makeRequest('/shop/items');
      return response.data;
    } catch (error) {
      console.error('Failed to get shop items:', error);
      return [];
    }
  }

  async purchaseItem(itemId: string, playerId: string): Promise<{ success: boolean; item?: any }> {
    try {
      const response = await this.makeRequest(`/shop/items/${itemId}/purchase`, {
        method: 'POST',
        body: JSON.stringify({ playerId })
      });
      return response.data;
    } catch (error) {
      console.error('Failed to purchase item:', error);
      return { success: false };
    }
  }

  // SEASON SYSTEM
  async getCurrentSeason(): Promise<any> {
    try {
      const response = await this.makeRequest('/seasons/current');
      return response.data;
    } catch (error) {
      console.error('Failed to get current season:', error);
      return null;
    }
  }

  async getSeasonProgress(playerId: string, seasonId: number): Promise<any> {
    try {
      const response = await this.makeRequest(`/players/${playerId}/seasons/${seasonId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get season progress:', error);
      return null;
    }
  }

  // REFERRAL SYSTEM
  async processReferral(referralCode: string, newPlayerId: string): Promise<any> {
    try {
      const response = await this.makeRequest('/referrals/process', {
        method: 'POST',
        body: JSON.stringify({ referralCode, newPlayerId })
      });
      return response.data;
    } catch (error) {
      console.error('Failed to process referral:', error);
      return null;
    }
  }

  async getReferralStats(playerId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/players/${playerId}/referrals`);
      return response.data;
    } catch (error) {
      console.error('Failed to get referral stats:', error);
      return { totalReferrals: 0, activeReferrals: 0, totalRewards: 0 };
    }
  }

  // ANALYTICS AND EVENTS
  async trackEvent(eventType: string, data: any, playerId: string): Promise<void> {
    try {
      await this.makeRequest('/analytics/events', {
        method: 'POST',
        body: JSON.stringify({
          eventType,
          data,
          playerId,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  async getPlayerAnalytics(playerId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/players/${playerId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Failed to get player analytics:', error);
      return null;
    }
  }

  // NOTIFICATION SYSTEM
  async getNotifications(playerId: string): Promise<any[]> {
    try {
      const response = await this.makeRequest(`/players/${playerId}/notifications`);
      return response.data;
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return [];
    }
  }

  async markNotificationRead(notificationId: string, playerId: string): Promise<void> {
    try {
      await this.makeRequest(`/notifications/${notificationId}/read`, {
        method: 'POST',
        body: JSON.stringify({ playerId })
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  // COMEBACK BONUS SYSTEM
  async calculateComebackBonus(daysSinceLastPlay: number): Promise<number> {
    try {
      const response = await this.makeRequest('/rewards/comeback', {
        method: 'POST',
        body: JSON.stringify({ daysSinceLastPlay })
      });
      return response.data.bonus;
    } catch (error) {
      console.error('Failed to calculate comeback bonus:', error);
      // Fallback calculation
      if (daysSinceLastPlay <= 3) return 50;
      if (daysSinceLastPlay <= 7) return 100;
      if (daysSinceLastPlay <= 14) return 200;
      return 300;
    }
  }

  // SOCIAL FEATURES
  async sendFriendRequest(playerId: string, targetPlayerId: string): Promise<{ success: boolean }> {
    try {
      const response = await this.makeRequest('/social/friend-request', {
        method: 'POST',
        body: JSON.stringify({ playerId, targetPlayerId })
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send friend request:', error);
      return { success: false };
    }
  }

  async getFriends(playerId: string): Promise<any[]> {
    try {
      const response = await this.makeRequest(`/players/${playerId}/friends`);
      return response.data;
    } catch (error) {
      console.error('Failed to get friends:', error);
      return [];
    }
  }

  async getPlayerProfile(playerId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/players/${playerId}/profile`);
      return response.data;
    } catch (error) {
      console.error('Failed to get player profile:', error);
      return null;
    }
  }

  // GAME SETTINGS
  async getGameSettings(): Promise<any> {
    try {
      const response = await this.makeRequest('/settings');
      return response.data;
    } catch (error) {
      console.error('Failed to get game settings:', error);
      return null;
    }
  }

  async updatePlayerSettings(playerId: string, settings: any): Promise<void> {
    try {
      await this.makeRequest(`/players/${playerId}/settings`, {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
    } catch (error) {
      console.error('Failed to update player settings:', error);
    }
  }

  // HEALTH AND STATUS
  async getApiHealth(): Promise<{ status: string; version: string; uptime: number }> {
    try {
      const response = await this.makeRequest('/health');
      return response.data;
    } catch (error) {
      console.error('Failed to get API health:', error);
      return { status: 'unhealthy', version: 'unknown', uptime: 0 };
    }
  }

  async getServerTime(): Promise<{ timestamp: string; timezone: string }> {
    try {
      const response = await this.makeRequest('/time');
      return response.data;
    } catch (error) {
      console.error('Failed to get server time:', error);
      return { timestamp: new Date().toISOString(), timezone: 'UTC' };
    }
  }
}
