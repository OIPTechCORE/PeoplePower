import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Users, DollarSign, GraduationCap, 
  Server, BalanceScale, Network, Map, 
  Shield, Brain, Zap, Settings,
  Activity, TrendingUp, AlertTriangle, CheckCircle,
  Heart, BarChart3, Target
} from 'lucide-react';

const SuperFuturisticDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeDomain, setActiveDomain] = useState('civilization');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const credentials = sessionStorage.getItem('adminCredentials');
    if (credentials) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className={`mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Initializing Super Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🔐 Authentication Required
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
            Please login to access the Super Admin Dashboard
          </p>
          <a 
            href="/admin/login.html"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-block transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const controlDomains = [
    { id: 'civilization', name: 'Civilization Overview', icon: Globe, color: 'blue' },
    { id: 'population', name: 'Population Control', icon: Users, color: 'green' },
    { id: 'economy', name: 'Economic Command', icon: DollarSign, color: 'yellow' },
    { id: 'education', name: 'Education Ecosystem', icon: GraduationCap, color: 'purple' },
    { id: 'infrastructure', name: 'Infrastructure', icon: Server, color: 'red' },
    { id: 'governance', name: 'Governance Control', icon: BalanceScale, color: 'indigo' },
    { id: 'network', name: 'Global Network', icon: Network, color: 'pink' },
    { id: 'worldmap', name: 'Living World Map', icon: Map, color: 'orange' },
    { id: 'ecosystem', name: 'Ecosystem Integration', icon: Settings, color: 'teal' },
    { id: 'charity', name: 'Charity Command', icon: Heart, color: 'pink' },
    { id: 'charity_revenue', name: 'Charity Revenue', icon: BarChart3, color: 'green' },
    { id: 'million_ton_revenue', name: '1M TON Revenue', icon: Target, color: 'blue' },
    { id: 'security', name: 'Security Command', icon: Shield, color: 'red' },
    { id: 'analytics', name: 'Analytics & Intelligence', icon: Brain, color: 'cyan' },
    { id: 'automation', name: 'Automation & AI', icon: Zap, color: 'lime' }
  ];

  const renderDashboardContent = () => {
    switch (activeDomain) {
      case 'civilization':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">🌍 Civilization Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Total Population</h3>
                <p className="text-3xl font-bold text-white">1,234,567</p>
                <p className="text-green-400 text-sm">↑ 12.3% this month</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Active Countries</h3>
                <p className="text-3xl font-bold text-white">47</p>
                <p className="text-green-400 text-sm">↑ 3 new this week</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Civilization Health</h3>
                <p className="text-3xl font-bold text-white">94.2%</p>
                <p className="text-green-400 text-sm">Optimal</p>
              </div>
            </div>
          </div>
        );
      
      case 'economy':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">💰 Economic Command</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Daily Revenue Target</h3>
                <p className="text-3xl font-bold text-white">100,000 TON</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
                <p className="text-green-400 text-sm mt-1">78,000 TON (78%)</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Total Economy Value</h3>
                <p className="text-3xl font-bold text-white">2.3M TON</p>
                <p className="text-green-400 text-sm">↑ 23% growth</p>
              </div>
            </div>
          </div>
        );

      case 'charity':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">💝 Charity Command</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-pink-400 mb-2">Total Donations</h3>
                <p className="text-3xl font-bold text-white">2.5M PWR</p>
                <p className="text-green-400 text-sm">↑ 18% this month</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Active Charities</h3>
                <p className="text-3xl font-bold text-white">156</p>
                <p className="text-green-400 text-sm">↑ 12 new this week</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Lives Impacted</h3>
                <p className="text-3xl font-bold text-white">45,678</p>
                <p className="text-green-400 text-sm">↑ 23% growth</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Charity Challenges</h3>
                <p className="text-3xl font-bold text-white">8</p>
                <p className="text-green-400 text-sm">3 active</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Top Donors</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">LegendaryGiver</span>
                    <span className="text-pink-400 font-bold">125,000 PWR</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">CharityHero</span>
                    <span className="text-pink-400 font-bold">98,500 PWR</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">KindSoul</span>
                    <span className="text-pink-400 font-bold">76,200 PWR</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Trending Causes</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Education</span>
                    <span className="text-green-400 font-bold">845K PWR</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Healthcare</span>
                    <span className="text-green-400 font-bold">623K PWR</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Environment</span>
                    <span className="text-green-400 font-bold">512K PWR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'charity_revenue':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">💰 TRILLION-DOLLAR REVENUE ECOSYSTEM</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Total Potential</h3>
                <p className="text-3xl font-bold text-white">$205B</p>
                <p className="text-green-400 text-sm">10-year projection</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Active Mechanisms</h3>
                <p className="text-3xl font-bold text-white">10</p>
                <p className="text-green-400 text-sm">All operational</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Year 1 Revenue</h3>
                <p className="text-3xl font-bold text-white">$515M</p>
                <p className="text-green-400 text-sm">Initial deployment</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Beneficiaries</h3>
                <p className="text-3xl font-bold text-white">4</p>
                <p className="text-green-400 text-sm">All categories</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Top Revenue Mechanisms</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Treasury Yield Farming</span>
                    <span className="text-green-400 font-bold">$50B</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Social Impact Derivatives</span>
                    <span className="text-green-400 font-bold">$50B</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Impact Bonds</span>
                    <span className="text-green-400 font-bold">$25B</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Beneficiary Distribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">POWER TOKEN</span>
                    <span className="text-blue-400 font-bold">$150B</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">CHARITY TREASURY</span>
                    <span className="text-blue-400 font-bold">$125B</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">ALL USERS</span>
                    <span className="text-blue-400 font-bold">$75B</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Revenue Mechanisms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Treasury Yield Farming', returns: '15-25%', risk: 'LOW' },
                  { name: 'Impact Bonds', returns: '8-15%', risk: 'MEDIUM' },
                  { name: 'NFT Marketplace', returns: '5-15%', risk: 'LOW' },
                  { name: 'Social Derivatives', returns: '20-50%', risk: 'HIGH' },
                  { name: 'Staking Pools', returns: '8-20%', risk: 'LOW' },
                  { name: 'Carbon Trading', returns: '10-30%', risk: 'LOW' }
                ].map((mechanism, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">{mechanism.name}</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">{mechanism.returns}</span>
                      <span className={`${mechanism.risk === 'LOW' ? 'text-green-400' : mechanism.risk === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'}`}>
                        {mechanism.risk}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'million_ton_revenue':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">🎯 1M TON/DAY REVENUE ECOSYSTEM</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-lg text-white">
                <h3 className="text-lg font-semibold text-blue-100 mb-2">Daily Income</h3>
                <p className="text-3xl font-bold">187.7K TON</p>
                <p className="text-green-400 text-sm">187.67% of target</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-lg text-white">
                <h3 className="text-lg font-semibold text-green-100 mb-2">Monthly Income</h3>
                <p className="text-3xl font-bold">5.63M TON</p>
                <p className="text-green-400 text-sm">Recurring revenue</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-lg text-white">
                <h3 className="text-lg font-semibold text-orange-100 mb-2">Yearly Income</h3>
                <p className="text-3xl font-bold">67.7M TON</p>
                <p className="text-green-400 text-sm">Annual projection</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-lg text-white">
                <h3 className="text-lg font-semibold text-purple-100 mb-2">Commission Rate</h3>
                <p className="text-3xl font-bold">20%</p>
                <p className="text-green-400 text-sm">Super Admin cut</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Top Revenue Mechanisms</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Premium Memberships</span>
                    <span className="text-green-400 font-bold">243.6K TON</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Gaming & Entertainment</span>
                    <span className="text-green-400 font-bold">160K TON</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Advanced Education</span>
                    <span className="text-green-400 font-bold">143.7K TON</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Virtual Real Estate</span>
                    <span className="text-green-400 font-bold">118.6K TON</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Scaling Projections</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Month 3</span>
                    <span className="text-green-400 font-bold">15M TON/day</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Month 6</span>
                    <span className="text-green-400 font-bold">25M TON/day</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Month 12</span>
                    <span className="text-green-400 font-bold">50M TON/day</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Month 24</span>
                    <span className="text-green-400 font-bold">100M TON/day</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Revenue Mechanisms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Premium Memberships', revenue: '243.6K TON', status: 'active' },
                  { name: 'Virtual Real Estate', revenue: '118.6K TON', status: 'active' },
                  { name: 'Advanced Education', revenue: '143.7K TON', status: 'active' },
                  { name: 'Gaming Hub', revenue: '160K TON', status: 'active' },
                  { name: 'Business Marketplace', revenue: '96.5K TON', status: 'active' },
                  { name: 'Social Influence', revenue: '76K TON', status: 'active' },
                  { name: 'Health & Wellness', revenue: '50K TON', status: 'active' },
                  { name: 'Luxury Experiences', revenue: '50K TON', status: 'active' }
                ].map((mechanism, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">{mechanism.name}</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">{mechanism.revenue}</span>
                      <span className="text-green-400">●</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              {controlDomains.find(d => d.id === activeDomain)?.name}
            </h2>
            <div className="bg-gray-800 p-8 rounded-lg text-center">
              <p className="text-gray-400">This control domain is under development</p>
              <p className="text-gray-500 text-sm mt-2">Advanced features coming soon</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">👑 PEOPLE POWER</h1>
              <span className="text-gray-400">Super Admin Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 min-h-screen">
          <nav className="p-4">
            <h3 className="text-gray-400 text-sm font-semibold mb-4">CONTROL DOMAINS</h3>
            <div className="space-y-2">
              {controlDomains.map((domain) => {
                const Icon = domain.icon;
                return (
                  <motion.button
                    key={domain.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveDomain(domain.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeDomain === domain.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{domain.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderDashboardContent()}
        </main>
      </div>
    </div>
  );
};

export default SuperFuturisticDashboard;
