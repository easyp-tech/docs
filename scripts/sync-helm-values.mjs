/**
 * Render the Helm chart's values.yaml as a reference page.
 *
 * Reads deploy/charts/easyp-service/values.yaml (and Chart.yaml) at a git ref of
 * the service repository and writes:
 *   content/docs/api-service/helm-values.mdx      EN page
 *   content/docs/api-service/helm-values.ru.mdx   RU page
 *
 * Every description is the chart's own comment for that key, quoted as written,
 * so the page cannot say anything the chart does not. The chart mostly comments
 * whole blocks, so a key without its own comment is shown with a dash rather
 * than an invented description.
 *
 * Usage: npm run sync:helm-values -- [--ref v1.0.2] [--service ../service]
 * `npm run sync:service` runs this and sync:plugins at the newest service tag.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import semver from 'semver'
import YAML, { isMap, isScalar, isSeq } from 'yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const REPO_URL = 'https://github.com/easyp-tech/service'
const CHART = 'deploy/charts/easyp-service'

// Maps whose keys are data, not settings: rendered as one value.
const OPAQUE_MAPS = new Set(['config.license.publicKeys'])

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}

const serviceDir = path.resolve(ROOT, arg('service', '../service'))

function git(...args) {
  return execFileSync('git', ['-C', serviceDir, ...args], {
    encoding: 'utf8',
    maxBuffer: 64 << 20,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function newestTag() {
  const tags = git('tag', '--list', 'v*').split('\n').filter((t) => semver.valid(t))
  if (tags.length === 0) throw new Error(`no v* tags in ${serviceDir}`)
  return tags.sort(semver.rcompare)[0]
}

function clean(comment) {
  if (!comment) return ''
  return comment
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !/^-{5,}$/.test(line))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function kind(node) {
  if (isMap(node)) return 'map'
  if (isSeq(node)) return 'list'
  if (!isScalar(node)) return 'unknown'
  const v = node.value
  if (v === null) return 'null'
  if (typeof v === 'boolean') return 'boolean'
  if (typeof v === 'number') return Number.isInteger(v) ? 'integer' : 'number'
  return 'string'
}

function display(node) {
  const value = node.toJSON()
  if (typeof value === 'string') return JSON.stringify(value)
  return JSON.stringify(value)
}

// Walks the document and returns one row per leaf. The comment for a key is the
// block above it; the first key of a nested map has its block attached to the
// map instead, and a trailing "# ..." on the same line is the value's comment.
function leaves(map, prefix, out) {
  map.items.forEach((pair, index) => {
    const key = String(pair.key.value)
    const name = prefix ? `${prefix}.${key}` : key
    const above = pair.key.commentBefore || (index === 0 ? map.commentBefore : '')
    const inline = pair.value?.comment
    const comment = [clean(above), clean(inline)].filter(Boolean).join(' ')
    const node = pair.value

    if (isMap(node) && node.items.length > 0 && !OPAQUE_MAPS.has(name)) {
      out.push({ section: true, name, comment })
      leaves(node, name, out)
      return
    }
    out.push({ name, type: kind(node), value: display(node), comment })
  })
  return out
}

function escapeCell(text) {
  return text
    .replace(/\|/g, '\\|')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;')
}

function code(text) {
  return `<code>${escapeCell(text)}</code>`
}

const ref = arg('ref', undefined) ?? newestTag()
const commit = git('rev-parse', `${ref}^{commit}`).trim()
const doc = YAML.parseDocument(git('show', `${ref}:${CHART}/values.yaml`))
const chart = YAML.parse(git('show', `${ref}:${CHART}/Chart.yaml`))
const header = clean(doc.commentBefore)

const top = doc.contents.items.map((pair, index) => {
  const key = String(pair.key.value)
  const above = pair.key.commentBefore || (index === 0 ? doc.contents.commentBefore : '')
  const rows = isMap(pair.value) && pair.value.items.length > 0 ? leaves(pair.value, key, []) : [
    { name: key, type: kind(pair.value), value: display(pair.value), comment: clean(pair.value?.comment) },
  ]
  return { key, comment: clean(above), rows }
})

const leafCount = top.reduce((n, s) => n + s.rows.filter((r) => !r.section).length, 0)

const text = {
  en: {
    title: 'Helm Values Reference',
    description: `Every value of the easyp-service Helm chart ${chart.version}, with the chart's own description.`,
    intro: [
      `Every value in \`values.yaml\` of the \`easyp-service\` chart **${chart.version}** (app ${chart.appVersion}),`,
      `${leafCount} in total. Descriptions are the chart's own comments, quoted as written, which is why they are in`,
      'English on both language versions of this page. What must be set and what is dangerous is summarised in',
      '[Installation](/docs/api-service/installation); `config.*` values map to the',
      '[service configuration](/docs/api-service/configuration). The chart mostly comments whole blocks, so a key',
      'marked — is covered by the paragraph above its table or by the notes below it.',
    ],
    show: 'The same file, for the version you install:',
    header: 'The file opens with',
    none: '—',
    cols: ['Key', 'Type', 'Default', 'Description'],
    generated: `Generated from ${REPO_URL}/blob/${ref}/${CHART}/values.yaml by \`npm run sync:helm-values\`. Do not edit by hand.`,
  },
  ru: {
    title: 'Справочник значений Helm',
    description: `Все значения Helm-чарта easyp-service ${chart.version} с описаниями из самого чарта.`,
    intro: [
      `Все значения \`values.yaml\` чарта \`easyp-service\` **${chart.version}** (приложение ${chart.appVersion}),`,
      `всего ${leafCount}. Описания — это комментарии самого чарта, процитированные как есть, поэтому они на`,
      'английском в обеих языковых версиях страницы. Что обязательно задать и что опасно — кратко в',
      '[Установке](/ru/docs/api-service/installation); значения `config.*` соответствуют',
      '[конфигурации сервиса](/ru/docs/api-service/configuration). Чарт в основном комментирует целые блоки, поэтому',
      'ключ с «—» описан абзацем над его таблицей или заметками под ней.',
    ],
    show: 'Тот же файл для устанавливаемой версии:',
    header: 'Файл начинается с',
    none: '—',
    cols: ['Ключ', 'Тип', 'По умолчанию', 'Описание'],
    generated: `Сгенерировано из ${REPO_URL}/blob/${ref}/${CHART}/values.yaml командой \`npm run sync:helm-values\`. Не редактируйте вручную.`,
  },
}

function render(lang) {
  const t = text[lang]
  const out = [
    '---',
    `title: "${t.title}"`,
    `description: "${t.description}"`,
    '---',
    '',
    `{/* ${t.generated} */}`,
    '',
    ...t.intro,
    '',
    t.show,
    '',
    '```bash',
    `helm show values oci://ghcr.io/easyp-tech/charts/easyp-service --version ${chart.version}`,
    '```',
    '',
  ]

  if (header) out.push(`${t.header}:`, '', `> ${escapeCell(header)}`, '')

  for (const section of top) {
    out.push(`## ${section.key}`, '')
    if (section.comment) out.push(escapeCell(section.comment), '')
    out.push(`| ${t.cols.join(' | ')} |`, '|---|---|---|---|')
    for (const row of section.rows) {
      if (row.section) continue
      const description = row.comment ? escapeCell(row.comment) : t.none
      out.push(`| ${code(row.name)} | ${row.type} | ${code(row.value)} | ${description} |`)
    }
    const nested = section.rows.filter((r) => r.section && r.comment)
    if (nested.length > 0) {
      out.push('')
      for (const n of nested) out.push(`- ${code(n.name)}: ${escapeCell(n.comment)}`)
    }
    out.push('')
  }

  return out.join('\n')
}

const pageDir = path.join(ROOT, 'content/docs/api-service')
fs.writeFileSync(path.join(pageDir, 'helm-values.mdx'), render('en'))
fs.writeFileSync(path.join(pageDir, 'helm-values.ru.mdx'), render('ru'))

console.log(`helm values ${ref} (${commit.slice(0, 7)}), chart ${chart.version}: ${leafCount} values`)
