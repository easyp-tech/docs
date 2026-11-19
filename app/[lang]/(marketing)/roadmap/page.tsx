import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight, Ban, CheckCircle2, CircleDashed, Github, Loader, MessageCircle } from 'lucide-react'
import { isAppLocale } from '@/lib/i18n'
import { roadmap, type Track } from '@/lib/roadmap'
import { cn } from '@/lib/cn'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isAppLocale(lang)) notFound()
  const r = roadmap(lang)
  return { title: r.metaTitle, description: r.metaDescription }
}

const productTone: Record<string, string> = {
  cli: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  service: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
  mcp: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  agents: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  docs: 'border-slate-400/30 bg-slate-400/10 text-slate-300',
}

export default async function RoadmapPage({ params }: Props) {
  const { lang } = await params
  if (!isAppLocale(lang)) notFound()
  const r = roadmap(lang)
  const base = lang === 'en' ? '' : `/${lang}`

  return (
    <div className="relative isolate flex flex-1 flex-col bg-fd-background text-fd-foreground">
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-violet-500/20 opacity-30 blur-[120px]"
        />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <h1 className="animate-fade-in-up mb-5 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
            {r.title} <span className="text-gradient">{r.titleHighlight}</span>
          </h1>
          <p className="animate-fade-in-up mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-fd-muted-foreground [animation-delay:100ms]">
            {r.subtitle}
          </p>
          <ul className="animate-fade-in-up flex flex-wrap justify-center gap-2 [animation-delay:200ms]">
            <Legend icon={CheckCircle2} className="text-emerald-300" label={r.legend.shipped} />
            <Legend icon={Loader} className="text-sky-300" label={r.legend.now} />
            <Legend icon={CircleDashed} className="text-fd-muted-foreground" label={r.legend.next} />
            <Legend icon={Ban} className="text-rose-300" label={r.legend.notPlanned} />
          </ul>
        </div>
      </section>

      {/* Shipped: a timeline, newest first */}
      <section aria-labelledby="shipped" className="mx-auto w-full max-w-5xl px-6 pb-20">
        <SectionTitle
          id="shipped"
          icon={CheckCircle2}
          tone="text-emerald-300"
          title={r.shippedTitle}
          body={r.shippedBody}
        />
        <ol className="relative ml-3 border-l border-fd-border">
          {r.shipped.map((item) => (
            <li key={item.title} className="relative pb-8 pl-8 last:pb-0">
              <span
                aria-hidden
                className="absolute top-1.5 -left-[7px] h-3.5 w-3.5 rounded-full border-2 border-fd-background bg-emerald-400 shadow-[0_0_0_4px_rgb(16_185_129/0.15)]"
              />
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <time className="font-mono text-xs text-fd-muted-foreground">{item.date}</time>
                <span
                  className={cn('rounded-full border px-2 py-0.5 text-[11px] font-medium', productTone[item.product])}
                >
                  {r.products[item.product]}
                </span>
                {item.version && <span className="font-mono text-xs text-fd-foreground">{item.version}</span>}
              </div>
              <h3 className="font-semibold text-fd-foreground">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 hover:text-fd-primary"
                  >
                    {item.title}
                    <ArrowUpRight size={14} className="opacity-50 transition-opacity group-hover:opacity-100" />
                  </a>
                ) : (
                  item.title
                )}
              </h3>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-fd-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Now / Next per product */}
      <section aria-labelledby="ahead" className="mx-auto w-full max-w-7xl px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          <SectionTitle id="ahead" icon={Loader} tone="text-sky-300" title={r.aheadTitle} body={r.aheadBody} />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {r.tracks.map((track) => (
            <TrackCard key={track.product} track={track} labels={r} />
          ))}
        </div>
      </section>

      {/* Not planned */}
      <section aria-labelledby="not-planned" className="mx-auto w-full max-w-5xl px-6 pb-20">
        <SectionTitle
          id="not-planned"
          icon={Ban}
          tone="text-rose-300"
          title={r.notPlannedTitle}
          body={r.notPlannedBody}
        />
        <div className="glass-panel rounded-2xl p-6">
          <ul className="flex flex-wrap gap-2">
            {r.notPlanned.map((command) => (
              <li
                key={command}
                className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-2.5 py-1 font-mono text-xs text-rose-200/80 line-through decoration-rose-400/40"
              >
                {command}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-fd-muted-foreground">{r.notPlannedWhy}</p>
        </div>
      </section>

      <section className="mx-auto mb-24 w-full max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-fd-border bg-gradient-to-br from-fd-primary/15 via-fd-card to-violet-500/10 p-8 text-center">
          <h2 className="mb-2 text-2xl font-semibold tracking-tight">{r.cta.title}</h2>
          <p className="mx-auto mb-6 max-w-xl text-fd-muted-foreground">{r.cta.body}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://github.com/easyp-tech/easyp/issues"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
            >
              <Github size={16} />
              {r.cta.issues}
            </a>
            <a
              href="https://t.me/easyptech"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border px-4 py-2 text-sm font-medium transition-colors hover:border-fd-primary/50 hover:text-fd-primary"
            >
              <MessageCircle size={16} />
              Telegram
            </a>
            <Link
              href={`${base}/plugins`}
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border px-4 py-2 text-sm font-medium transition-colors hover:border-fd-primary/50 hover:text-fd-primary"
            >
              {r.cta.plugins}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function Legend({ icon: Icon, className, label }: { icon: typeof CheckCircle2; className: string; label: string }) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-muted/70 px-3 py-1 text-xs text-fd-muted-foreground">
      <Icon size={13} className={className} />
      {label}
    </li>
  )
}

function SectionTitle({
  id,
  icon: Icon,
  tone,
  title,
  body,
}: {
  id: string
  icon: typeof CheckCircle2
  tone: string
  title: string
  body: string
}) {
  return (
    <div className="mb-8">
      <h2 id={id} className="mb-2 flex items-center gap-2.5 text-2xl font-semibold tracking-tight md:text-3xl">
        <Icon size={22} className={tone} />
        {title}
      </h2>
      <p className="max-w-3xl text-fd-muted-foreground">{body}</p>
    </div>
  )
}

function TrackCard({ track, labels }: { track: Track; labels: ReturnType<typeof roadmap> }) {
  return (
    <article className="flex flex-col rounded-2xl border border-fd-border bg-fd-card/60 p-6">
      <header className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold tracking-tight">{labels.products[track.product]}</h3>
        <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-medium', productTone[track.product])}>
          {track.tagline}
        </span>
      </header>
      <div className="grid flex-1 gap-5 sm:grid-cols-2">
        <Lane title={labels.legend.now} icon={Loader} tone="text-sky-300" items={track.now} empty={track.nowNote ?? labels.laneEmpty} />
        <Lane
          title={labels.legend.next}
          icon={CircleDashed}
          tone="text-fd-muted-foreground"
          items={track.next}
          empty={labels.laneEmpty}
          ordered
        />
      </div>
    </article>
  )
}

function Lane({
  title,
  icon: Icon,
  tone,
  items,
  empty,
  ordered,
}: {
  title: string
  icon: typeof CheckCircle2
  tone: string
  items: Track['now']
  empty: string
  ordered?: boolean
}) {
  return (
    <div>
      <p className={cn('mb-3 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase', tone)}>
        <Icon size={13} />
        {title}
      </p>
      {items.length === 0 ? (
        <p className="text-sm text-fd-muted-foreground">{empty}</p>
      ) : (
        <ol className="space-y-2.5">
          {items.map((item, index) => (
            <li key={item.title} className="flex gap-2.5">
              <span
                aria-hidden
                className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold tabular-nums',
                  ordered ? 'bg-fd-secondary text-fd-muted-foreground' : 'bg-sky-500/15 text-sky-300',
                )}
              >
                {ordered ? index + 1 : '•'}
              </span>
              <div>
                <p className="text-sm font-medium text-fd-foreground">{item.title}</p>
                {item.body && <p className="text-xs leading-relaxed text-fd-muted-foreground">{item.body}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
