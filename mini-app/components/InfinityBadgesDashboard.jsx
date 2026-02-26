import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, Crown, Star, Trophy, Medal, Gem, Shield, Zap,
  TrendingUp, DollarSign, Users, Target, Calendar,
  BarChart3, PieChart, Activity, Globe, Heart,
  ChevronRight, AlertTriangle, CheckCircle, Info,
  Eye, Download, Filter, Search, Building,
  GraduationCap, Music, ShoppingBag, Stethoscope,
  Flame, Coins, Lock, Unlock, Vote, Burn,
  Gift, Users2, CalendarDays, Clock, TargetIcon,
  UserPlus, Swords, BookOpen, Brain, Lightbulb,
  AwardIcon, UsersIcon, UserCheck, UserX, UserPlusIcon,
  Certificate, GraduationCapIcon, School, University,
  Chalkboard, Teacher, Crown as CrownIcon,
  Star as StarIcon, Trophy as TrophyIcon,
  Medal as MedalIcon, Shield as ShieldIcon,
  Zap as ZapIcon, Heart as HeartIcon,
  Activity as ActivityIcon, BarChart as BarChartIcon,
  PieChart as PieChartIcon, LineChart as LineChartIcon,
  MapPin, Globe2, Monitor, Smartphone,
  Battery, Thermometer, Gauge, TrendingUpIcon,
  TrendingDown, ArrowUp, ArrowDown,
  RefreshCw, Settings, Bell, BellRing,
  Sparkles, Crown2, Star2, Trophy2,
  Medal2, Shield2, Zap2, Heart2,
  Award2, Users2 as Users2Icon,
  Target2, Calendar2, Clock2,
  UserPlus2, Swords2, BookOpen2,
  Brain2, Lightbulb2, AwardIcon2,
  UsersIcon2, UserCheck2, UserX2,
  Certificate2, GraduationCapIcon2,
  School2, University2, Chalkboard2,
  Teacher2, CrownIcon2, StarIcon2,
  TrophyIcon2, MedalIcon2, ShieldIcon2,
  ZapIcon2, HeartIcon2, ActivityIcon2,
  BarChartIcon2, PieChartIcon2, LineChartIcon2
} from 'lucide-react';

const InfinityBadgesDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [badgesData, setBadgesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetchBadgesData();
  }, []);

  const fetchBadgesData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData = {
        overview: {
          totalBadgesIssued: 45000000,
          usersWithBadges: 25000000,
          badgeCategories: 13,
          legendaryBadges: 50000,
          transcendentBadges: 5000,
          avgMultiplier: 1.8,
          avgGovernancePower: 75,
          totalEconomicPower: 900000000,
          totalGovernancePower: 1875000000,
          totalValidations: 125000000,
          totalExploitAttempts: 25000
        },
        categories: [
          {
            id: 'leadership',
            name: 'Leadership',
            totalBadges: 15000000,
            avgMultiplier: 2.1,
            avgGovernancePower: 120,
            rarityDistribution: { common: 5000000, uncommon: 4000000, rare: 3000000, epic: 2000000, legendary: 1000000 }
          },
          {
            id: 'organizer',
            name: 'Organizer',
            totalBadges: 10000000,
            avgMultiplier: 1.9,
            avgGovernancePower: 90,
            rarityDistribution: { common: 4000000, uncommon: 3000000, rare: 2000000, epic: 800000, legendary: 200000 }
          },
          {
            id: 'rank',
            name: 'Rank',
            totalBadges: 8000000,
            avgMultiplier: 1.7,
            avgGovernancePower: 60,
            rarityDistribution: { common: 3000000, uncommon: 2500000, rare: 1500000, epic: 700000, legendary: 300000 }
          },
          {
            id: 'profile',
            name: 'Profile',
            totalBadges: 6000000,
            avgMultiplier: 1.6,
            avgGovernancePower: 50,
            rarityDistribution: { common: 2500000, uncommon: 2000000, rare: 1000000, epic: 400000, legendary: 100000 }
          },
          {
            id: 'economic',
            name: 'Economic',
            totalBadges: 4000000,
            avgMultiplier: 2.2,
            avgGovernancePower: 40,
            rarityDistribution: { common: 1500000, uncommon: 1200000, rare: 800000, epic: 400000, legendary: 100000 }
          },
          {
            id: 'governance',
            name: 'Governance',
            totalBadges: 2000000,
            avgMultiplier: 1.8,
            avgGovernancePower: 150,
            rarityDistribution: { common: 800000, uncommon: 600000, rare: 400000, epic: 150000, legendary: 50000 }
          }
        ],
        economic: {
          badgesIssued: 45000000,
          totalEconomicPower: 900000000,
          avgEconomicPower: 20,
          highPowerBadges: 5000000,
          midPowerBadges: 15000000,
          lowPowerBadges: 25000000,
          dailyEarnings: 450000000,
          totalEarnings: 13500000000,
          economicMultiplier: 1.8,
          revenueSharing: 0.15
        },
        governance: {
          governanceParticipants: 25000000,
          totalGovernancePower: 1875000000,
          avgGovernancePower: 75,
          highPowerUsers: 2500000,
          midPowerUsers: 7500000,
          lowPowerUsers: 15000000,
          votingWeight: 1.5,
          proposalSuccess: 0.75,
          governanceParticipation: 0.85
        },
        social: {
          activeUsersWithBadges: 25000000,
          socialValidatedUsers: 20000000,
          highValidationUsers: 5000000,
          suspiciousUsers: 25000,
          botAccountsDetected: 15000,
          fakeAccountsDetected: 10000,
          networkAnomaliesDetected: 5000,
          socialManipulationDetected: 3000,
          validationWeight: 0.8,
          socialProof: 0.85
        },
        antiExploit: {
          suspiciousActivitiesDetected: 25000,
          suspiciousUsers: 25000,
          potentialCollusionRings: 5000,
          botAccountsDetected: 15000,
          fakeAccountsDetected: 10000,
          rapidGrowthUsers: 8000,
          networkAnomaliesDetected: 5000,
          socialManipulationDetected: 3000,
          exploitPrevention: 0.95,
          systemHealth: 0.98
        },
        capacity: {
          services: [
            {
              name: 'badge_minting',
              currentCapacity: 1000000,
              projectedCapacity: 1500000,
              requiredCapacity: 2000000,
              urgencyLevel: 'high',
              estimatedCost: 500000,
              timelineMonths: 6
            },
            {
              name: 'badge_validation',
              currentCapacity: 500000,
              projectedCapacity: 750000,
              requiredCapacity: 1000000,
              urgencyLevel: 'medium',
              estimatedCost: 250000,
              timelineMonths: 4
            },
            {
              name: 'badge_analytics',
              currentCapacity: 100000,
              projectedCapacity: 150000,
              requiredCapacity: 200000,
              urgencyLevel: 'low',
              estimatedCost: 100000,
              timelineMonths: 3
            },
            {
              name: 'badge_visual_evolution',
              currentCapacity: 50000,
              projectedCapacity: 75000,
              requiredCapacity: 100000,
              urgencyLevel: 'medium',
              estimatedCost: 200000,
              timelineMonths: 5
            },
            {
              name: 'badge_anti_exploit',
              currentCapacity: 25000,
              projectedCapacity: 37500,
              requiredCapacity: 50000,
              urgencyLevel: 'high',
              estimatedCost: 150000,
              timelineMonths: 4
            },
            {
              name: 'badge_governance',
              currentCapacity: 10000,
              projectedCapacity: 15000,
              requiredCapacity: 20000,
              urgencyLevel: 'medium',
              estimatedCost: 75000,
              timelineMonths: 3
            }
          ]
        }
      };
      
      setBadgesData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching badges data:', error);
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
          <p className={`mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading Infinity Badges...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'categories', name: 'Categories', icon: Award },
    { id: 'economic', name: 'Economic', icon: DollarSign },
    { id: 'governance', name: 'Governance', icon: Vote },
    { id: 'social', name: 'Social', icon: Users },
    { id: 'antiExploit', name: 'Anti-Exploit', icon: Shield },
    { id: 'capacity', name: 'Capacity', icon: Gauge }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Main Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500 to-pink-600 p-8 rounded-xl text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">🏆 Infinity Badges System</h2>
            <p className="text-purple-100 text-lg">Total Badges Issued: {formatNumber(badgesData.overview.totalBadgesIssued)}</p>
            <p className="text-purple-200 text-sm mt-2">Economic Power • Governance Rights • Social Validation</p>
          </div>
          <div className="text-right">
            <Award className="h-16 w-16 text-purple-200" />
            <p className="text-2xl font-bold mt-2">{formatNumber(badgesData.overview.usersWithBadges)}</p>
            <p className="text-purple-100 text-sm">Users with Badges</p>
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
              <p className="text-blue-100 text-sm">Total Badges Issued</p>
              <p className="text-3xl font-bold">{formatNumber(badgesData.overview.totalBadgesIssued)}</p>
              <p className="text-blue-100 text-xs">{badgesData.overview.badgeCategories} categories</p>
            </div>
            <Award className="h-8 w-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Avg Multiplier</p>
              <p className="text-3xl font-bold">{badgesData.overview.avgMultiplier}x</p>
              <p className="text-green-100 text-xs">Economic power</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg Governance Power</p>
              <p className="text-3xl font-bold">{formatNumber(badgesData.overview.avgGovernancePower)}</p>
              <p className="text-purple-100 text-xs">Voting weight</p>
            </div>
            <Vote className="h-8 w-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Legendary Badges</p>
              <p className="text-3xl font-bold">{formatNumber(badgesData.overview.legendaryBadges)}</p>
              <p className="text-orange-100 text-xs">Transcendent: {formatNumber(badgesData.overview.transcendentBadges)}</p>
            </div>
            <Crown className="h-8 w-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Badge Categories Performance
          </h3>
          <div className="space-y-3">
            {badgesData.categories.slice(0, 3).map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{category.name}</p>
                    <p className="text-gray-400 text-xs">{formatNumber(category.totalBadges)} badges</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">{category.avgMultiplier}x</p>
                  <p className="text-gray-400 text-xs">multiplier</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🎯 System Health Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Validations</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(badgesData.overview.totalValidations)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Exploit Attempts</span>
              <span className={`font-bold text-red-500`}>
                {formatNumber(badgesData.overview.totalExploitAttempts)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>System Health</span>
              <span className={`font-bold text-green-500`}>
                98.5%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Anti-Exploit Rate</span>
              <span className={`font-bold text-green-500`}>
                99.9%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        🏆 Badge Categories
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {badgesData.categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {category.name}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500 text-white">
                    {category.id}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium text-green-500`}>
                  {category.avgMultiplier}x
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Total Badges</span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatNumber(category.totalBadges)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Avg Multiplier</span>
                <span className={`font-bold text-green-500`}>
                  {category.avgMultiplier}x
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Governance Power</span>
                <span className={`font-bold text-purple-500`}>
                  {formatNumber(category.avgGovernancePower)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                Rarity Distribution
              </p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                    Common: {formatNumber(category.rarityDistribution.common)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                    Rare: {formatNumber(category.rarityDistribution.rare)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                    Legendary: {formatNumber(category.rarityDistribution.legendary)}
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderEconomic = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        💰 Economic Power
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Economic Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Badges Issued</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(badgesData.economic.badgesIssued)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Economic Power</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(badgesData.economic.totalEconomicPower)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Avg Economic Power</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {badgesData.economic.avgEconomicPower}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Economic Multiplier</span>
              <span className={`font-bold text-purple-500`}>
                {badgesData.economic.economicMultiplier}x
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
            💎 Power Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>High Power Badges</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(badgesData.economic.highPowerBadges)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Mid Power Badges</span>
              <span className={`font-bold text-yellow-500`}>
                {formatNumber(badgesData.economic.midPowerBadges)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Low Power Badges</span>
              <span className={`font-bold text-blue-500`}>
                {formatNumber(badgesData.economic.lowPowerBadges)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Revenue Sharing</span>
              <span className={`font-bold text-purple-500`}>
                {(badgesData.economic.revenueSharing * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderGovernance = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        🗳️ Governance Power
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Governance Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Governance Participants</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(badgesData.governance.governanceParticipants)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Governance Power</span>
              <span className={`font-bold text-purple-500`}>
                {formatNumber(badgesData.governance.totalGovernancePower)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Avg Governance Power</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {badgesData.governance.avgGovernancePower}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Voting Weight</span>
              <span className={`font-bold text-green-500`}>
                {badgesData.governance.votingWeight}x
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
            🎯 Power Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>High Power Users</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(badgesData.governance.highPowerUsers)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Mid Power Users</span>
              <span className={`font-bold text-yellow-500`}>
                {formatNumber(badgesData.governance.midPowerUsers)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Low Power Users</span>
              <span className={`font-bold text-blue-500`}>
                {formatNumber(badgesData.governance.lowPowerUsers)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Proposal Success</span>
              <span className={`font-bold text-green-500`}>
                {(badgesData.governance.proposalSuccess * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderSocial = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        👥 Social Validation
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Social Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Active Users with Badges</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(badgesData.social.activeUsersWithBadges)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Social Validated Users</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(badgesData.social.socialValidatedUsers)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>High Validation Users</span>
              <span className={`font-bold text-purple-500`}>
                {formatNumber(badgesData.social.highValidationUsers)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Social Proof</span>
              <span className={`font-bold text-green-500`}>
                {(badgesData.social.socialProof * 100).toFixed(1)}%
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
            🚨 Suspicious Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Suspicious Users</span>
              <span className={`font-bold text-red-500`}>
                {formatNumber(badgesData.social.suspiciousUsers)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Bot Accounts Detected</span>
              <span className={`font-bold text-orange-500`}>
                {formatNumber(badgesData.social.botAccountsDetected)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Fake Accounts Detected</span>
              <span className={`font-bold text-red-500`}>
                {formatNumber(badgesData.social.fakeAccountsDetected)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Social Manipulation</span>
              <span className={`font-bold text-red-500`}>
                {formatNumber(badgesData.social.socialManipulationDetected)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderAntiExploit = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        🛡️ Anti-Exploit System
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🚨 Exploit Detection
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Suspicious Activities</span>
              <span className={`font-bold text-red-500`}>
                {formatNumber(badgesData.antiExploit.suspiciousActivitiesDetected)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Potential Collusion Rings</span>
              <span className={`font-bold text-orange-500`}>
                {formatNumber(badgesData.antiExploit.potentialCollusionRings)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Rapid Growth Users</span>
              <span className={`font-bold text-yellow-500`}>
                {formatNumber(badgesData.antiExploit.rapidGrowthUsers)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Network Anomalies</span>
              <span className={`font-bold text-red-500`}>
                {formatNumber(badgesData.antiExploit.networkAnomaliesDetected)}
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
            🛡️ System Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Exploit Prevention</span>
              <span className={`font-bold text-green-500`}>
                {(badgesData.antiExploit.exploitPrevention * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>System Health</span>
              <span className={`font-bold text-green-500`}>
                {(badgesData.antiExploit.systemHealth * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Bot Detection Rate</span>
              <span className={`font-bold text-green-500`}>
                99.8%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>False Positive Rate</span>
              <span className={`font-bold text-yellow-500`}>
                0.2%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderCapacity = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        📊 Capacity Planning
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📈 Capacity Requirements
          </h3>
          <div className="space-y-4">
            {badgesData.capacity.services.map((service, index) => (
              <div key={index} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{service.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.urgencyLevel === 'critical' ? 'bg-red-500 text-white' :
                    service.urgencyLevel === 'high' ? 'bg-orange-500 text-white' :
                    service.urgencyLevel === 'medium' ? 'bg-yellow-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {service.urgencyLevel}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Current:</span>
                    <span className="text-blue-400 font-bold">{formatNumber(service.currentCapacity)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Required:</span>
                    <span className="text-red-400 font-bold">{formatNumber(service.requiredCapacity)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Projected:</span>
                    <span className="text-yellow-400 font-bold">{formatNumber(service.projectedCapacity)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Timeline:</span>
                    <span className="text-green-400 font-bold">{service.timelineMonths} months</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Estimated Cost:</span>
                    <span className="text-green-400 font-bold">{formatCurrency(service.estimatedCost)}</span>
                  </div>
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
      case 'categories': return renderCategories();
      case 'economic': return renderEconomic();
      case 'governance': return renderGovernance();
      case 'social': return renderSocial();
      case 'antiExploit': return renderAntiExploit();
      case 'capacity': return renderCapacity();
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
              <h1 className="text-2xl font-bold text-purple-600">🏆 Infinity Badges System</h1>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Economic Power • Governance Rights • Social Validation
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
                      ? 'border-purple-500 text-purple-600'
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

export default InfinityBadgesDashboard;
