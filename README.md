# EasyP Docs (Fumadocs + Next.js)

Public documentation site for **EasyP** — lint, generate, package management, and breaking-change checks for Protocol Buffers.

| | |
|---|---|
| **Stack** | Next.js App Router, Fumadocs, React 19, Tailwind CSS 4, TypeScript |
| **Content** | MDX under `content/docs/` (~80 EN + ~80 RU) |
| **Status** | **Not production yet.** Live docs remain on the previous stack until cutover. |
| **Dev URL** | http://localhost:3000 |

This package lives in the EasyP monorepo workspace as `docs-fumadocs/`. It replaced an earlier Blume spike; the legacy Vite site in `../docs/site` is retained only as historical/dual-write context.

---

## Quick start

```bash
cd docs-fumadocs
npm install
npm run dev
# → http://localhost:3000
```

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run types:check` | `fumadocs-mdx` + `tsc --noEmit` |
| `npm run migrate:content` | Re-import EN + RU from `../docs/content/{en,ru}` into `content/docs/` |

RU is imported by default as sibling files (`page.ru.mdx`, Fumadocs **dot** parser). Opt out with `INCLUDE_RU=0`.

---

## What this site is (and is not)

**Is**

- Marketing home (`/`) + full documentation tree (`/docs/**`)
- Search (`/api/search`)
- Agent-friendly plain-text feeds (`/llms.txt`, `/llms-full.txt`, per-page `/llms.mdx/docs/...`)
- OG image generation for docs pages
- EasyP brand theming (dark-first blue)

**Is not**

- The product console (`app.easyp.tech` → `../portal`)
- The remote plugin API (`../service`)
- The EasyP CLI source code
- Production deployment until an explicit cutover from the current live docs

---

## Architecture

```
Browser
  │
  ▼
Next.js App Router
  ├── (home)          → `/`  marketing landing
  ├── docs/           → DocsLayout + catch-all `[[...slug]]`
  ├── api/search      → full-text search over the page tree
  ├── llms*.txt|mdx   → LLM/agent consumption
  └── og/docs         → Open Graph images
  │
  ▼
fumadocs-mdx (source.config.ts)
  └── content/docs/**/*.mdx + meta.json
  │
  ▼
lib/source.ts  → loader / page tree / getLLMText / OG helpers
```

Key libraries:

- **fumadocs-core** — source loader, search, LLM helpers, Lucide icons plugin  
- **fumadocs-ui** — docs layout, MDX defaults (including `<Callout>`), theme CSS  
- **fumadocs-mdx** — content collection pipeline (`postinstall` runs `fumadocs-mdx`)  
- **@easyp/brand** — design tokens (local CSS snapshot in `styles/` for Turbopack)

---

## Repository layout

```
docs-fumadocs/
├── app/
│   ├── (home)/page.tsx          # Landing
│   ├── docs/
│   │   ├── layout.tsx           # Sidebar + DocsLayout
│   │   └── [[...slug]]/page.tsx # All doc pages
│   ├── api/search/route.ts
│   ├── llms.txt|llms-full.txt|llms.mdx/
│   ├── og/docs/[...slug]/
│   ├── global.css               # Brand + prose overrides
│   └── layout.tsx               # Root providers, fonts
├── components/mdx.tsx           # MDX component map
├── content/docs/                # ★ Editable documentation
│   ├── meta.json                # Root sidebar order
│   ├── index.mdx
│   ├── introduction/
│   ├── cli/
│   │   ├── linter/rules/        # One MDX per lint rule
│   │   ├── breaking-changes/rules/
│   │   ├── generator/examples/
│   │   └── package-manager/
│   ├── api-service/
│   ├── migration/
│   ├── ci-cd/
│   └── blog/
├── lib/
│   ├── source.ts                # Fumadocs loader
│   ├── layout.shared.tsx        # Nav, GitHub, external links
│   ├── shared.ts                # appName, routes, gitConfig
│   └── cn.ts
├── scripts/migrate-content.mjs  # Import from ../docs/content
├── styles/brand-variables.css   # Generated brand CSS
├── public/logo.svg
├── source.config.ts
├── next.config.mjs              # MDX wrapper + redirects
├── package.json
├── README.md
└── AGENTS.md                    # Instructions for AI agents
```

---

## Information architecture

The old Vite tree used `/docs/guide/**`. That prefix is **gone**. Content is organized by product area:

| URL | Content |
|-----|---------|
| `/` | Home — value prop, CTAs, install one-liner |
| `/docs` | Documentation hub (EN, default) |
| `/ru/docs` | Same hub in Russian |
| `/docs/introduction/what-is` | Product overview (EN) |
| `/ru/docs/introduction/what-is` | То же на русском |
| `/docs/introduction/quickstart` | First success path |
| `/docs/introduction/install` | Install methods |
| `/docs/cli` | CLI overview |
| `/docs/cli/configuration` | `easyp.yaml` and config |
| `/docs/cli/linter` | Linter overview + `rules/*` |
| `/docs/cli/generator` | Codegen + examples (go, grpc-gateway, validate) |
| `/docs/cli/package-manager` | Git-native deps, EasyP vs Buf |
| `/docs/cli/breaking-changes` | Breaking checks + `rules/*` |
| `/docs/cli/auto-completion` | Shell completion |
| `/docs/api-service/overview` | Remote plugin service |
| `/docs/migration/*` | Buf CLI, protoc, prototool, protolock |
| `/docs/ci-cd/*` | GitHub Actions, GitLab |
| `/docs/blog/*` | Long-form posts |

### Redirects

Defined in `next.config.mjs`:

- `/docs/guide/:path*` → `/docs/:path*` (permanent)
- Deduped historical leaves, e.g. `/docs/cli/linter/linter` → `/docs/cli/linter`

---

## Content workflow

### Day-to-day editing (preferred)

1. Edit or add `content/docs/**/*.mdx` (and `*.ru.mdx` for Russian).
2. Register new pages in the nearest `meta.json` `pages` array (shared EN/RU tree).
3. Open EN `/docs/...` and RU `/ru/docs/...` under `npm run dev`.
4. Run `npm run build` before merge when you change app code or many pages.

### Frontmatter

```mdx
---
title: "Comment Field"
description: "Optional SEO / card description"
---
```

Fumadocs renders the title in the page chrome. **Do not** repeat the same string as a top-level `# H1` in the body.

### Callouts

```mdx
<Callout type="info">
Prefer the [Quickstart](/docs/introduction/quickstart) if you are new.
</Callout>
```

| Type | Use for |
|------|---------|
| `info` | Tips, notes, general guidance |
| `warn` | Caveats, deprecations |
| `error` | Hard failures / dangerous ops |
| `success` | Confirmation-style notes |

### Code samples

Use normal fenced blocks:

````mdx
### Bad

```proto
message Foo {
  string bar = 1;
}
```

### Good

```proto
message Foo {
  // bar field for bar logic
  string bar = 1;
}
```
````

**Do not** use Shiki / VitePress line notations:

- `// [!code focus]`
- `// [!code ++]` / `// [!code --]`
- `# [!code …]`

They cause focus blur / diff chrome that hurts readability (especially for agents). The migrate script strips them on import.

### Navigation (`meta.json`)

```json
{
  "title": "CLI",
  "pages": [
    "index",
    "configuration",
    "linter",
    "breaking-changes",
    "generator",
    "package-manager",
    "auto-completion"
  ]
}
```

Folder entries without a matching `page.mdx` resolve as sections with their own `meta.json`.

### Links

- Internal docs: `/docs/...` (absolute from site root)
- Console: `https://app.easyp.tech`
- Avoid leftover `/docs/guide/...` paths (redirects exist, but fix sources)

### MDX gotchas

Outside code fences, MDX treats `{` `}` and some `<...>` as JSX. Identifiers with generics or braces should live in `` `inline code` `` or in fenced blocks. The migrate script auto-escapes prose when re-importing from Markdown.

---

## Locales (EN + RU)

| Locale | Browser URL | Content files |
|--------|-------------|---------------|
| English (default) | `/docs/...` | `*.mdx` without locale suffix |
| Russian | `/ru/docs/...` | `*.ru.mdx` siblings |

- Config: `lib/i18n.ts` (`hideLocale: 'default-locale'`, `parser: 'dot'`)
- App routes: `app/[lang]/docs/**` (proxy rewrites bare `/docs` → internal `/en/docs`)
- Language switcher in Fumadocs nav
- Home `/` stays EN marketing

## Migration from `../docs/content`

Source of truth for copy:

```
../docs/content/en/   →  content/docs/**/*.mdx
../docs/content/ru/   →  content/docs/**/*.ru.mdx
```

```bash
npm run migrate:content
# INCLUDE_RU=0 npm run migrate:content   # EN only
```

The script (`scripts/migrate-content.mjs`) will:

1. Walk EN and RU Markdown trees  
2. Convert indented code / callouts to fences + `<Callout>`  
3. Strip HTML comments and **all `[!code …]` notations**  
4. Rewrite legacy links (`/guide/` → `/docs/`, dedupe leaf paths)  
5. Escape MDX-unsafe prose outside fences  
6. Emit frontmatter titles (humanized rule names)  
7. Strip body H1  
8. Rewrite `meta.json` trees for the normalized IA  
9. Write hub pages `index.mdx` / `index.ru.mdx` and `cli/index(.ru).mdx`  

**Warning:** a full migrate **overwrites** `content/docs/`. Manual edits that exist only in Fumadocs can be lost unless you re-apply them or fold them into the script / upstream content.

Related trees:

| Path | Role |
|------|------|
| `../docs/content` | Markdown SoT for migrate |
| `../docs/site` | Legacy VitePress-style site — do not extend for new docs |
| `../brand` | Design tokens package |
| `../portal` | Product cabinet (`app.easyp.tech`) |

---

## Theming and brand

1. **Tokens** — `styles/brand-variables.css` is generated from `@easyp/brand` (see brand package scripts). Do not hand-edit long-term; regenerate from brand when tokens change.
2. **Semantic mapping** — `app/global.css` maps EasyP colors onto Fumadocs `--color-fd-*` for light and `.dark`.
3. **Themes** — docs and marketing home support light/dark via Fumadocs `--color-fd-*` tokens (`bg-fd-background`, `text-fd-muted-foreground`, etc.).
4. **Chrome** — logo `public/logo.svg`, nav links in `lib/layout.shared.tsx` (Docs, Blog, Console).
5. **Typography** — Inter (UI) + JetBrains Mono (code) via `next/font` in the root layout.

Why a local CSS file instead of importing `../brand` directly? Turbopack/Next can fail on packages outside the app root; the local snapshot keeps builds reliable.

---

## Agent / LLM surfaces

Fumadocs exposes machine-readable docs for coding agents:

| Endpoint | Purpose |
|----------|---------|
| `/llms.txt` | Index of pages |
| `/llms-full.txt` | Full concatenated corpus |
| `/llms.mdx/docs/.../content.md` | Single page as processed Markdown |

`source.config.ts` sets `includeProcessedMarkdown: true` so `getLLMText` / these routes stay accurate. Prefer clean MDX (no focus chrome, clear structure) because agents consume these feeds.

---

## Configuration reference

| File | Responsibility |
|------|----------------|
| `source.config.ts` | Content dir, schemas, MDX options (`remarkImageOptions: false` avoids flaky remote images) |
| `next.config.mjs` | `createMDX()`, permanent redirects |
| `lib/shared.ts` | `appName`, `docsRoute`, OG/LLM base paths, GitHub repo for “edit on GitHub” |
| `lib/layout.shared.tsx` | Nav title, links, GitHub URL |
| `tsconfig.json` | Path aliases (`@/*`) |
| `postcss.config.mjs` | Tailwind 4 pipeline |

---

## Adding a new page

1. Create `content/docs/<section>/my-page.mdx` with frontmatter `title`.
2. Add `"my-page"` to that section’s `meta.json` `pages` array (and create `meta.json` if the folder is new).
3. If the section is brand new at the root, also add it to `content/docs/meta.json`.
4. Link from related pages and from `index.mdx` if it is a top-level entry point.
5. Verify at `http://localhost:3000/docs/<section>/my-page`.
6. Optionally check `/llms.mdx/docs/<section>/my-page/content.md`.

### Adding a lint / breaking rule page

1. File: `content/docs/cli/linter/rules/<kebab-name>.mdx` (or `breaking-changes/rules/`).
2. Register in that folder’s `meta.json`.
3. Structure: short description → Categories → Examples (Bad / Good) → optional Impact / notes.
4. Keep code samples plain; no focus markers.

---

## Development tips

- After `content` changes, Fumadocs/MDX usually hot-reloads; if a new file is missing from the sidebar, restart `npm run dev` or re-run `postinstall` / `fumadocs-mdx`.
- Build failures often come from unescaped `{`/`}` or raw HTML-like tags in prose — put them in code or escape.
- Search index is built from the same source tree; no separate indexing step in dev.
- Port **3000** is the default; free the port if another Next app is already bound.

---

## Production / cutover (not done yet)

When ready to replace the live docs:

1. Confirm IA redirects cover all old public URLs.  
2. Wire hosting (domain, CDN, previews).  
3. Point `easyp.tech/docs` (or apex) at this app.  
4. Freeze or archive `../docs/site` and production `easyp/docs` as appropriate.  
5. Optionally enable RU i18n with proper Fumadocs locale segments.  

Until then, treat this package as the **next-gen docs app** under active development.

---

## Related packages in the workspace

| Path | Description |
|------|-------------|
| `../docs/content` | EN/RU Markdown used by migrate |
| `../docs/site` | Legacy Vite docs UI |
| `../brand` | EasyP design tokens |
| `../portal` | Portal backend + web client |
| `../service` | Plugin codegen API service |

For AI coding agents, see **[AGENTS.md](./AGENTS.md)**.
)
