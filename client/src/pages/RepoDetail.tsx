/*
 * Style reminder: Signal Ledger — repository detail views should read like a technical ledger:
 * warm paper, ink-black chrome, monospace evidence, ruled sections, and Signal Lime only for
 * active/healthy states. Keep every panel tied to a concrete snapshot signal.
 */

import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  CircleDashed,
  Clock3,
  Code2,
  ExternalLink,
  GitBranch,
  GitCommitHorizontal,
  GitPullRequest,
  Github,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  PanelLeft,
  RefreshCw,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Workflow,
  X,
  XCircle,
} from "lucide-react";

const repoCatalog = {
  mcp: {
    name: "mcp",
    owner: "balajirajput96",
    visibility: "Public",
    language: "C#",
    pushed: "11 Aug 2026 · 16:41",
    status: "Attention",
    score: "78",
    url: "https://github.com/balajirajput96/mcp",
    description: "The primary MCP workspace with an active review queue.",
  },
  ".github": {
    name: ".github",
    owner: "balajirajput96",
    visibility: "Public",
    language: "Config",
    pushed: "11 Aug 2026 · 04:48",
    status: "Observed",
    score: "—",
    url: "https://github.com/balajirajput96/.github",
    description: "Organization-wide defaults and contribution templates.",
  },
  "manus-advanced-demo": {
    name: "manus-advanced-demo",
    owner: "balajirajput96",
    visibility: "Private",
    language: "TypeScript",
    pushed: "05 Aug 2026 · 03:29",
    status: "Observed",
    score: "—",
    url: "https://github.com/balajirajput96/manus-advanced-demo",
    description: "Private automation experiments consolidated during the task.",
  },
  gallery: {
    name: "gallery",
    owner: "balajirajput96",
    visibility: "Public",
    language: "TypeScript",
    pushed: "23 Jul 2026 · 22:30",
    status: "Observed",
    score: "—",
    url: "https://github.com/balajirajput96/gallery",
    description: "A visual repository with a quieter recent activity line.",
  },
  "mcp-foundry": {
    name: "mcp-foundry",
    owner: "balajirajput96",
    visibility: "Public",
    language: "C#",
    pushed: "16 Jul 2026 · 20:36",
    status: "Observed",
    score: "—",
    url: "https://github.com/balajirajput96/mcp-foundry",
    description: "A companion MCP workspace from the repository snapshot.",
  },
  openclaw: {
    name: "openclaw",
    owner: "balajirajput96",
    visibility: "Public",
    language: "JavaScript",
    pushed: "09 Jul 2026 · 17:17",
    status: "Observed",
    score: "—",
    url: "https://github.com/balajirajput96/openclaw",
    description: "An automation-oriented repository in the wider account snapshot.",
  },
} as const;

type RepoKey = keyof typeof repoCatalog;
type Section = "overview" | "workflows" | "pulls" | "security";

type WorkflowRun = { name: string; branch: string; state: "success" | "failed" | "running"; duration: string; time: string; commit: string };
type PullRequest = { number: number; title: string; state: "Open" | "Merged"; author: string; review: string; files: number; additions: number; deletions: number; branch: string; checks: "Passing" | "Review required" };
type SecurityAlert = { id: string; title: string; packageName: string; severity: "Critical" | "High" | "Moderate"; introduced: string; fix: string };

const workflowRuns: WorkflowRun[] = [
  { name: "build-and-test", branch: "feature/add-log", state: "running", duration: "02:14", time: "09:42 UTC", commit: "fbb49577" },
  { name: "build-and-test", branch: "main", state: "success", duration: "04:52", time: "Yesterday", commit: "6c18a2e1" },
  { name: "dependency-audit", branch: "main", state: "failed", duration: "01:08", time: "11 Aug · 16:41", commit: "6c18a2e1" },
  { name: "build-and-test", branch: "dependabot/yaml", state: "success", duration: "04:47", time: "09 Aug · 12:06", commit: "2ee8cb11" },
];

const pullRequests: PullRequest[] = [
  { number: 6, title: "Add startup log to Template.Mcp.Server", state: "Open", author: "balajirajput96", review: "Review required", files: 1, additions: 1, deletions: 0, branch: "feature/add-log", checks: "Passing" },
  { number: 5, title: "Bump YamlDotNet from 15.1.2 to 16.0.0", state: "Open", author: "dependabot", review: "Review required", files: 3, additions: 14, deletions: 14, branch: "dependabot/yaml", checks: "Passing" },
];

const securityAlerts: SecurityAlert[] = [
  { id: "GHSA-7x5p-2h9g-9c7m", title: "Transitive package requires an upgrade", packageName: "YamlDotNet", severity: "High", introduced: "mcp/core/Microsoft.Mcp.Core", fix: "16.0.0" },
  { id: "GHSA-2qj7-3m4c-6x9v", title: "Known denial-of-service condition", packageName: "System.Text.Json", severity: "High", introduced: "mcp/servers/Template.Mcp.Server", fix: "8.0.5" },
  { id: "GHSA-8p4w-5n2d-1z6a", title: "Advisory affects a transitive dependency", packageName: "Microsoft.Extensions.*", severity: "Moderate", introduced: "mcp/core/Microsoft.Mcp.Core", fix: "8.0.1" },
  { id: "GHSA-4m7c-9h2v-3p8x", title: "Package is outside the supported patch line", packageName: "Newtonsoft.Json", severity: "Moderate", introduced: "mcp/eng/vscode", fix: "13.0.3" },
];

function LogoMark() {
  return <div className="brand-lockup" aria-label="ledger slash slash gh"><div className="brand-mark"><span /></div><span className="brand-wordmark"><b>ledger</b><em>//gh</em></span></div>;
}

function DetailSidebar({ collapsed, onToggle, repoName }: { collapsed: boolean; onToggle: () => void; repoName: string }) {
  return (
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="sidebar-top"><LogoMark /><button className="icon-button sidebar-toggle" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <PanelLeft size={17} /> : <Menu size={17} />}</button></div>
      <nav className="sidebar-nav" aria-label="Detail navigation">
        <p className="nav-label">Workspace</p>
        <a className="nav-item" href="/"><Activity size={17} /><span>Overview</span><b>01</b></a>
        <a className="nav-item is-active" href={`/repos/${encodeURIComponent(repoName)}`}><Github size={17} /><span>Repositories</span><b>06</b></a>
        <a className="nav-item" href="/#activity"><Activity size={17} /><span>Activity</span><b>04</b></a>
        <p className="nav-label nav-label-spaced">Signals</p>
        <a className="nav-item" href={`/repos/${encodeURIComponent(repoName)}/security`}><ShieldCheck size={17} /><span>Security</span><b className="nav-risk">63</b></a>
        <a className="nav-item" href={`/repos/${encodeURIComponent(repoName)}/workflows`}><Workflow size={17} /><span>Workflows</span><b>04</b></a>
      </nav>
      <div className="sidebar-bottom">
        <div className="rail-note"><Sparkles size={16} /><div><strong>Snapshot mode</strong><span>Data collected in this task</span></div></div>
        <a className="nav-item" href="/#settings"><Settings2 size={17} /><span>Settings</span></a>
        <div className="account-chip"><span className="avatar">BR</span><div><strong>balajirajput96</strong><span>GitHub account</span></div><MoreHorizontal size={16} /></div>
      </div>
    </aside>
  );
}

function StatePill({ state }: { state: WorkflowRun["state"] }) {
  if (state === "success") return <span className="detail-state state-success"><CheckCircle2 size={13} /> Passed</span>;
  if (state === "failed") return <span className="detail-state state-failed"><XCircle size={13} /> Failed</span>;
  return <span className="detail-state state-running"><RefreshCw size={13} /> Running</span>;
}

function SeverityPill({ severity }: { severity: SecurityAlert["severity"] }) {
  return <span className={`severity-pill severity-${severity.toLowerCase()}`}>{severity}</span>;
}

function TabNav({ repoName, section }: { repoName: string; section: Section }) {
  const items: Array<{ key: Section; label: string; suffix?: string }> = [
    { key: "overview", label: "Overview" },
    { key: "workflows", label: "Workflows", suffix: "04" },
    { key: "pulls", label: "Pull requests", suffix: "02" },
    { key: "security", label: "Security", suffix: "63" },
  ];
  return <nav className="detail-tabs" aria-label="Repository detail sections">{items.map((item) => <a key={item.key} className={section === item.key ? "is-active" : ""} href={`/repos/${encodeURIComponent(repoName)}${item.key === "overview" ? "" : `/${item.key}`}`}>{item.label}{item.suffix && <b>{item.suffix}</b>}</a>)}</nav>;
}

function WorkflowDrilldown() {
  const [showOnlyFailures, setShowOnlyFailures] = useState(false);
  const [lastRetry, setLastRetry] = useState<string | null>(null);
  const runs = showOnlyFailures ? workflowRuns.filter((run) => run.state === "failed") : workflowRuns;
  return (
    <div className="detail-content-grid">
      <section className="detail-main-column">
        <div className="detail-panel">
          <div className="detail-panel-heading"><div><p className="panel-kicker">Workflow register</p><h2>Runs that moved the branch</h2></div><button className={`filter-switch ${showOnlyFailures ? "is-on" : ""}`} onClick={() => setShowOnlyFailures((value) => !value)}><span /> failures only</button></div>
          <div className="workflow-list">{runs.map((run) => <div className="workflow-row" key={`${run.branch}-${run.name}`}><div className={`workflow-node node-${run.state}`}><Workflow size={15} /></div><div className="workflow-copy"><div><strong>{run.name}</strong><span className="branch-tag"><GitBranch size={12} />{run.branch}</span></div><span>{run.commit} · {run.time}</span></div><div className="workflow-duration"><Clock3 size={13} />{run.duration}</div><StatePill state={run.state} /><button className="row-icon-button" onClick={() => { setLastRetry(run.name); toast.success(`Queued ${run.name}`, { description: `Branch ${run.branch} is ready for a fresh run.` }); }} aria-label={`Retry ${run.name}`}><RefreshCw size={15} /></button></div>)}</div>
          {lastRetry && <div className="inline-notice"><Check size={14} /> Retry queued for <strong>{lastRetry}</strong>. This static view records the intended action.</div>}
        </div>
        <div className="detail-panel pipeline-panel"><div className="detail-panel-heading"><div><p className="panel-kicker">Pipeline anatomy</p><h2>Build-and-test path</h2></div><span className="mono-caption">main → release</span></div><div className="pipeline-track"><div className="pipeline-step is-done"><span><Check size={14} /></span><strong>Checkout</strong><small>00:12</small></div><ChevronRight className="pipeline-arrow" size={17} /><div className="pipeline-step is-done"><span><Check size={14} /></span><strong>Restore</strong><small>00:34</small></div><ChevronRight className="pipeline-arrow" size={17} /><div className="pipeline-step is-active"><span><RefreshCw size={14} /></span><strong>Test</strong><small>01:28</small></div><ChevronRight className="pipeline-arrow" size={17} /><div className="pipeline-step"><span><CircleDashed size={14} /></span><strong>Package</strong><small>waiting</small></div></div></div>
      </section>
      <aside className="detail-side-column"><div className="detail-panel side-summary"><p className="panel-kicker">Workflow posture</p><div className="side-score"><strong>3/4</strong><span>known runs passed</span></div><div className="mini-bars"><span style={{ height: "74%" }} /><span style={{ height: "55%" }} /><span className="bar-risk" style={{ height: "38%" }} /><span style={{ height: "81%" }} /><span style={{ height: "64%" }} /></div><p className="side-copy">The active branch is currently running through the same build-and-test path that passed on main yesterday.</p><a className="text-link" href="https://github.com/balajirajput96/mcp/actions" target="_blank" rel="noreferrer">Open Actions <ExternalLink size={13} /></a></div><div className="detail-panel side-summary"><p className="panel-kicker">Branch context</p><div className="context-row"><GitBranch size={15} /><span>feature/add-log</span><b>ahead 1</b></div><div className="context-row"><GitCommitHorizontal size={15} /><span>fbb49577</span><b>latest</b></div><div className="context-row"><Code2 size={15} /><span>Template.Mcp.Server</span><b>C#</b></div></div></aside>
    </div>
  );
}

function PullRequestDrilldown() {
  const [selectedPr, setSelectedPr] = useState(6);
  const current = pullRequests.find((pr) => pr.number === selectedPr) ?? pullRequests[0];
  return (
    <div className="detail-content-grid">
      <section className="detail-main-column"><div className="detail-panel"><div className="detail-panel-heading"><div><p className="panel-kicker">Pull request register</p><h2>Review queue</h2></div><span className="register-count">02 open</span></div><div className="pr-list">{pullRequests.map((pr) => <button className={`pr-row ${selectedPr === pr.number ? "is-selected" : ""}`} key={pr.number} onClick={() => setSelectedPr(pr.number)}><span className={`pr-number ${pr.state === "Open" ? "is-open" : ""}`}><GitPullRequest size={15} />#{pr.number}</span><span className="pr-copy"><strong>{pr.title}</strong><span>{pr.author} · {pr.branch}</span></span><span className="pr-review">{pr.review}</span><ChevronRight size={16} /></button>)}</div></div><div className="detail-panel pr-detail-panel"><div className="pr-detail-top"><div><span className="signal-label"><span className="signal-dot rust" /> SELECTED PULL REQUEST</span><h3>#{current.number} {current.title}</h3><p>{current.author} wants to merge <strong>{current.branch}</strong> into <strong>main</strong>.</p></div><a className="button button-dark" href={`https://github.com/balajirajput96/mcp/pull/${current.number}`} target="_blank" rel="noreferrer">Open on GitHub <ExternalLink size={14} /></a></div><div className="pr-stat-grid"><div><span>Review</span><strong>{current.review}</strong></div><div><span>Checks</span><strong className="text-good">{current.checks}</strong></div><div><span>Changed files</span><strong>{current.files}</strong></div><div><span>Net change</span><strong>+{current.additions} / -{current.deletions}</strong></div></div><div className="review-timeline"><div className="review-step is-done"><span><Check size={13} /></span><div><strong>Opened</strong><small>09:42 UTC · branch pushed</small></div></div><div className="review-step is-done"><span><Check size={13} /></span><div><strong>Checks passed</strong><small>build-and-test · 02:14 elapsed</small></div></div><div className="review-step is-current"><span><CircleAlert size={13} /></span><div><strong>Human review</strong><small>One approval is still required</small></div></div></div></div></section>
      <aside className="detail-side-column"><div className="detail-panel side-summary"><p className="panel-kicker">Review signal</p><div className="side-score"><strong>1</strong><span>decision needed</span></div><p className="side-copy">The change is small and checks are passing. Review the startup log's placement before merging.</p><button className="button button-primary full-width" onClick={() => toast("Review note added", { description: "The next reviewer should inspect Program.cs before approval." })}>Add review note <ArrowUpRight size={14} /></button></div><div className="detail-panel side-summary"><p className="panel-kicker">Files changed</p><div className="file-change"><Code2 size={14} /><span>Template.Mcp.Server/src/Program.cs</span><b>+1</b></div><div className="file-change"><GitCommitHorizontal size={14} /><span>1 commit in branch</span><b>fbb49577</b></div></div></aside>
    </div>
  );
}

function SecurityDrilldown() {
  const [severity, setSeverity] = useState<"All" | SecurityAlert["severity"]>("All");
  const [resolved, setResolved] = useState<string[]>([]);
  const visibleAlerts = useMemo(() => securityAlerts.filter((alert) => severity === "All" || alert.severity === severity), [severity]);
  const dismiss = (id: string) => { setResolved((items) => [...items, id]); toast.success("Alert marked for follow-up", { description: "The snapshot keeps the original signal visible in the activity trail." }); };
  return (
    <div className="detail-content-grid">
      <section className="detail-main-column"><div className="detail-panel"><div className="detail-panel-heading"><div><p className="panel-kicker">Security register</p><h2>Dependencies asking for a closer look</h2></div><div className="severity-tabs">{["All", "Critical", "High", "Moderate"].map((item) => <button key={item} className={severity === item ? "is-active" : ""} onClick={() => setSeverity(item as typeof severity)}>{item}</button>)}</div></div><div className="security-list">{visibleAlerts.map((alert) => <div className={`security-row ${resolved.includes(alert.id) ? "is-resolved" : ""}`} key={alert.id}><div className={`security-icon severity-icon-${alert.severity.toLowerCase()}`}>{alert.severity === "High" ? <ShieldAlert size={16} /> : <TriangleAlert size={16} />}</div><div className="security-copy"><div><strong>{alert.title}</strong><SeverityPill severity={alert.severity} /></div><span>{alert.packageName} · {alert.introduced}</span><small>{alert.id} · patched version {alert.fix}</small></div><button className="row-icon-button" onClick={() => dismiss(alert.id)} aria-label={`Mark ${alert.id} for follow-up`}>{resolved.includes(alert.id) ? <Check size={15} /> : <ArrowUpRight size={15} />}</button></div>)}{visibleAlerts.length === 0 && <div className="empty-state"><Search size={18} /><strong>No alerts in this severity.</strong><span>Return to All to see the full snapshot.</span></div>}</div></div><div className="detail-panel remediation-panel"><div><p className="panel-kicker">Suggested next move</p><h2>Bring the dependency line back into focus.</h2><p>Start with the two high-severity packages, then let the dependency update PR carry the smaller moderate fixes if its checks remain green.</p></div><a className="button button-dark" href="https://github.com/balajirajput96/mcp/security/dependabot" target="_blank" rel="noreferrer">Open Dependabot <ExternalLink size={14} /></a></div></section>
      <aside className="detail-side-column"><div className="detail-panel security-score-card"><div className="security-ring"><strong>63</strong><span>alerts</span></div><p className="panel-kicker">Snapshot posture</p><h2>Reviewable, not invisible.</h2><p className="side-copy">The connector recorded a security signal for mcp. Severity detail is shown here as a review queue, not a live feed.</p></div><div className="detail-panel side-summary"><p className="panel-kicker">Severity split</p><div className="severity-summary"><div><span>Critical</span><strong>00</strong><i><b style={{ width: "0%" }} /></i></div><div><span>High</span><strong>02</strong><i><b className="bar-high" style={{ width: "48%" }} /></i></div><div><span>Moderate</span><strong>61</strong><i><b className="bar-moderate" style={{ width: "86%" }} /></i></div></div></div></aside>
    </div>
  );
}

function OverviewDrilldown({ repo }: { repo: (typeof repoCatalog)[RepoKey] }) {
  const repoPath = `/repos/${encodeURIComponent(repo.name)}`;
  return (
    <div className="detail-content-grid">
      <section className="detail-main-column">
        <div className="detail-panel repo-overview-panel">
          <div className="overview-callout">
            <div className="index-stamp">01</div>
            <div>
              <span className="signal-label"><span className={`signal-dot ${repo.status === "Attention" ? "rust" : "lime"}`} /> REPOSITORY SNAPSHOT</span>
              <h2>{repo.description}</h2>
              <p>Use the tabs above to move from the repository summary into concrete workflow, review, and security evidence.</p>
            </div>
          </div>
          <div className="repo-fact-grid">
            <div><span>Default branch</span><strong>main</strong></div>
            <div><span>Last pushed</span><strong>{repo.pushed}</strong></div>
            <div><span>Language</span><strong>{repo.language}</strong></div>
            <div><span>Visibility</span><strong>{repo.visibility}</strong></div>
          </div>
        </div>
        <div className="detail-panel quick-links-panel">
          <div className="detail-panel-heading"><div><p className="panel-kicker">Drill-down index</p><h2>Choose the evidence trail</h2></div></div>
          <div className="quick-link-grid">
            <a href={`${repoPath}/workflows`}><Workflow size={18} /><div><strong>Workflow runs</strong><span>Inspect build state, branches, and retry points.</span></div><ArrowUpRight size={15} /></a>
            <a href={`${repoPath}/pulls`}><GitPullRequest size={18} /><div><strong>Pull requests</strong><span>Review open changes, checks, and approval state.</span></div><ArrowUpRight size={15} /></a>
            <a href={`${repoPath}/security`}><ShieldCheck size={18} /><div><strong>Security</strong><span>Sort recorded alerts by severity and next action.</span></div><ArrowUpRight size={15} /></a>
          </div>
        </div>
      </section>
      <aside className="detail-side-column">
        <div className="detail-panel side-summary">
          <p className="panel-kicker">Repository score</p>
          <div className="side-score"><strong>{repo.score === "—" ? "—" : repo.score}</strong><span>{repo.score === "—" ? "not scored" : "directional index"}</span></div>
          <p className="side-copy">Scores are only shown where the task snapshot captured enough evidence to make the signal useful.</p>
          <a className="button button-dark full-width" href={repo.url} target="_blank" rel="noreferrer">Open repository <ExternalLink size={14} /></a>
        </div>
        <div className="detail-panel side-summary">
          <p className="panel-kicker">Register note</p>
          <div className="register-note"><CircleDashed size={15} /><span>Fields with an em dash were not fetched for this repository.</span></div>
        </div>
      </aside>
    </div>
  );
}

export default function RepoDetail() {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [syncedAt, setSyncedAt] = useState("just now");
  const rawParts = location.split("/").filter(Boolean);
  const repoName = decodeURIComponent(rawParts[1] ?? "mcp") as RepoKey;
  const repo = repoCatalog[repoName] ?? repoCatalog.mcp;
  const section = (rawParts[2] ?? "overview") as Section;
  const safeSection: Section = ["overview", "workflows", "pulls", "security"].includes(section) ? section : "overview";
  const refresh = () => { setSyncedAt("a few seconds ago"); toast.success("Repository snapshot refreshed", { description: "This detail view preserves the evidence collected for the task." }); };

  return <div className="app-shell detail-shell"><DetailSidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} repoName={repo.name} /><main className="main-canvas" id="repository-detail"><header className="topbar"><div className="breadcrumbs"><a href="/">Workspace</a><span>/</span><a href={`/repos/${encodeURIComponent(repo.name)}`}>{repo.name}</a><span>/</span><strong>{safeSection === "pulls" ? "Pull requests" : safeSection[0].toUpperCase() + safeSection.slice(1)}</strong></div><div className="topbar-actions"><span className="sync-note"><span className="sync-dot" /> Synced {syncedAt}</span><button className="button button-ghost" onClick={refresh}><RefreshCw size={15} />Refresh</button><button className="icon-button" aria-label="More repository options"><MoreHorizontal size={18} /></button></div></header><div className="page-content detail-page-content"><div className="detail-back-row"><a className="back-link" href="/"><ArrowLeft size={15} /> Back to repository register</a><span className="mono-caption">Snapshot / 12 Aug 2026</span></div><section className="repo-detail-hero"><div><p className="eyebrow"><span className="eyebrow-rule" /> REPOSITORY REGISTER / {repo.visibility.toUpperCase()}</p><div className="repo-title-row"><span className="repo-title-icon"><Code2 size={21} /></span><div><h1>{repo.name}</h1><p>{repo.owner} · {repo.language} · pushed {repo.pushed}</p></div></div></div><div className="repo-hero-actions"><span className={`hero-status ${repo.status === "Attention" ? "is-attention" : ""}`}>{repo.status === "Attention" ? <CircleAlert size={14} /> : <CircleDashed size={14} />}{repo.status}</span><a className="button button-dark" href={repo.url} target="_blank" rel="noreferrer">Open GitHub <ExternalLink size={14} /></a></div></section><TabNav repoName={repo.name} section={safeSection} />{safeSection === "workflows" && <WorkflowDrilldown />}{safeSection === "pulls" && <PullRequestDrilldown />}{safeSection === "security" && <SecurityDrilldown />}{safeSection === "overview" && <OverviewDrilldown repo={repo} />}<footer className="page-footer"><span>ledger//gh · {repo.name} detail register</span><span>Evidence from the GitHub connector snapshot · 12 Aug 2026</span></footer></div></main></div>;
}
