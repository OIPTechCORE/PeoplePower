import TelegramBot from 'node-telegram-bot-api';
import { authenticateUser } from '../utils/auth';

export const handleMissionCommand = async (bot: TelegramBot, msg: TelegramBot.Message) => {
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

    // Get missions data
    const missionsData = await getMissionsData(player.id);

    // Generate missions message
    const missionsMessage = generateMissionsMessage(missionsData, player);

    // Create missions keyboard
    const keyboard = createMissionsKeyboard(missionsData);

    await bot.sendMessage(chatId, missionsMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });

  } catch (error) {
    console.error('Missions command error:', error);
    await bot.sendMessage(
      chatId,
      '❌ Unable to load missions. Please try again later.'
    );
  }
};

const generateMissionsMessage = (missionsData: any, player: any): string => {
  let message = `🎯 *Daily Missions*\n\n`;

  // Daily missions
  if (missionsData.dailyMissions && missionsData.dailyMissions.length > 0) {
    message += `📅 *Today's Missions:*\n`;
    missionsData.dailyMissions.forEach((mission: any) => {
      const status = mission.isCompleted ? '✅' : '⏳';
      const progress = `${mission.progress}/${mission.maxProgress}`;
      const progressBar = createProgressBar(mission.progress, mission.maxProgress);
      
      message += `${status} ${mission.title}\n`;
      message += `   ${progressBar} ${progress}\n`;
      message += `   🎁 ${mission.rewardDescription}\n\n`;
    });
  }

  // Weekly missions
  if (missionsData.weeklyMissions && missionsData.weeklyMissions.length > 0) {
    message += `📆 *Weekly Challenges:*\n`;
    missionsData.weeklyMissions.slice(0, 3).forEach((mission: any) => {
      const status = mission.isCompleted ? '✅' : '⏳';
      const progress = `${mission.progress}/${mission.maxProgress}`;
      
      message += `${status} ${mission.title}\n`;
      message += `   Progress: ${progress}\n`;
      message += `   🎁 ${mission.rewardDescription}\n\n`;
    });
  }

  // Story missions
  if (missionsData.storyMissions && missionsData.storyMissions.length > 0) {
    message += `📖 *Story Missions:*\n`;
    missionsData.storyMissions.slice(0, 2).forEach((mission: any) => {
      const status = mission.isCompleted ? '✅' : '🔓';
      
      message += `${status} ${mission.title}\n`;
      message += `   ${mission.description}\n`;
      message += `   🎁 ${mission.rewardDescription}\n\n`;
    });
  }

  // Special events
  if (missionsData.specialEvent) {
    const event = missionsData.specialEvent;
    message += `🔥 *LIMITED TIME EVENT:*\n`;
    message += `⚡ ${event.name}\n`;
    message += `📝 ${event.description}\n`;
    message += `⏰ Ends in: ${event.timeLeft}\n`;
    message += `🎁 ${event.rewardDescription}\n\n`;
  }

  // Mission stats
  if (missionsData.stats) {
    const stats = missionsData.stats;
    message += `📊 *Your Mission Stats:*\n`;
    message += `✅ Completed Today: ${stats.completedToday}\n`;
    message += `🎯 Total Completed: ${stats.totalCompleted}\n`;
    message += `🔥 Current Streak: ${stats.currentStreak} days\n`;
    message += `🏆 Best Streak: ${stats.bestStreak} days\n\n`;
  }

  message += `🎮 *Complete missions to earn rewards and progress!*`;
  
  return message;
};

const createMissionsKeyboard = (missionsData: any): any[][] => {
  const keyboard = [];

  // Mission categories
  keyboard.push([
    { text: '📅 Daily', callback_data: 'missions_daily' },
    { text: '📆 Weekly', callback_data: 'missions_weekly' },
    { text: '📖 Story', callback_data: 'missions_story' },
  ]);

  // Special event if available
  if (missionsData.specialEvent) {
    keyboard.push([
      { text: '🔥 Special Event', callback_data: 'special_event' },
    ]);
  }

  // Action buttons
  keyboard.push([
    { text: '🎮 Play Game', callback_data: 'play_game' },
    { text: '🏆 Leaderboard', callback_data: 'leaderboard' },
  ]);

  return keyboard;
};

const createProgressBar = (current: number, total: number): string => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  const filled = Math.round(percentage / 10);
  const empty = 10 - filled;
  
  return '█'.repeat(filled) + '░'.repeat(empty);
};

const getMissionsData = async (playerId: string): Promise<any> => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/players/${playerId}/missions`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch missions data: ${response.statusText}`);
    }

    const data = await response.json();
    return data.missionsData;
  } catch (error) {
    console.error('Error fetching missions data:', error);
    return {
      dailyMissions: [],
      weeklyMissions: [],
      storyMissions: [],
      specialEvent: null,
      stats: {
        completedToday: 0,
        totalCompleted: 0,
        currentStreak: 0,
        bestStreak: 0,
      },
    };
  }
};
