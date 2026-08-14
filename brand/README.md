# EasyP Brand (`@easyp/brand`)

Локальный package design tokens для **EasyP**. Не отдельный git-remote (пока).

## Product map

| Surface | URL | Accent |
|---------|-----|--------|
| Marketing + docs | `easyp.tech` | **Blue / violet** (`semantic.marketing`) |
| Portal / ЛК | `app.easyp.tech` | **Slate primary + emerald accent** (`semantic.light` / `dark`) |

Оба делят **одну палитру** (`tokens/colors.json`), но **разные semantic roles**. Это осознанно, не баг.

## Single source of truth

```text
tokens/*.json     ← EDIT HERE ONLY
       │
       ▼  npm run generate
css/variables.css      (AUTO)
tailwind/preset.js     (AUTO)
tokens/index.js        (re-exports JSON for JS)
```

**Не правь** `css/variables.css` и `tailwind/preset.js` руками.

```bash
cd brand
npm run generate   # after any token change
```

`prepare` script runs generate on `npm install` of this package.

## Structure

```text
brand/
├── tokens/
│   ├── colors.json
│   ├── typography.json
│   ├── radii.json
│   ├── shadows.json
│   ├── spacing.json
│   ├── semantic.json      # light / dark (portal) + marketing (docs)
│   ├── index.js
│   └── index.d.ts
├── scripts/generate.mjs
├── css/variables.css      # generated
├── tailwind/preset.js     # generated (ESM)
└── assets/logo.svg
```

## Consumers

### `docs/site` (Tailwind)

```json
"@easyp/brand": "file:../../brand"
```

- `src/index.css`: `@import "@easyp/brand/css/variables.css";`
- `tailwind.config.js`: `presets: [easypPreset]`
- `index.html`: `data-brand="marketing"` / `class="brand-marketing"` so semantic CSS vars map to **product blue**

### `portal/clients/web` (MUI)

```json
"@easyp/brand": "file:../../../brand"
```

- `main.tsx`: `import '@easyp/brand/css/variables.css'`
- `theme/index.ts`: `import { colors, typography, radii, resolveSemantic } from '@easyp/brand/tokens'`
- Document `.dark` / `data-theme` synced from theme mode for CSS vars

## What belongs where

| `@easyp/brand` | `docs/site` | `portal/clients/web` |
|----------------|-------------|----------------------|
| Palette, fonts, radii, shadows, spacing | Markdown chrome, TOC, search | Dashboard layout, auth forms |
| Marketing + portal semantic roles | Callouts, Prism | MUI component overrides (using tokens) |
| Logo SVG assets | Docs-only layout | App-only chrome |

## Change a token

1. Edit `tokens/*.json`
2. `npm run generate` in `brand/`
3. Rebuild consumers (`docs/site`, `portal/clients/web`)

## Later: extract to own repo

Package is already private npm-shaped (`@easyp/brand`). Move folder → publish or git dependency → replace `file:` paths.

## Non-goals (now)

- Full UI kit (Button/Card)
- Separate GitHub remote
- Touching production `easyp/docs`
