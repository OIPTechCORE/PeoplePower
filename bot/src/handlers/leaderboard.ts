import TelegramBot from 'node-telegram-bot-api';
import { authenticateUser, getPlayerStats } from '../utils/auth';

export const handleLeaderboardCommand = async (bot: TelegramBot, msg: TelegramBot.Message) => {
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

    // Get leaderboard data
    const leaderboardData = await getLeaderboardData('global', 'weekly');

    // Generate leaderboard message
    const leaderboardMessage = generateLeaderboardMessage(leaderboardData, playerStats);

    // Create leaderboard keyboard
    const keyboard = [
      [
        { text: '🌍 Global', callback_data: 'leaderboard_global' },
        { text: '🏙️ Regional', callback_data: 'leaderboard_regional' },
      ],
      [
        { text: '🎓 Campus', callback_data: 'leaderboard_campus' },
        { text: '🤝 Community', callback_data: 'leaderboard_community' },
      ],
      [
        { text: '⏰ Daily', callback_data: 'leaderboard_daily' },
        { text: '📅 Weekly', callback_data: 'leaderboard_weekly' },
      ],
      [
        { text: '🎮 Play Game', callback_data: 'play_game' },
        { text: '👤 My Profile', callback_data: 'profile' },
      ],
    ];

    await bot.sendMessage(chatId, leaderboardMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });

  } catch (error) {
    console.error('Leaderboard command error:', error);
    await bot.sendMessage(
      chatId,
      '❌ Unable to load leaderboard. Please try again later.'
    );
  }
};

const generateLeaderboardMessage = (leaderboardData: any, playerStats: any): string => {
  let message = `🏆 *People Power Leaderboard*\n\n`;

  // Add time period indicator
  const period = leaderboardData.period || 'Weekly';
  const type = leaderboardData.type || 'Global';
  message += `📊 ${type} Rankings • ${period}\n\n`;

  // Show top players
  if (leaderboardData.entries && leaderboardData.entries.length > 0) {
    const topPlayers = leaderboardData.entries.slice(0, 10);
    
    topPlayers.forEach((entry: any, index: number) => {
      const rank = index + 1;
      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
      const change = entry.change > 0 ? `📈${entry.change}` : 
                    entry.change < 0 ? `📉${Math.abs(entry.change)}` : '➖';
      
      message += `${medal} ${entry.displayName}\n`;
      message += `   🏆 ${entry.rank.replace('_', ' ')} • ⭐ Lvl ${entry.level || '?'}\n`;
      message += `   👥 ${entry.supporters || '?'} • ⚡ ${entry.score?.toLocaleString() || '?'} ${change}\n\n`;
    });
  }

  // Show player's position
  if (playerStats) {
    message += `━━━━━━━━━━━━━━━━\n\n`;
    message += `👤 *Your Position:*\n`;
    message += `🏆 Rank #${playerStats.rank.toLocaleString()} of ${playerStats.totalPlayers.toLocaleString()}\n`;
    message += `📊 Top ${Math.floor((playerStats.percentile || 0))}%\n\n`;
    
    if (playerStats.rank <= 100) {
      message += `🌟 *Amazing! You're in the top 100!*\n`;
    } else if (playerStats.rank <= 1000) {
      message += `🔥 *Great job! Top 1000 player!*\n`;
    } else if (playerStats.rank <= 10000) {
      message += `💪 *Keep climbing! You're doing well!*\n`;
    } else {
      message += `🚀 *Keep building! Every rank counts!*\n`;
    }
  }

  message += `\n🎮 *Play to climb the ranks!*`;
  
  return message;
};

const getLeaderboardData = async (type: string, period: string): Promise<any> => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/leaderboards/${type}?period=${period}&limit=10`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
    }

    const data = await response.json();
    return data.leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return {
      entries: [],
      type: type.charAt(0).toUpperCase() + type.slice(1),
      period: period.charAt(0).toUpperCase() + period.slice(1),
    };
  }
};
