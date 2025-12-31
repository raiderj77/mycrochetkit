/**
 * Add Counter Dialog Component
 * 
 * Modal for adding new counters to a project
 */

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useCounterStore } from '@/stores/counterStore';
import type { CounterType } from '@/types/models';

interface AddCounterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export function AddCounterDialog({ open, onOpenChange, projectId }: AddCounterDialogProps) {
  const addCounter = useCounterStore((state) => state.addCounter);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'row' as CounterType,
    target: '',
    colorCode: '#7C3AED',
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a counter name');
      return;
    }
    
    await addCounter(projectId, {
      name: formData.name,
      type: formData.type,
      target: formData.target ? parseInt(formData.target) : undefined,
      colorCode: formData.colorCode,
      current: 0,
      history: [],
      reminders: [],
    });
    
    // Reset form
    setFormData({
      name: '',
      type: 'row',
      target: '',
      colorCode: '#7C3AED',
    });
    
    onOpenChange(false);
  };
  
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[400px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Title className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
            Add Counter
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Counter Name */}
            <div>
              <label htmlFor="counter-name" className="label">
                Counter Name *
              </label>
              <input
                id="counter-name"
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Row Counter"
                required
                autoFocus
              />
            </div>
            
            {/* Counter Type */}
            <div>
              <label htmlFor="counter-type" className="label">
                Type
              </label>
              <select
                id="counter-type"
                className="input"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as CounterType,
                  })
                }
              >
                <option value="row">Row Counter</option>
                <option value="stitch">Stitch Counter</option>
                <option value="repeat">Repeat Counter</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            {/* Target (Optional) */}
            <div>
              <label htmlFor="target" className="label">
                Target (Optional)
              </label>
              <input
                id="target"
                type="number"
                min="1"
                className="input"
                value={formData.target}
                onChange={(e) =>
                  setFormData({ ...formData, target: e.target.value })
                }
                placeholder="e.g., 50 rows"
              />
            </div>
            
            {/* Color Code */}
            <div>
              <label htmlFor="color" className="label">
                Color
              </label>
              <div className="flex gap-2">
                <input
                  id="color"
                  type="color"
                  className="h-10 w-20 rounded border border-neutral-300 dark:border-neutral-600"
                  value={formData.colorCode}
                  onChange={(e) =>
                    setFormData({ ...formData, colorCode: e.target.value })
                  }
                />
                <span className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                  {formData.colorCode}
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Dialog.Close asChild>
                <button type="button" className="btn-outline">
                  Cancel
                </button>
              </Dialog.Close>
              <button type="submit" className="btn-primary">
                Add Counter
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
