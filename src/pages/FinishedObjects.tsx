/**
 * Finished Objects Gallery Page
 * 
 * Showcase completed projects with stats and achievements
 */

import { useState, useMemo } from 'react';
import { Trophy, Share2, Award, TrendingUp } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { FinishedObjectCard } from '@/components/FinishedObjectCard';

export default function FinishedObjects() {
  const projects = useProjectStore((state) => state.projects);
  const [sortBy, setSortBy] = useState<'date' | 'difficulty'>('date');
  
  // Get only completed projects
  const finishedProjects = projects.filter((p) => p.status === 'completed');
  
  // Calculate stats
  const stats = useMemo(() => {
    const totalProjects = finishedProjects.length;
    const totalProgressPhotos = finishedProjects.reduce(
      (sum, p) => sum + (p.progressPhotos?.length || 0),
      0
    );
    
    // Calculate achievement badges
    const badges = [];
    if (totalProjects >= 1) badges.push({ id: 'first', name: 'First Finish!', icon: '🎉' });
    if (totalProjects >= 5) badges.push({ id: 'five', name: '5 Projects', icon: '⭐' });
    if (totalProjects >= 10) badges.push({ id: 'ten', name: '10 Projects', icon: '🏆' });
    if (totalProjects >= 25) badges.push({ id: 'master', name: 'Master Crafter', icon: '👑' });
    
    return {
      totalProjects,
      totalProgressPhotos,
      badges,
    };
  }, [finishedProjects]);
  
  // Sort projects
  const sortedProjects = useMemo(() => {
    return [...finishedProjects].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.completedDate || a.startDate;
        const dateB = b.completedDate || b.startDate;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      } else {
        return b.difficulty - a.difficulty;
      }
    });
  }, [finishedProjects, sortBy]);
  
  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-neutral-50">
          Finished Objects Gallery
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Celebrate your completed creations! 🎉
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Projects */}
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900/30">
              <Trophy className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Completed</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                {stats.totalProjects}
              </p>
            </div>
          </div>
        </div>
        
        {/* Progress Photos */}
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <Share2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Photos Shared</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                {stats.totalProgressPhotos}
              </p>
            </div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
              <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Badges Earned</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                {stats.badges.length}
              </p>
            </div>
          </div>
        </div>
        
        {/* Streak */}
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Keep Going!</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                🔥
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Achievement Badges */}
      {stats.badges.length > 0 && (
        <div className="card mb-8">
          <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            Achievement Badges
          </h2>
          <div className="flex flex-wrap gap-3">
            {stats.badges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 px-4 py-1.5 dark:from-amber-900/40 dark:to-amber-800/40 border border-amber-200 dark:border-amber-700"
              >
                <span className="text-xl">{badge.icon}</span>
                <span className="font-bold text-amber-900 dark:text-amber-200">
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Sort & Filter */}
      {finishedProjects.length > 0 && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
            Your Finished Projects ({finishedProjects.length})
          </h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'difficulty')}
            className="input md:w-48"
          >
            <option value="date">Sort by Date</option>
            <option value="difficulty">Sort by Difficulty</option>
          </select>
        </div>
      )}
      
      {/* Gallery Grid */}
      {finishedProjects.length === 0 ? (
        <div className="card text-center">
          <div className="py-12">
            <div className="mb-4 text-6xl">🏆</div>
            <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
              No Finished Projects Yet
            </h2>
            <p className="mb-6 text-neutral-600 dark:text-neutral-400">
              Complete your first project to start your gallery!
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              Tip: Mark projects as "Completed" in the Project List to see them here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProjects.map((project) => (
            <FinishedObjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
