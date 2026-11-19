import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} · ${site.owner}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#101114",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(139,124,248,0.55), transparent 45%), radial-gradient(circle at 85% 30%, rgba(96,165,250,0.4), transparent 40%), radial-gradient(circle at 70% 95%, rgba(52,211,153,0.25), transparent 40%)",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#a1a1aa" }}>
          {site.wordmark}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
            {site.name}
          </div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#d4d4d8", maxWidth: 900, lineHeight: 1.35 }}>
            {site.tagline}
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#a1a1aa" }}>
          <span>Journal</span>
          <span>·</span>
          <span>Places</span>
          <span>·</span>
          <span>Collections</span>
          <span>·</span>
          <span>Archive</span>
        </div>
      </div>
    ),
    size,
  );
}