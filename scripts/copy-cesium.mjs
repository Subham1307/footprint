import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "node_modules", "cesium", "Build", "Cesium");
const dest = path.join(root, "public", "cesium");

function copyRecursive(src, dst) {
  if (!fs.existsSync(src)) {
    console.warn(`[copy-cesium] Skip — missing ${src} (run npm install cesium)`);
    return;
  }
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);
    if (entry.isDirectory()) copyRecursive(from, to);
    else fs.copyFileSync(from, to);
  }
}

if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
copyRecursive(source, dest);
console.log("[copy-cesium] Copied Cesium assets to public/cesium");