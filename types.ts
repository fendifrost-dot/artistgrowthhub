// Consolidated type definitions
export type Platform = 
  | 'spotify' 
  | 'apple' 
  | 'soundcloud' 
  | 'youtube' 
  | 'facebook' 
  | 'instagram' 
  | 'twitter' 
  | 'tiktok' 
  | 'even';

export type ConnectionStatus = 'connected' | 'disconnected' | 'syncing' | 'error';

export interface PlatformConnection {
  id: string;
  name: string;
  iconKey: string;
  platform: Platform;
  status: ConnectionStatus;
  connectionType: 'quick_connect' | 'oauth' | 'app_token' | 'api_setup';
  inputType: 'url' | 'token' | 'pixel_id';
  placeholder: string;
  refreshInterval: string;
  whatWeCollect: string[];
  connectedAt?: string;
  lastSync?: string | null;
  nextSync?: string | null;
  recordCount: number;
  connectedHandle?: string | null;
  setupInstructions?: string[];
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
  conversionRate: number;
}

export interface AudienceFilter {
  type: 'platform' | 'engagement' | 'location' | 'ltv' | 'recency';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: string | number;
}

// Core Offer type (matches Prisma schema)
export type Channel = 'chat' | 'sms' | 'email' | 'igdm';
export type OfferKind = 'discount' | 'bundle' | 'download' | 'link' | 'presave' | 'exclusive' | 'merch';

export type OfferConfig = {
  discount_pct?: number;
  coupon?: string;
  url?: string;
  minSpend?: number;
  expiresAt?: string;
  discountPercent?: number; // Legacy field for compatibility
  couponCode?: string; // Legacy field for compatibility
};

export interface Offer {
  id: string;
  name: string;
  channel: Channel;
  kind: OfferKind;
  active: boolean;
  config: OfferConfig;
  createdAt: string;
  updatedAt: string;
}

// Extended Offer type for display purposes
export interface DisplayOffer extends Offer {
  type: string; // Legacy field for display
  destination: 'even' | 'bemoremodest';
  audienceId?: string;
  stats: {
    sent: number;
    clicked: number;
    converted: number;
  };
}

export interface BotRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: {
    type: 'new_follower' | 'stream_event' | 'link_click' | 'purchase';
    platform?: Platform;
    conditions?: Record<string, any>;
  };
  action: {
    type: 'send_message' | 'collect_email' | 'issue_offer';
    config: Record<string, any>;
  };
  stats: {
    triggered: number;
    completed: number;
  };
}

export interface BotConversation {
  id: string;
  fanName: string;
  platform: string;
  lastMessage: string;
  timestamp: string;
  status: 'converted' | 'active' | 'completed';
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