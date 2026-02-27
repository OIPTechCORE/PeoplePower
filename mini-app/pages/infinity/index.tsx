import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BadgeCheck, Trophy, Star, Crown, Zap, Shield, Gift, TrendingUp, Users, DollarSign, Activity, AlertTriangle, CheckCircle, XCircle, Clock, RefreshCw, Download, Eye, Edit, Ban, Settings } from 'lucide-react';

interface InfinityBadge {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlockCost: number;
  tier: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface DiamondTier {
  tier: number;
  name: string;
  requiredStake: number;
  bonusMultiplier: number;
  cashbackPercent: number;
  benefits: string[];
  icon: string;
  color: string;
}

interface UserInfinityStats {
  totalBadges: number;
  unlockedBadges: number;
  currentTier: number;
  totalStaked: number;
  nextTierProgress: number;
  reputation: number;
  achievements: string[];
}

const InfinitySystem: React.FC = () => {
  const [badges, setBadges] = useState<InfinityBadge[]>([]);
  const [diamondTiers, setDiamondTiers] = useState<DiamondTier[]>([]);
  const [userStats, setUserStats] = useState<UserInfinityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<InfinityBadge | null>(null);
  const [selectedTier, setSelectedTier] = useState<DiamondTier | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);

  useEffect(() => {
    fetchInfinityData();
  }, []);

  const fetchInfinityData = async () => {
    try {
      // Fetch badges
      const badgesResponse = await fetch('/api/v1/infinity/badges');
      const badgesData = await badgesResponse.json();
      setBadges(badgesData.data);

      // Fetch diamond tiers
      const tiersResponse = await fetch('/api/v1/infinity/diamond-tiers');
      const tiersData = await tiersResponse.json();
      setDiamondTiers(tiersData.data);

      // Fetch user stats
      const statsResponse = await fetch('/api/v1/infinity/user-stats');
      const statsData = await statsResponse.json();
      setUserStats(statsData.data);
    } catch (error) {
      console.error('Failed to fetch infinity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || isNaN(Number(stakeAmount))) {
      return;
    }

    setIsStaking(true);
    try {
      const response = await fetch('/api/v1/ton/stake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: stakeAmount })
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh data
        await fetchInfinityData();
        setStakeAmount('');
      } else {
        console.error('Staking failed:', result.error);
      }
    } catch (error) {
      console.error('Staking error:', error);
    } finally {
      setIsStaking(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierIcon = (tier: number) => {
    switch (tier) {
      case 1: return <Shield className="h-6 w-6 text-orange-500" />;
      case 2: return <Star className="h-6 w-6 text-gray-500" />;
      case 3: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 4: return <Trophy className="h-6 w-6 text-purple-500" />;
      default: return <BadgeCheck className="h-6 w-6 text-gray-400" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Infinity System</h1>
          <p className="text-gray-600">Unlock infinite possibilities with badges and diamond tiers</p>
        </div>

        {/* User Stats Overview */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Current Tier</p>
                    <p className="text-2xl font-bold flex items-center gap-2">
                      {getTierIcon(userStats.currentTier)}
                      {diamondTiers.find(t => t.tier === userStats.currentTier)?.name || 'None'}
                    </p>
                  </div>
                  <div className="text-3xl">{getTierIcon(userStats.currentTier)}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Badges Unlocked</p>
                    <p className="text-2xl font-bold">{userStats.unlockedBadges}/{userStats.totalBadges}</p>
                  </div>
                  <div className="text-3xl"><BadgeCheck className="h-8 w-8" /></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Total Staked</p>
                    <p className="text-2xl font-bold">{formatCurrency(userStats.totalStaked)}</p>
                  </div>
                  <div className="text-3xl"><DollarSign className="h-8 w-8" /></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Reputation</p>
                    <p className="text-2xl font-bold">{userStats.reputation.toLocaleString()}</p>
                  </div>
                  <div className="text-3xl"><TrendingUp className="h-8 w-8" /></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="badges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="badges">Infinity Badges</TabsTrigger>
            <TabsTrigger value="tiers">Diamond Tiers</TabsTrigger>
            <TabsTrigger value="staking">Staking</TabsTrigger>
          </TabsList>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5" />
                  Infinity Badges Collection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <Card 
                      key={badge.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        badge.isUnlocked ? 'bg-gradient-to-r from-purple-50 to-blue-50' : 'bg-gray-50 opacity-75'
                      }`}
                      onClick={() => setSelectedBadge(badge)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-2xl">{badge.icon}</div>
                          <Badge className={getRarityColor(badge.rarity)}>
                            {badge.rarity}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{badge.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {badge.unlockCost} TON
                          </span>
                          {badge.isUnlocked ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Lock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diamond Tiers Tab */}
          <TabsContent value="tiers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Diamond Tier System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {diamondTiers.map((tier) => (
                    <Card 
                      key={tier.tier}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        userStats?.currentTier >= tier.tier ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-gray-50'
                      }`}
                      onClick={() => setSelectedTier(tier)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{tier.icon}</div>
                            <div>
                              <h3 className="font-bold text-xl">{tier.name}</h3>
                              <p className="text-sm text-gray-600">Tier {tier.tier}</p>
                            </div>
                          </div>
                          {userStats?.currentTier >= tier.tier && (
                            <Badge className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Required Stake:</span>
                            <span className="font-bold">{formatCurrency(tier.requiredStake)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Bonus Multiplier:</span>
                            <span className="font-bold">{tier.bonusMultiplier}x</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Cashback:</span>
                            <span className="font-bold">{tier.cashbackPercent}%</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Benefits:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {tier.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staking Tab */}
          <TabsContent value="staking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Stake TON Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="stake-amount">Stake Amount (TON)</Label>
                      <Input
                        id="stake-amount"
                        type="number"
                        placeholder="Enter amount to stake"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        min="1"
                        step="0.1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Stake:</span>
                        <span className="font-medium">{formatCurrency(userStats?.totalStaked || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Next Tier:</span>
                        <span className="font-medium">
                          {diamondTiers.find(t => t.tier === (userStats?.currentTier || 0) + 1)?.name || 'Max Tier'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Amount Needed:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            Math.max(0, (diamondTiers.find(t => t.tier === (userStats?.currentTier || 0) + 1)?.requiredStake || 0) - (userStats?.totalStaked || 0))
                          )}
                        </span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleStake}
                      disabled={isStaking || !stakeAmount || Number(stakeAmount) <= 0}
                      className="w-full"
                    >
                      {isStaking ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Staking...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Stake Tokens
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Staking Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Staking locks your TON tokens for diamond tier benefits. You can unstake anytime, but tier benefits will be adjusted accordingly.
                      </Alert>
                    </Alert>

                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-1">Tier Benefits</h4>
                        <p className="text-sm text-blue-700">
                          Higher tiers provide better multipliers, cashback rates, and exclusive features.
                        </p>
                      </div>

                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-1">Staking Rewards</h4>
                        <p className="text-sm text-green-700">
                          Earn passive income while staking and unlock premium features.
                        </p>
                      </div>

                      <div className="p-3 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-1">Flexible Staking</h4>
                        <p className="text-sm text-purple-700">
                          Stake any amount, anytime. Upgrade tiers by increasing your stake.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Badge Detail Dialog */}
        <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="text-2xl">{selectedBadge?.icon}</div>
                {selectedBadge?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedBadge && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getRarityColor(selectedBadge.rarity)}>
                    {selectedBadge.rarity}
                  </Badge>
                  {selectedBadge.isUnlocked ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Unlocked
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">
                      <Lock className="h-3 w-3 mr-1" />
                      Locked
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600">{selectedBadge.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Unlock Cost:</span>
                    <span>{formatCurrency(selectedBadge.unlockCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Category:</span>
                    <span>{selectedBadge.category}</span>
                  </div>
                  {selectedBadge.unlockedAt && (
                    <div className="flex justify-between">
                      <span className="font-medium">Unlocked At:</span>
                      <span>{new Date(selectedBadge.unlockedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Tier Detail Dialog */}
        <Dialog open={!!selectedTier} onOpenChange={() => setSelectedTier(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="text-2xl">{selectedTier?.icon}</div>
                {selectedTier?.name} Tier
              </DialogTitle>
            </DialogHeader>
            {selectedTier && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">{selectedTier.icon}</div>
                  <h3 className="text-xl font-bold">{selectedTier.name}</h3>
                  <p className="text-gray-600">Tier {selectedTier.tier}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Required Stake:</span>
                    <span className="font-bold text-lg">{formatCurrency(selectedTier.requiredStake)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Bonus Multiplier:</span>
                    <span className="font-bold text-lg">{selectedTier.bonusMultiplier}x</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Cashback Rate:</span>
                    <span className="font-bold text-lg">{selectedTier.cashbackPercent}%</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Premium Benefits:</h4>
                  <ul className="space-y-2">
                    {selectedTier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Gift className="h-4 w-4 text-purple-500" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default InfinitySystem;
