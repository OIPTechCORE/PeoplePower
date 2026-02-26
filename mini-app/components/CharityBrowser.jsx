import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Search, Filter, Star, Globe, Shield, Users,
  DollarSign, Calendar, TrendingUp, Award, ChevronRight,
  Eye, MessageSquare, Bookmark, Share2, ExternalLink
} from 'lucide-react';

const CharityBrowser = () => {
  const [charities, setCharities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
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
          ],
          recentDonations: [
            {
              donorName: 'Anonymous',
              amount: 1000,
              timestamp: '2024-02-20T10:30:00Z'
            }
          ]
        },
        {
          id: 'charity_002',
          name: 'Global Health Initiative',
          description: 'Bringing healthcare to remote communities around the world',
          category: 'HEALTHCARE',
          logo: '/logos/health-initiative.png',
          verified: true,
          rating: 4.9,
          totalDonationsReceived: 180000,
          projects: [
            {
              id: 'project_002',
              title: 'Mobile Clinics Program',
              description: 'Deploy 50 mobile clinics to underserved areas',
              targetAmount: 300000,
              currentAmount: 180000,
              deadline: '2024-10-31'
            }
          ],
          recentDonations: [
            {
              donorName: 'John Doe',
              amount: 500,
              timestamp: '2024-02-19T15:20:00Z'
            }
          ]
        },
        {
          id: 'charity_003',
          name: 'Clean Water Project',
          description: 'Providing clean drinking water to communities in need',
          category: 'ENVIRONMENT',
          logo: '/logos/water-project.png',
          verified: true,
          rating: 4.7,
          totalDonationsReceived: 120000,
          projects: [
            {
              id: 'project_003',
              title: 'Well Construction',
              description: 'Build 200 wells in water-scarce regions',
              targetAmount: 200000,
              currentAmount: 120000,
              deadline: '2024-09-30'
            }
          ],
          recentDonations: [
            {
              donorName: 'Jane Smith',
              amount: 250,
              timestamp: '2024-02-18T09:45:00Z'
            }
          ]
        },
        {
          id: 'charity_004',
          name: 'Food Security Alliance',
          description: 'Fighting hunger and food insecurity in vulnerable communities',
          category: 'POVERTY',
          logo: '/logos/food-alliance.png',
          verified: true,
          rating: 4.6,
          totalDonationsReceived: 95000,
          projects: [
            {
              id: 'project_004',
              title: 'Community Gardens',
              description: 'Establish 50 community gardens in urban areas',
              targetAmount: 150000,
              currentAmount: 95000,
              deadline: '2024-11-30'
            }
          ],
          recentDonations: [
            {
              donorName: 'Anonymous',
              amount: 750,
              timestamp: '2024-02-17T14:10:00Z'
            }
          ]
        }
      ];
      
      setCharities(mockCharities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching charities:', error);
      setLoading(false);
    }
  };

  const filteredCharities = charities.filter(charity => {
    const matchesSearch = charity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         charity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || charity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'All Categories', icon: Globe },
    { id: 'EDUCATION', name: 'Education', icon: Heart },
    { id: 'HEALTHCARE', name: 'Healthcare', icon: Shield },
    { id: 'ENVIRONMENT', name: 'Environment', icon: Globe },
    { id: 'POVERTY', name: 'Poverty', icon: Users }
  ];

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

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
          <p className={`mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading Charities...</p>
        </div>
      </div>
    );
  }

  if (selectedCharity) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {/* Header */}
        <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedCharity(null)}
                  className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-gray-600`}
                >
                  <ChevronRight className="h-5 w-5 text-gray-400 rotate-180" />
                </button>
                <h1 className="text-2xl font-bold text-pink-600">Charity Details</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-gray-600`}>
                  <Bookmark className="h-5 w-5 text-gray-400" />
                </button>
                <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-gray-600`}>
                  <Share2 className="h-5 w-5 text-gray-400" />
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

        {/* Charity Details */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedCharity.name}
                    </h2>
                    <div className="flex items-center space-x-2 mt-1">
                      {selectedCharity.verified && (
                        <div className="flex items-center space-x-1">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-500">Verified</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        {renderStars(selectedCharity.rating)}
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          ({selectedCharity.rating})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Raised</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedCharity.totalDonationsReceived.toLocaleString()} PWR
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
                {selectedCharity.description}
              </p>

              {/* Category */}
              <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getCategoryColor(selectedCharity.category)}`}>
                  {selectedCharity.category}
                </span>
              </div>

              {/* Projects */}
              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Active Projects
                </h3>
                <div className="space-y-4">
                  {selectedCharity.projects.map((project) => (
                    <div key={project.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {project.title}
                        </h4>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Deadline: {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                        {project.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            Progress
                          </span>
                          <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                            {project.currentAmount.toLocaleString()} / {project.targetAmount.toLocaleString()} PWR
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
                            style={{ width: `${(project.currentAmount / project.targetAmount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Donations */}
              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recent Donations
                </h3>
                <div className="space-y-2">
                  {selectedCharity.recentDonations.map((donation, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                          <Heart className="h-4 w-4 text-pink-600" />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {donation.donorName}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(donation.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {donation.amount} PWR
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Donate Now
                </button>
                <button className={`flex-1 border-2 border-pink-500 text-pink-500 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors ${darkMode ? 'hover:bg-gray-700' : ''}`}>
                  Set Up Recurring
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-pink-600">🌍 Discover Charities</h1>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Find causes you care about
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
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

      {/* Search and Filters */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search charities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-pink-500`}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-pink-500`}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-6">
        <div className="mb-4">
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Found {filteredCharities.length} charities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharities.map((charity) => (
            <motion.div
              key={charity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden cursor-pointer`}
              onClick={() => setSelectedCharity(charity)}
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {charity.verified && (
                      <Shield className="h-4 w-4 text-green-500" />
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(charity.category)} text-white`}>
                      {charity.category}
                    </span>
                  </div>
                </div>

                {/* Name and Rating */}
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {charity.name}
                </h3>
                <div className="flex items-center space-x-1 mb-3">
                  {renderStars(charity.rating)}
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ({charity.rating})
                  </span>
                </div>

                {/* Description */}
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-2`}>
                  {charity.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Raised</p>
                    <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {charity.totalDonationsReceived.toLocaleString()} PWR
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Projects</p>
                    <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {charity.projects.length}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCharities.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No charities found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharityBrowser;
