/*
 * Style reminder: Signal Ledger — contemporary editorialism with Swiss information design,
 * warm paper surfaces, ink-black navigation, IBM Plex metadata, ruled ledger lines,
 * and Signal Lime reserved for healthy/active states.
 */

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  Clock3,
  Code2,
  ExternalLink,
  GitBranch,
  GitPullRequest,
  Github,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  PanelLeft,
  Plus,
  RefreshCw,
  Search,
  ServerCog,
  Settings2,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Workflow,
  X,
} from "lucide-react";

const snapshotRepos = [
  {
    name: "mcp",
    owner: "balajirajput96",
    visibility: "Public",
    pushed: "11 Aug 2026 · 16:41",
    language: "C#",
    status: "Attention",
    score: "78",
    openPrs: 2,
    alerts: 63,
    description: "The primary MCP workspace with an active review queue.",
    url: "https://github.com/balajirajput96/mcp",
  },
  {
    name: ".github",
    owner: "balajirajput96",
    visibility: "Public",
    pushed: "11 Aug 2026 · 04:48",
    language: "Config",
    status: "Observed",
    score: "—",
    openPrs: 0,
    alerts: "—",
    description: "Organization-wide defaults and contribution templates.",
    url: "https://github.com/balajirajput96/.github",
  },
  {
    name: "manus-advanced-demo",
    owner: "balajirajput96",
    visibility: "Private",
    pushed: "05 Aug 2026 · 03:29",
    language: "TypeScript",
    status: "Observed",
    score: "—",
    openPrs: 0,
    alerts: "—",
    description: "Private automation experiments consolidated during the task.",
    url: "https://github.com/balajirajput96/manus-advanced-demo",
  },
  {
    name: "gallery",
    owner: "balajirajput96",
    visibility: "Public",
    pushed: "23 Jul 2026 · 22:30",
    language: "TypeScript",
    status: "Observed",
    score: "—",
    openPrs: 0,
    alerts: "—",
    description: "A visual repository with a quieter recent activity line.",
    url: "https://github.com/balajirajput96/gallery",
  },
  {
    name: "mcp-foundry",
    owner: "balajirajput96",
    visibility: "Public",
    pushed: "16 Jul 2026 · 20:36",
    language: "C#",
    status: "Observed",
    score: "—",
    openPrs: 0,
    alerts: "—",
    description: "A companion MCP workspace from the repository snapshot.",
    url: "https://github.com/balajirajput96/mcp-foundry",
  },
  {
    name: "openclaw",
    owner: "balajirajput96",
    visibility: "Public",
    pushed: "09 Jul 2026 · 17:17",
    language: "JavaScript",
    status: "Observed",
    score: "—",
    openPrs: 0,
    alerts: "—",
    description: "An automation-oriented repository in the wider account snapshot.",
    url: "https://github.com/balajirajput96/openclaw",
  },
];

const activityItems = [
  { time: "09:42", label: "Pull request opened", detail: "mcp · #6 · Add startup log to Template.Mcp.Server", tone: "lime" },
  { time: "09:10", label: "Branch pushed", detail: "mcp · feature/add-log · fbb49577", tone: "ink" },
  { time: "Yesterday", label: "Private repository created", detail: "infra-tools · scripts and audit reports consolidated", tone: "sage" },
  { time: "11 Aug", label: "Security signal recorded", detail: "mcp · 63 vulnerabilities reported by the remote push check", tone: "rust" },
];

function LogoMark() {
  return (
    <div className="brand-lockup" aria-label="ledger slash slash gh">
      <div className="brand-mark"><span /></div>
      <span className="brand-wordmark"><b>ledger</b><em>//gh</em></span>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const isAttention = status === "Attention";
  const isObserved = status === "Observed";
  return (
    <span className={`status-pill ${isAttention ? "is-attention" : isObserved ? "is-observed" : ""}`}>
      {isAttention ? <CircleAlert size={13} /> : isObserved ? <CircleDashed size={13} /> : <CircleCheck size={13} />}
      {status}
    </span>
  );
}

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="sidebar-top">
        <LogoMark />
        <button className="icon-button sidebar-toggle" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <PanelLeft size={17} /> : <Menu size={17} />}
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        <p className="nav-label">Workspace</p>
        <a className="nav-item is-active" href="#overview"><LayoutDashboard size={17} /><span>Overview</span><b>01</b></a>
        <a className="nav-item" href="#repositories"><Github size={17} /><span>Repositories</span><b>06</b></a>
        <a className="nav-item" href="#activity"><Activity size={17} /><span>Activity</span><b>04</b></a>
        <p className="nav-label nav-label-spaced">Signals</p>
        <a className="nav-item" href="#security"><ShieldCheck size={17} /><span>Security</span><b className="nav-risk">63</b></a>
        <a className="nav-item" href="#workflows"><Workflow size={17} /><span>Workflows</span><b>—</b></a>
      </nav>

      <div className="sidebar-bottom">
        <div className="rail-note">
          <Sparkles size={16} />
          <div><strong>Snapshot mode</strong><span>Data collected in this task</span></div>
        </div>
        <a className="nav-item" href="#settings"><Settings2 size={17} /><span>Settings</span></a>
        <div className="account-chip"><span className="avatar">BR</span><div><strong>balajirajput96</strong><span>GitHub account</span></div><MoreHorizontal size={16} /></div>
      </div>
    </aside>
  );
}

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedRepo, setSelectedRepo] = useState("mcp");
  const [syncedAt, setSyncedAt] = useState("just now");

  const filteredRepos = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return snapshotRepos.filter((repo) => {
      const matchesQuery = !normalized || `${repo.name} ${repo.language} ${repo.visibility}`.toLowerCase().includes(normalized);
      const matchesFilter = filter === "All" || repo.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  const selected = snapshotRepos.find((repo) => repo.name === selectedRepo) ?? snapshotRepos[0];

  const refresh = () => {
    setSyncedAt("a few seconds ago");
    toast.success("Snapshot timestamp refreshed", { description: "This static dashboard preserves the evidence collected for the task." });
  };

  const focusAttention = () => {
    setFilter("Attention");
    document.getElementById("repositories")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      <main className="main-canvas" id="overview">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>Repository health</strong></div>
          <div className="topbar-actions">
            <span className="sync-note"><span className="sync-dot" /> Synced {syncedAt}</span>
            <button className="button button-ghost" onClick={refresh}><RefreshCw size={15} />Refresh</button>
            <button className="icon-button" aria-label="More workspace options"><MoreHorizontal size={18} /></button>
          </div>
        </header>

        <div className="page-content">
          <section className="hero-block" aria-labelledby="page-title">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-rule" /> 12 AUG 2026 · WEDNESDAY</p>
              <h1 id="page-title">Your codebase is moving.<br /><i>Here is where it needs attention.</i></h1>
              <p className="hero-description">A calm, evidence-led view of the GitHub signals collected during this workspace session. Start with the one repo currently asking for a closer look.</p>
              <div className="hero-actions">
                <button className="button button-primary" onClick={focusAttention}>Review attention signal <ArrowUpRight size={16} /></button>
                <a className="text-link" href="https://github.com/balajirajput96/mcp" target="_blank" rel="noreferrer">Open GitHub <ExternalLink size={14} /></a>
              </div>
            </div>
            <div className="hero-art" aria-label="Abstract repository pulse illustration">
              <img src="/manus-storage/repository-pulse-art_58518160.png" alt="Abstract branching repository signal illustration" />
              <div className="hero-art-caption"><span>Pulse / 01</span><strong>One signal asks for a review</strong></div>
            </div>
          </section>

          <section className="metric-strip" aria-label="Repository health summary">
            <div className="metric-cell"><span className="metric-label">Repositories in view</span><strong>06</strong><span className="metric-foot"><Github size={13} /> from account snapshot</span></div>
            <div className="metric-cell metric-highlight"><span className="metric-label">Known attention signals</span><strong>01</strong><span className="metric-foot"><TriangleAlert size={13} /> mcp needs review</span></div>
            <div className="metric-cell"><span className="metric-label">Open pull requests</span><strong>02</strong><span className="metric-foot"><GitPullRequest size={13} /> in mcp</span></div>
            <div className="metric-cell"><span className="metric-label">Last activity</span><strong>11<span> AUG</span></strong><span className="metric-foot"><Clock3 size={13} /> 16:41 UTC</span></div>
          </section>

          <section className="overview-grid">
            <article className="panel pulse-panel">
              <div className="panel-heading"><div><p className="panel-kicker">Repository pulse</p><h2>Signal movement</h2></div><span className="index-stamp">01</span></div>
              <div className="pulse-visual">
                <div className="pulse-copy"><span className="signal-label"><span className="signal-dot lime" /> ACTIVE SIGNAL</span><strong>mcp</strong><p>63 security alerts were reported alongside an active PR queue.</p><button className="button button-small" onClick={() => toast("Workflow inspection is available from the GitHub repository.")}>Inspect workflow <ArrowUpRight size={14} /></button></div>
                <img src="/manus-storage/workflow-rhythm-art_833a79bf.png" alt="Abstract workflow rhythm visual" />
              </div>
              <div className="pulse-legend"><span><i className="legend-mark mark-lime" /> Healthy</span><span><i className="legend-mark mark-rust" /> Needs review</span><span><i className="legend-mark mark-stone" /> Not fetched</span></div>
            </article>

            <article className="panel index-panel" id="security">
              <div className="panel-heading"><div><p className="panel-kicker">Health index</p><h2>Attention, not alarm</h2></div><ShieldCheck size={20} className="panel-icon" /></div>
              <div className="index-number"><span>mcp</span><strong>78</strong><em>/100</em></div>
              <div className="score-bar"><span style={{ width: "78%" }} /></div>
              <p className="index-note">The score is a directional snapshot derived from the open PR count and the security signal recorded during this task.</p>
              <div className="index-actions"><button className="button button-dark" onClick={() => setSelectedRepo("mcp")}>Open index <ArrowUpRight size={14} /></button><span>Updated {syncedAt}</span></div>
            </article>
          </section>

          <section className="activity-section" id="activity">
            <div className="section-heading"><div><p className="panel-kicker">Recent ledger entries</p><h2>What changed in the workspace</h2></div><button className="text-link" onClick={() => toast("The activity feed is limited to the collected task snapshot.")}>View all <ArrowUpRight size={14} /></button></div>
            <div className="activity-grid">
              <div className="activity-list">
                {activityItems.map((item) => <div className="activity-row" key={`${item.time}-${item.label}`}><div className={`activity-marker ${item.tone}`}><Check size={13} /></div><div className="activity-detail"><strong>{item.label}</strong><span>{item.detail}</span></div><time>{item.time}</time></div>)}
              </div>
              <div className="activity-aside"><img src="/manus-storage/workflow-rhythm-art_833a79bf.png" alt="Workflow rhythm texture" /><div><span className="signal-label"><span className="signal-dot rust" /> NEXT MOVE</span><strong>Review PR #6</strong><p>Open the pull request created during the GitHub demonstration and decide whether the startup log belongs in the template server.</p><a className="text-link" href="https://github.com/balajirajput96/mcp/pull/6" target="_blank" rel="noreferrer">Open PR #6 <ExternalLink size={13} /></a></div></div>
            </div>
          </section>

          <section className="repositories-section" id="repositories">
            <div className="section-heading repository-heading"><div><p className="panel-kicker">Repository register</p><h2>Selected account snapshot</h2></div><button className="button button-dark" onClick={() => toast("Add repository is a placeholder in this static dashboard.")}><Plus size={15} /> Add repository</button></div>
            <div className="table-toolbar"><div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search repository, language, visibility" aria-label="Search repositories" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}</div><div className="filter-tabs" role="group" aria-label="Repository status filter">{["All", "Attention", "Observed"].map((item) => <button key={item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
            <div className="repo-table-wrap">
              <table className="repo-table">
                <thead><tr><th>Repository</th><th>Last pushed</th><th>Visibility</th><th>Signals</th><th>Score</th><th><span className="sr-only">Open</span></th></tr></thead>
                <tbody>
                  {filteredRepos.map((repo) => (
                    <tr key={repo.name} className={selectedRepo === repo.name ? "is-selected" : ""} onClick={() => setSelectedRepo(repo.name)}>
                      <td><div className="repo-name"><span className="repo-icon"><Code2 size={15} /></span><div><strong>{repo.name}</strong><span>{repo.owner} · {repo.language}</span></div></div></td>
                      <td><span className="mono-cell">{repo.pushed}</span></td>
                      <td><span className="visibility-cell">{repo.visibility === "Private" ? <LockKeyhole size={13} /> : <Github size={13} />}{repo.visibility}</span></td>
                      <td><div className="signal-stack"><StatusPill status={repo.status} /><span>{repo.alerts === "—" ? "No alert data" : `${repo.alerts} alerts`}</span></div></td>
                      <td><span className={`score-cell ${repo.status === "Attention" ? "is-risk" : ""}`}>{repo.score}</span></td>
                      <td><a className="row-link" href={repo.url} target="_blank" rel="noreferrer" aria-label={`Open ${repo.name} on GitHub`} onClick={(event) => event.stopPropagation()}><ArrowUpRight size={16} /></a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRepos.length === 0 && <div className="empty-state"><Search size={18} /><strong>No repositories match that filter.</strong><span>Try a different name or return to All.</span></div>}
            </div>
            <div className="table-footnote"><span><CircleDashed size={13} /> Snapshot fields with an em dash were not fetched.</span><span>{filteredRepos.length} of {snapshotRepos.length} shown</span></div>
          </section>

          <footer className="page-footer"><span>ledger//gh · repository health, without the noise</span><span>Built from the GitHub connector snapshot · 12 Aug 2026</span></footer>
        </div>
      </main>
    </div>
  );
}
