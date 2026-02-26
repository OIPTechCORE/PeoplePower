import TelegramBot from 'node-telegram-bot-api';
import { authenticateUser, createOrGetPlayer } from '../utils/auth';
import { generateReferralLink } from '../utils/referral';
import { PlayerGeneration } from '@people-power/shared';

export const handleStartCommand = async (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  referralCode?: string
) => {
  const chatId = msg.chat.id;
  const telegramUser = msg.from;

  if (!telegramUser) {
    await bot.sendMessage(chatId, '❌ Unable to identify user. Please try again.');
    return;
  }

  try {
    // Show typing indicator
    await bot.sendChatAction(chatId, 'typing');

    // Authenticate or create player
    const player = await createOrGetPlayer(telegramUser, referralCode);

    // Determine player generation
    const totalPlayers = await getTotalPlayersCount();
    const generation = determinePlayerGeneration(totalPlayers);

    // Welcome message based on generation
    const welcomeMessage = generateWelcomeMessage(player, generation);

    // Create main menu keyboard
    const keyboard = createMainMenuKeyboard(player);

    // Send welcome message with mini-app link
    await bot.sendMessage(chatId, welcomeMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });

    // If referred, send notification to referrer
    if (referralCode && player.referredBy) {
      await notifyReferrer(bot, player);
    }

  } catch (error) {
    console.error('Start command error:', error);
    await bot.sendMessage(
      chatId,
      '❌ Unable to start the game. Please try again later.'
    );
  }
};

const generateWelcomeMessage = (player: any, generation: PlayerGeneration): string => {
  const displayName = player.displayName || player.username;
  
  let message = `🔥 *Welcome to People Power: The Journey, ${displayName}!* 🔥\n\n`;
  
  // Generation-specific messaging
  switch (generation) {
    case PlayerGeneration.FOUNDERS:
      message += `🌟 **FOUNDING PLAYER** - You're in the first wave!\n`;
      message += `💎 *Permanent +40% bonus on all earnings!*\n\n`;
      break;
    case PlayerGeneration.BUILDERS:
      message += `🏗️ **EARLY BUILDER** - Building the movement!\n`;
      message += `⭐ *Permanent +20% bonus on all earnings!*\n\n`;
      break;
    case PlayerGeneration.SUPPORTERS:
      message += `🤝 **MOVEMENT SUPPORTER** - Joining the growth!\n`;
      message += `✨ *Permanent +10% bonus on all earnings!*\n\n`;
      break;
    default:
      message += `🌍 **MOVEMENT MEMBER** - Welcome to the community!\n\n`;
  }

  message += `📖 *Your journey begins...*\n\n`;
  message += `🎯 **Current Status:**\n`;
  message += `⭐ Level: ${player.level}\n`;
  message += `🏆 Rank: ${player.rank.replace('_', ' ')}\n`;
  message += `👥 Supporters: ${player.supporters}\n`;
  message += `⚡ Influence: ${player.influence}\n\n`;
  
  message += `🚀 *Ready to build your movement?*\n`;
  message += `Click the button below to start playing!`;

  return message;
};

const createMainMenuKeyboard = (player: any): any[][] => {
  const miniAppUrl = `${process.env.MINI_APP_URL}?tgWebAppStartParam=${player.referralCode}`;
  
  return [
    [
      {
        text: '🎮 PLAY NOW',
        web_app: { url: miniAppUrl },
      },
    ],
    [
      { text: '👥 Invite Friends', callback_data: 'invite_friends' },
      { text: '🏆 Leaderboard', callback_data: 'leaderboard' },
    ],
    [
      { text: '📖 Story Mode', callback_data: 'story_mode' },
      { text: '🎯 Daily Missions', callback_data: 'daily_missions' },
    ],
    [
      { text: '🤝 Community', callback_data: 'community' },
      { text: '👤 Profile', callback_data: 'profile' },
    ],
  ];
};

const determinePlayerGeneration = (totalPlayers: number): PlayerGeneration => {
  if (totalPlayers < 5000) return PlayerGeneration.FOUNDERS;
  if (totalPlayers < 50000) return PlayerGeneration.BUILDERS;
  if (totalPlayers < 500000) return PlayerGeneration.SUPPORTERS;
  return PlayerGeneration.MASS_MOVEMENT;
};

const getTotalPlayersCount = async (): Promise<number> => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/stats/players`);
    const data = await response.json();
    return data.totalPlayers || 0;
  } catch (error) {
    console.error('Error getting player count:', error);
    return 0;
  }
};

const notifyReferrer = async (bot: TelegramBot, newPlayer: any) => {
  try {
    const referrerId = newPlayer.referredBy;
    const displayName = newPlayer.displayName || newPlayer.username;
    
    const message = `🎉 *New Movement Member!*\n\n` +
      `👤 ${displayName} joined your movement!\n` +
      `🎁 You earned bonus rewards!\n\n` +
      `Keep building your community! 🚀`;

    await bot.sendMessage(referrerId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error notifying referrer:', error);
  }
};
