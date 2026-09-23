'use client'

import { use, useEffect, useId, useState } from 'react'

// Diagrams stay as ```mermaid text in the MDX source — readable in a diff, in
// llms.txt and on GitHub — and are drawn here in the browser. mermaid is heavy,
// so it is imported only on pages that contain a diagram.

const cache = new Map<string, Promise<unknown>>()

function cached<T>(key: string, create: () => Promise<T>): Promise<T> {
  let promise = cache.get(key)
  if (!promise) {
    promise = create()
    cache.set(key, promise)
  }
  return promise as Promise<T>
}

export function Mermaid({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Until the client renders, show the source rather than an empty gap.
  if (!mounted) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg border border-fd-border p-4 text-xs text-fd-muted-foreground">
        {chart}
      </pre>
    )
  }

  return <MermaidDiagram chart={chart} />
}

function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, '')
  const { default: mermaid } = use(cached('mermaid', () => import('mermaid')))

  // The site is dark-only, so the dark theme is the only one needed.
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'dark',
    fontFamily: 'inherit',
    themeVariables: {
      background: 'transparent',
      primaryColor: '#16213a',
      primaryBorderColor: '#3b82f6',
      primaryTextColor: '#e5e7eb',
      lineColor: '#94a3b8',
      clusterBkg: 'transparent',
      clusterBorder: '#334155',
    },
  })

  const { svg } = use(cached(`svg:${chart}`, () => mermaid.render(`mermaid-${id}`, chart)))

  return (
    <div
      className="my-6 flex justify-center overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
