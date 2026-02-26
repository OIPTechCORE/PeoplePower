import TelegramBot from 'node-telegram-bot-api';
import { authenticateUser, getPlayerStats } from '../utils/auth';
import { generateReferralLink } from '../utils/referral';

export const handleProfileCommand = async (bot: TelegramBot, msg: TelegramBot.Message) => {
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

    // Get player stats
    const playerStats = await getPlayerStats(player.id);

    // Generate profile message
    const profileMessage = generateProfileMessage(player, playerStats);

    // Create profile keyboard
    const keyboard = createProfileKeyboard(player);

    await bot.sendMessage(chatId, profileMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });

  } catch (error) {
    console.error('Profile command error:', error);
    await bot.sendMessage(
      chatId,
      '❌ Unable to load profile. Please try again later.'
    );
  }
};

const generateProfileMessage = (player: any, playerStats: any): string => {
  const displayName = player.displayName || player.username;
  
  let message = `👤 *Player Profile*\n\n`;
  
  // Basic info
  message += `🎭 *${displayName}*\n`;
  message += `🆔 ID: ${player.telegramId}\n`;
  message += `📅 Joined: ${new Date(player.joinedAt).toLocaleDateString()}\n\n`;

  // Game progress
  message += `📈 *Game Progress:*\n`;
  message += `⭐ Level: ${player.level}\n`;
  message += `🏆 Rank: ${player.rank.replace('_', ' ')}\n`;
  message += `✨ Experience: ${player.experience}/${player.level * 100}\n\n`;

  // Resources
  message += `💰 *Resources:*\n`;
  message += `⚡ Influence: ${player.influence.toLocaleString()}\n`;
  message += `👥 Supporters: ${player.supporters.toLocaleString()}\n`;
  message += `💎 POWER Tokens: ${player.powerTokens.toLocaleString()}\n`;
  message += `🏅 Total Earned: ${player.totalEarned.toLocaleString()}\n\n`;

  // Generation bonus
  message += `🌟 *Generation Status:*\n`;
  message += `🎖️ ${player.generation.replace('_', ' ')}\n`;
  message += `💯 Permanent Bonus: +${(player.permanentBonus * 100).toFixed(0)}%\n\n`;

  // Social stats
  message += `🤝 *Social Impact:*\n`;
  message += `🔗 Referrals: ${player.referralsCount}\n`;
  message += `🏠 Community: ${player.communityId ? 'Member' : 'None'}\n\n`;

  // Leaderboard position
  if (playerStats) {
    message += `🏆 *Leaderboard Position:*\n`;
    message += `🌍 Global Rank: #${playerStats.rank.toLocaleString()}\n`;
    message += `📊 Top ${Math.floor(playerStats.percentile)}%\n`;
    message += `👥 of ${playerStats.totalPlayers.toLocaleString()} players\n\n`;
  }

  // Achievements
  if (player.badges && player.badges.length > 0) {
    message += `🎖️ *Recent Achievements:*\n`;
    player.badges.slice(0, 3).forEach((badge: any) => {
      message += `${badge.icon} ${badge.name}\n`;
    });
    message += `\n`;
  }

  // Titles
  if (player.titles && player.titles.length > 0) {
    message += `👑 *Titles:*\n`;
    message += player.titles.slice(0, 3).join(', ');
    message += `\n\n`;
  }

  // Motivational message based on progress
  if (player.level < 10) {
    message += `🌱 *You're just beginning your journey!*\n`;
    message += `Complete missions to grow your influence!\n`;
  } else if (player.level < 25) {
    message += `🔥 *Your movement is growing strong!*\n`;
    message += `Keep building your community!\n`;
  } else if (player.level < 50) {
    message += `👑 *You're becoming a true leader!*\n`;
    message += `Your influence inspires many!\n`;
  } else {
    message += `🌟 *You're a legendary leader!*\n`;
    message += `Your legacy will inspire generations!\n`;
  }

  return message;
};

const createProfileKeyboard = (player: any): any[][] => {
  const keyboard = [
    [
      { text: '🎮 Play Game', callback_data: 'play_game' },
      { text: '🎯 Missions', callback_data: 'missions' },
    ],
    [
      { text: '👥 Invite Friends', callback_data: 'invite_friends' },
      { text: '🏆 Leaderboard', callback_data: 'leaderboard' },
    ],
    [
      { text: '🤝 Community', callback_data: 'community' },
      { text: '📖 Story Mode', callback_data: 'story_mode' },
    ],
    [
      { text: '📊 Share Profile', callback_data: 'share_profile' },
    ],
  ];

  return keyboard;
};
