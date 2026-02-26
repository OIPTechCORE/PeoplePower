import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, TrendingUp, Users, Target, Award, Calendar,
  DollarSign, Globe, Shield, Star, ChevronRight, Plus,
  Filter, Search, Bell, Settings, BarChart3, Gift
} from 'lucide-react';

const CharityDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [charityData, setCharityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetchCharityData();
  }, []);

  const fetchCharityData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData = {
        ecosystem: {
          id: 'charity_001',
          playerId: 'player_001',
          giverRank: 'PHILANTHROPIST',
          impactScore: 2847,
          generosityLevel: 'ESTABLISHED',
          totalDonated: 1250,
          livesImpacted: 13,
          projectsFunded: 7,
          communitiesHelped: 5,
          joinedAt: '2024-01-15',
          lastDonationAt: '2024-02-20'
        },
        donationHistory: [
          {
            id: 'donation_001',
            charityId: 'charity_001',
            amount: 100,
            currency: 'PWR_TOKEN',
            cause: 'EDUCATION',
            isAnonymous: false,
            message: 'Supporting education for all',
            impactDescription: 'Provides 1 month of education for 1 student',
            timestamp: '2024-02-20T10:30:00Z',
            charityName: 'Education for All Foundation',
            charityLogo: '/logos/education-foundation.png'
          },
          {
            id: 'donation_002',
            charityId: 'charity_002',
            amount: 50,
            currency: 'PWR_TOKEN',
            cause: 'HEALTHCARE',
            isAnonymous: true,
            message: 'Healthcare is a human right',
            impactDescription: 'Funds 1 medical consultation',
            timestamp: '2024-02-18T14:20:00Z',
            charityName: 'Global Health Initiative',
            charityLogo: '/logos/health-initiative.png'
          }
        ],
        recurringDonations: [
          {
            id: 'recurring_001',
            charityId: 'charity_003',
            amount: 25,
            currency: 'PWR_TOKEN',
            frequency: 'MONTHLY',
            nextDonationDate: '2024-03-01T00:00:00Z',
            isActive: true,
            charityName: 'Clean Water Project'
          }
        ],
        supportedCauses: [
          {
            causeId: 'education',
            name: 'Education',
            category: 'EDUCATION',
            totalDonated: 750,
            donationCount: 5
          },
          {
            causeId: 'healthcare',
            name: 'Healthcare',
            category: 'HEALTHCARE',
            totalDonated: 300,
            donationCount: 3
          },
          {
            causeId: 'environment',
            name: 'Environment',
            category: 'ENVIRONMENT',
            totalDonated: 200,
            donationCount: 2
          }
        ],
        badges: [
          {
            id: 'badge_001',
            name: 'First Donation',
            description: 'Made your first donation',
            icon: '🎯',
            rarity: 'COMMON',
            earnedAt: '2024-01-15T10:00:00Z',
            criteria: 'Complete first donation'
          },
          {
            id: 'badge_002',
            name: 'Philanthropist',
            description: 'Donated over 1000 tokens',
            icon: '💎',
            rarity: 'RARE',
            earnedAt: '2024-02-10T15:30:00Z',
            criteria: 'Donate 1000+ tokens total'
          }
        ]
      };
      
      setCharityData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching charity data:', error);
      setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    const colors = {
      'HELPER': 'text-gray-400',
      'SUPPORTER': 'text-green-400',
      'CONTRIBUTOR': 'text-blue-400',
      'PHILANTHROPIST': 'text-purple-400',
      'BENEFACTOR': 'text-yellow-400',
      'HUMANITARIAN': 'text-orange-400',
      'CHAMPION': 'text-red-400',
      'LEGEND': 'text-purple-600'
    };
    return colors[rank] || 'text-gray-400';
  };

  const getLevelColor = (level) => {
    const colors = {
      'EMERGING': 'bg-green-500',
      'GROWING': 'bg-blue-500',
      'ESTABLISHED': 'bg-purple-500',
      'EXCEPTIONAL': 'bg-yellow-500',
      'EXTRAORDINARY': 'bg-orange-500',
      'LEGENDARY': 'bg-red-500'
    };
    return colors[level] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
          <p className={`mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading Charity Dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Heart },
    { id: 'donations', name: 'Donations', icon: DollarSign },
    { id: 'causes', name: 'Causes', icon: Globe },
    { id: 'badges', name: 'Achievements', icon: Award },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-pink-500 to-purple-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Total Donated</p>
              <p className="text-3xl font-bold">{charityData.ecosystem.totalDonated}</p>
              <p className="text-pink-100 text-sm">PWR Tokens</p>
            </div>
            <Heart className="h-8 w-8 text-pink-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Lives Impacted</p>
              <p className="text-3xl font-bold">{charityData.ecosystem.livesImpacted}</p>
              <p className="text-blue-100 text-sm">Direct Impact</p>
            </div>
            <Users className="h-8 w-8 text-blue-200" />
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
              <p className="text-green-100 text-sm">Projects Funded</p>
              <p className="text-3xl font-bold">{charityData.ecosystem.projectsFunded}</p>
              <p className="text-green-100 text-sm">Active Projects</p>
            </div>
            <Target className="h-8 w-8 text-green-200" />
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
              <p className="text-orange-100 text-sm">Impact Score</p>
              <p className="text-3xl font-bold">{charityData.ecosystem.impactScore}</p>
              <p className="text-orange-100 text-sm">Social Points</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Rank & Level */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🏆 Giver Rank
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-3xl font-bold ${getRankColor(charityData.ecosystem.giverRank)}`}>
                {charityData.ecosystem.giverRank}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Current Rank
              </p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {1250} / 2000
              </p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '62.5%'}}></div>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                To BENEFACTOR
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            💝 Generosity Level
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {charityData.ecosystem.generosityLevel}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Current Level
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full ${getLevelColor(charityData.ecosystem.generosityLevel)} text-white text-sm font-semibold`}>
              ESTABLISHED
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
      >
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📊 Recent Donations
        </h3>
        <div className="space-y-3">
          {charityData.donationHistory.slice(0, 3).map((donation, index) => (
            <div key={donation.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {donation.charityName}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {donation.impactDescription}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {donation.amount} PWR
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date(donation.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderDonations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Donation History
        </h2>
        <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Donation</span>
        </button>
      </div>

      <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Charity
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Amount
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Cause
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Impact
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {charityData.donationHistory.map((donation) => (
                <tr key={donation.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                        <Heart className="h-4 w-4 text-pink-600" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {donation.charityName}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {donation.isAnonymous ? 'Anonymous' : 'Public'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {donation.amount} {donation.currency}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                      {donation.cause}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {donation.impactDescription}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {new Date(donation.timestamp).toLocaleDateString()}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCauses = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Supported Causes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charityData.supportedCauses.map((cause) => (
          <motion.div
            key={cause.causeId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                {cause.category}
              </span>
            </div>
            <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {cause.name}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Donated
                </span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {cause.totalDonated} PWR
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Donations Count
                </span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {cause.donationCount}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderBadges = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Achievement Badges
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charityData.badges.map((badge) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}
          >
            <div className="text-6xl mb-4">{badge.icon}</div>
            <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {badge.name}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
              {badge.description}
            </p>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 text-xs rounded-full ${
                badge.rarity === 'COMMON' ? 'bg-gray-500' :
                badge.rarity === 'RARE' ? 'bg-blue-500' :
                badge.rarity === 'EPIC' ? 'bg-purple-500' :
                'bg-orange-500'
              } text-white`}>
                {badge.rarity}
              </span>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {new Date(badge.earnedAt).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Giving Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Monthly Trends
          </h3>
          <div className="h-64 flex items-center justify-center">
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Chart visualization coming soon...
            </p>
          </div>
        </div>

        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Cause Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Pie chart coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'donations': return renderDonations();
      case 'causes': return renderCauses();
      case 'badges': return renderBadges();
      case 'analytics': return renderAnalytics();
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
              <h1 className="text-2xl font-bold text-pink-600">💝 Charity Dashboard</h1>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Make a difference, one donation at a time
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-gray-600`}>
                <Bell className="h-5 w-5 text-gray-400" />
              </button>
              <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-gray-600`}>
                <Settings className="h-5 w-5 text-gray-400" />
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
                      ? 'border-pink-500 text-pink-600'
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

export default CharityDashboard;
