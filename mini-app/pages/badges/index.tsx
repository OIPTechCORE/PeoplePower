import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Shield, 
  Crown, 
  Zap, 
  Gift, 
  Lock, 
  Unlock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Award,
  Gem,
  Sparkles,
  Target,
  Flame,
  Heart,
  Rocket,
  Diamond,
  Medal,
  Crown2
} from 'lucide-react';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockCost: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  benefits: string[];
  requirements: string[];
}

interface BadgeCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const BadgeSystem: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'rarity' | 'progress' | 'name'>('rarity');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const categories: BadgeCategory[] = [
    {
      id: 'all',
      name: 'All Badges',
      description: 'Complete badge collection',
      icon: <Trophy className="h-5 w-5" />,
      color: 'bg-gray-500'
    },
    {
      id: 'achievement',
      name: 'Achievements',
      description: 'Game milestones',
      icon: <Award className="h-5 w-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'social',
      name: 'Social',
      description: 'Community engagement',
      icon: <Heart className="h-5 w-5" />,
      color: 'bg-red-500'
    },
    {
      id: 'economic',
      name: 'Economic',
      description: 'Financial achievements',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-green-500'
    },
    {
      id: 'special',
      name: 'Special',
      description: 'Limited edition badges',
      icon: <Sparkles className="h-5 w-5" />,
      color: 'bg-purple-500'
    }
  ];

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/v1/infinity/badges', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setBadges(data.data || []);
    } catch (error) {
      console.error('Failed to fetch badges:', error);
    }
  };

  const handleUnlockBadge = async (badge: Badge) => {
    if (!badge.isUnlocked && badge.progress >= badge.maxProgress) {
      setIsUnlocking(true);
      try {
        const response = await fetch('/api/v1/infinity/badges/unlock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ badgeId: badge.id })
        });

        const result = await response.json();
        
        if (result.success) {
          // Update badge status
          setBadges(prev => prev.map(b => 
            b.id === badge.id 
              ? { ...b, isUnlocked: true, unlockedAt: new Date() }
              : b
          ));
        } else {
          console.error('Failed to unlock badge:', result.error);
        }
      } catch (error) {
        console.error('Error unlocking badge:', error);
      } finally {
        setIsUnlocking(false);
      }
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return <Target className="h-6 w-6" />;
      case 'social': return <Heart className="h-6 w-6" />;
      case 'economic': return <TrendingUp className="h-6 w-6" />;
      case 'special': return <Sparkles className="h-6 w-6" />;
      default: return <Trophy className="h-6 w-6" />;
    }
  };

  const filteredBadges = badges
    .filter(badge => {
      const categoryMatch = activeCategory === 'all' || badge.category === activeCategory;
      const unlockedMatch = !showUnlockedOnly || badge.isUnlocked;
      return categoryMatch && unlockedMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rarity':
          const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        case 'progress':
          return b.progress - a.progress;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const stats = {
    totalBadges: badges.length,
    unlockedBadges: badges.filter(b => b.isUnlocked).length,
    commonUnlocked: badges.filter(b => b.rarity === 'common' && b.isUnlocked).length,
    rareUnlocked: badges.filter(b => b.rarity === 'rare' && b.isUnlocked).length,
    epicUnlocked: badges.filter(b => b.rarity === 'epic' && b.isUnlocked).length,
    legendaryUnlocked: badges.filter(b => b.rarity === 'legendary' && b.isUnlocked).length,
  };

  const completionPercentage = Math.round((stats.unlockedBadges / stats.totalBadges) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Infinity Badges</h1>
          <p className="text-gray-600">Collect achievements and unlock exclusive rewards</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Collection Progress</p>
                  <p className="text-2xl font-bold">{completionPercentage}%</p>
                  <p className="text-sm text-purple-200">{stats.unlockedBadges}/{stats.totalBadges}</p>
                </div>
                <div className="text-3xl"><Trophy className="h-8 w-8" /></div>
              </div>
              <Progress value={completionPercentage} className="mt-4 bg-purple-300" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Common</p>
                  <p className="text-2xl font-bold">{stats.commonUnlocked}</p>
                  <p className="text-sm text-blue-200">Unlocked</p>
                </div>
                <div className="text-3xl"><Shield className="h-8 w-8" /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Rare & Epic</p>
                  <p className="text-2xl font-bold">{stats.rareUnlocked + stats.epicUnlocked}</p>
                  <p className="text-sm text-purple-200">Unlocked</p>
                </div>
                <div className="text-3xl"><Gem className="h-8 w-8" /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Legendary</p>
                  <p className="text-2xl font-bold">{stats.legendaryUnlocked}</p>
                  <p className="text-sm text-yellow-200">Unlocked</p>
                </div>
                <div className="text-3xl"><Crown2 className="h-8 w-8" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-5">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  {category.icon}
                  <span className="hidden lg:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex flex-wrap gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-lg bg-white text-sm"
              >
                <option value="rarity">Sort by Rarity</option>
                <option value="progress">Sort by Progress</option>
                <option value="name">Sort by Name</option>
              </select>

              <Button
                variant={showUnlockedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
              >
                {showUnlockedOnly ? <Unlock className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                {showUnlockedOnly ? 'Show All' : 'Unlocked Only'}
              </Button>
            </div>
          </div>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBadges.map((badge) => (
                  <Dialog key={badge.id}>
                    <DialogTrigger asChild>
                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                          badge.isUnlocked 
                            ? `bg-gradient-to-br ${getRarityGradient(badge.rarity)} text-white` 
                            : 'bg-gray-100 opacity-75 hover:opacity-100'
                        } border-2 ${badge.isUnlocked ? 'border-transparent' : 'border-gray-300'}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center text-center">
                            <div className="text-4xl mb-2">{badge.icon}</div>
                            <h3 className="font-bold text-lg mb-1">{badge.name}</h3>
                            <Badge className={`mb-2 ${getRarityColor(badge.rarity)}`}>
                              {badge.rarity}
                            </Badge>
                            
                            {!badge.isUnlocked && (
                              <div className="w-full mb-2">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Progress</span>
                                  <span>{badge.progress}/{badge.maxProgress}</span>
                                </div>
                                <Progress 
                                  value={(badge.progress / badge.maxProgress) * 100} 
                                  className="h-2"
                                />
                              </div>
                            )}

                            <div className="flex items-center gap-1">
                              {badge.isUnlocked ? (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-sm">Unlocked</span>
                                </>
                              ) : badge.progress >= badge.maxProgress ? (
                                <>
                                  <Zap className="h-4 w-4" />
                                  <span className="text-sm">Ready to Unlock</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="h-4 w-4" />
                                  <span className="text-sm">Locked</span>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          <div className="text-3xl">{badge.icon}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              {badge.name}
                              <Badge className={getRarityColor(badge.rarity)}>
                                {badge.rarity}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              {getCategoryIcon(badge.category)}
                              <span>{category.name}</span>
                            </div>
                          </div>
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-gray-600">{badge.description}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Requirements</h4>
                          <ul className="space-y-1">
                            {badge.requirements.map((req, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <div className={`w-2 h-2 rounded-full ${
                                  badge.isUnlocked ? 'bg-green-500' : 'bg-gray-300'
                                }`} />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Benefits</h4>
                          <ul className="space-y-1">
                            {badge.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <Gift className="h-4 w-4 text-green-500" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Progress</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Current Progress</span>
                              <span>{badge.progress}/{badge.maxProgress}</span>
                            </div>
                            <Progress 
                              value={(badge.progress / badge.maxProgress) * 100} 
                              className="h-3"
                            />
                            <p className="text-sm text-gray-500">
                              {badge.isUnlocked 
                                ? `Unlocked on ${badge.unlockedAt?.toLocaleDateString()}`
                                : badge.progress >= badge.maxProgress
                                  ? 'Ready to unlock!'
                                  : `${badge.maxProgress - badge.progress} more to unlock`
                              }
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div>
                            <p className="text-sm text-gray-500">Unlock Cost</p>
                            <p className="text-lg font-bold">{badge.unlockCost} TON</p>
                          </div>
                          
                          {badge.isUnlocked ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-5 w-5" />
                              <span className="font-semibold">Unlocked</span>
                            </div>
                          ) : badge.progress >= badge.maxProgress ? (
                            <Button 
                              onClick={() => handleUnlockBadge(badge)}
                              disabled={isUnlocking}
                              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                            >
                              {isUnlocking ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                  Unlocking...
                                </>
                              ) : (
                                <>
                                  <Zap className="h-4 w-4 mr-2" />
                                  Unlock Badge
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button disabled>
                              <Lock className="h-4 w-4 mr-2" />
                              Locked
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>

              {filteredBadges.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">
                    {activeCategory === 'all' ? '🏆' : getCategoryIcon(activeCategory)}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No badges found</h3>
                  <p className="text-gray-500">
                    {showUnlockedOnly 
                      ? 'No unlocked badges in this category yet. Keep playing to unlock more!'
                      : 'No badges available in this category yet.'
                    }
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default BadgeSystem;
