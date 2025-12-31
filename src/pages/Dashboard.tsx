/**
 * Dashboard Page
 * Main overview for logged-in users
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/projectStore';
import { usePatternStore } from '@/stores/patternStore';
import { NewProjectDialog } from '@/components/NewProjectDialog';
import { ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const projects = useProjectStore((state) => state.projects);
  const patterns = usePatternStore((state) => state.patterns);
  
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  
  const activeProjects = projects.filter((p) => p.status === 'active');
  const completedProjects = projects.filter((p) => p.status === 'completed');
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Welcome Back! 🧶
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {activeProjects.length} active • {completedProjects.length} completed
          </p>
        </div>
        <button
          onClick={() => setShowNewProjectDialog(true)}
          className="btn-primary"
        >
          New Project
        </button>
      </div>
      
      {/* Quick Stats */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Active Projects
          </h3>
          <p className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-neutral-50">
            {activeProjects.length}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Completed
          </h3>
          <p className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-neutral-50">
            {completedProjects.length}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Total Projects
          </h3>
          <p className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-neutral-50">
            {projects.length}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Patterns Saved
          </h3>
          <p className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-neutral-50">
            {patterns.length}
          </p>
        </div>
      </div>
      
      {/* Empty State or Active Projects */}
      {projects.length === 0 ? (
        <div className="card text-center">
          <div className="py-12">
            <div className="mb-4 text-6xl">🧶</div>
            <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
              Welcome to My Crochet Kit!
            </h2>
            <p className="mb-6 text-neutral-600 dark:text-neutral-400">
              Start your first project to begin tracking your crochet journey.
            </p>
            <button
              onClick={() => setShowNewProjectDialog(true)}
              className="btn-primary"
            >
              Start New Project
            </button>
          </div>
        </div>
      ) : (
        activeProjects.length > 0 && (
          <div className="card mb-6">
            <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
              Continue Working
            </h2>
            <div className="space-y-3">
              {activeProjects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                >
                  <div>
                    <h3 className="font-medium text-neutral-900 dark:text-neutral-50">
                      {project.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {project.counters.length} counter{project.counters.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary-600" />
                </div>
              ))}
            </div>
          </div>
        )
      )}
      
      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
      />
    </div>
  );
}
