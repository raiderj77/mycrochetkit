/**
 * Add Progress Photo Dialog
 * 
 * Upload progress photos with optional notes
 */

import { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useProjectStore } from '@/stores/projectStore';
import { getStorageInstance } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface AddProgressPhotoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export function AddProgressPhotoDialog({
  open,
  onOpenChange,
  projectId,
}: AddProgressPhotoDialogProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const projects = useProjectStore((state) => state.projects);
  const updateProject = useProjectStore((state) => state.updateProject);
  
  const project = projects.find((p) => p.id === projectId);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Compress and convert to base64 for preview
    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Resize to max 800x800 while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        const maxSize = 800;
        
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Set preview
        const previewUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPhotoPreview(previewUrl);

        // Convert to blob for upload
        canvas.toBlob((blob) => {
          if (blob) setPhotoBlob(blob);
        }, 'image/jpeg', 0.7);
      };
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoBlob || !project) return;
    
    setIsLoading(true);
    
    try {
      const storage = getStorageInstance();
      if (!storage) {
        throw new Error('Cloud storage is not available. Please check your connection.');
      }

      const photoId = crypto.randomUUID();
      const storageRef = ref(storage, `projects/${projectId}/progress/${photoId}.jpg`);
      
      // Upload blob to Firebase Storage
      const snapshot = await uploadBytes(storageRef, photoBlob);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      const newPhoto = {
        id: photoId,
        url: downloadUrl,
        timestamp: new Date(),
        caption: note.trim() || undefined,
      };
      
      await updateProject(projectId, {
        progressPhotos: [...(project.progressPhotos || []), newPhoto],
      });
      
      setPhotoPreview(null);
      setPhotoBlob(null);
      setNote('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload photo');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    setPhotoPreview(null);
    setPhotoBlob(null);
    setNote('');
    onOpenChange(false);
  };
  
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-neutral-800">
          <Dialog.Title className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Add Progress Photo
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo Upload */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Photo *
              </label>
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Progress preview"
                    className="w-full rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setPhotoBlob(null);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 hover:border-primary-400 dark:border-neutral-600">
                  <Camera className="mb-2 h-12 w-12 text-neutral-400" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Click to upload photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            {/* Note */}
            <div>
              <label
                htmlFor="note"
                className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Note (optional)
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What progress did you make?"
                rows={3}
                className="input-field"
              />
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="btn-outline flex-1"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!photoBlob || isLoading}
                className="btn-primary flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Photo'
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
