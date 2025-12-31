/**
 * Public Project View
 * 
 * Shareable public page for viewing projects without authentication
 */

import { useParams } from 'react-router-dom';
import { ExternalLink, Star } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';

export default function SharedProject() {
  const { id } = useParams<{ id: string }>();
  const projects = useProjectStore((state) => state.projects);
  
  const project = projects.find((p) => p.id === id);
  
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-900 dark:to-neutral-800">
        <div className="card max-w-md text-center">
          <div className="mb-4 text-6xl">🧶</div>
          <h1 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Project Not Found
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            This project may have been removed or the link is incorrect.
          </p>
        </div>
      </div>
    );
  }
  
  const projectPhoto = project.progressPhotos && project.progressPhotos.length > 0
    ? project.progressPhotos[project.progressPhotos.length - 1].url
    : null;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container mx-auto p-6">
        {/* Header with branding */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-primary-600 dark:text-primary-400">
            🧶 My Crochet Kit
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Check out this amazing project!
          </p>
        </div>
        
        {/* Main Project Card */}
        <div className="card mx-auto max-w-3xl overflow-hidden">
          {/* Project Photo */}
          {projectPhoto ? (
            <img
              src={projectPhoto}
              alt={project.name}
              className="-mx-6 -mt-6 mb-6 w-[calc(100%+3rem)] object-cover"
              style={{ maxHeight: '500px' }}
            />
          ) : (
            <div className="-mx-6 -mt-6 mb-6 flex h-96 w-[calc(100%+3rem)] items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600">
              <span className="text-9xl">🧶</span>
            </div>
          )}
          
          {/* Project Details */}
          <div>
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-neutral-50">
              {project.name}
            </h2>
            
            {/* Difficulty */}
            <div className="mb-6 flex items-center gap-2">
              <span className="text-neutral-600 dark:text-neutral-400">Difficulty:</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < project.difficulty
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-300 dark:text-neutral-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Details Grid */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Category</p>
                <p className="font-medium capitalize text-neutral-900 dark:text-neutral-50">
                  {project.category}
                </p>
              </div>
              
              {project.hookSize && (
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Hook Size</p>
                  <p className="font-medium text-neutral-900 dark:text-neutral-50">
                    {project.hookSize}
                  </p>
                </div>
              )}
              

              
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Status</p>
                <p className="font-medium capitalize text-neutral-900 dark:text-neutral-50">
                  {project.status}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Started</p>
                <p className="font-medium text-neutral-900 dark:text-neutral-50">
                  {new Date(project.startDate).toLocaleDateString()}
                </p>
              </div>
              
              {project.completedDate && (
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Completed</p>
                  <p className="font-medium text-neutral-900 dark:text-neutral-50">
                    {new Date(project.completedDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            
            {/* Progress Photos */}
            {project.progressPhotos && project.progressPhotos.length > 1 && (
              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                  Progress Photos ({project.progressPhotos.length})
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {project.progressPhotos.map((photo, index) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={`Progress ${index + 1}`}
                      className="h-32 w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* CTA */}
            <div className="rounded-lg bg-primary-50 p-6 text-center dark:bg-primary-900/20">
              <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                Want to track your own crochet projects?
              </h3>
              <p className="mb-4 text-neutral-600 dark:text-neutral-400">
                My Crochet Kit helps you organize projects, patterns, yarn, and track progress!
              </p>
              <a
                href="/"
                className="btn-primary inline-flex items-center gap-2"
              >
                <ExternalLink className="h-5 w-5" />
                Try My Crochet Kit for Free
              </a>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-500">
          Made with 🧶 using My Crochet Kit
        </div>
      </div>
    </div>
  );
}
