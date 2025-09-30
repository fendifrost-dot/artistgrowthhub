'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Key, Shield, Bell, Globe, Database, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle } from 'lucide-react';

const apiConnections = [
  { name: 'EVEN API', status: 'connected', lastSync: '2 hours ago' },
  { name: 'BeMoreModest API', status: 'connected', lastSync: '1 hour ago' },
  { name: 'Facebook Marketing API', status: 'pending', lastSync: null },
  { name: 'Meta Conversions API', status: 'pending', lastSync: null },
  { name: 'Google Analytics', status: 'error', lastSync: '2 days ago' },
  { name: 'Postmark Email', status: 'connected', lastSync: '30 min ago' },
  { name: 'Twilio SMS', status: 'connected', lastSync: '1 hour ago' }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'connected':
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'pending':
      return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    case 'error':
      return <XCircle className="w-4 h-4 text-red-400" />;
    default:
      return <XCircle className="w-4 h-4 text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'connected':
      return 'bg-green-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'error':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export default function Settings() {
  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">
          Configure your Artist Growth Hub preferences and integrations
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Settings */}
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <User className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="artist-name" className="text-gray-300">Artist Name</Label>
              <Input
                id="artist-name"
                defaultValue="Fendi Frost"
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="fendi@fendifrostinc.com"
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="bio" className="text-gray-300">Artist Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell your fans about yourself..."
                className="bg-gray-700 border-gray-600 text-white mt-2"
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Domain Configuration */}
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Globe className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Domain Configuration</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="smartlink-domain" className="text-gray-300">Smart Link Domain</Label>
              <Input
                id="smartlink-domain"
                defaultValue="go.fendifrost.com"
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">Used for tracking campaign links</p>
            </div>
            <div>
              <Label htmlFor="webhook-url" className="text-gray-300">Webhook URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://your-app.com/webhooks"
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">For receiving platform notifications</p>
            </div>
          </div>
        </Card>

        {/* API Keys */}
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Key className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">API Keys</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="even-api" className="text-gray-300">EVEN API Key</Label>
              <Input
                id="even-api"
                type="password"
                placeholder="Enter your EVEN API key"
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>
            <div>
              <Label htmlFor="merch-api" className="text-gray-300">BeMoreModest API Key</Label>
              <Input
                id="merch-api"
                type="password"
                placeholder="Enter your merch store API key"
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>
            <div>
              <Label htmlFor="meta-pixel" className="text-gray-300">Meta Pixel ID</Label>
              <Input
                id="meta-pixel"
                placeholder="Enter your Meta Pixel ID"
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>
            <div>
              <Label htmlFor="meta-access-token" className="text-gray-300">Meta Marketing API Access Token</Label>
              <Input
                id="meta-access-token"
                type="password"
                placeholder="Enter your Meta Marketing API access token"
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">Required for Facebook Pixel data access</p>
            </div>
          </div>
        </Card>

        {/* API Connections Status */}
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Database className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">API Connections</h2>
          </div>
          <div className="space-y-4">
            {apiConnections.map((connection) => (
              <div key={connection.name} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(connection.status)}
                  <div>
                    <h4 className="text-white font-medium">{connection.name}</h4>
                    {connection.lastSync && (
                      <p className="text-xs text-gray-400">Last sync: {connection.lastSync}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getStatusColor(connection.status)} text-white`}>
                    {connection.status}
                  </Badge>
                  {connection.status === 'error' && (
                    <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                      Reconnect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Bell className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">New Fan Notifications</h4>
                <p className="text-sm text-gray-400">Get notified when new fans follow or engage</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-gray-700" />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Conversion Alerts</h4>
                <p className="text-sm text-gray-400">Alert when fans make purchases</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-gray-700" />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Bot Performance Reports</h4>
                <p className="text-sm text-gray-400">Weekly bot engagement summaries</p>
              </div>
              <Switch />
            </div>
            <Separator className="bg-gray-700" />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">API Error Alerts</h4>
                <p className="text-sm text-gray-400">Immediate alerts for connection issues</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Privacy & Compliance */}
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Privacy & Compliance</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="privacy-policy" className="text-gray-300">Privacy Policy URL</Label>
              <Input
                id="privacy-policy"
                placeholder="https://fendifrost.com/privacy"
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>
            <div>
              <Label htmlFor="terms-url" className="text-gray-300">Terms of Service URL</Label>
              <Input
                id="terms-url"
                placeholder="https://fendifrost.com/terms"
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>
            <div>
              <Label htmlFor="opt-out-text" className="text-gray-300">SMS Opt-out Instructions</Label>
              <Textarea
                id="opt-out-text"
                defaultValue="Reply STOP to unsubscribe from SMS messages. Msg & data rates may apply."
                className="bg-gray-700 border-gray-600 text-white mt-2"
                rows={2}
              />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-purple-600 hover:bg-purple-700">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}