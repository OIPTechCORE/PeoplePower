import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, DollarSign, Users, Target, Award, Calendar,
  BarChart3, PieChart, Activity, Globe, Shield, Zap,
  Crown, Home, Gamepad2, Briefcase, Heart, Star,
  ChevronRight, AlertTriangle, CheckCircle, Info,
  Eye, Download, Filter, Search, Gem, Building,
  GraduationCap, Music, ShoppingBag, Stethoscope,
  Flame, Coins, Lock, Unlock, Vote, Burn, Droplet,
  Trophy, Medal, Gift, Users2, CalendarDays,
  Clock, TargetIcon, AwardIcon, UserPlus, Swords
} from 'lucide-react';

const InfluenceGameplayIntegrationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [gameplayData, setGameplayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetchGameplayData();
  }, []);

  const fetchGameplayData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData = {
        overview: {
          totalUsers: 5000000,
          dailyActiveUsers: 1500000,
          totalInfluenceEarned: '50,000,000,000',
          totalInfluenceSpent: '35,000,000,000',
          averageDailyEarnings: 1000,
          averageDailySpending: 500,
          dailyEarnLimit: 10000,
          dailySpendLimit: 5000
        },
        dailyLogin: {
          todayLogins: 1250000,
          weeklyStreakUsers: 750000,
          monthlyStreakUsers: 250000,
          averageBonusPerUser: 100,
          totalBonusesPaidToday: '125,000,000',
          topStreakDays: 365
        },
        achievements: {
          totalAchievements: 50,
          achievementsUnlocked: 15000000,
          completionRate: 65.5,
          averageRewardsPerAchievement: 275,
          topCategories: ['onboarding', 'social', 'competitive', 'referral', 'progression'],
          difficultyDistribution: {
            bronze: 40,
            silver: 30,
            gold: 20,
            platinum: 8,
            diamond: 2
          }
        },
        socialInteractions: {
          totalInteractions: 25000000,
          todayInteractions: 1250000,
          averageRewardPerInteraction: 35,
          interactionTypes: {
            like: 45,
            comment: 25,
            share: 15,
            follow: 10,
            gift: 3,
            collaborate: 1,
            mentor: 1
          },
          dailyLimitReachedUsers: 50000
        },
        referrals: {
          totalReferrals: 500000,
          activeReferrers: 75000,
          conversionRate: 12.5,
          averageBonusPerReferral: 1250,
          referralTypes: {
            basic: 70,
            premium: 20,
            vip: 8,
            ambassador: 2
          },
          topReferrerCount: 150
        },
        tournaments: {
          totalTournaments: 1000,
          activeTournaments: 25,
          totalParticipants: 2500000,
          averageRewardPerWin: 8750,
          tournamentTypes: {
            casual: 60,
            competitive: 25,
            professional: 12,
            championship: 2,
            world_championship: 1
          },
          averagePositionMultiplier: 0.45
        }
      };
      
      setGameplayData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gameplay data:', error);
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          <p className={`mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading Influence Gameplay Dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'daily-login', name: 'Daily Login', icon: CalendarDays },
    { id: 'achievements', name: 'Achievements', icon: Trophy },
    { id: 'social', name: 'Social', icon: Users2 },
    { id: 'referrals', name: 'Referrals', icon: UserPlus },
    { id: 'tournaments', name: 'Tournaments', icon: Swords }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Main Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-xl text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">⭐ Influence Gameplay Integration</h2>
            <p className="text-green-100 text-lg">Total Influence Earned: {gameplayData.overview.totalInfluenceEarned}</p>
            <p className="text-green-200 text-sm mt-2">Deep gameplay mechanics • Anti-abuse protection • Real-time rewards</p>
          </div>
          <div className="text-right">
            <Star className="h-16 w-16 text-green-200" />
            <p className="text-2xl font-bold mt-2">{formatNumber(gameplayData.overview.totalUsers)}</p>
            <p className="text-green-100 text-sm">Total Users</p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Daily Active Users</p>
              <p className="text-3xl font-bold">{formatNumber(gameplayData.overview.dailyActiveUsers)}</p>
              <p className="text-blue-100 text-xs">30% of total users</p>
            </div>
            <Users className="h-8 w-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Influence Spent</p>
              <p className="text-3xl font-bold">{formatNumber(gameplayData.overview.totalInfluenceSpent)}</p>
              <p className="text-purple-100 text-xs">70% utilization rate</p>
            </div>
            <Coins className="h-8 w-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Avg Daily Earnings</p>
              <p className="text-3xl font-bold">{formatNumber(gameplayData.overview.averageDailyEarnings)}</p>
              <p className="text-orange-100 text-xs">Per active user</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-green-500 to-teal-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Daily Earn Limit</p>
              <p className="text-3xl font-bold">{formatNumber(gameplayData.overview.dailyEarnLimit)}</p>
              <p className="text-green-100 text-xs">Per user limit</p>
            </div>
            <TargetIcon className="h-8 w-8 text-green-200" />
          </div>
        </motion.div>
      </div>

      {/* Gameplay Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🎮 Gameplay Features
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Daily Login Bonus</span>
              <span className={`font-bold text-green-500`}>
                100 Influence
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Achievement Rewards</span>
              <span className={`font-bold text-blue-500`}>
                50-1,000 Influence
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Social Interactions</span>
              <span className={`font-bold text-purple-500`}>
                10-100 Influence
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Referral Bonuses</span>
              <span className={`font-bold text-orange-500`}>
                500-5,000 Influence
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Tournament Wins</span>
              <span className={`font-bold text-red-500`}>
                1,000-50,000 Influence
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Engagement Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Achievement Completion</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                65.5%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Social Interaction Rate</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                83.3%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Referral Conversion</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                12.5%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Tournament Participation</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                50%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Daily Streak Users</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                15%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderDailyLogin = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        📅 Daily Login Bonus System
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Login Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Today's Logins</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(gameplayData.dailyLogin.todayLogins)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Weekly Streak Users</span>
              <span className={`font-bold text-blue-500`}>
                {formatNumber(gameplayData.dailyLogin.weeklyStreakUsers)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Monthly Streak Users</span>
              <span className={`font-bold text-purple-500`}>
                {formatNumber(gameplayData.dailyLogin.monthlyStreakUsers)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Top Streak Days</span>
              <span className={`font-bold text-orange-500`}>
                {gameplayData.dailyLogin.topStreakDays} days
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            💰 Bonus Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Bonus Per User</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {gameplayData.dailyLogin.averageBonusPerUser} Influence
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Paid Today</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(gameplayData.dailyLogin.totalBonusesPaidToday)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Claim Rate</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                83.3%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Reset Time</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                00:00 UTC
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        🏆 Achievement System
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Achievement Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Achievements</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {gameplayData.achievements.totalAchievements}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Achievements Unlocked</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(gameplayData.achievements.achievementsUnlocked)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Completion Rate</span>
              <span className={`font-bold text-blue-500`}>
                {gameplayData.achievements.completionRate}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Avg Reward Per Achievement</span>
              <span className={`font-bold text-purple-500`}>
                {gameplayData.achievements.averageRewardsPerAchievement} Influence
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🎯 Difficulty Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(gameplayData.achievements.difficultyDistribution).map(([difficulty, percentage]) => (
              <div key={difficulty} className="flex items-center justify-between">
                <span className={`capitalize ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {difficulty}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        difficulty === 'bronze' ? 'bg-orange-500' :
                        difficulty === 'silver' ? 'bg-gray-400' :
                        difficulty === 'gold' ? 'bg-yellow-500' :
                        difficulty === 'platinum' ? 'bg-purple-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderSocial = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        👥 Social Interaction System
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Social Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Interactions</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(gameplayData.socialInteractions.totalInteractions)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Today's Interactions</span>
              <span className={`font-bold text-blue-500`}>
                {formatNumber(gameplayData.socialInteractions.todayInteractions)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Avg Reward Per Interaction</span>
              <span className={`font-bold text-purple-500`}>
                {gameplayData.socialInteractions.averageRewardPerInteraction} Influence
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Daily Limit Reached</span>
              <span className={`font-bold text-orange-500`}>
                {formatNumber(gameplayData.socialInteractions.dailyLimitReachedUsers)} users
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🎯 Interaction Types
          </h3>
          <div className="space-y-3">
            {Object.entries(gameplayData.socialInteractions.interactionTypes).map(([type, percentage]) => (
              <div key={type} className="flex items-center justify-between">
                <span className={`capitalize ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {type}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderReferrals = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        🎁 Referral Bonus System
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Referral Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Referrals</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(gameplayData.referrals.totalReferrals)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Active Referrers</span>
              <span className={`font-bold text-blue-500`}>
                {formatNumber(gameplayData.referrals.activeReferrers)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Conversion Rate</span>
              <span className={`font-bold text-purple-500`}>
                {gameplayData.referrals.conversionRate}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Top Referrer Count</span>
              <span className={`font-bold text-orange-500`}>
                {gameplayData.referrals.topReferrerCount} referrals
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🎯 Referral Types
          </h3>
          <div className="space-y-3">
            {Object.entries(gameplayData.referrals.referralTypes).map(([type, percentage]) => (
              <div key={type} className="flex items-center justify-between">
                <span className={`capitalize ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {type}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-purple-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderTournaments = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        ⚔️ Tournament Win System
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Tournament Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Tournaments</span>
              <span className={`font-bold text-green-500`}>
                {gameplayData.tournaments.totalTournaments}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Active Tournaments</span>
              <span className={`font-bold text-blue-500`}>
                {gameplayData.tournaments.activeTournaments}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Participants</span>
              <span className={`font-bold text-purple-500`}>
                {formatNumber(gameplayData.tournaments.totalParticipants)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Avg Reward Per Win</span>
              <span className={`font-bold text-orange-500`}>
                {formatNumber(gameplayData.tournaments.averageRewardPerWin)} Influence
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🎯 Tournament Types
          </h3>
          <div className="space-y-3">
            {Object.entries(gameplayData.tournaments.tournamentTypes).map(([type, percentage]) => (
              <div key={type} className="flex items-center justify-between">
                <span className={`capitalize ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {type.replace('_', ' ')}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-red-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'daily-login': return renderDailyLogin();
      case 'achievements': return renderAchievements();
      case 'social': return renderSocial();
      case 'referrals': return renderReferrals();
      case 'tournaments': return renderTournaments();
      default: return renderOverview();
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-green-600">⭐ Influence Gameplay Integration</h1>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Deep Gameplay Mechanics • Real-time Rewards • Anti-Abuse Protection
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-gray-600`}>
                <Download className="h-5 w-5 text-gray-400" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-gray-600`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default InfluenceGameplayIntegrationDashboard;
