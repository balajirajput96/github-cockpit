import { ArrowUpRight, Check, CircleAlert, CircleDashed, ShieldCheck } from "lucide-react";
import { AUTOMATION_STATUS_ITEMS, summarizeAutomationStatus, type AutomationStatusItem } from "@/lib/automationStatus";
import "./AutomationStatusPanel.css";

function StatusIcon({ tone }: { tone: AutomationStatusItem["tone"] }) {
  if (tone === "healthy") return <Check size={14} />;
  if (tone === "attention") return <CircleDashed size={14} />;
  return <CircleAlert size={14} />;
}

export function AutomationStatusPanel() {
  const summary = summarizeAutomationStatus();

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
    </section>
  );
}
