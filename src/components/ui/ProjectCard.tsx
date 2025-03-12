
import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/types/dashboard';
import { ExternalLink, GitHub, Code } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, featured = false }) => {
  return (
    <div className={`group bg-white dark:bg-gray-800 border border-border rounded-xl overflow-hidden shadow-sm 
      transition-all duration-300 hover:shadow-md ${featured ? 'md:col-span-2' : ''}`}>
      <div className="relative">
        <Link to={`/projects/${project.slug}`} className="block">
          <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
            {project.preview_image_url ? (
              <img 
                src={project.preview_image_url} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No preview image
              </div>
            )}
          </div>
        </Link>
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-medium rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <Link to={`/projects/${project.slug}`} className="block">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary dark:hover:text-primary transition-colors">
            {project.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {project.short_description}
        </p>
        
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
              >
                <Code size={12} className="mr-1" />
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                +{project.technologies.length - 3} more
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <Link 
            to={`/projects/${project.slug}`}
            className="text-primary hover:underline font-medium text-sm"
          >
            Learn more
          </Link>
          
          <div className="flex space-x-2">
            {project.github_url && (
              <a 
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <GitHub size={18} />
              </a>
            )}
            {project.project_url && (
              <a 
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
