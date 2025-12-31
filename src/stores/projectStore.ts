/**
 * Project Store - Zustand State Management
 * 
 * Manages all project-related state with auto-sync to IndexedDB
 */

import { create } from 'zustand';
import { db } from '@/db/schema';
import type { Project, ProjectStatus, UserNote } from '@/types/models';

interface ProjectStore {
  // State
  projects: Project[];
  activeProjectId: string | null;
  isLoading: boolean;
  
  // CRUD Operations
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Active Project Management
  setActiveProject: (id: string | null) => void;
  getActiveProject: () => Project | undefined;
  
  // Queries
  getProjectsByStatus: (status: ProjectStatus) => Project[];
  searchProjects: (query: string) => Project[];
  
  // Time Tracking
  startTimer: (projectId: string) => Promise<void>;
  pauseTimer: (projectId: string) => Promise<void>;
  stopTimer: (projectId: string) => Promise<void>;
  
  // Data Loading
  loadProjects: () => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // Initial State
  projects: [],
  activeProjectId: null,
  isLoading: false,
  
  // Add New Project
  addProject: async (projectData) => {
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: projectData.status || 'planned',
      category: projectData.category || 'other',
      counters: projectData.counters || [],
      modifications: projectData.modifications || [],
      progressPhotos: projectData.progressPhotos || [],
      notes: projectData.notes || [],
      tags: projectData.tags || [],
      timeTracking: projectData.timeTracking || {
        totalMinutes: 0,
        sessions: [],
        isActive: false,
        currentSessionStart: null,
      },
    };
    
    // Save to IndexedDB
    await db.projects.add(newProject);
    
    // Update state
    set((state) => ({
      projects: [...state.projects, newProject],
    }));
  },
  
  // Update Existing Project
  updateProject: async (id, updates) => {
    const updatedProject = {
      ...updates,
      id,
      updatedAt: new Date(),
    };
    
    // Update in IndexedDB
    await db.projects.update(id, updatedProject);
    
    // Reload all projects to refresh UI
    await get().loadProjects();
  },
  
  // Delete Project
  deleteProject: async (id) => {
    // Delete from IndexedDB
    await db.projects.delete(id);
    
    // Reload all projects to refresh UI
    await get().loadProjects();
  },
  
  // Set Active Project
  setActiveProject: (id) => {
    set({ activeProjectId: id });
    if (id) {
      localStorage.setItem('activeProjectId', id);
    } else {
      localStorage.removeItem('activeProjectId');
    }
  },
  
  // Get Active Project
  getActiveProject: () => {
    const { projects, activeProjectId } = get();
    return projects.find((p) => p.id === activeProjectId);
  },
  
  // Get Projects by Status
  getProjectsByStatus: (status) => {
    const { projects } = get();
    return projects.filter((p) => p.status === status);
  },
  
  // Search Projects
  searchProjects: (query) => {
    const { projects } = get();
    const lowerQuery = query.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.notes.some((note: UserNote) => note.text.toLowerCase().includes(lowerQuery)) ||
        p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },
  
  // Start Timer
  startTimer: async (projectId) => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;

    const now = Date.now();
    
    await get().updateProject(projectId, {
      timeTracking: {
        ...project.timeTracking,
        isActive: true,
        currentSessionStart: now,
      },
      lastWorkedOn: new Date(),
    });
  },
  
  // Pause Timer (saves session and stops timer)
  pauseTimer: async (projectId) => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project || !project.timeTracking.isActive || !project.timeTracking.currentSessionStart) {
      return;
    }

    const now = Date.now();
    const sessionDuration = Math.floor((now - project.timeTracking.currentSessionStart) / 1000 / 60); // minutes
    
    const newSession: import('@/types/models').TimeSession = {
      id: crypto.randomUUID(),
      startTime: new Date(project.timeTracking.currentSessionStart),
      endTime: new Date(now),
      durationMinutes: sessionDuration,
    };

    await get().updateProject(projectId, {
      timeTracking: {
        ...project.timeTracking,
        totalMinutes: project.timeTracking.totalMinutes + sessionDuration,
        sessions: [...project.timeTracking.sessions, newSession],
        isActive: false,
        currentSessionStart: null,
      },
      lastWorkedOn: new Date(),
    });
  },
  
  // Stop Timer (alias for pause)
  stopTimer: async (projectId) => {
    await get().pauseTimer(projectId);
  },
  
  // Load Projects from IndexedDB
  loadProjects: async () => {
    set({ isLoading: true });
    
    try {
      const projects = await db.projects.toArray();
      const activeProjectId = localStorage.getItem('activeProjectId');
      
      set({
        projects,
        activeProjectId,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load projects:', error);
      set({ isLoading: false });
    }
  },
}));

// Expose store for E2E testing
if (import.meta.env.DEV || import.meta.env.VITE_IS_PLAYWRIGHT === 'true') {
  (window as any).__PROJECT_STORE__ = useProjectStore;
}
