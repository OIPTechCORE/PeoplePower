'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    TrendingUp, 
    Shield, 
    Brain, 
    Users, 
    Trophy, 
    Clock,
    Zap,
    Award,
    GraduationCap,
    Balance,
    Sparkles,
    Star,
    Lock,
    Unlock
} from 'lucide-react';

// ===================================
// REPUTATION STAKING INTERFACE
// "STAKE YOUR INFLUENCE, EARN YOUR LEGACY"
// ===================================

const ReputationStakingInterface = ({ playerId }) => {
    const [activeTab, setActiveTab] = useState('pools');
    const [stakingData, setStakingData] = useState({
        pools: [],
        portfolio: [],
        stats: null,
        governance: null,
        achievements: [],
        educationAccess: []
    });
    const [loading, setLoading] = useState(true);
    const [selectedPool, setSelectedPool] = useState(null);
    const [stakeForm, setStakeForm] = useState({
        amount: '',
        lockPeriod: 30
    });

    useEffect(() => {
        loadStakingData();
    }, [playerId]);

    const loadStakingData = async () => {
        try {
            setLoading(true);
            
            // Load pools
            const poolsResponse = await fetch(`/api/staking/pools?playerId=${playerId}`);
            const poolsData = await poolsResponse.json();
            
            // Load portfolio
            const portfolioResponse = await fetch(`/api/staking/portfolio/${playerId}`);
            const portfolioData = await portfolioResponse.json();
            
            // Load governance
            const governanceResponse = await fetch(`/api/staking/governance/${playerId}`);
            const governanceData = await governanceResponse.json();
            
            // Load achievements
            const achievementsResponse = await fetch(`/api/staking/achievements/${playerId}`);
            const achievementsData = await achievementsResponse.json();
            
            // Load education access
            const educationResponse = await fetch(`/api/staking/education/${playerId}`);
            const educationData = await educationResponse.json();
            
            setStakingData({
                pools: poolsData.data.pools,
                portfolio: portfolioData.data.portfolio,
                stats: portfolioData.data.stats,
                governance: governanceData.data.governancePower,
                achievements: achievementsData.data.achievements,
                educationAccess: educationData.data.educationAccess
            });
        } catch (error) {
            console.error('Error loading staking data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStake = async () => {
        if (!selectedPool || !stakeForm.amount) return;
        
        try {
            const response = await fetch('/api/staking/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerId,
                    poolId: selectedPool.id,
                    reputationAmount: parseFloat(stakeForm.amount),
                    lockPeriodDays: stakeForm.lockPeriod
                })
            });
            
            if (response.ok) {
                await loadStakingData();
                setStakeForm({ amount: '', lockPeriod: 30 });
                setSelectedPool(null);
            }
        } catch (error) {
            console.error('Error creating stake:', error);
        }
    };

    const handleClaimReward = async (rewardId) => {
        try {
            const response = await fetch(`/api/staking/claim/${rewardId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId })
            });
            
            if (response.ok) {
                await loadStakingData();
            }
        } catch (error) {
            console.error('Error claiming reward:', error);
        }
    };

    const handleOptimizePortfolio = async () => {
        try {
            const response = await fetch('/api/staking/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId })
            });
            
            if (response.ok) {
                const data = await response.json();
                // Show optimization results
                alert(`Expected APR improvement: ${data.data.optimization.expectedAPRImprovement.toFixed(2)}%`);
            }
        } catch (error) {
            console.error('Error optimizing portfolio:', error);
        }
    };

    const getPoolIcon = (poolType) => {
        switch (poolType) {
            case 'knowledge': return <Brain className="w-5 h-5 text-blue-500" />;
            case 'social': return <Users className="w-5 h-5 text-green-500" />;
            case 'builder': return <Trophy className="w-5 h-5 text-purple-500" />;
            case 'integrity': return <Shield className="w-5 h-5 text-yellow-500" />;
            case 'legacy': return <Star className="w-5 h-5 text-orange-500" />;
            case 'governance': return <Balance className="w-5 h-5 text-red-500" />;
            default: return <Sparkles className="w-5 h-5 text-gray-500" />;
        }
    };

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'common': return 'bg-gray-500';
            case 'rare': return 'bg-blue-500';
            case 'epic': return 'bg-purple-500';
            case 'legendary': return 'bg-orange-500';
            case 'mythic': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Total Staked</p>
                                <p className="text-2xl font-bold">{stakingData.stats?.totalReputationStaked || 0}</p>
                                <p className="text-blue-100 text-xs">Reputation Points</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Total Rewards</p>
                                <p className="text-2xl font-bold">{stakingData.stats?.totalRewardsEarned?.toFixed(2) || 0}</p>
                                <p className="text-green-100 text-xs">Earned</p>
                            </div>
                            <Zap className="w-8 h-8 text-green-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Governance Power</p>
                                <p className="text-2xl font-bold">{stakingData.governance?.totalGovernancePower?.toFixed(2) || 0}</p>
                                <p className="text-purple-100 text-xs">{stakingData.governance?.votingTier || 'Basic'}</p>
                            </div>
                            <Balance className="w-8 h-8 text-purple-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm">Active Stakes</p>
                                <p className="text-2xl font-bold">{stakingData.stats?.activeStakes || 0}</p>
                                <p className="text-orange-100 text-xs">Positions</p>
                            </div>
                            <Lock className="w-8 h-8 text-orange-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="pools">Pools</TabsTrigger>
                    <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                    <TabsTrigger value="rewards">Rewards</TabsTrigger>
                    <TabsTrigger value="governance">Governance</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>

                {/* Staking Pools */}
                <TabsContent value="pools" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stakingData.pools.map((pool) => (
                            <Card 
                                key={pool.id} 
                                className={`cursor-pointer transition-all hover:shadow-lg ${
                                    selectedPool?.id === pool.id ? 'ring-2 ring-blue-500' : ''
                                }`}
                                onClick={() => setSelectedPool(pool)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            {getPoolIcon(pool.type)}
                                            <CardTitle className="text-lg">{pool.name}</CardTitle>
                                        </div>
                                        <Badge variant="secondary">{pool.type}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">APR</span>
                                        <span className="text-lg font-bold text-green-600">
                                            {(pool.totalAPR * 100).toFixed(2)}%
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Min Stake</span>
                                        <span className="font-semibold">{pool.minStake} RP</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Lock Period</span>
                                        <span className="font-semibold">
                                            {pool.lockPeriodRange.min}-{pool.lockPeriodRange.max} days
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Total Staked</span>
                                        <span className="font-semibold">{pool.totalStaked} RP</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Stakers</span>
                                        <span className="font-semibold">{pool.totalStakers}</span>
                                    </div>

                                    {pool.governanceEnabled && (
                                        <Badge variant="outline" className="w-full justify-center">
                                            <Balance className="w-3 h-3 mr-1" />
                                            Governance Power
                                        </Badge>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Stake Creation Form */}
                    {selectedPool && (
                        <Card className="border-2 border-blue-500">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    {getPoolIcon(selectedPool.type)}
                                    <span>Create Stake in {selectedPool.name}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Reputation Amount
                                        </label>
                                        <input
                                            type="number"
                                            min={selectedPool.minStake}
                                            max={selectedPool.maxStake}
                                            value={stakeForm.amount}
                                            onChange={(e) => setStakeForm({...stakeForm, amount: e.target.value})}
                                            className="w-full p-2 border rounded"
                                            placeholder={`${selectedPool.minStake} - ${selectedPool.maxStake || '∞'}`}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Lock Period (days)
                                        </label>
                                        <input
                                            type="number"
                                            min={selectedPool.lockPeriodRange.min}
                                            max={selectedPool.lockPeriodRange.max}
                                            value={stakeForm.lockPeriod}
                                            onChange={(e) => setStakeForm({...stakeForm, lockPeriod: parseInt(e.target.value)})}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                    <Button 
                                        onClick={handleCreateStake}
                                        disabled={!stakeForm.amount || stakeForm.amount < selectedPool.minStake}
                                        className="flex-1"
                                    >
                                        <Lock className="w-4 h-4 mr-2" />
                                        Create Stake
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setSelectedPool(null)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Portfolio */}
                <TabsContent value="portfolio" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Your Staking Portfolio</h3>
                        <Button onClick={handleOptimizePortfolio} variant="outline">
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI Optimize
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stakingData.portfolio.map((stake) => (
                            <Card key={stake.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            {getPoolIcon(stake.poolType)}
                                            <CardTitle className="text-lg">{stake.poolType}</CardTitle>
                                        </div>
                                        <Badge variant={stake.isActive ? 'default' : 'secondary'}>
                                            {stake.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Staked Amount</span>
                                        <span className="font-semibold">{stake.reputationAmount} RP</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Stake Weight</span>
                                        <span className="font-semibold">{stake.stakeWeight.toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">APR</span>
                                        <span className="font-semibold text-green-600">
                                            {(stake.apr * 100).toFixed(2)}%
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Lock Period</span>
                                        <span className="font-semibold">{stake.lockPeriodDays} days</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Unlocks</span>
                                        <span className="font-semibold">
                                            {new Date(stake.unlocksAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">Multipliers:</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="flex justify-between">
                                                <span>Reputation:</span>
                                                <span>{stake.multipliers.reputation.toFixed(2)}x</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Community:</span>
                                                <span>{stake.multipliers.community.toFixed(2)}x</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Lock:</span>
                                                <span>{stake.multipliers.lock.toFixed(2)}x</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Special:</span>
                                                <span>{stake.multipliers.special.toFixed(2)}x</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Rewards */}
                <TabsContent value="rewards" className="space-y-4">
                    <h3 className="text-lg font-semibold">Staking Rewards</h3>
                    
                    {stakingData.portfolio.map((stake) => (
                        <Card key={stake.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">{stake.poolType} Pool Rewards</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RewardList stakeId={stake.id} playerId={playerId} onClaim={handleClaimReward} />
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* Governance */}
                <TabsContent value="governance" className="space-y-4">
                    <h3 className="text-lg font-semibold">Governance Power</h3>
                    
                    {stakingData.governance ? (
                        <Card>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Governance Power</p>
                                        <p className="text-2xl font-bold">{stakingData.governance.totalGovernancePower.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Voting Tier</p>
                                        <Badge variant="outline" className="text-lg">
                                            {stakingData.governance.votingTier}
                                        </Badge>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Power Sources:</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span>Staked Reputation:</span>
                                            <span>{stakingData.governance.stakedReputationPower.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Community Leadership:</span>
                                            <span>{stakingData.governance.communityLeadershipBonus.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Integrity Voter:</span>
                                            <span>{stakingData.governance.integrityVoterBonus.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Long-term Staker:</span>
                                            <span>{stakingData.governance.longTermStakerBonus.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Voting Statistics:</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span>Proposals Voted:</span>
                                            <span>{stakingData.governance.votingStats.proposalsVoted}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Proposals Created:</span>
                                            <span>{stakingData.governance.votingStats.proposalsCreated}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Voting Alignment:</span>
                                            <span>{(stakingData.governance.votingStats.votingAlignmentScore * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="text-center py-8">
                                <Balance className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600">No governance power yet</p>
                                <p className="text-sm text-gray-500">Stake reputation to earn governance power</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Achievements */}
                <TabsContent value="achievements" className="space-y-4">
                    <h3 className="text-lg font-semibold">Staking Achievements</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stakingData.achievements.map((achievement) => (
                            <Card key={achievement.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-12 h-12 rounded-full ${getRarityColor(achievement.rarity)} flex items-center justify-center`}>
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{achievement.name}</h4>
                                            <p className="text-sm text-gray-600">{achievement.description}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {achievement.rarity}
                                                </Badge>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(achievement.earnedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    
                    {stakingData.achievements.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-8">
                                <Trophy className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600">No achievements yet</p>
                                <p className="text-sm text-gray-500">Start staking to unlock achievements</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

// Reward List Component
const RewardList = ({ stakeId, playerId, onClaim }) => {
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRewards();
    }, [stakeId]);

    const loadRewards = async () => {
        try {
            const response = await fetch(`/api/staking/rewards/${stakeId}`);
            const data = await response.json();
            setRewards(data.data.rewards);
        } catch (error) {
            console.error('Error loading rewards:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>;
    }

    return (
        <div className="space-y-2">
            {rewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <Badge variant="outline">{reward.type}</Badge>
                            <span className="font-semibold">{reward.amount.toFixed(4)}</span>
                            <span className="text-sm text-gray-600">
                                APR: {(reward.apr * 100).toFixed(2)}%
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {new Date(reward.period.start).toLocaleDateString()} - {new Date(reward.period.end).toLocaleDateString()}
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        {reward.isClaimed ? (
                            <Badge variant="secondary">Claimed</Badge>
                        ) : (
                            <Button 
                                size="sm" 
                                onClick={() => onClaim(reward.id)}
                                disabled={reward.autoCompounded}
                            >
                                {reward.autoCompounded ? 'Compounded' : 'Claim'}
                            </Button>
                        )}
                    </div>
                </div>
            ))}
            
            {rewards.length === 0 && (
                <p className="text-center text-gray-500 py-4">No rewards available yet</p>
            )}
        </div>
    );
};

export default ReputationStakingInterface;
