'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

/**
 * A code block with a copy button beside it, not on top of it: a long
 * command scrolls inside its own column and is never hidden under the button.
 */
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
    <div className="flex min-w-0 items-start gap-2 rounded-xl border border-fd-border bg-fd-background/80 py-1.5 pr-1.5 pl-4">
      <pre className="no-scrollbar min-w-0 flex-1 overflow-x-auto py-2.5 font-mono text-[13px] leading-relaxed text-fd-foreground">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? copiedLabel : label}
        title={copied ? copiedLabel : label}
        className="mt-1 shrink-0 cursor-pointer rounded-lg border border-fd-border bg-fd-card p-1.5 text-fd-muted-foreground transition-colors hover:border-fd-primary/50 hover:text-fd-foreground"
      >
        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
      </button>
    </div>
  )
}
