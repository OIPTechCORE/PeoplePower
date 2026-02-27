import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  Users, 
  Star, 
  Heart, 
  Gift, 
  Diamond, 
  Zap, 
  Filter, 
  Search, 
  Grid, 
  List,
  ArrowUpDown,
  Eye,
  ShoppingCart,
  CreditCard,
  Wallet,
  Trophy,
  Crown,
  Flame,
  Sparkles,
  Package,
  Gamepad2,
  Music,
  Camera,
  Book,
  Coffee,
  Pizza,
  Plane,
  Car,
  Home
} from 'lucide-react';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'gaming' | 'digital' | 'physical' | 'services' | 'exclusive';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  icon: string;
  image: string;
  isAvailable: boolean;
  isLimited: boolean;
  stock: number;
  maxStock: number;
  seller: string;
  rating: number;
  reviews: number;
  tags: string[];
  createdAt: Date;
  expiresAt?: Date;
}

interface MarketplaceFilters {
  category: string;
  rarity: string;
  priceRange: [number, number];
  search: string;
  sortBy: 'price' | 'rating' | 'newest' | 'popularity';
  sortOrder: 'asc' | 'desc';
}

const UnifiedMarketplace: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    category: 'all',
    rarity: 'all',
    priceRange: [0, 10000],
    search: '',
    sortBy: 'newest',
    sortOrder: 'desc'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [cart, setCart] = useState<MarketplaceItem[]>([]);

  useEffect(() => {
    fetchMarketplaceItems();
  }, [filters]);

  const fetchMarketplaceItems = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.rarity !== 'all') params.append('rarity', filters.rarity);
      params.append('minPrice', filters.priceRange[0].toString());
      params.append('maxPrice', filters.priceRange[1].toString());
      if (filters.search) params.append('search', filters.search);
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);

      const response = await fetch(`/api/v1/marketplace/items?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setItems(data.data || []);
    } catch (error) {
      console.error('Failed to fetch marketplace items:', error);
    }
  };

  const handlePurchase = async (item: MarketplaceItem) => {
    setIsPurchasing(true);
    try {
      const response = await fetch('/api/v1/marketplace/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ itemId: item.id })
      });

      const result = await response.json();
      
      if (result.success) {
        // Remove from items if stock is 0
        if (item.stock <= 1) {
          setItems(prev => prev.filter(i => i.id !== item.id));
        } else {
          // Update stock
          setItems(prev => prev.map(i => 
            i.id === item.id ? { ...i, stock: i.stock - 1 } : i
          ));
        }
        
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Failed to purchase item:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleAddToCart = (item: MarketplaceItem) => {
    setCart(prev => [...prev, item]);
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      case 'mythic': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'gaming': return <Gamepad2 className="h-5 w-5" />;
      case 'digital': return <Camera className="h-5 w-5" />;
      case 'physical': return <Package className="h-5 w-5" />;
      case 'services': return <Sparkles className="h-5 w-5" />;
      case 'exclusive': return <Crown className="h-5 w-5" />;
      default: return <ShoppingBag className="h-5 w-5" />;
    }
  };

  const categories = [
    { id: 'all', name: 'All Items', icon: <ShoppingBag className="h-4 w-4" /> },
    { id: 'gaming', name: 'Gaming', icon: <Gamepad2 className="h-4 w-4" /> },
    { id: 'digital', name: 'Digital', icon: <Camera className="h-4 w-4" /> },
    { id: 'physical', name: 'Physical', icon: <Package className="h-4 w-4" /> },
    { id: 'services', name: 'Services', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'exclusive', name: 'Exclusive', icon: <Crown className="h-4 w-4" /> }
  ];

  const rarities = [
    { id: 'all', name: 'All Rarities' },
    { id: 'common', name: 'Common' },
    { id: 'rare', name: 'Rare' },
    { id: 'epic', name: 'Epic' },
    { id: 'legendary', name: 'Legendary' },
    { id: 'mythic', name: 'Mythic' }
  ];

  const sortOptions = [
    { id: 'newest', name: 'Newest' },
    { id: 'popularity', name: 'Most Popular' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'price', name: 'Price' }
  ];

  const filteredItems = items.filter(item => {
    const categoryMatch = filters.category === 'all' || item.category === filters.category;
    const rarityMatch = filters.rarity === 'all' || item.rarity === filters.rarity;
    const priceMatch = item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1];
    const searchMatch = !filters.search || 
      item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
    
    return categoryMatch && rarityMatch && priceMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Unified Marketplace</h1>
          <p className="text-gray-600">Trade, buy, and sell digital assets and services</p>
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <Card className="mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-bold">{cart.length} items</span>
                  <span className="text-green-100">
                    {cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)} TON
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-green-600"
                  onClick={() => setCart([])}
                >
                  Clear Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search marketplace..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Rarity Filter */}
              <div>
                <select
                  value={filters.rarity}
                  onChange={(e) => setFilters(prev => ({ ...prev, rarity: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {rarities.map(rarity => (
                    <option key={rarity.id} value={rarity.id}>{rarity.name}</option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm font-medium">Price Range:</span>
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  priceRange: [Number(e.target.value), prev.priceRange[1]] 
                }))}
                className="w-24 px-3 py-2 border rounded-lg"
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  priceRange: [prev.priceRange[0], Number(e.target.value)] 
                }))}
                className="w-24 px-3 py-2 border rounded-lg"
                min="0"
              />
              <span className="text-sm text-gray-600">TON</span>
            </div>
          </CardContent>
        </Card>

        {/* View Controls */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid View
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List View
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            {filteredItems.length} items found
          </div>
        </div>

        {/* Marketplace Items */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {filteredItems.map((item) => (
            <Card 
              key={item.id}
              className={`cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                !item.isAvailable ? 'opacity-50' : ''
              } ${item.isLimited ? 'ring-2 ring-red-500' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Item Image */}
                  <div className="w-full lg:w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <div className="text-4xl">{item.icon}</div>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRarityColor(item.rarity)}>
                            {item.rarity}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(item.category)}
                            <span className="text-sm text-gray-600">{item.category}</span>
                          </div>
                          {item.isLimited && (
                            <Badge className="bg-red-100 text-red-800">
                              <Flame className="h-3 w-3 mr-1" />
                              Limited
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{item.price} TON</div>
                        {item.stock <= 5 && (
                          <div className="text-sm text-red-600">
                            Only {item.stock} left!
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Rating and Reviews */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{item.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-600">({item.reviews} reviews)</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Sold by {item.seller}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedItem(item)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.isAvailable || item.stock === 0}
                        className="flex-1"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {item.isAvailable && item.stock > 0 ? 'Add to Cart' : 'Unavailable'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Item Details Dialog */}
        {selectedItem && (
          <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="text-3xl">{selectedItem.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      {selectedItem.name}
                      <Badge className={getRarityColor(selectedItem.rarity)}>
                        {selectedItem.rarity}
                      </Badge>
                      {selectedItem.isLimited && (
                        <Badge className="bg-red-100 text-red-800">
                          <Flame className="h-3 w-3 mr-1" />
                          Limited Edition
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedItem.category} • {selectedItem.seller}
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <div className="text-6xl">{selectedItem.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{selectedItem.name}</h3>
                    <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Price:</span>
                        <span className="text-2xl font-bold text-blue-600">{selectedItem.price} TON</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Stock:</span>
                        <span className={selectedItem.stock <= 5 ? 'text-red-600 font-bold' : 'text-green-600'}>
                          {selectedItem.stock} remaining
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{selectedItem.rating.toFixed(1)}</span>
                          <span className="text-gray-600">({selectedItem.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>

                {selectedItem.expiresAt && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span className="text-yellow-800 font-medium">
                        Limited time offer! Expires {selectedItem.expiresAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    3% platform fee will be deducted
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedItem(null)}
                    >
                      Close
                    </Button>
                    <Button 
                      onClick={() => handlePurchase(selectedItem)}
                      disabled={!selectedItem.isAvailable || selectedItem.stock === 0 || isPurchasing}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      {isPurchasing ? 'Purchasing...' : 'Purchase Now'}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default UnifiedMarketplace;
