import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Bot, Boxes, Layers, Radio, Tag } from 'lucide-react'
import { isAppLocale, type AppLocale } from '@/lib/i18n'
import { getRegistry, REGISTRY_HOST } from '@/lib/registry'
import { pluginsCopy } from '@/lib/plugins-copy'
import { PluginBrowser } from '@/components/plugins/plugin-browser'
import { CopyBlock } from '@/components/plugins/copy-block'
import { cn } from '@/lib/cn'

/**
 * Rendered per request from a listing that lib/registry keeps for ten minutes,
 * so the page shows what is registered without a site rebuild or redeploy.
 */
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isAppLocale(lang)) notFound()
  const t = pluginsCopy(lang)
  return { title: t.metaTitle, description: t.metaDescription }
}

function base(lang: AppLocale): string {
  return lang === 'en' ? '' : `/${lang}`
}

export default async function PluginsPage({ params }: Props) {
  const { lang } = await params
  if (!isAppLocale(lang)) notFound()
  const t = pluginsCopy(lang)
  const registry = await getRegistry()

  const goPlugin = registry.plugins.find((p) => p.id === 'protocolbuffers/go')
  const grpcPlugin = registry.plugins.find((p) => p.id === 'grpc/go')
  const snippet = [
    'generate:',
    '  inputs:',
    '    - directory: { path: ., root: proto }',
    '  plugins:',
    `    - remote: "${REGISTRY_HOST}/protocolbuffers/go:${goPlugin?.latest ?? 'v1.36.11'}"`,
    '      out: gen/go',
    '      opts: { paths: source_relative }',
    `    - remote: "${REGISTRY_HOST}/grpc/go:${grpcPlugin?.latest ?? 'v1.6.0'}"`,
    '      out: gen/go',
    '      opts: { paths: source_relative }',
  ].join('\n')

  const listedAt = new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(registry.fetchedAt))

  const stats = [
    { icon: Boxes, value: registry.plugins.length, label: t.stats.plugins },
    { icon: Tag, value: registry.totalVersions, label: t.stats.versions },
    { icon: Layers, value: registry.groups.length, label: t.stats.groups },
  ]

  return (
    <div className="relative isolate flex flex-1 flex-col bg-fd-background text-fd-foreground">
      <section className="relative overflow-hidden pt-24 pb-14 lg:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-fd-primary/20 opacity-30 blur-[120px]"
        />
        <div className="relative mx-auto grid max-w-7xl items-end gap-10 px-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div>
            <div className="animate-fade-in-up mb-6 flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
                  registry.live
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-300',
                )}
              >
                <span className="relative flex h-2 w-2">
                  {registry.live && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={cn(
                      'relative inline-flex h-2 w-2 rounded-full',
                      registry.live ? 'bg-emerald-400' : 'bg-amber-400',
                    )}
                  />
                </span>
                {registry.live ? t.badgeLive : t.badgeSnapshot}
              </span>
              {registry.serverVersion && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-muted/80 px-3 py-1 font-mono text-xs text-fd-muted-foreground">
                  <Radio size={12} className="text-fd-primary" />
                  service {registry.serverVersion}
                  {registry.platform && <span className="opacity-60">· {registry.platform}</span>}
                </span>
              )}
            </div>

            <h1 className="animate-fade-in-up mb-5 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight [animation-delay:80ms] md:text-6xl">
              {t.title} <span className="text-gradient font-mono">{REGISTRY_HOST}</span>
            </h1>
            <p className="animate-fade-in-up max-w-2xl text-lg leading-relaxed text-fd-muted-foreground [animation-delay:160ms]">
              {t.subtitle}
            </p>
          </div>

          <div>
            <dl className="animate-fade-in-up grid grid-cols-3 gap-3 [animation-delay:240ms]">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="glass-panel rounded-2xl px-4 py-4">
                  <dt className="sr-only">{label}</dt>
                  <dd>
                    <Icon size={16} className="mb-2 text-fd-primary" />
                    <span className="block text-2xl font-semibold tabular-nums md:text-3xl">
                      {value.toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US')}
                    </span>
                    <span className="text-sm text-fd-muted-foreground">{label}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-fd-muted-foreground">
              {t.listedAt} {listedAt} UTC
            </p>
            {!registry.live && (
              <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                {t.snapshotNote}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto mb-14 grid w-full max-w-7xl grid-cols-1 gap-4 px-6 lg:grid-cols-5">
        <div className="glass-panel min-w-0 rounded-2xl p-6 lg:col-span-3">
          <h2 className="mb-1.5 text-lg font-semibold">{t.quickstart.title}</h2>
          <p className="mb-4 text-sm text-fd-muted-foreground">{t.quickstart.body}</p>
          <CopyBlock code={snippet} label="Copy easyp.yaml" copiedLabel={t.browser.copied} />
          <Link
            href={`${base(lang)}/docs/api-service/client-usage`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary hover:underline"
          >
            {t.quickstart.docs}
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="glass-panel flex min-w-0 flex-col rounded-2xl p-6 lg:col-span-2">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary">
            <Bot size={18} />
          </div>
          <h2 className="mb-1.5 text-lg font-semibold">{t.quickstart.agents}</h2>
          <p className="mb-4 text-sm text-fd-muted-foreground">{t.quickstart.agentsBody}</p>
          <CopyBlock code={`https://${REGISTRY_HOST}/mcp`} label="Copy MCP URL" copiedLabel={t.browser.copied} />
          <p className="mt-4 mb-2 text-sm text-fd-muted-foreground">Claude Code:</p>
          <CopyBlock
            code={`claude mcp add --transport http easyp-plugins https://${REGISTRY_HOST}/mcp`}
            label="Copy command"
            copiedLabel={t.browser.copied}
          />
          <Link
            href={`${base(lang)}/docs/api-service/mcp`}
            className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-fd-primary hover:underline"
          >
            MCP
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <PluginBrowser locale={lang} host={REGISTRY_HOST} plugins={registry.plugins} groups={registry.groups} />

      <section className="mx-auto mb-24 w-full max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-fd-border bg-fd-card/50 p-6 md:flex-row md:items-center">
          <div>
            <h2 className="mb-1 font-semibold">{t.footer.catalogTitle}</h2>
            <p className="max-w-2xl text-sm text-fd-muted-foreground">{t.footer.catalogBody}</p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Link
              href={`${base(lang)}/docs/api-service/plugin-catalog`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-fd-border px-4 py-2 text-sm font-medium transition-colors hover:border-fd-primary/50 hover:text-fd-primary"
            >
              {t.footer.catalogLink}
            </Link>
            <Link
              href={`${base(lang)}/roadmap`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
            >
              {t.footer.roadmapLink}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
