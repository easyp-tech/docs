import snapshot from '@/data/registry-snapshot.json'
import catalog from '@/data/plugin-catalog.json'
import { fetchRegistry, REGISTRY_HOST, type RegistryFetch, type RegistryRow } from './registry-mcp'

export { REGISTRY_HOST }

export interface RegistryPlugin {
  /** "group/name" */
  id: string
  group: string
  name: string
  /** Newest first, compared as numbers — what the service resolves `latest` to is versions[0]. */
  versions: string[]
  latest: string
  /** createdAt of the newest registration, ISO. */
  updatedAt: string
  recipeUrl: string
  source: { label: string; url: string } | null
}

export interface RegistryView {
  plugins: RegistryPlugin[]
  groups: Array<{ name: string; count: number }>
  totalVersions: number
  serverVersion: string
  platform: string
  fetchedAt: string
  /** false when the live registry did not answer and the bundled snapshot is shown. */
  live: boolean
}

const RECIPES = 'https://github.com/easyp-tech/service/tree/master/registry'

function parts(version: string): number[] | null {
  const match = /^v(\d+)\.(\d+)(?:\.(\d+))?$/.exec(version)
  if (!match) return null
  return [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)]
}

/** Same order as the service's `latest`: numbers part by part, unparsable last. */
export function compareVersionsDesc(a: string, b: string): number {
  const pa = parts(a)
  const pb = parts(b)
  if (pa && !pb) return -1
  if (!pa && pb) return 1
  if (pa && pb) {
    for (let i = 0; i < 3; i++) {
      if (pa[i] !== pb[i]) return pb[i] - pa[i]
    }
  }
  return b.localeCompare(a)
}

type CatalogSource = { kind?: string; value?: string } | null

function sourceLink(source: CatalogSource): RegistryPlugin['source'] {
  if (!source?.kind || !source.value) return null
  switch (source.kind) {
    case 'go':
      return { label: source.value, url: `https://pkg.go.dev/${source.value}` }
    case 'crate':
      return { label: `crates.io/${source.value}`, url: `https://crates.io/crates/${source.value}` }
    case 'pip':
      return { label: `PyPI ${source.value}`, url: `https://pypi.org/project/${source.value}/` }
    default:
      return null
  }
}

const sources = new Map<string, CatalogSource>(
  (catalog.plugins as Array<{ group: string; name: string; source: CatalogSource }>).map((p) => [
    `${p.group}/${p.name}`,
    p.source,
  ]),
)

function toView(data: RegistryFetch, live: boolean): RegistryView {
  const byId = new Map<string, RegistryRow[]>()
  for (const row of data.rows) {
    const id = `${row.group}/${row.name}`
    const list = byId.get(id)
    if (list) list.push(row)
    else byId.set(id, [row])
  }

  const plugins: RegistryPlugin[] = [...byId.entries()]
    .map(([id, rows]) => {
      const versions = [...new Set(rows.map((r) => r.version))].sort(compareVersionsDesc)
      const updatedAt = rows.reduce((max, r) => (r.createdAt > max ? r.createdAt : max), '')
      const { group, name } = rows[0]
      return {
        id,
        group,
        name,
        versions,
        latest: versions[0],
        updatedAt,
        recipeUrl: `${RECIPES}/${group}/${name}`,
        source: sourceLink(sources.get(id) ?? null),
      }
    })
    .sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name))

  const groupCounts = new Map<string, number>()
  for (const p of plugins) groupCounts.set(p.group, (groupCounts.get(p.group) ?? 0) + 1)

  return {
    plugins,
    groups: [...groupCounts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    totalVersions: data.rows.length,
    serverVersion: data.serverVersion,
    platform: data.platform,
    fetchedAt: data.fetchedAt,
    live,
  }
}

const TTL_MS = 10 * 60 * 1000

let lastGood: { data: RegistryFetch; at: number } | null = null
let inFlight: Promise<RegistryFetch | null> | null = null

async function refresh(): Promise<RegistryFetch | null> {
  try {
    const data = await fetchRegistry()
    if (data.rows.length === 0) return null
    lastGood = { data, at: Date.now() }
    return data
  } catch (error) {
    console.error('registry: live listing failed', error)
    return null
  } finally {
    inFlight = null
  }
}

/**
 * The live registry, kept in memory for ten minutes, so plugins.easyp.tech
 * sees one listing per ten minutes per site instance, not one per visitor.
 * Concurrent requests share one refresh. When the registry does not answer,
 * the last good listing stays; before there is one, the bundled snapshot.
 *
 * Deliberately not Next's fetch cache: the MCP calls carry a per-session
 * header, and a cached initialize answer would hand out a dead session.
 */
export async function getRegistry(): Promise<RegistryView> {
  if (!lastGood || Date.now() - lastGood.at > TTL_MS) {
    inFlight ??= refresh()
    await inFlight
  }
  if (lastGood) return toView(lastGood.data, true)
  return toView(snapshot as RegistryFetch, false)
}
