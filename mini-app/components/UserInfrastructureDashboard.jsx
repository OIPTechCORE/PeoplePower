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
  Clock, TargetIcon, AwardIcon, UserPlus, Swords,
  Server, Database, Cloud, Cpu, HardDrive,
  Wifi, Router, Shield as ShieldIcon, AlertTriangle as AlertIcon,
  CheckCircle as CheckIcon, XCircle as XIcon,
  Activity as ActivityIcon, BarChart as BarChartIcon,
  PieChart as PieChartIcon, LineChart as LineChartIcon,
  MapPin, Globe2, Monitor, Smartphone,
  Zap as ZapIcon, Battery, Thermometer,
  Gauge, TrendingUp as TrendingUpIcon,
  TrendingDown, ArrowUp, ArrowDown,
  RefreshCw, Settings, Bell, BellRing
} from 'lucide-react';

const UserInfrastructureDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [infrastructureData, setInfrastructureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetchInfrastructureData();
  }, []);

  const fetchInfrastructureData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData = {
        overview: {
          totalUsers: 900000000,
          activeUsers: 450000000,
          totalShards: 90000,
          healthyShards: 88500,
          criticalShards: 150,
          avgResponseTime: 45,
          uptime: 99.99,
          totalCost: 12500000,
          costPerUser: 0.014
        },
        shardUtilization: {
          totalShards: 90000,
          avgUtilization: 75.5,
          highUtilization: 15000,
          criticalUtilization: 150,
          regions: {
            'us-east-1': { total: 30000, healthy: 29500, degraded: 450, critical: 50 },
            'eu-west-1': { total: 25000, healthy: 24750, degraded: 200, critical: 50 },
            'ap-southeast-1': { total: 20000, healthy: 19750, degraded: 200, critical: 50 },
            'ap-south-1': { total: 15000, healthy: 14800, degraded: 150, critical: 50 }
          }
        },
        performance: {
          apiRequestsPerSecond: 10000000,
          databaseQueriesPerSecond: 5000000,
          websocketConnections: 450000000,
          avgResponseTime: 45,
          errorRate: 0.02,
          cpuUtilization: 65.5,
          memoryUtilization: 72.3,
          storageUtilization: 58.7,
          networkBandwidth: 850000
        },
        economic: {
          totalInfluenceEarned: 45000000000000,
          totalPWREarned: 2250000000000,
          totalTransactions: 500000000,
          totalVolumeUSD: 10000000000,
          avgTransactionSize: 20.00,
          activeMerchants: 50000,
          activeMentors: 15000,
          certificatesIssued: 750000,
          coursesCompleted: 2500000
        },
        security: {
          totalRequests: 10000000000,
          blockedRequests: 5000000,
          suspiciousIPs: 250000,
          ddosAttacks: 12,
          securityIncidents: 3,
          fraudAttempts: 15000,
          accountLockouts: 5000,
          avgThreatScore: 0.15
        },
        compliance: {
          gdprRequests: 5000,
          ccpaRequests: 2000,
          dataDeletionRequests: 1500,
          contentModerationActions: 50000,
          regulatoryReports: 25,
          complianceScore: 98.5,
          activeInvestigations: 3,
          resolvedInvestigations: 47
        },
        costTracking: {
          monthlyTotal: 12500000,
          categories: {
            infrastructure: 8500000,
            cdn: 2500000,
            database: 500000,
            security: 500000,
            analytics: 200000,
            team: 300000
          },
          regions: {
            'us-east-1': 6000000,
            'eu-west-1': 3500000,
            'ap-southeast-1': 2000000,
            'ap-south-1': 1000000
          }
        },
        capacity: {
          services: [
            {
              name: 'api-gateway',
              currentCapacity: 10000000,
              projectedCapacity: 15000000,
              requiredCapacity: 12000000,
              urgencyLevel: 'high',
              estimatedCost: 2500000,
              timelineMonths: 3
            },
            {
              name: 'database-cluster',
              currentCapacity: 5000000,
              projectedCapacity: 7500000,
              requiredCapacity: 8000000,
              urgencyLevel: 'critical',
              estimatedCost: 5000000,
              timelineMonths: 6
            },
            {
              name: 'websocket-cluster',
              currentCapacity: 450000000,
              projectedCapacity: 600000000,
              requiredCapacity: 700000000,
              urgencyLevel: 'high',
              estimatedCost: 1500000,
              timelineMonths: 4
            }
          ]
        }
      };
      
      setInfrastructureData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching infrastructure data:', error);
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className={`mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading 900M User Infrastructure...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'shards', name: 'Shards', icon: Database },
    { id: 'performance', name: 'Performance', icon: Activity },
    { id: 'economic', name: 'Economic', icon: DollarSign },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'cost', name: 'Cost', icon: TrendingUp },
    { id: 'capacity', name: 'Capacity', icon: Gauge }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Main Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-xl text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">🌍 900M User Infrastructure</h2>
            <p className="text-orange-100 text-lg">Total Users: {formatNumber(infrastructureData.overview.totalUsers)}</p>
            <p className="text-orange-200 text-sm mt-2">Enterprise-grade • Global Scale • High Availability</p>
          </div>
          <div className="text-right">
            <Globe className="h-16 w-16 text-orange-200" />
            <p className="text-2xl font-bold mt-2">{formatNumber(infrastructureData.overview.activeUsers)}</p>
            <p className="text-orange-100 text-sm">Active Users</p>
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
              <p className="text-blue-100 text-sm">Total Shards</p>
              <p className="text-3xl font-bold">{formatNumber(infrastructureData.overview.totalShards)}</p>
              <p className="text-blue-100 text-xs">{infrastructureData.overview.healthyShards} healthy</p>
            </div>
            <Database className="h-8 w-8 text-blue-200" />
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
              <p className="text-green-100 text-sm">Avg Response Time</p>
              <p className="text-3xl font-bold">{infrastructureData.overview.avgResponseTime}ms</p>
              <p className="text-green-100 text-xs">Global average</p>
            </div>
            <Activity className="h-8 w-8 text-green-200" />
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
              <p className="text-purple-100 text-sm">Uptime</p>
              <p className="text-3xl font-bold">{infrastructureData.overview.uptime}%</p>
              <p className="text-purple-100 text-xs">Service availability</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-200" />
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
              <p className="text-orange-100 text-sm">Monthly Cost</p>
              <p className="text-3xl font-bold">{formatCurrency(infrastructureData.overview.totalCost)}</p>
              <p className="text-orange-100 text-xs">${infrastructureData.overview.costPerUser} per user</p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Regional Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🌍 Regional Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(infrastructureData.shardUtilization.regions).map(([region, data]) => (
              <div key={region} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{region}</p>
                    <p className="text-gray-400 text-xs">{data.total} shards</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">{data.healthy}</p>
                  <p className="text-gray-400 text-xs">healthy</p>
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
            📊 Shard Health Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Healthy Shards</span>
              <span className={`font-bold text-green-500`}>
                {infrastructureData.overview.healthyShards}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>High Utilization</span>
              <span className={`font-bold text-yellow-500`}>
                {infrastructureData.shardUtilization.highUtilization}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Critical Shards</span>
              <span className={`font-bold text-red-500`}>
                {infrastructureData.overview.criticalShards}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Avg Utilization</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {infrastructureData.shardUtilization.avgUtilization}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderShards = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        🗄️ Shard Management
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Shard Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Shards</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(infrastructureData.shardUtilization.totalShards)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Average Utilization</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {infrastructureData.shardUtilization.avgUtilization}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>High Utilization</span>
              <span className={`font-bold text-yellow-500`}>
                {formatNumber(infrastructureData.shardUtilization.highUtilization)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Critical Utilization</span>
              <span className={`font-bold text-red-500`}>
                {infrastructureData.shardUtilization.criticalUtilization}
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
            🌍 Regional Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(infrastructureData.shardUtilization.regions).map(([region, data]) => (
              <div key={region} className="p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{region}</h4>
                  <span className="text-green-400 text-sm">{data.total} shards</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Healthy:</span>
                    <span className="text-green-400 font-bold">{data.healthy}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Degraded:</span>
                    <span className="text-yellow-400 font-bold">{data.degraded}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Critical:</span>
                    <span className="text-red-400 font-bold">{data.critical}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Health:</span>
                    <span className="text-green-400 font-bold">
                      {((data.healthy / data.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        ⚡ Performance Metrics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 System Performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>API Requests/sec</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(infrastructureData.performance.apiRequestsPerSecond)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Database Queries/sec</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(infrastructureData.performance.databaseQueriesPerSecond)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>WebSocket Connections</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(infrastructureData.performance.websocketConnections)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Avg Response Time</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {infrastructureData.performance.avgResponseTime}ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Error Rate</span>
              <span className={`font-bold text-red-500`}>
                {infrastructureData.performance.errorRate}%
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
            🔧 Resource Utilization
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>CPU Utilization</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${infrastructureData.performance.cpuUtilization}%` }}
                  ></div>
                </div>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {infrastructureData.performance.cpuUtilization}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Memory Utilization</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${infrastructureData.performance.memoryUtilization}%` }}
                  ></div>
                </div>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {infrastructureData.performance.memoryUtilization}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Storage Utilization</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-yellow-500"
                    style={{ width: `${infrastructureData.performance.storageUtilization}%` }}
                  ></div>
                </div>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {infrastructureData.performance.storageUtilization}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Network Bandwidth</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(infrastructureData.performance.networkBandwidth)} Mbps
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderEconomic = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        💰 Economic Metrics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            💎 Token Economics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Influence Earned</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(infrastructureData.economic.totalInfluenceEarned)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total PWR Earned</span>
              <span className={`font-bold text-blue-500`}>
                {formatNumber(infrastructureData.economic.totalPWREarned)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Transactions</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(infrastructureData.economic.totalTransactions)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Volume (USD)</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(infrastructureData.economic.totalVolumeUSD)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Avg Transaction Size</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(infrastructureData.economic.avgTransactionSize)}
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
            🎓 Education & Commerce
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Active Merchants</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(infrastructureData.economic.activeMerchants)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Active Mentors</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(infrastructureData.economic.activeMentors)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Certificates Issued</span>
              <span className={`font-bold text-purple-500`}>
                {formatNumber(infrastructureData.economic.certificatesIssued)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Courses Completed</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(infrastructureData.economic.coursesCompleted)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        🛡️ Security Metrics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🔒 Security Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Requests</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(infrastructureData.security.totalRequests)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Blocked Requests</span>
              <span className={`font-bold text-red-500`}>
                {formatNumber(infrastructureData.security.blockedRequests)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Suspicious IPs</span>
              <span className={`font-bold text-yellow-500`}>
                {formatNumber(infrastructureData.security.suspiciousIPs)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>DDoS Attacks</span>
              <span className={`font-bold text-red-500`}>
                {infrastructureData.security.ddosAttacks}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Security Incidents</span>
              <span className={`font-bold text-orange-500`}>
                {infrastructureData.security.securityIncidents}
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
            🚨 Threat Analysis
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Fraud Attempts</span>
              <span className={`font-bold text-red-500`}>
                {formatNumber(infrastructureData.security.fraudAttempts)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Account Lockouts</span>
              <span className={`font-bold text-yellow-500`}>
                {infrastructureData.security.accountLockouts}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Avg Threat Score</span>
              <span className={`font-bold ${infrastructureData.security.avgThreatScore > 0.5 ? 'text-red-500' : 'text-green-500'}`}>
                {infrastructureData.security.avgThreatScore}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Block Rate</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {((infrastructureData.security.blockedRequests / infrastructureData.security.totalRequests) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderCost = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        💰 Cost Tracking
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            💸 Monthly Cost Breakdown
          </h3>
          <div className="space-y-4">
            {Object.entries(infrastructureData.costTracking.categories).map(([category, cost]) => (
              <div key={category} className="flex items-center justify-between">
                <span className={`capitalize ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {category.replace('_', ' ')}
                </span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(cost)}
                </span>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Total Monthly</span>
                <span className={`font-bold text-green-500`}>
                  {formatCurrency(infrastructureData.costTracking.monthlyTotal)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🌍 Regional Cost Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(infrastructureData.costTracking.regions).map(([region, cost]) => (
              <div key={region} className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {region}
                </span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(cost)}
                </span>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cost Per User</span>
                <span className={`font-bold text-blue-500`}>
                  ${infrastructureData.overview.costPerUser}
                </span>
              </div>
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
            {infrastructureData.capacity.services.map((service, index) => (
              <div key={index} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{service.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.urgencyLevel === 'critical' ? 'bg-red-500 text-white' :
                    service.urgencyLevel === 'high' ? 'bg-orange-500 text-white' :
                    'bg-yellow-500 text-white'
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
      case 'shards': return renderShards();
      case 'performance': return renderPerformance();
      case 'economic': return renderEconomic();
      case 'security': return renderSecurity();
      case 'cost': return renderCost();
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
              <h1 className="text-2xl font-bold text-orange-600">🌍 900M User Infrastructure</h1>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Enterprise-grade • Global Scale • High Availability
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
                      ? 'border-orange-500 text-orange-600'
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

export default UserInfrastructureDashboard;
