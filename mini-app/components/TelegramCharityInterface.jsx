import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Search, Send, Gift, Calendar, TrendingUp,
  Users, Target, Award, Globe, Menu, X,
  ChevronRight, Star, Shield, Bell
} from 'lucide-react';

const TelegramCharityInterface = () => {
  const [activeView, setActiveView] = useState('home');
  const [charities, setCharities] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchCharityData();
  }, []);

  const fetchCharityData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCharities = [
        {
          id: 'charity_001',
          name: 'Education for All',
          description: 'Providing education to underprivileged children',
          category: 'EDUCATION',
          rating: 4.8,
          totalRaised: 125000,
          goal: 200000
        },
        {
          id: 'charity_002',
          name: 'Healthcare Heroes',
          description: 'Medical care for remote communities',
          category: 'HEALTHCARE',
          rating: 4.9,
          totalRaised: 89000,
          goal: 150000
        }
      ];

      const mockHistory = [
        {
          id: 'donation_001',
          charityName: 'Education for All',
          amount: 50,
          date: '2024-02-20',
          impact: 'Provides school supplies for 1 student'
        },
        {
          id: 'donation_002',
          charityName: 'Healthcare Heroes',
          amount: 25,
          date: '2024-02-18',
          impact: 'Funds basic medical supplies'
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      alert(`Thank you for donating ${amount} PWR to ${selectedCharity.name}!`);
      
      // Reset form
      setAmount('');
      setSelectedCharity(null);
      setActiveView('history');
    } catch (error) {
      console.error('Donation error:', error);
      alert('Donation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderHome = () => (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-4 rounded-xl text-white">
          <Heart className="h-6 w-6 mb-2" />
          <p className="text-2xl font-bold">275</p>
          <p className="text-xs opacity-90">Total Donations</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-xl text-white">
          <Target className="h-6 w-6 mb-2" />
          <p className="text-2xl font-bold">1,234</p>
          <p className="text-xs opacity-90">Lives Impacted</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <button
          onClick={() => setActiveView('donate')}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white p-4 rounded-xl flex items-center justify-between transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Gift className="h-5 w-5" />
            <span className="font-semibold">Quick Donate</span>
          </div>
          <ChevronRight className="h-5 w-5" />
        </button>

        <button
          onClick={() => setActiveView('browse')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl flex items-center justify-between transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Search className="h-5 w-5" />
            <span className="font-semibold">Browse Charities</span>
          </div>
          <ChevronRight className="h-5 w-5" />
        </button>

        <button
          onClick={() => setActiveView('history')}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-xl flex items-center justify-between transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5" />
            <span className="font-semibold">Donation History</span>
          </div>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 p-4 rounded-xl">
        <h3 className="text-white font-semibold mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {donationHistory.slice(0, 3).map((donation) => (
            <div key={donation.id} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-pink-500" />
                <div>
                  <p className="text-white text-sm font-medium">{donation.charityName}</p>
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
      </div>
    </div>
  );

  const renderDonate = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <Heart className="h-12 w-12 text-pink-500 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-white">Make a Donation</h2>
      </div>

      {/* Charity Selection */}
      <div className="space-y-2">
        <label className="text-gray-300 text-sm font-medium">Select Charity</label>
        <select
          value={selectedCharity?.id || ''}
          onChange={(e) => setSelectedCharity(charities.find(c => c.id === e.target.value))}
          className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-pink-500 focus:outline-none"
        >
          <option value="">Choose a charity...</option>
          {charities.map((charity) => (
            <option key={charity.id} value={charity.id}>
              {charity.name}
            </option>
          ))}
        </select>
      </div>

      {/* Amount Selection */}
      <div className="space-y-2">
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
          className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-pink-500 focus:outline-none"
        />
      </div>

      {/* Selected Charity Info */}
      {selectedCharity && (
        <div className="bg-gray-800 p-4 rounded-xl">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{selectedCharity.name}</h3>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-gray-400 text-sm">{selectedCharity.rating}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-2">{selectedCharity.description}</p>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress:</span>
              <span className="text-white">{selectedCharity.totalRaised.toLocaleString()} / {selectedCharity.goal.toLocaleString()} PWR</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
                style={{ width: `${(selectedCharity.totalRaised / selectedCharity.goal) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

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
            <Send className="h-5 w-5" />
            <span>Donate {amount} PWR</span>
          </div>
        )}
      </button>
    </div>
  );

  const renderBrowse = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Browse Charities</h2>
      
      <div className="space-y-3">
        {charities.map((charity) => (
          <div key={charity.id} className="bg-gray-800 p-4 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{charity.name}</h3>
                <p className="text-gray-300 text-sm mb-2">{charity.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-gray-400 text-sm">{charity.rating}</span>
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                      {charity.category}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCharity(charity);
                      setActiveView('donate');
                    }}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    Donate
                  </button>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress:</span>
                    <span className="text-white">{charity.totalRaised.toLocaleString()} / {charity.goal.toLocaleString()} PWR</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${(charity.totalRaised / charity.goal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Donation History</h2>
      
      <div className="space-y-3">
        {donationHistory.map((donation) => (
          <div key={donation.id} className="bg-gray-800 p-4 rounded-xl">
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
          </div>
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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
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
            <button className="p-2 text-gray-400 hover:text-white relative">
              <Bell className="h-5 w-5" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></div>
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">U</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowMenu(false)}>
          <div className="bg-gray-800 w-64 h-full p-4" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-2">
              {[
                { id: 'home', name: 'Home', icon: Heart },
                { id: 'donate', name: 'Donate', icon: Gift },
                { id: 'browse', name: 'Browse', icon: Search },
                { id: 'history', name: 'History', icon: Calendar }
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
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="grid grid-cols-4 p-2">
          {[
            { id: 'home', name: 'Home', icon: Heart },
            { id: 'donate', name: 'Donate', icon: Gift },
            { id: 'browse', name: 'Browse', icon: Search },
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

export default TelegramCharityInterface;
