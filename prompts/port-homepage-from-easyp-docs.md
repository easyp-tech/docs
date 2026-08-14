# Task: Port the full marketing homepage from `easyp/docs` → `docs-fumadocs`

You are implementing a **pixel-faithful (or very close) port** of the production EasyP marketing home page into the new Fumadocs + Next.js App Router site.

After you finish, another agent will **validate** your work (visual parity, links, build, no regressions to `/docs`). Implement completely; leave a short summary of what you did and any intentional deviations.

---

## ⚠️ MANDATORY: Sequential Thinking (do this first and continuously)

**You MUST actively and consistently use the `sequential-thinking` MCP server** (also called *sequence thinking* / tool name typically `sequentialthinking` or `sequential-thinking__sequentialthinking`).

This is **not optional**. Skipping sequential thinking is a failed task even if the code “works”.

### How to use it

1. **Before any file edits:** call sequential thinking to plan:
   - inventory source sections vs target stub
   - choose Option A vs B (nav / HomeLayout)
   - file tree, client vs server boundaries
   - link rewrite map
   - risk list (double nav, Tailwind v3→v4, GitHub fetch, assets)
2. **During implementation:** open a new sequential-thinking step at each major phase:
   - after reading source components
   - before writing Hero / TrustedBy / FeatureSwitcher / Architecture / Footer
   - before CSS port
   - when stuck or revising architecture
3. **Before claiming done:** sequential-thinking pass that walks the acceptance checklist and notes residual risks for the validator.

### Tool discovery

- Use your environment’s MCP tool discovery (`search_tool` / tool list) for query `sequential thinking` or `sequentialthinking`.
- Follow the **exact** input schema returned (do not invent parameter names).
- Typical pattern: multi-step chain — thought → next thought needed → revise → conclude.
- Keep thoughts concrete and tied to *this* repo (paths, components, trade-offs), not generic advice.

### What “good” sequential thinking looks like here

| Step | Example focus |
|------|----------------|
| 1 | Map `HomePage.tsx` section order to target `app/(home)/` |
| 2 | Decide Option A (Fumadocs HomeLayout only) vs B (custom Navbar) — pick one with rationale |
| 3 | List client islands (`'use client'`) vs RSC |
| 4 | Plan asset copy paths for partners |
| 5 | Plan CSS utilities to port without breaking docs prose |
| 6 | Link rewrite table verification |
| 7 | Pre-build / pre-DONE checklist |

If the sequential-thinking MCP server is **unavailable**, state that explicitly in your final report, fall back to a visible numbered planning block in the chat that mirrors the same rigor, then proceed — but **try the MCP tool first**.

---

## 0. Goals and non-goals

### Goals

1. Replace the **minimal stub** at `docs-fumadocs/app/(home)/page.tsx` with the **full homepage** currently implemented in `easyp/docs`.
2. Preserve **structure, copy (EN), interactions, assets, and visual language** of the source home.
3. Integrate cleanly with **Next.js App Router**, **Fumadocs `HomeLayout`**, **Tailwind CSS 4**, and existing EasyP brand tokens in `docs-fumadocs`.
4. Fix all internal links to the **new IA** (no `/docs/guide/...`).
5. Keep `/docs/**` pages working; do not break search, LLM routes, or MDX content.

### Non-goals

- Do **not** port the Vite docs reader, blog routes as a separate app, or Russian i18n for the whole site (home is EN-only for now).
- Do **not** reintroduce VitePress / `react-router` / `react-i18next` as runtime deps unless absolutely necessary (prefer hardcoding EN strings or a tiny local constants module).
- Do **not** port `RegistryPreview` — it is **not** mounted on the source home page.
- Do **not** change MDX content under `content/docs/` for this task.
- Do **not** reintroduce Shiki `[!code focus|++|--]` markers anywhere.

### Success criteria (validator will check)

- [ ] **Sequential thinking MCP used** throughout (planning → mid-task → pre-done); reported in DONE note
- [ ] `/` shows: Hero (version badge, install picker, terminal mock) → TrustedBy marquee → FeatureSwitcher (CLI/Server tabs) → ArchitectureComparison (3 cards) → Footer
- [ ] Partner logos load from local `public/`
- [ ] Install dropdown: brew / go / docker; OS auto-detect; copy-to-clipboard works
- [ ] GitHub latest stable tag shown in badge (with graceful fallback)
- [ ] All footer/product links hit valid new paths under `/docs/...`
- [ ] Nav: Docs, Blog (new path), GitHub; Console optional if already in Fumadocs chrome
- [ ] `npm run build` succeeds
- [ ] Dark theme, slate/blue palette, glass panels, marquee, text-gradient look like source
- [ ] No broken imports; no `react-router-dom` left in home tree

---

## 1. Workspace paths

| Role | Absolute path (workspace) |
|------|---------------------------|
| **Target app** | `/Users/zergslaw/Tech/easyp-tech/docs-fumadocs` |
| **Source homepage (Vite React)** | `/Users/zergslaw/Tech/easyp-tech/easyp/docs` |
| Target home route | `docs-fumadocs/app/(home)/page.tsx` |
| Target home layout | `docs-fumadocs/app/(home)/layout.tsx` |
| Target root layout / CSS | `docs-fumadocs/app/layout.tsx`, `app/global.css` |
| Target nav options | `docs-fumadocs/lib/layout.shared.tsx` |
| Brand CSS | `docs-fumadocs/styles/brand-variables.css`, `app/global.css` |
| Agent rules | `docs-fumadocs/AGENTS.md`, `docs-fumadocs/README.md` |

**Source of truth for composition** — `easyp/docs/src/pages/HomePage.tsx`:

```tsx
// Order is mandatory:
<Navbar />
<Hero />
<TrustedBy />
<FeatureSwitcher />
<ArchitectureComparison />
<Footer />
```

`RegistryPreview` exists in source but is **not** included — skip it.

---

## 2. Source file inventory (read these fully before coding)

### Composition

| File | Purpose |
|------|---------|
| `easyp/docs/src/pages/HomePage.tsx` | Section order shell |
| `easyp/docs/src/components/Navbar.tsx` | Fixed glass nav |
| `easyp/docs/src/components/Hero.tsx` | Version, badges, title, install box, terminal visual |
| `easyp/docs/src/components/TrustedBy.tsx` | Partner marquee |
| `easyp/docs/src/components/FeatureSwitcher.tsx` | Local vs Remote tabs + code/infra visual |
| `easyp/docs/src/components/ArchitectureComparison.tsx` | 3 value props |
| `easyp/docs/src/components/Footer.tsx` | Product + community columns |
| `easyp/docs/src/utils/github.ts` | `GetLatestRelease()` via GitHub tags API |
| `easyp/docs/src/i18n/locales/en.json` | All EN copy keys for home |
| `easyp/docs/src/index.css` | `.text-gradient`, `.glass-panel`, `.animate-marquee`, `.no-scrollbar`, body bg |
| `easyp/docs/tailwind.config.js` | colors: `background`, `primary`, `secondary`, animations `fade-in-up` |
| `easyp/docs/public/assets/partners/*` | Partner logos (copy into target `public/`) |

### Partner assets to copy

From `easyp/docs/public/assets/partners/`:

- `comazo.svg`
- `yadro.png`
- `h3.png`
- `openide.png`
- `pt.png`

Into target, e.g.:

```
docs-fumadocs/public/assets/partners/
```

TrustedBy partner list (from source):

```ts
const partners = [
  { name: 'comazo', url: 'https://comazo.ru/site_new/index.php', logo: '/assets/partners/comazo.svg' },
  { name: 'YADRO', url: 'https://yadro.com/', logo: '/assets/partners/yadro.png' },
  { name: 'h3', url: 'https://h3llo.cloud/', logo: '/assets/partners/h3.png' },
  { name: 'OpenIDE', url: 'https://openide.ru/', logo: '/assets/partners/openide.png' },
  { name: 'Positive Tech', url: 'https://ptsecurity.com/', logo: '/assets/partners/pt.png' },
]
```

### EN copy (must match)

Use strings from `easyp/docs/src/i18n/locales/en.json` keys under:

- `nav.*` (documentation, blog, github)
- `hero.*` (title, titleHighlight, subtitle, exploreDocs, badge.license)
- `trustedBy.title`
- `features.*` (full CLI + server trees)
- `architecture.*`
- `footer.*`

Hardcode EN in components or `lib/home-copy.ts` — **do not** pull in `react-i18next` unless you have a strong reason.

### Install methods (Hero)

| id | fullLabel | cmd |
|----|-----------|-----|
| `brew` | macOS (homebrew) | `brew install easyp-tech/tap/easyp` |
| `go` | go Install (any OS) | `go install github.com/easyp-tech/easyp/cmd/easyp@latest` |
| `docker` | docker | `docker pull easyp/easyp:latest` |

OS detect (source behavior):

- mac → `brew`
- linux / win / default → `go`

### GitHub version badge

Port `GetLatestRelease` from `easyp/docs/src/utils/github.ts`:

- `GET https://api.github.com/repos/easyp-tech/easyp/tags`
- Prefer first **stable** tag (exclude `-rc`, `-alpha`, `-beta`, `-pre`, `-dev`)
- Fallback: first tag, or show `vX.X.X` / hide error gracefully (source uses `'unknown version'`)

Prefer a **client component** for Hero (hooks + fetch), or a small client island. Do not block SSR of the whole site if GitHub is slow — client-side fetch as source does is fine.

### Visual / CSS utilities to port into `app/global.css` (home-scoped or global)

From source `index.css` + tailwind theme:

```css
/* required for visual parity */
.text-gradient { /* blue → violet clip text */ }
.glass-panel { /* translucent slate + blur + hairline border */ }
.animate-marquee { animation: marquee 40s linear infinite; }
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-25%); } }
.no-scrollbar { /* hide scrollbars on install command row */ }
/* fade-in-up animation if used */
```

Palette anchors (source):

- background: `#020617` (slate-950) — already aligned with Fumadocs dark
- primary: `#3b82f6`
- secondary: `#8b5cf6`
- surfaces: slate-900/800 borders

Prefer **Fumadocs tokens** where equivalent (`bg-fd-background`, `text-fd-primary`, `border-fd-border`) so docs and home stay coherent — but match source look if tokens diverge.

### Terminal mock (Hero) — preserve content

Window chrome + mono body showing roughly:

```
➜ easyp generate -v
  ✔ Resolving dependencies from easyp.lock...
  ✔ Connecting to EasyP Service... Connected
  [INFO] Dispatching plugins:
    ├─ protoc-gen-go (v1.31) WASM
    └─ custom-java-gen (v2.0) DOCKER
  ✨ Generation complete in 420ms.
➜ █
```

### FeatureSwitcher visuals

- Tab **Local Development**: YAML-like `easyp.yaml` snippet (version, deps, lint, breaking)
- Tab **Remote Infrastructure**: “EasyP Service Healthy” + Registry/Plugins/Uptime rows

### Architecture cards

Three cards with Lucide icons `Globe`, `Layers`, `Lock`; descriptions may contain `**bold**` — render as real `<strong>` (do not use `dangerouslySetInnerHTML` unless sanitized; prefer structured copy with React nodes).

---

## 3. Target integration constraints (Next + Fumadocs)

### Current stub (replace)

`docs-fumadocs/app/(home)/page.tsx` is a short marketing teaser (logo, 3 feature cards, brew line). **Replace** with full section composition.

`docs-fumadocs/app/(home)/layout.tsx` currently:

```tsx
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { baseOptions } from '@/lib/layout.shared'
export default function Layout({ children }) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>
}
```

**Decide and document one approach:**

**Option A (recommended):** Keep Fumadocs `HomeLayout` for consistent Docs/GitHub/theme chrome, but **do not** port a second `Navbar` (avoid double nav). Port Hero → Footer only; map source nav links into `lib/layout.shared.tsx` (`Docs`, `Blog`, GitHub already partial; add Telegram in footer only).

**Option B:** Drop `HomeLayout` chrome on `/` only and port full `Navbar` + page + `Footer` as a self-contained marketing shell (still use root `RootProvider` for dark theme). Ensure theme toggle / logo still make sense.

Either is acceptable if **no double navbar** and links work. Validator prefers **Option A** unless double-chrome looks worse than custom.

### Routing / links rewrite (critical)

Source uses old paths. **Must rewrite:**

| Source | Target |
|--------|--------|
| `/docs` | `/docs` |
| `/docs/guide/cli/linter/linter` | `/docs/cli/linter` |
| `/docs/guide/api-service/overview` | `/docs/api-service/overview` |
| `/blog` | `/docs/blog/finally-give-up-gin-echo` **or** first blog post / a blog index if you add one — **do not** leave dead `/blog` |
| GitHub | `https://github.com/easyp-tech/easyp` |
| Telegram | `https://t.me/easyptech` |
| Console (if shown) | `https://app.easyp.tech` |

Use Next.js `Link` for internal routes; `<a>` for external with `rel` where needed.

### Component placement (suggested)

```
docs-fumadocs/
  app/(home)/page.tsx              # compose sections
  app/(home)/layout.tsx            # HomeLayout or custom shell
  components/home/
    hero.tsx                       # 'use client' if needed
    trusted-by.tsx                 # 'use client' for marquee pause optional
    feature-switcher.tsx           # 'use client' for tabs
    architecture-comparison.tsx
    footer.tsx
  lib/
    github-release.ts              # GetLatestRelease
    home-copy.ts                   # EN strings (optional)
  public/assets/partners/*         # copied logos
  app/global.css                   # marquee, text-gradient, glass-panel, etc.
```

Split client islands (`'use client'`) only where hooks are required; keep presentational pieces as server components when possible.

### Dependencies

- `lucide-react` is already in `docs-fumadocs` — reuse icons.
- Do **not** add `react-router-dom`, `react-i18next`, Vite-only packages.
- Prefer existing Tailwind 4 + Fumadocs utilities over copying entire `easyp/docs` Tailwind v3 config.

### Language switcher

Source has `LanguageSwitcher` on Navbar. **Skip RU** for this task (i18n routes not wired). Do not leave a non-functional language control.

### Favicons / logo

Target already has `public/logo.svg`. You may keep it in Fumadocs nav. Partner logos are separate under `public/assets/partners/`.

---

## 4. Implementation steps (recommended order)

0. **Sequential thinking (MCP)** — initial plan (see mandatory section above). Do not skip.
1. **Read** all source files listed in §2 and target `AGENTS.md` / current home files.
2. **Sequential thinking** — confirm Option A/B + file plan after reading.
3. **Copy** partner assets into `docs-fumadocs/public/assets/partners/`.
4. **Port CSS utilities** (gradient, glass, marquee, no-scrollbar, fade-in-up) into `app/global.css` without breaking docs prose.
5. **Port `GetLatestRelease`** → `lib/github-release.ts` (or under `components/home/`).
6. **Implement sections** under `components/home/*` with EN copy and Next `Link` (checkpoint sequential thinking between major sections if redesigning).
7. **Rewrite** `app/(home)/page.tsx` to compose full page; resolve Navbar vs `HomeLayout` (Option A/B).
8. **Update** `lib/layout.shared.tsx` links if using Option A (Blog URL to new path; ensure Docs active states).
9. **Smoke test** `npm run dev` → `/`, click every home CTA and footer link.
10. **`npm run build`** — fix MDX/types/Tailwind issues.
11. **Sequential thinking** — final acceptance walkthrough.
12. Write a brief **DONE** note: files changed, Option A/B choice, known deviations, **confirmation that sequential-thinking was used** (or MCP unavailable + chat plan used).

---

## 5. Explicit acceptance checklist

### Visual / UX

- [ ] Dark slate background, primary blue accents, violet secondary where source uses it
- [ ] Hero ambient glow / blur orb present
- [ ] Version pill with live or fallback version + Apache 2.0 badge with Shield icon
- [ ] H1: “The Modern Standard for” + gradient “Protobuf Workflows”
- [ ] Install control: dropdown + command + copy button
- [ ] “Explore Documentation” CTA → `/docs`
- [ ] Terminal mock card under hero
- [ ] TrustedBy uppercase label + infinite marquee of partner logos (grayscale, hover opacity)
- [ ] Feature section title “Two modes. **One platform.**” with pill toggle
- [ ] Architecture “Why EasyP…” three cards
- [ ] Footer: description, Apache note, Product links, Community (GitHub, Telegram), rights line

### Functional

- [ ] Copy install command writes to clipboard
- [ ] Tab switch updates left text + right visual
- [ ] Partner links open in new tab with `noopener`
- [ ] No console errors on load (ignore GitHub rate-limit if gracefully handled)

### Engineering

- [ ] TypeScript clean
- [ ] Build green
- [ ] No double nav
- [ ] No i18n dead UI
- [ ] No `[!code` in any touched files
- [ ] Docs routes still render (spot-check `/docs` and one rule page)

---

## 6. Reference snippets (source — adapt, don’t paste blindly)

### Home composition

```tsx
// easyp/docs/src/pages/HomePage.tsx
<div className="min-h-screen bg-background text-white">
  <Navbar />
  <Hero />
  <TrustedBy />
  <FeatureSwitcher />
  <ArchitectureComparison />
  <Footer />
</div>
```

### Footer link rewrites (example)

```tsx
// OLD → NEW
"/docs/guide/cli/linter/linter"  → "/docs/cli/linter"
"/docs/guide/api-service/overview" → "/docs/api-service/overview"
"/docs" → "/docs"
"https://github.com/easyp-tech/easyp"
"https://t.me/easyptech"
```

### Hero title keys (en.json)

```json
"hero": {
  "badge": { "license": "Apache 2.0 License" },
  "title": "The Modern Standard for",
  "titleHighlight": "Protobuf Workflows",
  "subtitle": "A unified Git-native toolkit for linting, code generation, and dependency management. Fully Open Source.",
  "exploreDocs": "Explore Documentation"
}
```

---

## 7. Out of scope / defer

- Russian homepage / LanguageSwitcher
- Blog listing page at `/blog` (unless you add a thin redirect)
- Registry section
- Sponsor / Enterprise nav items (commented out in source)
- Deploy / DNS cutover
- Changing docs MDX or migrate script

---

## 8. When done — message for the validator agent

Include:

1. **Sequential thinking:** confirm MCP used (yes / unavailable + fallback plan); 1–2 sentence summary of key planning decisions from that chain  
2. Option A vs B for nav/layout  
3. List of new files  
4. `npm run build` result  
5. Screenshots or description of sections on `/`  
6. Any intentional visual/copy deviations from `easyp/docs`  
7. Any follow-ups you recommend  

---

## 9. Quick commands

```bash
cd /Users/zergslaw/Tech/easyp-tech/docs-fumadocs
npm install
npm run dev          # http://localhost:3000/
npm run build
```

Optional visual reference: open production `https://easyp.tech/` if available, **but treat `easyp/docs/src/**` as the code source of truth**.

---

**End of task prompt.**  
**Start with sequential-thinking MCP. Use it throughout. Implement the port fully; do not leave TODOs for core sections.**
)
