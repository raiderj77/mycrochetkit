/**
 * Edit Project Dialog Component
 * 
 * Modal for editing existing project details
 */

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { usePatternStore } from '@/stores/patternStore';
import type { Project, ProjectCategory, ProjectStatus } from '@/types/models';

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
}

export function EditProjectDialog({ open, onOpenChange, project }: EditProjectDialogProps) {
  const updateProject = useProjectStore((state) => state.updateProject);
  const patterns = usePatternStore((state) => state.patterns);
  
  const [formData, setFormData] = useState({
    name: project.name,
    patternId: project.patternId || '',
    hookSize: project.hookSize,
    category: project.category,
    difficulty: project.difficulty,
    status: project.status,
  });
  
  // Reset form when project changes
  useEffect(() => {
    setFormData({
      name: project.name,
      patternId: project.patternId || '',
      hookSize: project.hookSize,
      category: project.category,
      difficulty: project.difficulty,
      status: project.status,
    });
  }, [project]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a project name');
      return;
    }
    
    await updateProject(project.id, {
      name: formData.name,
      patternId: formData.patternId || undefined,
      hookSize: formData.hookSize,
      category: formData.category,
      difficulty: formData.difficulty,
      status: formData.status,
    });
    
    onOpenChange(false);
  };
  
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Title className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
            Edit Project
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Name */}
            <div>
              <label htmlFor="edit-project-name" className="label">
                Project Name *
              </label>
              <input
                id="edit-project-name"
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                autoFocus
              />
            </div>
            
            {/* Status */}
            <div>
              <label htmlFor="edit-status" className="label">
                Status
              </label>
              <select
                id="edit-status"
                className="input"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as ProjectStatus,
                  })
                }
              >
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="frogged">Frogged (Unraveled)</option>
              </select>
            </div>
            
            {/* Pattern Selection */}
            <div>
              <label htmlFor="edit-pattern" className="label">
                Pattern (Optional)
              </label>
              <select
                id="edit-pattern"
                className="input"
                value={formData.patternId}
                onChange={(e) =>
                  setFormData({ ...formData, patternId: e.target.value })
                }
              >
                <option value="">No pattern / Freehand</option>
                {patterns.map((pattern) => (
                  <option key={pattern.id} value={pattern.id}>
                    {pattern.title}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Hook Size */}
            <div>
              <label htmlFor="edit-hook-size" className="label">
                Hook Size
              </label>
              <input
                id="edit-hook-size"
                type="text"
                className="input"
                value={formData.hookSize}
                onChange={(e) =>
                  setFormData({ ...formData, hookSize: e.target.value })
                }
                placeholder="H/8 (5mm)"
              />
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="edit-category" className="label">
                Category
              </label>
              <select
                id="edit-category"
                className="input"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as ProjectCategory,
                  })
                }
              >
                <option value="amigurumi">Amigurumi</option>
                <option value="wearable">Wearable</option>
                <option value="blanket">Blanket</option>
                <option value="accessory">Accessory</option>
                <option value="home">Home Decor</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* Difficulty */}
            <div>
              <label htmlFor="edit-difficulty" className="label">
                Difficulty (1-5)
              </label>
              <select
                id="edit-difficulty"
                className="input"
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5,
                  })
                }
              >
                <option value="1">1 - Very Easy</option>
                <option value="2">2 - Easy</option>
                <option value="3">3 - Moderate</option>
                <option value="4">4 - Challenging</option>
                <option value="5">5 - Expert</option>
              </select>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Dialog.Close asChild>
                <button type="button" className="btn-outline">
                  Cancel
                </button>
              </Dialog.Close>
              <button type="submit" className="btn-primary">
                Save Changes
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
