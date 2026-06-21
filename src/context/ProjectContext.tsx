import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, SubjectProfile } from '../types/domain';
import { projectsApi } from '../api';
import { useAuth } from './AuthContext';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  currentSubject: SubjectProfile | null;
  loading: boolean;
  setCurrentProject: (project: Project | null) => void;
  refreshProjects: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectState | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentSubject, setCurrentSubject] = useState<SubjectProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshProjects = useCallback(async () => {
    if (!user) { setProjects([]); return; }
    setLoading(true);
    try {
      const list = await projectsApi.list();
      setProjects(list);
      // Auto-select first project if none selected
      if (!currentProject && list.length > 0) {
        setCurrentProject(list[0]);
      }
    } finally {
      setLoading(false);
    }
  }, [user, currentProject]);

  const loadProject = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { project, subject } = await projectsApi.get(id);
      setCurrentProject(project);
      setCurrentSubject(subject);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) refreshProjects();
    else { setProjects([]); setCurrentProject(null); }
  }, [user]);

  return (
    <ProjectContext.Provider value={{
      projects, currentProject, currentSubject, loading,
      setCurrentProject, refreshProjects, loadProject,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject(): ProjectState {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}
