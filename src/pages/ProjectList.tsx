/**
 * Project List Page
 * View all projects with filtering and search
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { NewProjectDialog } from '@/components/NewProjectDialog';
import { ProjectCard } from '@/components/ProjectCard';
import type { ProjectStatus } from '@/types/models';

type FilterStatus = 'all' | ProjectStatus;

export default function ProjectList() {
  const projects = useProjectStore((state) => state.projects);
  const navigate = useNavigate();
  
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date');
  
  // Filter projects
  let filteredProjects = projects;
  
  // Apply search
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredProjects = filteredProjects.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }
  
  // Apply status filter
  if (filterStatus !== 'all') {
    filteredProjects = filteredProjects.filter((p) => p.status === filterStatus);
  }
  
  // Apply sort
  filteredProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });
  
  const statusCounts = {
    all: projects.length,
    active: projects.filter((p) => p.status === 'active').length,
    paused: projects.filter((p) => p.status === 'paused').length,
    completed: projects.filter((p) => p.status === 'completed').length,
    planned: projects.filter((p) => p.status === 'planned').length,
    frogged: projects.filter((p) => p.status === 'frogged').length,
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          Projects
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/quick-start')}
            className="btn-outline flex items-center gap-2"
          >
            <Sparkles className="h-5 w-5" />
            Quick Start
          </button>
          <button
            onClick={() => setShowNewProjectDialog(true)}
            className="btn-primary"
          >
            New Project
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary-600 text-white dark:bg-primary-500'
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
              filterStatus === 'active'
                ? 'bg-green-600 text-white dark:bg-green-600'
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
            }`}
          >
            Active ({statusCounts.active})
          </button>
          <button
            onClick={() => setFilterStatus('paused')}
            className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
              filterStatus === 'paused'
                ? 'bg-amber-500 text-white dark:bg-amber-600'
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
            }`}
          >
            Paused ({statusCounts.paused})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
              filterStatus === 'completed'
                ? 'bg-purple-600 text-white dark:bg-purple-500'
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
            }`}
          >
            Completed ({statusCounts.completed})
          </button>
        </div>
        
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-neutral-600 dark:text-neutral-400">
            Sort by:
          </label>
          <select
            id="sort"
            className="input w-auto"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="date">Date (Newest First)</option>
            <option value="name">Name (A-Z)</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>
      
      {/* Project Grid */}
      {filteredProjects.length === 0 ? (
        <div className="card text-center">
          <div className="py-12">
            <div className="mb-4 text-6xl">
              {searchQuery.trim() ? '🔍' : '📁'}
            </div>
            <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
              {searchQuery.trim()
                ? 'No projects found'
                : filterStatus !== 'all'
                ? `No ${filterStatus} projects`
                : 'No projects yet'}
            </h2>
            <p className="mb-6 text-neutral-600 dark:text-neutral-400">
              {searchQuery.trim()
                ? 'Try a different search term'
                : 'Create your first project to start tracking progress.'}
            </p>
            {!searchQuery.trim() && (
              <button
                onClick={() => setShowNewProjectDialog(true)}
                className="btn-primary"
              >
                Create Project
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
      
      {/* New Project Dialog */}
      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
      />
    </div>
  );
}
