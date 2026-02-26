import React, { useState, useEffect } from 'react';
import { 
    Globe, 
    Users, 
    Crown, 
    Handshake, 
    Calendar, 
    Star,
    TrendingUp,
    Award,
    MapPin,
    Flag,
    UserCheck,
    MessageSquare,
    Target,
    Zap,
    Shield,
    Trophy,
    Clock,
    ChevronRight,
    Search,
    Filter,
    Bell,
    Settings,
    LogIn
} from 'lucide-react';

// ===================================
// PEOPLE POWER GLOBAL CIVILIZATION INTERFACE
// "DIGITAL NATION WITHOUT BORDERS"
// ===================================

const GlobalCivilizationInterface = ({ playerId, onClose }) => {
    const [activeTab, setActiveTab] = useState('network');
    const [citizenData, setCitizenData] = useState(null);
    const [communities, setCommunities] = useState([]);
    const [leadershipData, setLeadershipData] = useState({});
    const [summits, setSummits] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    // Form states
    const [showCommunityForm, setShowCommunityForm] = useState(false);
    const [showMissionForm, setShowMissionForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        loadCivilizationData();
    }, [playerId]);

    const loadCivilizationData = async () => {
        try {
            setLoading(true);
            
            // Load citizen data
            const citizenResponse = await fetch(`/api/global-civilization/network/citizen/${playerId}`);
            const citizen = await citizenResponse.json();
            setCitizenData(citizen.data);

            // Load communities
            const communitiesResponse = await fetch('/api/global-civilization/search/communities?limit=10');
            const communitiesData = await communitiesResponse.json();
            setCommunities(communitiesData.data);

            // Load leadership data
            const leadershipResponse = await fetch('/api/global-civilization/analytics/leadership-stats');
            const leadershipStats = await leadershipResponse.json();
            setLeadershipData(leadershipStats.data);

            // Load summits
            const summitsResponse = await fetch('/api/global-civilization/analytics/summit-stats');
            const summitsData = await summitsResponse.json();
            setSummits(summitsData.data);

            setLoading(false);
        } catch (error) {
            console.error('Error loading civilization data:', error);
            setLoading(false);
        }
    };

    const handleRegisterCitizen = async () => {
        try {
            const response = await fetch('/api/global-civilization/network/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId })
            });
            
            const result = await response.json();
            if (result.success) {
                setCitizenData(result.data);
                setNotifications([...notifications, {
                    type: 'success',
                    message: '🎉 Welcome to the Global Network! You are now a citizen of PEOPLE POWER!'
                }]);
            }
        } catch (error) {
            console.error('Error registering citizen:', error);
        }
    };

    const handleCreateCommunity = async (communityData) => {
        try {
            const response = await fetch('/api/global-civilization/communities/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId, communityData })
            });
            
            const result = await response.json();
            if (result.success) {
                setCommunities([...communities, result.data]);
                setShowCommunityForm(false);
                setNotifications([...notifications, {
                    type: 'success',
                    message: `🏛️ Community "${result.data.community_name}" created successfully!`
                }]);
            }
        } catch (error) {
            console.error('Error creating community:', error);
        }
    };

    const handleJoinCommunity = async (communityId) => {
        try {
            const response = await fetch('/api/global-civilization/communities/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId, communityId })
            });
            
            const result = await response.json();
            if (result.success) {
                setNotifications([...notifications, {
                    type: 'success',
                    message: '🤝 Successfully joined the community!'
                }]);
                loadCivilizationData();
            }
        } catch (error) {
            console.error('Error joining community:', error);
        }
    };

    const handleRegisterForSummit = async (summitId) => {
        try {
            const response = await fetch('/api/global-civilization/summits/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId, summitId })
            });
            
            const result = await response.json();
            if (result.success) {
                setNotifications([...notifications, {
                    type: 'success',
                    message: '🎯 Successfully registered for the Global Summit!'
                }]);
            }
        } catch (error) {
            console.error('Error registering for summit:', error);
        }
    };

    const getRarityColor = (level) => {
        const colors = {
            citizen: 'text-gray-500',
            resident: 'text-green-500',
            ambassador: 'text-blue-500',
            diplomat: 'text-purple-500',
            leader: 'text-orange-500'
        };
        return colors[level] || 'text-gray-500';
    };

    const getSkillIcon = (skill) => {
        const icons = {
            organizer: Users,
            educator: Award,
            creator: Star,
            diplomat: Handshake,
            builder: Target,
            leader: Crown
        };
        return icons[skill] || UserCheck;
    };

    // ===================================
    // NETWORK TAB
    // ===================================
    const NetworkTab = () => (
        <div className="space-y-6">
            {/* Citizen Status */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <Globe className="mr-3" />
                    Global Network Status
                </h2>
                
                {citizenData ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/20 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-90">Citizen ID</span>
                                <Shield className="w-5 h-5" />
                            </div>
                            <div className="text-xl font-bold mt-1">{citizenData.citizen_id}</div>
                        </div>
                        
                        <div className="bg-white/20 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-90">Citizenship Level</span>
                                <Crown className="w-5 h-5" />
                            </div>
                            <div className={`text-xl font-bold mt-1 capitalize ${getRarityColor(citizenData.citizenship_level)}`}>
                                {citizenData.citizenship_level}
                            </div>
                        </div>
                        
                        <div className="bg-white/20 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-90">Global Reputation</span>
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div className="text-xl font-bold mt-1">{citizenData.global_reputation_score?.toFixed(0) || 0}</div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-4">Join the Global Network</p>
                        <button
                            onClick={handleRegisterCitizen}
                            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                            <LogIn className="inline w-5 h-5 mr-2" />
                            Register as Global Citizen
                        </button>
                    </div>
                )}
            </div>

            {/* Skills and Specializations */}
            {citizenData && (
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                        <Star className="mr-2 text-yellow-500" />
                        Skills & Specializations
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-3">Primary Skill</h4>
                            <div className="flex items-center space-x-3">
                                {React.createElement(getSkillIcon(citizenData.primary_skill), { 
                                    className: 'w-8 h-8 text-blue-500' 
                                })}
                                <span className="capitalize font-medium">{citizenData.primary_skill}</span>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-3">Secondary Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {citizenData.secondary_skills?.map((skill, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm capitalize">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {citizenData.specialization_tags?.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold mb-3">Specialization Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {citizenData.specialization_tags.map((tag, index) => (
                                    <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                                        {tag.replace('_', ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Global Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="w-8 h-8 text-blue-500" />
                        <span className="text-sm text-gray-500">Total Citizens</span>
                    </div>
                    <div className="text-2xl font-bold">1.2M+</div>
                    <div className="text-green-500 text-sm">↑ 15% this month</div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Flag className="w-8 h-8 text-green-500" />
                        <span className="text-sm text-gray-500">Countries</span>
                    </div>
                    <div className="text-2xl font-bold">195</div>
                    <div className="text-green-500 text-sm">Global coverage</div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        <span className="text-sm text-gray-500">Active Leaders</span>
                    </div>
                    <div className="text-2xl font-bold">25K+</div>
                    <div className="text-green-500 text-sm">Growing daily</div>
                </div>
            </div>
        </div>
    );

    // ===================================
    // COMMUNITIES TAB
    // ===================================
    const CommunitiesTab = () => (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center">
                    <Users className="mr-3 text-blue-500" />
                    Diaspora Communities
                </h2>
                
                <button
                    onClick={() => setShowCommunityForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Create Community
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search communities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Types</option>
                        <option value="country">Country</option>
                        <option value="regional">Regional</option>
                        <option value="continental">Continental</option>
                        <option value="global">Global</option>
                    </select>
                </div>
            </div>

            {/* Communities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communities.map((community) => (
                    <div key={community.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{community.community_name}</h3>
                                <p className="text-sm text-gray-500">{community.community_code}</p>
                            </div>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs capitalize">
                                {community.community_type}
                            </span>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-2" />
                                {community.primary_country || 'Global'}
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600">
                                <Users className="w-4 h-4 mr-2" />
                                {community.member_count || 0} members
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600">
                                <Star className="w-4 h-4 mr-2" />
                                {community.community_reputation?.toFixed(0) || 0} reputation
                            </div>
                        </div>
                        
                        <button
                            onClick={() => handleJoinCommunity(community.id)}
                            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Join Community
                        </button>
                    </div>
                ))}
            </div>

            {/* Create Community Modal */}
            {showCommunityForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">Create New Community</h3>
                        
                        <CommunityCreationForm
                            onSubmit={handleCreateCommunity}
                            onCancel={() => setShowCommunityForm(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );

    // ===================================
    // LEADERSHIP TAB
    // ===================================
    const LeadershipTab = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
                <Crown className="mr-3 text-yellow-500" />
                Global Leadership
            </h2>

            {/* Leadership Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {leadershipData.map((role) => (
                    <div key={role.role_type} className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold capitalize">{role.role_type.replace('_', ' ')}</h3>
                            {role.role_type === 'presidents' && <Crown className="w-6 h-6 text-yellow-500" />}
                            {role.role_type === 'ambassadors' && <Handshake className="w-6 h-6 text-blue-500" />}
                            {role.role_type === 'world_president' && <Globe className="w-6 h-6 text-purple-500" />}
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Count</span>
                                <span className="font-semibold">{role.total_count}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Avg Reputation</span>
                                <span className="font-semibold">{role.avg_reputation?.toFixed(0) || 0}</span>
                            </div>
                        </div>
                        
                        <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition-opacity">
                            View Details
                        </button>
                    </div>
                ))}
            </div>

            {/* Leadership Path */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Your Leadership Journey</h3>
                
                <div className="space-y-4">
                    {[
                        { level: 'Citizen', description: 'Basic participation and community engagement', achieved: true },
                        { level: 'Resident', description: 'Active contributor with established reputation', achieved: citizenData?.citizenship_level !== 'citizen' },
                        { level: 'Ambassador', description: 'Diplomatic representative for your country', achieved: false },
                        { level: 'Country President', description: 'Lead your national community', achieved: false },
                        { level: 'World President', description: 'Symbolic global leadership role', achieved: false }
                    ].map((path, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                path.achieved ? 'bg-green-500' : 'bg-gray-300'
                            }`}>
                                {path.achieved ? <UserCheck className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-white" />}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold">{path.level}</h4>
                                <p className="text-sm text-gray-600">{path.description}</p>
                            </div>
                            {path.achieved && <Trophy className="w-6 h-6 text-yellow-500" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // ===================================
    // SUMMITS TAB
    // ===================================
    const SummitsTab = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
                <Calendar className="mr-3 text-green-500" />
                Global Summits
            </h2>

            {/* Upcoming Summits */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Next Global Summit</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-3xl font-bold mb-2">PEOPLE POWER WORLD SUMMIT #7</p>
                        <p className="text-lg opacity-90 mb-4">Theme: "Unity in Diversity"</p>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                <span>March 15, 2026</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-2" />
                                <span>24 Hours</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold mb-2">50K+</div>
                        <p className="opacity-90 mb-4">Expected Participants</p>
                        <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                            Register Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Summit Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summits.map((summit) => (
                    <div key={summit.summit_type} className="bg-white rounded-xl p-6 shadow-lg">
                        <h4 className="font-bold capitalize mb-3">{summit.summit_type} Summits</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total</span>
                                <span className="font-semibold">{summit.total_summits}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Registrations</span>
                                <span className="font-semibold">{summit.total_registrations?.toLocaleString() || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Attendees</span>
                                <span className="font-semibold">{summit.total_attendees?.toLocaleString() || 0}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Past Summits */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Recent Summits</h3>
                <div className="space-y-4">
                    {[
                        { name: 'Global Unity Summit #6', date: '2026-02-15', attendees: '45,234', theme: 'Digital Sovereignty' },
                        { name: 'Education Summit #5', date: '2026-01-20', attendees: '38,921', theme: 'Learning Revolution' },
                        { name: 'Infrastructure Summit #4', date: '2025-12-10', attendees: '42,156', theme: 'Building Tomorrow' }
                    ].map((summit, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h4 className="font-semibold">{summit.name}</h4>
                                <p className="text-sm text-gray-600">{summit.theme}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">{summit.date}</p>
                                <p className="font-semibold">{summit.attendees} attendees</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // ===================================
    // COMMUNITY CREATION FORM COMPONENT
    // ===================================
    const CommunityCreationForm = ({ onSubmit, onCancel }) => {
        const [formData, setFormData] = useState({
            communityName: '',
            communityType: 'country',
            primaryCountry: '',
            region: '',
            continent: ''
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(formData);
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Community Name</label>
                    <input
                        type="text"
                        required
                        value={formData.communityName}
                        onChange={(e) => setFormData({...formData, communityName: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter community name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Community Type</label>
                    <select
                        value={formData.communityType}
                        onChange={(e) => setFormData({...formData, communityType: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="country">Country</option>
                        <option value="regional">Regional</option>
                        <option value="continental">Continental</option>
                        <option value="global">Global</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Primary Country</label>
                    <input
                        type="text"
                        value={formData.primaryCountry}
                        onChange={(e) => setFormData({...formData, primaryCountry: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Uganda, Kenya, USA"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Region</label>
                    <input
                        type="text"
                        value={formData.region}
                        onChange={(e) => setFormData({...formData, region: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., East Africa, Europe"
                    />
                </div>

                <div className="flex space-x-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Create Community
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        );
    };

    // ===================================
    // NOTIFICATIONS PANEL
    // ===================================
    const NotificationsPanel = () => (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification, index) => (
                <div
                    key={index}
                    className={`p-4 rounded-lg shadow-lg max-w-sm ${
                        notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                    }`}
                >
                    <p>{notification.message}</p>
                </div>
            ))}
        </div>
    );

    // ===================================
    // MAIN RENDER
    // ===================================
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Global Civilization...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Globe className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold">PEOPLE POWER Global Civilization</h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-600 hover:text-gray-900">
                                <Bell className="w-6 h-6" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>
                            <button className="p-2 text-gray-600 hover:text-gray-900">
                                <Settings className="w-6 h-6" />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-600 hover:text-gray-900"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'network', label: 'Global Network', icon: Globe },
                            { id: 'communities', label: 'Communities', icon: Users },
                            { id: 'leadership', label: 'Leadership', icon: Crown },
                            { id: 'summits', label: 'Summits', icon: Calendar }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === 'network' && <NetworkTab />}
                {activeTab === 'communities' && <CommunitiesTab />}
                {activeTab === 'leadership' && <LeadershipTab />}
                {activeTab === 'summits' && <SummitsTab />}
            </div>

            {/* Notifications */}
            <NotificationsPanel />
        </div>
    );
};

export default GlobalCivilizationInterface;
