import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

router.get("/:id/preview", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const appFile = project.files.find(f => f.name === "App.jsx");
    const appCode = appFile ? appFile.content : `<h1>Hello World</h1>`;

    const previewHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Preview - ${project.name}</title>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body {
              margin: 0;
              font-family: sans-serif;
              background: #f4f4f4;
              color: #222;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>

          <script type="text/babel">
            ${appCode}
            const root = ReactDOM.createRoot(document.getElementById("root"));
            root.render(<App />);
          </script>
        </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.send(previewHTML);
  } catch (err) {
    console.error("Preview generation error:", err);
    res.status(500).json({ message: "Error generating preview" });
  }
});

export default router;
