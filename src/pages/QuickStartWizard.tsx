/**
 * Quick Start Project Wizard
 * 
 * Guided project creation with templates
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { projectTemplates, type ProjectTemplate } from '@/utils/projectTemplates';

export default function QuickStartWizard() {
  const navigate = useNavigate();
  const addProject = useProjectStore((state) => state.addProject);
  
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [projectName, setProjectName] = useState('');
  const [customizeCounters, setCustomizeCounters] = useState(false);
  
  const handleTemplateSelect = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
    setProjectName(template.name);
    setStep(2);
  };
  
  const handleCreateProject = async () => {
    if (!selectedTemplate) return;
    
    await addProject({
      name: projectName,
      category: selectedTemplate.category as 'amigurumi' | 'wearable' | 'blanket' | 'accessory' | 'home' | 'other',
      status: 'planned',
      hookSize: selectedTemplate.hookSize,
      difficulty: selectedTemplate.difficulty,
      tags: selectedTemplate.tags,
      startDate: new Date(),
      notes: [
        {
          id: Date.now().toString(),
          text: selectedTemplate.notes,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      counters: customizeCounters 
        ? [] 
        : selectedTemplate.defaultCounters.map((c, i) => ({
            ...c,
            id: `counter-${i}`,
            current: 0,
            lastModified: new Date(),
            history: [],
            reminders: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
      progressPhotos: [],
      yarnsUsed: [],
      modifications: [],
      timeTracking: {
        totalMinutes: 0,
        sessions: [],
        isActive: false,
        currentSessionStart: null,
      },
      isGift: false,
    });
    
    // Get the most recently added project (last in array)
    const projects = useProjectStore.getState().projects;
    const newProject = projects[projects.length - 1];
    if (newProject) {
      navigate(`/projects/${newProject.id}`);
    }
  };
  
  const categories = [
    { id: 'blanket', name: 'Blankets & Afghans', emoji: '🛏️' },
    { id: 'scarf', name: 'Scarves & Shawls', emoji: '🧣' },
    { id: 'hat', name: 'Hats & Beanies', emoji: '🧢' },
    { id: 'amigurumi', name: 'Amigurumi & Toys', emoji: '🧸' },
    { id: 'bag', name: 'Bags & Baskets', emoji: '👜' },
  ];
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary-600" />
          Quick Start Wizard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Get started with a project template in minutes
        </p>
      </div>
      
      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-colors ${
                step >= s
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-700'
              }`}
            >
              {step > s ? <Check className="h-5 w-5" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`h-1 w-16 transition-colors ${
                  step > s ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Step 1: Choose Template */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold">Choose a Template</h2>
            <p className="text-neutral-600">
              Select a project type to get started with pre-configured settings
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="card cursor-pointer text-left transition-all hover:shadow-lg hover:scale-105"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-lg font-bold">{template.name}</h3>
                  <span className="text-2xl">
                    {categories.find(c => c.id === template.category)?.emoji}
                  </span>
                </div>
                
                <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-full bg-primary-100 px-2 py-1 dark:bg-primary-900/30">
                    {'⭐'.repeat(template.difficulty)} {['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'][template.difficulty - 1]}
                  </span>
                  <span className="text-neutral-500">{template.estimatedTime}</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/projects')}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Step 2: Customize */}
      {step === 2 && selectedTemplate && (
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold">Customize Your Project</h2>
            <p className="text-neutral-600">Review and adjust the details</p>
          </div>
          
          <div className="card">
            <div className="mb-4">
              <label className="mb-2 block font-medium">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="input-field"
                placeholder="My Amazing Project"
              />
            </div>
            
            <div className="mb-4 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800">
              <h3 className="mb-2 font-semibold">What's Included:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>{selectedTemplate.defaultCounters.length} pre-configured counters</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>Materials checklist ({selectedTemplate.materials.length} items)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>{selectedTemplate.milestones.length} milestone markers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>Pattern notes and recommendations</span>
                </li>
              </ul>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={customizeCounters}
                  onChange={(e) => setCustomizeCounters(e.target.checked)}
                  className="h-5 w-5"
                />
                <span>Start with empty counters (I'll add my own)</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="btn-outline flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="btn-primary flex items-center gap-2"
            >
              Review
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: Review */}
      {step === 3 && selectedTemplate && (
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold">Review & Create</h2>
            <p className="text-neutral-600">Everything looks good?</p>
          </div>
          
          <div className="card">
            <h3 className="mb-4 text-xl font-bold">{projectName}</h3>
            
            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-neutral-600">Category</p>
                <p className="font-medium capitalize">{selectedTemplate.category}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Difficulty</p>
                <p className="font-medium">{'⭐'.repeat(selectedTemplate.difficulty)}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Hook Size</p>
                <p className="font-medium">{selectedTemplate.hookSize}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Est. Time</p>
                <p className="font-medium">{selectedTemplate.estimatedTime}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-neutral-600">Materials Needed:</p>
              <ul className="list-inside list-disc space-y-1 text-sm">
                {selectedTemplate.materials.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-neutral-600">Milestones:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.milestones.map((milestone, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-primary-100 px-3 py-1 text-xs dark:bg-primary-900/30"
                  >
                    {milestone}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="btn-outline flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <button
              onClick={handleCreateProject}
              className="btn-primary flex items-center gap-2"
            >
              <Check className="h-5 w-5" />
              Create Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
