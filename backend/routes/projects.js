import express from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addFile,
  updateFile,
  deleteFile
} from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

// CRUD
router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

// files
router.post("/:id/files", addFile);
router.put("/:id/files/:fileId", updateFile);
router.delete("/:id/files/:fileId", deleteFile);

export default router;
