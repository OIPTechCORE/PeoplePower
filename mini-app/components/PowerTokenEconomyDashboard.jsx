import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, DollarSign, Users, Target, Award, Calendar,
  BarChart3, PieChart, Activity, Globe, Shield, Zap,
  Crown, Home, Gamepad2, Briefcase, Heart, Star,
  ChevronRight, AlertTriangle, CheckCircle, Info,
  Eye, Download, Filter, Search, Gem, Building,
  GraduationCap, Music, ShoppingBag, Stethoscope,
  Flame, Coins, Lock, Unlock, Vote, Burn, Droplet
} from 'lucide-react';

const PowerTokenEconomyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetchTokenData();
  }, []);

  const fetchTokenData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData = {
        powerToken: {
          name: 'POWER Token',
          symbol: 'PWR',
          totalSupply: '1,000,000,000,000',
          totalSupplyRaw: 1000000000000000,
          circulatingSupply: '250,000,000,000',
          burnedSupply: '15,000,000,000',
          lockedSupply: '400,000,000,000',
          stakedSupply: '200,000,000,000',
          governanceSupply: '50,000,000,000',
          treasurySupply: '150,000,000,000',
          circulationPercentage: 25.0,
          burnPercentage: 1.5,
          stakingPercentage: 20.0,
          lockPercentage: 40.0
        },
        influenceCurrency: {
          totalUsers: 5000000,
          dailyActiveUsers: 1500000,
          totalInfluenceEarned: '50,000,000,000',
          totalInfluenceSpent: '35,000,000,000',
          averageDailyEarnings: 1000,
          averageDailySpending: 500,
          dailyEarnLimit: 10000,
          dailySpendLimit: 5000
        },
        antiCollapseMechanisms: [
          {
            name: 'Dynamic Burning',
            type: 'burning',
            status: 'active',
            threshold: 0.05,
            currentRate: 0.02,
            effectiveness: 85
          },
          {
            name: 'Staking Boost',
            type: 'demand_stimulation',
            status: 'monitoring',
            threshold: 0.10,
            currentRate: 0.08,
            effectiveness: 92
          },
          {
            name: 'Supply Control',
            type: 'supply_control',
            status: 'inactive',
            threshold: 0.15,
            currentRate: 0.12,
            effectiveness: 78
          },
          {
            name: 'Liquidity Incentives',
            type: 'demand_stimulation',
            status: 'active',
            threshold: 0.08,
            currentRate: 0.06,
            effectiveness: 88
          }
        ],
        economics: {
          priceUSD: 0.50,
          marketCapUSD: 125000000000,
          volume24h: 50000000,
          holdersCount: 2500000,
          stakingAPY: 15.5,
          inflationRate: 0.02,
          deflationRate: 0.015,
          volatilityIndex: 12.5
        }
      };
      
      setTokenData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching token data:', error);
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000000000) return `${(num / 1000000000000).toFixed(1)}T`;
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'text-green-500',
      'monitoring': 'text-yellow-500',
      'inactive': 'text-gray-500',
      'triggered': 'text-red-500'
    };
    return colors[status] || 'text-gray-500';
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
          <p className={`mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading Token Economy Dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'power-token', name: 'PWR Token', icon: Coins },
    { id: 'influence', name: 'Influence', icon: Star },
    { id: 'anti-collapse', name: 'Anti-Collapse', icon: Shield },
    { id: 'governance', name: 'Governance', icon: Vote }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Main Token Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500 to-pink-600 p-8 rounded-xl text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">💎 POWER TOKEN ECONOMY</h2>
            <p className="text-purple-100 text-lg">Total Supply: {tokenData.powerToken.totalSupply} PWR</p>
            <p className="text-purple-200 text-sm mt-2">Anti-Collapse Design • Dual Currency System</p>
          </div>
          <div className="text-right">
            <Coins className="h-16 w-16 text-purple-200" />
            <p className="text-2xl font-bold mt-2">1 TRILLION</p>
          </div>
        </div>
      </motion.div>

      {/* Token Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Circulating Supply</p>
              <p className="text-3xl font-bold">{formatNumber(tokenData.powerToken.circulatingSupply)}</p>
              <p className="text-blue-100 text-xs">{tokenData.powerToken.circulationPercentage}% of total</p>
            </div>
            <Activity className="h-8 w-8 text-blue-200" />
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
              <p className="text-green-100 text-sm">Staked Supply</p>
              <p className="text-3xl font-bold">{formatNumber(tokenData.powerToken.stakedSupply)}</p>
              <p className="text-green-100 text-xs">{tokenData.powerToken.stakingPercentage}% staked</p>
            </div>
            <Lock className="h-8 w-8 text-green-200" />
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
              <p className="text-orange-100 text-sm">Burned Supply</p>
              <p className="text-3xl font-bold">{formatNumber(tokenData.powerToken.burnedSupply)}</p>
              <p className="text-orange-100 text-xs">{tokenData.powerToken.burnPercentage}% burned</p>
            </div>
            <Burn className="h-8 w-8 text-orange-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Market Cap</p>
              <p className="text-3xl font-bold">${formatNumber(tokenData.economics.marketCapUSD)}</p>
              <p className="text-purple-100 text-xs">${tokenData.economics.priceUSD} per PWR</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-200" />
          </div>
        </motion.div>
      </div>

      {/* Influence Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ⭐ Influence Currency
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Users</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(tokenData.influenceCurrency.totalUsers)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Daily Active Users</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(tokenData.influenceCurrency.dailyActiveUsers)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Earned</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(tokenData.influenceCurrency.totalInfluenceEarned)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Spent</span>
              <span className={`font-bold text-orange-500`}>
                {formatNumber(tokenData.influenceCurrency.totalInfluenceSpent)}
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
            📊 Economics Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>24h Volume</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ${formatNumber(tokenData.economics.volume24h)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Holders Count</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(tokenData.economics.holdersCount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Staking APY</span>
              <span className={`font-bold text-green-500`}>
                {tokenData.economics.stakingAPY}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Volatility Index</span>
              <span className={`font-bold text-yellow-500`}>
                {tokenData.economics.volatilityIndex}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderPowerToken = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        💎 POWER TOKEN (PWR)
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Supply Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Supply</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {tokenData.powerToken.totalSupply} PWR
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Circulating</span>
              <span className={`font-bold text-blue-500`}>
                {formatNumber(tokenData.powerToken.circulatingSupply)} ({tokenData.powerToken.circulationPercentage}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Staked</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(tokenData.powerToken.stakedSupply)} ({tokenData.powerToken.stakingPercentage}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Locked</span>
              <span className={`font-bold text-yellow-500`}>
                {formatNumber(tokenData.powerToken.lockedSupply)} ({tokenData.powerToken.lockPercentage}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Burned</span>
              <span className={`font-bold text-red-500`}>
                {formatNumber(tokenData.powerToken.burnedSupply)} ({tokenData.powerToken.burnPercentage}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Treasury</span>
              <span className={`font-bold text-purple-500`}>
                {formatNumber(tokenData.powerToken.treasurySupply)}
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
            🎯 Token Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Genesis Mining</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                40% (400B PWR)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Staking Rewards</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                25% (250B PWR)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Treasury</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                15% (150B PWR)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Governance</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                10% (100B PWR)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Charity</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                5% (50B PWR)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Team & Advisors</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                3% (30B PWR)
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderInfluence = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        ⭐ Influence Currency
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            👥 User Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Users</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(tokenData.influenceCurrency.totalUsers)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Daily Active Users</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(tokenData.influenceCurrency.dailyActiveUsers)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Average Daily Earnings</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(tokenData.influenceCurrency.averageDailyEarnings)} Influence
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Average Daily Spending</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(tokenData.influenceCurrency.averageDailySpending)} Influence
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
            📊 Flow Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Earned</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(tokenData.influenceCurrency.totalInfluenceEarned)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Spent</span>
              <span className={`font-bold text-orange-500`}>
                {formatNumber(tokenData.influenceCurrency.totalInfluenceSpent)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Daily Earn Limit</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(tokenData.influenceCurrency.dailyEarnLimit)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Daily Spend Limit</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(tokenData.influenceCurrency.dailySpendLimit)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderAntiCollapse = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        🛡️ Anti-Collapse Mechanisms
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tokenData.antiCollapseMechanisms.map((mechanism, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${mechanism.type === 'burning' ? 'bg-red-500' : mechanism.type === 'demand_stimulation' ? 'bg-green-500' : 'bg-blue-500'} rounded-full flex items-center justify-center`}>
                  {mechanism.type === 'burning' ? <Burn className="h-6 w-6 text-white" /> : mechanism.type === 'demand_stimulation' ? <TrendingUp className="h-6 w-6 text-white" /> : <Shield className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {mechanism.name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${mechanism.type === 'burning' ? 'bg-red-500' : mechanism.type === 'demand_stimulation' ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
                    {mechanism.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getStatusColor(mechanism.status)}`}>
                  {mechanism.status.toUpperCase()}
                </span>
                <div className={`w-2 h-2 rounded-full ${mechanism.status === 'active' ? 'bg-green-500' : mechanism.status === 'monitoring' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Threshold</span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {(mechanism.threshold * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Current Rate</span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {(mechanism.currentRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Effectiveness</span>
                <span className={`font-bold ${mechanism.effectiveness >= 90 ? 'text-green-500' : mechanism.effectiveness >= 80 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {mechanism.effectiveness}%
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {mechanism.status === 'active' ? 'Currently protecting economy' : mechanism.status === 'monitoring' ? 'Monitoring conditions' : 'Standby mode'}
                </span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderGovernance = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        🗳️ Governance System
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Governance Power
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Governance Supply</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(tokenData.powerToken.governanceSupply)} PWR
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Voting Power</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                1 PWR = 1 Vote
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Minimum for Proposal</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                1,000 PWR
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Quorum Requirement</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                10% of Circulating
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
            🎯 Proposal Types
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Protocol Changes</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                System Upgrades
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Parameter Adjustments</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Economic Tuning
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Treasury Management</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Fund Allocation
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Anti-Collapse Activation</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Emergency Measures
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'power-token': return renderPowerToken();
      case 'influence': return renderInfluence();
      case 'anti-collapse': return renderAntiCollapse();
      case 'governance': return renderGovernance();
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
              <h1 className="text-2xl font-bold text-purple-600">💎 POWER TOKEN ECONOMY</h1>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Anti-Collapse Design • Dual Currency System
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

export default PowerTokenEconomyDashboard;
