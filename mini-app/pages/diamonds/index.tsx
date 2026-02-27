import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Diamond, TrendingUp, Gift, Zap, Crown, Star } from 'lucide-react';

interface DiamondTier {
  tier: number;
  name: string;
  icon: string;
  requiredBalance: number;
  benefits: string[];
  cashback: number;
  multiplier: number;
}

const DiamondSystem: React.FC = () => {
  const [userDiamonds, setUserDiamonds] = useState(0);
  const [currentTier, setCurrentTier] = useState(0);
  const [diamondTiers, setDiamondTiers] = useState<DiamondTier[]>([]);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    fetchDiamondData();
  }, []);

  const fetchDiamondData = async () => {
    try {
      const [balanceResponse, tiersResponse] = await Promise.all([
        fetch('/api/v1/diamonds/balance', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/v1/diamonds/tiers', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const balanceData = await balanceResponse.json();
      const tiersData = await tiersResponse.json();

      setUserDiamonds(balanceData.data.balance);
      setCurrentTier(balanceData.data.tier);
      setDiamondTiers(tiersData.data);
    } catch (error) {
      console.error('Failed to fetch diamond data:', error);
    }
  };

  const handlePurchaseDiamonds = async () => {
    if (!purchaseAmount || isNaN(Number(purchaseAmount))) return;

    setIsPurchasing(true);
    try {
      const response = await fetch('/api/v1/diamonds/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: Number(purchaseAmount) })
      });

      if (response.ok) {
        await fetchDiamondData();
        setPurchaseAmount('');
      }
    } catch (error) {
      console.error('Failed to purchase diamonds:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const currentTierData = diamondTiers.find(t => t.tier === currentTier);
  const nextTierData = diamondTiers.find(t => t.tier === currentTier + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Diamond System</h1>
          <p className="text-gray-600">Earn and spend diamonds for premium benefits</p>
        </div>

        {/* Diamond Balance */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">{userDiamonds} Diamonds</h2>
                <p className="text-blue-100">Current Balance</p>
              </div>
              <div className="text-6xl">
                <Diamond className="h-16 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Tier */}
        {currentTierData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="text-2xl">{currentTierData.icon}</div>
                {currentTierData.name} Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{currentTierData.multiplier}x</div>
                  <p className="text-sm text-gray-600">Reward Multiplier</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{currentTierData.cashback}%</div>
                  <p className="text-sm text-gray-600">Cashback Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{currentTierData.benefits.length}</div>
                  <p className="text-sm text-gray-600">Premium Benefits</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Purchase Diamonds */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Purchase Diamonds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (TON)</label>
              <input
                type="number"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border rounded-lg"
                min="1"
                step="0.1"
              />
            </div>
            <Button 
              onClick={handlePurchaseDiamonds}
              disabled={isPurchasing || !purchaseAmount}
              className="w-full"
            >
              {isPurchasing ? 'Purchasing...' : 'Purchase Diamonds'}
            </Button>
          </CardContent>
        </Card>

        {/* Diamond Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {diamondTiers.map((tier) => (
            <Card 
              key={tier.tier}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                tier.tier === currentTier ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">{tier.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{tier.name}</h3>
                  <Badge className="mb-2">Tier {tier.tier}</Badge>
                  <p className="text-sm text-gray-600 mb-4">{tier.requiredBalance} Diamonds</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Multiplier:</span>
                      <span>{tier.multiplier}x</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cashback:</span>
                      <span>{tier.cashback}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiamondSystem;
