/**
 * /api/upload — Video file upload endpoint for Video Lab
 * Accepts multipart/form-data with a 'file' field, uploads to S3, returns { url }
 */
import { Router } from "express";
import multer from "multer";
import { storagePut } from "./storage";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 16 * 1024 * 1024 }, // 16MB
  fileFilter: (_req, file, cb) => {
    const allowedVideo = ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"];
    const allowedImage = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic", "image/heif"];
    const ext = file.originalname.toLowerCase();
    const validVideoExt = ext.endsWith(".mp4") || ext.endsWith(".webm") || ext.endsWith(".mov") || ext.endsWith(".m4v");
    const validImageExt = ext.endsWith(".jpg") || ext.endsWith(".jpeg") || ext.endsWith(".png") || ext.endsWith(".webp") || ext.endsWith(".heic") || ext.endsWith(".heif");
    if (allowedVideo.includes(file.mimetype) || allowedImage.includes(file.mimetype) || validVideoExt || validImageExt) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Please upload MP4, WebM, MOV, JPG, PNG, or WebP."));
    }
  },
});

export function registerUploadRoute(app: Router) {
  app.post(
    "/api/upload",
    upload.single("file"),
    async (req, res) => {
      try {
        if (!req.file) {
          res.status(400).json({ error: "No file provided" });
          return;
        }

        const timestamp = Date.now();
        const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
        const key = `video-lab/${timestamp}-${safeName}`;

        const { url } = await storagePut(key, req.file.buffer, req.file.mimetype);

        res.json({ url, key });
      } catch (err: unknown) {
        console.error("[Upload] Error:", err);
        const message = err instanceof Error ? err.message : "Upload failed";
        res.status(500).json({ error: message });
      }
    }
  );
}
