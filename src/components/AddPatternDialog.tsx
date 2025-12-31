/**
 * Add Pattern Dialog Component
 * 
 * Modal for adding new patterns to library
 */

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Upload, FileText, Loader2 } from 'lucide-react';
import { usePatternStore } from '@/stores/patternStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import UpgradePrompt from './UpgradePrompt';
import { getStorageInstance } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { SkillLevel, PatternSource } from '@/types/models';

interface AddPatternDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPatternDialog({ open, onOpenChange }: AddPatternDialogProps) {
  const addPattern = usePatternStore((state) => state.addPattern);
  const patterns = usePatternStore((state) => state.patterns);
  const { getPatternLimit, tier } = useSubscriptionStore();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    source: '',
    skillLevel: 'intermediate' as SkillLevel,
    category: '',
    hookSize: '',
    yarnWeight: '',
    notes: '',
  });
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (type === 'pdf') {
      setPdfName(file.name);
      setPdfBlob(file);
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const previewUrl = canvas.toDataURL('image/jpeg', 0.6);
          setPhotoPreview(previewUrl);

          canvas.toBlob((blob) => {
            if (blob) setPhotoBlob(blob);
          }, 'image/jpeg', 0.6);
        };
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Check if user has reached their pattern limit
  const patternLimit = getPatternLimit();
  const currentCount = patterns.length;
  const isAtLimit = currentCount >= patternLimit;
  const currentTier = tier === 'free' ? 'free' : 'pro';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Double-check limit
    if (isAtLimit) {
      alert('You have reached your pattern limit. Please upgrade to add more patterns.');
      return;
    }
    
    if (!formData.title.trim()) {
      alert('Please enter a pattern title');
      return;
    }
    
    setIsUploading(true);
    let coverUrl = '';
    let pdfUrl = '';

    try {
      const storage = getStorageInstance();
      if (!storage) throw new Error('Cloud storage not available');

      const patternId = crypto.randomUUID();

      // Upload Cover Image
      if (photoBlob) {
        const photoRef = ref(storage, `patterns/${patternId}/cover.jpg`);
        const photoSnap = await uploadBytes(photoRef, photoBlob);
        coverUrl = await getDownloadURL(photoSnap.ref);
      }

      // Upload PDF
      if (pdfBlob) {
        const pdfRef = ref(storage, `patterns/${patternId}/pattern.pdf`);
        const pdfSnap = await uploadBytes(pdfRef, pdfBlob);
        pdfUrl = await getDownloadURL(pdfSnap.ref);
      }

      await addPattern({
        title: formData.title,
        author: formData.author || 'Unknown',
        source: (formData.source || 'manual') as PatternSource,
        skillLevel: formData.skillLevel,
        category: formData.category,
        hookSize: formData.hookSize,
        yarnWeight: formData.yarnWeight,
        sizes: [],
        abbreviationsUsed: [],
        materials: [],
        parsedSections: [],
        techniques: [],
        notes: formData.notes,
        pdfFile: pdfUrl || undefined,
        coverImage: coverUrl || undefined,
        tags: [],
        isFavorite: false,
      });
      
      // Reset form
      setFormData({
        title: '',
        author: '',
        source: '',
        skillLevel: 'intermediate',
        category: '',
        hookSize: '',
        yarnWeight: '',
        notes: '',
      });
      setPhotoPreview(null);
      setPhotoBlob(null);
      setPdfName(null);
      setPdfBlob(null);
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding pattern:', error);
      alert(error instanceof Error ? error.message : 'Failed to add pattern');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          
          {/* Show UpgradePrompt if at limit */}
          {isAtLimit ? (
            <>
              <Dialog.Title className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                Pattern Limit Reached
              </Dialog.Title>
              
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>You have {currentCount} of {patternLimit} patterns</strong>
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  {tier === 'free' && 'Upgrade to Pro for 50 patterns!'}
                  {tier === 'pro' && 'Upgrade to Lifetime for unlimited patterns!'}
                </p>
              </div>
              
              <UpgradePrompt 
                feature="unlimited_patterns" 
                currentTier={currentTier as 'free' | 'pro'} 
              />
              
              <div className="mt-4 flex justify-end">
                <Dialog.Close asChild>
                  <button className="btn-outline">
                    Close
                  </button>
                </Dialog.Close>
              </div>
            </>
          ) : (
            <>
              <Dialog.Title className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                Add Pattern
              </Dialog.Title>
              
              {/* Show limit warning when close to limit */}
              {currentCount >= patternLimit * 0.8 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>{patternLimit - currentCount} patterns</strong> remaining on your {tier === 'free' ? 'Free' : 'Pro'} plan
                  </p>
                </div>
              )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Cover Image Upload */}
            <div>
              <label className="label">Cover Image (Optional)</label>
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Pattern cover"
                    className="h-40 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setPhotoBlob(null);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 hover:border-primary-500 dark:border-neutral-600">
                  <Upload className="mb-2 h-8 w-8 text-neutral-400" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Click to upload cover image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'image')}
                  />
                </label>
              )}
            </div>
            
            {/* PDF Upload */}
            <div>
              <label className="label">Pattern PDF (Optional)</label>
              {pdfName ? (
                <div className="flex items-center justify-between rounded-lg border border-green-300 bg-green-50 p-3 dark:border-green-700 dark:bg-green-900/20">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-800 dark:text-green-200 truncate max-w-[200px]">
                      {pdfName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPdfName(null);
                      setPdfBlob(null);
                    }}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 p-4 hover:border-primary-500 dark:border-neutral-600">
                  <Upload className="mr-2 h-5 w-5 text-neutral-400" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Click to upload PDF
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'pdf')}
                  />
                </label>
              )}
            </div>
            
            {/* Title */}
            <div>
              <label htmlFor="pattern-title" className="label">
                Pattern Title *
              </label>
              <input
                id="pattern-title"
                type="text"
                className="input"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Cozy Blanket Pattern"
                required
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Author */}
              <div>
                <label htmlFor="author" className="label">
                  Author
                </label>
                <input
                  id="author"
                  type="text"
                  className="input"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="Jane Designer"
                />
              </div>
              
              {/* Source */}
              <div>
                <label htmlFor="source" className="label">
                  Source (Optional)
                </label>
                <input
                  id="source"
                  type="text"
                  className="input"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  placeholder="Ravelry, book, website"
                />
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Skill Level */}
              <div>
                <label htmlFor="skill-level" className="label">
                  Skill Level
                </label>
                <select
                  id="skill-level"
                  className="input"
                  value={formData.skillLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      skillLevel: e.target.value as SkillLevel,
                    })
                  }
                >
                  <option value="beginner">Beginner</option>
                  <option value="easy">Easy</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="label">
                  Category (Optional)
                </label>
                <input
                  id="category"
                  type="text"
                  className="input"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Blanket, Amigurumi, etc."
                />
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Hook Size */}
              <div>
                <label htmlFor="hook-size" className="label">
                  Suggested Hook Size
                </label>
                <input
                  id="hook-size"
                  type="text"
                  className="input"
                  value={formData.hookSize}
                  onChange={(e) =>
                    setFormData({ ...formData, hookSize: e.target.value })
                  }
                  placeholder="H/8 (5mm)"
                />
              </div>
              
              {/* Yarn Weight */}
              <div>
                <label htmlFor="yarn-weight" className="label">
                  Yarn Weight
                </label>
                <input
                  id="yarn-weight"
                  type="text"
                  className="input"
                  value={formData.yarnWeight}
                  onChange={(e) =>
                    setFormData({ ...formData, yarnWeight: e.target.value })
                  }
                  placeholder="Worsted, Bulky, etc."
                />
              </div>
            </div>
            
            {/* Notes */}
            <div>
              <label htmlFor="notes" className="label">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                className="input min-h-[80px]"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Quick notes about this pattern..."
              />
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Dialog.Close asChild>
                <button type="button" className="btn-outline">
                  Cancel
                </button>
              </Dialog.Close>
              <button type="submit" disabled={isUploading} className="btn-primary min-w-[120px]">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    Adding...
                  </>
                ) : (
                  'Add Pattern'
                )}
              </button>
            </div>
          </form>
        </>
      )}
          
          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
