/**
 * Project Card Component
 * 
 * Reusable card for displaying project summary
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { EditProjectDialog } from './EditProjectDialog';
import type { Project } from '@/types/models';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    
    const confirmed = confirm(
      `Are you sure you want to delete "${project.name}"? This will also delete all counters and progress photos.`
    );
    
    if (confirmed) {
      await deleteProject(project.id);
    }
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    setShowEditDialog(true);
  };
  
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation(); // Prevent navigation
    const newStatus = e.target.value as Project['status'];
    
    const updates: Partial<Project> = { status: newStatus };
    
    // Set completedDate when marking as completed
    if (newStatus === 'completed') {
      updates.completedDate = project.completedDate || new Date();
    } else if (project.completedDate) {
      updates.completedDate = undefined; //  Clear if changing from completed
    }
    
    await updateProject(project.id, updates);
  };
  
  return (
    <>
      <div
        onClick={() => navigate(`/projects/${project.id}`)}
        className="card group cursor-pointer transition-shadow hover:shadow-lg"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate(`/projects/${project.id}`);
          }
        }}
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
              {project.name}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Started {new Date(project.startDate).toLocaleDateString()}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handleEdit}
              className="tap-target rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Edit project"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="tap-target rounded p-1 hover:bg-red-100 dark:hover:bg-red-900/30"
              aria-label="Delete project"
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>
        
        {/* Status Dropdown */}
        <div className="mb-3">
          <select
            value={project.status}
            onChange={handleStatusChange}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            className="w-auto cursor-pointer rounded-full border-none px-3 py-1 text-xs font-medium transition-colors hover:brightness-110 bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
            aria-label="Change status"
          >
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="frogged">Frogged</option>
          </select>
        </div>
        
        {/* Project Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600 dark:text-neutral-400">Category:</span>
            <span className="capitalize text-neutral-900 dark:text-neutral-50">
              {project.category}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-neutral-600 dark:text-neutral-400">Difficulty:</span>
            <span className="text-neutral-900 dark:text-neutral-50">
              {'⭐'.repeat(project.difficulty)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-neutral-600 dark:text-neutral-400">Counters:</span>
            <span className="text-neutral-900 dark:text-neutral-50">
              {project.counters.length}
            </span>
          </div>
          
          {project.hookSize && (
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Hook:</span>
              <span className="text-neutral-900 dark:text-neutral-50">
                {project.hookSize}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Dialog */}
      <EditProjectDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        project={project}
      />
    </>
  );
}
