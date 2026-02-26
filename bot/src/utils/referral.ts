import { Player, Referral } from '@people-power/shared';
import { generateReferralCode, calculateReferralReward } from '@people-power/shared';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export const generateReferralLink = (player: Player): string => {
  const botUsername = process.env.BOT_USERNAME;
  if (!botUsername) {
    throw new Error('BOT_USERNAME environment variable is not set');
  }
  
  return `https://t.me/${botUsername}?start=${player.referralCode}`;
};

export const createReferral = async (
  referrerId: string,
  referredId: string,
  referredUsername: string
): Promise<Referral | null> => {
  try {
    const response = await fetch(`${API_URL}/api/referrals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        referrerId,
        referredId,
        referredUsername,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create referral: ${response.statusText}`);
    }

    const data = await response.json();
    return data.referral;
  } catch (error) {
    console.error('Error creating referral:', error);
    return null;
  }
};

export const processReferralReward = async (
  referralId: string,
  referralLevel: number = 1
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/referrals/${referralId}/reward`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ referralLevel }),
    });

    if (!response.ok) {
      throw new Error(`Failed to process referral reward: ${response.statusText}`);
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error processing referral reward:', error);
    return false;
  }
};

export const getReferralStats = async (playerId: string): Promise<{
  totalReferrals: number;
  activeReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalRewards: number;
  referralTree: any[];
} | null> => {
  try {
    const response = await fetch(`${API_URL}/api/players/${playerId}/referrals`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.stats;
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return null;
  }
};

export const getReferralCodeInfo = async (referralCode: string): Promise<{
  isValid: boolean;
  referrerId?: string;
  referrerName?: string;
  referrerRank?: string;
} | null> => {
  try {
    const response = await fetch(`${API_URL}/api/referrals/validate/${referralCode}`);
    
    if (!response.ok) {
      return { isValid: false };
    }

    const data = await response.json();
    return data.info;
  } catch (error) {
    console.error('Error validating referral code:', error);
    return { isValid: false };
  }
};

export const generateReferralShareMessage = (player: Player): string => {
  const referralLink = generateReferralLink(player);
  
  let message = `🔥 *Join My Movement in People Power!*\n\n`;
  message += `👤 *${player.displayName || player.username}*\n`;
  message += `🏆 *${player.rank.replace('_', ' ')}* • Level ${player.level}\n`;
  message += `👥 *${player.supporters}* Supporters • ⚡ ${player.influence} Influence\n\n`;
  
  // Add generation-specific messaging
  if (player.generation === 'FOUNDERS') {
    message += `🌟 *FOUNDER ACCESS AVAILABLE*\n`;
    message += `💎 Get +40% permanent bonus!\n\n`;
  } else if (player.generation === 'BUILDERS') {
    message += `🏗️ *EARLY BUILDER PHASE*\n`;
    message += `⭐ Get +20% permanent bonus!\n\n`;
  }
  
  message += `🚀 *Join before this phase ends!*\n\n`;
  message += `${referralLink}`;
  
  return message;
};

export const createReferralImage = async (player: Player): Promise<string | null> => {
  try {
    // This would integrate with an image generation service
    // For now, return a placeholder URL
    const baseUrl = process.env.IMAGE_GENERATION_URL || 'https://api.placeholder.com';
    
    const imageUrl = `${baseUrl}/512x512.png?text=${encodeURIComponent(
      `Join ${player.displayName || player.username}'s Movement!`
    )}&background=4F46E5&color=FFFFFF`;
    
    return imageUrl;
  } catch (error) {
    console.error('Error creating referral image:', error);
    return null;
  }
};

export const trackReferralClick = async (referralCode: string, platform: string): Promise<void> => {
  try {
    await fetch(`${API_URL}/api/analytics/referral-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        referralCode,
        platform,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Error tracking referral click:', error);
  }
};

export const getTopReferrers = async (limit: number = 10): Promise<{
  playerId: string;
  displayName: string;
  username: string;
  referralCount: number;
  rank: string;
}[] | null> => {
  try {
    const response = await fetch(`${API_URL}/api/leaderboards/referrals?limit=${limit}`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.leaderboard;
  } catch (error) {
    console.error('Error getting top referrers:', error);
    return null;
  }
};

export const calculateReferralNetworkBonus = async (playerId: string): Promise<number> => {
  try {
    const response = await fetch(`${API_URL}/api/players/${playerId}/network-bonus`);
    
    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    return data.bonus || 0;
  } catch (error) {
    console.error('Error calculating network bonus:', error);
    return 0;
  }
};

export const isReferralValid = async (referralCode: string): Promise<boolean> => {
  try {
    const info = await getReferralCodeInfo(referralCode);
    return info?.isValid || false;
  } catch (error) {
    console.error('Error checking referral validity:', error);
    return false;
  }
};
