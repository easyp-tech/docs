'use client'

import { useEffect, useState } from 'react'

/** Umami's own opt-out flag: u.js checks it on every event, Analytics checks it before loading the recorder. */
const key = 'umami.disabled'

export function OptOut({
  labels,
}: {
  labels: { off: string; on: string; disabled: string; enabled: string }
}) {
  const [disabled, setDisabled] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      setDisabled(Boolean(window.localStorage.getItem(key)))
    } catch {
      setDisabled(null)
    }
  }, [])

  const toggle = () => {
    try {
      if (disabled) window.localStorage.removeItem(key)
      else window.localStorage.setItem(key, '1')
      setDisabled(!disabled)
    } catch {
      // Storage is blocked; nothing to remember the choice in.
    }
  }

  if (disabled === null) return null

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={toggle}
        className="cursor-pointer rounded-lg border border-fd-border px-4 py-2 text-sm font-medium transition-colors hover:border-fd-primary/50 hover:text-fd-primary"
      >
        {disabled ? labels.on : labels.off}
      </button>
      <span className="text-sm text-fd-muted-foreground" aria-live="polite">
        {disabled ? labels.disabled : labels.enabled}
      </span>
    </div>
  )
}
