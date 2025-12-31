/**
 * Data Management Utilities
 * 
 * Export, import, and backup functionality
 */

import { useProjectStore } from '@/stores/projectStore';
import { usePatternStore } from '@/stores/patternStore';
import type { Project, Pattern } from '@/types/models';

export interface BackupData {
  version: string;
  timestamp: Date;
  projects: Project[];
  patterns: Pattern[];
}

/**
 * Export all data as JSON
 */
export function exportAllData(): string {
  const projects = useProjectStore.getState().projects;
  const patterns = usePatternStore.getState().patterns;
  
  const backup: BackupData = {
    version: '1.0.0',
    timestamp: new Date(),
    projects,
    patterns,
  };
  
  return JSON.stringify(backup, null, 2);
}

/**
 * Download backup file
 */
export function downloadBackup(): void {
  const data = exportAllData();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `crochet-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import data from backup
 */
export async function importBackup(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const backup: BackupData = JSON.parse(jsonString);
    
    // Validate backup structure
    if (!backup.version || !backup.projects || !backup.patterns) {
      return {
        success: false,
        message: 'Invalid backup file format',
      };
    }
    
    // Import data into stores
    const projectStore = useProjectStore.getState();
    const patternStore = usePatternStore.getState();
    
    // Clear existing data
    projectStore.projects.forEach(p => projectStore.deleteProject(p.id));
    patternStore.patterns.forEach(p => patternStore.deletePattern(p.id));
    
    // Import new data
    backup.projects.forEach(project => {
      projectStore.projects.push(project);
    });
    
    backup.patterns.forEach(pattern => {
      patternStore.patterns.push(pattern);
    });
    
    return {
      success: true,
      message: `Successfully imported ${backup.projects.length} projects and ${backup.patterns.length} patterns`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to import backup: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Export single project
 */
export function exportProject(projectId: string): string | null {
  const projects = useProjectStore.getState().projects;
  const project = projects.find(p => p.id === projectId);
  
  if (!project) return null;
  
  return JSON.stringify(project, null, 2);
}

/**
 * Download single project
 */
export function downloadProject(projectId: string): void {
  const data = exportProject(projectId);
  if (!data) return;
  
  const project = useProjectStore.getState().projects.find(p => p.id === projectId);
  if (!project) return;
  
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${project.name.replace(/\s+/g, '-')}-export.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Clear all data
 */
export function clearAllData(): void {
  const projectStore = useProjectStore.getState();
  const patternStore = usePatternStore.getState();
  
  // Clear all projects
  projectStore.projects.forEach(p => projectStore.deleteProject(p.id));
  
  // Clear all patterns
  patternStore.patterns.forEach(p => patternStore.deletePattern(p.id));
}

/**
 * Get data statistics
 */
export function getDataStats(): {
  projects: number;
  patterns: number;
  totalSize: string;
} {
  const data = exportAllData();
  const sizeInBytes = new Blob([data]).size;
  const sizeInKB = (sizeInBytes / 1024).toFixed(2);
  
  const projects = useProjectStore.getState().projects.length;
  const patterns = usePatternStore.getState().patterns.length;
  
  return {
    projects,
    patterns,
    totalSize: `${sizeInKB} KB`,
  };
}

