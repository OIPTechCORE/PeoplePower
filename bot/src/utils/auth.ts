import { TelegramUser, Player, PlayerGeneration } from '@people-power/shared';
import { generateReferralCode, isValidReferralCode } from '@people-power/shared';
import crypto from 'crypto';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export const authenticateUser = async (telegramUser: TelegramUser): Promise<Player | null> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ telegramUser }),
    });

    if (!response.ok) {
      console.error('Authentication failed:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.player;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

export const createOrGetPlayer = async (
  telegramUser: TelegramUser,
  referralCode?: string
): Promise<Player> => {
  try {
    const payload = {
      telegramUser,
      referralCode: referralCode && isValidReferralCode(referralCode) ? referralCode : undefined,
    };

    const response = await fetch(`${API_URL}/api/players/create-or-get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to create/get player: ${response.statusText}`);
    }

    const data = await response.json();
    return data.player;
  } catch (error) {
    console.error('Create/Get player error:', error);
    throw error;
  }
};

export const verifyTelegramInitData = (initData: string, botToken: string): boolean => {
  try {
    // Parse the init data
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    
    if (!hash) {
      return false;
    }

    // Remove hash from the data
    urlParams.delete('hash');
    
    // Sort the parameters alphabetically
    const sortedParams = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create the secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Calculate the hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(sortedParams)
      .digest('hex');

    // Compare hashes
    return calculatedHash === hash;
  } catch (error) {
    console.error('Error verifying Telegram init data:', error);
    return false;
  }
};

export const getPlayerData = async (playerId: string): Promise<Player | null> => {
  try {
    const response = await fetch(`${API_URL}/api/players/${playerId}`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.player;
  } catch (error) {
    console.error('Error getting player data:', error);
    return null;
  }
};

export const updatePlayerData = async (
  playerId: string,
  updates: Partial<Player>
): Promise<Player | null> => {
  try {
    const response = await fetch(`${API_URL}/api/players/${playerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update player: ${response.statusText}`);
    }

    const data = await response.json();
    return data.player;
  } catch (error) {
    console.error('Error updating player data:', error);
    throw error;
  }
};

export const getPlayerStats = async (playerId: string): Promise<{
  rank: number;
  totalPlayers: number;
  percentile: number;
} | null> => {
  try {
    const response = await fetch(`${API_URL}/api/players/${playerId}/stats`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.stats;
  } catch (error) {
    console.error('Error getting player stats:', error);
    return null;
  }
};

export const isUserBanned = async (telegramId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/moderation/check/${telegramId}`);
    
    if (!response.ok) {
      return false; // Assume not banned if check fails
    }

    const data = await response.json();
    return data.isBanned || false;
  } catch (error) {
    console.error('Error checking ban status:', error);
    return false;
  }
};

export const logUserActivity = async (
  telegramId: number,
  action: string,
  metadata?: any
): Promise<void> => {
  try {
    await fetch(`${API_URL}/api/analytics/activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        telegramId,
        action,
        metadata,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Error logging user activity:', error);
    // Don't throw - analytics failures shouldn't break the main flow
  }
};

export const getPlayerSessionInfo = async (playerId: string): Promise<{
  canStartNewSession: boolean;
  timeUntilNextSession: number;
  sessionsToday: number;
  maxDailySessions: number;
} | null> => {
  try {
    const response = await fetch(`${API_URL}/api/players/${playerId}/session-info`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.sessionInfo;
  } catch (error) {
    console.error('Error getting session info:', error);
    return null;
  }
};
