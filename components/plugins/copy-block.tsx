'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

/** A code block with a copy button; `label` names it for screen readers. */
export function CopyBlock({ code, label, copiedLabel }: { code: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="group relative">
      <pre className="no-scrollbar overflow-x-auto rounded-xl border border-fd-border bg-fd-background/80 py-4 pr-12 pl-4 font-mono text-[13px] leading-relaxed text-fd-foreground">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? copiedLabel : label}
        title={copied ? copiedLabel : label}
        className="absolute top-2.5 right-2.5 cursor-pointer rounded-lg border border-fd-border bg-fd-card p-1.5 text-fd-muted-foreground opacity-80 transition hover:text-fd-foreground group-hover:opacity-100"
      >
        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
      </button>
    </div>
  )
}
