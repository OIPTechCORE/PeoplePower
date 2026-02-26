import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Search, Filter, Star, Globe, Shield, Users,
  DollarSign, Calendar, TrendingUp, Award, ChevronRight,
  Eye, MessageSquare, Bookmark, Share2, ExternalLink,
  X, Menu, Home, Gift, User, Settings
} from 'lucide-react';

const MobileCharityApp = () => {
  const [activeView, setActiveView] = useState('home');
  const [charities, setCharities] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetchCharityData();
  }, []);

  const fetchCharityData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCharities = [
        {
          id: 'charity_001',
          name: 'Education for All Foundation',
          description: 'Providing quality education to underprivileged children worldwide',
          category: 'EDUCATION',
          logo: '/logos/education-foundation.png',
          verified: true,
          rating: 4.8,
          totalDonationsReceived: 250000,
          projects: [
            {
              id: 'project_001',
              title: 'School Building Initiative',
              description: 'Build 100 schools in rural areas',
              targetAmount: 500000,
              currentAmount: 325000,
              deadline: '2024-12-31'
            }
          ]
        },
        {
          id: 'charity_002',
          name: 'Global Health Initiative',
          description: 'Bringing healthcare to remote communities',
          category: 'HEALTHCARE',
          logo: '/logos/health-initiative.png',
          verified: true,
          rating: 4.9,
          totalDonationsReceived: 180000,
          projects: [
            {
              id: 'project_002',
              title: 'Mobile Clinics Program',
              description: 'Deploy 50 mobile clinics',
              targetAmount: 300000,
              currentAmount: 180000,
              deadline: '2024-10-31'
            }
          ]
        }
      ];

      const mockHistory = [
        {
          id: 'donation_001',
          charityName: 'Education for All Foundation',
          amount: 100,
          date: '2024-02-20',
          impact: 'Provides 1 month of education for 1 student',
          category: 'EDUCATION'
        },
        {
          id: 'donation_002',
          charityName: 'Global Health Initiative',
          amount: 50,
          date: '2024-02-18',
          impact: 'Funds 1 medical consultation',
          category: 'HEALTHCARE'
        }
      ];

      setCharities(mockCharities);
      setDonationHistory(mockHistory);
    } catch (error) {
      console.error('Error fetching charity data:', error);
    }
  };

  const handleDonate = async () => {
    if (!amount || !selectedCharity) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success
      alert(`Thank you for donating ${amount} PWR to ${selectedCharity.name}!`);
      
      // Reset form
      setAmount('');
      setSelectedCharity(null);
      setActiveView('home');
    } catch (error) {
      console.error('Donation error:', error);
      alert('Donation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'EDUCATION': 'bg-blue-500',
      'HEALTHCARE': 'bg-green-500',
      'ENVIRONMENT': 'bg-emerald-500',
      'POVERTY': 'bg-orange-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderMobileHeader = () => (
    <div className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-white"
          >
            {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="text-lg font-bold text-white">💝 Charity</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-400 hover:text-white">
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-gray-400 hover:text-white"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderMobileMenu = () => (
    <div className={`fixed inset-0 z-50 ${showMenu ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMenu(false)}></div>
      <div className="absolute left-0 top-0 h-full w-64 bg-gray-800 shadow-xl">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Menu</h2>
            <button
              onClick={() => setShowMenu(false)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'home', name: 'Home', icon: Home },
              { id: 'browse', name: 'Browse', icon: Search },
              { id: 'donate', name: 'Donate', icon: Gift },
              { id: 'history', name: 'History', icon: Calendar },
              { id: 'impact', name: 'Impact', icon: TrendingUp },
              { id: 'profile', name: 'Profile', icon: User },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setShowMenu(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeView === item.id
                      ? 'bg-pink-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="p-4 space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-pink-500 to-purple-600 p-4 rounded-xl text-white"
        >
          <Heart className="h-6 w-6 mb-2" />
          <p className="text-2xl font-bold">275</p>
          <p className="text-xs opacity-90">Total Donations</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-xl text-white"
        >
          <Users className="h-6 w-6 mb-2" />
          <p className="text-2xl font-bold">1,234</p>
          <p className="text-xs opacity-90">Lives Impacted</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => setActiveView('donate')}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white p-4 rounded-xl flex items-center justify-between transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Gift className="h-5 w-5" />
            <span className="font-semibold">Quick Donate</span>
          </div>
          <ChevronRight className="h-5 w-5" />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => setActiveView('browse')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl flex items-center justify-between transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Search className="h-5 w-5" />
            <span className="font-semibold">Browse Charities</span>
          </div>
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 p-4 rounded-xl"
      >
        <h3 className="text-white font-semibold mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {donationHistory.slice(0, 3).map((donation) => (
            <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium truncate">{donation.charityName}</p>
                  <p className="text-gray-400 text-xs">{donation.impact}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-pink-400 font-bold">{donation.amount} PWR</p>
                <p className="text-gray-400 text-xs">{donation.date}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderDonate = () => (
    <div className="p-4 space-y-6">
      <div className="text-center mb-6">
        <Heart className="h-12 w-12 text-pink-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Make a Donation</h2>
      </div>

      {/* Charity Selection */}
      <div className="space-y-3">
        <label className="text-gray-300 text-sm font-medium">Select Charity</label>
        <div className="space-y-2">
          {charities.map((charity) => (
            <button
              key={charity.id}
              onClick={() => setSelectedCharity(charity)}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                selectedCharity?.id === charity.id
                  ? 'border-pink-500 bg-pink-500 bg-opacity-20'
                  : 'border-gray-600 bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-white font-semibold">{charity.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {renderStars(charity.rating)}
                    <span className="text-gray-400 text-xs">({charity.rating})</span>
                    {charity.verified && (
                      <Shield className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Amount Selection */}
      <div className="space-y-3">
        <label className="text-gray-300 text-sm font-medium">Amount (PWR)</label>
        <div className="grid grid-cols-3 gap-2">
          {[10, 25, 50, 100, 250, 500].map((presetAmount) => (
            <button
              key={presetAmount}
              onClick={() => setAmount(presetAmount.toString())}
              className={`p-3 rounded-lg border-2 transition-all ${
                amount === presetAmount.toString()
                  ? 'border-pink-500 bg-pink-500 text-white'
                  : 'border-gray-600 bg-gray-700 text-gray-300'
              }`}
            >
              {presetAmount}
            </button>
          ))}
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Custom amount"
          className="w-full p-4 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-pink-500 focus:outline-none"
        />
      </div>

      {/* Donate Button */}
      <button
        onClick={handleDonate}
        disabled={!amount || !selectedCharity || loading}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Donate {amount} PWR</span>
          </div>
        )}
      </button>
    </div>
  );

  const renderBrowse = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Browse Charities</h2>
      
      <div className="space-y-4">
        {charities.map((charity) => (
          <motion.div
            key={charity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-4 rounded-xl"
          >
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{charity.name}</h3>
                <p className="text-gray-300 text-sm mb-2">{charity.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {renderStars(charity.rating)}
                    <span className="text-gray-400 text-xs">({charity.rating})</span>
                    {charity.verified && (
                      <Shield className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(charity.category)} text-white`}>
                    {charity.category}
                  </span>
                </div>
                
                {/* Project Progress */}
                {charity.projects && charity.projects.length > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{charity.projects[0].title}</span>
                      <span className="text-white">
                        {charity.projects[0].currentAmount.toLocaleString()} / {charity.projects[0].targetAmount.toLocaleString()} PWR
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${(charity.projects[0].currentAmount / charity.projects[0].targetAmount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => {
                    setSelectedCharity(charity);
                    setActiveView('donate');
                  }}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-lg text-sm font-semibold transition-colors"
                >
                  Donate Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Donation History</h2>
      
      <div className="space-y-3">
        {donationHistory.map((donation) => (
          <motion.div
            key={donation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 p-4 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{donation.charityName}</h3>
                  <p className="text-gray-300 text-sm">{donation.impact}</p>
                  <p className="text-gray-400 text-xs">{donation.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-pink-400 font-bold text-lg">{donation.amount} PWR</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'home': return renderHome();
      case 'donate': return renderDonate();
      case 'browse': return renderBrowse();
      case 'history': return renderHistory();
      default: return renderHome();
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {renderMobileHeader()}
      {renderMobileMenu()}
      
      {/* Main Content */}
      <div className="pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="grid grid-cols-4 p-2">
          {[
            { id: 'home', name: 'Home', icon: Home },
            { id: 'browse', name: 'Browse', icon: Search },
            { id: 'donate', name: 'Donate', icon: Gift },
            { id: 'history', name: 'History', icon: Calendar }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  activeView === item.id
                    ? 'text-pink-500'
                    : 'text-gray-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileCharityApp;
