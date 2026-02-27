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
  CheckCircle, 
  Lock, 
  Unlock, 
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
  Crown2,
  ShieldCheck,
  StarHalf,
  Users,
  Calendar,
  MapPin,
  Briefcase,
  Gamepad2,
  Music,
  Camera,
  Book,
  Coffee,
  Pizza,
  Plane,
  Car,
  Home,
  HeartHandshake,
  Handshake,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bell,
  Settings,
  UserCheck,
  UserPlus,
  UserX,
  Eye,
  EyeOff
} from 'lucide-react';

interface ProfileBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'achievement' | 'social' | 'lifestyle' | 'skill' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  isEquipped: boolean;
  isVisible: boolean;
  benefits: string[];
  requirements: string[];
  displayOrder: number;
}

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  level: number;
  experience: number;
  totalBadges: number;
  equippedBadges: string[];
  publicProfile: boolean;
  showBadges: boolean;
  showProgress: boolean;
  badgeDisplayMode: 'grid' | 'carousel' | 'featured';
}

const ProfileBadgesSystem: React.FC = () => {
  const [badges, setBadges] = useState<ProfileBadge[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<ProfileBadge | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showLocked, setShowLocked] = useState(true);
  const [isEquipping, setIsEquipping] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    fetchProfileBadges();
    fetchUserProfile();
  }, []);

  const fetchProfileBadges = async () => {
    try {
      const response = await fetch('/api/v1/profile/badges', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setBadges(data.data || []);
    } catch (error) {
      console.error('Failed to fetch profile badges:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/v1/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUserProfile(data.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const handleEquipBadge = async (badgeId: string) => {
    setIsEquipping(true);
    try {
      const response = await fetch('/api/v1/profile/badges/equip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ badgeId })
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchProfileBadges();
        await fetchUserProfile();
      }
    } catch (error) {
      console.error('Failed to equip badge:', error);
    } finally {
      setIsEquipping(false);
    }
  };

  const handleUnequipBadge = async (badgeId: string) => {
    setIsEquipping(true);
    try {
      const response = await fetch('/api/v1/profile/badges/unequip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ badgeId })
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchProfileBadges();
        await fetchUserProfile();
      }
    } catch (error) {
      console.error('Failed to unequip badge:', error);
    } finally {
      setIsEquipping(false);
    }
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });

      const result = await response.json();
      
      if (result.success) {
        setUserProfile({ ...userProfile, ...updates });
        setEditingProfile(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'mythic': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      case 'mythic': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return <Trophy className="h-5 w-5" />;
      case 'social': return <Users className="h-5 w-5" />;
      case 'lifestyle': return <Heart className="h-5 w-5" />;
      case 'skill': return <Star className="h-5 w-5" />;
      case 'special': return <Sparkles className="h-5 w-5" />;
      default: return <Trophy className="h-5 w-5" />;
    }
  };

  const categories = [
    { id: 'all', name: 'All Badges', icon: <Trophy className="h-4 w-4" /> },
    { id: 'achievement', name: 'Achievements', icon: <Award className="h-4 w-4" /> },
    { id: 'social', name: 'Social', icon: <Users className="h-4 w-4" /> },
    { id: 'lifestyle', name: 'Lifestyle', icon: <Heart className="h-4 w-4" /> },
    { id: 'skill', name: 'Skills', icon: <Star className="h-4 w-4" /> },
    { id: 'special', name: 'Special', icon: <Sparkles className="h-4 w-4" /> }
  ];

  const filteredBadges = badges.filter(badge => {
    const categoryMatch = activeCategory === 'all' || badge.category === activeCategory;
    const lockedMatch = showLocked || badge.isUnlocked;
    return categoryMatch && lockedMatch;
  });

  const equippedBadges = badges.filter(badge => badge.isEquipped);
  const unlockedBadges = badges.filter(badge => badge.isUnlocked);
  const stats = {
    totalBadges: badges.length,
    unlockedBadges: unlockedBadges.length,
    equippedBadges: equippedBadges.length,
    commonUnlocked: unlockedBadges.filter(b => b.rarity === 'common').length,
    rareUnlocked: unlockedBadges.filter(b => b.rarity === 'rare').length,
    epicUnlocked: unlockedBadges.filter(b => b.rarity === 'epic').length,
    legendaryUnlocked: unlockedBadges.filter(b => b.rarity === 'legendary').length,
    mythicUnlocked: unlockedBadges.filter(b => b.rarity === 'mythic').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Badges</h1>
          <p className="text-gray-600">Showcase your achievements and personalize your profile</p>
        </div>

        {/* User Profile Overview */}
        {userProfile && (
          <Card className="mb-8 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                    {userProfile.avatar ? (
                      <img src={userProfile.avatar} alt="Avatar" className="w-20 h-20 rounded-full" />
                    ) : (
                      <UserCheck className="h-10 w-10" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{userProfile.displayName}</h2>
                    <p className="text-purple-100">@{userProfile.username}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-white/20 text-white">
                        Level {userProfile.level}
                      </Badge>
                      <Badge className="bg-white/20 text-white">
                        {stats.unlockedBadges} Badges
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-purple-600"
                    onClick={() => setEditingProfile(!editingProfile)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {editingProfile ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </div>

              {userProfile.bio && (
                <p className="mt-4 text-purple-100">{userProfile.bio}</p>
              )}

              {/* Equipped Badges */}
              {equippedBadges.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Featured Badges</h3>
                  <div className="flex flex-wrap gap-2">
                    {equippedBadges.map((badge) => (
                      <div 
                        key={badge.id}
                        className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getRarityGradient(badge.rarity)} text-white`}
                      >
                        <span className="mr-1">{badge.icon}</span>
                        {badge.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.totalBadges}</div>
              <p className="text-sm text-gray-600">Total Badges</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.unlockedBadges}</div>
              <p className="text-sm text-gray-600">Unlocked</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.equippedBadges}</div>
              <p className="text-sm text-gray-600">Equipped</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">{stats.commonUnlocked}</div>
              <p className="text-sm text-gray-600">Common</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.rareUnlocked}</div>
              <p className="text-sm text-gray-600">Rare</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.epicUnlocked}</div>
              <p className="text-sm text-gray-600">Epic</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <TabsList className="grid w-full lg:w-auto grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  {category.icon}
                  <span className="hidden lg:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex gap-2">
              <Button
                variant={showLocked ? "default" : "outline"}
                size="sm"
                onClick={() => setShowLocked(!showLocked)}
              >
                {showLocked ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                {showLocked ? 'Show All' : 'Unlocked Only'}
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
                        } border-2 ${badge.isEquipped ? 'ring-2 ring-yellow-400' : ''}`}
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
                              {badge.isEquipped ? (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-sm">Equipped</span>
                                </>
                              ) : badge.isUnlocked ? (
                                <>
                                  <Unlock className="h-4 w-4" />
                                  <span className="text-sm">Unlocked</span>
                                </>
                              ) : badge.progress >= badge.maxProgress ? (
                                <>
                                  <Zap className="h-4 w-4" />
                                  <span className="text-sm">Ready</span>
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
                              {badge.isEquipped && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Equipped
                                </Badge>
                              )}
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
                            <p className="text-sm text-gray-500">Display Order</p>
                            <p className="text-lg font-bold">#{badge.displayOrder}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            {badge.isUnlocked && (
                              <>
                                {badge.isEquipped ? (
                                  <Button 
                                    onClick={() => handleUnequipBadge(badge.id)}
                                    disabled={isEquipping}
                                    variant="outline"
                                  >
                                    <Unlock className="h-4 w-4 mr-2" />
                                    Unequip
                                  </Button>
                                ) : (
                                  <Button 
                                    onClick={() => handleEquipBadge(badge.id)}
                                    disabled={isEquipping}
                                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                                  >
                                    {isEquipping ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Equipping...
                                      </>
                                    ) : (
                                      <>
                                        <Shield className="h-4 w-4 mr-2" />
                                        Equip Badge
                                      </>
                                    )}
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
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
                    {showLocked 
                      ? 'No badges available in this category yet.'
                      : 'No unlocked badges in this category yet. Keep playing to unlock more!'
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

export default ProfileBadgesSystem;
