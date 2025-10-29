'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Link2, ExternalLink, Edit, Trash2, Copy, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface SmartLink {
  id: string;
  slug: string;
  destination: string;
  title?: string;
  campaignName?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  active: boolean;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function SmartLinksPage() {
  const [smartLinks, setSmartLinks] = useState<SmartLink[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SmartLink | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    slug: '',
    destination: '',
    title: '',
    campaignName: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: ''
  });

  useEffect(() => {
    fetchSmartLinks();
  }, []);

  const fetchSmartLinks = async () => {
    try {
      const res = await fetch('/api/smartlinks');
      const data = await res.json();
      setSmartLinks(data.smartLinks || []);
    } catch (error) {
      console.error('Failed to fetch smart links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/smartlinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || 'Failed to create smart link');
        return;
      }

      toast.success('Smart link created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchSmartLinks();
    } catch (error) {
      toast.error('Failed to create smart link');
    }
  };

  const handleUpdate = async () => {
    if (!editingLink) return;

    try {
      const res = await fetch('/api/smartlinks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingLink.id, ...formData })
      });

      if (!res.ok) {
        toast.error('Failed to update smart link');
        return;
      }

      toast.success('Smart link updated successfully');
      setEditingLink(null);
      resetForm();
      fetchSmartLinks();
    } catch (error) {
      toast.error('Failed to update smart link');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this smart link?')) return;

    try {
      const res = await fetch(`/api/smartlinks?id=${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        toast.error('Failed to delete smart link');
        return;
      }

      toast.success('Smart link deleted successfully');
      fetchSmartLinks();
    } catch (error) {
      toast.error('Failed to delete smart link');
    }
  };

  const copyToClipboard = (slug: string) => {
    const url = `${window.location.origin}/redirect/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      destination: '',
      title: '',
      campaignName: '',
      utmSource: '',
      utmMedium: '',
      utmCampaign: ''
    });
  };

  const openEditDialog = (link: SmartLink) => {
    setEditingLink(link);
    setFormData({
      slug: link.slug,
      destination: link.destination,
      title: link.title || '',
      campaignName: link.campaignName || '',
      utmSource: link.utmSource || '',
      utmMedium: link.utmMedium || '',
      utmCampaign: link.utmCampaign || ''
    });
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Smart Links</h1>
          <p className="text-gray-400 mt-2">Create trackable short links for your campaigns</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Smart Link
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Smart Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Slug (URL path)</Label>
                  <Input
                    placeholder="new-single"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Will create: /redirect/{formData.slug || 'slug'}</p>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    placeholder="New Single Drop"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Destination URL</Label>
                <Input
                  placeholder="https://even.com/fendi-frost/midnight-vibes"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white mt-2"
                />
              </div>

              <div>
                <Label>Campaign Name</Label>
                <Input
                  placeholder="Single Release 2024"
                  value={formData.campaignName}
                  onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white mt-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>UTM Source</Label>
                  <Input
                    placeholder="facebook"
                    value={formData.utmSource}
                    onChange={(e) => setFormData({ ...formData, utmSource: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label>UTM Medium</Label>
                  <Input
                    placeholder="social"
                    value={formData.utmMedium}
                    onChange={(e) => setFormData({ ...formData, utmMedium: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label>UTM Campaign</Label>
                  <Input
                    placeholder="single-launch"
                    value={formData.utmCampaign}
                    onChange={(e) => setFormData({ ...formData, utmCampaign: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white mt-2"
                  />
                </div>
              </div>

              <Button onClick={handleCreate} className="w-full bg-blue-600 hover:bg-blue-700">
                Create Smart Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : smartLinks.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 p-12 text-center">
          <Link2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Smart Links Yet</h3>
          <p className="text-gray-400 mb-6">Create your first smart link to start tracking campaigns</p>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Smart Link
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {smartLinks.map((link) => (
            <Card key={link.id} className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {link.title || link.slug}
                    </h3>
                    <Badge variant={link.active ? "default" : "secondary"}>
                      {link.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Link2 className="w-4 h-4" />
                      <code className="bg-gray-900 px-2 py-1 rounded">/redirect/{link.slug}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(link.slug)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                      <ExternalLink className="w-4 h-4" />
                      <span className="truncate">{link.destination}</span>
                    </div>

                    {link.campaignName && (
                      <div className="text-gray-500">
                        Campaign: {link.campaignName}
                      </div>
                    )}

                    {(link.utmSource || link.utmMedium || link.utmCampaign) && (
                      <div className="flex gap-2 text-xs text-gray-500">
                        {link.utmSource && <span>Source: {link.utmSource}</span>}
                        {link.utmMedium && <span>Medium: {link.utmMedium}</span>}
                        {link.utmCampaign && <span>Campaign: {link.utmCampaign}</span>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-white">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      <span className="text-2xl font-bold">{link.clickCount}</span>
                    </div>
                    <div className="text-xs text-gray-500">clicks</div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(link)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(link.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editingLink} onOpenChange={(open) => !open && setEditingLink(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Smart Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Slug (URL path)</Label>
                <Input
                  value={formData.slug}
                  disabled
                  className="bg-gray-700 border-gray-600 text-gray-500 mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">Slug cannot be changed</p>
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  placeholder="New Single Drop"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white mt-2"
                />
              </div>
            </div>

            <div>
              <Label>Destination URL</Label>
              <Input
                placeholder="https://even.com/fendi-frost/midnight-vibes"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>

            <div>
              <Label>Campaign Name</Label>
              <Input
                placeholder="Single Release 2024"
                value={formData.campaignName}
                onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>UTM Source</Label>
                <Input
                  placeholder="facebook"
                  value={formData.utmSource}
                  onChange={(e) => setFormData({ ...formData, utmSource: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white mt-2"
                />
              </div>
              <div>
                <Label>UTM Medium</Label>
                <Input
                  placeholder="social"
                  value={formData.utmMedium}
                  onChange={(e) => setFormData({ ...formData, utmMedium: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white mt-2"
                />
              </div>
              <div>
                <Label>UTM Campaign</Label>
                <Input
                  placeholder="single-launch"
                  value={formData.utmCampaign}
                  onChange={(e) => setFormData({ ...formData, utmCampaign: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white mt-2"
                />
              </div>
            </div>

            <Button onClick={handleUpdate} className="w-full bg-blue-600 hover:bg-blue-700">
              Update Smart Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
