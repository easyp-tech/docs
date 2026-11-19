/**
 * Writes data/registry-snapshot.json: every plugin version registered on
 * plugins.easyp.tech, read through its public MCP endpoint.
 *
 * The /plugins page reads the live registry itself (cached for ten minutes).
 * This snapshot is only what it shows when the registry cannot be reached —
 * at build time in CI, or while the service is down — so a stale snapshot is
 * harmless, and an empty page is not.
 *
 * Usage: npm run sync:registry [-- --url https://host/mcp]
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { fetchRegistry, REGISTRY_MCP_URL } from '../lib/registry-mcp.ts'

const urlFlag = process.argv.indexOf('--url')
const url = urlFlag > -1 ? process.argv[urlFlag + 1] : REGISTRY_MCP_URL

const data = await fetchRegistry(url)
data.rows.sort(
  (a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name) || a.version.localeCompare(b.version),
)

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'registry-snapshot.json')
// One version per line: a refreshed snapshot then diffs as added and removed versions.
const { rows, ...meta } = data
const head = JSON.stringify(meta).slice(0, -1)
writeFileSync(out, `${head},"rows":[\n${rows.map((r) => JSON.stringify(r)).join(',\n')}\n]}\n`)

const plugins = new Set(data.rows.map((r) => `${r.group}/${r.name}`)).size
console.log(`${out}: ${plugins} plugins, ${data.rows.length} versions (service ${data.serverVersion})`)
