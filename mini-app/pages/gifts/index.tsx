import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Gift, Heart, Star, Send, DollarSign, Users, TrendingUp } from 'lucide-react';

interface Gift {
  id: string;
  name: string;
  icon: string;
  price: number;
  category: 'romantic' | 'friendship' | 'celebration' | 'luxury' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  effects: string[];
  isAvailable: boolean;
  popularity: number;
}

const TelegramGiftSystem: React.FC = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const giftCategories = [
    { id: 'all', name: 'All Gifts', icon: <Gift className="h-4 w-4" /> },
    { id: 'romantic', name: 'Romantic', icon: <Heart className="h-4 w-4" /> },
    { id: 'friendship', name: 'Friendship', icon: <Users className="h-4 w-4" /> },
    { id: 'celebration', name: 'Celebration', icon: <Star className="h-4 w-4" /> },
    { id: 'luxury', name: 'Luxury', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'special', name: 'Special', icon: <Gift className="h-4 w-4" /> }
  ];

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const response = await fetch('/api/v1/gifts/catalog', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setGifts(data.data || []);
    } catch (error) {
      console.error('Failed to fetch gifts:', error);
    }
  };

  const handleSendGift = async () => {
    if (!selectedGift || !recipient) return;
    
    setIsSending(true);
    try {
      const response = await fetch('/api/v1/gifts/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          giftId: selectedGift.id,
          recipient,
          message
        })
      });

      if (response.ok) {
        setSelectedGift(null);
        setRecipient('');
        setMessage('');
      }
    } catch (error) {
      console.error('Failed to send gift:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Telegram Gifts</h1>
          <p className="text-gray-600">Send beautiful gifts to your friends</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gifts.map((gift) => (
            <Card key={gift.id} className="cursor-pointer hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">{gift.icon}</div>
                <h3 className="font-bold text-lg mb-2">{gift.name}</h3>
                <Badge className="mb-2">{gift.rarity}</Badge>
                <p className="text-sm text-gray-600 mb-4">{gift.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{gift.price} TON</span>
                  <Button size="sm" onClick={() => setSelectedGift(gift)}>
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedGift && (
          <Dialog open={!!selectedGift} onOpenChange={() => setSelectedGift(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="text-3xl">{selectedGift.icon}</div>
                  {selectedGift.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Recipient</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter username or user ID"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message (optional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{selectedGift.price} TON</span>
                  <Button onClick={handleSendGift} disabled={isSending || !recipient}>
                    {isSending ? 'Sending...' : 'Send Gift'}
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

export default TelegramGiftSystem;
