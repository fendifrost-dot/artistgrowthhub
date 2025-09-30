'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Music, Youtube, Facebook, Instagram, Twitter, Link as LinkIcon, Webhook, CircleCheck as CheckCircle, Circle as XCircle, Clock, RefreshCw, ExternalLink, Unlink, Settings } from 'lucide-react';
import { PlatformConnection, ConnectionStatus } from '@/types';

// Define a more specific type for our platform data
interface PlatformData {
  id: string;
  name: string;
  iconKey: string;
  status: ConnectionStatus;
  connectionType: 'quick_connect' | 'oauth' | 'app_token' | 'api_setup';
  inputType: 'url' | 'token' | 'pixel_id';
  placeholder: string;
  refreshInterval: string;
  whatWeCollect: string[];
  lastSync: string | null;
  nextSync: string | null;
  recordCount: number;
  connectedHandle: string | null;
  setupInstructions?: string[];
}
// Icon mapping to handle localStorage serialization
const iconMap = {
  youtube: Youtube,
  music: Music,
  instagram: Instagram,
  link: LinkIcon,
  twitter: Twitter,
  facebook: Facebook
};

const platforms: PlatformData[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    iconKey: 'youtube',
    status: 'disconnected',
    connectionType: 'quick_connect',
    inputType: 'url',
    placeholder: 'https://youtube.com/@yourchannel',
    refreshInterval: '6 hours',
    whatWeCollect: ['Public channel info', 'Video titles & view counts', 'Subscriber count (if public)', 'Upload dates'],
    lastSync: null,
    nextSync: null,
    recordCount: 0,
    connectedHandle: null
  },
  {
    id: 'spotify',
    name: 'Spotify',
    iconKey: 'music',
    status: 'disconnected',
    connectionType: 'quick_connect',
    inputType: 'url',
    placeholder: 'https://open.spotify.com/artist/your-id',
    refreshInterval: '24 hours',
    whatWeCollect: ['Public artist profile', 'Track titles & play counts', 'Album information', 'Release dates'],
    lastSync: null,
    nextSync: null,
    recordCount: 0,
    connectedHandle: null
  },
  {
    id: 'apple',
    name: 'Apple Music',
    iconKey: 'music',
    status: 'disconnected',
    connectionType: 'quick_connect',
    inputType: 'url',
    placeholder: 'https://music.apple.com/artist/your-name/id',
    refreshInterval: '24 hours',
    whatWeCollect: ['Public artist profile', 'Track & album info', 'Release information'],
    lastSync: null,
    nextSync: null,
    recordCount: 0,
    connectedHandle: null
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    iconKey: 'music',
    status: 'connected',
    connectionType: 'quick_connect',
    inputType: 'url',
    placeholder: 'https://soundcloud.com/your-profile',
    refreshInterval: '24 hours',
    whatWeCollect: ['Public profile info', 'Track titles & play counts', 'Follower count', 'Upload dates'],
    lastSync: '2 hours ago',
    nextSync: 'in 22 hours',
    recordCount: 47,
    connectedHandle: '@fendifrost'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    iconKey: 'instagram',
    status: 'connected',
    connectionType: 'quick_connect',
    inputType: 'url',
    placeholder: 'https://instagram.com/yourusername',
    refreshInterval: '6 hours',
    whatWeCollect: ['Public profile info', 'Recent posts & captions', 'Media engagement counts', 'Follower count'],
    lastSync: '1 hour ago',
    nextSync: 'in 5 hours',
    recordCount: 128,
    connectedHandle: '@fendifrost'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    iconKey: 'facebook',
    status: 'disconnected',
    connectionType: 'app_token',
    inputType: 'token',
    placeholder: 'Enter your Facebook App Token (starts with EAA)',
    refreshInterval: '6 hours',
    whatWeCollect: ['Page insights', 'Post engagement', 'Follower demographics', 'Page performance metrics'],
    lastSync: null,
    nextSync: null,
    recordCount: 0,
    connectedHandle: null
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    iconKey: 'twitter',
    status: 'disconnected',
    connectionType: 'quick_connect',
    inputType: 'url',
    placeholder: 'https://x.com/yourusername',
    refreshInterval: '6 hours',
    whatWeCollect: ['Public profile info', 'Tweet engagement', 'Follower count', 'Tweet content'],
    lastSync: null,
    nextSync: null,
    recordCount: 0,
    connectedHandle: null
  },
  {
    id: 'facebook-pixel',
    name: 'Facebook Pixel',
    iconKey: 'facebook',
    status: 'disconnected',
    connectionType: 'api_setup',
    inputType: 'pixel_id',
    placeholder: 'Enter your Facebook Pixel ID',
    refreshInterval: '1 hour',
    whatWeCollect: ['Website traffic data', 'Conversion events', 'Audience insights', 'Campaign performance'],
    lastSync: null,
    nextSync: null,
    recordCount: 0,
    connectedHandle: null,
    setupInstructions: [
      'Go to Facebook Events Manager',
      'Find your Pixel ID in the Data Sources section',
      'Generate a Marketing API access token',
      'Add both to your Settings page'
    ]
  },
  {
    id: 'even',
    name: 'EVEN',
    iconKey: 'music',
    status: 'disconnected',
    connectionType: 'quick_connect',
    inputType: 'url',
    placeholder: 'https://even.com/your-artist-profile',
    refreshInterval: 'Real-time',
    whatWeCollect: ['Sales data', 'Fan purchases', 'Revenue metrics', 'Customer insights'],
    lastSync: null,
    nextSync: null,
    recordCount: 0,
    connectedHandle: null
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'connected':
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'syncing':
      return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
    default:
      return <XCircle className="w-4 h-4 text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'connected':
      return 'bg-green-500';
    case 'syncing':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

export default function ChannelsPage() {
  const [platforms_state, setPlatforms] = useState<PlatformData[]>([]);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [connectionInput, setConnectionInput] = useState('');

  // Load platforms from localStorage on mount
  useEffect(() => {
    const savedPlatforms = localStorage.getItem('connectedPlatforms');
    if (savedPlatforms) {
      try {
        const parsed = JSON.parse(savedPlatforms);
        setPlatforms(parsed);
      } catch (error) {
        console.error('Error loading saved platforms:', error);
        setPlatforms(platforms);
      }
    } else {
      setPlatforms(platforms);
    }
  }, []);

  // Save platforms to localStorage whenever state changes
  useEffect(() => {
    if (platforms_state.length > 0) {
      localStorage.setItem('connectedPlatforms', JSON.stringify(platforms_state));
    }
  }, [platforms_state]);

  const handleQuickConnect = (platformId: string) => {
    if (!connectionInput.trim()) return;

    // Set to syncing state
    setPlatforms(prev => 
      prev.map(p => 
        p.id === platformId 
          ? { 
              ...p, 
              status: 'syncing',
              connectedHandle: connectionInput.includes('://') 
                ? connectionInput.split('/').pop() || connectionInput
                : connectionInput.startsWith('EAA') ? 'App Token Connected' : connectionInput
            }
          : p
      )
    );

    // Simulate connection process
    setTimeout(() => {
      setPlatforms(prev => 
        prev.map(p => 
          p.id === platformId 
            ? { 
                ...p, 
                status: 'connected' as ConnectionStatus,
                lastSync: 'just now',
                nextSync: `in ${p.refreshInterval}`,
                recordCount: Math.floor(Math.random() * 200) + 10
              }
            : p
        )
      );
      setConnectingPlatform(null);
      setConnectionInput('');
    }, 2000);
  };

  const handleInstagramLogin = () => {
    // This function is no longer needed since Instagram uses quick_connect now
  };

  // Handle Instagram OAuth callback (this would normally be in a separate callback page)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const authPending = localStorage.getItem('instagram_auth_pending');
    
    if (authPending && (code || error)) {
      localStorage.removeItem('instagram_auth_pending');
      
      if (code) {
        // Success - simulate successful connection
        setTimeout(() => {
          setPlatforms(prev => 
            prev.map(p => 
              p.id === 'instagram' 
                ? { 
                    ...p, 
                    status: 'connected' as ConnectionStatus,
                    lastSync: 'just now',
                    nextSync: 'in 6 hours',
                    recordCount: Math.floor(Math.random() * 200) + 50,
                    connectedHandle: '@yourhandle'
                  }
                : p
            )
          );
          
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }, 1000);
      } else {
        // Error or user cancelled
        setPlatforms(prev => 
          prev.map(p => 
            p.id === 'instagram' 
              ? { ...p, status: 'disconnected' as ConnectionStatus }
              : p
          )
        );
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Check for returning from OAuth on component mount
  useEffect(() => {
    const authPending = localStorage.getItem('instagram_auth_pending');
    if (authPending) {
      setPlatforms(prev => 
        prev.map(p => 
          p.id === 'instagram' 
            ? { ...p, status: 'syncing' as ConnectionStatus }
            : p
        )
      );
    }
  }, []);

  const handleDisconnect = (platformId: string) => {
    setPlatforms(prev => 
      prev.map(p => 
        p.id === platformId 
          ? { 
              ...p, 
              status: 'disconnected' as ConnectionStatus,
              lastSync: null,
              nextSync: null,
              recordCount: 0,
              connectedHandle: null
            }
          : p
      )
    );
  };

  const handleForceSync = (platformId: string) => {
    setPlatforms(prev => 
      prev.map(p => 
        p.id === platformId 
          ? { ...p, status: 'syncing' as ConnectionStatus }
          : p
      )
    );

    setTimeout(() => {
      setPlatforms(prev => 
        prev.map(p => 
          p.id === platformId 
            ? { 
                ...p, 
                status: 'connected' as ConnectionStatus,
                lastSync: 'just now',
                nextSync: `in ${p.refreshInterval}`,
                recordCount: p.recordCount + Math.floor(Math.random() * 10)
              }
            : p
        )
      );
    }, 2000);
  };

  const connectedCount = platforms_state.filter(p => p.status === 'connected').length;
  const totalRecords = platforms_state.reduce((acc, p) => acc + p.recordCount, 0);

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Channels</h1>
        <p className="text-gray-400">
          Connect your platforms to unify fan data and drive monetization
        </p>
      </div>

      {/* Connection Overview */}
      <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Connection Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{connectedCount}</p>
            <p className="text-sm text-gray-400">Connected Platforms</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {platforms_state.filter(p => p.status === 'syncing').length}
            </p>
            <p className="text-sm text-gray-400">Syncing</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">{totalRecords.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Total Records</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-400">
              {platforms_state.filter(p => p.refreshInterval === 'Real-time' && p.status === 'connected').length}
            </p>
            <p className="text-sm text-gray-400">Real-time Feeds</p>
          </div>
        </div>
      </Card>

      {/* Platform Connection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms_state.map((platform) => (
          <Card key={platform.id} className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  {(() => {
                    const IconComponent = iconMap[platform.iconKey as keyof typeof iconMap] || LinkIcon;
                    return <IconComponent className="w-5 h-5 text-white" />;
                  })()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-white">{platform.name}</h3>
                    {platform.optional && (
                      <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                        Optional
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(platform.status)}
                    <Badge className={`${getStatusColor(platform.status)} text-white text-xs`}>
                      {platform.status === 'disconnected' ? 'Not Connected' : 
                       platform.status === 'syncing' ? 'Syncing...' : 'Connected'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Status */}
            {platform.status === 'connected' && (
              <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Connected as:</span>
                  <span className="text-sm text-white font-medium">{platform.connectedHandle}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Last sync:</span>
                    <span className="text-white ml-1">{platform.lastSync}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Next sync:</span>
                    <span className="text-white ml-1">{platform.nextSync}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400">Records:</span>
                    <span className="text-white ml-1">{platform.recordCount.toLocaleString()} items</span>
                  </div>
                </div>
              </div>
            )}

            {/* What We Collect */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">What we collect:</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                {platform.whatWeCollect.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-1 h-1 bg-purple-400 rounded-full mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-2 italic">
                We only collect public data + data you choose to provide.
              </p>
            </div>

            <Separator className="bg-gray-700 mb-4" />

            {/* Connection Actions */}
            {platform.status === 'disconnected' && (
              <div className="space-y-3">
                {platform.connectionType === 'api_setup' ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                      <h4 className="text-blue-300 font-medium mb-2">Setup Required</h4>
                      <ol className="text-xs text-blue-200 space-y-1">
                        {platform.setupInstructions?.map((instruction, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-400 mr-2">{idx + 1}.</span>
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <Button 
                      onClick={() => window.open('/settings', '_blank')}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Configure in Settings
                    </Button>
                  </div>
                ) : platform.connectionType === 'quick_connect' ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => setConnectingPlatform(platform.id)}
                      >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Quick Connect
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Connect {platform.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-300">
                            {platform.inputType === 'webhook' ? 'Webhook Token' : 'Profile URL'}
                          </Label>
                          <Input
                            value={connectionInput}
                            onChange={(e) => setConnectionInput(e.target.value)}
                            placeholder={platform.placeholder}
                            className="bg-gray-700 border-gray-600 text-white mt-2"
                          />
                        </div>
                        <div className="text-xs text-gray-400">
                          <p className="mb-2">Refresh interval: <span className="text-white">{platform.refreshInterval}</span></p>
                          <p>We'll sync your public data every {platform.refreshInterval.toLowerCase()}.</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleQuickConnect(platform.id)}
                            disabled={!connectionInput.trim()}
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                          >
                            Connect
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setConnectingPlatform(null);
                              setConnectionInput('');
                            }}
                            className="border-gray-600 text-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : platform.connectionType === 'app_token' ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => setConnectingPlatform(platform.id)}
                      >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Connect with Token
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Connect {platform.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-300">App Token</Label>
                          <Input
                            value={connectionInput}
                            onChange={(e) => setConnectionInput(e.target.value)}
                            placeholder={platform.placeholder}
                            className="bg-gray-700 border-gray-600 text-white mt-2"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Your Facebook App Token should start with "EAA"
                          </p>
                        </div>
                        <div className="text-xs text-gray-400">
                          <p className="mb-2">Refresh interval: <span className="text-white">{platform.refreshInterval}</span></p>
                          <p>We'll sync your page data every {platform.refreshInterval.toLowerCase()}.</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleQuickConnect(platform.id)}
                            disabled={!connectionInput.trim()}
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                          >
                            Connect
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setConnectingPlatform(null);
                              setConnectionInput('');
                            }}
                            className="border-gray-600 text-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  // This case should never be reached since all platforms now use standard connection types
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Connect
                  </Button>
                )}
                <p className="text-xs text-gray-500 text-center">
                  Read-only access • Public data only
                </p>
              </div>
            )}

            {platform.status === 'connected' && (
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleForceSync(platform.id)}
                  className="flex-1 border-gray-600 text-gray-300"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Sync Now
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDisconnect(platform.id)}
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Unlink className="w-3 h-3" />
                </Button>
              </div>
            )}

            {platform.status === 'syncing' && (
              <div className="flex items-center justify-center py-2">
                <RefreshCw className="w-4 h-4 text-blue-400 animate-spin mr-2" />
                <span className="text-sm text-blue-400">Syncing data...</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Compliance Footer */}
      <Card className="bg-gray-800 border-gray-700 p-6 mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Privacy & Compliance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="text-white font-medium mb-2">Read-Only Access</h4>
            <p className="text-gray-400">We only read public data. No posting, messaging, or private content access.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Your Data</h4>
            <p className="text-gray-400">You control what we collect. Disconnect anytime to stop data sync.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Secure Storage</h4>
            <p className="text-gray-400">All data is encrypted and stored securely. We never share with third parties.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}