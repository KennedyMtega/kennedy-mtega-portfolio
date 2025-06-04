
import React, { useState, useRef } from 'react';
import { Service } from '@/types/services';
import { Button } from '@/components/ui/button-shadcn';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload } from 'lucide-react';
import { uploadServiceMedia } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';

interface ServiceFormProps {
  service?: Service;
  onSubmit: (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: service?.description || '',
    short_description: service?.short_description || '',
    pricing_type: service?.pricing_type || 'fixed' as 'fixed' | 'inquiry',
    price: service?.price || 0,
    currency: service?.currency || 'USD',
    image_url: service?.image_url || '',
    video_url: service?.video_url || '',
    featured: service?.featured || false,
    category: service?.category || '',
    features: service?.features || [],
    order_index: service?.order_index || 0,
    is_active: service?.is_active ?? true,
  });

  const [newFeature, setNewFeature] = useState('');
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const handleFileUpload = async (file: File, type: 'image' | 'video') => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const path = `${type}s/${fileName}`;
      
      const url = await uploadServiceMedia(file, path);
      
      if (type === 'image') {
        setFormData({ ...formData, image_url: url });
      } else {
        setFormData({ ...formData, video_url: url });
      }

      toast({
        title: "Upload successful",
        description: `${type === 'image' ? 'Image' : 'Video'} uploaded successfully.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title">Service Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Web Development, Consulting"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="short_description">Short Description</Label>
        <Input
          id="short_description"
          value={formData.short_description}
          onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
          placeholder="Brief description for cards"
        />
      </div>

      <div>
        <Label htmlFor="description">Full Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="pricing_type">Pricing Type *</Label>
          <Select
            value={formData.pricing_type}
            onValueChange={(value: 'fixed' | 'inquiry') => 
              setFormData({ ...formData, pricing_type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed Price</SelectItem>
              <SelectItem value="inquiry">Request Quote</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.pricing_type === 'fixed' && (
          <>
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="TZS">TZS</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      <div>
        <Label>Features</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add a feature"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
          />
          <Button type="button" onClick={addFeature} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {feature}
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Service Image</Label>
          <div className="space-y-2">
            <Input
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="Image URL or upload file"
            />
            <div className="flex gap-2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'image');
                }}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </div>
            {formData.image_url && (
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-full h-32 object-cover rounded-md"
              />
            )}
          </div>
        </div>

        <div>
          <Label>Service Video</Label>
          <div className="space-y-2">
            <Input
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              placeholder="Video URL or upload file"
            />
            <div className="flex gap-2">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'video');
                }}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => videoInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Video
              </Button>
            </div>
            {formData.video_url && (
              <video
                src={formData.video_url}
                controls
                className="w-full h-32 rounded-md"
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
          />
          <Label htmlFor="featured">Featured Service</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>

        <div>
          <Label htmlFor="order_index">Display Order</Label>
          <Input
            id="order_index"
            type="number"
            value={formData.order_index}
            onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || uploading}>
          {loading ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;
