export type Platform = 
  | 'spotify' 
  | 'apple' 
  | 'soundcloud' 
  | 'youtube' 
  | 'facebook' 
  | 'instagram' 
  | 'twitter' 
  | 'tiktok' 
  | 'hypeddit' 
  | 'even';

export type ConnectionStatus = 'connected' | 'disconnected' | 'pending' | 'error';

export interface PlatformConnection {
  id: string;
  platform: Platform;
  status: ConnectionStatus;
  connectedAt?: string;
  lastSync?: string;
  metrics?: {
    followers?: number;
    streams?: number;
    engagement?: number;
  };
}

export interface FanProfile {
  id: string;
  email?: string;
  phone?: string;
  platforms: Record<Platform, string[]>;
  segments: string[];
  totalEngagement: number;
  lastActive: string;
  ltv: number;
  location?: string;
}

export interface Audience {
  id: string;
  name: string;
  description: string;
  filters: AudienceFilter[];
  count: number;
  lastUpdated: string;
}

export interface AudienceFilter {
  type: 'platform' | 'engagement' | 'location' | 'ltv' | 'recency';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: string | number;
}

export interface Offer {
  id: string;
  name: string;
  type: 'discount' | 'presave' | 'exclusive' | 'merch';
  destination: 'even' | 'bemoremodest';
  config: {
    discountPercent?: number;
    couponCode?: string;
    url?: string;
    expiresAt?: string;
  };
  audienceId?: string;
  active: boolean;
  stats: {
    sent: number;
    clicked: number;
    converted: number;
  };
  createdAt: string;
}

export interface BotRule {
  id: string;
  name: string;
  trigger: {
    type: 'new_follower' | 'stream_event' | 'link_click' | 'purchase';
    platform?: Platform;
    conditions?: Record<string, any>;
  };
  action: {
    type: 'send_message' | 'collect_email' | 'issue_offer';
    config: Record<string, any>;
  };
  active: boolean;
  stats: {
    triggered: number;
    completed: number;
  };
}

export interface DashboardMetrics {
  totalFans: number;
  connectedPlatforms: number;
  newOptIns: number;
  conversions: {
    even: number;
    merch: number;
  };
  revenue: number;
  engagementRate: number;
}