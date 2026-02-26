import TelegramBot from 'node-telegram-bot-api';
import { authenticateUser, getReferralStats } from '../utils/auth';
import { generateReferralLink, generateReferralShareMessage, createReferralImage } from '../utils/referral';

export const handleReferralCommand = async (bot: TelegramBot, msg: TelegramBot.Message) => {
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

    // Get referral stats
    const referralStats = await getReferralStats(player.id);

    // Generate referral message
    const referralMessage = generateReferralShareMessage(player);
    const referralLink = generateReferralLink(player);

    // Create referral keyboard
    const keyboard = [
      [
        { text: '📤 Copy Link', callback_data: 'copy_referral_link' },
        { text: '🖼️ Share Image', callback_data: 'share_referral_image' },
      ],
      [
        { text: '📊 Referral Stats', callback_data: 'referral_stats' },
        { text: '🏆 Top Referrers', callback_data: 'top_referrers' },
      ],
      [
        { text: '🎮 Play Game', callback_data: 'play_game' },
      ],
    ];

    // Send referral message
    await bot.sendMessage(chatId, referralMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });

    // Send referral stats if available
    if (referralStats) {
      const statsMessage = generateReferralStatsMessage(referralStats);
      await bot.sendMessage(chatId, statsMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '🎮 Play Now', callback_data: 'play_game' }
          ]],
        },
      });
    }

  } catch (error) {
    console.error('Referral command error:', error);
    await bot.sendMessage(
      chatId,
      '❌ Unable to load referral information. Please try again later.'
    );
  }
};

const generateReferralStatsMessage = (stats: any): string => {
  let message = `📊 *Your Referral Network*\n\n`;
  
  message += `👥 *Total Referrals:* ${stats.totalReferrals}\n`;
  message += `✅ *Active Referrals:* ${stats.activeReferrals}\n`;
  message += `🎯 *Completed Referrals:* ${stats.completedReferrals}\n`;
  message += `⏳ *Pending Referrals:* ${stats.pendingReferrals}\n`;
  message += `💰 *Total Rewards Earned:* ${stats.totalRewards} POWER Tokens\n\n`;

  if (stats.referralTree && stats.referralTree.length > 0) {
    message += `🌳 *Your Network Tree:*\n`;
    stats.referralTree.slice(0, 5).forEach((referral: any, index: number) => {
      const status = referral.isActive ? '✅' : '⏳';
      message += `${status} ${index + 1}. ${referral.displayName} (Level ${referral.level})\n`;
    });
    
    if (stats.referralTree.length > 5) {
      message += `... and ${stats.referralTree.length - 5} more\n`;
    }
  }

  message += `\n🚀 *Keep building your movement!*`;
  
  return message;
};
