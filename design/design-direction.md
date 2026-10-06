# INK & PLATE — Visual Direction, Audit & Implementation Plan

**Target:** davidowu portfolio (Next.js 16 · React 19 · Tailwind v4 · Framer Motion 12)
**Brief:** minimalistic, innovative, interactive. Only ink black / grey / white. Remove the green accent.
**Status:** plan for review. Nothing in `app/` or `components/` has been changed yet.
**Companion artifact:** `design/master-design.html` — the live master prototype. Open and review before approving any code changes.

---

## 1. Audit — what is actually on screen today

### 1.1 The palette is not "ink black, grey, white"

`app/globals.css` declares three tokens, but the codebase paints with **twenty-one** colours. The three declared "tokens" are all cool-tinted, so even the neutrals read blue.

| Role | Declared | Actually used in components |
|---|---|---|
| Ground | `--ink-black: #0d1b2a` | `#0d1b2a`, `#030910`, `#112131`, `#1a3a5a`, `#0a1a14`, `#0a1a14` |
| Secondary | `--lavender: #778da9` | `#778da9`, `#52b788`, `#38bdf8`, `#61dafb`, `#a78bfa`, `#3ecf8e`, `#3178c6`, `#f7c948`, `#e879f9`, `#8cc84b`, `#e34f26`, `#4285f4`, `#f89820`, `#fb923c` |
| Light | `--alabaster: #e0e1dd` | `#e0e1dd`, `#ffffff` |

- **The green** (`#52b788`) is hard-coded in **11 files** and carries no consistent meaning — it is simultaneously "available", "primary CTA", "hover state", "active nav item", "KPI badge", "error-adjacent highlight", and "success". Colour that means everything means nothing.
- `GlobalConstellation.tsx` carries a **13-entry rainbow tech→colour map** (`TECH_COLORS`) and a 3-colour category legend. On the single most visually distinctive surface in the product, minimalism is abandoned.
- There are **four different "blacks"** (`#0d1b2a`, `#030910`, `#112131`, `#1a3a5a`). `Section` already documents the problem: `'bg-[#112131]' // Ink Black + 2% Alabaster overlay equivalent` — a 2% difference that is **imperceptible**, so the intended alternating section rhythm does not read at all.
- Hex literals are pasted in ~120 places instead of tokens. Changing the palette today means a 20-file find-and-replace with no single source of truth.

### 1.2 Real defects found (not opinions)

| # | File | Defect | Impact |
|---|---|---|---|
| 1 | `app/globals.css` | `p { @apply … leading-[1.6-1.8] }` | `1.6-1.8` is not a valid CSS length. The declaration is dropped. Body line-height is currently whatever the browser default is, not the intended value. |
| 2 | `app/globals.css` | `* { font-weight: 400 !important }` | Kills every weight in the design. Meanwhile JSX uses `font-light`, `font-medium`, `font-semibold`, `font-bold` in 14 places — **all dead code**. The site believes it has typographic hierarchy and has none. |
| 3 | `app/page.tsx` + `components/sections/Bio.tsx` | `<div id="my-story">` wrapping `<Section id="my-story">` | **Duplicate DOM id.** Invalid HTML, and ambiguous for `useActiveSection()`'s `getElementById`. |
| 4 | `components/navigation/MobileNav.tsx` | `className="… no-scrollbar"` | No `.no-scrollbar` rule exists in `globals.css` (only `.hide-scrollbar`). The mobile nav shows a visible scrollbar across the section links. |
| 5 | `components/ui/RevealCard.tsx` | `<div role="button">` containing `<button>` and `<a>` | Nested interactive controls inside a button role — invalid for screen readers, and the inner controls' `stopPropagation` fights the outer handler. |
| 6 | `components/ui/Section.tsx` | Raw hex, no tokens | Section background cannot follow a theme. |
| 7 | `app/globals.css` | `* { @apply border-lavender/30 }` | Sets a default border-colour on literally every element, including SVG children. Load-bearing for nothing, confusing to debug. |
| 8 | Various | `rounded-sm`, `rounded-[2px]`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full` | Six radii with no system. `CollapsibleSection` alone breaks the 2px language with `rounded-xl`. |
| 9 | `components/sections/Contact.tsx` | `text-red-400` | The only semantic colour in the product, and it is an untokened Tailwind default that will clash with any palette decision. |
| 10 | `components/ui/RevealCard.tsx` | `hover:shadow-[0_0_30px_rgba(119,141,169,0.2)]` | Cyan-grey glow — a soft-glow trope that undercuts a hairline aesthetic. |

### 1.3 What is genuinely strong and must survive

This is a **refinement + reskin, not a teardown**. Five things here are better than most portfolios and the refresh must not lose them:

1. **`GlobalConstellation`** — a real, interactive node graph of 16 projects with shared-technology edges, ring orbits, idle rotation, hover inspect, click-through. This is the "innovative" asset. It only needs the rainbow removed.
2. **`BlueprintCaseStudy`** — a case-study surface organised as an engineering dossier. Right idea; the name already matches the direction we're proposing.
3. **`ResumeSheet`** — 7 role-targeted CVs in a bottom sheet, primary flagged. A concrete recruiter win; keep as-is structurally.
4. **Fast-signal metrics in the hero** (8 codebases / 330+ commits / open to remote). Keep the *information*, restyle the *chrome*.
5. **Existing hairline + SVG vocabulary** — `pathLength` draw-ins, 1px rules, monospace micro-labels, and (crucially) a **dot-matrix ground already in the CSS**: `radial-gradient(circle at 2px 2px, … 40px 40px)` on `body`, and a 36px dot matrix behind the constellation. **The direction the brief asks for already exists as a whisper. We are going to make it the language.**

---

## 2. Direction — "INK & PLATE"

**The concept.** All three motifs fuse: monochrome is native to print, dot-matrix is native to print, and the page is a *plate* being printed — ink on paper, registered by hairlines, measured by crop marks. The site stops being "a dark website with a green accent" and becomes **one artefact with one material**: ink at varying density on a single sheet.

The thesis in one line: **hierarchy comes from ink density and weight, never from hue.**

### 2.1 Colour — the accent problem, solved

The green is not replaced by another green. In a monochrome system the accent is **contrast**, not colour. Four options are wired into the master prototype behind a live switcher so you can decide by eye:

| Option | Value | Character |
|---|---|---|
| **A · Ink** *(recommended default)* | accent = `#FFFFFF` on ink ground; `#0B0B0C` on paper | Zero hue. The accent is maximum contrast. The green's whole job (available dot, active filter, KPI badge, primary CTA) is done by pure white + a hairline ring. Most disciplined, most timeless, hardest to make look cheap. |
| **B · Riso Red** | `#E8462B` | Print-native, warm, immediately reads as *ink* rather than *UI accent*. One saturated mark on a greyscale sheet is a very loud signal precisely because nothing else is coloured. |
| **C · Cyanotype** | `#1E4FA3` | Blueprint blue. Pairs with the "plate/technical drawing" vocabulary and the existing engineering-dossier surface. |
| **D · Graphite** | `#8E8E93` | Fully hueless mid-grey accent. The most minimal and the most passive — useful only if you want state changes to be nearly silent. |

Core tokens (hue-neutral; this is the actual ink, not navy):

```
PAPER world (light)                      INK world (dark) — same system inverted
--paper     #FFFFFF   sheet              --ground    #0B0B0C
--paper-2   #F2F2F0   alternate sheet    --ground-2  #141416
--paper-3   #E7E7E4   recessed           --ground-3  #1C1C1F
--ink       #0B0B0C   primary type       --ink       #FCFCFB   primary type
--graphite  #3A3A3E   secondary type     --graphite  #B4B4B9   secondary type
--grey      #6E6E73   tertiary           --grey      #83838A
--silver    #A8A8AD   hairlines 30%      --silver    #5A5A60
--rule      rgba(11,11,12,.10)           --rule      rgba(255,255,255,.10)
--rule-2    rgba(11,11,12,.28)  strong   --rule-2    rgba(255,255,255,.28)
```

**Dual-world is a feature, not a compromise.** You asked for ink black, grey and white; the "ink" reading of that is black type on white paper, which is the more distinctive and more minimal answer — and the exact inverse of what ships today. So the system is built paper-first with a real invert switch, and both worlds are shown in the master prototype. Dark mode then costs one `data-world` attribute instead of a rewrite.

### 2.2 Typography

Current: Rubik, single weight (enforced), no mono specified (Tailwind's OS-dependent default stack).

Proposed pairing — two families, clearly distinct, neither a default reach:

- **Bricolage Grotesque** — display, headings, body. Variable (wght 200–800, wdth 75–100, opsz 12–96). Eccentric terminals and genuinely expressive at display sizes, disciplined at 300–400. It does not read as Inter/Geist/Space Grotesk.
- **Martian Mono** — every label, metric, coordinate, filter chip, and status token. Wide, engineered, mechanical; visually adjacent to the dot-matrix itself.

**The hierarchy mechanism is new and is the single most important typographic change:**

| Axis | Mechanism | Replaces |
|---|---|---|
| Rank | `font-variation-settings: 'wght'` 300 → 620 | fixed weight-400-everything |
| Presence | `'wdth'` 90 → 100 on hover/focus | colour-change-on-hover |
| Scale | 11 · 12.5 · 14 · 17 · 22 · 30 · 44 · 68 · clamp(3.2rem, 8vw, 7rem) | 7 ad-hoc sizes |
| Colour | ink → graphite → grey → silver (density steps, not hues) | colour as state |
| Tracking | `-0.03em` display → `-0.01em` body → `+0.14em` mono labels | mixed -0.05em on all headings |

**Remove the `* { font-weight: 400 !important }` rule.** It is the root cause of the current flatness.

### 2.3 Layout — "The Plate"

A 12-column hairline grid on a visible baseline, left-aligned, with registration marks and crop marks as the *only* ornament.

```
PLATE (paper)                                     REGISTRATION
┌ + ───────────────────────────────────────── + ┐   +  hairline cross, 8px
│                                                │   ─  1px rule, --rule
│  ┌ 001 / IDENTITY ──────────────────────────┐  │   [+] crop mark
│  │                                          │  │
│  │  DAVID                                    │  │   Every section begins with a
│  │  IDOWU                                    │  │   numbered rule that states the
│  │  ────────────────────────────────         │  │   column width it occupies.
│  │  Full-stack engineer · security science   │  │
│  │                                          │  │   Asymmetric: text occupies
│  │  [ Available ──● ]      [ 8 codebases ]   │  │   cols 1–7, the plate/matrix
│  └──────────────────────────────────────────┘  │   occupies 7–12.
│         ▲ dot-matrix plate, cols 7–12          │
└ + ───────────────────────────────────────── + ┘
```

Work rows alternate weight, not side: text plate columns 1–6, media plate 7–12; the next project inverts. **No card walls** — projects are separated by rules, not identical rounded containers.

```
WORK ROW (paper)                                  CONTACT
┌───────────────────────────────────────────────┐   ┌───────────────┬──────────┐
│ 002 / WORK                              ↗     │   │ name          │  ┌────┐  │
├───────────────────────┬───────────────────────┤   │ ──────────    │  │ ░░ │  │
│ Amber                 │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │   │ email         │  │ ░░ │  │
│ Geospatial mental …   │  ▓ dot-matrix plate ▓  │   │ ──────────    │  │ ░░ │  │
│ ───────────────────   │  ▓  resolves on hover▓  │   │ message       │  └────┘  │
│ Next.js Supabase …    │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │   │ ──────────    │  plate   │
│ 07 2025 → 09 2026     │                       │   │ [ Transmit ]  │  inverts │
├───────────────────────┴───────────────────────┤   │                │  on send │
│ 003 inverted: plate 1–6, text 7–12            │   └───────────────┴──────────┘
└───────────────────────────────────────────────┘
```

### 2.4 Motion — eight motifs, all monochrome, all purposeful

Framer Motion stays. Everything is `transform` + `opacity` + `d` + CSS custom properties at 60fps.

1. **Dot-matrix field (plate).** One canvas per plate. Dot radius is a slow simplex-noise field; the cursor is a **lens** that compresses and brightens dots within ~140px. Idle drift ~6% opacity so it never competes with type. *This is the signature.*
2. **Halftone screen lift (media).** Project media sits under a CSS `radial-gradient` dot screen at 7px pitch. On hover/focus the screen opens — pitch 7px → 0 — revealing the image, as if a press screen is lifting. Implemented with a CSS custom property, GPU-only, no pixel reads, no CORS risk.
3. **Plotter reveal (type).** Hero lines are clipped to a baseline and rise with a 40ms stagger, each line masked by a horizontal dot-dither band that clears as the line lands. One orchestrated page-load, not per-section fade-ups (the site currently fades up **every** section, which reads as generated).
4. **Baseline draw (rules).** Every hairline rule draws in with `scaleX` from its left origin on scroll-enter, 420ms.
5. **Weight-on-approach (interaction).** Hovering a link/nav item animates `font-variation-settings` wght 320 → 620 and wdth 96 → 100. No colour change, no scale, no underline. *The most minimal interaction in the deck and the most distinctive.*
6. **Lift-on-accept (state).** Primary action fills from the left as a 1px-outlined plate that fills with ink, text inverting as it passes. Confirmation is the plate landing at 100%.
7. **Crosshair (cursor).** A 44px hairline ring with a mono coordinate readout (`x 0420 · y 0118`) that appears only over the plate areas. Disabled on coarse pointers.
8. **Constellation, de-rainbowed.** Edges become `--rule-2` hairlines at 0.6px; the active node is pure white with a 1px ring and a 12px `radial-gradient` ink bloom; filter chips become mono labels whose *density* encodes match count. Same interaction model, zero hue.

Retired from the current build: blue-grey radial glow following the cursor (`DynamicBackground`) — replaced by motif 1; `hover:-translate-y-1` + glow shadows on cards; `whileHover scale` on media.

**Reduced motion:** every motif degrades to a static state — dot field frozen at seed frame, screen lift instant, reveals instant, weight hover retained (it is a legibility affordance, not decoration). Durations and easings: `--ease: cubic-bezier(.22,1,.36,1)`, 120ms micro / 220ms state / 420ms entrance / 900ms orchestrated.

### 2.5 What makes this not-generic

Generic tells this direction explicitly refuses: gradient washes, glow shadows, one border-radius on everything, soft grey drop shadows, tinted near-black standing in for black, an eyebrow label above every heading, `→` appended to every link, and colour-as-hover-state. What replaces them is a real material: **pitch, dot gain, registration, and ink density.** The dot-matrix is not a background texture here — it *is* the image pipeline, the page-load, the cursor, and the graph surface.

---

## 3. Component-by-component plan

| Component | Verdict | Change |
|---|---|---|
| `app/globals.css` | **Rebuild** | New token set (§2.1), type scale, `[data-world]` inversion, delete `!important` weight lock and invalid `leading-[1.6-1.8]`; keep `link-underline`, reduced-motion block. |
| `app/layout.tsx` | **Refine** | Swap Rubik → Bricolage Grotesque + Martian Mono via `next/font/google`; add `data-world="ink"` default; drop `DynamicBackground`. |
| `components/animations/DynamicBackground.tsx` | **Replace** | → `DotField.tsx` (motif 1). |
| `components/ui/Section.tsx` | **Rebuild** | Tokenised, numbered rule header, crop marks, `data-plate` alternate instead of an invisible 2% shift. |
| `components/sections/Hero.tsx` | **Rebuild** | Plotter type reveal, dot plate, metrics as a mono ledger strip, actions as fill-on-accept plates. Single orchestrated load. |
| `components/sections/ProjectCard.tsx` | **Rebuild** | Plate layout (§2.3), halftone screen lift, weight-on-approach title. |
| `components/ui/RevealCard.tsx` | **Refine** | Fix defect #5 (a11y), tokenise, replace glow with screen lift, remove nested-interaction conflict. |
| `components/ui/GlobalConstellation.tsx` | **Refine (high value)** | Delete `TECH_COLORS` + `CATEGORY_ACCENT`; mono density encoding; hairline edges; keep all interaction. |
| `components/sections/Skills.tsx` | **Refine** | Keep hex node-graph (it is good), remove green, restyle chips and the "Daily Core" bar as a mono ledger; make filter chips weight-animated. |
| `components/sections/Experience.tsx` | **Refine** | Keep structure, swap green diamonds/highlights for ink-density rules; the impact badge becomes a left rule, not a tinted block. |
| `components/sections/Bio.tsx` | **Refine** | Profile plate → mono key/value ledger with hairline rows. |
| `components/sections/Contact.tsx` | **Refine** | Keep react-hook-form; underline fields on a hairline grid; add tokens for error/success; keep `Envelope` but re-ink it. |
| `components/animations/Envelope.tsx` | **Refine** | Monochrome strokes; replace the flap morph with a **dot-screen print** of the check mark. |
| `components/ui/ResumeSheet.tsx` | **Refine** | Tokenise; primary row marked by a 2px ink bar, not green tint. |
| `components/animations/LoadingScreen.tsx` | **Refine** | Becomes a plotter printing three dots per line — ties to motif 1. Keep the 1.2s budget and `sessionStorage` guard. |
| `components/animations/BreathingSmile.tsx` | **Remove or retire** | A face made of glowing blocks is off-system for a print-plate artefact; the dot plate replaces it as the hero's living element. Flagging for your call. |
| `components/navigation/*` | **Refine** | Active state: sliding 1px rule, not a filled pill. Fix defect #4. TopNav becomes a fixed mono coordinate bar. |
| `app/work/page.tsx` | **Rebuild** | Remove 40+ hex literals; filter chips as weight-animated mono; primary CTA as fill-on-accept. |
| `components/ui/BlueprintCaseStudy.tsx` | **Refine** | Already on-concept; align to tokens, dot-screen media, registration marks on the dossier header. |
| `components/ui/FilterSheet.tsx` | **Refine** | Tokenise; swaps green→accent token. |
| `components/Footer.tsx` | **Refine** | Tokenise; becomes a colophon: typefaces, stack, plate number, © year. |
| `app/not-found.tsx` | **Refine** | Tokenise; 404 as a mis-registered plate. |
| `lib/constants.ts` | **Rebuild** | Real token mirror + spacing scale (drop `sectionDesktop: 200px`). |
| `lib/animations.ts` | **Refine** | Add the eight motifs as named variants; replace `staggerChildren: 0.2` with 0.04–0.06 (0.2s staggers are the tell of generated motion). |

---

## 4. Implementation phases

Each phase is independently shippable and reversible.

**P0 — Token foundation** *(no visual change yet)*
`globals.css` tokens + `[data-world]`; `layout.tsx` fonts; `lib/constants.ts`. Delete the weight lock. Fix defects 1, 2, 7.
→ Verify: `npm run build`, diff screenshots of every route.

**P1 — Chrome & shell**
`Section`, `TopNav`, `MobileNav`, `Footer`, `LoadingScreen`, `not-found`. Fix defects 4, 6, 8.
→ The site is now monochrome and weight-hierarchic while every section keeps working.

**P2 — The plate (signature motion)**
`DotField`, halftone screen lift, plotter reveal, baseline draw, weight-on-approach. Replace `DynamicBackground`; rebuild `Hero`, `ProjectCard`.
→ The page-load moment lands; this is the review gate for the whole direction.

**P3 — Surfaces**
`Skills`, `Experience`, `Bio`, `Contact`, `Envelope`, `ResumeSheet`, `work/page.tsx`, `BlueprintCaseStudy`, `GlobalConstellation` de-rainbowed. Fix defects 3, 5, 9, 10.

**P4 — Polish & harden**
Full state matrix (default/hover/focus-visible/active/disabled/loading/error/success) on every interactive element; contrast audit at 4.5:1 for body and 3:1 for hairlines; 360/768/1280/1920 sweep; focus rings at 2px off-white with 2px offset so they survive both worlds; `prefers-reduced-motion`; delete all dead hex and orphaned classes.

---

## 5. Reviewing the master prototype — `design/master-design.html`

A single self-contained file (`design/master-design.html`, ~195 KB) with its three project plates inlined as base64 — no build step, no assets to lose, no server needed. Open it directly, or preview it in the thread. It carries the full system in one page: hero, plate ledger, work rows, skills graph, experience, contact, footer, plus a final **spec plate** printing every token, type step and component state.

**Controls (bottom bar):**
- **World** — Paper ⇄ Ink (both are shipped realities, not mockups)
- **Accent** — A Ink · B Riso Red · C Cyanotype · D Graphite (answering "replace the green with something better")
- **Plate / Grid / Motion** — toggle the dot field, the baseline grid overlay, and motion (motion off = the reduced-motion state, so you can check it without changing OS settings)

**What to judge:** the page-load sequence, the dot field under the cursor, the screen lift on project media, and whether the accent choice survives contact with a real page. Nothing here is committed to `app/` — this is the directive you asked for.

---

## 6. Verification log

The prototype was built, then measured. Numbers below are from the live DOM, not estimates.

**Contrast — every world × accent combination, against both grounds**

| Role | Paper | Ink | Floor |
|---|---|---|---|
| Body prose | 13.5:1 | 15.5:1 | 4.5:1 |
| Secondary mono text | 5.2:1 | 5.7:1 | 4.5:1 |
| Secondary mono on the alternate sheet | 4.7:1 | 5.4:1 | 4.5:1 |
| Accent text (`riso` / `cyano` / `graphite`) | 5.2 / 7.8 / 5.3:1 | 6.9 / 7.3 / 9.1:1 | 4.5:1 |
| Chips and labels | 7.4:1 | 8.1:1 | 4.5:1 |
| Functional hairline (input, link underline, `--rule-fn`) | 3.2:1 | 3.6:1 | 3:1 |

Worst measured value across all eight combinations: **4.65:1**. Two accent values are defined per world, because one hue cannot clear 4.5:1 on both white and near-black — the naive single-value approach is what produces the muddy on-brand colour most dark/light systems ship with.

**A caveat worth knowing:** the first accent pass used `#E8462B` and `#8E8E93` and measured 3.9:1 and 3.3:1 as text. The shipped `riso` (`#C8391F` paper / `#FF6A4A` ink) and `graphite` (`#6B6B70` / `#B0B0B6`) are the corrected pair. The four swatches in the control bar are therefore representative, not exact previews of the earlier draft.

**Layout and targets** — 390, 880, 950 and 1440 px all measured: zero horizontal overflow, zero interactive targets under 24×24 (WCAG 2.2). Fixing this required raising the mono ramp floor to 11px, moving `--ink-faint` off text entirely and onto marks, and letting the project graph scroll at 1:1 below 900px instead of shrinking its node targets to 9px.

**Semantics** — heading outline is now a valid `h1 → h2 → h3` tree with no skipped levels; every section carries a real `h2` (the numbered rule heads are the headings, not decoration). Zero duplicate DOM ids. Zero unlabelled buttons. Every image has alt text.

**Design detector** (`impeccable detect`) — 175 findings on the first pass, **5 on the final pass**, and the residue is accounted for:

| Remaining | Verdict |
|---|---|
| `cramped-padding` ×3 | False positive. The detector cannot resolve `padding: … var(--gutter)`, so it reads the band as unpadded. Measured inset on every section is a real 58px at 1440px. |
| `repeating-stripes-gradient` ×1 | The baseline-grid overlay — a review affordance that must repeat by definition, and it is off until you toggle it. |
| `all-caps-body` ×1 | A tracked mono label at a length where uppercase is still correct. |

> Corrected after the fact: the doc claimed nine findings. The true final count is five; the stale entries were the FIG captions, converted to sentence-case mono in the follow-up pass.

The 175 → 9 drop is the useful signal: the first pass was a real quality failure (10px functional text in 131 places, a 4.1:1 text colour), not a stylistic disagreement.

**Known gap to resolve during P3, not in the prototype.** The project graph is a desktop-scale artefact. Below 900px the master file scrolls it horizontally rather than rewriting it. Today's `Skills.tsx` solves the same problem with a vertical grouped list, which is the better mobile answer for the real build — carry that pattern across rather than the horizontal scroll.

**What could not be checked here:** this environment's preview does not composite frames, so screenshots were unavailable and **no transition or animation was ever observed playing** — only that the final states resolve correctly. Everything measured above is layout, colour, geometry and DOM truth. The motion itself (the dot field's lens, the screen lift, the plotter reveal, weight-on-approach) needs your eyes in a real browser before P2 is approved.
