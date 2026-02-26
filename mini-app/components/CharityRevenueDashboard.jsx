import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, DollarSign, Users, Target, Award, Calendar,
  BarChart3, PieChart, Activity, Globe, Shield, Zap,
  ChevronRight, AlertTriangle, CheckCircle, Info,
  Eye, Download, Filter, Search
} from 'lucide-react';

const CharityRevenueDashboard = () => {
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
            id: 'charity_treasury_yield',
            name: 'Charity Treasury Yield Farming',
            category: 'TREASURY',
            potentialValue: 'Billions',
            beneficiaries: ['CHARITY_TREASURY', 'POWER_TOKEN', 'FOUNDERS'],
            riskLevel: 'LOW',
            expectedReturns: '15-25%',
            currentRevenue: 150000000,
            projectedRevenue: 50000000000,
            status: 'active'
          },
          {
            id: 'impact_bond_issuance',
            name: 'Impact Bond Issuance Platform',
            category: 'FINANCIAL_INSTRUMENTS',
            potentialValue: 'Hundreds of Billions',
            beneficiaries: ['ALL_USERS', 'CHARITY_TREASURY', 'POWER_TOKEN', 'FOUNDERS'],
            riskLevel: 'MEDIUM',
            expectedReturns: '8-15%',
            currentRevenue: 50000000,
            projectedRevenue: 25000000000,
            status: 'active'
          },
          {
            id: 'charity_nft_marketplace',
            name: 'Charity NFT Marketplace',
            category: 'DIGITAL_ASSETS',
            potentialValue: 'Tens of Billions',
            beneficiaries: ['ALL_USERS', 'CHARITY_TREASURY', 'POWER_TOKEN', 'FOUNDERS'],
            riskLevel: 'LOW',
            expectedReturns: '5-15%',
            currentRevenue: 25000000,
            projectedRevenue: 10000000000,
            status: 'active'
          },
          {
            id: 'social_impact_derivatives',
            name: 'Social Impact Derivatives',
            category: 'FINANCIAL_DERIVATIVES',
            potentialValue: 'Hundreds of Billions',
            beneficiaries: ['POWER_TOKEN', 'FOUNDERS', 'CHARITY_TREASURY'],
            riskLevel: 'HIGH',
            expectedReturns: '20-50%',
            currentRevenue: 100000000,
            projectedRevenue: 50000000000,
            status: 'development'
          },
          {
            id: 'charity_staking_pools',
            name: 'Charity Staking Pools',
            category: 'STAKING',
            potentialValue: 'Billions',
            beneficiaries: ['ALL_USERS', 'CHARITY_TREASURY', 'POWER_TOKEN'],
            riskLevel: 'LOW',
            expectedReturns: '8-20%',
            currentRevenue: 75000000,
            projectedRevenue: 10000000000,
            status: 'active'
          }
        ],
        projections: {
          year1Revenue: 515000000,
          year3Revenue: 2675000000,
          year5Revenue: 8925000000,
          year10Revenue: 32500000000,
          totalPotential: 205000000000
        },
        beneficiaryAnalysis: {
          ALL_USERS: {
            estimatedValue: '75000000000',
            directBenefits: ['Staking rewards (8-20% APY)', 'Impact token appreciation', 'Microinsurance access'],
            mechanisms: ['charity_staking_pools', 'charity_nft_marketplace', 'carbon_credit_trading']
          },
          CHARITY_TREASURY: {
            estimatedValue: '125000000000',
            directBenefits: ['Yield farming income (15-25% APY)', 'Bond issuance fees (2%)', 'Marketplace fees (5-10%)'],
            mechanisms: ['charity_treasury_yield', 'impact_bond_issuance', 'charity_nft_marketplace']
          },
          POWER_TOKEN: {
            estimatedValue: '150000000000',
            directBenefits: ['Increased token demand', 'Staking utility', 'Governance rights'],
            mechanisms: ['charity_staking_pools', 'social_impact_derivatives', 'social_impact_tokens']
          },
          FOUNDERS: {
            estimatedValue: '37500000000',
            directBenefits: ['Platform revenue sharing (10-20%)', 'Token appreciation', 'Equity in ventures'],
            mechanisms: ['All mechanisms with revenue sharing']
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

  const formatCurrency = (amount) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount}`;
  };

  const getRiskColor = (level) => {
    const colors = {
      'LOW': 'text-green-500',
      'MEDIUM': 'text-yellow-500',
      'HIGH': 'text-red-500',
      'CRITICAL': 'text-red-600'
    };
    return colors[level] || 'text-gray-500';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'TREASURY': 'bg-blue-500',
      'FINANCIAL_INSTRUMENTS': 'bg-purple-500',
      'DIGITAL_ASSETS': 'bg-pink-500',
      'FINANCIAL_DERIVATIVES': 'bg-red-500',
      'STAKING': 'bg-green-500',
      'ENVIRONMENTAL_MARKETS': 'bg-emerald-500',
      'INSURANCE': 'bg-orange-500',
      'VENTURE_CAPITAL': 'bg-indigo-500',
      'TOKENIZATION': 'bg-cyan-500',
      'DATA_MONETIZATION': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          <p className={`mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading Revenue Dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'mechanisms', name: 'Mechanisms', icon: Zap },
    { id: 'beneficiaries', name: 'Beneficiaries', icon: Users },
    { id: 'projections', name: 'Projections', icon: TrendingUp },
    { id: 'analysis', name: 'Analysis', icon: PieChart }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Total Potential Value */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-xl text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">TRILLION-DOLLAR REVENUE ECOSYSTEM</h2>
            <p className="text-green-100 text-lg">Total Potential Value: {formatCurrency(revenueData.projections.totalPotential)}</p>
            <p className="text-green-200 text-sm mt-2">10-Year Projection • 10 Revenue Mechanisms • 4 Beneficiary Categories</p>
          </div>
          <DollarSign className="h-16 w-16 text-green-200" />
        </div>
      </motion.div>

      {/* Revenue Projections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Year 1 Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(revenueData.projections.year1Revenue)}</p>
              <p className="text-blue-100 text-xs">Initial deployment</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-200" />
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
              <p className="text-purple-100 text-sm">Year 3 Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(revenueData.projections.year3Revenue)}</p>
              <p className="text-purple-100 text-xs">Expansion phase</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-200" />
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
              <p className="text-orange-100 text-sm">Year 5 Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(revenueData.projections.year5Revenue)}</p>
              <p className="text-orange-100 text-xs">Maturity phase</p>
            </div>
            <Target className="h-8 w-8 text-orange-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Year 10 Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(revenueData.projections.year10Revenue)}</p>
              <p className="text-indigo-100 text-xs">Dominance phase</p>
            </div>
            <Award className="h-8 w-8 text-indigo-200" />
          </div>
        </motion.div>
      </div>

      {/* Beneficiary Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🎯 Beneficiary Impact
          </h3>
          <div className="space-y-3">
            {Object.entries(revenueData.beneficiaryAnalysis).map(([beneficiary, data]) => (
              <div key={beneficiary} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {beneficiary.replace('_', ' ')}
                  </h4>
                  <span className="text-green-500 font-bold">
                    {formatCurrency(parseInt(data.estimatedValue))}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.directBenefits.slice(0, 2).map((benefit, index) => (
                    <span key={index} className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                      {benefit}
                    </span>
                  ))}
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
            📊 Revenue Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Active Mechanisms</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {revenueData.mechanisms.filter(m => m.status === 'active').length} / {revenueData.mechanisms.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Risk Distribution</span>
              <div className="flex space-x-2">
                <span className="text-green-500 text-sm">LOW: 4</span>
                <span className="text-yellow-500 text-sm">MED: 3</span>
                <span className="text-red-500 text-sm">HIGH: 3</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Expected Annual Returns</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                8-50% APY
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Beneficiaries</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                4 Categories
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
        {revenueData.mechanisms.map((mechanism) => (
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
                <div className={`w-12 h-12 ${getCategoryColor(mechanism.category)} rounded-full flex items-center justify-center`}>
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {mechanism.name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(mechanism.category)} text-white`}>
                    {mechanism.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getRiskColor(mechanism.riskLevel)}`}>
                  {mechanism.riskLevel}
                </span>
                <div className={`w-2 h-2 rounded-full ${mechanism.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Potential Value</span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {mechanism.potentialValue}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Expected Returns</span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {mechanism.expectedReturns}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Current Revenue</span>
                <span className={`font-bold text-green-500`}>
                  {formatCurrency(mechanism.currentRevenue)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {mechanism.beneficiaries.slice(0, 3).map((beneficiary, index) => (
                    <div key={index} className={`w-6 h-6 rounded-full ${getCategoryColor(beneficiary)} flex items-center justify-center text-xs text-white border-2 border-gray-800`}>
                      {beneficiary[0]}
                    </div>
                  ))}
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderBeneficiaries = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        👥 Beneficiary Analysis
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(revenueData.beneficiaryAnalysis).map(([beneficiary, data]) => (
          <motion.div
            key={beneficiary}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {beneficiary.replace('_', ' ')}
              </h3>
              <span className="text-green-500 font-bold text-lg">
                {formatCurrency(parseInt(data.estimatedValue))}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Direct Benefits
                </h4>
                <div className="space-y-2">
                  {data.directBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Active Mechanisms
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.mechanisms.map((mechanism, index) => (
                    <span key={index} className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                      {mechanism.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderProjections = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        📈 Revenue Projections
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 10-Year Projection
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Year 1</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(revenueData.projections.year1Revenue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Year 3</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(revenueData.projections.year3Revenue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Year 5</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(revenueData.projections.year5Revenue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Year 10</span>
              <span className={`font-bold text-green-500`}>
                {formatCurrency(revenueData.projections.year10Revenue)}
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
            🎯 Growth Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>CAGR (10Y)</span>
              <span className={`font-bold text-green-500`}>
                52.3%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Total Potential</span>
              <span className={`font-bold text-purple-500`}>
                {formatCurrency(revenueData.projections.totalPotential)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Mechanisms</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                10 Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Beneficiaries</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                4 Categories
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        🔍 Risk & Analysis
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
              Low Risk
            </h3>
          </div>
          <p className="text-green-500 font-bold text-lg mb-2">4 Mechanisms</p>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Stable returns with minimal volatility
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Medium Risk
            </h3>
          </div>
          <p className="text-yellow-500 font-bold text-lg mb-2">3 Mechanisms</p>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Balanced risk-reward profile
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              High Risk
            </h3>
          </div>
          <p className="text-red-500 font-bold text-lg mb-2">3 Mechanisms</p>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              High potential returns with increased volatility
          </p>
        </motion.div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'mechanisms': return renderMechanisms();
      case 'beneficiaries': return renderBeneficiaries();
      case 'projections': return renderProjections();
      case 'analysis': return renderAnalysis();
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
              <h1 className="text-2xl font-bold text-green-600">💰 TRILLION-DOLLAR REVENUE DASHBOARD</h1>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                World-Class Charity Revenue Ecosystem
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

export default CharityRevenueDashboard;
