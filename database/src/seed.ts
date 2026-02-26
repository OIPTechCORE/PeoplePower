import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { 
  DAILY_HABITS, 
  COMPETITIONS, 
  STORY_CHAPTERS, 
  MINIGAMES,
  SEASONS,
  EDUCATIONAL_CONTENT
} from '@people-power/shared/content';

dotenv.config();

interface SeedData {
  players: any[];
  communities: any[];
  missions: any[];
  viralEvents: any[];
  leaderboards: any[];
}

class DatabaseSeeder {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'people_power_journey',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
    });
  }

  async connect(): Promise<void> {
    try {
      await this.pool.query('SELECT NOW()');
      console.log('✅ Connected to database for seeding');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  async clearTables(): Promise<void> {
    console.log('🧹 Clearing existing data...');
    
    const tables = [
      'token_transactions',
      'game_sessions',
      'social_shares',
      'emotional_investments',
      'player_competitions',
      'viral_event_participants',
      'leaderboard_entries',
      'community_members',
      'player_missions',
      'player_habit_progress',
      'player_chapter_progress',
      'player_titles',
      'player_badges',
      'referrals',
      'communities',
      'viral_events',
      'leaderboards',
      'missions',
      'competitions',
      'daily_habits',
      'story_scenes',
      'story_choices',
      'story_chapters',
      'players'
    ];

    for (const table of tables) {
      await this.pool.query(`DELETE FROM ${table}`);
      console.log(`  Cleared ${table}`);
    }
  }

  async seedPlayers(): Promise<any[]> {
    console.log('👥 Seeding players...');
    
    const players = [
      {
        telegram_id: 123456789,
        username: 'founder_player',
        display_name: 'Alex Founder',
        avatar_url: 'https://example.com/avatars/alex.jpg',
        level: 15,
        rank: 'MOVEMENT_LEADER',
        experience: 50000,
        influence: 25000,
        supporters: 150,
        power_tokens: 1000,
        total_earned: 2500,
        referral_code: 'ALEX123',
        generation: 'FOUNDERS',
        permanent_bonus: 1.5,
        is_active: true,
        joined_at: new Date('2026-01-01')
      },
      {
        telegram_id: 987654321,
        username: 'community_builder',
        display_name: 'Sam Builder',
        level: 8,
        rank: 'ORGANIZER',
        experience: 15000,
        influence: 8000,
        supporters: 45,
        power_tokens: 350,
        total_earned: 800,
        referral_code: 'SAM456',
        generation: 'BUILDERS',
        permanent_bonus: 1.2,
        is_active: true,
        joined_at: new Date('2026-01-15')
      },
      {
        telegram_id: 555666777,
        username: 'new_supporter',
        display_name: 'Jordan Supporter',
        level: 3,
        rank: 'VOICE_STARTER',
        experience: 2000,
        influence: 800,
        supporters: 12,
        power_tokens: 50,
        total_earned: 120,
        referral_code: 'JORD789',
        generation: 'SUPPORTERS',
        permanent_bonus: 1.0,
        is_active: true,
        joined_at: new Date('2026-02-01')
      }
    ];

    const insertedPlayers = [];
    
    for (const player of players) {
      const result = await this.pool.query(`
        INSERT INTO players (
          telegram_id, username, display_name, avatar_url, level, rank, 
          experience, influence, supporters, power_tokens, total_earned, 
          referral_code, generation, permanent_bonus, is_active, joined_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING id
      `, [
        player.telegram_id, player.username, player.display_name, player.avatar_url,
        player.level, player.rank, player.experience, player.influence, player.supporters,
        player.power_tokens, player.total_earned, player.referral_code, player.generation,
        player.permanent_bonus, player.is_active, player.joined_at
      ]);
      
      insertedPlayers.push({ ...player, id: result.rows[0].id });
      console.log(`  Created player: ${player.display_name}`);
    }

    // Set up referral relationships
    await this.pool.query(`
      INSERT INTO referrals (referrer_id, referred_id, referred_username, status)
      VALUES ($1, $2, $3, 'completed')
    `, [insertedPlayers[0].id, insertedPlayers[1].id, insertedPlayers[1].username]);

    await this.pool.query(`
      INSERT INTO referrals (referrer_id, referred_id, referred_username, status)
      VALUES ($1, $2, $3, 'completed')
    `, [insertedPlayers[1].id, insertedPlayers[2].id, insertedPlayers[2].username]);

    // Update referral counts
    await this.pool.query('UPDATE players SET referrals_count = 1 WHERE id = $1', [insertedPlayers[0].id]);
    await this.pool.query('UPDATE players SET referrals_count = 1 WHERE id = $1', [insertedPlayers[1].id]);

    return insertedPlayers;
  }

  async seedBadges(players: any[]): Promise<void> {
    console.log('🏆 Seeding badges...');
    
    const badges = [
      {
        badge_id: 'founder_badge',
        name: 'Genesis Founder',
        description: 'One of the first players to join the movement',
        icon: 'founder_crown',
        rarity: 'legendary'
      },
      {
        badge_id: 'early_adopter',
        name: 'Early Adopter',
        description: 'Joined during the early phases of the movement',
        icon: 'early_star',
        rarity: 'epic'
      },
      {
        badge_id: 'community_leader',
        name: 'Community Leader',
        description: 'Demonstrated exceptional leadership in community building',
        icon: 'leadership_star',
        rarity: 'rare'
      }
    ];

    // Assign badges to players
    await this.pool.query(`
      INSERT INTO player_badges (player_id, badge_id, name, description, icon, rarity)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [players[0].id, badges[0].badge_id, badges[0].name, badges[0].description, badges[0].icon, badges[0].rarity]);

    await this.pool.query(`
      INSERT INTO player_badges (player_id, badge_id, name, description, icon, rarity)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [players[1].id, badges[1].badge_id, badges[1].name, badges[1].description, badges[1].icon, badges[1].rarity]);

    await this.pool.query(`
      INSERT INTO player_badges (player_id, badge_id, name, description, icon, rarity)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [players[0].id, badges[2].badge_id, badges[2].name, badges[2].description, badges[2].icon, badges[2].rarity]);
  }

  async seedTitles(players: any[]): Promise<void> {
    console.log('👑 Seeding titles...');
    
    const titles = [
      { player_id: players[0].id, title: 'Movement Pioneer' },
      { player_id: players[1].id, title: 'Community Builder' },
      { player_id: players[2].id, title: 'Rising Voice' }
    ];

    for (const title of titles) {
      await this.pool.query(`
        INSERT INTO player_titles (player_id, title)
        VALUES ($1, $2)
      `, [title.player_id, title.title]);
    }
  }

  async seedStoryChapters(): Promise<void> {
    console.log('📖 Seeding story chapters...');
    
    for (const chapter of STORY_CHAPTERS) {
      const result = await this.pool.query(`
        INSERT INTO story_chapters (chapter_id, title, theme, order_index, is_unlocked)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [
        chapter.id,
        chapter.title,
        chapter.theme,
        chapter.order,
        chapter.isUnlocked
      ]);

      const chapterDbId = result.rows[0].id;

      // Seed scenes
      for (const scene of chapter.narrative) {
        const sceneResult = await this.pool.query(`
          INSERT INTO story_scenes (chapter_id, scene_id, order_index, type, content, mini_game_type)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `, [
          chapterDbId,
          scene.id,
          chapter.narrative.indexOf(scene),
          scene.type,
          scene.content,
          scene.miniGameType
        ]);

        // Seed choices if they exist
        if (scene.choices) {
          for (const choice of scene.choices) {
            await this.pool.query(`
              INSERT INTO story_choices (scene_id, choice_id, text, consequence, order_index)
              VALUES ($1, $2, $3, $4, $5)
            `, [
              sceneResult.rows[0].id,
              choice.id,
              choice.text,
              choice.consequence,
              scene.choices!.indexOf(choice)
            ]);
          }
        }
      }
    }
  }

  async seedDailyHabits(): Promise<void> {
    console.log('🌅 Seeding daily habits...');
    
    for (const habit of DAILY_HABITS) {
      await this.pool.query(`
        INSERT INTO daily_habits (
          habit_id, name, category, description, difficulty,
          requirements, rewards, streak_bonus, visual_theme, emotional_impact
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        habit.id,
        habit.name,
        habit.category,
        habit.description,
        habit.difficulty,
        JSON.stringify(habit.requirements),
        JSON.stringify(habit.rewards),
        JSON.stringify(habit.streakBonus),
        JSON.stringify(habit.visualTheme),
        JSON.stringify(habit.emotionalImpact)
      ]);
    }
  }

  async seedCompetitions(): Promise<void> {
    console.log('🏆 Seeding competitions...');
    
    for (const competition of COMPETITIONS) {
      await this.pool.query(`
        INSERT INTO competitions (
          competition_id, name, type, category, difficulty,
          duration_type, duration_hours, requirements, rewards, mechanics
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        competition.id,
        competition.name,
        competition.type,
        competition.category,
        competition.difficulty,
        competition.duration.type,
        competition.duration.hours || 24,
        JSON.stringify(competition.requirements),
        JSON.stringify(competition.rewards),
        JSON.stringify(competition.mechanics)
      ]);
    }
  }

  async seedMissions(): Promise<void> {
    console.log('🎯 Seeding missions...');
    
    const missions = [
      {
        mission_id: 'daily_tap_session',
        title: 'Daily Tap Session',
        description: 'Complete 100 taps to build influence',
        type: 'DAILY_TAP',
        category: 'daily',
        requirements: JSON.stringify([{ type: 'level', value: 1, operator: 'gte' }]),
        rewards: JSON.stringify([
          { type: 'influence', value: 50 },
          { type: 'experience', value: 25 }
        ]),
        max_progress: 100,
        reset_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        mission_id: 'recruit_first_supporter',
        title: 'Recruit First Supporter',
        description: 'Recruit your first supporter to the movement',
        type: 'RECRUIT_SUPPORTERS',
        category: 'story',
        requirements: JSON.stringify([{ type: 'level', value: 2, operator: 'gte' }]),
        rewards: JSON.stringify([
          { type: 'supporters', value: 1 },
          { type: 'power_tokens', value: 10 }
        ]),
        max_progress: 1
      },
      {
        mission_id: 'complete_educational_content',
        title: 'Learn Leadership Basics',
        description: 'Complete your first educational module',
        type: 'WATCH_EDUCATIONAL',
        category: 'weekly',
        requirements: JSON.stringify([{ type: 'level', value: 3, operator: 'gte' }]),
        rewards: JSON.stringify([
          { type: 'experience', value: 100 },
          { type: 'influence', value: 75 }
        ]),
        max_progress: 1,
        reset_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ];

    for (const mission of missions) {
      await this.pool.query(`
        INSERT INTO missions (
          mission_id, title, description, type, category,
          requirements, rewards, max_progress, reset_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        mission.mission_id,
        mission.title,
        mission.description,
        mission.type,
        mission.category,
        mission.requirements,
        mission.rewards,
        mission.max_progress,
        mission.reset_at
      ]);
    }
  }

  async seedCommunities(players: any[]): Promise<void> {
    console.log('🏘️ Seeding communities...');
    
    const communities = [
      {
        name: 'African Youth Leaders',
        description: 'A community dedicated to empowering young African leaders',
        leader_id: players[0].id,
        is_public: true,
        join_code: 'AFRICA2026',
        required_level: 5
      },
      {
        name: 'Community Builders Alliance',
        description: 'Building stronger communities through collaboration',
        leader_id: players[1].id,
        is_public: true,
        join_code: 'BUILD2026',
        required_level: 3
      }
    ];

    for (const community of communities) {
      const result = await this.pool.query(`
        INSERT INTO communities (name, description, leader_id, is_public, join_code, required_level)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `, [
        community.name,
        community.description,
        community.leader_id,
        community.is_public,
        community.join_code,
        community.required_level
      ]);

      const communityId = result.rows[0].id;

      // Add leader as member
      await this.pool.query(`
        INSERT INTO community_members (community_id, player_id, role)
        VALUES ($1, $2, 'leader')
      `, [communityId, community.leader_id]);

      // Add other players as members
      for (const player of players) {
        if (player.id !== community.leader_id) {
          await this.pool.query(`
            INSERT INTO community_members (community_id, player_id, role)
            VALUES ($1, $2, 'member')
          `, [communityId, player.id]);
        }
      }

      // Update player community references
      await this.pool.query('UPDATE players SET community_id = $1 WHERE id = $2', [communityId, community.leader_id]);
    }
  }

  async seedViralEvents(): Promise<void> {
    console.log('🔥 Seeding viral events...');
    
    const events = [
      {
        event_id: 'founder_bonanza',
        name: 'Founder Era Bonanza',
        description: 'Double rewards for all founders during this limited time event',
        type: 'limited_time',
        starts_at: new Date(),
        ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        requirements: JSON.stringify([{ type: 'generation', value: 'FOUNDERS' }]),
        rewards: JSON.stringify([
          { type: 'power_tokens', value: 500 },
          { type: 'experience', value: 1000 }
        ])
      },
      {
        event_id: 'community_challenge_week',
        name: 'Community Challenge Week',
        description: 'Extra rewards for community activities',
        type: 'double_rewards',
        starts_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        ends_at: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        requirements: JSON.stringify([{ type: 'community_id', value: 'any' }]),
        rewards: JSON.stringify([
          { type: 'influence', value: 200 },
          { type: 'supporters', value: 5 }
        ])
      }
    ];

    for (const event of events) {
      await this.pool.query(`
        INSERT INTO viral_events (
          event_id, name, description, type, starts_at, ends_at, requirements, rewards
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        event.event_id,
        event.name,
        event.description,
        event.type,
        event.starts_at,
        event.ends_at,
        event.requirements,
        event.rewards
      ]);
    }
  }

  async seedLeaderboards(): Promise<void> {
    console.log('📊 Seeding leaderboards...');
    
    const leaderboards = [
      {
        name: 'Global Influence Leaders',
        type: 'global',
        period: 'weekly',
        starts_at: new Date(),
        ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        resets_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'Daily Tap Champions',
        type: 'global',
        period: 'daily',
        starts_at: new Date(),
        ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        resets_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        name: 'Community Builders',
        type: 'community',
        period: 'weekly',
        starts_at: new Date(),
        ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        resets_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ];

    for (const leaderboard of leaderboards) {
      await this.pool.query(`
        INSERT INTO leaderboards (name, type, period, starts_at, ends_at, resets_at)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        leaderboard.name,
        leaderboard.type,
        leaderboard.period,
        leaderboard.starts_at,
        leaderboard.ends_at,
        leaderboard.resets_at
      ]);
    }
  }

  async seedEconomyState(): Promise<void> {
    console.log('💰 Seeding economy state...');
    
    await this.pool.query(`
      INSERT INTO economy_state (
        date, total_players, active_players, total_tokens_minted, 
        total_tokens_burned, circulating_supply
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      new Date().toISOString().split('T')[0],
      3,
      3,
      1400,
      0,
      1400
    ]);
  }

  async seedImpactMetrics(): Promise<void> {
    console.log('📈 Seeding impact metrics...');
    
    await this.pool.query(`
      INSERT INTO impact_metrics (
        date, active_users, new_users, missions_completed, 
        learning_sessions_completed, communities_formed
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      new Date().toISOString().split('T')[0],
      3,
      3,
      15,
      8,
      2
    ]);
  }

  async seedPlayerProgress(players: any[]): Promise<void> {
    console.log('📈 Seeding player progress...');
    
    // Seed mission progress
    await this.pool.query(`
      INSERT INTO player_missions (player_id, mission_id, progress, is_completed)
      VALUES ($1, $2, $3, $4)
    `, [players[0].id, 'daily_tap_session', 100, true]);

    await this.pool.query(`
      INSERT INTO player_missions (player_id, mission_id, progress, is_completed)
      VALUES ($1, $2, $3, $4)
    `, [players[1].id, 'recruit_first_supporter', 1, true]);

    // Seed habit progress
    await this.pool.query(`
      INSERT INTO player_habit_progress (player_id, habit_id, current_streak, longest_streak, total_completed, last_completed_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [players[0].id, 'morning_checkin', 7, 14, 45, new Date()]);

    // Seed game sessions
    await this.pool.query(`
      INSERT INTO game_sessions (player_id, session_duration, influence_gained, missions_completed, tokens_earned)
      VALUES ($1, $2, $3, $4, $5)
    `, [players[0].id, 1800, 250, 3, 50]);

    // Seed token transactions
    await this.pool.query(`
      INSERT INTO token_transactions (player_id, type, amount, source, description)
      VALUES ($1, $2, $3, $4, $5)
    `, [players[0].id, 'earned', 50, 'daily_tap_session', 'Daily tap rewards']);
  }

  async seedAll(): Promise<void> {
    console.log('🌱 Starting database seeding...');
    
    await this.connect();
    
    try {
      await this.clearTables();
      
      const players = await this.seedPlayers();
      await this.seedBadges(players);
      await this.seedTitles(players);
      await this.seedStoryChapters();
      await this.seedDailyHabits();
      await this.seedCompetitions();
      await this.seedMissions();
      await this.seedCommunities(players);
      await this.seedViralEvents();
      await this.seedLeaderboards();
      await this.seedEconomyState();
      await this.seedImpactMetrics();
      await this.seedPlayerProgress(players);
      
      console.log('🎉 Database seeding completed successfully!');
      console.log(`📊 Summary: ${players.length} players seeded with full game data`);
      
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
    console.log('🔌 Database connection closed');
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  
  const seeder = new DatabaseSeeder();
  
  try {
    switch (command) {
      case 'all':
        await seeder.seedAll();
        break;
        
      case 'players':
        await seeder.connect();
        await seeder.seedPlayers();
        break;
        
      case 'content':
        await seeder.connect();
        await seeder.seedStoryChapters();
        await seeder.seedDailyHabits();
        await seeder.seedCompetitions();
        await seeder.seedMissions();
        break;
        
      case 'clear':
        await seeder.connect();
        await seeder.clearTables();
        console.log('✅ All tables cleared');
        break;
        
      default:
        console.log(`
🌱 Database Seeding CLI

Usage: npm run db:seed <command>

Commands:
  all              Seed all data (clears existing data first)
  players          Seed only test players
  content          Seed only game content (chapters, habits, competitions, missions)
  clear            Clear all data from tables

Examples:
  npm run db:seed all
  npm run db:seed players
  npm run db:seed content
  npm run db:seed clear
        `);
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await seeder.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export default DatabaseSeeder;
