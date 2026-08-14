# AGENTS.md

Guide for AI agents working in **`docs-fumadocs/`** — the public EasyP documentation site (Fumadocs + Next.js).

## Product context (read this first)

| Concern | Where | URL |
|---------|--------|-----|
| **This package** | Public docs UI + content | future `easyp.tech` /docs (not production yet) |
| Content source (historical) | `../docs/content/{en,ru}` | dual-write / migrate input |
| Legacy Vite docs site | `../docs/site` | still exists; **do not edit for new docs** |
| Production docs (until cutover) | may still live under `easyp/docs` elsewhere | live site |
| Brand tokens | `../brand` → local copy `styles/brand-variables.css` | design system |
| Portal (cabinet) | `../portal` | `app.easyp.tech` |
| Plugin API service | `../service` | `api.*` |
| CLI | `easyp` (sibling / separate repo) | — |

**Boundaries**

- This is **documentation only** — no portal auth, no plugin execution, no CLI source.
- Prefer editing **`content/docs/**`** for page text. Use migrate only when re-importing from `../docs/content`.
- **Locales:** EN default (`page.mdx` → `/docs/...`), RU siblings (`page.ru.mdx` → `/ru/docs/...`). See `lib/i18n.ts`.
- **Theme:** Docs and marketing home both support light/dark via `--color-fd-*` / `bg-fd-*` tokens. Prefer `fd-*` over hardcoded `slate-*`/`text-white` on home.
- Do **not** revive Blume or the Vite site as the primary docs stack.
- Do **not** reintroduce Shiki notation (`// [!code focus]`, `// [!code ++]`, `// [!code --]`). Agents and readers get plain code fences.
- Do **not** strip `*.ru.mdx` after migrate; i18n is wired.

## Stack

- **Next.js** App Router + **Fumadocs** (`fumadocs-core`, `fumadocs-ui`, `fumadocs-mdx`)
- **React 19**, **Tailwind CSS 4**, **TypeScript**
- Content: MDX under `content/docs/` + `meta.json` page trees
- Search: `app/api/search/route.ts`
- LLM surfaces: `/llms.txt`, `/llms-full.txt`, `/llms.mdx/docs/...`
- OG images: `/og/docs/...`

## Repository layout

```
docs-fumadocs/
├── app/                    # Next.js routes
│   ├── (home)/             # Marketing home `/`
│   ├── [lang]/docs/        # Docs layout + `[[...slug]]` (en|ru)
│   ├── api/search/         # Full-text search API
│   ├── llms.txt|llms-full.txt|llms.mdx/  # Agent/LLM feeds (locale in path for ru)
│   ├── og/docs/            # Open Graph images (locale in slug for ru)
│   ├── global.css          # Fumadocs + EasyP brand overrides
│   └── layout.tsx
├── components/             # mdx.tsx, home/*, i18n-root, document-lang
├── content/docs/           # ★ EN *.mdx + RU *.ru.mdx
│   ├── meta.json           # Root nav order
│   ├── index.mdx
│   ├── introduction/
│   ├── cli/                # linter, generator, package-manager, breaking-changes, …
│   ├── api-service/
│   ├── migration/
│   ├── ci-cd/
│   └── blog/
├── lib/                    # source loader, layout options, shared constants
├── scripts/migrate-content.mjs
├── source.config.ts        # fumadocs-mdx collections
├── styles/brand-variables.css  # copied/generated brand CSS (not Turbopack-friendly from ../brand)
├── public/logo.svg
├── next.config.mjs         # redirects (legacy /docs/guide/** → /docs/**)
├── package.json
├── README.md               # Human-oriented docs
└── AGENTS.md               # This file
```

## Commands

```bash
cd docs-fumadocs
npm install
npm run dev                 # http://localhost:3000
npm run build               # production build
npm run start
npm run types:check
npm run migrate:content     # EN + RU into content/docs (destructive rewrite)
# INCLUDE_RU=0 npm run migrate:content   # EN only
```

URLs: EN `/docs/...`, RU `/ru/docs/...` (middleware; app route is `app/[lang]/docs/**`).

## Information architecture (URLs)

No `guide/` segment. Flat product tree:

| Path | Section |
|------|---------|
| `/` | Home |
| `/docs` | Docs index |
| `/docs/introduction/*` | what-is, quickstart, install |
| `/docs/cli/*` | CLI overview, config, linter, generator, package-manager, breaking-changes, auto-completion |
| `/docs/cli/linter/rules/*` | Per-rule pages |
| `/docs/cli/breaking-changes/rules/*` | Breaking-change rules |
| `/docs/api-service/*` | Remote plugin service |
| `/docs/migration/*` | Buf, protoc, prototool, protolock |
| `/docs/ci-cd/*` | GitHub Actions, GitLab |
| `/docs/blog/*` | Blog posts |

Legacy redirects live in `next.config.mjs` (`/docs/guide/:path*` → `/docs/:path*`, deduped leaf paths).

## Content rules (mandatory)

### Frontmatter

```mdx
---
title: "Human Title"
description: "Optional one-liner"
---
```

- Title is shown by Fumadocs (`DocsTitle`); **do not** add a leading `# H1` that duplicates it.
- Rule pages: human titles (`Comment Field`), not `COMMENT_FIELD`.

### MDX / Callouts

Use Fumadocs `<Callout>` (not raw VitePress `:::` in new edits):

```mdx
<Callout type="info">
Helpful note with a [link](/docs/introduction/quickstart).
</Callout>
```

Types: `info` | `warn` | `error` | `success` (map tip/note → `info`).

### Code blocks

- Use fenced blocks with a language tag (`proto`, `yaml`, `bash`, `json`, …).
- Prefer `proto` / `protobuf` for `.proto` samples.
- **No** `// [!code focus]`, `// [!code ++]`, `// [!code --]`, or `# [!code …]`.
  Migrate strips them; do not re-add.
- Bad/Good examples: plain sequential fences under `### Bad` / `### Good`.

### MDX escaping

Prose outside fences must not leave raw `{` `}` or ambiguous `<Type>` generics — migrate escapes these. When writing by hand:

- Prefer backticks for code identifiers: `` `Foo[T]` ``
- Or use Callout / fences so raw braces stay inside code.

### Navigation (`meta.json`)

Each folder can have `meta.json`:

```json
{
  "title": "Section",
  "pages": ["index", "page-a", "folder-b"]
}
```

Order in `pages` = sidebar order. After adding a page, register it in the nearest `meta.json`.

### Links

- Internal: absolute docs paths `/docs/...` (not `/guide/...`).
- External Console: `https://app.easyp.tech`.
- After rename/move, update inbound links and redirects if needed.

## Theme / brand

- Tokens: `styles/brand-variables.css` (from `@easyp/brand`; avoid importing `../brand` via Turbopack path issues).
- Semantic overrides: `app/global.css` (`.dark` EasyP blue on Fumadocs `--color-fd-*`).
- Default `color-scheme: dark`.
- Logo: `public/logo.svg`; nav title in `lib/layout.shared.tsx`.
- Fonts: Inter + JetBrains Mono via Next font in root layout.

Do not introduce a second design system or CSS framework.

## App code rules

- Keep layouts thin; content belongs in MDX.
- Source API: `lib/source.ts` (`loader` + page tree). Prefer extending Fumadocs patterns over custom routers.
- Shared constants: `lib/shared.ts` (`appName`, routes, gitConfig).
- MDX components: extend `components/mdx.tsx` only when needed site-wide.
- Search / LLM / OG routes: keep working when changing slug structure.

## Migrate script

`scripts/migrate-content.mjs`:

1. Reads `../docs/content/en` (optional RU with `INCLUDE_RU=1`).
2. Converts callouts, strips HTML comments, **strips code notations**, fixes links, escapes MDX, writes `.mdx` + regenerates `meta.json` trees.
3. **Overwrites** `content/docs/` — any manual-only edits in that tree can be lost on full re-migrate.

When editing content long-term:

- Prefer **direct edits** in `content/docs/**`.
- If re-running migrate, port manual fixes into the script or into `../docs/content` first, or re-apply after migrate.

## What not to do

- Do not point day-to-day work at `../docs/site` (legacy Vite).
- Do not add RU locale routes without an explicit i18n design (files alone are not enough).
- Do not commit secrets, env with tokens, or large binary assets without need.
- Do not `rm -rf` `.next` / `node_modules` as a “fix” without diagnosing first.
- Do not change production deploy targets without user confirmation (this site is pre-cutover).

## Quick checklist for content PRs

1. Page in the right IA folder; registered in `meta.json`.
2. Frontmatter title; no duplicate H1.
3. Callouts as `<Callout>`; code fences clean.
4. Internal links under `/docs/...`.
5. `npm run build` (or at least `npm run dev` smoke on the page).
6. If migrate touched the file: confirm focus/diff markers were not reintroduced.

## Related reading

- `README.md` — setup, architecture, IA details for humans
- Fumadocs: https://fumadocs.dev
- Brand package: `../brand`
)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
