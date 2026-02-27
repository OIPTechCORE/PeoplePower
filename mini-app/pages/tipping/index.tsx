import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DollarSign, Heart, Star, Send, TrendingUp, Users, Coffee, Pizza, Gift } from 'lucide-react';

interface TippingTarget {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  totalTips: number;
  tipCount: number;
  isOnline: boolean;
  category: 'creator' | 'friend' | 'developer' | 'moderator';
}

interface TipPreset {
  id: string;
  name: string;
  amount: number;
  icon: string;
  message: string;
}

const TippingSystem: React.FC = () => {
  const [targets, setTargets] = useState<TippingTarget[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<TippingTarget | null>(null);
  const [tipAmount, setTipAmount] = useState('');
  const [tipMessage, setTipMessage] = useState('');
  const [isTipping, setIsTipping] = useState(false);
  const [showTipHistory, setShowTipHistory] = useState(false);

  const tipPresets: TipPreset[] = [
    { id: 'coffee', name: 'Coffee', amount: 1, icon: '☕', message: 'Thanks for the great content!' },
    { id: 'lunch', name: 'Lunch', amount: 5, icon: '🍕', message: 'Enjoy your meal!' },
    { id: 'dinner', name: 'Dinner', amount: 10, icon: '🍽️', message: 'You deserve it!' },
    { id: 'special', name: 'Special', amount: 25, icon: '⭐', message: 'You\'re amazing!' },
    { id: 'legendary', name: 'Legendary', amount: 100, icon: '👑', message: 'Thank you for everything!' }
  ];

  useEffect(() => {
    fetchTippingTargets();
  }, []);

  const fetchTippingTargets = async () => {
    try {
      const response = await fetch('/api/v1/tipping/targets', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setTargets(data.data || []);
    } catch (error) {
      console.error('Failed to fetch tipping targets:', error);
    }
  };

  const handleSendTip = async () => {
    if (!selectedTarget || !tipAmount || isNaN(Number(tipAmount))) return;

    setIsTipping(true);
    try {
      const response = await fetch('/api/v1/tipping/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          targetId: selectedTarget.id,
          amount: Number(tipAmount),
          message: tipMessage
        })
      });

      if (response.ok) {
        setSelectedTarget(null);
        setTipAmount('');
        setTipMessage('');
        await fetchTippingTargets();
      }
    } catch (error) {
      console.error('Failed to send tip:', error);
    } finally {
      setIsTipping(false);
    }
  };

  const handlePresetTip = (preset: TipPreset, target: TippingTarget) => {
    setSelectedTarget(target);
    setTipAmount(preset.amount.toString());
    setTipMessage(preset.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tipping System</h1>
          <p className="text-gray-600">Support your favorite creators and friends</p>
        </div>

        {/* Quick Tip Presets */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {tipPresets.map((preset) => (
                <Card key={preset.id} className="cursor-pointer hover:shadow-md transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{preset.icon}</div>
                    <h3 className="font-bold">{preset.name}</h3>
                    <p className="text-sm text-gray-600">{preset.amount} TON</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tipping Targets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {targets.map((target) => (
            <Card key={target.id} className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {target.displayName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{target.displayName}</h3>
                    <p className="text-sm text-gray-600">@{target.username}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {target.isOnline && (
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    )}
                    <Badge>{target.category}</Badge>
                  </div>
                </div>

                {target.bio && (
                  <p className="text-sm text-gray-600 mb-4">{target.bio}</p>
                )}

                <div className="flex justify-between items-center mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{target.totalTips}</div>
                    <p className="text-xs text-gray-600">Total Tips</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{target.tipCount}</div>
                    <p className="text-xs text-gray-600">Tips Received</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {tipPresets.slice(0, 2).map((preset) => (
                    <Button
                      key={preset.id}
                      size="sm"
                      variant="outline"
                      onClick={() => handlePresetTip(preset, target)}
                      className="flex items-center gap-1"
                    >
                      <span>{preset.icon}</span>
                      {preset.name}
                    </Button>
                  ))}
                </div>

                <Button 
                  className="w-full mt-2"
                  onClick={() => setSelectedTarget(target)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Tip
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tip Dialog */}
        {selectedTarget && (
          <Dialog open={!!selectedTarget} onOpenChange={() => setSelectedTarget(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {selectedTarget.displayName.charAt(0)}
                  </div>
                  <div>
                    <div>Send Tip to {selectedTarget.displayName}</div>
                    <div className="text-sm text-gray-600">@{selectedTarget.username}</div>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (TON)</label>
                  <Input
                    type="number"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message (optional)</label>
                  <Textarea
                    value={tipMessage}
                    onChange={(e) => setTipMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    3% platform fee will be deducted
                  </div>
                  <Button 
                    onClick={handleSendTip}
                    disabled={isTipping || !tipAmount || Number(tipAmount) <= 0}
                  >
                    {isTipping ? 'Sending...' : 'Send Tip'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default TippingSystem;
