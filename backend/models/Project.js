import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  path: { type: String, default: "/" },
  content: { type: String, default: "" },
  language: { type: String, default: "javascript" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

fileSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const projectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  files: { type: [fileSchema], default: [] },
  settings: {
    entry: { type: String, default: "src/index.jsx" },
    autosave: { type: Boolean, default: true },
    theme: { type: String, default: "light" }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

projectSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Project", projectSchema);
