import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import Editor from "@monaco-editor/react";
import { SandpackProvider, SandpackLayout, SandpackPreview } from "@codesandbox/sandpack-react";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function ProjectEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const [project, setProject] = useState(null);
  const [filesMap, setFilesMap] = useState({});
  const [currentFile, setCurrentFile] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch(`/projects/${id}`);
      setProject(data);

      const map = {};
      (data.files || []).forEach((f) => {
        const path = f.name.startsWith("/") ? f.name : `/${f.name}`;
        map[path] = {
          code: f.content || "",
          language: f.language || "javascript",
          fileId: f._id,
        };
      });
      setFilesMap(map);
      setCurrentFile(Object.keys(map)[0] || "");
    } catch (err) {
      console.error(err);
      alert("Failed to load project");
      nav("/dashboard");
    }
  }, [id, nav]);

  useEffect(() => {
    load();
  }, [load]);

  const handleEditorChange = (val) => {
    setFilesMap((prev) => ({
      ...prev,
      [currentFile]: { ...prev[currentFile], code: val },
    }));
  };

  const saveProject = async () => {
    setSaving(true);
    try {
      const filesArray = Object.entries(filesMap).map(([path, info]) => {
        const name = path.startsWith("/") ? path.slice(1) : path;
        return {
          _id: info.fileId,
          name,
          content: info.code,
          language: info.language,
        };
      });
      const res = await apiFetch(`/projects/${id}`, {
        method: "PUT",
        body: { files: filesArray },
      });
      setProject(res);
      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const addFile = async () => {
    const fname = window.prompt("Enter file path (e.g. src/NewComp.jsx):");
    if (!fname) return;
    try {
      const res = await apiFetch(`/projects/${id}/files`, {
        method: "POST",
        body: {
          file: {
            name: fname,
            content: "// new file",
            language: "javascript",
          },
        },
      });
      const map = { ...filesMap };
      const fileObj = res.files[res.files.length - 1];
      const path = fileObj.name.startsWith("/") ? fileObj.name : `/${fileObj.name}`;
      map[path] = {
        code: fileObj.content,
        language: fileObj.language,
        fileId: fileObj._id,
      };
      setFilesMap(map);
      setCurrentFile(path);
    } catch (err) {
      console.error(err);
      alert("Add file failed");
    }
  };

  const deleteFile = async (path) => {
    const info = filesMap[path];
    if (!info) return;
    const confirmed = window.confirm("Delete this file?");
    if (!confirmed) return;
    try {
      await apiFetch(`/projects/${id}/files/${info.fileId}`, { method: "DELETE" });
      const updated = { ...filesMap };
      delete updated[path];
      setFilesMap(updated);
      const remaining = Object.keys(updated);
      setCurrentFile(remaining[0] || "");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (!project) return <div style={{ padding: 20 }}>Loading project…</div>;

  const sandpackFiles = {};
  Object.entries(filesMap).forEach(([path, info]) => {
    const key = path.startsWith("/") ? path.slice(1) : path;
    sandpackFiles[key] = info.code;
  });

  const customSetup = {
    entry: Object.keys(sandpackFiles)[0] || "src/index.jsx",
    dependencies: {
      react: "latest",
      "react-dom": "latest",
    },
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#111", color: "#fff" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 260,
          background: "#1a1a1d",
          borderRight: "1px solid #333",
          padding: 16,
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div>
            <Link
              to="/dashboard"
              style={{ color: "#a21caf", textDecoration: "none", fontWeight: 600 }}
            >
              <i className="fas fa-arrow-left"></i> Back
            </Link>
            <h3 style={{ margin: "10px 0", fontSize: "1.1rem", color: "#e0e0e0" }}>
              <i className="fas fa-folder-open"></i> {project.name}
            </h3>
          </div>
          <button
            onClick={saveProject}
            disabled={saving}
            style={{
              background: "#a21caf",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "6px 10px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <i className="fas fa-save"></i> {saving ? "Saving..." : "Save"}
          </button>
        </div>

        <button
          onClick={addFile}
          style={{
            width: "100%",
            background: "transparent",
            color: "#a21caf",
            border: "1px dashed #a21caf",
            borderRadius: 6,
            padding: "8px 10px",
            marginBottom: 12,
            cursor: "pointer",
          }}
        >
          <i className="fas fa-plus"></i> Add File
        </button>

        <div style={{ borderTop: "1px solid #333", paddingTop: 10 }}>
          {Object.keys(filesMap).map((path) => (
            <div
              key={path}
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                marginBottom: 6,
                background: path === currentFile ? "#a21caf33" : "transparent",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onClick={() => setCurrentFile(path)}
            >
              <span style={{ fontWeight: 500 }}>
                <i className="fas fa-file-code"></i> {path}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFile(path);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff4d4d",
                  cursor: "pointer",
                }}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor + Preview */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ flex: "0 0 50%", minHeight: 0 }}>
          {currentFile ? (
            <Editor
              height="100%"
              language="javascript"
              theme="vs-dark"
              value={filesMap[currentFile]?.code}
              onChange={handleEditorChange}
              options={{ automaticLayout: true }}
            />
          ) : (
            <div style={{ padding: 20, textAlign: "center" }}>No file open</div>
          )}
        </div>

        <div style={{ flex: 1, minHeight: 0, borderTop: "1px solid #333" }}>
          <SandpackProvider
            template="react"
            files={sandpackFiles}
            customSetup={customSetup}
            theme="dark"
          >
            <SandpackLayout style={{ height: "100%" }}>
              <SandpackPreview style={{ height: "100%" }} />
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </div>
    </div>
  );
}
