import Project from "../models/Project.js";


export const createProject = async (req, res) => {
  try {
    const { name, description, files, settings } = req.body;
    if (!name)
      return res.status(400).json({ message: "Project name is required" });

    const project = new Project({
      owner: req.user._id,
      name,
      description: description || "",
      files: files || [
        {
          name: "src/index.jsx",
          path: "src",
          content: `import React from "react";\nimport { createRoot } from "react-dom/client";\nimport App from "./App";\ncreateRoot(document.getElementById("root")).render(<App/>);`,
          language: "javascript",
        },
        {
          name: "src/App.jsx",
          path: "src",
          content: `import React from "react";\nexport default function App(){ return <div>Hello CipherStudio</div> }`,
          language: "javascript",
        },
      ],
      settings: settings || {},
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id })
      .select("-__v")
      .sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOne({ _id: id, owner: req.user._id });
    if (!project)
      return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!project)
      return res
        .status(404)
        .json({ message: "Project not found or not owned by you" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOneAndDelete({
      _id: id,
      owner: req.user._id, // ✅ fixed typo (_id)
    });
    if (!project)
      return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const addFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { file } = req.body;
    if (!file || !file.name)
      return res.status(400).json({ message: "File object with name required" });

    const project = await Project.findOne({ _id: id, owner: req.user._id });
    if (!project)
      return res.status(404).json({ message: "Project not found" });

    project.files.push({ ...file });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update file content
export const updateFile = async (req, res) => {
  try {
    const { id, fileId } = req.params;
    const { content, name, path } = req.body;
    const project = await Project.findOne({ _id: id, owner: req.user._id });
    if (!project)
      return res.status(404).json({ message: "Project not found" });

    const file = project.files.id(fileId);
    if (!file)
      return res.status(404).json({ message: "File not found" });

    if (content !== undefined) file.content = content;
    if (name !== undefined) file.name = name;
    if (path !== undefined) file.path = path;
    file.updatedAt = Date.now();

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  try {
    const { id, fileId } = req.params;
    const project = await Project.findOne({ _id: id, owner: req.user._id });
    if (!project)
      return res.status(404).json({ message: "Project not found" });

    const file = project.files.id(fileId);
    if (!file)
      return res.status(404).json({ message: "File not found" });

    file.remove();
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
