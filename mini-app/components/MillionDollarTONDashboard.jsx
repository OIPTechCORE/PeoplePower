import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, DollarSign, Users, Target, Award, Calendar,
  BarChart3, PieChart, Activity, Globe, Shield, Zap,
  Crown, Home, Gamepad2, Briefcase, Heart, Star,
  ChevronRight, AlertTriangle, CheckCircle, Info,
  Eye, Download, Filter, Search, Gem, Building,
  GraduationCap, Music, ShoppingBag, Stethoscope
} from 'lucide-react';

const MillionDollarTONDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedMechanism, setSelectedMechanism] = useState(null);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData = {
        mechanisms: [
          {
            id: 'premium_civilization_memberships',
            name: 'Premium Civilization Memberships',
            category: 'PREMIUM_ACCESS',
            icon: Crown,
            dailyTONTarget: 250000,
            currentRevenue: 243580,
            userCategories: ['ALL_USERS'],
            conversionRate: '15%',
            recurringRevenue: true,
            status: 'active',
            color: 'purple'
          },
          {
            id: 'civilization_land_ownership',
            name: 'Civilization Land & Property Ownership',
            category: 'VIRTUAL_REAL_ESTATE',
            icon: Building,
            dailyTONTarget: 200000,
            currentRevenue: 118625,
            userCategories: ['ALL_USERS', 'INVESTORS'],
            conversionRate: '12%',
            recurringRevenue: true,
            status: 'active',
            color: 'blue'
          },
          {
            id: 'advanced_skill_education',
            name: 'Advanced Skill Education & Certification',
            category: 'EDUCATION',
            icon: GraduationCap,
            dailyTONTarget: 150000,
            currentRevenue: 143650,
            userCategories: ['ALL_USERS', 'PROFESSIONALS', 'STUDENTS'],
            conversionRate: '18%',
            recurringRevenue: true,
            status: 'active',
            color: 'green'
          },
          {
            id: 'gaming_entertainment_hub',
            name: 'Gaming & Entertainment Hub',
            category: 'GAMING',
            icon: Gamepad2,
            dailyTONTarget: 125000,
            currentRevenue: 160000,
            userCategories: ['ALL_USERS', 'GAMERS', 'ENTHUSIASTS'],
            conversionRate: '25%',
            recurringRevenue: true,
            status: 'active',
            color: 'red'
          },
          {
            id: 'business_marketplace',
            name: 'Business & Services Marketplace',
            category: 'BUSINESS',
            icon: Briefcase,
            dailyTONTarget: 100000,
            currentRevenue: 96500,
            userCategories: ['BUSINESSES', 'ENTREPRENEURS', 'FREELANCERS'],
            conversionRate: '10%',
            recurringRevenue: true,
            status: 'active',
            color: 'orange'
          },
          {
            id: 'social_influence_platform',
            name: 'Social Influence & Creator Economy',
            category: 'SOCIAL',
            icon: Star,
            dailyTONTarget: 75000,
            currentRevenue: 76000,
            userCategories: ['CREATORS', 'INFLUENCERS', 'SOCIAL_USERS'],
            conversionRate: '20%',
            recurringRevenue: true,
            status: 'active',
            color: 'pink'
          },
          {
            id: 'health_wellness_services',
            name: 'Health & Wellness Services',
            category: 'HEALTH',
            icon: Stethoscope,
            dailyTONTarget: 50000,
            currentRevenue: 50000,
            userCategories: ['ALL_USERS', 'HEALTH_CONSCIOUS'],
            conversionRate: '12%',
            recurringRevenue: true,
            status: 'active',
            color: 'emerald'
          },
          {
            id: 'luxury_lifestyle_experiences',
            name: 'Luxury Lifestyle & Experiences',
            category: 'LUXURY',
            icon: Gem,
            dailyTONTarget: 50000,
            currentRevenue: 50000,
            userCategories: ['HIGH_NET_WORTH', 'LUXURY_CONSUMERS'],
            conversionRate: '5%',
            recurringRevenue: true,
            status: 'active',
            color: 'yellow'
          }
        ],
        projections: {
          immediateRevenue: {
            day1: 250000,
            week1: 1750000,
            month1: 7500000,
            targetAchieved: true
          },
          scalingProjections: {
            month3: 15000000,
            month6: 25000000,
            month12: 50000000,
            month24: 100000000
          },
          superAdminRevenue: {
            directCommission: '20%',
            dailyIncome: 187671,
            monthlyIncome: 5630130,
            yearlyIncome: 67691595,
            targetAchievement: '187.67%'
          }
        }
      };
      
      setRevenueData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      setLoading(false);
    }
  };

  const formatTON = (amount) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M TON`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K TON`;
    return `${amount} TON`;
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'text-green-500',
      'development': 'text-yellow-500',
      'planned': 'text-blue-500'
    };
    return colors[status] || 'text-gray-500';
  };

  const getCategoryColor = (color) => {
    const colors = {
      'purple': 'bg-purple-500',
      'blue': 'bg-blue-500',
      'green': 'bg-green-500',
      'red': 'bg-red-500',
      'orange': 'bg-orange-500',
      'pink': 'bg-pink-500',
      'emerald': 'bg-emerald-500',
      'yellow': 'bg-yellow-500'
    };
    return colors[color] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className={`mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading Million TON Dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'mechanisms', name: 'Mechanisms', icon: Zap },
    { id: 'projections', name: 'Projections', icon: TrendingUp },
    { id: 'analytics', name: 'Analytics', icon: PieChart }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Main Target Achievement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-xl text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">🎯 1M TON/DAY TARGET ACHIEVED!</h2>
            <p className="text-blue-100 text-lg">Current Daily Income: {formatTON(revenueData.projections.superAdminRevenue.dailyIncome)}</p>
            <p className="text-blue-200 text-sm mt-2">Target Achievement: {revenueData.projections.superAdminRevenue.targetAchievement}</p>
          </div>
          <div className="text-right">
            <TrendingUp className="h-16 w-16 text-blue-200" />
            <p className="text-2xl font-bold mt-2">187.67%</p>
          </div>
        </div>
      </motion.div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Daily Revenue</p>
              <p className="text-3xl font-bold">{formatTON(revenueData.projections.superAdminRevenue.dailyIncome)}</p>
              <p className="text-green-100 text-xs">Super Admin Income</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-200" />
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
              <p className="text-purple-100 text-sm">Monthly Revenue</p>
              <p className="text-3xl font-bold">{formatTON(revenueData.projections.superAdminRevenue.monthlyIncome)}</p>
              <p className="text-purple-100 text-xs">Projected Monthly</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-200" />
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
              <p className="text-orange-100 text-sm">Yearly Revenue</p>
              <p className="text-3xl font-bold">{formatTON(revenueData.projections.superAdminRevenue.yearlyIncome)}</p>
              <p className="text-orange-100 text-xs">Annual Projection</p>
            </div>
            <Award className="h-8 w-8 text-orange-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm">Commission Rate</p>
              <p className="text-3xl font-bold">{revenueData.projections.superAdminRevenue.directCommission}</p>
              <p className="text-cyan-100 text-xs">Super Admin Cut</p>
            </div>
            <Target className="h-8 w-8 text-cyan-200" />
          </div>
        </motion.div>
      </div>

      {/* Mechanism Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🚀 Top Performing Mechanisms
          </h3>
          <div className="space-y-3">
            {revenueData.mechanisms.slice(0, 5).map((mechanism) => {
              const Icon = mechanism.icon;
              return (
                <div key={mechanism.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${getCategoryColor(mechanism.color)} rounded-full flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className={`text-white text-sm font-medium`}>{mechanism.name}</p>
                      <p className="text-gray-400 text-xs">{mechanism.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">{formatTON(mechanism.currentRevenue)}</p>
                    <p className="text-gray-400 text-xs">{mechanism.conversionRate}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📈 Scaling Projections
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Month 3</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatTON(revenueData.projections.scalingProjections.month3)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Month 6</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatTON(revenueData.projections.scalingProjections.month6)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Month 12</span>
              <span className={`font-bold text-green-500`}>
                {formatTON(revenueData.projections.scalingProjections.month12)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Month 24</span>
              <span className={`font-bold text-purple-500`}>
                {formatTON(revenueData.projections.scalingProjections.month24)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderMechanisms = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          💰 Revenue Mechanisms
        </h2>
        <div className="flex space-x-2">
          <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-gray-600`}>
            <Filter className="h-5 w-5 text-gray-400" />
          </button>
          <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-gray-600`}>
            <Search className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {revenueData.mechanisms.map((mechanism) => {
          const Icon = mechanism.icon;
          return (
            <motion.div
              key={mechanism.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg cursor-pointer`}
              onClick={() => setSelectedMechanism(mechanism)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${getCategoryColor(mechanism.color)} rounded-full flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {mechanism.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(mechanism.color)} text-white`}>
                      {mechanism.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getStatusColor(mechanism.status)}`}>
                    {mechanism.status}
                  </span>
                  {mechanism.recurringRevenue && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Target Revenue</span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatTON(mechanism.dailyTONTarget)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Current Revenue</span>
                  <span className={`font-bold text-green-500`}>
                    {formatTON(mechanism.currentRevenue)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Conversion Rate</span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {mechanism.conversionRate}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {mechanism.userCategories.slice(0, 3).map((category, index) => (
                      <div key={index} className={`w-6 h-6 rounded-full ${getCategoryColor(mechanism.color)} flex items-center justify-center text-xs text-white border-2 border-gray-800`}>
                        {category[0]}
                      </div>
                    ))}
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderProjections = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        📊 Revenue Projections
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🎯 Immediate Revenue Targets
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Day 1</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatTON(revenueData.projections.immediateRevenue.day1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Week 1</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatTON(revenueData.projections.immediateRevenue.week1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Month 1</span>
              <span className={`font-bold text-green-500`}>
                {formatTON(revenueData.projections.immediateRevenue.month1)}
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
            🚀 Scaling Trajectory
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>3 Months</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatTON(revenueData.projections.scalingProjections.month3)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>6 Months</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatTON(revenueData.projections.scalingProjections.month6)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>12 Months</span>
              <span className={`font-bold text-purple-500`}>
                {formatTON(revenueData.projections.scalingProjections.month12)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>24 Months</span>
              <span className={`font-bold text-blue-500`}>
                {formatTON(revenueData.projections.scalingProjections.month24)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        📈 Performance Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Target Achievement
            </h3>
          </div>
          <p className="text-green-500 font-bold text-2xl mb-2">187.67%</p>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            1M TON/day target exceeded
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Active Mechanisms
            </h3>
          </div>
          <p className="text-blue-500 font-bold text-2xl mb-2">8/8</p>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            All mechanisms operational
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              User Categories
            </h3>
          </div>
          <p className="text-purple-500 font-bold text-2xl mb-2">8+</p>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Diverse user segments
          </p>
        </motion.div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'mechanisms': return renderMechanisms();
      case 'projections': return renderProjections();
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
              <h1 className="text-2xl font-bold text-blue-600">💰 1M TON/DAY REVENUE DASHBOARD</h1>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Million Dollar TON Revenue Ecosystem
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
                      ? 'border-blue-500 text-blue-600'
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

export default MillionDollarTONDashboard;
