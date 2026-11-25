'use client'

import { useEffect } from 'react'
import { siteHost, track, umamiHost, umamiWebsiteId } from '@/lib/analytics'

/**
 * Clicks on elements fumadocs renders for us (code block copy, search, page
 * actions) and on links that leave the site. Our own components call
 * `track` directly. Mounted once in the root layout: I18nRootProvider is
 * mounted twice, a listener there would count every click twice.
 */
function onClick(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Element)) return

  const codeCopy = target.closest('figure.shiki button[aria-label]')
  if (codeCopy) {
    // After a copy the button shows "Copied" for a while; clicks then are not new copies.
    if (!codeCopy.hasAttribute('data-checked')) track('copy-code')
    return
  }

  if (target.closest('button[data-search], button[data-search-full]')) {
    track('search-open')
    return
  }

  // MarkdownCopyButton; the popover trigger next to it has aria-expanded.
  const pageAction = target.closest('[data-page-actions] button')
  if (pageAction) {
    if (!pageAction.hasAttribute('aria-expanded')) track('docs-action', { action: 'copy-markdown' })
    return
  }

  const link = target.closest('a[href]')
  if (!(link instanceof HTMLAnchorElement)) return
  let url: URL
  try {
    url = new URL(link.href, window.location.href)
  } catch {
    return
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return

  if (url.host === window.location.host) {
    if (url.pathname.startsWith('/llms.mdx/')) track('docs-action', { action: 'view-markdown' })
    return
  }

  // Query strings are dropped: the "Open in ChatGPT/Claude" links carry the page as a prompt.
  const href = `${url.host}${url.pathname}`.slice(0, 200)
  if (url.host === 'github.com' && url.pathname.startsWith('/easyp-tech/')) {
    track('outbound-github', { href })
  } else {
    track('outbound', { host: url.host, href })
  }
}

/**
 * Session replays and heatmaps (settings live on the website in Umami:
 * masking, sample rate). Unlike u.js, recorder.js ignores data-domains, so it
 * is only added on the real site.
 */
function loadRecorder() {
  if (window.location.hostname !== siteHost) return
  if (document.querySelector('script[data-umami-recorder]')) return
  // The opt-out from /privacy; u.js honours it itself, recorder.js does not.
  try {
    if (window.localStorage.getItem('umami.disabled')) return
  } catch {
    // Storage blocked: carry on, u.js decides for itself.
  }
  const script = document.createElement('script')
  script.src = `${umamiHost}/recorder.js`
  script.defer = true
  script.dataset.websiteId = umamiWebsiteId
  script.dataset.umamiRecorder = ''
  document.body.appendChild(script)
}

export function Analytics() {
  useEffect(() => {
    loadRecorder()
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])
  return null
}
