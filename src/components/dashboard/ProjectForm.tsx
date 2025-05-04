import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Project } from '@/types/dashboard';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Button from '@/components/ui/Button';
import { generatePreviewFromUrl, isValidUrl } from '@/utils/previewUtils';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .transform(val => val.toLowerCase()),
  short_description: z.string().min(1, 'Short description is required'),
  full_description: z.string().min(1, 'Full description is required'),
  technologies: z.string().optional(),
  github_url: z.string().optional(),
  project_url: z.string().optional(),
  image_url: z.string().optional(),
  featured: z.boolean().default(false),
  order_index: z.number().default(0),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export interface ProjectFormProps {
  project: Project | null;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  loading: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, loading }) => {
  const { toast } = useToast();
  
  const defaultValues: Partial<ProjectFormValues> = {
    title: project?.title || '',
    slug: project?.slug || '',
    short_description: project?.short_description || '',
    full_description: project?.full_description || '',
    technologies: project?.technologies ? project.technologies.join(', ') : '',
    github_url: project?.github_url || '',
    project_url: project?.project_url || '',
    image_url: project?.image_url || '',
    featured: project?.featured || false,
    order_index: project?.order_index || 0,
  };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  // Handle the URL auto-slugification
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    const currentSlug = form.getValues('slug');
    if (!currentSlug || currentSlug === '') {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      form.setValue('slug', slug);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="My Awesome Project" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleTitleChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug * (URL-friendly name)</FormLabel>
                <FormControl>
                  <Input placeholder="my-awesome-project" {...field} />
                </FormControl>
                <FormDescription>
                  Only lowercase letters, numbers, and hyphens
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="short_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description *</FormLabel>
              <FormControl>
                <Input placeholder="A brief description of your project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="full_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detailed description of your project" 
                  className="min-h-32" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologies (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="React, TypeScript, Tailwind" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="github_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/username/repo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="project_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live Project URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://myproject.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Featured Project</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Display this project on the homepage
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="order_index"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            variant="primary"
            loading={loading}
          >
            {project ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;
