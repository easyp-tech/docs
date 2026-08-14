import { Globe, Layers, Lock } from 'lucide-react'
import { en } from '@/lib/home-copy'
import type { ReactNode } from 'react'

export function ArchitectureComparison() {
  const t = en.architecture

  const features = [
    {
      icon: Globe,
      title: t.dataSovereignty.title,
      descriptionHtml: t.dataSovereignty.description,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
      hoverBorder: 'hover:border-blue-500/30',
    },
    {
      icon: Layers,
      title: t.hybridRuntime.title,
      descriptionHtml: t.hybridRuntime.description,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-400',
      hoverBorder: 'hover:border-purple-500/30',
    },
    {
      icon: Lock,
      title: t.noVendorLock.title,
      descriptionHtml: t.noVendorLock.description,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      hoverBorder: 'hover:border-emerald-500/30',
    },
  ]

  const parseHtml = (text: string): ReactNode[] => {
    const parts = text.split(/(<strong>.*?<\/strong>)/g)
    return parts.map((part, index) => {
      if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
        return (
          <strong key={index} className="font-semibold text-fd-foreground">
            {part.replace(/<\/?strong>/g, '')}
          </strong>
        )
      }
      return part
    })
  }

  return (
    <section className="relative overflow-hidden bg-fd-muted/30 py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fd-primary/10 opacity-20 blur-[150px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center">
          <h2 className="mb-5 text-3xl font-bold tracking-tight text-fd-foreground md:text-5xl">
            {t.title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-fd-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={i}
                className={`glass-panel group rounded-2xl border border-fd-border p-8 transition-colors ${feature.hoverBorder}`}
              >
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${feature.iconBg} ${feature.iconColor} transition-transform group-hover:scale-110`}
                >
                  <Icon size={28} />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-fd-foreground">{feature.title}</h3>
                <p className="leading-relaxed text-fd-muted-foreground">
                  {parseHtml(feature.descriptionHtml)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
