'use client'

import { useState } from 'react'
import { Package, CheckCircle, Shield, Box } from 'lucide-react'
import { en } from '@/lib/home-copy'

export function FeatureSwitcher() {
  const t = en.features
  const [activeTab, setActiveTab] = useState('cli')

  return (
    <section id="features" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-fd-foreground md:text-4xl">
            {t.title} <span className="text-fd-primary">{t.titleHighlight}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-fd-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="relative z-10 mb-16 flex justify-center">
          <div
            role="tablist"
            aria-label="Product modes"
            className="inline-flex rounded-full border border-fd-border bg-fd-muted p-1.5 shadow-inner"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'cli'}
              onClick={() => setActiveTab('cli')}
              className={`cursor-pointer rounded-full px-8 py-2.5 text-sm font-medium transition-all duration-300 ${
                activeTab === 'cli'
                  ? 'bg-fd-primary text-fd-primary-foreground shadow-lg'
                  : 'text-fd-muted-foreground hover:text-fd-foreground'
              }`}
            >
              {t.localDev}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'server'}
              onClick={() => setActiveTab('server')}
              className={`cursor-pointer rounded-full px-8 py-2.5 text-sm font-medium transition-all duration-300 ${
                activeTab === 'server'
                  ? 'bg-fd-primary text-fd-primary-foreground shadow-lg'
                  : 'text-fd-muted-foreground hover:text-fd-foreground'
              }`}
            >
              {t.remoteInfra}
            </button>
          </div>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="min-h-[300px] space-y-8">
            {activeTab === 'cli' ? (
              <div className="animate-fade-in-up">
                <h3 className="mb-4 text-2xl font-semibold tracking-tight text-fd-foreground">
                  {t.cli.title}
                </h3>
                <p className="mb-8 text-lg leading-relaxed text-fd-muted-foreground">
                  {t.cli.description}
                </p>
                <ul className="space-y-4">
                  {(
                    [
                      [Package, t.cli.packageManager],
                      [CheckCircle, t.cli.linting],
                      [CheckCircle, t.cli.apiSafety],
                    ] as const
                  ).map(([Icon, item], i) => (
                    <li key={i} className="flex gap-4">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fd-primary/10 text-fd-primary">
                        <Icon size={14} />
                      </div>
                      <div>
                        <h4 className="font-medium text-fd-foreground">{item.title}</h4>
                        <p className="text-sm text-fd-muted-foreground">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="animate-fade-in-up">
                <h3 className="mb-4 text-2xl font-semibold tracking-tight text-fd-foreground">
                  {t.server.title}
                </h3>
                <p className="mb-8 text-lg leading-relaxed text-fd-muted-foreground">
                  {t.server.description}
                </p>
                <ul className="space-y-4">
                  {(
                    [
                      t.server.dockerNative,
                      t.server.airGap,
                      t.server.costEffective,
                    ] as const
                  ).map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400">
                        <Shield size={14} />
                      </div>
                      <div>
                        <h4 className="font-medium text-fd-foreground">{item.title}</h4>
                        <p className="text-sm text-fd-muted-foreground">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="group relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 opacity-20 blur transition duration-1000 group-hover:opacity-40 group-hover:duration-200"
            />
            <div className="relative flex h-[400px] flex-col overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-2xl">
              <div className="flex items-center gap-2 border-b border-fd-border bg-fd-muted/50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-fd-border" />
                <div className="h-3 w-3 rounded-full bg-fd-border" />
              </div>
              <div className="flex-grow overflow-hidden p-6 font-mono text-sm">
                {activeTab === 'cli' ? (
                  <div className="animate-fade-in-up space-y-2">
                    <div className="text-fd-muted-foreground"># easyp.yaml configuration</div>
                    <div className="text-purple-600 dark:text-purple-400">
                      version: <span className="text-emerald-600 dark:text-green-400">v1</span>
                    </div>
                    <div className="text-purple-600 dark:text-purple-400">deps:</div>
                    <div className="pl-4 text-fd-foreground">
                      - github.com/googleapis/googleapis@v1.0
                    </div>
                    <div className="mt-2 text-purple-600 dark:text-purple-400">lint:</div>
                    <div className="pl-4 text-blue-600 dark:text-blue-400">use:</div>
                    <div className="pl-8 text-fd-foreground">- STANDARD</div>
                    <div className="pl-8 text-fd-foreground">- COMMENTS</div>
                    <div className="mt-4 text-purple-600 dark:text-purple-400">breaking:</div>
                    <div className="pl-4 text-blue-600 dark:text-blue-400">ignore:</div>
                    <div className="pl-8 text-fd-foreground">- &quot;proto/alfa/v1&quot;</div>
                  </div>
                ) : (
                  <div className="animate-fade-in-up space-y-2">
                    <div className="text-fd-muted-foreground"># Server Infrastructure</div>
                    <div className="flex items-center gap-2 border-b border-fd-border/50 py-2">
                      <Box size={16} className="text-blue-600 dark:text-blue-400" />
                      <span className="text-fd-foreground">EasyP Service</span>
                      <span className="ml-auto rounded-full bg-emerald-500/10 px-2 text-xs text-emerald-600 dark:text-green-500">
                        Healthy
                      </span>
                    </div>
                    <div className="mt-3 space-y-3 border-l border-fd-border pl-4">
                      {[
                        ['Registry:', 'Local Docker'],
                        ['Plugins:', '14 Loaded'],
                        ['Uptime:', '42d 12h'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-fd-muted-foreground" />
                          <span className="text-fd-muted-foreground">{k}</span>
                          <span className="text-fd-foreground">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
