import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = "/home/ubuntu/upload";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Stream directly to disk to handle large 4K iPhone video files (up to 2GB) without blowing server RAM
const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${timestamp}_${safeName}`);
  },
});

const uploadMiddleware = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit for raw 4K videos
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const validExts = [".mp4", ".mov", ".webm", ".m4v", ".txt", ".srt", ".vtt"];
    if (validExts.includes(ext) || file.mimetype.startsWith("video/") || file.mimetype.startsWith("text/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid format. Please upload video (MP4, MOV, WebM, M4V) or transcript (TXT) files."));
    }
  },
});

export function registerVideoEditorUploadRoute(app: Router) {
  app.post(
    "/api/editor/upload",
    uploadMiddleware.array("files", 10),
    async (req, res) => {
      try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
          res.status(400).json({ error: "No files uploaded" });
          return;
        }

        const uploadedItems = files.map((f, idx) => {
          const ext = path.extname(f.originalname).toLowerCase();
          const isTranscript = ext === ".txt" || ext === ".srt" || ext === ".vtt";
          return {
            id: `clip_${Date.now()}_${idx}`,
            originalName: f.originalname,
            savedFilename: f.filename,
            savedPath: f.path,
            fileSizeBytes: f.size,
            mimeType: f.mimetype,
            isTranscript,
            url: `/api/editor/video/${encodeURIComponent(f.filename)}`,
          };
        });

        res.json({
          success: true,
          files: uploadedItems,
        });
      } catch (err: unknown) {
        console.error("[VideoEditor Upload] Error:", err);
        const message = err instanceof Error ? err.message : "Upload failed";
        res.status(500).json({ error: message });
      }
    }
  );

  // Endpoint to serve uploaded video files for local browser preview
  app.get("/api/editor/video/:filename", (req, res) => {
    const safeFilename = path.basename(req.params.filename);
    const filePath = path.join(UPLOAD_DIR, safeFilename);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    res.sendFile(filePath);
  });
}
