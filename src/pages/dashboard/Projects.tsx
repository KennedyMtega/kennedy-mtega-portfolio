
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProjectList from '@/components/dashboard/ProjectList';
import ProjectForm from '@/components/dashboard/ProjectForm';
import { Project } from '@/types/dashboard';

const ProjectsPage = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedProject(null);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedProject(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedProject(null);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {!showForm ? (
          <ProjectList 
            onEdit={handleEditProject}
            onAddNew={handleAddNew}
          />
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedProject ? 'Edit Project' : 'Create New Project'}
              </h2>
            </div>
            <ProjectForm 
              project={selectedProject || undefined}
              onSubmitSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;
