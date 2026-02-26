import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { handleStartCommand } from './handlers/start';
import { handlePlayCommand } from './handlers/play';
import { handleReferralCommand } from './handlers/referral';
import { handleLeaderboardCommand } from './handlers/leaderboard';
import { handleCommunityCommand } from './handlers/community';
import { handleMissionCommand } from './handlers/missions';
import { handleProfileCommand } from './handlers/profile';
import { handleCallbackQuery } from './handlers/callbacks';
import { verifyTelegramInitData } from './utils/auth';
import { Player, TelegramUser } from '@people-power/shared';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = process.env.API_URL || 'http://localhost:3001';

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN environment variable is required');
}

// Initialize Telegram bot
export const bot = new TelegramBot(BOT_TOKEN, {
  polling: true,
  webHook: false,
});

// Bot state management
const userSessions = new Map<number, {
  lastActivity: Date;
  gameState?: any;
  referralCode?: string;
}>();

// Middleware for user authentication
const authenticateUser = async (msg: TelegramBot.Message): Promise<Player | null> => {
  try {
    if (!msg.from) return null;
    
    const response = await fetch(`${API_URL}/api/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramUser: msg.from }),
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.player;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

// Update user session activity
const updateSession = (userId: number) => {
  const session = userSessions.get(userId) || { lastActivity: new Date() };
  session.lastActivity = new Date();
  userSessions.set(userId, session);
};

// Main command handlers
bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
  updateSession(msg.from?.id || 0);
  await handleStartCommand(bot, msg, match?.[1]);
});

bot.onText(/\/play/, async (msg) => {
  updateSession(msg.from?.id || 0);
  await handlePlayCommand(bot, msg);
});

bot.onText(/\/invite/, async (msg) => {
  updateSession(msg.from?.id || 0);
  await handleReferralCommand(bot, msg);
});

bot.onText(/\/leaderboard/, async (msg) => {
  updateSession(msg.from?.id || 0);
  await handleLeaderboardCommand(bot, msg);
});

bot.onText(/\/community/, async (msg) => {
  updateSession(msg.from?.id || 0);
  await handleCommunityCommand(bot, msg);
});

bot.onText(/\/missions/, async (msg) => {
  updateSession(msg.from?.id || 0);
  await handleMissionCommand(bot, msg);
});

bot.onText(/\/profile/, async (msg) => {
  updateSession(msg.from?.id || 0);
  await handleProfileCommand(bot, msg);
});

// Handle callback queries (inline keyboard interactions)
bot.on('callback_query', async (callbackQuery) => {
  updateSession(callbackQuery.from.id);
  await handleCallbackQuery(bot, callbackQuery);
});

// Handle inline queries (for sharing features)
bot.on('inline_query', async (inlineQuery) => {
  try {
    const player = await authenticateUser({ from: inlineQuery.from } as any);
    if (!player) return;

    const results = [
      {
        type: 'article',
        id: 'share_profile',
        title: '🔥 Join My Movement!',
        description: `Level ${player.level} ${player.rank} - ${player.supporters} supporters`,
        input_message_content: {
          message_text: `🔥 *People Power: The Journey*\n\n` +
            `👤 ${player.displayName}\n` +
            `🏆 Rank: ${player.rank}\n` +
            `⭐ Level: ${player.level}\n` +
            `👥 Supporters: ${player.supporters}\n` +
            `⚡ Influence: ${player.influence}\n\n` +
            `🚀 Join before Founder phase ends:\n` +
            `https://t.me/${bot.options.username}?start=${player.referralCode}`,
          parse_mode: 'Markdown',
        },
        reply_markup: {
          inline_keyboard: [[
            { text: '🎮 Play Now', url: `https://t.me/${bot.options.username}?start=${player.referralCode}` }
          ]],
        },
      },
    ];

    await bot.answerInlineQuery(inlineQuery.id, results);
  } catch (error) {
    console.error('Inline query error:', error);
  }
});

// Handle errors
bot.on('polling_error', (error) => {
  console.error('Telegram polling error:', error);
});

bot.on('error', (error) => {
  console.error('Telegram bot error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down bot...');
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down bot...');
  bot.stopPolling();
  process.exit(0);
});

// Start the bot
console.log('🤖 People Power Bot started successfully!');
console.log(`📱 Bot username: @${bot.options.username}`);
console.log(`🔗 API URL: ${API_URL}`);

// Health check endpoint (if needed)
export const healthCheck = () => ({
  status: 'healthy',
  uptime: process.uptime(),
  activeUsers: userSessions.size,
  timestamp: new Date().toISOString(),
});
