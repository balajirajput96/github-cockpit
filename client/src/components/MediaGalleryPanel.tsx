import React from "react";
import { FolderCheck, ExternalLink, Film, CheckCircle2 } from "lucide-react";

export interface ReelMediaItem {
  reelNumber: string;
  title: string;
  topic: string;
  driveFileId: string;
  webViewLink: string;
  createdTime: string;
  status: "verified_persisted" | "rendering" | "queued";
}

const VERIFIED_REELS: ReelMediaItem[] = [
  {
    reelNumber: "0001",
    title: "आदत क्यों नहीं छूटती? मस्तिष्क की रीवायरिंग का सच",
    topic: "Neuroplasticity and Habit Formation",
    driveFileId: "1H3-huMqfT73KZ9aArfHuWoHT_6Frn_dl",
    webViewLink: "https://drive.google.com/file/d/1H3-huMqfT73KZ9aArfHuWoHT_6Frn_dl/view?usp=drivesdk",
    createdTime: "2026-08-22T04:52:57.207Z",
    status: "verified_persisted",
  },
];

export function MediaGalleryPanel() {
  return (
    <div style={{ background: "#161A16", border: "1px solid #2D332D", borderRadius: "12px", padding: "1.5rem", color: "#E2E8F0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Film size={20} style={{ color: "#10B981" }} />
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", margin: 0 }}>Google Drive Research-Reels Gallery</h3>
            <p style={{ fontSize: "0.75rem", color: "#94A3B8", margin: "0.15rem 0 0 0" }}>Folder: 3000_HINDI_RESEARCH_REELS / Batch_001</p>
          </div>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: "rgba(16, 185, 129, 0.15)", color: "#10B981", padding: "0.25rem 0.65rem", borderRadius: "6px", fontSize: "0.75rem", fontFamily: "monospace" }}>
          <FolderCheck size={13} /> 1 Verified in Drive
        </span>
      </div>

      <div style={{ display: "grid", gap: "0.75rem" }}>
        {VERIFIED_REELS.map((reel) => (
          <div key={reel.reelNumber} style={{ background: "#131613", border: "1px solid #262B26", borderRadius: "8px", padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <span style={{ fontSize: "0.7rem", fontFamily: "monospace", background: "#262B26", color: "#10B981", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>Reel #{reel.reelNumber}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>{reel.title}</span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#94A3B8", margin: 0 }}>Topic: {reel.topic} · Created: {new Date(reel.createdTime).toLocaleString()}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "#10B981", fontSize: "0.75rem" }}>
                <CheckCircle2 size={13} /> Persisted & Verified
              </span>
              <a href={reel.webViewLink} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: "#10B981", color: "#0B0F0B", padding: "0.4rem 0.75rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600, textDecoration: "none" }}>
                View in Drive <ExternalLink size={13} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
