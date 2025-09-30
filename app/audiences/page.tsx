'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, Filter, Download, Target, TrendingUp } from 'lucide-react';
import { Audience } from '@/types';

const mockAudiences: Audience[] = [
  {
    id: '1',
    name: 'High-Value Streamers',
    description: 'Fans with 10+ streams in last 30 days',
    count: 2847,
    filters: [
      { type: 'engagement', operator: 'greater_than', value: 10 },
      { type: 'platform', operator: 'equals', value: 'spotify' }
    ],
    lastUpdated: '2 hours ago',
    conversionRate: 12.3
  },
  {
    id: '2',
    name: 'Instagram Engagers',
    description: 'Active IG followers who haven\'t purchased',
    count: 1523,
    filters: [
      { type: 'platform', operator: 'equals', value: 'instagram' },
      { type: 'engagement', operator: 'greater_than', value: 0 }
    ],
    lastUpdated: '4 hours ago',
    conversionRate: 8.7
  },
  {
    id: '3',
    name: 'EVEN Prospects',
    description: 'Clicked music links but no purchase',
    count: 892,
    filters: [
      { type: 'engagement', operator: 'greater_than', value: 0 },
      { type: 'ltv', operator: 'equals', value: 0 }
    ],
    lastUpdated: '1 day ago',
    conversionRate: 15.2
  },
  {
    id: '4',
    name: 'Merch Buyers',
    description: 'Previous merch purchasers for upsells',
    count: 234,
    filters: [
      { type: 'ltv', operator: 'greater_than', value: 50 },
      { type: 'recency', operator: 'less_than', value: 90 }
    ],
    lastUpdated: '6 hours ago',
    conversionRate: 28.9
  }
];

export default function Audiences() {
  const [audiences, setAudiences] = useState(mockAudiences);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);

  const filteredAudiences = audiences.filter(audience =>
    audience.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audience.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Audiences</h1>
          <p className="text-gray-400">
            Segment fans for targeted campaigns and monetization flows
          </p>
        </div>
        <Button 
          onClick={() => setShowBuilder(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Audience
        </Button>
      </div>

      {/* Audience Overview */}
      <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Audience Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">
              {audiences.reduce((acc, a) => acc + a.count, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">Total Segmented Fans</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{audiences.length}</p>
            <p className="text-sm text-gray-400">Active Segments</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {(audiences.reduce((acc, a) => acc + a.conversionRate, 0) / audiences.length).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-400">Avg Conversion Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-400">
              {Math.max(...audiences.map(a => a.conversionRate)).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-400">Best Performing</p>
          </div>
        </div>
      </Card>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search audiences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <Button variant="outline" className="border-gray-600 text-gray-300">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Audience Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filteredAudiences.map((audience) => (
          <Card key={audience.id} className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{audience.name}</h3>
                  <p className="text-sm text-gray-400">{audience.description}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-purple-600 text-white mb-2">
                  {audience.count.toLocaleString()} fans
                </Badge>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">{audience.conversionRate}% CVR</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-400">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {audience.filters.map((filter, index) => (
                  <Badge key={index} variant="outline" className="text-gray-300 border-gray-600">
                    {`${filter.type}: ${filter.operator} ${filter.value}`}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              <span className="text-xs text-gray-500">Updated {audience.lastUpdated}</span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                  <Target className="w-3 h-3 mr-1" />
                  Target
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Audience Builder */}
      {showBuilder && (
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Quick Audience Builder</h2>
            <Button 
              variant="ghost" 
              onClick={() => setShowBuilder(false)}
              className="text-gray-400"
            >
              ✕
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Platform</label>
              <Select>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="spotify">Spotify</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Behavior</label>
              <Select>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select behavior" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="streamed">Streamed</SelectItem>
                  <SelectItem value="engaged">Engaged</SelectItem>
                  <SelectItem value="clicked">Clicked Link</SelectItem>
                  <SelectItem value="purchased">Purchased</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Time Period</label>
              <Select>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Preview Audience
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}