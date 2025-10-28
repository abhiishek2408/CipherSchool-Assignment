import React, { useState } from "react";
import { useProject } from "../contexts/ProjectContext";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Dashboard() {
  const { projects, createProject, deleteProject, loadProjects } = useProject();
  const { user, logout } = useAuth();
  const [name, setName] = useState("");

  const create = async (e) => {
    e.preventDefault();
    if (!name) return;
    await createProject({ name });
    setName("");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        height: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e1b4b, #4c1d95)",
        color: "#fff",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          flex: "0 0 320px",
          borderRight: "1px solid rgba(255,255,255,0.2)",
          padding: "20px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(8px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          {/* User Info */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>{user?.name}</h3>
              <small style={{ color: "#a5b4fc" }}>{user?.email}</small>
            </div>
            <button
              onClick={logout}
              style={{
                background: "transparent",
                color: "#fca5a5",
                border: "1px solid #fca5a5",
                borderRadius: 6,
                padding: "6px 12px",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>

          {/* Create Project */}
          <form
            onSubmit={create}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <input
              placeholder="New project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: 6,
                border: "none",
                outline: "none",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
              }}
            />
            <button
              type="submit"
              style={{
                background: "linear-gradient(90deg, #7e22ce, #a855f7)",
                border: "none",
                padding: "10px",
                borderRadius: 6,
                cursor: "pointer",
                color: "#fff",
                fontWeight: "600",
                transition: "0.3s",
              }}
            >
              <i className="fas fa-plus"></i> Create
            </button>
          </form>

          <button
            onClick={loadProjects}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#c4b5fd",
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            <i className="fas fa-sync-alt"></i> Refresh
          </button>

          <hr style={{ margin: "20px 0", borderColor: "rgba(255,255,255,0.1)" }} />

          <h4 style={{ color: "#c4b5fd" }}>
            <i className="fas fa-folder-open"></i> Your Projects
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {projects.length === 0 && (
              <div style={{ color: "#9ca3af" }}>No projects yet</div>
            )}
            {projects.map((p) => (
              <div
                key={p._id}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.08)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  transition: "transform 0.2s, background 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
                }
              >
                <Link
                  to={`/project/${p._id}`}
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: "#a78bfa",
                    textDecoration: "none",
                  }}
                >
                  <i className="fas fa-code"></i> {p.name}
                </Link>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color: "#cbd5e1",
                    minHeight: 16,
                  }}
                >
                  {p.description}
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                  <button
                    style={{
                      flex: 1,
                      background: "linear-gradient(90deg, #6366f1, #7c3aed)",
                      border: "none",
                      color: "#fff",
                      borderRadius: 6,
                      padding: "8px",
                      cursor: "pointer",
                      transition: "0.3s",
                    }}
                    onClick={() =>
                      window.location.assign(`/project/${p._id}`)
                    }
                  >
                    <i className="fas fa-play"></i> Open
                  </button>
                  <button
                    onClick={() => deleteProject(p._id)}
                    style={{
                      flex: 1,
                      background: "rgba(239,68,68,0.2)",
                      color: "#f87171",
                      border: "1px solid rgba(239,68,68,0.5)",
                      borderRadius: 6,
                      padding: "8px",
                      cursor: "pointer",
                      transition: "0.3s",
                    }}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, color: "#818cf8" }}>
          <small>
            <i className="fas fa-code"></i> CipherStudio © 2025
          </small>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            background: "linear-gradient(90deg, #a855f7, #6366f1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome to CipherStudio
        </h1>
        <p style={{ fontSize: 18, color: "#e0e7ff", maxWidth: 500 }}>
          Create, edit, and preview your React projects right in the browser.
          Experience coding freedom anywhere.
        </p>
      </div>
    </div>
  );
}
