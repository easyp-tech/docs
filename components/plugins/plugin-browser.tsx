'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronDown, Copy, ExternalLink, FileCode2, Package, Search, X } from 'lucide-react'
import type { AppLocale } from '@/lib/i18n'
import { pluginsCopy } from '@/lib/plugins-copy'
import { cn } from '@/lib/cn'

export interface BrowserPlugin {
  id: string
  group: string
  name: string
  versions: string[]
  latest: string
  updatedAt: string
  recipeUrl: string
  source: { label: string; url: string } | null
}

function remoteLine(host: string, id: string, version: string): string {
  return `- remote: "${host}/${id}:${version}"`
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      window.setTimeout(() => setCopied((current) => (current === key ? null : current)), 1600)
    } catch {
      setCopied(null)
    }
  }
  return { copied, copy }
}

export function PluginBrowser({
  locale,
  host,
  plugins,
  groups,
}: {
  locale: AppLocale
  host: string
  plugins: BrowserPlugin[]
  groups: Array<{ name: string; count: number }>
}) {
  const t = pluginsCopy(locale).browser
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<string | null>(null)
  const [open, setOpen] = useState<Set<string>>(new Set())
  const { copied, copy } = useCopy()

  const visible = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    return plugins.filter((p) => {
      if (group && p.group !== group) return false
      const haystack = `${p.id} ${p.source?.label ?? ''}`.toLowerCase()
      return terms.every((term) => haystack.includes(term))
    })
  }, [plugins, query, group])

  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <section aria-label="Plugins" className="mx-auto w-full min-w-0 max-w-7xl px-6 pb-24">
      <div className="sticky top-14 z-20 -mx-2 mb-8 rounded-2xl border border-fd-border bg-fd-background/85 p-3 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex w-full shrink-0 items-center lg:w-80">
            <Search size={16} className="pointer-events-none absolute left-3.5 text-fd-muted-foreground" />
            <span className="sr-only">{t.search}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search}
              className="w-full rounded-xl border border-fd-border bg-fd-card py-2.5 pr-3 pl-10 text-sm text-fd-foreground placeholder:text-fd-muted-foreground focus:border-fd-primary/60 focus:outline-none focus:ring-2 focus:ring-fd-primary/20"
            />
          </label>
          <div
            className="no-scrollbar flex min-w-0 flex-1 gap-1.5 overflow-x-auto"
            role="group"
            aria-label="Publishers"
          >
            <GroupChip active={group === null} onClick={() => setGroup(null)} label={t.all} count={plugins.length} />
            {groups.map((g) => (
              <GroupChip
                key={g.name}
                active={group === g.name}
                onClick={() => setGroup(group === g.name ? null : g.name)}
                label={g.name}
                count={g.count}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 px-1 text-xs text-fd-muted-foreground" aria-live="polite">
          {t.shown(visible.length, plugins.length)}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-fd-border py-20 text-center">
          <Package size={28} className="text-fd-muted-foreground" />
          <p className="text-fd-muted-foreground">
            {t.empty}: <span className="font-mono text-fd-foreground">{query}</span>
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setGroup(null)
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-fd-border px-3 py-1.5 text-sm text-fd-foreground transition-colors hover:border-fd-primary/50 hover:text-fd-primary"
          >
            <X size={14} />
            {t.clear}
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((plugin) => {
            const expanded = open.has(plugin.id)
            const latestKey = `${plugin.id}:${plugin.latest}`
            return (
              <li
                key={plugin.id}
                className="group/card flex min-w-0 flex-col rounded-2xl border border-fd-border bg-fd-card/70 p-5 transition-colors hover:border-fd-primary/40 hover:bg-fd-card"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium tracking-wide text-fd-muted-foreground">
                      {plugin.group}
                    </p>
                    <h3 className="truncate font-mono text-lg font-semibold text-fd-foreground">{plugin.name}</h3>
                  </div>
                  <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs text-emerald-300">
                    {plugin.latest}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => copy(latestKey, remoteLine(host, plugin.id, plugin.latest))}
                  title={`${t.copy}: ${host}/${plugin.id}:${plugin.latest}`}
                  className="mb-4 flex w-full cursor-pointer items-center gap-2 rounded-lg border border-fd-border bg-fd-background/60 px-3 py-2 text-left font-mono text-xs text-fd-muted-foreground transition-colors hover:border-fd-primary/50 hover:text-fd-foreground"
                >
                  <code className="no-scrollbar flex-1 overflow-x-auto whitespace-nowrap">
                    <span className="opacity-50">remote: </span>
                    {plugin.id}:{plugin.latest}
                  </code>
                  {copied === latestKey ? (
                    <Check size={14} className="shrink-0 text-emerald-400" aria-label={t.copied} />
                  ) : (
                    <Copy size={14} className="shrink-0" aria-label={t.copy} />
                  )}
                </button>

                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-fd-muted-foreground">
                  <button
                    type="button"
                    onClick={() => toggle(plugin.id)}
                    aria-expanded={expanded}
                    className="inline-flex cursor-pointer items-center gap-1 transition-colors hover:text-fd-primary"
                  >
                    {t.versions(plugin.versions.length)}
                    <ChevronDown size={13} className={cn('transition-transform', expanded && 'rotate-180')} />
                  </button>
                  <span className="ml-auto flex items-center gap-3">
                    <a
                      href={plugin.recipeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 transition-colors hover:text-fd-primary"
                    >
                      <FileCode2 size={13} />
                      {t.recipe}
                    </a>
                    {plugin.source && (
                      <a
                        href={plugin.source.url}
                        target="_blank"
                        rel="noreferrer"
                        title={plugin.source.label}
                        className="inline-flex items-center gap-1 transition-colors hover:text-fd-primary"
                      >
                        <ExternalLink size={13} />
                        {plugin.source.url.includes('pkg.go.dev')
                          ? 'pkg.go.dev'
                          : plugin.source.url.includes('crates.io')
                            ? 'crates.io'
                            : 'PyPI'}
                      </a>
                    )}
                  </span>
                </div>

                {expanded && (
                  <div className="mt-4 border-t border-fd-border pt-4">
                    <p className="mb-2 text-xs text-fd-muted-foreground">{t.versionHint}</p>
                    <ul className="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto">
                      {plugin.versions.map((version) => {
                        const key = `${plugin.id}:${version}`
                        return (
                          <li key={version}>
                            <button
                              type="button"
                              onClick={() => copy(key, remoteLine(host, plugin.id, version))}
                              className={cn(
                                'cursor-pointer rounded-md border px-2 py-0.5 font-mono text-xs transition-colors',
                                copied === key
                                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                                  : 'border-fd-border text-fd-muted-foreground hover:border-fd-primary/50 hover:text-fd-foreground',
                              )}
                            >
                              {copied === key ? t.copied : version}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

function GroupChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
        active
          ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground'
          : 'border-fd-border text-fd-muted-foreground hover:border-fd-primary/50 hover:text-fd-foreground',
      )}
    >
      {label}
      <span className={cn('tabular-nums', active ? 'opacity-80' : 'opacity-60')}>{count}</span>
    </button>
  )
}
