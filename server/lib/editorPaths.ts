import fs from "fs";
import path from "path";

/**
 * Container-compatible directory paths for video editor uploads and exports.
 * Works seamlessly in both local sandbox development and Cloud Run production containers.
 */
export const UPLOAD_DIR = process.env.UPLOAD_DIR || (
  fs.existsSync("/home/ubuntu/upload") ? "/home/ubuntu/upload" : "/tmp/video_uploads"
);

export const EXPORT_DIR = process.env.EXPORT_DIR || (
  fs.existsSync("/home/ubuntu/webdev-static-assets/exports")
    ? "/home/ubuntu/webdev-static-assets/exports"
    : "/tmp/video_exports"
);

export const CHUNK_DIR = "/tmp/video_chunks";

// Ensure all working directories exist upon startup
[UPLOAD_DIR, EXPORT_DIR, CHUNK_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.warn(`[EditorPaths] Could not create directory ${dir}:`, e);
    }
  }
});
