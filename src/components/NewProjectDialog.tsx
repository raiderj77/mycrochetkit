/**
 * New Project Dialog Component
 * 
 * Modal dialog for creating new crochet projects
 */

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { usePatternStore } from '@/stores/patternStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import UpgradePrompt from './UpgradePrompt';
import type { ProjectCategory } from '@/types/models';

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
  const addProject = useProjectStore((state) => state.addProject);
  const projects = useProjectStore((state) => state.projects);
  const patterns = usePatternStore((state) => state.patterns);
  const { getProjectLimit, tier } = useSubscriptionStore();
  
  const [formData, setFormData] = useState({
    name: '',
    patternId: '',
    hookSize: '',
    category: 'other' as ProjectCategory,
    difficulty: 3 as 1 | 2 | 3 | 4 | 5,
  });
  
  // Check if user has reached their project limit
  const projectLimit = getProjectLimit();
  const currentCount = projects.length;
  const isAtLimit = currentCount >= projectLimit;
  const currentTier = tier === 'free' ? 'free' : 'pro'; // For UpgradePrompt
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Double-check limit (should never reach here if at limit due to UI)
    if (isAtLimit) {
      alert('You have reached your project limit. Please upgrade to create more projects.');
      return;
    }
    
    if (!formData.name.trim()) {
      alert('Please enter a project name');
      return;
    }
    
    await addProject({
      name: formData.name,
      patternId: formData.patternId || undefined,
      hookSize: formData.hookSize,
      category: formData.category,
      difficulty: formData.difficulty,
      status: 'active',
      yarnsUsed: [],
      counters: [],
      notes: [],
      modifications: [],
      progressPhotos: [],
      timeTracking: {
        totalMinutes: 0,
        sessions: [],
        isActive: false,
        currentSessionStart: null,
      },
      startDate: new Date(),
      tags: [],
      isGift: false,
    });
    
    // Reset form
    setFormData({
      name: '',
      patternId: '',
      hookSize: '',
      category: 'other',
      difficulty: 3,
    });
    
    onOpenChange(false);
  };
  
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          
          {/* Show UpgradePrompt if at limit */}
          {isAtLimit ? (
            <>
              <Dialog.Title className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                Project Limit Reached
              </Dialog.Title>
              
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>You have {currentCount} of {projectLimit} projects</strong>
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  {tier === 'free' && 'Upgrade to Pro for 100 projects!'}
                  {tier === 'pro' && 'Upgrade to Lifetime for unlimited projects!'}
                </p>
              </div>
              
              <UpgradePrompt 
                feature="unlimited_projects" 
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
                New Project
              </Dialog.Title>
              
              {/* Show limit warning when close to limit */}
              {currentCount >= projectLimit * 0.8 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>{projectLimit - currentCount} projects</strong> remaining on your {tier === 'free' ? 'Free' : 'Pro'} plan
                  </p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Project Name */}
                <div>
                  <label htmlFor="project-name" className="label">
                    Project Name *
                  </label>
                  <input
                    id="project-name"
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="My Cozy Blanket"
                    required
                    autoFocus
                  />
                </div>
                
                {/* Pattern Selection */}
                <div>
                  <label htmlFor="pattern" className="label">
                    Pattern (Optional)
                  </label>
                  <select
                    id="pattern"
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
                  <label htmlFor="hook-size" className="label">
                    Hook Size
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
                
                {/* Category */}
                <div>
                  <label htmlFor="category" className="label">
                    Category
                  </label>
                  <select
                    id="category"
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
                  <label htmlFor="difficulty" className="label">
                    Difficulty (1-5)
                  </label>
                  <select
                    id="difficulty"
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
                    Create Project
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
