'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Target, Download, Calendar } from 'lucide-react';

const funnelData = [
  { stage: 'Impressions', value: 45200, color: '#8b5cf6' },
  { stage: 'Clicks', value: 3847, color: '#06b6d4' },
  { stage: 'Bot Engagement', value: 1247, color: '#10b981' },
  { stage: 'Opt-ins', value: 892, color: '#f59e0b' },
  { stage: 'Conversions', value: 245, color: '#ef4444' }
];

const revenueData = [
  { month: 'Jan', even: 1200, merch: 800, total: 2000 },
  { month: 'Feb', even: 1800, merch: 1200, total: 3000 },
  { month: 'Mar', even: 2400, merch: 1600, total: 4000 },
  { month: 'Apr', even: 2200, merch: 1800, total: 4000 },
  { month: 'May', even: 2800, merch: 2200, total: 5000 },
  { month: 'Jun', even: 3200, merch: 2400, total: 5600 }
];

const platformData = [
  { name: 'Instagram', value: 35, color: '#e91e63' },
  { name: 'Spotify', value: 25, color: '#1db954' },
  { name: 'YouTube', value: 20, color: '#ff0000' },
  { name: 'Facebook', value: 12, color: '#1877f2' },
  { name: 'TikTok', value: 8, color: '#000000' }
];

const engagementData = [
  { date: '1/1', streams: 1200, likes: 340, shares: 89 },
  { date: '1/8', streams: 1800, likes: 520, shares: 134 },
  { date: '1/15', streams: 2400, likes: 680, shares: 178 },
  { date: '1/22', streams: 2200, likes: 590, shares: 156 },
  { date: '1/29', streams: 2800, likes: 720, shares: 203 },
  { date: '2/5', streams: 3200, likes: 890, shares: 245 }
];

export default function Analytics() {
  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">
            Track your fan engagement and monetization performance
          </p>
        </div>
        <div className="flex space-x-4">
          <Select defaultValue="30d">
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-white">$5,600</p>
              <p className="text-sm text-green-400">+23.5%</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-400" />
          </div>
        </Card>
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-white">5.4%</p>
              <p className="text-sm text-green-400">+1.2%</p>
            </div>
            <Target className="w-8 h-8 text-blue-400" />
          </div>
        </Card>
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Active Fans</p>
              <p className="text-2xl font-bold text-white">12,847</p>
              <p className="text-sm text-green-400">+18.2%</p>
            </div>
            <Users className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Growth Rate</p>
              <p className="text-2xl font-bold text-white">+15.3%</p>
              <p className="text-sm text-green-400">+2.1%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-pink-400" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <Card className="bg-gray-800 border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Revenue Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="even" stackId="a" fill="#8b5cf6" name="EVEN" />
              <Bar dataKey="merch" stackId="a" fill="#06b6d4" name="Merch" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Platform Distribution */}
        <Card className="bg-gray-800 border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Traffic by Platform</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conversion Funnel */}
        <Card className="bg-gray-800 border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Conversion Funnel</h2>
          <div className="space-y-4">
            {funnelData.map((stage, index) => {
              const percentage = index === 0 ? 100 : (stage.value / funnelData[0].value) * 100;
              return (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">{stage.stage}</span>
                    <span className="text-white font-medium">
                      {stage.value.toLocaleString()} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: stage.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Engagement Trends */}
        <Card className="bg-gray-800 border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Engagement Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="streams" stroke="#8b5cf6" strokeWidth={2} name="Streams" />
              <Line type="monotone" dataKey="likes" stroke="#06b6d4" strokeWidth={2} name="Likes" />
              <Line type="monotone" dataKey="shares" stroke="#10b981" strokeWidth={2} name="Shares" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}