/**
 * Import docs/content into Fumadocs content/docs
 * - Preserve existing fenced code blocks (never re-indent them)
 * - Callouts → <Callout type="..."> (MDX)
 * - Escape { } and < > outside fences for MDX safety
 * - Human titles for RULE_NAMES
 * - Strip body H1 (DocsTitle uses frontmatter)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC = path.resolve(ROOT, '../docs/content')
const DEST = path.join(ROOT, 'content/docs')
// Always import RU (dot-parser siblings: page.ru.mdx). Opt out with INCLUDE_RU=0
const INCLUDE_RU = process.env.INCLUDE_RU !== '0'

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, files)
    else if (ent.isFile() && ent.name.endsWith('.md')) files.push(p)
  }
  return files
}

/** Split into segments: {type:'fence'|'text', value} */
function splitFences(text) {
  const re = /(```[\s\S]*?```)/g
  const parts = []
  let last = 0
  let m
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: 'text', value: text.slice(last, m.index) })
    parts.push({ type: 'fence', value: m[0] })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) })
  return parts
}

/** Convert 4-space indented code blocks to fences — only in non-fence text */
function indentCodeToFences(text) {
  const lines = text.split('\n')
  const out = []
  let i = 0
  while (i < lines.length) {
    if (
      lines[i].startsWith('    ') &&
      !lines[i].startsWith('    -') &&
      !lines[i].startsWith('    *') &&
      !/^\s{4}\d+\./.test(lines[i])
    ) {
      const block = []
      while (i < lines.length && (lines[i].startsWith('    ') || lines[i] === '')) {
        if (lines[i] === '' && block.length > 0) {
          let j = i + 1
          while (j < lines.length && lines[j] === '') j++
          if (j < lines.length && lines[j].startsWith('    ')) {
            block.push('')
            i++
            continue
          }
          break
        }
        if (lines[i].startsWith('    ')) {
          block.push(lines[i].slice(4))
          i++
        } else break
      }
      if (block.length === 0) continue
      const joined = block.join('\n')
      let lang = ''
      if (/syntax\s*=/.test(joined) || /\b(message|enum|service|rpc)\s+\w+/.test(joined))
        lang = 'protobuf'
      else if (/^\s*(go|npm|brew|easyp)\s/.test(joined) || /protoc-gen/.test(joined))
        lang = 'bash'
      else if (/plugins:/.test(joined) || /lint:/.test(joined)) lang = 'yaml'
      out.push('```' + lang, ...block, '```')
      continue
    }
    out.push(lines[i])
    i++
  }
  return out.join('\n')
}

function mapCalloutType(kind) {
  const k = kind.toLowerCase()
  if (k === 'tip' || k === 'note' || k === 'info' || k === 'details') return 'info'
  if (k === 'warning' || k === 'warn') return 'warn'
  if (k === 'danger' || k === 'error') return 'error'
  if (k === 'success') return 'success'
  return 'info'
}

function normalizeCallouts(text) {
  text = text.replace(/^:::(\s+)(tip|info|warning|danger|note|success)\b/gim, ':::$2')
  text = text.replace(
    /<div\s+class="(tip|warning|danger|info|details)\s+custom-block"[^>]*>\s*([\s\S]*?)\s*<\/div>/gi,
    (_, kind, body) => {
      const t = mapCalloutType(kind)
      return `<Callout type="${t}">\n${body.trim()}\n</Callout>`
    },
  )
  text = text.replace(
    /^:::(tip|info|warning|danger|note|success)\s*\n([\s\S]*?)^:::\s*$/gim,
    (_, type, body) => {
      const t = mapCalloutType(type)
      return `<Callout type="${t}">\n${body.trim()}\n</Callout>`
    },
  )
  return text
}

function fixLinks(text) {
  text = text.replaceAll('/docs/guide/', '/docs/')
  text = text.replace(/\]\(\/guide\//g, '](/docs/')
  text = text.replace(/\]\(\.\/guide\//g, '](/docs/')
  text = text.replace(/\]\(\.\.\/introduction\//g, '](/docs/introduction/')
  text = text.replace(/\]\(\.\.\/cli\//g, '](/docs/cli/')
  text = text.replace(/\]\(\/blog\//g, '](/docs/blog/')
  text = text.replaceAll('/docs/cli/linter/linter', '/docs/cli/linter')
  text = text.replaceAll('/docs/cli/breaking-changes/breaking-changes', '/docs/cli/breaking-changes')
  text = text.replaceAll('/docs/cli/generator/generator', '/docs/cli/generator')
  text = text.replaceAll('/docs/cli/package-manager/package-manager', '/docs/cli/package-manager')
  text = text.replaceAll('/docs/cli/configuration/configuration', '/docs/cli/configuration')
  text = text.replaceAll('/docs/cli/auto-completion/auto-completion', '/docs/cli/auto-completion')
  text = text.replace(/!\[([^\]]*)\]\(https:\/\/starchart\.cc[^)]+\)/g, '')
  return text
}

function stripHtmlComments(text) {
  return text.replace(/<!--[\s\S]*?-->/g, '')
}

/**
 * Strip Shiki/VitePress code notations (focus, diff, …).
 * Agents and plain reading don't need blur/highlight chrome.
 * Keeps trailing real comments after the notation token.
 */
function stripCodeNotations(text) {
  text = text.replace(/[ \t]*\/\/[ \t]*\[!code[ \t]+[^\]]+\][ \t]*(.*)$/gm, (_, rest) => {
    rest = (rest || '').trim()
    if (!rest) return ''
    if (rest.startsWith('//')) return ' ' + rest
    return ' // ' + rest
  })
  text = text.replace(/[ \t]*#[ \t]*\[!code[ \t]+[^\]]+\][ \t]*(.*)$/gm, (_, rest) => {
    rest = (rest || '').trim()
    if (!rest) return ''
    if (rest.startsWith('#')) return ' ' + rest
    return ' # ' + rest
  })
  text = text.replace(/[ \t]*<!--[ \t]*\[!code[ \t]+[^\]]+\][ \t]*-->[ \t]*/g, '')
  text = text.replace(/\[!code[ \t]+[^\]]+\]/g, '')
  return text
}

/** Humanize ENUM_PASCAL_CASE → Enum Pascal Case */
function humanizeRuleTitle(name) {
  if (!/^[A-Z][A-Z0-9_]+$/.test(name)) return name
  return name
    .split('_')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ')
}

function extractTitle(text, relPath) {
  const fm = text.match(/^---\n([\s\S]*?)\n---/)
  if (fm) {
    const t = fm[1].match(/^title:\s*["']?(.+?)["']?\s*$/m)
    if (t) return t[1].replace(/^["']|["']$/g, '')
  }
  const h1 = text.match(/^#\s+(.+)$/m)
  if (h1) return h1[1].trim()
  const base = path.basename(relPath, '.md')
  if (base === 'index') return humanizeRuleTitle(path.basename(path.dirname(relPath)))
  return humanizeRuleTitle(base.replace(/-/g, '_').toUpperCase() === base ? base : base)
}

function buildFrontmatter(title, description) {
  const t = humanizeRuleTitle(title.replace(/[<>]/g, '').trim())
  // If title was SCREAMING, humanize; if already sentence case, keep
  const finalTitle =
    /^[A-Z0-9_]+$/.test(title.trim()) ? humanizeRuleTitle(title.trim()) : t
  let fm = `---\ntitle: ${JSON.stringify(finalTitle)}\n`
  if (description) fm += `description: ${JSON.stringify(description)}\n`
  fm += `---\n\n`
  return fm
}

/** Remove first H1 (Fumadocs DocsTitle already shows title) */
function stripFirstH1(text) {
  return text.replace(/^#\s+.+\n+/, '')
}

/**
 * Escape MDX-dangerous chars outside fences.
 * Protect <Callout>...</Callout> blocks.
 */
function escapeMdxText(text) {
  // Split Callout blocks first
  const re = /(<Callout\b[^>]*>[\s\S]*?<\/Callout>)/gi
  return text
    .split(re)
    .map((seg) => {
      if (/^<Callout\b/i.test(seg)) return seg
      // Protect inline code, then escape angles and braces
      return seg
        .split(/(`[^`]*`)/g)
        .map((chunk, i) => {
          if (i % 2 === 1) return chunk // inline code — leave as-is
          return chunk
            // Escape any <...> except Callout tags (generics, Go types in prose)
            .replace(/<[^>\n]+>/g, (full) => {
              if (/^<\/?Callout\b/i.test(full)) return full
              return full.replace(/</g, '&lt;').replace(/>/g, '&gt;')
            })
            .replace(/\{/g, '\0OB\0')
            .replace(/\}/g, '\0CB\0')
            .replace(/\0OB\0/g, "{'{'}")
            .replace(/\0CB\0/g, "{'}'}")
        })
        .join('')
    })
    .join('')
}

function processMarkdown(raw, relPath) {
  let text = raw
  text = stripHtmlComments(text)
  text = stripCodeNotations(text)

  // Only transform non-fence regions for indent→fence
  text = splitFences(text)
    .map((p) => (p.type === 'fence' ? p.value : indentCodeToFences(p.value)))
    .join('')

  // Callouts on full text (usually outside fences)
  text = splitFences(text)
    .map((p) => (p.type === 'fence' ? p.value : normalizeCallouts(p.value)))
    .join('')

  text = fixLinks(text)

  const titleRaw = extractTitle(text, relPath)
  // strip existing frontmatter
  text = text.replace(/^---\n[\s\S]*?\n---\n*/, '')
  text = stripFirstH1(text.trimStart())

  // Always MDX + escape: prose often has Go generics / {braces} outside fences
  text = splitFences(text)
    .map((p) => (p.type === 'fence' ? p.value : escapeMdxText(p.value)))
    .join('')

  const body = buildFrontmatter(titleRaw) + text.trim() + '\n'
  return { text: body, mdx: true }
}

function writeMeta(dir, title, pages) {
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(
    path.join(dir, 'meta.json'),
    JSON.stringify({ title, pages }, null, 2) + '\n',
  )
}

/** For non-default locales, rewrite absolute /docs links to /{locale}/docs */
function rewriteLocaleDocsLinks(text, locale) {
  if (!locale || locale === 'en') return text
  // markdown links ](/docs/...) and bare href="/docs/...
  return text
    .replace(/\]\(\/docs\//g, `](/${locale}/docs/`)
    .replace(/href="\/docs\//g, `href="/${locale}/docs/`)
    .replace(/href='\/docs\//g, `href='/${locale}/docs/`)
}

function importLocale(locale, suffix) {
  const srcRoot = path.join(SRC, locale)
  let n = 0
  for (const f of walk(srcRoot)) {
    if (f.endsWith('TRANSLATION_STATUS.md')) continue
    const rel = path.relative(srcRoot, f)
    let { text } = processMarkdown(fs.readFileSync(f, 'utf8'), rel)
    if (suffix) text = rewriteLocaleDocsLinks(text, suffix)
    const base = rel.replace(/\.md$/, '')
    // Always .mdx so Callout works; escape handles braces
    const outName = suffix ? `${base}.${suffix}.mdx` : `${base}.mdx`
    const out = path.join(DEST, outName)
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.writeFileSync(out, text)
    n++
  }
  return n
}

function writeAllMeta() {
  writeMeta(DEST, 'EasyP', [
    'index',
    'introduction',
    'cli',
    'api-service',
    'migration',
    'ci-cd',
    'blog',
  ])
  writeMeta(path.join(DEST, 'introduction'), 'Introduction', [
    'what-is',
    'quickstart',
    'install',
  ])
  writeMeta(path.join(DEST, 'cli'), 'CLI', [
    'index',
    'configuration',
    'linter',
    'breaking-changes',
    'generator',
    'package-manager',
    'auto-completion',
  ])
  writeMeta(path.join(DEST, 'cli/linter'), 'Linter', ['index', 'rules'])
  const rulesDir = path.join(DEST, 'cli/linter/rules')
  if (fs.existsSync(rulesDir)) {
    const rules = fs
      .readdirSync(rulesDir)
      .filter((f) => f.endsWith('.mdx') && !f.includes('.ru.'))
      .map((f) => f.replace(/\.mdx$/, ''))
      .sort()
    writeMeta(rulesDir, 'Rules', rules)
  }
  writeMeta(path.join(DEST, 'cli/breaking-changes'), 'Breaking changes', [
    'index',
    'rules',
  ])
  const brDir = path.join(DEST, 'cli/breaking-changes/rules')
  if (fs.existsSync(brDir)) {
    const rules = fs
      .readdirSync(brDir)
      .filter((f) => f.endsWith('.mdx') && !f.includes('.ru.'))
      .map((f) => f.replace(/\.mdx$/, ''))
      .sort()
    writeMeta(brDir, 'Rules', rules)
  }
  writeMeta(path.join(DEST, 'cli/generator'), 'Generator', ['index', 'examples'])
  writeMeta(path.join(DEST, 'cli/generator/examples'), 'Examples', [
    'go',
    'grpc-gateway',
    'validate',
  ])
  writeMeta(path.join(DEST, 'cli/package-manager'), 'Package manager', [
    'index',
    'easyp-vs-buf',
  ])
  writeMeta(path.join(DEST, 'api-service'), 'API Service', ['overview'])
  writeMeta(path.join(DEST, 'migration'), 'Migration', [
    'buf-cli',
    'protoc',
    'protolock',
    'prototool',
  ])
  writeMeta(path.join(DEST, 'ci-cd'), 'CI/CD', ['github-actions', 'gitlab'])
  writeMeta(path.join(DEST, 'blog'), 'Blog', [
    'finally-give-up-gin-echo',
    'working-with-proto-errors-correctly',
  ])
  writeMeta(path.join(DEST, 'guides'), 'Guides', [
    'adding-dependencies',
    'version-diamond',
    'microservice-isolation',
    'replace-debugging',
    'organization-lint-style',
    'breaking-checks-ci',
    'multi-target-generation',
    'build-reproducibility',
    'buf-migration',
  ])
}

fs.rmSync(DEST, { recursive: true, force: true })
fs.mkdirSync(DEST, { recursive: true })

const enCount = importLocale('en', null)
const ruCount = INCLUDE_RU ? importLocale('ru', 'ru') : 0

fs.writeFileSync(
  path.join(DEST, 'cli/index.mdx'),
  `---
title: "CLI"
description: "EasyP command-line toolkit: lint, generate, mod, breaking."
---

The EasyP CLI is the local toolkit for Protocol Buffers workflows.

| Command | Purpose |
|---------|---------|
| \`easyp lint\` | Enforce API design rules |
| \`easyp breaking\` | Detect breaking changes |
| \`easyp generate\` | Run local/remote plugins |
| \`easyp mod\` | Git-based dependencies |
| \`easyp init\` | Project bootstrap |

## Sections

- [Configuration](/docs/cli/configuration)
- [Linter](/docs/cli/linter)
- [Breaking changes](/docs/cli/breaking-changes)
- [Generator](/docs/cli/generator)
- [Package manager](/docs/cli/package-manager)
- [Auto-completion](/docs/cli/auto-completion)
`,
)

if (INCLUDE_RU) {
  fs.writeFileSync(
    path.join(DEST, 'cli/index.ru.mdx'),
    `---
title: "CLI"
description: "CLI EasyP: lint, generate, mod, breaking."
---

CLI EasyP — локальный инструментарий для Protocol Buffers.

| Команда | Назначение |
|---------|------------|
| \`easyp lint\` | Правила API-дизайна |
| \`easyp breaking\` | Обнаружение breaking changes |
| \`easyp generate\` | Локальные/удалённые плагины |
| \`easyp mod\` | Git-зависимости |
| \`easyp init\` | Инициализация проекта |

## Разделы

- [Конфигурация](/ru/docs/cli/configuration)
- [Линтер](/ru/docs/cli/linter)
- [Breaking changes](/ru/docs/cli/breaking-changes)
- [Генератор](/ru/docs/cli/generator)
- [Менеджер пакетов](/ru/docs/cli/package-manager)
- [Автодополнение](/ru/docs/cli/auto-completion)
`,
  )
}

fs.writeFileSync(
  path.join(DEST, 'index.mdx'),
  `---
title: "EasyP Documentation"
description: "Modern Protocol Buffers toolkit — lint, generate, packages, breaking changes."
---

Modern Protocol Buffers toolkit: linting, package management, code generation, and breaking-change detection.

<Callout type="info">
New here? Start with the [Quickstart](/docs/introduction/quickstart).
</Callout>

## Start here

- [What is EasyP?](/docs/introduction/what-is)
- [Quickstart](/docs/introduction/quickstart)
- [Installation](/docs/introduction/install)

## Product areas

- [CLI](/docs/cli) — local lint, generate, packages, breaking checks
- [API Service](/docs/api-service/overview) — remote plugin execution
- [Migration](/docs/migration/buf-cli) — from Buf, protoc, and others
- [CI/CD](/docs/ci-cd/github-actions) — GitHub Actions & GitLab
- [Blog](/docs/blog/finally-give-up-gin-echo)
`,
)

if (INCLUDE_RU) {
  fs.writeFileSync(
    path.join(DEST, 'index.ru.mdx'),
    `---
title: "Документация EasyP"
description: "Современный инструментарий Protocol Buffers — lint, generate, packages, breaking changes."
---

Современный инструментарий Protocol Buffers: линтинг, управление пакетами, генерация кода и проверка breaking changes.

<Callout type="info">
Впервые здесь? Начните с [Quickstart](/ru/docs/introduction/quickstart).
</Callout>

## С чего начать

- [Что такое EasyP?](/ru/docs/introduction/what-is)
- [Quickstart](/ru/docs/introduction/quickstart)
- [Установка](/ru/docs/introduction/install)

## Разделы

- [CLI](/ru/docs/cli) — lint, generate, packages, breaking checks
- [API Service](/ru/docs/api-service/overview) — удалённое выполнение плагинов
- [Миграция](/ru/docs/migration/buf-cli) — с Buf, protoc и других
- [CI/CD](/ru/docs/ci-cd/github-actions) — GitHub Actions и GitLab
- [Блог](/ru/docs/blog/finally-give-up-gin-echo)
`,
  )
}

writeAllMeta()

console.log(
  `Migrated EN=${enCount} RU=${ruCount} pages into content/docs (INCLUDE_RU=${INCLUDE_RU})`,
)
console.log({ enCount, ruCount, dest: DEST })
