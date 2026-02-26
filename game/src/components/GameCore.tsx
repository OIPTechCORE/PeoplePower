// ========================================
// GAME CORE - PEOPLE POWER: THE JOURNEY
// Viral Telegram Mini-App Game Mechanics
// ========================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TelegramWebApp } from '../types/telegram';
import { GameState, Player, Mission, StoryChapter, Community } from '../types/game';
import { GameAPI } from '../services/GameAPI';
import { ViralMechanics } from '../services/ViralMechanics';
import { RetentionEngine } from '../services/RetentionEngine';
import { AddictionSafeFramework } from '../services/AddictionSafeFramework';

interface GameCoreProps {
  telegramApp: TelegramWebApp;
  initialPlayer: Player;
}

export const GameCore: React.FC<GameCoreProps> = ({ telegramApp, initialPlayer }) => {
  // Game State Management
  const [gameState, setGameState] = useState<GameState>({
    player: initialPlayer,
    currentScreen: 'home',
    supporters: 0,
    influence: 0,
    powerTokens: 0,
    level: 1,
    experience: 0,
    dailyStreak: 0,
    lastPlayTime: new Date(),
    community: null,
    missions: [],
    storyProgress: 0,
    season: 1,
    achievements: [],
    notifications: []
  });

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState<any>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<StoryChapter | null>(null);

  // Services
  const gameAPI = useRef(new GameAPI(telegramApp.initData));
  const viralMechanics = useRef(new ViralMechanics());
  const retentionEngine = useRef(new RetentionEngine());
  const addictionSafe = useRef(new AddictionSafeFramework());

  // Initialize Game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      setIsLoading(true);
      
      // Load player data
      const playerData = await gameAPI.current.getPlayerData(initialPlayer.id);
      if (playerData) {
        setGameState(prev => ({ ...prev, ...playerData }));
      }

      // Initialize viral mechanics
      await viralMechanics.current.initialize(initialPlayer.id);
      
      // Initialize retention engine
      await retentionEngine.current.initialize(initialPlayer.id);
      
      // Initialize addiction-safe framework
      await addictionSafe.current.initialize(initialPlayer.id);

      // Check for returning player bonuses
      await checkReturningPlayerBonus();

      setIsLoading(false);
    } catch (error) {
      console.error('Game initialization failed:', error);
      setIsLoading(false);
    }
  };

  const checkReturningPlayerBonus = async () => {
    const lastPlay = new Date(gameState.lastPlayTime);
    const now = new Date();
    const daysSinceLastPlay = Math.floor((now.getTime() - lastPlay.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastPlay >= 1 && daysSinceLastPlay <= 7) {
      const comebackBonus = await gameAPI.current.calculateComebackBonus(daysSinceLastPlay);
      if (comebackBonus > 0) {
        setRewardData({
          type: 'comeback',
          amount: comebackBonus,
          message: `Welcome back! You missed us for ${daysSinceLastPlay} days. Here's ${comebackBonus} bonus Influence!`
        });
        setShowReward(true);
        
        // Update player state
        setGameState(prev => ({
          ...prev,
          influence: prev.influence + comebackBonus,
          lastPlayTime: now
        }));
      }
    }
  };

  // Core Game Loop - Tap to Gain Influence
  const handleTap = useCallback(async () => {
    // Check addiction-safe limits
    const sessionData = await addictionSafe.current.checkSessionLimits();
    if (!sessionData.canContinue) {
      setRewardData({
        type: 'session_limit',
        amount: 0,
        message: sessionData.message
      });
      setShowReward(true);
      return;
    }

    // Calculate tap rewards
    const baseReward = 1;
    const levelMultiplier = 1 + (gameState.level - 1) * 0.1;
    const supporterBonus = Math.floor(gameState.supporters / 10) * 0.5;
    const totalReward = Math.floor(baseReward * levelMultiplier * (1 + supporterBonus));

    // Apply viral mechanics
    const viralBonus = await viralMechanics.current.calculateVariableReward('tap');
    const finalReward = totalReward + viralBonus;

    // Update game state
    setGameState(prev => ({
      ...prev,
      influence: prev.influence + finalReward,
      experience: prev.experience + 1
    }));

    // Check for level up
    await checkLevelUp();

    // Check for viral events
    await checkViralEvents();

    // Track session
    await addictionSafe.current.trackAction('tap', finalReward);
  }, [gameState.level, gameState.supporters]);

  const checkLevelUp = async () => {
    const experienceNeeded = gameState.level * 100;
    if (gameState.experience >= experienceNeeded) {
      const newLevel = gameState.level + 1;
      const levelUpRewards = await gameAPI.current.getLevelUpRewards(newLevel);
      
      setGameState(prev => ({
        ...prev,
        level: newLevel,
        experience: prev.experience - experienceNeeded,
        powerTokens: prev.powerTokens + (levelUpRewards.tokens || 0)
      }));

      setRewardData({
        type: 'level_up',
        amount: levelUpRewards.tokens || 0,
        message: `Level ${newLevel}! You've earned ${levelUpRewards.tokens || 0} Power Tokens!`
      });
      setShowReward(true);

      // Check for new rank/title
      await checkRankUpgrade(newLevel);
    }
  };

  const checkRankUpgrade = async (level: number) => {
    const ranks = [
      { level: 1, title: 'Youth Voice', icon: '🗣️' },
      { level: 5, title: 'Organizer', icon: '📋' },
      { level: 10, title: 'Community Leader', icon: '👥' },
      { level: 20, title: 'Influencer', icon: '🌟' },
      { level: 30, title: 'Movement Leader', icon: '🏆' },
      { level: 50, title: 'Legend', icon: '👑' }
    ];

    const newRank = ranks.find(r => r.level === level);
    if (newRank) {
      setRewardData({
        type: 'rank_upgrade',
        amount: 0,
        message: `${newRank.icon} New Rank: ${newRank.title}!`,
        rank: newRank
      });
      setShowReward(true);

      // Share rank upgrade (viral mechanic)
      await viralMechanics.current.shareAchievement('rank', newRank);
    }
  };

  const checkViralEvents = async () => {
    const viralEvent = await viralMechanics.current.checkRandomEvents();
    if (viralEvent) {
      setRewardData({
        type: 'viral_event',
        amount: viralEvent.reward,
        message: viralEvent.message
      });
      setShowReward(true);
    }
  };

  // Mission System
  const startMission = async (mission: Mission) => {
    setSelectedMission(mission);
    setShowMissionModal(true);
  };

  const completeMission = async () => {
    if (!selectedMission) return;

    setIsLoading(true);
    try {
      const result = await gameAPI.current.completeMission(selectedMission.id, gameState.player.id);
      
      if (result.success) {
        setGameState(prev => ({
          ...prev,
          influence: prev.influence + result.rewards.influence,
          powerTokens: prev.powerTokens + result.rewards.tokens,
          experience: prev.experience + result.rewards.experience,
          missions: prev.missions.filter(m => m.id !== selectedMission.id)
        }));

        setRewardData({
          type: 'mission_complete',
          amount: result.rewards.tokens,
          message: `Mission Complete! Earned ${result.rewards.influence} Influence and ${result.rewards.tokens} Power Tokens!`
        });
        setShowReward(true);
        setShowMissionModal(false);
        setSelectedMission(null);
      }
    } catch (error) {
      console.error('Mission completion failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Story System
  const startStoryChapter = async (chapter: StoryChapter) => {
    setCurrentChapter(chapter);
    setShowStoryModal(true);
  };

  const completeStoryChapter = async () => {
    if (!currentChapter) return;

    setIsLoading(true);
    try {
      const result = await gameAPI.current.completeStoryChapter(currentChapter.id, gameState.player.id);
      
      if (result.success) {
        setGameState(prev => ({
          ...prev,
          storyProgress: prev.storyProgress + 1,
          influence: prev.influence + result.rewards.influence,
          powerTokens: prev.powerTokens + result.rewards.tokens,
          experience: prev.experience + result.rewards.experience
        }));

        setRewardData({
          type: 'story_complete',
          amount: result.rewards.tokens,
          message: `Chapter Complete! "${currentChapter.title}" - Earned ${result.rewards.influence} Influence!`
        });
        setShowReward(true);
        setShowStoryModal(false);
        setCurrentChapter(null);
      }
    } catch (error) {
      console.error('Story chapter completion failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Community System
  const joinCommunity = async (communityId: string) => {
    setIsLoading(true);
    try {
      const result = await gameAPI.current.joinCommunity(communityId, gameState.player.id);
      
      if (result.success) {
        setGameState(prev => ({
          ...prev,
          community: result.community
        }));

        setRewardData({
          type: 'community_join',
          amount: 0,
          message: `Welcome to ${result.community.name}!`
        });
        setShowReward(true);
      }
    } catch (error) {
      console.error('Community join failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Invite System (Viral Growth)
  const handleInvite = async () => {
    const inviteLink = await viralMechanics.current.generateInviteLink(gameState.player.id);
    
    if (telegramApp.openTelegramLink) {
      telegramApp.openTelegramLink(inviteLink);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(inviteLink);
      setRewardData({
        type: 'invite_link',
        amount: 0,
        message: 'Invite link copied to clipboard! Share with friends to earn bonuses!'
      });
      setShowReward(true);
    }
  };

  // Daily Rewards
  const claimDailyReward = async () => {
    const today = new Date().toDateString();
    const lastClaim = new Date(gameState.lastPlayTime).toDateString();
    
    if (today === lastClaim) {
      setRewardData({
        type: 'error',
        amount: 0,
        message: 'Daily reward already claimed today!'
      });
      setShowReward(true);
      return;
    }

    setIsLoading(true);
    try {
      const reward = await gameAPI.current.claimDailyReward(gameState.player.id);
      
      setGameState(prev => ({
        ...prev,
        influence: prev.influence + reward.influence,
        powerTokens: prev.powerTokens + reward.tokens,
        dailyStreak: prev.dailyStreak + 1,
        lastPlayTime: new Date()
      }));

      setRewardData({
        type: 'daily_reward',
        amount: reward.tokens,
        message: `Daily Reward! Day ${gameState.dailyStreak + 1} - ${reward.influence} Influence, ${reward.tokens} Power Tokens!`
      });
      setShowReward(true);
    } catch (error) {
      console.error('Daily reward claim failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Passive Income from Supporters
  useEffect(() => {
    const interval = setInterval(async () => {
      if (gameState.supporters > 0) {
        const passiveIncome = Math.floor(gameState.supporters * 0.1);
        setGameState(prev => ({
          ...prev,
          influence: prev.influence + passiveIncome
        }));
      }
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, [gameState.supporters]);

  // Unlock Supporters with Influence
  useEffect(() => {
    const supportersNeeded = gameState.level * 10;
    if (gameState.influence >= supportersNeeded && gameState.supporters < gameState.level * 5) {
      setGameState(prev => ({
        ...prev,
        supporters: prev.supporters + 1,
        influence: prev.influence - supportersNeeded
      }));

      setRewardData({
        type: 'supporter_unlock',
        amount: 0,
        message: `New Supporter Joined! Total: ${gameState.supporters + 1}`
      });
      setShowReward(true);
    }
  }, [gameState.influence, gameState.level, gameState.supporters]);

  // Render Main Game UI
  const renderHomeScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="game-container"
    >
      {/* Header */}
      <div className="game-header">
        <div className="player-info">
          <div className="player-rank">
            <span className="rank-icon">🗣️</span>
            <span className="rank-title">Youth Voice</span>
          </div>
          <div className="player-level">Level {gameState.level}</div>
        </div>
        
        <div className="resources">
          <div className="resource">
            <span className="resource-icon">⭐</span>
            <span className="resource-value">{gameState.influence.toLocaleString()}</span>
          </div>
          <div className="resource">
            <span className="resource-icon">💎</span>
            <span className="resource-value">{gameState.powerTokens.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="game-main">
        {/* Tap Area */}
        <motion.div
          className="tap-area"
          whileTap={{ scale: 0.95 }}
          onClick={handleTap}
        >
          <div className="tap-button">
            <span className="tap-icon">👆</span>
            <span className="tap-text">TAP TO GAIN INFLUENCE</span>
          </div>
          
          {/* Influence Progress */}
          <div className="influence-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(gameState.experience / (gameState.level * 100)) * 100}%` }}
              />
            </div>
            <span className="progress-text">
              {gameState.experience}/{gameState.level * 100} XP
            </span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{gameState.supporters}</div>
            <div className="stat-label">Supporters</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📖</div>
            <div className="stat-value">{gameState.storyProgress}</div>
            <div className="stat-label">Chapters</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-value">{gameState.dailyStreak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-value">{gameState.achievements.length}</div>
            <div className="stat-label">Achievements</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-btn primary" onClick={claimDailyReward}>
            🎁 Daily Reward
          </button>
          
          <button className="action-btn secondary" onClick={() => setShowMissionModal(true)}>
            🎯 Missions
          </button>
          
          <button className="action-btn secondary" onClick={() => setShowStoryModal(true)}>
            📖 Story
          </button>
          
          <button className="action-btn secondary" onClick={handleInvite}>
            🤝 Invite Friends
          </button>
        </div>

        {/* Community Section */}
        {gameState.community ? (
          <div className="community-section">
            <h3>🏛️ {gameState.community.name}</h3>
            <div className="community-stats">
              <span>Members: {gameState.community.memberCount}</span>
              <span>Rank: #{gameState.community.rank}</span>
            </div>
          </div>
        ) : (
          <div className="community-section">
            <h3>🏛️ Join a Community</h3>
            <button className="community-btn">
              Find Communities
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );

  // Render Mission Modal
  const renderMissionModal = () => (
    <AnimatePresence>
      {showMissionModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={() => setShowMissionModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>🎯 Missions</h2>
            
            <div className="missions-list">
              {gameState.missions.map(mission => (
                <div key={mission.id} className="mission-card">
                  <div className="mission-info">
                    <h3>{mission.title}</h3>
                    <p>{mission.description}</p>
                    <div className="mission-rewards">
                      <span>⭐ {mission.rewards.influence}</span>
                      <span>💎 {mission.rewards.tokens}</span>
                    </div>
                  </div>
                  <button 
                    className="mission-btn"
                    onClick={() => startMission(mission)}
                    disabled={isLoading}
                  >
                    Start
                  </button>
                </div>
              ))}
            </div>
            
            <button className="close-btn" onClick={() => setShowMissionModal(false)}>
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render Story Modal
  const renderStoryModal = () => (
    <AnimatePresence>
      {showStoryModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={() => setShowStoryModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>📖 The Journey</h2>
            
            <div className="story-chapters">
              {/* Story chapters would be loaded from API */}
              <div className="chapter-card">
                <h3>Chapter 1: Ghetto Roots</h3>
                <p>Begin your journey from humble beginnings...</p>
                <button className="chapter-btn" onClick={() => startStoryChapter({
                  id: 1,
                  title: "Ghetto Roots",
                  content: "Your story begins in the streets...",
                  rewards: { influence: 50, tokens: 5 }
                })}>
                  Start Chapter
                </button>
              </div>
            </div>
            
            <button className="close-btn" onClick={() => setShowStoryModal(false)}>
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render Reward Modal
  const renderRewardModal = () => (
    <AnimatePresence>
      {showReward && rewardData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={() => setShowReward(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="reward-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="reward-icon">
              {rewardData.type === 'level_up' && '🎉'}
              {rewardData.type === 'rank_upgrade' && '🏆'}
              {rewardData.type === 'mission_complete' && '✅'}
              {rewardData.type === 'daily_reward' && '🎁'}
              {rewardData.type === 'viral_event' && '🔥'}
              {rewardData.type === 'supporter_unlock' && '👥'}
              {rewardData.type === 'comeback' && '👋'}
            </div>
            
            <h3>{rewardData.message}</h3>
            
            {rewardData.amount > 0 && (
              <div className="reward-amount">
                <span className="token-icon">💎</span>
                <span className="token-value">+{rewardData.amount}</span>
              </div>
            )}
            
            <button className="reward-btn" onClick={() => setShowReward(false)}>
              Awesome!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Loading Screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">🔄</div>
        <p>Loading People Power...</p>
      </div>
    );
  }

  return (
    <div className="game-app">
      {renderHomeScreen()}
      {renderMissionModal()}
      {renderStoryModal()}
      {renderRewardModal()}
    </div>
  );
};
