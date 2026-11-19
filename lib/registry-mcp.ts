/**
 * Reads every registered plugin version from a running EasyP API Service
 * through its public MCP endpoint (`plugins_list`).
 *
 * Plain fetch and no imports, so the same code runs inside Next (the /plugins
 * page) and under `node --experimental-strip-types` (scripts/sync-registry.ts,
 * which writes the fallback snapshot).
 *
 * The endpoint is streamable HTTP with sessions: initialize returns an
 * Mcp-Session-Id, every later call carries it, and answers arrive as SSE
 * (`event: message` / `data: {...}`). One page holds at most 1000 versions.
 */

export const REGISTRY_HOST = 'plugins.easyp.tech'
export const REGISTRY_MCP_URL = `https://${REGISTRY_HOST}/mcp`

export interface RegistryRow {
  group: string
  name: string
  version: string
  createdAt: string
}

export interface RegistryFetch {
  rows: RegistryRow[]
  /** serverInfo.version of the service that answered, e.g. "1.3.2". */
  serverVersion: string
  /** os/arch the service builds plugins for, e.g. "linux/amd64". */
  platform: string
  fetchedAt: string
}

const PAGE_SIZE = 1000
const MAX_PAGES = 50
const TIMEOUT_MS = 15_000

interface JsonRpcResponse {
  result?: Record<string, unknown>
  error?: { code: number; message: string }
}

function parseSse(body: string): JsonRpcResponse {
  const trimmed = body.trim()
  if (trimmed.startsWith('{')) return JSON.parse(trimmed) as JsonRpcResponse

  const data = trimmed
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart())
    .join('\n')
  if (!data) throw new Error('MCP answer has no data line')
  return JSON.parse(data) as JsonRpcResponse
}

async function post(
  url: string,
  payload: unknown,
  sessionId?: string,
): Promise<{ answer: JsonRpcResponse | null; sessionId: string | null }> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      'User-Agent': 'easyp-docs',
      ...(sessionId ? { 'Mcp-Session-Id': sessionId } : {}),
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: 'no-store',
  })
  if (!response.ok) {
    throw new Error(`MCP ${response.status} ${response.statusText}`)
  }

  const text = await response.text()
  const answer = text.trim() === '' ? null : parseSse(text)
  if (answer?.error) {
    throw new Error(`MCP error ${answer.error.code}: ${answer.error.message}`)
  }
  return { answer, sessionId: response.headers.get('mcp-session-id') }
}

export async function fetchRegistry(url: string = REGISTRY_MCP_URL): Promise<RegistryFetch> {
  const init = await post(url, {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2025-06-18',
      capabilities: {},
      clientInfo: { name: 'easyp-docs', version: '1' },
    },
  })
  const sessionId = init.sessionId
  if (!sessionId) throw new Error('MCP initialize returned no session id')

  const serverInfo = (init.answer?.result?.serverInfo ?? {}) as { version?: string }

  try {
    await post(url, { jsonrpc: '2.0', method: 'notifications/initialized' }, sessionId)

    const rows: RegistryRow[] = []
    let platform = ''
    let pageToken: string | undefined

    for (let page = 0; page < MAX_PAGES; page++) {
      const { answer } = await post(
        url,
        {
          jsonrpc: '2.0',
          id: 2 + page,
          method: 'tools/call',
          params: {
            name: 'plugins_list',
            arguments: { pageSize: PAGE_SIZE, ...(pageToken ? { pageToken } : {}) },
          },
        },
        sessionId,
      )

      const result = answer?.result as { isError?: boolean; structuredContent?: Record<string, unknown> } | undefined
      if (!result || result.isError || !result.structuredContent) {
        throw new Error('plugins_list returned no structured content')
      }

      const content = result.structuredContent as {
        plugins?: Array<Partial<RegistryRow>>
        nextPageToken?: string
        platform?: string
      }
      for (const plugin of content.plugins ?? []) {
        if (plugin.group && plugin.name && plugin.version) {
          rows.push({
            group: plugin.group,
            name: plugin.name,
            version: plugin.version,
            createdAt: plugin.createdAt ?? '',
          })
        }
      }
      platform = content.platform || platform
      pageToken = content.nextPageToken || undefined
      if (!pageToken) break
    }

    return {
      rows,
      serverVersion: serverInfo.version ?? '',
      platform,
      fetchedAt: new Date().toISOString(),
    }
  } finally {
    // Free the session on the server; failure here changes nothing for us.
    await fetch(url, {
      method: 'DELETE',
      headers: { 'Mcp-Session-Id': sessionId },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    }).catch(() => undefined)
  }
}
