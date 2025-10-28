import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProjectProvider } from "./contexts/ProjectContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectEditor from "./pages/ProjectEditor";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectEditor />} />
          </Route>

          <Route path="*" element={<div style={{padding:40}}>404 — not found</div>} />
        </Routes>
      </ProjectProvider>
    </AuthProvider>
  );
}
