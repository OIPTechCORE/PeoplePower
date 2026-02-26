import React, { useState, useEffect } from 'react';
import { 
    TonIcon, 
    ShoppingCart, 
    TrendingUp, 
    Users, 
    Crown, 
    GraduationCap, 
    Landmark, 
    Gavel,
    Shield,
    Star,
    Clock,
    DollarSign,
    Package,
    CreditCard,
    CheckCircle,
    AlertCircle,
    Zap,
    Target,
    Award,
    BarChart3,
    PieChart,
    Activity,
    UserCheck,
    Building,
    Globe,
    BookOpen,
    Scale,
    Lock,
    Unlock,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal
} from 'lucide-react';

// ===================================
// TON SUPER ADMIN REVENUE DASHBOARD
// 100,000+ TON/DAY REVENUE GENERATION INTERFACE
// ===================================

const TONRevenueDashboard = ({ userId, userRole }) => {
    // State management
    const [dashboardData, setDashboardData] = useState(null);
    const [revenueMetrics, setRevenueMetrics] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [userSegments, setUserSegments] = useState([]);
    const [targetStatus, setTargetStatus] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [timeRange, setTimeRange] = useState('7days');
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);

    // Product categories
    const categories = [
        { id: 'reputationBoost', name: 'Reputation Boost', icon: TrendingUp, color: 'blue' },
        { id: 'educationTokens', name: 'Education Tokens', icon: GraduationCap, color: 'green' },
        { id: 'civilizationAssets', name: 'Civilization Assets', icon: Landmark, color: 'purple' },
        { id: 'governancePower', name: 'Governance Power', icon: Gavel, color: 'orange' }
    ];

    useEffect(() => {
        loadDashboardData();
        loadTargetStatus();
        
        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            loadDashboardData();
            loadTargetStatus();
        }, 30000);

        return () => clearInterval(interval);
    }, [timeRange]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            
            // Load main dashboard data
            const dashboardResponse = await fetch('/api/ton-revenue/admin/dashboard');
            const dashboardResult = await dashboardResponse.json();
            
            if (dashboardResult.success) {
                setDashboardData(dashboardResult.data);
            }

            // Load revenue metrics
            const metricsResponse = await fetch(`/api/ton-revenue/admin/revenue?period=${timeRange}`);
            const metricsResult = await metricsResponse.json();
            
            if (metricsResult.success) {
                setRevenueMetrics(metricsResult.data);
            }

            // Load top products
            const productsResponse = await fetch(`/api/ton-revenue/admin/top-products?period=${timeRange}`);
            const productsResult = await productsResponse.json();
            
            if (productsResult.success) {
                setTopProducts(productsResult.data);
            }

            // Load user segments
            const segmentsResponse = await fetch('/api/ton-revenue/admin/user-segments');
            const segmentsResult = await segmentsResponse.json();
            
            if (segmentsResult.success) {
                setUserSegments(segmentsResult.data);
            }

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadTargetStatus = async () => {
        try {
            const response = await fetch('/api/ton-revenue/admin/target-status');
            const result = await response.json();
            
            if (result.success) {
                setTargetStatus(result.data);
            }
        } catch (error) {
            console.error('Error loading target status:', error);
        }
    };

    const formatTON = (amount) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    const formatPercentage = (value) => {
        return `${(value || 0).toFixed(1)}%`;
    };

    const getCategoryColor = (category) => {
        const colors = {
            reputationBoost: 'text-blue-600 bg-blue-100',
            educationTokens: 'text-green-600 bg-green-100',
            civilizationAssets: 'text-purple-600 bg-purple-100',
            governancePower: 'text-orange-600 bg-orange-100'
        };
        return colors[category] || 'text-gray-600 bg-gray-100';
    };

    const getTargetStatusColor = (percentage) => {
        if (percentage >= 100) return 'text-green-600 bg-green-100';
        if (percentage >= 75) return 'text-yellow-600 bg-yellow-100';
        if (percentage >= 50) return 'text-orange-600 bg-orange-100';
        return 'text-red-600 bg-red-100';
    };

    // ===================================
    // MAIN DASHBOARD RENDER
    // ===================================
    if (loading && !dashboardData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading TON Revenue Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <TonIcon className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">TON Revenue Dashboard</h1>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                Super Admin
                            </span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="border rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="1day">Last 24 Hours</option>
                                <option value="7days">Last 7 Days</option>
                                <option value="30days">Last 30 Days</option>
                            </select>
                            
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="p-2 border rounded-lg hover:bg-gray-50"
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Target Status Banner */}
            {targetStatus && (
                <div className={`border-b-4 ${getTargetStatusColor(targetStatus.percentage).split(' ')[1]}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Daily Target Progress</h2>
                                <p className="text-sm text-gray-600">
                                    {formatTON(targetStatus.current)} / {formatTON(targetStatus.target)} TON
                                </p>
                            </div>
                            <div className="text-right">
                                <div className={`text-2xl font-bold ${getTargetStatusColor(targetStatus.percentage).split(' ')[0]}`}>
                                    {formatPercentage(targetStatus.percentage)}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {targetStatus.status === 'achieved' ? '✅ Target Achieved' : '🎯 In Progress'}
                                </div>
                            </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-3 bg-gray-200 rounded-full h-3">
                            <div 
                                className={`h-3 rounded-full transition-all duration-500 ${
                                    targetStatus.percentage >= 100 ? 'bg-green-600' :
                                    targetStatus.percentage >= 75 ? 'bg-yellow-600' :
                                    targetStatus.percentage >= 50 ? 'bg-orange-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${Math.min(targetStatus.percentage, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Key Metrics */}
                {dashboardData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatTON(dashboardData.today.totalRevenue)}
                                    </p>
                                    <p className="text-sm text-gray-600">TON</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <DollarSign className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Transactions</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {dashboardData.today.breakdown?.reduce((sum, item) => sum + parseInt(item.transaction_count || 0), 0) || 0}
                                    </p>
                                    <p className="text-sm text-gray-600">Today</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <Activity className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Avg Transaction</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatTON(dashboardData.projections?.daily / (dashboardData.today.breakdown?.reduce((sum, item) => sum + parseInt(item.transaction_count || 0), 0) || 1))}
                                    </p>
                                    <p className="text-sm text-gray-600">TON</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <CreditCard className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Target Achievement</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatPercentage(dashboardData.today.targetProgress)}
                                    </p>
                                    <p className="text-sm text-gray-600">of 100,000 TON</p>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-full">
                                    <Target className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Revenue Breakdown by Category */}
                {dashboardData?.today?.breakdown && (
                    <div className="bg-white rounded-lg shadow mb-8">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Revenue by Category</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {categories.map(category => {
                                    const categoryData = dashboardData.today.breakdown.find(item => item.category === category.id);
                                    const revenue = parseFloat(categoryData?.total_revenue || 0);
                                    const target = category.id === 'reputationBoost' ? 40000 :
                                                category.id === 'educationTokens' ? 25000 :
                                                category.id === 'civilizationAssets' ? 20000 : 15000;
                                    const percentage = (revenue / target) * 100;
                                    
                                    return (
                                        <div key={category.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <category.icon className="w-5 h-5 text-gray-600" />
                                                    <span className="font-medium text-gray-900">{category.name}</span>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(category.id)}`}>
                                                    {formatPercentage(percentage)}
                                                </span>
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                                {formatTON(revenue)}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Target: {formatTON(target)} TON
                                            </div>
                                            <div className="mt-2 bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full ${
                                                        percentage >= 100 ? 'bg-green-600' :
                                                        percentage >= 75 ? 'bg-yellow-600' :
                                                        percentage >= 50 ? 'bg-orange-600' : 'bg-red-600'
                                                    }`}
                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Products and User Segments */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Top Products */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {topProducts.slice(0, 10).map((product, index) => (
                                    <div key={product.product_id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                                            <div>
                                                <p className="font-medium text-gray-900">{product.product_name}</p>
                                                <p className="text-sm text-gray-600">{product.purchase_count} purchases</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">{formatTON(product.total_revenue)}</p>
                                            <p className="text-sm text-gray-600">TON</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* User Segments */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">User Segments</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {userSegments.map((segment, index) => (
                                    <div key={segment.user_segment} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                {segment.user_segment === 'casual' && <Users className="w-5 h-5 text-blue-600" />}
                                                {segment.user_segment === 'power' && <Zap className="w-5 h-5 text-green-600" />}
                                                {segment.user_segment === 'investor' && <Crown className="w-5 h-5 text-purple-600" />}
                                                {segment.user_segment === 'institutional' && <Building className="w-5 h-5 text-orange-600" />}
                                                <span className="font-medium text-gray-900 capitalize">{segment.user_segment}</span>
                                            </div>
                                            <span className="text-sm text-gray-600">{segment.user_count} users</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600">Total Spent</p>
                                                <p className="font-semibold text-gray-900">{formatTON(segment.segment_revenue)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Avg Spent</p>
                                                <p className="font-semibold text-gray-900">{formatTON(segment.avg_spent)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hourly Revenue Chart */}
                {targetStatus?.hourly && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Today's Hourly Revenue</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                                {Array.from({ length: 24 }, (_, i) => {
                                    const hourData = targetStatus.hourly.find(h => parseInt(h.hour) === i);
                                    const revenue = parseFloat(hourData?.hourly_revenue || 0);
                                    const maxRevenue = Math.max(...targetStatus.hourly.map(h => parseFloat(h.hourly_revenue || 0)));
                                    const height = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
                                    
                                    return (
                                        <div key={i} className="text-center">
                                            <div className="relative h-20 bg-gray-100 rounded">
                                                <div 
                                                    className="absolute bottom-0 w-full bg-blue-600 rounded transition-all duration-300"
                                                    style={{ height: `${height}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">{i}</p>
                                            <p className="text-xs font-medium">{formatTON(revenue)}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TONRevenueDashboard;
