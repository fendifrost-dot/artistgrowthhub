'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Bot, MessageSquare, Play, Pause, CreditCard as Edit, Trash2, Send } from 'lucide-react';
import { BotRule, BotConversation } from '@/types';

const mockRules: BotRule[] = [
  {
    id: '1',
    name: 'New Follower Welcome',
    enabled: true,
    trigger: { type: 'new_follower', platform: 'instagram' },
    action: { type: 'send_message', config: { message: 'Thanks for following! Check out my latest track 🎵' } },
    stats: { triggered: 247, completed: 198 }
  },
  {
    id: '2',
    name: 'Stream to EVEN Conversion',
    enabled: true,
    trigger: { type: 'stream_event', platform: 'spotify', conditions: { streams: '>=5' } },
    action: { type: 'issue_offer', config: { offerId: '1', message: 'Love the music? Get 15% off exclusive content!' } },
    stats: { triggered: 89, completed: 67 }
  },
  {
    id: '3',
    name: 'Abandoned Cart Recovery',
    enabled: false,
    trigger: { type: 'link_click', conditions: { destination: 'even', no_purchase: '24h' } },
    action: { type: 'send_message', config: { message: 'Still thinking about it? Here\'s 10% off to sweeten the deal' } },
    stats: { triggered: 34, completed: 28 }
  }
];

const mockConversations: BotConversation[] = [
  {
    id: '1',
    fanName: 'Sarah M.',
    platform: 'instagram',
    lastMessage: 'Thanks! Just grabbed the new track 🔥',
    timestamp: '2 min ago',
    status: 'converted'
  },
  {
    id: '2',
    fanName: 'Mike R.',
    platform: 'facebook',
    lastMessage: 'When\'s the next show?',
    timestamp: '15 min ago',
    status: 'active'
  },
  {
    id: '3',
    fanName: 'Alex K.',
    platform: 'instagram',
    lastMessage: 'Love your music!',
    timestamp: '1 hour ago',
    status: 'completed'
  }
];

export default function BotPage() {
  const [rules, setRules] = useState(mockRules);
  const [conversations] = useState(mockConversations);
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState('rules');

  const toggleRule = (id: string) => {
    setRules(prev => 
      prev.map(rule => 
        rule.id === id 
          ? { ...rule, enabled: !rule.enabled }
          : rule
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converted':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Bot</h1>
          <p className="text-gray-400">
            Automate fan engagement with conversational flows and smart triggers
          </p>
        </div>
        <Button 
          onClick={() => setShowRuleBuilder(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {/* Bot Overview */}
      <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Bot Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">
              {rules.reduce((acc, r) => acc + r.stats.triggered, 0)}
            </p>
            <p className="text-sm text-gray-400">Total Triggers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {rules.reduce((acc, r) => acc + r.stats.completed, 0)}
            </p>
            <p className="text-sm text-gray-400">Completed Flows</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {(
                (rules.reduce((acc, r) => acc + r.stats.completed, 0) / 
                 rules.reduce((acc, r) => acc + r.stats.triggered, 0)) * 100
              ).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-400">Completion Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-400">
              {rules.filter(r => r.enabled).length}
            </p>
            <p className="text-sm text-gray-400">Active Rules</p>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === 'rules' ? 'default' : 'outline'}
          onClick={() => setActiveTab('rules')}
          className={activeTab === 'rules' ? 'bg-purple-600' : 'border-gray-600 text-gray-300'}
        >
          <Bot className="w-4 h-4 mr-2" />
          Rules
        </Button>
        <Button
          variant={activeTab === 'conversations' ? 'default' : 'outline'}
          onClick={() => setActiveTab('conversations')}
          className={activeTab === 'conversations' ? 'bg-purple-600' : 'border-gray-600 text-gray-300'}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Conversations
        </Button>
      </div>

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          {rules.map((rule) => (
            <Card key={rule.id} className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{rule.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className="bg-blue-500 text-white">
                        {rule.trigger.type.replace('_', ' ')}
                      </Badge>
                      {rule.trigger.platform && (
                        <Badge variant="outline" className="text-gray-300 border-gray-600">
                          {rule.trigger.platform}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {rule.enabled ? (
                    <Play className="w-4 h-4 text-green-400" />
                  ) : (
                    <Pause className="w-4 h-4 text-gray-400" />
                  )}
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Trigger</p>
                  <p className="text-white text-sm">
                    {rule.trigger.type} on {rule.trigger.platform || 'any platform'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Action</p>
                  <p className="text-white text-sm">{rule.action.type.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-400">{rule.stats.triggered}</p>
                  <p className="text-xs text-gray-400">Triggered</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-400">{rule.stats.completed}</p>
                  <p className="text-xs text-gray-400">Completed</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Conversations Tab */}
      {activeTab === 'conversations' && (
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <Card key={conversation.id} className="bg-gray-800 border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {conversation.fanName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{conversation.fanName}</h4>
                    <p className="text-sm text-gray-400">{conversation.lastMessage}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={`${getStatusColor(conversation.status)} text-white`}>
                    {conversation.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Rule Builder */}
      {showRuleBuilder && (
        <Card className="bg-gray-800 border-gray-700 p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Create Bot Rule</h2>
            <Button 
              variant="ghost" 
              onClick={() => setShowRuleBuilder(false)}
              className="text-gray-400"
            >
              ✕
            </Button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Rule Name</label>
              <Input 
                placeholder="e.g., Welcome New Followers"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Trigger Type</label>
                <Select>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="new_follower">New Follower</SelectItem>
                    <SelectItem value="stream_event">Stream Event</SelectItem>
                    <SelectItem value="link_click">Link Click</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Platform</label>
                <Select>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="spotify">Spotify</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Bot Message</label>
              <Textarea 
                placeholder="Enter the message your bot will send..."
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setShowRuleBuilder(false)}
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Create Rule
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}