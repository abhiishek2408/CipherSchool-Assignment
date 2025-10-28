import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../api/api";

const ProjectContext = createContext();
export const useProject = () => useContext(ProjectContext);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/projects");
      setProjects(data);
    } catch (err) {
      console.error("loadProjects error", err);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async ({ name, description }) => {
    const res = await apiFetch("/projects", {
      method: "POST",
      body: { name, description }
    });
    // add top
    setProjects(prev => [res, ...prev]);
    return res;
  };

  const updateProject = async (id, updates) => {
    const res = await apiFetch(`/projects/${id}`, {
      method: "PUT",
      body: updates
    });
    setProjects(prev => prev.map(p => (p._id === id ? res : p)));
    return res;
  };

  const deleteProject = async (id) => {
    await apiFetch(`/projects/${id}`, { method: "DELETE" });
    setProjects(prev => prev.filter(p => p._id !== id));
  };

  useEffect(() => {
    // load on mount
    loadProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{ projects, loading, loadProjects, createProject, updateProject, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  );
}
