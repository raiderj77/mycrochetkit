/**
 * Add Yarn Dialog Component
 * 
 * Modal for adding new yarn to stash
 */

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Upload, Loader2 } from 'lucide-react';
import { useStashStore } from '@/stores/stashStore';
import { getStorageInstance } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { YarnWeight } from '@/types/models';

interface AddYarnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddYarnDialog({ open, onOpenChange }: AddYarnDialogProps) {
  const addYarn = useStashStore((state) => state.addYarn);
  
  const [formData, setFormData] = useState({
    brand: '',
    line: '',
    colorway: '',
    weight: 'worsted' as YarnWeight,
    fiber: '',
    yardagePerSkein: '',
    gramsPerSkein: '',
    skeinsOwned: '',
    storageLocation: '',
    dyeLot: '',
    purchaseDate: '',
    purchasePrice: '',
    purchaseLocation: '',
    careInstructions: '',
    notes: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Compress and convert to base64 for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
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
    
    if (!formData.brand.trim() || !formData.colorway.trim()) {
      alert('Please enter brand and colorway');
      return;
    }
    
    setIsUploading(true);
    let photoUrl = '';

    try {
      if (photoBlob) {
        const storage = getStorageInstance();
        if (!storage) throw new Error('Cloud storage not available');
        
        const photoId = crypto.randomUUID();
        const storageRef = ref(storage, `stash/yarn/${photoId}.jpg`);
        const snapshot = await uploadBytes(storageRef, photoBlob);
        photoUrl = await getDownloadURL(snapshot.ref);
      }

      const yardagePerSkein = parseFloat(formData.yardagePerSkein) || 0;
      const skeinsOwned = parseFloat(formData.skeinsOwned) || 1;
      
      await addYarn({
        brand: formData.brand,
        line: formData.line,
        colorway: formData.colorway,
        weight: formData.weight,
        fiber: formData.fiber || 'Unknown',
        yardagePerSkein,
        gramsPerSkein: parseFloat(formData.gramsPerSkein) || 0,
        skeinsOwned,
        yardageRemaining: yardagePerSkein * skeinsOwned,
        storageLocation: formData.storageLocation,
        dyeLot: formData.dyeLot,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : undefined,
        purchasePrice: parseFloat(formData.purchasePrice) || undefined,
        purchaseLocation: formData.purchaseLocation,
        careInstructions: formData.careInstructions,
        photo: photoUrl || undefined,
        notes: formData.notes,
        tags: [],
        isDiscontinued: false,
      });
      
      // Reset form
      setFormData({
        brand: '',
        line: '',
        colorway: '',
        weight: 'worsted',
        fiber: '',
        yardagePerSkein: '',
        gramsPerSkein: '',
        skeinsOwned: '',
        storageLocation: '',
        dyeLot: '',
        purchaseDate: '',
        purchasePrice: '',
        purchaseLocation: '',
        careInstructions: '',
        notes: '',
      });
      setPhotoPreview(null);
      setPhotoBlob(null);
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding yarn:', error);
      alert(error instanceof Error ? error.message : 'Failed to add yarn');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Title className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
            Add Yarn to Stash
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo Upload */}
            <div>
              <label className="label">Photo (Optional)</label>
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Yarn preview"
                    className="h-48 w-full rounded-lg object-cover"
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
                <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 hover:border-primary-500 dark:border-neutral-600">
                  <Upload className="mb-2 h-8 w-8 text-neutral-400" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Click to upload photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Brand */}
              <div>
                <label htmlFor="brand" className="label">
                  Brand *
                </label>
                <input
                  id="brand"
                  type="text"
                  className="input"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  placeholder="Red Heart"
                  required
                />
              </div>
              
              {/* Line */}
              <div>
                <label htmlFor="line" className="label">
                  Line (Optional)
                </label>
                <input
                  id="line"
                  type="text"
                  className="input"
                  value={formData.line}
                  onChange={(e) =>
                    setFormData({ ...formData, line: e.target.value })
                  }
                  placeholder="Super Saver"
                />
              </div>
            </div>
            
            {/* Colorway */}
            <div>
              <label htmlFor="colorway" className="label">
                Colorway *
              </label>
              <input
                id="colorway"
                type="text"
                className="input"
                value={formData.colorway}
                onChange={(e) =>
                  setFormData({ ...formData, colorway: e.target.value })
                }
                placeholder="Cherry Red"
                required
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Weight */}
              <div>
                <label htmlFor="weight" className="label">
                  Weight
                </label>
                <select
                  id="weight"
                  className="input"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weight: e.target.value as YarnWeight,
                    })
                  }
                >
                  <option value="lace">Lace</option>
                  <option value="fingering">Fingering</option>
                  <option value="sport">Sport</option>
                  <option value="dk">DK</option>
                  <option value="worsted">Worsted</option>
                  <option value="aran">Aran</option>
                  <option value="bulky">Bulky</option>
                  <option value="super-bulky">Super Bulky</option>
                  <option value="jumbo">Jumbo</option>
                </select>
              </div>
              
              {/* Fiber */}
              <div>
                <label htmlFor="fiber" className="label">
                  Fiber Content
                </label>
                <input
                  id="fiber"
                  type="text"
                  className="input"
                  value={formData.fiber}
                  onChange={(e) =>
                    setFormData({ ...formData, fiber: e.target.value })
                  }
                  placeholder="100% Acrylic"
                />
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Yardage */}
              <div>
                <label htmlFor="yardage" className="label">
                  Yards/Skein
                </label>
                <input
                  id="yardage"
                  type="number"
                  min="0"
                  step="0.1"
                  className="input"
                  value={formData.yardagePerSkein}
                  onChange={(e) =>
                    setFormData({ ...formData, yardagePerSkein: e.target.value })
                  }
                  placeholder="364"
                />
              </div>
              
              {/* Grams */}
              <div>
                <label htmlFor="grams" className="label">
                  Grams/Skein
                </label>
                <input
                  id="grams"
                  type="number"
                  min="0"
                  step="0.1"
                  className="input"
                  value={formData.gramsPerSkein}
                  onChange={(e) =>
                    setFormData({ ...formData, gramsPerSkein: e.target.value })
                  }
                  placeholder="198"
                />
              </div>
              
              {/* Skeins */}
              <div>
                <label htmlFor="skeins" className="label">
                  Skeins Owned
                </label>
                <input
                  id="skeins"
                  type="number"
                  min="0"
                  step="0.1"
                  className="input"
                  value={formData.skeinsOwned}
                  onChange={(e) =>
                    setFormData({ ...formData, skeinsOwned: e.target.value })
                  }
                  placeholder="3"
                />
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Dye Lot */}
              <div>
                <label htmlFor="dyeLot" className="label">
                  Dye Lot
                </label>
                <input
                  id="dyeLot"
                  type="text"
                  className="input"
                  value={formData.dyeLot}
                  onChange={(e) =>
                    setFormData({ ...formData, dyeLot: e.target.value })
                  }
                  placeholder="A123"
                />
              </div>
              
              {/* Storage Location */}
              <div>
                <label htmlFor="storage" className="label">
                  Storage Location
                </label>
                <input
                  id="storage"
                  type="text"
                  className="input"
                  value={formData.storageLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, storageLocation: e.target.value })
                  }
                  placeholder="Bin 3, Shelf 2"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Purchase Date */}
              <div>
                <label htmlFor="purchaseDate" className="label">
                  Purchase Date
                </label>
                <input
                  id="purchaseDate"
                  type="date"
                  className="input"
                  value={formData.purchaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseDate: e.target.value })
                  }
                />
              </div>
              
              {/* Purchase Price */}
              <div>
                <label htmlFor="purchasePrice" className="label">
                  Price Paid ($)
                </label>
                <input
                  id="purchasePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  className="input"
                  value={formData.purchasePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, purchasePrice: e.target.value })
                  }
                  placeholder="5.99"
                />
              </div>
              
              {/* Purchase Location */}
              <div>
                <label htmlFor="purchaseLocation" className="label">
                  Store/Source
                </label>
                <input
                  id="purchaseLocation"
                  type="text"
                  className="input"
                  value={formData.purchaseLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseLocation: e.target.value })
                  }
                  placeholder="Joann / Etsy"
                />
              </div>
            </div>
            
            {/* Care Instructions */}
            <div>
              <label htmlFor="care" className="label">
                Care Instructions (Optional)
              </label>
              <input
                id="care"
                type="text"
                className="input"
                value={formData.careInstructions}
                onChange={(e) =>
                  setFormData({ ...formData, careInstructions: e.target.value })
                }
                placeholder="Machine wash cold, lay flat to dry"
              />
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
                placeholder="Soft and great for blankets..."
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
                  'Add to Stash'
                )}
              </button>
            </div>
          </form>
          
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
