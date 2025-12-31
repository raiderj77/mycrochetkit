/**
 * Finished Object Card Component
 * 
 * Display card for completed projects with share options
 */

import { useState } from 'react';
import { Share2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '@/types/models';
import { ShareProjectDialog } from '@/components/ShareProjectDialog';

interface FinishedObjectCardProps {
  project: Project;
}

export function FinishedObjectCard({ project }: FinishedObjectCardProps) {
  const navigate = useNavigate();
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  // Get latest progress photo as the main image
  const mainPhoto = project.progressPhotos && project.progressPhotos.length > 0
    ? project.progressPhotos[project.progressPhotos.length - 1]
    : null;
  
  const completionDate = project.completedDate
    ? new Date(project.completedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';
  
  return (
    <>
      <div className="card group overflow-hidden p-0 transition-all hover:shadow-xl">
        {/* Main Photo */}
        <div className="relative overflow-hidden">
          {mainPhoto ? (
            <img
              src={mainPhoto.url}
              alt={project.name}
              className="h-64 w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30">
              <span className="text-6xl">🧶</span>
            </div>
          )}
          
          {/* Difficulty Badge */}
          <div className="absolute left-2 top-2 rounded-full bg-black/50 px-3 py-1 backdrop-blur-sm">
            <span className="text-sm font-medium text-white">
              {'⭐'.repeat(project.difficulty)}
            </span>
          </div>
          
          {/* Share Button Overlay */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShareDialog(true);
            }}
            className="absolute right-2 top-2 rounded-full bg-primary-600 p-2 opacity-0 transition-opacity hover:bg-primary-700 group-hover:opacity-100"
            aria-label="Share project"
          >
            <Share2 className="h-5 w-5 text-white" />
          </button>
        </div>
        
        {/* Project Info */}
        <div className="p-4">
          <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            {project.name}
          </h3>
          
          <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
            Completed {completionDate}
          </p>
          
          {/* Details Grid */}
          <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-neutral-600 dark:text-neutral-400">Category</p>
              <p className="font-medium capitalize text-neutral-900 dark:text-neutral-50">
                {project.category}
              </p>
            </div>
            {project.hookSize && (
              <div>
                <p className="text-neutral-600 dark:text-neutral-400">Hook Size</p>
                <p className="font-medium text-neutral-900 dark:text-neutral-50">
                  {project.hookSize}
                </p>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/projects/${project.id}`)}
              className="btn-outline flex-1 flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Details
            </button>
            <button
              onClick={() => setShowShareDialog(true)}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </div>
      
      {/* Share Dialog */}
      <ShareProjectDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        project={project}
      />
    </>
  );
}
