import { ArrowUpRight, Check, CircleAlert, CircleDashed, ShieldCheck } from "lucide-react";
import { AUTOMATION_STATUS_ITEMS, summarizeAutomationStatus, type AutomationStatusItem } from "@/lib/automationStatus";
import "./AutomationStatusPanel.css";

function StatusIcon({ tone }: { tone: AutomationStatusItem["tone"] }) {
  if (tone === "healthy") return <Check size={14} />;
  if (tone === "attention") return <CircleDashed size={14} />;
  return <CircleAlert size={14} />;
}

import { trpc } from "@/lib/trpc";

export function AutomationStatusPanel() {
  const summary = summarizeAutomationStatus();
  const { data: continuationData } = trpc.cockpit.continuationState.useQuery();
  const { data: recordsData } = trpc.cockpit.autonomousRecords.useQuery();

  return (
    <section className="automation-status-section" id="automation" aria-labelledby="automation-status-title">
      <div className="section-heading automation-status-heading">
        <div>
          <p className="panel-kicker">Connector operations</p>
          <h2 id="automation-status-title">Automate the evidence.<br /><i>Keep the change reviewable.</i></h2>
        </div>
        <div className="automation-status-totals" aria-label="Automation status totals">
          <span className="is-healthy"><Check size={12} /> {summary.healthy} active</span>
          <span className="is-attention"><CircleDashed size={12} /> {summary.attention} review</span>
          <span className="is-blocked"><CircleAlert size={12} /> {summary.blocked} blocked</span>
        </div>
      </div>

      {/* Live Bounded Continuation Progress */}
      {continuationData && (
        <div style={{ margin: "1.25rem 0", background: "#131613", border: "1px solid #262B26", borderRadius: "10px", padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#10B981", textTransform: "uppercase", letterSpacing: "0.05em" }}>Master Mission Continuation Loop</span>
            <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#94A3B8" }}>Cycle {continuationData.currentCycle} / {continuationData.maxCycles}</span>
          </div>
          <div style={{ width: "100%", background: "#262B26", height: "8px", borderRadius: "4px", overflow: "hidden", marginBottom: "0.75rem" }}>
            <div 
              style={{ background: "#10B981", height: "100%", width: `${Math.min(100, (continuationData.currentCycle / continuationData.maxCycles) * 100)}%`, transition: "width 0.5s ease" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.75rem", color: "#94A3B8" }}>
            <span>Status: <strong style={{ color: "#fff", textTransform: "capitalize" }}>{continuationData.status}</strong></span>
            <span>Last Run: {new Date(continuationData.lastExecutionTimestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      )}

      <div className="automation-status-grid">
        {AUTOMATION_STATUS_ITEMS.map((item) => (
          <article className={`automation-status-card is-${item.tone}`} key={item.id}>
            <div className="automation-card-top"><span className="automation-status-icon"><StatusIcon tone={item.tone} /></span><span>{item.eyebrow}</span></div>
            <strong>{item.title}</strong>
            <p>{item.detail}</p>
            {item.href ? <a href={item.href} target="_blank" rel="noreferrer">{item.hrefLabel} <ArrowUpRight size={13} /></a> : <span className="automation-status-boundary"><ShieldCheck size={13} /> evidence only</span>}
          </article>
        ))}
      </div>

      {/* Autonomous Audit Records */}
      {recordsData && recordsData.length > 0 && (
        <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid #2D332D" }}>
          <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fff", marginBottom: "0.75rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Recent Autonomous Execution Records</span>
            <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#94A3B8" }}>{recordsData.length} entries</span>
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem" }}>
            {recordsData.slice(0, 4).map((rec, idx) => (
              <div key={`${rec.timestamp}-${idx}`} style={{ background: "#131613", border: "1px solid #262B26", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.50rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: rec.result === "success" ? "#10B981" : "#F59E0B" }}></span>
                  <span style={{ color: "#fff", fontFamily: "monospace" }}>{rec.task}</span>
                  <span style={{ color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>{rec.actionPerformed}</span>
                </div>
                <span style={{ color: "#94A3B8", fontFamily: "monospace" }}>{new Date(rec.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
