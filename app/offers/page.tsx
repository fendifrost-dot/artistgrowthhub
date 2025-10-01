'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Gift, ExternalLink, CreditCard as Edit, Trash2, Target, ChartBar as BarChart3 } from 'lucide-react';
import { DisplayOffer } from '@/types';

const mockOffers: DisplayOffer[] = [
  {
    id: '1',
    name: 'New Fan Welcome',
    type: 'discount',
    channel: 'email',
    kind: 'discount',
    destination: 'even',
    config: {
      discountPercent: 15,
      discount_pct: 15,
      couponCode: 'WELCOME15',
      coupon: 'WELCOME15',
      expiresAt: '2024-12-31'
    },
    audienceId: '2',
    active: true,
    stats: { sent: 1247, clicked: 189, converted: 23 },
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Exclusive Track Preview',
    type: 'presave',
    channel: 'email',
    kind: 'presave',
    destination: 'even',
    config: {
      url: 'https://even.com/fendi-frost/midnight-vibes',
      expiresAt: '2024-02-15'
    },
    audienceId: '1',
    active: true,
    stats: { sent: 892, clicked: 234, converted: 67 },
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Merch Bundle Deal',
    type: 'merch',
    channel: 'email',
    kind: 'merch',
    destination: 'bemoremodest',
    config: {
      discountPercent: 20,
      discount_pct: 20,
      couponCode: 'BUNDLE20',
      coupon: 'BUNDLE20',
      url: 'https://www.bemoremodest.com/collections/fendi-frost'
    },
    audienceId: '4',
    active: false,
    stats: { sent: 234, clicked: 45, converted: 12 },
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  }
];

export default function Offers() {
  const [offers, setOffers] = useState(mockOffers);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const getTypeColor = (type: string) => {
    const colors = {
      discount: 'bg-green-500',
      presave: 'bg-blue-500',
      exclusive: 'bg-purple-500',
      merch: 'bg-pink-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const getDestinationColor = (destination: string) => {
    return destination === 'even' ? 'bg-purple-600' : 'bg-orange-600';
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Offers</h1>
          <p className="text-gray-400">
            Create targeted campaigns to drive EVEN and merch conversions
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Offer
        </Button>
      </div>

      {/* Offers Overview */}
      <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Campaign Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">
              {offers.reduce((acc, o) => acc + o.stats.sent, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">Total Sent</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {offers.reduce((acc, o) => acc + o.stats.clicked, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">Total Clicks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {offers.reduce((acc, o) => acc + o.stats.converted, 0)}
            </p>
            <p className="text-sm text-gray-400">Conversions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-400">
              {(
                (offers.reduce((acc, o) => acc + o.stats.converted, 0) / 
                 offers.reduce((acc, o) => acc + o.stats.sent, 0)) * 100
              ).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-400">Conversion Rate</p>
          </div>
        </div>
      </Card>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {offers.map((offer) => (
          <Card key={offer.id} className="bg-gray-800 border-gray-700 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{offer.name}</h3>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getTypeColor(offer.type)} text-white`}>
                    {offer.type}
                  </Badge>
                  <Badge className={`${getDestinationColor(offer.destination)} text-white`}>
                    {offer.destination.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${offer.active ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className={`text-xs ${offer.active ? 'text-green-400' : 'text-red-400'}`}>
                  {offer.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {offer.config.discountPercent && (
                <p className="text-sm text-gray-300">
                  Discount: <span className="text-purple-400">{offer.config.discountPercent}%</span>
                </p>
              )}
              {offer.config.couponCode && (
                <p className="text-sm text-gray-300">
                  Code: <span className="text-purple-400">{offer.config.couponCode}</span>
                </p>
              )}
              {offer.config.expiresAt && (
                <p className="text-sm text-gray-300">
                  Expires: <span className="text-purple-400">{offer.config.expiresAt}</span>
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t border-gray-700">
              <div className="text-center">
                <p className="text-lg font-bold text-purple-400">{offer.stats.sent}</p>
                <p className="text-xs text-gray-400">Sent</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-400">{offer.stats.clicked}</p>
                <p className="text-xs text-gray-400">Clicked</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-400">{offer.stats.converted}</p>
                <p className="text-xs text-gray-400">Converted</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Created {offer.createdAt}</span>
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                  <BarChart3 className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                  <ExternalLink className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Offer Form */}
      {showCreateForm && (
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Create New Offer</h2>
            <Button 
              variant="ghost" 
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400"
            >
              ✕
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-300">Offer Name</Label>
              <Input 
                placeholder="e.g., New Fan Welcome"
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>
            <div>
              <Label className="text-gray-300">Offer Type</Label>
              <Select>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-2">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="discount">Discount</SelectItem>
                  <SelectItem value="presave">Presave/Stream</SelectItem>
                  <SelectItem value="exclusive">Exclusive Content</SelectItem>
                  <SelectItem value="merch">Merchandise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Destination</Label>
              <Select>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-2">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="even">EVEN (Music Sales)</SelectItem>
                  <SelectItem value="bemoremodest">BeMoreModest (Merch)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Target Audience</Label>
              <Select>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-2">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="1">High-Value Streamers</SelectItem>
                  <SelectItem value="2">Instagram Engagers</SelectItem>
                  <SelectItem value="3">EVEN Prospects</SelectItem>
                  <SelectItem value="4">Merch Buyers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateForm(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Create Offer
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}