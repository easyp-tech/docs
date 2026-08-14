'use client'

import { useState, useEffect, useRef } from 'react'
import { Shield, ChevronRight, ChevronDown, Copy, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { en } from '@/lib/home-copy'

interface InstallOption {
  id: string
  label: string
  fullLabel: string
  cmd: string
}

export function Hero({ version = 'vX.X.X' }: { version?: string }) {
  const t = en.hero
  const [installMethod, setInstallMethod] = useState('brew')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const installOptions: InstallOption[] = [
    { id: 'brew', label: 'brew', fullLabel: 'macOS (homebrew)', cmd: 'brew install easyp-tech/tap/easyp' },
    { id: 'go', label: 'go', fullLabel: 'go Install (any OS)', cmd: 'go install github.com/easyp-tech/easyp/cmd/easyp@latest' },
    { id: 'docker', label: 'docker', fullLabel: 'docker', cmd: 'docker pull easyp/easyp:latest' },
  ]

  const activeOption = installOptions.find((o) => o.id === installMethod) || installOptions[0]

  useEffect(() => {
    const platform = navigator.platform.toLowerCase()
    const userAgent = navigator.userAgent.toLowerCase()

    if (platform.includes('mac') || userAgent.includes('mac')) {
      setInstallMethod('brew')
    } else if (
      platform.includes('linux') ||
      userAgent.includes('linux') ||
      platform.includes('win') ||
      userAgent.includes('win')
    ) {
      setInstallMethod('go')
    } else {
      setInstallMethod('go')
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeOption.cmd)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="relative z-0 overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-fd-primary/20 opacity-40 blur-[120px] dark:opacity-30"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="relative z-10 mb-16 flex flex-col items-center text-center">
          <div className="animate-fade-in-up mb-8 flex gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-muted/80 px-3 py-1 text-xs font-medium text-fd-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fd-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-fd-primary" />
              </span>
              {version}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-muted/80 px-3 py-1 text-xs font-medium text-fd-muted-foreground">
              <Shield size={12} className="text-emerald-500 dark:text-emerald-400" />
              {t.badge.license}
            </div>
          </div>

          <h1 className="animate-fade-in-up mb-6 max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight text-fd-foreground [animation-delay:100ms] lg:text-7xl">
            {t.title} <br />
            <span className="text-gradient">{t.titleHighlight}</span>
          </h1>

          <p className="animate-fade-in-up mb-10 max-w-2xl text-lg leading-relaxed text-fd-muted-foreground [animation-delay:200ms]">
            {t.subtitle}
          </p>

          <div className="animate-fade-in-up relative flex w-full max-w-2xl flex-col items-center justify-center gap-4 [animation-delay:300ms] sm:flex-row">
            <div className="group relative w-full flex-grow sm:w-auto" ref={dropdownRef}>
              <div className="flex w-full items-center rounded-xl border border-fd-border bg-fd-card px-1 py-1 pr-2 shadow-xl transition-colors group-hover:border-fd-primary/40">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="mr-2 flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border-r border-fd-border px-3 py-2 text-sm font-medium text-fd-muted-foreground transition-all hover:bg-fd-accent hover:text-fd-accent-foreground"
                  title="Select installation method"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="listbox"
                >
                  <span>{activeOption.label}</span>
                  <ChevronDown
                    size={14}
                    className={`text-fd-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <div className="flex flex-grow items-center overflow-hidden">
                  <ChevronRight size={14} className="mr-2 shrink-0 text-fd-muted-foreground" />
                  <code className="no-scrollbar block overflow-x-auto whitespace-nowrap font-mono text-sm text-fd-foreground selection:bg-fd-primary/30 selection:text-fd-foreground">
                    {activeOption.cmd}
                  </code>
                </div>

                <button
                  type="button"
                  className="ml-2 shrink-0 cursor-pointer rounded-lg p-2 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
                  title={copied ? 'Copied' : 'Copy to clipboard'}
                  aria-label={copied ? 'Copied' : 'Copy to clipboard'}
                  onClick={handleCopy}
                >
                  {copied ? (
                    <CheckCircle size={16} className="text-emerald-500 dark:text-emerald-400" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
                <span className="sr-only" aria-live="polite">
                  {copied ? 'Command copied to clipboard' : ''}
                </span>
              </div>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 z-30 mt-2 w-64 overflow-hidden rounded-xl border border-fd-border bg-fd-popover shadow-2xl">
                  <div className="py-1">
                    {installOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => {
                          setInstallMethod(opt.id)
                          setIsDropdownOpen(false)
                        }}
                        className={`group flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                          installMethod === opt.id
                            ? 'bg-fd-primary/10'
                            : 'hover:bg-fd-accent'
                        }`}
                      >
                        <span
                          className={
                            installMethod === opt.id
                              ? 'font-medium text-fd-primary'
                              : 'text-fd-muted-foreground group-hover:text-fd-accent-foreground'
                          }
                        >
                          {opt.fullLabel}
                        </span>
                        {installMethod === opt.id && (
                          <CheckCircle size={16} className="text-fd-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/docs"
              className="inline-block w-full whitespace-nowrap rounded-full border border-fd-primary/20 bg-fd-primary/10 px-6 py-3 text-center font-medium text-fd-primary transition-colors hover:bg-fd-primary/20 sm:w-auto"
            >
              {t.exploreDocs}
            </Link>
          </div>
        </div>

        {/* Terminal mock — slightly darker surface in both themes */}
        <div className="animate-fade-in-up relative mx-auto max-w-5xl overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-2xl shadow-fd-primary/10 [animation-delay:500ms] dark:bg-fd-background/80">
          <div className="flex items-center gap-2 border-b border-fd-border bg-fd-muted/50 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-fd-border" />
            <div className="h-3 w-3 rounded-full bg-fd-border" />
            <div className="h-3 w-3 rounded-full bg-fd-border" />
            <div className="ml-4 font-mono text-xs text-fd-muted-foreground">easyp — zsh</div>
          </div>
          <div className="p-6 font-mono text-sm leading-loose sm:p-10 sm:text-base">
            <div className="flex items-start gap-2">
              <span className="font-bold text-fd-primary">➜</span>
              <span className="text-fd-foreground">easyp generate -v</span>
            </div>
            <div className="mt-2 border-l-2 border-fd-border pl-4 text-fd-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 dark:text-emerald-400">✔</span>
                <span>
                  Resolving dependencies from{' '}
                  <span className="text-fd-foreground underline decoration-fd-border">
                    easyp.lock
                  </span>
                  ...
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-emerald-500 dark:text-emerald-400">✔</span>
                <span>
                  Connecting to EasyP Service...{' '}
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                    Connected
                  </span>
                </span>
              </div>
              <div className="mt-2">
                <span className="text-blue-600 dark:text-blue-400">[INFO]</span> Dispatching
                plugins:
                <div className="mt-1 pl-4 text-fd-muted-foreground">
                  ├─ protoc-gen-go (v1.31){' '}
                  <span className="rounded border border-fd-border px-1 text-xs text-fd-muted-foreground">
                    WASM
                  </span>
                  <br />
                  └─ custom-java-gen (v2.0){' '}
                  <span className="rounded border border-fd-border px-1 text-xs text-fd-muted-foreground">
                    DOCKER
                  </span>
                </div>
              </div>
              <div className="mt-2 text-fd-foreground">
                ✨ Generation complete in <span className="text-fd-primary">420ms</span>.
              </div>
            </div>
            <div className="mt-4 flex animate-pulse items-start gap-2">
              <span className="font-bold text-fd-primary">➜</span>
              <span className="inline-block h-5 w-2 bg-fd-muted-foreground align-middle" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
