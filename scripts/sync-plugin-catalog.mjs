/**
 * Snapshot the EasyP API Service plugin catalogue into this site.
 *
 * Reads registry/<group>/<name>/plugin.yaml from a git ref of the service
 * repository (a local clone, ../service by default) and writes:
 *   data/plugin-catalog.json                              the snapshot
 *   content/docs/api-service/plugin-catalog.mdx           EN page
 *   content/docs/api-service/plugin-catalog.ru.mdx        RU page
 *
 * The pages are MDX rather than a component reading the JSON so that search
 * and llms.txt index every plugin name.
 *
 * Usage: npm run sync:plugins -- [--ref v1.0.2] [--service ../service]
 * Without --ref the newest v* tag of the service repository is used.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import semver from 'semver'
import YAML from 'yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const REPO_URL = 'https://github.com/easyp-tech/service'

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}

const serviceDir = path.resolve(ROOT, arg('service', '../service'))

function git(...args) {
  return execFileSync('git', ['-C', serviceDir, ...args], { encoding: 'utf8', maxBuffer: 64 << 20 })
}

function newestTag() {
  const tags = git('tag', '--list', 'v*').split('\n').filter((t) => semver.valid(t))
  if (tags.length === 0) throw new Error(`no v* tags in ${serviceDir}`)
  return tags.sort(semver.rcompare)[0]
}

// Registry versions are vX.Y or vX.Y.Z; protobuf's own runtimes ship as v33.1.
function toSemver(version) {
  const v = semver.coerce(version)
  if (!v) throw new Error(`unparseable version ${version}`)
  return v.version
}

// Build args that name where the plugin comes from. Anything else stays behind
// the link to the recipe rather than being guessed at.
function sourceOf(buildArgs = {}) {
  if (buildArgs.GO_MODULE) return { kind: 'go', value: buildArgs.GO_MODULE }
  if (buildArgs.CRATE_NAME) return { kind: 'crate', value: buildArgs.CRATE_NAME }
  if (buildArgs.PIP_PACKAGE) return { kind: 'pip', value: buildArgs.PIP_PACKAGE }
  return null
}

function readCatalog(ref) {
  const files = git('ls-tree', '-r', '--name-only', ref, 'registry')
    .split('\n')
    .filter((f) => /^registry\/[^/]+\/[^/]+\/plugin\.yaml$/.test(f))

  const plugins = files.map((file) => {
    const [, group, name] = file.split('/')
    const doc = YAML.parse(git('show', `${ref}:${file}`)) ?? {}
    const versions = (doc.versions ?? [])
      .map((entry) => (typeof entry === 'string' ? { version: entry } : entry))
      .filter((entry) => !entry.skip)
      .map((entry) => entry.version)
      .sort((a, b) => semver.rcompare(toSemver(a), toSemver(b)))

    return { group, name, versions, source: sourceOf(doc.build_args) }
  })

  return plugins
    .filter((p) => p.versions.length > 0)
    .sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name))
}

const ref = arg('ref', undefined) ?? newestTag()
const commit = git('rev-parse', `${ref}^{commit}`).trim()
const plugins = readCatalog(ref)
const versionCount = plugins.reduce((n, p) => n + p.versions.length, 0)

const snapshot = {
  generatedBy: 'scripts/sync-plugin-catalog.mjs',
  service: { repository: REPO_URL, ref, commit },
  counts: { plugins: plugins.length, versions: versionCount },
  plugins,
}

fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true })
fs.writeFileSync(path.join(ROOT, 'data/plugin-catalog.json'), `${JSON.stringify(snapshot, null, 2)}\n`)

const groups = [...new Set(plugins.map((p) => p.group))]

const text = {
  en: {
    title: 'Plugin Catalog',
    description: 'Every plugin recipe the EasyP API Service ships, with its versions.',
    intro: [
      `This is the catalogue in the service repository at **${ref}**: **${plugins.length} plugins**`,
      `in **${versionCount} versions**. Each entry is a build recipe in \`registry/\`, not a plugin that`,
      'is running somewhere — a deployment has only the versions its operator built and registered',
      '(a Community licence allows 10). See [Plugins](/docs/api-service/plugins) for how to build and',
      'register them, and [Client usage](/docs/api-service/client-usage) for `easyp.yaml`.',
    ],
    usage: 'Once a version is registered on your service, reference it as:',
    pin: 'Always pin the version. Without one the service picks the registered version that sorts last *as a string*, so `v1.36.9` wins over `v1.36.10`. The versions below are sorted by semantic version, newest first.',
    generated: `Generated from ${REPO_URL}/tree/${ref}/registry by \`npm run sync:plugins\`. Do not edit by hand.`,
    groupsHeading: 'Groups',
    groupCols: ['Group', 'Plugins', 'Versions'],
    cols: ['Plugin', 'Newest', 'Versions', 'Source', 'All versions'],
    recipe: 'recipe',
  },
  ru: {
    title: 'Каталог плагинов',
    description: 'Все рецепты плагинов, которые поставляет EasyP API Service, с их версиями.',
    intro: [
      `Это каталог репозитория сервиса на **${ref}**: **${plugins.length} плагинов**`,
      `в **${versionCount} версиях**. Каждая запись — рецепт сборки в \`registry/\`, а не плагин, который`,
      'где-то уже работает: в развёртывании есть только версии, которые оператор собрал и',
      'зарегистрировал (лицензия Community допускает 10). Как их собрать и зарегистрировать —',
      'в [Плагинах](/ru/docs/api-service/plugins), как указать в `easyp.yaml` — в',
      '[Использовании клиентами](/ru/docs/api-service/client-usage).',
    ],
    usage: 'Когда версия зарегистрирована на вашем сервисе, ссылайтесь на неё так:',
    pin: 'Всегда фиксируйте версию. Без неё сервис выбирает зарегистрированную версию, последнюю *при сравнении строк*, так что `v1.36.9` побеждает `v1.36.10`. Версии ниже отсортированы по семантической версии, самые новые первыми.',
    generated: `Сгенерировано из ${REPO_URL}/tree/${ref}/registry командой \`npm run sync:plugins\`. Не редактируйте вручную.`,
    groupsHeading: 'Группы',
    groupCols: ['Группа', 'Плагинов', 'Версий'],
    cols: ['Плагин', 'Новейшая', 'Версий', 'Источник', 'Все версии'],
    recipe: 'рецепт',
  },
}

function sourceCell(source) {
  if (!source) return '—'
  if (source.kind === 'go') return `[Go \`${source.value}\`](https://pkg.go.dev/${source.value})`
  if (source.kind === 'crate') return `[crate \`${source.value}\`](https://crates.io/crates/${source.value})`
  return `[PyPI \`${source.value}\`](https://pypi.org/project/${source.value}/)`
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
    t.usage,
    '',
    '```yaml',
    'generate:',
    '  plugins:',
    '    - remote: "plugins.example.com/protocolbuffers/go:v1.36.10"',
    '      out: gen/go',
    '```',
    '',
    '<Callout type="warn">',
    t.pin,
    '</Callout>',
    '',
    `## ${t.groupsHeading}`,
    '',
    `| ${t.groupCols.join(' | ')} |`,
    '|---|---|---|',
    ...groups.map((g) => {
      const inGroup = plugins.filter((p) => p.group === g)
      const n = inGroup.reduce((s, p) => s + p.versions.length, 0)
      return `| [\`${g}\`](#${g}) | ${inGroup.length} | ${n} |`
    }),
    '',
  ]

  for (const g of groups) {
    out.push(`## ${g}`, '', `| ${t.cols.join(' | ')} |`, '|---|---|---|---|---|')
    for (const p of plugins.filter((x) => x.group === g)) {
      const recipe = `${REPO_URL}/tree/${ref}/registry/${p.group}/${p.name}`
      out.push(
        `| \`${p.group}/${p.name}\` ([${t.recipe}](${recipe})) | \`${p.versions[0]}\` | ${p.versions.length} | ${sourceCell(p.source)} | ${p.versions.map((v) => `\`${v}\``).join(', ')} |`,
      )
    }
    out.push('')
  }

  return out.join('\n')
}

const pageDir = path.join(ROOT, 'content/docs/api-service')
fs.writeFileSync(path.join(pageDir, 'plugin-catalog.mdx'), render('en'))
fs.writeFileSync(path.join(pageDir, 'plugin-catalog.ru.mdx'), render('ru'))

console.log(`plugin catalogue ${ref} (${commit.slice(0, 7)}): ${plugins.length} plugins, ${versionCount} versions`)
