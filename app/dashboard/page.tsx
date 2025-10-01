'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  MessageSquare,
  Play,
  ShoppingCart,
  Mail,
  Smartphone,
  ExternalLink,
  Plus,
  Music,
  Youtube,
  Instagram,
  Facebook
} from 'lucide-react';
import { PlatformConnection } from '@/types';

// Type definitions for dashboard state
interface StatItem {
  name: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface ActivityItem {
  type: string;
  message: string;
  time: string;
  icon: React.ComponentType<any>;
}

// Icon mapping for platforms
const platformIcons: Record<string, React.ComponentType<any>> = {
  youtube: Youtube,
  music: Music,
  instagram: Instagram,
  facebook: Facebook,
  twitter: Play,
  spotify: Music,
  apple: Music,
  soundcloud: Music,
  even: Music
};

const conversionFunnel = [
  { stage: 'Impressions', value: 45200, percentage: 100 },
  { stage: 'Bot Engagement', value: 3847, percentage: 8.5 },
  { stage: 'Email/SMS Opt-ins', value: 1247, percentage: 2.8 },
  { stage: 'EVEN Purchases', value: 89, percentage: 0.2 },
  { stage: 'Merch Purchases', value: 156, percentage: 0.3 }
];

export default function Dashboard() {
  const [platforms, setPlatforms] = useState<PlatformConnection[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Load platform data from localStorage
    const savedPlatforms = localStorage.getItem('connectedPlatforms');
    if (savedPlatforms) {
      try {
        const parsedPlatforms = JSON.parse(savedPlatforms) as PlatformConnection[];
        setPlatforms(parsedPlatforms);
        
        // Calculate stats based on connected platforms
        const connectedPlatforms = parsedPlatforms.filter(p => p.status === 'connected');
        const totalRecords = connectedPlatforms.reduce((acc, p) => acc + p.recordCount, 0);
        const totalPlatforms = parsedPlatforms.length;
        
        // Generate dynamic stats
        const dynamicStats = [
          {
            name: 'Total Unified Fans',
            value: totalRecords.toLocaleString(),
            change: '+18.2%',
            icon: Users,
            color: 'text-blue-400'
          },
          {
            name: 'Connected Platforms',
            value: `${connectedPlatforms.length}/${totalPlatforms}`,
            change: connectedPlatforms.length > 0 ? `+${connectedPlatforms.length} connected` : 'No connections',
            icon: TrendingUp,
            color: 'text-green-400'
          },
          {
            name: 'Revenue (30d)',
            value: connectedPlatforms.some(p => p.id === 'even') ? '$4,293' : '$0',
            change: connectedPlatforms.some(p => p.id === 'even') ? '+31.5%' : 'Connect EVEN',
            icon: DollarSign,
            color: 'text-purple-400'
          },
          {
            name: 'Bot Conversations',
            value: connectedPlatforms.length > 0 ? '1,247' : '0',
            change: connectedPlatforms.length > 0 ? '+12.8%' : 'Connect platforms',
            icon: MessageSquare,
            color: 'text-pink-400'
          }
        ];
        
        setStats(dynamicStats);
        
        // Generate recent activity based on connected platforms
        const activities = [];
        connectedPlatforms.forEach(platform => {
          if (platform.lastSync) {
            const IconComponent = platformIcons[platform.iconKey] || Play;
            activities.push({
              type: 'sync',
              message: `${platform.name} synced ${platform.recordCount} items`,
              time: platform.lastSync,
              icon: IconComponent
            });
          }
        });
        
        // Add some default activities if we have connections
        if (connectedPlatforms.length > 0) {
          activities.push(
            {
              type: 'bot',
              message: 'Bot collected 23 new email opt-ins',
              time: '6 hours ago',
              icon: MessageSquare
            },
            {
              type: 'offer',
              message: 'Welcome campaign sent to new followers',
              time: '1 day ago',
              icon: Mail
            }
          );
        }
        
        setRecentActivity(activities.slice(0, 4)); // Show max 4 activities
        
      } catch (error) {
        console.error('Error loading platform data:', error);
        // Fallback to default stats if there's an error
        setStats([
          {
            name: 'Connected Platforms',
            value: '0/8',
            change: 'Connect platforms to get started',
            icon: TrendingUp,
            color: 'text-green-400'
          }
        ]);
      }
    } else {
      // No saved platforms - show getting started state
      setStats([
        {
          name: 'Connected Platforms',
          value: '0/8',
          change: 'Connect platforms to get started',
          icon: TrendingUp,
          color: 'text-green-400'
        }
      ]);
      setRecentActivity([
        {
          type: 'info',
          message: 'Connect your platforms to see activity here',
          time: 'Get started',
          icon: Plus
        }
      ]);
    }
  }, []);

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          {platforms.filter(p => p.status === 'connected').length > 0 
            ? "Welcome back! Here's your fan engagement and monetization overview."
            : "Connect your platforms to start tracking fan engagement and monetization."
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className={`text-sm ${stat.color}`}>{stat.change}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Connected Platforms Overview */}
      {platforms.filter(p => p.status === 'connected').length > 0 && (
        <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Connected Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {platforms.filter(p => p.status === 'connected').map((platform) => {
              const IconComponent = platformIcons[platform.iconKey] || Play;
              return (
                <div key={platform.id} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <IconComponent className="w-5 h-5 text-purple-400" />
                  <div>
                    <h4 className="text-white font-medium">{platform.name}</h4>
                    <p className="text-xs text-gray-400">{platform.recordCount} items</p>
                    <p className="text-xs text-gray-500">Last sync: {platform.lastSync}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Conversion Funnel */}
        <Card className="bg-gray-800 border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Conversion Funnel</h2>
          {platforms.filter(p => p.status === 'connected').length > 0 ? (
          <div className="space-y-4">
            {conversionFunnel.map((stage, index) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{stage.stage}</span>
                  <span className="text-white font-medium">
                    {stage.value.toLocaleString()} ({stage.percentage}%)
                  </span>
                </div>
                <Progress value={stage.percentage} className="h-2" />
              </div>
            ))}
          </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Connect platforms to see your conversion funnel</p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Connect Platforms
              </Button>
            </div>
          )}
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-800 border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <activity.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monetization Paths</h3>
          <div className="space-y-3">
            <Button className="w-full justify-between bg-purple-600 hover:bg-purple-700">
              <span>EVEN Music Sales</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button className="w-full justify-between bg-gray-700 hover:bg-gray-600">
              <span>Merch Store</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Offer
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Launch Bot Campaign
            </Button>
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Health</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Data Sync</span>
              <span className="text-xs text-green-400">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Bot Status</span>
              <span className="text-xs text-green-400">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">API Health</span>
              <span className="text-xs text-green-400">Good</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}