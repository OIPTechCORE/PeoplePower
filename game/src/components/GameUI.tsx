// ========================================
// GAME UI COMPONENTS
// Telegram Mini-App Interface Components
// ========================================

import React from 'react';
import { motion } from 'framer-motion';
import { Player, Mission, Community, Achievement } from '../types/game';

// UI Components
export const GameHeader: React.FC<{ player: Player; onMenuClick: () => void }> = ({ player, onMenuClick }) => (
  <motion.header 
    className="game-header"
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="header-left">
      <button className="menu-btn" onClick={onMenuClick}>
        ☰
      </button>
      <div className="player-info">
        <div className="player-name">{player.firstName}</div>
        <div className="player-rank">{player.rank}</div>
      </div>
    </div>
    
    <div className="header-center">
      <div className="level-badge">
        <span className="level-number">{player.level}</span>
        <span className="level-label">LEVEL</span>
      </div>
    </div>
    
    <div className="header-right">
      <div className="resources">
        <div className="resource-item">
          <span className="resource-icon">⭐</span>
          <span className="resource-value">{player.influence.toLocaleString()}</span>
        </div>
        <div className="resource-item">
          <span className="resource-icon">💎</span>
          <span className="resource-value">{player.powerTokens.toLocaleString()}</span>
        </div>
      </div>
    </div>
  </motion.header>
);

export const TapArea: React.FC<{ onTap: () => void; influence: number; level: number }> = ({ onTap, influence, level }) => (
  <motion.div 
    className="tap-area"
    whileTap={{ scale: 0.95 }}
    onClick={onTap}
  >
    <div className="tap-button">
      <motion.div 
        className="tap-icon"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        👆
      </motion.div>
      <div className="tap-text">TAP TO GAIN INFLUENCE</div>
      <div className="tap-subtitle">Build Your Movement</div>
    </div>
    
    <div className="influence-display">
      <div className="influence-amount">{influence.toLocaleString()}</div>
      <div className="influence-label">INFLUENCE</div>
    </div>
    
    <div className="level-progress">
      <div className="progress-bar">
        <motion.div 
          className="progress-fill"
          initial={{ width: '0%' }}
          animate={{ width: `${(level % 10) * 10}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="progress-text">Level {level}</div>
    </div>
  </motion.div>
);

export const StatsGrid: React.FC<{ 
  supporters: number; 
  storyProgress: number; 
  dailyStreak: number; 
  achievements: number;
}> = ({ supporters, storyProgress, dailyStreak, achievements }) => (
  <div className="stats-grid">
    <motion.div 
      className="stat-card supporters"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="stat-icon">👥</div>
      <div className="stat-value">{supporters.toLocaleString()}</div>
      <div className="stat-label">Supporters</div>
      <div className="stat-change">+12 today</div>
    </motion.div>
    
    <motion.div 
      className="stat-card story"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="stat-icon">📖</div>
      <div className="stat-value">{storyProgress}</div>
      <div className="stat-label">Chapters</div>
      <div className="stat-change">Chapter {storyProgress + 1} unlocked</div>
    </motion.div>
    
    <motion.div 
      className="stat-card streak"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="stat-icon">🔥</div>
      <div className="stat-value">{dailyStreak}</div>
      <div className="stat-label">Day Streak</div>
      <div className="stat-change">Keep it going!</div>
    </motion.div>
    
    <motion.div 
      className="stat-card achievements"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="stat-icon">🏆</div>
      <div className="stat-value">{achievements}</div>
      <div className="stat-label">Achievements</div>
      <div className="stat-change">New badge available</div>
    </motion.div>
  </div>
);

export const ActionButtons: React.FC<{
  onDailyReward: () => void;
  onMissions: () => void;
  onStory: () => void;
  onInvite: () => void;
}> = ({ onDailyReward, onMissions, onStory, onInvite }) => (
  <div className="action-buttons">
    <motion.button
      className="action-btn primary daily-reward"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onDailyReward}
    >
      <span className="btn-icon">🎁</span>
      <span className="btn-text">Daily Reward</span>
      <span className="btn-badge">NEW</span>
    </motion.button>
    
    <motion.button
      className="action-btn secondary missions"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onMissions}
    >
      <span className="btn-icon">🎯</span>
      <span className="btn-text">Missions</span>
    </motion.button>
    
    <motion.button
      className="action-btn secondary story"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onStory}
    >
      <span className="btn-icon">📖</span>
      <span className="btn-text">Story</span>
    </motion.button>
    
    <motion.button
      className="action-btn secondary invite"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onInvite}
    >
      <span className="btn-icon">🤝</span>
      <span className="btn-text">Invite Friends</span>
      <span className="btn-badge">+50</span>
    </motion.button>
  </div>
);

export const CommunitySection: React.FC<{
  community: Community | null;
  onJoinCommunity: () => void;
}> = ({ community, onJoinCommunity }) => (
  <motion.div 
    className="community-section"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
  >
    {community ? (
      <div className="community-active">
        <div className="community-header">
          <h3>🏛️ {community.name}</h3>
          <div className="community-badge">Member</div>
        </div>
        
        <div className="community-stats">
          <div className="community-stat">
            <span className="stat-label">Members</span>
            <span className="stat-value">{community.memberCount.toLocaleString()}</span>
          </div>
          <div className="community-stat">
            <span className="stat-label">Rank</span>
            <span className="stat-value">#{community.rank}</span>
          </div>
          <div className="community-stat">
            <span className="stat-label">Level</span>
            <span className="stat-value">{community.level}</span>
          </div>
        </div>
        
        <div className="community-treasury">
          <div className="treasury-label">Community Treasury</div>
          <div className="treasury-amount">
            <span className="treasury-icon">⭐</span>
            {community.treasury.influence.toLocaleString()}
          </div>
        </div>
      </div>
    ) : (
      <div className="community-join">
        <h3>🏛️ Join a Community</h3>
        <p>Find your movement and build together</p>
        <motion.button
          className="community-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onJoinCommunity}
        >
          Find Communities
        </motion.button>
      </div>
    )}
  </motion.div>
);

export const MissionCard: React.FC<{
  mission: Mission;
  onStart: (mission: Mission) => void;
}> = ({ mission, onStart }) => (
  <motion.div 
    className="mission-card"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="mission-header">
      <h4>{mission.title}</h4>
      <span className={`mission-type ${mission.type}`}>{mission.type}</span>
    </div>
    
    <p className="mission-description">{mission.description}</p>
    
    <div className="mission-progress">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${(mission.progress / 100) * 100}%` }}
        />
      </div>
      <span className="progress-text">{mission.progress}% Complete</span>
    </div>
    
    <div className="mission-rewards">
      <div className="reward-item">
        <span className="reward-icon">⭐</span>
        <span className="reward-value">{mission.rewards.influence}</span>
      </div>
      <div className="reward-item">
        <span className="reward-icon">💎</span>
        <span className="reward-value">{mission.rewards.tokens}</span>
      </div>
    </div>
    
    <button 
      className="mission-btn"
      onClick={() => onStart(mission)}
      disabled={mission.completed}
    >
      {mission.completed ? 'Completed' : 'Start Mission'}
    </button>
  </motion.div>
);

export const StoryChapter: React.FC<{
  chapter: any;
  onStart: (chapter: any) => void;
}> = ({ chapter, onStart }) => (
  <motion.div 
    className="story-chapter"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="chapter-header">
      <h4>Chapter {chapter.chapterNumber}: {chapter.title}</h4>
      <span className="chapter-theme">{chapter.theme}</span>
    </div>
    
    <p className="chapter-description">{chapter.content}</p>
    
    <div className="chapter-emotional-hook">
      <span className="hook-icon">💭</span>
      <span className="hook-text">{chapter.emotionalHook}</span>
    </div>
    
    <div className="chapter-rewards">
      <div className="reward-item">
        <span className="reward-icon">⭐</span>
        <span className="reward-value">{chapter.rewards.influence}</span>
      </div>
      <div className="reward-item">
        <span className="reward-icon">💎</span>
        <span className="reward-value">{chapter.rewards.tokens}</span>
      </div>
    </div>
    
    <button 
      className="chapter-btn"
      onClick={() => onStart(chapter)}
      disabled={!chapter.unlocked}
    >
      {chapter.completed ? 'Completed' : chapter.unlocked ? 'Start Chapter' : 'Locked'}
    </button>
  </motion.div>
);

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => (
  <motion.div
    className={`modal-overlay ${isOpen ? 'open' : ''}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: isOpen ? 1 : 0 }}
    onClick={onClose}
  >
    <motion.div
      className="modal-content"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: isOpen ? 1 : 0.8, opacity: isOpen ? 1 : 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h2>{title}</h2>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
      </div>
      
      <div className="modal-body">
        {children}
      </div>
    </motion.div>
  </motion.div>
);

export const RewardModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  reward: {
    type: string;
    amount: number;
    message: string;
    rank?: any;
  };
}> = ({ isOpen, onClose, reward }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="">
    <motion.div
      className="reward-modal"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="reward-icon">
        {reward.type === 'level_up' && '🎉'}
        {reward.type === 'rank_upgrade' && '🏆'}
        {reward.type === 'mission_complete' && '✅'}
        {reward.type === 'daily_reward' && '🎁'}
        {reward.type === 'viral_event' && '🔥'}
        {reward.type === 'supporter_unlock' && '👥'}
        {reward.type === 'comeback' && '👋'}
        {reward.type === 'error' && '⚠️'}
      </div>
      
      <h3>{reward.message}</h3>
      
      {reward.amount > 0 && (
        <div className="reward-amount">
          <span className="token-icon">💎</span>
          <span className="token-value">+{reward.amount}</span>
        </div>
      )}
      
      {reward.rank && (
        <div className="rank-display">
          <span className="rank-icon">{reward.rank.icon}</span>
          <span className="rank-title">{reward.rank.title}</span>
        </div>
      )}
      
      <motion.button
        className="reward-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
      >
        Awesome!
      </motion.button>
    </motion.div>
  </Modal>
);

export const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="loading-screen">
    <motion.div
      className="loading-spinner"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      🔄
    </motion.div>
    <p>{message}</p>
  </div>
);

export const LiveCounters: React.FC<{ counters: any }> = ({ counters }) => (
  <motion.div 
    className="live-counters"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="counter-item">
      <span className="counter-icon">🔥</span>
      <span className="counter-value">{counters.totalPlayers.toLocaleString()}</span>
      <span className="counter-label">Players Joined</span>
    </div>
    
    <div className="counter-item">
      <span className="counter-icon">⚡</span>
      <span className="counter-value">{counters.onlineNow.toLocaleString()}</span>
      <span className="counter-label">Online Now</span>
    </div>
    
    <div className="counter-item">
      <span className="counter-icon">📈</span>
      <span className="counter-value">{counters.growthRate}%</span>
      <span className="counter-label">Growth Rate</span>
    </div>
  </motion.div>
);

export const InviteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onInvite: () => void;
  inviteCode: string;
  referralCount: number;
}> = ({ isOpen, onClose, onInvite, inviteCode, referralCount }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="🤝 Invite Friends">
    <div className="invite-modal">
      <div className="invite-stats">
        <div className="stat-item">
          <span className="stat-value">{referralCount}</span>
          <span className="stat-label">Friends Invited</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">+50</span>
          <span className="stat-label">Influence per Friend</span>
        </div>
      </div>
      
      <div className="invite-code-section">
        <h3>Your Invite Code</h3>
        <div className="invite-code">{inviteCode}</div>
        <button className="copy-btn" onClick={() => navigator.clipboard.writeText(inviteCode)}>
          📋 Copy Code
        </button>
      </div>
      
      <div className="invite-benefits">
        <h4>Invite Benefits:</h4>
        <ul>
          <li>🎁 50 Influence for each friend who reaches Level 3</li>
          <li>🏆 Special badges for 5, 10, 25+ friends</li>
          <li>⭐ Team bonuses when friends play together</li>
          <li>🌟 Unlock exclusive community features</li>
        </ul>
      </div>
      
      <motion.button
        className="invite-action-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onInvite}
      >
        Share on Telegram
      </motion.button>
    </div>
  </Modal>
);

export const NotificationToast: React.FC<{
  notification: any;
  onClose: () => void;
}> = ({ notification, onClose }) => (
  <motion.div
    className="notification-toast"
    initial={{ x: 300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 300, opacity: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
  >
    <div className="notification-icon">
      {notification.type === 'reward' && '🎁'}
      {notification.type === 'mission' && '🎯'}
      {notification.type === 'community' && '🏛️'}
      {notification.type === 'friend' && '👥'}
      {notification.type === 'system' && '📢'}
      {notification.type === 'event' && '🔥'}
    </div>
    
    <div className="notification-content">
      <div className="notification-title">{notification.title}</div>
      <div className="notification-message">{notification.message}</div>
    </div>
    
    <button className="notification-close" onClick={onClose}>
      ✕
    </button>
  </motion.div>
);

export const ProgressBar: React.FC<{
  current: number;
  max: number;
  label?: string;
  color?: string;
  showPercentage?: boolean;
}> = ({ current, max, label, color = '#4CAF50', showPercentage = true }) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  return (
    <div className="progress-container">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          style={{ backgroundColor: color }}
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {showPercentage && (
        <div className="progress-percentage">{Math.round(percentage)}%</div>
      )}
    </div>
  );
};

export const FloatingAction: React.FC<{
  icon: string;
  onClick: () => void;
  badge?: string | number;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}> = ({ icon, onClick, badge, position = 'bottom-right' }) => (
  <motion.button
    className={`floating-action ${position}`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
  >
    <span className="floating-icon">{icon}</span>
    {badge && (
      <span className="floating-badge">{badge}</span>
    )}
  </motion.button>
);
