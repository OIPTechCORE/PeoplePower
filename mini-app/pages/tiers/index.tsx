import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Crown, 
  Star, 
  Trophy, 
  Zap, 
  TrendingUp, 
  Gift, 
  CheckCircle, 
  Lock, 
  Unlock, 
  ArrowUp, 
  ArrowDown, 
  Diamond, 
  Gem, 
  Sparkles, 
  Rocket, 
  Flame,
  Target,
  Award,
  Medal,
  Crown2,
  ShieldCheck,
  StarHalf,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface DiamondTier {
  tier: number;
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  requiredStake: number;
  bonusMultiplier: number;
  cashbackPercent: number;
  benefits: string[];
  features: string[];
  isUnlocked: boolean;
  currentStake: number;
  progress: number;
  nextTierStake?: number;
}

interface TierComparison {
  feature: string;
  bronze: string | boolean;
  silver: string | boolean;
  gold: string | boolean;
  platinum: string | boolean;
}

const DiamondTierSystem: React.FC = () => {
  const [tiers, setTiers] = useState<DiamondTier[]>([]);
  const [selectedTier, setSelectedTier] = useState<DiamondTier | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [activeTab, setActiveTab] = useState('tiers');
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    fetchDiamondTiers();
  }, []);

  const fetchDiamondTiers = async () => {
    try {
      const response = await fetch('/api/v1/infinity/diamond-tiers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTiers(data.data || []);
    } catch (error) {
      console.error('Failed to fetch diamond tiers:', error);
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || isNaN(Number(stakeAmount)) || Number(stakeAmount) <= 0) {
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
        setStakeAmount('');
        await fetchDiamondTiers();
      } else {
        console.error('Staking failed:', result.error);
      }
    } catch (error) {
      console.error('Staking error:', error);
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || isNaN(Number(unstakeAmount)) || Number(unstakeAmount) <= 0) {
      return;
    }

    setIsUnstaking(true);
    try {
      const response = await fetch('/api/v1/ton/unstake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: unstakeAmount })
      });

      const result = await response.json();
      
      if (result.success) {
        setUnstakeAmount('');
        await fetchDiamondTiers();
      } else {
        console.error('Unstaking failed:', result.error);
      }
    } catch (error) {
      console.error('Unstaking error:', error);
    } finally {
      setIsUnstaking(false);
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

  const formatTON = (amount: number) => {
    return `${amount.toFixed(4)} TON`;
  };

  const getTierIcon = (tier: number) => {
    switch (tier) {
      case 1: return <Shield className="h-8 w-8" />;
      case 2: return <Star className="h-8 w-8" />;
      case 3: return <Crown className="h-8 w-8" />;
      case 4: return <Trophy className="h-8 w-8" />;
      default: return <Shield className="h-8 w-8" />;
    }
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'from-orange-400 to-orange-600';
      case 2: return 'from-gray-400 to-gray-600';
      case 3: return 'from-yellow-400 to-yellow-600';
      case 4: return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const currentTier = tiers.find(t => t.isUnlocked) || tiers[0];
  const nextTier = tiers.find(t => !t.isUnlocked && t.tier > currentTier.tier);

  const tierComparison: TierComparison[] = [
    {
      feature: 'Bonus Multiplier',
      bronze: '1.0x',
      silver: '1.2x',
      gold: '1.5x',
      platinum: '2.0x'
    },
    {
      feature: 'Cashback Rate',
      bronze: '5%',
      silver: '10%',
      gold: '20%',
      platinum: '30%'
    },
    {
      feature: 'Priority Support',
      bronze: false,
      silver: true,
      gold: true,
      platinum: true
    },
    {
      feature: 'Exclusive Events',
      bronze: false,
      silver: false,
      gold: true,
      platinum: true
    },
    {
      feature: 'Personal Manager',
      bronze: false,
      silver: false,
      gold: false,
      platinum: true
    },
    {
      feature: 'Early Access',
      bronze: false,
      silver: true,
      gold: true,
      platinum: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            Diamond Tier System
          </h1>
          <p className="text-gray-300">Stake TON tokens to unlock premium benefits and exclusive rewards</p>
        </div>

        {/* Current Tier Overview */}
        {currentTier && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-purple-800 to-blue-800 border-purple-600">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-full bg-gradient-to-r ${getTierColor(currentTier.tier)}`}>
                      {getTierIcon(currentTier.tier)}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{currentTier.name}</h2>
                      <p className="text-gray-300 mb-4">Current Diamond Tier</p>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-400" />
                          <span>{currentTier.bonusMultiplier}x Multiplier</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-blue-400" />
                          <span>{currentTier.cashbackPercent}% Cashback</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center lg:text-right">
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm">Current Stake</p>
                      <p className="text-2xl font-bold">{formatTON(currentTier.currentStake)}</p>
                    </div>
                    {nextTier && (
                      <div>
                        <p className="text-gray-400 text-sm">Next Tier</p>
                        <p className="text-lg font-semibold">{nextTier.name}</p>
                        <p className="text-sm text-gray-400">
                          {formatTON(nextTier.requiredStake - currentTier.currentStake)} more
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {nextTier && (
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress to {nextTier.name}</span>
                      <span>{Math.round((currentTier.currentStake / nextTier.requiredStake) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(currentTier.currentStake / nextTier.requiredStake) * 100} 
                      className="h-3 bg-purple-700"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger value="tiers" className="data-[state=active]:bg-purple-600">
              <Diamond className="h-4 w-4 mr-2" />
              Diamond Tiers
            </TabsTrigger>
            <TabsTrigger value="staking" className="data-[state=active]:bg-purple-600">
              <Zap className="h-4 w-4 mr-2" />
              Staking
            </TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-purple-600">
              <Target className="h-4 w-4 mr-2" />
              Comparison
            </TabsTrigger>
          </TabsList>

          {/* Diamond Tiers Tab */}
          <TabsContent value="tiers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tiers.map((tier) => (
                <Dialog key={tier.tier}>
                  <DialogTrigger asChild>
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-2xl hover:scale-105 ${
                        tier.isUnlocked 
                          ? `bg-gradient-to-br ${tier.gradient} border-transparent` 
                          : 'bg-gray-800 border-gray-700 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-full bg-gradient-to-r ${getTierColor(tier.tier)}`}>
                              {getTierIcon(tier.tier)}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{tier.name}</h3>
                              <p className="text-sm text-gray-300">Tier {tier.tier}</p>
                            </div>
                          </div>
                          {tier.isUnlocked ? (
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-600 text-white">
                              <Lock className="h-3 w-3 mr-1" />
                              Locked
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Required Stake:</span>
                            <span className="font-bold">{formatTON(tier.requiredStake)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Bonus Multiplier:</span>
                            <span className="font-bold text-green-400">{tier.bonusMultiplier}x</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Cashback Rate:</span>
                            <span className="font-bold text-blue-400">{tier.cashbackPercent}%</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="flex flex-wrap gap-1">
                            {tier.benefits.slice(0, 3).map((benefit, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                            {tier.benefits.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{tier.benefits.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>

                  <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <div className={`p-3 rounded-full bg-gradient-to-r ${getTierColor(tier.tier)}`}>
                          {getTierIcon(tier.tier)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            {tier.name}
                            {tier.isUnlocked && (
                              <Badge className="bg-green-600 text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-400">Tier {tier.tier}</p>
                        </div>
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-800 rounded-lg">
                          <h4 className="font-semibold mb-2 text-green-400">Required Stake</h4>
                          <p className="text-2xl font-bold">{formatTON(tier.requiredStake)}</p>
                        </div>
                        <div className="p-4 bg-gray-800 rounded-lg">
                          <h4 className="font-semibold mb-2 text-blue-400">Current Stake</h4>
                          <p className="text-2xl font-bold">{formatTON(tier.currentStake)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-800 rounded-lg">
                          <h4 className="font-semibold mb-2 text-green-400">Bonus Multiplier</h4>
                          <p className="text-2xl font-bold">{tier.bonusMultiplier}x</p>
                        </div>
                        <div className="p-4 bg-gray-800 rounded-lg">
                          <h4 className="font-semibold mb-2 text-blue-400">Cashback Rate</h4>
                          <p className="text-2xl font-bold">{tier.cashbackPercent}%</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Premium Benefits</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {tier.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                              <Gift className="h-4 w-4 text-purple-400" />
                              <span className="text-sm">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Exclusive Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {tier.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                              <Sparkles className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {!tier.isUnlocked && tier.currentStake < tier.requiredStake && (
                        <div className="p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Lock className="h-4 w-4 text-yellow-400" />
                            <span className="font-semibold text-yellow-400">Tier Locked</span>
                          </div>
                          <p className="text-sm text-yellow-300">
                            Stake {formatTON(tier.requiredStake - tier.currentStake)} more to unlock this tier.
                          </p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </TabsContent>

          {/* Staking Tab */}
          <TabsContent value="staking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stake Tokens */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUp className="h-5 w-5 text-green-400" />
                    Stake Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (TON)</label>
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="Enter amount to stake"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="p-4 bg-gray-700 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Stake:</span>
                      <span>{formatTON(currentTier?.currentStake || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>After Staking:</span>
                      <span>{formatTON((currentTier?.currentStake || 0) + Number(stakeAmount || 0))}</span>
                    </div>
                    {nextTier && (
                      <div className="flex justify-between text-sm">
                        <span>To Next Tier:</span>
                        <span>{formatTON(Math.max(0, nextTier.requiredStake - (currentTier?.currentStake || 0)))}</span>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={handleStake}
                    disabled={isStaking || !stakeAmount || Number(stakeAmount) <= 0}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isStaking ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Staking...
                      </>
                    ) : (
                      <>
                        <ArrowUp className="h-4 w-4 mr-2" />
                        Stake Tokens
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Unstake Tokens */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowDown className="h-5 w-5 text-red-400" />
                    Unstake Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (TON)</label>
                    <input
                      type="number"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      placeholder="Enter amount to unstake"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                      min="0.01"
                      step="0.01"
                      max={currentTier?.currentStake || 0}
                    />
                  </div>
                  
                  <div className="p-4 bg-gray-700 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Stake:</span>
                      <span>{formatTON(currentTier?.currentStake || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>After Unstaking:</span>
                      <span>{formatTON(Math.max(0, (currentTier?.currentStake || 0) - Number(unstakeAmount || 0)))}</span>
                    </div>
                    {nextTier && (currentTier?.currentStake || 0) - Number(unstakeAmount || 0) < nextTier.requiredStake && (
                      <div className="flex justify-between text-sm text-yellow-400">
                        <span>Tier Impact:</span>
                        <span>May downgrade to {tiers.find(t => t.tier === nextTier.tier - 1)?.name}</span>
                      </div>
                    )}
                  </div>

                  <Alert className="border-red-600 bg-red-900/30">
                    <ArrowDown className="h-4 w-4" />
                    <AlertDescription>
                      Unstaking tokens may reduce your diamond tier and associated benefits.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    onClick={handleUnstake}
                    disabled={isUnstaking || !unstakeAmount || Number(unstakeAmount) <= 0 || Number(unstakeAmount) > (currentTier?.currentStake || 0)}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isUnstaking ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Unstaking...
                      </>
                    ) : (
                      <>
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Unstake Tokens
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Staking Information */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-400" />
                  Staking Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-400">Flexible Staking</h4>
                    <p className="text-sm text-gray-300">
                      Stake any amount, anytime. Upgrade tiers by increasing your stake.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-400">Instant Rewards</h4>
                    <p className="text-sm text-gray-300">
                      Start earning rewards immediately after staking.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2 text-purple-400">No Lock Period</h4>
                    <p className="text-sm text-gray-300">
                      Unstake your tokens anytime without penalties.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  Tier Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-3">Feature</th>
                        <th className="text-center p-3">
                          <div className="flex flex-col items-center">
                            <Shield className="h-5 w-5 text-orange-400 mb-1" />
                            Bronze
                          </div>
                        </th>
                        <th className="text-center p-3">
                          <div className="flex flex-col items-center">
                            <Star className="h-5 w-5 text-gray-400 mb-1" />
                            Silver
                          </div>
                        </th>
                        <th className="text-center p-3">
                          <div className="flex flex-col items-center">
                            <Crown className="h-5 w-5 text-yellow-400 mb-1" />
                            Gold
                          </div>
                        </th>
                        <th className="text-center p-3">
                          <div className="flex flex-col items-center">
                            <Trophy className="h-5 w-5 text-purple-400 mb-1" />
                            Platinum
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tierComparison.map((row, index) => (
                        <tr key={index} className="border-b border-gray-700">
                          <td className="p-3 font-medium">{row.feature}</td>
                          <td className="p-3 text-center">
                            {typeof row.bronze === 'boolean' ? (
                              row.bronze ? (
                                <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                              ) : (
                                <Lock className="h-5 w-5 text-gray-500 mx-auto" />
                              )
                            ) : (
                              <span className="text-green-400">{row.bronze}</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {typeof row.silver === 'boolean' ? (
                              row.silver ? (
                                <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                              ) : (
                                <Lock className="h-5 w-5 text-gray-500 mx-auto" />
                              )
                            ) : (
                              <span className="text-blue-400">{row.silver}</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {typeof row.gold === 'boolean' ? (
                              row.gold ? (
                                <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                              ) : (
                                <Lock className="h-5 w-5 text-gray-500 mx-auto" />
                              )
                            ) : (
                              <span className="text-yellow-400">{row.gold}</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {typeof row.platinum === 'boolean' ? (
                              row.platinum ? (
                                <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                              ) : (
                                <Lock className="h-5 w-5 text-gray-500 mx-auto" />
                              )
                            ) : (
                              <span className="text-purple-400">{row.platinum}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DiamondTierSystem;
