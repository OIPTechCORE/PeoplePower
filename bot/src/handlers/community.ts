import TelegramBot from 'node-telegram-bot-api';
import { authenticateUser } from '../utils/auth';

export const handleCommunityCommand = async (bot: TelegramBot, msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  const telegramUser = msg.from;

  if (!telegramUser) {
    await bot.sendMessage(chatId, '❌ Unable to identify user. Please try again.');
    return;
  }

  try {
    await bot.sendChatAction(chatId, 'typing');

    // Authenticate user
    const player = await authenticateUser(telegramUser);
    if (!player) {
      await bot.sendMessage(chatId, '❌ Please start the game first using /start');
      return;
    }

    // Get community data
    const communityData = await getCommunityData(player.id);

    // Generate community message
    const communityMessage = generateCommunityMessage(communityData, player);

    // Create community keyboard
    const keyboard = createCommunityKeyboard(communityData);

    await bot.sendMessage(chatId, communityMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });

  } catch (error) {
    console.error('Community command error:', error);
    await bot.sendMessage(
      chatId,
      '❌ Unable to load community information. Please try again later.'
    );
  }
};

const generateCommunityMessage = (communityData: any, player: any): string => {
  let message = `🤝 *Community Hub*\n\n`;

  if (communityData.memberCommunity) {
    const community = communityData.memberCommunity;
    message += `🏠 *Your Community: ${community.name}*\n`;
    message += `👑 Leader: ${community.leaderName}\n`;
    message += `👥 Members: ${community.memberCount}/${community.maxMembers}\n`;
    message += `⭐ Level: ${community.level}\n`;
    message += `🎯 Your Role: ${community.memberRole.replace('_', ' ')}\n\n`;
    
    if (community.pendingUpgrades && community.pendingUpgrades.length > 0) {
      message += `🔧 *Available Upgrades:*\n`;
      community.pendingUpgrades.slice(0, 2).forEach((upgrade: any) => {
        message += `• ${upgrade.name} (${upgrade.cost} Influence)\n`;
      });
      message += `\n`;
    }
  } else {
    message += `🌍 *You're not in a community yet!*\n\n`;
    message += `🚀 *Join a community to:*\n`;
    message += `• Earn passive bonuses\n`;
    message += `• Complete group missions\n`;
    message += `• Access exclusive rewards\n`;
    message += `• Build lasting connections\n\n`;
  }

  // Show top communities
  if (communityData.topCommunities && communityData.topCommunities.length > 0) {
    message += `🏆 *Top Communities This Week:*\n`;
    communityData.topCommunities.slice(0, 5).forEach((community: any, index: number) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
      message += `${medal} ${community.name} (${community.memberCount} members)\n`;
    });
    message += `\n`;
  }

  // Add community challenges
  if (communityData.activeChallenge) {
    const challenge = communityData.activeChallenge;
    message += `🎯 *Active Community Challenge:*\n`;
    message += `📝 ${challenge.name}\n`;
    message += `🏅 Reward: ${challenge.reward}\n`;
    message += `⏰ Ends in: ${challenge.timeLeft}\n\n`;
  }

  message += `🤝 *Communities are stronger together!*`;
  
  return message;
};

const createCommunityKeyboard = (communityData: any): any[][] => {
  const keyboard = [];

  if (communityData.memberCommunity) {
    keyboard.push([
      { text: '🏠 My Community', callback_data: 'my_community' },
      { text: '🎯 Community Missions', callback_data: 'community_missions' },
    ]);
    keyboard.push([
      { text: '🔧 Upgrades', callback_data: 'community_upgrades' },
      { text: '👥 Members', callback_data: 'community_members' },
    ]);
    keyboard.push([
      { text: '🏆 Community Leaderboard', callback_data: 'community_leaderboard' },
    ]);
  } else {
    keyboard.push([
      { text: '🔍 Find Community', callback_data: 'find_community' },
      { text: '🏗️ Create Community', callback_data: 'create_community' },
    ]);
  }

  keyboard.push([
    { text: '🎮 Play Game', callback_data: 'play_game' },
    { text: '🏆 Global Leaderboard', callback_data: 'leaderboard' },
  ]);

  return keyboard;
};

const getCommunityData = async (playerId: string): Promise<any> => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/players/${playerId}/community`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch community data: ${response.statusText}`);
    }

    const data = await response.json();
    return data.communityData;
  } catch (error) {
    console.error('Error fetching community data:', error);
    return {
      memberCommunity: null,
      topCommunities: [],
      activeChallenge: null,
    };
  }
};
