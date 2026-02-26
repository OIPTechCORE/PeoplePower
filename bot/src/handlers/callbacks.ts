import TelegramBot from 'node-telegram-bot-api';
import { authenticateUser } from '../utils/auth';
import { generateReferralLink, generateReferralShareMessage } from '../utils/referral';

export const handleCallbackQuery = async (bot: TelegramBot, callbackQuery: TelegramBot.CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const data = callbackQuery.data;
  const telegramUser = callbackQuery.from;

  if (!chatId || !data || !telegramUser) {
    await bot.answerCallbackQuery(callbackQuery.id, '❌ Invalid callback data');
    return;
  }

  try {
    // Show loading state
    await bot.answerCallbackQuery(callbackQuery.id, { text: 'Loading...' });

    // Authenticate user
    const player = await authenticateUser(telegramUser);
    if (!player) {
      await bot.sendMessage(chatId, '❌ Please start the game first using /start');
      return;
    }

    // Handle different callback actions
    switch (data) {
      case 'play_game':
        await handlePlayGameCallback(bot, chatId, player);
        break;
      
      case 'invite_friends':
        await handleInviteFriendsCallback(bot, chatId, player);
        break;
      
      case 'leaderboard':
        await handleLeaderboardCallback(bot, chatId, player);
        break;
      
      case 'community':
        await handleCommunityCallback(bot, chatId, player);
        break;
      
      case 'missions':
        await handleMissionsCallback(bot, chatId, player);
        break;
      
      case 'profile':
        await handleProfileCallback(bot, chatId, player);
        break;
      
      case 'story_mode':
        await handleStoryModeCallback(bot, chatId, player);
        break;
      
      case 'copy_referral_link':
        await handleCopyReferralLinkCallback(bot, chatId, callbackQuery, player);
        break;
      
      case 'share_referral_image':
        await handleShareReferralImageCallback(bot, chatId, player);
        break;
      
      case 'referral_stats':
        await handleReferralStatsCallback(bot, chatId, player);
        break;
      
      case 'top_referrers':
        await handleTopReferrersCallback(bot, chatId, player);
        break;
      
      case 'player_stats':
        await handlePlayerStatsCallback(bot, chatId, player);
        break;
      
      case 'share_profile':
        await handleShareProfileCallback(bot, chatId, player);
        break;
      
      default:
        // Handle leaderboard type callbacks
        if (data.startsWith('leaderboard_')) {
          const type = data.replace('leaderboard_', '');
          await handleLeaderboardTypeCallback(bot, chatId, player, type);
        }
        // Handle mission type callbacks
        else if (data.startsWith('missions_')) {
          const type = data.replace('missions_', '');
          await handleMissionTypeCallback(bot, chatId, player, type);
        }
        else {
          await bot.answerCallbackQuery(callbackQuery.id, '❌ Unknown action');
        }
    }

  } catch (error) {
    console.error('Callback query error:', error);
    await bot.answerCallbackQuery(callbackQuery.id, '❌ An error occurred');
  }
};

const handlePlayGameCallback = async (bot: TelegramBot, chatId: number, player: any) => {
  const miniAppUrl = `${process.env.MINI_APP_URL}?tgWebAppStartParam=${player.referralCode}`;
  
  await bot.sendMessage(chatId, `🎮 *Launching People Power: The Journey...*`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        {
          text: '🎮 LAUNCH GAME',
          web_app: { url: miniAppUrl },
        },
      ]],
    },
  });
};

const handleInviteFriendsCallback = async (bot: TelegramBot, chatId: number, player: any) => {
  const referralMessage = generateReferralShareMessage(player);
  const referralLink = generateReferralLink(player);
  
  await bot.sendMessage(chatId, referralMessage, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📤 Copy Link', callback_data: 'copy_referral_link' },
          { text: '🖼️ Share Image', callback_data: 'share_referral_image' },
        ],
        [
          { text: '📊 Referral Stats', callback_data: 'referral_stats' },
        ],
      ],
    },
  });
};

const handleLeaderboardCallback = async (bot: TelegramBot, chatId: number, player: any) => {
  // This would fetch and display leaderboard data
  await bot.sendMessage(chatId, `🏆 *Loading Leaderboard...*\n\nPlease wait while we fetch the latest rankings.`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🌍 Global', callback_data: 'leaderboard_global' },
          { text: '🏙️ Regional', callback_data: 'leaderboard_regional' },
        ],
        [
          { text: '🎓 Campus', callback_data: 'leaderboard_campus' },
          { text: '🤝 Community', callback_data: 'leaderboard_community' },
        ],
      ],
    },
  });
};

const handleCommunityCallback = async (bot: TelegramBot, chatId: number, player: any) => {
  await bot.sendMessage(chatId, `🤝 *Loading Community Hub...*\n\nFetching your community information...`, {
    parse_mode: 'Markdown',
  });
};

const handleMissionsCallback = async (bot: TelegramBot, chatId: number, player: any) => {
  await bot.sendMessage(chatId, `🎯 *Loading Daily Missions...*\n\nFetching today's challenges...`, {
    parse_mode: 'Markdown',
  });
};

const handleProfileCallback = async (bot: TelegramBot, chatId: number, player: any) => {
  await bot.sendMessage(chatId, `👤 *Loading Profile...*\n\nFetching your player data...`, {
    parse_mode: 'Markdown',
  });
};

const handleStoryModeCallback = async (bot: TelegramBot, chatId: number, player: any) => {
  await bot.sendMessage(chatId, `📖 *Loading Story Mode...*\n\nContinuing your journey...`, {
    parse_mode: 'Markdown',
  });
};

const handleCopyReferralLinkCallback = async (bot: TelegramBot, chatId: number, callbackQuery: TelegramBot.CallbackQuery, player: any) => {
  const referralLink = generateReferralLink(player);
  
  try {
    await bot.sendMessage(chatId, `📤 *Your Referral Link:*\n\n${referralLink}\n\n*Copy this link and share it with friends!*`, {
    parse_mode: 'Markdown',
  });
    
    await bot.answerCallbackQuery(callbackQuery.id, { text: 'Link sent to chat!' });
  } catch (error) {
    await bot.answerCallbackQuery(callbackQuery.id, { text: 'Failed to send link' });
  }
};

const handleShareReferralImageCallback = async (bot: TelegramBot, chatId: number, player: any) => {
  await bot.sendMessage(chatId, `🖼️ *Generating referral image...*\n\nThis feature is coming soon!`, {
    parse_mode: 'Markdown',
  });
};

const handleReferralStatsCallback = async (bot: TelegramBot, chatId: number, player: any) => {
  await bot.sendMessage(chatId, `📊 *Loading Referral Stats...*\n\nFetching your network data...`, {
    parse_mode: 'Markdown',
  });
};

const handleTopReferrersCallback = async (bot: TelegramBot, chatId: number, player: any) => {
  await bot.sendMessage(chatId, `🏆 *Loading Top Referrers...*\n\nFetching leaderboard...`, {
    parse_mode: 'Markdown',
  });
};

const handlePlayerStatsCallback = async (bot: TelegramBot, chatId: number, player: any) => {
  await bot.sendMessage(chatId, `📊 *Loading Player Stats...*\n\nFetching detailed statistics...`, {
    parse_mode: 'Markdown',
  });
};

const handleShareProfileCallback = async (bot: TelegramBot, chatId: number, player: any) => {
  const displayName = player.displayName || player.username;
  const shareMessage = `🔥 *Check out my progress in People Power: The Journey!*\n\n` +
    `👤 ${displayName}\n` +
    `🏆 ${player.rank.replace('_', ' ')} • Level ${player.level}\n` +
    `👥 ${player.supporters} Supporters • ⚡ ${player.influence} Influence\n\n` +
    `🚀 Join the movement: https://t.me/${process.env.BOT_USERNAME}?start=${player.referralCode}`;
  
  await bot.sendMessage(chatId, shareMessage, {
    parse_mode: 'Markdown',
  });
};

const handleLeaderboardTypeCallback = async (bot: TelegramBot, chatId: number, player: any, type: string) => {
  await bot.sendMessage(chatId, `🏆 *Loading ${type.charAt(0).toUpperCase() + type.slice(1)} Leaderboard...*\n\nFetching rankings...`, {
    parse_mode: 'Markdown',
  });
};

const handleMissionTypeCallback = async (bot: TelegramBot, chatId: number, player: any, type: string) => {
  await bot.sendMessage(chatId, `🎯 *Loading ${type.charAt(0).toUpperCase() + type.slice(1)} Missions...*\n\nFetching missions...`, {
    parse_mode: 'Markdown',
  });
};
