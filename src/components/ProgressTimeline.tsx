/**
 * Progress Timeline Component
 * 
 * Visual timeline of progress photos with notes
 */

import { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import type { Photo } from '@/types/models';

interface ProgressTimelineProps {
  photos: Photo[];
  onDelete: (photoId: string) => void;
}

export function ProgressTimeline({ photos, onDelete }: ProgressTimelineProps) {
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  
  if (photos.length === 0) {
    return (
      <div className="card text-center">
        <div className="py-12">
          <div className="mb-4 text-6xl">📸</div>
          <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            No Progress Photos Yet
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Document your journey by adding progress photos!
          </p>
        </div>
      </div>
    );
  }
  
  // Sort photos by date (newest first)
  const sortedPhotos = [...photos].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const handleDelete = (photoId: string) => {
    const confirmed = confirm('Delete this progress photo? This cannot be undone.');
    if (confirmed) {
      onDelete(photoId);
    }
  };
  
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedPhotos.map((photo) => (
          <div
            key={photo.id}
            className="card group overflow-hidden p-0"
          >
            {/* Photo */}
            <div
              className="relative cursor-pointer overflow-hidden"
              onClick={() => setLightboxPhoto(photo)}
            >
              <img
                src={photo.url}
                alt={`Progress from ${new Date(photo.timestamp).toLocaleDateString()}`}
                className="h-64 w-full object-cover transition-transform group-hover:scale-105"
              />
              
              {/* Delete Button (on hover) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(photo.id);
                }}
                className="absolute right-2 top-2 rounded-full bg-red-600 p-2 opacity-0 transition-opacity hover:bg-red-700 group-hover:opacity-100"
                aria-label="Delete photo"
              >
                <Trash2 className="h-4 w-4 text-white" />
              </button>
            </div>
            
            {/* Info */}
            <div className="p-4">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                {new Date(photo.timestamp).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {photo.caption && (
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {photo.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="max-h-full max-w-4xl">
            <img
              src={lightboxPhoto.url}
              alt={`Progress from ${new Date(lightboxPhoto.timestamp).toLocaleDateString()}`}
              className="max-h-[90vh] w-full rounded-lg object-contain"
            />
            {lightboxPhoto.caption && (
              <div className="mt-4 rounded-lg bg-white/10 p-4 text-center backdrop-blur">
                <p className="text-sm text-white">{lightboxPhoto.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
