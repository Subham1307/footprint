const cache = new Map<string, string>();

/** White halo tinted per-frame via billboard color: soft disc (visited) or ring (wishlist). */
export function haloDataUrl(visited: boolean): string {
  const key = `halo-${visited ? "v" : "w"}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  if (visited) {
    const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 62);
    g.addColorStop(0, "rgba(255,255,255,0.9)");
    g.addColorStop(0.45, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(64, 64, 62, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeStyle = "rgba(255,255,255,1)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(64, 64, 52, 0, Math.PI * 2);
    ctx.stroke();
  }

  const url = canvas.toDataURL();
  cache.set(key, url);
  return url;
}

export function pinDataUrl(visited: boolean, selected = false): string {
  const key = `${visited ? "v" : "w"}-${selected ? "s" : "n"}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const violet = "#8b7cf8";
  const blue = "#60a5fa";
  const accent = visited ? violet : blue;

  ctx.clearRect(0, 0, 96, 96);

  if (visited) {
    const g = ctx.createRadialGradient(48, 48, 4, 48, 48, 36);
    g.addColorStop(0, "rgba(139,124,248,0.75)");
    g.addColorStop(0.5, "rgba(139,124,248,0.25)");
    g.addColorStop(1, "rgba(139,124,248,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(48, 48, selected ? 38 : 32, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(48, 48, selected ? 16 : 12, 0, Math.PI * 2);
  if (visited) {
    ctx.fillStyle = accent;
    ctx.fill();
  } else {
    ctx.fillStyle = "rgba(16,17,20,0.85)";
    ctx.fill();
    ctx.lineWidth = selected ? 4 : 3;
    ctx.strokeStyle = accent;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(48, 48, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#f4f4f5";
  ctx.fill();

  const url = canvas.toDataURL();
  cache.set(key, url);
  return url;
}