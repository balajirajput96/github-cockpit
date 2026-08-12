# GitHub Repo Health Dashboard — Design Direction

## Three Initial Directions

### Theme Name: Signal Ledger
**Very Brief Intro:** An editorial operations console that treats repository health like a living ledger: calm, precise, and sharply structured. Warm paper neutrals meet ink-black surfaces and a single acid-lime signal color for trustworthy status cues.
**Probability:** 0.07

### Theme Name: Night Watch
**Very Brief Intro:** A dark observability room with restrained cyan and amber indicators, designed for fast scanning during incident response. Dense but legible, with a technical, instrument-panel tone.
**Probability:** 0.04

### Theme Name: Garden of Branches
**Very Brief Intro:** A softer, botanical metaphor for software maintenance: branch health, growth, and risk are represented through organic forms and generous whitespace. Friendly and approachable, but less suited to high-density operations.
**Probability:** 0.08

## Chosen Direction: Signal Ledger

### Design Movement
Contemporary editorialism blended with Swiss information design and the tactile restraint of a printed financial ledger. The interface should feel authored, not generated: strong typographic composition, quiet surfaces, and deliberate alignment.

### Core Principles
1. **Scan before decorate:** every color, divider, and label must help a user understand repository state faster.
2. **Warm precision:** combine human paper tones with crisp monospace metadata so technical information feels approachable without becoming playful.
3. **Asymmetric rhythm:** use a persistent rail, offset hero blocks, and a wide activity column rather than a centered dashboard of equal cards.
4. **Evidence over theatre:** status labels must be tied to concrete signals such as workflow runs, pull requests, freshness, and visibility.

### Color Philosophy
The base is a warm parchment `#F4F0E8`, chosen to soften the density of technical data. Ink-black `#171815` creates editorial authority and makes the dashboard feel like an operations journal. Acid lime `#C7F36B` is the ownable signal color: it marks healthy systems and active focus without resembling generic GitHub blue. Rust `#B75E3B` is reserved for risk, while muted sage and stone carry secondary states.

### Layout Paradigm
A persistent left rail anchors navigation and identity. The main canvas uses an offset two-column composition: a wide repository pulse panel, a narrow health index panel, then a full-width activity feed and repository table. The top bar is intentionally spare, with the page title and date context left-aligned rather than centered.

### Signature Elements
- **Ledger lines:** thin, slightly warm dividers and ruled table headers that echo an annotated notebook.
- **Signal tabs:** compact lime, rust, and stone pills that behave like instrument readings rather than decorative badges.
- **Index stamp:** a small outlined circular mark used beside the health score and in the brand lockup.

### Interaction Philosophy
Interactions should feel like handling a physical dashboard: hover states lift information by one level, selected rows receive a lime edge, and filters change the evidence set without turning the page into a modal maze. Buttons use direct language such as `Review 2 open PRs` and `Inspect workflow`.

### Animation
Use subtle, short transitions only: repository rows reveal with a 40ms stagger, status bars fill with a 220ms ease-out, and the left rail highlights through opacity and a 2px inset line. Avoid floating cards and bouncy effects. Respect `prefers-reduced-motion` by removing non-essential entrance transitions.

### Typography System
Use **DM Serif Display** for the large page title and key editorial numerals, paired with **IBM Plex Sans** for body copy and labels. Use **IBM Plex Mono** for repository names, branch names, timestamps, and hashes. Headlines should be compact and high-contrast; metadata stays uppercase with generous tracking.

### Brand Essence
**Positioning:** A calm command center for developers who need to see repository health, risk, and next actions at a glance. **Personality:** exacting, grounded, quietly confident.

### Brand Voice
Headlines are declarative and specific. CTAs name the next useful action. Microcopy explains evidence instead of exaggerating urgency.

Example lines:
- “Your codebase is moving. Here is where it needs attention.”
- “Three signals are asking for a closer look.”

### Wordmark & Logo
Use a compact wordmark reading `ledger//gh` in IBM Plex Mono with a custom double-slash prefix. The mark is a small outlined circle crossed by a single horizontal rule, suggesting an index stamp and a repository branch.

### Signature Brand Color
**Signal Lime — `#C7F36B`**. It should appear sparingly as the active-state edge, healthy status marker, and primary action emphasis.

## Style Decisions
- The dashboard is light-first with ink-black navigation and warm paper canvas.
- Never use a purple gradient, generic rounded-card grid, or centered hero composition.
- Data density is acceptable when hierarchy is strong and every metric has a clear label.
- The interface should feel useful before it feels ornamental.
