import TelegramBot from 'node-telegram-bot-api';
import { authenticateUser, getPlayerSessionInfo } from '../utils/auth';
import { generateReferralLink } from '../utils/referral';

export const handlePlayCommand = async (bot: TelegramBot, msg: TelegramBot.Message) => {
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

    // Check session limits (addiction-safe framework)
    const sessionInfo = await getPlayerSessionInfo(player.id);
    
    if (sessionInfo && !sessionInfo.canStartNewSession) {
      const waitTime = Math.ceil(sessionInfo.timeUntilNextSession / (1000 * 60));
      await bot.sendMessage(
        chatId,
        `⏰ *Session Limit Reached*\n\n` +
        `You've had enough gaming for now! 🎮\n\n` +
        `Come back in ${waitTime} minutes for your next session.\n\n` +
        `Remember: Real leaders know when to rest! 💪`,
        { parse_mode: 'Markdown' }
      );
      return;
    }

    // Generate mini-app URL
    const miniAppUrl = `${process.env.MINI_APP_URL}?tgWebAppStartParam=${player.referralCode}`;

    // Create engaging play message
    const playMessage = generatePlayMessage(player);

    // Create play keyboard
    const keyboard = [
      [
        {
          text: '🎮 LAUNCH GAME',
          web_app: { url: miniAppUrl },
        },
      ],
      [
        { text: '📊 My Stats', callback_data: 'player_stats' },
        { text: '🎯 Daily Missions', callback_data: 'daily_missions' },
      ],
      [
        { text: '👥 Invite Friends', callback_data: 'invite_friends' },
        { text: '🏆 Leaderboard', callback_data: 'leaderboard' },
      ],
    ];

    await bot.sendMessage(chatId, playMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });

  } catch (error) {
    console.error('Play command error:', error);
    await bot.sendMessage(
      chatId,
      '❌ Unable to launch the game. Please try again later.'
    );
  }
};

const generatePlayMessage = (player: any): string => {
  const displayName = player.displayName || player.username;
  
  let message = `🚀 *Ready to continue your journey, ${displayName}?*\n\n`;
  
  message += `📈 *Your Progress:*\n`;
  message += `⭐ Level ${player.level} ${player.rank.replace('_', ' ')}\n`;
  message += `👥 ${player.supporters} Supporters\n`;
  message += `⚡ ${player.influence} Influence Power\n`;
  message += `💎 ${player.powerTokens} POWER Tokens\n\n`;

  // Add personalized motivation based on player progress
  if (player.level < 10) {
    message += `🌱 *You're just getting started!*\n`;
    message += `Complete missions to grow your movement faster!\n\n`;
  } else if (player.level < 25) {
    message += `🔥 *Your movement is growing!*\n`;
    message += `Time to build your community and unlock new chapters!\n\n`;
  } else if (player.level < 50) {
    message += `👑 *You're becoming influential!*\n`;
    message += `Lead your community to victory and unlock legendary rewards!\n\n`;
  } else {
    message += `🌟 *You're a true leader!*\n`;
    message += `Your legacy inspires thousands. Keep building the future!\n\n`;
  }

  // Add session reminder
  message += `⏰ *Healthy Gaming Reminder:*\n`;
  message += `Sessions are limited to ensure balanced gameplay.\n`;
  message += `Take breaks and return stronger! 💪\n\n`;

  message += `🎮 *Click below to launch the game!*`;

  return message;
};
