'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import type { Offer, Channel, OfferKind, OfferConfig } from '@/types';

interface OfferEditorProps {
  offer?: Offer;
  onSave: (offer: Partial<Offer>) => void;
  onCancel: () => void;
}

// Form state keeps strings so inputs are happy
type FormConfig = {
  discount_pct: string;   // keep as string in form
  coupon: string;
  url: string;
  minSpend: string;       // keep as string in form
  expiresAt: string;      // ISO string or ''
};

type FormState = {
  name: string;
  channel: Channel;
  kind: OfferKind;
  active: boolean;
  config: FormConfig;
};

export default function OfferEditor({ offer, onSave, onCancel }: OfferEditorProps) {
  const [formData, setFormData] = useState<FormState>(() => ({
    name: offer?.name ?? '',
    channel: (offer?.channel ?? 'email') as Channel,
    kind: (offer?.kind ?? 'discount') as OfferKind,
    active: offer?.active ?? true,
    config: {
      discount_pct: offer?.config.discount_pct != null ? String(offer.config.discount_pct) : '',
      coupon: offer?.config.coupon ?? '',
      url: offer?.config.url ?? '',
      minSpend: offer?.config.minSpend != null ? String(offer.config.minSpend) : '',
      expiresAt: offer?.config.expiresAt ?? '',
    },
  }));

  const updateConfig = (key: keyof FormConfig, value: string) => {
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Normalize strings → proper types for Offer.config
    const toNumber = (v: string): number | undefined =>
      v.trim() === '' ? undefined : Number(v);

    const cleanedConfig: OfferConfig = {
      discount_pct: toNumber(formData.config.discount_pct),
      coupon: formData.config.coupon.trim() || undefined,
      url: formData.config.url.trim() || undefined,
      minSpend: toNumber(formData.config.minSpend),
      expiresAt: formData.config.expiresAt.trim() || undefined,
    };

    const payload: Partial<Offer> = {
      name: formData.name.trim(),
      channel: formData.channel,
      kind: formData.kind,
      active: formData.active,
      config: cleanedConfig,
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="bg-gray-800 border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {offer ? 'Edit Offer' : 'Create New Offer'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Offer Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., New Fan Welcome"
                required
              />
            </div>

            <div>
              <Label htmlFor="channel" className="text-gray-300">Channel</Label>
              <Select value={formData.channel} onValueChange={(value) => setFormData(prev => ({ ...prev, channel: value as Channel }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="igdm">Instagram DM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="kind" className="text-gray-300">Offer Type</Label>
              <Select value={formData.kind} onValueChange={(value) => setFormData(prev => ({ ...prev, kind: value as OfferKind }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="discount">Discount</SelectItem>
                  <SelectItem value="bundle">Bundle</SelectItem>
                  <SelectItem value="download">Download</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
              />
              <Label className="text-gray-300">Active</Label>
            </div>
          </div>

          {/* Conditional fields based on offer type */}
          {(formData.kind === 'discount' || formData.kind === 'bundle') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount" className="text-gray-300">Discount %</Label>
                <Input
                  id="discount"
                  type="number"
                  inputMode="decimal"
                  value={formData.config.discount_pct}
                  onChange={(e) => updateConfig('discount_pct', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="10"
                />
              </div>
              <div>
                <Label htmlFor="coupon" className="text-gray-300">Coupon Code</Label>
                <Input
                  id="coupon"
                  value={formData.config.coupon}
                  onChange={(e) => updateConfig('coupon', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="WELCOME10"
                />
              </div>
            </div>
          )}

          {formData.kind === 'bundle' && (
            <div>
              <Label htmlFor="minSpend" className="text-gray-300">Minimum Spend ($)</Label>
              <Input
                id="minSpend"
                type="number"
                inputMode="decimal"
                value={formData.config.minSpend}
                onChange={(e) => updateConfig('minSpend', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="50"
              />
            </div>
          )}

          {(formData.kind === 'download' || formData.kind === 'link') && (
            <div>
              <Label htmlFor="url" className="text-gray-300">URL</Label>
              <Input
                id="url"
                type="url"
                value={formData.config.url}
                onChange={(e) => updateConfig('url', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="https://example.com/exclusive-content"
              />
            </div>
          )}

          <div>
            <Label htmlFor="expires" className="text-gray-300">Expires At (optional)</Label>
            <Input
              id="expires"
              type="datetime-local"
              value={formData.config.expiresAt}
              onChange={(e) => updateConfig('expiresAt', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel} className="border-gray-600 text-gray-300">
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {offer ? 'Update Offer' : 'Create Offer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}