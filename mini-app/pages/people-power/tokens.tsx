import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Coins, 
  TrendingUp, 
  Users, 
  Crown, 
  Zap, 
  Globe, 
  Heart, 
  Star, 
  Rocket, 
  Shield, 
  Flag, 
  Award,
  Target,
  Flame,
  Diamond,
  Trophy,
  Plus,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Eye,
  MessageSquare,
  Share2
} from 'lucide-react';

interface MovementToken {
  id: string;
  name: string;
  symbol: string;
  purpose: string;
  description: string;
  creator: string;
  creatorAvatar: string;
  marketCap: number;
  price: number;
  change24h: number;
  volume24h: number;
  holders: number;
  totalSupply: number;
  impact: {
    education: number;
    community: number;
    governance: number;
  };
  tags: string[];
  isVerified: boolean;
  isTrending: boolean;
  createdAt: Date;
}

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  balance: number;
  reputation: number;
  tokensCreated: number;
  tokensOwned: string[];
  impactScore: number;
  isPremium: boolean;
}

const PeoplePowerTokenEcosystem: React.FC = () => {
  const [tokens, setTokens] = useState<MovementToken[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedToken, setSelectedToken] = useState<MovementToken | null>(null);
  const [activeTab, setActiveTab] = useState('trending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateToken, setShowCreateToken] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchTokens();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/v1/people-power/profile', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setUserProfile(data.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const fetchTokens = async () => {
    try {
      const response = await fetch('/api/v1/people-power/tokens', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setTokens(data.data || []);
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
    }
  };

  const handleCreateToken = async (tokenData: any) => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/v1/people-power/tokens/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(tokenData)
      });

      if (response.ok) {
        await fetchTokens();
        await fetchUserProfile();
        setShowCreateToken(false);
      }
    } catch (error) {
      console.error('Failed to create token:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredTokens = tokens.filter(token => {
    const searchMatch = !searchTerm || 
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    return searchMatch;
  });

  const trendingTokens = tokens.filter(token => token.isTrending);
  const topTokens = tokens.sort((a, b) => b.marketCap - a.marketCap).slice(0, 10);
  const newTokens = tokens.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);
  const ownedTokens = userProfile ? tokens.filter(token => userProfile.tokensOwned.includes(token.id)) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            People Power Movement Economy
          </h1>
          <p className="text-gray-300">Build communities, create impact, empower movements</p>
        </div>

        {/* User Profile Overview */}
        {userProfile && (
          <Card className="mb-8 bg-gradient-to-r from-purple-800 to-blue-800 border-purple-600">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center">
                    <Crown className="h-8 w-8 text-purple-900" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{userProfile.displayName}</h2>
                    <p className="text-purple-200">@{userProfile.username}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-yellow-600 text-white">
                        <Coins className="h-3 w-3 mr-1" />
                        {userProfile.balance.toLocaleString()} PPC
                      </Badge>
                      <Badge className="bg-blue-600 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        {userProfile.reputation} Rep
                      </Badge>
                      <Badge className="bg-green-600 text-white">
                        <Heart className="h-3 w-3 mr-1" />
                        {userProfile.impactScore} Impact
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    onClick={() => setShowCreateToken(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Movement Token
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search movement tokens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>
              <Button variant="outline" className="border-gray-600">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800 border-gray-700">
            <TabsTrigger value="trending" className="data-[state=active]:bg-purple-600">
              <Flame className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="top" className="data-[state=active]:bg-purple-600">
              <Trophy className="h-4 w-4 mr-2" />
              Top
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-purple-600">
              <Rocket className="h-4 w-4 mr-2" />
              New
            </TabsTrigger>
            <TabsTrigger value="owned" className="data-[state=active]:bg-purple-600">
              <Shield className="h-4 w-4 mr-2" />
              Owned
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
              <Globe className="h-4 w-4 mr-2" />
              All
            </TabsTrigger>
          </TabsList>

          {/* Trending Tokens */}
          <TabsContent value="trending" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingTokens.map((token) => (
                <TokenCard 
                  key={token.id} 
                  token={token} 
                  onSelect={setSelectedToken}
                  userProfile={userProfile}
                />
              ))}
            </div>
          </TabsContent>

          {/* Top Tokens */}
          <TabsContent value="top" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topTokens.map((token) => (
                <TokenCard 
                  key={token.id} 
                  token={token} 
                  onSelect={setSelectedToken}
                  userProfile={userProfile}
                />
              ))}
            </div>
          </TabsContent>

          {/* New Tokens */}
          <TabsContent value="new" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newTokens.map((token) => (
                <TokenCard 
                  key={token.id} 
                  token={token} 
                  onSelect={setSelectedToken}
                  userProfile={userProfile}
                />
              ))}
            </div>
          </TabsContent>

          {/* Owned Tokens */}
          <TabsContent value="owned" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedTokens.map((token) => (
                <TokenCard 
                  key={token.id} 
                  token={token} 
                  onSelect={setSelectedToken}
                  userProfile={userProfile}
                />
              ))}
            </div>
          </TabsContent>

          {/* All Tokens */}
          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTokens.map((token) => (
                <TokenCard 
                  key={token.id} 
                  token={token} 
                  onSelect={setSelectedToken}
                  userProfile={userProfile}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Token Details Dialog */}
        {selectedToken && (
          <TokenDetailsDialog 
            token={selectedToken} 
            onClose={() => setSelectedToken(null)}
            userProfile={userProfile}
          />
        )}

        {/* Create Token Dialog */}
        {showCreateToken && (
          <CreateTokenDialog 
            onClose={() => setShowCreateToken(false)}
            onCreate={handleCreateToken}
            isCreating={isCreating}
          />
        )}
      </div>
    </div>
  );
};

// Token Card Component
const TokenCard: React.FC<{
  token: MovementToken;
  onSelect: (token: MovementToken) => void;
  userProfile: UserProfile | null;
}> = ({ token, onSelect, userProfile }) => {
  const isOwned = userProfile?.tokensOwned.includes(token.id);
  
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
        isOwned ? 'ring-2 ring-yellow-400' : ''
      } bg-gray-800 border-gray-700`}
      onClick={() => onSelect(token)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{token.name}</h3>
              <p className="text-gray-400">{token.symbol}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {token.isVerified && (
              <Badge className="bg-blue-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            {token.isTrending && (
              <Badge className="bg-red-600 text-white">
                <Flame className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{token.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Market Cap:</span>
            <span className="font-bold">${token.marketCap.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Price:</span>
            <span className="font-bold">${token.price.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">24h Change:</span>
            <span className={`font-bold ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Holders:</span>
            <span className="font-bold">{token.holders.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button size="sm" className="flex-1">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trade
          </Button>
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Token Details Dialog Component
const TokenDetailsDialog: React.FC<{
  token: MovementToken;
  onClose: () => void;
  userProfile: UserProfile | null;
}> = ({ token, onClose, userProfile }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {token.name}
                {token.isVerified && (
                  <Badge className="bg-blue-600 text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {token.isTrending && (
                  <Badge className="bg-red-600 text-white">
                    <Flame className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-400">{token.symbol} • {token.purpose}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-gray-300">{token.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-2 text-green-400">Market Statistics</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Market Cap:</span>
                  <span>${token.marketCap.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span>${token.price.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>24h Volume:</span>
                  <span>${token.volume24h.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>24h Change:</span>
                  <span className={token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-400">Community</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Holders:</span>
                  <span>{token.holders.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Supply:</span>
                  <span>{token.totalSupply.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Creator:</span>
                  <span>{token.creator}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{token.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Impact Score</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{token.impact.education}</div>
                <p className="text-sm text-gray-400">Education</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{token.impact.community}</div>
                <p className="text-sm text-gray-400">Community</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{token.impact.governance}</div>
                <p className="text-sm text-gray-400">Governance</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {token.tags.map((tag, index) => (
                <Badge key={index} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-gradient-to-r from-green-500 to-blue-500">
              <TrendingUp className="h-4 w-4 mr-2" />
              Buy Token
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Discuss
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Create Token Dialog Component
const CreateTokenDialog: React.FC<{
  onClose: () => void;
  onCreate: (data: any) => void;
  isCreating: boolean;
}> = ({ onClose, onCreate, isCreating }) => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    purpose: '',
    description: '',
    totalSupply: 1000000,
    tags: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Create Movement Token</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Token Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg"
              placeholder="e.g., Kampala Freedom Token"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Symbol</label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg"
              placeholder="e.g., KFT"
              maxLength={10}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Purpose</label>
            <select
              value={formData.purpose}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg"
              required
            >
              <option value="">Select purpose</option>
              <option value="education">Education</option>
              <option value="freedom">Freedom</option>
              <option value="leadership">Leadership</option>
              <option value="community">Community</option>
              <option value="governance">Governance</option>
              <option value="empowerment">Empowerment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg"
              rows={3}
              placeholder="Describe your movement token's purpose and impact..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Total Supply</label>
            <input
              type="number"
              value={formData.totalSupply}
              onChange={(e) => setFormData(prev => ({ ...prev, totalSupply: Number(e.target.value) }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg"
              min={1000}
              max={1000000000}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isCreating} className="flex-1">
              {isCreating ? 'Creating...' : 'Create Token'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PeoplePowerTokenEcosystem;
