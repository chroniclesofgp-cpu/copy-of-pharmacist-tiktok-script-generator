import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerUploadRoute } from "../uploadRoute";
import { registerVideoEditorUploadRoute } from "../routers/videoEditorUpload";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { scheduledVideoAnalysisHandler } from "../scheduledVideoAnalysis";
import fs from "fs";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // Video file upload endpoint
  registerUploadRoute(app as unknown as import('express').Router);
  // Multi-clip video editor upload endpoint (streamed to disk up to 2GB)
  registerVideoEditorUploadRoute(app as unknown as import('express').Router);
  // Serve video editor exports from outside git tracking directory
  const exportStaticDir = "/home/ubuntu/webdev-static-assets/exports";
  if (!fs.existsSync(exportStaticDir)) {
    fs.mkdirSync(exportStaticDir, { recursive: true });
  }
  app.use("/api/exports", express.static(exportStaticDir));
  // Scheduled tasks — must be registered before tRPC fallthrough
  app.post("/api/scheduled/video-analysis", scheduledVideoAnalysisHandler);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
