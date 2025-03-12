import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  short_description: z.string().min(1, 'Short description is required'),
  full_description: z.string().min(1, 'Full description is required'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  preview_image_url: z.string().optional(),
  github_url: z.string().optional(),
  project_url: z.string().optional(),
  featured: z.boolean().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialValues?: ProjectFormValues;
  onSubmit: (formData: ProjectFormValues) => void;
  loading?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialValues, onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="title"
          {...register('title')}
          className={`mt-1 block w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-primary`}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">Short Description</label>
        <textarea
          id="short_description"
          {...register('short_description')}
          className={`mt-1 block w-full border ${errors.short_description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-primary`}
        />
        {errors.short_description && <p className="text-red-500 text-sm">{errors.short_description.message}</p>}
      </div>

      <div>
        <label htmlFor="full_description" className="block text-sm font-medium text-gray-700">Full Description</label>
        <textarea
          id="full_description"
          {...register('full_description')}
          className={`mt-1 block w-full border ${errors.full_description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-primary`}
        />
        {errors.full_description && <p className="text-red-500 text-sm">{errors.full_description.message}</p>}
      </div>

      <div>
        <label htmlFor="technologies" className="block text-sm font-medium text-gray-700">Technologies</label>
        <input
          id="technologies"
          {...register('technologies')}
          className={`mt-1 block w-full border ${errors.technologies ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-primary`}
        />
        {errors.technologies && <p className="text-red-500 text-sm">{errors.technologies.message}</p>}
      </div>

      <div>
        <label htmlFor="preview_image_url" className="block text-sm font-medium text-gray-700">Preview Image URL</label>
        <input
          id="preview_image_url"
          {...register('preview_image_url')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="github_url" className="block text-sm font-medium text-gray-700">GitHub URL</label>
        <input
          id="github_url"
          {...register('github_url')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="project_url" className="block text-sm font-medium text-gray-700">Project URL</label>
        <input
          id="project_url"
          {...register('project_url')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="featured" className="flex items-center">
          <input
            id="featured"
            type="checkbox"
            {...register('featured')}
            className="mr-2"
          />
          Featured
        </label>
      </div>

      <Button type="submit" variant="primary" loading={loading}>
        {loading ? 'Saving...' : 'Save Project'}
      </Button>
    </form>
  );
};

export default ProjectForm;
